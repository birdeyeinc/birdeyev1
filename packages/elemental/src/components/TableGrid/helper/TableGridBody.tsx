
import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import ActionBox from 'atoms/ActionBox';
import useVirtualization from './useVirtualization';
import { getCellByKey } from '../utils/normalizeRowData';
import { getTrMetadata, getTdMetadata, applyMetadataToProps } from '../utils/metadataUtils';
import { useTableGridColumns } from '../context/TableGridColumnContext';
import {
    DEFAULT_ACCORDION_CONFIG,
    toggleRowExpansion,
    flattenDataForRendering,
    getDisplayRowData,
    getNextVisibleCount
} from '../utils/accordionUtils';
import styles from "../table.module.scss";
import type { TableGridBodyProps, NormalizedRow, HeaderData, CustomRowWidth, MetadataConfig, RowHoverAction, CellRendererMap } from '../types';
import { calculateWidthWithScaleFactor } from "../utils/columnWidthUtils";

// Pure utility — no component state dependency
const handleActionChange = (selected: any, actionData: any) => {
    selected?.callBack(actionData);
};

// ============================================================================
// TableGridRow — each row manages its own hover state
// ============================================================================

interface TableGridRowProps {
    row: NormalizedRow;
    index: number;
    enabledHeaders: HeaderData[];
    expandIconColumnKey: string | null;
    accordionEnabled: boolean;
    onHandleRowClick?: TableGridBodyProps['onHandleRowClick'];
    onHandleSingleCellClick?: TableGridBodyProps['onHandleSingleCellClick'];
    rowHoverAction?: RowHoverAction;
    cellRenderer?: CellRendererMap;
    isFirstColumnFixed?: boolean;
    customRowWidth: CustomRowWidth;
    disableRowHoverAction?: TableGridBodyProps['disableRowHoverAction'];
    disabledStateForRow: TableGridBodyProps['disabledStateForRow'];
    containerWidth: number;
    viewPortColumns?: number;
    disablePerfOptimization?: boolean;
    metadataConfig?: MetadataConfig;
    enableResize?: boolean;
    getTableContainerRef?: TableGridBodyProps['getTableContainerRef'];
    columnWidths: Record<string, number>;
    effectiveRowHeight?: number;
    isVirtualized: boolean;
    rowHeight?: number | null;
    handleToggleExpand: (rowId: string) => void;
    handleSeeMore: (parentRowId: string, currentCount: number, totalCount: number) => void;
    headers: HeaderData[];
    disableExpand?: boolean;
    scaleFactor?: number;
    enableFluidWidthByDefault?: boolean;
    deafaultMaxWidthForAllColumns?: number;
    defaultMinWidthForAllColumns?: number;
}

const TableGridRow = React.memo(({
    row,
    index,
    enabledHeaders,
    expandIconColumnKey,
    accordionEnabled,
    onHandleRowClick,
    onHandleSingleCellClick,
    rowHoverAction,
    cellRenderer,
    isFirstColumnFixed,
    customRowWidth = {},
    disableRowHoverAction,
    disabledStateForRow = {},
    containerWidth,
    viewPortColumns,
    disablePerfOptimization,
    metadataConfig,
    enableResize,
    getTableContainerRef,
    columnWidths,
    effectiveRowHeight,
    isVirtualized,
    rowHeight,
    handleToggleExpand,
    handleSeeMore,
    headers,
    disableExpand,
    scaleFactor,
    enableFluidWidthByDefault,
    deafaultMaxWidthForAllColumns,
    defaultMinWidthForAllColumns

}: TableGridRowProps) => {
    // Per-row hover state — only this row re-renders on hover change
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = useCallback(() => {
        if (disablePerfOptimization) setIsHovered(true);
    }, [disablePerfOptimization]);

    const handleMouseLeave = useCallback(() => {
        if (disablePerfOptimization) setIsHovered(false);
    }, [disablePerfOptimization]);

    // Transient stacking elevation for the row-action <td> while a portal-mode
    // ActionBox popover is open. `.row-action-cell` has z-index: 3 (sticky)
    // which creates a stacking context that traps the fixed-positioned popover
    // descendants below thead's z-index: 4. Toggling `.row-action-cell-lifted`
    // (z-index: 1001) on the td while any ActionBox in the row is open lets
    // the popover paint above thead. Class toggle (not inline style) keeps the
    // stacking numbers owned by SCSS. Ref-based to avoid React re-renders of
    // cell renderers. Counter handles multiple ActionBoxes per row.
    const actionTdRef = useRef<HTMLTableCellElement | null>(null);
    const openCountRef = useRef(0);
    const setLifted = useCallback((on: boolean) => {
        const td = actionTdRef.current;
        if (!td) return;
        td.classList.toggle(styles['row-action-cell-lifted'], on);
    }, []);
    const handlePortalActionToggle = useCallback((open: boolean) => {
        openCountRef.current = Math.max(0, openCountRef.current + (open ? 1 : -1));
        setLifted(openCountRef.current > 0);
    }, [setLifted]);

    // Subtree-aware cleanup. The ActionBox subtree is conditionally rendered
    // by `disableRowHoverAction(row)`, `disablePerfOptimization && !isHovered`,
    // and `rowHoverAction.removeActionBoxes`. If any of these flip while a
    // popover is open, the unmount path does NOT fire toggleQuickSend(false),
    // so the counter and lifted state would never reset. This effect watches
    // the visibility flag and force-resets both when the subtree disappears;
    // also covers row unmount via React's effect cleanup.
    const actionSubtreeShown =
        !!rowHoverAction?.enable &&
        !disableRowHoverAction?.(row) &&
        (!disablePerfOptimization || isHovered) &&
        !rowHoverAction?.removeActionBoxes;

    useEffect(() => {
        if (actionSubtreeShown) return;
        openCountRef.current = 0;
        setLifted(false);
    }, [actionSubtreeShown, setLifted]);

    // --- "See More" row type ---
    if (row._rowType === 'seeMore') {
        const { _parentRowId, _currentVisibleCount, _totalCount } = row;
        const seeMoreRowId = _parentRowId || 'unknown-parent';
        return (
            <tr
                key={`see-more-${_parentRowId}`}
                className={`${styles["see-more-row"]} ${styles["table-row"]}`}
                data-testid={`el-test-tbl-row-more-${seeMoreRowId}`}
            >
                <td
                    colSpan={enabledHeaders.length + (rowHoverAction?.enable ? 1 : 0)}
                    className={styles["see-more-cell"]}
                    style={{ paddingLeft: '40px' }}
                    data-testid={`el-test-tbl-cell-more-${seeMoreRowId}`}
                >
                    <button
                        className={styles["see-more-button"]}
                        data-testid={`el-test-tbl-btn-more-${seeMoreRowId}`}
                        onClick={() => handleSeeMore(_parentRowId ?? '', _currentVisibleCount ?? 0, _totalCount ?? 0)}
                    >
                        See more
                    </button>
                </td>
            </tr>
        );
    }

    // --- Cell renderer ---
    const renderer = ({ rowData, cellIndex, rowIndex, row_value, headerData, headerKey, _isExpanded, _isExpandable, _childrenCount, rowId, ...rest }: {
        rowData: any;
        cellIndex: number;
        rowIndex: number;
        row_value: any;
        headerData: HeaderData;
        headerKey: string;
        _isExpanded?: boolean;
        _isExpandable?: boolean;
        _childrenCount?: number;
        rowId?: string;
        [key: string]: any;
    }) => {
        const cellData = rowData?.[headerKey];

        const rendererConfig = cellRenderer?.[headerKey];

        if (!rendererConfig) {
            return <div className={`${styles["cell-data"]} `}><span className={`${styles["ellipsis"]} `}>{row_value || "-"}</span></div>;
        }

        // Essential props only - stable references, won't cause re-renders
        const cellProps = {
            rowData: cellData,
            headerData,
            headerKey,
            rowId,
            cellIndex,
            rowIndex,
            // Accordion-related (stable per row)
            _isExpanded,
            _isExpandable,
            _childrenCount,
            // other row Data
            ...rest
        };

        // Determine if isHovered should be passed:
        // 1. disablePerfOptimization must be true to enable hover tracking
        // 2. If enabled, check needIsHoverProp: cellData > headerData > default false
        const needIsHoverProp = disablePerfOptimization
            ? (cellData?.needIsHoverProp ?? headerData?.needIsHoverProp ?? false)
            : false;

        const optionalProps = {
            isHovered: needIsHoverProp ? isHovered : undefined,
        }

        const renderProps = { ...cellProps, ...optionalProps };

        // Support pre-created JSX element renderer
        // Optimization: do not clone by default to keep element static/stable.
        // If consumer needs runtime table props, opt-in by setting
        // element prop: injectRendererProps={true}
        if (React.isValidElement(rendererConfig)) {
            const rendererConfigProps = (rendererConfig.props ?? {}) as Record<string, unknown> & { injectRendererProps?: boolean };
            const injectRendererProps = rendererConfigProps?.injectRendererProps;
            if (!injectRendererProps) {
                return rendererConfig;
            }

            return React.cloneElement(rendererConfig, {
                ...renderProps,
                ...rendererConfigProps,
            });
        }

        // Support component types: function/class/memo/forwardRef/etc.

            const CellComponent = rendererConfig as React.ComponentType<Record<string, unknown>>;
            return <CellComponent {...renderProps} />;
    };

    // --- Main row render ---
    const {
        _rowType,
        _isExpanded,
        _isExpandable,
        _flatIndex,
        rowId
    } = row;

    const isParent = _rowType === 'parent';
    const isChild = _rowType === 'child';
    const rowIndex = _flatIndex ?? index;
    const rowTestId = rowId || `row-${rowIndex}`;

    // Get display row data (handles expandedRowData)
    const rowData = getDisplayRowData(row, _isExpanded ?? false);

    // Determine if row is disabled (check disabledStateForRow by rowId, then fallback to rowData.isDisabled)
    const isRowDisabled = (rowId ? disabledStateForRow?.[rowId]?.isDisabled : false) ?? row?.isDisabled ?? false;

    // Get metadata for this <tr> element (merge global config with inline row.metadata)
    const trMetadata = getTrMetadata(metadataConfig, row.metadata);
    const computedRowHeight = effectiveRowHeight ?? rowHeight;
    const baseTrProps = {
        className: `
            ${styles["table-row"]}
            ${isRowDisabled ? "row-disable" : ""}
            ${onHandleRowClick ? "pointer" : ""}
            ${isChild ? styles["child-row"] : ""}
            ${isParent && _isExpanded ? "expanded-row" : ""}
        `.trim().replace(/\s+/g, ' '),
        style: {
            ...(isVirtualized && computedRowHeight != null ? { height: `${computedRowHeight}px` } : {})
        }
    };
    const trProps = applyMetadataToProps(baseTrProps, trMetadata);

    return (
        <tr
            key={rowId || `row-${rowIndex}`}
            id={rowId || `row-${rowIndex}`}
            data-testid={`el-test-tbl-row-${rowTestId}`}
            onClick={(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                _e: React.MouseEvent<HTMLTableRowElement>
            ) => {
                if (!onHandleRowClick || isRowDisabled) return;
                onHandleRowClick({ ...row });
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...trProps}
        >
            {enabledHeaders?.map((headerData, cellIndex) => {
                const { value: headerKey, enabledFluidWidth } = headerData || {};
                const fluidWidthEnabled = enabledFluidWidth ?? enableFluidWidthByDefault ?? false;

                // Get cell data
                const cellData = getCellByKey(rowData, headerKey);
                const row_value = cellData?.value;

                const isLeftScroll = isFirstColumnFixed && cellIndex === 0;
                const isExpandColumn = headerKey === expandIconColumnKey;
                const showExpandIcon = accordionEnabled && isExpandColumn && isParent && _isExpandable;
                const ContentWrapper = showExpandIcon ? 'div' : React.Fragment;
                const contentWrapperProps = showExpandIcon
                    ? { className: styles['table-content-wrapper'] }
                    : {};

                const { customRowMaxWidth = {}, customRowFixWidth = {}, customRowMinWidth = {} } = customRowWidth;

                let minWidth, fixWidth;
                let viewportMinWidth;

                if (viewPortColumns && containerWidth) {
                    viewportMinWidth = Math.floor(containerWidth / viewPortColumns);
                }

                const maxWidth = headerData?.maxWidth ?? customRowMaxWidth?.[headerKey];
                // Context columnWidths (from resize) takes priority over fixWidth prop
                fixWidth = headerData?.width ?? customRowFixWidth?.[headerKey];
                minWidth = headerData?.minWidth ?? customRowMinWidth?.[headerKey];

                const actualMaxWidth = maxWidth;

                // If resize is enable then our table-layout is `fixed` so we should use width for column's width
                // min-width is not applicable in table-layout: fixed
                if(viewportMinWidth){
                    if(enableResize){
                        fixWidth = fixWidth || viewportMinWidth;
                    } else {
                        minWidth = minWidth || viewportMinWidth;
                    }
                }

                // Get metadata for this <td> element (merge global config with inline cell.metadata)
                const tdMetadata = getTdMetadata(metadataConfig, headerKey, cellData?.metadata);
                const baseTdProps = {
                    className: `
                        ${styles["table-data"]}
                        ${cellIndex === 0 ? styles["fixed-width"] : ""}
                        ${isLeftScroll ? styles["fixed-column"] : ""}
                        ${(cellData?.onCellClick) ? styles["pointer"] : ""}
                    `.trim().replace(/\s+/g, ' '),
                    style: {
                        textAlign: "left",
                        paddingLeft: isChild && isExpandColumn ? '40px' : undefined,
                        // When columnWidths is set, use width directly (not maxWidth) for precise column sizing
                        ...(columnWidths?.[headerKey] != null ? {} : (maxWidth != null ? { maxWidth } : {})),
                        ...(minWidth != null ? { minWidth } : {}),
                        ...(fixWidth != null ? { width: fixWidth } : {})
                    }
                };
                const tdProps = applyMetadataToProps(baseTdProps, tdMetadata);

                if (enableResize && !columnWidths[headerKey] && fluidWidthEnabled && !viewPortColumns) {
                    const scaledWidth = calculateWidthWithScaleFactor({ width: tdProps.style.width, scaleFactor: scaleFactor ?? 1, maxWidth: tdProps.style.maxWidth || actualMaxWidth || deafaultMaxWidthForAllColumns, minWidth: tdProps.style.minWidth || defaultMinWidthForAllColumns });
                    if (scaledWidth != null) {
                        tdProps.style.width = scaledWidth;
                        tdProps.style.maxWidth = undefined;
                        tdProps.style.minWidth = undefined;
                    }
                }

                if(enableResize && columnWidths[headerKey]){
                    tdProps.style.width = `${columnWidths[headerKey]}px`;
                    tdProps.style.maxWidth = undefined;
                    tdProps.style.minWidth = undefined;
                }

                return (
                    <React.Fragment key={`${headerKey}`}>
                        <td
                            data-testid={`el-test-tbl-cell-${headerKey}-${rowTestId}`}
                            onClick={(e: React.MouseEvent<HTMLTableCellElement>) => {
                                // Handle expand toggle on icon click
                                if (showExpandIcon && (e.target as HTMLElement).closest(".el-expand-icon")) {
                                    e.stopPropagation();
                                    if (rowId) handleToggleExpand(rowId);
                                    return;
                                }

                                const onCellClick = cellData?.onCellClick || headerData?.onCellClick;
                                const shouldTriggerGlobalCellClick =
                                    onCellClick?.({
                                        event: e,
                                        cellData: { row_value, ...cellData },
                                        rowData: row,
                                        rowIndex,
                                        cellIndex,
                                        headerData,
                                        headerKey,
                                    }) !== false;

                                if (shouldTriggerGlobalCellClick) {
                                    onHandleSingleCellClick?.({ row_value, ...cellData, event: e, rowData: row, rowIndex, cellIndex, headerData, headerKey });
                                }
                            }}
                            {...tdProps}
                        >
                            <ContentWrapper {...contentWrapperProps}>
                                {showExpandIcon && (
                                    <div
                                        className={` el-expand-icon
                                            ${styles["expand-icon"]}
                                            icon_phoenix-up-arrow
                                            ${_isExpanded ? "" : styles["rotate-icon"]}
                                            ${disableExpand ? styles["disabled"] : ""}
                                        `}
                                        data-testid={`el-test-tbl-exp-${headerKey}-${rowTestId}`}
                                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                                            e.stopPropagation();
                                            if (rowId) handleToggleExpand(rowId);
                                        }}
                                    />
                                )}
                                {renderer({
                                    cellIndex,
                                    rowIndex,
                                    row_value,
                                    headerData,
                                    headerKey: headerKey,
                                    ...row,
                                })}
                            </ContentWrapper>
                        </td>

                        {/* NOTE --> we are removing scroll arrows, as in new design we dont have scroll arrows */}

                        {/* {isLeftScroll &&
                        <td
                            key={"scroll-left-b"}
                            className="table-rows table-data fixed-column-left-scroll"
                            style={{ textAlign: "center", left: (minWidth ?? 260) + 40 }}
                            data-fixed="true"
                        >
                            <div className="column-wrapper">{null}</div>
                        </td>}
                        {isFirstColumnFixed && cellIndex === enabledHeaders.length - 1 &&
                        <td
                            key={"scroll-right-b"}
                            className="table-head table-data fixed-column-right-scroll"
                            style={{textAlign: "center"}}
                            data-fixed="true"
                        >
                            <div className="column-wrapper">{null}</div>
                        </td>} */}
                    </React.Fragment>
                );
            })}
            {/* This will be needed for resize handle for last column */}
            {enableResize ? <td className={styles["invisible-cell"]} aria-hidden="true" tabIndex={-1} data-testid={`el-test-tbl-cell-rsz-ph-${rowTestId}`} /> : null}
            {rowHoverAction?.enable && (
                <td
                    ref={actionTdRef}
                    className={`${styles["row-action-cell"]}`}
                    data-testid={`el-test-tbl-act-cell-${rowTestId}`}
                    style={customRowWidth?.customRowMaxWidth?.rowHoverActionWidth != null
                        ? { width: customRowWidth.customRowMaxWidth.rowHoverActionWidth }
                        : undefined}
                >
                    <div className={`${styles["row-action-wrapper"]} el-tablegrid-row-action-wrapper`} data-testid={`el-test-tbl-act-wrap-${rowTestId}`}>
                        {(!disableRowHoverAction?.(row) && (!disablePerfOptimization || isHovered)) ? (
                            <div className={rowHoverAction?.customJSX ? `${styles["action-container"]} el-tablegrid-action-container` : ""} data-testid={`el-test-tbl-act-content-${rowTestId}`}>
                                {rowHoverAction?.customJSX && rowHoverAction.customJSX(row)}

                                {!rowHoverAction?.removeActionBoxes ? (
                                    <div className={`${styles["action-boxes"]} el-tablegrid-action-boxes`} data-testid={`el-test-tbl-act-boxes-${rowTestId}`}>
                                        {rowHoverAction.actionBoxConfigs?.map((actionBoxconfig, idx) => {
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { getActionConfig: _getActionConfig, ...rest } = actionBoxconfig;
                                            // For usePortal configs: wrap toggleQuickSend so the
                                            // row-action <td> z-index is lifted while open. Stacks
                                            // popover above sticky thead. Consumer's own
                                            // toggleQuickSend (if any) is preserved.
                                            const consumerToggleQuickSend = (rest as { toggleQuickSend?: (open: boolean) => void }).toggleQuickSend;
                                            const wrappedToggleQuickSend = (actionBoxconfig as { usePortal?: boolean })?.usePortal
                                                ? (open: boolean) => {
                                                      handlePortalActionToggle(open);
                                                      consumerToggleQuickSend?.(open);
                                                  }
                                                : consumerToggleQuickSend;
                                            return (
                                                <div key={idx} data-testid={`el-test-tbl-act-box-${idx}-${rowTestId}`}>
                                                    <ActionBox
                                                        customClassName={`${styles["action-boxes-item"]}`}
                                                        actionConfig={actionBoxconfig?.getActionConfig({ ...row, headers })}
                                                        actionClickCb={(val: any) => handleActionChange(val, { ...row, rowIndex })}
                                                        containerRef={getTableContainerRef?.()}
                                                        openBasedOnWindowHeight
                                                        data-testid={`el-test-tbl-act-box-list-container-${idx}-${rowTestId}`}
                                                        {...rest}
                                                        toggleQuickSend={wrappedToggleQuickSend}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                </td>
            )}

        </tr>
    );
});

TableGridRow.displayName = 'TableGridRow';

// ============================================================================
// TableBody — manages shared state (accordion), delegates rows
// ============================================================================

const TableBody = ({
    data,
    headers,
    onHandleRowClick,
    onHandleSingleCellClick,
    rowHoverAction,
    scaleFactor,
    enableFluidWidthByDefault,
    cellRenderer,
    isFirstColumnFixed,
    accordionConfig = {},
    customRowWidth = {},
    disableRowHoverAction,
    disabledStateForRow = {},
    virtualization = { enabled: false, rowHeight: 50, overscan: 5 },
    containerWidth = 0,
    viewPortColumns,
    disablePerfOptimization,
    metadataConfig,
    enableResize,
    getTableContainerRef
}: TableGridBodyProps) => {
    // Get column widths from context (for resize feature)
    const { columnWidths, minColumnWidth: defaultMinWidthForAllColumns, maxColumnWidth: deafaultMaxWidthForAllColumns } = useTableGridColumns();

    // Merge accordion config with defaults
    const {
        enabled: accordionEnabled,
        defaultExpandedRowIds,
        maxExpandedRows,
        subRowLimit,
        onExpand,
        onLoadMoreSubRows,
        expandIconColumn,
        disableExpand
    } = { ...DEFAULT_ACCORDION_CONFIG, ...accordionConfig };

    const [expandedRowIds, setExpandedRowIds] = useState<string[]>(defaultExpandedRowIds || []);
    const [visibleChildrenCounts, setVisibleChildrenCounts] = useState<Record<string, number>>({});

    const containerRef = useRef<HTMLTableSectionElement>(null);

    // Ref to read current expandedRowIds without adding it to callback dependencies
    const expandedRowIdsRef = useRef(expandedRowIds);
    expandedRowIdsRef.current = expandedRowIds;

    // Get enabled headers sorted by order
    const enabledHeaders = useMemo(() => {
        return headers?.filter(h => h.enabled) || [];
    }, [headers]);

    // Determine which column shows the expand icon
    const expandIconColumnKey = useMemo(() => {
        if (expandIconColumn) return expandIconColumn;
        return enabledHeaders[0]?.value || null;
    }, [expandIconColumn, enabledHeaders]);

    // Flatten data for rendering (handles accordion expansion)
    const flattenedData = useMemo(() => {
        if (!accordionEnabled) {
            // If accordion not enabled, just add metadata
            return data?.map((row, index) => ({
                ...row,
                _rowType: 'parent' as const,
                _isExpanded: false,
                _isExpandable: false,
                _flatIndex: index
            })) || [];
        }
        return flattenDataForRendering(data, expandedRowIds, subRowLimit, visibleChildrenCounts);
    }, [data, accordionEnabled, expandedRowIds, subRowLimit, visibleChildrenCounts]);

    // Use virtualization hook with flattened data
    const { visibleItems, effectiveRowHeight, renderSpacers, isVirtualized } = useVirtualization({
        data: flattenedData,
        virtualization,
        containerRef,
        enabledHeaders,
        rowHoverAction,
        enableAccordion: accordionEnabled
    });

    // Handle row expansion toggle (stable reference via ref)
    const handleToggleExpand = useCallback((rowId: string) => {
        if (disableExpand) return;

        const { newExpandedRowIds, isNowExpanded } = toggleRowExpansion(
            rowId,
            expandedRowIdsRef.current,
            maxExpandedRows
        );

        setExpandedRowIds(newExpandedRowIds);

        // Initialize visible children count for newly expanded row
        if (isNowExpanded && subRowLimit > 0) {
            setVisibleChildrenCounts(prev => ({
                ...prev,
                [rowId]: subRowLimit
            }));
        }

        // Call onExpand callback if provided
        if (onExpand) {
            onExpand(rowId, isNowExpanded, newExpandedRowIds);
        }
    }, [maxExpandedRows, subRowLimit, onExpand, disableExpand]);

    // Handle "see more" click for child rows
    const handleSeeMore = useCallback((parentRowId: string, currentCount: number, totalCount: number) => {
        const newCount = getNextVisibleCount(currentCount, subRowLimit, totalCount);

        setVisibleChildrenCounts(prev => ({
            ...prev,
            [parentRowId]: newCount
        }));

        // Call onLoadMoreSubRows callback if provided
        if (onLoadMoreSubRows) {
            onLoadMoreSubRows(parentRowId, newCount);
        }
    }, [subRowLimit, onLoadMoreSubRows]);

    // Determine data source based on virtualization
    const { topSpacer, bottomSpacer } = isVirtualized ? renderSpacers() : { topSpacer: null, bottomSpacer: null };
    const dataToRender = visibleItems;

    return (
        <tbody ref={containerRef} data-testid="el-test-tbl-body">
            {isVirtualized && topSpacer}
            {dataToRender?.map((row, index) => (
                <TableGridRow
                    key={row.rowId || `row-${row._flatIndex ?? index}`}
                    row={row}
                    index={index}
                    enabledHeaders={enabledHeaders}
                    expandIconColumnKey={expandIconColumnKey}
                    accordionEnabled={accordionEnabled}
                    onHandleRowClick={onHandleRowClick}
                    onHandleSingleCellClick={onHandleSingleCellClick}
                    rowHoverAction={rowHoverAction}
                    cellRenderer={cellRenderer}
                    isFirstColumnFixed={isFirstColumnFixed}
                    customRowWidth={customRowWidth}
                    disableRowHoverAction={disableRowHoverAction}
                    disabledStateForRow={disabledStateForRow}
                    containerWidth={containerWidth}
                    viewPortColumns={viewPortColumns}
                    disablePerfOptimization={disablePerfOptimization}
                    metadataConfig={metadataConfig}
                    enableResize={enableResize}
                    getTableContainerRef={getTableContainerRef}
                    columnWidths={columnWidths}
                    effectiveRowHeight={effectiveRowHeight}
                    isVirtualized={isVirtualized}
                    rowHeight={virtualization.rowHeight}
                    handleToggleExpand={handleToggleExpand}
                    handleSeeMore={handleSeeMore}
                    headers={headers}
                    disableExpand={disableExpand}
                    scaleFactor={scaleFactor}
                    enableFluidWidthByDefault={enableFluidWidthByDefault}
                    deafaultMaxWidthForAllColumns={deafaultMaxWidthForAllColumns}
                    defaultMinWidthForAllColumns={defaultMinWidthForAllColumns}
                />
            ))}
            {isVirtualized && bottomSpacer}
        </tbody>
    );
};

export default TableBody;
