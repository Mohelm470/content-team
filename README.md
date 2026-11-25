# content-team

Alles für unser Content-Projekt in **einem** Ordner: Skills, Regeln, Obsidian-Vault, Setup.
Portabel: heute privater PC / Cloud, später der Server (dritter PC).

## Auf einem neuen Rechner (PC oder Server)
```bash
git clone https://github.com/<konto>/content-team.git
cd content-team
bash setup/install.sh
```
Obsidian → Vault-Symbol → „Ordner als Vault öffnen“ → `content-team/vault`.
Claude Code im Ordner `content-team` starten – die Skills sind dann automatisch da.

## Neuen Skill hinzufügen (immer mit Sicherheits-Scan)
```bash
bash setup/scan-skill.sh https://github.com/BESITZER/REPO
```
Nur bei sauberem Scan wird installiert. Herkunft jedes Skills: `.claude/skills/.sources`.

## Enthaltene Skills (alle mit Cisco Skill Scanner geprüft)
| Quelle | Skills |
|---|---|
| kepano/obsidian-skills | 7 (Obsidian-Markdown, Bases, Canvas, CLI, defuddle …) |
| remotion-dev/skills | 13 (Videos aus Code, Untertitel, Rendering) |
| czlonkowski/n8n-skills | 15 (n8n-Workflows bauen – für später auf dem Server) |
| aaaronmiller/create-viral-content | Hooks, Titel, Plattform-Regeln |
| s77sh/viral-reel-playbook | Skripte mit Hook/Rehook für Shorts |
| mromidev/claude-animated-shorts | animierte Story-Shorts (Remotion + three.js) |
| anthropics/skills → skill-creator | eigene Skills bauen |

Verworfen: `mvanhorn/last30days-skill` (18 kritische Funde, zu weitreichende Zugriffe).
Lizenzen: Jeder Skill-Ordner behält die Lizenzdatei seines Original-Repos.
