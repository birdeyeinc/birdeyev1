# Event Handlers & Callbacks — Elemental TableGrid

## onHandleRowClick

Called when a row is clicked.

`receiveNormalizedDataStructure` behavior:
- `false` (default): if legacy array-based input was normalized internally, callback receives denormalized legacy row shape.
- `true`: callback always receives normalized key-value row shape.

```typescript
// RowLike = NormalizedRow | LegacyRow | GenericRecord
type OnHandleRowClick = (row: RowLike) => void;

// After internal normalization, the row object has this shape (NormalizedRow):
interface NormalizedRow {
  rowId?: string;              // Always provide — needed for accordion, disabled state, and stable React keys (falls back to `row-${index}` but accordion breaks without it)
  rowData: Record<string, CellData>;
  expandedRowData?: Record<string, CellData>;
  metadata?: Record<string, any>;
  isDisabled?: boolean;
  children?: NormalizedRow[];
  _originalRowData?: Record<string, CellData> | CellData[];
  _isNormalized?: boolean;
  _rowType?: 'parent' | 'child' | 'seeMore';
  _isExpanded?: boolean;
  _isExpandable?: boolean;
  _childrenCount?: number;
  _parentIndex?: number;
  _flatIndex?: number;
  _parentRowId?: string;
  _childIndex?: number;
  _isLastChild?: boolean;
  _currentVisibleCount?: number;
  _totalCount?: number;
  _remainingCount?: number;
  originalIndex?: number;
  [key: string]: any;
}
```

```javascript
<TableGrid
  onHandleRowClick={(row) => {
    console.log('Row ID:', row.rowId);
    console.log('Name:', row.rowData.name?.value);
    router.push(`/details/${row.rowId}`);
  }}
/>
```

---

## onHandleSingleCellClick

Called when a cell is clicked (after per-cell handlers if they return true).

```typescript
type OnHandleSingleCellClick = (cellInfo: SingleCellClickPayload) => void;

// Actual type: SingleCellClickPayload = { ... } & GenericRecord
interface SingleCellClickPayload {
  event: React.MouseEvent;
  rowData: RowLike;
  rowIndex: number;
  cellIndex: number;
  headerData: HeaderData;
  headerKey: string;
  row_value?: any;             // The cell's value (optional)
  [key: string]: any;          // Additional cell props spread via GenericRecord
}
```

---

## onHandleHeaderSortClick

Called when a sortable header is clicked. Debounced by `sortDebounceWaitTime` (default: 200ms).

**Sort toggle logic** (from `index.tsx` `handleHeaderSortClick`):
- Clicking the **same column**: toggles `sortOrder` between `0` and `1`
- Clicking a **different column**: sets new `sortby` and resets `sortOrder` to `0`

```typescript
type OnHandleHeaderSortClick = (sortInfo: SortConfig) => void;

interface SortConfig {
  sortby: string;              // Column key clicked
  sortOrder: number;           // 0 = ascending, 1 = descending
}
```

---

## onHeaderClick (Per-Header)

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
```

**Returns:** `false` → prevents sort trigger. `true` or `undefined` → allows sort.

---

## onCellClick (Per-Cell)

Per-cell click handler. Can be defined on cellData or headerData.

```typescript
type OnCellClick = (args: CellClickPayload) => boolean | void;

interface CellClickPayload {
  event: React.MouseEvent;
  cellData: CellData | GenericRecord;
  rowData: RowLike;
  rowIndex: number;
  cellIndex: number;
  headerData: HeaderData;
  headerKey: string;
}
```

**Priority Chain:**
1. `cellData.onCellClick` (specific cell) — checked first
2. `headerData.onCellClick` (column-wide) — checked if no cell callback
3. `onHandleSingleCellClick` (global) — called if above return `true`/`undefined`

**Returns:** `false` → prevents `onHandleSingleCellClick` + stops propagation. `true`/`undefined` → allows global callback.

---

## Accordion Callbacks

### onExpand

```typescript
type OnExpand = (
  rowId: string,
  isExpanded: boolean,
  expandedRowIds: string[]
) => void;
```

```javascript
accordionConfig={{
  enabled: true,
  onExpand: (rowId, isExpanded, expandedRowIds) => {
    if (isExpanded) fetchChildrenForRow(rowId);
    setExpandedRows(expandedRowIds);
  }
}}
```

### onLoadMoreSubRows

Called when "See More" is clicked for paginated children.

```typescript
type OnLoadMoreSubRows = (
  parentRowId: string,
  newVisibleCount: number   // children visible AFTER clicking "See more"
) => void;
```

---

## Row Hover Action Callbacks

### customJSX

```typescript
type CustomJSX = (row: RowLike) => React.ReactNode;
```

### getActionConfig

Called per action box to build the menu. The argument is the full row object **plus** the `headers` array (verified from `TableBody.tsx:465`: `actionBoxconfig?.getActionConfig({ ...row, headers })`).

```typescript
type GetActionConfig = (rowWithHeaders: RowLike & { headers: HeaderData[] }) => ActionConfig;

interface ActionConfig {
  categories: [{
    title: string;
    options: [{
      label: string;
      value: string;
      enable: boolean;
      callBack: (actionData: RowLike & { rowIndex: number }) => void;
      // callBack receives { ...row, rowIndex } (from TableBody.tsx:466 handleActionChange)
    }]
  }];
}
```

### disableRowHoverAction

Receives the full row object (`RowLike`, not just `rowData`). Verified from `TableBody.tsx:452`: `disableRowHoverAction?.(row)`.

```typescript
type DisableRowHoverAction = (row: RowLike) => boolean;
// true = disabled (hover actions hidden), false = enabled
```

---

## sortComparator (Client-Side Sort)

```typescript
type SortComparator = (
  a: RowLike,
  b: RowLike,
  sortColumn: string,
  sortOrder: 0 | 1
) => number;
// Return: < 0 (a first), > 0 (b first), 0 (keep order)
```

```javascript
<Table
  enableClientSideSort={true}
  sortComparator={(a, b, sortColumn, sortOrder) => {
    const aVal = a.rowData[sortColumn]?.value;
    const bVal = b.rowData[sortColumn]?.value;
    const cmp = typeof aVal === 'string'
      ? aVal.localeCompare(bVal)
      : (aVal || 0) - (bVal || 0);
    return sortOrder === 0 ? cmp : -cmp;
  }}
/>
```

---

## Infinite Scroll loadMore

```typescript
type LoadMore = (page: number) => void;
// page starts at 0, increments on each call
```

---

## onColumnConfigChange (TableGridColumnProvider)

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

- In controlled mode, parent must apply returned `config`.
- In uncontrolled mode, payload is emitted after state commit.
- In `resizeMode="onEnd"`, resize callback fires at drag end only.
- `bulk` type is emitted by ColumnCustomizer `onSave` mode — contains merged visibility + order in a single callback.
- When persistence is enabled, `onColumnConfigChange` is still called alongside auto-save.

---

## applyBulkConfig (Context Method)

Available via `useTableGridColumns()`. Applies multiple config changes atomically.

```typescript
type ApplyBulkConfig = (updates: {
  columnWidths?: Record<string, number>;
  columnVisibility?: Record<string, boolean>;
  columnOrder?: string[] | null;
  lockedColumns?: string[];
}) => void;
```

- Controlled mode: emits single `onColumnConfigChange` with `type: 'bulk'`, `columnKey: null`
- Uncontrolled mode: single reducer dispatch
- Used internally by ColumnCustomizer `onSave` to prevent stale-snapshot data loss

---

## Callback Quick Reference Table

| Callback | Arguments | Returns |
|----------|-----------|---------|
| `onHandleRowClick` | `(row: RowLike)` | `void` |
| `onHandleSingleCellClick` | `(cellInfo: SingleCellClickPayload)` | `void` |
| `onHandleHeaderSortClick` | `(sortInfo: SortConfig)` | `void` |
| `onHeaderClick` | `({ event, headerData, index, sortColumn, sortOrder })` | `boolean \| void` |
| `onCellClick` | `({ event, cellData, rowData, rowIndex, cellIndex, headerData, headerKey })` | `boolean \| void` |
| `accordionConfig.onExpand` | `(rowId, isExpanded, expandedRowIds)` | `void` |
| `accordionConfig.onLoadMoreSubRows` | `(parentRowId, newVisibleCount)` | `void` |
| `rowHoverAction.customJSX` | `(row: RowLike)` | `ReactNode` |
| `rowHoverAction.getActionConfig` | `({ ...row, headers })` | `ActionConfig` |
| `disableRowHoverAction` | `(row: RowLike)` | `boolean` |
| `sortComparator` | `(a, b, sortColumn, sortOrder)` | `number` |
| `infiniteScrollProps.loadMore` | `(page: number)` | `void` |
| `onColumnConfigChange` | `({ type, columnKey, config })` | `void` |
| `applyBulkConfig` | `({ columnWidths?, columnVisibility?, columnOrder?, lockedColumns? })` | `void` |
| `ColumnCustomizer.onColumnChange` | `({ type, ...meta })` | `void` |
| `cellRenderer[key]` | `(TableGridCellRendererProps)` | `ReactNode` |
| `headerCellRenderer[key]` | `(HeaderRendererInput)` — extends HeaderData with isSorted, sortOrder | `ReactNode` |
