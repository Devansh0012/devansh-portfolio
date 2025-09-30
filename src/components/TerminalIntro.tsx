"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { projects, timeline } from "@/lib/data";

type TerminalLine = {
  id: string;
  type: "system" | "input" | "output";
  value: ReactNode;
};

const bootstrapLines: TerminalLine[] = [
  {
    id: "boot-1",
    type: "system",
    value: "ssh devansh@playground",
  },
  {
    id: "boot-2",
    type: "system",
    value: "connection established ✅",
  },
  {
    id: "boot-3",
    type: "system",
    value: "type `help` to list commands, or explore the UI",
  },
];

const commandList = [
  "help",
  "projects",
  "logs",
  "blog",
  "arena",
  "sudo su",
  "clear",
];

export default function TerminalIntro() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [pendingBoot, setPendingBoot] = useState(true);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [, setHistoryIndex] = useState<number | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const bootTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const emitLines = useCallback((newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const resetTerminal = useCallback(() => {
    setLines([]);
    setPendingBoot(true);
    setHistoryIndex(null);
  }, []);

  useEffect(() => {
    if (!pendingBoot) return;

    let index = 0;
    const streamBootLines = () => {
      bootTimeoutRef.current = setTimeout(() => {
        emitLines([bootstrapLines[index]]);
        index += 1;
        if (index < bootstrapLines.length) {
          streamBootLines();
        } else {
          setPendingBoot(false);
        }
      }, index === 0 ? 200 : 600);
    };

    streamBootLines();

    return () => {
      if (bootTimeoutRef.current) clearTimeout(bootTimeoutRef.current);
    };
  }, [emitLines, pendingBoot]);

  useEffect(() => {
    if (!terminalRef.current) return;
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines]);

  const helpOutput = useMemo(() => {
    const grid = commandList.map((cmd) => `• ${cmd}`);
    return grid;
  }, []);

  const handleCommand = useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      const timestamp = Date.now();

      const inputLine: TerminalLine = {
        id: `${timestamp}-input`,
        type: "input",
        value: trimmed,
      };

      const [cmd, ...args] = trimmed.split(/\s+/);
      const normalized = cmd.toLowerCase();

      const addOutput = (output: Array<string | React.ReactNode>) => {
        const outputLines = output.map<TerminalLine>((value, index) => ({
          id: `${timestamp}-${normalized}-${index}`,
          type: "output",
          value,
        }));
        emitLines([inputLine, ...outputLines]);
      };

      switch (normalized) {
        case "help": {
          addOutput([
            "Available commands:",
            ...helpOutput,
            "Try `projects` or `logs` to see something tangible.",
          ]);
          break;
        }
        case "projects": {
          const preview = projects.slice(0, 3);
          addOutput([
            "Current focus projects:",
            ...preview.map((project) => (
              <span key={project.title}>
                {project.title} — {project.description}
              </span>
            )),
            <Link key="projects-link" href="/engineer#projects" className="text-emerald-300 underline">
              View full project roster →
            </Link>,
          ]);
          break;
        }
        case "logs": {
          const recentLogs = timeline.slice(0, 3);
          addOutput([
            "Recent log events:",
            ...recentLogs.map((entry) => (
              <span key={entry.id}>
                [{entry.timestamp}] {entry.title}
              </span>
            )),
            <Link key="logs-link" href="/engineer#logbook" className="text-emerald-300 underline">
              Inspect logbook →
            </Link>,
          ]);
          break;
        }
        case "blog": {
          addOutput([
            "Loading deep dives…",
            <Link key="blog-link" href="/blog" className="text-emerald-300 underline">
              Jump to blog hub →
            </Link>,
          ]);
          break;
        }
        case "arena": {
          addOutput([
            "Prepping the Code Challenge Arena. Mind the latency budget!",
            <Link key="arena-link" href="/arena" className="text-emerald-300 underline">
              Launch arena →
            </Link>,
          ]);
          break;
        }
        case "sudo": {
          if (args[0] === "su") {
            addOutput([
              "root@devansh granted. welcome to the hidden core.",
              <Link key="root-link" href="/engineer/root" className="text-emerald-300 underline">
                Enter root workspace →
              </Link>,
            ]);
            break;
          }
          addOutput([`sudo: command requires target, try \\"sudo su\\"`]);
          break;
        }
        case "clear": {
          resetTerminal();
          break;
        }
        default: {
          addOutput([`command not found: ${normalized}`]);
        }
      }
    },
    [emitLines, helpOutput, resetTerminal]
  );

  useEffect(() => {
    return () => {
      if (bootTimeoutRef.current) clearTimeout(bootTimeoutRef.current);
    };
  }, []);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const value = command;
      setCommand("");
      handleCommand(value);
      if (value.trim()) {
        setHistory((prev) => [...prev.slice(-19), value.trim()]);
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
        setHistoryIndex((prev) => {
          const nextIndex = prev === null ? history.length - 1 : Math.max(prev - 1, 0);
          setCommand(history[nextIndex]);
          return nextIndex;
        });
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (history.length === 0) return;
        setHistoryIndex((prev) => {
          if (prev === null) return null;
          const nextIndex = prev + 1;
          if (nextIndex >= history.length) {
            setCommand("");
            return null;
          }
          setCommand(history[nextIndex]);
          return nextIndex;
        });
      }
    },
    [history]
  );

  return (
    <div className="flex h-[420px] flex-col bg-black/80 font-mono text-sm text-emerald-200">
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-6 pr-4 [scrollbar-width:none]"
      >
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap">
            <span className="select-none text-emerald-400">{line.type === "input" ? "$" : "➜"} </span>
            {line.value}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="border-t border-emerald-500/20">
        <label className="sr-only" htmlFor="terminal-input">
          Terminal input
        </label>
        <div className="flex items-center gap-2 px-6 py-4">
          <span className="text-emerald-400">$</span>
          <input
            id="terminal-input"
            type="text"
            value={command}
            onChange={(event) => {
              setCommand(event.target.value);
              setHistoryIndex(null);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-emerald-100 outline-none placeholder:text-emerald-500/50"
            placeholder={pendingBoot ? "booting…" : "enter command"}
            disabled={pendingBoot}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </form>
    </div>
  );
}
