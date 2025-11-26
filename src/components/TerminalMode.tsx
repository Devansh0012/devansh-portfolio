"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Terminal as TerminalIcon, Cpu } from "lucide-react";
import { projects } from "@/lib/data";
import Link from "next/link";
import type { Route } from "next";

type CommandHistory = {
  command: string;
  output: React.ReactNode;
  timestamp: Date;
};

type FileSystem = {
  [key: string]: {
    type: "directory" | "file";
    content?: React.ReactNode;
    description?: string;
  };
};

const fileSystem: FileSystem = {
  projects: {
    type: "directory",
    description: "View engineering projects and experiments",
  },
  demos: {
    type: "directory",
    description: "Interactive mini demos and simulations",
  },
  about: {
    type: "file",
    description: "About engineer mode",
    content: (
      <div className="space-y-2 text-neutral-300">
        <p className="text-white font-semibold">Engineer Mode - Terminal Interface</p>
        <p>Welcome to the playground. This terminal interface provides access to:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Engineering projects and experiments</li>
          <li>Interactive demos and simulations</li>
          <li>Build logs and observability snapshots</li>
          <li>System architecture documentation</li>
        </ul>
        <p className="mt-4">Type &apos;help&apos; to see available commands.</p>
      </div>
    ),
  },
  readme: {
    type: "file",
    description: "Getting started guide",
    content: (
      <div className="space-y-2 text-neutral-300">
        <p className="text-white font-semibold">README.md</p>
        <p>This space mirrors the day-to-day command center—terminal logs,</p>
        <p>observability snapshots, and rapidly iterated experiments.</p>
        <p className="mt-4">Quick navigation:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>ls - List files and directories</li>
          <li>cat [file] - Read file contents</li>
          <li>cd [dir] - Change directory (coming soon)</li>
          <li>projects - View all projects</li>
          <li>arena - Launch code arena</li>
        </ul>
      </div>
    ),
  },
};

const AVAILABLE_COMMANDS = {
  help: "Show available commands",
  ls: "List files and directories",
  cat: "Read file contents (e.g., cat readme)",
  clear: "Clear terminal history",
  projects: "Display all engineering projects",
  arena: "Navigate to code arena",
  about: "Show information about engineer mode",
  whoami: "Display current user info",
  pwd: "Print working directory",
  echo: "Echo text back (e.g., echo hello)",
};

export default function TerminalMode() {
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const currentPath = "~/engineer";
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on mount and when clicking terminal
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addToHistory = useCallback((command: string, output: React.ReactNode) => {
    setHistory((prev) => [...prev, { command, output, timestamp: new Date() }]);
    setShowWelcome(false);
  }, []);

  const processCommand = useCallback(
    (cmd: string) => {
      const trimmedCmd = cmd.trim();
      if (!trimmedCmd) return;

      const [command, ...args] = trimmedCmd.split(" ");
      const argument = args.join(" ");

      switch (command.toLowerCase()) {
        case "help":
          addToHistory(cmd, (
            <div className="space-y-2 text-neutral-300">
              <p className="text-white font-semibold">Available Commands:</p>
              {Object.entries(AVAILABLE_COMMANDS).map(([cmd, desc]) => (
                <div key={cmd} className="flex gap-4">
                  <span className="text-white font-mono w-20">{cmd}</span>
                  <span className="text-neutral-400">{desc}</span>
                </div>
              ))}
            </div>
          ));
          break;

        case "ls":
          addToHistory(cmd, (
            <div className="space-y-1 text-neutral-300">
              {Object.entries(fileSystem).map(([name, item]) => (
                <div key={name} className="flex items-center gap-2">
                  <span className={item.type === "directory" ? "text-blue-400" : "text-white"}>
                    {item.type === "directory" ? "📁" : "📄"}
                  </span>
                  <span className={item.type === "directory" ? "text-blue-400" : "text-white"}>
                    {name}
                  </span>
                  {item.description && (
                    <span className="text-neutral-500 text-sm">- {item.description}</span>
                  )}
                </div>
              ))}
            </div>
          ));
          break;

        case "cat":
          if (!argument) {
            addToHistory(cmd, (
              <p className="text-red-400">Usage: cat [filename]</p>
            ));
          } else {
            const file = fileSystem[argument];
            if (!file) {
              addToHistory(cmd, (
                <p className="text-red-400">cat: {argument}: No such file or directory</p>
              ));
            } else if (file.type === "directory") {
              addToHistory(cmd, (
                <p className="text-red-400">cat: {argument}: Is a directory</p>
              ));
            } else {
              addToHistory(cmd, file.content);
            }
          }
          break;

        case "clear":
          setHistory([]);
          setShowWelcome(true);
          break;

        case "projects":
          addToHistory(cmd, (
            <div className="space-y-4 text-neutral-300">
              <p className="text-white font-semibold">Engineering Projects:</p>
              {projects.map((project, idx) => (
                <div key={idx} className="border-l-2 border-white/20 pl-4 space-y-2">
                  <p className="text-white font-semibold">{project.title}</p>
                  <p className="text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="text-xs text-neutral-400 border border-white/10 rounded px-2 py-0.5">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-neutral-300 underline"
                  >
                    → View repository
                  </a>
                </div>
              ))}
            </div>
          ));
          break;

        case "arena":
          addToHistory(cmd, (
            <div className="space-y-2 text-neutral-300">
              <p className="text-white">Launching Code Arena...</p>
              <Link href={{ pathname: "/arena" as Route }} className="text-white hover:text-neutral-300 underline">
                → Click here to enter the arena
              </Link>
            </div>
          ));
          break;

        case "about":
          if (fileSystem.about.content) {
            addToHistory(cmd, fileSystem.about.content);
          }
          break;

        case "whoami":
          addToHistory(cmd, (
            <div className="space-y-1 text-neutral-300">
              <p className="text-white">devansh@engineer-mode</p>
              <p className="text-sm">Software Engineer | Systems Builder | Community Leader</p>
            </div>
          ));
          break;

        case "pwd":
          addToHistory(cmd, (
            <p className="text-white">{currentPath}</p>
          ));
          break;

        case "echo":
          addToHistory(cmd, (
            <p className="text-neutral-300">{argument || ""}</p>
          ));
          break;

        default:
          addToHistory(cmd, (
            <p className="text-red-400">
              {command}: command not found. Type &apos;help&apos; for available commands.
            </p>
          ));
      }
    },
    [addToHistory, currentPath]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (currentCommand.trim()) {
        processCommand(currentCommand);
        setCurrentCommand("");
      }
    },
    [currentCommand, processCommand]
  );

  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white">
      {/* Terminal Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-5 w-5 text-white" />
            <span className="font-mono text-sm text-white">engineer@terminal:~</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-neutral-400" />
            <span className="text-xs text-neutral-400">Engineer Mode</span>
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        onClick={handleTerminalClick}
        className="flex-1 cursor-text overflow-y-auto bg-black font-mono text-sm"
      >
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
          {/* Welcome Message */}
          {showWelcome && (
            <div className="space-y-3 text-neutral-400">
              <p className="text-white">Welcome to Engineer Mode Terminal v1.0.0</p>
              <p>Type &apos;help&apos; to see available commands or &apos;ls&apos; to list files.</p>
              <p className="text-neutral-500">─────────────────────────────────────────</p>
            </div>
          )}

          {/* Command History */}
          {history.map((entry, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">{currentPath}</span>
                <span className="text-white">$</span>
                <span className="text-neutral-300">{entry.command}</span>
              </div>
              <div className="pl-4">{entry.output}</div>
            </div>
          ))}

          {/* Current Command Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-neutral-500">{currentPath}</span>
            <span className="text-white">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              className="flex-1 bg-transparent text-neutral-300 outline-none"
              spellCheck={false}
              autoComplete="off"
              autoFocus
            />
            <span className="animate-pulse text-white">▊</span>
          </form>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="border-t border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs text-neutral-400">
          <span>Press Enter to execute commands</span>
          <span>{history.length} commands executed</span>
        </div>
      </div>
    </div>
  );
}
