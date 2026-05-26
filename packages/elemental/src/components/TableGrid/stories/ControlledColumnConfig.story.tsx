// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useCallback, useState } from 'react';
import TableComponent from '../index';
import { TableGridColumnProvider } from '../context/TableGridColumnContext';
import {
  RESIZABLE_TABLE_DATA,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS
} from './utils';

const ControlledConfigDemo = () => {
  const [columnConfig, setColumnConfig] = useState({
    columnWidths: { name: 200, email: 250 },
    columnVisibility: { location: false },
    columnOrder: ['name', 'email', 'status', 'role', 'department', 'location'],
    lockedColumns: ['name']
  });

  const handleConfigChange = useCallback(({ type, config }: { type: string; config: any }) => {
    console.log('Config changed:', type, config);
    setColumnConfig(config);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
        <strong>Controlled Mode:</strong>
        <p style={{ margin: '8px 0', fontSize: '13px' }}>
          Parent component fully controls column state. Changes are reported via callback.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        <TableGridColumnProvider
          columnConfig={columnConfig}
          onColumnConfigChange={handleConfigChange}
          enableResize={true}
          enableReorder={true}
          enableVisibilityToggle={true}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <TableComponent
              tableData={RESIZABLE_TABLE_DATA}
              loaderProps={COMMON_LOADER_PROPS}
              noDataProps={COMMON_NO_DATA_PROPS}
            />
          </div>
        </TableGridColumnProvider>
      </div>

      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <strong>Current Config (from parent state):</strong>
        <pre style={{ margin: '8px 0', fontSize: '11px', overflow: 'auto' }}>
          {JSON.stringify(columnConfig, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const ControlledColumnConfig = {
  render: () => <ControlledConfigDemo />,
  parameters: {
    docs: {
      description: {
        story: `
**Controlled Mode** - Parent manages all column state for backend sync.

\`\`\`jsx
const [columnConfig, setColumnConfig] = useState({
  columnWidths: { name: 200 },
  columnVisibility: { location: false },
  columnOrder: ['name', 'email', 'status'],
  lockedColumns: ['name'],
});

useEffect(() => {
  api.getColumnConfig().then(setColumnConfig);
}, []);

const handleChange = ({ type, config }) => {
  setColumnConfig(config);
  api.saveColumnConfig(config);
};

<TableGridColumnProvider
  columnConfig={columnConfig}
  onColumnConfigChange={handleChange}
  enableResize={true}
>
  <Table ... />
</TableGridColumnProvider>
\`\`\`
        `
      }
    }
  }
};
