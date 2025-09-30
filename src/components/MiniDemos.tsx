"use client";

import { useMemo, useState } from "react";
import { Gauge, Send, ServerCrash } from "lucide-react";

const recipients = [
  { id: "rate-limiter", name: "Edge API", latency: 12 },
  { id: "activity-stream", name: "Activity Stream", latency: 28 },
  { id: "webhook", name: "Partner Webhooks", latency: 45 },
];

export default function MiniDemos() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <RateLimiterDemo />
      <BroadcastDemo />
    </div>
  );
}

function RateLimiterDemo() {
  const [requestsPerSecond, setRequestsPerSecond] = useState(70);
  const burstCapacity = 90;
  const sustainedLimit = 75;

  const status = useMemo(() => {
    if (requestsPerSecond <= sustainedLimit) {
      return {
        label: "Stable",
        message: "Traffic well within sustained budget. Tokens replenishing smoothly.",
        tone: "text-emerald-300",
      } as const;
    }

    if (requestsPerSecond <= burstCapacity) {
      return {
        label: "Burst",
        message: "Consuming burst tokens. Monitoring latency spikes.",
        tone: "text-yellow-300",
      } as const;
    }

    return {
      label: "Throttling",
      message: "Queueing excess load. Back-pressure rules activated.",
      tone: "text-red-300",
    } as const;
  }, [requestsPerSecond]);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-emerald-500/20 bg-slate-950/70 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-emerald-400/80">
        <Gauge className="h-4 w-4" />
        <span>Token bucket</span>
      </div>
      <h3 className="mt-3 text-2xl font-semibold text-emerald-100">Rate limiter visualizer</h3>
      <p className="mt-2 text-sm text-emerald-200/80">
        Drag to simulate incoming traffic. Watch how the limiter responds across sustained and burst windows.
      </p>

      <div className="mt-6 space-y-4">
        <label className="flex items-center justify-between text-sm" htmlFor="requests-range">
          <span className="text-emerald-200/80">Requests / second</span>
          <span className="font-semibold text-emerald-100">{requestsPerSecond}</span>
        </label>
        <input
          id="requests-range"
          type="range"
          min={20}
          max={130}
          value={requestsPerSecond}
          onChange={(event) => setRequestsPerSecond(Number(event.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded bg-emerald-500/30 accent-emerald-400"
        />
        <progress
          value={requestsPerSecond}
          max={burstCapacity}
          className="h-3 w-full overflow-hidden rounded-full border border-emerald-500/30 bg-emerald-500/10"
        />
        <div className="flex items-center justify-between text-xs text-emerald-300/80">
          <span>Sustained {sustainedLimit} r/s</span>
          <span>Burst {burstCapacity} r/s</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-black/70 p-4 text-sm">
        <p className={status.tone}>
          {status.label}
        </p>
        <p className="mt-1 text-emerald-200/80">{status.message}</p>
      </div>
    </div>
  );
}

type BroadcastMessage = {
  id: string;
  body: string;
  timestamp: string;
};

function BroadcastDemo() {
  const [message, setMessage] = useState("What's the latency budget?");
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      {
        id: `${Date.now()}`,
        body: message.trim(),
        timestamp,
      },
      ...prev,
    ]);
    setMessage("");
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-emerald-500/20 bg-slate-950/70 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-emerald-400/80">
        <ServerCrash className="h-4 w-4" />
        <span>Broadcast bus</span>
      </div>
      <h3 className="mt-3 text-2xl font-semibold text-emerald-100">Chat broadcast simulator</h3>
      <p className="mt-2 text-sm text-emerald-200/80">
        Simulates a fan-out across services. Messages dispatch simultaneously to subscribers with varying latency.
      </p>

      <div className="mt-6 space-y-3 text-sm">
        {recipients.map((recipient) => (
          <div
            key={recipient.id}
            className="flex items-center justify-between rounded-2xl border border-emerald-500/15 bg-black/70 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-emerald-100">{recipient.name}</p>
              <p className="text-xs text-emerald-200/70">Latency target: {recipient.latency}ms</p>
            </div>
            <span className="text-xs font-semibold text-emerald-300/90">listening…</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Publish a message"
            aria-label="Broadcast message"
            className="flex-1 rounded-xl border border-emerald-500/30 bg-black/70 px-4 py-3 text-sm text-emerald-100 placeholder:text-emerald-500/50 focus:border-emerald-300 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow transition hover:-translate-y-0.5 hover:bg-emerald-300"
          >
            <Send className="h-4 w-4" />
            Broadcast
          </button>
        </div>
        <div className="max-h-48 overflow-y-auto rounded-2xl border border-emerald-500/20 bg-black/50 p-4 text-sm [scrollbar-width:none]">
          {messages.length === 0 ? (
            <p className="text-emerald-200/60">Messages will appear here with dispatch timestamps.</p>
          ) : (
            <ul className="space-y-3">
              {messages.map((msg) => (
                <li key={msg.id} className="rounded-xl border border-emerald-500/20 bg-slate-950/80 p-3">
                  <p className="text-emerald-100">{msg.body}</p>
                  <p className="mt-1 text-xs text-emerald-200/60">{msg.timestamp}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
