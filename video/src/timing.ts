import {Story} from "./types";
export const FPS = 30;
export type Timed = {start: number; end: number; words: {w: string; t: number}[]};
// Szenen-Zeiten: aus echten Wortzeiten (words), sonst automatisch (wps Wörter/Sek).
export const timeline = (s: Story): {scenes: Timed[]; total: number} => {
  const wps = s.wps ?? 3.0;
  const per = s.scenes.map((sc) => sc.text.split(/\s+/).filter(Boolean));
  let flat: {w: string; t: number}[];
  if (s.words && s.words.length) flat = s.words;
  else {
    flat = []; let t = 0.4;
    per.forEach((ws) => ws.forEach((w) => { flat.push({w, t}); t += 1 / wps + (/[.!?]$/.test(w) ? 0.25 : /,$/.test(w) ? 0.1 : 0); }));
  }
  let i = 0; const out: Timed[] = [];
  per.forEach((ws) => { out.push({start: 0, end: 0, words: flat.slice(i, i + ws.length)}); i += ws.length; });
  const endAll = (flat[flat.length - 1]?.t ?? 0) + 1.2;
  out.forEach((o, k) => {
    o.start = k === 0 ? 0 : o.words[0]?.t ?? out[k - 1].end;
    o.end = k === out.length - 1 ? endAll : out[k + 1].words[0]?.t ?? endAll;
  });
  return {scenes: out, total: endAll};
};
