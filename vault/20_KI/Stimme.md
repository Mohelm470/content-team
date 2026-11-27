---
owner: A
status: entscheidung-offen
aktualisiert: 2026-11-27
tags: [ki, agenten, stimme, tts]
---
# Stimme für den Video-Baukasten

Teil von [[Agenten-Pipeline]] (Schritt 5) und [[Video-Baukasten]]. Frage: Gratis-KI-Stimme oder echte Menschenstimme?

> [!summary] Empfehlung
> 1. **Test-Arm A (Standard):** **Kokoro-82M** lokal (0 €, Apache-2.0). Dazu **Whisper lokal** für die Wortzeiten (`words.json`).
> 2. **Test-Arm B:** echte Menschenstimme (A oder B spricht ein). Vergleich laut [[01_Strategie]] §3: je 10 Videos, Wiedergabedauer und Shares.
> 3. **Nicht nehmen:** `edge-tts` (inoffizieller Microsoft-Zugang), TikTok-Standard-Stimmen, Coqui XTTS.
> **Status:** Kokoro läuft (Cloud-Test 27.11.). Whisper-Modell kam nicht durch: Host `cas-server.xethub.hf.co` gesperrt, siehe unten.

## Optionen
| Option | Kosten | Lizenz / Risiko | Qualität | Urteil |
|---|---|---|---|---|
| **Kokoro-82M** lokal | 0 € | Code und Gewichte Apache-2.0, kommerziell erlaubt laut mehreren Quellen ([Vergleich](https://codesota.com/guides/tts-models), [Modellseite](https://huggingface.co/hexgrad/Kokoro-82M)) | laut Community-Vergleichen natürlicher als Piper ([PromptQuorum](https://www.promptquorum.com/power-local-llm/piper-vs-kokoro-tts)); **kein Benchmark, nur Eindruck** | **Standard** |
| **Piper** lokal | 0 € | **Unklar:** neues Repo GPL-3.0, altes MIT, Quellen widersprechen sich ([PromptQuorum](https://www.promptquorum.com/power-local-llm/piper-vs-kokoro-tts)). LICENSE vor Nutzung selbst lesen | schneller, klingt robotischer | Reserve |
| **edge-tts** | 0 € | Inoffizieller Zugang zum Microsoft-Dienst. Laut Microsoft-Community-Antwort kann kommerzielle Nutzung ohne Azure-Abo gegen deren Bedingungen verstoßen ([Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/2088770/are-opensource-edge-tts-free-for-commercial-use)); Microsoft hat Funktionen schon gesperrt. Kein Primärtext gefunden → **unklar, Risiko hoch** | gut | **Nein** (unser Geld hängt daran) |
| TikTok/CapCut-Standardstimmen | 0 € | Viele andere Kanäle nutzen dieselbe Stimme → wirkt wie Schablone. Kein Primärtext zu Auszahlungsfolgen gefunden → **unklar** | mittel | **Nein** |
| Coqui XTTS | 0 € | Eigene, laut Quellen nicht kommerzielle Lizenz ([Anbieter-Blog](https://localaimaster.com/blog/xtts-coqui-commercial-license)) | gut | **Nein** |
| **Menschenstimme** | 0 € | kein Risiko, stärkster Beleg für „eigene Arbeit" | beste Wirkung (Vermutung) | **Test-Arm B** |
| Bezahlte Dienste (ElevenLabs, Azure) | Geld | passt nicht zum Budget-Prinzip | sehr gut | nur falls Gratis-Tests scheitern |

## Plattform-Sicht (Dauer-Prüffrage 2)
- **YouTube:** KI-Stimme ist **nicht verboten**. Problem sind Schablonen ohne Variation und „KI-Personen" bei heiklen Themen, und es kann den ganzen Kanal treffen ([YouTube-Hilfe](https://support.google.com/youtube/answer/1311392), [Tubefilter](https://www.tubefilter.com/2026/07/13/youtube-inauthentic-content-monetization-policy-update/), [TechCrunch](https://techcrunch.com/2026/07/20/youtube-clarifies-policies-around-ai-slop-and-upsetting-videos/)). Realistische synthetische Stimme: Label setzen. Ob **dieselbe KI-Stimme in jedem Video** allein schon als Schablone zählt: **unklar**.
- **TikTok:** Zu KI-Stimme bei Creator Rewards **kein Primärtext gefunden → unklar**. Label-Pflicht bei realistischer KI-Stimme ([TikTok-Hilfe](https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content)).
- Gegenmittel: Stimmen und Tempo pro Video variieren (Kokoro hat mehrere Stimmen), eigenes Skript, gute Schnitt-Betonung, Menschenstimme als Vergleich.

## Baukasten-Anbindung: `video/scripts/voice.py` (geschrieben 27.11.2026)
**Status:** Wort-Ausrichtung getestet (Skript-Wörter ↔ Whisper-Wörter, Lücken werden interpoliert). **Kokoro- und Whisper-Aufrufe sind NICHT auf einem echten PC getestet** – beim ersten Lauf können Fehler auftreten (z. B. Python-Version: nicht geprüft, Python 3.10–3.12 ist die sichere Wahl).

**Auf dem PC:**
```
cd video
pip install -r scripts/requirements-voice.txt
# Kokoro-Modelldateien (kokoro-v1.0.onnx, voices-v1.0.bin) aus dem kokoro-onnx-Release "model-files-v1.0" nach video/models/ legen
python scripts/voice.py <story-name> --voice af_sarah --speed 1.0
node scripts/render.mjs <story-name>
```
Das Skript schreibt `video/public/<name>.wav` und trägt `voice` + `words` ins Story-JSON ein. Pro Story können `voiceName` und `speed` gesetzt werden (Variation!).

## Plan für den Baukasten
1. ✅ `voice.py`: Text aus Story-JSON → `video/public/<name>.wav` (Kokoro), ungetestet auf PC.
2. ✅ Whisper lokal → Wortzeiten → `words` ins Story-JSON (der Baukasten liest `voice` und `words` schon, siehe [[Video-Baukasten]]).
3. Musik leise darunter (lizenzfrei), Stimme zuerst, Musik danach.
4. Test auf PC: 3 Stimmen × 1 Skript, Hörprobe durch A + B, besten Klang festlegen.

## Test in der Cloud-Sitzung (27.11.2026)
- **Python 3.13.18**; `pip install -r scripts/requirements-voice.txt` ohne Fehler: kokoro-onnx 0.6.1, faster-whisper 1.2.1, onnxruntime 1.29.0, numpy 2.5.3, soundfile 0.14.0.
- **Modelldateien:** `kokoro-v1.0.onnx` (326 MB) und `voices-v1.0.bin` (28 MB) von GitHub geladen, liegen in `video/models/` (ignoriert).
- **Kokoro funktioniert:** Der `voice.py`-Code für Kokoro lief ohne Änderung. Die WAV für test-hund (ca. 18 s mit Pausen) war in unter 15 s fertig, CPU, kein Fehler. Je ca. 11 s Hörprobe: ca. 2 s Rechenzeit.
- **Vorhandene Stimmen:** af_sarah, am_michael, bf_emma, dazu af_heart, af_bella, am_adam, bm_george und viele weitere (auch andere Sprachen).
- **Whisper NICHT getestet:** `faster-whisper` lädt `model.bin` von `cas-server.xethub.hf.co` → **dort gesperrt (HTTP 403)**. Darum keine Wortzeiten, `test-hund.json` unverändert, Stichproben (Whisper-Wort vs. Skript-Wort) und Render mit Stimme **nicht gemacht**. Nächster Schritt: Host `cas-server.xethub.hf.co` in der Umgebung freigeben oder Whisper-Test auf dem PC.
- **Klang:** Ich kann Audio nicht hören, darum **keine Einschätzung**. Hörproben (af_sarah, am_michael, bf_emma) wurden dem Nutzer geschickt, A + B bewerten selbst.

## Tempo und Stimmen-Mischung (27.11.2026)
`voice.py` kann jetzt: `--speed 0.95` (Tempo), `--blend "af_sarah:0.6,af_nicole:0.4"` (Stimmen mischen, Gewichte werden auf Summe 1 gesetzt) und `--out <pfad.wav>` (nur Stimme als Hörprobe, ohne Whisper). In der Story-JSON gehen `voiceName`, `speed` und `blend`. Mischen = gewichtete Summe der Kokoro-Stimm-Vektoren, lief ohne Fehler (3 Proben, je ca. 2 s Rechenzeit). **Ob es menschlicher klingt, ist ungehört** (ich kann kein Audio hören): A + B bewerten die 3 Proben. Idee: pro Kanal eine eigene Mischung = eigene Stimme, hilft evtl. gegen "Schablone" (unklar).

## Dauer-Prüffragen
1. **Potenzial:** Gute Stimme hält Wiedergabedauer, und die ist Signal Nr. 1. Ob Kokoro oder Mensch besser abschneidet, ist **unklar**, das misst der Test (Strategie §3).
2. **Sicherheit:** Gratis-Stimme mit sauberer Lizenz = kein Konto-Risiko durch die Quelle. Plattform-Risiko bleibt Schablone/Label, **kontrollierbar, nicht null**.

## Offen
- [ ] Kokoro + Whisper auf dem PC installieren, `voice.py` mit `stories/test-hund.json` laufen lassen, Fehler an Claude melden (A)
- [ ] Piper-LICENSE im aktuellen Repo lesen, falls Reserve nötig
- [ ] Hörprobe A + B, Entscheidung eintragen
