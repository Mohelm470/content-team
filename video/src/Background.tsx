import React from "react";
import {Light, SetName} from "./types";
import {GROUND, INK, LIGHTK, SKY, tint} from "./palette";

const W = 1080, H = 1920, HOR = 1180; // Horizont-Höhe
const ink = {stroke: INK, strokeWidth: 6, strokeLinejoin: "round" as const};

const hills = (c: string, y: number, amp: number, seed: number) => {
  let d = `M-200 ${H} L-200 ${y}`;
  for (let x = -200; x <= W + 200; x += 100) d += ` L${x} ${y - amp * (0.5 + 0.5 * Math.sin(x * 0.006 + seed) * Math.cos(x * 0.0023 + seed * 2))}`;
  return <path d={d + ` L${W + 200} ${H} Z`} fill={c} {...ink} />;
};

const House = ({x, y, s, c, roof}: {x: number; y: number; s: number; c: string; roof: string}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-90} y={-130} width={180} height={130} fill={c} {...ink} />
    <path d="M-110 -130 L0 -220 L110 -130 Z" fill={roof} {...ink} />
    <rect x={-20} y={-80} width={40} height={80} fill={tint(c, 0.6)} {...ink} />
    <rect x={40} y={-105} width={32} height={32} fill="#f3e3a6" {...ink} />
    <rect x={-72} y={-105} width={32} height={32} fill="#f3e3a6" {...ink} />
  </g>
);
const Pine = ({x, y, s, c}: {x: number; y: number; s: number; c: string}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-12} y={-30} width={24} height={40} fill="#5a3b2a" {...ink} />
    <path d="M-80 -30 L0 -190 L80 -30 Z" fill={c} {...ink} />
    <path d="M-60 -110 L0 -250 L60 -110 Z" fill={tint(c, 1.1)} {...ink} />
  </g>
);
const Tower = ({x, y, w, h, c}: {x: number; y: number; w: number; h: number; c: string}) => (
  <g>
    <rect x={x} y={y - h} width={w} height={h} fill={c} {...ink} />
    {Array.from({length: Math.floor(h / 70)}).map((_, i) => <rect key={i} x={x + 18} y={y - h + 20 + i * 70} width={w - 36} height={26} fill="#f3e3a6" opacity={0.85} />)}
  </g>
);

export const Background: React.FC<{set: SetName; light: Light; px: number; py: number; t: number}> = ({set, light, px, py, t}) => {
  const k = LIGHTK[light]; const [top, hor] = SKY[light]; const g = tint(GROUND[set], k);
  const L = (d: number) => `translate(${px * d} ${py * d})`; // Parallax
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0}}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={hor} /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sky)" />
      {light === "night" && Array.from({length: 40}).map((_, i) => <circle key={i} cx={(i * 197) % W} cy={(i * 131) % 700} r={3 + (i % 3)} fill="#fff7d6" opacity={0.5 + 0.5 * Math.sin(t * 2 + i)} />)}
      {(light === "day" || light === "golden") && <circle cx={light === "golden" ? 760 : 250} cy={light === "golden" ? 1000 : 360} r={90} fill={light === "golden" ? "#fff0c4" : "#fff8dc"} opacity={0.95} />}
      <g transform={L(0.15)}>
        {[0, 1, 2].map((i) => <ellipse key={i} cx={(i * 420 + t * 12) % 1500 - 200} cy={300 + i * 120} rx={150} ry={42} fill="#ffffff" opacity={light === "night" ? 0.12 : 0.7} />)}
      </g>
      <g transform={L(0.3)}>{hills(tint(set === "snow" ? "#c9d7e6" : "#7f9fb8", k), HOR - 60, 140, 1)}</g>
      {set === "city" && <g transform={L(0.4)}>{[0, 1, 2, 3, 4, 5].map((i) => <Tower key={i} x={i * 190 - 40} y={HOR + 10} w={140} h={260 + ((i * 97) % 220)} c={tint("#6e7488", k)} />)}</g>}
      {set === "forest" && <g transform={L(0.5)}>{[0, 1, 2, 3, 4, 5, 6].map((i) => <Pine key={i} x={i * 170 - 30} y={HOR + 30} s={1.2 + (i % 3) * 0.2} c={tint("#355f3a", k)} />)}</g>}
      {set === "village" && <g transform={L(0.5)}>{[0, 1, 2].map((i) => <House key={i} x={140 + i * 400} y={HOR + 40} s={1.3 + (i % 2) * 0.3} c={tint(["#e8d3a8", "#d9a88a", "#cfd8c0"][i], k)} roof={tint("#a8473a", k)} />)}</g>}
      {set === "sea" && <g transform={L(0.5)}><rect x={-200} y={HOR - 20} width={W + 400} height={H} fill={tint("#3b86bd", k)} {...ink} /></g>}
      <g transform={L(0.7)}>
        {set === "sea" ? null : hills(g, HOR + 40, 60, 3)}
        {set === "field" && <><Pine x={120} y={HOR + 80} s={1} c={tint("#4a7a3f", k)} /><Pine x={950} y={HOR + 90} s={0.9} c={tint("#4a7a3f", k)} /></>}
      </g>
      <rect x={-200} y={HOR + 120} width={W + 400} height={H} fill={g} stroke={INK} strokeWidth={6} />
      {set === "sea" && Array.from({length: 14}).map((_, i) => <path key={i} d={`M${(i * 140 + t * 40) % 1300 - 100} ${HOR + 160 + (i % 5) * 120} q40 -22 80 0 t80 0`} stroke="#d9efff" strokeWidth={6} fill="none" strokeLinecap="round" />)}
      {set === "snow" && Array.from({length: 60}).map((_, i) => <circle key={i} cx={(i * 173 + Math.sin(t + i) * 20) % W} cy={((i * 97 + t * 160) % H)} r={4 + (i % 3) * 2} fill="#fff" opacity={0.85} />)}
      {light === "night" && <rect width={W} height={H} fill="#0a1030" opacity={0.28} />}
    </svg>
  );
};
export const GROUND_Y = HOR + 520; // Fußlinie der Figuren
