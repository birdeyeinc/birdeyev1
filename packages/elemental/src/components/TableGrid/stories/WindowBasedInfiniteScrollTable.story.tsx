import React, { useCallback, useMemo } from 'react';
import TableComponent from '../index';
import {
  generateBasicRows,
  basicTableHeaders,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS,
  TextCellRenderer,
  StatusCellRenderer,
  getActionConfig
} from './utils';
import { TableGridColumnProvider } from '../context';

const InfiniteScrollTableWrapper = (props: any) => {
  const [data, setData] = React.useState(() => generateBasicRows(0, 20));
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const totalItems = 200;
  const pageSize = 20;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    setTimeout(() => {
      setData((prevData) => {
        const newItems = generateBasicRows(prevData.length, pageSize);
        const updatedData = [...prevData, ...newItems];
        setHasMore(updatedData.length < totalItems);
        return updatedData;
      });
      setIsLoading(false);
    }, 500);
  }, [isLoading, hasMore]);

  const tableData = useMemo(() => ({
    totalCount: totalItems,
    headerData: basicTableHeaders,
    data
  }), [data]);

  return (
    <>
      <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666', position: 'sticky', top: 0, backgroundColor: '#e3e3e3', zIndex: 1, padding: '5px' }}>
        Loaded: {data.length} / {totalItems} items | {hasMore ? 'Scroll down to load more...' : 'All items loaded!'}
      </p>
      <TableGridColumnProvider>
        <TableComponent
          {...props}
          tableData={tableData}
          infiniteScrollProps={{
            enable: true,
            hasMore,
            loadMore,
            loader: <div style={{ textAlign: 'center', padding: '20px' }}>Loading more items...</div>,
            useWindow: true,
            initialLoad: false
          }}
          isFirstColumnFixed
          disablePerfOptimization
          viewPortColumns={4.2}
          rowHoverAction={{
            enable: true,
            actionBoxConfigs: [
              {
                getActionConfig:  getActionConfig,
                popOverDirection: 'left',
                customSelectionJsx: <span><i className="icon_phoenix-eye" /></span>,
                usePortal: true,
              },
              {
                getActionConfig: getActionConfig,
                popOverDirection: 'left',
                customSelectionJsx: <span><i className="icon_phoenix-vertical-menu" /></span>,
                usePortal: true,
              }
            ]
          }}
          virtualization={{ enabled: true, useWindow: true }}
        />
      </TableGridColumnProvider>
    </>
  );
};

export const WindowBasedInfiniteScrollTableGrid = {
  render: (args: any) => <InfiniteScrollTableWrapper {...args} />,
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
        story: 'Table with infinite scroll pagination. Scroll down to load more data. Uses virtualization for optimal performance with large datasets.'
      }
    }
  }
};
