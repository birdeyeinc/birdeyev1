import React, { memo, useCallback, useState, useRef, useMemo, useEffect } from 'react';
import type { ColumnCustomizerProps, ColumnItemProps, SideDrawerHandle, SideDrawerProps } from '../types';
import SideDrawer from 'atoms/SideDrawer';
const TypedSideDrawer = SideDrawer as React.ForwardRefExoticComponent<SideDrawerProps & React.RefAttributes<SideDrawerHandle>>;
import { useTableGridColumns } from '../context/TableGridColumnContext';
import styles from './columnCustomizer.module.scss';
import Button from 'atoms/Button';

// ============================================================================
// Drag Handle — 6-dot grid icon (right side per Figma)
// ============================================================================

const DragDots = memo(function DragDots() {
    return (
        <i className={'icon_phoenix-drag'} />
    );
});

let checkboxIdCounter = 0;
const getNextCheckboxId = (prefix: string): string => {
    checkboxIdCounter += 1;
    return `${prefix}-${checkboxIdCounter}`;
};

// ============================================================================
// Column Item — memoized row
// ============================================================================

const ColumnItem = memo(function ColumnItem({
    column,
    index,
    onToggleVisibility,
    onDragStart,
    onDragEnter,
    onDragLeave,
    onDragEnd,
    onDrop,
    isDragging,
    dragOverIndex,
    dragOverHalf,
    isLocked,
    isVisible,
    enableReorder,
    enableVisibilityToggle,
}: ColumnItemProps) {
    const checkboxIdRef = useRef(getNextCheckboxId('column-customizer-item-checkbox'));
    const checkboxId = checkboxIdRef.current;

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        if (isLocked || !enableReorder) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
        onDragStart(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        if (!enableReorder || isLocked) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const rect = e.currentTarget.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        onDragEnter(index, e.clientY < midY ? 'top' : 'bottom');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (!enableReorder || isLocked) return;
        e.preventDefault();
        onDrop(index);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (!enableReorder || isLocked) return;
        // Clear indicator only when pointer leaves this row bounds.
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            onDragLeave(index);
        }
    };

    const handleCheckbox = () => {
        if (isLocked || !enableVisibilityToggle) return;
        onToggleVisibility(column.value, !isVisible);
    };

    const isOver = dragOverIndex === index && !isDragging;
    const overClass = isOver
        ? (dragOverHalf === 'top' ? styles['drag-over-top'] : styles['drag-over-bottom'])
        : '';

    return (
        <div
            className={`
                ${styles['column-item']}
                ${isDragging ? styles['dragging'] : ''}
                ${overClass}
                ${isLocked ? styles['locked'] : ''}
                ${isVisible ? styles['checked'] : ''}
            `.trim().replace(/\s+/g, ' ')}
            draggable={enableReorder && !isLocked}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={onDragEnd}
        >
            {/* Checkbox */}
            <div className={styles['checkbox-wrapper']}>
                <input
                    id={checkboxId}
                    type="checkbox"
                    className={styles['checkbox']}
                    checked={isVisible}
                    onChange={handleCheckbox}
                    disabled={isLocked || !enableVisibilityToggle}
                    aria-label={`${isVisible ? 'Hide' : 'Show'} ${column.label}`}
                />
                <span className={styles['box']}>
                    <span className={styles['tick']}></span>
                </span>
            </div>

            {/* Column name */}
            <label htmlFor={checkboxId} className={styles['item-label']} title={column.label}>
                {column.label}
            </label>

            {/* Drag handle on right (only for non-locked) */}
            {enableReorder && !isLocked && (
                <div className={styles['drag-handle']}>
                    <DragDots />
                </div>
            )}
        </div>
    );
});

// ============================================================================
// ColumnCustomizer — Side drawer with two apply modes
// ============================================================================

const ColumnCustomizer = memo(function ColumnCustomizer({
    isOpen = false,
    onClose,
    onSave,
    title = 'Customize table view',
    subtitle = 'Select the columns to show and order them by priority',
    drawerWidth = 'auto',
    showSearch = true,
    showResetButton = true,
    resetButtonText = 'Restore defaults',
    saveButtonText = 'Save',
    applyMode = 'onChange',
    onColumnChange,
}: ColumnCustomizerProps) {
    const {
        headerData,
        columnVisibility: ctxVisibility,
        columnOrder: ctxOrder,
        setColumnVisibility,
        setMultipleColumnVisibility,
        setColumnOrder,
        applyBulkConfig,
        resetConfig,
        isColumnLocked,
        enableReorder,
        enableVisibilityToggle,
        isModified,
    } = useTableGridColumns();

    // Local draft state for onSave mode
    const [draftVisibility, setDraftVisibility] = useState<Record<string, boolean> | null>(null);
    const [draftOrder, setDraftOrder] = useState<string[] | null>(null);
    const isDraftMode = applyMode === 'onSave';

    // Drag state
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [dragOverHalf, setDragOverHalf] = useState<'top' | 'bottom' | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const selectAllCheckboxIdRef = useRef(getNextCheckboxId('column-customizer-select-all-checkbox'));
    const selectAllCheckboxId = selectAllCheckboxIdRef.current;
    const selectAllCheckboxRef = useRef<HTMLInputElement | null>(null);
    const sideDrawerRef = useRef<SideDrawerHandle | null>(null);
    const isDrawerVisibleRef = useRef(false);

    useEffect(() => {
        if (isOpen !== isDrawerVisibleRef.current) {
            sideDrawerRef.current?.setOpenComp?.(isOpen);
            isDrawerVisibleRef.current = isOpen;
        }
    }, [isOpen]);

    const prevOpenRef = useRef(false);
    // Initialize draft only when drawer transitions closed -> open.
    useEffect(() => {
        const justOpened = isOpen && !prevOpenRef.current;
        const justClosed = !isOpen && prevOpenRef.current;

        if (isDraftMode && justOpened && !draftVisibility && !draftOrder) {
            setDraftVisibility({ ...ctxVisibility });
            setDraftOrder(ctxOrder ? [...ctxOrder] : null);
        }

        if (justClosed) {
            if (isDraftMode) {
                setDraftVisibility(null);
                setDraftOrder(null);
            }
            setSearchTerm('');
            setDraggingIndex(null);
            setDragOverIndex(null);
            setDragOverHalf(null);
        }

        prevOpenRef.current = isOpen;
    }, [isDraftMode, isOpen, ctxVisibility, ctxOrder, draftVisibility, draftOrder]);

    // Effective visibility/order (draft or context)
    const effectiveVisibility = isDraftMode && draftVisibility ? draftVisibility : ctxVisibility;
    const effectiveOrder = isDraftMode && draftOrder !== undefined ? draftOrder : ctxOrder;

    const isColumnVisible = useCallback((key: string) => {
        return effectiveVisibility?.[key] !== false;
    }, [effectiveVisibility]);

    // Ordered column list
    const orderedColumns = useMemo(() => {
        if (!headerData || headerData.length === 0) return [];

        const cols = [...headerData];
        if (effectiveOrder && effectiveOrder.length > 0) {
            const orderMap = new Map(effectiveOrder.map((key, idx) => [key, idx]));
            cols.sort((a, b) => {
                const orderA = orderMap.get(a.value) ?? Infinity;
                const orderB = orderMap.get(b.value) ?? Infinity;
                return orderA - orderB;
            });
        } else {
            cols.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }

        // Locked columns float to top
        const locked = cols.filter(c => isColumnLocked(c.value));
        const unlocked = cols.filter(c => !isColumnLocked(c.value));
        return [...locked, ...unlocked];
    }, [headerData, effectiveOrder, isColumnLocked]);

    // Filtered by search
    const filteredColumns = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return orderedColumns;
        return orderedColumns.filter(col => col.label.toLowerCase().includes(search));
    }, [orderedColumns, searchTerm]);

    const nonLockedFilteredColumns = useMemo(() => {
        return filteredColumns.filter(col => !isColumnLocked(col.value));
    }, [filteredColumns, isColumnLocked]);

    const allNonLockedSelected = useMemo(() => {
        if (nonLockedFilteredColumns.length === 0) return false;
        return nonLockedFilteredColumns.every(col => isColumnVisible(col.value));
    }, [nonLockedFilteredColumns, isColumnVisible]);

    const someNonLockedSelected = useMemo(() => {
        return nonLockedFilteredColumns.some(col => isColumnVisible(col.value));
    }, [nonLockedFilteredColumns, isColumnVisible]);

    const isSelectAllIndeterminate = !allNonLockedSelected && someNonLockedSelected;

    const setSelectAllCheckboxNode = useCallback((node: HTMLInputElement | null) => {
        selectAllCheckboxRef.current = node;
        if (!node) return;
        node.indeterminate = isSelectAllIndeterminate;
    }, [isSelectAllIndeterminate]);

    useEffect(() => {
        if (!selectAllCheckboxRef.current) return;
        selectAllCheckboxRef.current.indeterminate = isSelectAllIndeterminate;
    }, [isSelectAllIndeterminate]);

    // Current full order as key array
    const currentOrder = useMemo(() => {
        return orderedColumns.map(col => col.value);
    }, [orderedColumns]);

    // Track if draft has changes vs context
    // Sparse visibility: missing key = visible (true), present with false = hidden
    const hasDraftChanges = useMemo(() => {
        if (!isDraftMode) return false;
        if (!draftVisibility) return false;
        // Check both directions: draft keys that differ from ctx, and ctx keys missing from draft
        const allKeys = new Set([...Object.keys(draftVisibility), ...Object.keys(ctxVisibility)]);
        const visChanged = [...allKeys].some(k => (draftVisibility[k] !== false) !== (ctxVisibility[k] !== false));
        const orderChanged = JSON.stringify(draftOrder) !== JSON.stringify(ctxOrder);
        return visChanged || orderChanged;
    }, [isDraftMode, draftVisibility, draftOrder, ctxVisibility, ctxOrder]);

    // === Drag handlers ===
    const handleDragStart = useCallback((index: number) => {
        setDraggingIndex(index);
    }, []);

    const handleDragEnter = useCallback((index: number, half: 'top' | 'bottom') => {
        setDragOverIndex(index);
        setDragOverHalf(half);
    }, []);

    const handleDragLeave = useCallback((index: number) => {
        setDragOverIndex((prev) => {
            if (prev === index) {
                setDragOverHalf(null);
                return null;
            }
            return prev;
        });
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggingIndex(null);
        setDragOverIndex(null);
        setDragOverHalf(null);
    }, []);

    const handleDrop = useCallback((targetIndex: number) => {
        if (draggingIndex === null || draggingIndex === targetIndex) {
            handleDragEnd();
            return;
        }

        // Work with non-locked columns only from the filtered view
        const fromCol = nonLockedFilteredColumns[draggingIndex]?.value;
        const toCol = nonLockedFilteredColumns[targetIndex]?.value;
        if (!fromCol || !toCol) { handleDragEnd(); return; }

        const fullFromIdx = currentOrder.indexOf(fromCol);
        const fullToIdx = currentOrder.indexOf(toCol);
        if (fullFromIdx === -1 || fullToIdx === -1) { handleDragEnd(); return; }

        const rawInsertionIdx = dragOverHalf === 'bottom' ? fullToIdx + 1 : fullToIdx;
        const insertionIdx = fullFromIdx < rawInsertionIdx ? rawInsertionIdx - 1 : rawInsertionIdx;

        const newOrder = [...currentOrder];
        const [moved] = newOrder.splice(fullFromIdx, 1);
        newOrder.splice(insertionIdx, 0, moved);

        if (isDraftMode) {
            setDraftOrder(newOrder);
        } else {
            setColumnOrder(newOrder);
            onColumnChange?.({ type: 'reorder', fromIndex: fullFromIdx, toIndex: insertionIdx });
        }

        handleDragEnd();
    }, [draggingIndex, nonLockedFilteredColumns, currentOrder, isDraftMode, dragOverHalf, setColumnOrder, onColumnChange, handleDragEnd]);

    // === Visibility ===
    const handleToggleVisibility = useCallback((columnKey: string, visible: boolean) => {
        if (isDraftMode) {
            // Sparse draft: only store false, delete when visible
            setDraftVisibility(prev => {
                const next = { ...(prev || {}) };
                if (visible === false) {
                    next[columnKey] = false;
                } else {
                    delete next[columnKey];
                }
                return next;
            });
        } else {
            setColumnVisibility(columnKey, visible);
            onColumnChange?.({ type: 'visibility', columnKey, visible });
        }
    }, [isDraftMode, setColumnVisibility, onColumnChange]);

    const handleToggleAllVisibility = useCallback(() => {
        if (!enableVisibilityToggle || nonLockedFilteredColumns.length === 0) return;

        const nextVisible = !allNonLockedSelected;
        const nonLockedKeys = nonLockedFilteredColumns.map(col => col.value);

        if (isDraftMode) {
            // Sparse draft: only store false, delete when visible
            setDraftVisibility((prev) => {
                const next = { ...(prev || {}) };
                nonLockedKeys.forEach((key) => {
                    if (nextVisible === false) {
                        next[key] = false;
                    } else {
                        delete next[key];
                    }
                });
                return next;
            });
        } else {
            const visibilityMap = nonLockedKeys.reduce<Record<string, boolean>>((acc, key) => {
                acc[key] = nextVisible;
                return acc;
            }, {});
            setMultipleColumnVisibility(visibilityMap);
            onColumnChange?.({ type: 'visibility-all', visible: nextVisible, columnKeys: nonLockedKeys });
        }
    }, [enableVisibilityToggle, nonLockedFilteredColumns, allNonLockedSelected, isDraftMode, setMultipleColumnVisibility, onColumnChange]);

    // === Reset ===
    const handleReset = useCallback(() => {
        if (isDraftMode) {
            // Reset draft to context defaults
            setDraftVisibility({ ...ctxVisibility });
            setDraftOrder(ctxOrder ? [...ctxOrder] : null);
        } else {
            resetConfig();
            onColumnChange?.({ type: 'reset' });
        }
        setSearchTerm('');
    }, [isDraftMode, resetConfig, ctxVisibility, ctxOrder, onColumnChange]);

    // === Save (onSave mode) ===
    const handleSave = useCallback(() => {
        if (!isDraftMode) return;

        // Collect only changed visibility entries (sparse-aware)
        const visibilityChanges: Record<string, boolean> = {};
        if (draftVisibility) {
            // Check all keys from both draft and ctx to catch both hide and unhide changes
            const allKeys = new Set([...Object.keys(draftVisibility), ...Object.keys(ctxVisibility)]);
            allKeys.forEach((key) => {
                const wasVisible = ctxVisibility[key] !== false;
                const willBeVisible = draftVisibility[key] !== false;
                if (wasVisible !== willBeVisible) {
                    visibilityChanges[key] = willBeVisible;
                }
            });
        }
        const hasVisibilityChanges = Object.keys(visibilityChanges).length > 0;

        // Check if order changed
        const orderChanged = draftOrder && JSON.stringify(draftOrder) !== JSON.stringify(ctxOrder);

        // Apply all changes atomically via single bulk dispatch/callback
        if (hasVisibilityChanges || orderChanged) {
            applyBulkConfig({
                ...(hasVisibilityChanges ? { columnVisibility: visibilityChanges } : {}),
                ...(orderChanged ? { columnOrder: draftOrder } : {}),
            });
        }

        setDraftVisibility(null);
        setDraftOrder(null);
        onSave?.({ visibility: draftVisibility, order: draftOrder });
        onColumnChange?.({ type: 'save' });
        onClose?.();
    }, [isDraftMode, draftVisibility, draftOrder, ctxVisibility, ctxOrder, applyBulkConfig, onSave, onColumnChange, onClose]);

    // === Search ===
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
        searchInputRef.current?.focus();
    }, []);

    // === Close ===
    const handleClose = useCallback(() => {
        setSearchTerm('');
        setDraggingIndex(null);
        setDragOverIndex(null);
        setDragOverHalf(null);
        if (isDrawerVisibleRef.current) {
            sideDrawerRef.current?.setOpenComp?.(false);
            isDrawerVisibleRef.current = false;
        }
        onClose?.();
    }, [onClose]);

    const handleSaveClick = useCallback(() => {
        if (isDraftMode) {
            handleSave();
            return;
        }
        onSave?.({ visibility: ctxVisibility, order: ctxOrder });
        onColumnChange?.({ type: 'save' });
        handleClose();
    }, [isDraftMode, handleSave, onSave, ctxVisibility, ctxOrder, onColumnChange, handleClose]);

    return (
        <TypedSideDrawer ref={sideDrawerRef} containerClassName={styles['side-drawer-container']}>
            <div className={styles['drawer-shell']} style={{ width: drawerWidth }}>
                <div className={styles['drawer-header']}>
                    <button type="button" className={styles['back-btn']} onClick={handleClose}>
                        <i className=" icon_phoenix-arrow-left" />
                    </button>
                    <h2 className={styles['drawer-title']}>{title}</h2>
                    <div className={styles['header-actions']}>
                        {showResetButton && (
                            <Button
                                type="button"
                                theme="link"
                                className={styles['restore-btn']}
                                onClick={handleReset}
                                disabled={isDraftMode ? !hasDraftChanges : !isModified}
                            >
                                {resetButtonText}
                            </Button>
                        )}
                        <Button
                            type="button"
                            theme="primary"
                            className={styles['save-btn']}
                            onClick={handleSaveClick}
                            isAeroDesign
                            disabled={isDraftMode ? !hasDraftChanges : false}
                        >
                            {saveButtonText}
                        </Button>
                    </div>
                </div>

                <div className={styles['customizer-body']}>
                {/* Subtitle */}
                {subtitle && (
                    <div className={styles['subtitle']}>{subtitle}</div>
                )}

                {/* Search */}
                {showSearch && (
                    <div className={styles['search-wrapper']}>
                        <div className={styles['search-field']}>
                            <i className={`icon_phoenix-new-search-icon ${styles['search-icon']}`} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                className={styles['search-input']}
                                placeholder="Search columns"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            {searchTerm && (
                                <span
                                    className={styles['clear-icon']}
                                    onClick={handleClearSearch}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && handleClearSearch()}
                                >
                                    <i className="icon_phoenix-enclose" />
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Column list — single flat list, locked items float to top */}
                <div className={styles['column-list']}>
                    {orderedColumns.length > 0 && filteredColumns.length > 0 && (
                        <div
                            className={`
                                ${styles['column-item']}
                                ${styles['select-all-row']}
                                ${allNonLockedSelected ? styles['checked'] : ''}
                            `.trim().replace(/\s+/g, ' ')}
                        >
                            <div className={styles['checkbox-wrapper']}>
                                <input
                                    ref={setSelectAllCheckboxNode}
                                    id={selectAllCheckboxId}
                                    type="checkbox"
                                    className={`
                                        ${styles['checkbox']}
                                        ${isSelectAllIndeterminate ? styles['checkbox-indeterminate'] : ''}
                                        ${allNonLockedSelected ? styles['checkbox-checked'] : ''}
                                    `.trim().replace(/\s+/g, ' ')}
                                    checked={allNonLockedSelected}
                                    onChange={handleToggleAllVisibility}
                                    disabled={!enableVisibilityToggle || nonLockedFilteredColumns.length === 0}
                                    aria-label="Select all columns"
                                />
                                <span className={styles['box']}>
                                     <span className={styles['tick']}></span>

                                </span>
                            </div>

                            <label htmlFor={selectAllCheckboxId} className={styles['item-label']} title="Select all">
                                Select all
                            </label>
                        </div>
                    )}

                    {searchTerm && filteredColumns.length === 0 && (
                        <div className={styles['no-results']}>No columns match &quot;{searchTerm}&quot;</div>
                    )}

                    {filteredColumns.map((column) => {
                        const locked = isColumnLocked(column.value);
                        // For non-locked, compute index in non-locked array (for drag)
                        const nlIdx = locked ? -1 : nonLockedFilteredColumns.indexOf(column);

                        return (
                            <ColumnItem
                                key={column.value}
                                column={column}
                                index={nlIdx}
                                onToggleVisibility={handleToggleVisibility}
                                onDragStart={handleDragStart}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragEnd={handleDragEnd}
                                onDrop={handleDrop}
                                isDragging={!locked && draggingIndex === nlIdx}
                                dragOverIndex={!locked ? dragOverIndex : null}
                                dragOverHalf={dragOverHalf}
                                isLocked={locked}
                                isVisible={isColumnVisible(column.value)}
                                enableReorder={enableReorder && !locked}
                                enableVisibilityToggle={enableVisibilityToggle}
                            />
                        );
                    })}
                </div>
            </div>
            </div>
        </TypedSideDrawer>
    );
});

export default ColumnCustomizer;
