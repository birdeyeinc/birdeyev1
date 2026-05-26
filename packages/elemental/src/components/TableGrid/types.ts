import React from 'react';

// ============================================================================
// CELL & ROW DATA
// ============================================================================

export interface CellData {
    value?: any;
    label?: string;
    metadata?: Record<string, any>;
    onCellClick?: (args: CellClickPayload) => boolean | void;
    needIsHoverProp?: boolean;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface HeaderData {
    order?: number;
    value: string;
    label: string;
    enabled?: boolean;
    sortable?: boolean;
    fixed?: boolean;
    copyToClipboard?: boolean;
    minWidth?: number | string;
    maxWidth?: number | string;
    width?: number | string;
    locked?: boolean;
    metadata?: Record<string, any>;
    onHeaderClick?: (args: {
        event: React.MouseEvent;
        headerData: HeaderData;
        index: number;
        sortColumn: string;
        sortOrder: number;
    }) => boolean | void;
    needIsHoverProp?: boolean;
    onCellClick?: (args: CellClickPayload) => boolean | void;
    enabledFluidWidth?: boolean;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface LegacyRow {
    rowId?: string;
    rowData?: CellData[];
    expandedRowData?: Record<string, CellData>;
    children?: LegacyRow[];
    metadata?: Record<string, any>;
    isDisabled?: boolean;
    _originalRowData?: Record<string, CellData> | CellData[];
    _isNormalized?: boolean;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface NormalizedRow {
    rowId?: string;
    rowData: Record<string, CellData>;
    expandedRowData?: Record<string, CellData>;
    metadata?: Record<string, any>;
    isDisabled?: boolean;
    children?: NormalizedRow[];
    _originalRowData?: Record<string, CellData> | CellData[];
    _isNormalized?: boolean;
    _rowType?: 'parent' | 'child' | 'seeMore';
    _isExpanded?: boolean;
    _isExpandable?: boolean;
    _childrenCount?: number;
    _parentIndex?: number;
    _flatIndex?: number;
    _parentRowId?: string;
    _childIndex?: number;
    _isLastChild?: boolean;
    _currentVisibleCount?: number;
    _totalCount?: number;
    _remainingCount?: number;
    originalIndex?: number;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface NormalizeResult {
    normalizedData: NormalizedRow[];
    _isProcessed: boolean;
}

// ============================================================================
// SHARED CALLBACK TYPES
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericRecord = Record<string, any>;
export type RowLike = NormalizedRow | LegacyRow | GenericRecord;

export interface CellClickPayload {
    event: React.MouseEvent;
    cellData: CellData | GenericRecord;
    rowData: RowLike;
    rowIndex: number;
    cellIndex: number;
    headerData: HeaderData;
    headerKey: string;
}

export type SingleCellClickPayload = {
    event: React.MouseEvent;
    rowData: RowLike;
    rowIndex: number;
    cellIndex: number;
    headerData: HeaderData;
    headerKey: string;
    row_value?: any;
} & GenericRecord;

// ============================================================================
// SORT
// ============================================================================

export interface SortConfig {
    sortby: string;
    sortOrder: number;
}

// ============================================================================
// ROW HOVER ACTION
// ============================================================================

export interface RowHoverAction {
    enable?: boolean;
    removeActionBoxes?: boolean;
    actionBoxConfigs?: any[];
    customJSX?: (row: RowLike) => React.ReactNode;
}

// ============================================================================
// LOADER & NO DATA
// ============================================================================

export interface LoaderProps {
    isLoading?: boolean;
    type?: string;
    isReseller?: boolean;
    loaderClassName?: string;
    customJsx?: React.ComponentType;
}

export interface NoDataProps {
    title?: string;
    subtitle?: string;
    noDataClassName?: string;
    noResultsImageSrc?: string;
    customJsx?: React.ComponentType;
}

// ============================================================================
// INFINITE SCROLL
// ============================================================================

export interface InfiniteScrollProps {
    hasMore?: boolean;
    loadMore?: (...args: any[]) => void;
    loader?: React.ReactElement;
    useWindow?: boolean;
    initialLoad?: boolean;
    threshold?: number;
    enable?: boolean;
}

// ============================================================================
// ACCORDION
// ============================================================================

export interface AccordionConfig {
    enabled?: boolean;
    defaultExpandedRowIds?: string[];
    maxExpandedRows?: number;
    subRowLimit?: number;
    onExpand?: ((rowId: string, isExpanded: boolean, expandedRowIds: string[]) => void) | null;
    onLoadMoreSubRows?: ((parentRowId: string, currentCount: number) => void) | null;
    expandIconColumn?: string | null;
    disableExpand?: boolean;
}

// ============================================================================
// VIRTUALIZATION
// ============================================================================

export interface VirtualizationConfig {
    enabled?: boolean;
    rowHeight?: number | null;
    overscan?: number;
    switchThreshold?: number;
    useWindow?: boolean;
}

// ============================================================================
// CUSTOM ROW WIDTH
// ============================================================================

export interface CustomRowWidth {
    customRowMaxWidth?: Record<string, number | string>;
    customRowFixWidth?: Record<string, number | string>;
    customRowMinWidth?: Record<string, number | string>;
}

// ============================================================================
// METADATA
// ============================================================================

export interface MetadataConfig {
    tr?: Record<string, any>;
    th?: Record<string, Record<string, any>>;
    td?: Record<string, Record<string, any>>;
    table?: Record<string, any>;
    tableWrapper?: Record<string, any>;
    tableContainer?: Record<string, any>;
}

// ============================================================================
// COLUMN CONFIG
// ============================================================================

export interface ColumnConfig {
    columnWidths?: Record<string, number>;
    columnVisibility?: Record<string, boolean>;
    columnOrder?: string[] | null;
    lockedColumns?: string[] | Set<string>;
}

export interface ColumnChangeEvent {
    type: string;
    columnKey: string | null;
    config: ColumnConfig;
}

export const COLUMN_CHANGE_TYPES = {
    RESIZE: 'resize',
    REORDER: 'reorder',
    VISIBILITY: 'visibility',
    BULK: 'bulk',
    RESET: 'reset',
    INIT: 'init',
} as const;

// ============================================================================
// COLUMN CONTEXT
// ============================================================================

export interface TableGridColumnContextValue {
    // State
    columnWidths: Record<string, number>;
    columnVisibility: Record<string, boolean>;
    columnOrder: string[] | null;
    lockedColumns: Set<string>;
    resizingColumn: string | null;
    headerData: HeaderData[];
    isModified: boolean;
    isPersistenceLoading: boolean;
    tableId: string;

    // Config
    minColumnWidth: number;
    maxColumnWidth: number;
    enableResize: boolean;
    resizeMode: 'onChange' | 'onEnd';
    enableReorder: boolean;
    enableVisibilityToggle: boolean;
    isControlled: boolean;

    // Actions
    registerTableId: (tableId: string) => void;
    initializeColumns: (headerData: HeaderData[]) => void;
    setColumnWidth: (columnKey: string, width: number) => void;
    setResizingColumn: (columnKey: string | null) => void;
    finalizeResize: (columnKey: string, finalWidth: number) => void;
    setColumnVisibility: (columnKey: string, visible: boolean) => void;
    setMultipleColumnVisibility: (visibilityMap: Record<string, boolean>) => void;
    toggleColumnVisibility: (columnKey: string) => void;
    reorderColumns: (fromIndex: number, toIndex: number, currentOrder: string[]) => void;
    setColumnOrder: (columnOrder: string[] | null) => void;
    applyBulkConfig: (updates: { columnWidths?: Record<string, number>; columnVisibility?: Record<string, boolean>; columnOrder?: string[] | null; lockedColumns?: string[] }) => void;
    resetConfig: () => void;

    // Getters
    getColumnWidth: (columnKey: string) => number | undefined;
    isColumnVisible: (columnKey: string) => boolean;
    isColumnLocked: (columnKey: string) => boolean;
    getColumnResizeBounds: (columnKey: string) => { columnKey?: string; min: number; max: number };
    getProcessedHeaders: (headerData: HeaderData[]) => HeaderData[];
}

// ============================================================================
// PERSISTENCE
// ============================================================================

/**
 * Generic GraphQL fetcher function.
 * Receives { query, variables } and must return the resolved GraphQL `data` object.
 * Example: `{ getPreference: { key, type, config } }`
 */
export type GraphQLFetcher = (params: {
    query: string;
    variables: Record<string, unknown>;
}) => Promise<Record<string, unknown>>;

/**
 * Keys from `ColumnConfig` that may be persisted to backend.
 * Used by `PersistenceConfig.persistKeys` to allowlist what to save.
 */
export type PersistableColumnKey = 'columnWidths' | 'columnVisibility' | 'columnOrder' | 'lockedColumns';

export const DEFAULT_PERSIST_KEYS: PersistableColumnKey[] = ['columnVisibility', 'columnOrder', 'lockedColumns'];

/**
 * Configuration for backend persistence of column config.
 * Pass this to `TableGridColumnProvider` via the `persistence` prop.
 * Presence of this prop enables persistence — no separate boolean needed.
 *
 * Provide either `fetcher` (generic) or `apiResource` + `graphqlEndpoint` (Birdeye pattern).
 */
export interface PersistenceConfig {
    /**
     * Option 1: Generic GraphQL fetcher function.
     * The consuming app wraps their HTTP client (axios, fetch, etc.) into this shape.
     * Elemental calls this with { query, variables } and expects the resolved `data` back.
     */
    fetcher?: GraphQLFetcher;

    /**
     * Option 2: Birdeye API resource (e.g., beNodeResource from apiHelper.js).
     * Must have a `.post(path, data, config)` method that returns `{ data }`.
     * Requires `graphqlEndpoint` to be set.
     */
    apiResource?: {
        post: (path: string, data: unknown, config?: Record<string, unknown>) => Promise<{ data: unknown }>;
    };

    /** GraphQL endpoint path (e.g., "/uiPreferencesApi/graphql"). Required when using apiResource. */
    graphqlEndpoint?: string;

    /** Callback when save to backend fails after all retries. */
    onError?: (error: Error) => void;

    /** Called when the initial preferences fetch loading state changes. */
    onLoadingChange?: (isLoading: boolean) => void;

    /**
     * Allowlist of config keys to persist to backend.
     * Default: `['columnVisibility', 'columnOrder', 'lockedColumns']` — widths are NOT saved by default.
     * Pass `['columnWidths', 'columnVisibility', 'columnOrder']` to also persist resize, omit `'columnOrder'` to skip ordering, etc.
     * Keys not in the list are stripped both on save and after fetch.
     */
    persistKeys?: PersistableColumnKey[];
}

// ============================================================================
// TABLE GRID COLUMN PROVIDER PROPS
// ============================================================================

interface BaseTableColumnProviderProps {
    children: React.ReactNode;
    columnConfig?: ColumnConfig;
    onColumnConfigChange?: (event: ColumnChangeEvent) => void;
    initialColumnConfig?: ColumnConfig;
    minColumnWidth?: number;
    maxColumnWidth?: number;
    enableResize?: boolean;
    resizeMode?: 'onChange' | 'onEnd';
    enableReorder?: boolean;
    enableVisibilityToggle?: boolean;
    /**
     * Backend persistence configuration.
     * Pass this to enable auto-save/load of column config.
     * Omit to disable persistence (default behavior).
     */
    persistence?: PersistenceConfig;
}

export type TableGridColumnProviderProps = BaseTableColumnProviderProps;

// ============================================================================
// TABLE PROPS
// ============================================================================

export interface TableGridData {
    totalCount?: number;
    headerData?: HeaderData[];
    data?: LegacyRow[] | NormalizedRow[];
}

export interface TableGridCellRendererProps {
    rowData?: CellData | Record<string, CellData>;
    headerData?: HeaderData;
    headerKey?: string;
    rowId?: string;
    cellIndex?: number;
    rowIndex?: number;
    _isExpanded?: boolean;
    _isExpandable?: boolean;
    _childrenCount?: number;
    isHovered?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface VirtualizedCellRendererProps {
    cellData?: any;
    rowData?: RowLike;
    columnData?: VirtualizedColumnConfig;
    columnIndex?: number;
    dataKey?: string;
    rowIndex?: number;
    isScrolling?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface TableGridHeaderRendererProps {
    headerData?: HeaderData;
    index?: number;
    sortColumn?: string;
    sortOrder?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface VirtualizedHeaderRendererProps {
    columnData?: VirtualizedColumnConfig;
    dataKey?: string;
    disableSort?: boolean;
    label?: string;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

// Backward-compatible aliases for existing usages.
export type CellRendererProps = TableGridCellRendererProps | VirtualizedCellRendererProps;
export type HeaderRendererProps = TableGridHeaderRendererProps | VirtualizedHeaderRendererProps;

export type CellRendererMap = Record<
  string,
        React.ReactElement | React.ComponentType<CellRendererProps>
>;
export type HeaderCellRendererMap = Record<
  string,
        React.ReactElement | React.ComponentType<HeaderRendererProps>
>;

export interface TableGridProps {
    /**
    * Unique identifier for this table grid instance.
    * Single source of truth — passed through context to the TableGridColumnProvider
     * for backend persistence. Also used as the HTML `id` on the table container.
     */
    tableId?: string;
    tableData: TableGridData;
    onHandleRowClick?: (row: RowLike) => void;
    onHandleSingleCellClick?: (cellData: SingleCellClickPayload) => void;
    onHandleHeaderSortClick?: (sort: SortConfig) => void;
    rowHoverAction?: RowHoverAction;
    cellRenderer?: CellRendererMap;
    headerCellRenderer?: HeaderCellRendererMap;
    customHeadersMaxWidth?: Record<string, number | string>;
    customHeadersFixWidth?: Record<string, number | string>;
    customHeadersMinWidth?: Record<string, number | string>;
    tableContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
    isFirstColumnFixed?: boolean;
    sort?: SortConfig;
    loaderProps?: LoaderProps;
    noDataProps?: NoDataProps;
    tableContainerClass?: string;
    "data-testid"?: string;
    isHeaderFixed?: boolean;
    infiniteScrollProps?: InfiniteScrollProps;
    sortDebounceWaitTime?: number;
    accordionConfig?: AccordionConfig;
    customRowWidth?: CustomRowWidth;
    disableRowHoverAction?: (rowData: RowLike) => boolean;
    disabledStateForRow?: Record<string, { isDisabled?: boolean }>;
    virtualization?: VirtualizationConfig;
    enableClientSideSort?: boolean;
    sortComparator?: ((a: RowLike, b: RowLike, sortColumn: string, order: number) => number) | null;
    viewPortColumns?: number;
    receiveNormalizedDataStructure?: boolean;
    disablePerfOptimization?: boolean;
    metadataConfig?: MetadataConfig;
    height?: number;
    width?: number;
    scaleFactor?: number;
    enableFluidWidthByDefault?: boolean;
}

// ============================================================================
// COLUMN PROPS (Declarative Column component)
// ============================================================================

export interface ColumnProps {
    dataKey: string;
    label?: string;
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    enabledFluidWidth?: boolean;
    flexGrow?: number;
    sortable?: boolean;
    fixed?: boolean;
    enabled?: boolean;
    copyToClipboard?: boolean;
    cellRenderer?: (props: VirtualizedCellRendererProps) => React.ReactNode;
    headerRenderer?: (props: VirtualizedHeaderRendererProps) => React.ReactNode;
    columnData?: GenericRecord;
    disableSort?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

// ============================================================================
// VIRTUALIZED STYLE TABLE PROPS
// ============================================================================

export interface VirtualizedStyleTableGridProps {
    rowCount: number;
    rowGetter: (args: { index: number }) => RowLike;
    columns?: ColumnProps[];
    children?: React.ReactNode;
    onRowClick?: (rowData: RowLike) => void;
    onHeaderClick?: (sort: SortConfig) => void;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
    loaderProps?: LoaderProps;
    noDataProps?: NoDataProps;
    isFirstColumnFixed?: boolean;
    isHeaderFixed?: boolean;
    tableContainerClass?: string;
    "data-testid"?: string;
    tableContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
    virtualization?: VirtualizationConfig;
    infiniteScrollProps?: InfiniteScrollProps;
    accordionConfig?: AccordionConfig;
    rowHoverAction?: RowHoverAction;
    disableRowHoverAction?: (rowData: RowLike) => boolean;
    disabledStateForRow?: Record<string, { isDisabled?: boolean }>;
    customRowWidth?: CustomRowWidth;
    enableClientSideSort?: boolean;
    sortComparator?: ((a: RowLike, b: RowLike, sortColumn: string, order: number) => number) | null;
    sortDebounceWaitTime?: number;
    viewPortColumns?: number;
    receiveNormalizedDataStructure?: boolean;
    disablePerfOptimization?: boolean;
    metadataConfig?: MetadataConfig;
    scaleFactor?: number;
    enableFluidWidthByDefault?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

// ============================================================================
// COLUMN CUSTOMIZER PROPS
// ============================================================================

export interface ColumnCustomizerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (config: { visibility: Record<string, boolean> | null; order: string[] | null }) => void;
    title?: string;
    subtitle?: string;
    drawerWidth?: string;
    showSearch?: boolean;
    showResetButton?: boolean;
    resetButtonText?: string;
    saveButtonText?: string;
    applyMode?: 'onChange' | 'onSave';
    onColumnChange?: (change: ColumnChangeEvent | GenericRecord) => void;
}

// ============================================================================
// HELPER COMPONENT PROPS
// ============================================================================

export interface ColumnResizeHandleProps {
    columnKey: string;
    columnRef?: React.RefObject<Element>;
    onResizeStart?: (columnKey: string, width: number) => void;
    onResize?: (columnKey: string, width: number) => void;
    onResizeEnd?: (columnKey: string, width: number) => void;
}

export interface TableGridHeaderProps {
    headers: HeaderData[];
    onHandleHeaderSortClick: (value: string, sortable: boolean) => void;
    sortOrder: number;
    sortColumn: string;
    rowHoverAction?: RowHoverAction;
    scaleFactor?: number;
    enableFluidWidthByDefault?: boolean;
    customHeadersMaxWidth?: Record<string, number | string>;
    customHeadersFixWidth?: Record<string, number | string>;
    customHeadersMinWidth?: Record<string, number | string>;
    isFirstColumnFixed?: boolean;
    handleHorizontalScroll?: (position: string) => void;
    isHeaderFixed?: boolean;
    headerCellRenderer?: HeaderCellRendererMap;
    containerWidth?: number;
    viewPortColumns?: number;
    metadataConfig?: MetadataConfig;
}

/**
 * Props passed to the header cell renderer function.
 * Extends HeaderData with computed sort state for the specific column.
 */
export interface HeaderRendererInput extends HeaderData {
    isSorted?: boolean;         // true if this column is the currently sorted column
    sortOrder?: number;         // 0 (asc) or 1 (desc) — only present when isSorted is true
}

export interface HeaderCellProps {
    headerData: HeaderData;
    index: number;
    sortColumn: string;
    sortOrder: number;
    onHandleHeaderSortClick: (value: string, sortable: boolean) => void;
    scaleFactor?: number;
    enableFluidWidthByDefault?: boolean;
    customHeadersMaxWidth?: Record<string, number | string>;
    customHeadersFixWidth?: Record<string, number | string>;
    customHeadersMinWidth?: Record<string, number | string>;
    isFirstColumnFixed?: boolean;
    containerWidth?: number;
    viewPortColumns?: number;
    metadataConfig?: MetadataConfig;
    renderer: (props: HeaderRendererInput) => React.ReactNode;
    enableResize?: boolean;
    columnWidth?: number;
    isLastColumn?: boolean;
    defaultMinWidthForAllColumns?: number;
    deafaultMaxWidthForAllColumns?: number;
}

export interface TableGridBodyProps {
    data: NormalizedRow[];
    headers: HeaderData[];
    onHandleRowClick?: (row: RowLike) => void;
    onHandleSingleCellClick?: (cellData: SingleCellClickPayload) => void;
    rowHoverAction?: RowHoverAction;
    scaleFactor?: number;
    enableFluidWidthByDefault?: boolean;
    cellRenderer?: CellRendererMap;
    isFirstColumnFixed?: boolean;
    accordionConfig?: AccordionConfig;
    customRowWidth?: CustomRowWidth;
    disableRowHoverAction?: (rowData: RowLike) => boolean;
    disabledStateForRow?: Record<string, { isDisabled?: boolean }>;
    virtualization?: VirtualizationConfig;
    containerWidth?: number;
    viewPortColumns?: number;
    disablePerfOptimization?: boolean;
    metadataConfig?: MetadataConfig;
    enableResize?: boolean;
    getTableContainerRef?: () => React.RefObject<HTMLDivElement | null>;
}

export interface UseVirtualizationParams {
    data: NormalizedRow[];
    virtualization: VirtualizationConfig;
    containerRef: React.RefObject<HTMLElement | null>;
    enabledHeaders: HeaderData[];
    rowHoverAction?: RowHoverAction;
    enableAccordion?: boolean;
}

export interface UseVirtualizationReturn {
    visibleItems: NormalizedRow[];
    totalHeight: number;
    offsetY: number;
    renderSpacers: () => { topSpacer: React.ReactNode | null; bottomSpacer: React.ReactNode | null };
    isVirtualized: boolean;
    effectiveRowHeight?: number;
}

// ============================================================================
// VIRTUALIZED ADAPTER TYPES
// ============================================================================

export interface VirtualizedColumnConfig {
    dataKey: string;
    label?: string;
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    enabledFluidWidth?: boolean;
    flexGrow?: number;
    disableSort?: boolean;
    fixed?: boolean;
    enabled?: boolean;
    copyToClipboard?: boolean;
    cellRenderer?: (props: VirtualizedCellRendererProps) => React.ReactNode;
    headerRenderer?: (props: VirtualizedHeaderRendererProps) => React.ReactNode;
    sortable?: boolean;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface AdaptVirtualizedPropsInput {
    rowCount: number;
    rowGetter: (args: { index: number }) => RowLike;
    columns: VirtualizedColumnConfig[];
    onRowClick?: (row: RowLike) => void;
    onHeaderClick?: (sort: SortConfig) => void;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
    metadataconfig?: MetadataConfig;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

// ============================================================================
// COLUMN WIDTH UTILS
// ============================================================================

export interface ColumnBoundsInput {
    columnKey: string;
    headerData?: HeaderData;
    globalMin: number;
    globalMax: number;
}

export interface ColumnBounds {
    columnKey: string;
    min: number;
    max: number;
}

// ============================================================================
// SIDE DRAWER (atom) — imperative handle & props
// ============================================================================

export interface SideDrawerHandle {
    toggleDrawerComp: () => void;
    setOpenComp: (open: boolean) => void;
}

export interface SideDrawerProps {
    children?: React.ReactNode;
    containerClassName?: string;
}

// ============================================================================
// COLUMN CUSTOMIZER INTERNAL PROPS
// ============================================================================

export interface ColumnItemProps {
    column: { value: string; label: string };
    index: number;
    onToggleVisibility: (columnKey: string, visible: boolean) => void;
    onDragStart: (index: number) => void;
    onDragEnter: (index: number, half: 'top' | 'bottom') => void;
    onDragLeave: (index: number) => void;
    onDragEnd: () => void;
    onDrop: (index: number) => void;
    isDragging?: boolean;
    dragOverIndex?: number | null;
    dragOverHalf?: string | null;
    isLocked?: boolean;
    isVisible?: boolean;
    enableReorder?: boolean;
    enableVisibilityToggle?: boolean;
}

// ============================================================================
// TABLE COLUMN CONTEXT INTERNAL TYPES
// ============================================================================

export interface ResolvedConfig {
    columnWidths: Record<string, number>;
    columnVisibility: Record<string, boolean>;
    columnOrder: string[] | null;
    lockedColumns: Set<string>;
}
