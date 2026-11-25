# Content-Team: Faceless Short-Form (TikTok & YouTube Shorts)

Zwei Personen, verschiedene Standorte. Ziel: virale *Formate* finden und für unsere Nische neu umsetzen – nie Inhalte kopieren.
Budget: nur das Claude-Abo. Kostenlose Werkzeuge bevorzugen.

**Hauptziel:** 4.000 €/Monat Gewinn ausschließlich über Plattform-Auszahlungen für Views (TikTok Creator Rewards, YouTube-Partnerprogramm). Details: `vault/00_Hauptziel.md` – vor jeder Strategie-Empfehlung lesen. Strategie: `vault/01_Strategie.md`.

## Arbeitsweise mit Claude
- Antworten auf Deutsch, kurz, einfache Worte. Nicht nachfragen, was in diesem Repo steht – erst hier lesen.
- Änderungen direkt auf `main` committen und pushen (Obsidian Git synct nur `main`), keine Neben-Branches.
- Entscheidungen und neues Wissen sofort in den Vault schreiben (`00_Hauptziel.md`, `90_Orga/Roadmap.md`), damit neue Chats sie kennen.
- Tokeneffizient: nur nötige Dateien lesen, keine Sub-Agenten ohne Grund.

## Regeln
- **Neue Skills nur über den Scanner:** `bash setup/scan-skill.sh <github-url>`. Ein Hook blockiert andere Installationswege.
- Skills liegen nur in diesem Projekt (`.claude/skills/`), nie global – damit andere Projekte keine Tokens verbrauchen.
- Notizen gehören in `vault/` (eigener Obsidian-Vault). Andere Vaults des Nutzers nie anfassen.
- Jede Video-Notiz nach `vault/99_Templates/Video-Idee.md`; jede Notiz hat genau einen `owner`.
- Große Dateien (Videos, Rohmaterial) nicht in Git, sondern in `media/` (ignoriert).

## Ablauf
Inbox → Ideen → Skripte → Produktion → Veröffentlicht → Analyse (Freitags-Review aktualisiert Hook-Bibliothek & Brand-Voice).

## Brand-Voice
Siehe `vault/20_KI/Brand-Voice/brand-voice.md` (noch offen, bis die Nische steht).
