
import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import ActionBox from 'atoms/ActionBox';
import { findLastIndex, isEmpty } from 'lodash';
import useVirtualization from './useVirtualization';

const TableBody = ({
    data,
    headers,
    onHandleRowClick,
    onHandleSingleCellClick,
    rowHoverAction,
    cellRenderer,
    isFirstRowFixed,
    accordionConfig: {
        enableAccordion = false,
        defaultAccordionState = {isOpen: false, primaryRowId: ''},
        disableAccordionClick = false
    },
    customRowWidth = {},
    disableRowHoverAction,
    disabledStateForRow = [],
    virtualization = { enabled: false, rowHeight: 50, overscan: 5 }
}) => {
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
    const [hoveredCellValue, setHoveredCellValue] = useState(null);
    const [accordionState, setAccordionState] = useState(defaultAccordionState);
    const [removeAccordionArrowIcon, setRemoveAccordionArrowIconState] = useState(false);
    
    const containerRef = useRef(null);
    
    // Use the custom virtualization hook with accordion awareness
    const { visibleItems, effectiveRowHeight, renderSpacers, isVirtualized } = useVirtualization({
        data,
        virtualization,
        containerRef,
        headers,
        rowHoverAction,
        enableAccordion
    });



    useEffect(() => {
        /*If accordion is enabled and there is no accordion metadata available in all rows
        then accordion arrow icon will be completely removed from all rows*/
        if(enableAccordion){
            let removeAccordion = true;
            data?.every(item => {
                if(item.hasOwnProperty('accordionMetadata')){
                    removeAccordion = false;
                    return false;
                } else {
                    return true;
                }
            });
            (removeAccordionArrowIcon !== removeAccordion) &&
                setRemoveAccordionArrowIconState(removeAccordion);
        }
    }, [data])

    const handleRowMouseEnter = (index) => {
        setHoveredRowIndex(index);
    };
    
    const handleRowMouseLeave = () => {
        setHoveredRowIndex(null);
    };
    
    const handleCellMouseEnter = (val) => {
        setHoveredCellValue(val);
    };
    
    const handleCellMouseLeave = () => {
        setHoveredCellValue(null);
    };

    const getActionConfig = (data) => {
        const { config } = rowHoverAction || {};
        return config(data);
    };

    const handleActionChange = (selected, data) => {
        selected?.callBack(data);
    };

    // Cell renderer logic
    const renderer = ({ rowData: rows, cellIndex, rowIndex, row_value, ...rest }) => {
        const headerData = headers[cellIndex] || {};
        const { value } = headerData || {};
        const isHovered = rowIndex === hoveredRowIndex;

        if (!cellRenderer?.[value]) {
            return (
                <div className="column-wrap">
                    <div className="no-cell-renderer">
                        <span className="ellipsis value">
                            {row_value || "-"}
                        </span>
                    </div>
                </div>
            );
        }
        
        const callBack = cellRenderer?.[value];
        const rowData = rows?.[cellIndex];
        return callBack({ rowData, headerData, value, isHovered, hoveredCellValue, ...rest });
    };

    const handleCollapsibleRows = (name) => {
        if(accordionState.isOpen &&
            (accordionState.primaryRowId.toLowerCase() === name.toLowerCase() ||
            name.toLowerCase().includes(accordionState.primaryRowId.toLowerCase())
        )){
            setAccordionState({isOpen: false, primaryRowId: ''});
        } else {
            setAccordionState({isOpen: true, primaryRowId: name});
        }
    }



    // Determine data source and spacers based on virtualization
    const { topSpacer, bottomSpacer } = isVirtualized ? renderSpacers() : { topSpacer: null, bottomSpacer: null };
    const dataToRender = visibleItems; // Hook returns all data when virtualization is disabled

    return (
        <tbody ref={containerRef}>
            {/* Top spacer only for virtualization */}
            {isVirtualized && topSpacer}
            
            {/* Render rows */}
            {dataToRender?.map((rows, index) => {
                // Use appropriate index based on virtualization mode
                const rowIndex = isVirtualized ? (rows.originalIndex ?? index) : index;
                    // Row data processing
                    let rowData = rows?.rowData && rows?.rowData?.slice().sort((a, b) => a.order - b.order);
                    let updatePrimaryRowOnAccordionOpen = {};
                    let isAccordionOpen = accordionState.isOpen && accordionState.primaryRowId.toLowerCase() === rowData[0].value.toLowerCase();

                    if (!isEmpty(rows?.accordionMetadata?.updatePrimaryRowOnAccordionOpen) && isAccordionOpen) {
                        let rowDataToUpdate = rows?.accordionMetadata?.updatePrimaryRowOnAccordionOpen.rowData;
                        rowData = rowDataToUpdate && rowDataToUpdate.slice().sort((a, b) => a.order - b.order);
                        updatePrimaryRowOnAccordionOpen = rows?.accordionMetadata?.updatePrimaryRowOnAccordionOpen;
                    }

                    const isRowDisabled = disabledStateForRow?.[rowIndex]?.isDisabled || false;
                    const enableThreeDotsForDisabledRows = rowHoverAction?.enableThreeDotsForDisabledRows || false;
                    return (
                        <tr 
                            key={isVirtualized ? `row-${rows.originalIndex || rowIndex}` : rowIndex}
                            onClick={(e) => {
                                e.target?.nodeName === "TD" && onHandleRowClick({ ...rows })
                                if (enableAccordion && rows?.accordionMetadata?.secondaryRow) {
                                    !disableAccordionClick && handleCollapsibleRows(rowData[0].value);
                                }
                            }}
                            onMouseEnter={() => handleRowMouseEnter(rowIndex)}  
                            onMouseLeave={handleRowMouseLeave}
                            style={{
                                background: ((
                                    rowHoverAction?.enable && rowIndex === hoveredRowIndex) || rows?.accordionMetadata?.primaryRow || (!isEmpty(updatePrimaryRowOnAccordionOpen) && isAccordionOpen)
                                ) ? "#f5f5f5" : "inherit",
                                display: rows?.accordionMetadata?.primaryRow ?
                                    (accordionState.isOpen && accordionState.primaryRowId.toLowerCase() === rows?.accordionMetadata?.primaryRow.toLowerCase()) ? '' : 'none' : '',
                                height: isVirtualized ? `${effectiveRowHeight || virtualization.rowHeight || 50}px` : 'auto'
                            }}
                            className={` ${isRowDisabled ?  enableThreeDotsForDisabledRows ? "row-disable-with-three-dots" : "row-disable" : ""} ${onHandleRowClick ? "pointer" : ""} ${rowHoverAction?.enableThreeDots ? 'row-dots-visible' : ''} `}
                        >
                            {rowData?.map((rwData, cellIndex) => {
                                const { order, value: row_value } = rwData || {};
                                const isLeftScroll = isFirstRowFixed && cellIndex === 0;
                                const headerData = headers[cellIndex] || {};
                                const { value: header_value } = headerData || {};
                                
                                const { customRowMaxWidth = {}, customRowFixWidth = {}, customRowMinWidth = {} } = customRowWidth;
                                const maxWidth = customRowMaxWidth?.[header_value];
                                const fixWidth = customRowFixWidth?.[header_value];
                                const minWidth = customRowMinWidth?.[header_value];

                                return (
                                    <React.Fragment key={order}>
                                        <td 
                                            onClick={() => onHandleSingleCellClick({ row_value, ...rwData })}
                                            onMouseOver={() => handleCellMouseEnter({ cellIndex, value: row_value })}
                                            onMouseLeave={handleCellMouseLeave}
                                            className={`
                                                table-rows table-data ${cellIndex === 0 ? "fixed-width" : ""} ${isLeftScroll ? "fixed-column" : ""} ${onHandleSingleCellClick ? "pointer" : ""}
                                                ${(enableAccordion && cellIndex === 0) ? 'flex-row-content' : ''}
                                            `}
                                            style={{
                                                textAlign: "left",
                                                backgroundColor: (rows?.accordionMetadata?.primaryRow || (!isEmpty(updatePrimaryRowOnAccordionOpen) && isAccordionOpen)) && '#f5f5f5',
                                                maxWidth: maxWidth || 'auto',
                                                minWidth: minWidth || 'auto',
                                                width: fixWidth || '200px'
                                            }}
                                        >
                                            <div className={enableAccordion && cellIndex === 0 ? "table-content-wrapper" : ""}>
                                                { enableAccordion && cellIndex === 0 &&
                                                    <div className={
                                                        `icon_phoenix-up-arrow
                                                        ${isAccordionOpen ? '' : 'rotate-icon'}
                                                        ${(!rows?.accordionMetadata?.secondaryRow || disableAccordionClick) && 'hide-icon'}
                                                        ${removeAccordionArrowIcon && 'remove-icon'}`
                                                    }/>}
                                                {
                                                    (!isEmpty(updatePrimaryRowOnAccordionOpen) && isAccordionOpen)
                                                    ? <div className="column-wrapper" style={{maxWidth: maxWidth || "300px", width: fixWidth || "auto", minWidth: minWidth || "auto"}}>{renderer({ ...updatePrimaryRowOnAccordionOpen, cellIndex, rowIndex: rowIndex, row_value })}</div>
                                                  : <div className="column-wrapper" style={isLeftScroll ? {maxWidth: maxWidth || "300px", width: fixWidth || "auto", minWidth: minWidth || "auto"} : {}}>{renderer({ ...rows, cellIndex, rowIndex: rowIndex, row_value })}</div>
                                                }
                                            </div>
                                        </td>
                                        {isLeftScroll && 
                                        <td 
                                            key={"scroll-left-b"}
                                            className="table-rows table-data fixed-column-left-scroll"
                                            style={{
                                            background: ((
                                                rowHoverAction?.enable && rowIndex === hoveredRowIndex) || rows?.accordionMetadata?.primaryRow || (!isEmpty(updatePrimaryRowOnAccordionOpen) && isAccordionOpen)
                                                ) ? "#f5f5f5" : "#fff", textAlign: "center"
                                            }}
                                            data-fixed="true"
                                        >
                                            <div className="column-wrapper">{null}</div>
                                        </td>}
                                        {isFirstRowFixed && cellIndex === findLastIndex(rowData) && 
                                        <td
                                            key={"scroll-right-b"} 
                                            className="table-head table-data fixed-column-right-scroll"
                                            style={{
                                            background: ((
                                                rowHoverAction?.enable && rowIndex === hoveredRowIndex) || rows?.accordionMetadata?.primaryRow || (!isEmpty(updatePrimaryRowOnAccordionOpen) && isAccordionOpen)
                                                ) ? "#f5f5f5" : "#fff", textAlign: "center"
                                            }}
                                            data-fixed="true"
                                        >
                                            <div className="column-wrapper">{null}</div>
                                        </td>}
                                    </React.Fragment>
                                );
                            })}
                            {(rowHoverAction?.enable && rowIndex === hoveredRowIndex)
                            ? (<td className={`row-action ${rowHoverAction?.enableThreeDots ? 'three-dots-visible' : ''}`} style={{ width: customRowWidth?.customRowMaxWidth?.rowHoverActionWidth || 'auto' }}>
                                {!disableRowHoverAction(rowData) ? (
                                    <div className={rowHoverAction?.customJSX ? "action-container" : ""}>
                                        {rowHoverAction?.customJSX && rowHoverAction.customJSX(rows)}
    
                                        <ActionBox
                                            actionConfig={getActionConfig({ ...rows, headers })}
                                            actionClickCb={(val) => handleActionChange(val, { ...rows, rowIndex })}
                                            ActionLabel="Actions"
                                            popOverSize="large"
                                        />
                                    </div>
                                ) : null}
                            </td>)
                            : rowHoverAction?.enable &&
                            !disableRowHoverAction(rowData) &&
                            <td className={`row-action table-rows table-data ${rowHoverAction?.enableThreeDots ? 'three-dots-visible' : ''}`} style={{ width: customRowWidth?.customRowMaxWidth?.rowHoverActionWidth || 'auto' }}><i className="icon_phoenix-vertical-dots"></i></td>}
                </tr>
            )})}
            
            {/* Bottom spacer only for virtualization */}
            {isVirtualized && bottomSpacer}
        </tbody>
    );
};

TableBody.propTypes = {
    data: PropTypes.array,
    headers: PropTypes.array,
    onHandleRowClick: PropTypes.func,
    onHandleSingleCellClick: PropTypes.func,
    rowHoverAction: PropTypes.shape({
        enable: PropTypes.bool,
        config: PropTypes.func,
        customJSX: PropTypes.func,
        enableThreeDots: PropTypes.bool
    }),
    cellRenderer: PropTypes.object,
    isFirstRowFixed: PropTypes.bool,
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
        overscan: PropTypes.number
    })
};

export default TableBody;