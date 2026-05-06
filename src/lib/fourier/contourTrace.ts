import type { Point } from "./pathSampling";

export function imageDataToBinary(
  imageData: ImageData,
  threshold = 128,
): Uint8Array {
  const { data, width, height } = imageData;
  const bin = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const a = data[i * 4 + 3];
    const lum = (r * 0.299 + g * 0.587 + b * 0.114) * (a / 255);
    bin[i] = lum < threshold ? 1 : 0;
  }
  return bin;
}

export function traceLargestContour(
  bin: Uint8Array,
  width: number,
  height: number,
): Point[] {
  // Moore-neighbor contour tracing on the largest connected foreground region.
  const visited = new Uint8Array(width * height);
  const idx = (x: number, y: number) => y * width + x;

  const components: { size: number; startX: number; startY: number }[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (bin[idx(x, y)] === 1 && visited[idx(x, y)] === 0) {
        const stack: [number, number][] = [[x, y]];
        let size = 0;
        let startX = x;
        let startY = y;
        while (stack.length) {
          const [cx, cy] = stack.pop()!;
          if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
          const i = idx(cx, cy);
          if (visited[i] || bin[i] === 0) continue;
          visited[i] = 1;
          size++;
          if (cy < startY || (cy === startY && cx < startX)) {
            startX = cx;
            startY = cy;
          }
          stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
        }
        components.push({ size, startX, startY });
      }
    }
  }

  if (components.length === 0) return [];
  components.sort((a, b) => b.size - a.size);
  const { startX, startY } = components[0];

  // Moore-neighbor tracing
  const directions: [number, number][] = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];
  const isFg = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < width && y < height && bin[idx(x, y)] === 1;

  const contour: Point[] = [];
  let cx = startX;
  let cy = startY;
  let prevDir = 6; // came from above (north)
  contour.push({ x: cx, y: cy });

  const maxIter = width * height * 4;
  for (let iter = 0; iter < maxIter; iter++) {
    let found = false;
    for (let i = 0; i < 8; i++) {
      const dirIdx = (prevDir + 6 + i) % 8;
      const [dx, dy] = directions[dirIdx];
      const nx = cx + dx;
      const ny = cy + dy;
      if (isFg(nx, ny)) {
        cx = nx;
        cy = ny;
        prevDir = dirIdx;
        contour.push({ x: cx, y: cy });
        found = true;
        break;
      }
    }
    if (!found) break;
    if (cx === startX && cy === startY && contour.length > 2) break;
    if (contour.length > maxIter / 2) break;
  }

  return contour;
}

export async function loadImageToCanvas(
  file: File,
  maxSize = 400,
): Promise<{ imageData: ImageData; width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Failed to load image"));
      el.src = url;
    });
    const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * ratio));
    const h = Math.max(1, Math.round(img.height * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");
    ctx.drawImage(img, 0, 0, w, h);
    return { imageData: ctx.getImageData(0, 0, w, h), width: w, height: h };
  } finally {
    URL.revokeObjectURL(url);
  }
}
