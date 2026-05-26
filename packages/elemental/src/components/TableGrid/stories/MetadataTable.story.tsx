import {
  basicTableHeaders,
  generateRowsWithMetadata,
  metadataConfigExample,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS,
  TextCellRenderer,
  StatusCellRenderer
} from './utils';

export const MetadataTableGrid = {
  args: {
    tableData: {
      totalCount: 4,
      headerData: basicTableHeaders,
      data: generateRowsWithMetadata()
    },
    loaderProps: COMMON_LOADER_PROPS,
    noDataProps: COMMON_NO_DATA_PROPS,
    isFirstColumnFixed: true,
    metadataConfig: metadataConfigExample,
    onHandleRowClick: (row: Record<string, unknown>) => console.log('Row clicked:', row),
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
        story: `
**Metadata System** - Add custom attributes (className, style, id, data-*, etc.) to table elements.

### Hybrid Approach

1. **Global Config (metadataConfig prop)** - Define defaults for all elements:
\`\`\`js
metadataConfig: {
  tr: { className: 'default-row', 'data-testid': 'row' },
  th: {
    '*': { className: 'all-headers' },
    'status': { style: { minWidth: '100px' } }
  },
  td: {
    '*': { className: 'all-cells' },
    'location': { className: 'location-cell' }
  }
}
\`\`\`

2. **Inline Metadata (in data)** - Override per row/cell:
\`\`\`js
{
  rowId: 'special-row',
  metadata: { className: 'highlighted', id: 'important' },
  rowData: {
    status: {
      value: 'Active',
      metadata: { className: 'active-status' }
    }
  }
}
\`\`\`

### Merge Strategy
- **className**: Concatenated (global + inline)
- **style**: Shallow merged (inline overrides global)
- **Other attributes**: Inline overrides global
        `
      }
    }
  }
};
