import TableGrid from './index';

export default {
  title: 'Component/TableGrid',
  component: TableGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A highly performant, feature-rich Table component with support for sorting, filtering, virtualization, infinite scroll, and accordion (expandable rows).'
      }
    }
  }
};

export { BasicTableGrid } from './stories/BasicTable.story';
export { AccordionTableGrid } from './stories/AccordionTable.story';
export { ClientSideSortTableGrid } from './stories/ClientSideSortTable.story';
export { RowHoverActionsTableGrid } from './stories/RowHoverActionsTable.story';
export { InfiniteScrollTableGrid } from './stories/InfiniteScrollTable.story';
export { WindowBasedInfiniteScrollTableGrid } from './stories/WindowBasedInfiniteScrollTable.story';
export { VirtualizedTableGrid } from './stories/VirtualizedTable.story';
export { LegacyDataStructureTableGridWithResize } from './stories/LegacyDataStructureTable.story';
export { MetadataTableGrid } from './stories/MetadataTable.story';
export { VirtualizedStyleTableGridDeclarative } from './stories/VirtualizedStyleTableDeclarative.story';
export { VirtualizedStyleTableGridImperative } from './stories/VirtualizedStyleTableImperative.story';
export { VirtualizedStyleTableGridWithSort } from './stories/VirtualizedStyleTableWithSort.story';
export { ColumnResizingOnChange } from './stories/ColumnResizingOnChange.story';
export { ColumnResizingOnEnd } from './stories/ColumnResizingOnEnd.story';
export { ColumnCustomizerPanel } from './stories/ColumnCustomizerPanel.story';
export { ControlledColumnConfig } from './stories/ControlledColumnConfig.story';
export { PersistedColumnConfig } from './stories/PersistedColumnConfig.story';
export { CustomLoaderStory, CustomNoDataStory } from './stories/NoDataAndLoader.story';
