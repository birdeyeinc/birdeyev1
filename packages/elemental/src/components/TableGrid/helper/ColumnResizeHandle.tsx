import React, { memo, useCallback, useRef, useEffect } from 'react';
import { useTableGridColumns } from '../context/TableGridColumnContext';
import styles from '../table.module.scss';
import type { ColumnResizeHandleProps } from '../types';

function measureNaturalWidth(element: Element, extraPadding: number = 0): number {
    if (!element) return 0;

    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.style.pointerEvents = 'none';
    clone.style.width = 'max-content';
    clone.style.maxWidth = 'none';
    clone.style.minWidth = '0';
    clone.style.left = '-99999px';
    clone.style.top = '0';

    document.body.appendChild(clone);
    const width = clone.getBoundingClientRect().width;
    document.body.removeChild(clone);

    return Math.ceil(width + extraPadding);
}

function applyTransientColumnWidth(table: Element | null, columnIndex: number, width: number): void {
    if (!table || columnIndex < 0) return;

    const headerCell = table.querySelector(`thead th:nth-child(${columnIndex + 1})`) as HTMLElement | null;
    if (headerCell) {
        headerCell.style.width = `${width}px`;
    }

    // const bodyRows = table.querySelectorAll('tbody tr');
    // bodyRows.forEach((row) => {
    //     const cell = row.children[columnIndex];
    //     if (!cell) return;
    //     cell.style.width = `${width}px`;
    //     cell.style.minWidth = `${width}px`;
    //     cell.style.maxWidth = `${width}px`;
    // });
}

/**
 * Column resize handle component
 * Renders a thin vertical line between columns that can be dragged to resize
 */
const ColumnResizeHandle = memo(function ColumnResizeHandle({ 
    columnKey, 
    columnRef,
    onResizeStart,
    onResize,
    onResizeEnd,
}: ColumnResizeHandleProps) {
    const {
        setColumnWidth,
        setResizingColumn,
        finalizeResize,
        getColumnWidth,
        getColumnResizeBounds,
        resizingColumn,
        enableResize,
        resizeMode,
    } = useTableGridColumns();

    const handleRef = useRef<HTMLDivElement>(null);
    const listenersRef = useRef<{ mouseMove: ((e: MouseEvent) => void) | null; mouseUp: ((e: MouseEvent) => void) | null }>({ mouseMove: null, mouseUp: null });
    const dragStateRef = useRef<{
        isDragging: boolean;
        startX: number;
        startWidth: number;
        currentWidth: number;
        table: Element | null;
        columnIndex: number;
    }>({
        isDragging: false,
        startX: 0,
        startWidth: 0,
        currentWidth: 0,
        table: null,
        columnIndex: -1,
    });

    const isResizing = resizingColumn === columnKey;

    // ========================================================================
    // DRAG HANDLERS
    // ========================================================================

    const detachListeners = useCallback(() => {
        const { mouseMove, mouseUp } = listenersRef.current;
        if (mouseMove) {
            document.removeEventListener('mousemove', mouseMove);
        }
        if (mouseUp) {
            document.removeEventListener('mouseup', mouseUp);
        }
        listenersRef.current = { mouseMove: null, mouseUp: null };
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!enableResize) return;

        e.preventDefault();
        e.stopPropagation();

        // Get current column width
        const currentEl = columnRef?.current as HTMLElement | null | undefined;
        const currentWidth = currentEl?.offsetWidth ?? getColumnWidth(columnKey) ?? 100;
        const { min, max } = getColumnResizeBounds(columnKey);

        dragStateRef.current = {
            isDragging: true,
            startX: e.clientX,
            startWidth: currentWidth,
            currentWidth,
            table: currentEl?.closest('table') || null,
            columnIndex: currentEl?.parentElement
                ? Array.from(currentEl.parentElement.children).indexOf(currentEl)
                : -1,
        };

        setResizingColumn(columnKey);
        onResizeStart?.(columnKey, currentWidth);

        const mouseMoveHandler = (event: MouseEvent) => {
            if (!dragStateRef.current.isDragging) return;

            const { startX, startWidth } = dragStateRef.current;
            const diff = event.clientX - startX;

            if(diff === 0) return; // No movement, so skip

            let newWidth = startWidth + diff;

            newWidth = Math.max(min, Math.min(max, newWidth));
            dragStateRef.current.currentWidth = newWidth;

            requestAnimationFrame(() => {
                if (resizeMode === 'onChange') {
                    setColumnWidth(columnKey, newWidth);
                } else {
                    applyTransientColumnWidth(dragStateRef.current.table, dragStateRef.current.columnIndex, newWidth);
                }
                onResize?.(columnKey, newWidth);
            });
        };

        const mouseUpHandler = () => {
            if (!dragStateRef.current.isDragging) return;

            dragStateRef.current.isDragging = false;
            detachListeners();

            document.body.style.userSelect = "";
            document.body.style.cursor = "";

            const finalWidth = dragStateRef.current.currentWidth;
            const startWidth = dragStateRef.current.startWidth;

            if (startWidth === finalWidth) {
                setResizingColumn(null);
                return;
            } // No change in width, so skip finalization

            if (resizeMode === "onEnd") {
                setColumnWidth(columnKey, finalWidth);
            }

            finalizeResize(columnKey, finalWidth);
            onResizeEnd?.(columnKey, finalWidth || getColumnWidth(columnKey) || 0);
        };

        listenersRef.current = { mouseMove: mouseMoveHandler, mouseUp: mouseUpHandler };

        // Add global listeners
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        // Prevent text selection
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
    }, [
        enableResize,
        columnKey,
        columnRef,
        getColumnWidth,
        getColumnResizeBounds,
        setResizingColumn,
        onResizeStart,
        setColumnWidth,
        onResize,
        resizeMode,
        detachListeners,
        finalizeResize,
        onResizeEnd,
    ]);

    // ========================================================================
    // DOUBLE-CLICK AUTO-FIT
    // ========================================================================

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        if (!enableResize) return;

        e.preventDefault();
        e.stopPropagation();

        // Find table and measure content
        const columnEl = columnRef?.current;
        if (!columnEl) return;

        const table = columnEl.closest('table');
        if (!table) return;

        // Find column index
        const thElements = table.querySelectorAll('thead th');
        let columnIndex = -1;
        thElements.forEach((th, idx) => {
            if (th === columnEl || th.contains(columnEl)) {
                columnIndex = idx;
            }
        });

        if (columnIndex === -1) return;

        const { min, max } = getColumnResizeBounds(columnKey);

        let maxContentWidth = 0;

        // Measure header content (natural width, independent of current cell width)
        const headerCell = thElements[columnIndex];
        if (headerCell) {
            const headerContent = headerCell.querySelector('.label-text');
            if (headerContent) {
                maxContentWidth = Math.max(maxContentWidth, measureNaturalWidth(headerContent, 24));
            } else {
                maxContentWidth = Math.max(maxContentWidth, measureNaturalWidth(headerCell, 16));
            }
        }

        // Measure body cells (natural width)
        // const bodyRows = table.querySelectorAll('tbody tr');
        // bodyRows.forEach((row) => {
        //     const cell = row.children[columnIndex];
        //     if (cell) {
        //         const contentWrapper = cell.querySelector('.column-wrap') || 
        //                                cell.querySelector('.no-cell-renderer') || 
        //                                cell;
        //         maxContentWidth = Math.max(maxContentWidth, measureNaturalWidth(contentWrapper, 16));
        //     }
        // });

        // Clamp and apply
        const autoFitWidth = Math.max(
            min,
            Math.min(max, maxContentWidth)
        );

        setResizingColumn(columnKey);
        setColumnWidth(columnKey, autoFitWidth);
        
        // Finalize after a brief delay
        setTimeout(() => {
            finalizeResize(columnKey, autoFitWidth);
        }, 0);
    }, [enableResize, columnKey, columnRef, getColumnResizeBounds, setColumnWidth, setResizingColumn, finalizeResize]);

    // ========================================================================
    // CLEANUP
    // ========================================================================

    useEffect(() => {
        return () => {
            detachListeners();
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [detachListeners]);

    // ========================================================================
    // RENDER
    // ========================================================================

    if (!enableResize) return null;

    return (
        <div
            ref={handleRef}
            className={`table-column-resize-handle ${styles["table-column-resizer"]} ${isResizing ? styles['resizing'] : ''}`}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            role="separator"
            aria-orientation="vertical"
            aria-label={`Resize column ${columnKey}`}
        />
    );
});

export default ColumnResizeHandle;
