import type { Point } from "./pathSampling";

export function samplePointsFromSvg(svgText: string, samples = 800): Point[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  const svg = doc.documentElement;
  if (!svg || svg.nodeName !== "svg") {
    throw new Error("Invalid SVG");
  }

  const hostSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  hostSvg.style.position = "absolute";
  hostSvg.style.left = "-99999px";
  hostSvg.style.top = "-99999px";
  hostSvg.setAttribute("width", "1000");
  hostSvg.setAttribute("height", "1000");
  document.body.appendChild(hostSvg);

  try {
    const pathEls: SVGGeometryElement[] = [];

    svg.querySelectorAll("path, polygon, polyline, circle, ellipse, rect, line").forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const clone = document.createElementNS("http://www.w3.org/2000/svg", tag);
      for (const attr of Array.from(el.attributes)) {
        clone.setAttribute(attr.name, attr.value);
      }
      hostSvg.appendChild(clone);
      pathEls.push(clone as SVGGeometryElement);
    });

    if (pathEls.length === 0) {
      throw new Error("No drawable paths found in SVG");
    }

    const lengths = pathEls.map((el) => {
      try {
        return el.getTotalLength();
      } catch {
        return 0;
      }
    });
    const totalLen = lengths.reduce((a, b) => a + b, 0);
    if (totalLen === 0) throw new Error("Paths have zero length");

    const points: Point[] = [];
    for (let i = 0; i < pathEls.length; i++) {
      const el = pathEls[i];
      const len = lengths[i];
      const share = Math.max(2, Math.round((len / totalLen) * samples));
      for (let s = 0; s < share; s++) {
        const t = (s / share) * len;
        const pt = el.getPointAtLength(t);
        points.push({ x: pt.x, y: pt.y });
      }
    }
    return points;
  } finally {
    hostSvg.remove();
  }
}
