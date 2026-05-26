import React from "react";
import PropTypes from "prop-types";
import Styles from "./TableContainer.module.scss";
import Popover from "atoms/Popover";
import InfiniteScroll from "react-infinite-scroller";
import FormInput from "atoms/FormInput";
import Tooltip from "atoms/Tooltip";
import { Column, Table, AutoSizer, InfiniteLoader, defaultTableRowRenderer, WindowScroller } from "react-virtualized";
import map from "lodash/map";
import clsx from "clsx";
import "react-virtualized/styles.css";

// let flotTip = new QuickToolTip({
//     show: false,
//     text: "",
//     tooltipClass: Styles["tooltipFlot"],
//     position: {
//         top: 0,
//         left: 0
//     },
//     isBluejay: true
// });
let flotTipTimerId = null;
let elemLeftPos = [];
let selectedParentCatId = [];
class TableContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startIndex: props.tableData?.startIndex || 0,
            lastIndex: props.tableData?.lastIndex || 3,
            fixedWidthFirstColumn: 20,
            updateTable: false,
            seeMoreClicked: false
        };
        this.tableAllColumns = null;
        this.listRef = React.createRef();
        this.theadRef = null;
        this.upperHead = null;
        this.tableFixedHeader = null;
        //this.parser = new DOMParser();

        this.prevNextIndex = 1;
        this.nextDisabled = false;
        this.virtualRowRenderer = this.rowHof(defaultTableRowRenderer);
        this.currentRowHoverIndexes = [];
    }

    rowHof = (rowRendererFn) => {
        function tableRowFn(props) {
            const propsStyled = {
                ...props,
                style: {
                    ...props.style
                    //top: 0,
                    //transform: `translate3d(0px,${props.style.top}px, 0px)`,
                    //willChange: "transform",
                    //transition: "8s transform"
                }
            };
            const row = rowRendererFn({
                ...propsStyled
            });

            const rowWithId = { ...row, key: props.rowData.id || props.key };
            return rowWithId;
        }

        return tableRowFn;
    };

    getTableHeadJsx = (tableData, cacheD, calculateWidth, columnIndex, fixHeaderPhoenix, isNoHeadTable = false, showPrevNext ) => {
        const { enableEqualWidthForTableRows } = this.props;
        let boldStyle = "";
        let orderOfIcon = Styles["sorting-icon-desc"];
        if (cacheD.sortedColumn) {
            boldStyle = Styles["bold-header"];
        }
        if (cacheD.sortOrder && cacheD.sortOrder == "asc") {
            orderOfIcon = Styles["sorting-icon-asc"];
        }
        const className = cacheD.className ? cacheD.className : "";
        const tooltipIconClassName = cacheD.tooltipIconName ? cacheD.tooltipIconName : "icon_phoenix-question-circle";

        return (
            // --width is passed in variable to use min width in css
            <th style={{ ...cacheD.styles, "width": cacheD?.customWidth ? cacheD?.customWidth : (cacheD.width && !fixHeaderPhoenix) ? `${cacheD.width}px` : fixHeaderPhoenix ? "auto" : `${calculateWidth}px`, "minWidth": (cacheD.width && fixHeaderPhoenix) ? `${cacheD.width}px` : `auto` , "flex": (cacheD.width && fixHeaderPhoenix && enableEqualWidthForTableRows) ? `0 1 ${cacheD.width}px` : `0 0 0`, "--width": fixHeaderPhoenix && cacheD.width ? `${cacheD.width}px` : "" }} className={showPrevNext && tableData.lastColumnFixed ? Styles["col-fix"] : ""}>
                <div className={`${cacheD.showTooltip ? Styles["tooltip-with-text"] : ""} ${cacheD.tooltipClass ? cacheD.tooltipClass : ""}`}>
                    <div className={`${cacheD.enableSorting ? ` ${orderOfIcon} ${boldStyle}` : ``} ${className}`}
                        data-column-index={columnIndex}
                        data-column-type={cacheD.columnType ? cacheD.columnType : ""}
                        data-table-index={tableData.tableIndex}
                        onClick={(cacheD.tableHeaderClick && cacheD.enableSorting) ? cacheD.tableHeaderClick : ""}>
                        {cacheD.checkbox && cacheD.id && cacheD.checkboxCallback &&
                            <FormInput
                                id={cacheD.id}
                                name={cacheD.id}
                                type={"checkbox"}
                                checked={cacheD.isChecked}
                                disabled={cacheD.isDisabled}
                                onChange={cacheD.checkboxCallback}
                                className={"header-checkbox"}
                            />
                        }
                        {!isNoHeadTable &&
                            <React.Fragment>
                                <div className={cacheD.showEllipsis ? `${Styles["sorting-text"]} ${Styles["show-ellipsis"]}` : Styles["sorting-text"]}>
                                    <span style={{ "maxWidth": (cacheD.width && tableData.lastColumnFixed && showPrevNext) ? `${cacheD.width - 40}px` : `${cacheD.width - 20}px` }}>
                                        {cacheD.tableHead && cacheD.tableHead} {cacheD.tableHeadJSX && cacheD.tableHeadJSX}
                                    </span>
                                </div>
                                {cacheD.subHeader && <span className={Styles["subheader-text"]}>{cacheD.subHeader}</span>}
                            </React.Fragment>
                        }
                    </div>
                    {cacheD.showTooltip && !isNoHeadTable ? (
                        <div className={Styles["tooltip-wrap"]}>
                            <Tooltip
                                text={cacheD.tooltipContent}
                                hideOnScroll
                                theme="black"
                                tooltipClass={cacheD.wrapTooltipContent ? "tooltiptext" : ""}
                                size={cacheD.tooltipSize || ""}
                                position={cacheD.position || ""}
                            >
                                <i className={tooltipIconClassName} />
                            </Tooltip>
                        </div>
                    ) : null}
                </div>
            </th>
        );
    }
    getselectNode = (domNode) => {
        this.selectNode = domNode;
    };

    headerRenderer = (headerObj) => {
        const {isDefaultDashboardForExecutiveSummary = false} = this.props;
        const { showTooltipColumns } = this.props.tableData;
        const { dataKey, label, sortBy, sortDirection, disableSort } = headerObj;
        const sortCls = disableSort ? "" : (sortDirection === "ASC" || sortDirection === "asc") ? Styles["sorting-icon-asc"] : Styles["sorting-icon-desc"];
        return (
            <div className={`${sortBy === dataKey ? (Styles[sortCls] + " " + Styles["bold-header"]) : (disableSort ? "" : Styles["sorting-icon-desc"])}`}>
                <div className={Styles["sorting-text"]} title={typeof label !== "object" && label && !isDefaultDashboardForExecutiveSummary ? label : ""}>
                    <span>{label}</span>
                </div>
                { showTooltipColumns && showTooltipColumns.map((column) => {
                    const { labelText, tooltipText, icon } = column;
                    const htmlJsx = labelText == label ?
                        ( 
                            <Tooltip
                                text={tooltipText}
                                hideOnScroll
                                theme="black"
                            >
                                <i className={icon} />
                            </Tooltip>
                        ) :  null;
                    return htmlJsx;
                })
                }
            </div>
        );
    };

    getVirtualisedTableJsx = (tableData, autoHeight, width, onRowsRendered, registerChild, windowScrollerObj) => {
        const { useWindow, infinite, customRowRenderer, scrollPagination } = this.props;
        const { height, isScrolling, scrollTop, onChildScroll } = windowScrollerObj || {};

        let rowRendererObject = {};
        if (customRowRenderer) {
            rowRendererObject = {
                rowRenderer: this.virtualRowRenderer
            };
        }

        return (
            <Table
                autoHeight={autoHeight}
                onRowsRendered={onRowsRendered}
                ref={registerChild ? registerChild : tableData.ref}
                width={tableData.width ? tableData.width : width}
                height={height || tableData.height}
                headerHeight={tableData.headerHeight || 44}
                rowHeight={tableData.rowHeight || 44}
                rowCount={tableData.rowCount}
                noRowsRenderer={tableData.noRowsRenderer}
                rowGetter={tableData.rowGetter}
                gridClassName={tableData.gridClass || ""}
                className={`virtualize-table ${tableData.tableClass || ""} ${useWindow && infinite && !scrollPagination ? "min-height-table" : ""}`}
                sort={tableData.sort}
                sortBy={tableData.sortBy}
                sortDirection={tableData.sortDirection}
                disableHeader={tableData.disableHeader}
                rowClassName={tableData.rowClassName || ""}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                onRowClick={tableData.onRowClick}
                {...rowRendererObject}
            >
                {map(tableData.tableRow, (row) => {
                    return ( row && <Column
                        ref={this.listRef}
                        dataKey={row.dataKey}
                        width={row.width}
                        disableSort={row.disableSort}
                        label={row.label}
                        headerRenderer={row.headerRenderer ? this.headerRenderer : undefined}
                        cellDataGetter={row.cellDataGetter ? row.cellDataGetter : undefined}
                        cellRenderer={row.cellRenderer ? row.cellRenderer : undefined}
                        className={row.className || ""}
                    />);
                })}
            </Table>
        );
    };

    getFixHeader = (tableData) => {
        const { showPrevNext, fixHeaderPhoenix, twoLineHeader, fixedHeader, isSmall, noHoverTable, noHeadTable, paginated, noCursorRow, customScrollDivId } = this.props;
        const { fixedWidthFirstColumn } = this.state;
        let fixedIndex = tableData.fixedColumnIndex ? tableData.fixedColumnIndex : 0;
        let totalColumnsInViewPort = tableData.viewPortColumns ? tableData.viewPortColumns : 5;
        let indexOfColumn = 0;
        let tbHeadAll = [];
        let cacheD;
        let addWidthForColumns = 0;
        let firstColumnWidth;
        let theadFirstColumn = null;
        const { scrollRight, scrollLeft, prevNextIndex, nextDisabled } = this;
        let containerFixedWidth = document.getElementById(customScrollDivId || "wrapper-table-report").clientWidth;
        let totalWidthOfWrapper = containerFixedWidth;
        if (tableData.fixedColumn && !tableData.lastColumnFixed && tableData.fixHeaderPhoenix) {
            cacheD = tableData.tableHead.columns[fixedIndex];
            firstColumnWidth = tableData.fixedColumnWidth ? tableData.fixedColumnWidth : fixedWidthFirstColumn;
            firstColumnWidth = (totalWidthOfWrapper) * (firstColumnWidth / 100);
            indexOfColumn = fixedIndex ? fixedIndex : 0;
            theadFirstColumn = this.getTableHeadJsx(tableData, cacheD, firstColumnWidth, indexOfColumn, fixHeaderPhoenix, false, showPrevNext);
            tbHeadAll.push(theadFirstColumn);
            totalWidthOfWrapper = totalWidthOfWrapper - firstColumnWidth;
            addWidthForColumns = firstColumnWidth;
        }
        if (tableData.firstAndLastColumnFixed) {
            cacheD = tableData.tableHead.columns[fixedIndex];
        }
        for (let f = 0; f <= tableData.tableHead.columns.length; f++) {
            let cache = tableData.tableHead.columns[f];

            if (cache == undefined) {
                break;
            }
            if ((tableData.fixedColumn && (!tableData.lastColumnFixed && fixedIndex != f)) || !tableData.fixedColumn || (tableData.fixedColumn && tableData.lastColumnFixed)) {
                let widthCal = 100 / parseInt(totalColumnsInViewPort);

                widthCal = tableData.lastColumnFixed && tableData.tableHead.columns.length > 3 ? (totalWidthOfWrapper - 60) * (widthCal / 100) : (totalWidthOfWrapper) * (widthCal / 100);
                let htmlH;
                htmlH = this.getTableHeadJsx(tableData, cache, widthCal, f, fixHeaderPhoenix, false, showPrevNext);

                addWidthForColumns = addWidthForColumns + widthCal;
                tbHeadAll.push(htmlH);
            }
        }

        this.tableFixedHeader = (<div className={`scroll-wrap ${Styles["scroll-wrap"]}`}>
            <div style={{ "width": (fixHeaderPhoenix && this.theadRef) ? `${this.theadRef.offsetWidth}px` : "auto" }} className={`fixed-table-wrap ${Styles["fixed-table-wrap"]} ${twoLineHeader ? Styles["two-lines-head"] : ""} ${fixHeaderPhoenix ? Styles["fix-header-phoenix"] : ""} ${Styles["fixed-table-wrap"]} ${tableData.tableClassName ? tableData.tableClassName : ""} ${tableData.lastColumnFixed && "custom-scroll"}`}>
                <table id={tableData.tableId} className={`${tableData.tableId}-wrapper only-header ${fixHeaderPhoenix ? Styles["sticky-header-phoenix"] : ""} ${fixedHeader ? ("sticky-header-table" + (paginated ? " paginated" : "")) : ""} ${isSmall ? Styles["small-height-table"] : ""} ${noHoverTable ? Styles["no-hover-table"] : ""} ${noHeadTable ? Styles["no-head-table"] : ""} ${tableData.tableStyleName ? Styles[tableData.tableStyleName] : ""} ${noCursorRow ? "no-pointer" : ""}`}>
                    <thead>
                        <tr>{tbHeadAll}</tr>
                    </thead>
                </table>
                {showPrevNext ? ([
                    <span key="left-btn" className={`icon-cheveron_open phoenix-icon ${Styles["left-btn"]} ${prevNextIndex == 1 ? Styles["disabled-btn"] : ""} ${tableData.firstAndLastColumnFixed ? Styles["with-hover"] : ""}`} onClick={scrollLeft} style={{ left: cacheD && cacheD.width - 17 + "px" }} />,
                    <span key="right-btn" className={`icon-cheveron_open phoenix-icon ${Styles["right-btn"]} ${nextDisabled ? Styles["disabled-btn"] : ""} ${tableData.firstAndLastColumnFixed ? Styles["with-hover"] : ""}`} onClick={scrollRight} />
                ]) : null}
            </div>
            {parseInt(addWidthForColumns) > containerFixedWidth ?
                <div
                    ref={this.getselectNode.bind(this)}
                    style={{ "overflow": (tableData.lastColumnFixed) ? "auto" : "" }}
                    id="uppertable"
                    className={`${Styles["fixed-table-wrap"]} ${tableData.firstAndLastColumnFixed ? `${Styles["upper-table"]} ${Styles["first-last-col-fix"]}` : tableData.lastColumnFixed ? `${Styles["upper-table"]} ${Styles["last-col-fix"]}` : Styles["upper-table"]}`}
                >
                    <table className={`${fixHeaderPhoenix ? Styles["sticky-header-phoenix"] : ""} ${isSmall ? Styles["small-height-table"] : ""} ${twoLineHeader ? Styles["two-lines-head"] : ""} ${noHoverTable ? Styles["no-hover-table"] : ""} ${noCursorRow ? "cursor-default" : ""}`}>
                        <thead>
                            <tr ref={el => this.theadRef = el}>{tbHeadAll}</tr>
                        </thead>
                    </table>
                </div> : ""
            }

        </div>);

    }
    /*----change needed---*/

    showLastColumnOnHover = (data) => {
        const { rows, upperTableRows, rowIndex, hover, lastColumnIndex } = data;
        const { tableData } = this.props;
        const hideActionPopup = document.getElementById("hide-action-popover-helper");
        if (tableData.firstAndLastColumnFixed && rows[rowIndex]?.childNodes && upperTableRows[rowIndex]?.childNodes) {
            const isLoading = upperTableRows[rowIndex]?.querySelector(".index__loader-circle__1lsIS");
            if (upperTableRows[rowIndex]?.childNodes[lastColumnIndex] && hover) {
                upperTableRows[rowIndex].childNodes[lastColumnIndex].childNodes[0].style.display = "flex";
                //BIRD-137824 - Visible two action buttons on hover 
                // rows[rowIndex].childNodes[lastColumnIndex].childNodes[0].style.display = "flex";
                this.currentRowHoverIndexes.push(rowIndex);
            } else if (upperTableRows[rowIndex]?.childNodes[lastColumnIndex]) {
                if (!isLoading) {
                    upperTableRows[rowIndex].childNodes[lastColumnIndex].childNodes[0].style.display = "none";
                    rows[rowIndex].childNodes[lastColumnIndex].childNodes[0].style.display = "none";
                }
                // Hiding action popup forcefully
                hideActionPopup?.click();
                this.currentRowHoverIndexes.pop();
            }
            // Persist to hover state while clicking on action and then hover another row
            if (this.currentRowHoverIndexes.length && hover) {
                this.currentRowHoverIndexes.forEach((storedindex) => {
                    if (storedindex !== rowIndex) {
                        rows[storedindex].classList.remove("upper-table-hover");
                        upperTableRows[storedindex].classList.remove("upper-table-hover");
                        if (!isLoading) {
                            upperTableRows[storedindex].childNodes[lastColumnIndex].childNodes[0].style.display = "none";
                            rows[storedindex].childNodes[lastColumnIndex].childNodes[0].style.display = "none";
                        }
                    }
                });
            }
        }
    }

    handleUpperTableRowHover = (data) => {
        const { rowIndex, hover, showLastColumnOnHover } = data || {};
        const rows = document.querySelectorAll("#manageListWrapper tbody tr", "#surveyViewResponse tbody tr");
        const upperTableRows = document.querySelectorAll("#uppertable tbody tr");

        if (rows.length == 0 || rows.length < rowIndex || upperTableRows.length == 0 || upperTableRows.length < rowIndex) {
            return;
        }

        if (hover) {
            rows[rowIndex].classList.add("upper-table-hover");
            upperTableRows[rowIndex].classList.add("upper-table-hover");
            showLastColumnOnHover && this.showLastColumnOnHover({ ...data, rows, upperTableRows });
        } else {
            rows[rowIndex].classList.remove("upper-table-hover");
            upperTableRows[rowIndex].classList.remove("upper-table-hover");
            showLastColumnOnHover && this.showLastColumnOnHover({ ...data, rows, upperTableRows });
        }
    };

    createTableForAllColumnsNew = (tableData, showCheckbox) => {
        const { handleUpperTableRowHover } = this;
        const { fixedWidthFirstColumn } = this.state;
        const { 
            fixedHeader, isBlueJay, paginated, isSmall, noHeadTable, virtualizedTable, useWindow,
            useInfinite, loadMore, hasMore, noHoverTable, twoLineHeader, fixHeaderPhoenix, noCursorRow, forceUseAutoSizer = false, 
            showPrevNext, autoHeightTable, disableVirtualisedAutoHeight, useWindowVirtualize, subCategoriesEnabled = false, customScrollDivId
        } = this.props;
        let containerFixedWidth = document.getElementById(customScrollDivId || "wrapper-table-report")?.clientWidth;
        let totalWidthOfWrapper = containerFixedWidth;
        // const enableRowHover = tableData.enableRowHover;
        const lastColumnIndex = tableData.showLastColumnOnHover ? tableData.tableHead.columns.length - 1 : null;
        const showLastColumnOnHover = tableData.showLastColumnOnHover;
        let totalColumnsInViewPort = tableData.viewPortColumns ? tableData.viewPortColumns : 5;
        let theadFirstColumn = null;
        let tbRowAll = [];
        this.tableAllColumns = null;

        // PUSH Header in all first column
        let tbHeadAll = [];
        //let tbRowsAll = [];
        let firstColumnWidth;
        let addWidthForColumns = 0;
        let indexOfColumn = 0;
        let fixedIndex = tableData.fixedColumnIndex ? tableData.fixedColumnIndex : 0;
        let cacheD;
        let isNoHeadTable = fixHeaderPhoenix;
        let tableWidth = tableData.updatedTableWidth && tableData.updatedTableWidth > 0 ? `${tableData.updatedTableWidth}px` : (fixHeaderPhoenix && this.theadRef ? `${this.theadRef.offsetWidth}px` : "auto");
        if (tableData.fixedColumn && !tableData.lastColumnFixed) {
            cacheD = tableData.tableHead.columns[fixedIndex];
            firstColumnWidth = tableData.fixedColumnWidth ? tableData.fixedColumnWidth : fixedWidthFirstColumn;
            firstColumnWidth = (totalWidthOfWrapper) * (firstColumnWidth / 100);
            indexOfColumn = fixedIndex ? fixedIndex : 0;
            theadFirstColumn = this.getTableHeadJsx(tableData, cacheD, firstColumnWidth, indexOfColumn, fixHeaderPhoenix, isNoHeadTable, showPrevNext);
            tbHeadAll.push(theadFirstColumn);
            totalWidthOfWrapper = totalWidthOfWrapper - firstColumnWidth;
            addWidthForColumns = firstColumnWidth;
        }

        if (!virtualizedTable) {
            for (let f = 0; f <= tableData.tableHead.columns.length; f++) {
                let cache = tableData.tableHead.columns[f];

                if (cache == undefined) {
                    break;
                }
                // if(fixedIndex && ) {
                //     indexOfColumn = indexOfColumn + 1;
                // }
                // cache.sortedColumn "enable"
                // cache.sortOrder == "asc" up arrow else down arrow
                if ((tableData.fixedColumn && (!tableData.lastColumnFixed && fixedIndex != f)) || !tableData.fixedColumn || (tableData.fixedColumn && tableData.lastColumnFixed)) {
                    let widthCal = 100 / parseInt(totalColumnsInViewPort);
                    //indexOfColumn = indexOfColumn + 1;

                    widthCal = tableData.lastColumnFixed && tableData.tableHead.columns.length > 3 ? (totalWidthOfWrapper - 60) * (widthCal / 100) : (totalWidthOfWrapper) * (widthCal / 100);
                    let htmlH;
                    htmlH = this.getTableHeadJsx(tableData, cache, widthCal, f, fixHeaderPhoenix, isNoHeadTable, showPrevNext);

                    addWidthForColumns = addWidthForColumns + widthCal;
                    tbHeadAll.push(htmlH);
                }
            }

            // let tbRowWrapperFixed = [];
            for (let m = 0; m < tableData.tableRow.length; m++) {
                let tbChildRow = [];
                let subcategoriesArr = null;
                let cache = null;
                let tbRowLocal = null;
                // PUSH all ROWS of first column
                if (tableData.fixedColumn && !tableData.lastColumnFixed) {
                    cache = tableData.tableRow[m].rowsData[fixedIndex];
                    let disableRow = tableData.tableRow[m].disableRow;
                    let contClass = tableData.tableRow[m].rowsData[0].containerClass;

                    tbRowLocal = this.getTableRowJsx(tableData, cache, m, fixedIndex, showCheckbox, disableRow, fixedHeader, isBlueJay, contClass, fixHeaderPhoenix, showPrevNext, subCategoriesEnabled);
                    //tbChildRow.push(tbRowLocal);
                    tbChildRow.push(tbRowLocal);
                    /* commenting below two lines as these are not used */
                    // tbRowWrapperFixed.push(<tr
                    //     styleName={`${disableRow ? "row-disabled" : ""} ${enableRowHover ? "row-hover" : ""}`}>{tbRowLocal}</tr>);
                }
                //.......
                //let calculateWidthTemp = 0;
                for (let k = 0; k < tableData.tableRow[m].rowsData?.length; k++) {

                    if ((tableData.fixedColumn && (fixedIndex != k && !tableData.lastColumnFixed)) || !tableData.fixedColumn || (tableData.fixedColumn && tableData.lastColumnFixed)) {
                        cache = tableData.tableRow[m].rowsData[k];
                        if (cache == undefined) {
                            break;
                        }
                        //calculateWidthTemp = totalWidthOfWrapper * (calculateWidth / 100);
                        let disableRow = tableData.tableRow[m].disableRow;
                        let contClass = tableData.tableRow[m].rowsData[0].containerClass;
                        const showColumnClass = tableData.tableRow[m].rowsData[k].showColumnClass || false;
                        let disableRowTooltipSupport = tableData.tableRow[m].rowsData[k].disableRowTooltipSupport;

                        if (showColumnClass) {
                            contClass = tableData.tableRow[m].rowsData[k].containerClass;
                        }

                        tbRowLocal = this.getTableRowJsx(tableData, cache, m, k, showCheckbox, disableRow, fixedHeader, isBlueJay, contClass, fixHeaderPhoenix, showPrevNext, subCategoriesEnabled, disableRowTooltipSupport);
                        tbChildRow.push(tbRowLocal);
                    }
                }

                // section for generating subcategories rows starts
                if (subCategoriesEnabled) {
                    subcategoriesArr = this.getTableSubCategoriesRowsJsx(tableData.tableRow[m], tableData.fixedColumn, tableData.lastColumnFixed, fixedIndex, fixHeaderPhoenix);
                }
                // section for generating subcategories rows ends

                if (tbChildRow.length) {
                    if ((showPrevNext && tableData.lastColumnFixed) || tableData.firstAndLastColumnFixed) {
                        tbRowAll.push(<div className={Styles["row-parent"]}><tr className={tableData.tableRow[m].rowClassName ? tableData.tableRow[m].rowClassName : ""} onMouseEnter={handleUpperTableRowHover.bind(null, {
                            hover: true,
                            rowIndex: m,
                            lastColumnIndex,
                            showLastColumnOnHover
                        })} onMouseLeave={handleUpperTableRowHover.bind(null, {
                            hover: false,
                            rowIndex: m,
                            lastColumnIndex,
                            showLastColumnOnHover
                        })}
                        >{tbChildRow}</tr></div>);
                    } else {
                        tbRowAll.push(<tr  onClick={tableData?.tableRow[m]?.onRowClick} className={tableData.tableRow[m].rowClassName ? tableData.tableRow[m].rowClassName : ""}>{tbChildRow}</tr>);
                    }
                }

                // sub categories rows appending
                subCategoriesEnabled ? tbRowAll.push(subcategoriesArr) : "";
            }
            if (tableData.lastColumnFixed && this.selectNode) {
                let scrollwidth = this.selectNode.scrollWidth;
                let cache = tableData.tableHead.columns[tableData.tableHead.columns.length - 1];
                //Edge doest not support scrollTo functionality, currently restricting this feature to support reset for browsers other than IE
                this.selectNode.scrollTo ? this.selectNode.scrollTo(scrollwidth - cache ? cache.width : 0, 0) : null;
            }
        }

        if (virtualizedTable) {
            this.tableAllColumns = (
                useWindow || forceUseAutoSizer ?
                    useWindowVirtualize ? <WindowScroller scrollElement={window}>
                        {
                            ({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
                                <AutoSizer disableHeight>
                                    {({ width }) => (
                                        <div ref={registerChild}>
                                            {
                                                this.getVirtualisedTableJsx(tableData, disableVirtualisedAutoHeight ? false : true, width, undefined, registerChild, { height, onChildScroll, isScrolling, scrollTop })
                                            }
                                        </div>
                                    )}
                                </AutoSizer>
                            )
                        }
                    </WindowScroller> :
                        (<AutoSizer disableHeight>
                            {/*eslint-disable */}
                            {({ width }) => (
                                /*eslint-enable */
                                this.getVirtualisedTableJsx(tableData, disableVirtualisedAutoHeight ? false : true, width)
                            )}
                        </AutoSizer>)
                    : useInfinite ?
                        <InfiniteLoader
                            isRowLoaded={hasMore}
                            loadMoreRows={loadMore}
                            rowCount={1000000}
                        >
                            {({ onRowsRendered, registerChild }) => (
                                <AutoSizer>
                                    {({ width }) => (
                                        this.getVirtualisedTableJsx(tableData, undefined, width, onRowsRendered, registerChild)
                                    )}
                                </AutoSizer>
                            )}
                        </InfiniteLoader>
                        : this.getVirtualisedTableJsx(tableData)
            );
        } else {
            //tableAllColumns.push(<tbody>{tbRowWrapperFixed}</tbody>);
            this.tableAllColumns = (<div className={`scroll-wrap ${Styles["scroll-wrap"]} ${tableData.firstAndLastColumnFixed ? "overflow-v" : ""}`}>
                <div style={{ "width": tableWidth}} className={`${Styles["fixed-table-wrap"]} ${tableData.firstAndLastColumnFixed && tableData.showPrevNext ? "fix-first-last-main" : ""} ${twoLineHeader ? Styles["two-lines-head"] : ""} ${fixHeaderPhoenix ? Styles["fix-header-phoenix"] : ""} ${Styles["fixed-table-wrap"]} ${tableData.tableClassName ? tableData.tableClassName : ""} ${tableData.firstAndLastColumnFixed ? "overflow-v" : ""} ${tableData.lastColumnFixed && "custom-scroll"} ${autoHeightTable ? "auto-height-phoenix-table" : ""}`}>
                    <table id={tableData.tableId} className={`${tableData.tableId}-wrapper ${fixHeaderPhoenix ? Styles["sticky-header-phoenix"] : ""} ${fixedHeader ? ("sticky-header-table" + (paginated ? " paginated" : "")) : ""} ${isSmall ? Styles["small-height-table"] : ""} ${noHoverTable ? Styles["no-hover-table"] : ""} ${noHeadTable || fixHeaderPhoenix ? Styles["no-head-table"] : ""} ${tableData.tableStyleName ? Styles[tableData.tableStyleName] : ""} ${noCursorRow ? "no-pointer" : ""}`}>
                        <thead>
                            <tr>{tbHeadAll}</tr>
                        </thead>
                        <tbody>
                            {tbRowAll}
                        </tbody>
                    </table>
                </div>
                {parseInt(addWidthForColumns) > containerFixedWidth ?
                    <div
                        ref={this.getselectNode.bind(this)}
                        style={{ "overflow": (tableData.lastColumnFixed) ? "auto" : "" }}
                        id="uppertable"
                        className={`${autoHeightTable ? "auto-height-phoenix-table" : ""} ${Styles["fixed-table-wrap"]} ${tableData.firstAndLastColumnFixed ? Styles["upper-table"] + " " + Styles["first-last-col-fix"] : tableData.lastColumnFixed ? Styles["upper-table"] + " " + Styles["last-col-fix"] : Styles["upper-table"]}`}
                    >
                        <table className={`${fixHeaderPhoenix ? Styles["sticky-header-phoenix"] : ""} ${tableData.tableStyleName ? Styles[tableData.tableStyleName] : ""} ${isSmall ? Styles["small-height-table"] : ""} ${twoLineHeader ? Styles["two-lines-head"] : ""} ${noHoverTable ? Styles["no-hover-table"] : ""} ${noHeadTable || fixHeaderPhoenix ? Styles["no-head-table"] : ""} ${noCursorRow ? "no-pointer" : ""}`}>
                            <thead>
                                <tr ref={el => this.theadRef = el}>{tbHeadAll}</tr>
                            </thead>
                            <tbody>
                                {tbRowAll}
                            </tbody>
                        </table>
                    </div> : ""
                }

            </div>);
        }
    };

    componentWillMount() {
        this.setState({
            startIndex: this.props.tableData.startIndex,
            lastIndex: this.props.tableData.lastIndex
        });
    }
    componentDidUpdate() {
        const { tableData, showCheckbox, fixHeaderPhoenix } = this.props;
        this.createTableForAllColumnsNew(tableData, showCheckbox);
        fixHeaderPhoenix && this.getFixHeader(tableData);
    }

    componentWillReceiveProps(nextProps) {
        const { tableData = {} } = this.props;
        const { tableHead = {} } = tableData;
        const { columns = [] } = tableHead;

        if (nextProps.tableData && (nextProps.tableData.startIndex != this.state.startIndex || nextProps.tableData.lastIndex != this.state.lastIndex)) {
            this.setState({
                startIndex: nextProps.tableData.startIndex,
                lastIndex: nextProps.tableData.lastIndex
            });
        }

        // Handling the pagination inside scroll: To set the scroll position
        if (this.props.scrollPagination && this.props.tableData.rowCount && nextProps.tableData && nextProps.tableData.rowCount != this.props.tableData.rowCount) {
            this.props.scrollHandler && this.props.scrollHandler(this.scrollableRef, this.previousTableHeight || this.scrollableRef.scrollTop);
            this.previousTableHeight = this.scrollableRef.scrollHeight;
        }

        if (nextProps.tableData && nextProps.tableData.tableHead && nextProps.tableData.tableHead.columns && nextProps.tableData.tableHead.columns.length !== columns.length) {
            this.resetScroll();
        }

        if (nextProps.fixScroll) {
            this.resetScroll();
        }

        if (nextProps?.isSortingApplied) {
            let elem = document.getElementById(`${tableData?.containerId}`);
            if (elem) {
                elem.scrollTop = 0;
            }
        }

        this.createTableForAllColumnsNew(nextProps.tableData, nextProps.showCheckbox);
        nextProps.fixHeaderPhoenix && this.getFixHeader(nextProps.tableData);
    }

    componentWillUnmount() {
        selectedParentCatId = [];
    }

    hideRealtedAdjectiveToolTip() {

        clearTimeout(flotTipTimerId);
        // flotTip.hide();
    }
    showFlotTip = (evt) => {
        const { tableData } = this.props;

        let rowIndex = evt.currentTarget.getAttribute("data-row-index");
        let columnIndex = evt.currentTarget.getAttribute("data-column-index");

        let dataForRow = tableData.tableRow[rowIndex].rowsData[columnIndex];
        if (dataForRow.tooltipData) {

            clearTimeout(flotTipTimerId);
            const bRectangle = evt.currentTarget.getBoundingClientRect();
            const scrollPosTop = window.pageYOffset || document.documentElement.scrollTop;
            const position = {};
            // flotTip.update({
            //     show: false,
            //     tooltipClass: `${Styles["tooltipFlot"]} ${dataForRow.tooltipData.tooltipClass ? dataForRow.tooltipData.tooltipClass : ""}`,
            //     text: dataForRow.tooltipData.useHtml ? (<div id="tooltipHtml" />) : dataForRow.tooltipData.text
            // });

            const currentTargetWidthHalf = (evt.currentTarget.clientWidth || evt.currentTarget.offsetWidth) / 2;
            const currentTargetHeight = evt.currentTarget.clientHeight || evt.currentTarget.offsetHeight;
            flotTipTimerId = setTimeout(() => {
                // Pass you own html if required
                if (dataForRow.tooltipData.useHtml) {
                    document.getElementById("tooltipHtml").innerHTML = dataForRow.tooltipData.htmlFormatter();
                }
                // let flotTipWidthHalf = flotTip.getWidth() / 2;
                // position.top = bRectangle.top + scrollPosTop + currentTargetHeight + 14;
                // position.left = (bRectangle.left + currentTargetWidthHalf) - flotTipWidthHalf;
                // flotTip.update({ position });
                // flotTip.show();
            }, 10);
        }

    }

    getTableSubCategoriesRowsJsx(tableRowData, fixedColumn, lastColumnFixed, fixedIndex, fixHeaderPhoenix) {
        if (tableRowData.subRowsGroup) {
            const rowLimit = this.props.subRowLimit, totalSubRows = tableRowData.subRowsGroup.length;
            let tbRowAll = [];

            let parentCatId = tableRowData.rowsData[0].parentCatId;
            let rowsVisible = rowLimit && !this.state.seeMoreClicked ? Math.min(rowLimit, totalSubRows) : totalSubRows;
            for (let m = 0; m < rowsVisible; m++) {
                let tbChildRow = [];
                let cache = null;
                let tbRowLocal = null;
                let fixedHeader = null;
                let currentSubRowSection = tableRowData.subRowsGroup[m];

                // PUSH all ROWS of first column
                if (fixedColumn && !lastColumnFixed) {
                    cache = currentSubRowSection.rowsSubCatsData[fixedIndex];
                    tbRowLocal = this.getTableSubCatRowJsx(cache, m, fixedIndex, fixedHeader, fixHeaderPhoenix);
                    tbChildRow.push(tbRowLocal);
                }

                for (let k = 0; k < currentSubRowSection.rowsSubCatsData.length; k++) {
                    if ((fixedColumn && (fixedIndex != k && !lastColumnFixed)) || !fixedColumn || (fixedColumn && lastColumnFixed)) {
                        cache = currentSubRowSection.rowsSubCatsData[k];
                        if (cache == undefined) {
                            break;
                        }
                        tbRowLocal = this.getTableSubCatRowJsx(cache, m, k, fixedHeader, fixHeaderPhoenix);
                        tbChildRow.push(tbRowLocal);
                    }
                }

                if (tbChildRow.length) {
                    tbRowAll.push(<tr
                        id={`category-${parentCatId}`}
                        className={Styles["row-sub-cat-show"]}
                        style={{ "display": selectedParentCatId.includes(parentCatId)  ? "block" : "none" }}
                    >{tbChildRow}
                    </tr>);
                }
            }

            if (rowLimit && !this.state.seeMoreClicked && (totalSubRows > rowLimit)) {
                tbRowAll.push(<tr
                    id={`category-${parentCatId}`}
                    style={{ "display": selectedParentCatId.includes(parentCatId) ? "block" : "none" }}
                >
                    <span className="more-text" onClick={() => this.setState({ seeMoreClicked: true }, this.forceUpdate)}>See more</span>
                </tr>);
            }

            return tbRowAll;
        }
    }

    getTableSubCatRowJsx(cache, m, k, fixedHeader, fixHeaderPhoenix) {
        const rowStyles = (cache.sortedColumn ? Styles["bold"] : "") + " " + Styles["row-content"] + (cache.customClass ? (" " + Styles[cache.customClass]) : "");
        let htmlJSX =
            (<div
                className={`${cache.className ? cache.className : ""} ${rowStyles}`}
                id={`row-${m}-column-${k}`}
                onClick={cache.clickCallback}
            >
                <div className={cache.rowHover ? Styles["hover-row"] : ""}>
                    {
                        cache.rowValue || cache.rowValue === 0 ? <span title={cache.title && cache.title}
                            data-row-index={m}
                            data-table-index={1} data-column-index={k}>
                            {cache.rowValue}
                        </span> : ""
                    }
                </div>
            </div>);

        return (
            <td className=""
                width={fixedHeader ? cache.width : "auto"}
                style={{ "minWidth": fixHeaderPhoenix && cache.width ? `${cache.width}px` : "auto", "maxWidth": fixHeaderPhoenix && cache.width ? `${cache.width}px` : "none" }}
            >
                {htmlJSX}
            </td>
        );
    }

    subCatHandler(parentCatId) {
        const { tableData, showCheckbox, categoryRowExpandLimit = 1 } = this.props;
        const isCurrentlyExpanded = selectedParentCatId.includes(parentCatId);
        if (selectedParentCatId.includes(parentCatId)) {
            selectedParentCatId.splice(selectedParentCatId.indexOf(parentCatId), 1);
        } else {
            if (selectedParentCatId.length < categoryRowExpandLimit) {
                selectedParentCatId.push(parentCatId);
            } else {
                selectedParentCatId.shift();
                selectedParentCatId.push(parentCatId);
            }
        }

        this.createTableForAllColumnsNew(tableData, showCheckbox);
        this.setState({
            updateTable: true,
            seeMoreClicked: false
        }, () => {
            this.forceUpdate();
            tableData.onSubCategoryClick && tableData.onSubCategoryClick(parentCatId, isCurrentlyExpanded);
        });
    }

    // method for rows generating
    getTableRowJsx(tableData, cache, m, k, showCheckbox, disabled, fixedHeader, isBlueJay, contClass, fixHeaderPhoenix, showPrevNext, subCategoriesEnabled, disableRowTooltipSupport) {
        const disableItem = tableData.tableRow[m]?.rowsData[k]?.disableItem || false;
        const tooltipText = tableData.tableRow[m]?.rowsData[k]?.disableTooltipReason || "";
        const rowStyles = (cache.sortedColumn ? Styles["bold"] : "") + " " + Styles["row-content"] + (cache.customClass ? (" " + Styles[cache.customClass]) : "");
        const subRowsAvailable = subCategoriesEnabled && tableData.tableRow[m].subRowsGroup && tableData.tableRow[m].subRowsGroup.length >= 1 ? true : false;
        const rowCatClassName = subCategoriesEnabled ? (subRowsAvailable ? ((selectedParentCatId != null && selectedParentCatId.includes(cache.parentCatId)) ? "row-category-selected" : "row-category") : "row-no-sub-cats") : "";

        let htmlJSX =
            (<div
                className={`${cache.className ? cache.className : ""} ${rowStyles}`}
                id={`row-${m}-column-${k}`}
                onClick={k == 0 && subCategoriesEnabled ? () => this.subCatHandler(cache.parentCatId) : cache.clickCallback}
            >
                <div className={cache.rowHover ? Styles["hover-row"] : ""}>
                    {showCheckbox && cache.checkbox && cache.id && cache.checkboxCallback &&
                        <FormInput
                            id={cache.id}
                            name={cache.id}
                            type={"checkbox"}
                            checked={cache.isChecked}
                            onChange={cache.checkboxCallback}
                            className={"row-checkbox"}
                            disabled={cache.isDisabled || disabled}
                        />
                    }
                    {
                        cache.customTooltip ? (
                            <Tooltip
                                theme="black"
                                text={cache.customTooltip.text}
                                customContainerClassName="align-left"
                            >
                                {cache.rowValue || cache.rowValue === 0 ?
                                    <span>
                                        {cache.rowValue}
                                        {cache.customIcon && (cache.customIcon.showTooltip ?
                                            <Tooltip theme="black" text={<span>{cache.customIcon.tooltipContent}</span>}><span
                                                dangerouslySetInnerHTML={{ __html: (cache.customIcon.html) }} /></Tooltip> :
                                            <span dangerouslySetInnerHTML={{ __html: (cache.customIcon.html) }} />)}
                                    </span> : ""
                                }
                            </Tooltip>

                        ) :
                            cache.rowValue || cache.rowValue === 0 ? <span title={cache.title && cache.title} onMouseOver={this.showFlotTip} onMouseOut={this.hideRealtedAdjectiveToolTip}
                                data-row-index={m}
                                data-table-index={tableData.tableIndex} data-column-index={k}
                                className={k == 0 ? Styles[rowCatClassName] : ""}>
                                {cache.rowValue}
                                {cache.customIcon && (cache.customIcon.showTooltip ? <Tooltip theme="black" text={<span>{cache.customIcon.tooltipContent}</span>}><span dangerouslySetInnerHTML={{ __html: (cache.customIcon.html) }} /></Tooltip> : <span dangerouslySetInnerHTML={{ __html: (cache.customIcon.html) }} />)}
                            </span> : ""

                    }

                    {cache.popOver ? <Popover customWidth={cache.popOverJsxWidth} isBlueJay={isBlueJay} fixed={cache.popoverFixed} className={`${cache.popOverClassName ? cache.popOverClassName : ""} ${cache.popOverStyleName ? cache.popOverStyleName : "popover-ul"}`} >
                        {cache.popOverJsx()}
                    </Popover> : ""}
                </div>
                {
                    cache.rowHover ? (
                        <div className={Styles["hoverable-wrap"]}>
                            {cache.rowHoverJsx()}
                        </div>
                    ) : ""
                }
            </div>);

        return (
            // --width is passed in variable to use flex basis in css
            <td className={`${contClass ? contClass : ""} ${disabled ? "column-disabled" : ""} ${(disableRowTooltipSupport || disableItem) ? "column-disabled-bg" : ""} ${showPrevNext && tableData.lastColumnFixed ? Styles["col-fix"] : ""}`} onClick={!disableRowTooltipSupport && !disableItem ? cache.columnOnClick : ""}
                width={fixedHeader ? cache.width : "auto"} style={{ "minWidth": fixHeaderPhoenix && cache.width ? `${cache.width}px` : "auto", "maxWidth": fixHeaderPhoenix && cache.width ? `${cache.width}px` : "none", "--width": fixHeaderPhoenix && cache.width ? `${cache.width}px` : "" }}>  
                {(disableRowTooltipSupport || disableItem) ? <Tooltip text={disableRowTooltipSupport.tooltipText || tooltipText} position="left" customContainerClassName={`${disableRowTooltipSupport.customClass} align-left`} >{htmlJSX}</Tooltip> : htmlJSX}
            </td>
        );
    }

    componentDidMount() {
        const { tableData, showCheckbox, fixHeaderPhoenix } = this.props;
        this.createTableForAllColumnsNew(tableData, showCheckbox);
        fixHeaderPhoenix && this.getFixHeader(tableData);
        this.setState({
            updateTable: true
        });
    }

    calculateTableZoom() {
        const { columns } = this.props.tableData.tableHead;
        if (columns && columns.length < 8) {
            return "initialZoom";
        } else {
            return "quarterZoom";
        }
    }

    scrollableTableRef = (ref) => {
        this.scrollableRef = ref;
    };

    resetScroll = () => {
        const { scrollableRef } = this;
        const { tableData } = this.props;
        const { tableId } = tableData;
        const tables = document.querySelectorAll("#" + tableId);

        this.prevNextIndex = 1;
        this.nextDisabled = false;

        if (tables && tables.length) {
            for (let i = 0; i < tables.length; i++) {
                tables[i].style.left = 0;
            }
        }

        scrollableRef ? scrollableRef.scrollTop = 0 : null;
    };

    scrollLeft = () => {
        if (this.prevNextIndex === 1) {
            return;
        }
        const { tableData, showCheckbox, isReseller } = this.props;
        const { tableId, useTableidForOffsetCalc } = tableData;

        let howMuchRight = 0;
        let shiftedElements = elemLeftPos.pop();
        this.prevNextIndex--;
        this.nextDisabled = false;

        howMuchRight += shiftedElements;

        if (useTableidForOffsetCalc) {
            howMuchRight = document.querySelectorAll("#" + tableId)[0].offsetLeft + howMuchRight;
        } else {
            howMuchRight = document.querySelector(".fixed-table-wrap table").offsetLeft + howMuchRight;
        }

        if (howMuchRight > 0) {
            howMuchRight = 0;
        }

        this.createTableForAllColumnsNew(tableData, showCheckbox);
        this.getFixHeader(tableData);
        this.setState({
            updateTable: true
        }, () => {
            let elems = document.querySelectorAll("#" + tableId);
            let index = 0, length = elems.length;
            for (index = 0; index < length; index++) {
                if (isReseller) {
                    elems[index].style.left = parseFloat(elems[index].style.left || 0) + shiftedElements + "px";
                } else {
                    elems[index].style.left = howMuchRight + "px";
                }
            }
        });
    };

    scrollRight = () => {
        const { tableData, showCheckbox, showPrevNext } = this.props;
        const { viewPortColumns, tableHead, tableId, lastColumnFixed } = tableData;
        let howMuchRight = 0;
        const totalCol = tableHead.columns.length - 1;
        const totalColGroup = Math.ceil(totalCol / viewPortColumns);
        const currColGroupShown = this.prevNextIndex;
        let remainingCol = (totalCol % viewPortColumns);
        if (remainingCol == 0) {
            remainingCol = viewPortColumns;
        }
        const totalColShown = currColGroupShown * viewPortColumns;

        let upperLimit = ((totalColShown + 1 + viewPortColumns) > tableHead.columns.length ? tableHead.columns.length : (totalColShown + 1 + viewPortColumns)) - (lastColumnFixed && showPrevNext && (totalColGroup == currColGroupShown + 1) ? 1 : 0);
        for (let i = totalColShown + 1; i < upperLimit; i++) {
            howMuchRight += tableHead.columns[i].width;
        }

        this.nextDisabled = false;

        if (totalColGroup > currColGroupShown) {
            this.prevNextIndex++;
            if (lastColumnFixed && showPrevNext) {
                if ((totalColGroup - 1 == this.prevNextIndex && remainingCol == 1) || (totalColGroup == this.prevNextIndex)) {
                    this.nextDisabled = true;
                }
            } else {
                if (totalColGroup == this.prevNextIndex) {
                    this.nextDisabled = true;
                }
            }

            this.createTableForAllColumnsNew(tableData, showCheckbox);
            this.getFixHeader(tableData);
            this.setState({
                updateTable: true
            }, () => {
                let elems = document.querySelectorAll("#" + tableId);
                let index = 0, length = elems.length;
                for (index = 0; index < length; index++) {
                    elems[index].style.left = parseFloat(elems[index].style.left || 0) - howMuchRight + "px";
                }
            });
        }
        elemLeftPos.push(howMuchRight);
    };

    render() {
        const { tableData, loadMore, hasMore, infinite, loaderDiv, parentCustomClass, useWindow, virtualizedTable, fixHeaderPhoenix, showPrevNext, customInfiteLoadConfig = {}, scrollPagination, fixStyle, customScrollDivId, showFixedColumnShadow } = this.props;
        const tableZoomForPDF = this.calculateTableZoom();
        const { scrollableTableRef } = this;

        return (
            <div
                className={`${clsx(
                    "clearfix",
                    "scrolable-table",
                    "custom-scroll",
                    parentCustomClass,
                    tableData.lastColumnFixed && showPrevNext ? "complete-scroll-table" : "no-scroll-table",
                    {
                        "sorting-icon-mod": tableData.isSortingiconEncluded,
                        "ht-100": virtualizedTable,
                        "service-list-table": this.props.ServieTableClass,
                        "fixed-column-with-box-shadow": showFixedColumnShadow && tableData.fixedColumn
                    }
                )} ${Styles["wrapper-table-report"]} ${tableZoomForPDF}`}
                id={customScrollDivId || "wrapper-table-report"}
                ref={(ref) => this.scrollParentRef = ref}
            >
                {fixHeaderPhoenix && this.tableFixedHeader}

                {infinite ? <div id={tableData?.containerId} ref={scrollableTableRef} className={`custom-scroll ${fixHeaderPhoenix ? `${Styles["scroll-wrap-fix-header"]} ${tableData.isFixedTableHeightAdjustable ? Styles["height-adjust"] : ""}` : fixStyle ? `style-fix` : ""}`} >
                    <InfiniteScroll
                        pageStart={customInfiteLoadConfig["pageStart"] ? customInfiteLoadConfig["pageStart"] : 0}
                        loadMore={loadMore}
                        hasMore={this.tableAllColumns !== null ? hasMore : false}
                        loader={loaderDiv}
                        useWindow={useWindow && !scrollPagination}
                        threshold={customInfiteLoadConfig["threshold"] ? customInfiteLoadConfig["threshold"] : 250}
                        initialLoad={customInfiteLoadConfig["initialLoad"] == "false" ? false : true}

                    //getScrollParent={fixHeaderPhoenix ? () => this.tbodyRef : false}
                    >
                        <div style={{ position: "relative" }} className={`${virtualizedTable ? "ht-100" : ""} clearfix`}>
                            {(tableData.type && tableData.type == "allColumns" ? this.tableAllColumns : "")}
                        </div>
                    </InfiniteScroll></div> : (tableData.type && tableData.type == "allColumns" ? this.tableAllColumns : "")}
            </div>
        );
    }
}

TableContainer.defaultProps = {
    useWindow: true,
    fixHeaderPhoenix: false,
    autoHeightTable: false,
    isSortingApplied: false
};

TableContainer.propTypes = {
    tableData: PropTypes.object,
    lastIndex: PropTypes.number,
    startIndex: PropTypes.number,
    getDataFromParent: PropTypes.func,
    loadMore: PropTypes.func,
    loaderDiv: PropTypes.func,
    hasMore: PropTypes.bool,
    infinite: PropTypes.bool,
    loader: PropTypes.object,
    showCheckbox: PropTypes.bool,
    fixedHeader: PropTypes.bool,
    isBlueJay: PropTypes.bool,
    paginated: PropTypes.bool,
    parentCustomClass: PropTypes.string,     //used for infinite scrolling
    isSmall: PropTypes.bool,
    noHeadTable: PropTypes.bool,
    virtualizedTable: PropTypes.bool,
    useWindow: PropTypes.bool,
    useInfinite: PropTypes.bool,
    showPrevNext: PropTypes.bool,
    noHoverTable: PropTypes.bool,
    twoLineHeader: PropTypes.bool,
    fixHeaderPhoenix: PropTypes.bool,
    customRowRenderer: PropTypes.bool,
    noCursorRow: PropTypes.bool,
    customInfiteLoadConfig: PropTypes.object,
    forceUseAutoSizer: PropTypes.bool,
    autoHeightTable: PropTypes.bool,
    disableVirtualisedAutoHeight: PropTypes.bool,
    useWindowVirtualize: PropTypes.bool,
    scrollPagination: PropTypes.bool,
    subCategoriesEnabled: PropTypes.bool,
    scrollHandler: PropTypes.func,
    fixStyle: PropTypes.bool,
    fixScroll: PropTypes.bool,
    // Prop introduced for unique scroll id
    customScrollDivId: PropTypes.string,
    ServieTableClass: PropTypes.bool,
    enableEqualWidthForTableRows: PropTypes.bool,
    isSortingApplied: PropTypes.bool,
    subRowLimit: PropTypes.number,
    categoryRowExpandLimit: PropTypes.number,
    showFixedColumnShadow: PropTypes.bool,
    isDefaultDashboardForExecutiveSummary: PropTypes.bool,
    isReseller: PropTypes.bool
};
export default TableContainer;