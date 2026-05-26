import { orderBy } from "lodash";

export const tableReportData = {
    reportData: {
        visualisationType: "Table",
        apiData: {
            dataPoints: [],
        },
        parserConfig: {
            tableConfig: {
                // actual is basically column configuration object
                actual: [],
                // it is a collection of customJSX functions against column key, it will be used for body-cell
                cellRendererMap: {},
                // it is a collection of customJSX functions against column key, it will be used for header-cell
                headerRendermap: {},
                // we are using `react-infinite-scroller`, so for that require infinite scroll's prop we need to pass
                infiniteScrollProps: {},
                // all required props for sorting
                sortProps: {
                    // if we want to enable clientSide sorting, but for that also we need to pass `sortingHandler`
                    isClientSortEnabled: true,
                    // if `isClientSortEnabled` is `true`, then sortingHandler should return `sortedRowsData`
                    // if `isClientSortEnabled` is `false`, then through api call we need to handle sorting and pass sorted apiData again
                    sortingHandler: ({ sortby: columnKey, sortOrder, rowsData }) => {
                        let sortedArray;
                        const order = sortOrder == 0 ? "asc" : "desc";
                        switch (columnKey) {
                            case "experienceScoreBreakdownKey": {
                                sortedArray = orderBy(
                                    rowsData,
                                    (point) => {
                                        return point.rowData[0].value;
                                    },
                                    order,
                                );
                                break;
                            }
                            case "experienceScoreKey": {
                                sortedArray = orderBy(
                                    rowsData,
                                    (point) => {
                                        return point.rowData[1].value;
                                    },
                                    order,
                                );
                                break;
                            }
                        }
                        return sortedArray;
                    },
                },
                utilityFns: {
                    getCustomHeaderData: () => {}, // Custom function to generate header data array
                    getCustomBodyData: () => {}, // Custom function to generate body data array
                    getCustomRowDataObj: () => {}, // Custom function to generate a row data object
                    getCustomHeaderDataObj: () => {}, // Custom function to generate a header data object
                    mapCustomApiDataToTableData: () => {}, // Custom function to map API data to table data structure
                },
            },
        },
        redirectURL: "",
    },
};
