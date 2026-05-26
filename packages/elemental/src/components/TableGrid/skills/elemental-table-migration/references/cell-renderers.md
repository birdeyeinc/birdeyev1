# Cell Renderers — Elemental TableGrid

## Defining Cell Renderers

Cell renderers are React components keyed by column `value`:

```javascript
const cellRenderer = {
  name: NameCellRenderer,
  status: StatusCellRenderer,
  email: EmailCellRenderer
};
```

## Renderer Contract

- `cellRenderer[columnKey]` and `headerCellRenderer[columnKey]` support **both**:
  1. Component types (function/class, including `memo(...)` / `forwardRef(...)`), and
  2. Pre-created JSX elements.
- For pre-created JSX elements, default behavior is **static mode** (no prop injection, no `cloneElement`).
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

## Cell Renderer Props

Each cell renderer receives these props. **Important:** `rowData` here is the **cell-level** data object for the current column (e.g., `{ value: "Acme Corp", id: 123 }`), NOT the full row. The full row's properties are spread as `...rest` — access other columns' data via the spread props.

This comes from `TableBody.tsx` renderer function which sets `rowData: cellData` (where `cellData = rowData?.[headerKey]`), then spreads the entire row object via `...row`.

```typescript
// TableGridCellRendererProps from types.ts
interface TableGridCellRendererProps {
  // Core props — from TableBody.tsx renderer function
  rowData?: CellData | Record<string, CellData>;  // CELL-LEVEL data: rowData[headerKey]
  headerData?: HeaderData;    // Header configuration for this column
  headerKey?: string;         // Column key (e.g., "name")
  rowId?: string;             // Row's unique identifier
  cellIndex?: number;         // Cell index in the row
  rowIndex?: number;          // Row index in the data array

  // Accordion props (when enabled)
  _isExpanded?: boolean;      // Is this row expanded
  _isExpandable?: boolean;    // Has children
  _childrenCount?: number;    // Number of children

  // Optional (gated)
  // Passed only when:
  // 1) disablePerfOptimization=true, and
  // 2) needIsHoverProp is true at cellData or headerData level
  isHovered?: boolean;        // Is row currently hovered

  // All other row properties are spread
  [key: string]: any;
}
```

## Example Cell Renderers

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

## Header Cell Renderers

Header renderer also supports pre-created JSX elements:
- `<SomeHeader />` → static mode (no injected props)
- `<SomeHeader injectRendererProps />` → runtime `headerProps` are injected

```typescript
type HeaderCellRenderer = (props: HeaderRendererInput) => React.ReactNode;

// HeaderRendererInput extends HeaderData — all HeaderData fields are available
interface HeaderRendererInput extends HeaderData {
  isSorted?: boolean;         // true if this column is the currently sorted column
  sortOrder?: number;         // 0 (asc) or 1 (desc) — only present when isSorted is true
  // Plus all HeaderData fields: value, label, order?, enabled?, sortable?, fixed?,
  // copyToClipboard?, width?, minWidth?, maxWidth?, locked?, metadata?, etc.
}
```

```javascript
// Sort state is available per-cell via isSorted and sortOrder
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
// isSorted is a per-column boolean — only the sorted column receives true.
// This means memo-wrapped header renderers skip re-renders for non-sorted columns.
// VirtualizedStyleTable adapter maps isSorted/sortOrder to sortBy/sortDirection.
```

## Hover Prop Passing Rules

1. `disablePerfOptimization` must be `true`, otherwise `isHovered` is never passed.
2. Resolution: `cellData.needIsHoverProp ?? headerData.needIsHoverProp ?? false`.
3. Cell-level override first, then header-level, then default `false`.
