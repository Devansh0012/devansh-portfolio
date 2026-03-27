"use client";

import { useCallback, useEffect, useState, useRef } from "react";

type Grid = number[][];
type Direction = "up" | "down" | "left" | "right";

const GRID_SIZE = 4;

function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function addRandomTile(grid: Grid): Grid {
  const newGrid = grid.map((row) => [...row]);
  const emptyCells: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (newGrid[r][c] === 0) emptyCells.push([r, c]);
    }
  }
  if (emptyCells.length === 0) return newGrid;
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  newGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

function rotateGrid(grid: Grid): Grid {
  const n = grid.length;
  const rotated = createEmptyGrid();
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      rotated[c][n - 1 - r] = grid[r][c];
    }
  }
  return rotated;
}

function slideLeft(grid: Grid): { grid: Grid; score: number; moved: boolean } {
  let score = 0;
  let moved = false;
  const newGrid = createEmptyGrid();

  for (let r = 0; r < GRID_SIZE; r++) {
    const row = grid[r].filter((v) => v !== 0);
    const merged: number[] = [];

    for (let i = 0; i < row.length; i++) {
      if (i + 1 < row.length && row[i] === row[i + 1]) {
        merged.push(row[i] * 2);
        score += row[i] * 2;
        i++;
      } else {
        merged.push(row[i]);
      }
    }

    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[r][c] = merged[c] || 0;
      if (newGrid[r][c] !== grid[r][c]) moved = true;
    }
  }

  return { grid: newGrid, score, moved };
}

function move(grid: Grid, direction: Direction): { grid: Grid; score: number; moved: boolean } {
  let rotated = grid.map((row) => [...row]);
  const rotations: Record<Direction, number> = { left: 0, down: 1, right: 2, up: 3 };
  const times = rotations[direction];

  for (let i = 0; i < times; i++) rotated = rotateGrid(rotated);

  const result = slideLeft(rotated);

  let final = result.grid;
  for (let i = 0; i < (4 - times) % 4; i++) final = rotateGrid(final);

  return { grid: final, score: result.score, moved: result.moved };
}

function canMove(grid: Grid): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c + 1 < GRID_SIZE && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < GRID_SIZE && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

function hasWon(grid: Grid): boolean {
  return grid.some((row) => row.some((cell) => cell >= 2048));
}

const TILE_COLORS: Record<number, string> = {
  0: "text-neutral-700",
  2: "text-white",
  4: "text-cyan-300",
  8: "text-orange-400",
  16: "text-orange-500",
  32: "text-red-400",
  64: "text-red-500",
  128: "text-yellow-300",
  256: "text-yellow-400",
  512: "text-yellow-500",
  1024: "text-emerald-400",
  2048: "text-emerald-300",
};

function getTileColor(value: number): string {
  return TILE_COLORS[value] || "text-purple-400";
}

type Props = {
  onExit: () => void;
};

export default function Terminal2048({ onExit }: Props) {
  const [grid, setGrid] = useState<Grid>(() => {
    let g = createEmptyGrid();
    g = addRandomTile(g);
    g = addRandomTile(g);
    return g;
  });
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [keepPlaying, setKeepPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleMove = useCallback(
    (direction: Direction) => {
      if (gameState === "lost") return;
      if (gameState === "won" && !keepPlaying) return;

      const result = move(grid, direction);
      if (!result.moved) return;

      const newGrid = addRandomTile(result.grid);
      const newScore = score + result.score;

      setGrid(newGrid);
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);

      if (!keepPlaying && hasWon(newGrid)) {
        setGameState("won");
      } else if (!canMove(newGrid)) {
        setGameState("lost");
      }
    },
    [grid, score, bestScore, gameState, keepPlaying]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "q") {
        e.preventDefault();
        onExit();
        return;
      }

      if (e.key === "r") {
        e.preventDefault();
        let g = createEmptyGrid();
        g = addRandomTile(g);
        g = addRandomTile(g);
        setGrid(g);
        setScore(0);
        setGameState("playing");
        setKeepPlaying(false);
        return;
      }

      if (gameState === "won" && !keepPlaying && e.key === "c") {
        e.preventDefault();
        setKeepPlaying(true);
        setGameState("playing");
        return;
      }

      const directionMap: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };

      const direction = directionMap[e.key];
      if (direction) {
        e.preventDefault();
        handleMove(direction);
      }
    },
    [handleMove, onExit, gameState, keepPlaying]
  );

  const formatCell = (value: number): string => {
    if (value === 0) return "  .   ";
    const s = String(value);
    const pad = 6 - s.length;
    const left = Math.floor(pad / 2);
    const right = pad - left;
    return " ".repeat(left) + s + " ".repeat(right);
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="outline-none font-mono text-sm leading-relaxed"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="text-neutral-500">
          ┌──────────────────────────────────────┐
        </div>
        <div className="flex items-center justify-between px-1">
          <span className="text-emerald-400 font-bold text-base">
            {"  "}2 0 4 8
          </span>
          <span className="text-neutral-400">
            Score: <span className="text-white">{score}</span>
            {"  "}Best: <span className="text-yellow-400">{bestScore}</span>
          </span>
        </div>
        <div className="text-neutral-500">
          ├──────────────────────────────────────┤
        </div>

        {/* Grid */}
        <div className="space-y-0">
          <div className="text-neutral-600">
            {"  "}┌──────┬──────┬──────┬──────┐
          </div>
          {grid.map((row, r) => (
            <div key={r}>
              <div className="flex">
                <span className="text-neutral-600">{"  "}│</span>
                {row.map((cell, c) => (
                  <span key={c}>
                    <span className={`${getTileColor(cell)} ${cell >= 1024 ? "font-bold" : ""}`}>
                      {formatCell(cell)}
                    </span>
                    <span className="text-neutral-600">│</span>
                  </span>
                ))}
              </div>
              {r < GRID_SIZE - 1 && (
                <div className="text-neutral-600">
                  {"  "}├──────┼──────┼──────┼──────┤
                </div>
              )}
            </div>
          ))}
          <div className="text-neutral-600">
            {"  "}└──────┴──────┴──────┴──────┘
          </div>
        </div>

        {/* Game State Messages */}
        {gameState === "won" && !keepPlaying && (
          <div className="space-y-1">
            <p className="text-yellow-400 font-bold">
              {"  "}You reached 2048! You win!
            </p>
            <p className="text-neutral-400">
              {"  "}Press <span className="text-white">c</span> to continue playing or{" "}
              <span className="text-white">r</span> to restart
            </p>
          </div>
        )}
        {gameState === "lost" && (
          <div className="space-y-1">
            <p className="text-red-400 font-bold">
              {"  "}Game Over! No moves left.
            </p>
            <p className="text-neutral-400">
              {"  "}Final score: <span className="text-white">{score}</span>
            </p>
            <p className="text-neutral-400">
              {"  "}Press <span className="text-white">r</span> to restart
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="text-neutral-500">
          ├──────────────────────────────────────┤
        </div>
        <div className="space-y-1 text-neutral-500 text-xs">
          <p>
            {"  "}
            <span className="text-neutral-400">↑↓←→</span> or{" "}
            <span className="text-neutral-400">WASD</span> move{"  "}
            <span className="text-neutral-400">R</span> restart{"  "}
            <span className="text-neutral-400">Q/Esc</span> quit
          </p>
        </div>
        <div className="text-neutral-500">
          └──────────────────────────────────────┘
        </div>
      </div>
    </div>
  );
}
