// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useCallback, useMemo, useState } from 'react';
import TableComponent from '../index';
import { TableGridColumnProvider } from '../context/TableGridColumnContext';
import type { ColumnChangeEvent, ColumnConfig } from '../types';
import {
  RESIZABLE_TABLE_DATA,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS,
  StatusCellRenderer
} from './utils';

const CellRendereMap = {    
  // location: LocationCellRenderer,
  // business_name: TextCellRenderer,
  // created: TextCellRenderer,
  // created_by: TextCellRenderer,
  status: StatusCellRenderer,
}

const ColumnResizingDemo = () => {
  const [config, setConfig] = useState<ColumnConfig | null>(null);

  const tableData = useMemo(() => {
    const headerData = RESIZABLE_TABLE_DATA.headerData.map((header) => {
      if (header.value === 'email') {
        return {
          ...header,
          width: 260,
          minWidth: 220,
          maxWidth: 340,
        };
      }

      if (header.value === 'status') {
        return {
          ...header,
          minWidth: 90,
        };
      }

      return header;
    });

    return {
      ...RESIZABLE_TABLE_DATA,
      headerData,
    };
  }, []);

  const handleConfigChange = useCallback(({ type, columnKey, config }: ColumnChangeEvent) => {
    console.log('Column config changed:', { type, columnKey, config });
    setConfig(config);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <strong>How to use:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '13px' }}>
          <li>Drag the gray line between column headers to resize</li>
          <li>Double-click the resize handle to auto-fit column width to content</li>
          <li>Email uses header-level width constraints: width 260, min 220, max 340</li>
          <li>Resize state is preserved across re-renders</li>
        </ul>
      </div>

      <TableGridColumnProvider
        enableResize={true}
        onColumnConfigChange={handleConfigChange}
        resizeMode='onChange'
      >
        <TableComponent
          tableData={tableData}
          cellRenderer={CellRendereMap}
          loaderProps={COMMON_LOADER_PROPS}
          noDataProps={COMMON_NO_DATA_PROPS}
          tableContainerClass="resizable-table-demo"
          viewPortColumns={3}
          isFirstColumnFixed
        />
      </TableGridColumnProvider>

      {config && (
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f7ff', borderRadius: '8px' }}>
          <strong>Current Column Widths:</strong>
          <pre style={{ margin: '8px 0', fontSize: '12px' }}>
            {JSON.stringify(config.columnWidths, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export const ColumnResizingOnChange = {
  render: () => <ColumnResizingDemo />,
  parameters: {
    docs: {
      description: {
        story: `
**Column Resizing** - Drag column edges to resize, double-click to auto-fit.

Wrap your Table with \`TableGridColumnProvider\` to enable column resizing:

\`\`\`jsx
import { TableGridColumnProvider } from 'elemental';

<TableGridColumnProvider
  enableResize={true}
  minColumnWidth={80}
  maxColumnWidth={400}
  onColumnConfigChange={({ type, columnKey, config }) => {
    console.log('Resize:', config.columnWidths);
  }}
>
  <Table tableData={...} />
</TableGridColumnProvider>
\`\`\`

**Features:**
- Drag gray line between headers to resize
- Double-click to auto-fit column to content (Excel-like)
- Visual feedback: line turns blue on hover/drag
- Min/max constraints prevent extreme widths
- Config callback for persistence
        `
      }
    }
  }
};
