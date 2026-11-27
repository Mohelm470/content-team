---
owner: A
status: ideen
aktualisiert: 2026-11-27
tags: [ki, video, bewegung]
---
# Bewegungs-Ideen für den Baukasten

Quelle: `reference/motion-vocabulary.md` aus [anything2explainer](https://github.com/Vincentwei1021/anything2explainer) (nur gelesen, **kein Code übernommen**).

> [!warning] Lizenz
> Das Repo steht unter **PolyForm Noncommercial 1.0.0**. Wir verdienen Geld mit den Videos → **keinen Code und keine Texte kopieren, Skill nicht installieren.** Nur allgemeine Ideen, selbst neu bauen. Ob die erzeugten Videos frei sind, sagt der Autor ("gehören den Erstellern"), die Nutzung des Werkzeugs selbst ist aber nicht-kommerziell. Rechtlich nicht geprüft.

## Ideen für unsere Shorts (nach Nutzen)
1. **Jeder Satz = eine sichtbare Änderung.** Kommt nichts Neues, dann eine kleine Kamerabewegung statt Elemente erfinden. Steht still >3 s = Fehler.
2. **Kamera-Budget:** langsame Schnitt-Pushs, 30–45 Frames (1–1,5 s), sanft beschleunigt/abgebremst. Maximal 1 pro Szene. Zoom höchstens 1,33×. Nach dem Zoom kurz stehen lassen (ca. 1 s).
3. **Hartschnitt nur nach Ausblenden:** Elemente die letzten 6–12 Frames auf 0 ausblenden (nicht 40 % sichtbar lassen, das wirkt wie "Ruckler"). Dazu leichtes Absinken.
4. **Einheitlicher Eintritt:** Text/Figuren blenden in ca. 8 Frames ein und steigen 10 px auf. Nur 1 "Glitch/Flash"-Effekt pro Szene, für das wichtigste Wort.
5. **Wort-Zeiten steuern die Bilder:** Element erscheint genau beim passenden Wort (Toleranz −6…+3 Frames). Genau dafür brauchen wir die Whisper-Wortzeiten.
6. **Staffelung:** Listen erscheinen mit 2 Frames Abstand pro Element.
7. **Übergabe statt Neuaufbau:** Die Hauptfigur wandert in die nächste Szene (kleiner, in die Ecke), statt zu verschwinden und neu zu erscheinen.
8. **Zahlen zählen hoch** (14–26 Frames), Linien/Pfeile werden gezeichnet statt eingeblendet.
9. **Kurze Sätze (<3 s)** in die Nachbarszene packen, keine Szene unter ca. 4 s.

## Prüffragen
1. **Views:** Die Zahlen (Kamera-Rate, Frames) kommen aus einem Erklärvideo-Projekt, **nicht aus Shorts-Daten**. Ob das mehr Wiedergabedauer bringt: **unklar**, im 10-Videos-Test messen.
2. **Demonetarisierung:** Eigene Bewegung ist neutral. Gleiche Bewegung in jedem Video = Schablone, darum pro Video variieren. Plattform-Wirkung: **unklar**.
