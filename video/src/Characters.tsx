// Figuren: Menschen (Alter, Statur, Kleidung, Haare, Hut, Extras, Posen, Gesichter) und Tiere.
// Fußpunkt = (0,0). Alles aus Daten (Char in types.ts).
import React, {useId} from "react";
import {Char, Expr, Pose} from "./types";
import {Ctx, inkProps, tint, useS} from "./style";
import {PropShape} from "./Props";

const SKINS = ["#ffe2c2", "#f5c9a0", "#d9a477", "#b07a52", "#7d5236"];
const HAIRS = ["#3b2618", "#6b4a2b", "#c98d3a", "#1e1a1a", "#9a3b22", "#d8d2c8"];
const ANIMALS = new Set(["dog", "cat", "horse", "bird"]);
const D = Math.PI / 180;

type Dims = {legL: number; torsoH: number; W: number; headR: number; old: boolean; kid: boolean};
export const dims = (c: Char): Dims => {
  const b = c.build === "slim" ? 0.86 : c.build === "broad" ? 1.2 : 1;
  switch (c.who) {
    case "kid": return {legL: 85, torsoH: 125, W: 108 * b, headR: 90, old: false, kid: true};
    case "baby": return {legL: 45, torsoH: 90, W: 104 * b, headR: 82, old: false, kid: true};
    case "teen": return {legL: 125, torsoH: 168, W: 116 * b, headR: 94, old: false, kid: false};
    case "oldman": case "oldwoman": return {legL: 128, torsoH: 185, W: 130 * b, headR: 98, old: true, kid: false};
    default: return {legL: 140, torsoH: 195, W: (c.who === "woman" ? 120 : 132) * b, headR: 100, old: false, kid: false};
  }
};
// Kopfoberkante relativ zum Fußpunkt (für Sprechblasen und Kamera "focus")
export const headTop = (c: Char) => {
  if (c.who === "dog") return -260; if (c.who === "cat") return -230; if (c.who === "horse") return -560; if (c.who === "bird") return -140;
  const d = dims(c); const low = c.pose === "sit" ? d.legL * 0.55 : c.pose === "kneel" ? d.legL * 0.45 : 0;
  return -(d.legL + d.torsoH + d.headR * 2) + low + 20;
};

// ---------- Gesicht ----------
export const Face: React.FC<{cx: number; cy: number; r: number; expr: Expr; blink: boolean; look?: Char["look"]; t: number; s: Ctx}> = ({cx, cy, r, expr, blink, look, t, s}) => {
  const k = inkProps(s, 6); const q = r / 100;
  const lx = look === "left" ? -10 : look === "right" ? 10 : 0; const ly = look === "up" ? -8 : look === "down" ? 8 : 0;
  const ex = 32 * q, ey = cy;
  const closed = blink || expr === "sleepy";
  const eye = (dx: number) => {
    const x = cx + dx * ex + lx, y = ey + ly;
    if (expr === "laugh" || (expr === "happy" && !blink)) return <path d={`M${x - 13} ${y + 4} q13 -18 26 0`} {...k} fill="none" />;
    if (expr === "love") return <path d={`M${x} ${y + 12} l-15 -15 a8 8 0 0 1 15 -8 a8 8 0 0 1 15 8 z`} fill="#e8466a" {...inkProps(s, 3)} />;
    if (closed) return <path d={`M${x - 13} ${y + (expr === "sleepy" ? 4 : 0)} h26`} {...k} fill="none" />;
    if (expr === "angry" || expr === "determined") return <g><ellipse cx={x} cy={y} rx={9 * q + 1} ry={9 * q + 1} fill={s.ink} /></g>;
    const big = expr === "shock" || expr === "scared";
    return <g><ellipse cx={x} cy={y} rx={big ? 15 : 10} ry={big ? 17 : 13} fill={big ? "#fff" : s.ink} {...(big ? inkProps(s, 4) : {})} />{big && <circle cx={x + lx * 0.4} cy={y + 2} r={6} fill={s.ink} />}<circle cx={x - 3} cy={y - 4} r={3} fill="#fff" opacity={big ? 0 : 0.9} /></g>;
  };
  const brow = (dx: number) => {
    const x = cx + dx * ex, y = ey - 26 * q;
    const tilt = expr === "sad" || expr === "worried" || expr === "cry" || expr === "scared" ? -1 : expr === "angry" || expr === "determined" ? 1 : expr === "shock" ? 0 : null;
    if (tilt === null) return null;
    const up = expr === "shock" ? -10 : 0;
    return <path d={`M${x - 15} ${y + up + tilt * dx * 7} L${x + 15} ${y + up - tilt * dx * 7}`} {...k} fill="none" strokeWidth={s.lw(7)} />;
  };
  const my = cy + 38 * q;
  const mouth =
    expr === "happy" || expr === "love" ? <path d={`M${cx - 22} ${my - 6} q22 26 44 0 z`} {...k} fill="#fff" /> :
    expr === "laugh" ? <path d={`M${cx - 26} ${my - 10} q26 44 52 0 z`} {...k} fill="#8a2a33" /> :
    expr === "sad" ? <path d={`M${cx - 18} ${my + 6} q18 -20 36 0`} {...k} fill="none" /> :
    expr === "cry" ? <path d={`M${cx - 20} ${my + 8} q20 -26 40 0 z`} {...k} fill="#8a2a33" /> :
    expr === "shock" || expr === "scared" ? <ellipse cx={cx} cy={my + 4} rx={13} ry={18 + Math.sin(t * 20) * (expr === "scared" ? 2 : 0)} fill="#8a2a33" {...k} /> :
    expr === "worried" ? <path d={`M${cx - 18} ${my} q9 -9 18 0 t18 0`} {...k} fill="none" /> :
    expr === "angry" ? <path d={`M${cx - 18} ${my + 6} q18 -14 36 0`} {...k} fill="none" strokeWidth={s.lw(8)} /> :
    expr === "determined" ? <path d={`M${cx - 16} ${my} h32`} {...k} fill="none" strokeWidth={s.lw(8)} /> :
    expr === "smirk" ? <path d={`M${cx - 14} ${my + 2} q20 4 32 -12`} {...k} fill="none" /> :
    expr === "sleepy" ? <ellipse cx={cx + 4} cy={my} rx={8} ry={6} fill={s.ink} /> :
    <path d={`M${cx - 14} ${my} q14 6 28 0`} {...k} fill="none" />;
  const tears = expr === "cry" ? [-1, 1].map((d) => <path key={d} d={`M${cx + d * ex + d * 4} ${ey + 14} q${d * 6} ${30 + ((t * 60) % 40)} 0 ${60 + ((t * 60) % 40)}`} stroke="#7fc3ff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.9} />) : null;
  const blush = expr === "happy" || expr === "love" || expr === "laugh" ? [-1, 1].map((d) => <ellipse key={d} cx={cx + d * 58 * q} cy={cy + 22 * q} rx={16 * q} ry={9 * q} fill="#ff7f8f" opacity={0.45} />) : null;
  const sweat = expr === "scared" || expr === "worried" ? <path d={`M${cx + 66 * q} ${cy - 50 * q} q10 18 0 26 q-10 -8 0 -26 z`} fill="#9fd8ff" {...inkProps(s, 3)} /> : null;
  return <g>{blush}{eye(-1)}{eye(1)}{brow(-1)}{brow(1)}{mouth}{tears}{sweat}</g>;
};

// ---------- Arm-Winkel pro Pose: [oben, unten] in Grad, 0 = hängt, + = nach außen, − = nach innen ----------
const ARMS: Record<Pose, [[number, number], [number, number]]> = {
  stand: [[12, 6], [12, 6]], wave: [[12, 6], [135, 175]], point: [[12, 6], [82, 88]], armsup: [[150, 168], [150, 168]],
  hug: [[38, -92], [38, -92]], think: [[30, -95], [22, -150]], facepalm: [[14, 6], [24, -168]], hold: [[18, -62], [18, -62]],
  sit: [[18, 40], [18, 40]], kneel: [[20, -40], [20, -40]], salute: [[12, 6], [100, -140]], reach: [[12, 6], [140, 150]],
  cross: [[30, -98], [30, -98]], pocket: [[22, -28], [22, -28]], lie: [[12, 6], [12, 6]],
};

const Limb: React.FC<{pts: [number, number][]; w: number; col: string; s: Ctx}> = ({pts, w, col, s}) => {
  const d = "M" + pts.map((p) => p.join(" ")).join(" L");
  return <g><path d={d} stroke={s.ink} strokeWidth={w + s.lw(12)} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
};

const outfitCol: Record<string, string> = {shirt: "#357650", coat: "#6b4a3a", dress: "#7b5ac9", uniform: "#5c6b3c", overalls: "#3d5f9a", suit: "#2f3546", sweater: "#c0504d", apron: "#4e7fa8", hoodie: "#e0833a", robe: "#8a6aa8"};

const Person: React.FC<{c: Char; t: number; i: number; expr: Expr}> = ({c, t, i, expr}) => {
  const s = useS(); const k = inkProps(s, 7); const id = useId().replace(/:/g, "");
  const d = dims(c); const pose: Pose = c.pose ?? "stand";
  const woman = c.who === "woman" || c.who === "oldwoman";
  const outfit = c.outfit ?? (woman ? "dress" : c.who === "kid" ? "sweater" : c.who === "oldman" ? "coat" : c.who === "baby" ? "overalls" : "shirt");
  const col = s.c(c.color ?? (c.who === "kid" && !c.color ? "#f08a2c" : outfitCol[outfit]));
  const pants = s.c(c.color2 ?? (outfit === "uniform" ? "#4f5c33" : outfit === "suit" ? "#2a2f3d" : "#3e4a66"));
  const skin = s.skin(SKINS[(c.skin ?? i) % SKINS.length]);
  const hairC = s.c(c.hairColor ?? (d.old ? "#d8d2c8" : (c.skin ?? i) % SKINS.length >= 3 ? "#1e1a1a" : HAIRS[(i * 3 + 1) % 5]));
  const hair = c.hair ?? (woman ? (d.old ? "bun" : "long") : c.who === "baby" ? "none" : c.who === "kid" ? "short" : d.old ? "bald" : "short");
  const hat = c.hat ?? "none"; const ex = new Set(c.extra ?? (d.old && c.who === "oldman" ? ["glasses", "mustache"] : []));

  const walk = c.act === "walk" || c.act === "run"; const run = c.act === "run";
  const sp = run ? 13 : 8; const sw = walk ? Math.sin(t * sp + i) * (run ? 38 : 24) : 0;
  const low = pose === "sit" ? d.legL * 0.55 : pose === "kneel" ? d.legL * 0.45 : 0;
  const bob = c.act === "bounce" ? -Math.abs(Math.sin(t * 6 + i)) * 30 : walk ? -Math.abs(Math.sin(t * sp + i)) * (run ? 16 : 8) : c.act === "breathe" ? Math.sin(t * 2 + i) * 4 : 0;
  const shiver = c.act === "shiver" ? Math.sin(t * 50) * 4 : 0;
  const hipY = -d.legL + low; const shY = hipY - d.torsoH; const headY = shY - d.headR * 0.82;
  const nod = c.act === "nod" ? Math.max(0, Math.sin(t * 5)) * 10 : 0;
  const stoop = d.old ? 12 : 0;
  const blink = (t + i * 0.7) % 3.3 < 0.12;

  // Beine
  const hx = d.W * 0.22;
  const legs = pose === "sit"
    ? [[[-hx, hipY], [-hx - 30, hipY + 20], [-hx - 30, 0]], [[hx, hipY], [hx + 30, hipY + 20], [hx + 30, 0]]]
    : pose === "kneel" ? [[[-hx, hipY], [-hx - 20, -10], [-hx + 40, 0]], [[hx, hipY], [hx + 40, hipY + 60], [hx + 40, 0]]]
    : [[[-hx, hipY], [-hx - sw, 0]], [[hx, hipY], [hx + sw, 0]]];
  const legW = d.kid ? 26 : 30;
  const longSkirt = outfit === "dress" || outfit === "robe" || outfit === "coat";

  // Arme
  const [La, Ra] = ARMS[pose]; const armL = d.kid ? 0.72 : 1;
  const swing = (pose === "stand" || pose === "hold") && walk ? sw * 0.9 : pose === "stand" ? Math.sin(t * 1.5 + i) * 3 : 0;
  const wave = pose === "wave" ? Math.sin(t * 11) * 22 : 0;
  const arm = (side: number, a: [number, number], extra: number) => {
    const sx = side * (d.W / 2 - 10), sy = shY + 28;
    const a1 = (a[0] + extra) * D, a2 = (a[1] + extra + (side > 0 ? wave : 0)) * D;
    const ex2 = sx + side * Math.sin(a1) * 80 * armL, ey2 = sy + Math.cos(a1) * 80 * armL;
    const hx2 = ex2 + side * Math.sin(a2) * 78 * armL, hy2 = ey2 + Math.cos(a2) * 78 * armL;
    return {pts: [[sx, sy], [ex2, ey2], [hx2, hy2]] as [number, number][], hand: [hx2, hy2]};
  };
  const AL = arm(-1, La, -swing * 0.6), AR = arm(1, Ra, swing * 0.6);
  const sleeve = outfit === "apron" || outfit === "overalls" ? s.c(c.color2 ?? "#e8e0d0") : col;

  const torsoBottom = longSkirt ? hipY + (outfit === "robe" ? d.legL - 20 : outfit === "dress" ? Math.min(70, d.legL * 0.6) : 50) : hipY + 10;
  const tw = d.W / 2;
  const torsoPath = outfit === "dress" || outfit === "robe"
    ? `M${-tw + 6} ${shY + 20} Q${-tw + 6} ${shY} ${-tw + 30} ${shY} H${tw - 30} Q${tw - 6} ${shY} ${tw - 6} ${shY + 20} L${tw + 34} ${torsoBottom} H${-tw - 34} Z`
    : `M${-tw} ${shY + 34} Q${-tw} ${shY} ${-tw + 34} ${shY} H${tw - 34} Q${tw} ${shY} ${tw} ${shY + 34} V${torsoBottom - 20} Q${tw} ${torsoBottom} ${tw - 20} ${torsoBottom} H${-tw + 20} Q${-tw} ${torsoBottom} ${-tw} ${torsoBottom - 20} Z`;

  const hr = d.headR; const hcx = stoop * 0.6, hcy = headY + nod + stoop * 0.4;
  const hand = (p: number[]) => <circle cx={p[0]} cy={p[1]} r={d.kid ? 14 : 17} fill={skin} {...inkProps(s, 5)} />;
  const held = c.hold ? <g transform={`translate(${pose === "hold" ? (AL.hand[0] + AR.hand[0]) / 2 : AR.hand[0]} ${(pose === "hold" ? (AL.hand[1] + AR.hand[1]) / 2 : AR.hand[1]) + 50}) scale(0.55)`}><PropShape kind={c.hold} t={t} /></g> : null;

  const hairBack = hair === "long" ? <path d={`M${hcx - hr * 1.02} ${hcy - 10} Q${hcx - hr * 1.15} ${hcy + hr * 1.3} ${hcx - hr * 0.6} ${hcy + hr * 1.25} H${hcx + hr * 0.6} Q${hcx + hr * 1.15} ${hcy + hr * 1.3} ${hcx + hr * 1.02} ${hcy - 10} Z`} fill={hairC} {...k} />
    : hair === "ponytail" ? <path d={`M${hcx + hr * 0.7} ${hcy - hr * 0.5} q${hr * 0.9} ${hr * 0.1 + Math.sin(t * 3) * 6} ${hr * 0.6} ${hr * 1.1} q-${hr * 0.4} -${hr * 0.3} -${hr * 0.5} -${hr * 0.9} z`} fill={hairC} {...k} />
    : hat === "hood" ? <ellipse cx={hcx} cy={hcy + 6} rx={hr * 1.22} ry={hr * 1.18} fill={tint(col, 0.85)} {...k} /> : null;
  const hairTop = hat !== "none" && hat !== "hood" ? null
    : hair === "short" || hair === "long" || hair === "ponytail" ? <path d={`M${hcx - hr * 0.98} ${hcy - hr * 0.1} Q${hcx - hr} ${hcy - hr * 1.12} ${hcx} ${hcy - hr * 1.08} Q${hcx + hr} ${hcy - hr * 1.12} ${hcx + hr * 0.98} ${hcy - hr * 0.1} Q${hcx + hr * 0.5} ${hcy - hr * 0.72} ${hcx - hr * 0.1} ${hcy - hr * 0.6} Q${hcx - hr * 0.6} ${hcy - hr * 0.55} ${hcx - hr * 0.98} ${hcy - hr * 0.1} Z`} fill={hairC} {...k} />
    : hair === "bun" ? <g><circle cx={hcx} cy={hcy - hr * 1.12} r={hr * 0.36} fill={hairC} {...k} /><path d={`M${hcx - hr * 0.97} ${hcy - hr * 0.15} Q${hcx} ${hcy - hr * 1.5} ${hcx + hr * 0.97} ${hcy - hr * 0.15} Q${hcx} ${hcy - hr * 0.75} ${hcx - hr * 0.97} ${hcy - hr * 0.15} Z`} fill={hairC} {...k} /></g>
    : hair === "curly" ? <g>{[-0.85, -0.5, -0.12, 0.25, 0.6, 0.9].map((u, j) => <circle key={j} cx={hcx + u * hr} cy={hcy - hr * (0.75 + 0.25 * Math.cos(u * 1.6))} r={hr * 0.34} fill={hairC} {...k} />)}</g>
    : hair === "spiky" ? <path d={`M${hcx - hr * 0.95} ${hcy - hr * 0.3} l${hr * 0.1} -${hr * 0.75} l${hr * 0.3} ${hr * 0.25} l${hr * 0.25} -${hr * 0.55} l${hr * 0.25} ${hr * 0.45} l${hr * 0.3} -${hr * 0.5} l${hr * 0.2} ${hr * 0.55} l${hr * 0.35} -${hr * 0.2} l${hr * 0.05} ${hr * 0.75} Q${hcx} ${hcy - hr * 0.6} ${hcx - hr * 0.95} ${hcy - hr * 0.3} Z`} fill={hairC} {...k} />
    : hair === "bald" ? <path d={`M${hcx - hr * 0.98} ${hcy - hr * 0.05} q${hr * 0.12} -${hr * 0.35} ${hr * 0.22} -${hr * 0.3} M${hcx + hr * 0.98} ${hcy - hr * 0.05} q-${hr * 0.12} -${hr * 0.35} -${hr * 0.22} -${hr * 0.3}`} stroke={hairC} strokeWidth={18} fill="none" strokeLinecap="round" />
    : null;
  const hc = s.c(c.hatColor ?? (hat === "helmet" ? "#5c6b3c" : hat === "beanie" ? "#c0504d" : hat === "headscarf" ? "#c76a8a" : hat === "beret" ? "#2a2a3a" : "#7a5434"));
  const hatEl = hat === "cap" ? <g><path d={`M${hcx - hr * 0.95} ${hcy - hr * 0.35} Q${hcx} ${hcy - hr * 1.45} ${hcx + hr * 0.95} ${hcy - hr * 0.35} Z`} fill={hc} {...k} /><path d={`M${hcx + hr * 0.6} ${hcy - hr * 0.4} h${hr * 0.75} q0 ${hr * 0.15} -${hr * 0.2} ${hr * 0.2} h-${hr * 0.55} z`} fill={tint(hc, 0.8)} {...k} /></g>
    : hat === "brimhat" ? <g><ellipse cx={hcx} cy={hcy - hr * 0.55} rx={hr * 1.45} ry={hr * 0.2} fill={hc} {...k} /><path d={`M${hcx - hr * 0.7} ${hcy - hr * 0.55} V${hcy - hr * 1.2} Q${hcx} ${hcy - hr * 1.45} ${hcx + hr * 0.7} ${hcy - hr * 1.2} V${hcy - hr * 0.55} Z`} fill={hc} {...k} /><rect x={hcx - hr * 0.7} y={hcy - hr * 0.78} width={hr * 1.4} height={hr * 0.16} fill={tint(hc, 0.6)} /></g>
    : hat === "helmet" ? <g><path d={`M${hcx - hr * 1.12} ${hcy - hr * 0.3} Q${hcx - hr * 1.05} ${hcy - hr * 1.38} ${hcx} ${hcy - hr * 1.35} Q${hcx + hr * 1.05} ${hcy - hr * 1.38} ${hcx + hr * 1.12} ${hcy - hr * 0.3} Z`} fill={hc} {...k} /><path d={`M${hcx - hr * 1.05} ${hcy - hr * 0.42} H${hcx + hr * 1.05}`} {...inkProps(s, 5)} /></g>
    : hat === "beanie" ? <g><path d={`M${hcx - hr * 0.98} ${hcy - hr * 0.35} Q${hcx} ${hcy - hr * 1.6} ${hcx + hr * 0.98} ${hcy - hr * 0.35} Z`} fill={hc} {...k} /><rect x={hcx - hr} y={hcy - hr * 0.5} width={hr * 2} height={hr * 0.25} rx={10} fill={tint(hc, 0.85)} {...k} /><circle cx={hcx} cy={hcy - hr * 1.25} r={hr * 0.18} fill="#fff" {...k} /></g>
    : hat === "headscarf" ? <path d={`M${hcx - hr * 1.08} ${hcy + hr * 0.3} Q${hcx - hr * 1.2} ${hcy - hr * 1.3} ${hcx} ${hcy - hr * 1.15} Q${hcx + hr * 1.2} ${hcy - hr * 1.3} ${hcx + hr * 1.08} ${hcy + hr * 0.3} Q${hcx + hr * 0.7} ${hcy - hr * 0.5} ${hcx} ${hcy - hr * 0.55} Q${hcx - hr * 0.7} ${hcy - hr * 0.5} ${hcx - hr * 1.08} ${hcy + hr * 0.3} Z`} fill={hc} {...k} />
    : hat === "beret" ? <g><ellipse cx={hcx - hr * 0.15} cy={hcy - hr * 0.78} rx={hr * 1.05} ry={hr * 0.38} fill={hc} {...k} /><circle cx={hcx - hr * 0.1} cy={hcy - hr * 1.18} r={8} fill={hc} {...k} /></g>
    : hat === "hood" ? <path d={`M${hcx - hr * 1.15} ${hcy + 10} Q${hcx - hr * 1.2} ${hcy - hr * 1.25} ${hcx} ${hcy - hr * 1.2} Q${hcx + hr * 1.2} ${hcy - hr * 1.25} ${hcx + hr * 1.15} ${hcy + 10} Q${hcx + hr * 0.9} ${hcy - hr * 0.75} ${hcx} ${hcy - hr * 0.78} Q${hcx - hr * 0.9} ${hcy - hr * 0.75} ${hcx - hr * 1.15} ${hcy + 10} Z`} fill={tint(col, 0.85)} {...k} />
    : null;

  const detail = outfit === "coat" ? <g><path d={`M0 ${shY + 10} V${torsoBottom}`} {...inkProps(s, 4)} />{[0, 1, 2].map((j) => <circle key={j} cx={14} cy={shY + 50 + j * 45} r={7} fill={s.ink} />)}<path d={`M-24 ${shY} l24 40 l24 -40`} fill="none" {...inkProps(s, 4)} /></g>
    : outfit === "uniform" ? <g><rect x={-tw + 2} y={hipY - 40} width={d.W - 4} height={20} fill={tint(col, 0.6)} />{[0, 1, 2].map((j) => <circle key={j} cx={0} cy={shY + 40 + j * 40} r={7} fill="#e6c25a" />)}<rect x={-tw + 14} y={shY + 40} width={34} height={28} fill="none" {...inkProps(s, 4)} /><rect x={tw - 48} y={shY + 40} width={34} height={28} fill="none" {...inkProps(s, 4)} /></g>
    : outfit === "overalls" ? <g><rect x={-tw * 0.6} y={shY + 50} width={tw * 1.2} height={hipY - shY - 40} fill={col} {...inkProps(s, 5)} /><path d={`M${-tw * 0.55} ${shY + 52} L${-tw * 0.7} ${shY} M${tw * 0.55} ${shY + 52} L${tw * 0.7} ${shY}`} stroke={col} strokeWidth={14} /><circle cx={-tw * 0.4} cy={shY + 64} r={6} fill="#e6c25a" /><circle cx={tw * 0.4} cy={shY + 64} r={6} fill="#e6c25a" /></g>
    : outfit === "suit" ? <g><path d={`M-26 ${shY} L0 ${shY + 70} L26 ${shY} Z`} fill="#f4f4f4" {...inkProps(s, 4)} /><path d={`M0 ${shY + 12} l-9 14 l9 60 l9 -60 z`} fill={s.c("#b8323a")} {...inkProps(s, 3)} /></g>
    : outfit === "sweater" ? <g opacity={0.9}>{[0.35, 0.6].map((u) => <rect key={u} x={-tw + 4} y={shY + (hipY - shY) * u} width={d.W - 8} height={16} fill={tint(col, 1.3)} />)}</g>
    : outfit === "apron" ? <g><path d={`M${-tw * 0.55} ${shY + 40} H${tw * 0.55} V${hipY + 30} H${-tw * 0.55} Z`} fill="#f4efe6" {...inkProps(s, 5)} /><rect x={-24} y={hipY - 40} width={48} height={30} fill="none" {...inkProps(s, 3)} /></g>
    : outfit === "hoodie" ? <g><rect x={-tw * 0.5} y={hipY - 55} width={tw} height={40} rx={10} fill={tint(col, 0.85)} {...inkProps(s, 4)} /><path d={`M-14 ${shY + 6} v40 M14 ${shY + 6} v40`} {...inkProps(s, 4)} /></g>
    : outfit === "dress" ? <path d={`M${-tw + 10} ${hipY - 30} H${tw - 10}`} {...inkProps(s, 4)} />
    : <path d={`M-20 ${shY} l20 22 l20 -22`} fill="none" {...inkProps(s, 4)} />;

  return (
    <g transform={`translate(${shiver} ${bob})`}>
      {legs.map((L, j) => <g key={j}><Limb pts={L as [number, number][]} w={legW} col={pants} s={s} /><path d={`M${L[L.length - 1][0] - 18} -4 h${36}`} stroke={s.ink} strokeWidth={22} strokeLinecap="round" /></g>)}
      <g transform={`rotate(${stoop * 0.4} 0 ${hipY})`}>
        <path d={torsoPath} fill={col} {...k} />
        {s.look.cel && <><clipPath id={"tc" + id}><path d={torsoPath} /></clipPath><rect clipPath={`url(#tc${id})`} x={tw * 0.35} y={shY - 10} width={tw} height={torsoBottom - shY + 20} fill="#000" opacity={0.14} /></>}
        {detail}
        {ex.has("medal") && <g><path d={`M-${tw * 0.5} ${shY + 30} l10 30 l10 -30`} fill={s.c("#3d6fb6")} /><circle cx={-tw * 0.5 + 10} cy={shY + 70} r={13} fill="#e6c25a" {...inkProps(s, 4)} /></g>}
        {ex.has("bag") && <g><path d={`M${-tw + 10} ${shY + 10} L${tw - 6} ${hipY - 10}`} stroke={s.c("#6b4630")} strokeWidth={10} /><rect x={tw - 30} y={hipY - 40} width={60} height={50} rx={8} fill={s.c("#8a5a3a")} {...inkProps(s, 5)} /></g>}
        {ex.has("scarf") && <g><rect x={-tw * 0.75} y={shY - 14} width={tw * 1.5} height={30} rx={14} fill={s.c("#c0392b")} {...inkProps(s, 5)} /><path d={`M${tw * 0.3} ${shY + 10} l12 70 h26 l-8 -70`} fill={s.c("#c0392b")} {...inkProps(s, 5)} /></g>}
        {hairBack}
        <ellipse cx={hcx} cy={hcy} rx={hr} ry={hr * 1.06} fill={skin} {...k} />
        {s.look.cel && <><clipPath id={"hc" + id}><ellipse cx={hcx} cy={hcy} rx={hr} ry={hr * 1.06} /></clipPath><ellipse clipPath={`url(#hc${id})`} cx={hcx - hr * 0.35} cy={hcy - hr * 0.2} rx={hr} ry={hr * 1.1} fill="none" stroke="#000" strokeOpacity={0.12} strokeWidth={hr * 0.5} /></>}
        {ex.has("freckles") && [-1, 1].map((dd) => [0, 1, 2].map((j) => <circle key={dd * 10 + j} cx={hcx + dd * (40 + j * 10) * hr / 100} cy={hcy + (20 + (j % 2) * 8) * hr / 100} r={3.5} fill={s.c("#b0623a")} />))}
        {ex.has("beard") && <path d={`M${hcx - hr * 0.8} ${hcy + hr * 0.1} Q${hcx - hr * 0.7} ${hcy + hr * 1.25} ${hcx} ${hcy + hr * 1.2} Q${hcx + hr * 0.7} ${hcy + hr * 1.25} ${hcx + hr * 0.8} ${hcy + hr * 0.1} Q${hcx + hr * 0.4} ${hcy + hr * 0.75} ${hcx} ${hcy + hr * 0.7} Q${hcx - hr * 0.4} ${hcy + hr * 0.75} ${hcx - hr * 0.8} ${hcy + hr * 0.1} Z`} fill={hairC} {...inkProps(s, 5)} />}
        <Face cx={hcx} cy={hcy + hr * 0.02} r={hr} expr={expr} blink={blink} look={c.look} t={t} s={s} />
        {ex.has("mustache") && <path d={`M${hcx} ${hcy + hr * 0.3} q-${hr * 0.25} -${hr * 0.12} -${hr * 0.42} ${hr * 0.1} q${hr * 0.22} ${hr * 0.02} ${hr * 0.42} -${hr * 0.02} q${hr * 0.2} ${hr * 0.04} ${hr * 0.42} ${hr * 0.02} q-${hr * 0.17} -${hr * 0.22} -${hr * 0.42} -${hr * 0.1} z`} fill={hairC} {...inkProps(s, 4)} />}
        {ex.has("glasses") && <g fill="none" {...inkProps(s, 5)}><circle cx={hcx - 32 * hr / 100} cy={hcy + 2} r={22} /><circle cx={hcx + 32 * hr / 100} cy={hcy + 2} r={22} /><path d={`M${hcx - 10} ${hcy} h20`} /></g>}
        {ex.has("bandage") && <g transform={`translate(${hcx + hr * 0.5} ${hcy - hr * 0.55}) rotate(30)`}><rect x={-30} y={-10} width={60} height={20} fill="#f4ecd8" {...inkProps(s, 3)} /><rect x={-10} y={-30} width={20} height={60} fill="#f4ecd8" {...inkProps(s, 3)} /></g>}
        {hairTop}{hatEl}
      </g>
      {<><Limb pts={AL.pts} w={d.kid ? 22 : 26} col={sleeve} s={s} /><Limb pts={AR.pts} w={d.kid ? 22 : 26} col={sleeve} s={s} /></>}
      {ex.has("cane") && <path d={`M${AL.hand[0]} ${AL.hand[1]} L${AL.hand[0] - 10} 0 M${AL.hand[0]} ${AL.hand[1]} q-10 -30 -36 -10`} stroke={s.c("#6b4630")} strokeWidth={12} fill="none" strokeLinecap="round" />}
      {held}
      {hand(AL.hand)}{hand(AR.hand)}
    </g>
  );
};

// ---------- Tiere (Seitenansicht, Blick nach links) ----------
const animalFur = (c: Char) => c.color ?? (c.who === "cat" ? (c.breed === "black" ? "#3a3440" : c.breed === "white" ? "#f2eee8" : "#e09a4a") : c.who === "horse" ? (c.breed === "white" ? "#eeeae2" : c.breed === "black" ? "#3a3036" : "#8a5a3a") : c.who === "bird" ? "#5aa0d8" : c.breed === "white" ? "#f2eee8" : c.breed === "black" ? "#3a3440" : "#b98a55");
const AnimalEye: React.FC<{x: number; y: number; expr: Expr; t: number; i: number; s: Ctx; r?: number}> = ({x, y, expr, t, i, s, r = 11}) => {
  const blink = (t + i) % 3.3 < 0.12 || expr === "sleepy";
  if (expr === "happy" || expr === "laugh") return <path d={`M${x - 10} ${y + 3} q10 -14 20 0`} {...inkProps(s, 5)} fill="none" />;
  if (blink) return <path d={`M${x - 10} ${y} h20`} {...inkProps(s, 5)} />;
  const big = expr === "shock" || expr === "scared";
  return <g><ellipse cx={x} cy={y} rx={big ? 13 : 9} ry={big ? 15 : r} fill={big ? "#fff" : s.ink} {...(big ? inkProps(s, 4) : {})} />{big && <circle cx={x} cy={y + 2} r={6} fill={s.ink} />}<circle cx={x - 3} cy={y - 4} r={3} fill="#fff" opacity={big ? 0 : 0.9} /></g>;
};

const Dog: React.FC<{c: Char; t: number; i: number; expr: Expr}> = ({c, t, i, expr}) => {
  const s = useS(); const k = inkProps(s, 7); const fur = s.c(animalFur(c)); const walk = c.act === "walk" || c.act === "run";
  const pup = c.breed === "pup"; const sc = pup ? 0.72 : 1;
  const sp = c.act === "run" ? 14 : 9; const sw = walk ? Math.sin(t * sp) * 18 : 0;
  const happy = expr === "happy" || expr === "laugh" || expr === "love"; const sad = expr === "sad" || expr === "cry" || expr === "worried";
  const wag = Math.sin(t * (happy ? 18 : 6)) * (happy ? 22 : 6);
  const bob = c.act === "bounce" ? -Math.abs(Math.sin(t * 7)) * 30 : walk ? -Math.abs(Math.sin(t * sp)) * 7 : c.act === "breathe" ? Math.sin(t * 2) * 3 : 0;
  const shiver = c.act === "shiver" ? Math.sin(t * 50) * 3 : 0;
  const lie = c.pose === "lie" || c.pose === "sit";
  const ear = c.breed === "pointy" ? <path d="M-80 96 l-6 -72 l50 52 z" fill={tint(fur, 0.75)} {...k} /> : <path d={`M-66 ${sad ? 104 : 96} q${sad ? 40 : 52} ${sad ? 36 : 20} ${sad ? 18 : 34} ${sad ? 112 : 96} q-36 -4 -50 -56 z`} fill={tint(fur, 0.7)} {...k} />;
  return (
    <g transform={`translate(${shiver} ${bob}) scale(${sc}) translate(0 -350)`}>
      <path d={`M80 190 q70 ${-30 + wag} 90 ${(sad ? -10 : -70) + wag}`} {...k} fill="none" strokeWidth={26} /><path d={`M80 190 q70 ${-30 + wag} 90 ${(sad ? -10 : -70) + wag}`} stroke={fur} fill="none" strokeWidth={12} strokeLinecap="round" />
      {lie ? <path d="M-80 330 h60 M40 330 h70" {...k} strokeWidth={22} /> : <path d={`M-60 270 L${-60 + sw} 350 M-20 270 L${-20 - sw} 350 M40 270 L${40 - sw} 350 M80 270 L${80 + sw} 350`} {...k} fill="none" strokeWidth={20} />}
      <ellipse cx={10} cy={lie ? 280 : 220} rx={110} ry={lie ? 56 : 74} fill={fur} {...k} />
      {c.breed === "spotted" && <><circle cx={30} cy={200} r={22} fill={s.ink} opacity={0.75} /><circle cx={70} cy={240} r={14} fill={s.ink} opacity={0.75} /></>}
      {(c.extra ?? ["collar"]).includes("collar") && <path d="M-50 170 q-30 60 -70 36" stroke={s.c(c.color2 ?? "#d9433b")} strokeWidth={16} fill="none" strokeLinecap="round" />}
      <g transform={`translate(0 ${lie ? 60 : 0}) rotate(${sad ? -8 : expr === "shock" ? 6 : 0} -90 150)`}>
        <ellipse cx={-90} cy={150} rx={70} ry={64} fill={fur} {...k} />
        <ellipse cx={-140} cy={170} rx={34} ry={26} fill={tint(fur, 1.15)} {...k} />
        <ellipse cx={-166} cy={160} rx={10} ry={8} fill={s.ink} />
        {ear}
        <AnimalEye x={-98} y={138} expr={expr} t={t} i={i} s={s} />
        {sad && <path d="M-118 110 l34 16" {...k} fill="none" strokeWidth={6} />}
        {happy && <path d="M-166 182 q26 26 52 0" {...k} fill="#f08a9a" />}
        {c.hold && <g transform="translate(-190 225) rotate(-10) scale(0.6)"><PropShape kind={c.hold} t={t} /></g>}
        {expr === "cry" && <path d={`M-98 152 q-4 ${20 + (t * 40) % 30} 0 ${40 + (t * 40) % 30}`} stroke="#7fc3ff" strokeWidth={8} fill="none" strokeLinecap="round" />}
      </g>
    </g>
  );
};

const Cat: React.FC<{c: Char; t: number; i: number; expr: Expr}> = ({c, t, i, expr}) => {
  const s = useS(); const k = inkProps(s, 7); const fur = s.c(animalFur(c)); const walk = c.act === "walk" || c.act === "run";
  const sw = walk ? Math.sin(t * 9) * 14 : 0; const tail = Math.sin(t * 2.5) * 14;
  const bob = c.act === "bounce" ? -Math.abs(Math.sin(t * 7)) * 26 : walk ? -Math.abs(Math.sin(t * 9)) * 5 : 0;
  const sit = c.pose === "sit" || c.pose === "lie";
  return (
    <g transform={`translate(0 ${bob}) translate(0 -300)`}>
      <path d={`M70 ${sit ? 250 : 190} q90 ${-20 + tail} 60 -130`} {...k} fill="none" strokeWidth={24} /><path d={`M70 ${sit ? 250 : 190} q90 ${-20 + tail} 60 -130`} stroke={fur} fill="none" strokeWidth={11} strokeLinecap="round" />
      {!sit && <path d={`M-50 230 L${-50 + sw} 300 M-15 230 L${-15 - sw} 300 M40 230 L${40 - sw} 300 M70 230 L${70 + sw} 300`} {...k} fill="none" strokeWidth={17} />}
      {sit ? <path d="M-60 300 Q-80 160 0 150 Q90 150 90 300 Z" fill={fur} {...k} /> : <ellipse cx={10} cy={200} rx={90} ry={52} fill={fur} {...k} />}
      {c.breed === "tabby" && [0, 1, 2].map((j) => <path key={j} d={`M${-10 + j * 30} ${sit ? 175 : 155} q8 20 0 36`} stroke={tint(fur, 0.65)} strokeWidth={8} fill="none" />)}
      <g transform={`translate(${sit ? 30 : 0} ${sit ? 10 : 0})`}>
        <path d="M-150 100 l-6 -60 l40 34 z M-70 96 l10 -60 l-44 34 z" fill={fur} {...k} />
        <ellipse cx={-105} cy={120} rx={62} ry={54} fill={fur} {...k} />
        <AnimalEye x={-125} y={112} expr={expr} t={t} i={i} s={s} r={12} /><AnimalEye x={-82} y={112} expr={expr} t={t} i={i + 0.4} s={s} r={12} />
        <path d="M-108 134 l-6 8 h12 z" fill="#f08a9a" {...inkProps(s, 3)} />
        <path d="M-150 136 h-34 M-150 146 l-32 8 M-62 136 h34 M-62 146 l32 8" stroke={s.ink} strokeWidth={3} />
        {(expr === "sad" || expr === "worried") && <path d="M-138 92 l22 8 M-72 92 l-22 8" {...inkProps(s, 5)} />}
      </g>
    </g>
  );
};

const Horse: React.FC<{c: Char; t: number; i: number; expr: Expr}> = ({c, t, i, expr}) => {
  const s = useS(); const k = inkProps(s, 7); const fur = s.c(animalFur(c)); const mane = s.c(c.color2 ?? "#3a2a22");
  const walk = c.act === "walk" || c.act === "run"; const sw = walk ? Math.sin(t * 8) * 22 : 0; const bob = walk ? -Math.abs(Math.sin(t * 8)) * 8 : 0;
  return (
    <g transform={`translate(0 ${bob}) translate(0 -560)`}>
      <path d={`M150 250 q60 40 40 ${160 + Math.sin(t * 3) * 10}`} stroke={mane} strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d={`M-110 300 L${-110 + sw} 560 M-60 300 L${-60 - sw} 560 M90 300 L${90 - sw} 560 M140 300 L${140 + sw} 560`} {...k} strokeWidth={30} fill="none" />
      <path d={`M-110 300 L${-110 + sw} 560 M-60 300 L${-60 - sw} 560 M90 300 L${90 - sw} 560 M140 300 L${140 + sw} 560`} stroke={fur} strokeWidth={18} fill="none" strokeLinecap="round" />
      <ellipse cx={20} cy={280} rx={170} ry={100} fill={fur} {...k} />
      <path d="M-110 230 L-170 60 Q-180 20 -220 40 L-280 110 Q-300 150 -260 160 L-200 140 L-150 290 Z" fill={fur} {...k} />
      <path d="M-170 60 Q-120 120 -100 230" stroke={mane} strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d="M-190 40 l10 -40 l20 44 z" fill={fur} {...k} />
      <AnimalEye x={-212} y={80} expr={expr} t={t} i={i} s={s} />
      <circle cx={-270} cy={135} r={6} fill={s.ink} />
    </g>
  );
};

const Bird: React.FC<{c: Char; t: number; i: number; expr: Expr}> = ({c, t, i, expr}) => {
  const s = useS(); const k = inkProps(s, 6); const fur = s.c(animalFur(c)); const fly = c.act === "fly";
  const flap = fly ? Math.sin(t * 16) * 40 : Math.sin(t * 2) * 4; const y = fly ? -260 + Math.sin(t * 3) * 30 : 0;
  return (
    <g transform={`translate(0 ${y - 140})`}>
      {!fly && <path d="M-10 110 v30 M14 110 v30" {...k} />}
      <path d="M40 60 l60 -10 l-50 40 z" fill={tint(fur, 0.8)} {...k} />
      <ellipse cx={0} cy={60} rx={60} ry={52} fill={fur} {...k} />
      <path d={`M10 50 q40 ${-20 - flap} 70 ${-40 - flap * 1.2} q-30 60 -70 50 z`} fill={tint(fur, 0.85)} {...k} />
      <circle cx={-30} cy={20} r={36} fill={fur} {...k} />
      <path d="M-62 18 l-30 8 l30 10 z" fill="#f0b030" {...inkProps(s, 4)} />
      <AnimalEye x={-38} y={12} expr={expr} t={t} i={i} s={s} r={8} />
    </g>
  );
};

// ---------- Figur mit Auftritt, Sprechblase, Tiefe ----------
const exprNow = (c: Char, tl: number): Expr => { let e = c.expr ?? "neutral"; (c.exprAt ?? []).forEach((x) => { if (tl >= x.t) e = x.expr; }); return e; };

export const Figure: React.FC<{c: Char; t: number; tl: number; i: number; gx: number; gy: number; s0: number}> = ({c, t, tl, i, gx, gy, s0}) => {
  const s = useS();
  const sc = (c.scale ?? 1) * s0; const flip = c.flip ? -1 : 1; const expr = exprNow(c, tl);
  const en = c.enter ?? "none"; const ep = Math.min(1, tl / 0.6); const eo = 1 - Math.pow(1 - ep, 3);
  const dx = en === "left" ? (eo - 1) * 700 : en === "right" ? (1 - eo) * 700 : 0;
  const dy = en === "fall" ? (eo - 1) * 1400 : 0;
  const pop = en === "pop" ? (ep < 1 ? Math.max(0.01, eo * (1 + 0.25 * Math.sin(ep * Math.PI))) : 1) : 1;
  const op = en === "fade" ? ep : 1;
  const lie = c.pose === "lie" && !ANIMALS.has(c.who);
  const body = c.who === "dog" ? <Dog c={c} t={t} i={i} expr={expr} /> : c.who === "cat" ? <Cat c={c} t={t} i={i} expr={expr} /> : c.who === "horse" ? <Horse c={c} t={t} i={i} expr={expr} /> : c.who === "bird" ? <Bird c={c} t={t} i={i} expr={expr} /> : <Person c={c} t={t} i={i} expr={expr} />;
  const ht = headTop(c) * sc; const bubble = c.say ?? c.think; const bp = Math.min(1, Math.max(0, (tl - 0.3) / 0.25));
  const bw = bubble ? Math.max(170, bubble.length * 34 + 70) : 0;
  return (
    <g transform={`translate(${gx + dx} ${gy + dy})`} opacity={op}>
      <ellipse cx={0} cy={6} rx={(c.who === "horse" ? 220 : c.who === "bird" ? 50 : 120) * sc} ry={20 * sc} fill="#000" opacity={0.18} />
      <g transform={`scale(${sc * flip * pop} ${sc * pop})`}>{lie ? <g transform="rotate(-90) translate(-120 0)">{body}</g> : body}</g>
      {bubble && bp > 0 && (() => {
        // Blase NEBEN den Kopf (nicht darüber), damit sie die Untertitel-Zone (y 740–1000) nicht trifft.
        const side = gx > 540 ? -1 : 1; const hy = ht * 0.62 + gy < 1060 ? 1060 - gy + 60 : ht * 0.62;
        const bx = side * (Math.abs(ht) * 0.28 + bw / 2 + 20);
        const cx = Math.max(-gx + bw / 2 + 24, Math.min(1080 - 90 - gx - bw / 2, bx));
        return (
          <g transform={`translate(${cx} ${hy}) scale(${bp})`}>
            {c.think ? <><circle cx={-side * (bw / 2 + 10)} cy={30} r={12} fill="#fff" {...inkProps(s, 5)} /><circle cx={-side * (bw / 2 + 34)} cy={52} r={7} fill="#fff" {...inkProps(s, 4)} /></> : <path d={`M${-side * (bw / 2 - 30)} 0 L${-side * (bw / 2 + 40)} 40 L${-side * (bw / 2 - 60)} 30 Z`} fill="#fff" {...inkProps(s, 6)} />}
            <rect x={-bw / 2} y={-52} width={bw} height={104} rx={c.think ? 52 : 26} fill="#fff" {...inkProps(s, 6)} />
            <path d={`M${-side * (bw / 2 - 30)} 6 L${-side * (bw / 2 - 58)} 26`} stroke="#fff" strokeWidth={12} />
            <text x={0} y={18} textAnchor="middle" fontFamily="Lilita One" fontSize={54} fill="#1a1020">{bubble}</text>
          </g>);
      })()}
    </g>
  );
};
