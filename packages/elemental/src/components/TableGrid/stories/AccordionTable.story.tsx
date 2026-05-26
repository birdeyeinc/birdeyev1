import React, { useCallback, useMemo } from "react";
import TableComponent from "../index";
import { COMMON_LOADER_PROPS, COMMON_NO_DATA_PROPS, generateAccordionRows, LocationCellRenderer, StatusCellRenderer, accordionTableHeaders } from "./utils";
import { TableGridColumnProvider } from "../context";

const AccordionTableWrapper = (props: any) => {
    const [expandedRowIds, setExpandedRowIds] = React.useState(["region-0"]);
    const tableRef = React.useRef(null);

    const handleExpand = useCallback((rowId: string, isExpanded: boolean, newExpandedRowIds: string[]) => {
        console.log(`Row ${rowId} ${isExpanded ? "expanded" : "collapsed"}`, newExpandedRowIds);
        setExpandedRowIds(newExpandedRowIds);
    }, []);

    const handleLoadMoreSubRows = useCallback((parentRowId: string, currentCount: number) => {
        console.log(`Load more for ${parentRowId}, current: ${currentCount}`);
    }, []);

    const tableData = useMemo(
        () => ({
            totalCount: 4,
            headerData: accordionTableHeaders,
            data: generateAccordionRows(),
        }),
        [],
    );

    return (
        <div>
            <p style={{ marginBottom: "10px", fontSize: "14px", color: "#666" }}>Click expand icon to expand/collapse rows. Using new accordion structure with rowId, children, subRowLimit.</p>
            <p style={{ marginBottom: "10px", fontSize: "12px", color: "#888" }}>Expanded rows: {expandedRowIds.join(", ") || "None"}</p>
            <TableGridColumnProvider enableResize={false} minColumnWidth={80} maxColumnWidth={400} onColumnConfigChange={(config) => console.log("Column config changed:", config)}>
                <TableComponent
                    {...props}
                    tableData={tableData}
                    tableContainerRef={tableRef}
                    accordionConfig={{
                        ...props.accordionConfig,
                        defaultExpandedRowIds: expandedRowIds,
                        onExpand: handleExpand,
                        onLoadMoreSubRows: handleLoadMoreSubRows,
                    }}
                />
            </TableGridColumnProvider>
        </div>
    );
};

export const AccordionTableGrid = {
    render: (args: any) => <AccordionTableWrapper {...args} />,
    args: {
        loaderProps: COMMON_LOADER_PROPS,
        noDataProps: COMMON_NO_DATA_PROPS,
        isFirstColumnFixed: true,
        accordionConfig: {
            enabled: true,
            defaultExpandedRowIds: ["region-0"],
            maxExpandedRows: 2,
            subRowLimit: 2,
            expandIconColumn: "location",
            disableExpand: false,
        },
        cellRenderer: {
            location: LocationCellRenderer,
            // business_name: TextCellRenderer,
            // created: TextCellRenderer,
            // created_by: TextCellRenderer,
            status: StatusCellRenderer,
        },
    },
    parameters: {
        docs: {
            description: {
                story: `
Table with expandable rows (accordion) using the new data structure:
- **rowId**: Unique identifier for each row
- **children**: Array of child rows to show when expanded
- **expandedRowData**: Optional data to show in parent row when expanded
- **maxExpandedRows**: Limit how many rows can be expanded (0 = unlimited)
- **subRowLimit**: Show limited children with "see more" button (0 = show all)
        `,
            },
        },
    },
};
