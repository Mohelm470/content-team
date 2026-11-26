---
owner: A
status: entwurf
aktualisiert: 2026-11-26
tags: [ki, agenten, pipeline, automatisierung]
---
# Agenten-Pipeline: ein Agent liefert die fertigen Videos

> [!summary] Kurz
> **Ja, fast alles kann ein Agent.** Die Pipeline plant Themen aus Zahlen, schreibt, prüft Fakten, baut das Video und legt Datei + Caption fertig ab. **Zwei Dinge bleiben beim Menschen:** (1) 5-Minuten-Freigabe pro Video, (2) Hochladen über TikTok Studio / YouTube Studio. Volle Automatik ohne Mensch = Risiko für Creator Rewards und das YouTube-Partnerprogramm.
> Kosten: **0 € extra** (nur Claude-Abo + Gratis-Werkzeuge). Zugehörig: [[00_Hauptziel]] · [[01_Strategie]] · [[Auto-Upload]] · [[Roadmap]]

## 1. Die Pipeline

```mermaid
flowchart LR
  D[1 Daten holen<br/>Agent] --> T[2 Thema wählen<br/>Agent]
  T --> S[3 Skript + Quellen<br/>Agent]
  S --> F[4 Fakten-Check<br/>Agent + Mensch]
  F --> P[5 Voice/Bild/Schnitt<br/>Agent, Remotion]
  P --> X[6 Export + Notiz<br/>Agent]
  X --> H{7 Freigabe<br/>MENSCH 5 Min}
  H -->|ok| U[8 Studio-Planer<br/>MENSCH 2 Min]
  U --> L[9 Zahlen nach 48 h<br/>Mensch trägt ein, Agent wertet aus]
  L --> D
```

| # | Schritt | Wer | Wie / Werkzeug | Kosten |
|---|---|---|---|---|
| 1 | Trend- + Performance-Daten | Agent ([[Trend-Scout]], [[Performance-Analyst]]) | Siehe Abschnitt 2 | 0 € |
| 2 | Thema/Format wählen | Agent ([[Format-Zerleger]]) | Bewertung: Outlier-Faktor, Nachstellbarkeit, Nischen-Fit, **eigene** 48-h-Zahlen höher gewichtet. Pro Woche 1 Format-Test aus [[01_Strategie]] (A/B/C) | 0 € |
| 3 | Skript-Entwurf | Agent ([[Creator]]) | Eigene Erzählung, Hook-Typ und Länge **bewusst variieren** (Vorgabe pro Video) | Abo |
| 4 | Fakten-Check mit Quellen | Agent sucht, **Mensch prüft** | 2 unabhängige Quellen pro Kerntatsache, Links in die Notiz. Agent markiert „unsicher". | Abo |
| 5 | Voice, Bilder, Schnitt | Agent baut | Remotion + Skill `cartoon-3d-short`; Stimme: Gratis-TTS oder echte Stimme (Test laut [[01_Strategie]]); Bilder: gemeinfrei/eigene Cartoon-Szenen; Musik nur lizenzfrei | 0 € |
| 6 | Export + Notiz | Agent | `media/<datum>-<slug>.mp4` (1080×1920, 65–90 s, ohne Wasserzeichen) + Notiz nach [[Video-Idee]]: Caption, 3–5 Hashtags, Quellen, Rohskript, Geld-Check vorausgefüllt | 0 € |
| 7 | **Freigabe** | **Mensch** | Siehe Abschnitt 4 | 5 Min |
| 8 | Planen/Hochladen | **Mensch** | TikTok Studio + YouTube Studio, KI-Schalter selbst setzen ([[Auto-Upload]]) | 2 Min |
| 9 | Auswertung | Mensch trägt Zahlen ein (`views_48h`, `retention_%`), Agent wertet aus | TikTok Studio / YouTube Studio manuell kopieren | 3 Min/Woche |

## 2. Datenquellen (nur offiziell/öffentlich, keine Logins für Bots)

| Quelle | Was | Wie der Agent drankommt | Stand |
|---|---|---|---|
| [TikTok Creative Center](https://ads.tiktok.com/help/article/creative-center) | Trend-Hashtags, Songs, Creators, Videos nach Region/Branche; gratis, öffentlich ([Hilfe](https://ads.tiktok.com/help/article/how-to-use-trends)) | Mensch kopiert 1×/Woche (5 Min) Text/Screenshot in `10_Wissen/Trends/`. Kein Scraping. | Update-Takt der Listen **unklar** (nur Blogs, z. B. [Metricool](https://metricool.com/tiktok-creative-center/)) |
| TikTok Studio (eigenes Konto) | Wiedergabedauer, Retention, Shares, Traffic-Quellen | Mensch trägt in Video-Notiz ein (siehe Schritt 9) | offiziell |
| YouTube Studio (eigener Kanal) | Retention, Shares, Abos je Short | Mensch trägt ein | offiziell |
| YouTube Data API (Gratis-Kontingent) | öffentliche Zahlen zu Videos/Kanälen der Nische (nur lesen) | Skill `trend-scout`, Roadmap Phase 3 | Kontingent siehe [Google-Doku](https://developers.google.com/youtube/v3/docs/videos/insert) (Quota nicht von uns geprüft → **unklar**) |
| Google Trends, Reddit (öffentliche Seiten) | Themen-Nachfrage | Skill `trend-scout` | nur Ideen-Signal, **nie Text übernehmen** |

**Ehrlich:** Die *eigenen* Zahlen sind das beste Signal, brauchen aber erst ~30 Videos. Davor ist die Auswahl ein Schätzen aus öffentlichen Trends. Eine Scraping-Lösung für TikTok ist **nicht** vorgesehen (Nutzungsbedingungen, Konto-Risiko).

## 3. Wo volle Automatik mit den Geld-Regeln kollidiert

### 3a. TikTok Creator Rewards („Originalinhalt")
- Offizielle Linie: Inhalte sollen originell sein, „unique to the creator" ([Zusammenfassung Toptal](https://www.toptal.com/creator/post/how-to-join-the-tiktok-creator-rewards-program), Zweitquelle). Videos > 1 Min, persönliches Konto ([Auszahlungen](Auszahlungen.md)).
- **Widersprüchlich:** Eine Vendor-Quelle sagt, voll KI-generierte Videos seien ausgeschlossen, KI-unterstützter Schnitt/B-Roll erlaubt ([Storrito](https://storrito.com/resources/what-tiktoks-ai-monetization-restrictions-signal-for-creator-income/)). Eine andere sagt, KI-Videos würden bezahlt, wenn gekennzeichnet ([Lilach Bullock](https://www.lilachbullock.com/ai-generated-videos-monetised-tiktok/)). **Keine davon ist offiziell. Eine feste Schwelle für „zu viel KI" ist nicht veröffentlicht → unklar.**
- Folge: Ein Video, das **nur** per Knopfdruck aus KI entsteht, ist das größte Risiko. Mensch muss erkennbar Ideen, Skript-Änderung, Auswahl und Schnitt beitragen (siehe 4). Das ist auch unser Beleg, falls TikTok nachfragt.

### 3b. YouTube „inauthentic content"
- Juli 2026 klargestellt: Nicht verboten ist KI, sondern **massenhaft gleiche/wiederholte Videos** (KI, CGI, Schablonen), unbefriedigende/verstörende Inhalte und KI-Personen bei heiklen Themen (Finanzen, Recht, Medizin) ([TechCrunch](https://techcrunch.com/2026/07/20/youtube-clarifies-policies-around-ai-slop-and-upsetting-videos/), [Tubefilter](https://www.tubefilter.com/2026/07/13/youtube-inauthentic-content-monetization-policy-update/), [eWeek](https://www.eweek.com/news/youtube-responds-to-ai-concerns/)). Datum je nach Quelle 15./16. Juli.
- Betroffen kann der **ganze Kanal** sein; es gibt Berichte über Fehlflags bei Originalinhalt (Quellen oben). Genauer YouTube-Originaltext von mir **nicht** gelesen → unklar.
- Genau hier liegt das Risiko eines Agenten: **Fließband mit gleichem Aufbau**. Gegenmittel: pro Video **Variations-Vorgabe** (Hook-Typ, Länge, Szenenstil, Erzählperspektive), nie zweimal hintereinander gleich; lieber 1–2 gute Videos/Tag als 3 Schablonen.

### 3c. KI-Label und C2PA
- TikTok verlangt Kennzeichnung bei realistischen KI-Inhalten, setzt bei C2PA-Daten in der Datei **automatisch** ein „KI-generiert"-Label ([TikTok Transparenz](https://www.tiktok.com/transparency/en/supporting-responsible-transparent-ai-generated-content/), [Hilfe](https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content)). Seit Nov. 2025 testet TikTok unsichtbare Wasserzeichen ([Newsroom](https://newsroom.tiktok.com/more-ways-to-spot-shape-and-understand-ai-generated-content?lang=en-GB)).
- Ob das Label die **Reichweite/Auszahlung** senkt: **nicht belegt, unklar.** Für YouTube sagt die Hilfe: Label begrenzt Reichweite/Monetarisierung nicht ([YouTube](https://support.google.com/youtube/answer/14328491)).
- Regel: Der **Mensch setzt den KI-Schalter** beim Planen (Agent trägt „KI-Schalter: ja/nein + Grund" in die Notiz ein). Der Agent prüft die Datei auf C2PA-Daten (z. B. `exiftool`/`c2patool`, gratis) und schreibt das Ergebnis in die Notiz. Cartoon-Stil mit eigenen Zeichnungen ist deutlich unproblematischer als fotorealistische KI-Bilder – **bei Cartoon-Stil bleiben**.

## 4. Was voll automatisch laufen darf – und was nicht

| Schritt | Voll automatisch? | Begründung |
|---|---|---|
| Daten holen, auswerten, Themenvorschläge | **Ja** | kein Veröffentlichen, nur intern |
| Themenwahl | **Ja, mit Vorgaben** (Format-Rotation, Sperrliste, Nische) | Mensch sieht Auswahl in der Freigabe |
| Skript-Entwurf + Quellensuche | **Ja** | Entwurf, noch nichts live |
| Fakten-Check | **Halb:** Agent sammelt, Mensch bestätigt Kerntatsachen | Falsche „wahre Geschichte" = Vertrauens- und Strike-Risiko |
| Voice, Bilder, Schnitt, Export | **Ja** | Werkzeugarbeit |
| Caption/Hashtags/Notiz | **Ja** (Entwurf) | Mensch darf ändern |
| **Freigabe** | **Nein – Mensch, ca. 5 Min** | Beleg für „eigene Arbeit", fängt Fehler/Schablone/Verstörendes |
| **KI-Schalter + Upload** | **Nein – Mensch** | [[Auto-Upload]]: kein Bot-Login, nur Studio-Planer |
| Zahlen nach 48 h | Mensch kopiert, Agent wertet aus | kein Zugriff per Bot |

### Die 5-Minuten-Freigabe (Checkliste im Video-Idee-Geld-Check)
1. **Video einmal ganz ansehen** (65–90 s) – Ton, Untertitel, nichts Verstörendes/Politisches.
2. **Kerntatsachen gegen die Quellen** in der Notiz prüfen (1–2 Klicks).
3. **Eigener Beitrag:** mindestens eine Änderung am Skript (Satz, Hook oder Schluss-Frage) – „Mensch hat es geformt".
4. **Anders als die letzten 5 Videos?** (Hook, Aufbau, Optik) – sonst zurück an den Agenten.
5. KI-Schalter-Entscheidung + Häkchen im Geld-Check; dann `status: live` nach dem Planen.

## 5. Aufwand, Kosten, Risiko, Abo-Verbrauch

| | Wert |
|---|---|
| Menschlicher Aufwand | ~5 Min Freigabe + 2 Min Planen je Video, + 5 Min Wochenpflege (Creative-Center-Kopie) + 3 Min Zahlen = bei 10 Videos/Woche ca. **1,5–2 Std/Woche** (Schätzung) |
| Kosten | 0 €. Ausnahme: Gratis-TTS/Remotion-Lizenz prüfen – **Remotion hat eine Lizenz-Regel für Firmen** ([[remotion-license]]-Skill nutzen), für uns **unklar**, vor Start prüfen |
| Abo-Verbrauch | **Unklar, nicht gemessen.** Grobe Annahme: Skript + Faktencheck je Video moderat; Remotion-Bau (Code erzeugen/anpassen) ist der größte Brocken. Mitigation: ein **fester Remotion-Baukasten**, Agent füllt nur Daten (Skript, Bilder, Timings) statt jedes Mal Code zu schreiben. Messen laut Roadmap Phase 3 („Verbrauch prüfen") |
| Hauptrisiko | Schablonen-Muster (YouTube), „zu viel KI" (TikTok, unklar), falsche Fakten, Konto-Sperre bei Bot-Upload (vermieden) |
| Rest-Risiko | Nicht null. Eine Person darf nie „nur durchwinken" – Freigabe ernst nehmen |

## 6. Aufbau in Stufen (nach Roadmap)
1. **Jetzt (Phase 2):** Pipeline von Hand mit Claude: Schritte 3–6 testen, Remotion-Baukasten aus `cartoon-3d-short` ableiten. Ziel: 10 Videos.
2. **Phase 3:** `trend-scout` + [[Morgen-Briefing]] automatisch (geplante Aufgabe). Agent liefert täglich 1–2 fertige Skriptentwürfe.
3. **Phase 4 (ab ~30 Videos):** eigene Zahlen steuern die Themenwahl; Vergleichstests aus [[01_Strategie]] (Stimme, Aufbau) laufen mit.
4. **Phase 5:** Server, evtl. n8n – aber **Upload bleibt Studio**.

## 7. Dauer-Prüffragen
1. **Potenzial:** Die Pipeline bringt **keine zusätzlichen Views von selbst**. Sie bringt Menge, Konstanz und datengetriebene Wahl. Views kommen aus Hook, Watchtime, Shares ([[01_Strategie]]). Datenlage zu „welche Formate zahlen": Tool-Blogs, Schätzungen. **Unklar**, ob datengetriebene Auswahl besser ist als gutes Bauchgefühl, bevor ~30 Videos eigene Zahlen liefern. Vorteil: wenig Menschenzeit → mehr Videos/Tests möglich.
2. **Sicherheit:** Mit Freigabe + Variation + Quellen + Studio-Upload = **kontrollierbar, nicht null**. Ohne Freigabe (voll automatisch) = **nein, nicht empfohlen** (TikTok „Originalinhalt" unklar/streng laut Vendor-Quellen; YouTube Schablonen-Regel gilt für den ganzen Kanal). Offizielle Primärtexte von TikTok zur KI-Schwelle für Creator Rewards **nicht gefunden → unklar**, im Konto nachlesen.

## Offene Punkte (A)
- [ ] Creator-Rewards-Regeln im echten TikTok-Konto nach „KI/Originalität" durchlesen und hier ergänzen
- [ ] Remotion-Lizenz für uns klären
- [ ] Abo-Verbrauch pro Video messen (nach 5 Videos)
- [ ] Variations-Katalog (Hook-Typen, Stile, Längen) für den Agenten anlegen
- [ ] Gratis-TTS wählen und gegen Menschenstimme testen
