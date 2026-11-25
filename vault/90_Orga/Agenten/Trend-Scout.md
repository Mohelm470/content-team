---
owner: A
rhythmus: täglich ~6 Uhr
ausloeser: geplante Aufgabe in Claude Code (ab Phase 3), vorher von Hand
phase: 3
status: geplant
skills: [trend-scout (noch zu bauen), defuddle]
tags: [agent]
---
# Trend-Scout

**Aufgabe:** Sammelt jeden Morgen, was in unserer Nische gerade abgeht.

- **Wann:** täglich, früh morgens
- **Auslöser:** geplante Aufgabe in Claude Code; später auf dem Server via n8n
- **Quellen (alle kostenlos):**
  - YouTube Data API – Shorts mit vielen Views in kurzer Zeit (kostenloser Schlüssel nötig)
  - Reddit – beliebte Beiträge der Nischen-Subreddits (öffentliche Seiten)
  - Google Trends – steigende Suchbegriffe
  - TikTok Creative Center – Trend-Hashtags & Sounds (keine offizielle Schnittstelle → anfangs von Hand reinkopieren)
- **Werkzeuge/Skills:** eigener Skill `trend-scout` (**noch zu bauen**, Ersatz für das verworfene last30days), `defuddle`
- **Ergebnis:** `10_Wissen/Trends/JJJJ-MM-TT.md` – Rohliste mit Links, Views, Follower, Alter
- **Regeln:** nur lesen, keine Logins, keine Inhalte herunterladen

Weiter an: [[Format-Zerleger]] · Zurück zur [[Roadmap]]
