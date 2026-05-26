#!/usr/bin/env bash
# Symlink Elemental skills into ~/.codex/skills and ~/.claude/skills for auto-discovery.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_SRC="$REPO_ROOT/skills"
CODEX_DEST="${CODEX_HOME:-$HOME/.codex}/skills"
CLAUDE_DEST="$HOME/.claude/skills"

install_skill() {
  local name="$1"
  local src="$SKILLS_SRC/$name"
  local dest_codex="$CODEX_DEST/$name"
  local dest_claude="$CLAUDE_DEST/$name"

  if [[ ! -f "$src/SKILL.md" ]]; then
    echo "Missing $src/SKILL.md" >&2
    exit 1
  fi

  mkdir -p "$CODEX_DEST" "$CLAUDE_DEST"

  for dest in "$dest_codex" "$dest_claude"; do
    if [[ -e "$dest" && ! -L "$dest" ]]; then
      echo "Skip $dest (exists and is not a symlink)" >&2
    else
      ln -sfn "$src" "$dest"
      echo "Linked $dest -> $src"
    fi
  done
}

for skill in elemental-icons elemental-bk-bird-workflow; do
  install_skill "$skill"
done

echo "Done. Restart Codex and Claude Code to pick up skills."
