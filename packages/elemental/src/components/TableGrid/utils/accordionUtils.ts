import type { AccordionConfig, NormalizedRow, CellData } from '../types';

/**
 * 
 * New Data Structure (Required):
 * 
 * Row with children:
 * {
 *   rowId: "unique-row-id",           // Required: Unique identifier
 *   rowData: { columnKey: { value: "..." }, ... },  // Cell data (key-value)
 *   children: [                       // Optional: Array of child rows
 *     { rowId: "child-1", rowData: { ... } },
 *     { rowId: "child-2", rowData: { ... } }
 *   ],
 *   expandedRowData: { ... }          // Optional: Different cell data when expanded
 * }
 * 
 * AccordionConfig:
 * {
 *   enabled: boolean,                 // Enable accordion functionality
 *   defaultExpandedRowIds: string[],  // Row IDs expanded by default
 *   maxExpandedRows: number,          // Max rows that can be expanded (0 = unlimited)
 *   subRowLimit: number,              // Pagination limit for children (0 = show all)
 *   onExpand: (rowId, isExpanded, expandedRowIds) => void,  // Callback on expand/collapse
 *   onLoadMoreSubRows: (parentRowId, currentCount) => void, // Callback for "see more"
 *   expandIconColumn: string,         // Header key where expand icon appears (default: first column)
 *   disableExpand: boolean            // Disable all expand interactions
 * }
 */

/**
 * Default accordion configuration
 */
export const DEFAULT_ACCORDION_CONFIG: Required<AccordionConfig> = {
    enabled: false,
    defaultExpandedRowIds: [],
    maxExpandedRows: 0,           // 0 = unlimited
    subRowLimit: 0,               // 0 = show all children
    onExpand: null,
    onLoadMoreSubRows: null,
    expandIconColumn: null,       // null = first enabled column
    disableExpand: false
};

/**
 * Checks if a row has children (is expandable)
 * @param {Object} row - Row object
 * @returns {boolean}
 */
export const isRowExpandable = (row: NormalizedRow | null | undefined): boolean => {
    return !!(row?.children && Array.isArray(row.children) && row.children.length > 0);
};

/**
 * Gets the count of children for a row
 * @param {Object} row - Row object
 * @returns {number}
 */
export const getChildrenCount = (row: NormalizedRow | null | undefined): number => {
    return row?.children?.length || 0;
};

/**
 * Checks if a row is currently expanded
 * @param {string} rowId - Row ID to check
 * @param {string[]} expandedRowIds - Array of expanded row IDs
 * @returns {boolean}
 */
export const isRowExpanded = (rowId: string, expandedRowIds: string[] | null | undefined): boolean => {
    return expandedRowIds?.includes(rowId) || false;
};

/**
 * Toggles expansion state for a row
 * @param {string} rowId - Row ID to toggle
 * @param {string[]} expandedRowIds - Current expanded row IDs
 * @param {number} maxExpandedRows - Maximum allowed expanded rows (0 = unlimited)
 * @returns {Object} - { newExpandedRowIds: string[], wasExpanded: boolean, isNowExpanded: boolean }
 */
export const toggleRowExpansion = (rowId: string, expandedRowIds: string[] | null | undefined, maxExpandedRows: number = 0): { newExpandedRowIds: string[]; wasExpanded: boolean; isNowExpanded: boolean } => {
    const currentExpanded = [...(expandedRowIds || [])];
    const wasExpanded = currentExpanded.includes(rowId);
    
    let newExpandedRowIds;
    
    if (wasExpanded) {
        // Collapse: remove from expanded list
        newExpandedRowIds = currentExpanded.filter(id => id !== rowId);
    } else {
        // Expand: add to expanded list (respecting maxExpandedRows)
        if (maxExpandedRows > 0 && currentExpanded.length >= maxExpandedRows) {
            // Remove oldest expanded row to make room
            newExpandedRowIds = [...currentExpanded.slice(1), rowId];
        } else {
            newExpandedRowIds = [...currentExpanded, rowId];
        }
    }
    
    return {
        newExpandedRowIds,
        wasExpanded,
        isNowExpanded: !wasExpanded
    };
};

/**
 * Gets visible children for a row based on subRowLimit and current visible count
 * @param {Object} row - Row object with children
 * @param {number} subRowLimit - Limit per page (0 = show all)
 * @param {number} currentVisibleCount - How many are currently visible
 * @returns {Object} - { visibleChildren: Array, hasMore: boolean, totalCount: number }
 */
export const getVisibleChildren = (row: NormalizedRow | null | undefined, subRowLimit: number, currentVisibleCount: number): { visibleChildren: NormalizedRow[]; hasMore: boolean; totalCount: number; remainingCount?: number } => {
    const children = row?.children || [];
    const totalCount = children.length;
    
    // If no limit, show all
    if (!subRowLimit || subRowLimit <= 0) {
        return {
            visibleChildren: children,
            hasMore: false,
            totalCount
        };
    }
    
    // Use currentVisibleCount or default to subRowLimit
    const visibleCount = currentVisibleCount || subRowLimit;
    const visibleChildren = children.slice(0, visibleCount);
    const hasMore = visibleCount < totalCount;
    
    return {
        visibleChildren,
        hasMore,
        totalCount,
        remainingCount: Math.max(0, totalCount - visibleCount)
    };
};

/**
 * Calculates the next visible count when "see more" is clicked
 * @param {number} currentCount - Current visible count
 * @param {number} subRowLimit - Limit to add per click
 * @param {number} totalCount - Total children count
 * @returns {number} - New visible count
 */
export const getNextVisibleCount = (currentCount: number, subRowLimit: number, totalCount: number): number => {
    if (!subRowLimit || subRowLimit <= 0) {
        return totalCount;
    }
    return Math.min(currentCount + subRowLimit, totalCount);
};

/**
 * Flattens hierarchical data with children into a flat array for rendering
 * Includes metadata about each row's type and parent
 * 
 * @param {Array} data - Array of rows (may have children)
 * @param {string[]} expandedRowIds - Currently expanded row IDs
 * @param {number} subRowLimit - Pagination limit for children
 * @param {Object} visibleChildrenCounts - Map of parentRowId -> visibleCount
 * @returns {Array} - Flattened array with row metadata
 */
export const flattenDataForRendering = (data: NormalizedRow[] | null | undefined, expandedRowIds: string[], subRowLimit: number, visibleChildrenCounts: Record<string, number> = {}): NormalizedRow[] => {
    if (!data || !Array.isArray(data)) return [];
    
    const flattenedRows: NormalizedRow[] = [];
    
    data.forEach((row, parentIndex) => {
        const rowId = row.rowId ?? '';
        const isExpanded = isRowExpanded(rowId, expandedRowIds);
        const expandable = isRowExpandable(row);
        const childrenCount = getChildrenCount(row);
        
        // Add parent row
        flattenedRows.push({
            ...row,
            rowData: (Array.isArray(row.rowData) ? {} : row.rowData) || {},
            _rowType: 'parent',
            _isExpanded: isExpanded,
            _isExpandable: expandable,
            _childrenCount: childrenCount,
            _parentIndex: parentIndex,
            _flatIndex: flattenedRows.length
        });
        
        // If expanded and has children, add visible children
        if (isExpanded && expandable) {
            const currentVisibleCount = visibleChildrenCounts[rowId] || subRowLimit || childrenCount;
            const { visibleChildren, hasMore, totalCount, remainingCount } = getVisibleChildren(
                row, 
                subRowLimit, 
                currentVisibleCount
            );
            
            visibleChildren.forEach((child, childIndex) => {
                flattenedRows.push({
                    ...child,
                    rowData: (Array.isArray(child.rowData) ? {} : child.rowData) || {},
                    _rowType: 'child',
                    _parentRowId: rowId,
                    _parentIndex: parentIndex,
                    _childIndex: childIndex,
                    _isLastChild: childIndex === visibleChildren.length - 1 && !hasMore,
                    _flatIndex: flattenedRows.length
                });
            });
            
            // Add "see more" row if there are more children
            if (hasMore) {
                flattenedRows.push({
                    rowId: `${rowId}_see_more`,
                    rowData: {}, // No cell data for "see more" row
                    _rowType: 'seeMore',
                    _parentRowId: rowId,
                    _parentIndex: parentIndex,
                    _currentVisibleCount: currentVisibleCount,
                    _totalCount: totalCount,
                    _remainingCount: remainingCount,
                    _flatIndex: flattenedRows.length
                });
            }
        }
    });
    
    return flattenedRows;
};

/**
 * Gets row data to display (handles expandedRowData when expanded)
 * @param {Object} row - Row object
 * @param {boolean} isExpanded - Whether row is expanded
 * @returns {Object} - rowData to display
 */
export const getDisplayRowData = (row: NormalizedRow, isExpanded: boolean): Record<string, CellData> => {
    if (isExpanded && row.expandedRowData) {
        return row.expandedRowData;
    }
    return row.rowData as Record<string, CellData>;
};

export default {
    DEFAULT_ACCORDION_CONFIG,
    isRowExpandable,
    getChildrenCount,
    isRowExpanded,
    toggleRowExpansion,
    getVisibleChildren,
    getNextVisibleCount,
    flattenDataForRendering,
    getDisplayRowData
};
