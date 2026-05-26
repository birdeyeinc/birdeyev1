/**
 * Column component for VirtualizedStyleTable
 * 
 * A declarative way to define table columns similar to react-virtualized.
 * This component doesn't render anything - it's used to declare column configuration.
 * 
 * @example
 * <VirtualizedStyleTable rowCount={100} rowGetter={({index}) => data[index]}>
 *   <Column
 *     dataKey="name"
 *     label="Name"
 *     width={200}
 *     sortable
 *     cellRenderer={({ cellData, rowData }) => <span>{cellData}</span>}
 *   />
 *   <Column dataKey="age" label="Age" width={100} />
 * </VirtualizedStyleTable>
 */

import type { ColumnProps } from './types';

/**
 * Column configuration component
 * This component is used declaratively and doesn't render anything.
 * Its props are extracted by VirtualizedStyleTable to build the table configuration.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Column = (_props: ColumnProps): null => null;

Column.defaultProps = {
    sortable: false,
    fixed: false,
    enabled: true,
    copyToClipboard: false,
};

// Static property to identify Column components
(Column as typeof Column & { isColumn: boolean }).isColumn = true;

export default Column;
