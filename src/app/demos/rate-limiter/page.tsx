"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Send, RotateCcw, Settings } from "lucide-react";

type Algorithm = "token-bucket" | "leaky-bucket" | "fixed-window";

type Request = {
  id: number;
  timestamp: number;
  status: "pending" | "allowed" | "denied";
};

export default function RateLimiterSimulator() {
  const [algorithm, setAlgorithm] = useState<Algorithm>("token-bucket");
  const [requests, setRequests] = useState<Request[]>([]);
  const [tokens, setTokens] = useState(10);
  const [maxTokens, setMaxTokens] = useState(10);
  const [refillRate, setRefillRate] = useState(2); // tokens per second
  const [requestCount, setRequestCount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_windowStart, setWindowStart] = useState(Date.now());
  const [queue, setQueue] = useState<Request[]>([]);
  const requestIdRef = useRef(0);

  // Token Bucket: Refill tokens
  useEffect(() => {
    if (algorithm !== "token-bucket") return;

    const interval = setInterval(() => {
      setTokens((prev) => Math.min(prev + refillRate / 10, maxTokens));
    }, 100);

    return () => clearInterval(interval);
  }, [algorithm, refillRate, maxTokens]);

  // Leaky Bucket: Process queue
  useEffect(() => {
    if (algorithm !== "leaky-bucket") return;

    const interval = setInterval(() => {
      setQueue((prevQueue) => {
        if (prevQueue.length === 0) return prevQueue;

        const [firstRequest, ...rest] = prevQueue;
        setRequests((prev) =>
          prev.map((req) =>
            req.id === firstRequest.id ? { ...req, status: "allowed" } : req
          )
        );

        return rest;
      });
    }, 1000 / refillRate);

    return () => clearInterval(interval);
  }, [algorithm, refillRate]);

  // Fixed Window: Reset window
  useEffect(() => {
    if (algorithm !== "fixed-window") return;

    const interval = setInterval(() => {
      setRequestCount(0);
      setWindowStart(Date.now());
    }, 5000); // 5 second window

    return () => clearInterval(interval);
  }, [algorithm]);

  const sendRequest = () => {
    const newRequest: Request = {
      id: requestIdRef.current++,
      timestamp: Date.now(),
      status: "pending",
    };

    setRequests((prev) => [...prev, newRequest]);

    setTimeout(() => {
      processRequest(newRequest);
    }, 100);
  };

  const processRequest = (request: Request) => {
    let allowed = false;

    switch (algorithm) {
      case "token-bucket":
        if (tokens >= 1) {
          setTokens((prev) => prev - 1);
          allowed = true;
        }
        break;

      case "leaky-bucket":
        if (queue.length < maxTokens) {
          setQueue((prev) => [...prev, request]);
          return; // Will be processed by queue interval
        }
        break;

      case "fixed-window":
        if (requestCount < maxTokens) {
          setRequestCount((prev) => prev + 1);
          allowed = true;
        }
        break;
    }

    setRequests((prev) =>
      prev.map((req) =>
        req.id === request.id
          ? { ...req, status: allowed ? "allowed" : "denied" }
          : req
      )
    );
  };

  const reset = () => {
    setRequests([]);
    setTokens(maxTokens);
    setRequestCount(0);
    setWindowStart(Date.now());
    setQueue([]);
    requestIdRef.current = 0;
  };

  const sendBurst = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => sendRequest(), i * 100);
    }
  };

  const getStatusColor = (status: Request["status"]) => {
    switch (status) {
      case "allowed":
        return "bg-emerald-500";
      case "denied":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
    }
  };

  const getStatusText = (status: Request["status"]) => {
    switch (status) {
      case "allowed":
        return "✓ Allowed";
      case "denied":
        return "✗ Denied";
      case "pending":
        return "⏳ Pending";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/engineer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">
                Rate Limiter Simulator
              </h1>
              <p className="text-sm text-neutral-400">
                Visualize rate limiting algorithms
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Algorithm Selection */}
            <div className="flex gap-2">
              {(
                ["token-bucket", "leaky-bucket", "fixed-window"] as Algorithm[]
              ).map((algo) => (
                <button
                  key={algo}
                  onClick={() => {
                    setAlgorithm(algo);
                    reset();
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    algorithm === algo
                      ? "bg-cyan-500 text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {algo === "token-bucket"
                    ? "Token Bucket"
                    : algo === "leaky-bucket"
                    ? "Leaky Bucket"
                    : "Fixed Window"}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-white/10" />

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={sendRequest}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg font-medium transition-all"
              >
                <Send className="h-4 w-4" />
                Send Request
              </button>
              <button
                onClick={sendBurst}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
              >
                Send Burst (5)
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-400">Max Capacity:</label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val > 0) setMaxTokens(val);
                }}
                className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-400">
                Rate (req/sec):
              </label>
              <input
                type="number"
                value={refillRate}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val > 0) setRefillRate(val);
                }}
                className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* State Visualization */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Current State</h3>

              {algorithm === "token-bucket" && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-neutral-400">Tokens Available</span>
                      <span className="text-white font-mono">
                        {Math.floor(tokens)}/{maxTokens}
                      </span>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 transition-all duration-100"
                        style={{ width: `${(tokens / maxTokens) * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Tokens refill at {refillRate} per second
                  </p>
                </div>
              )}

              {algorithm === "leaky-bucket" && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-neutral-400">Queue Size</span>
                      <span className="text-white font-mono">
                        {queue.length}/{maxTokens}
                      </span>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 transition-all duration-100"
                        style={{
                          width: `${(queue.length / maxTokens) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Processing {refillRate} requests per second
                  </p>
                </div>
              )}

              {algorithm === "fixed-window" && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-neutral-400">
                        Window Usage
                      </span>
                      <span className="text-white font-mono">
                        {requestCount}/{maxTokens}
                      </span>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all duration-100"
                        style={{
                          width: `${(requestCount / maxTokens) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Window resets every 5 seconds
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Total Requests</span>
                    <span className="text-white">{requests.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">Allowed</span>
                    <span className="text-white">
                      {requests.filter((r) => r.status === "allowed").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">Denied</span>
                    <span className="text-white">
                      {requests.filter((r) => r.status === "denied").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Request Log */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Request Log</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {requests.length === 0 ? (
                  <p className="text-neutral-500 text-sm text-center py-8">
                    No requests yet. Send a request to get started.
                  </p>
                ) : (
                  requests
                    .slice()
                    .reverse()
                    .map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-3 h-3 rounded-full ${getStatusColor(
                              request.status
                            )}`}
                          />
                          <span className="text-sm text-neutral-400">
                            Request #{request.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-neutral-500 font-mono">
                            {new Date(request.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="text-sm text-white">
                            {getStatusText(request.status)}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Token Bucket</h3>
            <p className="text-sm text-neutral-400 mb-2">
              Tokens refill continuously
            </p>
            <p className="text-xs text-neutral-500">
              Allows bursts up to bucket capacity. Good for bursty traffic.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Leaky Bucket</h3>
            <p className="text-sm text-neutral-400 mb-2">
              Processes at fixed rate
            </p>
            <p className="text-xs text-neutral-500">
              Smooths out bursts. Requests queue and process steadily.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Fixed Window</h3>
            <p className="text-sm text-neutral-400 mb-2">
              Counter per time window
            </p>
            <p className="text-xs text-neutral-500">
              Simple but can have boundary issues. Resets at intervals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
