// Wetter/Partikel (Fx), Hook-Aufbauten (Overlay) und Look-Textur.
import React from "react";
import {Fx, Overlay} from "./types";
import {inkProps, useS} from "./style";

const W = 1080, H = 1920;

export const Particles: React.FC<{fx: Fx[]; t: number; tl: number; seed: number}> = ({fx, t, tl, seed}) => {
  const s = useS();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0}}>
      {fx.map((f) => {
        const n = (m: number) => Array.from({length: m});
        switch (f) {
          case "rain": return <g key={f}>{n(70).map((_, i) => { const x = (i * 157 + seed) % W, y = (i * 263 + t * 1900) % (H + 200) - 100; return <path key={i} d={`M${x} ${y} l-14 46`} stroke="#cfe3ff" strokeWidth={4} opacity={0.55} strokeLinecap="round" />; })}<rect width={W} height={H} fill="#24324a" opacity={0.12} /></g>;
          case "snow": return <g key={f}>{n(60).map((_, i) => <circle key={i} cx={(i * 173 + Math.sin(t + i) * 24 + seed) % W} cy={(i * 97 + t * (120 + (i % 4) * 30)) % H} r={4 + (i % 3) * 3} fill="#fff" opacity={0.85} />)}</g>;
          case "leaves": return <g key={f}>{n(16).map((_, i) => { const x = (i * 211 + t * 70 + seed) % (W + 200) - 100, y = (i * 137 + t * 110) % H; return <ellipse key={i} cx={x + Math.sin(t * 2 + i) * 40} cy={y} rx={16} ry={8} transform={`rotate(${t * 90 + i * 40} ${x} ${y})`} fill={s.c(i % 2 ? "#d9822b" : "#c0392b")} {...inkProps(s, 3)} />; })}</g>;
          case "dust": return <g key={f}>{n(40).map((_, i) => <circle key={i} cx={(i * 131 + t * 14 + seed) % W} cy={(i * 241 - t * 10 + 4000) % H} r={2 + (i % 3)} fill="#fff6d8" opacity={0.25 + 0.25 * Math.sin(t * 2 + i)} />)}</g>;
          case "fireflies": return <g key={f}>{n(22).map((_, i) => <circle key={i} cx={(i * 199 + Math.sin(t * 0.8 + i) * 60 + seed) % W} cy={1000 + ((i * 89) % 700) + Math.cos(t + i) * 40} r={7} fill="#fff59a" opacity={0.4 + 0.6 * Math.max(0, Math.sin(t * 3 + i * 1.7))} />)}</g>;
          case "embers": return <g key={f}>{n(30).map((_, i) => <circle key={i} cx={(i * 167 + Math.sin(t * 2 + i) * 30 + seed) % W} cy={H - ((i * 113 + t * 180) % H)} r={3 + (i % 3)} fill={i % 2 ? "#ff9a3c" : "#ffd23f"} opacity={0.8} />)}</g>;
          case "hearts": return <g key={f}>{n(10).map((_, i) => { const x = 140 + (i * 97 + seed) % 800, y = 1500 - ((tl * 220 + i * 130) % 1100); return <path key={i} d={`M${x} ${y} l-22 -22 a12 12 0 0 1 22 -12 a12 12 0 0 1 22 12 z`} fill="#ff5c86" opacity={Math.min(1, (y - 400) / 300)} {...inkProps(s, 3)} />; })}</g>;
          case "sparkles": return <g key={f}>{n(14).map((_, i) => { const x = (i * 233 + seed) % W, y = 300 + (i * 151) % 1300, k = Math.max(0, Math.sin(t * 4 + i * 2)); return <path key={i} d={`M${x} ${y - 26 * k} L${x + 6 * k} ${y - 6 * k} L${x + 26 * k} ${y} L${x + 6 * k} ${y + 6 * k} L${x} ${y + 26 * k} L${x - 6 * k} ${y + 6 * k} L${x - 26 * k} ${y} L${x - 6 * k} ${y - 6 * k} Z`} fill="#fff7c2" />; })}</g>;
          case "confetti": return <g key={f}>{n(50).map((_, i) => { const x = (i * 149 + Math.sin(t * 3 + i) * 30 + seed) % W, y = (i * 211 + tl * 500) % H; return <rect key={i} x={x} y={y} width={16} height={26} fill={["#ff4f7a", "#ffd23f", "#4fc3ff", "#7ee08a"][i % 4]} transform={`rotate(${t * 200 + i * 30} ${x} ${y})`} />; })}</g>;
          case "fog": return <g key={f}>{[0, 1, 2].map((i) => <ellipse key={i} cx={(i * 500 + t * 30) % 1800 - 300} cy={1250 + i * 120} rx={600} ry={110} fill="#fff" opacity={0.18} />)}</g>;
          case "smoke": return <g key={f}>{n(8).map((_, i) => <ellipse key={i} cx={100 + (i * 137 + seed) % 900 + Math.sin(t + i) * 40} cy={1150 - ((t * 50 + i * 140) % 1000)} rx={140 + i * 20} ry={70 + i * 8} fill="#5e5e68" opacity={0.08 + 0.05 * Math.sin((t * 50 + i * 140) / 320)} />)}</g>;
          case "lightning": { const on = (t % 3.7) < 0.12 || ((t + 0.25) % 3.7) < 0.06; return on ? <g key={f}><rect width={W} height={H} fill="#eef4ff" opacity={0.55} /><path d={`M${600 + (seed % 200)} 0 l-60 260 l50 0 l-80 300`} stroke="#fff" strokeWidth={10} fill="none" /></g> : null; }
        }
        return null;
      })}
    </svg>
  );
};

// Texturen pro Look (billig: SVG-Muster, kein Filter)
export const Texture: React.FC<{kind: string; vignette: number}> = ({kind, vignette}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0, pointerEvents: "none"}}>
    <defs>
      <pattern id="tx-paper" width="64" height="64" patternUnits="userSpaceOnUse"><circle cx="9" cy="13" r="1.6" fill="#5a4030" opacity="0.18" /><circle cx="41" cy="29" r="1.2" fill="#5a4030" opacity="0.15" /><circle cx="25" cy="51" r="1.8" fill="#fff" opacity="0.22" /><path d="M2 40 l12 -3" stroke="#5a4030" strokeWidth="1" opacity="0.1" /></pattern>
      <pattern id="tx-halftone" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="7" cy="7" r="2.2" fill="#000" opacity="0.09" /></pattern>
      <pattern id="tx-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="#fff" opacity="0.13" /></pattern>
      <pattern id="tx-lines" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)"><path d="M0 5 h10" stroke="#fff" strokeWidth="1.2" opacity="0.08" /></pattern>
      <radialGradient id="tx-vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity={vignette} /></radialGradient>
    </defs>
    {kind !== "none" && <rect width={W} height={H} fill={`url(#tx-${kind})`} />}
    <rect width={W} height={H} fill="url(#tx-vig)" />
  </svg>
);

// Hook-Aufbauten / Einblendungen. Bleiben aus der unteren 20-%-Zone und vom rechten Rand weg.
export const Overlays: React.FC<{list: Overlay[]; tl: number; dur: number}> = ({list, tl, dur}) => {
  const s = useS(); const cap = s.look.cap;
  const inn = (d = 0, len = 0.35) => Math.min(1, Math.max(0, (tl - d) / len));
  const ease = (x: number) => 1 - Math.pow(1 - x, 3);
  const back = (x: number) => { const c1 = 1.7; return 1 + (c1 + 1) * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const font = cap.font;
  return (
    <>
      {list.map((o, n) => {
        const p = inn(0.1 * n); const e = ease(p);
        const box = (txt: string, top: number, size: number, bg: string, fg: string, rot = 0, k = n) => (
          <div key={k} style={{position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", transform: `translateY(${(1 - e) * -40}px) rotate(${rot}deg)`, opacity: e}}>
            <div style={{fontFamily: font, fontSize: size, color: fg, background: bg, padding: "10px 34px", borderRadius: 14, border: `6px solid ${s.ink === "#f4f1e8" ? "#1b252b" : s.ink}`, letterSpacing: 2, whiteSpace: "pre"}}>{txt}</div>
          </div>
        );
        switch (o.kind) {
          case "date": { const txt = (o.text ?? "").slice(0, Math.floor(Math.max(0, tl - 0.15) * 16)); return (
            <div key={n} style={{position: "absolute", left: 90, top: 330, fontFamily: "'Courier New', 'DejaVu Sans Mono', monospace", fontWeight: 700, fontSize: 64, color: "#fff", textShadow: "0 0 10px rgba(0,0,0,.8), 3px 3px 0 #000", letterSpacing: 4}}>
              {txt}<span style={{opacity: Math.floor(tl * 3) % 2 ? 1 : 0}}>▌</span>{o.sub && <div style={{fontSize: 40, opacity: inn(0.8)}}>{o.sub}</div>}
            </div>); }
          case "place": return (
            <div key={n} style={{position: "absolute", left: 90, top: 330, display: "flex", alignItems: "center", gap: 18, opacity: e, transform: `translateX(${(1 - e) * -60}px)`}}>
              <svg width="70" height="90" viewBox="0 0 70 90"><path d="M35 88 C10 55 4 42 4 31 a31 31 0 0 1 62 0 c0 11 -6 24 -31 57 z" fill="#e0392b" stroke="#111" strokeWidth="5" /><circle cx="35" cy="31" r="11" fill="#fff" /></svg>
              <div style={{fontFamily: font, fontSize: 60, color: "#fff", textShadow: "3px 3px 0 #000, 0 0 12px rgba(0,0,0,.7)"}}>{o.text}{o.sub && <div style={{fontSize: 38}}>{o.sub}</div>}</div>
            </div>);
          case "counter": case "timer": { const a = o.from ?? 0, b = o.to ?? 100; const v = o.kind === "timer" ? Math.max(b, a - Math.floor(tl)) : Math.round(a + (b - a) * ease(Math.min(1, tl / Math.max(0.8, dur * 0.6))));
            return (
              <div key={n} style={{position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: font, color: cap.active, transform: `scale(${back(Math.max(0.01, p))})`}}>
                <div style={{fontSize: 230, lineHeight: 1, WebkitTextStroke: `12px ${cap.stroke}`, paintOrder: "stroke fill"}}>{v.toLocaleString("en-US")}</div>
                {o.text && <div style={{fontSize: 64, color: "#fff", WebkitTextStroke: `8px ${cap.stroke}`, paintOrder: "stroke fill"}}>{o.text}</div>}
              </div>); }
          case "title": return box(o.text ?? "", 300, 76, cap.active, cap.stroke, -2);
          case "question": return (
            <div key={n} style={{position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", transform: `scale(${back(Math.max(0.01, p))}) rotate(${Math.sin(tl * 3) * 4}deg)`}}>
              <div style={{fontFamily: font, fontSize: 300, lineHeight: 1, color: cap.active, WebkitTextStroke: `14px ${cap.stroke}`, paintOrder: "stroke fill"}}>?</div>
              {o.text && <div style={{fontFamily: font, fontSize: 62, color: "#fff", WebkitTextStroke: `8px ${cap.stroke}`, paintOrder: "stroke fill", padding: "0 100px"}}>{o.text}</div>}
            </div>);
          case "stamp": { const sc = p < 1 ? 2.2 - 1.2 * e : 1; return (
            <div key={n} style={{position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 2)}}>
              <div style={{transform: `rotate(-12deg) scale(${sc})`, border: "10px solid #d8322a", color: "#d8322a", fontFamily: "Anton", fontSize: 92, padding: "4px 30px", borderRadius: 12, letterSpacing: 6, background: "rgba(255,255,255,.12)"}}>{o.text ?? "TRUE STORY"}</div>
            </div>); }
          case "circle": case "arrow": { const x = (o.x ?? 0.5) * W, y = (o.y ?? 0.6) * H; const len = 1150; const dash = len * (1 - e);
            return (
              <svg key={n} width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
                {o.kind === "circle" ? <ellipse cx={x} cy={y} rx={170} ry={150} fill="none" stroke="#e8302a" strokeWidth={16} strokeDasharray={len} strokeDashoffset={dash} strokeLinecap="round" transform={`rotate(-8 ${x} ${y})`} />
                  : <g><path d={`M${x - 260} ${y - 300} Q${x - 260} ${y - 60} ${x - 40} ${y - 30}`} fill="none" stroke="#e8302a" strokeWidth={18} strokeDasharray={len} strokeDashoffset={dash} strokeLinecap="round" />{e > 0.9 && <path d={`M${x - 90} ${y - 70} L${x - 30} ${y - 30} L${x - 100} ${y + 5}`} fill="none" stroke="#e8302a" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />}</g>}
                {o.text && <text x={o.kind === "circle" ? x : x - 260} y={o.kind === "circle" ? y - 185 : y - 330} textAnchor="middle" fontFamily={font} fontSize={58} fill="#fff" stroke="#111" strokeWidth={10} paintOrder="stroke" opacity={e}>{o.text}</text>}
              </svg>); }
          case "label": return (
            <div key={n} style={{position: "absolute", left: (o.x ?? 0.5) * W - 200, width: 400, top: (o.y ?? 0.5) * H, textAlign: "center", opacity: e, transform: `translateY(${(1 - e) * 20}px)`}}>
              <span style={{fontFamily: font, fontSize: 52, color: "#111", background: "#fff", padding: "6px 20px", borderRadius: 10, border: "5px solid #111"}}>{o.text}</span>
            </div>);
          case "map": { const pin = Math.min(1, Math.max(0, (tl - 0.6) / 0.9));
            return (
              <svg key={n} width={W} height={H} style={{position: "absolute", left: 0, top: 0, opacity: e}}>
                <g transform={`translate(140 240) rotate(-2)`}>
                  <rect width={800} height={560} rx={20} fill="#efe2c2" stroke="#2a1d1a" strokeWidth={8} />
                  <path d="M80 120 q90 -60 180 -10 t160 30 q60 60 10 130 t-120 90 q-140 40 -200 -40 t-30 -200 z" fill="#b9cf8a" stroke="#2a1d1a" strokeWidth={6} />
                  <path d="M520 300 q70 -90 170 -40 q40 80 -20 160 q-90 40 -150 -30 z" fill="#c9d69a" stroke="#2a1d1a" strokeWidth={6} />
                  <path d={`M230 230 Q420 120 ${620} 330`} fill="none" stroke="#c0392b" strokeWidth={8} strokeDasharray="22 16" pathLength={100} style={{strokeDashoffset: 0}} opacity={pin} />
                  <g transform={`translate(${230 + 390 * pin} ${230 + 100 * pin - Math.sin(pin * Math.PI) * 120})`}><path d="M0 0 C-22 -30 -26 -40 -26 -50 a26 26 0 0 1 52 0 c0 10 -4 20 -26 50 z" fill="#e0392b" stroke="#111" strokeWidth={5} /></g>
                  {o.text && <text x={400} y={520} textAnchor="middle" fontFamily={font} fontSize={50} fill="#2a1d1a">{o.text}</text>}
                </g>
              </svg>); }
          case "freeze": return (
            <div key={n} style={{position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", opacity: e}}>
              <div style={{display: "inline-block", fontFamily: font, fontSize: 78, color: "#fff", background: "#111", padding: "8px 30px", transform: "rotate(-3deg)"}}>{o.text}</div>
              {o.sub && <div style={{fontFamily: font, fontSize: 46, color: "#111", background: cap.active, display: "inline-block", padding: "4px 20px", marginTop: 16, transform: "rotate(2deg)", opacity: inn(0.6)}}>{o.sub}</div>}
            </div>);
        }
        return null;
      })}
    </>
  );
};
