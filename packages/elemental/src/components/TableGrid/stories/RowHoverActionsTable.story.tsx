import React from 'react';
import TableComponent from '../index';
import {
  rowHoverTableData,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS,
  TextCellRenderer,
  StatusCellRenderer,
  getActionConfig
} from './utils';

export const RowHoverActionsTableGrid = () => {
  const tableRef = React.useRef(null);

  return (
    <TableComponent
      tableData={rowHoverTableData}
      tableContainerRef={tableRef}
      loaderProps={COMMON_LOADER_PROPS}
      noDataProps={COMMON_NO_DATA_PROPS}
      isFirstColumnFixed={true}
      onHandleRowClick={(row) => console.log('Row clicked:', row)}
      cellRenderer={{
        businessName: TextCellRenderer,
        businessId: TextCellRenderer,
        totalLocations: TextCellRenderer,
        mappedLocations: TextCellRenderer,
        status: StatusCellRenderer
      }}
      rowHoverAction={{
        enable: true,
        customJSX: (row) => (
          <button
            style={{ marginRight: '8px', padding: '4px 8px', fontSize: '12px' }}
            onClick={() => console.log('Preview:', row)}
          >
            Preview
          </button>
        ),
        actionBoxConfigs: [
          {
            getActionConfig: getActionConfig,
            popOverDirection: 'left',
            customSelectionJsx: <span><i className="icon_phoenix-eye" /></span>
          },
          {
            getActionConfig: getActionConfig,
            popOverDirection: 'left',
            customSelectionJsx: <span><i className="icon_phoenix-vertical-menu" /></span>
          }
        ]
      }}
      disableRowHoverAction={() => false}
    />
  );
};

RowHoverActionsTableGrid.parameters = {
  docs: {
    description: {
      story: 'Table with row hover actions including custom JSX and action boxes.'
    }
  }
};
