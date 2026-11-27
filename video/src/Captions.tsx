import React from "react";
import {LookDef} from "./style";

// Untertitel: mittig (unten ~20 % und rechter Rand sind von Buttons verdeckt). Stil kommt vom Look.
export const Captions: React.FC<{words: {w: string; t: number}[]; now: number; look: LookDef; breaks: Set<number>}> = ({words, now, look, breaks}) => {
  if (!words.length) return null;
  const cap = look.cap; const n = cap.group;
  let a = 0; words.forEach((x, i) => { if (x.t <= now) a = i; });
  // Gruppen: höchstens n Wörter, neue Gruppe nach Satzende oder an der Szenengrenze (breaks)
  let from = 0, cnt = 0;
  for (let i = 0; i <= a; i++) { if (i > 0 && (cnt >= n || /[.!?]$/.test(words[i - 1].w) || breaks.has(i))) { from = i; cnt = 0; } cnt++; }
  let to = from; while (to < words.length && to - from < n && (to === from || (!/[.!?]$/.test(words[to - 1].w) && !breaks.has(to)))) to++;
  const grp = words.slice(from, to);
  const since = now - words[a].t;
  return (
    <div style={{position: "absolute", left: 80, right: 110, top: 740, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 24, rowGap: cap.mode === "box" ? 14 : 0,
      fontFamily: `'${cap.font}', Impact, 'Arial Black', sans-serif`, fontSize: cap.size, lineHeight: 1.08, textTransform: cap.upper ? "uppercase" : "none", letterSpacing: cap.font === "Bangers" ? 3 : 1}}>
      {grp.map((x, k) => {
        const on = from + k === a; const past = from + k < a;
        const pop = on ? 1 + 0.18 * Math.max(0, 1 - since / 0.15) : 1;
        const base: React.CSSProperties = {display: "inline-block", color: on ? cap.active : cap.fill, paintOrder: "stroke fill", WebkitTextStroke: `${Math.round(cap.size / 9)}px ${cap.stroke}`};
        if (cap.mode === "box") return <span key={from + k} style={{...base, WebkitTextStroke: "0", color: on ? cap.stroke : cap.fill, background: on ? cap.active : "rgba(10,10,14,.72)", padding: "2px 18px", borderRadius: 14, transform: `scale(${pop})`}}>{x.w}</span>;
        if (cap.mode === "pop") return <span key={from + k} style={{...base, opacity: past || on ? 1 : 0.0, transform: `scale(${on ? pop * 1.06 : 1}) translateY(${on ? -6 : 0}px)`}}>{x.w}</span>;
        if (cap.mode === "tilt") return <span key={from + k} style={{...base, transform: `rotate(${((from + k) % 3 - 1) * 3}deg) scale(${on ? pop * 1.1 : 1})`, textShadow: `6px 6px 0 ${cap.stroke}`}}>{x.w}</span>;
        return <span key={from + k} style={{...base, transform: on ? `scale(${pop * 1.06})` : "none"}}>{x.w}</span>;
      })}
    </div>
  );
};
