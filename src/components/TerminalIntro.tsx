"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { projects, timeline } from "@/lib/data";

type TerminalLine = {
  id: string;
  type: "prompt" | "output" | "error";
  prompt?: ReactNode;
  command?: string;
  value?: ReactNode;
};

type FileSystemNode = {
  type: "file" | "directory";
  content?: string;
  children?: Record<string, FileSystemNode>;
};

// Simulated file system
const fileSystem: Record<string, FileSystemNode> = {
  home: {
    type: "directory",
    children: {
      devansh: {
        type: "directory",
        children: {
          projects: {
            type: "directory",
            children: {
              "README.md": {
                type: "file",
                content: "# My Projects\n\nBuilding distributed systems and developer tools.\nCheck out /engineer for the full portfolio.",
              },
              "nasa-space-apps.txt": {
                type: "file",
                content: "🚀 NASA Space Apps Challenge - Global Nominee\nBuilt innovative solutions for space exploration challenges.",
              },
            },
          },
          blog: {
            type: "directory",
            children: {
              "latest.md": {
                type: "file",
                content: "# Latest Posts\n\n- Building Resilient Systems\n- Distributed Tracing\n- Event-Driven Architecture\n\nVisit /blog to read more!",
              },
            },
          },
          skills: {
            type: "directory",
            children: {
              "backend.txt": {
                type: "file",
                content: "Backend: Node.js, Python, Java, Go\nDatabases: PostgreSQL, MongoDB, Redis\nCloud: AWS, GCP, Azure",
              },
              "frontend.txt": {
                type: "file",
                content: "Frontend: React, Next.js, TypeScript\nStyling: Tailwind CSS\nState: Zustand, React Query",
              },
            },
          },
          "about.txt": {
            type: "file",
            content: "👨‍💻 Devansh Dubey\nSoftware Development Engineer\n\nPassionate about:\n- Distributed Systems\n- Developer Tooling\n- Open Source\n\nConnect: /recruiter or /engineer",
          },
        },
      },
    },
  },
};

// Helper functions
const resolvePath = (currentPath: string, targetPath: string): string => {
  if (targetPath === "~") {
    return "/home/devansh";
  }
  
  if (targetPath.startsWith("/")) {
    return targetPath;
  }
  
  const parts = currentPath.split("/").filter(Boolean);
  const targetParts = targetPath.split("/").filter(Boolean);
  
  for (const part of targetParts) {
    if (part === "..") {
      parts.pop();
    } else if (part !== ".") {
      parts.push(part);
    }
  }
  
  return "/" + parts.join("/");
};

const getNode = (path: string): FileSystemNode | null => {
  const parts = path.split("/").filter(Boolean);
  let current: FileSystemNode | undefined = fileSystem[parts[0]];
  
  for (let i = 1; i < parts.length; i++) {
    if (!current || current.type !== "directory" || !current.children) {
      return null;
    }
    current = current.children[parts[i]];
  }
  
  return current || null;
};

const listDirectory = (path: string): string[] => {
  const node = getNode(path);
  if (!node || node.type !== "directory" || !node.children) {
    return [];
  }
  return Object.keys(node.children).sort();
};

// Helper to convert text with /paths to clickable links
const linkifyText = (text: string): ReactNode => {
  const parts = text.split(/(\s+)/);
  return (
    <>
      {parts.map((part, index) => {
        if (part.match(/^\/[a-z]+$/)) {
          return (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Link key={index} href={part as any} className="text-blue-400 hover:text-blue-300 underline">
              {part}
            </Link>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

export default function TerminalIntro() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentPath, setCurrentPath] = useState("/home/devansh");
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [visitorInfo, setVisitorInfo] = useState<{
    ip: string;
    browser: string;
    os: string;
    device: string;
  } | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch visitor information
  useEffect(() => {
    const fetchVisitorInfo = async () => {
      try {
        // Get IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Get user agent info
        const ua = navigator.userAgent;
        
        // Parse browser
        let browser = "Unknown";
        if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Edg")) browser = "Edge";
        else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
        
        // Parse OS
        let os = "Unknown";
        if (ua.includes("Win")) os = "Windows";
        else if (ua.includes("Mac")) os = "macOS";
        else if (ua.includes("Linux")) os = "Linux";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
        
        // Parse device type
        let device = "Desktop";
        if (/Mobile|Android|iPhone/i.test(ua)) device = "Mobile";
        else if (/iPad|Tablet/i.test(ua)) device = "Tablet";
        
        setVisitorInfo({
          ip: ipData.ip,
          browser,
          os,
          device,
        });
      } catch (error) {
        console.error("Failed to fetch visitor info:", error);
        setVisitorInfo({
          ip: "Unknown",
          browser: "Unknown",
          os: "Unknown",
          device: "Unknown",
        });
      }
    };
    
    fetchVisitorInfo();
  }, []);

  // Welcome message
  useEffect(() => {
    const welcomeLines: TerminalLine[] = [
      {
        id: "welcome-1",
        type: "output",
        value: (
          <div className="text-slate-300 text-xs">
            <div className="mb-1 text-cyan-400 text-xs">Last login: {new Date().toLocaleString()} on ttys001</div>
            <div className="my-2 border-l-2 border-emerald-500 pl-2 py-1">
              <div className="text-emerald-400 font-semibold text-sm">
                🚀 Welcome to Devansh&apos;s Dev Environment
              </div>
              <div className="text-slate-400 text-xs mt-0.5">
                Software Development Engineer | Distributed Systems Enthusiast
              </div>
            </div>
            <div className="text-slate-300 text-xs mb-0.5">
              Type <span className="text-yellow-400">help</span> for commands
            </div>
            <div className="text-slate-400 text-xs">
              Try: <span className="text-blue-400">ls</span>, <span className="text-blue-400">cd projects</span>, <span className="text-blue-400">cat about.txt</span>
            </div>
          </div>
        ),
      },
    ];
    setLines(welcomeLines);
  }, []);

  useEffect(() => {
    if (!terminalRef.current) return;
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getPrompt = useCallback(() => {
    const dir = currentPath === "/home/devansh" ? "~" : currentPath.replace("/home/devansh", "~");
    return (
      <span className="select-none text-xs">
        <span className="text-emerald-400 font-semibold">devansh</span>
        <span className="text-slate-500">@</span>
        <span className="text-blue-500 font-semibold">portfolio</span>
        <span className="text-slate-500"> in </span>
        <span className="text-cyan-400 font-semibold">{dir}</span>
        <span className="text-yellow-400 ml-1">❯</span>
      </span>
    );
  }, [currentPath]);

  const handleCommand = useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim();
      if (!trimmed) {
        const emptyLine: TerminalLine = {
          id: `${Date.now()}-empty`,
          type: "prompt",
          prompt: getPrompt(),
          command: "",
        };
        setLines((prev) => [...prev, emptyLine]);
        return;
      }

      const [cmd, ...args] = trimmed.split(/\s+/);
      const timestamp = Date.now();

      const inputLine: TerminalLine = {
        id: `${timestamp}-prompt`,
        type: "prompt",
        prompt: getPrompt(),
        command: trimmed,
      };

      const addOutput = (value: ReactNode, error = false) => {
        const outputLine: TerminalLine = {
          id: `${timestamp}-output`,
          type: error ? "error" : "output",
          value,
        };
        setLines((prev) => [...prev, inputLine, outputLine]);
      };

      switch (cmd.toLowerCase()) {
        case "help": {
          addOutput(
            <div className="space-y-1 text-xs">
              <div className="text-cyan-400 font-semibold text-xs mb-1">Available Commands:</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                <div><span className="text-yellow-400">ls</span> <span className="text-slate-500">- list files</span></div>
                <div><span className="text-yellow-400">cd</span> <span className="text-slate-500">- change dir</span></div>
                <div><span className="text-yellow-400">cat</span> <span className="text-slate-500">- read file</span></div>
                <div><span className="text-yellow-400">pwd</span> <span className="text-slate-500">- current path</span></div>
                <div><span className="text-yellow-400">clear</span> <span className="text-slate-500">- clear screen</span></div>
                <div><span className="text-yellow-400">echo</span> <span className="text-slate-500">- print text</span></div>
                <div><span className="text-yellow-400">whoami</span> <span className="text-slate-500">- visitor info</span></div>
                <div><span className="text-yellow-400">date</span> <span className="text-slate-500">- date/time</span></div>
              </div>
              <div className="mt-1.5 text-xs text-slate-400">
                Special: <span className="text-emerald-400">projects</span>, <span className="text-emerald-400">blog</span>, <span className="text-emerald-400">arena</span>, <span className="text-emerald-400">logs</span>
              </div>
            </div>
          );
          break;
        }

        case "ls": {
          const targetPath = args[0] ? resolvePath(currentPath, args[0]) : currentPath;
          const items = listDirectory(targetPath);
          
          if (items.length === 0) {
            addOutput(
              <div className="text-red-400 text-xs">ls: cannot access &apos;{args[0] || currentPath}&apos;: No such file or directory</div>,
              true
            );
          } else {
            addOutput(
              <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-xs">
                {items.map((item) => {
                  const itemPath = resolvePath(targetPath, item);
                  const itemNode = getNode(itemPath);
                  const isDir = itemNode?.type === "directory";
                  return (
                    <div key={item} className={isDir ? "text-blue-400 font-semibold" : "text-slate-300"}>
                      {item}{isDir && "/"}
                    </div>
                  );
                })}
              </div>
            );
          }
          break;
        }

        case "cd": {
          const targetPath = args[0] ? resolvePath(currentPath, args[0]) : "/home/devansh";
          const node = getNode(targetPath);
          
          if (!node) {
            addOutput(
              <div className="text-red-400 text-xs">cd: no such file or directory: {args[0]}</div>,
              true
            );
          } else if (node.type !== "directory") {
            addOutput(
              <div className="text-red-400 text-xs">cd: not a directory: {args[0]}</div>,
              true
            );
          } else {
            setCurrentPath(targetPath);
            setLines((prev) => [...prev, inputLine]);
          }
          break;
        }

        case "cat": {
          if (!args[0]) {
            addOutput(
              <div className="text-red-400 text-xs">cat: missing file operand</div>,
              true
            );
          } else {
            const targetPath = resolvePath(currentPath, args[0]);
            const node = getNode(targetPath);
            
            if (!node) {
              addOutput(
                <div className="text-red-400 text-xs">cat: {args[0]}: No such file or directory</div>,
                true
              );
            } else if (node.type !== "file") {
              addOutput(
                <div className="text-red-400 text-xs">cat: {args[0]}: Is a directory</div>,
                true
            );
            } else {
              // Split content by lines and linkify each line
              const lines = (node.content || "").split('\n');
              addOutput(
                <div className="whitespace-pre-wrap text-slate-300 text-xs">
                  {lines.map((line, idx) => (
                    <div key={idx}>{linkifyText(line)}</div>
                  ))}
                </div>
              );
            }
          }
          break;
        }

        case "pwd": {
          addOutput(<div className="text-slate-300 text-xs">{currentPath}</div>);
          break;
        }

        case "clear": {
          setLines([]);
          break;
        }

        case "echo": {
          addOutput(<div className="text-slate-300 text-xs">{args.join(" ")}</div>);
          break;
        }

        case "whoami": {
          if (visitorInfo) {
            addOutput(
              <div className="space-y-0.5 text-xs">
                <div className="text-yellow-400">🤔 Don&apos;t know your name, but here&apos;s what I know:</div>
                <div className="text-slate-300 ml-2">
                  <div>📍 IP Address: <span className="text-cyan-400">{visitorInfo.ip}</span></div>
                  <div>🌐 Browser: <span className="text-cyan-400">{visitorInfo.browser}</span></div>
                  <div>💻 OS: <span className="text-cyan-400">{visitorInfo.os}</span></div>
                  <div>📱 Device: <span className="text-cyan-400">{visitorInfo.device}</span></div>
                </div>
              </div>
            );
          } else {
            addOutput(<div className="text-slate-300 text-xs">Fetching visitor information...</div>);
          }
          break;
        }

        case "date": {
          addOutput(<div className="text-slate-300 text-xs">{new Date().toString()}</div>);
          break;
        }

        case "projects": {
          const preview = projects.slice(0, 2);
          addOutput(
            <div className="space-y-1 text-xs">
              <div className="text-cyan-400 font-semibold text-xs mb-0.5">Featured Projects:</div>
              {preview.map((project) => (
                <div key={project.title} className="text-xs">
                  <span className="text-emerald-400">▸</span> <span className="text-slate-200 font-semibold">{project.title}</span>
                  <div className="ml-3 text-slate-400 text-xs truncate">{project.description.slice(0, 60)}...</div>
                </div>
              ))}
              <Link href="/engineer#projects" className="block mt-1 text-blue-400 hover:text-blue-300 underline text-xs">
                → View all projects
              </Link>
            </div>
          );
          break;
        }

        case "blog": {
          addOutput(
            <div className="space-y-0.5 text-xs">
              <div className="text-slate-300">📚 Engineering blog with technical insights</div>
              <Link href="/blog" className="block text-blue-400 hover:text-blue-300 underline">
                → Visit blog
              </Link>
            </div>
          );
          break;
        }

        case "arena": {
          addOutput(
            <div className="space-y-0.5 text-xs">
              <div className="text-slate-300">⚔️ Code Challenge Arena</div>
              <Link href="/arena" className="block text-blue-400 hover:text-blue-300 underline">
                → Enter arena
              </Link>
            </div>
          );
          break;
        }

        case "logs": {
          const recentLogs = timeline.slice(0, 2);
          addOutput(
            <div className="space-y-1 text-xs">
              <div className="text-cyan-400 font-semibold text-xs mb-0.5">Recent Activity:</div>
              {recentLogs.map((entry) => (
                <div key={entry.id} className="text-xs">
                  <span className="text-slate-500">[{entry.timestamp}]</span> <span className="text-slate-300">{entry.title}</span>
                </div>
              ))}
              <Link href="/engineer#logbook" className="block mt-1 text-blue-400 hover:text-blue-300 underline text-xs">
                → View full timeline
              </Link>
            </div>
          );
          break;
        }

        case "sudo": {
          if (args[0] === "su") {
            addOutput(
              <div className="space-y-0.5 text-xs">
                <div className="text-yellow-400">🔐 root access granted</div>
                <Link href="/engineer/root" className="block text-blue-400 hover:text-blue-300 underline">
                  → Enter root workspace
                </Link>
              </div>
            );
          } else {
            addOutput(
              <div className="text-red-400 text-xs">sudo: a password is required</div>,
              true
            );
          }
          break;
        }

        default: {
          addOutput(
            <div className="text-red-400 text-xs">zsh: command not found: {cmd}</div>,
            true
          );
        }
      }
    },
    [currentPath, visitorInfo, getPrompt]
  );

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const value = command;
      setCommand("");
      handleCommand(value);
      if (value.trim()) {
        setHistory((prev) => [...prev.slice(-49), value.trim()]);
        setHistoryIndex(null);
      }
    },
    [command, handleCommand]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (history.length === 0) return;
        const newIndex = historyIndex === null ? history.length - 1 : Math.max(historyIndex - 1, 0);
        setCommand(history[newIndex]);
        setHistoryIndex(newIndex);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (history.length === 0 || historyIndex === null) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setCommand("");
          setHistoryIndex(null);
        } else {
          setCommand(history[newIndex]);
          setHistoryIndex(newIndex);
        }
      } else if (event.key === "Tab") {
        event.preventDefault();
        // Basic tab completion for commands
        const commands = ["ls", "cd", "cat", "pwd", "clear", "echo", "help", "whoami", "date", "projects", "blog", "arena", "logs", "sudo"];
        const matches = commands.filter(cmd => cmd.startsWith(command.trim()));
        
        if (matches.length === 1) {
          setCommand(matches[0] + " ");
        } else if (matches.length > 1) {
          // Show all matching commands
          const timestamp = Date.now();
          const inputLine: TerminalLine = {
            id: `${timestamp}-prompt`,
            type: "prompt",
            prompt: getPrompt(),
            command: command,
          };
          const outputLine: TerminalLine = {
            id: `${timestamp}-output`,
            type: "output",
            value: (
              <div className="grid grid-cols-4 gap-x-3 gap-y-0.5 text-xs text-slate-300">
                {matches.map((match) => (
                  <div key={match}>{match}</div>
                ))}
              </div>
            ),
          };
          setLines((prev) => [...prev, inputLine, outputLine]);
        }
      } else if (event.key === "l" && event.ctrlKey) {
        event.preventDefault();
        setLines([]);
      }
    },
    [history, historyIndex, command, getPrompt]
  );

  return (
    <div className="flex h-[420px] flex-col bg-[#1e1e2e] rounded-lg overflow-hidden font-mono text-xs text-slate-100 border border-slate-700/50">
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-thin scrollbar-track-[#1e1e2e] scrollbar-thumb-[#374151]"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line) => (
          <div key={line.id} className="leading-relaxed">
            {line.type === "prompt" && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex-shrink-0">{line.prompt}</div>
                {line.command && <div className="text-slate-100 text-xs">{line.command}</div>}
              </div>
            )}
            {line.type === "output" && (
              <div className="py-0.5 text-xs">{line.value}</div>
            )}
            {line.type === "error" && (
              <div className="py-0.5 text-xs">{line.value}</div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="border-t border-slate-700/50 bg-[#181825]">
        <div className="flex items-center gap-1.5 px-3 py-2">
          <div className="flex-shrink-0">{getPrompt()}</div>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => {
              setCommand(e.target.value);
              setHistoryIndex(null);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-slate-100 outline-none text-xs placeholder:text-slate-600"
            placeholder="Type a command..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </form>
    </div>
  );
}
