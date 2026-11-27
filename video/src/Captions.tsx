import React from "react";

// Untertitel: mittig (unten ~20 % und rechter Rand sind von Buttons verdeckt). Aktives Wort gelb.
export const Captions: React.FC<{words: {w: string; t: number}[]; now: number}> = ({words, now}) => {
  if (!words.length) return null;
  let a = 0; words.forEach((x, i) => { if (x.t <= now) a = i; });
  const from = Math.floor(a / 4) * 4; const grp = words.slice(from, from + 4);
  return (
    <div style={{position: "absolute", left: 90, right: 90, top: 760, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 26, fontFamily: "Impact, 'Arial Black', sans-serif", fontSize: 92, lineHeight: 1.1, textTransform: "uppercase", letterSpacing: 1}}>
      {grp.map((x, k) => (
        <span key={from + k} style={{color: from + k === a ? "#ffe14a" : "#fff", WebkitTextStroke: "10px #1a1020", paintOrder: "stroke fill", display: "inline-block", transform: from + k === a ? "scale(1.08)" : "none"}}>{x.w}</span>
      ))}
    </div>
  );
};
