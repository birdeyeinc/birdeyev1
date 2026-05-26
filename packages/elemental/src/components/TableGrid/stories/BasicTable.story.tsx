import { RowLike, SingleCellClickPayload, SortConfig } from '../types';
import {
  basicTableHeaders,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS,
  generateBasicRows,
  StatusCellRenderer,
} from './utils';

export const BasicTableGrid = {
  args: {
    tableData: {
      totalCount: 10,
      headerData: basicTableHeaders,
      data: generateBasicRows(0, 10)
    },
    loaderProps: COMMON_LOADER_PROPS,
    noDataProps: COMMON_NO_DATA_PROPS,
    isFirstColumnFixed: true,
    onHandleRowClick: undefined,
    onHandleSingleCellClick: undefined,
    onHandleHeaderSortClick: (sort: SortConfig) => console.log('Sort clicked:', sort),
    viewPortColumns: 4,
    cellRenderer: {
      // location: TextCellRenderer,
      // business_name: TextCellRenderer,
      // created: TextCellRenderer,
      // created_by: TextCellRenderer,
      status: StatusCellRenderer
    },
    disabledStateForRow: {
      'row-3': { isDisabled: true },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic table with sorting and custom cell renderers. Uses memoized components for optimal performance.'
      }
    }
  }
};
