// Nutzung: node scripts/render.mjs <story-name> [--still <sek>]
// Liest stories/<name>.json, schreibt ../media/<name>.mp4 (media/ ist nicht in Git).
import {execFileSync} from "node:child_process";
import {readFileSync, writeFileSync, mkdirSync} from "node:fs";
const name = process.argv[2]; if (!name) { console.error("Story-Name fehlt"); process.exit(1); }
const still = process.argv.indexOf("--still") > 0 ? Number(process.argv[process.argv.indexOf("--still") + 1]) : null;
const story = JSON.parse(readFileSync(`stories/${name}.json`, "utf8"));
mkdirSync("../media", {recursive: true}); mkdirSync("out", {recursive: true});
writeFileSync("out/props.json", JSON.stringify({story}));
const base = ["remotion", still === null ? "render" : "still", "src/index.ts", "Short"];
const args = still === null ? [...base, `../media/${name}.mp4`, "--codec", "h264", "--crf", "20"] : [...base, `out/${name}.png`, "--frame", String(Math.round(still * 30))];
args.push("--props=out/props.json", "--browser-executable=/opt/pw-browsers/chromium", "--chrome-mode=chrome-for-testing");
execFileSync("npx", args, {stdio: "inherit"});
