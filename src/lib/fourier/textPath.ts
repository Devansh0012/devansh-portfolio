import { imageDataToBinary, traceLargestContour } from "./contourTrace";
import type { Point } from "./pathSampling";

export function textToPath(
  text: string,
  options: { fontSize?: number; fontFamily?: string; fontWeight?: string } = {},
): Point[] {
  const fontSize = options.fontSize ?? 220;
  const fontFamily = options.fontFamily ?? "Arial, sans-serif";
  const fontWeight = options.fontWeight ?? "bold";
  const trimmed = text.length > 0 ? text : " ";

  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  if (!measureCtx) throw new Error("Canvas context unavailable");
  measureCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const metrics = measureCtx.measureText(trimmed);
  const width = Math.max(1, Math.ceil(metrics.width) + fontSize);
  const height = Math.ceil(fontSize * 1.6);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#000000";
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(trimmed, width / 2, height / 2);

  const imageData = ctx.getImageData(0, 0, width, height);
  const bin = imageDataToBinary(imageData, 128);
  return traceLargestContour(bin, width, height);
}
