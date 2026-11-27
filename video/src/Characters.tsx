import React from "react";
import {Char, Expr} from "./types";
import {INK, tint} from "./palette";

const ink = {stroke: INK, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const};
const SKINS = ["#ffe2c2", "#f5c9a0", "#c99067"];

const Face: React.FC<{cx: number; cy: number; expr: Expr; blink: boolean}> = ({cx, cy, expr, blink}) => {
  const eye = (dx: number) => blink ? <path d={`M${cx + dx - 11} ${cy} h22`} {...ink} fill="none" /> : <ellipse cx={cx + dx} cy={cy} rx={9} ry={expr === "shock" ? 15 : 12} fill={INK} />;
  const brow = (dx: number, s: number) => (expr === "sad" || expr === "worried") ? <path d={`M${cx + dx - 14} ${cy - 22 - s * 8} L${cx + dx + 14} ${cy - 22 + s * 8}`} {...ink} fill="none" strokeWidth={6} /> : null;
  const mouth = expr === "happy" ? <path d={`M${cx - 20} ${cy + 26} q20 24 40 0`} {...ink} fill="#fff" />
    : expr === "sad" ? <path d={`M${cx - 18} ${cy + 40} q18 -22 36 0`} {...ink} fill="none" />
    : expr === "shock" ? <ellipse cx={cx} cy={cy + 38} rx={13} ry={18} fill={INK} />
    : expr === "worried" ? <path d={`M${cx - 16} ${cy + 36} q8 -8 16 0 t16 0`} {...ink} fill="none" />
    : <path d={`M${cx - 14} ${cy + 34} h28`} {...ink} fill="none" />;
  return <g>{eye(-30)}{eye(30)}{brow(-30, 1)}{brow(30, -1)}{mouth}</g>;
};

const Person: React.FC<{c: Char; t: number; i: number}> = ({c, t, i}) => {
  const kid = c.who === "kid"; const woman = c.who === "woman";
  const hs = kid ? 0.85 : 1; const bodyH = kid ? 120 : 190;
  const col = c.color ?? (woman ? "#7b5ac9" : kid ? "#f08a2c" : "#357650");
  const skin = SKINS[i % SKINS.length];
  const walk = c.act === "walk"; const sw = walk ? Math.sin(t * 8 + i) * 22 : 0;
  const bob = c.act === "bounce" ? Math.abs(Math.sin(t * 6 + i)) * -26 : walk ? Math.abs(Math.sin(t * 8 + i)) * -9 : Math.sin(t * 1.6 + i) * -3;
  const blink = (t + i * 0.7) % 3.1 < 0.12;
  const top = 270 - bodyH; // y des Kopfmittelpunkts ~ top-ish
  return (
    <g transform={`translate(0 ${bob})`}>
      <path d={`M-22 ${270} L${-22 - sw} 400 M22 270 L${22 + sw} 400`} {...ink} fill="none" strokeWidth={13} />
      <path d={`M${-22 - sw - 14} 400 h30 M${22 + sw - 16} 400 h30`} {...ink} strokeWidth={13} fill="none" />
      <path d={`M-62 ${270 - bodyH + 40} L${-92 + sw} ${270 - bodyH + 150} M62 ${270 - bodyH + 40} L${92 - sw} ${270 - bodyH + 150}`} {...ink} fill="none" strokeWidth={12} />
      <rect x={-64} y={270 - bodyH} width={128} height={bodyH} rx={34} fill={col} {...ink} />
      {woman && <path d={`M-64 ${270} L-90 ${330} L90 ${330} L64 ${270} Z`} fill={tint(col, 0.9)} {...ink} />}
      <ellipse cx={0} cy={top - 70 * hs} rx={100 * hs} ry={110 * hs} fill={skin} {...ink} />
      {woman && <path d={`M${-100 * hs} ${top - 70} q0 -120 ${100 * hs} -118 q${100 * hs} -2 ${100 * hs} 118 q-30 -60 -${100 * hs} -64 q-${70 * hs} 4 -${100 * hs} 64`} fill="#5a3b2a" {...ink} />}
      {!woman && !kid && <path d={`M${-92 * hs} ${top - 100} q${92 * hs} -90 ${184 * hs} 0 q-${92 * hs} -26 -${184 * hs} 0`} fill="#4a3020" {...ink} />}
      {kid && <path d={`M${-90 * hs} ${top - 100} q${90 * hs} -80 ${180 * hs} 0 z`} fill="#e2453c" {...ink} />}
      <Face cx={0} cy={top - 60 * hs} expr={c.expr ?? "neutral"} blink={blink} />
    </g>
  );
};

const Dog: React.FC<{c: Char; t: number; i: number}> = ({c, t, i}) => {
  const fur = c.color ?? "#b98a55"; const walk = c.act === "walk";
  const sw = walk ? Math.sin(t * 9) * 18 : 0; const wag = Math.sin(t * 12) * 18;
  const bob = c.act === "bounce" ? Math.abs(Math.sin(t * 7)) * -30 : walk ? Math.abs(Math.sin(t * 9)) * -7 : 0;
  return (
    <g transform={`translate(0 ${bob + 110})`}>
      <path d={`M80 190 q70 ${-30 + wag} 90 ${-70 + wag}`} {...ink} fill="none" strokeWidth={26} /><path d={`M80 190 q70 ${-30 + wag} 90 ${-70 + wag}`} stroke={fur} fill="none" strokeWidth={12} strokeLinecap="round" />
      <path d={`M-60 280 L${-60 + sw} 350 M-20 280 L${-20 - sw} 350 M40 280 L${40 - sw} 350 M80 280 L${80 + sw} 350`} {...ink} fill="none" strokeWidth={16} />
      <ellipse cx={10} cy={220} rx={110} ry={74} fill={fur} {...ink} />
      <ellipse cx={-90} cy={150} rx={70} ry={64} fill={fur} {...ink} />
      <path d="M-140 110 q-34 40 -6 96 q30 -10 30 -50 z" fill={tint(fur, 0.7)} {...ink} />
      <ellipse cx={-140} cy={170} rx={34} ry={26} fill={tint(fur, 1.15)} {...ink} />
      <ellipse cx={-166} cy={160} rx={9} ry={7} fill={INK} />
      <ellipse cx={-92} cy={138} rx={8} ry={(t + i) % 3.3 < 0.12 ? 2 : 11} fill={INK} />
      {(c.expr === "sad" || c.expr === "worried") && <path d="M-110 112 l30 14" {...ink} fill="none" strokeWidth={6} />}
      {c.expr === "happy" && <path d="M-166 182 q26 22 52 0" {...ink} fill="#f08a9a" />}
    </g>
  );
};

export const Figure: React.FC<{c: Char; t: number; i: number; gy: number}> = ({c, t, i, gy}) => {
  const s = c.scale ?? 1; const flip = c.flip ? -1 : 1;
  return (
    <g transform={`translate(${c.x * 1080} ${gy}) scale(${s * flip} ${s}) translate(0 -400)`}>
      <ellipse cx={0} cy={410} rx={120} ry={22} fill="#000" opacity={0.18} />
      {c.who === "dog" ? <Dog c={c} t={t} i={i} /> : <Person c={c} t={t} i={i} />}
    </g>
  );
};
