# Features — Elemental TableGrid

## Metadata System

### Overview

The metadata system adds custom attributes (`className`, `style`, `id`, `data-*`, etc.) to table elements using a hybrid approach:

1. **Global Config** (`metadataConfig` prop) — Default attributes for all elements
2. **Inline Metadata** (in data) — Per-row/per-cell overrides

### Merge Strategy

| Attribute | Behavior |
|-----------|----------|
| `className` | **Concatenated** (global + inline) |
| `style` | **Shallow merged** (inline overrides global) |
| Other attrs | **Inline overrides global** |

### Global Configuration

```javascript
const metadataConfig = {
  table: { className: "custom-table", "data-table-id": "main-table" },
  tableContainer: { className: "table-container-custom" },
  tableWrapper: { className: "table-wrapper-custom" },
  tr: { className: "custom-row" },
  th: {
    '*': { className: "all-headers" },       // '*' applies to ALL columns
    'name': { className: "header-name" },
    'status': { className: "header-status", style: { minWidth: "100px" } }
  },
  td: {
    '*': { className: "all-cells" },
    'name': { className: "cell-name" },
    'status': { className: "cell-status", style: { fontWeight: 500 } }
  }
};
```

### Inline Metadata (Per Row/Cell)

```javascript
const data = [{
  rowId: "special-row",
  metadata: { className: "highlighted-row", "data-priority": "high" },
  rowData: {
    status: {
      value: "Active",
      metadata: { className: "active-status", style: { backgroundColor: "#e6f7e6" } }
    }
  }
}];
```

### Merge Example

```
Global td['status']: { className: "status-cell", style: { color: "blue" } }
Inline cell:         { className: "active", style: { fontWeight: 500 } }
Result:              className="base-cell status-cell active"
                     style={ color: "blue", fontWeight: 500 }
```

---

## Accordion (Expandable Rows)

### Data Structure

```javascript
const accordionData = [{
  rowId: "region-1",
  rowData: {
    name: { value: "North America" },
    count: { value: 3 }
  },
  expandedRowData: {                          // Optional: different data when expanded
    name: { value: "North America (Expanded)" }
  },
  children: [                                 // Makes this row expandable
    { rowId: "region-1-child-1", rowData: { name: { value: "USA" } } },
    { rowId: "region-1-child-2", rowData: { name: { value: "Canada" } } }
  ]
}];
```

### Configuration

```javascript
const accordionConfig = {
  enabled: true,                              // REQUIRED
  defaultExpandedRowIds: ['region-1'],        // Initially expanded rows
  maxExpandedRows: 2,                         // Max simultaneously expanded (0 = unlimited)
  subRowLimit: 3,                             // Show N children with "see more" (0 = show all)
  expandIconColumn: 'name',                   // Column to show expand icon
  disableExpand: false,                       // Disable all expand interactions
  onExpand: (rowId, isExpanded, expandedRowIds) => { /* ... */ },
  onLoadMoreSubRows: (parentRowId, newVisibleCount) => { /* ... */ }
};
```

---

## Virtualization

### Configuration

```javascript
const virtualization = {
  enabled: true,                    // Enable virtual scrolling
  rowHeight: 50,                    // Optional: fixed row height (auto-measured from first row if omitted)
  overscan: 5,                      // Extra rows above/below viewport (default: 5)
  switchThreshold: 20,              // Min rows before enabling (default: 20)
  useWindow: false                  // Use window for scroll tracking instead of container (default: false)
};
```

The scroll container **must** have a fixed height. The virtualization hook auto-detects the scrollable parent by walking up the DOM from `<tbody>`, looking for the first element with `overflow-y: auto|scroll` and `scrollHeight > clientHeight`. You do NOT need to pass a ref for virtualization to work — just ensure an ancestor has fixed height and overflow:

```jsx
<div style={{ height: '500px', overflow: 'auto' }}>
  <TableGrid
    tableData={tableData}
    virtualization={virtualization}
  />
</div>
```

### Important Notes

- `rowHeight` is optional; if omitted, first visible row is measured after a 50ms delay (with up to 3 retries)
- If accordion is enabled, virtualization is **automatically disabled** (variable row heights make it unreliable)
- Can be combined with infinite scroll
- `switchThreshold` controls the minimum data length before virtualization activates when infinite scroll is also enabled

### Virtualization + Infinite Scroll (`useWindow`)

Align both configs for window-based scrolling:

```jsx
<TableGrid
  tableData={tableData}
  virtualization={{ enabled: true, rowHeight: 50, useWindow: true }}
  infiniteScrollProps={{
    enable: true, useWindow: true, hasMore, loadMore, threshold: 250,
  }}
/>
```

---

## Infinite Scroll

### Configuration

```javascript
const infiniteScrollProps = {
  enable: true,
  hasMore: true,
  loadMore: () => { /* fetch more data */ },
  loader: <div>Loading...</div>,
  useWindow: false,                 // Use window scroll vs container scroll
  threshold: 250,                   // Distance from bottom to trigger (px)
  initialLoad: false
};
```

### Example

```jsx
const [data, setData] = useState([]);
const [hasMore, setHasMore] = useState(true);

const loadMore = useCallback(() => {
  fetchMoreData().then(newItems => {
    setData(prev => [...prev, ...newItems]);
    setHasMore(newItems.length > 0);
  });
}, []);

<TableGrid
  tableData={{ headerData, data }}
  infiniteScrollProps={{ enable: true, hasMore, loadMore, loader: <Spinner /> }}
/>
```

---

## Sorting

### Server-Side Sorting (Default)

```javascript
<TableGrid
  tableData={tableData}
  onHandleHeaderSortClick={(sort) => {
    fetchData({ orderBy: sort.sortby, order: sort.sortOrder === 0 ? 'asc' : 'desc' });
  }}
  sort={{ sortby: "name", sortOrder: 0 }}
  sortDebounceWaitTime={300}
/>
```

### Client-Side Sorting

```javascript
<TableGrid
  tableData={tableData}
  enableClientSideSort={true}
  sortComparator={(a, b, sortColumn, sortOrder) => {
    const aVal = a.rowData[sortColumn]?.value;
    const bVal = b.rowData[sortColumn]?.value;
    const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : (aVal || 0) - (bVal || 0);
    return sortOrder === 0 ? cmp : -cmp;
  }}
/>
```

---

## Row Hover Actions

### Configuration

```javascript
const rowHoverAction = {
  enable: true,
  customJSX: (row) => (
    <button onClick={(e) => { e.stopPropagation(); handlePreview(row); }}>
      Preview
    </button>
  ),
  removeActionBoxes: false,
  actionBoxConfigs: [{
    getActionConfig: ({ rowData, rowId, headers, ...row }) => ({  // receives { ...row, headers }
      categories: [{
        title: "",
        options: [
          { label: "Edit", value: "EDIT", enable: true, callBack: handleEdit },
          { label: "Delete", value: "DELETE", enable: true, callBack: handleDelete }
        ]
      }]
    }),
    customSelectionJsx: <i className="icon_phoenix-vertical-menu" />,
    popOverDirection: "left"
  }]
};

<Table
  tableData={tableData}
  rowHoverAction={rowHoverAction}
  disableRowHoverAction={(row) => row.rowData?.status?.value === 'Inactive'}  // receives full row (RowLike), not just rowData
/>
```
