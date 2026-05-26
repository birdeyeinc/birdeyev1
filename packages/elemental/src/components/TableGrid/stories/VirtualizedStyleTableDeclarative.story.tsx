import React from 'react';
import VirtualizedStyleTableGrid from '../VirtualizedStyleTable';
import Column from '../Column';
import {
  virtualizedSampleData,
  VirtualizedNameRenderer,
  VirtualizedSalaryRenderer,
  VirtualizedStatusRenderer,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS
} from './utils';

export const VirtualizedStyleTableGridDeclarative = () => {
  const tableRef = React.useRef(null);

  return (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        Using <code>&lt;Column&gt;</code> children for declarative column configuration (react-virtualized style)
      </p>
      <VirtualizedStyleTableGrid
        rowCount={virtualizedSampleData.length}
        rowGetter={({ index }) => virtualizedSampleData[index]}
        onRowClick={(row) => console.log('Row clicked:', row)}
        loaderProps={COMMON_LOADER_PROPS}
        noDataProps={COMMON_NO_DATA_PROPS}
        tableContainerRef={tableRef}
      >
        <Column dataKey="name" label="Employee Name" width={200} sortable cellRenderer={VirtualizedNameRenderer} />
        <Column dataKey="department" label="Department" width={150} sortable />
        <Column dataKey="salary" label="Salary" width={120} sortable cellRenderer={VirtualizedSalaryRenderer} />
        <Column dataKey="joinDate" label="Join Date" width={120} />
        <Column dataKey="status" label="Status" width={100} cellRenderer={VirtualizedStatusRenderer} />
      </VirtualizedStyleTableGrid>
    </div>
  );
};

VirtualizedStyleTableGridDeclarative.parameters = {
  docs: {
    description: {
      story: `
**VirtualizedStyleTableGrid with Column children** - Declarative API similar to react-virtualized.

\`\`\`jsx
import { VirtualizedStyleTableGrid, Column } from '@birdeye/elemental';

<VirtualizedStyleTable
  rowCount={data.length}
  rowGetter={({ index }) => data[index]}
  onRowClick={(row) => console.log(row)}
>
  <Column
    dataKey="name"
    label="Name"
    width={200}
    sortable
    cellRenderer={({ cellData }) => (
      <strong>{cellData}</strong>
    )}
  />
  <Column dataKey="age" label="Age" width={100} />
</VirtualizedStyleTableGrid>
\`\`\`
      `
    }
  }
};
