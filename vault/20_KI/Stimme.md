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
> **Nicht getestet:** In der Cloud-Sitzung sind `huggingface.co` und GitHub-Downloads gesperrt, Modelle ließen sich nicht laden. Test läuft auf einem eurer PCs (Remotion rendert dort ohnehin).

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

## Plan für den Baukasten (noch nicht gebaut)
1. `voice.py`: Text aus Story-JSON → `video/public/<name>.wav` (Kokoro).
2. Whisper lokal → Wortzeiten → `words` ins Story-JSON (der Baukasten liest `voice` und `words` schon, siehe [[Video-Baukasten]]).
3. Musik leise darunter (lizenzfrei), Stimme zuerst, Musik danach.
4. Test auf PC: 3 Stimmen × 1 Skript, Hörprobe durch A + B, besten Klang festlegen.

## Dauer-Prüffragen
1. **Potenzial:** Gute Stimme hält Wiedergabedauer, und die ist Signal Nr. 1. Ob Kokoro oder Mensch besser abschneidet, ist **unklar**, das misst der Test (Strategie §3).
2. **Sicherheit:** Gratis-Stimme mit sauberer Lizenz = kein Konto-Risiko durch die Quelle. Plattform-Risiko bleibt Schablone/Label, **kontrollierbar, nicht null**.

## Offen
- [ ] Kokoro + Whisper auf dem PC installieren und testen (A)
- [ ] Piper-LICENSE im aktuellen Repo lesen, falls Reserve nötig
- [ ] Hörprobe A + B, Entscheidung eintragen
