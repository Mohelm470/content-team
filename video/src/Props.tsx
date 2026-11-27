// Requisiten: eigene einfache Formen. Fußpunkt = (0,0), Höhe bei scale 1 ca. 150–400 px.
import React from "react";
import {PropKind} from "./types";
import {inkProps, tint, useS} from "./style";

type P = {kind: PropKind; color?: string; t: number; label?: string; r?: number};

export const PropShape: React.FC<P> = ({kind, color, t, label, r = 0.5}) => {
  const s = useS(); const k = inkProps(s, 6); const c = (h: string) => s.c(color ?? h); const C = s.c;
  switch (kind) {
    case "tree": return <g><rect x={-18} y={-150} width={36} height={150} fill={C("#6b4630")} {...k} />
      <circle cx={-55} cy={-190} r={80} fill={c("#4f8a43")} {...k} /><circle cx={55} cy={-200} r={85} fill={c("#4f8a43")} {...k} /><circle cx={0} cy={-270} r={95} fill={tint(c("#4f8a43"), 1.1)} {...k} /></g>;
    case "pine": return <g><rect x={-14} y={-40} width={28} height={40} fill={C("#5a3b2a")} {...k} />
      <path d="M-95 -40 L0 -220 L95 -40 Z" fill={c("#355f3a")} {...k} /><path d="M-70 -140 L0 -300 L70 -140 Z" fill={tint(c("#355f3a"), 1.12)} {...k} /></g>;
    case "palm": return <g><path d="M-12 0 Q-30 -150 10 -300 L30 -300 Q-8 -150 14 0 Z" fill={C("#9a6b3f")} {...k} />
      {[-150, -110, -60, -20, 30].map((a, i) => <path key={i} d={`M20 -300 q${Math.cos(a / 57) * 90} ${Math.sin(a / 57) * 60 - 20} ${Math.cos(a / 57) * 170} ${Math.sin(a / 57) * 100 + 40}`} stroke={s.ink} strokeWidth={s.lw(30)} fill="none" strokeLinecap="round" />)}
      {[-150, -110, -60, -20, 30].map((a, i) => <path key={"g" + i} d={`M20 -300 q${Math.cos(a / 57) * 90} ${Math.sin(a / 57) * 60 - 20} ${Math.cos(a / 57) * 170} ${Math.sin(a / 57) * 100 + 40}`} stroke={c("#4c9a4a")} strokeWidth={18} fill="none" strokeLinecap="round" />)}</g>;
    case "bush": return <g><circle cx={-50} cy={-45} r={55} fill={c("#5e9a4c")} {...k} /><circle cx={40} cy={-50} r={60} fill={c("#5e9a4c")} {...k} /><circle cx={0} cy={-80} r={55} fill={tint(c("#5e9a4c"), 1.1)} {...k} /></g>;
    case "rock": return <path d="M-110 0 L-90 -70 L-20 -110 L60 -90 L110 -20 L100 0 Z" fill={c("#8d8a86")} {...k} />;
    case "cactus": return <g fill={c("#4f9a5a")} {...k}><rect x={-30} y={-260} width={60} height={260} rx={30} /><path d="M-30 -130 h-50 v-70 a20 20 0 0 1 40 0 v30 h10" /><path d="M30 -160 h45 v-60 a20 20 0 0 1 -40 0" /></g>;
    case "flowers": return <g>{[-60, -20, 25, 65].map((x, i) => <g key={i}><path d={`M${x} 0 v-${50 + i * 8}`} stroke={C("#3f7a3a")} strokeWidth={6} /><circle cx={x} cy={-55 - i * 8} r={16} fill={c(["#ff6f91", "#ffd23f", "#ffffff", "#9b7bff"][i])} {...inkProps(s, 4)} /></g>)}</g>;
    case "fence": return <g fill={c("#c8a374")} {...k}>{[-160, -80, 0, 80, 160].map((x) => <path key={x} d={`M${x - 16} 0 v-120 l16 -22 l16 22 v120 z`} />)}<rect x={-190} y={-95} width={380} height={20} /><rect x={-190} y={-50} width={380} height={20} /></g>;
    case "lamp": return <g><rect x={-10} y={-380} width={20} height={380} fill={C("#3a3a46")} {...k} /><path d="M-36 -380 h72 l-16 -50 h-40 z" fill={C("#3a3a46")} {...k} />
      <circle cx={0} cy={-400} r={22} fill="#ffe9a8" /><circle cx={0} cy={-395} r={110} fill="#ffe9a8" opacity={0.18} /></g>;
    case "lantern": return <g><path d="M-30 -120 h60 v90 h-60 z" fill="#ffd77a" {...k} /><path d="M-38 -120 h76 l-14 -24 h-48 z M-38 -30 h76 v12 h-76 z" fill={C("#4a3a30")} {...k} /><circle cx={0} cy={-75} r={90} fill="#ffd77a" opacity={0.2} /></g>;
    case "bench": return <g fill={c("#9a6a42")} {...k}><rect x={-150} y={-90} width={300} height={22} /><rect x={-150} y={-150} width={300} height={22} /><rect x={-130} y={-70} width={18} height={70} /><rect x={112} y={-70} width={18} height={70} /></g>;
    case "sign": return <g><rect x={-10} y={-200} width={20} height={200} fill={C("#7a5434")} {...k} /><rect x={-110} y={-260} width={220} height={90} rx={10} fill={c("#e8d8b0")} {...k} />
      {label && <text x={0} y={-202} textAnchor="middle" fontFamily="Lilita One" fontSize={42} fill={s.ink}>{label}</text>}</g>;
    case "house": return <g><rect x={-120} y={-180} width={240} height={180} fill={c("#e3c89e")} {...k} /><path d="M-145 -180 L0 -300 L145 -180 Z" fill={C("#a8473a")} {...k} />
      <rect x={60} y={-300} width={34} height={70} fill={C("#7a5a4a")} {...k} /><rect x={-26} y={-100} width={52} height={100} fill={tint(c("#e3c89e"), 0.55)} {...k} />
      <rect x={-95} y={-145} width={44} height={44} fill="#f6e3a0" {...k} /><rect x={51} y={-145} width={44} height={44} fill="#f6e3a0" {...k} /></g>;
    case "kennel": return <g><rect x={-90} y={-110} width={180} height={110} fill={c("#b0743f")} {...k} /><path d="M-110 -110 L0 -190 L110 -110 Z" fill={C("#7c3b2e")} {...k} /><path d="M-40 0 v-60 a40 40 0 0 1 80 0 v60 z" fill={s.ink} /></g>;
    case "tent": return <g><path d="M-170 0 L0 -230 L170 0 Z" fill={c("#d98c3f")} {...k} /><path d="M-40 0 L0 -230 L40 0 Z" fill={tint(c("#d98c3f"), 0.6)} {...k} /></g>;
    case "fire": { const f = Math.sin(t * 14) * 8; return <g><path d="M-60 0 l120 -20 M-60 -20 l120 20" stroke={C("#6b4630")} strokeWidth={s.lw(18)} strokeLinecap="round" />
      <path d={`M-50 -10 Q-60 -80 ${-10 + f} -160 Q10 -90 30 -120 Q60 -60 50 -10 Z`} fill="#ff8a2b" {...k} /><path d={`M-24 -14 Q-28 -60 ${2 - f} -100 Q20 -50 26 -14 Z`} fill="#ffe066" />
      <circle cx={0} cy={-70} r={170} fill="#ffb347" opacity={0.15 + 0.04 * Math.sin(t * 9)} /></g>; }
    case "car": return <g><path d="M-190 -40 v-70 q0 -20 20 -24 l60 -10 l50 -60 h150 l60 70 q50 6 50 40 v54 z" fill={c("#d9533f")} {...k} />
      <path d="M-90 -146 l40 -46 h60 v46 z M30 -146 v-46 h70 l40 46 z" fill="#bfe3f2" {...k} /><circle cx={-110} cy={-30} r={38} fill={s.ink} /><circle cx={130} cy={-30} r={38} fill={s.ink} /><circle cx={-110} cy={-30} r={14} fill="#ccc" /><circle cx={130} cy={-30} r={14} fill="#ccc" /></g>;
    case "boat": return <g transform={`rotate(${Math.sin(t * 1.5) * 3})`}><path d="M-200 -80 h400 l-60 80 h-280 z" fill={c("#b25a3c")} {...k} /><rect x={-8} y={-330} width={16} height={250} fill={C("#6b4630")} {...k} />
      <path d="M8 -320 L160 -110 H8 Z" fill="#f4efe3" {...k} /></g>;
    case "cart": return <g><path d="M-150 -60 h260 l20 -110 h-300 z" fill={c("#b9884f")} {...k} /><circle cx={-80} cy={-40} r={45} fill={C("#6b4630")} {...k} /><circle cx={70} cy={-40} r={45} fill={C("#6b4630")} {...k} /><path d="M110 -100 l120 -30" {...k} fill="none" strokeWidth={s.lw(12)} /></g>;
    case "well": return <g><rect x={-90} y={-110} width={180} height={110} fill={c("#9a9590")} {...k} /><rect x={-80} y={-300} width={16} height={190} fill={C("#6b4630")} {...k} /><rect x={64} y={-300} width={16} height={190} fill={C("#6b4630")} {...k} /><path d="M-120 -290 L0 -360 L120 -290 Z" fill={C("#a8473a")} {...k} /></g>;
    case "crate": return <g fill={c("#c08a4e")} {...k}><rect x={-70} y={-140} width={140} height={140} /><path d="M-70 -140 L70 0 M70 -140 L-70 0" fill="none" /></g>;
    case "barrel": return <g><rect x={-55} y={-150} width={110} height={150} rx={30} fill={c("#9a6a42")} {...k} /><path d="M-55 -110 h110 M-55 -40 h110" {...k} fill="none" /></g>;
    case "suitcase": return <g><rect x={-60} y={-100} width={120} height={100} rx={12} fill={c("#8a5a3a")} {...k} /><path d="M-22 -100 v-20 h44 v20" {...k} fill="none" /><path d="M-60 -60 h120" {...k} /></g>;
    case "letter": return <g transform={`rotate(${Math.sin(t * 2) * 3})`}><rect x={-60} y={-80} width={120} height={80} fill={c("#f4ecd8")} {...k} /><path d="M-60 -80 L0 -35 L60 -80" {...k} fill="none" /><circle cx={0} cy={-35} r={10} fill="#c0392b" /></g>;
    case "photo": return <g transform="rotate(-6)"><rect x={-70} y={-150} width={140} height={150} fill="#fbf8f0" {...k} /><rect x={-56} y={-136} width={112} height={98} fill={c("#9fb8c9")} /><circle cx={-16} cy={-95} r={18} fill={C("#ffe2c2")} {...inkProps(s, 3)} /><circle cx={22} cy={-88} r={14} fill={C("#b98a55")} {...inkProps(s, 3)} /></g>;
    case "bone": return <g fill="#f6f1e4" {...k}><rect x={-50} y={-26} width={100} height={20} rx={8} /><circle cx={-52} cy={-30} r={14} /><circle cx={-52} cy={-8} r={14} /><circle cx={52} cy={-30} r={14} /><circle cx={52} cy={-8} r={14} /></g>;
    case "ball": return <g transform={`translate(0 ${-Math.abs(Math.sin(t * 5)) * 30})`}><circle cx={0} cy={-36} r={36} fill={c("#e8463c")} {...k} /><path d="M-36 -36 q36 18 72 0" stroke="#fff" strokeWidth={8} fill="none" /></g>;
    case "flag": return <g><rect x={-6} y={-360} width={12} height={360} fill={C("#555")} {...k} /><path d={`M6 -350 q50 ${-14 + Math.sin(t * 4) * 10} 100 0 t100 0 v110 q-50 ${-14 + Math.sin(t * 4 + 1) * 10} -100 0 t-100 0 z`} fill={c("#e0e0e0")} {...k} /></g>;
    case "bed": return <g><rect x={-200} y={-110} width={400} height={70} fill={c("#6f8fc6")} {...k} /><rect x={-200} y={-180} width={30} height={180} fill={C("#7a5434")} {...k} /><rect x={170} y={-140} width={30} height={140} fill={C("#7a5434")} {...k} /><ellipse cx={-120} cy={-125} rx={50} ry={24} fill="#fff" {...k} /></g>;
    case "table": return <g fill={c("#9a6a42")} {...k}><rect x={-160} y={-160} width={320} height={26} /><rect x={-140} y={-134} width={20} height={134} /><rect x={120} y={-134} width={20} height={134} /></g>;
    case "chair": return <g fill={c("#9a6a42")} {...k}><rect x={-50} y={-110} width={100} height={20} /><rect x={30} y={-240} width={20} height={240} /><rect x={-50} y={-90} width={16} height={90} /></g>;
    case "window": return <g><rect x={-120} y={-300} width={240} height={300} fill={C("#9fc7e8")} {...k} /><path d="M0 -300 v300 M-120 -150 h240" {...k} /><rect x={-140} y={-20} width={280} height={24} fill={C("#e8dcc4")} {...k} /></g>;
    case "door": return <g><rect x={-80} y={-280} width={160} height={280} fill={c("#8a5434")} {...k} /><circle cx={50} cy={-140} r={10} fill="#f0c94a" /></g>;
    case "clock": { const a = t * 30; return <g><circle cx={0} cy={-90} r={80} fill="#fbf8f0" {...k} /><path d={`M0 -90 l${Math.sin(a / 57) * 50} ${-Math.cos(a / 57) * 50} M0 -90 l${Math.sin(a / 700) * 34} ${-Math.cos(a / 700) * 34}`} {...k} fill="none" /></g>; }
    case "train": return <g><rect x={-420} y={-300} width={840} height={260} rx={30} fill={c("#3f6e9a")} {...k} />{[-330, -150, 30, 210].map((x) => <rect key={x} x={x} y={-260} width={130} height={90} rx={10} fill="#ffe7a8" {...k} />)}<rect x={-420} y={-120} width={840} height={30} fill={C("#e8c547")} />{[-300, -150, 150, 300].map((x) => <circle key={x} cx={x} cy={-30} r={34} fill={s.ink} />)}</g>;
    case "plane": return <g transform={`rotate(-8) translate(${(t * 60) % 400 - 200} 0)`}><path d="M-160 -20 q0 -30 40 -30 h200 q50 0 60 30 q-10 20 -60 20 h-200 q-40 0 -40 -20 z" fill={c("#e6e9ee")} {...k} /><path d="M-30 -20 l-70 90 h40 l80 -90 z M-120 -40 l-40 -60 h30 l50 60 z" fill={C("#b8c0cc")} {...k} /></g>;
    case "gravestone": return <g><path d="M-70 0 v-150 a70 70 0 0 1 140 0 v150 z" fill={c("#a7a9ad")} {...k} />{label && <text x={0} y={-130} textAnchor="middle" fontFamily="Lilita One" fontSize={34} fill={s.ink}>{label}</text>}</g>;
    case "mailbox": return <g><rect x={-8} y={-160} width={16} height={160} fill={C("#6b4630")} {...k} /><path d="M-60 -160 v-60 a40 40 0 0 1 40 -40 h40 a40 40 0 0 1 40 40 v60 z" fill={c("#3d6fb6")} {...k} /><path d="M60 -230 h30 v30 h-30" fill="#e0392b" {...k} /></g>;
    case "bowl": return <g><path d="M-70 -50 h140 q-10 50 -70 50 q-60 0 -70 -50 z" fill={c("#d9533f")} {...k} /><ellipse cx={0} cy={-50} rx={70} ry={12} fill={C("#8a5a3a")} {...k} /></g>;
    case "phone": return <g><rect x={-30} y={-110} width={60} height={110} rx={12} fill={C("#2b2b33")} {...k} /><rect x={-22} y={-98} width={44} height={80} rx={4} fill={r > 0 ? "#9fd3ff" : "#333"} /></g>;
  }
  return null;
};
