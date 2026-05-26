import React, { useMemo } from 'react';
import VirtualizedStyleTableGrid from '../VirtualizedStyleTable';
import Column from '../Column';
import {
  virtualizedSampleData,
  VirtualizedSalaryRenderer,
  VirtualizedStatusRenderer,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS
} from './utils';

type VirtualizedSampleRow = (typeof virtualizedSampleData)[number];
type SortDirection = 'ASC' | 'DESC';

const VirtualizedSortableTableGrid = () => {
  const tableRef = React.useRef(null);
  const [sortBy, setSortBy] = React.useState<keyof VirtualizedSampleRow>('name');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('ASC');

  const sortedData = useMemo(() => {
    const sorted = [...virtualizedSampleData];
    sorted.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      let comparison = 0;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      }

      return sortDirection === 'DESC' ? -comparison : comparison;
    });
    return sorted;
  }, [sortBy, sortDirection]);

  const handleHeaderClick = ({ sortby }: { sortby: string }) => {
    if (!(sortby in virtualizedSampleData[0])) return;
    const nextSortBy = sortby as keyof VirtualizedSampleRow;
    if (nextSortBy === sortBy) {
      setSortDirection((prev) => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(nextSortBy);
      setSortDirection('ASC');
    }
  };

  return (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        Sort by: <strong>{sortBy}</strong> ({sortDirection})
      </p>
      <VirtualizedStyleTableGrid
        rowCount={sortedData.length}
        rowGetter={({ index }) => sortedData[index]}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onHeaderClick={handleHeaderClick}
        loaderProps={COMMON_LOADER_PROPS}
        noDataProps={COMMON_NO_DATA_PROPS}
        tableContainerRef={tableRef}
      >
        <Column dataKey="name" label="Name" width={200} sortable />
        <Column dataKey="department" label="Department" width={150} sortable />
        <Column dataKey="salary" label="Salary" width={120} sortable cellRenderer={VirtualizedSalaryRenderer} />
        <Column dataKey="joinDate" label="Join Date" width={120} />
        <Column dataKey="status" label="Status" width={100} cellRenderer={VirtualizedStatusRenderer} />
      </VirtualizedStyleTableGrid>
    </div>
  );
};

export const VirtualizedStyleTableGridWithSort = {
  render: () => <VirtualizedSortableTableGrid />,
  parameters: {
    docs: {
      description: {
        story: `
**VirtualizedStyleTableGrid with controlled sorting** - Manage sort state externally.

\`\`\`jsx
const [sortBy, setSortBy] = useState('name');
const [sortDirection, setSortDirection] = useState('ASC');

<VirtualizedStyleTableGrid
  rowCount={data.length}
  rowGetter={({ index }) => sortedData[index]}
  sortBy={sortBy}
  sortDirection={sortDirection}
  onHeaderClick={({ sortby }) => {
    if (sortby === sortBy) {
      setSortDirection((prev) => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(sortby);
      setSortDirection('ASC');
    }
  }}
>
  <Column dataKey="name" label="Name" sortable />
  ...
</VirtualizedStyleTableGrid>
\`\`\`
        `
      }
    }
  }
};
