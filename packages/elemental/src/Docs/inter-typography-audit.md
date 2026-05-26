# Inter Typography Audit

Date: 2026-05-13
Branch: `BK-BIRD-00000-learning`

## Goal

Move the design system typography surface from Roboto/Poppins to Inter and remove bold/heavy text weights from the repo typography surface. The supported text weights after this audit are:

- Regular: `400`
- Medium: `500`

## Scope

The audit covered source files under `src`, including:

- Sass design-system foundations and primitive font tokens
- Generated JS font tokens and Storybook typography docs
- Component styles and inline font weight declarations
- Rich text and template builder font option lists
- Story examples and documentation snippets that referenced Roboto, Poppins, or bold weights

Existing files outside `src`, generated build output, and dependency files were not used as the source of truth for this audit.

## Changes Applied

- Updated brand font tokens from `Roboto` to `Inter`.
- Replaced the secondary Poppins token/usages with Inter and renamed stale `poppins-*` references to `inter-*`.
- Replaced the DS utility class `ds-font-roboto` with `ds-font-inter`.
- Removed bold/light DS weight utilities from `src/sass/uiFoundations/_ds-typography.scss`.
- Removed `fwBold` from primitive and generated font token files.
- Normalized `font-weight: 600`, `font-weight: 700`, CSS `bold`, and matching inline `fontWeight` declarations to medium weight `500`.
- Preserved regular weight declarations at `400`.
- Updated rich text/template font picker entries from Roboto to Inter.

## Change Counts

These counts describe the typography source changes under `src` and exclude this audit document.

| Area | Changed files |
| --- | ---: |
| `src/components` | 39 |
| `src/atoms` | 21 |
| `src/sass` | 14 |
| `src/Docs` | 4 |
| Total | 78 |

| Change type | Count |
| --- | ---: |
| Source files with typography changes | 78 |
| Diff insertions in changed source files | 184 |
| Diff deletions in changed source files | 195 |
| Removed Roboto/`ds-font-roboto`/`font-roboto` lines | 40 |
| Removed Poppins/`poppins-*` lines | 32 |
| Added Inter/`ds-font-inter`/`font-inter`/`inter-*` lines | 72 |
| Removed heavy/bold weight lines | 115 |
| Added medium `500` weight lines | 109 |

Heavy/bold removals break down as:

| Removed token/type | Count |
| --- | ---: |
| `600` font weight | 32 |
| `700` font weight or `fwBold` token | 37 |
| CSS/inline `bold` font weight | 44 |
| Removed DS bold/light utility selectors | 2 |

## Key Files

- `src/sass/uiFoundations/_ds-typography.scss`
- `src/sass/primitive/fontStyle/fontFamilyStyle.scss`
- `src/sass/primitive/fontStyle/fontWeightStyle.scss`
- `src/sass/_variables.scss`
- `src/sass/js/fonts.js`
- `src/Docs/Styles/typography/typography.js`
- `src/Docs/Styles/DSClassSystem/DSClassSystem.js`
- `src/components/RichTextEditor/constants.tsx`
- `src/components/TemplateBuilder/utils/constants.tsx`

## Detailed Change Inventory

| File | Area | Diff size |
| --- | --- | ---: |
| `src/Docs/Styles/DSClassSystem/DSClassSystem.js` | docs | +1 / -1 |
| `src/Docs/Styles/DSClassSystem/DSClassSystem.stories.mdx` | docs | +6 / -6 |
| `src/Docs/Styles/typography/typography.js` | docs | +3 / -4 |
| `src/Docs/mdxdoc.scss` | docs | +1 / -1 |
| `src/atoms/ActionBox/index.module.scss` | atoms | +3 / -3 |
| `src/atoms/AdvancedMapView/MapMarker.tsx` | atoms | +1 / -1 |
| `src/atoms/Button/Button.module.scss` | atoms | +1 / -1 |
| `src/atoms/Button/Button.stories.jsx` | atoms | +1 / -1 |
| `src/atoms/Chip/index.jsx` | atoms | +1 / -1 |
| `src/atoms/ChipGroup/index.jsx` | atoms | +2 / -2 |
| `src/atoms/CommonSideDrawer/CommonDrawer.scss` | atoms | +1 / -1 |
| `src/atoms/FormInput/FormInput.module.scss` | atoms | +1 / -1 |
| `src/atoms/LoaderBox/LoaderBox.module.scss` | atoms | +4 / -4 |
| `src/atoms/MapView/MapView.stories.jsx` | atoms | +2 / -2 |
| `src/atoms/Modal/Modal.module.scss` | atoms | +1 / -1 |
| `src/atoms/Multiselect/index.module.scss` | atoms | +1 / -1 |
| `src/atoms/RangeSlider/RangeSlider.module.scss` | atoms | +1 / -1 |
| `src/atoms/RichTextEditor/CustomRichTextEditor/CustomRichTextEditor.module.scss` | atoms | +2 / -2 |
| `src/atoms/RichTextEditor/RichTextEditor.module.scss` | atoms | +2 / -2 |
| `src/atoms/Search/index.module.scss` | atoms | +1 / -1 |
| `src/atoms/SingleSelect/SingleSelectView.jsx` | atoms | +2 / -2 |
| `src/atoms/SingleSelect/filterSelect.scss` | atoms | +5 / -5 |
| `src/atoms/SingleSelectPaginated/SingleSelectPaginated.module.scss` | atoms | +1 / -1 |
| `src/atoms/Steppers/Steppers.module.scss` | atoms | +3 / -3 |
| `src/atoms/TimePeriod/TimePeriod.module.scss` | atoms | +1 / -1 |
| `src/components/AiContentDrawer/AiContentDrawer.module.scss` | components | +1 / -1 |
| `src/components/AiContentDrawer/AiContentDrawer.stories.jsx` | components | +1 / -1 |
| `src/components/BigCalendar/css/react-big-calendar.css` | components | +4 / -4 |
| `src/components/BigCalendar/less/month.less` | components | +2 / -2 |
| `src/components/BigCalendar/less/styles.less` | components | +1 / -1 |
| `src/components/BigCalendar/less/time-column.less` | components | +1 / -1 |
| `src/components/BigCalendar/sass/custom-style.scss` | components | +1 / -1 |
| `src/components/BigCalendar/sass/month.scss` | components | +2 / -2 |
| `src/components/BigCalendar/sass/styles.scss` | components | +1 / -1 |
| `src/components/BigCalendar/sass/time-column.scss` | components | +1 / -1 |
| `src/components/ConfirmationModal/ConfirmationModal.module.scss` | components | +2 / -2 |
| `src/components/Copilot/styles/copilot.module.scss` | components | +6 / -6 |
| `src/components/EmailCreator/EmailCreator.scss` | components | +2 / -2 |
| `src/components/EmailReviews/EmailReviews.module.scss` | components | +1 / -1 |
| `src/components/GraphTable/visualisations/charts/components/ChartComponent.module.scss` | components | +2 / -2 |
| `src/components/GraphTable/visualisations/charts/extensions/quadrant/helper.js` | components | +1 / -1 |
| `src/components/GraphTable/visualisations/charts/extensions/quadrant/quadrant.config.js` | components | +4 / -4 |
| `src/components/GraphTable/visualisations/charts/extensions/sunburst/helper.js` | components | +1 / -1 |
| `src/components/GraphTable/visualisations/charts/extensions/variablepie/helper.js` | components | +1 / -1 |
| `src/components/GraphTable/visualisations/charts/styles/charts.module.scss` | components | +4 / -4 |
| `src/components/GraphTable/visualisations/custom/ChartComponent.module.scss` | components | +4 / -4 |
| `src/components/InfoComponent/InfoComponent.module.scss` | components | +1 / -1 |
| `src/components/MultiSegmentBar/MultiSegmentBar.stories.tsx` | components | +10 / -10 |
| `src/components/NoData/NoData.module.scss` | components | +1 / -1 |
| `src/components/RailNav/SecondSideRailNav/SecondSideRailNav.module.scss` | components | +3 / -3 |
| `src/components/RichTextEditor/constants.tsx` | components | +1 / -1 |
| `src/components/SentimentScore/index.jsx` | components | +2 / -2 |
| `src/components/Table/index.scss` | components | +1 / -1 |
| `src/components/TableGrid/Documentation.md` | components | +2 / -2 |
| `src/components/TableGrid/index.scss` | components | +1 / -1 |
| `src/components/TableGrid/skills/elemental-table-migration/references/features.md` | components | +2 / -2 |
| `src/components/TableGrid/stories/ColumnCustomizerPanel.story.tsx` | components | +1 / -1 |
| `src/components/TableGrid/stories/NoDataAndLoader.story.tsx` | components | +2 / -2 |
| `src/components/TableGrid/stories/PersistedColumnConfig.story.tsx` | components | +1 / -1 |
| `src/components/TableGrid/stories/utils.tsx` | components | +1 / -1 |
| `src/components/TemplateBuilder/utils/constants.tsx` | components | +4 / -4 |
| `src/components/TextAreaCounterWrapper/TextAreaCounter.module.scss` | components | +2 / -2 |
| `src/components/WorkflowCanvas/WorkflowCanvas.stories.jsx` | components | +1 / -1 |
| `src/components/WorkflowCanvas/components/WorkflowCanvasExample.jsx` | components | +1 / -1 |
| `src/sass/_variables.scss` | sass | +1 / -1 |
| `src/sass/filterSelect.scss` | sass | +5 / -5 |
| `src/sass/js/fonts.js` | sass | +2 / -3 |
| `src/sass/layoutHelpers.scss` | sass | +20 / -20 |
| `src/sass/layoutHelpers/badgesStyle.scss` | sass | +1 / -1 |
| `src/sass/layoutHelpers/flexStyle.scss` | sass | +1 / -1 |
| `src/sass/layoutHelpers/fontStyle.scss` | sass | +10 / -10 |
| `src/sass/layoutHelpers/slickSlideStyle.scss` | sass | +2 / -2 |
| `src/sass/primitive/fontStyle/fontFamilyStyle.scss` | sass | +2 / -2 |
| `src/sass/primitive/fontStyle/fontWeightStyle.scss` | sass | +0 / -1 |
| `src/sass/reset.scss` | sass | +2 / -2 |
| `src/sass/tagsModal.scss` | sass | +3 / -3 |
| `src/sass/uiFoundations/_ds-typography.scss` | sass | +6 / -14 |
| `src/sass/uiFoundations/_index.scss` | sass | +1 / -1 |

## Verification

The following scans were used to verify the typography cleanup:

```sh
rg -n "Roboto|Poppins|poppins|font-roboto|ds-font-roboto|fwBold|ds-font-weight-bold|ds-font-weight-light" src --glob '!**/*.svg' --glob '!src/Docs/inter-typography-audit.md'
rg -n "font-weight: (700|bold)|fontWeight: ['\"]?(700|bold)|font-weight: 600|fontWeight: ['\"]?600" src --glob '!**/*.svg' --glob '!src/Docs/inter-typography-audit.md'
git diff --check
```

Expected result:

- The two `rg` commands should return no matches.
- `git diff --check` should pass without whitespace errors.

## Lint Status

`yarn lint` was run with Node `20.19.6`. The command still fails because the repo currently has pre-existing lint errors unrelated to this typography audit. At the time of the audit, ESLint reported 3225 total problems across the repo.

The typography-specific scans above passed after the audit.

## Notes

- `package.json`, `yarn.lock`, and `yarn-error.log` were already dirty before the typography work began.
- Future typography additions should use `Inter` with either `400` or `500` font weight unless the design system explicitly expands the approved font family or weight set.
