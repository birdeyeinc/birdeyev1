// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useCallback, useEffect, useState } from 'react';
import TableComponent from '../index';
import ColumnCustomizer from '../ColumnCustomizer';
import { TableGridColumnProvider } from '../context/TableGridColumnContext';
import type { CellRendererMap, ColumnChangeEvent, ColumnConfig, VirtualizationConfig } from '../types';
import {
  RESIZABLE_TABLE_DATA,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS,
  StatusCellRenderer,
  getActionConfig
} from './utils';

const ColumnCustomizerDemo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_config, setConfig] = useState<ColumnConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(0); // For remounting the table


  const handleConfigChange = useCallback(({ type, columnKey, config }: ColumnChangeEvent) => {
    console.log('Column config changed:', { type, columnKey, config });
    setConfig(config);
  }, []);

  const cellRendererMap: CellRendererMap = {
    status: StatusCellRenderer
  };

  const virtualizationProps: VirtualizationConfig = { enabled: true, overscan: 5 };

  return (
    <TableGridColumnProvider
      enableResize={true}
      enableReorder={true}
      enableVisibilityToggle={true}
      minColumnWidth={80}
      maxColumnWidth={400}
      // initialColumnConfig={initialiseConfig}
      onColumnConfigChange={handleConfigChange}
    >
      {/* Header bar with customize button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#212121' }}>Team Members</h3>
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          {/* <button onClick={()=>{
            setKey(prevKey => prevKey + 1);
          }}>
            Re-mount
          </button> */}
          <button
            onClick={() => setIsOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E5E9F0',
              background: '#fff',
              height: '36px',
              width: '36px',
              border: '1px solid #E5E9F0',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <i className=" icon_phoenix-three-reactangle" style={{ fontSize: '24px' }} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{height:"500px"}}>
        <TableComponent
          key={key}
          tableData={RESIZABLE_TABLE_DATA}
          cellRenderer={cellRendererMap}
          loaderProps={COMMON_LOADER_PROPS}
          noDataProps={COMMON_NO_DATA_PROPS}
          tableContainerClass="customizer-table-demo"
          isFirstColumnFixed
          isHeaderFixed
          onHandleHeaderSortClick={()=>{
            console.log("sort clicked")}
          }
          enableFluidWidthByDefault
          virtualization={virtualizationProps}
          rowHoverAction={{
            enable: true,
            actionBoxConfigs: [
              {
                getActionConfig: getActionConfig,
                popOverDirection: 'left',
                customSelectionJsx: <span><i className="icon_phoenix-vertical-menu" /></span>,
                usePortal: true,
              }
            ]
          }}
        />
      </div>

      {/* Column Customizer Side Drawer (onSave mode) */}
      <ColumnCustomizer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        applyMode="onSave"
        onSave={(config) => console.log('Saved config:', config)}
        onColumnChange={(change) => console.log('Column changed:', change)}
      />
    </TableGridColumnProvider>
  );
};

export const ColumnCustomizerPanel = {
  render: () => <ColumnCustomizerDemo />,
  parameters: {
    docs: {
      description: {
        story: `
**Column Customizer** — Side drawer to toggle visibility, reorder, and lock columns.

Supports two apply modes:
- \`applyMode="onSave"\` — buffers changes until Save is clicked (Figma default)
- \`applyMode="onChange"\` — applies changes immediately

\`\`\`jsx
const [isOpen, setIsOpen] = useState(false);

<TableGridColumnProvider
  enableReorder={true}
  enableVisibilityToggle={true}
  initialColumnConfig={{ lockedColumns: ['name'] }}
>
  <button onClick={() => setIsOpen(true)}>Customize Columns</button>
  <TableGrid tableData={...} />
  <ColumnCustomizer
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    applyMode="onSave"
    onSave={(config) => saveToBackend(config)}
  />
</TableGridColumnProvider>
\`\`\`

**Features:**
- Checkbox to show/hide columns
- Drag handle on right to reorder columns
- Locked columns float to top (always checked, not draggable)
- Search to filter columns
- "Restore defaults" link + "Save" button in header
- Works anywhere inside the Provider
        `
      }
    }
  }
};
