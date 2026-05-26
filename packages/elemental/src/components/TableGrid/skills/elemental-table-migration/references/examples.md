# Complete Examples — Elemental TableGrid

## Basic Table

```jsx
import TableGrid from '@birdeye/elemental/core/components/TableGrid';
import { memo } from 'react';

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

---

## Full-Featured Table

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
        cellRenderer={cellRenderers}
        headerCellRenderer={headerRenderers}
        onHandleRowClick={handleRowClick}
        onHandleSingleCellClick={handleCellClick}
        onHandleHeaderSortClick={handleSort}
        enableClientSideSort={true}
        sort={{ sortby: "location", sortOrder: 0 }}
        virtualization={{ enabled: true, rowHeight: 50, overscan: 5 }}
        infiniteScrollProps={{ enable: true, hasMore, loadMore: loadMoreData }}
        accordionConfig={{ enabled: true, maxExpandedRows: 2, subRowLimit: 5 }}
        rowHoverAction={{ enable: true, actionBoxConfigs: [actionConfig] }}
        metadataConfig={{
          tr: { className: "custom-row" },
          th: { '*': { className: "custom-header" } },
          td: { '*': { className: "custom-cell" } }
        }}
        isFirstColumnFixed={true}
        isHeaderFixed={true}
        customHeadersFixWidth={{ location: "200px", business: "300px" }}
        loaderProps={{ isLoading: false }}
        noDataProps={{ title: "No data available" }}
      />
    </div>
  );
};
```

---

## Column Customizer + Built-in Backend Persistence (Recommended)

```jsx
import TableGrid from '@birdeye/elemental/core/components/TableGrid';
import { TableGridColumnProvider } from '@birdeye/elemental/core/components/TableGrid/context';
import ColumnCustomizer from '@birdeye/elemental/core/components/TableGrid/ColumnCustomizer';
import type { GraphQLFetcher } from '@birdeye/elemental/core/components/TableGrid/context';

// Option 1: Generic fetcher (works with any HTTP client)
const myFetcher: GraphQLFetcher = async ({ query, variables }) => {
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
};

const PersistentTable = ({ tableData }) => {
  const [customizerOpen, setCustomizerOpen] = useState(false);

  // Memoize fetcher to avoid re-renders
  const fetcher = useMemo(() => myFetcher, []);

  return (
    <TableGridColumnProvider
      initialColumnConfig={{ lockedColumns: ['name'] }}
      enableResize={true}
      enableReorder={true}
      enableVisibilityToggle={true}
      resizeMode="onEnd"
      persistence={{
        fetcher,
        onError: (err) => console.error('Column config save failed:', err),
      }}
      onColumnConfigChange={({ type, config }) => {
        // Optional: react to changes locally (persistence is automatic)
        console.log('Config changed:', type, config);
      }}
    >
      <button onClick={() => setCustomizerOpen(true)}>Customize Columns</button>
      <ColumnCustomizer
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        applyMode="onSave"
      />
      <TableGrid tableId="my-contacts-table" tableData={tableData} />
    </TableGridColumnProvider>
  );
};

// Option 2: Birdeye apiResource (production pattern)
import { beNodeResource } from 'utils/apiHelper';

const BirdeyePersistentTableGrid = ({ tableData }) => (
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
);
```

---

## Column Resizing + Customizer + Controlled Persistence

```jsx
import TableGrid from '@birdeye/elemental/core/components/TableGrid';
import { TableGridColumnProvider, COLUMN_CHANGE_TYPES } from '@birdeye/elemental/core/components/TableGrid/context';
import ColumnCustomizer from '@birdeye/elemental/core/components/TableGrid/ColumnCustomizer';

const AdvancedTable = ({ tableData, savedConfig }) => {
  const [columnConfig, setColumnConfig] = useState(savedConfig);
  const [customizerOpen, setCustomizerOpen] = useState(false);

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
      <button onClick={() => setCustomizerOpen(true)}>Customize Columns</button>
      <ColumnCustomizer
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        applyMode="onSave"
        onSave={({ visibility, order }) => {
          console.log('Saved column config:', visibility, order);
        }}
        title="Columns"
        showSearch={true}
        showResetButton={true}
      />
      <TableGrid tableData={tableData} />
    </TableGridColumnProvider>
  );
};
```

---

## Custom Loader and No-Data Components

Use `customJsx` in `loaderProps` or `noDataProps` to replace the default loader/empty-state UI with your own component.

```jsx
const MyLoader = () => <div className="my-spinner">Loading...</div>;
const MyEmptyState = () => (
  <div className="my-empty">
    <img src="/no-data.svg" />
    <p>Nothing here yet</p>
  </div>
);

<TableGrid
  tableData={{ headerData, data }}
  loaderProps={{
    isLoading: isLoading,
    loaderClassName: "loader-wrapper",
    customJsx: MyLoader,          // replaces default LoaderBox
  }}
  noDataProps={{
    customJsx: MyEmptyState,      // replaces default NoDataSimple
  }}
/>
```

> **Note:** `customJsx` receives no props. If you need to pass data into the component, close over it or use a wrapper component.
