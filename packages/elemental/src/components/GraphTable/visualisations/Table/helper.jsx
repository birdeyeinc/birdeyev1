import { get } from "lodash";

/**
 * Generates a normalized header data object for a table header cell.
 * Used as a default fallback when no custom header data object function is provided in tableConfig.utilityFns.
 *
 * @param {Object} params
 * @param {Object} params.headerObj - The column configuration object from dataConfig.
 * @returns {Object} Normalized header data object for use in table rendering.
 */
function defaultHeaderDataObject({ headerObj }) {
    return {
        copyToClipboar: headerObj?.copyToClipboar ?? false,
        enabled: headerObj?.enabled ?? true,
        fixed: headerObj?.fixed ?? false,
        label: headerObj?.headerLabel,
        order: headerObj?.order ?? undefined,
        sortable: headerObj?.enableSort ?? false,
        value: headerObj?.columnKey,
    };
}

/**
 * Generates a normalized row data object for a table cell.
 * Used as a default fallback when no custom row data object function is provided in tableConfig.utilityFns.
 *
 * @param {Object} params
 * @param {Object} params.dataPointObj - The data point object from the API response.
 * @param {Object} params.columnObj - The column configuration object from dataConfig.
 * @returns {Object} Normalized row data object for use in table rendering.
 */
function defaultRowDataObject({ dataPointObj, columnObj }) {
    return {
        value: get(dataPointObj, columnObj.dataKey),
        order: dataPointObj.order ?? undefined,
    };
}

/**
 * Generates the header data array for the table, using either a custom or default header data object generator.
 *
 * @param {Object} params
 * @param {Array} params.dataConfig - Array of column configuration objects.
 * @param {Array} params.dataPoints - Array of data point objects from the API response.
 * @param {Object} params.tableConfig - Table configuration object, may contain utilityFns for custom logic.
 * @returns {Array} Array of header data objects for the table.
 */
function getHeaderData({ dataConfig, dataPoints, tableConfig }) {
    const headerData = dataConfig.map((headerObj, idx) => {
        return tableConfig?.utilityFns?.getCustomHeaderDataObj?.({ headerObj, dataPoints, tableConfig }) ?? defaultHeaderDataObject({ headerObj });
    });
    return headerData;
}

/**
 * Generates the body data array for the table, using either a custom or default row data object generator.
 *
 * @param {Object} params
 * @param {Array} params.dataConfig - Array of column configuration objects.
 * @param {Array} params.dataPoints - Array of data point objects from the API response.
 * @param {Object} params.tableConfig - Table configuration object, may contain utilityFns for custom logic.
 * @returns {Array} Array of row objects, each containing rowData for the table.
 */
function getBodyData({ dataConfig, dataPoints, tableConfig }) {
    const bodyData = dataPoints.map((dataPointObj) => {
        return {
            rowData: dataConfig.map((columnObj) => {
                return tableConfig?.utilityFns?.getCustomHeaderDataObj?.({ dataPointObj, columnObj, dataPoints, tableConfig }) ?? defaultRowDataObject({ dataPointObj, columnObj });
            }),
        };
    });
    return bodyData;
}

/**
 * Maps API data and table configuration to a normalized table data structure for rendering.
 * This is the main entry point for transforming API data into the format expected by the Table component.
 * It supports custom mapping logic via tableConfig.utilityFns, or falls back to default logic.
 *
 * @param {Object} params
 * @param {Array} params.dataConfig - Array of column configuration objects.
 * @param {Array} params.dataPoints - Array of data point objects from the API response.
 * @param {Object} params.tableConfig - Table configuration object, may contain utilityFns for custom logic.
 * @returns {Object} Object containing headerData (array) and data (array of row objects) for the Table component.
 */
export function mapApiDataToTableData({ dataConfig, dataPoints, tableConfig }) {
    // header
    const headerData = tableConfig?.utilityFns?.getCustomHeaderData?.({ dataConfig, dataPoints, tableConfig }) ?? getHeaderData({ dataConfig, dataPoints, tableConfig });
    // body
    const bodyData = tableConfig?.utilityFns?.getCustomBodyData?.({ dataConfig, dataPoints, tableConfig }) ?? getBodyData({ dataConfig, dataPoints, tableConfig });

    return { headerData, data: bodyData };
}
