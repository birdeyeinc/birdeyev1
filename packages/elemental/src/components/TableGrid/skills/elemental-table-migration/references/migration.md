# Migration Strategies — Elemental TableGrid

## From AG Grid

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

---

## From react-virtualized Table

```jsx
// react-virtualized
<Table width={800} height={600}
  rowCount={data.length}
  rowGetter={({ index }) => data[index]}
>
  <Column dataKey="name" label="Name" width={200} />
  <Column dataKey="age" label="Age" width={100} />
</Table>

// Elemental VirtualizedStyleTableGrid (minimal changes!)
import VirtualizedStyleTableGrid from '@birdeye/elemental/core/components/TableGrid/VirtualizedStyleTableGrid';
import Column from '@birdeye/elemental/core/components/TableGrid/Column';

<VirtualizedStyleTableGrid
  rowCount={data.length}
  rowGetter={({ index }) => data[index]}
  height={600} width={800}
>
  <Column dataKey="name" label="Name" width={200} />
  <Column dataKey="age" label="Age" width={100} />
</VirtualizedStyleTableGrid>
```

---

## VirtualizedStyleTableGrid (react-virtualized API)

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
  <Column dataKey="name" label="Name" width={200} sortable
    cellRenderer={({ cellData, rowData }) => <span>{cellData}</span>}
  />
  <Column dataKey="email" label="Email" width={300} />
</VirtualizedStyleTableGrid>
```

### Imperative API (columns prop)

```jsx
const columns = [
  { dataKey: 'name', label: 'Name', width: 200, sortable: true,
    cellRenderer: ({ cellData }) => <strong>{cellData}</strong> },
  { dataKey: 'email', label: 'Email', width: 300 }
];

<VirtualizedStyleTableGrid
  rowCount={data.length}
  rowGetter={({ index }) => data[index]}
  columns={columns}
/>
```

### VirtualizedStyleTableGrid Column Options

| Option | Type | Notes |
|--------|------|-------|
| `dataKey` | `string` | Required key for row values |
| `label` | `string` | Header label |
| `width` | `number \| string` | Preferred fixed width |
| `minWidth` | `number \| string` | Lower width bound |
| `maxWidth` | `number \| string` | Upper width bound |
| `sortable` | `boolean` | Enable sort |
| `disableSort` | `boolean` | Adapter shorthand; maps to `sortable: false` |
| `fixed` | `boolean` | Sticky column |
| `enabled` | `boolean` | Visibility flag |
| `copyToClipboard` | `boolean` | Metadata flag (passed through to renderers, no built-in UI) |
| `flexGrow` | `number` | If set without width, adapter avoids fixed-width metadata |
| `cellRenderer` | `function` | react-virtualized style renderer |
| `headerRenderer` | `function` | react-virtualized style header renderer |
| `columnData` | `any` | Extra config passed to renderers |

### react-virtualized CellRenderer Props

```typescript
interface VirtualizedCellRendererProps {
  cellData?: any;
  rowData?: RowLike;
  columnData?: VirtualizedColumnConfig;
  columnIndex?: number;
  dataKey?: string;
  rowIndex?: number;
  isScrolling?: boolean;
  [key: string]: any;
}
```

---

## Data Transformation Utility

```javascript
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
