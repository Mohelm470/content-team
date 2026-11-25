"""Claude-Code-Hook: blockiert Skill-Installationen, die nicht über den Scanner laufen."""
import json, re, sys
cmd = (json.load(sys.stdin).get("tool_input") or {}).get("command", "")
if "scan-skill.sh" in cmd:
    sys.exit(0)
risky = [r"\bskills\s+add\b", r"claude\s+plugin\s+install", r"git\s+clone\b.*\.claude[/\\]skills",
         r"\b(cp|mv|rsync|unzip|tar)\b.*\.claude[/\\]skills"]
if any(re.search(p, cmd) for p in risky):
    print("Skill-Installation blockiert: Neue Skills nur über den Scanner installieren:\n"
          "  bash setup/scan-skill.sh https://github.com/BESITZER/REPO", file=sys.stderr)
    sys.exit(2)
