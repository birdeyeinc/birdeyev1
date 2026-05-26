# PR #32637 alignment report (UI-web-2.0 + Elemental)

**UI-web PR:** [birdeyeinc/UI-web-2.0#32637](https://github.com/birdeyeinc/UI-web-2.0/pull/32637)  
**Elemental:** merged to [`BK-BIRD-00000-learning`](https://github.com/birdeyeinc/elemental) (`d5cbd44e`) | PR [#994](https://github.com/birdeyeinc/elemental/pull/994)  
**UI-web fix commit:** `ab7322c` on `BK-BIRD-00000-font-size-14px`  
**Updated:** 2026-05-22

Shared expectation: **Inter** at **400/500**, **14px** where applicable, colors from **Elemental palette**, **no JS `fonts.js` import** in Emotion, **no local/server/build junk** in PRs.

---

## Review comment table

| # | Comment | Link | Before | After | Fixed? | Still needs fix? |
|---|---------|------|--------|-------|--------|------------------|
| 1 | Remove `.cursor/plans/font-usage-report.md` | [r3271865509](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3271865509) | File in early commit | Not in PR diff vs base | Yes | No |
| 2 | Remove `buildConfig/runElementalRollup.js` | [r3271874021](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3271874021) | Local rollup helper | Not in PR diff | Yes | No |
| 3 | Remove `server/ssoLogin/index.js` | [r3271881062](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3271881062) | Server SSO change | Not in PR diff | Yes | No |
| 4 | Remove `yarn.lock` | [r3271991697](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3271991697) | Lockfile in PR | Not in PR diff | Yes | No |
| 5 | Remove `package.json` | [r3272008628](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3272008628) | package.json in PR | Not in PR diff | Yes | No |
| 6 | Remove SSO `index.html` | [r3272019537](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3272019537) | Static SSO HTML | Not in PR diff | Yes | No |
| 7 | Remove `.gitignore` | [r3272029819](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3272029819) | .gitignore drift | Not in PR diff | Yes | No |
| 8 | Colors in Elemental palette | [r3274541308](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3274541308) | Colors in web `_primitive.scss` | Elemental `$brand-color: #2652ED` | Yes (Elemental) | Verify web uses tokens only |
| 9 | `signStyle.css` Poppins → Inter | [r3274556669](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3274556669) | Poppins @font-face URLs | `font-family: Inter` in file; CDN paths still named poppins | Partial | Low — CDN filename only |
| 10 | `#2652ED` from Elemental in sign CSS | [r3274571772](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3274571772) | Hardcoded hex | No `#2652ED` in signStyle on branch | Yes | No |
| 11 | Restore condition in `enterpriseDashboardStyle.js` | [r3274696943](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3274696943) | Condition removed | Ternaries kept; colors → tokens only | Yes | No |
| 12 | No width change in `EnterpriseReportsHeader` | [r3274723501](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3274723501) | Width changed | Diff adds `background-color` only, not width | Yes | No |
| 13 | No `elementalFonts` in `variable.js` | [r3274745163](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3274745163) | `import …/fonts` | Inline Inter stacks in `ab7322c` | Yes | No |
| 14 | `$inter-font`; replace poppins/roboto usages | [r3274843365](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3274843365) | Alias `$poppins-font: $inter-font` | `_variables` + `filterSelect` use `$inter-font`; Phoenix SCSS **blocked by pre-commit** | Partial | Yes — Phoenix folder (~19 files); migrate to Elemental or get approval |
| 15 | AppointmentsBanner test | [r3285998935](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3285998935) | Test | “fixed” reply | Yes | No |
| 16 | AppointmentsBanner line test | [r3286006956](https://github.com/birdeyeinc/UI-web-2.0/pull/32637#discussion_r3286006956) | Test | “fixed” reply | Yes | No |

---

## Elemental (done)

| Item | Detail |
|------|--------|
| RailNav | `data-title-tier` + `$fs18` / `$fs14` / `$fs13`; no JS font sizes |
| Merged | `BK-BIRD-00000-learning` @ `196309f2` / `d5cbd44e` (report) |
| PR | https://github.com/birdeyeinc/elemental/pull/994 |

---

## UI-web `ab7322c` (done in this pass)

- `variable.js`: removed `elementalFontVariables` import; `brandFont` / `interFont` string stacks
- `App/styles.scss`: `.el-railnav` shell band **without** fixed `font-size` (Elemental tiers apply)
- `filterSelect.scss`: `font-family: $inter-font`
- `_variables.scss`: deprecated aliases unchanged; non-Phoenix path aligned

---

## Remaining (UI-web #32637)

1. **Phoenix SCSS** — 28 lines in 19 files; fix via **component migration** (Phase 1 import cutover), not Phoenix sed. **Plan:** [`plan/phoenix-to-elemental-component-migration.md`](../../plan/phoenix-to-elemental-component-migration.md) (hook exception superseded)
2. **Literal `'Poppins'` / `'Roboto'`** in some JS/SCSS (social, surveys, etc.) — separate pass or out of scope for this PR.
3. **Bump `@birdeye/elemental`** after Elemental package publish so UI-web picks up RailNav `data-title-tier` behavior.
4. **Phase 2+:** TableContainer → TableGrid; Elemental `PageHeader` / `AccountSwitcher` (see migration plan).

---

## Verification

```sh
# UI-web on BK-BIRD-00000-font-size-14px
rg "elementalFont" src
rg '\$poppins-font|\$roboto-font' src/app/components/Phoenix --glob '*.scss'
rg "font-family:\s*-font" src
```
