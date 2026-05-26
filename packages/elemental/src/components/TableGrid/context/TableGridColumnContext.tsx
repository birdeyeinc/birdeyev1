// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { createContext, useContext, useCallback, useMemo, useReducer, useRef, useEffect, useState } from 'react';
import { resolveColumnBounds } from '../utils/columnWidthUtils';
import type { HeaderData, TableGridColumnContextValue, TableGridColumnProviderProps, ColumnConfig, ResolvedConfig, GraphQLFetcher, PersistenceConfig } from '../types';
import { usePersistedColumnConfig } from './usePersistedColumnConfig';

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_MIN_COLUMN_WIDTH = 50;
const DEFAULT_MAX_COLUMN_WIDTH = 800;

const getDefaultVisibility = (headerData: HeaderData[] = []): Record<string, boolean> => {
    const defaultVisibility: Record<string, boolean> = {};
    headerData.forEach((col) => {
        // Sparse storage: only store hidden columns (enabled === false)
        // Missing key = visible (default)
        if (col.enabled === false) {
            defaultVisibility[col.value] = false;
        }
    });
    return defaultVisibility;
};

const getLockedColumnsFromHeaderData = (headerData: HeaderData[] = []): string[] => {
    return headerData.filter((col) => col.locked === true).map((col) => col.value);
};

const resolveInitialConfig = (headerData: HeaderData[] = [], initialConfig: Partial<ColumnConfig> = {}): ResolvedConfig => {
    const defaultVisibility = getDefaultVisibility(headerData);
    const headerLocked = getLockedColumnsFromHeaderData(headerData);

    // Merge visibility and enforce sparse: only keep false entries
    const mergedVisibility: Record<string, boolean> = {};
    const combinedVisibility = { ...defaultVisibility, ...(initialConfig.columnVisibility || {}) };
    for (const [key, visible] of Object.entries(combinedVisibility)) {
        if (visible === false) {
            mergedVisibility[key] = false;
        }
    }

    return {
        columnWidths: { ...(initialConfig.columnWidths || {}) },
        columnVisibility: mergedVisibility,
        columnOrder: initialConfig.columnOrder ? [...initialConfig.columnOrder] : null,
        lockedColumns: new Set([...headerLocked, ...(initialConfig.lockedColumns || [])]),
    };
};

// Change types for onColumnConfigChange callback
export const COLUMN_CHANGE_TYPES = {
    RESIZE: 'resize',
    REORDER: 'reorder',
    VISIBILITY: 'visibility',
    BULK: 'bulk',
    RESET: 'reset',
    INIT: 'init',
};

// Action types for reducer
const ACTION_TYPES = {
    SET_COLUMN_WIDTH: 'SET_COLUMN_WIDTH',
    SET_COLUMN_VISIBILITY: 'SET_COLUMN_VISIBILITY',
    SET_MULTIPLE_COLUMN_VISIBILITY: 'SET_MULTIPLE_COLUMN_VISIBILITY',
    SET_COLUMN_ORDER: 'SET_COLUMN_ORDER',
    REORDER_COLUMNS: 'REORDER_COLUMNS',
    APPLY_BULK_CONFIG: 'APPLY_BULK_CONFIG',
    RESET_CONFIG: 'RESET_CONFIG',
    INIT_COLUMNS: 'INIT_COLUMNS',
    UPDATE_HEADER_DATA: 'UPDATE_HEADER_DATA',
    SET_RESIZING_COLUMN: 'SET_RESIZING_COLUMN',
} as const;

// ============================================================================
// REDUCER
// ============================================================================

interface ColumnState {
    columnWidths: Record<string, number>;
    columnVisibility: Record<string, boolean>;
    columnOrder: string[] | null;
    lockedColumns: Set<string>;
    resizingColumn: string | null;
    headerData: HeaderData[];
    initialConfigSnapshot: {
        columnWidths: Record<string, number>;
        columnVisibility: Record<string, boolean>;
        columnOrder: string[] | null;
        lockedColumns: string[];
    } | null;
    isModified: boolean;
}

type ColumnAction =
    | { type: typeof ACTION_TYPES.INIT_COLUMNS; payload: { headerData: HeaderData[]; initialConfig?: Partial<ColumnConfig> } }
    | { type: typeof ACTION_TYPES.SET_COLUMN_WIDTH; payload: { columnKey: string; width: number } }
    | { type: typeof ACTION_TYPES.SET_COLUMN_VISIBILITY; payload: { columnKey: string; visible: boolean } }
    | { type: typeof ACTION_TYPES.SET_MULTIPLE_COLUMN_VISIBILITY; payload: { visibilityMap: Record<string, boolean> } }
    | { type: typeof ACTION_TYPES.REORDER_COLUMNS; payload: { fromIndex: number; toIndex: number; currentOrder: string[] } }
    | { type: typeof ACTION_TYPES.SET_COLUMN_ORDER; payload: { columnOrder: string[] | null } }
    | { type: typeof ACTION_TYPES.APPLY_BULK_CONFIG; payload: { columnWidths?: Record<string, number>; columnVisibility?: Record<string, boolean>; columnOrder?: string[] | null; lockedColumns?: string[] } }
    | { type: typeof ACTION_TYPES.UPDATE_HEADER_DATA; payload: { headerData: HeaderData[] } }
    | { type: typeof ACTION_TYPES.SET_RESIZING_COLUMN; payload: { columnKey: string | null } }
    | { type: typeof ACTION_TYPES.RESET_CONFIG };

const createInitialState = (): ColumnState => ({
    // Column widths: { [columnKey]: number }
    columnWidths: {},
    // Column visibility: { [columnKey]: boolean }
    columnVisibility: {},
    // Column order: [columnKey, columnKey, ...] - null means use headerData order
    columnOrder: null,
    // Locked columns that cannot be reordered/hidden: Set<columnKey>
    lockedColumns: new Set(),
    // Currently resizing column key (for visual feedback)
    resizingColumn: null,
    // Original headerData for reference
    headerData: [],
    // Snapshot of resolved initial config used for reset
    initialConfigSnapshot: null,
    // Flag to track if config has been modified from initial
    isModified: false,
});

function columnReducer(state: ColumnState, action: ColumnAction): ColumnState {
    switch (action.type) {
        case ACTION_TYPES.INIT_COLUMNS: {
            const { headerData, initialConfig = {} } = action.payload;
            const resolvedInitialConfig = resolveInitialConfig(headerData, initialConfig);

            return {
                ...state,
                headerData,
                columnWidths: { ...resolvedInitialConfig.columnWidths },
                columnVisibility: { ...resolvedInitialConfig.columnVisibility },
                columnOrder: resolvedInitialConfig.columnOrder ? [...resolvedInitialConfig.columnOrder] : null,
                lockedColumns: new Set(resolvedInitialConfig.lockedColumns),
                initialConfigSnapshot: {
                    columnWidths: { ...resolvedInitialConfig.columnWidths },
                    columnVisibility: { ...resolvedInitialConfig.columnVisibility },
                    columnOrder: resolvedInitialConfig.columnOrder ? [...resolvedInitialConfig.columnOrder] : null,
                    lockedColumns: Array.from(resolvedInitialConfig.lockedColumns),
                },
                isModified: false,
            };
        }

        case ACTION_TYPES.UPDATE_HEADER_DATA: {
            const { headerData } = action.payload;
            const validKeys = new Set(headerData.map(h => h.value));
            const headerLocked = getLockedColumnsFromHeaderData(headerData);

            // Preserve existing user state, remove stale column keys
            const cleanedWidths: Record<string, number> = {};
            for (const [key, width] of Object.entries(state.columnWidths)) {
                if (validKeys.has(key)) cleanedWidths[key] = width;
            }

            const cleanedVisibility: Record<string, boolean> = {};
            for (const [key, visible] of Object.entries(state.columnVisibility)) {
                if (validKeys.has(key)) cleanedVisibility[key] = visible;
            }

            const cleanedOrder = state.columnOrder
                ? state.columnOrder.filter(key => validKeys.has(key))
                : null;

            return {
                ...state,
                headerData,
                columnWidths: cleanedWidths,
                columnVisibility: cleanedVisibility,
                columnOrder: cleanedOrder,
                lockedColumns: new Set(
                    [...state.lockedColumns].filter(k => validKeys.has(k)).concat(headerLocked),
                ),
            };
        }

        case ACTION_TYPES.SET_COLUMN_WIDTH: {
            const { columnKey, width } = action.payload;
            return {
                ...state,
                columnWidths: {
                    ...state.columnWidths,
                    [columnKey]: width,
                },
                isModified: true,
            };
        }

        case ACTION_TYPES.SET_COLUMN_VISIBILITY: {
            const { columnKey, visible } = action.payload;
            // Don't allow hiding locked columns
            if (state.lockedColumns.has(columnKey) && !visible) {
                return state;
            }
            // Sparse: only store false, delete key when visible (default)
            const nextVisibility = { ...state.columnVisibility };
            if (visible === false) {
                nextVisibility[columnKey] = false;
            } else {
                delete nextVisibility[columnKey];
            }
            return {
                ...state,
                columnVisibility: nextVisibility,
                isModified: true,
            };
        }

        case ACTION_TYPES.SET_MULTIPLE_COLUMN_VISIBILITY: {
            const { visibilityMap } = action.payload;
            const nextVisibility = { ...state.columnVisibility };
            let changed = false;

            Object.entries(visibilityMap || {}).forEach(([columnKey, visible]) => {
                // Don't allow hiding locked columns
                if (state.lockedColumns.has(columnKey) && !visible) {
                    return;
                }
                const wasVisible = nextVisibility[columnKey] !== false;
                const willBeVisible = visible !== false;
                if (wasVisible !== willBeVisible) {
                    // Sparse: store false, delete when visible
                    if (visible === false) {
                        nextVisibility[columnKey] = false;
                    } else {
                        delete nextVisibility[columnKey];
                    }
                    changed = true;
                }
            });

            if (!changed) {
                return state;
            }

            return {
                ...state,
                columnVisibility: nextVisibility,
                isModified: true,
            };
        }

        case ACTION_TYPES.REORDER_COLUMNS: {
            const { fromIndex, toIndex, currentOrder } = action.payload;
            const newOrder = [...currentOrder];
            const [movedColumn] = newOrder.splice(fromIndex, 1);
            
            // Don't allow reordering locked columns
            if (state.lockedColumns.has(movedColumn)) {
                return state;
            }
            
            newOrder.splice(toIndex, 0, movedColumn);
            
            return {
                ...state,
                columnOrder: newOrder,
                isModified: true,
            };
        }

        case ACTION_TYPES.SET_COLUMN_ORDER: {
            const { columnOrder } = action.payload;
            return {
                ...state,
                columnOrder: columnOrder ? [...columnOrder] : null,
                isModified: true,
            };
        }

        case ACTION_TYPES.APPLY_BULK_CONFIG: {
            const { columnWidths, columnVisibility, columnOrder, lockedColumns } = action.payload;

            // Merge widths
            const nextWidths = columnWidths
                ? { ...state.columnWidths, ...columnWidths }
                : state.columnWidths;

            // Merge locked columns
            const nextLocked = lockedColumns
                ? new Set([...state.lockedColumns, ...lockedColumns])
                : state.lockedColumns;

            // Merge visibility — sparse: only store false, delete when visible
            const nextVisibility = columnVisibility
                ? { ...state.columnVisibility }
                : state.columnVisibility;

            if (columnVisibility) {
                for (const [key, visible] of Object.entries(columnVisibility)) {
                    // Enforce locked columns can't be hidden — skip silently
                    if (nextLocked.has(key) && visible === false) continue;

                    if (visible === false) {
                        nextVisibility[key] = false;
                    } else {
                        delete nextVisibility[key];
                    }
                }
            }

            return {
                ...state,
                columnWidths: nextWidths,
                columnVisibility: nextVisibility,
                columnOrder: columnOrder !== undefined
                    ? (columnOrder ? [...columnOrder] : null)
                    : state.columnOrder,
                lockedColumns: nextLocked,
                isModified: true,
            };
        }

        case ACTION_TYPES.SET_RESIZING_COLUMN: {
            return {
                ...state,
                resizingColumn: action.payload.columnKey,
            };
        }

        case ACTION_TYPES.RESET_CONFIG: {
            const { headerData, initialConfigSnapshot } = state;
            const defaultVisibility = getDefaultVisibility(headerData);
            
            return {
                ...state,
                columnWidths: initialConfigSnapshot?.columnWidths ? { ...initialConfigSnapshot.columnWidths } : {},
                columnVisibility: initialConfigSnapshot?.columnVisibility
                    ? { ...initialConfigSnapshot.columnVisibility }
                    : defaultVisibility,
                columnOrder: initialConfigSnapshot?.columnOrder
                    ? [...initialConfigSnapshot.columnOrder]
                    : null,
                lockedColumns: initialConfigSnapshot?.lockedColumns
                    ? new Set(initialConfigSnapshot.lockedColumns)
                    : state.lockedColumns,
                isModified: false,
            };
        }

        default:
            return state;
    }
}

// ============================================================================
// CONTEXT
// ============================================================================

const TableGridColumnContext = createContext<TableGridColumnContextValue | null>(null);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

/**
 * Wraps a Birdeye apiResource (beNodeResource) into a GraphQLFetcher.
 * Handles the `{ data, status }` response shape from apiHelper.js.
 */
function createFetcherFromApiResource(
    apiResource: NonNullable<PersistenceConfig['apiResource']>,
    graphqlEndpoint: string,
): GraphQLFetcher {
    return async ({ query, variables }) => {
        const response = await apiResource.post(
            graphqlEndpoint,
            { query, variables },
            { isPrimaryAPI: false, cancellable: false, topLoader: false, globalErrorHandling: false },
        );
        // apiHelper wraps response as { data: { data: {...}, errors: [...] }, status }
        const body = response.data as { data?: Record<string, unknown>; errors?: Array<{ message: string }> };
        if (body.errors?.length) {
            throw new Error(body.errors[0].message);
        }
        return body.data ?? {};
    };
}

export function TableGridColumnProvider({
    children,
    // Controlled mode props
    columnConfig,
    onColumnConfigChange,
    // Initial config for uncontrolled mode
    initialColumnConfig,
    // Column constraints
    minColumnWidth = DEFAULT_MIN_COLUMN_WIDTH,
    maxColumnWidth = DEFAULT_MAX_COLUMN_WIDTH,
    // Enable/disable features
    enableResize = true,
    resizeMode = 'onEnd',
    enableReorder = true,
    enableVisibilityToggle = true,
    // Persistence config object
    persistence,
}: TableGridColumnProviderProps) {
    const [state, dispatch] = useReducer(columnReducer, null, createInitialState);

    // ── Table ID (set by the Table child via registerTableId) ────────────
    const [tableId, setTableId] = useState('');
    const registerTableId = useCallback((id: string) => {
        setTableId((prev) => (prev === id ? prev : id));
    }, []);

    // Track if we're in controlled mode
    const isControlled = columnConfig !== undefined;

    // ── Resolve fetcher from persistence config ─────────────────────────
    const persistenceEnabled = !!persistence && !isControlled;
    const resolvedFetcher = useMemo<GraphQLFetcher>(() => {
        if (!persistence) return async () => ({});

        // Option 1: consumer provided a fetcher directly
        if (persistence.fetcher) return persistence.fetcher;

        // Option 2: consumer provided an apiResource (Birdeye pattern)
        if (persistence.apiResource && persistence.graphqlEndpoint) {
            return createFetcherFromApiResource(persistence.apiResource, persistence.graphqlEndpoint);
        }

        // Neither provided — return no-op (persistence won't work, but won't crash)
        return async () => ({});
    }, [persistence]);

    // ── Backend persistence ─────────────────────────────────────────────
    const {
        config: persistedConfig,
        isLoading: isPersistenceLoading,
        saveConfig: persistSaveConfig,
        debouncedSaveConfig: persistDebouncedSave,
        persistKeys: resolvedPersistKeys,
    } = usePersistedColumnConfig({
        tableId,
        enabled: persistenceEnabled,
        fetcher: resolvedFetcher,
        headerData: state.headerData,
        onSaveError: persistence?.onError,
        persistKeys: persistence?.persistKeys,
    });
    const persistsWidths = resolvedPersistKeys.includes('columnWidths');

    // Notify parent when persistence loading state changes
    useEffect(() => {
        if (!persistenceEnabled) return;
        persistence?.onLoadingChange?.(isPersistenceLoading);
    }, [isPersistenceLoading, persistenceEnabled, persistence]);

    // Apply persisted config once fetched (only in uncontrolled mode)
    const persistAppliedRef = useRef(false);
    useEffect(() => {
        if (!persistenceEnabled || isPersistenceLoading) return;
        if (persistAppliedRef.current) return;
        if (!persistedConfig) return;

        const hasData = persistedConfig.columnWidths || persistedConfig.columnVisibility || persistedConfig.columnOrder;
        if (!hasData) return;

        persistAppliedRef.current = true;

        // Merge persisted config with initial config
        const mergedConfig = {
            ...(initialColumnConfig || {}),
            ...persistedConfig,
        };

        if (state.headerData.length > 0) {
            dispatch({
                type: ACTION_TYPES.INIT_COLUMNS,
                payload: {
                    headerData: state.headerData,
                    initialConfig: mergedConfig,
                },
            });
        }
    }, [persistenceEnabled, isPersistenceLoading, persistedConfig, initialColumnConfig, state.headerData]);

    // Use controlled config if provided, otherwise use internal state
    const effectiveConfig = isControlled ? {
        columnWidths: columnConfig?.columnWidths || {},
        columnVisibility: columnConfig?.columnVisibility || {},
        columnOrder: columnConfig?.columnOrder || null,
        lockedColumns: new Set(columnConfig?.lockedColumns || []),
    } : state;

    // Refs to track callback dedupe and queued uncontrolled notifications
    const lastChangeRef = useRef<string | null>(null);
    const pendingUncontrolledChangeRef = useRef<{ type: string; columnKey: string | null; widthOverride?: number | null } | null>(null);
    const headerDataRef = useRef<HeaderData[]>([]);

    // ========================================================================
    // NOTIFY CALLBACK
    // ========================================================================
    
    const notifyChange = useCallback((changeType: string, changedColumn: string | null = null, explicitConfig: ColumnConfig | null = null) => {
        const config = explicitConfig || {
            columnWidths: { ...effectiveConfig.columnWidths },
            columnVisibility: { ...effectiveConfig.columnVisibility },
            columnOrder: effectiveConfig.columnOrder ? [...effectiveConfig.columnOrder] : null,
            lockedColumns: Array.from(effectiveConfig.lockedColumns),
        };

        // Avoid duplicate callbacks for the same change
        const changeKey = `${changeType}-${changedColumn}-${JSON.stringify(config)}`;
        if (lastChangeRef.current === changeKey) return;
        lastChangeRef.current = changeKey;

        // Notify consumer callback
        if (onColumnConfigChange) {
            onColumnConfigChange({
                type: changeType,
                columnKey: changedColumn,
                config,
            });
        }

        // Auto-persist to backend (uncontrolled mode only)
        if (persistenceEnabled && changeType !== COLUMN_CHANGE_TYPES.INIT) {
            if (changeType === COLUMN_CHANGE_TYPES.RESIZE) {
                // Skip debounced save if widths aren't in the persist allowlist
                if (persistsWidths) {
                    persistDebouncedSave(config);
                }
            } else {
                persistSaveConfig(config);
            }
        }
    }, [onColumnConfigChange, effectiveConfig, persistenceEnabled, persistDebouncedSave, persistSaveConfig, persistsWidths]);

    // Emit uncontrolled callbacks only after reducer state is committed
    useEffect(() => {
        if (isControlled) return;
        if (!pendingUncontrolledChangeRef.current) return;

        const { type, columnKey, widthOverride } = pendingUncontrolledChangeRef.current;

        const committedConfig = {
            columnWidths: {
                ...state.columnWidths,
                ...(widthOverride != null && columnKey ? { [columnKey]: widthOverride } : {}),
            },
            columnVisibility: { ...state.columnVisibility },
            columnOrder: state.columnOrder ? [...state.columnOrder] : null,
            lockedColumns: Array.from(state.lockedColumns),
        };

        pendingUncontrolledChangeRef.current = null;
        notifyChange(type, columnKey, committedConfig);
    }, [
        isControlled,
        onColumnConfigChange,
        state.columnWidths,
        state.columnVisibility,
        state.columnOrder,
        state.lockedColumns,
        notifyChange,
    ]);

    // ========================================================================
    // COLUMN INITIALIZATION
    // ========================================================================

    // Track whether first init has occurred in this provider lifecycle.
    // Resets only when provider unmounts — survives child (TableGrid) remounts.
    const isInitializedRef = useRef(false);

    const initializeColumns = useCallback((headerData: HeaderData[]) => {
        headerDataRef.current = Array.isArray(headerData) ? headerData : [];

        if (!isInitializedRef.current) {
            // First call: full initialization with initial config + snapshot
            isInitializedRef.current = true;
            dispatch({
                type: ACTION_TYPES.INIT_COLUMNS,
                payload: {
                    headerData,
                    initialConfig: isControlled ? {} : initialColumnConfig,
                },
            });
        } else {
            // Subsequent calls (child remount, header refresh):
            // preserve user modifications, clean stale column keys
            dispatch({
                type: ACTION_TYPES.UPDATE_HEADER_DATA,
                payload: { headerData },
            });
        }
    }, [isControlled, initialColumnConfig]);

    const getColumnResizeBounds = useCallback((columnKey: string) => {
        const headerData = headerDataRef.current?.find((header) => header?.value === columnKey);
        return resolveColumnBounds({
            columnKey,
            headerData,
            globalMin: minColumnWidth,
            globalMax: maxColumnWidth,
        });
    }, [minColumnWidth, maxColumnWidth]);

    // ========================================================================
    // RESIZE ACTIONS
    // ========================================================================
    
    const setColumnWidth = useCallback((columnKey: string, width: number) => {
        if (!enableResize) return;
        
        // Clamp width within bounds
        const { min, max } = getColumnResizeBounds(columnKey);
        const clampedWidth = Math.max(min, Math.min(max, width));

        if (isControlled) {
            // In controlled mode, just notify - parent handles state
            onColumnConfigChange?.({
                type: COLUMN_CHANGE_TYPES.RESIZE,
                columnKey,
                config: {
                    ...effectiveConfig,
                    columnWidths: {
                        ...effectiveConfig.columnWidths,
                        [columnKey]: clampedWidth,
                    },
                    lockedColumns: Array.from(effectiveConfig.lockedColumns),
                },
            });
        } else {
            dispatch({
                type: ACTION_TYPES.SET_COLUMN_WIDTH,
                payload: { columnKey, width: clampedWidth },
            });
        }
    }, [enableResize, isControlled, getColumnResizeBounds, onColumnConfigChange, effectiveConfig]);

    const setResizingColumn = useCallback((columnKey: string | null) => {
        dispatch({
            type: ACTION_TYPES.SET_RESIZING_COLUMN,
            payload: { columnKey },
        });
    }, []);

    // Notify after resize completes (for uncontrolled mode)
    const finalizeResize = useCallback((columnKey: string, finalWidth: number) => {
        setResizingColumn(null);
        if (!isControlled) {
            const { min, max } = getColumnResizeBounds(columnKey);
            const clampedWidth = finalWidth == null ? finalWidth : Math.max(min, Math.min(max, finalWidth));

            pendingUncontrolledChangeRef.current = {
                type: COLUMN_CHANGE_TYPES.RESIZE,
                columnKey,
                widthOverride: clampedWidth,
            };
        }
    }, [isControlled, setResizingColumn, getColumnResizeBounds]);

    // ========================================================================
    // VISIBILITY ACTIONS
    // ========================================================================
    
    const setColumnVisibility = useCallback((columnKey: string, visible: boolean) => {
        if (!enableVisibilityToggle) return;
        if (effectiveConfig.lockedColumns.has(columnKey) && !visible) return;

        if (isControlled) {
            // Sparse: only store false, delete when visible
            const nextVisibility = { ...effectiveConfig.columnVisibility };
            if (visible === false) {
                nextVisibility[columnKey] = false;
            } else {
                delete nextVisibility[columnKey];
            }
            onColumnConfigChange?.({
                type: COLUMN_CHANGE_TYPES.VISIBILITY,
                columnKey,
                config: {
                    ...effectiveConfig,
                    columnVisibility: nextVisibility,
                    lockedColumns: Array.from(effectiveConfig.lockedColumns),
                },
            });
        } else {
            dispatch({
                type: ACTION_TYPES.SET_COLUMN_VISIBILITY,
                payload: { columnKey, visible },
            });
            pendingUncontrolledChangeRef.current = {
                type: COLUMN_CHANGE_TYPES.VISIBILITY,
                columnKey,
            };
        }
    }, [enableVisibilityToggle, isControlled, effectiveConfig, onColumnConfigChange]);

    const toggleColumnVisibility = useCallback((columnKey: string) => {
        const currentVisibility = effectiveConfig.columnVisibility[columnKey] !== false;
        setColumnVisibility(columnKey, !currentVisibility);
    }, [effectiveConfig.columnVisibility, setColumnVisibility]);

    const setMultipleColumnVisibility = useCallback((visibilityMap: Record<string, boolean>) => {
        if (!enableVisibilityToggle) return;

        if (isControlled) {
            // Sparse: only store false, delete when visible
            const mergedVisibility = { ...effectiveConfig.columnVisibility };
            Object.entries(visibilityMap || {}).forEach(([columnKey, visible]) => {
                if (effectiveConfig.lockedColumns.has(columnKey) && !visible) return;
                if (visible === false) {
                    mergedVisibility[columnKey] = false;
                } else {
                    delete mergedVisibility[columnKey];
                }
            });

            onColumnConfigChange?.({
                type: COLUMN_CHANGE_TYPES.VISIBILITY,
                columnKey: null,
                config: {
                    ...effectiveConfig,
                    columnVisibility: mergedVisibility,
                    lockedColumns: Array.from(effectiveConfig.lockedColumns),
                },
            });
        } else {
            dispatch({
                type: ACTION_TYPES.SET_MULTIPLE_COLUMN_VISIBILITY,
                payload: { visibilityMap },
            });
            pendingUncontrolledChangeRef.current = {
                type: COLUMN_CHANGE_TYPES.VISIBILITY,
                columnKey: null,
            };
        }
    }, [enableVisibilityToggle, isControlled, effectiveConfig, onColumnConfigChange]);

    // ========================================================================
    // REORDER ACTIONS
    // ========================================================================
    
    const reorderColumns = useCallback((fromIndex: number, toIndex: number, currentOrder: string[]) => {
        if (!enableReorder) return;
        
        const columnKey = currentOrder[fromIndex];
        if (effectiveConfig.lockedColumns.has(columnKey)) return;

        const newOrder = [...currentOrder];
        const [movedColumn] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedColumn);

        if (isControlled) {
            onColumnConfigChange?.({
                type: COLUMN_CHANGE_TYPES.REORDER,
                columnKey,
                config: {
                    ...effectiveConfig,
                    columnOrder: newOrder,
                    lockedColumns: Array.from(effectiveConfig.lockedColumns),
                },
            });
        } else {
            dispatch({
                type: ACTION_TYPES.REORDER_COLUMNS,
                payload: { fromIndex, toIndex, currentOrder },
            });
            pendingUncontrolledChangeRef.current = {
                type: COLUMN_CHANGE_TYPES.REORDER,
                columnKey,
            };
        }
    }, [enableReorder, isControlled, effectiveConfig, onColumnConfigChange]);

    const setColumnOrder = useCallback((columnOrder: string[] | null) => {
        if (!enableReorder) return;

        if (isControlled) {
            onColumnConfigChange?.({
                type: COLUMN_CHANGE_TYPES.REORDER,
                columnKey: null,
                config: {
                    ...effectiveConfig,
                    columnOrder,
                    lockedColumns: Array.from(effectiveConfig.lockedColumns),
                },
            });
        } else {
            dispatch({
                type: ACTION_TYPES.SET_COLUMN_ORDER,
                payload: { columnOrder },
            });
            pendingUncontrolledChangeRef.current = {
                type: COLUMN_CHANGE_TYPES.REORDER,
                columnKey: null,
            };
        }
    }, [enableReorder, isControlled, effectiveConfig, onColumnConfigChange]);

    // ========================================================================
    // BULK CONFIG (used by ColumnCustomizer onSave to apply visibility + order atomically)
    // ========================================================================

    const applyBulkConfig = useCallback((updates: { columnWidths?: Record<string, number>; columnVisibility?: Record<string, boolean>; columnOrder?: string[] | null; lockedColumns?: string[] }) => {
        const { columnWidths, columnVisibility, columnOrder, lockedColumns } = updates;
        const hasWidths = columnWidths && Object.keys(columnWidths).length > 0;
        const hasVisibility = columnVisibility && Object.keys(columnVisibility).length > 0;
        const hasOrder = columnOrder !== undefined;
        const hasLocked = lockedColumns && lockedColumns.length > 0;

        // Nothing to apply
        if (!hasWidths && !hasVisibility && !hasOrder && !hasLocked) return;

        if (isControlled) {
            // Single callback with ALL changes merged — prevents stale-snapshot data loss
            const mergedWidths = hasWidths
                ? { ...effectiveConfig.columnWidths, ...columnWidths }
                : { ...effectiveConfig.columnWidths };

            const mergedLocked = hasLocked
                ? new Set([...effectiveConfig.lockedColumns, ...lockedColumns])
                : effectiveConfig.lockedColumns;

            const mergedVisibility = { ...effectiveConfig.columnVisibility };
            if (hasVisibility) {
                Object.entries(columnVisibility).forEach(([key, visible]) => {
                    // Enforce locked columns
                    if (mergedLocked.has(key) && !visible) return;
                    // Sparse: only store false, delete when visible
                    if (visible === false) {
                        mergedVisibility[key] = false;
                    } else {
                        delete mergedVisibility[key];
                    }
                });
            }

            onColumnConfigChange?.({
                type: COLUMN_CHANGE_TYPES.BULK,
                columnKey: null,
                config: {
                    columnWidths: mergedWidths,
                    columnVisibility: mergedVisibility,
                    columnOrder: hasOrder ? columnOrder : (effectiveConfig.columnOrder ?? null),
                    lockedColumns: Array.from(mergedLocked),
                },
            });
        } else {
            dispatch({
                type: ACTION_TYPES.APPLY_BULK_CONFIG,
                payload: updates,
            });
            pendingUncontrolledChangeRef.current = {
                type: COLUMN_CHANGE_TYPES.BULK,
                columnKey: null,
            };
        }
    }, [isControlled, effectiveConfig, onColumnConfigChange]);

    // ========================================================================
    // RESET ACTION
    // ========================================================================
    
    const resetConfig = useCallback(() => {
        if (isControlled) {
            onColumnConfigChange?.({
                type: COLUMN_CHANGE_TYPES.RESET,
                columnKey: null,
                config: {
                    columnWidths: {},
                    columnVisibility: {},
                    columnOrder: null,
                    lockedColumns: Array.from(effectiveConfig.lockedColumns),
                },
            });
        } else {
            dispatch({ type: ACTION_TYPES.RESET_CONFIG });
            pendingUncontrolledChangeRef.current = {
                type: COLUMN_CHANGE_TYPES.RESET,
                columnKey: null,
            };
        }
    }, [isControlled, effectiveConfig.lockedColumns, onColumnConfigChange]);

    // ========================================================================
    // COMPUTED VALUES
    // ========================================================================
    
    const getColumnWidth = useCallback((columnKey: string) => {
        return effectiveConfig.columnWidths[columnKey];
    }, [effectiveConfig.columnWidths]);

    const isColumnVisible = useCallback((columnKey: string) => {
        return effectiveConfig.columnVisibility[columnKey] !== false;
    }, [effectiveConfig.columnVisibility]);

    const isColumnLocked = useCallback((columnKey: string) => {
        return effectiveConfig.lockedColumns.has(columnKey);
    }, [effectiveConfig.lockedColumns]);

    // Get processed headers with visibility and order applied
    const getProcessedHeaders = useCallback((headerData: HeaderData[]) => {
        if (!headerData) return [];

        // Apply custom order if set
        let orderedHeaders = headerData;
        if (effectiveConfig.columnOrder) {
            const orderMap = new Map(effectiveConfig.columnOrder.map((key, idx) => [key, idx]));
            orderedHeaders = [...headerData].sort((a, b) => {
                const orderA = orderMap.get(a.value) ?? Infinity;
                const orderB = orderMap.get(b.value) ?? Infinity;
                return orderA - orderB;
            });
        }

        // Apply visibility
        return orderedHeaders.map(header => ({
            ...header,
            enabled: effectiveConfig.columnVisibility[header.value] !== false,
        }));
    }, [effectiveConfig.columnOrder, effectiveConfig.columnVisibility]);

    // ========================================================================
    // CONTEXT VALUE
    // ========================================================================
    
    const contextValue = useMemo(() => ({
        // State
        columnWidths: effectiveConfig.columnWidths,
        columnVisibility: effectiveConfig.columnVisibility,
        columnOrder: effectiveConfig.columnOrder,
        lockedColumns: effectiveConfig.lockedColumns,
        resizingColumn: state.resizingColumn,
        headerData: state.headerData,
        isModified: state.isModified,
        isPersistenceLoading: persistenceEnabled && isPersistenceLoading,
        tableId,
        
        // Config
        minColumnWidth,
        maxColumnWidth,
        enableResize,
        resizeMode,
        enableReorder,
        enableVisibilityToggle,
        isControlled,

        // Actions
        registerTableId,
        initializeColumns,
        setColumnWidth,
        setResizingColumn,
        finalizeResize,
        setColumnVisibility,
        setMultipleColumnVisibility,
        toggleColumnVisibility,
        reorderColumns,
        setColumnOrder,
        applyBulkConfig,
        resetConfig,

        // Getters
        getColumnWidth,
        isColumnVisible,
        isColumnLocked,
        getColumnResizeBounds,
        getProcessedHeaders,
    }), [
        effectiveConfig,
        state.resizingColumn,
        state.headerData,
        state.isModified,
        isPersistenceLoading,
        persistenceEnabled,
        tableId,
        minColumnWidth,
        maxColumnWidth,
        enableResize,
        resizeMode,
        enableReorder,
        enableVisibilityToggle,
        isControlled,
        registerTableId,
        initializeColumns,
        setColumnWidth,
        setResizingColumn,
        finalizeResize,
        setColumnVisibility,
        setMultipleColumnVisibility,
        toggleColumnVisibility,
        reorderColumns,
        setColumnOrder,
        applyBulkConfig,
        resetConfig,
        getColumnWidth,
        isColumnVisible,
        isColumnLocked,
        getColumnResizeBounds,
        getProcessedHeaders,
    ]);

    return (
        <TableGridColumnContext.Provider value={contextValue}>
            {children}
        </TableGridColumnContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useTableGridColumns(tableId?: string): TableGridColumnContextValue {
    const context = useContext(TableGridColumnContext);

    // Register tableId with provider when provided (Table component passes this)
    const registerTableId = context?.registerTableId;
    useEffect(() => {
        if (tableId && registerTableId) {
            registerTableId(tableId);
        }
    }, [tableId, registerTableId]);

    if (!context) {
        // Return a no-op context when used outside provider for backward compatibility
        return {
            columnWidths: {},
            columnVisibility: {},
            columnOrder: null,
            lockedColumns: new Set(),
            resizingColumn: null,
            headerData: [],
            isModified: false,
            isPersistenceLoading: false,
            tableId: '',
            minColumnWidth: DEFAULT_MIN_COLUMN_WIDTH,
            maxColumnWidth: DEFAULT_MAX_COLUMN_WIDTH,
            enableResize: false,
            resizeMode: 'onEnd',
            enableReorder: false,
            enableVisibilityToggle: false,
            isControlled: false,
            registerTableId: () => {},
            initializeColumns: () => {},
            setColumnWidth: () => {},
            setResizingColumn: () => {},
            finalizeResize: () => {},
            setColumnVisibility: () => {},
            setMultipleColumnVisibility: () => {},
            toggleColumnVisibility: () => {},
            reorderColumns: () => {},
            setColumnOrder: () => {},
            applyBulkConfig: () => {},
            resetConfig: () => {},
            getColumnWidth: () => undefined,
            isColumnVisible: () => true,
            isColumnLocked: () => false,
            getColumnResizeBounds: () => ({ min: DEFAULT_MIN_COLUMN_WIDTH, max: DEFAULT_MAX_COLUMN_WIDTH }),
            getProcessedHeaders: (headers: HeaderData[]) => headers || [],
        };
    }
    return context;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default TableGridColumnContext;
