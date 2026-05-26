import React, { useMemo } from 'react';
import TableComponent from '../index';
import {
  basicTableHeaders,
  generateBasicRows,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS,
  TextCellRenderer,
  StatusCellRenderer
} from './utils';

const VirtualizedTableWrapper = () => {
  const tableRef = React.useRef(null);

  const tableData = useMemo(() => ({
    totalCount: 1000,
    headerData: basicTableHeaders,
    data: generateBasicRows(0, 1000)
  }), []);

  return (
    <div style={{ height: '500px', overflow: 'auto' }} ref={tableRef}>
      <TableComponent
        tableData={tableData}
        tableContainerRef={tableRef}
        loaderProps={COMMON_LOADER_PROPS}
        noDataProps={COMMON_NO_DATA_PROPS}
        isFirstColumnFixed={true}
        virtualization={{
          enabled: true,
          rowHeight: 50,
          overscan: 10,
          switchThreshold: 50
        }}
        cellRenderer={{
          location: TextCellRenderer,
          business_name: TextCellRenderer,
          created: TextCellRenderer,
          created_by: TextCellRenderer,
          status: StatusCellRenderer
        }}
      />
    </div>
  );
};

export const VirtualizedTableGrid = {
  render: () => <VirtualizedTableWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Table with 1000 rows using virtualization for optimal rendering performance. Only visible rows are rendered in the DOM.'
      }
    }
  }
};
