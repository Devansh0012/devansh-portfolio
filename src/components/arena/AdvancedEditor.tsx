"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { 
  Play, 
  Copy, 
  RotateCcw, 
  Settings, 
  Maximize2, 
  Minimize2,
  Download,
  Upload
} from "lucide-react";
import type { editor } from "monaco-editor";
import type { EditorProps } from "@monaco-editor/react";

const MonacoEditor = dynamic<EditorProps>(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
);

export type SupportedLanguage = 
  | "typescript" 
  | "javascript" 
  | "python" 
  | "java" 
  | "cpp" 
  | "c" 
  | "go" 
  | "rust" 
  | "php" 
  | "ruby"
  | "json"
  | "html"
  | "css";

export type EditorTheme = "vs-dark" | "vs-light" | "hc-black";

export interface AdvancedEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  onRun?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

const LANGUAGE_CONFIGS: Record<SupportedLanguage, {
  label: string;
  monaco: string;
  extension: string;
  defaultCode: string;
}> = {
  typescript: {
    label: "TypeScript",
    monaco: "typescript",
    extension: ".ts",
    defaultCode: `// TypeScript
function solution(): string {
  return "Hello, World!";
}

export default solution;`
  },
  javascript: {
    label: "JavaScript", 
    monaco: "javascript",
    extension: ".js",
    defaultCode: `// JavaScript
function solution() {
  return "Hello, World!";
}

module.exports = solution;`
  },
  python: {
    label: "Python",
    monaco: "python", 
    extension: ".py",
    defaultCode: `# Python
def solution():
    return "Hello, World!"

if __name__ == "__main__":
    print(solution())`
  },
  java: {
    label: "Java",
    monaco: "java",
    extension: ".java", 
    defaultCode: `// Java
public class Solution {
    public static String solution() {
        return "Hello, World!";
    }
    
    public static void main(String[] args) {
        System.out.println(solution());
    }
}`
  },
  cpp: {
    label: "C++",
    monaco: "cpp",
    extension: ".cpp",
    defaultCode: `// C++
#include <iostream>
#include <string>

std::string solution() {
    return "Hello, World!";
}

int main() {
    std::cout << solution() << std::endl;
    return 0;
}`
  },
  c: {
    label: "C",
    monaco: "c", 
    extension: ".c",
    defaultCode: `// C
#include <stdio.h>

const char* solution() {
    return "Hello, World!";
}

int main() {
    printf("%s\\n", solution());
    return 0;
}`
  },
  go: {
    label: "Go",
    monaco: "go",
    extension: ".go",
    defaultCode: `// Go
package main

import "fmt"

func solution() string {
    return "Hello, World!"
}

func main() {
    fmt.Println(solution())
}`
  },
  rust: {
    label: "Rust",
    monaco: "rust",
    extension: ".rs", 
    defaultCode: `// Rust
fn solution() -> String {
    "Hello, World!".to_string()
}

fn main() {
    println!("{}", solution());
}`
  },
  php: {
    label: "PHP",
    monaco: "php",
    extension: ".php",
    defaultCode: `<?php
// PHP
function solution() {
    return "Hello, World!";
}

echo solution();
?>`
  },
  ruby: {
    label: "Ruby",
    monaco: "ruby",
    extension: ".rb",
    defaultCode: `# Ruby
def solution
  "Hello, World!"
end

puts solution`
  },
  json: {
    label: "JSON",
    monaco: "json",
    extension: ".json",
    defaultCode: `{
  "message": "Hello, World!",
  "language": "json"
}`
  },
  html: {
    label: "HTML",
    monaco: "html",
    extension: ".html",
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`
  },
  css: {
    label: "CSS",
    monaco: "css",
    extension: ".css",
    defaultCode: `/* CSS */
body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 2rem;
}

h1 {
    font-size: 2.5rem;
    margin: 0;
}`
  }
};

const THEMES: Record<EditorTheme, { label: string; icon: string }> = {
  "vs-dark": { label: "Dark+", icon: "🌙" },
  "vs-light": { label: "Light+", icon: "☀️" }, 
  "hc-black": { label: "High Contrast", icon: "⚫" }
};

export default function AdvancedEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  onRun,
  placeholder,
  isLoading = false,
  className = ""
}: AdvancedEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [theme, setTheme] = useState<EditorTheme>("vs-dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('off');
  const [minimap, setMinimap] = useState(false);
  const [showLanguageConfirmation, setShowLanguageConfirmation] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<SupportedLanguage | null>(null);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  // Initialize with template code if value is empty
  useEffect(() => {
    if (!value.trim()) {
      onChange(LANGUAGE_CONFIGS[language].defaultCode);
    }
  }, [language, onChange, value]);

  // Handle language change with smart template switching
  const handleLanguageChange = useCallback((newLanguage: SupportedLanguage) => {
    const currentLangConfig = LANGUAGE_CONFIGS[language];
    const newLangConfig = LANGUAGE_CONFIGS[newLanguage];
    
    // Check if current code is just a template or empty
    const isEmptyOrTemplate = !value.trim() || 
      value.trim() === currentLangConfig.defaultCode.trim();
    
    // If the code has been modified from template, ask user
    if (!isEmptyOrTemplate && value.trim() !== "") {
      setPendingLanguage(newLanguage);
      setShowLanguageConfirmation(true);
    } else {
      // Auto-switch for empty or template code
      onChange(newLangConfig.defaultCode);
      onLanguageChange(newLanguage);
    }
  }, [language, value, onChange, onLanguageChange]);

  const handleConfirmLanguageChange = useCallback(() => {
    if (pendingLanguage) {
      const newLangConfig = LANGUAGE_CONFIGS[pendingLanguage];
      onChange(newLangConfig.defaultCode);
      onLanguageChange(pendingLanguage);
      setShowLanguageConfirmation(false);
      setPendingLanguage(null);
    }
  }, [pendingLanguage, onChange, onLanguageChange]);

  const handleCancelLanguageChange = useCallback(() => {
    setShowLanguageConfirmation(false);
    setPendingLanguage(null);
  }, []);

  // Update code when language changes (if current code is empty or matches a template)
  useEffect(() => {
    const currentLangConfig = LANGUAGE_CONFIGS[language];
    const isEmptyOrTemplate = !value.trim() || 
      Object.values(LANGUAGE_CONFIGS).some(config => 
        value.trim() === config.defaultCode.trim()
      );
    
    if (isEmptyOrTemplate) {
      onChange(currentLangConfig.defaultCode);
    }
  }, [language, value, onChange]);

  const handleEditorDidMount = useCallback((editor: editor.IStandaloneCodeEditor, monaco: { KeyMod: { CtrlCmd: number }; KeyCode: { KeyS: number; Enter: number } }) => {
    editorRef.current = editor;
    
    // Add VS Code keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Prevent default save, could trigger custom save logic
      console.log("Save triggered");
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun?.();
    });
    
    // Focus the editor
    editor.focus();
  }, [onRun]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [value]);

  const handleReset = useCallback(() => {
    setShowResetConfirmation(true);
  }, []);

  const handleConfirmReset = useCallback(() => {
    const defaultCode = LANGUAGE_CONFIGS[language].defaultCode;
    onChange(defaultCode);
    setShowResetConfirmation(false);
  }, [language, onChange]);

  const handleCancelReset = useCallback(() => {
    setShowResetConfirmation(false);
  }, []);

  const handleDownload = useCallback(() => {
    const config = LANGUAGE_CONFIGS[language];
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solution${config.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [value, language]);

  const handleUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".ts,.js,.py,.java,.cpp,.c,.go,.rs,.php,.rb,.json,.html,.css";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onChange(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [onChange]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Update editor options when settings change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize,
        tabSize,
        wordWrap,
        minimap: { enabled: minimap }
      });
    }
  }, [fontSize, tabSize, wordWrap, minimap]);

  return (
    <div className={`glass-card relative overflow-hidden rounded-2xl ${isFullscreen ? 'fixed inset-4 z-50' : ''} ${className}`}>
      {/* Editor Header */}
      <div className="glass border-b border-slate-500/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
              className="glass-card rounded-lg border border-slate-500/30 px-3 py-1.5 text-sm text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              aria-label="Select programming language"
            >
              {Object.entries(LANGUAGE_CONFIGS).map(([key, config]) => (
                <option key={key} value={key} className="bg-slate-800 text-slate-100">
                  {config.label}
                </option>
              ))}
            </select>

            {/* Theme Selector */}
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as EditorTheme)}
              className="glass-card rounded-lg border border-slate-500/30 px-3 py-1.5 text-sm text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              aria-label="Select editor theme"
            >
              {Object.entries(THEMES).map(([key, config]) => (
                <option key={key} value={key} className="bg-slate-800 text-slate-100">
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* Action Buttons */}
            <button
              onClick={handleCopy}
              className="glass-hover rounded-lg p-2 text-slate-300 transition-colors hover:text-blue-400"
              title="Copy code (Ctrl+C)"
            >
              <Copy className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleUpload}
              className="glass-hover rounded-lg p-2 text-slate-300 transition-colors hover:text-blue-400"
              title="Upload file"
            >
              <Upload className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className="glass-hover rounded-lg p-2 text-slate-300 transition-colors hover:text-blue-400"
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleReset}
              className="glass-hover rounded-lg p-2 text-slate-300 transition-colors hover:text-yellow-400"
              title="Reset to template"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="glass-hover rounded-lg p-2 text-slate-300 transition-colors hover:text-blue-400"
              title="Editor settings"
            >
              <Settings className="h-4 w-4" />
            </button>

            {onRun && (
              <button
                onClick={onRun}
                disabled={isLoading}
                className="glass-card glass-hover inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                title="Run code (Ctrl+Enter)"
              >
                <Play className="h-4 w-4" />
                {isLoading ? "Running..." : "Run"}
              </button>
            )}

            <button
              onClick={toggleFullscreen}
              className="glass-hover rounded-lg p-2 text-slate-300 transition-colors hover:text-blue-400"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="glass-card mt-3 rounded-lg border border-slate-500/20 p-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">Font Size</label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                  aria-label="Font size"
                />
                <span className="text-xs text-slate-400">{fontSize}px</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-300">Tab Size</label>
                <select
                  value={tabSize}
                  onChange={(e) => setTabSize(Number(e.target.value))}
                  className="w-full rounded border border-slate-500/30 bg-slate-700 px-2 py-1 text-xs text-slate-100"
                  aria-label="Tab size"
                >
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-300">Word Wrap</label>
                <select
                  value={wordWrap}
                  onChange={(e) => setWordWrap(e.target.value as 'on' | 'off')}
                  className="w-full rounded border border-slate-500/30 bg-slate-700 px-2 py-1 text-xs text-slate-100"
                  aria-label="Word wrap setting"
                >
                  <option value="off">Off</option>
                  <option value="on">On</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={minimap}
                    onChange={(e) => setMinimap(e.target.checked)}
                    className="rounded border-slate-500/30"
                  />
                  Minimap
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="relative">
        <MonacoEditor
          height={isFullscreen ? "calc(100vh - 200px)" : "500px"}
          language={LANGUAGE_CONFIGS[language].monaco}
          theme={theme}
          value={value}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex h-[500px] items-center justify-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          }
          options={{
            fontSize,
            tabSize,
            wordWrap,
            minimap: { enabled: minimap },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            contextmenu: true,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            hover: { enabled: true },
            folding: true,
            foldingHighlight: true,
            unfoldOnClickAfterEndOfLine: true,
            colorDecorators: true,
            codeLens: true,
            links: true
          }}
        />
        
        {placeholder && !value && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-500 text-sm">{placeholder}</p>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="glass border-t border-slate-500/20 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>{LANGUAGE_CONFIGS[language].label}</span>
            <span>UTF-8</span>
            <span>LF</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{value.split('\n').length} lines</span>
            <span>{value.length} chars</span>
          </div>
        </div>
      </div>

      {/* Language Change Confirmation Modal */}
      {showLanguageConfirmation && pendingLanguage && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card bg-slate-800/90 border border-slate-500/30 rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <span className="text-amber-400 text-sm">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-100">Switch Language</h3>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Switch to <span className="font-medium text-blue-400">{LANGUAGE_CONFIGS[pendingLanguage].label}</span>? 
              This will replace your current code with the {LANGUAGE_CONFIGS[pendingLanguage].label} template.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelLanguageChange}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLanguageChange}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                Switch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirmation && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card bg-slate-800/90 border border-slate-500/30 rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">Reset Code</h3>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Reset to <span className="font-medium text-blue-400">{LANGUAGE_CONFIGS[language].label}</span> template? 
              This will replace your current code with the default template.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelReset}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}