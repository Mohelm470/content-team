// Looks (Farb-/Strich-Stil pro Video), Licht-Stimmung, Szenenstil-Vorgaben und Zufall mit Seed.
import React from "react";
import {Cam, Light, LookName, SceneStyle, Trans} from "./types";

// ---------- Farben ----------
const hex2rgb = (c: string) => { const n = parseInt(c.replace("#", "").padEnd(6, "0").slice(0, 6), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const rgb2hex = (r: number, g: number, b: number) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
export const mix = (a: string, b: string, k: number) => { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k); };
export const tint = (c: string, k: number) => { const A = hex2rgb(c); return rgb2hex(A[0] * k, A[1] * k, A[2] * k); };
const sat = (c: string, k: number) => { const [r, g, b] = hex2rgb(c); const l = 0.3 * r + 0.59 * g + 0.11 * b; return rgb2hex(l + (r - l) * k, l + (g - l) * k, l + (b - l) * k); };

// ---------- Looks ----------
export type LookDef = {
  ink: string; line: number;            // Strichfarbe, Strichstärke-Faktor
  satK: number; tintTo: string; tintK: number; bright: number; // Farbkorrektur für ALLE Farben
  texture: "paper" | "halftone" | "lines" | "dots" | "none"; vignette: number;
  cel: boolean;                          // Schattenhälfte auf Körpern
  cap: {font: string; fill: string; active: string; stroke: string; mode: "stroke" | "box" | "pop" | "tilt"; size: number; group: number; upper: boolean};
};
export const LOOKS: Record<LookName, LookDef> = {
  paper:  {ink: "#2a1d1a", line: 1, satK: 0.9, tintTo: "#f3e2c0", tintK: 0.12, bright: 1, texture: "paper", vignette: 0.35, cel: false,
           cap: {font: "Lilita One", fill: "#fffaf0", active: "#ffcf3f", stroke: "#2a1d1a", mode: "stroke", size: 96, group: 3, upper: false}},
  pop:    {ink: "#16121f", line: 1.15, satK: 1.25, tintTo: "#ffffff", tintK: 0, bright: 1.04, texture: "halftone", vignette: 0.15, cel: true,
           cap: {font: "Bangers", fill: "#ffffff", active: "#ff4f7a", stroke: "#16121f", mode: "tilt", size: 112, group: 3, upper: true}},
  dusk:   {ink: "#1d1430", line: 1, satK: 1.0, tintTo: "#6a3d8f", tintK: 0.16, bright: 0.95, texture: "dots", vignette: 0.5, cel: true,
           cap: {font: "Anton", fill: "#ffffff", active: "#ffb547", stroke: "#1d1430", mode: "stroke", size: 104, group: 4, upper: true}},
  chalk:  {ink: "#f4f1e8", line: 0.85, satK: 0.7, tintTo: "#24323a", tintK: 0.28, bright: 0.85, texture: "lines", vignette: 0.45, cel: false,
           cap: {font: "Lilita One", fill: "#f4f1e8", active: "#9fe3c6", stroke: "#1b252b", mode: "box", size: 92, group: 3, upper: false}},
  mono:   {ink: "#111111", line: 1.1, satK: 0.15, tintTo: "#d8cfbf", tintK: 0.1, bright: 1.02, texture: "halftone", vignette: 0.55, cel: true,
           cap: {font: "Anton", fill: "#ffffff", active: "#e0392b", stroke: "#111111", mode: "stroke", size: 108, group: 3, upper: true}},
  pastel: {ink: "#4a3a5c", line: 0.8, satK: 0.75, tintTo: "#ffe9f2", tintK: 0.22, bright: 1.06, texture: "dots", vignette: 0.1, cel: false,
           cap: {font: "Lilita One", fill: "#ffffff", active: "#7a5cff", stroke: "#4a3a5c", mode: "pop", size: 98, group: 3, upper: false}},
  ember:  {ink: "#1a0f0c", line: 1.05, satK: 1.1, tintTo: "#ff7a2f", tintK: 0.14, bright: 0.97, texture: "paper", vignette: 0.6, cel: true,
           cap: {font: "Anton", fill: "#fff3e0", active: "#ffd23f", stroke: "#1a0f0c", mode: "box", size: 100, group: 4, upper: true}},
};

// ---------- Licht ----------
export type LightDef = {sky: [string, string, string]; amb: string; ambK: number; k: number; sun?: {x: number; y: number; r: number; c: string}; moon?: boolean; stars?: boolean; rays?: boolean; glow?: string};
export const LIGHTS: Record<Light, LightDef> = {
  day:    {sky: ["#3f7fd6", "#7fb2ec", "#d6e8f7"], amb: "#ffffff", ambK: 0, k: 1, sun: {x: 0.24, y: 0.17, r: 85, c: "#fff6cf"}},
  golden: {sky: ["#e98a5a", "#f6b977", "#ffe3a8"], amb: "#ff9a3c", ambK: 0.14, k: 0.97, sun: {x: 0.72, y: 0.5, r: 110, c: "#fff1c2"}, rays: true},
  night:  {sky: ["#0b1230", "#1d2b5c", "#3a4b84"], amb: "#1b2a66", ambK: 0.42, k: 0.62, moon: true, stars: true},
  grey:   {sky: ["#7c8694", "#a7b0bb", "#d2d7dd"], amb: "#8a96a8", ambK: 0.22, k: 0.9},
  dawn:   {sky: ["#5b6fb8", "#d99ab8", "#ffd6b0"], amb: "#e38fb0", ambK: 0.12, k: 0.95, sun: {x: 0.3, y: 0.55, r: 95, c: "#ffe7cf"}},
  dusk:   {sky: ["#2b1c52", "#9c4c7c", "#ff9b62"], amb: "#7d3f86", ambK: 0.22, k: 0.82, sun: {x: 0.66, y: 0.58, r: 120, c: "#ffc27a"}, stars: true},
  storm:  {sky: ["#1f2530", "#3e4757", "#6b7586"], amb: "#3b4658", ambK: 0.35, k: 0.72},
  lamp:   {sky: ["#2a1a14", "#5a3522", "#8a5a34"], amb: "#ff9f4a", ambK: 0.2, k: 0.85, glow: "#ffcf7a"},
};

// ---------- Szenenstil-Vorgaben (wenn die Szene nichts angibt) ----------
export type StyleDef = {trans: Trans[]; cams: Cam[]; charK: number; camK: number; dur?: number};
export const STYLES: Record<SceneStyle, StyleDef> = {
  "wide-epic":       {trans: ["fade", "zoom", "cut"], cams: ["pull", "drift", "left", "up"], charK: 0.8, camK: 0.8},
  "close-emotional": {trans: ["fade", "blink", "cut"], cams: ["focus", "push", "still-ish"], charK: 1.25, camK: 0.7},
  "storybook":       {trans: ["iris", "wipe", "ink"], cams: ["drift", "push", "right"], charK: 1.0, camK: 0.6},
  "documentary":     {trans: ["cut", "flash", "slide"], cams: ["push", "dolly", "left"], charK: 1.0, camK: 1.0},
  "fast-cut":        {trans: ["whip", "cut", "zoom", "flash"], cams: ["whip", "shake", "push", "dolly"], charK: 1.1, camK: 1.4},
};

// ---------- Zufall mit Seed (gleiches Video = gleiches Bild, anderes Video = andere Details) ----------
export const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
export const rng = (seed: number) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

// ---------- Kontext: eine Farbfunktion für alles ----------
export type Ctx = {look: LookDef; light: LightDef; c: (hex: string) => string; skin: (hex: string) => string; ink: string; lw: (w: number) => number; seed: number};
export const makeCtx = (look: LookDef, light: LightDef, seed: number): Ctx => {
  const cache = new Map<string, string>();
  const c = (h: string) => {
    let v = cache.get(h); if (v) return v;
    v = mix(h, light.amb, light.ambK); v = tint(v, light.k); v = sat(v, look.satK); v = mix(v, look.tintTo, look.tintK); v = tint(v, look.bright);
    cache.set(h, v); return v;
  };
  // Haut: nur halb eingefärbt, damit Gesichter auch bei Nacht/Dämmerung lesbar bleiben
  const skin = (h: string) => mix(c(h), h, 0.45);
  return {look, light, c, skin, ink: look.ink, lw: (w) => w * look.line, seed};
};
export const StyleCtx = React.createContext<Ctx>(makeCtx(LOOKS.paper, LIGHTS.day, 1));
export const useS = () => React.useContext(StyleCtx);
export const inkProps = (s: Ctx, w = 6) => ({stroke: s.ink, strokeWidth: s.lw(w), strokeLinejoin: "round" as const, strokeLinecap: "round" as const});
