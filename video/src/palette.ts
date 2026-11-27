import {Light, SetName} from "./types";
export const INK = "#241726";
export const SKY: Record<Light, [string, string]> = {
  day: ["#4d86d6", "#cfe0f3"], golden: ["#f0a96a", "#ffd9a0"], night: ["#16203f", "#3b4a7a"], grey: ["#8d98a6", "#d3d8de"],
};
export const GROUND: Record<SetName, string> = {
  field: "#7da85a", village: "#a9a089", sea: "#2f6fa8", forest: "#4f7a45", snow: "#eef3f8", city: "#8a8d95",
};
export const tint = (c: string, k: number) => {
  const n = parseInt(c.slice(1), 16); const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
};
export const LIGHTK: Record<Light, number> = {day: 1, golden: 0.95, night: 0.55, grey: 0.9};
