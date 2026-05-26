/**
 * Adapter utilities for react-virtualized style Table API
 * 
 * Enables consumers familiar with react-virtualized to use a similar pattern:
 * 
 * react-virtualized style:
 * <Table rowCount={100} rowGetter={({index}) => data[index]}>
 *   <Column dataKey="name" label="Name" cellRenderer={...} />
 *   <Column dataKey="age" label="Age" />
 * </Table>
 * 
 * Converted to our format:
 * <Table
 *   tableData={{ headerData: [...], data: [...] }}
 *   cellRenderer={{ name: ..., age: ... }}
 * />
 */

import React from "react";
import merge from "lodash/merge";
import type { VirtualizedColumnConfig, HeaderData, AdaptVirtualizedPropsInput, NormalizedRow } from '../types';

/**
 * Convert Column-style configuration to our headerData format
 * 
 * @param {Array} columns - Array of column config objects (from Column components or direct config)
 * @returns {Array} - headerData array for Table component
 * 
 * @example
 * const columns = [
 *   { dataKey: 'name', label: 'Name', width: 200, disableSort: true, cellRenderer: ..., headerRenderer: ... },
 *   { dataKey: 'age', label: 'Age', width: 100 }
 * ];
 * const headerData = createHeaderDataFromColumns(columns);
 * // Result: [
 * //   { order: 0, value: 'name', label: 'Name', enabled: true, sortable: false, ... },
 * //   { order: 1, value: 'age', label: 'Age', enabled: true, sortable: true, ... }
 * // ]
 */
export const createHeaderDataFromColumns = (columns: VirtualizedColumnConfig[] | null | undefined): HeaderData[] => {
    if (!columns || !Array.isArray(columns)) return [];

    return columns.map((column, index) => {
        const {
            dataKey,
            label,
            width,
            minWidth,
            maxWidth,
            disableSort = false,
            fixed = false,
            enabled = true,
            copyToClipboard = false,
            // Additional props to pass through
            ...rest
        } = column;

        return {
            order: index,
            value: dataKey,
            label: label || dataKey,
            enabled,
            sortable: !disableSort,
            fixed,
            copyToClipboard,
            // Width configurations
            ...(width && { fixWidth: width }),
            ...(minWidth && { minWidth }),
            ...(maxWidth && { maxWidth }),
            // Pass through any additional props
            ...rest
        };
    });
};

/**
 * Convert rowGetter pattern to data array
 * 
 * @param {number} rowCount - Total number of rows
 * @param {Function} rowGetter - Function that returns row data by index: ({ index }) => rowData
 * @param {Array} columns - Column configuration to extract dataKeys
 * @returns {Array} - Data array for Table component
 * 
 * @example
 * const data = createDataFromRowGetter(100, ({ index }) => list[index], columns);
 */
export const createDataFromRowGetter = (rowCount: number, rowGetter: ((args: { index: number }) => any) | null | undefined, columns: VirtualizedColumnConfig[] | null | undefined): NormalizedRow[] => {
    if (!rowCount || !rowGetter || typeof rowGetter !== 'function') {
        return [];
    }

    const dataKeys = columns?.map(col => col.dataKey) || [];

    return Array.from({ length: rowCount }, (_, index) => {
        const rawRowData = rowGetter({ index });
        
        if (!rawRowData) return null;

        // If rawRowData already has rowId and rowData structure, normalize it
        if (rawRowData.rowId !== undefined && rawRowData.rowData !== undefined) {
            return rawRowData;
        }

        // Convert flat object to our rowData structure
        const rowData: Record<string, any> = {};
        
        if (dataKeys.length > 0) {
            // Use column dataKeys to build rowData
            dataKeys.forEach(key => {
                const cellValue = rawRowData[key];
                rowData[key] = typeof cellValue === 'object' && cellValue !== null
                    ? cellValue
                    : { value: cellValue };
            });
        } else {
            // No columns specified, convert all keys
            Object.keys(rawRowData).forEach(key => {
                if (key !== 'id' && key !== 'rowId') {
                    const cellValue = rawRowData[key];
                    rowData[key] = typeof cellValue === 'object' && cellValue !== null
                        ? cellValue
                        : { value: cellValue };
                }
            });
        }

        return {
            rowId: rawRowData.rowId || rawRowData.id || `row-${index}`,
            rowData,
            // Preserve original data for callbacks
            _originalData: rawRowData
        };
    }).filter(Boolean);
};

/**
 * Wrap a react-virtualized style cellRenderer to our format
 * 
 * react-virtualized cellRenderer receives:
 * { cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }
 * 
 * Our cellRenderer receives:
 * { rowData (cell-level), headerData, headerKey, rowId, cellIndex, rowIndex, ... }
 * 
 * @param {Function} cellRenderer - react-virtualized style cell renderer
 * @param {string} dataKey - The column's dataKey
 * @returns {React.Component} - Wrapped cell renderer component
 */
export const wrapCellRenderer = (cellRenderer: ((...args: any[]) => any) | null | undefined, dataKey: string): React.ComponentType<any> | null => {
    if (!cellRenderer) return null;

    // Return a memoized component
    const WrappedCellRenderer = React.memo(({ 
        rowData,  // This is cell-level data in our format
        headerData,
        headerKey,
        rowId,
        cellIndex,
        rowIndex,
        ...rest
    }: Record<string, any>) => {
        // Get the full row data from rest if available
        const fullRowData = rest._originalData || rest;
        
        // Transform to react-virtualized format
        const virtualizedProps = {
            cellData: rowData?.value,
            columnData: headerData,
            columnIndex: cellIndex,
            dataKey: headerKey,
            rowData: fullRowData,
            rowIndex,
            // Additional props from our system
            rowId,
            isExpanded: rest._isExpanded,
            isExpandable: rest._isExpandable,
            childrenCount: rest._childrenCount
        };

        return cellRenderer(virtualizedProps);
    });

    WrappedCellRenderer.displayName = `WrappedCellRenderer(${dataKey})`;
    return WrappedCellRenderer;
};

/**
 * Wrap a react-virtualized style headerRenderer to our format
 * 
 * react-virtualized headerRenderer receives:
 * { columnData, dataKey, disableSort, label, sortBy, sortDirection }
 * 
 * Our headerCellRenderer receives:
 * { label, value }
 * 
 * @param {Function|React.ReactNode} headerRenderer - react-virtualized style header renderer or direct renderable node
 * @param {Object} columnConfig - Column configuration
 * @returns {Function} - Wrapped header renderer function
 */
export const wrapHeaderRenderer = (headerRenderer: any, columnConfig: VirtualizedColumnConfig): ((...args: any[]) => any) | null => {
    if (!headerRenderer) return null;

    // Support direct React element/node usage
    if (typeof headerRenderer !== "function") {
        if (React.isValidElement(headerRenderer)) {
            return () => headerRenderer;
        }

        if (typeof headerRenderer === "string" || typeof headerRenderer === "number") {
            return () => headerRenderer;
        }

        return null;
    }

    return ({ label, value, isSorted, sortOrder }: { label: string; value: string; isSorted?: boolean; sortOrder?: number }) => {
        // Transform to react-virtualized format
        const virtualizedProps = {
            columnData: columnConfig,
            dataKey: value,
            disableSort: !columnConfig?.sortable,
            label,
            sortBy: isSorted ? value : undefined,
            sortDirection: isSorted
                ? (sortOrder === 0 ? 'ASC' : 'DESC')
                : null
        };

        return headerRenderer(virtualizedProps);
    };
};

/**
 * Create cellRenderer object from columns configuration
 * 
 * @param {Array} columns - Column configuration with cellRenderer
 * @returns {Object} - cellRenderer object keyed by dataKey
 */
export const createCellRendererFromColumns = (columns: VirtualizedColumnConfig[] | null | undefined): Record<string, React.ComponentType<any>> => {
    if (!columns || !Array.isArray(columns)) return {};

    const cellRenderers: Record<string, any> = {};
    
    columns.forEach(column => {
        const { dataKey, cellRenderer } = column;
        if (cellRenderer && dataKey) {
            cellRenderers[dataKey] = wrapCellRenderer(cellRenderer, dataKey);
        }
    });

    return cellRenderers;
};

/**
 * Create headerCellRenderer object from columns configuration
 * 
 * @param {Array} columns - Column configuration with headerRenderer
 * @returns {Object} - headerCellRenderer object keyed by dataKey
 */
export const createHeaderRendererFromColumns = (columns: VirtualizedColumnConfig[] | null | undefined): Record<string, (...args: any[]) => any> => {
    if (!columns || !Array.isArray(columns)) return {};

    const headerRenderers: Record<string, any> = {};
    
    columns.forEach(column => {
        const { dataKey, headerRenderer } = column;
        if (headerRenderer && dataKey) {
            headerRenderers[dataKey] = wrapHeaderRenderer(headerRenderer, column);
        }
    });

    return headerRenderers;
};

/**
 * Create width configuration objects from columns
 * 
 * @param {Array} columns - Column configuration
 * @returns {Object} - { customHeadersMaxWidth, customHeadersFixWidth, customHeadersMinWidth }
 */
export const createWidthConfigFromColumns = (columns: VirtualizedColumnConfig[] | null | undefined): { metadataConfig: { th: Record<string, any>; td: Record<string, any> } } => {
    if (!columns || !Array.isArray(columns)) {
        return {
            metadataConfig: {
                th: {},
                td: {}
            }
        };
    }

    const metadataConfig: { th: Record<string, any>; td: Record<string, any> } = {
        th: { },
        td: { }
    };

    columns.forEach(column => {
        const { dataKey, width, minWidth, maxWidth, flexGrow } = column;
        const formatSize = (size: number | string): string => { 
            return (typeof size === "number") ? `${size}px` : size
        };
        
        const thStyle: { style: Record<string, string> } = { style: {} };
        const tdStyle: { style: Record<string, string> } = { style: {} };
        
        if (width) {
            thStyle.style.width = formatSize(Number(width) + 18);
            tdStyle.style.width = formatSize(Number(width) + 18);
        }
        if (minWidth) {
            thStyle.style.minWidth = formatSize(Number(minWidth) + 18);
            tdStyle.style.minWidth = formatSize(Number(minWidth) + 18);
        }
        if (maxWidth) {
            thStyle.style.maxWidth = formatSize(Number(maxWidth) + 18);
            tdStyle.style.maxWidth = formatSize(Number(maxWidth) + 18);
        }
        
        if (Object.keys(thStyle.style).length > 0) metadataConfig.th[dataKey] = thStyle;
        if (Object.keys(tdStyle.style).length > 0) metadataConfig.td[dataKey] = tdStyle;
        
        // Handle flexGrow - if set and no explicit width, don't set fixed width
        if (flexGrow && !width) {
            delete metadataConfig.th[dataKey];
            delete metadataConfig.td[dataKey];
        }
    });

    return {metadataConfig};
};

/**
 * Full adapter: Convert all react-virtualized style props to our Table props
 * 
 * @param {Object} props - react-virtualized style props
 * @returns {Object} - Props for our Table component
 * 
 * @example
 * const columns = [
 *   { dataKey: 'name', label: 'Name', width: 200, cellRenderer: ... },
 *   { dataKey: 'age', label: 'Age', width: 100 }
 * ];
 * 
 * const tableProps = adaptVirtualizedProps({
 *   rowCount: 100,
 *   rowGetter: ({ index }) => data[index],
 *   columns,
 *   onRowClick: (row) => console.log(row),
 *   sortBy: 'name',
 *   sortDirection: 'ASC'
 * });
 * 
 * <Table {...tableProps} />
 */
export const adaptVirtualizedProps = ({
    rowCount,
    rowGetter,
    columns,
    onRowClick,
    onHeaderClick,
    sortBy,
    sortDirection,
    metadataconfig,
    // Pass through props
    ...rest
}: AdaptVirtualizedPropsInput): Record<string, any> => {
    // Create headerData from columns
    const headerData = createHeaderDataFromColumns(columns);
    
    // Create data from rowGetter
    const data = createDataFromRowGetter(rowCount, rowGetter, columns);
    
    // Create cell renderers
    const cellRenderer = createCellRendererFromColumns(columns);
    
    // Create header renderers
    const headerCellRenderer = createHeaderRendererFromColumns(columns);
    
    // Create width configs
    const widthConfig = createWidthConfigFromColumns(columns);

    return {
        tableData: {
            totalCount: rowCount,
            headerData,
            data
        },
        cellRenderer: Object.keys(cellRenderer).length > 0 ? cellRenderer : undefined,
        headerCellRenderer: Object.keys(headerCellRenderer).length > 0 ? headerCellRenderer : undefined,
        metadataConfig: merge(widthConfig.metadataConfig, metadataconfig),
        ...(onRowClick && { onHandleRowClick: onRowClick }),
        ...(onHeaderClick && { onHandleHeaderSortClick: onHeaderClick }),
        ...(sortBy && { 
            sort: { 
                sortby: sortBy, 
                sortOrder: sortDirection === "DESC" ? 1 : 0 
            } 
        }),
        ...rest
    };
};

export default {
    createHeaderDataFromColumns,
    createDataFromRowGetter,
    createCellRendererFromColumns,
    createHeaderRendererFromColumns,
    createWidthConfigFromColumns,
    wrapCellRenderer,
    wrapHeaderRenderer,
    adaptVirtualizedProps
};
