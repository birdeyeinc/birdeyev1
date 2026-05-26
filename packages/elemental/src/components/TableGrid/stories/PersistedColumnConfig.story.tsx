// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useCallback, useMemo, useState } from 'react';
import TableComponent from '../index';
import ColumnCustomizer from '../ColumnCustomizer';
import { TableGridColumnProvider } from '../context/TableGridColumnContext';
import type { CellRendererMap, ColumnChangeEvent, ColumnConfig, VirtualizationConfig, GraphQLFetcher, PersistenceConfig } from '../types';
import {
  RESIZABLE_TABLE_DATA,
  COMMON_LOADER_PROPS,
  COMMON_NO_DATA_PROPS,
  StatusCellRenderer
} from './utils';

/**
 * Demo: Column Customizer with Backend Persistence
 *
 * This story demonstrates the `persistence` config object.
 * Uses a `fetcher` function (fetch-based for Storybook).
 * In production, you'd pass `apiResource` + `graphqlEndpoint` instead.
 *
 * Prerequisites:
 *   1. docker compose up (from ui-preferences-service/)
 *      OR: MongoDB + Redis running locally + node dist/index.js
 *
 * How to test:
 *   1. Open the customizer → toggle columns → Save
 *   2. Resize or reorder columns in the table
 *   3. Refresh the page — config should be restored!
 */

const GRAPHQL_ENDPOINT = 'http://localhost:4050/graphql';
const STORYBOOK_HEADERS = {
  'x-user-id': 'storybook-user',
  'x-business-id': 'storybook-biz',
};

/**
 * Storybook fetcher — uses fetch() directly since we don't have beNodeResource here.
 * In production (UI-web-2.0), you'd use apiResource instead.
 */
const createStorybookFetcher = (): GraphQLFetcher => {
  return async ({ query, variables }) => {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...STORYBOOK_HEADERS },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data;
  };
};

const PersistedColumnConfigDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastChange, setLastChange] = useState<string>('—');

  const handleConfigChange = useCallback(({ type, columnKey, config }: ColumnChangeEvent) => {
    setLastChange(`${type}${columnKey ? ` → ${columnKey}` : ''}`);
    console.log('[Persisted] Column config changed:', { type, columnKey, config });
  }, []);

  const cellRendererMap: CellRendererMap = {
    status: StatusCellRenderer
  };

  const virtualizationProps: VirtualizationConfig = { enabled: true, overscan: 5 };

  const initialiseConfig: ColumnConfig = {
    lockedColumns: ['name'],
  };

  // Memoize the fetcher so it doesn't trigger re-renders
  const fetcher = useMemo(() => createStorybookFetcher(), []);

  // Persistence config — pass this ONE prop to enable backend persistence
  const persistenceConfig: PersistenceConfig = useMemo(() => ({
    fetcher,
    onError: (err) => console.error('[Persisted] Save failed:', err),
  }), [fetcher]);

  return (
    <TableGridColumnProvider
      enableResize={true}
      enableReorder={true}
      enableVisibilityToggle={true}
      minColumnWidth={80}
      maxColumnWidth={400}
      initialColumnConfig={initialiseConfig}
      onColumnConfigChange={handleConfigChange}
      persistence={persistenceConfig}
    >
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#212121' }}>
            Persisted Column Config Demo
          </h3>
          <small style={{ color: '#888' }}>
            Last change: <strong>{lastChange}</strong> &nbsp;|&nbsp; Refresh the page to verify persistence
          </small>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          data-testid="customize-columns-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            fontSize: '13px',
            color: '#2652ED',
            background: '#fff',
            border: '1px solid #2652ED',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          <i className="icon_phoenix-settings" style={{ fontSize: '14px' }} />
          Customize Columns
        </button>
      </div>

      {/* Table */}
      <div style={{ height: '500px' }}>
        <TableComponent
          tableId="storybook-persisted-demo-3"
          tableData={RESIZABLE_TABLE_DATA}
          cellRenderer={cellRendererMap}
          loaderProps={COMMON_LOADER_PROPS}
          noDataProps={COMMON_NO_DATA_PROPS}
          tableContainerClass="persisted-table-demo"
          viewPortColumns={6}
          isFirstColumnFixed
          isHeaderFixed
          virtualization={virtualizationProps}
        />
      </div>

      {/* Column Customizer */}
      <ColumnCustomizer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        applyMode="onSave"
        onSave={(config) => console.log('[Persisted] Customizer saved:', config)}
      />
    </TableGridColumnProvider>
  );
};

export const PersistedColumnConfig = {
  render: () => <PersistedColumnConfigDemo />,
  parameters: {
    docs: {
      description: {
        story: `
**Column Config with Backend Persistence** — Demonstrates the \`persistence\` config prop.

Pass a single \`persistence\` object to enable backend save/load, with \`tableId\` on the Table component:
\`\`\`jsx
// Option 1: With fetcher (generic — any HTTP client)
<TableGridColumnProvider
  persistence={{
    fetcher: myGraphQLFetcher,
  }}
>
  <Table tableId="my-table" tableData={data} />
</TableGridColumnProvider>

// Option 2: With Birdeye apiResource
import { beNodeResource } from 'utils/apiHelper';

<TableGridColumnProvider
  persistence={{
    apiResource: beNodeResource,
    graphqlEndpoint: "/uiPreferencesApi/graphql",
  }}
>
  <Table tableId="my-table" tableData={data} />
</TableGridColumnProvider>
\`\`\`

The provider automatically:
- Fetches saved config from the backend on mount
- Shows the table immediately with defaults, swaps to saved config when loaded
- Auto-saves resize/reorder changes (debounced 2.5s)
- Saves customizer changes immediately on Save click
- Retries failed saves 3 times with exponential backoff
- Falls back to defaults silently if fetch fails
        `
      }
    }
  }
};
