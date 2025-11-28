"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, RotateCcw, Zap } from "lucide-react";

type Algorithm = "bubble" | "quick" | "merge";

const ARRAY_SIZE = 50;
const ANIMATION_SPEED = 10; // ms

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState<Algorithm>("bubble");
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    const newArray = Array.from(
      { length: ARRAY_SIZE },
      () => Math.floor(Math.random() * 400) + 10
    );
    setArray(newArray);
    setComparingIndices([]);
    setSortedIndices([]);
    setSorting(false);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparingIndices([j, j + 1]);
        await sleep(ANIMATION_SPEED);

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }
      setSortedIndices((prev) => [...prev, n - 1 - i]);
    }
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setComparingIndices([]);
  };

  const quickSort = async () => {
    const arr = [...array];
    const sorted: number[] = [];

    const partition = async (low: number, high: number): Promise<number> => {
      const pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        setComparingIndices([j, high]);
        await sleep(ANIMATION_SPEED);

        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      sorted.push(i + 1);
      setSortedIndices([...sorted]);
      return i + 1;
    };

    const quickSortHelper = async (low: number, high: number) => {
      if (low < high) {
        const pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      } else if (low === high) {
        sorted.push(low);
        setSortedIndices([...sorted]);
      }
    };

    await quickSortHelper(0, arr.length - 1);
    setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    setComparingIndices([]);
  };

  const mergeSort = async () => {
    const arr = [...array];

    const merge = async (start: number, mid: number, end: number) => {
      const left = arr.slice(start, mid + 1);
      const right = arr.slice(mid + 1, end + 1);
      let i = 0,
        j = 0,
        k = start;

      while (i < left.length && j < right.length) {
        setComparingIndices([start + i, mid + 1 + j]);
        await sleep(ANIMATION_SPEED);

        if (left[i] <= right[j]) {
          arr[k] = left[i];
          i++;
        } else {
          arr[k] = right[j];
          j++;
        }
        setArray([...arr]);
        k++;
      }

      while (i < left.length) {
        arr[k] = left[i];
        setArray([...arr]);
        i++;
        k++;
      }

      while (j < right.length) {
        arr[k] = right[j];
        setArray([...arr]);
        j++;
        k++;
      }
    };

    const mergeSortHelper = async (start: number, end: number) => {
      if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSortHelper(start, mid);
        await mergeSortHelper(mid + 1, end);
        await merge(start, mid, end);
      }
    };

    await mergeSortHelper(0, arr.length - 1);
    setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    setComparingIndices([]);
  };

  const startSort = async () => {
    setSorting(true);
    setSortedIndices([]);

    switch (algorithm) {
      case "bubble":
        await bubbleSort();
        break;
      case "quick":
        await quickSort();
        break;
      case "merge":
        await mergeSort();
        break;
    }

    setSorting(false);
  };

  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) return "bg-emerald-500";
    if (comparingIndices.includes(index)) return "bg-red-500";
    return "bg-cyan-500";
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
              <h1 className="text-xl font-bold text-white">Sorting Algorithm Visualizer</h1>
              <p className="text-sm text-neutral-400">
                Watch sorting algorithms in action
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Algorithm</span>
            <Zap className="h-4 w-4 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Algorithm Selection */}
            <div className="flex gap-2">
              {(["bubble", "quick", "merge"] as Algorithm[]).map((algo) => (
                <button
                  key={algo}
                  onClick={() => !sorting && setAlgorithm(algo)}
                  disabled={sorting}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    algorithm === algo
                      ? "bg-cyan-500 text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {algo === "bubble"
                    ? "Bubble Sort"
                    : algo === "quick"
                    ? "Quick Sort"
                    : "Merge Sort"}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-white/10" />

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={startSort}
                disabled={sorting}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4" />
                Sort
              </button>
              <button
                onClick={generateArray}
                disabled={sorting}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="h-4 w-4" />
                Randomize
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          <div className="flex items-end justify-center gap-0.5 h-[400px]">
            {array.map((value, index) => (
              <div
                key={index}
                className={`flex-1 transition-all duration-75 ${getBarColor(
                  index
                )} rounded-t`}
                style={{ height: `${value}px` }}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Bubble Sort</h3>
            <p className="text-sm text-neutral-400">
              Time: O(n²) • Space: O(1)
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              Simple but slow. Repeatedly swaps adjacent elements.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Quick Sort</h3>
            <p className="text-sm text-neutral-400">
              Time: O(n log n) • Space: O(log n)
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              Divide and conquer. Fast in practice.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Merge Sort</h3>
            <p className="text-sm text-neutral-400">
              Time: O(n log n) • Space: O(n)
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              Stable sort. Consistent performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
