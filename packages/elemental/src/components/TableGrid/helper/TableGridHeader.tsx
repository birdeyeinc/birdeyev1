import React, { useRef, useMemo, useCallback, memo } from "react";
import { getThMetadata, applyMetadataToProps } from "../utils/metadataUtils";
import { useTableGridColumns } from "../context/TableGridColumnContext";
import ColumnResizeHandle from "./ColumnResizeHandle";
import styles from "../table.module.scss";
import type { HeaderCellProps, TableGridHeaderProps, HeaderRendererInput } from '../types';
import { calculateWidthWithScaleFactor } from "../utils/columnWidthUtils";

/**
 * Individual header cell component - memoized for performance
 */
const HeaderCell = memo(function HeaderCell({
    headerData,
    index,
    sortColumn,
    sortOrder,
    onHandleHeaderSortClick,
    customHeadersMaxWidth,
    customHeadersFixWidth,
    customHeadersMinWidth,
    isFirstColumnFixed,
    containerWidth,
    viewPortColumns,
    metadataConfig,
    renderer,
    enableResize,
    columnWidth,
    scaleFactor,
    enableFluidWidthByDefault,
    defaultMinWidthForAllColumns,
    deafaultMaxWidthForAllColumns,
}: HeaderCellProps) {
    const cellRef = useRef<HTMLTableCellElement>(null);
    const { enabled, value, label, sortable = false, fixed, onHeaderClick, ...rest } = headerData;

    // Calculate widths - context width takes priority over props
    let viewportMinWidth;
    if (viewPortColumns && containerWidth && columnWidth == null) {
        viewportMinWidth = Math.floor(containerWidth / viewPortColumns);
    }

    let maxWidth = rest?.maxWidth ?? customHeadersMaxWidth?.[value];
    let minWidth = rest?.minWidth ?? customHeadersMinWidth?.[value];
    let fixWidth = rest?.width ?? customHeadersFixWidth?.[value];

    // Need to keep track of the original maxWidth for fluid width calculations, as it may be overridden by columnWidth when resizing is enabled
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

    if (columnWidth != null) {
        maxWidth = undefined;
    }

    const columnSorted = sortColumn === value;
    const sortAsc = columnSorted && sortOrder === 0;
    const isLeftScroll = isFirstColumnFixed && index === 0;
    const fluidWidthEnabled = rest?.enabledFluidWidth ?? enableFluidWidthByDefault ?? false;

    if (!enabled) return null;

    // Get metadata for this <th> element
    const thMetadata = getThMetadata(metadataConfig, value, rest?.metadata);
    const baseThProps = {
        className: `${styles["table-data"]} ${fixed ? styles["fixed-width"] : ""} ${sortable && columnSorted ? styles["sorted-text"] : ""} ${isLeftScroll ? styles["fixed-column"] : ""} ${sortable ? styles["pointer"] : ""} ${enableResize ? styles["resizable"] : ""}`.trim().replace(/\s+/g, ' '),
        style: {
            textAlign: "left",
            position: enableResize && !isLeftScroll ? "relative" : undefined,
            ...(maxWidth != null && !columnWidth ? { maxWidth } : {}),
            ...(fixWidth != null ? { width: fixWidth } : {}),
            ...(minWidth != null ? { minWidth } : {}),
        },
    };
    const thProps = applyMetadataToProps(baseThProps, thMetadata);

    if (enableResize && !columnWidth && fluidWidthEnabled && !viewPortColumns) {
        const scaledWidth = calculateWidthWithScaleFactor({width: thProps.style.width, scaleFactor:scaleFactor ?? 1, minWidth: thProps.style.minWidth || defaultMinWidthForAllColumns, maxWidth: thProps.style.maxWidth || actualMaxWidth || deafaultMaxWidthForAllColumns});
        if (scaledWidth != null) {
            thProps.style.width = scaledWidth;
            thProps.style.maxWidth = undefined;
            thProps.style.minWidth = undefined;
        }
    }

    if (enableResize && columnWidth) {
        thProps.style.width = `${columnWidth}px`;
        thProps.style.maxWidth = undefined;
        thProps.style.minWidth = undefined;
    }

    const handleHeaderClick = (event: React.MouseEvent) => {
        // Don't trigger sort if clicking on resize handle
        const target = event.target as Element | null;
        if (target?.closest('.table-column-resize-handle')) {
            return;
        }

        const shouldTriggerSort = onHeaderClick?.({
            event,
            headerData: { enabled, value, label, sortable, fixed, ...rest },
            index,
            sortColumn,
            sortOrder,
        }) !== false;

        if (shouldTriggerSort) {
            onHandleHeaderSortClick(value, sortable);
        }
    };

    return (
        <th ref={cellRef} key={value} {...thProps} data-testid={`el-test-tbl-hdr-cell-${value}`}>
            <div className={`${styles["header-cell"]}`} onClick={handleHeaderClick}>
                {renderer({ enabled, value, label, sortable, fixed, isSorted: columnSorted, sortOrder: columnSorted ? sortOrder : undefined, ...rest })}
                {sortable && (
                    <i className={`${sortAsc ? "icon_phoenix-up-arrow" : "icon_phoenix-down-arrow"}`} data-testid={`el-test-tbl-hdr-sort-${value}`} />
                )}
            </div>
            {enableResize && (
                <ColumnResizeHandle
                    columnKey={value}
                    columnRef={cellRef}
                />
            )}
        </th>
    );
});

const TableHeader = ({
    headers,
    onHandleHeaderSortClick,
    sortOrder,
    sortColumn,
    rowHoverAction,
    scaleFactor,
    enableFluidWidthByDefault,
    customHeadersMaxWidth,
    customHeadersFixWidth,
    customHeadersMinWidth,
    isFirstColumnFixed,
    isHeaderFixed,
    headerCellRenderer,
    containerWidth = 0,
    viewPortColumns,
    metadataConfig,
}: TableGridHeaderProps) => {
    // Get column context (will return no-op values if not in provider)
    const {
        columnWidths,
        enableResize,
        minColumnWidth: defaultMinWidthForAllColumns,
        maxColumnWidth: deafaultMaxWidthForAllColumns,
    } = useTableGridColumns();

    // Get enabled headers for determining last column
    const enabledHeaders = useMemo(() => {
        return headers?.filter(h => h.enabled) || [];
    }, [headers]);

    const renderer = useCallback(({ enabled, value, label, sortable, fixed, isSorted, sortOrder, ...rest }: HeaderRendererInput) => {
        const rendererConfig = headerCellRenderer?.[value];

        if (!rendererConfig) {
            return (<span>{label}</span>);
        }

        const headerProps = { enabled, value, label, sortable, fixed, isSorted, sortOrder, ...rest };

        // Support pre-created JSX element renderer
        // Optimization: do not clone by default to keep element static/stable.
        // If consumer needs runtime table props, opt-in by setting
        // element prop: injectRendererProps={true}
        if (React.isValidElement(rendererConfig)) {
            const rendererProps = (rendererConfig.props ?? {}) as Record<string, unknown> & { injectRendererProps?: boolean };
            const injectRendererProps = rendererProps?.injectRendererProps;
            if (!injectRendererProps) {
                return rendererConfig;
            }

            return React.cloneElement(rendererConfig, {
                ...headerProps,
                ...rendererProps,
            });
        }

        // Support component types: function/class/memo/forwardRef/etc.
        const HeaderCellComponent = rendererConfig as React.ComponentType<Record<string, unknown>>;
        return React.createElement(HeaderCellComponent, headerProps);
    }, [headerCellRenderer]);

    return (
        <thead className={`${styles["table-thead"]} ${isHeaderFixed ? styles["header-fixed"] : ""}`} data-testid="el-test-tbl-hdr">
            <tr data-testid="el-test-tbl-hdr-row" className={`${styles["table-row"]}`}>
                {enabledHeaders?.map((headerItem, index) => {
                    const isLastEnabledColumn = index === enabledHeaders.length - 1;

                    return (
                        <HeaderCell
                            key={headerItem.value}
                            headerData={headerItem}
                            index={index}
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onHandleHeaderSortClick={onHandleHeaderSortClick}
                            customHeadersMaxWidth={customHeadersMaxWidth}
                            customHeadersFixWidth={customHeadersFixWidth}
                            customHeadersMinWidth={customHeadersMinWidth}
                            isFirstColumnFixed={isFirstColumnFixed}
                            containerWidth={containerWidth}
                            viewPortColumns={viewPortColumns}
                            metadataConfig={metadataConfig}
                            renderer={renderer}
                            enableResize={enableResize}
                            columnWidth={columnWidths[headerItem.value]}
                            isLastColumn={isLastEnabledColumn}
                            scaleFactor={scaleFactor}
                            enableFluidWidthByDefault={enableFluidWidthByDefault}
                            defaultMinWidthForAllColumns={defaultMinWidthForAllColumns}
                            deafaultMaxWidthForAllColumns={deafaultMaxWidthForAllColumns}
                        />
                    );
                })}
                {enableResize ? <th className={styles["invisible-cell"]} aria-hidden="true" tabIndex={-1} data-testid="el-test-tbl-hdr-rsz-ph"/> : null}
                {rowHoverAction?.enable && (
                    <th 
                        key="action-header" 
                        className="table-head row-action-header"
                        style={{ width: 0, minWidth: 0, maxWidth: 0, padding: 0, border: 'none' }}
                        data-testid="el-test-tbl-hdr-act-cell"
                    />
                )}
            </tr>
        </thead>
    );
};

export default TableHeader;