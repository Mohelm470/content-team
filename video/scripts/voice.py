#!/usr/bin/env python3
"""Stimme + Wortzeiten für eine Story. NUR LOKAL, keine Cloud, keine Zugangsdaten.

Nutzung (auf dem PC):
  pip install -r scripts/requirements-voice.txt
  # Kokoro-Modelldateien einmal laden (Apache-2.0), nach video/models/ legen:
  #   kokoro-v1.0.onnx und voices-v1.0.bin  (Release "model-files-v1.0" von kokoro-onnx)
  python scripts/voice.py <story-name> [--voice af_sarah] [--speed 0.95]
  python scripts/voice.py <story-name> --blend "af_sarah:0.6,af_nicole:0.4"   # Stimmen mischen
  (auch in der Story-JSON: "voiceName", "speed", "blend": "a:0.6,b:0.4")

Ergebnis: public/<name>.wav + Eintrag "voice" und "words" in stories/<name>.json.
Status 27.11.2026: Ausrichtung (align) getestet, Kokoro/Whisper-Aufrufe NOCH NICHT auf echtem PC getestet.
"""
import argparse, difflib, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
norm = lambda w: re.sub(r"[^a-z0-9']", "", w.lower())


def align(script_words, heard):
    """script_words: Wörter aus dem Skript. heard: [{'w','t'}] von Whisper.
    Gibt für jedes Skript-Wort eine Zeit zurück (Treffer übernommen, Lücken interpoliert)."""
    a = [norm(w) for w in script_words]
    b = [norm(h["w"]) for h in heard]
    times = [None] * len(a)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = heard[blk.b + k]["t"]
    known = [i for i, t in enumerate(times) if t is not None]
    if not known:
        end = heard[-1]["t"] if heard else 0.0
        return [round(end * i / max(1, len(a)), 3) for i in range(len(a))]
    for i in range(len(times)):
        if times[i] is not None:
            continue
        lo = max((k for k in known if k < i), default=None)
        hi = min((k for k in known if k > i), default=None)
        if lo is None:
            times[i] = max(0.0, times[hi] - 0.3 * (hi - i))
        elif hi is None:
            times[i] = times[lo] + 0.3 * (i - lo)
        else:
            times[i] = times[lo] + (times[hi] - times[lo]) * (i - lo) / (hi - lo)
    return [round(t, 3) for t in times]


def parse_blend(text):
    """'af_sarah:0.6,af_nicole:0.4' -> [('af_sarah',0.6),('af_nicole',0.4)], Gewichte auf Summe 1."""
    parts = []
    for item in text.split(","):
        name, _, wt = item.strip().partition(":")
        parts.append((name.strip(), float(wt) if wt else 1.0))
    total = sum(w for _, w in parts)
    if not parts or total <= 0:
        raise SystemExit("blend: leer oder Gewichte <= 0")
    return [(n, w / total) for n, w in parts]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("name"); ap.add_argument("--voice"); ap.add_argument("--speed", type=float); ap.add_argument("--blend")
    ap.add_argument("--out", help="WAV-Pfad statt public/<name>.wav (nur Stimme, keine Wortzeiten)")
    ap.add_argument("--whisper", default="small.en")
    a = ap.parse_args()
    sp = ROOT / "stories" / f"{a.name}.json"
    story = json.loads(sp.read_text(encoding="utf-8"))
    voice = a.voice or story.get("voiceName", "af_sarah")
    speed = a.speed if a.speed is not None else story.get("speed", 1.0)
    blend = a.blend or (None if a.voice else story.get("blend"))
    import numpy as np, soundfile as sf
    from kokoro_onnx import Kokoro
    k = Kokoro(str(ROOT / "models/kokoro-v1.0.onnx"), str(ROOT / "models/voices-v1.0.bin"))
    if blend:  # gewichtete Summe der Stimm-Vektoren
        mix = parse_blend(blend)
        voice_arg = sum(w * k.get_voice_style(n) for n, w in mix)
        voice = "+".join(f"{n}:{w:.2f}" for n, w in mix)
    else:
        voice_arg = voice
    chunks, sr, pause = [], 24000, 0.35
    for sc in story["scenes"]:
        samples, sr = k.create(sc["text"], voice=voice_arg, speed=speed, lang="en-us")
        chunks += [samples, np.zeros(int(sr * pause), dtype=samples.dtype)]
    out = Path(a.out) if a.out else ROOT / "public" / f"{a.name}.wav"
    out.parent.mkdir(exist_ok=True, parents=True)
    sf.write(out, np.concatenate(chunks), sr)
    if a.out:
        print(f"ok (nur Stimme): {out}, Stimme {voice}, Tempo {speed}")
        return
    from faster_whisper import WhisperModel
    segs, _ = WhisperModel(a.whisper, compute_type="int8").transcribe(str(out), word_timestamps=True, language="en")
    heard = [{"w": w.word.strip(), "t": round(w.start, 3)} for s in segs for w in s.words]
    script = [w for sc in story["scenes"] for w in sc["text"].split()]
    story["voice"] = f"{a.name}.wav"
    story["words"] = [{"w": w, "t": t} for w, t in zip(script, align(script, heard))]
    sp.write_text(json.dumps(story, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"ok: {out} ({len(script)} Wörter, Stimme {voice}, Tempo {speed})")


if __name__ == "__main__":
    main()
