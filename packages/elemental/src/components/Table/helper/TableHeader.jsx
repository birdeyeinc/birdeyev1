import React from "react";
import PropTypes from "prop-types";
import scrollLeftImg from "assets/images/common/scroll-left.svg"
import scrollRightImg from "assets/images/common/scroll-right.svg"
import { findLastIndex } from "lodash";

const TableHeader = ({
    headers,
    onHandleHeaderSortClick,
    sortOrder,
    sortColumn,
    rowHoverAction,
    customHeadersMaxWidth,
    customHeadersFixWidth,
    customHeadersMinWidth,
    isFirstRowFixed,
    handleHorizontalScroll,
    isHeaderFixed,
    headerCellRenderer,
    showScrollIcons
}) => {

    const renderer = ({ value, label }) => {
        if (!headerCellRenderer?.[value])
        return (<span>{label}</span>);
        
        const callBack = headerCellRenderer?.[value];
        return callBack({ label, value });
    };

    return (
        <thead className={`${isHeaderFixed ? "header-fixed" : ""}`}>
            <tr>
                {headers?.map(({ enabled, value, label, sortable = false , fixed}, index ) => {
                    const maxWidth = customHeadersMaxWidth?.[value];
                    const fixWidth = customHeadersFixWidth?.[value];
                    const minWidth = customHeadersMinWidth?.[value];
                    const columnSorted = sortColumn === value;
                    const sortAsc = columnSorted && sortOrder === 0;
                    const isLeftScroll = (isFirstRowFixed && index === 0)
                    if (!enabled) return [];
                    return (
                    <>
                        <th 
                            key={value} 
                            className={`table-head table-data ${fixed ? "fixed-width" : ""} ${(sortable && columnSorted) ? "sorted-text" : ""} ${(isLeftScroll) ? "fixed-column" : ""} ${sortable ? "pointer" : ''}`}
                            style={{ textAlign: "left", maxWidth: maxWidth || "auto", width: fixWidth || "auto", minWidth: minWidth || "auto" }}
                            onClick={() => onHandleHeaderSortClick(value, sortable, index)}
                        >
                        <span className="label-text">{renderer({ value, label })}&nbsp;{sortable && (<i className={`pointer ${sortAsc ? "icon_phoenix-up-arrow" : "icon_phoenix-down-arrow"}`}/>)}</span>
                        </th>
                        {isLeftScroll && (showScrollIcons.left || showScrollIcons.disable) &&
                        <th
                            key={"scroll-left-h"} 
                            className="table-head table-data fixed-column-left-scroll"
                            style={{ textAlign: "center"}}
                        >
                            <span onClick={() => handleHorizontalScroll("left")} className={`pointer ${!showScrollIcons.left && showScrollIcons.disable && 'disable'}`}>
                                <img src={scrollLeftImg} />
                            </span>
                        </th>}
                        {isFirstRowFixed && index === findLastIndex(headers) && (showScrollIcons.right || showScrollIcons.disable) && 
                        <th
                            key={"scroll-left-h"} 
                            className="table-head table-data fixed-column-right-scroll"
                            style={{ textAlign: "center"}}
                        >
                            <span onClick={() => handleHorizontalScroll("right")} className={`pointer ${!showScrollIcons.right && showScrollIcons.disable && 'disable'}`}>
                                <img src={scrollRightImg} />
                            </span>
                        </th>}
                    </>)
                })}
                {rowHoverAction?.enable && <th className={`row-action table-head table-data ${rowHoverAction?.enableThreeDots ? 'three-dots-visible' : ''}`} style={{ width: customHeadersMaxWidth?.rowHoverActionWidth || 'auto' }}></th>}
            </tr>
        </thead>
    )
};

TableHeader.propTypes = {
    headers: PropTypes.array,
    onHandleHeaderSortClick: PropTypes.func,
    sortOrder: PropTypes.number,
    sortColumn: PropTypes.string,
    rowHoverAction: PropTypes.shape({
        enable: PropTypes.bool,
        config: PropTypes.func
    }),
    customHeadersMaxWidth: PropTypes.object,
    isFirstRowFixed: PropTypes.bool,
    handleHorizontalScroll: PropTypes.func,
    isHeaderFixed: PropTypes.bool,
    headerCellRenderer :PropTypes.func,
    showScrollIcons: PropTypes.object,
    customHeadersMinWidth: PropTypes.object 
}

export default TableHeader;