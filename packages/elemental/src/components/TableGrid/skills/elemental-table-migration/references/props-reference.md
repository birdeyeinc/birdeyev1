# Props Reference — Elemental TableGrid

## Core Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tableData` | `object` | ✅ Yes | - | Contains `headerData` and `data` |
| `cellRenderer` | `object` | No | - | Custom cell renderers keyed by column |
| `headerCellRenderer` | `object` | No | - | Custom header renderers keyed by column |
| `onHandleRowClick` | `function` | No | noop | Row click callback |
| `onHandleSingleCellClick` | `function` | No | noop | Cell click callback |
| `onHandleHeaderSortClick` | `function` | No | noop | Sort click callback |

## Display & Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tableContainerClass` | `string` | `""` | Container element class |
| `tableContainerRef` | `ref` | - | Forwarded to internal container div; virtualization auto-detects scroll parent from `<tbody>` upward — this ref is for consumer access, not required for virtualization |
| `data-testid` | `string` | `""` | Test ID prefix |
| `isFirstColumnFixed` | `boolean` | `false` | Enable horizontal scroll with sticky first column |
| `isHeaderFixed` | `boolean` | `false` | Sticky header on vertical scroll |
| `height` | `number` | - | Fixed table height in pixels |
| `width` | `number` | - | Fixed table width in pixels |
| `viewPortColumns` | `number` | `0` | Auto-calculate column width from viewport (see below) |

### `viewPortColumns` Behavior (Code-Verified)

When `viewPortColumns > 0`, the Table measures the container width (via `useLayoutEffect` + `useResizeDetector`) and calculates `Math.floor(containerWidth / viewPortColumns)` as a per-column width floor. This value is then applied as:
- **With resize enabled:** `width` on columns (since `table-layout: fixed` ignores `min-width`)
- **Without resize:** `min-width` on columns

The table won't render until the container width is measured (`isWidthReady` check). This prevents layout flash.

## Width Configuration Props

| Prop | Type | Description |
|------|------|-------------|
| `customHeadersMaxWidth` | `object` | `{ columnKey: "200px" }` - Max width per column |
| `customHeadersFixWidth` | `object` | `{ columnKey: "150px" }` - Fixed width per column |
| `customHeadersMinWidth` | `object` | `{ columnKey: "100px" }` - Min width per column |
| `customRowWidth` | `object` | `{ customRowMaxWidth, customRowFixWidth, customRowMinWidth }` |

`customRowWidth` also supports `customRowMaxWidth.rowHoverActionWidth` to set fixed width for the sticky row-hover-actions column.

## Loading & Empty States

| Prop | Type | Description |
|------|------|-------------|
| `loaderProps` | `object` | `{ isLoading, type, isReseller, loaderClassName, customJsx }` |
| `noDataProps` | `object` | `{ title, subtitle, noDataClassName, noResultsImageSrc, customJsx }` |

**`loaderProps.customJsx`** — Optional React component (no props required). When provided and `isLoading` is `true`, renders this component instead of the default `LoaderBox`. The wrapper div with `loaderClassName` is still applied.

**`noDataProps.customJsx`** — Optional React component (no props required). When provided and data is empty (not loading), renders this component instead of the default `NoDataSimple`. Overrides `title`, `subtitle`, `noDataClassName`, and `noResultsImageSrc`.

## Feature Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sort` | `object` | - | `{ sortby: "column", sortOrder: 0 }` (0=asc, 1=desc) |
| `sortDebounceWaitTime` | `number` | `200` | Debounce time for sort clicks |
| `enableClientSideSort` | `boolean` | `false` | Enable built-in client-side sorting |
| `sortComparator` | `function` | - | Custom sort comparator function |
| `virtualization` | `object` | See below | Virtual scrolling configuration |
| `infiniteScrollProps` | `object` | See below | Infinite scroll configuration |
| `accordionConfig` | `object` | See below | Accordion/expandable rows config |
| `rowHoverAction` | `object` | See below | Row hover action menu config |
| `metadataConfig` | `object` | - | Global metadata for table elements |
| `disablePerfOptimization` | `boolean` | `false` | Enables hover state tracking; `isHovered` is passed only for cells opting-in via `needIsHoverProp` |
| `receiveNormalizedDataStructure` | `boolean` | `false` | Receive normalized data in callbacks |
| `disabledStateForRow` | `object` | `{}` | Object of disabled state per row ID |
| `disableRowHoverAction` | `function` | `() => false` | Function to disable hover actions per row |

`disablePerfOptimization` implementation note:
- Rows are rendered via a dedicated `TableGridRow` component.
- Hover state is local to `TableGridRow`, so hover updates do not require body-level hover state changes.
- `isHovered` is still passed only when `disablePerfOptimization=true` and `needIsHoverProp` resolves true for the cell/header.

---

## Column Management APIs (Provider + Customizer)

Column resizing, visibility, and reorder are managed by `TableGridColumnProvider` + `useTableGridColumns`.
`TableGrid` consumes this context when present; outside provider it falls back to no-op defaults.

```jsx
import TableGrid from '@birdeye/elemental/core/components/TableGrid';
import { TableGridColumnProvider, COLUMN_CHANGE_TYPES } from '@birdeye/elemental/core/components/TableGrid/context';
import ColumnCustomizer from '@birdeye/elemental/core/components/TableGrid/ColumnCustomizer';

<TableGridColumnProvider initialColumnConfig={{ lockedColumns: ['name'] }}>
  <ColumnCustomizer />
  <TableGrid tableData={tableData} />
</TableGridColumnProvider>
```

### TableGridColumnProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columnConfig` | `object` | `undefined` | Controlled mode config object |
| `onColumnConfigChange` | `function` | `undefined` | Called on resize/reorder/visibility/reset changes |
| `initialColumnConfig` | `object` | `{}` | Initial state for uncontrolled mode |
| `minColumnWidth` | `number` | `50` | Lower bound for resize and auto-fit |
| `maxColumnWidth` | `number` | `800` | Upper bound for resize and auto-fit |
| `enableResize` | `boolean` | `true` | Enables drag resize + double-click auto-fit |
| `resizeMode` | `'onChange' \| 'onEnd'` | `'onEnd'` | Resize commit strategy |
| `enableReorder` | `boolean` | `true` | Enables drag-drop column reorder |
| `enableVisibilityToggle` | `boolean` | `true` | Enables show/hide in customizer |
| `persistence` | `PersistenceConfig` | `undefined` | Backend persistence config — auto-save/load column config (uncontrolled mode only) |

### `columnConfig` / `initialColumnConfig` Shape

```typescript
interface ColumnConfig {
  columnWidths?: Record<string, number>;      // px numeric widths
  columnVisibility?: Record<string, boolean>; // Sparse: only hidden columns stored (false). Missing key = visible.
  columnOrder?: string[] | null;              // ordered column keys
  lockedColumns?: string[] | Set<string>;      // cannot hide/reorder
}
```

> **Sparse visibility storage:** `columnVisibility` only stores hidden columns (`false`). A missing key means the column is visible (default). The provider checks visibility via `columnVisibility[key] !== false`. This minimizes payload size for persistence.

### Resize Mode Semantics

- `onChange`: updates column config continuously during drag (more reactive, more callback traffic).
- `onEnd`: applies transient DOM width while dragging and commits a single state/callback update on mouseup (recommended for heavy tables).
- Double-click on resize handle auto-fits using measured header content width, then clamps to min/max (body-cell measurement is currently disabled in code).

### Width While Resizing (Exact Runtime Behavior)

- Width values are always clamped to resolved bounds before commit.
- In `onChange` mode, width is committed to context on every mouse move.
- In `onEnd` mode, drag width is applied as a transient DOM update during drag, then committed once on mouseup.
- If drag starts and ends at the same width, no resize commit event is emitted.
- Auto-fit (double-click) measures header content and commits one clamped width.

### Width/Bounds Precedence (Code-Verified)

1. Runtime resized width (`columnWidths[columnKey]`) — highest priority
2. `headerData.width` — initial width
3. Legacy fallback: `customHeadersFixWidth` and `customRowWidth.customRowFixWidth`
4. Per-column bounds: `headerData.minWidth` / `headerData.maxWidth`
5. Provider-level: `minColumnWidth` / `maxColumnWidth` (used if per-column absent)
6. If `maxWidth < minWidth`, max is coerced to min internally

### Controlled vs Uncontrolled Behavior

- **Controlled mode**: pass `columnConfig`; all mutations emitted through `onColumnConfigChange`; parent must update `columnConfig`.
- **Uncontrolled mode**: pass `initialColumnConfig`; provider manages reducer state internally.
- Uncontrolled callbacks are emitted **after reducer commit**, so payloads represent committed/latest config.

### Change Types

```typescript
type ColumnChangeType = 'resize' | 'reorder' | 'visibility' | 'bulk' | 'reset' | 'init';
```

### ColumnCustomizer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls drawer visibility |
| `onClose` | `function` | - | Required close handler |
| `onSave` | `function` | `undefined` | Save callback (always fired on Save button) |
| `title` | `string` | `"Customize table view"` | Header title |
| `subtitle` | `string` | `"Select the columns to show and order them by priority"` | Subtitle text |
| `drawerWidth` | `string` | `"auto"` | Drawer width style value |
| `showSearch` | `boolean` | `true` | Shows search input |
| `showResetButton` | `boolean` | `true` | Show reset action |
| `resetButtonText` | `string` | `"Restore defaults"` | Reset button label |
| `saveButtonText` | `string` | `"Save"` | Save button label |
| `applyMode` | `'onChange' \| 'onSave'` | `'onChange'` | Immediate apply vs buffered draft mode |
| `onColumnChange` | `function` | `undefined` | UI-level customizer change callback |

`ColumnCustomizer` can be rendered anywhere under the same `TableGridColumnProvider` subtree.

### ColumnCustomizer Apply Modes

- `onChange`: toggle/reorder/reset writes directly to provider state immediately.
- `onSave`: interactions are buffered in draft state; provider state updates only when Save is clicked.
- In `onSave` mode, closing the drawer without Save does not commit draft changes.

```jsx
// Immediate mode
<ColumnCustomizer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  applyMode="onChange"
/>

// Buffered draft mode
<ColumnCustomizer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  applyMode="onSave"
  onSave={({ visibility, order }) => persistConfig({ visibility, order })}
/>
```

### ColumnCustomizer Callback Semantics

- `onColumnChange` (onChange mode): emits UI actions — `reorder`, `visibility`, `visibility-all`, `reset`, `save`.
- `onColumnChange` (onSave mode): emits only `save` (draft interactions are local until save).
- `onSave` payload:
  - `onSave` mode: `{ visibility: draftVisibility, order: draftOrder }`
  - `onChange` mode: `{ visibility: ctxVisibility, order: ctxOrder }`

### Built-in Backend Persistence (`persistence` prop)

Pass `persistence` to `TableGridColumnProvider` to enable auto-save/load. Uncontrolled mode only (ignored when `columnConfig` is provided).

```typescript
type PersistableColumnKey = 'columnWidths' | 'columnVisibility' | 'columnOrder' | 'lockedColumns';

interface PersistenceConfig {
  fetcher?: GraphQLFetcher;     // Option 1: Generic GraphQL fetcher
  apiResource?: {               // Option 2: Birdeye apiResource (e.g., beNodeResource)
    post: (path: string, data: unknown, config?: Record<string, unknown>) => Promise<{ data: unknown }>;
  };
  graphqlEndpoint?: string;     // Required when using apiResource
  onError?: (error: Error) => void;  // Called when save fails after all retries
  onLoadingChange?: (isLoading: boolean) => void; // Called when initial preferences fetch loading state changes
  persistKeys?: PersistableColumnKey[]; // Allowlist of keys to persist. Default: ['columnVisibility', 'columnOrder', 'lockedColumns'] (widths NOT saved by default)
}

type GraphQLFetcher = (params: {
  query: string;
  variables: Record<string, unknown>;
}) => Promise<Record<string, unknown>>;
```

**`onLoadingChange`** — fires whenever the initial preferences fetch loading state transitions (`true` → fetching, `false` → done). Use this to drive a page-level skeleton or loading indicator that needs to reflect whether the preferences fetch is in flight.

```jsx
const [prefsLoading, setPrefsLoading] = useState(false);

<TableGridColumnProvider
  persistence={{
    fetcher: myGraphQLFetcher,
    onLoadingChange: (isLoading) => setPrefsLoading(isLoading),
  }}
>
  {prefsLoading ? <Skeleton /> : <Table tableId="my-table" tableData={data} />}
</TableGridColumnProvider>
```

**`persistKeys`** — controls which `ColumnConfig` keys are sent to backend. Default skips `columnWidths`. Pass `['columnWidths', 'columnVisibility', 'columnOrder', 'lockedColumns']` to also persist resize, or omit any key to skip it. Filter applies on both save and fetch. When `'columnWidths'` is excluded, the debounced auto-save on resize is skipped entirely.

```jsx
// Option 1: Generic fetcher
<TableGridColumnProvider
  initialColumnConfig={{ lockedColumns: ['name'] }}
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

**Behavior:**
- `tableId` is a flat-level prop on the `Table` component — it is passed through context to the persistence hook
- Fetches saved config on mount and whenever `tableId` changes via `GetPreference` GraphQL query
- Reconciles against current `headerData` (drops stale column keys)
- Auto-saves: debounced 2.5s for resize, immediate for visibility/reorder/bulk
- Retries failed saves 3x with exponential backoff (1s, 2s, 4s)
- Falls back to defaults silently if fetch fails
- `onColumnConfigChange` is still called alongside auto-save
- `onLoadingChange` fires on every loading state transition during the initial fetch (opt-in, no-op if omitted)

### `applyBulkConfig` (Context Method)

Applies multiple config changes atomically in a single dispatch/callback. Used internally by ColumnCustomizer `onSave` mode but also available via `useTableGridColumns()`.

```typescript
applyBulkConfig(updates: {
  columnWidths?: Record<string, number>;
  columnVisibility?: Record<string, boolean>;
  columnOrder?: string[] | null;
  lockedColumns?: string[];
}) => void;
```

- In controlled mode: emits a single `onColumnConfigChange` with `type: 'bulk'`
- In uncontrolled mode: dispatches a single reducer action
- Prevents stale-snapshot data loss from multiple individual calls
- With persistence enabled, triggers an immediate (non-debounced) save

### Manual Backend Persistence (Controlled Mode)

For controlled mode where you manage state yourself:

```jsx
import TableGrid from '@birdeye/elemental/core/components/TableGrid';
import { TableGridColumnProvider, COLUMN_CHANGE_TYPES } from '@birdeye/elemental/core/components/TableGrid/context';
import ColumnCustomizer from '@birdeye/elemental/core/components/TableGrid/ColumnCustomizer';

const [columnConfig, setColumnConfig] = useState(savedConfigFromApi);

<TableGridColumnProvider
  columnConfig={columnConfig}
  resizeMode="onEnd"
  onColumnConfigChange={({ type, config }) => {
    setColumnConfig(config);
    if (
      type === COLUMN_CHANGE_TYPES.RESIZE ||
      type === COLUMN_CHANGE_TYPES.REORDER ||
      type === COLUMN_CHANGE_TYPES.VISIBILITY ||
      type === COLUMN_CHANGE_TYPES.BULK
    ) {
      debounceSaveToApi(config);
    }
  }}
>
  <ColumnCustomizer />
  <Table tableData={tableData} />
</TableGridColumnProvider>
```
