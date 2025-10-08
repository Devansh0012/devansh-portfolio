import { NextResponse } from "next/server";
import vm from "node:vm";
import { spawn } from "node:child_process";
import { writeFileSync, unlinkSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { z } from "zod";
import { getChallengeById } from "@/lib/challenges";
import { addLeaderboardEntry, getLeaderboard } from "@/lib/leaderboard";

const requestSchema = z.object({
  challengeId: z.string(),
  code: z.string().min(20).max(8000),
  handle: z.string().min(2).max(40),
  language: z.enum(["typescript", "javascript", "python", "java", "cpp", "c", "go", "rust", "php", "ruby"]).default("typescript"),
});

type TestResult = {
  name: string;
  passed: boolean;
  received: unknown;
  expected: unknown;
  error?: string;
};

type SupportedLanguage = "typescript" | "javascript" | "python" | "java" | "cpp" | "c" | "go" | "rust" | "php" | "ruby";

// Language execution configurations
const LANGUAGE_CONFIGS: Record<SupportedLanguage, {
  extension: string;
  executeCommand: (filePath: string, tempDir: string) => string[];
  functionWrapper: (code: string, functionName: string, testInputs: unknown[]) => string;
  timeout: number;
}> = {
  typescript: {
    extension: '.ts',
    executeCommand: (filePath: string) => ['npx', 'tsx', filePath],
    functionWrapper: (code: string, functionName: string, testInputs: unknown[]) => {
      const strippedCode = stripTypeScript(code).replace(/export\s+/, '');
      return `
${strippedCode}

// Test execution
const inputs = ${JSON.stringify(testInputs)};
const result = ${functionName}(...inputs);
console.log(JSON.stringify(result));
      `;
    },
    timeout: 10000
  },
  javascript: {
    extension: '.js',
    executeCommand: (filePath: string) => ['node', filePath],
    functionWrapper: (code: string, functionName: string, testInputs: unknown[]) => {
      const cleanCode = code.replace(/export\s+/, '');
      return `
${cleanCode}

// Test execution
const inputs = ${JSON.stringify(testInputs)};
const result = ${functionName}(...inputs);
console.log(JSON.stringify(result));
      `;
    },
    timeout: 10000
  },
  python: {
    extension: '.py',
    executeCommand: (filePath: string) => ['python3', filePath],
    functionWrapper: (code: string, functionName: string, testInputs: unknown[]) => `
import json

${code}

# Test execution
inputs = ${JSON.stringify(testInputs)}
result = ${functionName}(*inputs)
print(json.dumps(result))
    `,
    timeout: 10000
  },
  java: {
    extension: '.java',
    executeCommand: (filePath: string, tempDir: string) => {
      // Java requires compilation first
      const className = 'Solution';
      return ['sh', '-c', `cd ${tempDir} && javac ${className}.java && java ${className}`];
    },
    functionWrapper: (code: string, functionName: string, testInputs: unknown[]) => `
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

public class Solution {
    ${code.replace(/public\s+class\s+\w+\s*{/, '').replace(/}$/, '')}
    
    public static void main(String[] args) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        Object[] inputs = ${JSON.stringify(testInputs)};
        // Note: This is simplified - real implementation would need proper type conversion
        Object result = ${functionName}(inputs);
        System.out.println(mapper.writeValueAsString(result));
    }
}
    `,
    timeout: 15000
  },
  cpp: {
    extension: '.cpp',
    executeCommand: (filePath: string, tempDir: string) => [
      'sh', '-c', 
      `cd ${tempDir} && g++ -o solution ${filePath} && ./solution`
    ],
    functionWrapper: (code: string, functionName: string, testInputs: unknown[]) => `
#include <iostream>
#include <string>
#include <vector>
using namespace std;

${code}

int main() {
    // Note: This is simplified - real implementation would need proper JSON parsing
    auto inputs = vector<int>{${testInputs.map(String).join(', ')}};
    auto result = ${functionName}(inputs);
    cout << result << endl;
    return 0;
}
    `,
    timeout: 15000
  },
  c: {
    extension: '.c',
    executeCommand: (filePath: string, tempDir: string) => [
      'sh', '-c', 
      `cd ${tempDir} && gcc -o solution ${filePath} && ./solution`
    ],
    functionWrapper: () => `
#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("C execution not fully implemented yet\\n");
    return 0;
}
    `,
    timeout: 15000
  },
  go: {
    extension: '.go',
    executeCommand: (filePath: string) => ['go', 'run', filePath],
    functionWrapper: (code: string, functionName: string, testInputs: unknown[]) => `
package main

import (
    "encoding/json"
    "fmt"
)

${code}

func main() {
    inputs := []interface{}{${testInputs.map(i => JSON.stringify(i)).join(', ')}}
    result := ${functionName}(inputs...)
    jsonResult, _ := json.Marshal(result)
    fmt.Println(string(jsonResult))
}
    `,
    timeout: 10000
  },
  rust: {
    extension: '.rs',
    executeCommand: (filePath: string) => ['rustc', '--out-dir', '/tmp', filePath, '&&', '/tmp/solution'],
    functionWrapper: () => `
fn main() {
    println!("Rust execution not fully implemented yet");
}
    `,
    timeout: 15000
  },
  php: {
    extension: '.php',
    executeCommand: (filePath: string) => ['php', filePath],
    functionWrapper: (code: string, functionName: string, testInputs: unknown[]) => `
<?php
${code}

$inputs = ${JSON.stringify(testInputs)};
$result = ${functionName}(...$inputs);
echo json_encode($result);
?>
    `,
    timeout: 10000
  },
  ruby: {
    extension: '.rb',
    executeCommand: (filePath: string) => ['ruby', filePath],
    functionWrapper: (code: string, functionName: string, testInputs: unknown[]) => `
require 'json'

${code}

inputs = ${JSON.stringify(testInputs)}
result = ${functionName}(*inputs)
puts result.to_json
    `,
    timeout: 10000
  }
};

// Function to execute code in different languages
async function executeCodeInLanguage(
  code: string, 
  language: SupportedLanguage, 
  functionName: string, 
  testInputs: unknown[]
): Promise<{ result: unknown; error?: string }> {
  const config = LANGUAGE_CONFIGS[language];
  
  // For JavaScript/TypeScript, use VM for security
  if (language === 'javascript' || language === 'typescript') {
    try {
      const wrappedCode = config.functionWrapper(code, functionName, testInputs);
      const sandbox = { 
        console: { log: () => undefined },
        JSON,
        Math,
        String,
        Number,
        Array,
        Object
      };
      const context = vm.createContext(sandbox);
      
      const script = new vm.Script(`
        ${wrappedCode.replace('console.log(JSON.stringify(result));', 'globalThis.__result = result;')}
      `);
      
      script.runInContext(context, { timeout: 5000 });
      return { result: (context as { __result?: unknown }).__result };
    } catch (error) {
      return { result: null, error: String(error) };
    }
  }
  
  // For other languages, use child processes (simplified implementation)
  return new Promise((resolve) => {
    const tempDir = mkdtempSync(join(tmpdir(), 'arena-'));
    const fileName = `solution${config.extension}`;
    const filePath = join(tempDir, fileName);
    
    try {
      const wrappedCode = config.functionWrapper(code, functionName, testInputs);
      writeFileSync(filePath, wrappedCode);
      
      const [command, ...args] = config.executeCommand(filePath, tempDir);
      const child = spawn(command, args, {
        cwd: tempDir,
        timeout: config.timeout
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        try {
          unlinkSync(filePath);
        } catch {
          // Ignore cleanup errors
        }
        
        if (code !== 0) {
          resolve({ result: null, error: stderr || 'Execution failed' });
          return;
        }
        
        try {
          const result = JSON.parse(stdout.trim());
          resolve({ result });
        } catch {
          resolve({ result: null, error: 'Invalid output format' });
        }
      });
      
      child.on('error', (error) => {
        resolve({ result: null, error: String(error) });
      });
      
    } catch (error) {
      resolve({ result: null, error: String(error) });
    }
  });
}
function stripTypeScript(code: string): string {
  let jsCode = code;
  
  // Simple approach: just remove type annotations from function parameters
  // Match function declarations with typed parameters
  jsCode = jsCode.replace(
    /function\s+(\w+)\s*\(([^)]*)\)/g,
    (match: string, funcName: string, params: string) => {
      // Clean up parameters by removing type annotations
      const cleanParams = params
        .split(',')
        .map((param: string) => param.trim().split(':')[0].trim())
        .filter((param: string) => param.length > 0)
        .join(', ');
      return `function ${funcName}(${cleanParams})`;
    }
  );
  
  // Also handle arrow functions with types (if any)
  jsCode = jsCode.replace(
    /\(([^)]*)\)\s*:\s*[^{]+\s*=>/g,
    (match: string, params: string) => {
      const cleanParams = params
        .split(',')
        .map((param: string) => param.trim().split(':')[0].trim())
        .filter((param: string) => param.length > 0)
        .join(', ');
      return `(${cleanParams}) =>`;
    }
  );
  
  return jsCode;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parseResult = requestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parseResult.error.flatten() },
      { status: 400 },
    );
  }

  const { challengeId, code, handle, language } = parseResult.data;
  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  // Check if language is supported for execution
  if (!LANGUAGE_CONFIGS[language]) {
    return NextResponse.json({ 
      error: `Language ${language} is not supported for execution yet`,
      hint: "Currently supported: JavaScript, TypeScript, Python, PHP, Ruby"
    }, { status: 400 });
  }

  const tests = challenge.tests;
  const results: TestResult[] = [];
  const start = Date.now();

  let passedCount = 0;
  for (const test of tests) {
    try {
      const { result, error } = await executeCodeInLanguage(
        code, 
        language, 
        challenge.functionName, 
        test.input
      );
      
      if (error) {
        results.push({
          name: test.name,
          passed: false,
          received: null,
          expected: test.expected,
          error: error,
        });
        continue;
      }
      
      const passed = deepEqual(result, test.expected);
      if (passed) {
        passedCount += 1;
      }
      results.push({ 
        name: test.name, 
        passed, 
        received: result, 
        expected: test.expected 
      });
    } catch (error) {
      results.push({
        name: test.name,
        passed: false,
        received: null,
        expected: test.expected,
        error: String(error),
      });
    }
  }

  const total = tests.length;
  const runtimeMs = Date.now() - start;
  const score = Math.round((passedCount / total) * 100);

  let leaderboard = getLeaderboard();
  if (passedCount === total) {
    leaderboard = addLeaderboardEntry({
      challenge,
      handle,
      score,
      testsPassed: passedCount,
      totalTests: total,
      runtimeMs,
    });
  }

  return NextResponse.json({
    summary: {
      passed: passedCount === total,
      testsPassed: passedCount,
      totalTests: total,
      score,
      runtimeMs,
    },
    results,
    leaderboard,
  });
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => deepEqual(value, b[index]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const entriesA = Object.entries(a as Record<string, unknown>);
    const entriesB = Object.entries(b as Record<string, unknown>);
    if (entriesA.length !== entriesB.length) return false;
    return entriesA.every(([key, value]) => deepEqual(value, (b as Record<string, unknown>)[key]));
  }

  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 1e-6;
  }

  return false;
}
