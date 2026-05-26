# Table Component - Migration & Usage Guide

## Skill Instructions

- Use this guide when migrating any table to Elemental `TableGrid` or `VirtualizedStyleTableGrid`.
- Treat this doc as source-of-truth for callback payloads, renderer contracts, and data-shape expectations.
- Prefer key-value `rowData` format for all new integrations.

> **Complete reference for migrating to and using the Elemental TableGrid component**  
> This document covers data structures, props, configurations, and migration strategies.

---

## TableGrid of Contents

1. [Overview](#1-overview)
2. [Data Structure](#2-data-structure)
   - [Required Fields](#21-required-fields)
   - [Key-Value Structure (Recommended)](#22-key-value-structure-recommended)
   - [Legacy Array Structure (Backward Compatible)](#23-legacy-array-structure-backward-compatible)
3. [Header Data Configuration](#3-header-data-configuration)
4. [Props Reference](#4-props-reference)
   - [Column Management APIs (Provider + Customizer)](#41-column-management-apis-provider--customizer)
5. [Cell Renderers](#5-cell-renderers)
6. [Metadata System](#6-metadata-system)
7. [Accordion (Expandable Rows)](#7-accordion-expandable-rows)
8. [Virtualization](#8-virtualization)
9. [Infinite Scroll](#9-infinite-scroll)
10. [Sorting](#10-sorting)
11. [Row Hover Actions](#11-row-hover-actions)
12. [Event Handlers & Callbacks Reference](#12-event-handlers--callbacks-reference)
    - [onHandleRowClick](#121-onhandlerowclick)
    - [onHandleSingleCellClick](#122-onhandlesinglecellclick)
    - [onHandleHeaderSortClick](#123-onhandleheadersortclick)
    - [onHeaderClick (Per-Header)](#124-onheaderclick-per-header)
    - [onCellClick (Per-Cell)](#125-oncellclick-per-cell)
    - [Accordion Callbacks](#126-accordion-callbacks)
    - [Row Hover Action Callbacks](#127-row-hover-action-callbacks)
    - [sortComparator](#128-sortcomparator-client-side-sort)
    - [Cell Renderer Function](#129-cell-renderer-function)
    - [Header Cell Renderer Function](#1210-header-cell-renderer-function)
    - [Infinite Scroll loadMore](#1211-infinite-scroll-loadmore)
    - [onColumnConfigChange (TableGridColumnProvider)](#1212-oncolumnconfigchange-tablecolumnprovider)
13. [VirtualizedStyleTableGrid (react-virtualized API)](#13-virtualizedstyletablegrid-react-virtualized-api)
14. [Migration Strategies](#14-migration-strategies)
15. [Performance Optimization](#15-performance-optimization)
16. [Complete Examples](#16-complete-examples)

---

## 1. Overview

The TableGrid component is a highly performant, feature-rich table with support for:
- **Sorting** (client-side and server-side)
- **Virtualization** (render only visible rows for large datasets)
- **Infinite Scroll** (load more data as user scrolls)
- **Accordion** (expandable parent-child rows)
- **Metadata System** (custom className, style, data-* attributes)
- **Row Hover Actions** (action menus on row hover)
- **Fixed Columns** (sticky first column on horizontal scroll)
- **Custom Cell Renderers** (full control over cell content)

```jsx
import TableGrid from '@birdeye/elemental/core/components/TableGrid';
```

---

## 2. Data Structure

### 2.1 Required Fields

The `tableData` prop is **required** and must contain:

```typescript
interface TableGridData {
  headerData: HeaderData[];    // Column definitions (REQUIRED)
  data: (LegacyRow | NormalizedRow)[];             // Row data (REQUIRED)
  totalCount?: number;         // Optional: Total count for pagination info
}
```

### 2.2 Key-Value Structure (Recommended)

The **recommended** data structure uses key-value pairs for `rowData`, where keys match header `value` fields:

```javascript
const tableData = {
  headerData: [
    { order: 0, value: "location", label: "Location", enabled: true, sortable: true },
    { order: 1, value: "business_name", label: "Business Name", enabled: true },
    { order: 2, value: "status", label: "Status", enabled: true }
  ],
  data: [
    {
      rowId: "row-1",                    // Always provide: unique identifier. Falls back to row-${index} but accordion and disabledStateForRow break without it.
      rowData: {
        location: { value: "New York" },
        business_name: { value: "Acme Corp" },
        status: { value: "Active" }
      },
      // Optional: Additional row properties
      businessId: 12345,
      customField: "any value"
    },
    {
      rowId: "row-2",
      rowData: {
        location: { value: "Los Angeles" },
        business_name: { value: "Global Inc" },
        status: { value: "Pending" }
      }
    }
  ]
};
```

#### Cell Object Structure

Each cell in `rowData` is an object with these properties:

```typescript
interface CellData {
  value?: any;                 // Cell display value (shows "-" if omitted)
  label?: string;              // Optional label
  metadata?: Record<string, any>;   // Custom attributes for <td>
  onCellClick?: (args: CellClickPayload) => boolean | void;  // Per-cell click handler
  needIsHoverProp?: boolean;   // Pass isHovered only when disablePerfOptimization=true
  // Any additional custom properties for your cell renderer
  [key: string]: any;
}
```

### 2.3 Legacy Array Structure (Backward Compatible)

The component also supports the **legacy array-based structure** for backward compatibility:

```javascript
// ⚠️ LEGACY - Order MUST match headerData order
const legacyTableData = {
  headerData: [
    { order: 0, value: "location", label: "Location", enabled: true },
    { order: 1, value: "business_name", label: "Business Name", enabled: true },
    { order: 2, value: "status", label: "Status", enabled: true }
  ],
  data: [
    {
      rowId: "row-1",
      rowData: [
        { value: "New York" },      // Index 0 → location
        { value: "Acme Corp" },     // Index 1 → business_name
        { value: "Active" }         // Index 2 → status
      ]
    }
  ]
};
```

> **Note:** Legacy array data is automatically normalized to key-value internally.

---

## 3. Header Data Configuration

Each header item defines a column:

```typescript
interface HeaderData {
  order?: number;              // Display order (defaults to 0 via a.order ?? 0)
  value: string;              // REQUIRED: Column key (matches rowData keys)
  label: string;              // REQUIRED: Display label in header
  enabled?: boolean;          // Column visibility (defaults to true via col.enabled !== false)

  // Optional properties:
  sortable?: boolean;         // Enable sorting on this column (default: false)
  fixed?: boolean;            // Fixed width styling
  locked?: boolean;           // for column customiser.
  copyToClipboard?: boolean;  // Show copy button
  
  // Width configuration (can also be set via props):
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  enabledFluidWidth?: boolean; // Column-level override for fluid width behavior when resize mode is enabled
  
  // Metadata for <th> element:
  metadata?: Record<string, any>;
  
  // Per-header click callback:
  onHeaderClick?: (args: { event: React.MouseEvent; headerData: HeaderData; index: number; sortColumn: string; sortOrder: number }) => boolean | void;

  // Per-cell click callback (applies to all cells in this column):
  onCellClick?: (args: CellClickPayload) => boolean | void;

  // Controls whether isHovered prop should be passed to this column's cellRenderer.
  // Effective only when disablePerfOptimization=true.
  // Priority is: cellData.needIsHoverProp > headerData.needIsHoverProp > false
  needIsHoverProp?: boolean;
}
```

> **Width field note:** Use `headerData.width` for flat-level fixed width. Legacy `fixWidth` can appear in adapter-generated flows but is not the primary field for direct `TableGrid` usage. `enabledFluidWidth` only has an effect when resize mode is enabled and no explicit resized width has been committed for that column. It overrides the table-level default when that default is provided.

**Example:**

```javascript
const headerData = [
  { 
    order: 0, 
    value: "name", 
    label: "Name", 
    enabled: true, 
    sortable: true,
    fixed: true,
    onHeaderClick: ({ event, headerData, sortColumn, sortOrder }) => {
      console.log("Header clicked:", headerData.value);
      return true; // Return false to prevent sort trigger
    }
  },
  { 
    order: 1, 
    value: "email", 
    label: "Email Address", 
    enabled: true,
    copyToClipboard: true
  },
  { 
    order: 2, 
    value: "status", 
    label: "Status", 
    enabled: true,
    metadata: { 
      className: "status-header", 
      style: { minWidth: "100px" } 
    }
  }
];
```

---

## 4. Props Reference

### Main Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tableData` | `object` | ✅ Yes | - | Contains `headerData` and `data` |
| `cellRenderer` | `object` | No | - | Custom cell renderers keyed by column |
| `headerCellRenderer` | `object` | No | - | Custom header renderers keyed by column |
| `onHandleRowClick` | `function` | No | noop | Row click callback |
| `onHandleSingleCellClick` | `function` | No | noop | Cell click callback |
| `onHandleHeaderSortClick` | `function` | No | noop | Sort click callback |

### Display & Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tableContainerClass` | `string` | `""` | Container element class |
| `tableContainerRef` | `ref` | - | Forwarded to internal container div; virtualization auto-detects scroll parent from tbody upward |
| `tableDataTestId` | `string` | `""` | Test ID prefix |
| `isFirstColumnFixed` | `boolean` | `false` | Enable horizontal scroll with sticky first column |
| `isHeaderFixed` | `boolean` | `false` | Sticky header on vertical scroll |
| `height` | `number` | - | Fixed table height in pixels |
| `width` | `number` | - | Fixed table width in pixels |
| `viewPortColumns` | `number` | `0` | Auto-calculate column width so exactly N columns fill the viewport. **Mutually exclusive with fluid width scaling** — if set, `scaleFactor` / `enabledFluidWidth` are ignored. |
| `scaleFactor` | `number` | - | Multiplies base widths for columns with `enabledFluidWidth` when resize mode is enabled. Has no effect when `viewPortColumns` is set. |
| `enableFluidWidthByDefault` | `boolean` | `false` | Enables fluid width scaling for all columns by default when resize mode is enabled. Has no effect when `viewPortColumns` is set. |

### Width Configuration Props

| Prop | Type | Description |
|------|------|-------------|
| `customHeadersMaxWidth` | `object` | `{ columnKey: "200px" }` - Max width per column |
| `customHeadersFixWidth` | `object` | `{ columnKey: "150px" }` - Fixed width per column |
| `customHeadersMinWidth` | `object` | `{ columnKey: "100px" }` - Min width per column |
| `customRowWidth` | `object` | `{ customRowMaxWidth, customRowFixWidth, customRowMinWidth }` |

`customRowWidth` also supports `customRowMaxWidth.rowHoverActionWidth` to set fixed width for the sticky row-hover-actions column.

### Loading & Empty States

| Prop | Type | Description |
|------|------|-------------|
| `loaderProps` | `object` | `{ isLoading, type, isReseller, loaderClassName, customJsx }` |
| `noDataProps` | `object` | `{ title, subtitle, noDataClassName, noResultsImageSrc, customJsx }` |

**`loaderProps.customJsx`** — Optional React component (no props required) rendered instead of the default `LoaderBox` when `isLoading` is `true`. The component is still wrapped in the `loaderClassName` div.

**`noDataProps.customJsx`** — Optional React component (no props required) rendered instead of the default `NoDataSimple` when data is empty and not loading. When provided, `title`, `subtitle`, `noDataClassName`, and `noResultsImageSrc` are ignored.

### Feature Props

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

### 4.1 Column Management APIs (Provider + Customizer)

Column resizing, visibility, and reorder are managed by `TableGridColumnProvider` + `useTableGridColumns`.
`TableGrid` consumes this context when present; outside provider it falls back to no-op defaults for backward compatibility.

```jsx
import TableGrid from "'@birdeye/elemental/core/components/TableGrid";
import {
  TableGridColumnProvider,
  COLUMN_CHANGE_TYPES,
} from '@birdeye/elemental/core/components/TableGrid/context';
import ColumnCustomizer from "@birdeye/elemental/core/components/TableGrid/ColumnCustomizer"

<TableGridColumnProvider initialColumnConfig={{ lockedColumns: ['name'] }}>
  <ColumnCustomizer />
  <TableGrid tableData={tableData} />
</TableGridColumnProvider>
```

#### TableGridColumnProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columnConfig` | `object` | `undefined` | Controlled mode config object |
| `onColumnConfigChange` | `function` | `undefined` | Called on resize/reorder/visibility/reset changes (`init` is reserved in constants) |
| `initialColumnConfig` | `object` | `{}` | Initial state for uncontrolled mode |
| `minColumnWidth` | `number` | `50` | Lower bound for resize and auto-fit |
| `maxColumnWidth` | `number` | `800` | Upper bound for resize and auto-fit |
| `enableResize` | `boolean` | `true` | Enables drag resize + double-click auto-fit |
| `resizeMode` | `'onChange' \| 'onEnd'` | `'onEnd'` | Resize commit strategy |
| `enableReorder` | `boolean` | `true` | Enables drag-drop column reorder |
| `enableVisibilityToggle` | `boolean` | `true` | Enables show/hide in customizer |
| `persistence` | `PersistenceConfig` | `undefined` | Backend persistence config — enables auto-save/load of column config (uncontrolled mode only). See [Built-in Backend Persistence](#built-in-backend-persistence) |

#### `columnConfig` / `initialColumnConfig` Shape

```typescript
interface ColumnConfig {
  columnWidths?: Record<string, number>;      // px numeric widths
  columnVisibility?: Record<string, boolean>; // Sparse: only hidden columns stored (false). Missing key = visible.
  columnOrder?: string[] | null;              // ordered column keys
  lockedColumns?: string[] | Set<string>;      // cannot hide
}
```

> **Sparse visibility storage:** `columnVisibility` uses sparse storage — only hidden columns (`false`) are stored. A missing key means the column is visible (default). This reduces payload size for backend persistence and simplifies diffing. The provider checks visibility via `columnVisibility[key] !== false`.

#### Resize Mode Semantics (Important)

- `onChange`: updates column config continuously during drag (more reactive, more callback traffic).
- `onEnd`: applies transient DOM width while dragging and commits a single state/callback update on mouseup (recommended for heavy tables).
- Double-click on resize handle auto-fits using measured header content width, then clamps to min/max (body-cell measurement is currently disabled in code).
- Current implementation relies on native `onDoubleClick`; if your app triggers heavy re-renders between clicks, consider using `resizeMode="onEnd"` and minimizing expensive state updates during resize interactions.

#### Width While Resizing (Exact Runtime Behavior)

- Width values are always clamped to resolved bounds before commit.
- In `onChange` mode, width is committed to context on every mouse move, so header + body cells track continuously.
- In `onEnd` mode, drag width is applied as a transient DOM update during drag, then committed once on mouseup.
- If drag starts and ends at the same width, no resize commit event is emitted.
- Auto-fit (double-click) measures header content and commits one clamped width.

#### Width/Bounds Precedence (Code-Verified)

- Runtime resized width (`columnWidths[columnKey]`) has highest priority.
- If resize mode is enabled and `headerData.enabledFluidWidth` is true, the next priority is the scaled base width derived from `headerData.width` or legacy fixed-width fallbacks.
- Otherwise, next priority for initial width is `headerData.width`.
- Legacy fallback still supported through `customHeadersFixWidth` and `customRowWidth.customRowFixWidth`.
- Per-column bounds use `headerData.minWidth` / `headerData.maxWidth`.
- If per-column bounds are absent, provider-level `minColumnWidth` / `maxColumnWidth` are used.
- If `maxWidth < minWidth`, max is coerced to min internally.

#### Fluid Width Behavior

- `scaleFactor` is a table-level multiplier for base column widths.
- Fluid scaling only applies when column resize is enabled.
- `enableFluidWidthByDefault` enables fluid scaling for all columns unless a column overrides it.
- `headerData.enabledFluidWidth` overrides the table-level default for that specific column.
- Fluid scaling is skipped once the user has an explicit resized width in `columnWidths[columnKey]`.
- Fluid scaling works from an existing base width source such as `headerData.width` or legacy fixed-width fallbacks; it does not derive widths from `minWidth`/`maxWidth` alone.
- **`viewPortColumns` and fluid width scaling are mutually exclusive.** When `viewPortColumns` is provided, the viewport-computed width takes full precedence and all fluid scaling (`scaleFactor`, `enabledFluidWidth`, `enableFluidWidthByDefault`) is skipped. Do not combine these two features.

#### Controlled vs Uncontrolled Behavior

- **Controlled mode**: pass `columnConfig`; all mutations are emitted through `onColumnConfigChange`; parent must update `columnConfig`.
- **Uncontrolled mode**: pass `initialColumnConfig`; provider manages reducer state internally.
- Uncontrolled callbacks are emitted **after reducer commit** (post-state update), so payloads represent committed/latest config.

#### Change Types

```typescript
type ColumnChangeType = 'resize' | 'reorder' | 'visibility' | 'bulk' | 'reset' | 'init';
```

#### ColumnCustomizer Props

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

#### ColumnCustomizer Apply Modes

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

#### ColumnCustomizer Callback Semantics

- `onColumnChange` (onChange mode): emits UI actions such as `reorder`, `visibility`, `visibility-all`, `reset`, `save`.
- `onColumnChange` (onSave mode): emits only `save` (draft interactions are local until save).
- `onSave` payload:
  - `onSave` mode: `{ visibility: draftVisibility, order: draftOrder }`
  - `onChange` mode: `{ visibility: ctxVisibility, order: ctxOrder }`

#### Built-in Backend Persistence

The provider has built-in GraphQL-based persistence via the `persistence` prop. This is the **recommended approach** for uncontrolled mode — no manual save/load logic needed.

```typescript
type PersistableColumnKey = 'columnWidths' | 'columnVisibility' | 'columnOrder' | 'lockedColumns';

interface PersistenceConfig {
  fetcher?: GraphQLFetcher;     // Option 1: Generic GraphQL fetcher
  apiResource?: {               // Option 2: Birdeye apiResource (e.g., beNodeResource)
    post: (path: string, data: unknown, config?: Record<string, unknown>) => Promise<{ data: unknown }>;
  };
  graphqlEndpoint?: string;     // Required when using apiResource (e.g., "/uiPreferencesApi/graphql")
  onError?: (error: Error) => void;  // Called when save fails after all retries
  persistKeys?: PersistableColumnKey[]; // Allowlist of config keys to persist. Default: ['columnVisibility', 'columnOrder', 'lockedColumns'] (widths NOT saved by default)
}
```

**`persistKeys` — control what gets saved:**
- Default: `['columnVisibility', 'columnOrder', 'lockedColumns']` — column widths are **not** persisted by default.
- Pass `['columnWidths', 'columnVisibility', 'columnOrder', 'lockedColumns']` to also persist resize, or omit any key to skip it (e.g., omit `'columnOrder'` to never save reordering).
- Keys not in the list are stripped both before save and after fetch (so toggling the list at runtime takes effect immediately).
- When `'columnWidths'` is excluded, the debounced auto-save on resize is skipped entirely — no wasted network traffic.

**Option 1: With a generic fetcher** (any HTTP client):

```jsx
import { TableGridColumnProvider } from '@birdeye/elemental/core/components/TableGrid/context';
import type { GraphQLFetcher } from '@birdeye/elemental/core/components/TableGrid/context';

const myFetcher: GraphQLFetcher = async ({ query, variables }) => {
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  return json.data;
};

<TableGridColumnProvider
  initialColumnConfig={{ lockedColumns: ['name'] }}
  persistence={{
    fetcher: myFetcher,
    onError: (err) => console.error('Save failed:', err),
  }}
>
  <ColumnCustomizer applyMode="onSave" />
  <TableGrid tableId="my-table" tableData={tableData} />
</TableGridColumnProvider>
```

**Option 2: With Birdeye `apiResource`** (production pattern):

```jsx
import { beNodeResource } from 'utils/apiHelper';

<TableGridColumnProvider
  initialColumnConfig={{ lockedColumns: ['name'] }}
  persistence={{
    apiResource: beNodeResource,
    graphqlEndpoint: '/uiPreferencesApi/graphql',
  }}
>
  <ColumnCustomizer applyMode="onSave" />
  <TableGrid tableId="contacts-table" tableData={tableData} />
</TableGridColumnProvider>
```

**Built-in persistence behavior:**
- Fetches saved config from backend on mount (and whenever `tableId` changes) via `GetPreference` GraphQL query
- `tableId` is a flat-level prop on `TableGrid` — it is automatically passed through context to the persistence hook
- Reconciles saved config against current `headerData` (drops stale column keys)
- Renders table immediately with defaults, then applies saved config when loaded
- Auto-saves resize/reorder changes with a 2.5s debounce (resize save skipped when `'columnWidths'` not in `persistKeys`)
- Saves customizer and other changes immediately
- Only the keys listed in `persistKeys` are sent to backend (default excludes `columnWidths`)
- Retries failed saves 3 times with exponential backoff (1s, 2s, 4s)
- Falls back to defaults silently if fetch fails
- Persistence is **disabled in controlled mode** (`columnConfig` prop) — use manual persistence instead

#### Manual Backend Persistence (Controlled Mode)

For controlled mode where you manage state yourself:

```jsx
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
  <TableGrid tableData={tableData} />
</TableGridColumnProvider>
```

---

## 5. Cell Renderers

### Defining Cell Renderers

Cell renderers are React components keyed by column `value`:

```javascript
const cellRenderer = {
  // Key = headerData.value
  name: NameCellRenderer,
  status: StatusCellRenderer,
  email: EmailCellRenderer
};
```

### Renderer Contract (Important)

- `cellRenderer[columnKey]` and `headerCellRenderer[columnKey]` support **both**:
  1) component types (function/class, including `memo(...)` / `forwardRef(...)`), and
  2) pre-created JSX elements.
- For pre-created JSX elements, default behavior is **static mode** (no prop injection, no `cloneElement`) to keep render stable.
- If you need runtime table props (`rowData`, `rowIndex`, `headerData`, `isHovered`, etc.), opt-in with `injectRendererProps={true}`.
- When `injectRendererProps={true}`, table injects runtime props via `React.cloneElement`.

```jsx
// Component type mode (dynamic props)
const cellRenderer = { name: NameCellRenderer };

// Pre-created JSX static mode (no runtime props injected)
const cellRenderer = { name: <h1>Hello</h1> };

// Pre-created JSX dynamic mode (runtime props injected)
const cellRenderer = {
  name: <NameCell injectRendererProps />
};

const headerCellRenderer = {
  name: <HeaderBadge injectRendererProps />
};
```

If you want static pre-created JSX without runtime props, this is valid:

```jsx
const staticNameCell = <h1>Hello</h1>;
const cellRenderer = { name: staticNameCell };
```

### Cell Renderer Props

Each cell renderer receives these props:

```typescript
interface CellRendererProps {
  // Core props
  rowData: CellData;           // The cell's data object { value, ...custom }
  headerData: HeaderData;     // Header configuration for this column
  headerKey: string;          // Column key (e.g., "name")
  rowId: string;              // Row's unique identifier
  rowIndex: number;           // Row index in the data array
  cellIndex: number;          // Cell index in the row
  
  // Accordion props (when enabled)
  _rowType: 'parent' | 'child' | 'seeMore'; // Flattened accordion row type
  _isExpanded: boolean;       // Is this row expanded
  _isExpandable: boolean;     // Has children
  _childrenCount: number;     // Number of children
  
  // Optional (gated)
  // Passed only when:
  // 1) disablePerfOptimization=true, and
  // 2) needIsHoverProp is true at cellData or headerData level
  isHovered?: boolean;        // Is row currently hovered
  
  // All other row properties are spread
  businessId?: any;
  customField?: any;
}
```

### Example Cell Renderers

```jsx
import { memo } from 'react';

// Simple text renderer
const TextCellRenderer = memo(({ rowData }) => (
  <span className="ellipsis value">{rowData?.value ?? "-"}</span>
));

// Status badge renderer
const StatusCellRenderer = memo(({ rowData }) => {
  const status = rowData?.value;
  const colors = {
    Active: { bg: '#e6f7e6', text: '#2e7d32' },
    Pending: { bg: '#fff3e0', text: '#e65100' },
    Inactive: { bg: '#ffebee', text: '#c62828' }
  };
  const style = colors[status] || { bg: '#f5f5f5', text: '#666' };
  
  return (
    <span style={{
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: style.bg,
      color: style.text
    }}>
      {status ?? '-'}
    </span>
  );
});

// Renderer with accordion awareness
const LocationCellRenderer = memo(({ rowData, _isExpanded, _childrenCount }) => (
  <div>
    <strong>{rowData?.value}</strong>
    {_childrenCount > 0 && (
      <small>{_isExpanded ? 'Expanded' : `${_childrenCount} sub-items`}</small>
    )}
  </div>
));

// Renderer using custom cell properties
const SentimentCellRenderer = memo(({ rowData }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <strong>{rowData?.value}</strong>
    {rowData?.delta && (
      <span style={{ color: rowData.deltaValue > 0 ? 'green' : 'red' }}>
        {rowData.deltaValue > 0 ? '↑' : '↓'} {Math.abs(rowData.deltaValue)}%
      </span>
    )}
  </div>
));
```

### Header Cell Renderers

```javascript
const headerCellRenderer = {
  status: memo(({ label, isSorted, sortOrder }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{label}</span>
      {isSorted && (
        <span>{sortOrder === 0 ? '▲' : '▼'}</span>
      )}
    </div>
  ))
};
```

---

## 6. Metadata System

### Overview

The metadata system allows adding custom attributes (`className`, `style`, `id`, `data-*`, etc.) to table elements using a **hybrid approach**:

1. **Global Config** (`metadataConfig` prop) - Default attributes for all elements
2. **Inline Metadata** (in data) - Per-row/per-cell overrides

### Merge Strategy

| Attribute | Behavior |
|-----------|----------|
| `className` | **Concatenated** (global + inline) |
| `style` | **Shallow merged** (inline overrides global) |
| Other attrs | **Inline overrides global** |

### Global Configuration (`metadataConfig`)

```javascript
const metadataConfig = {
  // <table> element
  table: {
    className: "custom-table",
    "data-table-id": "main-table"
  },
  
  // Outer container div
  tableContainer: {
    className: "table-container-custom",
    style: { border: "1px solid #ddd" }
  },
  
  // TableGrid wrapper div
  tableWrapper: {
    className: "table-wrapper-custom"
  },
  
  // All <tr> elements
  tr: {
    className: "custom-row",
    "data-testid": "table-row"
  },
  
  // <th> elements (column-specific)
  th: {
    '*': { className: "all-headers" },           // '*' applies to ALL columns
    'name': { className: "header-name" },        // Specific column
    'status': { 
      className: "header-status", 
      style: { minWidth: "100px" } 
    }
  },
  
  // <td> elements (column-specific)
  td: {
    '*': { className: "all-cells" },             // '*' applies to ALL columns
    'name': { className: "cell-name" },
    'status': { 
      className: "cell-status",
      style: { fontWeight: 500 }
    }
  }
};

<TableGrid tableData={tableData} metadataConfig={metadataConfig} />
```

### Inline Metadata (Per Row/Cell)

```javascript
const data = [
  {
    rowId: "special-row",
    // <tr> metadata for this row
    metadata: {
      className: "highlighted-row",
      id: "important-row",
      "data-priority": "high"
    },
    rowData: {
      name: { value: "John Doe" },
      status: { 
        value: "Active",
        // <td> metadata for this cell
        metadata: {
          className: "active-status",
          style: { backgroundColor: "#e6f7e6" }
        }
      }
    }
  }
];
```

### Merge Example

```javascript
// Global config
metadataConfig = {
  td: {
    '*': { className: "base-cell" },
    'status': { className: "status-cell", style: { color: "blue" } }
  }
};

// Inline cell data
{ value: "Active", metadata: { className: "active", style: { fontWeight: 500 } } }

// Result for status <td>:
// className = "base-cell status-cell active"
// style = { color: "blue", fontWeight: 500 }
```

---

## 7. Accordion (Expandable Rows)

### Data Structure for Accordion

```javascript
const accordionData = [
  {
    rowId: "region-1",                         // REQUIRED: Unique ID
    rowData: {
      name: { value: "North America" },
      count: { value: 3 }
    },
    // Optional: Different data when expanded
    expandedRowData: {
      name: { value: "North America (Expanded)" },
      count: { value: "3 countries shown" }
    },
    // Child rows (makes this row expandable)
    children: [
      {
        rowId: "region-1-child-1",
        rowData: {
          name: { value: "USA" },
          count: { value: 50 }
        }
      },
      {
        rowId: "region-1-child-2",
        rowData: {
          name: { value: "Canada" },
          count: { value: 10 }
        }
      }
    ]
  },
  {
    rowId: "region-2",
    rowData: {
      name: { value: "Europe" },
      count: { value: 5 }
    },
    children: [/* ... */]
  }
];
```

### Accordion Configuration

```javascript
const accordionConfig = {
  enabled: true,                    // REQUIRED: Enable accordion
  
  // Optional configurations:
  defaultExpandedRowIds: ['region-1'],  // Initially expanded rows
  maxExpandedRows: 2,               // Max simultaneously expanded (0 = unlimited)
  subRowLimit: 3,                   // Show N children with "see more" (0 = show all)
  expandIconColumn: 'name',         // Column to show expand icon (default: first)
  disableExpand: false,             // Disable all expand interactions
  
  // Callbacks:
  onExpand: (rowId, isExpanded, expandedRowIds) => {
    console.log(`Row ${rowId} is now ${isExpanded ? 'expanded' : 'collapsed'}`);
  },
  onLoadMoreSubRows: (parentRowId, newVisibleCount) => {
    console.log(`Load more for ${parentRowId}, now visible: ${newVisibleCount}`);
  }
};

<TableGrid
  tableData={{ headerData, data: accordionData }}
  accordionConfig={accordionConfig}
/>
```

---

## 8. Virtualization

### Configuration

```javascript
const virtualization = {
  enabled: true,                    // Enable virtual scrolling
  rowHeight: 50,                    // Optional: fixed row height (if omitted, first row is measured)
  overscan: 5,                      // Extra rows to render above/below viewport
  switchThreshold: 20              // Min rows before enabling virtualization
};

// Scroll container must have fixed height. Virtualization hook auto-detects scrollable parent.
const tableRef = useRef(null);

<div style={{ height: '500px', overflow: 'auto' }} ref={tableRef}>
  <TableGrid
    tableData={tableData}
    tableContainerRef={tableRef}
    virtualization={virtualization}
  />
</div>
```

### Important Notes

- Container element **must have a fixed height**
- `rowHeight` is optional; if omitted, first visible row is measured and used for virtualization calculations
- If accordion is enabled, virtualization is automatically disabled (variable row heights)
- Can be combined with infinite scroll

### Virtualization + Infinite Scroll (`useWindow`)

When using window-based scrolling, align both configs:

```jsx
<TableGrid
  tableData={tableData}
  virtualization={{ enabled: true, rowHeight: 50, useWindow: true }}
  infiniteScrollProps={{
    enable: true,
    useWindow: true,
    hasMore,
    loadMore,
    threshold: 250,
  }}
/>
```

Use either container scrolling (`useWindow: false` in both) or window scrolling (`useWindow: true` in both).

---

## 9. Infinite Scroll

### Configuration

```javascript
const infiniteScrollProps = {
  enable: true,                     // Enable infinite scroll
  hasMore: true,                    // Are there more items to load?
  loadMore: () => {                 // Called when user scrolls near bottom
    // Fetch more data and append to existing
  },
  loader: <div>Loading...</div>,    // Loading indicator
  useWindow: false,                 // Use window scroll vs container scroll
  threshold: 250,                   // Distance from bottom to trigger load (px)
  initialLoad: false                // Load on mount?
};

<TableGrid
  tableData={tableData}
  infiniteScrollProps={infiniteScrollProps}
  // Optional: Combine with virtualization
  virtualization={{ enabled: true, rowHeight: 50 }}
/>
```

### Example Implementation

```jsx
const InfiniteScrollTable = () => {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMore = useCallback(() => {
    fetchMoreData().then(newItems => {
      setData(prev => [...prev, ...newItems]);
      setHasMore(newItems.length > 0);
    });
  }, []);

  return (
    <TableGrid
      tableData={{ headerData, data }}
      infiniteScrollProps={{
        enable: true,
        hasMore,
        loadMore,
        loader: <LoadingSpinner />
      }}
    />
  );
};
```

---

## 10. Sorting

### Server-Side Sorting (Default)

```javascript
const handleHeaderSortClick = (sort) => {
  // sort = { sortby: "columnKey", sortOrder: 0|1 }
  const { sortby, sortOrder } = sort;
  
  // Fetch sorted data from server
  fetchData({ orderBy: sortby, order: sortOrder === 0 ? 'asc' : 'desc' });
};

<TableGrid
  tableData={tableData}
  onHandleHeaderSortClick={handleHeaderSortClick}
  sort={{ sortby: "name", sortOrder: 0 }}  // Initial sort state
  sortDebounceWaitTime={300}                // Debounce sort clicks
/>
```

**Sort toggle behavior** (from `handleHeaderSortClick` in `index.tsx`):
- Clicking the **same column**: toggles `sortOrder` between `0` (asc) and `1` (desc)
- Clicking a **different column**: resets `sortOrder` to `0` (asc) and sets new `sortby`

### Client-Side Sorting

```javascript
<TableGrid
  tableData={tableData}
  enableClientSideSort={true}
  // Optional: Custom comparator
  sortComparator={(a, b, sortColumn, sortOrder) => {
    const aVal = a.rowData[sortColumn]?.value;
    const bVal = b.rowData[sortColumn]?.value;
    
    let comparison = 0;
    if (typeof aVal === 'string') {
      comparison = aVal.localeCompare(bVal);
    } else {
      comparison = (aVal || 0) - (bVal || 0);
    }
    
    return sortOrder === 0 ? comparison : -comparison;
  }}
/>
```

---

## 11. Row Hover Actions

### Configuration

```javascript
const rowHoverAction = {
  enable: true,
  
  // Custom JSX shown on hover
  customJSX: (row) => (
    <button onClick={() => handlePreview(row)}>
      Preview
    </button>
  ),
  
  // Dropdown action menus
  removeActionBoxes: false,          // Set true to hide dropdown menus
  actionBoxConfigs: [
    {
      // First action dropdown
      getActionConfig: ({ rowData, rowId, headers, ...row }) => ({
        categories: [{
          title: "",
          options: [
            { label: "Edit", value: "EDIT", enable: true, callBack: handleEdit },
            { label: "Delete", value: "DELETE", enable: true, callBack: handleDelete }
          ]
        }]
      }),
      customSelectionJsx: <i className="icon_phoenix-vertical-menu" />,
      popOverDirection: "left"       // "left" | "right"
    }
  ]
};

<TableGrid
  tableData={tableData}
  rowHoverAction={rowHoverAction}
  disableRowHoverAction={(row) => row.rowData?.status?.value === 'Inactive'}
/>
```

---

## 12. Event Handlers & Callbacks Reference

This section provides complete TypeScript interfaces for all callbacks with detailed argument structures.

### 12.1 onHandleRowClick

Called when a row is clicked.

`receiveNormalizedDataStructure` behavior:
- `false` (default): if legacy array-based input was normalized internally, callback receives denormalized legacy row shape for backward compatibility.
- `true`: callback always receives normalized key-value row shape.

```typescript
// RowLike = NormalizedRow | LegacyRow | GenericRecord
type OnHandleRowClick = (row: RowLike) => void;

// After internal normalization, the row object has this shape (NormalizedRow):
interface NormalizedRow {
  rowId?: string;                     // Unique row identifier
  rowData: Record<string, CellData>;  // Cell data keyed by column
  expandedRowData?: Record<string, CellData>; // Alternate data when expanded
  metadata?: Record<string, any>;     // Row-level metadata (if defined)
  isDisabled?: boolean;               // Row-level disabled flag
  children?: NormalizedRow[];         // Child rows (accordion)
  _originalRowData?: Record<string, CellData> | CellData[];
  _isNormalized?: boolean;
  _rowType?: 'parent' | 'child' | 'seeMore'; // Row type in flattened accordion data
  _isExpanded?: boolean;              // Is row currently expanded
  _isExpandable?: boolean;            // Has children
  _childrenCount?: number;            // Number of child rows
  _parentIndex?: number;              // Parent row's index in flattened structure
  _flatIndex?: number;                // Index in flattened array
  _parentRowId?: string;              // Parent row's ID
  _childIndex?: number;               // Index among siblings
  _isLastChild?: boolean;
  _currentVisibleCount?: number;      // Currently visible children count
  _totalCount?: number;               // Total children count
  _remainingCount?: number;           // Remaining hidden children
  originalIndex?: number;
  // Plus any custom properties you added to the row
  [key: string]: any;
}

interface CellData {
  value?: any;                        // Cell display value (optional)
  metadata?: Record<string, any>;     // Cell-level metadata
  onCellClick?: (args: CellClickPayload) => boolean | void;
  needIsHoverProp?: boolean;          // Cell-level hover opt-in (highest priority)
  [key: string]: any;                 // Custom cell properties
}
```

**Example:**
```javascript
<TableGrid
  onHandleRowClick={(row) => {
    console.log('Row ID:', row.rowId);
    console.log('Row Data:', row.rowData);
    console.log('Name value:', row.rowData.name?.value);
    console.log('Custom field:', row.businessId);
    
    // Navigate or show detail
    router.push(`/details/${row.rowId}`);
  }}
/>
```

**Returns:** `void` (no return value expected)

---

### 12.2 onHandleSingleCellClick

Called when a cell is clicked (after per-cell handlers if they return true).

```typescript
type OnHandleSingleCellClick = (cellInfo: SingleCellClickPayload) => void;

// Actual type: SingleCellClickPayload = { ... } & GenericRecord
interface SingleCellClickPayload {
  event: React.MouseEvent;            // Original click event
  rowData: RowLike;                   // Full row object
  rowIndex: number;                   // Row index in data array
  cellIndex: number;                  // Cell index in row
  headerData: HeaderData;             // Column configuration
  headerKey: string;                  // Column key (e.g., "name")
  row_value?: any;                    // The cell's value property (optional)
  [key: string]: any;                 // Additional cell props spread via GenericRecord
}
```

**Example:**
```javascript
<TableGrid
  onHandleSingleCellClick={(cellInfo) => {
    console.log('Column:', cellInfo.headerKey);
    console.log('Value:', cellInfo.row_value);
    console.log('Row Index:', cellInfo.rowIndex);
    console.log('Cell Index:', cellInfo.cellIndex);
    console.log('Full Row:', cellInfo.rowData);
    console.log('Header Config:', cellInfo.headerData);
    
    // Handle based on column
    if (cellInfo.headerKey === 'email') {
      window.open(`mailto:${cellInfo.row_value}`);
    }
  }}
/>
```

**Returns:** `void` (no return value expected)

---

### 12.3 onHandleHeaderSortClick

Called when a sortable header is clicked.

```typescript
type OnHandleHeaderSortClick = (sortInfo: SortConfig) => void;

interface SortConfig {
  sortby: string;                     // Column key clicked
  sortOrder: number;                   // 0 = ascending, 1 = descending
}
```

**Example:**
```javascript
<TableGrid
  onHandleHeaderSortClick={(sortInfo) => {
    console.log('Sort column:', sortInfo.sortby);
    console.log('Sort order:', sortInfo.sortOrder === 0 ? 'ASC' : 'DESC');
    
    // Fetch sorted data from API
    fetchData({
      orderBy: sortInfo.sortby,
      order: sortInfo.sortOrder === 0 ? 'asc' : 'desc'
    });
  }}
  sort={{ sortby: 'name', sortOrder: 0 }}  // Initial/controlled sort state
/>
```

**Returns:** `void` (no return value expected)

---

### 12.4 onHeaderClick (Per-Header)

Per-header click handler defined in headerData. Allows preventing sort trigger.

```typescript
// Inline signature on HeaderData.onHeaderClick (no standalone interface in types.ts)
type OnHeaderClick = (args: {
  event: React.MouseEvent;
  headerData: HeaderData;
  index: number;
  sortColumn: string;
  sortOrder: number;
}) => boolean | void;

// HeaderData interface (from types.ts):
interface HeaderData {
  order?: number;                     // Display order (defaults to 0)
  value: string;                      // Column key
  label: string;                      // Display label
  enabled?: boolean;                  // Is column visible (defaults to true)
  sortable?: boolean;                 // Is sortable
  fixed?: boolean;                    // Fixed width styling
  copyToClipboard?: boolean;          // Metadata flag (passed through to renderers)
  locked?: boolean;                   // NOT consumed by runtime — use lockedColumns in provider
  width?: number | string;            // Column width
  minWidth?: number | string;
  maxWidth?: number | string;
  metadata?: Record<string, any>;     // <th> metadata
  onHeaderClick?: (args: { event: React.MouseEvent; headerData: HeaderData; index: number; sortColumn: string; sortOrder: number }) => boolean | void;
  onCellClick?: (args: CellClickPayload) => boolean | void;
  needIsHoverProp?: boolean;          // Column-level hover opt-in
  [key: string]: any;
}
```

**Example:**
```javascript
const headerData = [
  {
    order: 0,
    value: 'name',
    label: 'Name',
    enabled: true,
    sortable: true,
    onHeaderClick: ({ event, headerData, index, sortColumn, sortOrder }) => {
      console.log('Clicked header:', headerData.label);
      console.log('Current sort:', sortColumn, sortOrder);
      
      // Custom logic before sort
      trackAnalytics('header_click', { column: headerData.value });
      
      // Return false to PREVENT sort trigger
      if (isEditMode) {
        event.preventDefault();
        return false;
      }
      
      // Return true or undefined to ALLOW sort
      return true;
    }
  }
];
```

**Returns:** 
- `false` → Prevents sort trigger
- `true` or `undefined` → Allows sort to proceed

---

### 12.5 onCellClick (Per-Cell)

Per-cell click handler. Can be defined on cellData or headerData.

```typescript
// CellClickPayload from types.ts
type OnCellClick = (args: CellClickPayload) => boolean | void;

interface CellClickPayload {
  event: React.MouseEvent;            // Original click event
  cellData: CellData | GenericRecord; // Cell data object
  rowData: RowLike;                   // Full row object
  rowIndex: number;                   // Row index
  cellIndex: number;                  // Cell index
  headerData: HeaderData;             // Column configuration
  headerKey: string;                  // Column key
}
```

**Priority Chain:**
1. `cellData.onCellClick` (specific cell) - checked first
2. `headerData.onCellClick` (column-wide) - checked if no cell callback
3. `onHandleSingleCellClick` (global) - called if above return `true`/`undefined`

**Hover Prop Passing Rules (current behavior):**
1. `disablePerfOptimization` must be `true`, otherwise `isHovered` is never passed.
2. If enabled, resolution is: `cellData.needIsHoverProp ?? headerData.needIsHoverProp ?? false`.
3. Effective priority is cell-level override first, then header-level, then default `false`.

**Example - Per Cell:**
```javascript
const data = [{
  rowId: 'row-1',
  rowData: {
    actions: {
      value: 'Edit',
      onCellClick: ({ event, cellData, rowData, headerKey }) => {
        event.stopPropagation();  // Prevent row click
        
        console.log('Action clicked:', cellData.row_value);
        console.log('For row:', rowData.rowId);
        
        openEditModal(rowData);
        
        // Return false to prevent global onHandleSingleCellClick
        return false;
      }
    }
  }
}];
```

**Example - Per Column (in headerData):**
```javascript
const headerData = [
  {
    value: 'actions',
    label: 'Actions',
    enabled: true,
    onCellClick: ({ event, cellData, rowData }) => {
      // This applies to ALL cells in the 'actions' column
      event.stopPropagation();
      handleAction(cellData.row_value, rowData);
      return false;  // Prevent global handler
    }
  }
];
```

**Returns:**
- `false` → Prevents `onHandleSingleCellClick` + stops propagation
- `true` or `undefined` → Allows global callback to fire

---

### 12.6 Accordion Callbacks

#### onExpand

Called when a row is expanded or collapsed.

```typescript
type OnExpand = (
  rowId: string,
  isExpanded: boolean,
  expandedRowIds: string[]
) => void;

// Arguments:
// rowId         - ID of the row that was toggled
// isExpanded    - true if now expanded, false if collapsed
// expandedRowIds - Array of all currently expanded row IDs
```

**Example:**
```javascript
accordionConfig={{
  enabled: true,
  onExpand: (rowId, isExpanded, expandedRowIds) => {
    console.log(`Row ${rowId} is now ${isExpanded ? 'expanded' : 'collapsed'}`);
    console.log('All expanded:', expandedRowIds);
    
    // Sync with state or URL
    setExpandedRows(expandedRowIds);
    
    // Fetch children data if needed
    if (isExpanded) {
      fetchChildrenForRow(rowId);
    }
  }
}}
```

**Returns:** `void`

---

#### onLoadMoreSubRows

Called when "See More" is clicked for paginated children.

```typescript
type OnLoadMoreSubRows = (
  parentRowId: string,
  newVisibleCount: number
) => void;

// Arguments:
// parentRowId   - ID of the parent row
// newVisibleCount - Number of children visible after clicking "See more"
```

**Example:**
```javascript
accordionConfig={{
  enabled: true,
  subRowLimit: 5,
  onLoadMoreSubRows: (parentRowId, newVisibleCount) => {
    console.log(`Show more for ${parentRowId}, now showing ${newVisibleCount}`);
    
    // Optionally fetch more children from API
    if (needsMoreData(parentRowId, newVisibleCount)) {
      fetchMoreChildren(parentRowId, newVisibleCount);
    }
  }
}}
```

**Returns:** `void`

---

### 12.7 Row Hover Action Callbacks

#### customJSX

Function that renders custom JSX when row is hovered.

```typescript
type CustomJSX = (row: RowLike) => React.ReactNode;
```

**Example:**
```javascript
rowHoverAction={{
  enable: true,
  customJSX: (row) => (
    <div className="hover-actions">
      <button onClick={(e) => {
        e.stopPropagation();  // Prevent row click
        handlePreview(row);
      }}>
        Preview
      </button>
      <button onClick={(e) => {
        e.stopPropagation();
        handleEdit(row);
      }}>
        Edit
      </button>
    </div>
  )
}}
```

**Returns:** `React.ReactNode`

---

#### getActionConfig

Function that returns dropdown action configuration for a row.

```typescript
type GetActionConfig = ({ rowData, rowId, headers, ...row }) => ActionConfig;

interface ActionConfig {
  categories: ActionCategory[];
}

interface ActionCategory {
  title: string;                      // Category header (can be empty)
  options: ActionOption[];
}

interface ActionOption {
  label: string;                      // Display text
  value: string;                      // Option identifier
  enable: boolean;                    // Is option enabled
  callBack: (actionData: RowLike & { rowIndex: number }) => void; // Click handler
}
```

**Example:**
```javascript
rowHoverAction={{
  enable: true,
  actionBoxConfigs: [{
    getActionConfig: ({ rowData, rowId, headers, ...row }) => ({
      categories: [{
        title: '',
        options: [
          {
            label: 'Edit',
            value: 'EDIT',
            enable: rowData.status?.value !== 'Locked',
            callBack: (row) => {
              console.log('Edit row:', row.rowId);
              openEditModal(row);
            }
          },
          {
            label: 'Delete',
            value: 'DELETE',
            enable: row.canDelete !== false,
            callBack: (row) => {
              confirmDelete(row.rowId);
            }
          }
        ]
      }]
    }),
    customSelectionJsx: <i className="icon_phoenix-vertical-menu" />
  }]
}}
```

---

#### disableRowHoverAction

Function to conditionally disable hover actions for specific rows.

```typescript
type DisableRowHoverAction = (row: RowLike) => boolean;
```

**Example:**
```javascript
<TableGrid
  disableRowHoverAction={(row) => {
    // Receives full row (RowLike), not just rowData
    return row.rowData?.status?.value === 'Inactive' ||
           row.rowData?.locked === true;
  }}
/>
```

**Returns:** `true` to disable, `false` to enable

---

### 12.8 sortComparator (Client-Side Sort)

Custom comparator for client-side sorting.

```typescript
type SortComparator = (
  a: RowLike,
  b: RowLike,
  sortColumn: string,
  sortOrder: number
) => number;

// Arguments:
// a, b        - Row objects to compare
// sortColumn  - Column key being sorted
// sortOrder   - 0 = ascending, 1 = descending

// Return value:
// < 0  - a should come before b
// > 0  - a should come after b
// 0    - maintain original order
```

**Example:**
```javascript
<TableGrid
  enableClientSideSort={true}
  sortComparator={(a, b, sortColumn, sortOrder) => {
    const aVal = a.rowData[sortColumn]?.value;
    const bVal = b.rowData[sortColumn]?.value;
    
    let comparison = 0;
    
    // Handle different data types
    if (sortColumn === 'name') {
      // String comparison
      comparison = (aVal || '').localeCompare(bVal || '');
    } else if (sortColumn === 'date') {
      // Date comparison
      comparison = new Date(aVal) - new Date(bVal);
    } else if (sortColumn === 'score') {
      // Number comparison
      comparison = (aVal || 0) - (bVal || 0);
    } else {
      // Default: try number, fallback to string
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal || '').localeCompare(String(bVal || ''));
      }
    }
    
    // Apply sort direction
    return sortOrder === 0 ? comparison : -comparison;
  }}
/>
```

**Returns:** `number` (-1, 0, or 1)

---

### 12.9 Cell Renderer Function

Custom render function for cell content.

```typescript
// TableGridCellRendererProps from types.ts
type CellRenderer = React.FC<TableGridCellRendererProps>;

interface TableGridCellRendererProps {
  // Core props
  rowData?: CellData | Record<string, CellData>;  // Cell's data object
  headerData?: HeaderData;            // Column configuration
  headerKey?: string;                 // Column key
  rowId?: string;                     // Row identifier
  cellIndex?: number;                 // Cell index in row
  rowIndex?: number;                  // Row index in data

  // Accordion props (when enabled)
  _isExpanded?: boolean;              // Is row expanded
  _isExpandable?: boolean;            // Has children
  _childrenCount?: number;            // Number of children

  // Optional (gated by disablePerfOptimization + needIsHoverProp)
  isHovered?: boolean;                // Is row hovered

  // All other row properties spread
  [key: string]: any;
}
```

**Example:**
```javascript
const StatusCellRenderer = memo(({ 
  rowData,           // { value: 'Active', customColor: '#green' }
  headerKey,         // 'status'
  rowIndex,          // 0
  _isExpanded,       // false
  _childrenCount,    // 3
  businessId,        // 12345 (from row)
}) => {
  const status = rowData?.value;
  const color = rowData?.customColor || '#666';
  
  return (
    <span 
      style={{ color }}
      title={`Row ${rowIndex}, Business ${businessId}`}
    >
      {status}
      {_childrenCount > 0 && ` (${_childrenCount} sub-items)`}
    </span>
  );
});

// Usage
const cellRenderer = {
  status: StatusCellRenderer
};
```

**Returns:** `React.ReactNode`

---

### 12.10 Header Cell Renderer Function

Custom render function for header content.

Header renderer also supports pre-created JSX elements:
- `<SomeHeader />` → static mode (no injected props)
- `<SomeHeader injectRendererProps />` → runtime `headerProps` are injected

```typescript
// HeaderRendererInput extends HeaderData — all HeaderData fields are available
type HeaderCellRenderer = (props: HeaderRendererInput) => React.ReactNode;

interface HeaderRendererInput extends HeaderData {
  isSorted?: boolean;                 // true if this column is the currently sorted column
  sortOrder?: number;                 // 0 (asc) or 1 (desc) — only present when isSorted is true
  // Plus all HeaderData fields: value, label, order?, enabled?, sortable?, fixed?,
  // copyToClipboard?, width?, minWidth?, maxWidth?, locked?, metadata?, etc.
}
```

**Example:**
```javascript
const headerCellRenderer = {
  status: memo(({ label, isSorted, sortOrder }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span>{label}</span>
      {isSorted && (
        <span className="sort-indicator">
          {sortOrder === 0 ? '↑' : '↓'}
        </span>
      )}
      <Tooltip content="Filter by status">
        <i className="icon-filter" />
      </Tooltip>
    </div>
  ))
};
```

**Returns:** `React.ReactNode`

---

### 12.11 Infinite Scroll loadMore

Called when user scrolls near the bottom of the table.

```typescript
type LoadMore = (page: number) => void;

// Arguments:
// page - Current page number (starts at 0, increments on each call)
```

**Example:**
```javascript
infiniteScrollProps={{
  enable: true,
  hasMore: hasMoreData,
  loadMore: (page) => {
    console.log('Loading page:', page);
    
    fetchData({ 
      page, 
      limit: 20 
    }).then(newItems => {
      setData(prev => [...prev, ...newItems]);
      setHasMore(newItems.length === 20);
    });
  },
  threshold: 250,
  useWindow: false
}}
```

**Returns:** `void`

---

### 12.12 onColumnConfigChange (TableGridColumnProvider)

Called when column config changes through resize, reorder, visibility toggle, bulk, or reset.

```typescript
type OnColumnConfigChange = (event: ColumnChangeEvent) => void;

interface ColumnChangeEvent {
  type: string;                // 'resize' | 'reorder' | 'visibility' | 'bulk' | 'reset' | 'init' (see COLUMN_CHANGE_TYPES)
  columnKey: string | null;    // null for 'bulk' and 'reset' types
  config: ColumnConfig;
}

interface ColumnConfig {
  columnWidths?: Record<string, number>;
  columnVisibility?: Record<string, boolean>;  // Sparse: only hidden columns (false). Missing key = visible.
  columnOrder?: string[] | null;
  lockedColumns?: string[] | Set<string>;
}
```

**Behavior details:**
- In controlled mode, this is the source of truth update signal; parent must apply returned `config`.
- In uncontrolled mode, payload is emitted after state commit (no stale pre-commit snapshot).
- In `resizeMode="onEnd"`, expect resize callback primarily at drag end (single commit).
- `bulk` type is emitted by ColumnCustomizer `onSave` mode — contains merged visibility + order changes in a single callback.
- `init` exists in `COLUMN_CHANGE_TYPES` for compatibility but is generally not emitted during standard interactions.
- When persistence is enabled (uncontrolled mode), `onColumnConfigChange` is still called for every change alongside the auto-save.

**Example:**
```jsx
<TableGridColumnProvider
  initialColumnConfig={{
    columnVisibility: { revenue: false },
    lockedColumns: ['name'],
  }}
  resizeMode="onEnd"
  onColumnConfigChange={({ type, columnKey, config }) => {
    console.log('Change type:', type);
    console.log('Column:', columnKey);
    console.log('Final config:', config);
  }}
>
  <ColumnCustomizer />
  <TableGrid tableData={tableData} />
</TableGridColumnProvider>
```

---

### Callback Quick Reference TableGrid

| Callback | Arguments | Returns | Description |
|----------|-----------|---------|-------------|
| `onHandleRowClick` | `(row: RowLike)` | `void` | Row clicked |
| `onHandleSingleCellClick` | `(cellInfo: SingleCellClickPayload)` | `void` | Cell clicked (global) |
| `onHandleHeaderSortClick` | `(sortInfo: SortConfig)` | `void` | Sort header clicked |
| `onHeaderClick` | `({ event, headerData, index, sortColumn, sortOrder })` | `boolean \| void` | Per-header click |
| `onCellClick` | `({ event, cellData, rowData, rowIndex, cellIndex, headerData, headerKey })` | `boolean \| void` | Per-cell click |
| `accordionConfig.onExpand` | `(rowId, isExpanded, expandedRowIds)` | `void` | Row expanded/collapsed |
| `accordionConfig.onLoadMoreSubRows` | `(parentRowId, newVisibleCount)` | `void` | "See more" clicked |
| `rowHoverAction.customJSX` | `(row: RowLike)` | `ReactNode` | Render hover content |
| `rowHoverAction.getActionConfig` | `({ rowData, rowId, headers, ...row })` | `ActionConfig` | Get dropdown actions |
| `disableRowHoverAction` | `(row: RowLike)` | `boolean` | Disable hover actions |
| `sortComparator` | `(a, b, sortColumn, sortOrder)` | `number` | Custom sort logic |
| `infiniteScrollProps.loadMore` | `(page: number)` | `void` | Load more data |
| `onColumnConfigChange` | `({ type, columnKey, config })` | `void` | Column state changed (provider) |
| `ColumnCustomizer.onColumnChange` | `({ type, ...meta })` | `void` | Customizer UI interaction callback |
| `cellRenderer[key]` | `(TableGridCellRendererProps)` | `ReactNode` | Render cell content |
| `headerCellRenderer[key]` | `(HeaderRendererInput)` | `ReactNode` | Render header content |

---

## 13. VirtualizedStyleTableGrid (react-virtualized API)

For teams familiar with `react-virtualized`, use `VirtualizedStyleTableGrid`:

### Declarative API (Column children)

```jsx
import VirtualizedStyleTableGrid from '@birdeye/elemental/core/components/TableGrid/VirtualizedStyleTableGrid';
import Column from '@birdeye/elemental/core/components/TableGrid/Column';

<VirtualizedStyleTableGrid
  rowCount={data.length}
  rowGetter={({ index }) => data[index]}
  onRowClick={(row) => console.log(row)}
  sortBy="name"
  sortDirection="ASC"
>
  <Column
    dataKey="name"
    label="Name"
    width={200}
    sortable
    cellRenderer={({ cellData, rowData }) => (
      <span>{cellData}</span>
    )}
  />
  <Column
    dataKey="email"
    label="Email"
    width={300}
    cellRenderer={({ cellData }) => (
      <a href={`mailto:${cellData}`}>{cellData}</a>
    )}
  />
  <Column dataKey="status" label="Status" width={100} />
</VirtualizedStyleTableGrid>
```

### Imperative API (columns prop)

```jsx
const columns = [
  {
    dataKey: 'name',
    label: 'Name',
    width: 200,
    sortable: true,
    cellRenderer: ({ cellData }) => <strong>{cellData}</strong>
  },
  {
    dataKey: 'email',
    label: 'Email',
    width: 300
  }
];

<VirtualizedStyleTableGrid
  rowCount={data.length}
  rowGetter={({ index }) => data[index]}
  columns={columns}
/>
```

### VirtualizedStyleTableGrid Column Options

`Column` (or each item in `columns`) supports:

| Option | Type | Notes |
|------|------|------|
| `dataKey` | `string` | Required key used to read row values |
| `label` | `string` | Header label |
| `width` | `number \| string` | Preferred fixed width input |
| `minWidth` | `number \| string` | Lower width bound |
| `maxWidth` | `number \| string` | Upper width bound |
| `sortable` | `boolean` | Enables sort indicator + click sorting |
| `disableSort` | `boolean` | Adapter shorthand; maps to `sortable: false` |
| `fixed` | `boolean` | Sticky/fixed column behavior |
| `enabled` | `boolean` | Visibility flag |
| `copyToClipboard` | `boolean` | Header-level copy affordance |
| `flexGrow` | `number` | If set without explicit width, adapter avoids fixed-width metadata |
| `cellRenderer` | `function` | React-virtualized style cell renderer |
| `headerRenderer` | `function` | React-virtualized style header renderer |
| `columnData` | `any` | Extra config payload passed through to renderers |

### react-virtualized CellRenderer Props

When using VirtualizedStyleTableGrid, cellRenderers receive react-virtualized style props:

```typescript
interface VirtualizedCellRendererProps {
  cellData?: any;             // The cell value
  rowData?: RowLike;          // Full row data
  columnData?: VirtualizedColumnConfig;  // Column configuration
  columnIndex?: number;       // Column index
  dataKey?: string;           // Column key
  rowIndex?: number;          // Row index
  isScrolling?: boolean;      // Whether the list is currently scrolling
  [key: string]: any;
}
```

---

## 14. Migration Strategies

### From AG Grid

```javascript
// AG Grid
<AgGrid
  columnDefs={[
    { field: 'name', headerName: 'Name', sortable: true },
    { field: 'age', headerName: 'Age' }
  ]}
  rowData={data}
  onRowClicked={(e) => console.log(e.data)}
/>

// Elemental TableGrid
const headerData = [
  { order: 0, value: 'name', label: 'Name', enabled: true, sortable: true },
  { order: 1, value: 'age', label: 'Age', enabled: true }
];

const tableData = {
  headerData,
  data: data.map((row, i) => ({
    rowId: row.id || `row-${i}`,
    rowData: {
      name: { value: row.name },
      age: { value: row.age }
    }
  }))
};

<TableGrid
  tableData={tableData}
  onHandleRowClick={(row) => console.log(row)}
/>
```

### From react-virtualized TableGrid

```jsx
// react-virtualized
<TableGrid
  width={800}
  height={600}
  rowCount={data.length}
  rowGetter={({ index }) => data[index]}
>
  <Column dataKey="name" label="Name" width={200} />
  <Column dataKey="age" label="Age" width={100} />
</TableGrid>

// Elemental VirtualizedStyleTableGrid (minimal changes!)
<VirtualizedStyleTableGrid
  rowCount={data.length}
  rowGetter={({ index }) => data[index]}
  height={600}
  width={800}
>
  <Column dataKey="name" label="Name" width={200} />
  <Column dataKey="age" label="Age" width={100} />
</VirtualizedStyleTableGrid>
```

### Data Transformation Utility

```javascript
/**
 * Transform flat array to TableGrid data structure
 */
const transformToTableData = (flatData, columns) => {
  const headerData = columns.map((col, index) => ({
    order: index,
    value: col.field || col.dataKey,
    label: col.headerName || col.label || col.field,
    enabled: col.enabled !== false,
    sortable: col.sortable || false,
    ...col
  }));

  const data = flatData.map((row, rowIndex) => ({
    rowId: row.id || row.rowId || `row-${rowIndex}`,
    rowData: columns.reduce((acc, col) => {
      const key = col.field || col.dataKey;
      const value = row[key];
      acc[key] = typeof value === 'object' ? value : { value };
      return acc;
    }, {})
  }));

  return { headerData, data };
};

// Usage
const { headerData, data } = transformToTableData(
  [{ name: 'John', age: 30 }],
  [{ field: 'name' }, { field: 'age' }]
);
```

---

## 15. Performance Optimization

### 1. Memoize Cell Renderers

```jsx
import { memo } from 'react';

// ✅ Good - Memoized
const MyCellRenderer = memo(({ rowData }) => (
  <span>{rowData?.value}</span>
));

// ❌ Bad - Creates new component each render
const cellRenderer = {
  name: ({ rowData }) => <span>{rowData?.value}</span>
};
```

### 2. Use Virtualization for Large Datasets

```jsx
// Enable for 20+ rows
virtualization={{
  enabled: true,
  rowHeight: 50,
  switchThreshold: 20
}}
```

### 3. disablePerfOptimization Behavior (TableGridRow Architecture)

```jsx
// Enables per-row hover state tracking for cells that opt-in with needIsHoverProp
<TableGrid disablePerfOptimization={true} />
```

- `TableBody` delegates each renderable row to `TableGridRow`.
- Hover state is managed inside each `TableGridRow`, not in `TableBody`.
- Hovering a row updates that row component instead of forcing a full body-level hover state update.
- `isHovered` is still gated by `disablePerfOptimization` and `needIsHoverProp` rules.

### 4. Stable References

```jsx
// ✅ Define outside component or useMemo
const cellRenderer = useMemo(() => ({
  name: NameRenderer,
  status: StatusRenderer
}), []);

// ❌ Creates new object every render
<TableGrid cellRenderer={{ name: NameRenderer }} />
```

### 5. Prefer `resizeMode="onEnd"` for Heavy Tables

```jsx
// ✅ Recommended for large/expensive tables
<TableGridColumnProvider resizeMode="onEnd">
  <TableGrid tableData={tableData} />
</TableGridColumnProvider>

// Use `onChange` only when live resize feedback in app state is required
<TableGridColumnProvider resizeMode="onChange">
  <TableGrid tableData={tableData} />
</TableGridColumnProvider>
```

`onEnd` minimizes rerenders and callback frequency by committing once at mouseup.

---

## 16. Complete Examples

### Basic TableGrid

```jsx
import TableGrid from '@birdeye/elemental/core/components/TableGrid';

const BasicTableGrid = ({ data }) => {
  const headerData = [
    { order: 0, value: "name", label: "Name", enabled: true, sortable: true },
    { order: 1, value: "email", label: "Email", enabled: true },
    { order: 2, value: "status", label: "Status", enabled: true }
  ];

  const transformedData = data.map((item, i) => ({
    rowId: item.id || `row-${i}`,
    rowData: {
      name: { value: item.name },
      email: { value: item.email },
      status: { value: item.status }
    }
  }));

  const cellRenderer = {
    name: memo(({ rowData }) => <strong>{rowData?.value}</strong>),
    email: memo(({ rowData }) => <a href={`mailto:${rowData?.value}`}>{rowData?.value}</a>),
    status: memo(({ rowData }) => <StatusBadge status={rowData?.value} />)
  };

  return (
    <TableGrid
      tableData={{ headerData, data: transformedData }}
      cellRenderer={cellRenderer}
      onHandleRowClick={(row) => console.log(row)}
      onHandleHeaderSortClick={(sort) => console.log(sort)}
      sort={{ sortby: "name", sortOrder: 0 }}
      loaderProps={{ isLoading: false }}
      noDataProps={{ title: "No results found" }}
    />
  );
};
```

### Full-Featured TableGrid

```jsx
const FullFeaturedTable = () => {
  const tableRef = useRef(null);
  const [data, setData] = useState(initialData);
  const [hasMore, setHasMore] = useState(true);

  const headerData = [
    { order: 0, value: "location", label: "Location", enabled: true, sortable: true, fixed: true },
    { order: 1, value: "business", label: "Business", enabled: true, sortable: true },
    { order: 2, value: "status", label: "Status", enabled: true }
  ];

  return (
    <div style={{ height: '600px' }} ref={tableRef}>
      <TableGrid
        tableData={{ headerData, data }}
        tableContainerRef={tableRef}
        
        // Cell rendering
        cellRenderer={cellRenderers}
        headerCellRenderer={headerRenderers}
        
        // Event handlers
        onHandleRowClick={handleRowClick}
        onHandleSingleCellClick={handleCellClick}
        onHandleHeaderSortClick={handleSort}
        
        // Sorting
        enableClientSideSort={true}
        sort={{ sortby: "location", sortOrder: 0 }}
        
        // Virtualization
        virtualization={{
          enabled: true,
          rowHeight: 50,
          overscan: 5
        }}
        
        // Infinite scroll
        infiniteScrollProps={{
          enable: true,
          hasMore,
          loadMore: loadMoreData
        }}
        
        // Accordion
        accordionConfig={{
          enabled: true,
          maxExpandedRows: 2,
          subRowLimit: 5
        }}
        
        // Row actions
        rowHoverAction={{
          enable: true,
          actionBoxConfigs: [actionConfig]
        }}
        
        // Metadata
        metadataConfig={{
          tr: { className: "custom-row" },
          th: { '*': { className: "custom-header" } },
          td: { '*': { className: "custom-cell" } }
        }}
        
        // Display
        isFirstColumnFixed={true}
        isHeaderFixed={true}
        customHeadersFixWidth={{ location: "200px", business: "300px" }}
        
        // Loading states
        loaderProps={{ isLoading: false }}
        noDataProps={{ title: "No data available" }}
      />
    </div>
  );
};
```

### Column Resizing + Customizer + Controlled Persistence

```jsx
import {
  TableGridColumnProvider,
  COLUMN_CHANGE_TYPES,
} from '@birdeye/elemental/core/components/TableGrid/context/TableGridColumnContext';
import TableGrid from "@birdeye/elemental/core/components/TableGrid"
import ColumnCustomizer from '@birdeye/elemental/core/components/TableGrid/ColumnCustomizer';

const AdvancedTable = ({ tableData, savedConfig }) => {
  const [columnConfig, setColumnConfig] = useState(savedConfig);

  const handleColumnConfigChange = useCallback(({ type, config }) => {
    setColumnConfig(config);

    if (
      type === COLUMN_CHANGE_TYPES.RESIZE ||
      type === COLUMN_CHANGE_TYPES.REORDER ||
      type === COLUMN_CHANGE_TYPES.VISIBILITY ||
      type === COLUMN_CHANGE_TYPES.BULK
    ) {
      persistColumnConfig(config);
    }
  }, []);

  return (
    <TableGridColumnProvider
      columnConfig={columnConfig}
      onColumnConfigChange={handleColumnConfigChange}
      resizeMode="onEnd"
      minColumnWidth={80}
      maxColumnWidth={500}
      enableResize={true}
      enableReorder={true}
      enableVisibilityToggle={true}
    >
      <ColumnCustomizer
        title="Columns"
        onColumnChange={(change) => console.log('Customizer action:', change)}
      />
      <TableGrid tableData={tableData} />
    </TableGridColumnProvider>
  );
};
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ DATA STRUCTURE                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ tableData: {                                                                │
│   headerData: [{ order, value, label, enabled, sortable? }],               │
│   data: [{ rowId, rowData: { [columnKey]: { value, ...custom } } }]        │
│ }                                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ CELL RENDERER PROPS                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ { rowData, headerData, headerKey, rowId, rowIndex, cellIndex,              │
│   _rowType, _isExpanded, _isExpandable, _childrenCount }                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ METADATA CONFIG                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ metadataConfig: {                                                           │
│   table, tableContainer, tableWrapper,                                      │
│   tr: {},  th: { '*': {}, columnKey: {} },  td: { '*': {}, columnKey: {} } │
│ }                                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ ACCORDION DATA                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ { rowId, rowData, children: [{ rowId, rowData }], expandedRowData? }       │
├─────────────────────────────────────────────────────────────────────────────┤
│ KEY PROP DEFAULTS                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ virtualization: { enabled: false, rowHeight: null, overscan: 5 }           │
│ accordionConfig: { enabled: false, maxExpandedRows: 0, subRowLimit: 0 }    │
│ sortDebounceWaitTime: 200                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Columns not showing | Check `enabled: true` in headerData |
| Sort not working | Ensure `sortable: true` on header |
| Virtualization not rendering | Container needs fixed height + ref |
| Legacy data not rendering | Array order must match headerData order |
| Cell click not firing | Check if accordion icon is intercepting |
| Hover actions not showing | Verify `rowHoverAction.enable: true` |
| Metadata not applying | Check merge order: global → column → inline |

---

## Implementation-Verified Caveats (Mar 2026)

1. Virtualization is intentionally bypassed when `accordionConfig.enabled=true`.
  `useVirtualization` returns full flattened rows in this mode because expandable rows have variable heights.

2. `onLoadMoreSubRows` receives the updated visible-child count after click.
  Signature is `(parentRowId, newVisibleCount)`.

3. `disabledStateForRow` is consumed as an object map by row ID in runtime logic.
  Preferred shape:
  ```js
  {
    "row-1": { isDisabled: true },
    "row-2": { isDisabled: false }
  }
  ```
  Runtime precedence is: `disabledStateForRow[rowId]?.isDisabled` first, then `rowData.isDisabled` fallback.

4. `VirtualizedStyleTableGrid` sort API differs from `TableGrid` sort API.
  - `VirtualizedStyleTableGrid`: `sortDirection` is string (`"ASC"` / `"DESC"`)
  - `TableGrid`: `sort.sortOrder` is numeric (`0` / `1`)

5. Column auto-fit (double-click resize handle) measures header content only.
  Body-cell measurement is currently disabled in implementation.

6. `virtualizedAdapter` maps `Column.width` to header `fixWidth` internally.
  For direct `TableGrid` usage, prefer `headerData.width` as the primary width field.

---
