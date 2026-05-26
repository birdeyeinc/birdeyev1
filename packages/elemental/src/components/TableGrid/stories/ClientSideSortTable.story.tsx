import {
  sentimentTableHeaders,
  generateSentimentData,
  NameCellRenderer,
  SentimentScoreCellRenderer,
  TrendsCellRenderer,
  DistributionCellRenderer,
  CategoriesCellRenderer,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS
} from './utils';

type SortableSentimentRow = {
  rowData: Record<string, { value?: string | number }>;
};

export const ClientSideSortTableGrid = {
  args: {
    tableId: 'sentiment_analysis',
    tableData: {
      headerData: sentimentTableHeaders,
      data: generateSentimentData()
    },
    enableClientSideSort: true,
    sortComparator: (a: SortableSentimentRow, b: SortableSentimentRow, sortColumn: string, order: number) => {
      const aValue = a.rowData[sortColumn];
      const bValue = b.rowData[sortColumn];
      const aRaw = aValue?.value;
      const bRaw = bValue?.value;

      let comparison = 0;
      if (sortColumn === 'name') {
        const aText = typeof aRaw === 'string' ? aRaw : '';
        const bText = typeof bRaw === 'string' ? bRaw : '';
        comparison = aText.localeCompare(bText);
      } else if (sortColumn === 'sentiment-score') {
        const aNum = typeof aRaw === 'number' ? aRaw : 0;
        const bNum = typeof bRaw === 'number' ? bRaw : 0;
        comparison = aNum - bNum;
      }

      return order === 0 ? comparison : -comparison;
    },
    isHeaderFixed: true,
    tableContainerClass: 'sentiment-analysis-table',
    onHandleRowClick: (row: Record<string, unknown>) => console.log('Row clicked:', row),
    onHandleSingleCellClick: (cell: Record<string, unknown>) => console.log('Cell clicked:', cell),
    onHandleHeaderSortClick: (sort: Record<string, unknown>) => console.log('Sort:', sort),
    cellRenderer: {
      name: NameCellRenderer,
      'sentiment-score': SentimentScoreCellRenderer,
      trends: TrendsCellRenderer,
      distribution: DistributionCellRenderer,
      'most-mention-categories': CategoriesCellRenderer
    },
    customHeadersMaxWidth: {
      name: '200px',
      'sentiment-score': '140px',
      trends: '180px',
      distribution: '150px',
      'most-mention-categories': '290px'
    },
    customHeadersFixWidth: {
      name: '200px',
      'sentiment-score': '140px',
      trends: '180px',
      distribution: '150px',
      'most-mention-categories': '290px'
    },
    loaderProps: COMMON_LOADER_PROPS,
    noDataProps: COMMON_NO_DATA_PROPS
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with client-side sorting. Uses memoized cell renderers for optimal performance.'
      }
    }
  }
};
