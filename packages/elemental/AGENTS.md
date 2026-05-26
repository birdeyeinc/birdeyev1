# Elemental — agent instructions

This repo uses shared **Agent Skills** (Cursor, Claude Code, Codex). Canonical source: [`skills/`](skills/).

## Skills (read when relevant)

| Skill | Path | Use when |
|-------|------|----------|
| **elemental-icons** | [skills/elemental-icons/SKILL.md](skills/elemental-icons/SKILL.md) | `icon_phoenix-*`, Lucide, `atoms/Icon`, TabsToggle/Chip icons, Storybook icon stories |
| **elemental-bk-bird-workflow** | [skills/elemental-bk-bird-workflow/SKILL.md](skills/elemental-bk-bird-workflow/SKILL.md) | `BK-BIRD-00000-learning`, feature branches, commit/merge/push |

Also see [CLAUDE.md](CLAUDE.md) and [README.md](README.md).

## Tool-specific locations

| Tool | Project path | User-global install |
|------|----------------|---------------------|
| **Cursor** | `.cursor/skills/` (mirror of `skills/`) | — |
| **Claude Code** | `.claude/skills/` (mirror of `skills/`) | `~/.claude/skills/` |
| **Codex** | Read `skills/` in-repo, or install globally | `~/.codex/skills/` |

Install globally (symlinks to this repo):

```bash
./scripts/install-agent-skills.sh
```

Restart Claude Code / Codex after installing.

## Quick rules

- **Icons:** Phoenix (`icon_phoenix-*`) is default; Lucide is opt-in via `Icon` + peer `lucide-react` — no bulk migration.
- **Git:** `BK-BIRD-00000-learning` is integration; merge feature branches back unless the user opts out.
