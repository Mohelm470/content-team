import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Story} from "./types";
import {FPS, timeline} from "./timing";
import {Background, GROUND_Y} from "./Background";
import {Figure} from "./Characters";
import {Captions} from "./Captions";

const ease = (x: number) => x * x * (3 - 2 * x);

export const Short: React.FC<{story: Story}> = ({story}) => {
  const f = useCurrentFrame(); const now = f / FPS; const tl = timeline(story);
  let idx = tl.scenes.findIndex((s) => now >= s.start && now < s.end); if (idx < 0) idx = tl.scenes.length - 1;
  const sc = story.scenes[idx]; const T = tl.scenes[idx];
  const p = Math.min(1, Math.max(0, (now - T.start) / Math.max(0.1, T.end - T.start)));
  const e = ease(p);
  // Kamera: immer leichte Bewegung, nie Standbild (Push 100→112 %, Pan ±60 px)
  const scale = sc.cam === "pull" ? 1.14 - 0.12 * e : sc.cam === "push" ? 1.0 + 0.12 * e : 1.07;
  const px = sc.cam === "left" ? -60 * e : sc.cam === "right" ? 60 * e - 60 : 0;
  const flash = sc.flash ? Math.max(0, 1 - (now - T.start) / 0.25) * 0.8 : 0;
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <AbsoluteFill style={{transform: `translate(${px}px, 0) scale(${scale})`, transformOrigin: "50% 62%"}}>
        <Background set={sc.set} light={sc.light} px={px * 0.6} py={0} t={now} />
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute", left: 0, top: 0}}>
          {sc.chars.map((c, i) => <Figure key={i} c={{...c, x: c.x + (c.act === "walk" ? (p - 0.5) * 0.12 : 0)}} t={now} i={i} gy={GROUND_Y} />)}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{background: "#fff", opacity: flash}} />
      <Captions words={tl.scenes.flatMap((s) => s.words)} now={now} />
      {story.voice && <Audio src={staticFile(story.voice)} />}
      {story.music && <Audio src={staticFile(story.music)} volume={0.12} />}
    </AbsoluteFill>
  );
};
