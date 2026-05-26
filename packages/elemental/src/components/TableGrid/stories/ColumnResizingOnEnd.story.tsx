// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useCallback, useMemo, useState } from 'react';
import TableComponent from '../index';
import { TableGridColumnProvider } from '../context/TableGridColumnContext';
import type { ColumnChangeEvent } from '../types';
import {
  RESIZABLE_TABLE_DATA,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS,
  StatusCellRenderer,
} from './utils';

const CellRendererMap = {
  status: StatusCellRenderer,
};

interface ResizeEventLog {
  at: string;
  type: string;
  columnKey: string | null;
  widths: Record<string, number>;
}

const ColumnResizingOnEndDemo = () => {
  const [events, setEvents] = useState<ResizeEventLog[]>([]);

  const handleConfigChange = useCallback(({ type, columnKey, config }: ColumnChangeEvent) => {
    if (type !== 'resize') return;

    setEvents((prev) => {
      const next = [
        {
          at: new Date().toLocaleTimeString(),
          type,
          columnKey,
          widths: config?.columnWidths || {},
        },
        ...prev,
      ];
      return next.slice(0, 5);
    });
  }, []);

  const latestWidths = useMemo(() => {
    return events[0]?.widths || {};
  }, [events]);

  return (
    <div>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <strong>Resize Mode: onEnd </strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '13px' }}>
          <li>Drag updates width visually without committing React store on every mouse move</li>
          <li>Store/context is committed once on mouse up</li>
          <li>Reduces table-wide rerenders while dragging</li>
        </ul>
      </div>

      <div style={{height:"400px"}}>
        <TableGridColumnProvider
          enableResize={true}
          resizeMode="onEnd"
          onColumnConfigChange={handleConfigChange}
        >
          <TableComponent
            tableData={RESIZABLE_TABLE_DATA}
            cellRenderer={CellRendererMap}
            loaderProps={COMMON_LOADER_PROPS}
            noDataProps={COMMON_NO_DATA_PROPS}
            tableContainerClass="resizable-table-demo-on-end"
            viewPortColumns={6}
            isFirstColumnFixed={true}
            isHeaderFixed={true}
          />
        </TableGridColumnProvider>
      </div>


      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f7ff', borderRadius: '8px' }}>
        <strong>Latest Committed Widths (on mouse up):</strong>
        <pre style={{ margin: '8px 0', fontSize: '12px' }}>
          {JSON.stringify(latestWidths, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const ColumnResizingOnEnd = {
  render: () => <ColumnResizingOnEndDemo />,
  parameters: {
    docs: {
      description: {
        story: `
**Column Resizing (onEnd mode)** - visual resize during drag, single state commit on mouse up.

\`\`\`jsx
<TableGridColumnProvider
  enableResize={true}
  resizeMode="onEnd"
  minColumnWidth={80}
  maxColumnWidth={400}
  onColumnConfigChange={({ type, config }) => {
    if (type === 'resize') {
      // Persist only final committed width
      saveColumnWidths(config.columnWidths);
    }
  }}
>
  <Table tableData={...} />
</TableGridColumnProvider>
\`\`\`

Use this mode for large tables when smooth drag performance is preferred over continuous React state updates.
        `,
      },
    },
  },
};
