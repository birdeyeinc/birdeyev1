/* eslint-disable react/prop-types */
import Table from "components/Table";
import React, { useEffect, useState } from "react";
import { mapApiDataToTableData } from "./helper";

// TableContainer is responsible for transforming API data and config into a format consumable by the Table component.
function TableContainer({ reportConfig }) {
    // early exit if we dont get required props and config
    if (!reportConfig?.parserConfig?.tableConfig || !reportConfig?.apiData?.dataPoints) {
        return null;
    }

    const [tableData, setTableData] = useState(null);
    const {
        parserConfig,
        apiData: { dataPoints },
    } = reportConfig;
    const { tableConfig } = parserConfig;

    // cellRendererMap: custom cell renderers; headerRendererMap: custom header renderers;
    // dataConfig: column definitions; sortProps: sorting configuration;
    const { cellRendererMap = {}, headerRendererMap = {}, actual: dataConfig, sortProps, infiniteScrollProps } = tableConfig;
    const { isClientSortEnabled = false, sortingHandler } = sortProps;
    
    useEffect(() => {
        // Prefer custom mapping function if provided, otherwise use default
        const data = tableConfig?.utilityFns?.mapCustomApiDataToTableData?.({ dataConfig, dataPoints, tableConfig }) ?? mapApiDataToTableData({ dataConfig, dataPoints, tableConfig });
        setTableData(data);
    }, [dataConfig, dataPoints]);

    // Handles sorting when a table header is clicked
    // If client-side sorting is enabled, update local state;
    // otherwise, delegate to external handler (e.g., server-side)
    const onHandleHeaderSortClick = ({ sortby, sortOrder, index }) => {
        if (isClientSortEnabled) {
            const sortedData = sortingHandler({ sortby, sortOrder, rowsData: tableData?.data, index });
            setTableData((prev) => {
                return { ...prev, data: sortedData };
            });
        } else {
            sortingHandler({ sortby, sortOrder, rowsData: tableData?.data, index });
        }
    };

    return tableData ? <Table infiniteScrollProps={infiniteScrollProps} onHandleHeaderSortClick={onHandleHeaderSortClick} tableData={tableData} cellRenderer={cellRendererMap} headerCellRenderer={headerRendererMap} /> : null;
}

export default TableContainer;
