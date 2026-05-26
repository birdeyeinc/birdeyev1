import React, { useEffect, useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { debounce, isEmpty, noop } from "lodash";
import "./index.scss";
import LoaderBox from "atoms/LoaderBox";
import TableHeader from "./helper/TableHeader";
import TableBody from "./helper/TableBody";
import { useResizeDetector } from "react-resize-detector";
import NoDataSimple from "components/NoData/simple";

import InfiniteScroll from "react-infinite-scroller";

const Table = ({
    tableData,
    onHandleRowClick = noop,
    onHandleSingleCellClick = noop,
    onHandleHeaderSortClick = noop,
    rowHoverAction,
    cellRenderer,
    headerCellRenderer,
    customHeadersMaxWidth,
    customHeadersFixWidth,
    customHeadersMinWidth,
    tableContainerRef,
    isFirstRowFixed,
    sort,
    loaderProps,
    noDataProps,
    tableContainerClass,
    tableDataTestId = "",
    isHeaderFixed,
    infiniteScrollProps,
    sortDebounceWaitTime,
    accordionConfig,
    customRowWidth,
    disableRowHoverAction = ((rowData) => {return false;}),
    disabledStateForRow = [],
    virtualization = { enabled: false, rowHeight: 50, overscan: 5, switchThreshold: 20 },
    enableClientSideSort = false,
    sortComparator = null,
}) => {

    const [sortColumn, setSortedColumn] = useState(sort?.sortby || "");
    const [order, setSortOrder] = useState(sort?.sortOrder || 0);
    const [showScrollIcons, setShowScrollIcons] = useState({});
    const [horizontalScrollPosition, setHorizontalScrollPosition] = useState(0);
    const horizontalScrollTableRef = useRef(null);

    const resizeCounter = useRef(0);
    const resizerWidth = useRef();

    const { width = 0 } = useResizeDetector({
        refreshRate: 200,
        skipOnMount: false,
        refreshMode: 'debounce',
        targetRef: horizontalScrollTableRef
    });

    useEffect(() => {
        const tableContainer = horizontalScrollTableRef.current;
        updateScrollIcons(tableContainer);
    }, []);

    useEffect(() => {
        const tableContainer = horizontalScrollTableRef.current;
        if (width) {
            updateScrollIcons(tableContainer);
        }
    }, [width]);

    useEffect(() => {
        const debouncedHandelScroll = debounce(handleScroll, 200),
            tableRef = isEmpty(infiniteScrollProps) ? tableContainerRef : horizontalScrollTableRef,
            scrollContainer = tableRef?.current;

        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', debouncedHandelScroll);

            return () => {
                scrollContainer.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    useEffect(() => {
        const tableRef = isEmpty(infiniteScrollProps) ? tableContainerRef : horizontalScrollTableRef,
            { scrollWidth, clientWidth } = tableRef?.current || {};

        // If there's no scroll needed, hide icons
        if (scrollWidth <= clientWidth) {
            setShowScrollIcons({});
            return;
        }

        if (horizontalScrollPosition === 0) {
            showScrollIcons.left && setShowScrollIcons({ left: false, right: true, disable: true });
        } else if (horizontalScrollPosition + clientWidth >= scrollWidth) {
            showScrollIcons.right && setShowScrollIcons({ left: true, right: false, disable: true });
        } else {
            (!showScrollIcons.left || !showScrollIcons.right) && setShowScrollIcons({ left: true, right: true, disable: false });
        }
    }, [horizontalScrollPosition, width])

    const handleScroll = (event) => {
        event?.target && setHorizontalScrollPosition(Math.ceil(event.target.scrollLeft));
    }

    function updateScrollIcons(tableContainer) {
        if (tableContainer && tableContainer.clientWidth !== resizerWidth.current) {
            resizerWidth.current = tableContainer.clientWidth;
            const flag = tableContainer.scrollWidth > tableContainer.clientWidth;
            if (flag && resizeCounter.current < 1) {
                setShowScrollIcons({ left: true, right: true });
                resizeCounter.current += 1;
            } else if (!flag) {
                setShowScrollIcons({});
                resizeCounter.current = 0;
            }
        }
    }

    const { data, headerData } = tableData;
    
    let headers = [...(headerData || [])];
    headers = headers.sort((a, b) => a.order - b.order);

    // Client-side sorting logic
    const sortedData = useMemo(() => {
        if (!enableClientSideSort || !sortColumn || !data || !sortComparator) {
            return data;
        }

        const dataToSort = [...data];
        return dataToSort.sort((a, b) => sortComparator(a, b, sortColumn, order));
    }, [data, sortColumn, order, enableClientSideSort, sortComparator]);

    const handleHeaderSortClick = (value, sortable, index) => {
        if (sortable) {
            let sortOrder = order === 0 ? 1 : 0;
            if (sortColumn === value) {
                setSortOrder(sortOrder);
                onHandleHeaderSortClick({ sortby: value, sortOrder, index });
            } else {
                setSortedColumn(value);
                setSortOrder(0);
                onHandleHeaderSortClick({ sortby: value, sortOrder: 0, index });
            }
        }
    };

    const debouncedHandleHeaderSortClick = debounce(handleHeaderSortClick, sortDebounceWaitTime);

    const handleHorizontalScroll = (position) => {
        let tableRef = tableContainerRef;
        if (!isEmpty(infiniteScrollProps)) {
            tableRef = horizontalScrollTableRef;
        }

        if (tableRef?.current) {
            position === "right" ? tableRef.current.scrollLeft += getColumnWidth() : tableRef.current.scrollLeft -= getColumnWidth();
            handleScroll(tableRef);
        }
    };

    const getColumnWidth = () => {
        const firstNonFixedCell = horizontalScrollTableRef.current.querySelector('td:not([data-fixed="true"])');
        if (firstNonFixedCell) {
            return firstNonFixedCell.offsetWidth
        } else return 150;
    };

    const { title, subtitle, noDataClassName, noResultsImageSrc } = noDataProps;
    const { isLoading, type, isReseller, loaderClassName } = loaderProps;
    const { hasMore, loadMore, loader, useWindow, initialLoad, threshold } = infiniteScrollProps;
    
    const isVirtualizationActive = virtualization.enabled && (
        isEmpty(infiniteScrollProps) || 
        (data && data.length >= (virtualization.switchThreshold || 20))
    );

    const testIdStr = `${tableDataTestId || tableContainerClass}_table`;

    const tableJSX = (
        <table className="table" id={testIdStr} data-testid={`el-test-${testIdStr}`} >
            <TableHeader
                headers={headers}
                onHandleHeaderSortClick={debouncedHandleHeaderSortClick}
                sortColumn={sortColumn}
                sortOrder={order}
                customHeadersMaxWidth={customHeadersMaxWidth}
                customHeadersFixWidth={customHeadersFixWidth}
                customHeadersMinWidth={customHeadersMinWidth}
                rowHoverAction={rowHoverAction}
                isFirstRowFixed={!isEmpty(showScrollIcons) && isFirstRowFixed}
                handleHorizontalScroll={handleHorizontalScroll}
                isHeaderFixed={isHeaderFixed}
                headerCellRenderer={headerCellRenderer}
                showScrollIcons={showScrollIcons}
            />
            <TableBody
                data={enableClientSideSort ? sortedData : data}
                headers={headers}
                onHandleRowClick={onHandleRowClick}
                onHandleSingleCellClick={onHandleSingleCellClick}
                rowHoverAction={rowHoverAction}
                cellRenderer={cellRenderer}
                isFirstRowFixed={!isEmpty(showScrollIcons) && isFirstRowFixed}
                accordionConfig={accordionConfig}
                customRowWidth={customRowWidth}
                disableRowHoverAction={disableRowHoverAction}
                disabledStateForRow={disabledStateForRow}
                virtualization={{
                    ...virtualization,
                    enabled: isVirtualizationActive
                }}
            />
        </table>
    );

    return (
        <div id="myTable" className={`table-container-wrapper ${tableContainerClass ? tableContainerClass : ""} overflow-y`} ref={tableContainerRef}>
            <div id={tableContainerClass} className={`table-wrapper ${isFirstRowFixed ? "overflow" : ""}`} ref={horizontalScrollTableRef}>
                {data && (!isEmpty(data) ?
                    isEmpty(infiniteScrollProps) ?
                        tableJSX :
                        <InfiniteScroll
                            pageStart={0}
                            hasMore={hasMore}
                            loadMore={loadMore}
                            loader={loader}
                            useWindow={useWindow}
                            initialLoad={initialLoad}
                            threshold={threshold}
                        >{tableJSX}</InfiniteScroll> 
                    : !isLoading ? <NoDataSimple
                        imageUrl={noResultsImageSrc}
                        title={title || `No results found`}
                        subtitle={subtitle}
                        customClassName={noDataClassName}
                    /> : null)}
            </div>
            {isLoading && <div className={loaderClassName}><LoaderBox type={type} reseller={isReseller} /></div>}
        </div>
    );
};

Table.defaultProps = {
    tableData: {},
    isFirstRowFixed: false,
    loaderProps: {},
    noDataProps: {},
    tableContainerClass: "",
    isHeaderFixed: false,
    infiniteScrollProps: {},
    sortDebounceWaitTime: 200,
    accordionConfig: {
        enableAccordion: false,
        defaultAccordionState: {isOpen: false, primaryRowId: ''},
        disableAccordionClick: false
    },
    virtualization: { enabled: false, rowHeight: null, overscan: 5, switchThreshold: 100 },
    enableClientSideSort: false,
    sortComparator: null
};

Table.propTypes = {
    tableData: PropTypes.object.isRequired,
    onHandleHeaderSortClick: PropTypes.func,
    onHandleRowClick: PropTypes.func,
    onHandleSingleCellClick: PropTypes.func,
    rowHoverAction: PropTypes.shape({
        enable: PropTypes.bool,
        config: PropTypes.func,
        enableThreeDots: PropTypes.bool,
    }),
    cellRenderer: PropTypes.object,
    customHeadersMaxWidth: PropTypes.object,
    customHeadersFixWidth: PropTypes.object,
    customHeadersMinWidth: PropTypes.object,
    tableContainerRef: PropTypes.object,
    isFirstRowFixed: PropTypes.bool,
    sort: PropTypes.object,
    loaderProps: PropTypes.object,
    noDataProps: PropTypes.object,
    tableContainerClass: PropTypes.string,
    isHeaderFixed: PropTypes.bool,
    headerCellRenderer:PropTypes.object,
    infiniteScrollProps: PropTypes.shape({
        hasMore: PropTypes.bool,
        loadMore: PropTypes.func,
        useWindow: PropTypes.bool,
        initialLoad: PropTypes.bool,
        threshold: PropTypes.number
    }),
    sortDebounceWaitTime: PropTypes.number,
    accordionConfig: PropTypes.shape({
        enableAccordion: PropTypes.bool,
        defaultAccordionState: PropTypes.shape({
            isOpen: PropTypes.bool,
            primaryRowId: PropTypes.string
        })
    }),
    customRowWidth: PropTypes.shape({
        customRowMaxWidth: PropTypes.object,
        customRowFixWidth: PropTypes.object,
        customRowMinWidth: PropTypes.object
    }),
    disableRowHoverAction: PropTypes.func,
    disabledStateForRow: PropTypes.array, 
    virtualization: PropTypes.shape({
        enabled: PropTypes.bool,
        rowHeight: PropTypes.number,
        overscan: PropTypes.number,
        switchThreshold: PropTypes.number
    }),
    enableClientSideSort: PropTypes.bool,
    sortComparator: PropTypes.func
};

export default Table;