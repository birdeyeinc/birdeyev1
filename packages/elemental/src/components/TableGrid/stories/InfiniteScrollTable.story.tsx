import * as React from 'react';
import TableComponent from '../index';
import type { TableGridProps } from '../types';
import {
  generateBasicRows,
  basicTableHeaders,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS,
  TextCellRenderer,
  StatusCellRenderer
} from './utils';

const PAGE_SIZE = 20;
const TOTAL_ITEMS = 200;

const InfiniteScrollTableWrapper = (props: Partial<TableGridProps>) => {
  const tableRef = React.useRef<HTMLDivElement | null>(null);
  const [data, setData] = React.useState(() => generateBasicRows(0, PAGE_SIZE));
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const loadMore = React.useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      setData((prevData) => {
        const nextBatch = generateBasicRows(prevData.length, PAGE_SIZE);
        const updatedData = [...prevData, ...nextBatch].slice(0, TOTAL_ITEMS);

        setHasMore(updatedData.length < TOTAL_ITEMS);
        return updatedData;
      });
      setIsLoadingMore(false);
    }, 500);
  }, [hasMore, isLoadingMore]);

  const tableData = React.useMemo(() => ({
    totalCount: TOTAL_ITEMS,
    headerData: basicTableHeaders,
    data
  }), [data]);

  return (
    <div>
      <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
        Loaded: {data.length} / {TOTAL_ITEMS} items {hasMore ? '(scroll to load more)' : '(all items loaded)'}
      </p>
      <div style={{ height: '460px', overflow: 'auto' }} ref={tableRef}>
        <TableComponent
          {...props}
          tableContainerRef={tableRef}
          tableData={tableData}
          infiniteScrollProps={{
            enable: true,
            hasMore,
            loadMore,
            loader: <div style={{ textAlign: 'center', padding: '16px' }}>Loading more items...</div>,
            useWindow: false,
            initialLoad: false,
            threshold: 120
          }}
          virtualization={{ enabled: true, rowHeight: 50, overscan: 8, switchThreshold: 20 }}
        />
      </div>
    </div>
  );
};

export const InfiniteScrollTableGrid = {
  render: (args: Partial<TableGridProps>) => <InfiniteScrollTableWrapper {...args} />,
  args: {
    loaderProps: COMMON_LOADER_PROPS,
    noDataProps: COMMON_NO_DATA_PROPS,
    tableContainerClass: 'infinite-scroll-table',
    cellRenderer: {
      location: TextCellRenderer,
      business_name: TextCellRenderer,
      created: TextCellRenderer,
      created_by: TextCellRenderer,
      status: StatusCellRenderer
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with container-based infinite scroll. Scroll inside the table container to fetch additional rows.'
      }
    }
  }
};
