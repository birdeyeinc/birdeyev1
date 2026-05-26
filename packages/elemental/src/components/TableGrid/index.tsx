// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useRef, useState, useMemo, useLayoutEffect, useCallback } from "react";
import { debounce, isEmpty, noop } from "lodash";
import LoaderBox from "atoms/LoaderBox";
import TableHeader from "./helper/TableGridHeader";
import TableBody from "./helper/TableGridBody";
import { useResizeDetector } from "react-resize-detector";
import NoDataSimple from "components/NoData/simple";
import { normalizeRowData, denormalizeRow } from "./utils/normalizeRowData";
import { applyMetadataToProps } from "./utils/metadataUtils";
import { useTableGridColumns } from "./context/TableGridColumnContext";
import styles from "./table.module.scss";
import InfiniteScroll from "react-infinite-scroller";
import type { TableGridProps, RowLike, NormalizedRow, SingleCellClickPayload } from './types';

const BASED_WINDOW_WIDTH = 1470; // This is the base width used for calculating scaleFactor when enableFluidWidthByDefault is true.

const TableGrid = ({
    tableId,
    tableData,
    onHandleRowClick,
    onHandleSingleCellClick,
    onHandleHeaderSortClick,
    rowHoverAction,
    cellRenderer,
    headerCellRenderer,
    customHeadersMaxWidth,
    customHeadersFixWidth,
    customHeadersMinWidth,
    tableContainerRef,
    isFirstColumnFixed,
    sort,
    loaderProps,
    noDataProps,
    tableContainerClass,
    "data-testid": tableDataTestId="",
    isHeaderFixed,
    infiniteScrollProps,
    sortDebounceWaitTime,
    accordionConfig,
    customRowWidth,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    disableRowHoverAction = ((_rowData: RowLike) => {return false;}),
    disabledStateForRow = {},
    virtualization = { enabled: false, rowHeight: 50, overscan: 5, switchThreshold: 20 },
    enableClientSideSort = false,
    sortComparator = null,
    viewPortColumns = 0,
    receiveNormalizedDataStructure = false,
    disablePerfOptimization = false,
    metadataConfig,
    height: tableHeight,
    width: tableWidth,
    scaleFactor,
    enableFluidWidthByDefault = false,
}: TableGridProps) => {

    const [sortColumn, setSortedColumn] = useState(sort?.sortby || "");
    const [order, setSortOrder] = useState(sort?.sortOrder || 0);
    // const [showScrollIcons, setShowScrollIcons] = useState<Record<string, boolean>>({});
    // const [horizontalScrollPosition, setHorizontalScrollPosition] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const horizontalScrollTableRef = useRef<HTMLDivElement>(null);
    const initializedHeaderSignatureRef = useRef("");
    const internalContainerRef = useRef<HTMLDivElement | null>(null);
    const [manualScaleFactor, setManualScaleFactor] = useState(scaleFactor || 1);

    // const resizerWidth = useRef<number | undefined>();
    // const prevScrollWidth = useRef<number | undefined>();

    const { width: resizeWidth = 0 } = useResizeDetector({
        refreshRate: 200,
        skipOnMount: false,
        refreshMode: 'debounce',
        targetRef: horizontalScrollTableRef
    });

    // Measure width synchronously before paint when viewPortColumns is used
    useLayoutEffect(() => {
        if (horizontalScrollTableRef.current && viewPortColumns) {
            const measuredWidth = horizontalScrollTableRef.current.clientWidth;
            if (measuredWidth > 0) {
                setContainerWidth(measuredWidth);
            }
        }
    }, [viewPortColumns]);

    useLayoutEffect(() => {
        const handleResize = () => {
            const scale = +(window.innerWidth / BASED_WINDOW_WIDTH).toFixed(2);
            setManualScaleFactor(scale > 0 ? scale : 1);
        };


        if (enableFluidWidthByDefault && !scaleFactor) {
            handleResize(); // compute initial scale on mount
            window.addEventListener("resize", handleResize);
        }
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    },[])

    // Update containerWidth when resize is detected
    useEffect(() => {
        if (resizeWidth > 0 && viewPortColumns) {
            setContainerWidth(resizeWidth);
        }
    }, [resizeWidth, viewPortColumns]);

    // Combined width for general use
    const width = viewPortColumns ? (containerWidth || resizeWidth) : resizeWidth;

    // useEffect(() => {
    //     const tableContainer = horizontalScrollTableRef.current;
    //     if (tableContainer) {
    //         updateScrollIcons(tableContainer, true);
    //     }
    // }, []);

    // useEffect(() => {
    //     const tableContainer = horizontalScrollTableRef.current;
    //     if (width && tableContainer) {
    //         updateScrollIcons(tableContainer, false);
    //     }
    // }, [width]);

    useEffect(() => {
        const debouncedHandelScroll = debounce(handleScroll, 200),
            tableRef = !infiniteScrollEnable
                ? tableContainerRef
                : horizontalScrollTableRef,
            scrollContainer = tableRef?.current;

        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', debouncedHandelScroll);

            return () => {
                scrollContainer.removeEventListener('scroll', debouncedHandelScroll);
                debouncedHandelScroll.cancel();
            };
        }
    }, []);


    // useEffect(() => {
    //     const tableRef = !infiniteScrollEnable
    //             ? tableContainerRef
    //             : horizontalScrollTableRef,
    //         { scrollWidth, clientWidth } = tableRef?.current || {};

    //     // If there's no scroll needed, hide icons
    //     if (scrollWidth <= clientWidth) {
    //         setShowScrollIcons({});
    //         return;
    //     }

    //     if (horizontalScrollPosition === 0) {
    //         if (showScrollIcons.left) setShowScrollIcons({ left: false, right: true, disable: true });
    //     } else if (horizontalScrollPosition + clientWidth >= scrollWidth) {
    //         if (showScrollIcons.right) setShowScrollIcons({ left: true, right: false, disable: true });
    //     } else {
    //         if (!showScrollIcons.left || !showScrollIcons.right) setShowScrollIcons({ left: true, right: true, disable: false });
    //     }
    // }, [horizontalScrollPosition, width]);

    const handleScroll = () => {
        // if (event?.target) setHorizontalScrollPosition(Math.ceil(event.target.scrollLeft));
    }

    const setContainerRef = useCallback((node: HTMLDivElement | null) => {
        internalContainerRef.current = node;
        if (tableContainerRef) {
            tableContainerRef.current = node;
        }
    }, [tableContainerRef]);

    // function updateScrollIcons(tableContainer: HTMLElement, isInitialMount: boolean = false) {
    //     if (!tableContainer) return;
        
    //     const { scrollWidth, clientWidth } = tableContainer;
        
    //     // Check if dimensions have actually changed (either clientWidth or scrollWidth)
    //     const dimensionsChanged = clientWidth !== resizerWidth.current || scrollWidth !== prevScrollWidth.current;
        
    //     if (dimensionsChanged || isInitialMount) {
    //         resizerWidth.current = clientWidth;
    //         prevScrollWidth.current = scrollWidth;
            
    //         const hasHorizontalScroll = scrollWidth > clientWidth;
            
    //         if (hasHorizontalScroll) {
    //             setShowScrollIcons({ left: true, right: true });
    //         } else {
    //             setShowScrollIcons({});
    //         }
    //     }
    // }

    const { data, headerData } = tableData;

    // Get column context for resize/customizer feature (returns no-op values if not in provider)
    // Passing tableId registers it with the provider context for persistence
    const { enableResize, resizingColumn, initializeColumns, getProcessedHeaders, isPersistenceLoading } = useTableGridColumns(tableId);

    // Fixed column scroll border — toggles CSS class via DOM (no React state = no re-renders)
    useEffect(() => {
        if (!isFirstColumnFixed) return;

        const tableRef = internalContainerRef;
        const scrollContainer = tableRef?.current;
        const wrapperEl = horizontalScrollTableRef.current;
        if (!scrollContainer || !wrapperEl) return;

        let rafId: number | null = null;
        const onScroll = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                wrapperEl.classList.toggle(styles['is-scrolled'], scrollContainer.scrollLeft > 0);
            });
        };

        scrollContainer.addEventListener('scroll', onScroll, { passive: true });
        // Check initial scroll position
        onScroll();

        return () => {
            scrollContainer.removeEventListener('scroll', onScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [isFirstColumnFixed, resizingColumn]);

    const rawHeaders = useMemo(() => {
        const list = [...(headerData || [])];
        return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }, [headerData]);

    const headers = useMemo(() => {
        return getProcessedHeaders(rawHeaders);
    }, [rawHeaders, getProcessedHeaders]);

    // Initialize column context only when header structure changes (prevents unwanted resets)
    useEffect(() => {
        if (!headerData || !initializeColumns) return;

        const signature = (headerData || [])
            .map((header) => `${header?.value}:${header?.label}:${header?.order}`)
            .join("|");

        if (initializedHeaderSignatureRef.current !== signature) {
            initializedHeaderSignatureRef.current = signature;
            initializeColumns(headerData);
        }
    }, [headerData, initializeColumns]);

    // Normalize row data from array to key-value structure for better column handling
    // Provides backward compatibility - works with both legacy array and new key-value formats
    const {normalizedData, _isProcessed } = useMemo(() => {
        return normalizeRowData(data, headerData);
    }, [data, headerData]);

    // Client-side sorting logic
    const sortedData = useMemo(() => {
        if (!enableClientSideSort || !sortColumn || !normalizedData || !sortComparator) {
            return normalizedData;
        }

        const dataToSort = [...normalizedData];
        return dataToSort.sort((a, b) => sortComparator(a, b, sortColumn, order));
    }, [normalizedData, sortColumn, order, enableClientSideSort, sortComparator]);

    // Wrapper for row click callback - denormalizes data for backward compatibility
    const handleRowClick = (row: RowLike) => {
        // if we are getting `receiveNormalizedDataStructure` as true, it means the consumer is ready to receive the new normalized data structure in the onHandleRowClick callback, 
        // so we will send the normalized row data as is. 
        // If it's false, then we checked `_isProcessed` to check consumer is using old Data structure, if yes then we will denormalize the row data back to the original array format for backward compatibility before sending it in the callback.
        if(receiveNormalizedDataStructure){
            onHandleRowClick?.(row);
        } else {
            onHandleRowClick?.(_isProcessed ? denormalizeRow(row as NormalizedRow, _isProcessed) || {} : row);
        }
    };

    const handleSingleCellClick = (cellData: SingleCellClickPayload) => {
        onHandleSingleCellClick?.(cellData);
    };

    const handleHeaderSortClick = useCallback((value: string, sortable: boolean) => {
        if (sortable) {
            const sortOrder = order === 0 ? 1 : 0;
            if (sortColumn === value) {
                setSortOrder(sortOrder);
                onHandleHeaderSortClick?.({ sortby: value, sortOrder });
            } else {
                setSortedColumn(value);
                setSortOrder(0);
                onHandleHeaderSortClick?.({ sortby: value, sortOrder: 0 });
            }
        }
    }, [order, sortColumn, onHandleHeaderSortClick]);

    const debouncedHandleHeaderSortClick = useMemo(
        () => debounce(handleHeaderSortClick, sortDebounceWaitTime),
        [handleHeaderSortClick, sortDebounceWaitTime]
    );

    useEffect(() => {
        return () => {
            debouncedHandleHeaderSortClick.cancel();
        };
    }, [debouncedHandleHeaderSortClick]);

    // const handleHorizontalScroll = (position: string) => {
    //     let tableRef: React.MutableRefObject<any> | React.RefObject<HTMLDivElement> | null =
    //         tableContainerRef && typeof tableContainerRef !== 'function' ? tableContainerRef : null;
    //     if (infiniteScrollEnable) {
    //         tableRef = horizontalScrollTableRef;
    //     }

    //     if (tableRef?.current) {
    //         if (position === "right") { tableRef.current.scrollLeft += getColumnWidth(); } else { tableRef.current.scrollLeft -= getColumnWidth(); }
    //         handleScroll();
    //     }
    // };

    // const getColumnWidth = () => {
    //     const firstNonFixedCell = horizontalScrollTableRef.current?.querySelector('td:not([data-fixed="true"])');
    //     if (firstNonFixedCell) {
    //         return (firstNonFixedCell as HTMLElement).offsetWidth
    //     } else return 150;
    // };

    const { title, subtitle, noDataClassName, noResultsImageSrc, customJsx: NoDataCustomJsx } = noDataProps || {};
    const { isLoading, type, isReseller, loaderClassName, customJsx: LoaderCustomJsx } = loaderProps || {};
    const { hasMore, loadMore, loader, useWindow=false, initialLoad, threshold, enable: infiniteScrollEnable = false } = infiniteScrollProps || {};
    
    const isVirtualizationActive = virtualization.enabled && (
        !infiniteScrollEnable || 
        (data && data.length >= (virtualization.switchThreshold ?? 20))
    );

    const testIdStr = `${tableDataTestId || tableId || tableContainerClass}_table`;

    const tableMetadata = metadataConfig?.table || {};
    const tableWrapperMetadata = metadataConfig?.tableWrapper || {};
    const tableContainerMetadata = metadataConfig?.tableContainer || {};

    const tableProps = applyMetadataToProps({
        className: `${styles["table"]} ${enableResize ? styles['resizable-columns'] : ''}`.trim(),
        id: testIdStr,
        "data-testid": `el-test-${testIdStr}`
    }, tableMetadata);

    const tableWrapperProps = applyMetadataToProps({
        id: tableContainerClass,
        className: `${styles["table-wrapper"]} ${isFirstColumnFixed ? styles["overflow"] : ""} ${resizingColumn ? styles['table-resizing'] : ''}`.trim(),
        "data-testid": `el-test-tbl-${testIdStr}-wrap`
    }, tableWrapperMetadata);

    const tableContainerProps = applyMetadataToProps({
        id: tableId,
        style: { ...(tableHeight && { height: `${tableHeight}px` }), ...(tableWidth && { width: `${tableWidth}px` }) },
        className: `${styles["table-container-wrapper"]} ${styles["overflow-x"]} ${styles["table-custom-scroll"]} ${tableContainerClass ? tableContainerClass : ""} ${useWindow ? "" : styles["overflow-y"]}`,
        "data-testid": `el-test-tbl-${testIdStr}-container`
    }, tableContainerMetadata);

    const tableJSX = (
        <table {...tableProps}>
            <TableHeader
                headers={headers}
                onHandleHeaderSortClick={debouncedHandleHeaderSortClick}
                sortColumn={sortColumn}
                sortOrder={order}
                customHeadersMaxWidth={customHeadersMaxWidth}
                customHeadersFixWidth={customHeadersFixWidth}
                customHeadersMinWidth={customHeadersMinWidth}
                rowHoverAction={rowHoverAction}
                isFirstColumnFixed={isFirstColumnFixed}
                isHeaderFixed={isHeaderFixed}
                headerCellRenderer={headerCellRenderer}
                containerWidth={containerWidth || width}
                viewPortColumns={viewPortColumns}
                metadataConfig={metadataConfig}
                scaleFactor={manualScaleFactor}
                enableFluidWidthByDefault={enableFluidWidthByDefault}
            />
            <TableBody
                data={enableClientSideSort ? sortedData : normalizedData}
                headers={headers}
                onHandleRowClick={!!onHandleRowClick ? handleRowClick : undefined}
                onHandleSingleCellClick={!!onHandleSingleCellClick ? handleSingleCellClick : undefined}
                rowHoverAction={rowHoverAction}
                cellRenderer={cellRenderer}
                isFirstColumnFixed={ isFirstColumnFixed}
                accordionConfig={accordionConfig}
                customRowWidth={customRowWidth}
                disableRowHoverAction={disableRowHoverAction}
                disabledStateForRow={disabledStateForRow}
                virtualization={{
                    ...virtualization,
                    enabled: isVirtualizationActive
                }}
                disablePerfOptimization={disablePerfOptimization}
                containerWidth={containerWidth || width}
                viewPortColumns={viewPortColumns}
                metadataConfig={metadataConfig}
                enableResize={enableResize}
                scaleFactor={manualScaleFactor}
                enableFluidWidthByDefault={enableFluidWidthByDefault}
                getTableContainerRef={()=> internalContainerRef}
            />
        </table>
    );

    // When viewPortColumns is set, wait for containerWidth to be calculated before showing table
    const isWidthReady = !viewPortColumns || (containerWidth > 0);
    const bDisplayPreferencesLoader = false;

    return (
        <div {...tableContainerProps} ref={setContainerRef}>
            <div {...tableWrapperProps} ref={horizontalScrollTableRef}>
                {!(bDisplayPreferencesLoader && isPersistenceLoading) && data && (!isEmpty(data) ?
                    isWidthReady ? (
                        !infiniteScrollEnable ?
                            tableJSX :
                            // @ts-expect-error InfiniteScroll class component type mismatch with React 18 JSX types
                            <InfiniteScroll
                                pageStart={0}
                                hasMore={hasMore}
                                loadMore={loadMore || noop}
                                loader={loader}
                                useWindow={useWindow}
                                initialLoad={initialLoad}
                                threshold={threshold}
                                getScrollParent={!useWindow ? () => internalContainerRef.current : undefined}
                            >{tableJSX}</InfiniteScroll>
                    ) : null
                    : !isLoading ? (NoDataCustomJsx ? <NoDataCustomJsx /> : <NoDataSimple
                        imageUrl={noResultsImageSrc}
                        title={title || `No results found`}
                        subtitle={subtitle}
                        customClassName={noDataClassName}
                    />) : null)}
            </div>
            {(isLoading || (bDisplayPreferencesLoader && isPersistenceLoading)) && <div className={loaderClassName}>{LoaderCustomJsx ? <LoaderCustomJsx /> : <LoaderBox type={type} reseller={isReseller ?? false} />}</div>}
        </div>
    );
};

TableGrid.defaultProps = {
    tableData: {},
    isFirstColumnFixed: false,
    loaderProps: {},
    noDataProps: {},
    tableContainerClass: "",
    isHeaderFixed: false,
    infiniteScrollProps: {},
    sortDebounceWaitTime: 200,
    accordionConfig: {
        enabled: false,
        defaultExpandedRowIds: [],
        maxExpandedRows: 0,
        subRowLimit: 0,
        onExpand: null,
        onLoadMoreSubRows: null,
        expandIconColumn: null,
        disableExpand: false
    },
    virtualization: { enabled: false, rowHeight: null, overscan: 5, switchThreshold: 20 },
    enableClientSideSort: false,
    sortComparator: null
};

export default TableGrid;