/**
 * VirtualizedStyleTableGrid - A wrapper component that accepts react-virtualized style API
 * 
 * Provides a familiar API for users coming from react-virtualized while using
 * our Table component under the hood.
 * 
 * @example
 * import { VirtualizedStyleTable, Column } from 'components/Table';
 * 
 * // Using Column children (declarative):
 * <VirtualizedStyleTable
 *   rowCount={data.length}
 *   rowGetter={({ index }) => data[index]}
 *   onRowClick={(row) => console.log(row)}
 * >
 *   <Column dataKey="name" label="Name" width={200} cellRenderer={...} />
 *   <Column dataKey="age" label="Age" width={100} />
 * </VirtualizedStyleTable>
 * 
 * // Using columns prop (imperative):
 * <VirtualizedStyleTable
 *   rowCount={data.length}
 *   rowGetter={({ index }) => data[index]}
 *   columns={[
 *     { dataKey: 'name', label: 'Name', width: 200, cellRenderer: ... },
 *     { dataKey: 'age', label: 'Age', width: 100 }
 *   ]}
 * />
 */

import React, { useMemo, Children } from 'react';
import type { VirtualizedStyleTableGridProps, VirtualizedColumnConfig, ColumnProps } from './types';
import Table from './index';
import Column from './Column';
import { adaptVirtualizedProps } from './utils/virtualizedAdapter';

/**
 * Extract column configurations from Column children
 */
const extractColumnsFromChildren = (children: React.ReactNode): VirtualizedColumnConfig[] => {
    const columns: VirtualizedColumnConfig[] = [];
    
    Children.forEach(children, (child) => {
        const el = child as React.ReactElement<ColumnProps>;
        if (el && el.type && (el.type === Column || (el.type as { isColumn?: boolean }).isColumn)) {
            // Extract all props from the Column component
            columns.push({ ...el.props });
        }
    });
    
    return columns;
};

const VirtualizedStyleTableGrid = ({
    // react-virtualized style props
    rowCount,
    rowGetter,
    columns: columnsProp,
    children,
    
    // Event handlers (react-virtualized naming)
    onRowClick,
    onHeaderClick,
    
    // Sort state (react-virtualized naming)
    sortBy,
    sortDirection,
    
    // Our Table props that pass through
    loaderProps,
    noDataProps,
    isFirstColumnFixed,
    isHeaderFixed,
    tableContainerClass,
    "data-testid": tableDataTestId,
    tableContainerRef,
    virtualization,
    infiniteScrollProps,
    accordionConfig,
    rowHoverAction,
    disableRowHoverAction,
    disabledStateForRow,
    customRowWidth,
    enableClientSideSort,
    sortComparator,
    sortDebounceWaitTime,
    viewPortColumns,
    receiveNormalizedDataStructure,
    disablePerfOptimization,
    metadataConfig,
    
    // Rest props
    ...rest
}: VirtualizedStyleTableGridProps) => {
    // Determine columns source: prop or children
    const columns = useMemo(() => {
        if (columnsProp && columnsProp.length > 0) {
            return columnsProp;
        }
        return extractColumnsFromChildren(children);
    }, [columnsProp, children]);

    // Use adapter to convert virtualized props to our Table format
    const adaptedProps = useMemo(() => {
        return adaptVirtualizedProps({
            rowCount,
            rowGetter,
            columns,
            onRowClick,
            onHeaderClick,
            sortBy,
            sortDirection,
        });
    }, [rowCount, rowGetter, columns, onRowClick, onHeaderClick, sortBy, sortDirection]);

    return (
        <Table
            {...adaptedProps}
            loaderProps={loaderProps}
            noDataProps={noDataProps}
            isFirstColumnFixed={isFirstColumnFixed}
            isHeaderFixed={isHeaderFixed}
            tableContainerClass={tableContainerClass}
            data-testid={tableDataTestId}
            tableContainerRef={tableContainerRef}
            virtualization={virtualization}
            infiniteScrollProps={infiniteScrollProps}
            accordionConfig={accordionConfig}
            rowHoverAction={rowHoverAction}
            disableRowHoverAction={disableRowHoverAction}
            disabledStateForRow={disabledStateForRow}
            customRowWidth={customRowWidth}
            enableClientSideSort={enableClientSideSort}
            sortComparator={sortComparator}
            sortDebounceWaitTime={sortDebounceWaitTime}
            viewPortColumns={viewPortColumns}
            receiveNormalizedDataStructure={receiveNormalizedDataStructure}
            disablePerfOptimization={disablePerfOptimization}
            metadataConfig={metadataConfig}
            {...rest}
        />
    );
};

VirtualizedStyleTableGrid.defaultProps = {
    loaderProps: {},
    noDataProps: {},
    isFirstColumnFixed: false,
    isHeaderFixed: false,
    virtualization: { enabled: false },
    infiniteScrollProps: {},
    disabledStateForRow: {},
};

export default VirtualizedStyleTableGrid;
