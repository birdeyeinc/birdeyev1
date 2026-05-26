---
name: elemental-bk-bird-workflow
description: >-
  Git branch and merge workflow for Birdeye Elemental BK-BIRD-00000 work.
  Use when committing, pushing, creating branches, merging feature branches,
  BK-BIRD-00000-learning, BK-BIRD-00000-* slugs, or when the user asks to
  sync learning with feature branches or track changes on the integration branch.
---

# Elemental BK-BIRD-00000 git workflow

## Integration branch (main line for this work)

**`BK-BIRD-00000-learning`** is the integration branch for BK-BIRD-00000 experiments.

- Branch new feature work **from** `BK-BIRD-00000-learning`
- When a feature is done (commit + push on the feature branch), **merge back into `learning` and push `learning`** unless the user explicitly says not to (e.g. "don't merge into learning", "revoke", throwaway branch)
- Do **not** leave `learning` behind feature branches without merging unless instructed

## Feature branch naming

```text
BK-BIRD-00000-<kebab-case-slug>
```

Examples:

- `BK-BIRD-00000-brand-color-tokens`
- `BK-BIRD-00000-side-drawer-shadow`

No spaces in branch names.

## Typical flow

```bash
git checkout BK-BIRD-00000-learning
git pull origin BK-BIRD-00000-learning

git checkout -b BK-BIRD-00000-<slug>
# ... edit, commit ...
git push -u origin BK-BIRD-00000-<slug>

# Merge back to learning (default unless user opts out)
git checkout BK-BIRD-00000-learning
git merge BK-BIRD-00000-<slug>
git push origin BK-BIRD-00000-learning
```

Fast-forward merges are fine when `learning` is an ancestor of the feature branch.

## Commits

- Only commit when the user asks (or their rule explicitly allows it)
- Use clear messages; HEREDOC for multi-line bodies
- Do not amend/push force unless explicitly requested

## README / tracking

- BK-BIRD change log for pushed work: [README.md](README.md) section **BK-BIRD-00000 pushed changes**
- Typography audit detail: [`src/Docs/inter-typography-audit.md`](src/Docs/inter-typography-audit.md)

## Storybook

- `yarn story` (port 3000; may prompt for 3001 if busy)
- Sidebar names match story `title` (e.g. `Atom/TabsToggle`, `Atom/Icon`)

## Related skills

- Icons (Phoenix vs Lucide): `skills/elemental-icons/SKILL.md`
- Table migration: `elemental-table-migration` (under `src/components/TableGrid/skills/` when editing Table/TableGrid docs)
