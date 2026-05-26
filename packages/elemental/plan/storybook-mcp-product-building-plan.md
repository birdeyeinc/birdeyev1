# Storybook MCP Product-Building Plan

## Goal

Make the Elemental Storybook and UI-web-2.0 product patterns available through MCP so product-building agents can discover approved components, read usage guidance, retrieve examples, and generate UI using the design system instead of guessing.

The MCP should expose Storybook as structured, searchable component knowledge and UI-web-2.0 as structured, searchable composition knowledge. It should not rely on dumping either codebase as unstructured files.

Important Storybook MCP direction:

- Prefer Storybook's official MCP support through `@storybook/addon-mcp` for Storybook component/documentation access.
- Use custom MCP/indexing for product-pattern knowledge from UI-web-2.0 and MFEs.
- Use a cross-linking layer to connect official Storybook documentation results to custom product-pattern results.
- Current repo uses Storybook `7.6.7`; official MCP documentation is for newer Storybook AI/MCP support, so the Storybook upgrade/addon compatibility step must happen before implementation.

Source-of-truth split:

- Elemental Storybook: component API, variants, examples, tokens, design-system rules.
- UI-web-2.0: proven product layouts, workflows, page compositions, and real Elemental usage.

Architecture diagram and repo connector contract: `plan/storybook-mcp-architecture.md`.

## Outcomes

- Agents can search Elemental components by intent, category, and capability.
- Agents can retrieve component docs, props, examples, stories, and source paths.
- Agents can ask which component to use for a product workflow.
- Agents can find UI-web-2.0 screens that already implement similar product patterns.
- Agents can map product patterns back to the Elemental components and Storybook stories they rely on.
- Agents can generate React examples using approved Elemental components.
- The MCP index can be regenerated periodically from Storybook and UI-web-2.0.

## Phase 1: Enable Official Storybook MCP

Use Storybook's official MCP server for the Elemental Storybook side instead of building a parallel Storybook MCP from scratch.

Target setup:

```sh
npx storybook add @storybook/addon-mcp
yarn story
npx mcp-add --type http --url "http://localhost:3000/mcp" --scope project
```

The documented default Storybook MCP endpoint is `/mcp` on the running Storybook dev server. This repo runs Storybook on port `3000`, so the expected local endpoint is:

```text
http://localhost:3000/mcp
```

Official Storybook MCP tools to rely on:

- `list-all-documentation`
- `get-documentation`
- `get-documentation-for-story`
- `get-storybook-story-instructions`
- `preview-stories`
- `run-story-tests` when Storybook Test is configured

Agent instruction baseline:

```text
When working on UI, query Storybook MCP documentation before using Elemental components. Do not invent component props. Use only props documented by Storybook MCP or shown in stories.
```

Compatibility tasks:

- Confirm the minimum Storybook version required by `@storybook/addon-mcp`.
- Upgrade Storybook if `7.6.7` is not supported.
- Confirm Storybook manifests are generated for the React Storybook.
- Confirm `/mcp` lists available tools when Storybook is running.
- Confirm the agent can call `list-all-documentation`.

## Phase 2: Optional Storybook Metadata Index

Only build a local Storybook metadata index if official Storybook MCP responses need extra repo-local linking data.

Optional scanner inputs:

- `src/**/*.stories.@(js|jsx|ts|tsx|mdx)`
- `src/**/*.story.@(js|jsx|ts|tsx|mdx)`
- `src/Docs/**/*.mdx`
- component documentation files such as `Documentation.md`

Extract:

- Story title and sidebar path.
- Story export names.
- Component source path.
- Repo-local source ownership.
- Tags such as atom, component, pattern, design-system, table, form, navigation, data-viz.

Initial output:

```text
mcp-index/storybook/local-story-map.json
mcp-index/storybook/component-source-map.json
```

This should not duplicate official Storybook MCP docs, props, examples, or story content unless a specific gap is found.

## Phase 3: Inventory UI-web-2.0 Patterns

Create a second scanner that reads UI-web-2.0 as product-pattern input.

Scan for:

- imports from `@birdeye/elemental`
- imports from Elemental local build paths if present
- common app-level component usage under `src/app/components`
- containers, pages, and route-level screens
- layout wrappers such as L2/L3 navigation, side rails, drawers, modals, tables, filters, dashboards, and settings pages

Extract:

- pattern name
- source files
- Elemental components used
- local UI-web components used
- layout shape
- workflow type
- product domain
- notable states such as loading, empty, error, disabled, edit, create, delete, bulk action
- links back to matching Elemental Storybook records

Initial output:

```text
mcp-index/ui-web/patterns.json
mcp-index/ui-web/screens.json
mcp-index/ui-web/elemental-usage.json
mcp-index/ui-web/search.json
```

## Phase 4: Normalize Component Records

Build a stable schema for Storybook component references. The canonical component documentation should come from official Storybook MCP; this record links product-pattern usage back to those docs.

```json
{
  "id": "atoms/button",
  "name": "Button",
  "category": "Atom",
  "storybookTitle": "Atom/Button",
  "sourcePath": "src/atoms/Button",
  "storybookMcpLookup": {
    "documentationName": "Button",
    "storybookTitle": "Atom/Button"
  },
  "relatedComponents": [],
  "keywords": ["button", "cta", "action", "submit"]
}
```

Prioritize high-value metadata not already served by official Storybook MCP:

- common use cases
- do/don't guidance
- product workflow fit
- related product patterns
- legacy wrapper mappings
- Storybook documentation lookup keys

## Phase 5: Normalize UI-web Pattern Records

Build a stable schema for product composition:

```json
{
  "id": "ui-web/filterable-table-with-actions",
  "name": "Filterable table with actions",
  "workflow": "filterable-table",
  "sourceFiles": [
    "src/app/components/ExampleView.tsx"
  ],
  "elementalComponents": [
    "TableGrid",
    "SearchFilter",
    "SingleSelect",
    "TimePeriod",
    "Button"
  ],
  "storybookStories": [
    "Component/TableGrid",
    "Atom/SearchFilter",
    "Atom/SingleSelect",
    "Atom/TimePeriod",
    "Atom/Button"
  ],
  "layoutPattern": "L2 page with filters, table, row actions, and bulk actions",
  "usageGuidance": [],
  "states": ["loading", "empty", "row-action", "bulk-action"],
  "keywords": ["table", "filters", "actions", "list page"]
}
```

Prioritize patterns that help agents build product screens:

- filterable tables
- dashboard overview pages
- settings forms
- left-nav and L2/L3 pages
- side-drawer create/edit flows
- modal confirmation flows
- review management screens
- agent monitor screens
- media picker and upload flows

## Phase 6: Cross-Link Storybook And UI-web

Create a mapping layer that joins product intent to UI-web patterns and official Storybook MCP documentation lookups.

Core relationship:

```text
Product intent -> UI-web product pattern -> Elemental components -> Storybook MCP docs/examples
```

Generated mapping output:

```text
mcp-index/product-intents.json
mcp-index/elemental-to-ui-web.json
mcp-index/ui-web-to-storybook-mcp.json
```

Examples:

- `filterable table` maps to UI-web table screens, then to `TableGrid`, `SearchFilter`, `SingleSelect`, `TimePeriod`, and `Button`.
- `create/edit drawer` maps to side drawer flows, then to `SideDrawer`, `FormInput`, `SingleSelect`, `Button`, and validation examples.
- `dashboard metrics` maps to dashboard screens, then to `DashboardCommonBlock`, charts, table summaries, and empty states.

## Phase 7: Add Product Pattern MCP Server

Create a custom local MCP server for product patterns. Do not reimplement Storybook's official MCP tools unless required by a proven gap.

Resources:

- `uiweb://patterns`
- `uiweb://patterns/{patternId}`
- `uiweb://screens/{screenId}`
- `uiweb://elemental-usage/{componentName}`
- `mfe://patterns/{repoId}/{patternId}`
- `product://intents`
- `product://intents/{intentId}`

Tools:

- `recommend_components(productIntent)`
- `search_product_patterns(query)`
- `get_product_pattern(patternNameOrId)`
- `find_elemental_usage(componentName)`
- `recommend_pattern(productIntent)`
- `compose_product_guidance(productIntent)`

The product-pattern MCP response should return compact, structured output with source paths and Storybook MCP lookup keys. Agents should call official Storybook MCP for detailed component props, examples, and stories.

## Phase 8: Product-Building Guidance Layer

Add curated guidance for common product workflows:

- forms and validation
- filters and search
- tables and data grids
- dashboards and metric blocks
- navigation and side rails
- modals, drawers, and popovers
- empty, loading, and error states
- rich text and template editing
- media selection and upload

Each workflow should map to approved components, Storybook examples, and UI-web pattern references.

Example:

```json
{
  "workflow": "filterable table",
  "recommendedComponents": [
    "components/TableGrid",
    "atoms/SearchFilter",
    "atoms/SingleSelect",
    "atoms/TimePeriod"
  ],
  "storybookStories": [
    "Component/TableGrid",
    "Atom/SearchFilter",
    "Atom/SingleSelect",
    "Atom/TimePeriod"
  ],
  "uiWebPatterns": [
    "ui-web/filterable-table-with-actions"
  ]
}
```

## Phase 9: Screenshots And Visual Context

Use official Storybook MCP `preview-stories` for Storybook previews where supported. Use Playwright screenshots only for gaps, product-pattern screenshots, or agents that cannot render MCP previews.

Storybook captures:

- default story
- major variants
- error/loading/empty states
- responsive viewports for complex components

UI-web captures:

- high-value product patterns
- layout-level examples
- drawer/modal/table/dashboard states where available

Store screenshots under:

```text
mcp-index/storybook/screenshots/
mcp-index/ui-web/screenshots/
```

Reference screenshots from component and pattern records. Keep screenshots optional so text-only MCP clients still work.

## Phase 10: Periodic Refresh

Add package scripts:

```json
{
  "storybook:mcp:dev": "storybook dev -p 3000",
  "storybook:mcp:check": "node scripts/check-storybook-mcp.js",
  "uiweb:mcp:index": "node scripts/build-uiweb-pattern-mcp-index.js",
  "product:mcp:index": "node scripts/build-product-pattern-mcp-index.js",
  "mcp:index": "yarn product:mcp:index",
  "mcp:refresh": "yarn build-story && yarn storybook:mcp:check && yarn mcp:index"
}
```

Refresh cadence:

- after every Elemental release
- after major UI-web-2.0 product-pattern changes
- before product-building sessions
- nightly or on merge to main in CI

## Phase 11: Verification

Minimum checks:

```sh
yarn build-story
yarn story
yarn storybook:mcp:check
yarn product:mcp:index
```

Validate:

- Storybook `/mcp` is available on the running Storybook port
- `list-all-documentation` returns Elemental docs
- `get-documentation` returns component props/examples for high-value components
- every UI-web pattern references existing source files
- Elemental usage from UI-web maps to known Storybook MCP documentation lookup keys where possible
- search returns relevant results for common queries
- product-pattern MCP resources load without missing-file errors

## Implementation Order

1. Validate Storybook MCP compatibility for this repo's Storybook version.
2. Add or upgrade to `@storybook/addon-mcp`.
3. Run Storybook and confirm `http://localhost:3000/mcp`.
4. Configure the agent with the Storybook MCP endpoint.
5. Build the UI-web-2.0/product-pattern scanner and JSON index.
6. Add component normalization and keyword tagging for product usage.
7. Add UI-web/MFE pattern normalization and workflow tagging.
8. Add cross-links between product intent, product patterns, and Storybook MCP lookup keys.
9. Add product-pattern MCP resources/tools.
10. Add curated product workflow guidance.
11. Add screenshots only for product-pattern gaps or non-previewable states.
12. Add refresh scripts and CI/manual verification.

## First Slice

Start by verifying official Storybook MCP docs for these areas:

- Button
- FormInput
- SingleSelect
- SearchFilter
- TimePeriod
- TableGrid
- Modal
- SideDrawer
- RailNav
- DashboardCommonBlock

This first slice is enough for agents to build common product screens while the rest of Storybook coverage is added incrementally.

Also index the first UI-web-2.0 pattern slice:

- filterable table/list page
- dashboard overview page
- settings form page
- side-drawer create/edit flow
- confirmation modal flow
- L2/L3 navigation page

This connects the initial Elemental component set to real product compositions.

## Current Scan Status

This plan has not yet completed a full product/feature scan. The current scan is only a lightweight repo discovery pass.

Confirmed local repos:

- `elemental`
- `UI-web-2.0`
- `content-hub-app`
- `micro-dashboard-shell`
- `micro-dashboard-utils`

Initial findings:

- UI-web-2.0 has product areas under `src/app/pages`, including insights, home, payments, appointments, messengerV2, listings, contacts, qrcodes, campaignsAI, setup, and workflows.
- UI-web-2.0 has many shared product components under `src/app/components`, including table, filter, form, modal, drawer, navigation, no-data, upload, and Phoenix wrapper areas.
- A quick import scan found 327 UI-web-2.0 files referencing `@birdeye/elemental` or `elemental/core`.
- A quick import scan found 86 files across `content-hub-app`, `micro-dashboard-shell`, and `micro-dashboard-utils` referencing `@birdeye/elemental` or `elemental/core`.

The full scanner still needs to classify all products/features, group patterns automatically, and map them back to Storybook component records.
