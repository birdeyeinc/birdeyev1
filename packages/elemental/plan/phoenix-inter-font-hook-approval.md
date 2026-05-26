# Phoenix `src/app/components/Phoenix` — pre-commit exception request

> **Status: Superseded.** Team chose **component migration** instead of hook exception.  
> **Active plan:** [`phoenix-to-elemental-component-migration.md`](phoenix-to-elemental-component-migration.md)

**To:** Amit / Mukul  
**From:** BK-BIRD / BIRD-194995 typography pass  
**Re:** [UI-web-2.0 PR #32637](https://github.com/birdeyeinc/UI-web-2.0/pull/32637) · [Elemental PR #994](https://github.com/birdeyeinc/elemental/pull/994)

---

## Ask (historical — not pursuing)

~~Approve a **one-time, mechanical SCSS-only change** under `src/app/components/Phoenix`~~ → use **Phase 1 import cutover** in migration plan instead.

**Blocked by:** `prevent-file-updation.js` (husky pre-commit) — changes to `src/app/components/Phoenix` fail unless exempted.

---

## Why (reviewer expectation)

Sukhjinder’s review on #32637 ([discussion_r3274843365](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3274843365)):

> Introduce a new Inter font variable and replace everywhere we used Roboto and Poppins — not only alias `$poppins-font` to `$brandFont`.

**Already done outside Phoenix** (commit `ab7322c`):

- Removed `elementalFonts` / `@birdeye/elemental/.../fonts.js` from `variable.js`
- `filterSelect.scss`, `_variables.scss`, `App/styles.scss` (RailNav shell; no fixed 16px)
- Elemental: RailNav `data-title-tier` + `$fs14` / `$fs13` on `BK-BIRD-00000-learning`

**Still open:** **28** `font-family: $poppins-font` / `$roboto-font` lines in **19** Phoenix SCSS files (see list below).

---

## Proposed change (if approved)

- Replace `$poppins-font` → `$inter-font`
- Replace `$roboto-font` → `$inter-font`
- **No** layout, width, color, or logic edits
- **No** new components; **no** Elemental package bump required for this substitution (`$inter-font` already in `src/sass/_variables.scss`)

```bash
# Exact scope (run only after approval)
rg -l '\$poppins-font|\$roboto-font' src/app/components/Phoenix --glob '*.scss' \
  | while read -r f; do
      sed -i '' 's/\$poppins-font/\$inter-font/g; s/\$roboto-font/\$inter-font/g' "$f"
    done
```

---

## Files in scope (19)

| File | Lines to change |
|------|-----------------|
| `AccountSwitcher/AccountSwitcher.scss` | 4 |
| `AccountSwitcher/BusinessListItem.scss` | 1 |
| `AnalyticsGraphTableModule/AnalyticsGraphTableModule.scss` | 1 |
| `AnalyticsGraphTableModule/utils/Charts.scss` | 1 |
| `ChatEditor/commonWebchat.scss` | 3 |
| `FAQFileUploadMatch/FAQFileUploadMatch.scss` | 1 |
| `FaqAIModule/faqAi.scss` | 2 |
| `GraphTableModule/Charts.scss` | 1 |
| `GraphTableModule/GraphTableModule.scss` | 1 |
| `ItemSelectionComponent/index.scss` | 1 |
| `LeftNav/leftNav.scss` | 1 |
| `LocationLevelSelect/LocationLevelSelect.scss` | 1 |
| `NoData/index.scss` | 1 |
| `PageHeader/PageHeader.scss` | 1 |
| `ResellerGroupsAndBusinesses/index.scss` | 1 |
| `ReviewCallOutBanner/index.scss` | 3 |
| `ReviewCard/ReviewCard.scss` | 1 |
| `ReviewCard/components/actionBox/index.scss` | 2 |
| `SectionListView/SectionListView.scss` | 1 |
| `SpreadSheetPreview/SpreadSheetPreview.scss` | 1 |

**Note:** Several paths are on `ignoreFilesOrFolders` in `prevent-file-updation.js` for *other* workflows (e.g. `ReviewCard`, `PageHeader`); the hook still blocks when those files are staged. Confirm whether ignored paths should be updated or a blanket typography exception is preferred.

---

## Why not full Elemental migration now

- UI-web **Phoenix** is a large legacy tree (`src/app/components/Phoenix/*`), not the Phoenix **icomoon** assets in Elemental (`src/assets/icomoon/phoenix/`).
- Migrating these components to `@birdeye/elemental` is a **multi-sprint** effort; it is out of scope for the 14px / Inter typography PR.
- This request is the **minimal** fix to satisfy #32637 comment #14 without `--no-verify` unless you prefer that after written approval.

---

## Alternatives

| Option | Pros | Cons |
|--------|------|------|
| **A. Approve Phoenix SCSS pass above** | Closes reviewer ask; matches Elemental `$inter-font` | Touches protected folder |
| **B. Defer Phoenix; merge PR without #14** | No hook fight | Reviewer likely re-opens |
| **C. Full Phoenix → Elemental migration** | Long-term correct | Not feasible for #32637 timeline |

**Recommendation:** **Option A** for this PR; track Option C on BK-BIRD backlog.

---

## After approval (engineering)

1. Apply sed scope on `BK-BIRD-00000-font-size-14px`
2. Commit: `BIRD-194995: Replace Phoenix poppins/roboto font-family with $inter-font`
3. Re-request review on #32637 with link to this note
4. Bump `@birdeye/elemental` when learning package is published (RailNav `data-title-tier`)

---

## Copy-paste for Slack / email

> Hi Amit/Mukul — For BIRD-194995 / UI-web PR #32637 (Inter 14px, no Roboto/Poppins), we need a one-time exception to edit 19 Phoenix SCSS files: mechanical `$poppins-font` / `$roboto-font` → `$inter-font` only (28 lines). Pre-commit blocks `src/app/components/Phoenix`. Elemental side is done (RailNav tokens, no fonts.js in Emotion). Full Phoenix→Elemental migration isn’t in scope. OK to proceed, or should we hold for component migration? Details: `elemental/plan/phoenix-inter-font-hook-approval.md`
