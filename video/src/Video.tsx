import React from "react";
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from "remotion";
import "./fonts";
import {Fx, Overlay, Scene, SplitSide, Story, Trans} from "./types";
import {FPS, timeline} from "./timing";
import {Background, groundAt, scaleAt, W, H} from "./Background";
import {Figure, headTop} from "./Characters";
import {PropShape} from "./Props";
import {Captions} from "./Captions";
import {Overlays, Particles, Texture} from "./Overlays";
import {hash, LIGHTS, LOOKS, makeCtx, STYLES, StyleCtx} from "./style";

const ease = (x: number) => x * x * (3 - 2 * x);
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ANIMAL = new Set(["dog", "cat", "horse", "bird"]);

const autoFx = (sc: {set: string; light: string; fx?: Fx[]}): Fx[] => sc.fx ?? [
  ...(sc.set === "snow" ? ["snow" as Fx] : []), ...(sc.light === "storm" ? ["rain" as Fx, "lightning" as Fx] : []),
  ...(sc.light === "lamp" || sc.set === "room" ? ["dust" as Fx] : []), ...(sc.set === "ruins" ? ["smoke" as Fx] : []),
];

// Eine Bühne: Hintergrund, Requisiten (hinten/mitte/vorne), Figuren nach Tiefe.
const Stage: React.FC<{sc: SplitSide & {props?: Scene["props"]}; p: number; t: number; tl: number; px: number; seed: number; charK: number}> = ({sc, p, t, tl, px, seed, charK}) => {
  const props = sc.props ?? [];
  const layer = (l: string, d: number, gy: number, s0: number) => props.filter((q) => (q.layer ?? "mid") === l).map((q, i) => (
    <g key={l + i} transform={`translate(${q.x * W + px * d} ${gy}) scale(${(q.scale ?? 1) * s0 * (q.flip ? -1 : 1)} ${(q.scale ?? 1) * s0})`}><PropShape kind={q.kind} color={q.color} t={t} label={q.label} /></g>));
  const chars = sc.chars.map((c, i) => ({c, i})).sort((a, b) => (b.c.z ?? 0) - (a.c.z ?? 0));
  return (
    <>
      <Background set={sc.set} light={sc.light} px={px * 0.6} t={t} seed={seed} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {layer("back", 0.5, groundAt(0.92), 0.5)}
        {layer("mid", 0.85, groundAt(0.55), 0.8)}
        {chars.map(({c, i}) => {
          const z = c.z ?? 0; const animal = ANIMAL.has(c.who);
          const dir = animal ? (c.flip ? 1 : -1) : (c.flip ? -1 : 1);
          const mv = c.act === "walk" ? 0.14 : c.act === "run" ? 0.32 : 0;
          return <Figure key={i} c={c} t={t} tl={tl} i={i} gx={(c.x + (p - 0.5) * mv * dir) * W + px * (1 - z * 0.5)} gy={groundAt(z)} s0={scaleAt(z) * charK} />;
        })}
        {layer("front", 1.35, H + 40, 1.6)}
      </svg>
    </>
  );
};

const SceneView: React.FC<{story: Story; idx: number; tl: number; dur: number; now: number}> = ({story, idx, tl, dur, now}) => {
  const sc = story.scenes[idx]; const look = LOOKS[story.variant?.look ?? "paper"]; const st = STYLES[story.variant?.sceneStyle ?? "documentary"];
  const seed = (hash(story.id) + idx * 7919 + (sc.seed ?? 0) * 104729) >>> 0;
  const ovs: Overlay[] = sc.overlay ? (Array.isArray(sc.overlay) ? sc.overlay : [sc.overlay]) : [];
  const frozen = ovs.some((o) => o.kind === "freeze") && tl > 0.4;
  const t = frozen ? now - tl + 0.4 : now; const tlx = frozen ? 0.4 : tl;
  const p = clamp(tlx / Math.max(0.1, dur)); const e = ease(p); const k = st.camK;
  // Kamera
  let sc0 = 1.06, tx = 0, ty = 0, rot = 0, ox = 540, oy = 1190;
  switch (sc.cam) {
    case "push": sc0 = 1 + 0.13 * k * e; break;
    case "pull": sc0 = 1.03 + 0.15 * k * (1 - e); break;
    case "left": sc0 = 1.09; tx = -70 * k * e + 35 * k; break;
    case "right": sc0 = 1.09; tx = 70 * k * e - 35 * k; break;
    case "up": sc0 = 1.12; ty = 90 * k * e - 45 * k; break;
    case "down": sc0 = 1.12; ty = -90 * k * e + 45 * k; break;
    case "shake": sc0 = 1.1 + 0.04 * e; tx = (Math.sin(t * 37) + Math.sin(t * 23)) * 7 * k; ty = Math.cos(t * 31) * 7 * k; rot = Math.sin(t * 13) * 0.6 * k; break;
    case "whip": { const w = clamp(tlx / 0.35); sc0 = 1.34 - 0.28 * (1 - Math.pow(1 - w, 3)) + 0.05 * e; tx = 140 * (1 - w) * (1 - w); break; }
    case "drift": sc0 = 1.07 + 0.05 * e; tx = 50 * k * (e - 0.5); ty = -30 * k * (e - 0.5); rot = 0.8 * (e - 0.5); break;
    case "dolly": sc0 = 1.02 + 0.12 * k * e; tx = 60 * k * (e - 0.5); break;
    case "still-ish": sc0 = 1.04 + 0.025 * Math.sin(p * Math.PI); break;
    case "focus": {
      const c = sc.chars[sc.focus ?? 0];
      if (c) { const z = c.z ?? 0; ox = c.x * W; oy = groundAt(z) + headTop(c) * 0.55 * (c.scale ?? 1) * scaleAt(z) * st.charK; }
      sc0 = 1.05 + 0.38 * Math.min(1, k) * e; break;
    }
  }
  const px = tx * 0.5;
  const ctx = makeCtx(look, LIGHTS[sc.light], seed);
  const stage = (side: SplitSide & {props?: Scene["props"]}, sd: number) => <Stage sc={side} p={p} t={t} tl={tlx} px={px} seed={sd} charK={st.charK} />;
  const half = (side: SplitSide & {props?: Scene["props"]}, sd: number, right: boolean, label?: string) => (
    <AbsoluteFill style={{clipPath: right ? "inset(0 0 0 50%)" : "inset(0 50% 0 0)"}}>
      <AbsoluteFill style={{transform: `translateX(${right ? 270 : -270}px)`}}>
        <StyleCtx.Provider value={makeCtx(look, LIGHTS[side.light], sd)}>{stage(side, sd)}</StyleCtx.Provider>
      </AbsoluteFill>
      {label && <div style={{position: "absolute", top: 560, left: right ? 540 : 0, width: 540, textAlign: "center", fontFamily: look.cap.font, fontSize: 84, color: "#fff", WebkitTextStroke: `10px ${look.cap.stroke}`, paintOrder: "stroke fill"}}>{label}</div>}
    </AbsoluteFill>
  );
  return (
    <StyleCtx.Provider value={ctx}>
      <AbsoluteFill style={{filter: frozen ? "grayscale(0.85) contrast(1.1)" : undefined, background: "#000"}}>
        <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${sc0})`, transformOrigin: `${ox}px ${oy}px`}}>
          {sc.split ? <>{half(sc, seed, false, sc.label)}{half(sc.split, seed + 17, true, sc.split.label)}
            <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}><path d={`M540 0 V${H}`} stroke={ctx.ink === "#f4f1e8" ? "#fff" : "#fff"} strokeWidth={22} /><path d={`M540 0 V${H}`} stroke={ctx.ink} strokeWidth={8} /></svg></>
            : stage(sc, seed)}
        </AbsoluteFill>
        <Particles fx={autoFx(sc)} t={t} tl={tlx} seed={seed} />
        <Texture kind={look.texture} vignette={look.vignette} />
        {frozen && <AbsoluteFill style={{background: "#fff", opacity: Math.max(0, 1 - (tl - 0.4) / 0.2) * 0.7}} />}
        <Overlays list={ovs} tl={tl} dur={dur} />
      </AbsoluteFill>
    </StyleCtx.Provider>
  );
};

const TD: Record<Trans, number> = {cut: 0, flash: 0.25, fade: 0.5, iris: 0.5, wipe: 0.4, slide: 0.35, whip: 0.3, ink: 0.55, zoom: 0.4, blink: 0.45};
export const transOf = (story: Story, idx: number): Trans => {
  const sc = story.scenes[idx]; if (sc.in) return sc.in; if (sc.flash) return "flash"; if (idx === 0) return "cut";
  const opts = STYLES[story.variant?.sceneStyle ?? "documentary"].trans; return opts[(hash(story.id) + idx * 31) % opts.length];
};
const blobPath = (q: number, seed: number) => {
  let d = ""; for (let j = 0; j < 6; j++) { const x = (seed * (j + 3) * 97) % W, y = 300 + ((seed * (j + 5) * 61) % 1400), r = q * (700 + (j % 3) * 200);
    d += `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 `; } return d;
};

const breaksOf = (sc: {words: unknown[]}[]) => { const b = new Set<number>(); let i = 0; sc.forEach((x) => { b.add(i); i += x.words.length; }); return b; };

export const Short: React.FC<{story: Story}> = ({story}) => {
  const f = useCurrentFrame(); const now = f / FPS; const tl = timeline(story);
  let idx = tl.scenes.findIndex((s) => now >= s.start && now < s.end); if (idx < 0) idx = tl.scenes.length - 1;
  const T = tl.scenes[idx]; const local = now - T.start; const dur = T.end - T.start;
  const tr = transOf(story, idx); const td = TD[tr]; const q = td ? clamp(local / td) : 1; const eq = ease(q);
  const look = LOOKS[story.variant?.look ?? "paper"];
  const cur = <SceneView story={story} idx={idx} tl={local} dur={dur} now={now} />;
  const prevT = idx > 0 ? tl.scenes[idx - 1] : null;
  const prev = prevT && q < 1 && tr !== "cut" && tr !== "flash" ? <SceneView story={story} idx={idx - 1} tl={now - prevT.start} dur={prevT.end - prevT.start} now={now} /> : null;
  let body: React.ReactNode = cur;
  if (prev) {
    switch (tr) {
      case "fade": body = q < 0.5 ? <>{prev}<AbsoluteFill style={{background: "#000", opacity: q * 2}} /></> : <>{cur}<AbsoluteFill style={{background: "#000", opacity: (1 - q) * 2}} /></>; break;
      case "iris": body = <>{prev}<AbsoluteFill style={{clipPath: `circle(${eq * 1300}px at 540px 1150px)`}}>{cur}</AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}><circle cx={540} cy={1150} r={eq * 1300} fill="none" stroke={look.ink} strokeWidth={14} /></svg></>; break;
      case "wipe": { const X = eq * (W + 400); body = <>{prev}<AbsoluteFill style={{clipPath: `polygon(0 0, ${X}px 0, ${X - 400}px ${H}px, 0 ${H}px)`}}>{cur}</AbsoluteFill></>; break; }
      case "slide": body = <><AbsoluteFill style={{transform: `translateX(${-eq * W}px)`}}>{prev}</AbsoluteFill><AbsoluteFill style={{transform: `translateX(${(1 - eq) * W}px)`}}>{cur}</AbsoluteFill></>; break;
      case "whip": body = <><AbsoluteFill style={{transform: `translateX(${-eq * W * 1.1}px)`, filter: `blur(${Math.sin(q * Math.PI) * 14}px)`}}>{prev}</AbsoluteFill><AbsoluteFill style={{transform: `translateX(${(1 - eq) * W * 1.1}px)`, filter: `blur(${Math.sin(q * Math.PI) * 14}px)`}}>{cur}</AbsoluteFill></>; break;
      case "ink": body = <>{prev}<AbsoluteFill style={{clipPath: `path('${blobPath(eq, hash(story.id) + idx)}')`}}>{cur}</AbsoluteFill></>; break;
      case "zoom": body = <><AbsoluteFill style={{transform: `scale(${1 + eq * 1.6})`, opacity: 1 - eq, transformOrigin: "540px 1150px"}}>{prev}</AbsoluteFill><AbsoluteFill style={{transform: `scale(${1.5 - 0.5 * eq})`, opacity: eq, transformOrigin: "540px 1150px"}}>{cur}</AbsoluteFill></>; break;
      case "blink": { const b = q < 0.5 ? q * 2 : (1 - q) * 2; body = <>{q < 0.5 ? prev : cur}<AbsoluteFill style={{background: `linear-gradient(#000 ${b * 50}%, transparent ${b * 50}%, transparent ${100 - b * 50}%, #000 ${100 - b * 50}%)`}} /></>; break; }
    }
  }
  const flash = tr === "flash" ? Math.max(0, 1 - local / 0.25) * 0.85 : 0;
  return (
    <AbsoluteFill style={{background: "#000"}}>
      {body}
      {flash > 0 && <AbsoluteFill style={{background: "#fff", opacity: flash}} />}
      <Captions words={tl.scenes.flatMap((s) => s.words)} now={now} look={look} breaks={breaksOf(tl.scenes)} />
      {story.voice && <Audio src={staticFile(story.voice)} />}
      {story.music && <Audio src={staticFile(story.music)} volume={0.12} />}
    </AbsoluteFill>
  );
};
