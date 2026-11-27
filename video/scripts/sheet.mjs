// Kontaktbogen: node scripts/sheet.mjs <story-name> [--every 2] [--fresh]
// Rendert das Video (falls nicht vorhanden oder --fresh) und legt alle N Sekunden ein Bild in ein Raster: out/<name>-sheet.jpg
import {execFileSync} from "node:child_process";
import {existsSync} from "node:fs";
const name = process.argv[2]; if (!name) { console.error("Story-Name fehlt"); process.exit(1); }
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const every = Number(arg("--every", 2));
const mp4 = `../media/${name}.mp4`;
if (!existsSync(mp4) || process.argv.includes("--fresh")) execFileSync("node", ["scripts/render.mjs", name], {stdio: "inherit"});
const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4]).toString());
const n = Math.ceil(dur / every); const cols = 6; const rows = Math.ceil(n / cols);
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", mp4, "-vf", `fps=1/${every},scale=270:-1,drawtext=text='%{pts\\:hms}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,tile=${cols}x${rows}:padding=4:color=white`, "-frames:v", "1", "-q:v", "3", `out/${name}-sheet.jpg`], {stdio: "inherit"});
console.log(`out/${name}-sheet.jpg  (${n} Bilder, alle ${every} s, Video ${dur.toFixed(1)} s)`);
