/**
 * Normalizes row data from array-based structure to key-value structure.
 * Provides backward compatibility for existing consumers while enabling
 * easier column customization.
 * 
 * @param {Array} data - Array of row objects with rowData
 * @param {Array} headerData - Array of header configuration objects
 * @returns {Object} - { normalizedData: Array, _isProcessed: Boolean }
 * 
 * Input formats supported:
 * 1. Array-based (legacy):
 *     headerData: [{ value: "name" }, { value: "age" }]
 *    rowData: [{ order: 0, value: "test" }, { order: 1, value: "data" }]
 * 
 * 2. Key-value (new):
 *    rowData: { columnKey: { value: "test" }, columnKey2: { value: "data" } }
 */
import type { LegacyRow, HeaderData, CellData, NormalizeResult, NormalizedRow } from '../types';

export const normalizeRowData = (data: NormalizedRow[] | LegacyRow[] | null | undefined, headerData: HeaderData[] | null | undefined): NormalizeResult => {
    if (!data || !headerData) return { normalizedData: [], _isProcessed: false };
    let _isProcessed = false;

    const normalizeRowDataObject = (rowDataArray: CellData[] | Record<string, CellData>): Record<string, CellData> => {
        if (!Array.isArray(rowDataArray)) return rowDataArray;
        
        const normalized: Record<string, CellData> = {};
        rowDataArray.forEach((cell, cellOrder) => {
            const headerKey = headerData[cellOrder]?.value;
            if (headerKey) {
                normalized[headerKey] = {
                    ...cell,
                    _headerKey: headerKey
                };
            }
        });
        return normalized;
    };

    const normalizedData = data.map(row => {
        // Skip if rowData doesn't exist
        if (!row.rowData) {
            return row;
        }

        // Already key-value structure - return as-is
        if (!Array.isArray(row.rowData)) {
            // Still need to normalize children if present
            let normalizedChildren = row.children;
            if (row.children && Array.isArray(row.children)) {
                normalizedChildren = row.children.map(child => ({
                    ...child,
                    rowData: Array.isArray(child.rowData) 
                        ? normalizeRowDataObject(child.rowData) 
                        : child.rowData,
                    _originalRowData: child.rowData,
                    _isNormalized: true
                } as NormalizedRow));
            }
            
            return {
                ...row,
                children: normalizedChildren,
                _isNormalized: true,
                _originalRowData: row.rowData
            };
        }

        // Transform array to key-value
        _isProcessed = true;
        const normalizedRowData = normalizeRowDataObject(row.rowData);

        // Normalize expandedRowData if present
        let normalizedExpandedRowData = row.expandedRowData;
        if (row.expandedRowData && Array.isArray(row.expandedRowData)) {
            normalizedExpandedRowData = normalizeRowDataObject(row.expandedRowData);
        }

        // Normalize children if present
        let normalizedChildren = row.children;
        if (row.children && Array.isArray(row.children)) {
            normalizedChildren = row.children.map(child => ({
                ...child,
                rowData: Array.isArray(child.rowData) 
                    ? normalizeRowDataObject(child.rowData) 
                    : child.rowData,
                _originalRowData: child.rowData,
                _isNormalized: true
            } as NormalizedRow));
        }

        return {
            ...row,
            rowData: normalizedRowData,
            expandedRowData: normalizedExpandedRowData,
            children: normalizedChildren as NormalizedRow[],
            _originalRowData: row.rowData, // Preserve original for callbacks
            _isNormalized: true
        };
    }) as NormalizedRow[];

    return {
        normalizedData,
        _isProcessed
    };
};

/**
 * Converts normalized row back to original format for callbacks.
 * Ensures parent components receive data in the format they expect.
 * 
 * @param {Object} row - Normalized row object
 * @param {boolean} _isProcessed - Whether data was processed during normalization
 * @returns {Object} - Row with original rowData format
 */
export const denormalizeRow = (row: NormalizedRow | null | undefined, _isProcessed: boolean): NormalizedRow | LegacyRow | null => {
    if (!row) {
        return null;
    }

    if (!_isProcessed) {
        return row;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _originalRowData, _isNormalized: _unused, ...rest } = row;
    
    // Denormalize children if present
    // let denormalizedChildren = rest.children;
    // if (rest.children && Array.isArray(rest.children)) {
    //     denormalizedChildren = rest.children.map(child => {
    //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //         const { _originalRowData: childOriginal, _isNormalized: _childNormalized, ...childRest } = child;
    //         return {
    //             ...childRest,
    //             rowData: childOriginal || child.rowData
    //         };
    //     });
    // }

    return {
        ...rest,
        rowData: _originalRowData
        // children: denormalizedChildren
    } as NormalizedRow | LegacyRow;
};

/**
 * Gets cell data by header key from normalized rowData.
 * Works with normalized (key-value) only.
 * 
 * @param {Object|Array} rowData - Row data (normalized or legacy)
 * @param {String} headerKey - Header value/key to lookup
 * @returns {Object} - Cell data object
 */
export const getCellByKey = (rowData: Record<string, CellData> | null | undefined, headerKey: string): CellData | null => {
    if (!rowData) return null;
    // Key-value structure
    return rowData[headerKey] || null;
};

export default normalizeRowData;
