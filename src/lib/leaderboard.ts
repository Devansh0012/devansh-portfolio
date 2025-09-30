import { randomUUID } from "node:crypto";
import type { Challenge } from "@/lib/challenges";
import { getChallengeById } from "@/lib/challenges";

export type LeaderboardEntry = {
  id: string;
  challengeId: string;
  challengeTitle: string;
  handle: string;
  score: number;
  testsPassed: number;
  totalTests: number;
  runtimeMs: number;
  submittedAt: string;
};

const globalSymbol = Symbol.for("arena.leaderboard");
type LeaderboardStore = {
  entries: LeaderboardEntry[];
};

const getStore = (): LeaderboardStore => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalAny = globalThis as any;
  if (!globalAny[globalSymbol]) {
    globalAny[globalSymbol] = { entries: [] } satisfies LeaderboardStore;
  }
  return globalAny[globalSymbol] as LeaderboardStore;
};

export function addLeaderboardEntry(params: {
  challenge: Challenge;
  handle: string;
  score: number;
  testsPassed: number;
  totalTests: number;
  runtimeMs: number;
}) {
  const store = getStore();
  const entry: LeaderboardEntry = {
    id: randomUUID(),
    challengeId: params.challenge.id,
    challengeTitle: params.challenge.title,
    handle: params.handle,
    score: params.score,
    testsPassed: params.testsPassed,
    totalTests: params.totalTests,
    runtimeMs: params.runtimeMs,
    submittedAt: new Date().toISOString(),
  };

  store.entries.push(entry);
  store.entries.sort((a, b) => {
    if (a.score === b.score) {
      if (a.runtimeMs === b.runtimeMs) {
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      }
      return a.runtimeMs - b.runtimeMs;
    }
    return b.score - a.score;
  });
  store.entries = store.entries.slice(0, 20);
  return store.entries;
}

export function getLeaderboard(challengeId?: string) {
  const store = getStore();
  if (!challengeId) {
    return store.entries;
  }
  return store.entries.filter((entry) => entry.challengeId === challengeId);
}

export function getChallengeSummary(challengeId: string) {
  return getChallengeById(challengeId);
}
