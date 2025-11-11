"use client";

import { useState, useEffect } from "react";
import { Shuffle, RotateCcw, Lightbulb, CheckCircle, XCircle, Trophy, User } from "lucide-react";

interface Word {
  text: string;
  group: number;
}

interface Group {
  id: number;
  category: string;
  difficulty: number;
  color: string;
  words: string[];
}

interface LeaderboardEntry {
  name: string;
  puzzleTitle: string;
  groupsSolved: number;
  totalGroups: number;
  mistakes: number;
  percentage: number;
  date: string;
}

// Predefined puzzles
const puzzles = [
  {
    id: 1,
    title: "Tech & Code",
    groups: [
      {
        id: 0,
        category: "Git Commands",
        difficulty: 1,
        color: "bg-amber-500",
        words: ["commit", "push", "pull", "merge"],
      },
      {
        id: 1,
        category: "HTTP Methods",
        difficulty: 2,
        color: "bg-emerald-500",
        words: ["GET", "POST", "PUT", "DELETE"],
      },
      {
        id: 2,
        category: "Data Structures",
        difficulty: 3,
        color: "bg-blue-500",
        words: ["stack", "queue", "tree", "graph"],
      },
      {
        id: 3,
        category: "Database Types",
        difficulty: 4,
        color: "bg-violet-500",
        words: ["SQL", "NoSQL", "Redis", "Mongo"],
      },
    ],
  },
  {
    id: 2,
    title: "Physics & Science",
    groups: [
      {
        id: 0,
        category: "Units of Energy",
        difficulty: 1,
        color: "bg-amber-500",
        words: ["joule", "calorie", "watt", "BTU"],
      },
      {
        id: 1,
        category: "States of Matter",
        difficulty: 2,
        color: "bg-emerald-500",
        words: ["solid", "liquid", "gas", "plasma"],
      },
      {
        id: 2,
        category: "Fundamental Forces",
        difficulty: 3,
        color: "bg-blue-500",
        words: ["gravity", "electromagnetic", "strong", "weak"],
      },
      {
        id: 3,
        category: "Quantum Properties",
        difficulty: 4,
        color: "bg-violet-500",
        words: ["spin", "entanglement", "superposition", "tunneling"],
      },
    ],
  },
  {
    id: 3,
    title: "Startup & Economics",
    groups: [
      {
        id: 0,
        category: "Startup Funding Stages",
        difficulty: 1,
        color: "bg-amber-500",
        words: ["seed", "Series A", "Series B", "IPO"],
      },
      {
        id: 1,
        category: "Business Metrics",
        difficulty: 2,
        color: "bg-emerald-500",
        words: ["CAC", "LTV", "MRR", "churn"],
      },
      {
        id: 2,
        category: "Pricing Models",
        difficulty: 3,
        color: "bg-blue-500",
        words: ["freemium", "SaaS", "usage", "tiered"],
      },
      {
        id: 3,
        category: "Market Strategies",
        difficulty: 4,
        color: "bg-violet-500",
        words: ["moat", "pivot", "disrupt", "scale"],
      },
    ],
  },
  {
    id: 4,
    title: "Sports & Performance",
    groups: [
      {
        id: 0,
        category: "Cricket Positions",
        difficulty: 1,
        color: "bg-amber-500",
        words: ["bowler", "batsman", "wicket", "keeper"],
      },
      {
        id: 1,
        category: "Track Events",
        difficulty: 2,
        color: "bg-emerald-500",
        words: ["sprint", "hurdles", "relay", "marathon"],
      },
      {
        id: 2,
        category: "Performance Metrics",
        difficulty: 3,
        color: "bg-blue-500",
        words: ["VO2max", "lactate", "cadence", "split"],
      },
      {
        id: 3,
        category: "Training Methods",
        difficulty: 4,
        color: "bg-violet-500",
        words: ["HIIT", "tempo", "fartlek", "intervals"],
      },
    ],
  },
];

export default function ConnectionsGame() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [words, setWords] = useState<Word[]>(() => initializeWords(puzzles[0]));
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [solvedGroups, setSolvedGroups] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("connectionsLeaderboard");
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
    const savedName = localStorage.getItem("connectionsPlayerName");
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  // Save to leaderboard
  const saveToLeaderboard = (name: string) => {
    const puzzle = puzzles[currentPuzzle];
    const percentage = Math.round((solvedGroups.length / puzzle.groups.length) * 100);

    const entry: LeaderboardEntry = {
      name,
      puzzleTitle: puzzle.title,
      groupsSolved: solvedGroups.length,
      totalGroups: puzzle.groups.length,
      mistakes,
      percentage,
      date: new Date().toISOString(),
    };

    const updated = [...leaderboard, entry]
      .sort((a, b) => {
        // Sort by percentage first, then by fewer mistakes, then by date
        if (b.percentage !== a.percentage) return b.percentage - a.percentage;
        if (a.mistakes !== b.mistakes) return a.mistakes - b.mistakes;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 50); // Keep top 50

    setLeaderboard(updated);
    localStorage.setItem("connectionsLeaderboard", JSON.stringify(updated));
    localStorage.setItem("connectionsPlayerName", name);
    setScoreSaved(true);
  };

  function initializeWords(puzzle: typeof puzzles[0]): Word[] {
    const allWords: Word[] = [];
    puzzle.groups.forEach((group) => {
      group.words.forEach((word) => {
        allWords.push({ text: word, group: group.id });
      });
    });
    return shuffleArray(allWords);
  }

  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  const toggleWord = (word: string) => {
    const newSelected = new Set(selectedWords);
    if (newSelected.has(word)) {
      newSelected.delete(word);
    } else {
      if (newSelected.size < 4) {
        newSelected.add(word);
      }
    }
    setSelectedWords(newSelected);
  };

  const handleShuffle = () => {
    const unsolvedWords = words.filter((w) => !solvedGroups.includes(w.group));
    const solvedWords = words.filter((w) => solvedGroups.includes(w.group));
    setWords([...solvedWords, ...shuffleArray(unsolvedWords)]);
  };

  const handleDeselectAll = () => {
    setSelectedWords(new Set());
  };

  const handleSubmit = () => {
    if (selectedWords.size !== 4) return;

    const selectedArray = Array.from(selectedWords);
    const selectedWordObjs = selectedArray.map((text) => words.find((w) => w.text === text)!);
    const groups = new Set(selectedWordObjs.map((w) => w.group));

    if (groups.size === 1) {
      // Correct!
      const groupId = Array.from(groups)[0];
      setSolvedGroups([...solvedGroups, groupId]);
      setSelectedWords(new Set());
      
      const puzzle = puzzles[currentPuzzle];
      const group = puzzle.groups.find((g) => g.id === groupId)!;
      setMessage({ text: `${group.category}!`, type: "success" });

      // Check if game won
      if (solvedGroups.length + 1 === puzzle.groups.length) {
        setGameOver(true);
        setMessage({ text: "🎉 Puzzle Complete!", type: "success" });
      }

      setTimeout(() => setMessage(null), 2000);
    } else {
      // Wrong
      setMistakes(mistakes + 1);
      setMessage({ text: "Not quite! Try again.", type: "error" });
      setTimeout(() => setMessage(null), 2000);

      if (mistakes + 1 >= 4) {
        setGameOver(true);
        setMessage({ text: "Game Over! 4 mistakes reached.", type: "error" });
      }
    }
  };

  const handleReset = () => {
    setWords(initializeWords(puzzles[currentPuzzle]));
    setSelectedWords(new Set());
    setSolvedGroups([]);
    setMistakes(0);
    setGameOver(false);
    setMessage(null);
    setScoreSaved(false);
  };

  const handleNextPuzzle = () => {
    const nextIndex = (currentPuzzle + 1) % puzzles.length;
    setCurrentPuzzle(nextIndex);
    setWords(initializeWords(puzzles[nextIndex]));
    setSelectedWords(new Set());
    setSolvedGroups([]);
    setMistakes(0);
    setGameOver(false);
    setMessage(null);
    setScoreSaved(false);
  };

  const puzzle = puzzles[currentPuzzle];

  // Leaderboard View
  if (showLeaderboard) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-100">Leaderboard</h2>
            <p className="text-slate-400">Top performers across all puzzles</p>
          </div>
          <button
            onClick={() => setShowLeaderboard(false)}
            className="rounded-lg bg-slate-700/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
          >
            Back to Game
          </button>
        </div>

        {/* Leaderboard */}
        <div className="glass-card rounded-2xl p-6">
          {leaderboard.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Trophy className="mx-auto mb-4 h-12 w-12 text-slate-600" />
              <p>No scores yet. Be the first to complete a puzzle!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-lg p-4 ${
                    index < 3
                      ? "bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/30"
                      : "bg-slate-800/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                        index === 0
                          ? "bg-amber-500/20 text-amber-400"
                          : index === 1
                          ? "bg-slate-400/20 text-slate-300"
                          : index === 2
                          ? "bg-orange-600/20 text-orange-400"
                          : "bg-slate-700/50 text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{entry.name}</span>
                        <span className="text-xs text-slate-500">{entry.puzzleTitle}</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {entry.mistakes} {entry.mistakes === 1 ? "mistake" : "mistakes"} •{" "}
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-violet-400">{entry.percentage}%</div>
                    <div className="text-xs text-slate-500">
                      {entry.groupsSolved}/{entry.totalGroups} groups
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <h2 className="text-4xl font-bold text-slate-100">Connections</h2>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-violet-500/20 to-blue-500/20 px-3 py-1.5 text-sm font-medium text-violet-300 transition-all hover:from-violet-500/30 hover:to-blue-500/30 border border-violet-500/30"
          >
            <Trophy className="h-4 w-4" />
            Leaderboard
          </button>
        </div>
        <p className="text-slate-300">
          Find groups of four items that share something in common.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Puzzle {currentPuzzle + 1} of {puzzles.length}: <span className="font-semibold">{puzzle.title}</span>
        </p>

        {/* Player Name Input */}
        <div className="mx-auto mt-4 max-w-md">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-center text-sm text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`glass-card rounded-lg p-4 text-center font-medium ${
            message.type === "success"
              ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-400"
              : "border-red-500/50 bg-red-950/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Mistakes Counter */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-slate-400">Mistakes remaining:</span>
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full ${
                i < mistakes ? "bg-red-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Solved Groups */}
      {solvedGroups.length > 0 && (
        <div className="space-y-3">
          {puzzle.groups
            .filter((g) => solvedGroups.includes(g.id))
            .sort((a, b) => a.difficulty - b.difficulty)
            .map((group) => (
              <div
                key={group.id}
                className={`${group.color} rounded-xl p-4 text-white shadow-lg`}
              >
                <div className="mb-2 text-center text-sm font-semibold uppercase tracking-wide">
                  {group.category}
                </div>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  {group.words.map((word) => (
                    <span key={word} className="font-medium">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Word Grid */}
      {!gameOver && (
        <>
          <div className="grid grid-cols-4 gap-3">
            {words
              .filter((w) => !solvedGroups.includes(w.group))
              .map((word) => {
                const isSelected = selectedWords.has(word.text);
                return (
                  <button
                    key={word.text}
                    onClick={() => toggleWord(word.text)}
                    disabled={gameOver}
                    className={`glass-card rounded-xl p-4 text-center font-semibold transition-all hover:scale-105 ${
                      isSelected
                        ? "border-blue-500/50 bg-blue-950/30 text-blue-100"
                        : "text-slate-200 hover:bg-slate-800/80"
                    }`}
                  >
                    {word.text}
                  </button>
                );
              })}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleShuffle}
              disabled={gameOver}
              className="glass-card flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              <Shuffle className="h-4 w-4" />
              Shuffle
            </button>
            <button
              onClick={handleDeselectAll}
              disabled={gameOver || selectedWords.size === 0}
              className="glass-card rounded-lg px-6 py-3 font-medium text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              Deselect All
            </button>
            <button
              onClick={handleSubmit}
              disabled={gameOver || selectedWords.size !== 4}
              className="rounded-lg bg-blue-500/20 px-6 py-3 font-medium text-blue-400 transition-colors hover:bg-blue-500/30 disabled:opacity-50 border border-blue-500/30"
            >
              Submit
            </button>
          </div>
        </>
      )}

      {/* Game Over Actions */}
      {gameOver && (
        <div className="space-y-4">
          {/* Results Summary */}
          <div className="glass-card rounded-2xl bg-gradient-to-r from-violet-500/10 to-blue-500/10 p-6 border border-violet-500/30">
            <div className="text-center">
              <div className="mb-4">
                {solvedGroups.length === puzzle.groups.length ? (
                  <>
                    <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
                    <h3 className="mt-2 text-2xl font-bold text-emerald-400">Puzzle Complete!</h3>
                  </>
                ) : (
                  <>
                    <XCircle className="mx-auto h-12 w-12 text-red-400" />
                    <h3 className="mt-2 text-2xl font-bold text-red-400">Game Over</h3>
                  </>
                )}
              </div>
              <div className="flex justify-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-violet-400">{solvedGroups.length}/{puzzle.groups.length}</div>
                  <div className="text-sm text-slate-400">Groups Solved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">{mistakes}/4</div>
                  <div className="text-sm text-slate-400">Mistakes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-400">{Math.round((solvedGroups.length / puzzle.groups.length) * 100)}%</div>
                  <div className="text-sm text-slate-400">Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Show remaining groups if failed */}
          {mistakes >= 4 && (
            <div className="space-y-3">
              {puzzle.groups
                .filter((g) => !solvedGroups.includes(g.id))
                .sort((a, b) => a.difficulty - b.difficulty)
                .map((group) => (
                  <div
                    key={group.id}
                    className={`${group.color} rounded-xl p-4 text-white opacity-60 shadow-lg`}
                  >
                    <div className="mb-2 text-center text-sm font-semibold uppercase tracking-wide">
                      {group.category}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 text-sm">
                      {group.words.map((word) => (
                        <span key={word} className="font-medium">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Save to Leaderboard */}
          {!scoreSaved && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="mb-4 text-xl font-semibold text-slate-100">Save Your Score</h3>
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="flex-1 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
                <button
                  onClick={() => {
                    if (playerName.trim()) {
                      saveToLeaderboard(playerName.trim());
                    }
                  }}
                  disabled={!playerName.trim()}
                  className="rounded-lg bg-gradient-to-r from-violet-500/20 to-blue-500/20 px-6 py-2 font-medium text-violet-300 transition-all hover:from-violet-500/30 hover:to-blue-500/30 border border-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trophy className="mr-2 inline h-4 w-4" />
                  Save to Leaderboard
                </button>
              </div>
            </div>
          )}

          {scoreSaved && (
            <div className="glass-card rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 p-6 border border-emerald-500/30">
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <Trophy className="h-5 w-5" />
                <span className="font-medium">Score saved to leaderboard!</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleReset}
              className="glass-card flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-slate-300 transition-colors hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
            <button
              onClick={handleNextPuzzle}
              className="rounded-lg bg-violet-500/20 px-6 py-3 font-medium text-violet-400 transition-colors hover:bg-violet-500/30 border border-violet-500/30"
            >
              Next Puzzle →
            </button>
            <button
              onClick={() => setShowLeaderboard(true)}
              className="rounded-lg bg-blue-500/20 px-6 py-3 font-medium text-blue-400 transition-colors hover:bg-blue-500/30 border border-blue-500/30"
            >
              View Leaderboard
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="glass-card rounded-2xl p-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Lightbulb className="h-4 w-4" />
          How to Play
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• Select 4 words that share a common category</p>
          <p>• You have 4 mistakes before the game ends</p>
          <p>• Categories range from straightforward to tricky</p>
          <p>• Each puzzle has {puzzle.groups.length} groups to find</p>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-amber-500" />
            <span className="text-slate-400">Straightforward</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-emerald-500" />
            <span className="text-slate-400">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-blue-500" />
            <span className="text-slate-400">Tricky</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-violet-500" />
            <span className="text-slate-400">Challenging</span>
          </div>
        </div>
      </div>
    </div>
  );
}
