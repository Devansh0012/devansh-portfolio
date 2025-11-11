"use client";

import { useState, useEffect } from "react";
import { Brain, Trophy, Clock, Zap, BookOpen, Atom, TrendingUp, History as HistoryIcon, Award, User } from "lucide-react";
import { triviaQuestions, getQuestionsByCategory, getPolymathChallenge, calculateQuizScore } from "@/lib/trivia-data";
import type { TriviaQuestion } from "@/lib/polymath-data";

type GameMode = "category" | "polymath" | "timed";
type GameState = "menu" | "playing" | "results";

interface LeaderboardEntry {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  mode: GameMode;
  category?: string;
  date: string;
}

const categoryConfig = {
  technology: { color: "amber", icon: Zap, label: "Technology" },
  physics: { color: "blue", icon: Atom, label: "Physics" },
  economics: { color: "orange", icon: TrendingUp, label: "Economics" },
  history: { color: "emerald", icon: HistoryIcon, label: "History" },
  sports: { color: "violet", icon: Award, label: "Sports" },
  general: { color: "pink", icon: Brain, label: "General" },
};

const difficultyConfig = {
  easy: { color: "emerald", label: "Easy", points: 10 },
  medium: { color: "amber", label: "Medium", points: 20 },
  hard: { color: "red", label: "Hard", points: 30 },
  expert: { color: "purple", label: "Expert", points: 50 },
};

export default function TriviaArena() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("triviaLeaderboard");
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
    const savedName = localStorage.getItem("triviaPlayerName");
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  // Save to leaderboard
  const saveToLeaderboard = (name: string, finalScore: number, maxScore: number, percentage: number) => {
    const entry: LeaderboardEntry = {
      name,
      score: finalScore,
      maxScore,
      percentage,
      mode: gameMode!,
      category: selectedCategory || undefined,
      date: new Date().toISOString(),
    };

    const updated = [...leaderboard, entry]
      .sort((a, b) => b.percentage - a.percentage || b.score - a.score)
      .slice(0, 50); // Keep top 50

    setLeaderboard(updated);
    localStorage.setItem("triviaLeaderboard", JSON.stringify(updated));
    localStorage.setItem("triviaPlayerName", name);
  };

  // Timer effect
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const startGame = (mode: GameMode, category?: string) => {
    setGameMode(mode);
    setGameState("playing");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setShowExplanation(false);
    setSelectedAnswer(null);

    let quizQuestions: TriviaQuestion[] = [];

    if (mode === "category" && category) {
      setSelectedCategory(category);
      quizQuestions = getQuestionsByCategory(category).slice(0, 10);
    } else if (mode === "polymath") {
      quizQuestions = getPolymathChallenge(); // 12 questions, 2 from each category
    } else if (mode === "timed") {
      quizQuestions = [...triviaQuestions].sort(() => Math.random() - 0.5).slice(0, 15);
      setTimeLeft(30);
      setTimerActive(true);
    }

    setQuestions(quizQuestions);
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    if (selectedAnswer === null) {
      handleAnswer(-1); // Mark as incorrect
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return;

    const currentQuestion = questions[currentQuestionIndex];
    setSelectedAnswer(answerIndex);
    setAnswers({ ...answers, [currentQuestion.id]: answerIndex });

    // Calculate score for this question
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + currentQuestion.points);
    }

    setShowExplanation(true);
    setTimerActive(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      
      if (gameMode === "timed") {
        setTimeLeft(30);
        setTimerActive(true);
      }
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState("results");
    setTimerActive(false);
  };

  const resetGame = () => {
    setGameState("menu");
    setGameMode(null);
    setSelectedCategory(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeLeft(30);
    setTimerActive(false);
    setScore(0);
    setScoreSaved(false);
  };

  if (gameState === "menu") {
    if (showLeaderboard) {
      return (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-100">Leaderboard</h2>
              <p className="text-slate-400">Top performers across all game modes</p>
            </div>
            <button
              onClick={() => setShowLeaderboard(false)}
              className="rounded-lg bg-slate-700/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
            >
              Back to Menu
            </button>
          </div>

          {/* Leaderboard */}
          <div className="glass-card rounded-2xl p-6">
            {leaderboard.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Trophy className="mx-auto mb-4 h-12 w-12 text-slate-600" />
                <p>No scores yet. Be the first to play!</p>
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
                          <span className="text-xs text-slate-500">
                            {entry.mode === "polymath" && "Polymath"}
                            {entry.mode === "timed" && "Timed"}
                            {entry.mode === "category" && entry.category && categoryConfig[entry.category as keyof typeof categoryConfig]?.label}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-violet-400">{entry.percentage}%</div>
                      <div className="text-xs text-slate-500">
                        {entry.score}/{entry.maxScore} pts
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
            <Brain className="h-10 w-10 text-violet-400" />
            <h2 className="text-4xl font-bold text-slate-100">Trivia Arena</h2>
          </div>
          <p className="mx-auto max-w-2xl text-slate-300">
            Test your knowledge across technology, physics, economics, history, and sports.
            Choose your challenge mode below.
          </p>
        </div>

        {/* Player Name Input */}
        <div className="glass-card mx-auto max-w-md rounded-xl p-6">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            <User className="mb-1 inline h-4 w-4" /> Player Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Game Modes */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Polymath Challenge */}
          <button
            onClick={() => startGame("polymath")}
            className="glass-card group rounded-2xl p-8 text-left transition-all hover:-translate-y-1 hover:border-violet-500/50"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20">
              <Trophy className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-violet-100">Polymath Challenge</h3>
            <p className="mb-4 text-sm text-slate-300">
              12 questions across all domains. Prove your interdisciplinary mastery.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-400">All Categories</span>
              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-400">Balanced</span>
            </div>
          </button>

          {/* Timed Sprint */}
          <button
            onClick={() => startGame("timed")}
            className="glass-card group rounded-2xl p-8 text-left transition-all hover:-translate-y-1 hover:border-amber-500/50"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-amber-100">Timed Sprint</h3>
            <p className="mb-4 text-sm text-slate-300">
              15 rapid-fire questions with 30 seconds each. Think fast!
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">30s per Q</span>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">High Pressure</span>
            </div>
          </button>

          {/* Category Focus */}
          <div className="glass-card rounded-2xl p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-blue-100">Category Focus</h3>
            <p className="mb-4 text-sm text-slate-300">
              Deep dive into a specific domain. 10 questions per category.
            </p>
            <div className="space-y-2">
              {Object.entries(categoryConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => startGame("category", key)}
                    className={`w-full rounded-lg bg-${config.color}-500/10 px-3 py-2 text-left text-sm font-medium text-${config.color}-400 transition-colors hover:bg-${config.color}-500/20 border border-${config.color}-500/30`}
                  >
                    <Icon className="mr-2 inline-block h-4 w-4" />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* View Leaderboard Button */}
        <div className="text-center">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500/20 to-blue-500/20 px-6 py-3 font-medium text-violet-300 transition-all hover:from-violet-500/30 hover:to-blue-500/30 border border-violet-500/30"
          >
            <Trophy className="h-5 w-5" />
            View Leaderboard
          </button>
        </div>

        {/* Stats */}
        <div className="glass-card rounded-2xl p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-blue-400">{triviaQuestions.length}</div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-violet-400">6</div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Categories</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-amber-400">4</div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Difficulty Levels</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "playing") {
    const currentQuestion = questions[currentQuestionIndex];
    const category = categoryConfig[currentQuestion.category as keyof typeof categoryConfig];
    const difficulty = difficultyConfig[currentQuestion.difficulty as keyof typeof difficultyConfig];
    const CategoryIcon = category.icon;

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Score: {score} pts</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Timer (for timed mode) */}
        {gameMode === "timed" && (
          <div className={`glass-card rounded-2xl p-4 text-center ${timeLeft <= 10 ? 'border-red-500/50 bg-red-950/20' : 'border-slate-700/50'}`}>
            <div className="flex items-center justify-center gap-3">
              <Clock className={`h-5 w-5 ${timeLeft <= 10 ? 'text-red-400' : 'text-slate-400'}`} />
              <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-slate-100'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="glass-card rounded-2xl p-8">
          {/* Category & Difficulty */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className={`flex items-center gap-2 rounded-full bg-${category.color}-500/10 px-4 py-2 text-sm font-medium text-${category.color}-400 border border-${category.color}-500/30`}>
              <CategoryIcon className="h-4 w-4" />
              {category.label}
            </span>
            <span className={`rounded-full bg-${difficulty.color}-500/10 px-4 py-2 text-sm font-medium text-${difficulty.color}-400 border border-${difficulty.color}-500/30`}>
              {difficulty.label} • {currentQuestion.points} pts
            </span>
          </div>

          {/* Question */}
          <h3 className="mb-6 text-2xl font-semibold text-slate-100">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showResult = showExplanation;

              let buttonClass = "glass-card w-full rounded-xl p-4 text-left transition-all hover:bg-slate-800/80";

              if (showResult) {
                if (isCorrect) {
                  buttonClass += " border-emerald-500/50 bg-emerald-950/20";
                } else if (isSelected && !isCorrect) {
                  buttonClass += " border-red-500/50 bg-red-950/20";
                }
              } else if (isSelected) {
                buttonClass += " border-blue-500/50 bg-blue-950/20";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      showResult && isCorrect
                        ? "bg-emerald-500/20 text-emerald-400"
                        : showResult && isSelected && !isCorrect
                        ? "bg-red-500/20 text-red-400"
                        : "bg-slate-700/50 text-slate-400"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-slate-200">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-6 rounded-lg border border-blue-500/30 bg-blue-950/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-400">
                <Brain className="h-4 w-4" />
                Explanation
              </div>
              <p className="text-sm text-blue-200">{currentQuestion.explanation}</p>
              
              {/* Tags */}
              {currentQuestion.tags && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentQuestion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-800/50 px-2 py-1 text-xs text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={nextQuestion}
                className="mt-4 w-full rounded-lg bg-blue-500/20 px-4 py-3 font-medium text-blue-400 transition-colors hover:bg-blue-500/30 border border-blue-500/30"
              >
                {currentQuestionIndex < questions.length - 1 ? "Next Question →" : "View Results →"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === "results") {
    const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / maxScore) * 100);
    const correctCount = Object.entries(answers).filter(([qId, answer]) => {
      const q = questions.find((qu) => qu.id === qId);
      return q && answer === q.correctAnswer;
    }).length;

    let grade = "Novice";
    let gradeColor = "slate";
    if (percentage >= 90) {
      grade = "Polymath";
      gradeColor = "violet";
    } else if (percentage >= 75) {
      grade = "Expert";
      gradeColor = "blue";
    } else if (percentage >= 60) {
      grade = "Proficient";
      gradeColor = "emerald";
    } else if (percentage >= 40) {
      grade = "Intermediate";
      gradeColor = "amber";
    }

    return (
      <div className="space-y-8">
        {/* Results Header */}
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20">
            <Trophy className="h-8 w-8 text-violet-400" />
          </div>
          <h2 className="mb-2 text-4xl font-bold text-slate-100">Quiz Complete!</h2>
          <p className="text-slate-400">
            {gameMode === "polymath" && "Polymath Challenge"}
            {gameMode === "timed" && "Timed Sprint"}
            {gameMode === "category" && `${categoryConfig[selectedCategory as keyof typeof categoryConfig]?.label} Category`}
          </p>
        </div>

        {/* Score Card */}
        <div className="glass-card rounded-2xl p-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-violet-400">{score}</div>
              <div className="text-sm uppercase tracking-wide text-slate-400">Total Points</div>
              <div className="mt-1 text-xs text-slate-500">out of {maxScore}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-blue-400">{percentage}%</div>
              <div className="text-sm uppercase tracking-wide text-slate-400">Accuracy</div>
              <div className="mt-1 text-xs text-slate-500">{correctCount}/{questions.length} correct</div>
            </div>
            <div className="text-center">
              <div className={`mb-2 text-3xl font-bold text-${gradeColor}-400`}>{grade}</div>
              <div className="text-sm uppercase tracking-wide text-slate-400">Grade</div>
              <div className="mt-1 text-xs text-slate-500">
                {percentage >= 90 ? "Outstanding!" : percentage >= 75 ? "Excellent!" : percentage >= 60 ? "Good job!" : "Keep practicing!"}
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown (for polymath) */}
        {gameMode === "polymath" && (
          <div className="glass-card rounded-2xl p-8">
            <h3 className="mb-4 text-xl font-semibold text-slate-100">Category Breakdown</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(categoryConfig).map(([key, config]) => {
                const categoryQuestions = questions.filter((q) => q.category === key);
                const categoryCorrect = categoryQuestions.filter((q) => 
                  answers[q.id] === q.correctAnswer
                ).length;
                const Icon = config.icon;

                return (
                  <div key={key} className="flex items-center justify-between rounded-lg bg-slate-800/50 p-4">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 text-${config.color}-400`} />
                      <span className="font-medium text-slate-200">{config.label}</span>
                    </div>
                    <span className="text-slate-400">
                      {categoryCorrect}/{categoryQuestions.length}
                    </span>
                  </div>
                );
              })}
            </div>
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
                    saveToLeaderboard(playerName.trim(), score, maxScore, percentage);
                    setScoreSaved(true);
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

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={resetGame}
            className="glass-card rounded-lg px-6 py-3 font-medium text-slate-300 transition-colors hover:bg-slate-800"
          >
            Back to Menu
          </button>
          <button
            onClick={() => {
              if (gameMode) startGame(gameMode, selectedCategory || undefined);
            }}
            className="rounded-lg bg-violet-500/20 px-6 py-3 font-medium text-violet-400 transition-colors hover:bg-violet-500/30 border border-violet-500/30"
          >
            Play Again
          </button>
          <button
            onClick={() => {
              setShowLeaderboard(true);
              resetGame();
            }}
            className="rounded-lg bg-blue-500/20 px-6 py-3 font-medium text-blue-400 transition-colors hover:bg-blue-500/30 border border-blue-500/30"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    );
  }

  return null;
}
