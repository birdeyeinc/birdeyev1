---
name: elemental-table-migration
description: 'Complete guide for migrating to and using the Elemental TableGrid component. Use when: working with Table components, converting data structures, implementing cell renderers, migrating from AG Grid or react-virtualized, configuring accordion/expandable rows, virtualization, infinite scroll, sorting, column resizing, column customizer, or debugging callback payloads.'
argument-hint: 'Describe the Table task: migration, new feature, debugging, or data structure question'
---

# TableGrid Component — Migration & Usage Guide

## When to Use

Load this skill when the task involves:

- Migrating any table to Elemental `TableGrid` or `VirtualizedStyleTableGrid`
- Converting data from flat arrays, AG Grid, or react-virtualized format
- Implementing or debugging cell renderers / header renderers
- Configuring accordion (expandable rows), virtualization, or infinite scroll
- Setting up column resizing, reorder, or the ColumnCustomizer drawer
- Configuring backend persistence for column config (built-in `persistence` prop or manual controlled mode)
- Understanding callback signatures (`onHandleRowClick`, `onColumnConfigChange`, `applyBulkConfig`, etc.)
- Adding metadata (className, style, data-*) to table elements
- Understanding TableGrid architecture changes (e.g. `TableGridRow` extraction, hover-state scope)
- Debugging sort, hover actions, or disabled row states

## Procedure

### Adding a New Table

1. Define `headerData` array with `{ order, value, label, enabled }` per column
2. Transform source data to `{ rowId, rowData: { [columnKey]: { value } } }` format
3. Create memoized cell renderers keyed by column value
4. Render `<TableGrid tableData={{ headerData, data }} cellRenderer={cellRenderer} />`
5. Add sorting, virtualization, or accordion as needed (see feature sections below)

### Migrating an Existing Table

1. Identify source format (AG Grid `columnDefs`, react-virtualized `Column`, flat array)
2. Map columns to `headerData` — see [Migration Guide](./references/migration.md)
3. Map row data to key-value `rowData` format
4. For react-virtualized, consider using `VirtualizedStyleTableGrid` for minimal changes
5. Wire up callbacks — see [Callbacks Reference](./references/callbacks.md)

### Adding Column Management (Resize / Customizer)

1. Wrap table in `<TableGridColumnProvider>` with config props
2. Add `<ColumnCustomizer>` inside the provider subtree
3. For backend persistence, prefer built-in `persistence` prop (uncontrolled mode) — or use controlled mode + `onColumnConfigChange` for manual persistence
4. See [Column Management section](./references/props-reference.md)

### Adding Backend Persistence

1. Choose approach: built-in `persistence` prop (recommended) or manual controlled mode
2. For built-in persistence: pass `tableId` on the `TableGrid` component plus `persistence={{ fetcher }}` or `persistence={{ apiResource, graphqlEndpoint }}` on `TableGridColumnProvider`
3. Provider auto-fetches saved config on mount, auto-saves on changes (debounced for resize, immediate for others)
4. Combine with `onColumnConfigChange` if you also need local state awareness
5. See [Props Reference — Built-in Persistence](./references/props-reference.md) and [Examples](./references/examples.md)

---

## Overview

```jsx
import TableGrid from '@birdeye/elemental/core/components/TableGrid';
import VirtualizedStyleTableGrid from '@birdeye/elemental/core/components/TableGrid/VirtualizedStyleTable';
```

Features: sorting (client/server), virtualization, infinite scroll, accordion rows, metadata system, row hover actions, fixed columns, custom cell renderers, column resize/reorder/customizer, built-in backend persistence.

---

## Data Structure

### tableData Shape

```typescript
interface TableGridData {
  headerData: HeaderData[];    // Column definitions (REQUIRED)
  data: (LegacyRow | NormalizedRow)[];             // Row data (REQUIRED)
  totalCount?: number;         // Total count for pagination info
}
```

### Key-Value rowData (Recommended)

```javascript
const tableData = {
  headerData: [
    { order: 0, value: "name", label: "Name", enabled: true, sortable: true },
    { order: 1, value: "status", label: "Status", enabled: true }
  ],
  data: [
    {
      rowId: "row-1",                       // Always provide: unique identifier. Technically optional (falls back to `row-${index}`), but accordion expand/collapse and disabledStateForRow silently break without it.
      rowData: {
        name: { value: "Acme Corp" },       // key matches header.value
        status: { value: "Active" }
      },
      businessId: 12345                     // custom props spread to renderers
    }
  ]
};
```

### Cell Object

```typescript
interface CellData {
  value?: any;                 // Cell display value (optional in TS, but usually provided)
  metadata?: Record<string, any>;   // Custom <td> attributes
  onCellClick?: (args: CellClickPayload) => boolean | void;  // Per-cell click handler
  needIsHoverProp?: boolean;   // Opt-in hover tracking (requires disablePerfOptimization)
  [customKey: string]: any;    // Custom props (e.g. id, subName) spread to renderers
}
```

### Legacy Array Format

Array-based `rowData` is supported for backward compatibility. Order must match `headerData` order. Internally normalized to key-value.

---

## Header Data Configuration

```typescript
interface HeaderData {
  value: string;              // REQUIRED: column key (matches rowData keys)
  label: string;              // REQUIRED: display label
  order?: number;             // Display order (defaults to 0 via `a.order ?? 0`)
  enabled?: boolean;          // Column visibility (defaults to true via `col.enabled !== false`)
  sortable?: boolean;         // Enable sorting (default: false via `sortable = false` destructuring)
  fixed?: boolean;            // Applies fixed-width CSS class to column
  locked?: boolean;           // NOT consumed by runtime code. For column locking,
                              //   use `lockedColumns` in TableGridColumnProvider config instead.
  copyToClipboard?: boolean;  // Metadata flag (passed through to renderers, no built-in UI)
  width?: string | number;    // Column width
  minWidth?: string | number;
  maxWidth?: string | number;
  enabledFluidWidth?: boolean; // Column-level override for fluid width behavior when resize is enabled
  metadata?: Record<string, any>;  // <th> element attributes
  onHeaderClick?: (args: { event: React.MouseEvent; headerData: HeaderData; index: number; sortColumn: string; sortOrder: number }) => boolean | void;
  onCellClick?: (args: CellClickPayload) => boolean | void;
  needIsHoverProp?: boolean;  // Column-level hover opt-in
}
```

> **Only `value` and `label` are strictly required.** `order` defaults to `0` at runtime. `enabled` defaults to `true` (checked as `col.enabled !== false`). When using `TableGridColumnProvider`, `enabled` is overridden by `columnVisibility` from context. To lock columns, pass `lockedColumns` array in `initialColumnConfig` or `columnConfig` — the `locked` field on HeaderData is a type-only artifact not read by any component. `enabledFluidWidth` only applies when resize mode is enabled and no explicit resized width has been committed for that column, and it overrides the table-level default when provided.

---

## Props Reference

### Core Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tableData` | `object` | ✅ | Contains `headerData` and `data` |
| `cellRenderer` | `object` | No | Custom cell renderers keyed by column |
| `headerCellRenderer` | `object` | No | Custom header renderers keyed by column |
| `onHandleRowClick` | `function` | No | Row click callback |
| `onHandleSingleCellClick` | `function` | No | Cell click callback |
| `onHandleHeaderSortClick` | `function` | No | Sort click callback |

### Display & Layout

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tableContainerClass` | `string` | `""` | Container class |
| `tableContainerRef` | `ref` | - | Container ref (forwarded to internal container div; virtualization auto-detects scroll parent from `<tbody>` upward) |
| `isFirstColumnFixed` | `boolean` | `false` | Sticky first column on horizontal scroll |
| `isHeaderFixed` | `boolean` | `false` | Sticky header on vertical scroll |
| `height` / `width` | `number` | - | Fixed dimensions in px |
| `viewPortColumns` | `number` | `0` | Auto-calculate column width so exactly N columns fill the viewport. **Mutually exclusive with fluid width scaling** — if set, `scaleFactor` / `enabledFluidWidth` are ignored. |
| `scaleFactor` | `number` | - | Multiplies base widths for columns with `enabledFluidWidth` when resize is enabled. Has no effect when `viewPortColumns` is set. |
| `enableFluidWidthByDefault` | `boolean` | `false` | Enables fluid width scaling for all columns by default when resize is enabled. Has no effect when `viewPortColumns` is set. |

### Width Configuration

| Prop | Type | Description |
|------|------|-------------|
| `customHeadersMaxWidth` | `object` | `{ columnKey: "200px" }` per column |
| `customHeadersFixWidth` | `object` | `{ columnKey: "150px" }` per column |
| `customHeadersMinWidth` | `object` | `{ columnKey: "100px" }` per column |
| `customRowWidth` | `object` | `{ customRowMaxWidth, customRowFixWidth, customRowMinWidth }` |

`customRowWidth.customRowMaxWidth.rowHoverActionWidth` sets fixed width for the sticky hover-actions column.

### Feature Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sort` | `object` | - | `{ sortby, sortOrder: 0\|1 }` |
| `enableClientSideSort` | `boolean` | `false` | Built-in client-side sorting |
| `sortComparator` | `function` | - | Custom sort comparator |
| `virtualization` | `object` | - | `{ enabled, rowHeight?, overscan, switchThreshold, useWindow? }` |
| `infiniteScrollProps` | `object` | - | `{ enable, hasMore, loadMore, threshold, useWindow }` |
| `accordionConfig` | `object` | - | `{ enabled, subRowLimit, maxExpandedRows, onExpand }` |
| `rowHoverAction` | `object` | - | `{ enable, customJSX, actionBoxConfigs }` |
| `metadataConfig` | `object` | - | Global metadata for table elements |
| `disablePerfOptimization` | `boolean` | `false` | Enables hover state tracking |
| `receiveNormalizedDataStructure` | `boolean` | `false` | Normalized data in callbacks |
| `disabledStateForRow` | `object` | `{}` | Disabled state per row ID |

> Full prop details, callback signatures, and TypeScript interfaces: [Props Reference](./references/props-reference.md) · [Callbacks Reference](./references/callbacks.md)

> Architecture caveats and behavior notes: [Caveats](./references/caveats.md)

---

## Column Management APIs

### TableGridColumnProvider

Wrap `<Table>` in `<TableGridColumnProvider>` to enable resize, reorder, and visibility toggle.

```jsx
import TableGrid from '@birdeye/elemental/core/components/TableGrid';
import { TableGridColumnProvider, COLUMN_CHANGE_TYPES } from '@birdeye/elemental/core/components/TableGrid/context';
import ColumnCustomizer from '@birdeye/elemental/core/components/TableGrid/ColumnCustomizer';

<TableGridColumnProvider
  initialColumnConfig={{ lockedColumns: ['name'] }}
  resizeMode="onEnd"
  minColumnWidth={80}
  maxColumnWidth={500}
>
  <ColumnCustomizer isOpen={isOpen} onClose={() => setIsOpen(false)} />
  <Table tableData={tableData} />
</TableGridColumnProvider>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columnConfig` | `object` | - | Controlled mode config |
| `onColumnConfigChange` | `function` | - | Change callback (`{ type, columnKey, config }`) |
| `initialColumnConfig` | `object` | `{}` | Uncontrolled mode initial state |
| `minColumnWidth` | `number` | `50` | Lower bound for resize/auto-fit |
| `maxColumnWidth` | `number` | `800` | Upper bound for resize/auto-fit |
| `enableResize` | `boolean` | `true` | Drag resize + double-click auto-fit |
| `resizeMode` | `'onChange' \| 'onEnd'` | `'onEnd'` | Resize commit strategy |
| `enableReorder` | `boolean` | `true` | Drag-drop column reorder |
| `enableVisibilityToggle` | `boolean` | `true` | Show/hide in customizer |
| `persistence` | `PersistenceConfig` | `undefined` | Backend persistence config (uncontrolled mode only) |

**Change types:** `'resize' | 'reorder' | 'visibility' | 'bulk' | 'reset' | 'init'`

### Built-in Backend Persistence

Pass `persistence` to `TableGridColumnProvider` and `tableId` on the `Table` component to enable auto-save/load of column config:

```jsx
// Option 1: Generic fetcher
<TableGridColumnProvider
  persistence={{ fetcher: myGraphQLFetcher }}
>
  <Table tableId="my-table" tableData={data} />
</TableGridColumnProvider>

// Option 2: Birdeye apiResource
import { beNodeResource } from 'utils/apiHelper';
<TableGridColumnProvider
  persistence={{
    apiResource: beNodeResource,
    graphqlEndpoint: '/uiPreferencesApi/graphql',
  }}
>
  <Table tableId="my-table" tableData={data} />
</TableGridColumnProvider>
```

Behavior: fetches on mount, reconciles against headerData, auto-saves (debounced 2.5s for resize, immediate for others), retries 3x with exponential backoff. Disabled in controlled mode.

**Control what gets saved** with `persistence.persistKeys` (allowlist of `'columnWidths' | 'columnVisibility' | 'columnOrder' | 'lockedColumns'`). Default: `['columnVisibility', 'columnOrder', 'lockedColumns']` — widths are **not** saved by default. Pass `['columnWidths', 'columnVisibility', 'columnOrder', 'lockedColumns']` to also persist resize. Keys outside the list are stripped on both save and fetch; resize debounced save is skipped entirely when `'columnWidths'` is excluded.

### ColumnCustomizer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Drawer visibility |
| `onClose` | `function` | - | Close handler |
| `onSave` | `function` | - | Save callback |
| `applyMode` | `'onChange' \| 'onSave'` | `'onChange'` | Immediate vs buffered draft |
| `title` | `string` | `"Customize table view"` | Header title |
| `showSearch` | `boolean` | `true` | Search input |
| `showResetButton` | `boolean` | `true` | Reset action |
| `onColumnChange` | `function` | - | UI-level change callback |

- **`onChange` mode:** toggle/reorder/reset writes directly to provider state.
- **`onSave` mode:** interactions buffered in draft state; committed only on Save click.

### Resize Behavior

- `resizeMode="onEnd"`: transient DOM width during drag, single commit on mouseup (recommended for heavy tables).
- `resizeMode="onChange"`: continuous state updates during drag.
- Double-click: auto-fits to header content width (body measurement disabled).
- Width precedence: `columnWidths[key]` > scaled base width for `enabledFluidWidth` columns > `headerData.width` > `customHeadersFixWidth`.
- `enableFluidWidthByDefault` enables fluid scaling for all columns unless a column overrides it.
- `headerData.enabledFluidWidth` overrides the table-level default for that specific column.
- Fluid scaling only runs while resize mode is enabled.
- Fluid scaling is bypassed after a manual resize commits `columnWidths[key]`.
- **`viewPortColumns` and fluid width scaling are mutually exclusive.** When `viewPortColumns` is provided, viewport-computed widths take precedence and all fluid scaling is skipped. Do not pass both `viewPortColumns` and `scaleFactor`/`enabledFluidWidth` together.

> Full column management details, controlled vs uncontrolled patterns, callback semantics: [Props Reference](./references/props-reference.md)

---

## Cell Renderers (Summary)

Renderers are keyed by column `value`. Support both component types and pre-created JSX elements.

```jsx
const cellRenderer = {
  name: memo(({ rowData }) => <strong>{rowData?.value}</strong>),
  status: StatusBadge,  // component reference
};
```

Key renderer props: `rowData`, `headerData`, `headerKey`, `rowId`, `rowIndex`, `cellIndex`, `_rowType`, `_isExpanded`, `_isExpandable`, `_childrenCount`.

Pre-created JSX: static by default. Add `injectRendererProps` to opt-in to runtime prop injection via `cloneElement`.

> Full renderer contract, props, and examples: [Cell Renderers Reference](./references/cell-renderers.md)

---

## Features (Summary)

### Accordion

```javascript
accordionConfig: { enabled: true, subRowLimit: 5, maxExpandedRows: 2, onExpand, onLoadMoreSubRows }
```
Data rows need `children: [{ rowId, rowData }]` and optional `expandedRowData`.

### Virtualization

```javascript
virtualization: { enabled: true, rowHeight: 50, overscan: 5, switchThreshold: 20, useWindow: false }
```
Scroll container **must** have fixed height (hook auto-detects scrollable parent from `<tbody>` upward). `rowHeight` is optional (auto-measured from first row if omitted). **Disabled when accordion is enabled.** Set `useWindow: true` for window-based scrolling.

### Infinite Scroll

```javascript
infiniteScrollProps: { enable: true, hasMore, loadMore, threshold: 250, useWindow: false }
```
Combine `useWindow` with virtualization's `useWindow` for window-based scrolling.

### Sorting

Server-side (default): `onHandleHeaderSortClick` receives `{ sortby, sortOrder: 0|1 }`.
Client-side: set `enableClientSideSort={true}`, optionally provide `sortComparator`.

Sort toggle behavior (verified from `handleHeaderSortClick` in `index.tsx`):
- Clicking the **same column**: toggles `sortOrder` between `0` (asc) and `1` (desc)
- Clicking a **new column**: resets `sortOrder` to `0` (asc) and sets new `sortby`

### Row Hover Actions

```javascript
rowHoverAction: { enable: true, customJSX: (row) => <Button />, actionBoxConfigs: [...] }
```

### Metadata System

Global config (`metadataConfig`) + inline per-row/cell `metadata`. Classes concatenate, styles shallow-merge.

> Full configuration, data structures, and examples: [Features Reference](./references/features.md)

---

## Quick Reference Card

```
┌──────────────────────────────────────────────────────────────────────┐
│ DATA: { headerData: [{ value, label, order?, enabled? }],            │
│         data: [{ rowId?, rowData: { [key]: { value } } }] }         │
├──────────────────────────────────────────────────────────────────────┤
│ RENDERER PROPS: { rowData (=cell data), headerData, headerKey,      │
│   rowId, rowIndex, cellIndex, _rowType, _isExpanded,                │
│   _isExpandable, _childrenCount, ...restRowProps }                  │
├──────────────────────────────────────────────────────────────────────┤
│ METADATA: { table, tableContainer, tableWrapper,                    │
│   tr: {}, th: { '*': {}, key: {} }, td: { '*': {}, key: {} } }     │
├──────────────────────────────────────────────────────────────────────┤
│ ACCORDION: { rowId, rowData, children: [...], expandedRowData? }    │
├──────────────────────────────────────────────────────────────────────┤
│ VISIBILITY: Sparse storage — only hidden columns stored (false).    │
│   Missing key = visible. Check: columnVisibility[key] !== false     │
├──────────────────────────────────────────────────────────────────────┤
│ DEFAULTS (from defaultProps):                                       │
│   virtualization: { rowHeight=null (auto), overscan=5,              │
│     switchThreshold=20 }                                           │
│   accordionConfig.maxExpandedRows=0, sortDebounceWaitTime=200       │
│   resizeMode='onEnd', minColumnWidth=50, maxColumnWidth=800         │
│ SORT: same column toggles 0↔1, new column always starts at 0       │
│ viewPortColumns: Math.floor(containerWidth / viewPortColumns)       │
│   per column, applied as minWidth (or width when resize enabled)    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Columns not showing | `enabled` defaults to `true` — check if explicitly set to `false`, or if `TableGridColumnProvider` visibility is hiding it |
| Sort not working | Ensure `sortable: true` on header; note sort is debounced (200ms default) |
| Virtualization not rendering | Scroll container needs fixed height; hook auto-detects scrollable parent from `<tbody>` upward |
| Legacy data not rendering | Array order must match headerData order |
| Cell click not firing | Check if accordion icon is intercepting |
| Hover actions not showing | Verify `rowHoverAction.enable: true` |
| Metadata not applying | Check merge order: global → column → inline |
| Virtualization disabled | Accordion auto-disables virtualization |
| Persistence not saving | Ensure `persistence` prop is set and table is in uncontrolled mode (no `columnConfig` prop) |
| Persistence not loading | Check `tableId` is set on the `Table` component, fetcher/apiResource is correct, and GraphQL endpoint is reachable |

---

## Reference Files

Load these for detailed information on specific topics:

- [Props Reference](./references/props-reference.md) — Full props tables, column management details, width precedence, controlled vs uncontrolled
- [Cell Renderers](./references/cell-renderers.md) — Renderer contract, props interface, examples, header renderers
- [Callbacks](./references/callbacks.md) — All callback TypeScript signatures, argument structures, return values
- [Features](./references/features.md) — Accordion, virtualization, infinite scroll, sorting, metadata, row hover actions
- [Migration](./references/migration.md) — AG Grid migration, react-virtualized, VirtualizedStyleTable API, data transformation
- [Examples](./references/examples.md) — Complete working code: basic table, full-featured, column customizer with persistence
- [Caveats](./references/caveats.md) — Implementation-verified caveats and performance optimization tips
