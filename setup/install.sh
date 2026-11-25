#!/usr/bin/env bash
# Einmal pro Rechner ausführen (privater PC, später der Server). Installiert nichts in andere Projekte.
set -euo pipefail
echo "== Cisco Skill Scanner (global, verbraucht keine Tokens)"
if command -v pipx >/dev/null; then pipx install --force cisco-ai-skill-scanner
else python3 -m pip install --user --upgrade cisco-ai-skill-scanner; fi
skill-scanner --version || echo "Hinweis: ~/.local/bin zum PATH hinzufügen"
command -v ffmpeg >/dev/null || echo "Hinweis: ffmpeg fehlt (für Video-Skills) – z.B. 'sudo apt install ffmpeg' / 'winget install ffmpeg'"
command -v node   >/dev/null || echo "Hinweis: Node.js fehlt (für Remotion) – https://nodejs.org"
echo "== Fertig. Obsidian: 'Ordner als Vault öffnen' -> $(cd "$(dirname "$0")/.." && pwd)/vault"
