export type ChallengeTest = {
  name: string;
  input: unknown[];
  expected: unknown;
};

export type Challenge = {
  id: string;
  title: string;
  difficulty: "Basic" | "Intermediate" | "Advanced";
  description: string;
  prompt: string;
  starterCode: string;
  functionName: string;
  tests: ChallengeTest[];
};

export type ChallengeSummary = Pick<
  Challenge,
  "id" | "title" | "difficulty" | "description" | "prompt" | "starterCode" | "functionName"
>;

export const challenges: Challenge[] = [
  {
    id: "rate-limiter",
    title: "Implement a token bucket rate limiter",
    difficulty: "Basic",
    description:
      "Given the current number of tokens and refill rate, determine if a request should be allowed and return the updated token count.",
    prompt:
      "Return an object with `allowed` (boolean) and `tokens` (number) after applying a token bucket limiter. The bucket refills by `refill` tokens per request and has maximum capacity `capacity`. Block the request if there are not enough tokens.",
    functionName: "evaluateTokenBucket",
    starterCode: `export function evaluateTokenBucket(tokens: number, capacity: number, refill: number, cost: number) {
  // TODO: return { allowed: boolean, tokens: number }
  return { allowed: true, tokens };
}
`,
    tests: [
      {
        name: "Allows request when tokens available",
        input: [5, 10, 2, 3],
        expected: { allowed: true, tokens: 4 },
      },
      {
        name: "Blocks when insufficient tokens",
        input: [1, 10, 2, 5],
        expected: { allowed: false, tokens: 3 },
      },
      {
        name: "Never exceed capacity",
        input: [9, 10, 5, 1],
        expected: { allowed: true, tokens: 10 },
      },
    ],
  },
  {
    id: "sliding-window",
    title: "Sliding window moving average",
    difficulty: "Intermediate",
    description:
      "Compute the moving average of numeric samples across a fixed window size.",
    prompt:
      "Given an array of numbers and a window size, return an array containing the moving average for each contiguous window.",
    functionName: "slidingWindowAverage",
    starterCode: `export function slidingWindowAverage(samples: number[], windowSize: number) {
  // TODO: return an array of averages rounded to two decimals
  return [];
}
`,
    tests: [
      {
        name: "Basic average",
        input: [[1, 2, 3, 4], 2],
        expected: [1.5, 2.5, 3.5],
      },
      {
        name: "Window equals length",
        input: [[4, 8, 12], 3],
        expected: [8],
      },
      {
        name: "Single element window",
        input: [[5, 6, 7], 1],
        expected: [5, 6, 7],
      },
    ],
  },
  {
    id: "fanout-mapper",
    title: "Broadcast payload fan-out",
    difficulty: "Advanced",
    description:
      "Transform a payload by broadcasting it to multiple subscribers with declarative transforms.",
    prompt:
      "Implement a function that takes a payload string and an array of channel rules. Each rule can add a prefix, suffix, or convert to uppercase. Return the transformed payloads in order.",
    functionName: "broadcastPayload",
    starterCode: `type ChannelRule = {
  prefix?: string;
  suffix?: string;
  uppercase?: boolean;
};

export function broadcastPayload(payload: string, rules: ChannelRule[]) {
  // TODO: return an array of transformed payloads
  return [];
}
`,
    tests: [
      {
        name: "Applies transforms sequentially",
        input: [
          "ping",
          [
            { prefix: "[edge] " },
            { uppercase: true, suffix: " !!!" },
          ],
        ],
        expected: ["[edge] ping", "PING !!!"],
      },
      {
        name: "Handles no subscribers",
        input: ["pong", []],
        expected: [],
      },
      {
        name: "Supports primitive payloads",
        input: [
          "hello",
          [
            { suffix: " world" },
            { prefix: "(prod) ", uppercase: true },
          ],
        ],
        expected: ["hello world", "(prod) HELLO"],
      },
    ],
  },
];

export function getChallengeById(id: string) {
  return challenges.find((challenge) => challenge.id === id) ?? null;
}

export function getChallengeSummaries(): ChallengeSummary[] {
  return challenges.map((challenge) => {
    const { tests: _unused, ...summary } = challenge;
    void _unused;
    return summary;
  });
}
