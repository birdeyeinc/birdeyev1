import React, { useMemo } from 'react';
import VirtualizedStyleTableGrid from '../VirtualizedStyleTable';
import {
  virtualizedSampleData,
  VirtualizedNameRenderer,
  VirtualizedSalaryRenderer,
  VirtualizedStatusRenderer,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS
} from './utils';

export const VirtualizedStyleTableGridImperative = () => {
  const tableRef = React.useRef(null);

  const columns = useMemo(() => [
    { dataKey: 'name', label: 'Employee Name', width: 200, sortable: true, cellRenderer: VirtualizedNameRenderer },
    { dataKey: 'department', label: 'Department', width: 150, sortable: true },
    { dataKey: 'salary', label: 'Salary', width: 120, sortable: true, cellRenderer: VirtualizedSalaryRenderer },
    { dataKey: 'joinDate', label: 'Join Date', width: 120 },
    { dataKey: 'status', label: 'Status', width: 100, cellRenderer: VirtualizedStatusRenderer }
  ], []);

  return (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        Using <code>columns</code> prop for imperative column configuration
      </p>
      <VirtualizedStyleTableGrid
        rowCount={virtualizedSampleData.length}
        rowGetter={({ index }) => virtualizedSampleData[index]}
        columns={columns}
        onRowClick={(row) => console.log('Row clicked:', row)}
        loaderProps={COMMON_LOADER_PROPS}
        noDataProps={COMMON_NO_DATA_PROPS}
        tableContainerRef={tableRef}
      />
    </div>
  );
};

VirtualizedStyleTableGridImperative.parameters = {
  docs: {
    description: {
      story: `
**VirtualizedStyleTableGrid with columns prop** - Imperative API for programmatic column configuration.

\`\`\`jsx
const columns = [
  {
    dataKey: 'name',
    label: 'Name',
    width: 200,
    sortable: true,
    cellRenderer: ({ cellData }) => <strong>{cellData}</strong>
  },
  { dataKey: 'age', label: 'Age', width: 100 }
];

<VirtualizedStyleTableGrid
  rowCount={data.length}
  rowGetter={({ index }) => data[index]}
  columns={columns}
/>
\`\`\`

**Column options:**
- \`dataKey\` (required): Key to access data
- \`label\`: Column header text
- \`width\`, \`minWidth\`, \`maxWidth\`: Sizing
- \`sortable\`: Enable sorting
- \`fixed\`: Sticky column
- \`cellRenderer\`: Custom cell renderer \`({ cellData, rowData, rowIndex, dataKey }) => JSX\`
- \`headerRenderer\`: Custom header renderer
      `
    }
  }
};
