"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Play } from "lucide-react";

class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  x: number = 0;
  y: number = 0;

  constructor(value: number) {
    this.value = value;
  }
}

export default function BSTVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [traversalType, setTraversalType] = useState<
    "inorder" | "preorder" | "postorder"
  >("inorder");
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);

  const insert = (value: number) => {
    const newNode = new TreeNode(value);
    if (!root) {
      setRoot(newNode);
      return;
    }

    const insertNode = (node: TreeNode, newNode: TreeNode): TreeNode => {
      if (newNode.value < node.value) {
        node.left = node.left ? insertNode(node.left, newNode) : newNode;
      } else if (newNode.value > node.value) {
        node.right = node.right ? insertNode(node.right, newNode) : newNode;
      }
      return node;
    };

    const newRoot = { ...root };
    insertNode(newRoot, newNode);
    setRoot(newRoot);
  };

  const deleteNode = (value: number) => {
    const deleteNodeHelper = (
      node: TreeNode | null,
      value: number
    ): TreeNode | null => {
      if (!node) return null;

      if (value < node.value) {
        node.left = deleteNodeHelper(node.left, value);
      } else if (value > node.value) {
        node.right = deleteNodeHelper(node.right, value);
      } else {
        // Node to delete found
        if (!node.left && !node.right) return null;
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        // Node with two children
        let minRight = node.right;
        while (minRight.left) {
          minRight = minRight.left;
        }
        node.value = minRight.value;
        node.right = deleteNodeHelper(node.right, minRight.value);
      }
      return node;
    };

    setRoot(deleteNodeHelper(root, value));
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value) && value >= 0 && value <= 999) {
      insert(value);
      setInputValue("");
    }
  };

  const handleDelete = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      deleteNode(value);
      setInputValue("");
    }
  };

  const calculatePositions = (
    node: TreeNode | null,
    x: number,
    y: number,
    spacing: number
  ) => {
    if (!node) return;

    node.x = x;
    node.y = y;

    if (node.left) {
      calculatePositions(node.left, x - spacing, y + 80, spacing / 2);
    }
    if (node.right) {
      calculatePositions(node.right, x + spacing, y + 80, spacing / 2);
    }
  };

  const animateTraversal = async (type: "inorder" | "preorder" | "postorder") => {
    const result: number[] = [];
    const highlighted: number[] = [];

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const traverse = async (node: TreeNode | null) => {
      if (!node) return;

      if (type === "preorder") {
        highlighted.push(node.value);
        setHighlightedNodes([...highlighted]);
        result.push(node.value);
        setTraversalResult([...result]);
        await sleep(500);
      }

      await traverse(node.left);

      if (type === "inorder") {
        highlighted.push(node.value);
        setHighlightedNodes([...highlighted]);
        result.push(node.value);
        setTraversalResult([...result]);
        await sleep(500);
      }

      await traverse(node.right);

      if (type === "postorder") {
        highlighted.push(node.value);
        setHighlightedNodes([...highlighted]);
        result.push(node.value);
        setTraversalResult([...result]);
        await sleep(500);
      }
    };

    setTraversalResult([]);
    setHighlightedNodes([]);
    await traverse(root);
  };

  const clearTree = () => {
    setRoot(null);
    setTraversalResult([]);
    setHighlightedNodes([]);
  };

  const createSampleTree = () => {
    clearTree();
    [50, 30, 70, 20, 40, 60, 80].forEach((val) => insert(val));
  };

  if (root) {
    calculatePositions(root, 400, 50, 150);
  }

  const renderTree = (node: TreeNode | null): JSX.Element[] => {
    if (!node) return [];

    const elements: JSX.Element[] = [];

    // Draw lines to children
    if (node.left) {
      elements.push(
        <line
          key={`line-left-${node.value}`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
      );
      elements.push(...renderTree(node.left));
    }

    if (node.right) {
      elements.push(
        <line
          key={`line-right-${node.value}`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
      );
      elements.push(...renderTree(node.right));
    }

    // Draw node
    const isHighlighted = highlightedNodes.includes(node.value);
    elements.push(
      <g key={`node-${node.value}`}>
        <circle
          cx={node.x}
          cy={node.y}
          r="25"
          fill={isHighlighted ? "#10b981" : "#06b6d4"}
          stroke="white"
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
          fontSize="16"
          fontWeight="bold"
        >
          {node.value}
        </text>
      </g>
    );

    return elements;
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
                Binary Search Tree Visualizer
              </h1>
              <p className="text-sm text-neutral-400">
                Interactive BST operations and traversals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              placeholder="Enter value (0-999)"
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleInsert}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg font-medium transition-all"
            >
              <Plus className="h-4 w-4" />
              Insert
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>

            <div className="h-6 w-px bg-white/10" />

            <button
              onClick={createSampleTree}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
            >
              Sample Tree
            </button>
            <button
              onClick={clearTree}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <span className="text-sm text-neutral-400">Traversal:</span>
            {(["inorder", "preorder", "postorder"] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setTraversalType(type);
                  animateTraversal(type);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  traversalType === type
                    ? "bg-cyan-500 text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <span className="capitalize">{type}</span>
              </button>
            ))}
            {traversalResult.length > 0 && (
              <div className="ml-4 px-4 py-2 bg-white/10 rounded-lg">
                <span className="text-sm text-neutral-400">Result: </span>
                <span className="text-sm text-white font-mono">
                  [{traversalResult.join(", ")}]
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          {root ? (
            <svg width="800" height="500" className="mx-auto">
              {renderTree(root)}
            </svg>
          ) : (
            <div className="h-[500px] flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <p className="text-lg mb-2">Tree is empty</p>
                <p className="text-sm">
                  Insert values or create a sample tree to get started
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">In-Order</h3>
            <p className="text-sm text-neutral-400">Left → Root → Right</p>
            <p className="text-xs text-neutral-500 mt-2">
              Returns nodes in sorted order
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Pre-Order</h3>
            <p className="text-sm text-neutral-400">Root → Left → Right</p>
            <p className="text-xs text-neutral-500 mt-2">
              Used to copy the tree
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Post-Order</h3>
            <p className="text-sm text-neutral-400">Left → Right → Root</p>
            <p className="text-xs text-neutral-500 mt-2">
              Used to delete the tree
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
