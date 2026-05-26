// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { basicTableHeaders, generateLegacyRows, COMMON_LOADER_PROPS, COMMON_NO_DATA_PROPS, TextCellRenderer, StatusCellRenderer } from "./utils";
import { TableGridColumnProvider } from "../context/TableGridColumnContext";
import TableComponent from "../index";
import type { TableGridProps, SortConfig, RowLike, SingleCellClickPayload } from "../types";

const LegacyDataStructureTableProps = {
    args: {
        tableData: {
            totalCount: 10,
            headerData: basicTableHeaders,
            data: generateLegacyRows(0, 10),
        },
        loaderProps: COMMON_LOADER_PROPS,
        noDataProps: COMMON_NO_DATA_PROPS,
        isFirstColumnFixed: true,
        onHandleRowClick: (row: RowLike) => console.log("Row clicked (legacy):", row),
        onHandleSingleCellClick: (cell: SingleCellClickPayload) => console.log("Cell clicked (legacy):", cell),
        onHandleHeaderSortClick: (sort: SortConfig) => console.log("Sort clicked (legacy):", sort),
        cellRenderer: {
            location: TextCellRenderer,
            business_name: TextCellRenderer,
            created: TextCellRenderer,
            created_by: TextCellRenderer,
            status: StatusCellRenderer,
        },
    },
    parameters: {
        docs: {
            description: {
                story: `
**⚠️ LEGACY SUPPORT** - This story demonstrates backward compatibility with the old array-based data structure.

**Legacy Format (array-based):**
\`\`\`js
{
  rowId: 'row-1',
  rowData: [
    { value: 'Location 1' },
    { value: 'Business 1' },
    { value: 'Feb 1, 2024' },
    { value: 'John Doe' },
    { value: 'Active' }
  ]
}
\`\`\`

**New Format (key-value - recommended):**
\`\`\`js
{
  rowId: 'row-1',
  rowData: {
    location: { value: 'Location 1' },
    business_name: { value: 'Business 1' },
    created: { value: 'Feb 1, 2024' },
    created_by: { value: 'John Doe' },
    status: { value: 'Active' }
  }
}
\`\`\`

The Table component automatically detects and normalizes legacy format internally.
**Recommendation:** Migrate to the new key-value format for better maintainability and explicit column mapping.
        `,
            },
        },
    },
};

export const LegacyDataStructureTableGridWithResize = (args: Partial<TableGridProps>) => {
    return (
        <>
            <TableGridColumnProvider enableResize={true} resizeMode="onEnd" onColumnConfigChange={(config)=> console.log("Column config changed (legacy):", config)}>
        <TableComponent {...LegacyDataStructureTableProps.args} {...args} />
            </TableGridColumnProvider>
        </>
    );
};
