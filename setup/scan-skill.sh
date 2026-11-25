#!/usr/bin/env bash
# Prüft einen Skill mit dem Cisco Skill Scanner und installiert ihn NUR, wenn er sauber ist.
# Nutzung:  setup/scan-skill.sh https://github.com/BESITZER/REPO   [--nur-scannen]
#           setup/scan-skill.sh ./lokaler/ordner                   [--nur-scannen]
set -euo pipefail
SRC="${1:?Bitte GitHub-URL oder Ordner angeben}"; MODE="${2:-}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; DEST="$ROOT/.claude/skills"
command -v skill-scanner >/dev/null || { echo "skill-scanner fehlt – erst setup/install.sh ausführen"; exit 1; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
if [[ "$SRC" == http* ]]; then git clone -q --depth 1 "$SRC" "$TMP/src"; REPO="${SRC#https://github.com/}"; else cp -r "$SRC" "$TMP/src"; REPO="lokal:$SRC"; fi
echo "== Scanne $SRC ..."
if ! skill-scanner scan-all "$TMP/src" --recursive --use-behavioral --fail-on-findings; then
  echo; echo "❌ KRITISCHE oder HOHE Funde – NICHT installiert."
  echo "   Funde prüfen (oft Fehlalarme). Wenn ihr sicher seid: Ordner manuell nach .claude/skills kopieren."
  exit 2
fi
echo "✅ Scan sauber."
[[ "$MODE" == "--nur-scannen" ]] && exit 0
find "$TMP/src" -name SKILL.md -not -path '*/node_modules/*' -print0 | while IFS= read -r -d '' f; do
  d="$(dirname "$f")"; n="$(grep -m1 '^name:' "$f" | sed 's/name: *//;s/["'\'']//g')"; n="${n:-$(basename "$d")}"
  rm -rf "$DEST/$n"; cp -r "$d" "$DEST/$n"; rm -rf "$DEST/$n/.git"
  grep -v "^$n|" "$DEST/.sources" > "$DEST/.sources.tmp" 2>/dev/null || true; echo "$n|$REPO" >> "$DEST/.sources.tmp"; mv "$DEST/.sources.tmp" "$DEST/.sources"
  echo "   installiert: $n"; done
