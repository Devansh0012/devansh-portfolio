"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 800;
const SPEED_DECREASE = 50;
const MIN_SPEED = 100;

type Board = number[][];
type Piece = { shape: number[][]; color: number };
type Position = { row: number; col: number };

const PIECES: Piece[] = [
  { shape: [[1, 1, 1, 1]], color: 1 },                          // I - cyan
  { shape: [[1, 1], [1, 1]], color: 2 },                        // O - yellow
  { shape: [[0, 1, 0], [1, 1, 1]], color: 3 },                  // T - purple
  { shape: [[0, 1, 1], [1, 1, 0]], color: 4 },                  // S - green
  { shape: [[1, 1, 0], [0, 1, 1]], color: 5 },                  // Z - red
  { shape: [[1, 0, 0], [1, 1, 1]], color: 6 },                  // J - blue
  { shape: [[0, 0, 1], [1, 1, 1]], color: 7 },                  // L - orange
];

const COLOR_CLASSES: Record<number, string> = {
  0: "text-neutral-800",
  1: "text-cyan-400",
  2: "text-yellow-400",
  3: "text-purple-400",
  4: "text-emerald-400",
  5: "text-red-400",
  6: "text-blue-400",
  7: "text-orange-400",
  8: "text-neutral-600", // ghost piece
};

const BLOCK_CHARS: Record<number, string> = {
  0: "· ",
  1: "██",
  2: "██",
  3: "██",
  4: "██",
  5: "██",
  6: "██",
  7: "██",
  8: "░░",
};

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
}

function randomPiece(): Piece {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)];
  return { shape: p.shape.map((row) => [...row]), color: p.color };
}

function rotatePiece(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

function isValidPosition(board: Board, shape: number[][], pos: Position): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const newRow = pos.row + r;
      const newCol = pos.col + c;
      if (newRow < 0 || newRow >= BOARD_HEIGHT) return false;
      if (newCol < 0 || newCol >= BOARD_WIDTH) return false;
      if (board[newRow][newCol] !== 0) return false;
    }
  }
  return true;
}

function placePiece(board: Board, shape: number[][], pos: Position, color: number): Board {
  const newBoard = board.map((row) => [...row]);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        newBoard[pos.row + r][pos.col + c] = color;
      }
    }
  }
  return newBoard;
}

function clearLines(board: Board): { board: Board; linesCleared: number } {
  const remaining = board.filter((row) => row.some((cell) => cell === 0));
  const linesCleared = BOARD_HEIGHT - remaining.length;
  const emptyRows = Array.from({ length: linesCleared }, () => Array(BOARD_WIDTH).fill(0));
  return { board: [...emptyRows, ...remaining], linesCleared };
}

function getGhostPosition(board: Board, shape: number[][], pos: Position): Position {
  let ghostRow = pos.row;
  while (isValidPosition(board, shape, { row: ghostRow + 1, col: pos.col })) {
    ghostRow++;
  }
  return { row: ghostRow, col: pos.col };
}

const SCORE_TABLE = [0, 100, 300, 500, 800];

type Props = {
  onExit: () => void;
};

export default function TerminalTetris({ onExit }: Props) {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState<Piece>(randomPiece);
  const [nextPiece, setNextPiece] = useState<Piece>(randomPiece);
  const [position, setPosition] = useState<Position>({ row: 0, col: 3 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<"playing" | "paused" | "over">("playing");
  const containerRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store mutable refs for game loop access
  const boardRef = useRef(board);
  const currentPieceRef = useRef(currentPiece);
  const nextPieceRef = useRef(nextPiece);
  const positionRef = useRef(position);
  const scoreRef = useRef(score);
  const linesRef = useRef(lines);
  const levelRef = useRef(level);
  const gameStateRef = useRef(gameState);

  boardRef.current = board;
  currentPieceRef.current = currentPiece;
  nextPieceRef.current = nextPiece;
  positionRef.current = position;
  scoreRef.current = score;
  linesRef.current = lines;
  levelRef.current = level;
  gameStateRef.current = gameState;

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const spawnPiece = useCallback(() => {
    const next = nextPieceRef.current;
    const startPos: Position = { row: 0, col: Math.floor((BOARD_WIDTH - next.shape[0].length) / 2) };

    if (!isValidPosition(boardRef.current, next.shape, startPos)) {
      setGameState("over");
      return;
    }

    setCurrentPiece(next);
    setPosition(startPos);
    setNextPiece(randomPiece());
  }, []);

  const lockPiece = useCallback(() => {
    const newBoard = placePiece(
      boardRef.current,
      currentPieceRef.current.shape,
      positionRef.current,
      currentPieceRef.current.color
    );
    const { board: clearedBoard, linesCleared } = clearLines(newBoard);

    setBoard(clearedBoard);

    if (linesCleared > 0) {
      const newLines = linesRef.current + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;
      setLines(newLines);
      setLevel(newLevel);
      setScore((s) => s + SCORE_TABLE[linesCleared] * levelRef.current);
    }

    // Need to update boardRef before spawning
    boardRef.current = clearedBoard;
    spawnPiece();
  }, [spawnPiece]);

  const tick = useCallback(() => {
    if (gameStateRef.current !== "playing") return;

    const newPos = { row: positionRef.current.row + 1, col: positionRef.current.col };
    if (isValidPosition(boardRef.current, currentPieceRef.current.shape, newPos)) {
      setPosition(newPos);
    } else {
      lockPiece();
    }
  }, [lockPiece]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") {
      if (tickRef.current) clearTimeout(tickRef.current);
      return;
    }

    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - (level - 1) * SPEED_DECREASE);

    const loop = () => {
      tick();
      tickRef.current = setTimeout(loop, speed);
    };

    tickRef.current = setTimeout(loop, speed);

    return () => {
      if (tickRef.current) clearTimeout(tickRef.current);
    };
  }, [gameState, level, tick]);

  const hardDrop = useCallback(() => {
    const ghost = getGhostPosition(boardRef.current, currentPieceRef.current.shape, positionRef.current);
    const dropDistance = ghost.row - positionRef.current.row;
    setScore((s) => s + dropDistance * 2);
    setPosition(ghost);
    // Lock immediately after state update
    const newBoard = placePiece(boardRef.current, currentPieceRef.current.shape, ghost, currentPieceRef.current.color);
    const { board: clearedBoard, linesCleared } = clearLines(newBoard);
    setBoard(clearedBoard);

    if (linesCleared > 0) {
      const newLines = linesRef.current + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;
      setLines(newLines);
      setLevel(newLevel);
      setScore((s) => s + SCORE_TABLE[linesCleared] * levelRef.current);
    }

    boardRef.current = clearedBoard;
    spawnPiece();
  }, [spawnPiece]);

  const restart = useCallback(() => {
    setBoard(createEmptyBoard());
    boardRef.current = createEmptyBoard();
    const first = randomPiece();
    const second = randomPiece();
    setCurrentPiece(first);
    setNextPiece(second);
    setPosition({ row: 0, col: Math.floor((BOARD_WIDTH - first.shape[0].length) / 2) });
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameState("playing");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" || (e.key === "q" && gameState !== "playing")) {
        e.preventDefault();
        onExit();
        return;
      }

      if (e.key === "r" && gameState === "over") {
        e.preventDefault();
        restart();
        return;
      }

      if (e.key === "p") {
        e.preventDefault();
        setGameState((s) => (s === "playing" ? "paused" : s === "paused" ? "playing" : s));
        return;
      }

      if (gameState !== "playing") return;

      const piece = currentPieceRef.current;
      const pos = positionRef.current;

      switch (e.key) {
        case "ArrowLeft":
        case "a": {
          e.preventDefault();
          const newPos = { row: pos.row, col: pos.col - 1 };
          if (isValidPosition(boardRef.current, piece.shape, newPos)) {
            setPosition(newPos);
          }
          break;
        }
        case "ArrowRight":
        case "d": {
          e.preventDefault();
          const newPos = { row: pos.row, col: pos.col + 1 };
          if (isValidPosition(boardRef.current, piece.shape, newPos)) {
            setPosition(newPos);
          }
          break;
        }
        case "ArrowDown":
        case "s": {
          e.preventDefault();
          const newPos = { row: pos.row + 1, col: pos.col };
          if (isValidPosition(boardRef.current, piece.shape, newPos)) {
            setPosition(newPos);
            setScore((s) => s + 1);
          }
          break;
        }
        case "ArrowUp":
        case "w": {
          e.preventDefault();
          const rotated = rotatePiece(piece.shape);
          if (isValidPosition(boardRef.current, rotated, pos)) {
            setCurrentPiece({ ...piece, shape: rotated });
          } else {
            // Wall kick: try shifting left/right
            for (const offset of [-1, 1, -2, 2]) {
              const kickPos = { row: pos.row, col: pos.col + offset };
              if (isValidPosition(boardRef.current, rotated, kickPos)) {
                setCurrentPiece({ ...piece, shape: rotated });
                setPosition(kickPos);
                break;
              }
            }
          }
          break;
        }
        case " ": {
          e.preventDefault();
          hardDrop();
          break;
        }
      }
    },
    [gameState, onExit, restart, hardDrop]
  );

  // Build display board with current piece and ghost
  const displayBoard = board.map((row) => [...row]);
  if (gameState !== "over") {
    // Draw ghost
    const ghostPos = getGhostPosition(board, currentPiece.shape, position);
    for (let r = 0; r < currentPiece.shape.length; r++) {
      for (let c = 0; c < currentPiece.shape[r].length; c++) {
        if (currentPiece.shape[r][c]) {
          const gr = ghostPos.row + r;
          const gc = ghostPos.col + c;
          if (gr >= 0 && gr < BOARD_HEIGHT && gc >= 0 && gc < BOARD_WIDTH && displayBoard[gr][gc] === 0) {
            displayBoard[gr][gc] = 8; // ghost color
          }
        }
      }
    }
    // Draw current piece (overwrites ghost if overlapping)
    for (let r = 0; r < currentPiece.shape.length; r++) {
      for (let c = 0; c < currentPiece.shape[r].length; c++) {
        if (currentPiece.shape[r][c]) {
          const pr = position.row + r;
          const pc = position.col + c;
          if (pr >= 0 && pr < BOARD_HEIGHT && pc >= 0 && pc < BOARD_WIDTH) {
            displayBoard[pr][pc] = currentPiece.color;
          }
        }
      }
    }
  }

  // Render next piece preview
  const renderNextPiece = () => {
    const shape = nextPiece.shape;
    const maxRows = 4;
    const maxCols = 4;
    const lines: React.ReactElement[] = [];
    for (let r = 0; r < maxRows; r++) {
      const cells: React.ReactElement[] = [];
      for (let c = 0; c < maxCols; c++) {
        const hasBlock = r < shape.length && c < shape[0].length && shape[r][c];
        cells.push(
          <span key={c} className={hasBlock ? COLOR_CLASSES[nextPiece.color] : "text-neutral-900"}>
            {hasBlock ? "██" : "  "}
          </span>
        );
      }
      lines.push(<div key={r}>{cells}</div>);
    }
    return lines;
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="outline-none font-mono text-sm leading-none select-none"
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="text-neutral-500">
          ┌─ TETRIS ─────────────────────────────┐
        </div>

        <div className="flex gap-4">
          {/* Board */}
          <div>
            <div className="text-neutral-600">
              {"  "}╔{"══".repeat(BOARD_WIDTH)}╗
            </div>
            {displayBoard.map((row, r) => (
              <div key={r} className="leading-[1.1]">
                <span className="text-neutral-600">{"  "}║</span>
                {row.map((cell, c) => (
                  <span key={c} className={COLOR_CLASSES[cell]}>
                    {BLOCK_CHARS[cell]}
                  </span>
                ))}
                <span className="text-neutral-600">║</span>
              </div>
            ))}
            <div className="text-neutral-600">
              {"  "}╚{"══".repeat(BOARD_WIDTH)}╝
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-3 min-w-[100px]">
            <div>
              <p className="text-neutral-500 text-xs">NEXT</p>
              <div className="mt-1 leading-[1.1]">{renderNextPiece()}</div>
            </div>

            <div>
              <p className="text-neutral-500 text-xs">SCORE</p>
              <p className="text-white font-bold">{score}</p>
            </div>

            <div>
              <p className="text-neutral-500 text-xs">LINES</p>
              <p className="text-cyan-400">{lines}</p>
            </div>

            <div>
              <p className="text-neutral-500 text-xs">LEVEL</p>
              <p className="text-yellow-400">{level}</p>
            </div>

            {gameState === "paused" && (
              <p className="text-yellow-400 font-bold text-xs animate-pulse">PAUSED</p>
            )}
            {gameState === "over" && (
              <div>
                <p className="text-red-400 font-bold text-xs">GAME OVER</p>
                <p className="text-neutral-500 text-xs mt-1">
                  <span className="text-white">R</span> restart
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="text-neutral-500">
          ├──────────────────────────────────────┤
        </div>
        <div className="space-y-0.5 text-neutral-500 text-xs">
          <p>
            {"  "}
            <span className="text-neutral-400">←→</span> move{"  "}
            <span className="text-neutral-400">↑</span> rotate{"  "}
            <span className="text-neutral-400">↓</span> soft drop{"  "}
            <span className="text-neutral-400">Space</span> hard drop
          </p>
          <p>
            {"  "}
            <span className="text-neutral-400">P</span> pause{"  "}
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
