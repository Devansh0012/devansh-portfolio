"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { Route } from "next";
import {
  Braces,
  ChevronRight,
  Circle,
  Cpu,
  Database,
  Network,
  Server,
  ShieldCheck,
  Terminal as TerminalIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  demos,
  education,
  experiences,
  projects,
  skillCategories,
  timeline,
} from "@/lib/data";

const Terminal2048 = dynamic(() => import("@/components/games/Terminal2048"), {
  ssr: false,
});
const TerminalTetris = dynamic(() => import("@/components/games/TerminalTetris"), {
  ssr: false,
});

type Game = "2048" | "tetris";

type HistoryEntry = {
  id: number;
  command: string;
  path: string;
  output: ReactNode;
};

type VisitorInfo = {
  ip: string;
  browser: string;
  os: string;
  device: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  isp?: string;
};

type VirtualNode = {
  type: "directory" | "file";
  description: string;
  content?: string;
};

type CommandDefinition = {
  description: string;
  usage: string;
  aliases?: string[];
};

const HOME_PATH = "/home/devansh";

const virtualFileSystem: Record<string, VirtualNode> = {
  "/": { type: "directory", description: "Virtual filesystem root" },
  "/home": { type: "directory", description: "User homes" },
  [HOME_PATH]: { type: "directory", description: "Engineering workspace" },
  [`${HOME_PATH}/README.md`]: {
    type: "file",
    description: "Console guide",
    content: [
      "# Devansh Engineering Console",
      "",
      "A public-safe interface to projects, systems thinking, demos, and technical writing.",
      "",
      "Start with: help, neofetch, projects, skills, experience, demos",
      "Explore with: ls, cd, cat, pwd",
      "Inspect endpoints with: curl /health or curl /api/stack",
    ].join("\n"),
  },
  [`${HOME_PATH}/about.txt`]: {
    type: "file",
    description: "Profile summary",
    content: [
      "Devansh Dubey",
      "Software Engineer at Palo Alto Networks",
      "",
      "Focus areas:",
      "- AI gateway infrastructure",
      "- Backend and distributed systems",
      "- MCP and OAuth",
      "- Developer tooling",
    ].join("\n"),
  },
  [`${HOME_PATH}/stack.json`]: {
    type: "file",
    description: "Technical stack",
    content: JSON.stringify(
      {
        languages: ["Go", "TypeScript", "Python", "Java", "C++", "SQL"],
        backend: ["Fastify", "Fiber", "FastAPI", "Django"],
        infrastructure: ["Kubernetes", "Docker", "Helm", "Redis", "PostgreSQL"],
        protocols: ["MCP", "OAuth 2.1", "OpenID Connect", "SSE"],
      },
      null,
      2
    ),
  },
  [`${HOME_PATH}/projects`]: {
    type: "directory",
    description: "Selected engineering work",
  },
  [`${HOME_PATH}/projects/README.md`]: {
    type: "file",
    description: "Projects index",
    content: "Run `projects` to inspect selected work. Use `projects <query>` to filter by technology or title.",
  },
  [`${HOME_PATH}/demos`]: {
    type: "directory",
    description: "Interactive systems and algorithm demos",
  },
  [`${HOME_PATH}/demos/README.md`]: {
    type: "file",
    description: "Demos index",
    content: "Run `demos` to list interactive labs. Use `open demo:<id>` to launch one.",
  },
  [`${HOME_PATH}/logs`]: {
    type: "directory",
    description: "Public engineering focus log",
  },
  [`${HOME_PATH}/logs/README.md`]: {
    type: "file",
    description: "Engineering log guide",
    content: "Run `logs` for a public, high-level view of current engineering focus areas.",
  },
};

const commandDefinitions: Record<string, CommandDefinition> = {
  help: { description: "List commands or inspect one command", usage: "help [command]", aliases: ["?"] },
  man: { description: "Show command documentation", usage: "man <command>" },
  clear: { description: "Clear terminal output", usage: "clear", aliases: ["cls"] },
  history: { description: "Show command history", usage: "history" },
  pwd: { description: "Print the current directory", usage: "pwd" },
  ls: { description: "List a virtual directory", usage: "ls [path]", aliases: ["ll"] },
  cd: { description: "Change the virtual directory", usage: "cd [path]" },
  cat: { description: "Read a virtual file", usage: "cat <file>" },
  echo: { description: "Print text", usage: "echo <text>" },
  date: { description: "Show local date and time", usage: "date" },
  whoami: { description: "Inspect the current visitor session", usage: "whoami" },
  neofetch: { description: "Show the portfolio system profile", usage: "neofetch", aliases: ["sysinfo"] },
  status: { description: "Show console and network status", usage: "status" },
  skills: { description: "Inspect the engineering stack", usage: "skills [category]", aliases: ["stack"] },
  experience: { description: "Show professional experience", usage: "experience", aliases: ["work"] },
  education: { description: "Show education and qualifications", usage: "education" },
  projects: { description: "List or filter selected projects", usage: "projects [query|--all]" },
  demos: { description: "List or filter interactive demos", usage: "demos [query]" },
  logs: { description: "Show public engineering focus logs", usage: "logs" },
  blog: { description: "Open the engineering blog", usage: "blog" },
  contact: { description: "Show contact channels", usage: "contact" },
  resume: { description: "Open the public resume", usage: "resume" },
  open: { description: "Resolve a project, demo, or page", usage: "open <project|demo:id|blog|resume>" },
  curl: { description: "Query a virtual portfolio endpoint", usage: "curl </health|/api/profile|/api/stack>" },
  game: { description: "Launch a terminal game", usage: "game <2048|tetris>" },
};

const aliasMap = Object.entries(commandDefinitions).reduce<Record<string, string>>(
  (map, [command, definition]) => {
    definition.aliases?.forEach((alias) => {
      map[alias] = command;
    });
    return map;
  },
  {}
);

const commandNames = [
  ...Object.keys(commandDefinitions),
  ...Object.keys(aliasMap),
].sort();

const suggestions = ["neofetch", "skills", "projects", "curl /health", "whoami"];

function tokenize(value: string) {
  return (
    value.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)?.map((token) =>
      token.replace(/^(["'])|(["'])$/g, "")
    ) ?? []
  );
}

function normalizePath(currentPath: string, target = ".") {
  if (target === "~") return HOME_PATH;
  const source = target.startsWith("/")
    ? target.split("/")
    : `${currentPath}/${target}`.split("/");
  const parts: string[] = [];

  for (const part of source) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }

  return `/${parts.join("/")}`;
}

function displayPath(path: string) {
  return path.startsWith(HOME_PATH) ? path.replace(HOME_PATH, "~") || "~" : path;
}

function listDirectory(path: string) {
  const normalized = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
  const prefix = normalized === "/" ? "/" : `${normalized}/`;

  return Object.entries(virtualFileSystem)
    .filter(([candidate]) => candidate.startsWith(prefix) && candidate !== normalized)
    .filter(([candidate]) => !candidate.slice(prefix.length).includes("/"))
    .map(([candidate, node]) => ({ name: candidate.slice(prefix.length), node }))
    .sort((a, b) => {
      if (a.node.type !== b.node.type) return a.node.type === "directory" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

function detectClient() {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  let os = "Unknown";
  if (ua.includes("Android")) os = "Android";
  else if (/iPhone|iPad|iOS/.test(ua)) os = "iOS";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Linux")) os = "Linux";

  const device = /Mobile|Android|iPhone/i.test(ua)
    ? "Mobile"
    : /iPad|Tablet/i.test(ua)
      ? "Tablet"
      : "Desktop";

  return { browser, os, device };
}

function JsonOutput({ value }: { value: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] p-3 text-xs leading-relaxed text-cyan-100">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function TerminalLink({ href, children }: { href: string; children: ReactNode }) {
  const className = "inline-flex items-center gap-1 text-cyan-300 underline decoration-cyan-400/30 underline-offset-4 transition hover:text-cyan-100";
  if (href.startsWith("/")) {
    return <Link href={href as Route} className={className}>{children}</Link>;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}

export default function TerminalMode() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyCursor, setHistoryCursor] = useState<number | null>(null);
  const [currentPath, setCurrentPath] = useState(HOME_PATH);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(null);
  const [networkState, setNetworkState] = useState<"resolving" | "online" | "limited">("resolving");
  const [startedAt] = useState(() => Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const compactPath = displayPath(currentPath);

  useEffect(() => {
    if (window.matchMedia("(min-width: 640px) and (pointer: fine)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [entries, activeGame]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    const client = detectClient();

    const resolveVisitor = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("IP service unavailable");
        const data = await response.json();
        setVisitorInfo({
          ip: data.ip || "Unknown",
          ...client,
          city: data.city,
          region: data.region,
          country: data.country_name,
          timezone: data.timezone,
          isp: data.org,
        });
        setNetworkState("online");
      } catch {
        try {
          const fallback = await fetch("https://api.ipify.org?format=json");
          const data = await fallback.json();
          setVisitorInfo({ ip: data.ip || "Unknown", ...client });
          setNetworkState("limited");
        } catch {
          setVisitorInfo({ ip: "Unavailable", ...client });
          setNetworkState("limited");
        }
      } finally {
        window.clearTimeout(timeout);
      }
    };

    resolveVisitor();
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const addEntry = useCallback((rawCommand: string, path: string, output: ReactNode) => {
    setEntries((previous) => [
      ...previous,
      { id: nextId.current++, command: rawCommand, path, output },
    ]);
  }, []);

  const renderHelp = useCallback((requested?: string) => {
    const resolved = requested ? aliasMap[requested] ?? requested : undefined;
    if (resolved && commandDefinitions[resolved]) {
      const definition = commandDefinitions[resolved];
      return (
        <div className="space-y-2">
          <p className="font-semibold text-white">{resolved}</p>
          <p className="text-neutral-300">{definition.description}</p>
          <p><span className="text-neutral-500">usage:</span> <span className="text-cyan-300">{definition.usage}</span></p>
          {definition.aliases?.length ? (
            <p><span className="text-neutral-500">aliases:</span> {definition.aliases.join(", ")}</p>
          ) : null}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-white">Command index</p>
          <p className="text-neutral-500">Use <span className="text-cyan-300">man &lt;command&gt;</span> for details.</p>
        </div>
        <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(commandDefinitions).map(([name, definition]) => (
            <div key={name} className="grid grid-cols-[76px_1fr] gap-2">
              <span className="text-cyan-300">{name}</span>
              <span className="text-neutral-400">{definition.description}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }, []);

  const executeCommand = useCallback((rawValue: string) => {
    const raw = rawValue.trim();
    if (!raw) return;

    const tokens = tokenize(raw);
    const requestedCommand = tokens[0]?.toLowerCase() ?? "";
    const canonicalCommand = aliasMap[requestedCommand] ?? requestedCommand;
    const args = tokens.slice(1);
    const argument = args.join(" ");
    const pathAtExecution = currentPath;
    const query = argument.toLowerCase();
    let output: ReactNode;

    switch (canonicalCommand) {
      case "help":
      case "man":
        output = renderHelp(args[0]?.toLowerCase());
        break;

      case "clear":
        setEntries([]);
        setCommand("");
        setCommandHistory((previous) => [...previous.slice(-49), raw]);
        setHistoryCursor(null);
        return;

      case "history":
        output = commandHistory.length ? (
          <ol className="space-y-1">
            {commandHistory.map((item, index) => (
              <li key={`${item}-${index}`}><span className="mr-3 text-neutral-600">{index + 1}</span>{item}</li>
            ))}
          </ol>
        ) : <p className="text-neutral-500">No command history in this session.</p>;
        break;

      case "pwd":
        output = <p className="text-cyan-200">{currentPath}</p>;
        break;

      case "ls": {
        const target = normalizePath(currentPath, args[0] || ".");
        const node = virtualFileSystem[target];
        if (!node || node.type !== "directory") {
          output = <p className="text-red-300">ls: {args[0] || target}: No such directory</p>;
          break;
        }
        const items = listDirectory(target);
        output = items.length ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ name, node: item }) => (
              <div key={name} className="flex min-w-0 items-center gap-2">
                <span className={item.type === "directory" ? "text-blue-300" : "text-neutral-200"}>
                  {item.type === "directory" ? "drwx" : "-rw-"}
                </span>
                <span className={item.type === "directory" ? "font-semibold text-blue-300" : "text-neutral-200"}>
                  {name}{item.type === "directory" ? "/" : ""}
                </span>
                <span className="truncate text-neutral-600">{item.description}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-neutral-500">Directory is empty.</p>;
        break;
      }

      case "cd": {
        const target = normalizePath(currentPath, args[0] || "~");
        const node = virtualFileSystem[target];
        if (!node) output = <p className="text-red-300">cd: {args[0]}: No such file or directory</p>;
        else if (node.type !== "directory") output = <p className="text-red-300">cd: {args[0]}: Not a directory</p>;
        else {
          setCurrentPath(target);
          output = <p className="text-neutral-500">cwd → {displayPath(target)}</p>;
        }
        break;
      }

      case "cat": {
        if (!args[0]) {
          output = <p className="text-red-300">cat: missing file operand</p>;
          break;
        }
        const target = normalizePath(currentPath, args[0]);
        const node = virtualFileSystem[target];
        if (!node) output = <p className="text-red-300">cat: {args[0]}: No such file</p>;
        else if (node.type !== "file") output = <p className="text-red-300">cat: {args[0]}: Is a directory</p>;
        else output = <pre className="whitespace-pre-wrap leading-relaxed text-neutral-300">{node.content}</pre>;
        break;
      }

      case "echo":
        output = <p className="whitespace-pre-wrap text-neutral-300">{argument}</p>;
        break;

      case "date":
        output = <p className="text-neutral-300">{new Date().toString()}</p>;
        break;

      case "whoami":
        output = visitorInfo ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4">
              <p className="mb-3 flex items-center gap-2 font-semibold text-cyan-200"><Network className="h-4 w-4" /> Network identity</p>
              <dl className="grid grid-cols-[90px_1fr] gap-x-3 gap-y-1.5">
                <dt className="text-neutral-500">IP</dt><dd className="text-neutral-200">{visitorInfo.ip}</dd>
                {visitorInfo.city ? <><dt className="text-neutral-500">Location</dt><dd>{[visitorInfo.city, visitorInfo.region, visitorInfo.country].filter(Boolean).join(", ")}</dd></> : null}
                {visitorInfo.timezone ? <><dt className="text-neutral-500">Timezone</dt><dd>{visitorInfo.timezone}</dd></> : null}
                {visitorInfo.isp ? <><dt className="text-neutral-500">Network</dt><dd>{visitorInfo.isp}</dd></> : null}
              </dl>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-3 flex items-center gap-2 font-semibold text-white"><Cpu className="h-4 w-4" /> Client context</p>
              <dl className="grid grid-cols-[90px_1fr] gap-x-3 gap-y-1.5">
                <dt className="text-neutral-500">Browser</dt><dd>{visitorInfo.browser}</dd>
                <dt className="text-neutral-500">OS</dt><dd>{visitorInfo.os}</dd>
                <dt className="text-neutral-500">Device</dt><dd>{visitorInfo.device}</dd>
                <dt className="text-neutral-500">Access</dt><dd className="text-emerald-300">visitor</dd>
              </dl>
            </div>
          </div>
        ) : <p className="animate-pulse text-amber-300">Resolving visitor session…</p>;
        break;

      case "neofetch":
        output = (
          <div className="grid gap-5 md:grid-cols-[180px_1fr]">
            <pre className="hidden select-none text-cyan-300 md:block">{`       ╭────────╮
       │  DD    │
       │  ▣ ▣   │
       │   ▽    │
       ╰────────╯
    engineering/os`}</pre>
            <div className="space-y-1.5">
              <p><span className="font-semibold text-cyan-300">devansh</span><span className="text-neutral-600">@</span><span className="font-semibold text-white">portfolio</span></p>
              <p className="text-neutral-700">────────────────────────────</p>
              <p><span className="text-neutral-500">Role</span>      Software Engineer</p>
              <p><span className="text-neutral-500">Focus</span>     AI Infrastructure · Backend Systems</p>
              <p><span className="text-neutral-500">Languages</span> Go · TypeScript · Python · Java</p>
              <p><span className="text-neutral-500">Runtime</span>   Next.js 15 · React 19 · TypeScript</p>
              <p><span className="text-neutral-500">Infra</span>     Kubernetes · Docker · Redis · PostgreSQL</p>
              <p><span className="text-neutral-500">Protocols</span> MCP · OAuth 2.1 · OIDC · SSE</p>
            </div>
          </div>
        );
        break;

      case "status":
        output = (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["console", "operational", "text-emerald-300"],
              ["network", networkState, networkState === "online" ? "text-emerald-300" : "text-amber-300"],
              ["session", `${Math.max(1, Math.floor((Date.now() - startedAt) / 1000))}s`, "text-cyan-300"],
              ["commands", String(commandHistory.length + 1), "text-violet-300"],
            ].map(([label, value, color]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-wider text-neutral-600">{label}</p>
                <p className={`mt-1 font-semibold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "skills": {
        const filtered = skillCategories.filter((category) =>
          !query || category.title.toLowerCase().includes(query) || category.items.some((item) => item.toLowerCase().includes(query))
        );
        output = filtered.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((category) => (
              <div key={category.title} className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <p className="mb-3 flex items-center gap-2 font-semibold text-white"><Braces className="h-4 w-4 text-cyan-300" /> {category.title}</p>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => <span key={item} className="rounded border border-white/10 bg-black/40 px-2 py-1 text-xs text-neutral-300">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-amber-300">No stack category matched “{argument}”.</p>;
        break;
      }

      case "experience":
        output = (
          <div className="space-y-4">
            {experiences.map((item) => (
              <div key={item.company} className="border-l border-cyan-400/30 pl-4">
                <p className="font-semibold text-white">{item.role}</p>
                <p className="text-cyan-300">{item.company} <span className="text-neutral-600">·</span> {item.start}—{item.end}</p>
                <p className="mt-1 max-w-3xl text-neutral-400">{item.summary}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "education":
        output = (
          <div className="space-y-3">
            {education.map((item) => (
              <div key={item.degree} className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <p className="font-semibold text-white">{item.degree}</p>
                <p className="text-neutral-300">{item.institution}</p>
                <p className="text-neutral-500">{item.university} · {item.graduation}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "projects": {
        const showAll = query === "--all";
        const filtered = projects.filter((project) =>
          !query || showAll || [project.title, project.description, ...project.tech].join(" ").toLowerCase().includes(query)
        );
        const visibleProjects = !query ? filtered.slice(0, 6) : filtered;
        output = filtered.length ? (
          <div className="space-y-3">
            <div className="grid gap-3 lg:grid-cols-2">
              {visibleProjects.map((project) => (
                <div key={project.title} className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="font-semibold text-white">{project.title}</p>
                  <p className="mt-1 text-neutral-400">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">{project.tech.map((tech) => <span key={tech} className="text-xs text-cyan-300">#{tech.replaceAll(" ", "-").toLowerCase()}</span>)}</div>
                  <div className="mt-3"><TerminalLink href={project.link}>open project ↗</TerminalLink></div>
                </div>
              ))}
            </div>
            {!query && filtered.length > visibleProjects.length ? (
              <p className="text-neutral-600">Showing {visibleProjects.length} of {filtered.length}. Run <span className="text-cyan-300">projects --all</span> to inspect the full index.</p>
            ) : null}
          </div>
        ) : <p className="text-amber-300">No project matched “{argument}”. Try a technology such as MCP, Go, React, or Python.</p>;
        break;
      }

      case "demos": {
        const filtered = demos.filter((demo) =>
          !query || [demo.id, demo.title, demo.category, ...demo.tech].join(" ").toLowerCase().includes(query)
        );
        output = filtered.length ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {filtered.map((demo) => (
              <div key={demo.id} className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <div className="flex items-center justify-between gap-3"><p className="font-semibold text-white">{demo.title}</p><span className="text-xs text-violet-300">{demo.category}</span></div>
                <p className="mt-1 text-neutral-400">{demo.description}</p>
                <div className="mt-3"><TerminalLink href={demo.path}>launch demo ↗</TerminalLink></div>
              </div>
            ))}
          </div>
        ) : <p className="text-amber-300">No demo matched “{argument}”.</p>;
        break;
      }

      case "logs":
        output = (
          <div className="space-y-3">
            {timeline.map((entry) => (
              <div key={entry.id} className="grid gap-1 border-l border-violet-400/30 pl-4 sm:grid-cols-[64px_1fr]">
                <span className="text-violet-300">{entry.timestamp}</span>
                <div><p className="font-semibold text-white">{entry.title}</p><p className="text-neutral-400">{entry.body}</p></div>
              </div>
            ))}
          </div>
        );
        break;

      case "blog":
        output = <p>Engineering notes, system-design writeups, and project deep dives: <TerminalLink href="/blog">open /blog ↗</TerminalLink></p>;
        break;

      case "contact":
        output = (
          <div className="space-y-2">
            <p><span className="inline-block w-24 text-neutral-500">Email</span><TerminalLink href="mailto:devanshdubey0012@gmail.com">devanshdubey0012@gmail.com</TerminalLink></p>
            <p><span className="inline-block w-24 text-neutral-500">GitHub</span><TerminalLink href="https://github.com/Devansh0012">@Devansh0012</TerminalLink></p>
            <p><span className="inline-block w-24 text-neutral-500">LinkedIn</span><TerminalLink href="https://www.linkedin.com/in/devanshdubey1/">devanshdubey1</TerminalLink></p>
          </div>
        );
        break;

      case "resume":
        output = <p><TerminalLink href="https://drive.google.com/file/d/1aVRmVG6UTHH9mZdqqRURRYZ4F0LLBrrW/view?usp=sharing">open public resume ↗</TerminalLink></p>;
        break;

      case "open": {
        const target = argument.toLowerCase();
        const project = projects.find((item) => item.title.toLowerCase().includes(target));
        const demoId = target.startsWith("demo:") ? target.slice(5) : target;
        const demo = demos.find((item) => item.id === demoId || item.title.toLowerCase().includes(demoId));
        if (!target) output = <p className="text-red-300">open: missing target. Try `open blog`, `open resume`, or `open demo:rate-limiter`.</p>;
        else if (target === "blog") output = <TerminalLink href="/blog">resolved → /blog ↗</TerminalLink>;
        else if (target === "resume") output = <TerminalLink href="https://drive.google.com/file/d/1aVRmVG6UTHH9mZdqqRURRYZ4F0LLBrrW/view?usp=sharing">resolved → resume ↗</TerminalLink>;
        else if (demo) output = <TerminalLink href={demo.path}>resolved → {demo.title} ↗</TerminalLink>;
        else if (project) output = <TerminalLink href={project.link}>resolved → {project.title} ↗</TerminalLink>;
        else output = <p className="text-amber-300">open: could not resolve “{argument}”.</p>;
        break;
      }

      case "curl":
        if (argument === "/health") output = <JsonOutput value={{ status: "ok", service: "engineering-console", version: "2.0.0", network: networkState }} />;
        else if (argument === "/api/profile") output = <JsonOutput value={{ name: "Devansh Dubey", role: "Software Engineer", focus: ["AI infrastructure", "backend systems", "developer tooling"] }} />;
        else if (argument === "/api/stack") output = <JsonOutput value={Object.fromEntries(skillCategories.map((category) => [category.title, category.items]))} />;
        else output = <p className="text-red-300">curl: endpoint not found. Available: /health, /api/profile, /api/stack</p>;
        break;

      case "game":
        if (argument === "2048" || argument === "tetris") {
          output = <p className="text-emerald-300">Launching {argument}. Press Q or Escape to return to the console.</p>;
          setActiveGame(argument);
        } else output = <p className="text-amber-300">Available games: `game 2048`, `game tetris`</p>;
        break;

      default:
        output = <p className="text-red-300">zsh: command not found: {requestedCommand}. Run <span className="text-cyan-300">help</span> to inspect the command index.</p>;
    }

    addEntry(raw, pathAtExecution, output);
    setCommandHistory((previous) => [...previous.slice(-49), raw]);
    setHistoryCursor(null);
    setCommand("");
  }, [addEntry, commandHistory, currentPath, networkState, renderHelp, startedAt, visitorInfo]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    executeCommand(command);
  }, [command, executeCommand]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!commandHistory.length) return;
      const next = historyCursor === null ? commandHistory.length - 1 : Math.max(0, historyCursor - 1);
      setHistoryCursor(next);
      setCommand(commandHistory[next]);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyCursor === null) return;
      const next = historyCursor + 1;
      if (next >= commandHistory.length) {
        setHistoryCursor(null);
        setCommand("");
      } else {
        setHistoryCursor(next);
        setCommand(commandHistory[next]);
      }
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const tokens = tokenize(command);
      if (tokens.length <= 1) {
        const partial = tokens[0]?.toLowerCase() ?? "";
        const matches = commandNames.filter((name) => name.startsWith(partial));
        if (matches.length === 1) setCommand(`${matches[0]} `);
        else if (matches.length > 1) addEntry(command || "<tab>", currentPath, <p className="text-cyan-300">{matches.join("  ")}</p>);
      }
      return;
    }
    if (event.key.toLowerCase() === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
      return;
    }
    if (event.key.toLowerCase() === "c" && event.ctrlKey) {
      event.preventDefault();
      if (command) addEntry(command, currentPath, <p className="text-neutral-600">^C</p>);
      setCommand("");
    }
  }, [addEntry, command, commandHistory, currentPath, historyCursor]);

  const networkColor = networkState === "online" ? "text-emerald-300" : networkState === "limited" ? "text-amber-300" : "text-neutral-500";
  const prompt = useMemo(() => (
    <span className="whitespace-nowrap">
      <span className="font-semibold text-emerald-300">devansh</span>
      <span className="text-neutral-600">@</span>
      <span className="font-semibold text-cyan-300">portfolio</span>
      <span className="mx-1 text-neutral-700">:</span>
      <span className="text-violet-300">{compactPath}</span>
      <ChevronRight className="ml-1 inline h-3.5 w-3.5 text-cyan-300" />
    </span>
  ), [compactPath]);

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-[#050505] font-mono text-sm text-neutral-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.07),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.06),transparent_32%)]" />

      <header className="relative z-10 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex gap-1.5" aria-hidden="true">
              <Circle className="h-3 w-3 fill-red-400 text-red-400" />
              <Circle className="h-3 w-3 fill-amber-300 text-amber-300" />
              <Circle className="h-3 w-3 fill-emerald-400 text-emerald-400" />
            </div>
            <div className="h-4 w-px bg-white/10" />
            <TerminalIcon className="h-4 w-4 text-cyan-300" />
            <span className="truncate text-xs text-neutral-300">devansh — engineering-console — zsh</span>
          </div>
          <div className="hidden items-center gap-4 text-[11px] sm:flex">
            <span className="flex items-center gap-1.5 text-neutral-500"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> public-safe</span>
            <span className={`flex items-center gap-1.5 ${networkColor}`}><Network className="h-3.5 w-3.5" /> {networkState}</span>
          </div>
        </div>
      </header>

      <main
        ref={terminalRef}
        role="log"
        aria-live="polite"
        onClick={() => inputRef.current?.focus()}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 cursor-text flex-col overflow-y-auto px-4 py-6"
      >
        {!entries.length && !activeGame ? (
          <section className="mb-8 space-y-5">
            <div className="space-y-1 text-xs text-neutral-600">
              <p>[boot] loading portfolio kernel 2.0.0</p>
              <p>[ok] command registry mounted</p>
              <p>[ok] virtual filesystem mounted at ~/</p>
              <p className={networkColor}>[{networkState === "resolving" ? ".." : "ok"}] network context {networkState}</p>
            </div>

            <div className="max-w-4xl rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.035] p-5 shadow-2xl shadow-cyan-950/20">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/70">Engineering console</p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Devansh Dubey</h1>
                  <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-neutral-400">
                    Explore backend systems, AI infrastructure, interactive labs, and technical writing through a developer-first command interface.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs sm:w-64">
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3"><Server className="mb-2 h-4 w-4 text-cyan-300" /><span className="text-neutral-500">Backend</span></div>
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3"><Network className="mb-2 h-4 w-4 text-violet-300" /><span className="text-neutral-500">Protocols</span></div>
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3"><Database className="mb-2 h-4 w-4 text-emerald-300" /><span className="text-neutral-500">Data</span></div>
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3"><Cpu className="mb-2 h-4 w-4 text-amber-300" /><span className="text-neutral-500">Systems</span></div>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs text-neutral-600">Suggested commands</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      executeCommand(suggestion);
                    }}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {activeGame ? (
          <div className="mb-6 rounded-xl border border-white/10 bg-black/60 p-4">
            {activeGame === "2048" ? <Terminal2048 onExit={() => setActiveGame(null)} /> : <TerminalTetris onExit={() => setActiveGame(null)} />}
          </div>
        ) : null}

        <div className="space-y-5">
          {entries.map((entry) => (
            <article key={entry.id} className="space-y-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-semibold text-emerald-300">devansh</span><span className="text-neutral-700">@</span><span className="font-semibold text-cyan-300">portfolio</span><span className="text-neutral-700">:</span><span className="text-violet-300">{displayPath(entry.path)}</span><ChevronRight className="h-3.5 w-3.5 text-cyan-300" /><span className="text-neutral-200">{entry.command}</span>
              </div>
              <div className="pl-0 text-xs leading-relaxed text-neutral-300 sm:pl-4">{entry.output}</div>
            </article>
          ))}
        </div>
      </main>

      <form onSubmit={handleSubmit} className="relative z-10 border-t border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3">
          <div className="hidden text-xs sm:block">{prompt}</div>
          <ChevronRight className="h-4 w-4 shrink-0 text-cyan-300 sm:hidden" />
          <label htmlFor="terminal-command" className="sr-only">Terminal command</label>
          <input
            id="terminal-command"
            ref={inputRef}
            value={command}
            onChange={(event) => {
              setCommand(event.target.value);
              setHistoryCursor(null);
            }}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 bg-transparent text-sm text-neutral-100 caret-cyan-300 outline-none placeholder:text-neutral-700"
            placeholder="Type a command…"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
          <span className="hidden text-[10px] text-neutral-700 md:block">TAB complete · ↑↓ history · CTRL+L clear</span>
          <button
            type="submit"
            aria-label="Run command"
            disabled={!command.trim()}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-cyan-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <footer className="relative z-10 border-t border-white/[0.06] bg-[#070707]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-[10px] uppercase tracking-wider text-neutral-600">
          <div className="flex items-center gap-4"><span className="text-cyan-500/70">portfolio/main</span><span>{compactPath}</span></div>
          <div className="flex items-center gap-4"><span>{entries.length} outputs</span><span className={networkColor}>{networkState}</span></div>
        </div>
      </footer>
    </div>
  );
}
