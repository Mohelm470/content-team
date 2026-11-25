---
name: token-sparen
description: Regeln für tokeneffizientes Arbeiten mit Claude Code / der Claude-App. Nutze diesen Skill bei jeder neuen Nachricht, die das Thema wechselt, wenn ein Chat lang wird, bevor du Neben-Sitzungen, Agenten oder Automatisierungen startest, bei der Wahl von Modell und Denkaufwand, und wenn der Nutzer fragt, wie man Tokens spart.
---

# Token sparen

Jede Nachricht schickt den ganzen bisherigen Chat-Verlauf mit. Lange Chats werden dadurch teuer und mit der Zeit auch schlechter. Diese Regeln halten den Verbrauch klein, ohne dass die Arbeit darunter leidet.

## 1. Chats kurz halten

- **Themenwechsel = neuer Chat.** Prüfe bei jeder neuen Nachricht im Kopf, ob sie zum Zweck des Chats passt (nur ein Gedanke, kein Werkzeug-Aufruf). Passt sie nicht, beantworte sie **nicht** hier, auch wenn sie klein oder eilig ist. Schlag in einem Satz einen neuen Chat vor, mit Modell und Aufwand. Keine Ausreden wie „war doch nur kurz“.
- **Langer Chat = neuer Chat.** Ist ein Thema abgeschlossen oder der Chat schon lang (viele Runden, große Ausgaben) und braucht das Nächste den alten Verlauf kaum: von dir aus eine neue Sitzung vorschlagen.
- **Vorher sichern.** Was die neue Sitzung wissen muss, kommt in Notizen oder die `CLAUDE.md` des Ordners, sortiert nach Thema. Offene Punkte kurz notieren. Dann liest die neue Sitzung nur die Notizen, nicht den alten Chat.
- **Ausnahme:** Baut die nächste Aufgabe direkt auf dem auf, was gerade erarbeitet wurde, im selben Chat bleiben. Alles neu zu erklären wäre teurer.
- Entscheiden tut immer der Nutzer. Chats löschen nur gemeinsam mit ihm.

## 2. Passendes Modell und Denkaufwand

Bei jedem Vorschlag für eine neue Sitzung oder einen Agenten das Modell mitwählen und in einem Satz begründen. Nicht stur das billigste: erst überlegen, was die Aufgabe braucht.

| Aufgabe | Modell | Aufwand |
|---|---|---|
| Einfaches: Sortieren, Dateien ablegen, Status lesen, kurze Abfragen | Haiku | niedrig |
| Normale Arbeit: Notizen, Scripts, Recherche, die meisten Agenten | Sonnet | mittel |
| Schwieriges: Planung, Fehlersuche, Design, riskante Änderungen | Opus | hoch |

## 3. Kein Leerlauf

- **Alles abstellen, was Tokens kostet und nichts bringt**, von selbst und ohne zu fragen.
- **Neben-Sitzungen abkoppeln.** Dauerhafte Neben-Chats (z. B. Werkstatt-Chats für Agenten) direkt nach dem Start von der startenden Sitzung abkoppeln. Sonst weckt jede ihrer Meldungen den Haupt-Chat auf und schickt dessen ganzen Verlauf mit.
- **Keine leeren Statusmeldungen** weiterreichen („wartet auf dich“).
- **Aufräumen.** Fertige Sitzungen selbst archivieren. Überholte Sitzungen zum Löschen vorschlagen. Nie archivieren, was noch arbeitet, auf den Nutzer wartet oder angeheftet ist.

## 4. Teures vorher melden

Droht eine Aktion sehr viele Tokens zu kosten (geplante Aufgaben, die oft laufen, neue Agenten, lange Läufe), vorher in **einer Zeile** die Größenordnung nennen (Häufigkeit × Umfang) und auf OK warten.

## 5. Effizient arbeiten

- **Kurz antworten.** Oben max. 3 Schritte „Was du jetzt tun musst“, dann max. 4 Kernpunkte. Ausführliches gehört in eine Notiz, im Chat nur der Link.
- **Erst nachschlagen, dann suchen.** Gibt es eine Wissenskarte oder Übersicht zum Code (z. B. `graphify query "…"`), zuerst die fragen statt viele Dateien zu lesen.
- **Große Ausgaben klein halten.** Logs, große Dateien und lange Listen nicht komplett in den Chat holen: nur die nötige Stelle lesen oder per Script nur das Ergebnis ausgeben.
- **Einmal lösen, dann Script.** Was zum ersten Mal gelöst wurde, als getestetes Script ablegen und dokumentieren. Nächstes Mal: Script statt erneutes Ausprobieren.
- **Einfachsten Weg zuerst.** Ist ein Handgriff für den Nutzer trivial und die Automatik umständlich, erst fragen, statt eine große Lösung zu bauen.
