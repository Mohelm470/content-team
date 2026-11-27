---
owner: A
status: v0 läuft
aktualisiert: 2026-11-27
tags: [ki, agenten, video, remotion]
---
# Video-Baukasten (2D, Remotion)

Teil von [[Agenten-Pipeline]] (Schritt 5). Code: `video/` im Repo. Ausgabe: `media/<name>.mp4` (nicht in Git).

## Idee
Der Agent schreibt **nur Daten**, keinen Code: eine Story-Datei `video/stories/<name>.json` mit Szenen (Ort, Licht, Kamera, Figuren, Voiceover-Text). Der Baukasten macht daraus das Video.

## Was v0 kann
- Orte: `field`, `village`, `sea`, `forest`, `snow`, `city` · Licht: `day`, `golden`, `night`, `grey`
- Figuren: Mann, Frau, Kind, Hund; 5 Gesichter (`neutral`, `sad`, `happy`, `shock`, `worried`); Gehen, Hüpfen, Stehen
- Kamera pro Szene: `push`, `pull`, `left`, `right` (nie Standbild), Blitz nach dem Hook
- Untertitel mittig (Wort für Wort, aktives Wort gelb), 1080×1920, 30 fps
- Stimme: `voice` (Datei in `video/public/`) + `words` (Wortzeiten). Ohne beides: Auto-Timing, stumm.

## Benutzen
```
cd video && npm install        # einmal
node scripts/render.mjs <name>             # ganzes Video
node scripts/render.mjs <name> --still 4   # Standbild bei Sekunde 4
```
Test: `stories/test-hund.json` (nur Technik-Test, **nicht hochladen**).

## Messwerte (27.11.2026, Cloud-Container, 4 CPU, keine GPU)
- 16 s Video in ca. 35 s gerendert (ca. 2,2× Echtzeit) → 75 s ≈ 3 Min. Im Vergleich: 3D-Rezept ca. 10 Min auf einem normalen PC.
- Abo-Verbrauch: noch nicht gemessen.

## Noch offen
- **Stimme:** kein Gratis-TTS im Container gefunden. Wortzeiten brauchen Spracherkennung (z. B. Whisper). Entscheidung: echte Menschenstimme vs. Gratis-TTS (Test laut [[01_Strategie]]).
- **Look:** v0 ist schlicht (flache Formen, Tintenlinie). Mehr Szenenbilder, Gesichter, Requisiten, Variation nötig, sonst „Schablone" (YouTube-Risiko, siehe Pipeline §3b).
- **Musik:** nur lizenzfrei; noch keine eingebaut (Feld `music` vorhanden).
- **Remotion-Lizenz** klären (Offene Punkte in der Pipeline-Notiz).
- Prüfbericht-Agent (Ähnlichkeit, Fakten, C2PA) noch nicht gebaut.
