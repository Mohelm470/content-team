// Orte (16 Sets) mit Licht, Parallax und Seed-Varianz. Requisiten werden in Video.tsx nach Ebenen gezeichnet.
import React from "react";
import {Light, SetName} from "./types";
import {inkProps, LIGHTS, rng, tint, useS} from "./style";

export const W = 1080, H = 1920, HOR = 1180;
export const GROUND_Y = HOR + 520; // Fußlinie vorne
export const groundAt = (z: number) => GROUND_Y - (GROUND_Y - HOR - 150) * z; // Tiefe 0..1 → y
export const scaleAt = (z: number) => 1 - 0.55 * z;

const GROUND: Record<SetName, string> = {
  field: "#7da85a", village: "#b3a684", sea: "#e8cf98", forest: "#4f7a45", snow: "#eef3f8", city: "#8a8d95", desert: "#e6b874",
  mountain: "#8fa06a", harbor: "#9c7b58", room: "#a8774f", street: "#8f8a86", station: "#9a9590", river: "#79a35a", ruins: "#8d8276", farm: "#9cb65a", void: "#3a3346",
};
const INDOOR = new Set<SetName>(["room", "void"]);

export const Background: React.FC<{set: SetName; light: Light; px: number; t: number; seed: number}> = ({set, light, px, t, seed}) => {
  const s = useS(); const C = s.c; const L = LIGHTS[light]; const k = inkProps(s, 6); const r = rng(seed);
  const P = (d: number) => `translate(${px * d} 0)`;
  const id = `g${seed}`;
  const hills = (c: string, y: number, amp: number, sd: number, step = 100) => {
    let d = `M-300 ${H} L-300 ${y}`;
    for (let x = -300; x <= W + 300; x += step) d += ` L${x} ${y - amp * (0.5 + 0.5 * Math.sin(x * 0.006 + sd) * Math.cos(x * 0.0023 + sd * 2))}`;
    return <path d={d + ` L${W + 300} ${H} Z`} fill={c} {...k} />;
  };
  const peaks = (c: string, y: number, hgt: number, n: number, snowCap: boolean) => {
    const out: React.ReactNode[] = [];
    for (let j = 0; j < n; j++) {
      const cx = -100 + j * ((W + 200) / (n - 1)) + (r() - 0.5) * 120, h = hgt * (0.7 + r() * 0.5), w = 260 + r() * 160;
      out.push(<g key={j}><path d={`M${cx - w} ${y} L${cx} ${y - h} L${cx + w} ${y} Z`} fill={c} {...k} />
        {snowCap && <path d={`M${cx - w * 0.28} ${y - h * 0.72} L${cx} ${y - h} L${cx + w * 0.28} ${y - h * 0.72} l-40 30 l-40 -24 l-40 28 z`} fill={C("#f4f7fb")} {...k} />}</g>);
    }
    return out;
  };
  const g = C(GROUND[set]);
  const sky = INDOOR.has(set) ? null : (
    <>
      <rect width={W} height={H} fill={`url(#sky${id})`} />
      {L.stars && Array.from({length: 46}).map((_, i) => <circle key={i} cx={(i * 197 + seed) % W} cy={(i * 131 + seed * 3) % 760} r={2.5 + (i % 3)} fill="#fff7d6" opacity={0.45 + 0.45 * Math.sin(t * 2 + i)} />)}
      {L.moon && <g transform={P(0.08)}><circle cx={760 - (seed % 300)} cy={330} r={80} fill="#fff4cf" /><circle cx={790 - (seed % 300)} cy={310} r={70} fill={C("#1d2b5c")} opacity={0.0} /><circle cx={760 - (seed % 300)} cy={330} r={150} fill="#fff4cf" opacity={0.08} /></g>}
      {L.sun && <g transform={P(0.08)}><circle cx={L.sun.x * W} cy={L.sun.y * H} r={L.sun.r * 1.9} fill={L.sun.c} opacity={0.18} /><circle cx={L.sun.x * W} cy={L.sun.y * H} r={L.sun.r} fill={L.sun.c} /></g>}
      {L.rays && L.sun && [0, 1, 2, 3, 4].map((j) => <path key={j} d={`M${L.sun!.x * W} ${L.sun!.y * H} L${-200 + j * 330} ${H} L${-80 + j * 330} ${H} Z`} fill="#fff3c8" opacity={0.07 + 0.03 * Math.sin(t + j)} />)}
      <g transform={P(0.15)}>{[0, 1, 2, 3].map((i) => { const cy = 200 + ((seed * (i + 3)) % 420); const cx = ((i * 380 + seed * 7 + t * (10 + i * 3)) % 1700) - 300; const rx = 120 + ((seed + i * 37) % 90);
        return <g key={i} opacity={light === "night" ? 0.15 : light === "storm" ? 0.9 : 0.85}><ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.32} fill={light === "storm" ? C("#4a5263") : "#fff"} /><ellipse cx={cx - rx * 0.35} cy={cy - rx * 0.2} rx={rx * 0.5} ry={rx * 0.32} fill={light === "storm" ? C("#4a5263") : "#fff"} /></g>; })}</g>
    </>
  );

  let mid: React.ReactNode = null; let near: React.ReactNode = null; let floor: React.ReactNode = null;
  switch (set) {
    case "field": case "farm": case "river":
      mid = <g transform={P(0.3)}>{hills(C("#8fb3c9"), HOR - 70, 150, seed % 7)}</g>;
      near = <g transform={P(0.55)}>{hills(tint(g, 0.92), HOR + 40, 70, seed % 5 + 2)}
        {set === "farm" && <g transform={`translate(${250 + (seed % 500)} ${HOR + 70}) scale(1.1)`}><rect x={-160} y={-200} width={320} height={200} fill={C("#b8452f")} {...k} /><path d="M-190 -200 L0 -330 L190 -200 Z" fill={C("#6e2a22")} {...k} /><rect x={-60} y={-120} width={120} height={120} fill={C("#f1e6d0")} {...k} /><path d="M-60 -120 L60 0 M60 -120 L-60 0" {...k} /></g>}
        {Array.from({length: 4}).map((_, j) => <circle key={j} cx={80 + j * 280 + (seed * j) % 90} cy={HOR + 20 - (j % 2) * 30} r={40 + (j % 3) * 12} fill={C("#5d8f4a")} {...k} />)}</g>;
      floor = <>
        {set === "river" && <path d={`M${-200 + px * 0.9} ${HOR + 160} C 300 ${HOR + 200} 700 ${HOR + 240} ${W + 200} ${HOR + 180} L${W + 200} ${HOR + 330} C 700 ${HOR + 400} 300 ${HOR + 340} -200 ${HOR + 330} Z`} fill={C("#4f93c7")} {...k} />}
        {set === "river" && Array.from({length: 8}).map((_, j) => <path key={j} d={`M${(j * 160 + t * 50) % 1300 - 100} ${HOR + 230 + (j % 3) * 30} q30 -10 60 0`} stroke="#d9efff" strokeWidth={5} fill="none" strokeLinecap="round" />)}
        {Array.from({length: 26}).map((_, j) => <path key={j} d={`M${(j * 97 + seed) % W} ${HOR + 360 + ((j * 53) % 380)} l-8 -26 m8 26 l8 -24`} stroke={tint(g, 0.7)} strokeWidth={5} fill="none" strokeLinecap="round" />)}</>;
      break;
    case "village":
      mid = <g transform={P(0.3)}>{hills(C("#8fa9b8"), HOR - 60, 130, seed % 6)}</g>;
      near = <g transform={P(0.5)}>{[0, 1, 2, 3].map((i) => { const cs = ["#e8d3a8", "#d9a88a", "#cfd8c0", "#e7c3c3", "#c9d4e6"]; const x = -40 + i * 330 + (seed * (i + 1)) % 60; const sc = 1.05 + ((seed + i) % 3) * 0.18;
        const flat = (seed + i) % 3 === 0;
        return <g key={i} transform={`translate(${x} ${HOR + 60}) scale(${sc})`}>
          <rect x={-110} y={-170} width={220} height={170} fill={C(cs[(seed + i) % 5])} {...k} />
          {flat ? <rect x={-125} y={-195} width={250} height={30} fill={C("#6f5d50")} {...k} /> : <path d="M-130 -170 L0 -280 L130 -170 Z" fill={C(["#a8473a", "#5d6f8a", "#7a5a3a"][(seed + i) % 3])} {...k} />}
          <rect x={-22} y={-92} width={44} height={92} fill={C("#7a5a4a")} {...k} />
          <rect x={46} y={-130} width={40} height={40} fill={light === "night" || light === "dusk" ? "#ffd977" : "#f3e3a6"} {...k} /><rect x={-86} y={-130} width={40} height={40} fill={light === "night" || light === "dusk" ? "#ffd977" : "#f3e3a6"} {...k} />
          {!flat && <g><rect x={50} y={-270} width={30} height={60} fill={C("#7a5a4a")} {...k} />{[0, 1, 2].map((j) => <circle key={j} cx={65 + Math.sin(t + j) * 10 + j * 8} cy={-290 - j * 40 - ((t * 30) % 40)} r={14 + j * 6} fill="#eeeeee" opacity={0.5 - j * 0.12} />)}</g>}
        </g>; })}</g>;
      floor = <path d={`M${300 + px} ${H} L${480 + px * 0.6} ${HOR + 130} L${600 + px * 0.6} ${HOR + 130} L${860 + px} ${H} Z`} fill={C("#d6c7a0")} opacity={0.8} />;
      break;
    case "sea": case "harbor":
      mid = <g transform={P(0.3)}>{hills(C("#9ab4c8"), HOR - 80, 90, seed % 4)}<rect x={-300} y={HOR - 70} width={W + 600} height={400} fill={C("#3b86bd")} {...k} />
        {Array.from({length: 10}).map((_, i) => <path key={i} d={`M${(i * 150 + t * 30 + seed) % 1400 - 200} ${HOR - 20 + (i % 4) * 45} q30 -12 60 0 t60 0`} stroke="#d9efff" strokeWidth={6} fill="none" strokeLinecap="round" />)}
        <g transform={`translate(${(seed * 3) % 700 + 150} ${HOR - 60}) scale(0.35)`}><path d={`M-200 -80 h400 l-60 80 h-280 z`} fill={C("#7a4a3a")} {...k} /><path d="M8 -320 L160 -110 H8 Z" fill="#f4efe3" {...k} /></g></g>;
      floor = set === "sea" ? <>{Array.from({length: 6}).map((_, i) => <path key={i} d={`M${(i * 210 + t * 40) % 1300 - 100} ${HOR + 70 + (i % 3) * 16} q40 -18 80 0`} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85} />)}<path d={`M-300 ${HOR + 122} ${Array.from({length: 16}).map((_, i) => `q40 ${12 + 6 * Math.sin(t * 2 + i)} 80 0`).join(" ")}`} fill="none" stroke="#fff" strokeWidth={10} opacity={0.9} /></>
        : <g><rect x={-300} y={HOR + 150} width={W + 600} height={40} fill={C("#6b4630")} {...k} />{Array.from({length: 12}).map((_, i) => <path key={i} d={`M${-100 + i * 110 + px} ${HOR + 190} V${H}`} stroke={tint(g, 0.75)} strokeWidth={5} />)}
          {[0, 1, 2].map((i) => <rect key={i} x={60 + i * 420 + px * 0.9} y={HOR + 60} width={30} height={130} fill={C("#5a3b2a")} {...k} />)}</g>;
      break;
    case "forest":
      mid = <g transform={P(0.3)}>{Array.from({length: 9}).map((_, i) => <path key={i} d={`M${i * 140 - 80} ${HOR + 40} l80 -${300 + (seed * (i + 2)) % 160} l80 ${300 + (seed * (i + 2)) % 160} z`} fill={C("#2f5a44")} {...k} />)}</g>;
      near = <g transform={P(0.6)}>{Array.from({length: 6}).map((_, i) => <g key={i} transform={`translate(${i * 210 - 40 + (seed * i) % 60} ${HOR + 110})`}><rect x={-26} y={-520} width={52} height={520} fill={C("#5a3b2a")} {...k} /><circle cx={0} cy={-560} r={150 + (i % 2) * 30} fill={C(i % 2 ? "#3f7a45" : "#4c8a4a")} {...k} /></g>)}</g>;
      floor = <>{Array.from({length: 14}).map((_, j) => <circle key={j} cx={(j * 151 + seed) % W} cy={HOR + 300 + (j * 71) % 360} r={10 + (j % 3) * 6} fill={C(j % 2 ? "#c8643a" : "#e8a23a")} opacity={0.8} />)}</>;
      break;
    case "snow": case "mountain":
      mid = <g transform={P(0.25)}>{peaks(C(set === "snow" ? "#b9c9dc" : "#8a95a8"), HOR + 20, 640, 5, true)}</g>;
      near = <g transform={P(0.55)}>{hills(C(set === "snow" ? "#dfe8f2" : "#7f9a5e"), HOR + 50, 90, seed % 5 + 1)}
        {Array.from({length: 5}).map((_, i) => <g key={i} transform={`translate(${i * 250 + (seed * i) % 90 - 30} ${HOR + 70}) scale(${0.8 + (i % 2) * 0.3})`}><path d="M-80 0 L0 -260 L80 0 Z" fill={C("#2f5a44")} {...k} />{set === "snow" && <path d="M-36 -140 L0 -260 L36 -140 l-18 14 l-18 -12 l-18 12 z" fill="#fff" {...k} />}</g>)}</g>;
      break;
    case "desert":
      mid = <g transform={P(0.3)}>{[0, 1, 2].map((j) => { const x = -60 + j * 420 + (seed * (j + 1)) % 140, w = 220 + ((seed + j * 50) % 120), h = 200 + ((seed * (j + 2)) % 160);
        return <g key={j}><path d={`M${x} ${HOR + 20} L${x + 40} ${HOR + 20 - h} H${x + w - 40} L${x + w} ${HOR + 20} Z`} fill={C(j % 2 ? "#c46d42" : "#d4834e")} {...k} />
          <path d={`M${x + 22} ${HOR + 20 - h * 0.55} H${x + w - 22} M${x + 12} ${HOR + 20 - h * 0.28} H${x + w - 12}`} stroke={C("#a8553a")} strokeWidth={8} /></g>; })}</g>;
      near = <g transform={P(0.55)}>{hills(C("#e9a860"), HOR + 50, 80, seed % 5, 140)}</g>;
      floor = <>{Array.from({length: 10}).map((_, j) => <path key={j} d={`M${(j * 211 + seed) % W - 60} ${HOR + 260 + (j * 83) % 420} q60 -20 120 0`} stroke={tint(g, 0.8)} strokeWidth={6} fill="none" strokeLinecap="round" />)}</>;
      break;
    case "city": case "street":
      mid = <g transform={P(0.3)}>{Array.from({length: 8}).map((_, i) => { const h = 380 + (seed * (i + 3) * 37) % 420; return <g key={i}><rect x={i * 150 - 80} y={HOR - h + 60} width={136} height={h} fill={C(i % 2 ? "#6e7488" : "#7d7a92")} {...k} />
        {Array.from({length: Math.floor(h / 80)}).map((_, j) => <rect key={j} x={i * 150 - 60} y={HOR - h + 90 + j * 80} width={96} height={30} fill={(light === "night" || light === "dusk" || light === "storm") && (i + j + seed) % 3 ? "#ffd977" : C("#c9d6e3")} opacity={0.9} />)}</g>; })}</g>;
      near = set === "street" ? <g transform={P(0.6)}>{[0, 1, 2].map((i) => { const x = i * 400 - 80; return <g key={i}><rect x={x} y={HOR - 380} width={380} height={520} fill={C(["#c9a17a", "#a8b8a0", "#d4b4b4"][(i + seed) % 3])} {...k} />
        <rect x={x + 40} y={HOR - 20} width={300} height={150} fill={light === "night" || light === "dusk" ? "#ffe7a0" : C("#bfe0f0")} {...k} />
        <path d={`M${x + 20} ${HOR - 60} h340 l-20 50 h-300 z`} fill={C(["#c0392b", "#2e86ab", "#3f8a4a"][(i + seed) % 3])} {...k} />
        {[0, 1].map((j) => <rect key={j} x={x + 60 + j * 160} y={HOR - 320} width={100} height={120} fill={C("#e8eef5")} {...k} />)}</g>; })}</g> : null;
      floor = <><rect x={-300} y={HOR + 150} width={W + 600} height={40} fill={C("#b9b4ac")} {...k} />{Array.from({length: 5}).map((_, i) => <rect key={i} x={i * 260 - 40 + px} y={HOR + 470} width={140} height={20} fill="#f4f1e8" opacity={0.7} />)}</>;
      break;
    case "station":
      mid = <g transform={P(0.3)}>{hills(C("#93a8b8"), HOR - 70, 110, seed % 5)}</g>;
      near = <g transform={P(0.6)}><rect x={-300} y={HOR - 380} width={W + 600} height={60} fill={C("#7a3b2e")} {...k} />{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 330 - 60} y={HOR - 320} width={26} height={460} fill={C("#4a4a56")} {...k} />)}
        <g transform={`translate(${520 + (seed % 200)} ${HOR + 120}) scale(0.9)`}><rect x={-420} y={-300} width={840} height={260} rx={30} fill={C("#3f6e9a")} {...k} />{[-330, -150, 30, 210].map((x) => <rect key={x} x={x} y={-260} width={130} height={90} rx={10} fill="#ffe7a8" {...k} />)}<rect x={-420} y={-120} width={840} height={30} fill={C("#e8c547")} /></g></g>;
      floor = <><rect x={-300} y={HOR + 150} width={W + 600} height={36} fill={C("#e8c547")} {...k} /></>;
      break;
    case "ruins":
      mid = <g transform={P(0.3)}>{hills(C("#8f8a96"), HOR - 40, 100, seed % 3)}{Array.from({length: 5}).map((_, i) => { const x = i * 240 - 40, h = 220 + (seed * (i + 2)) % 240; return <path key={i} d={`M${x} ${HOR + 40} v-${h} l40 30 l30 -50 l50 40 l30 -20 v${h + 40} z`} fill={C("#9a8f86")} {...k} />; })}</g>;
      near = <g transform={P(0.55)}>{Array.from({length: 7}).map((_, i) => <path key={i} d={`M${i * 170 - 40} ${HOR + 140} l30 -50 l60 -10 l40 60 z`} fill={C("#7f756c")} {...k} />)}</g>;
      break;
    case "room":
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0}}>
          <rect width={W} height={H} fill={C(["#d9c7a6", "#b9c8c0", "#c9b0b8", "#a9b6cc"][seed % 4])} />
          {Array.from({length: 12}).map((_, i) => <rect key={i} x={i * 100 + 30 + px * 0.5} y={0} width={30} height={HOR + 150} fill="#000" opacity={0.04} />)}
          <g transform={P(0.5)}><rect x={340} y={430} width={400} height={480} fill={`url(#sky${id})`} {...k} /><path d="M540 430 v480 M340 670 h400" {...k} /><rect x={310} y={900} width={460} height={30} fill={C("#e8dcc4")} {...k} />
            <rect x={60 + (seed % 80)} y={520} width={150} height={190} fill="#fbf8f0" {...k} /><circle cx={135 + (seed % 80)} cy={600} r={40} fill={C("#c9a17a")} /></g>
          <rect x={-300} y={HOR + 150} width={W + 600} height={H} fill={g} stroke={s.ink} strokeWidth={6} />
          {Array.from({length: 10}).map((_, i) => <path key={i} d={`M-300 ${HOR + 220 + i * 60} H${W + 300}`} stroke="#000" opacity={0.08} strokeWidth={4} />)}
          {(light === "lamp" || light === "night") && <circle cx={W * 0.78} cy={HOR - 200} r={600} fill={L.glow ?? "#ffcf7a"} opacity={0.14} />}
          <defs><linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">{L.sky.map((c, i) => <stop key={i} offset={i / 2} stopColor={c} />)}</linearGradient></defs>
        </svg>
      );
    case "void":
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0}}>
          <defs><radialGradient id={`v${id}`} cx="0.5" cy="0.62" r="0.65"><stop offset="0" stopColor={C(L.sky[2])} /><stop offset="1" stopColor={tint(C(L.sky[0]), 0.5)} /></radialGradient></defs>
          <rect width={W} height={H} fill={`url(#v${id})`} />
          {Array.from({length: 16}).map((_, i) => <path key={i} d={`M540 1150 L${Math.cos(i * 0.39 + t * 0.05) * 2400 + 540} ${Math.sin(i * 0.39 + t * 0.05) * 2400 + 1150} L${Math.cos(i * 0.39 + 0.17 + t * 0.05) * 2400 + 540} ${Math.sin(i * 0.39 + 0.17 + t * 0.05) * 2400 + 1150} Z`} fill="#fff" opacity={0.045} />)}
          <ellipse cx={540} cy={GROUND_Y} rx={460} ry={90} fill="#fff" opacity={0.12} />
        </svg>
      );
  }
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0}}>
      <defs><linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">{L.sky.map((c, i) => <stop key={i} offset={i * 0.5 * (HOR / H) * 1.1} stopColor={c} />)}</linearGradient></defs>
      {sky}{mid}{near}
      {set !== "sea" && set !== "harbor" ? <rect x={-300} y={HOR + 150} width={W + 600} height={H} fill={g} stroke={s.ink} strokeWidth={s.lw(6)} /> : set === "sea" ? <rect x={-300} y={HOR + 120} width={W + 600} height={H} fill={g} stroke={s.ink} strokeWidth={s.lw(6)} /> : <rect x={-300} y={HOR + 150} width={W + 600} height={H} fill={g} />}
      {set === "sea" && <rect x={-300} y={HOR + 30} width={W + 600} height={95} fill={C("#3b86bd")} />}
      {floor}
    </svg>
  );
};
