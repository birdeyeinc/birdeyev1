// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { basicTableHeaders } from './utils';

// ============================================================================
// Custom Loader Component
// ============================================================================

const CustomLoader = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: '16px',
    }}>
        <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e0e7ff',
            borderTop: '3px solid #4f46e5',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#1e1b4b' }}>
                Fetching your data
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6366f1' }}>
                Hang tight, this won&apos;t take long...
            </p>
        </div>
    </div>
);

// ============================================================================
// Custom No Data Component
// ============================================================================

const CustomNoData = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: '12px',
    }}>
        <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            backgroundColor: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
        }}>
            📭
        </div>
        <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: '#14532d' }}>
                No results found
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#166534', maxWidth: '260px' }}>
                We couldn&apos;t find any records matching your criteria. Try adjusting your filters.
            </p>
        </div>
        <button
            onClick={() => alert('Clear filters clicked')}
            style={{
                marginTop: '4px',
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#fff',
                backgroundColor: '#16a34a',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
            }}
        >
            Clear Filters
        </button>
    </div>
);

// ============================================================================
// Stories
// ============================================================================

export const CustomLoaderStory = {
    name: 'Custom Loader',
    args: {
        tableData: {
            totalCount: 0,
            headerData: basicTableHeaders,
            data: [],
        },
        loaderProps: {
            isLoading: true,
            customJsx: CustomLoader,
        },
        noDataProps: {
            title: 'No Data',
        },
    },
    parameters: {
        docs: {
            description: {
                story: `
**Custom Loader** — Replace the default spinner with any React component via \`loaderProps.customJsx\`.

\`\`\`tsx
const CustomLoader = () => (
  <div>
    <Spinner />
    <p>Fetching your data...</p>
  </div>
);

<TableGrid
  loaderProps={{ isLoading: true, customJsx: CustomLoader }}
  ...
/>
\`\`\`
                `,
            },
        },
    },
};

export const CustomNoDataStory = {
    name: 'Custom No Data',
    args: {
        tableData: {
            totalCount: 0,
            headerData: basicTableHeaders,
            data: [],
        },
        loaderProps: {
            isLoading: false,
        },
        noDataProps: {
            customJsx: CustomNoData,
        },
    },
    parameters: {
        docs: {
            description: {
                story: `
**Custom No Data** — Replace the default empty state with any React component via \`noDataProps.customJsx\`.

\`\`\`tsx
const CustomNoData = () => (
  <div>
    <Icon />
    <p>No results found</p>
    <button onClick={clearFilters}>Clear Filters</button>
  </div>
);

<TableGrid
  noDataProps={{ customJsx: CustomNoData }}
  ...
/>
\`\`\`
                `,
            },
        },
    },
};
