import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ColumnConfig, HeaderData, GraphQLFetcher, PersistableColumnKey } from '../types';
import { DEFAULT_PERSIST_KEYS } from '../types';

// ============================================================================
// CONFIG
// ============================================================================

const DEBOUNCE_DELAY = 2500; // 2.5s idle before auto-save
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 1000; // 1s, 2s, 4s exponential backoff

// ============================================================================
// GRAPHQL OPERATIONS (defined here so consuming apps don't need to know them)
// ============================================================================

const GET_PREFERENCE_QUERY = `
  query GetPreference($key: String!, $type: PreferenceType!) {
    getPreference(key: $key, type: $type) {
      key
      type
      config
      updatedAt
    }
  }
`;

const SAVE_PREFERENCE_MUTATION = `
  mutation SavePreference($key: String!, $type: PreferenceType!, $config: JSON!) {
    savePreference(key: $key, type: $type, config: $config) {
      key
      type
      config
      updatedAt
    }
  }
`;

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Filter out keys from saved config that don't exist in current headerData.
 * Prevents applying settings to columns that have been removed or renamed.
 */
function pickKeys(obj: Record<string, unknown> | undefined, validKeys: Set<string>): Record<string, unknown> {
    if (!obj) return {};
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
        if (validKeys.has(key)) {
            result[key] = obj[key];
        }
    }
    return result;
}

/**
 * Reconcile saved config against current headerData.
 * Drops references to columns that no longer exist.
 *
 * columnVisibility uses sparse storage: only hidden columns (false) are persisted.
 * Missing keys = visible (default). Compatible with provider's check:
 * `effectiveConfig.columnVisibility[key] !== false`
 */
function reconcileConfig(saved: ColumnConfig, headerData: HeaderData[]): ColumnConfig {
    const validKeys = new Set(headerData.map((h) => h.value));

    return {
        columnWidths: pickKeys(saved.columnWidths, validKeys) as Record<string, number>,
        columnVisibility: pickKeys(saved.columnVisibility, validKeys) as Record<string, boolean>,
        columnOrder: saved.columnOrder?.filter((key) => validKeys.has(key)) ?? null,
        lockedColumns: saved.lockedColumns
            ? (Array.isArray(saved.lockedColumns)
                ? saved.lockedColumns.filter((key) => validKeys.has(key))
                : Array.from(saved.lockedColumns).filter((key) => validKeys.has(key)))
            : [],
    };
}

// ============================================================================
// HOOK
// ============================================================================

export interface UsePersistedColumnConfigOptions {
    tableId: string;
    enabled: boolean;
    fetcher: GraphQLFetcher;
    headerData?: HeaderData[];
    onSaveError?: (error: Error) => void;
    persistKeys?: PersistableColumnKey[];
}

export interface UsePersistedColumnConfigReturn {
    config: ColumnConfig | null;
    isLoading: boolean;
    saveConfig: (config: ColumnConfig) => void;
    debouncedSaveConfig: (config: ColumnConfig) => void;
    persistKeys: PersistableColumnKey[];
}

/**
 * Strip keys not in the allowlist from a ColumnConfig.
 * Used both before save (to backend) and after fetch (drop ignored fields).
 */
function filterByPersistKeys(config: ColumnConfig, persistKeys: PersistableColumnKey[]): ColumnConfig {
    const allow = new Set(persistKeys);
    const result: ColumnConfig = {};
    if (allow.has('columnWidths') && config.columnWidths) result.columnWidths = config.columnWidths;
    if (allow.has('columnVisibility') && config.columnVisibility) result.columnVisibility = config.columnVisibility;
    if (allow.has('columnOrder') && config.columnOrder !== undefined) result.columnOrder = config.columnOrder;
    if (allow.has('lockedColumns') && config.lockedColumns) result.lockedColumns = config.lockedColumns;
    return result;
}

export function usePersistedColumnConfig({
    tableId,
    enabled,
    fetcher,
    headerData,
    onSaveError,
    persistKeys,
}: UsePersistedColumnConfigOptions): UsePersistedColumnConfigReturn {
    const resolvedPersistKeys = useMemo<PersistableColumnKey[]>(
        () => (persistKeys && persistKeys.length > 0 ? persistKeys : DEFAULT_PERSIST_KEYS),
        [persistKeys],
    );
    const persistKeysRef = useRef(resolvedPersistKeys);
    persistKeysRef.current = resolvedPersistKeys;
    const [config, setConfig] = useState<ColumnConfig | null>(null);
    const [isLoading, setIsLoading] = useState(enabled && !!tableId);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mountedRef = useRef(true);
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher; // always use latest fetcher without triggering re-fetches

    // Cleanup on unmount
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // ── Fetch config on mount ───────────────────────────────────────────
    useEffect(() => {
        if (!enabled || !tableId) return;

        let cancelled = false;
        setIsLoading(true);

        (async () => {
            try {
                const data = await fetcherRef.current({
                    query: GET_PREFERENCE_QUERY,
                    variables: { key: tableId, type: 'COLUMN_CONFIG' },
                }) as { getPreference?: { config?: ColumnConfig } };

                if (cancelled || !mountedRef.current) return;

                const fetchedRaw = data.getPreference?.config;
                // Drop keys not in allowlist — consumer may have toggled persistKeys since last save
                const fetched = fetchedRaw ? filterByPersistKeys(fetchedRaw, persistKeysRef.current) : fetchedRaw;

                // If empty response, set null (use defaults)
                if (!fetched || (
                    !fetched.columnWidths &&
                    !fetched.columnVisibility &&
                    !fetched.columnOrder &&
                    !fetched.lockedColumns
                )) {
                    setConfig(null);
                } else {
                    const reconciled = headerData?.length
                        ? reconcileConfig(fetched, headerData)
                        : fetched;
                    setConfig(reconciled);
                }
            } catch {
                // Silent fallback — table renders with defaults
                if (!cancelled && mountedRef.current) {
                    setConfig(null);
                }
            } finally {
                if (!cancelled && mountedRef.current) {
                    setIsLoading(false);
                }
            }
        })();

        return () => { cancelled = true; };
    }, [enabled, tableId]); // intentionally omit headerData to avoid refetch loops

    // ── Save with retry ─────────────────────────────────────────────────
    const saveWithRetry = useCallback(async (configToSave: ColumnConfig, attempt = 1) => {
        try {
            const allow = new Set(persistKeysRef.current);

            // Sparse visibility: only store hidden columns (false values)
            const sparseVisibility: Record<string, boolean> = {};
            if (allow.has('columnVisibility') && configToSave.columnVisibility) {
                for (const [key, visible] of Object.entries(configToSave.columnVisibility)) {
                    if (visible === false) {
                        sparseVisibility[key] = false;
                    }
                }
            }

            // Build serialized payload with only allowlisted keys
            const serialized: Record<string, unknown> = {};
            if (allow.has('columnWidths') && configToSave.columnWidths) {
                serialized.columnWidths = configToSave.columnWidths;
            }
            if (allow.has('columnVisibility')) {
                serialized.columnVisibility = sparseVisibility;
            }
            if (allow.has('columnOrder') && configToSave.columnOrder !== undefined) {
                serialized.columnOrder = configToSave.columnOrder;
            }
            if (allow.has('lockedColumns')) {
                serialized.lockedColumns = configToSave.lockedColumns
                    ? (configToSave.lockedColumns instanceof Set
                        ? Array.from(configToSave.lockedColumns)
                        : configToSave.lockedColumns)
                    : [];
            }

            // Nothing to persist — skip network call
            if (Object.keys(serialized).length === 0) return;

            await fetcherRef.current({
                query: SAVE_PREFERENCE_MUTATION,
                variables: { key: tableId, type: 'COLUMN_CONFIG', config: serialized },
            });
        } catch (err) {
            if (attempt < MAX_RETRIES) {
                const delay = RETRY_BASE_DELAY * Math.pow(2, attempt - 1);
                await new Promise((resolve) => setTimeout(resolve, delay));
                return saveWithRetry(configToSave, attempt + 1);
            }
            onSaveError?.(err as Error);
        }
    }, [tableId, onSaveError]);

    // ── Immediate save (for customizer Save click) ──────────────────────
    const saveConfig = useCallback((configToSave: ColumnConfig) => {
        if (!enabled || !tableId) return;
        saveWithRetry(configToSave);
    }, [enabled, tableId, saveWithRetry]);

    // ── Debounced save (for inline resize/reorder) ──────────────────────
    const debouncedSaveConfig = useCallback((configToSave: ColumnConfig) => {
        if (!enabled || !tableId) return;

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            saveWithRetry(configToSave);
        }, DEBOUNCE_DELAY);
    }, [enabled, tableId, saveWithRetry]);

    return { config, isLoading, saveConfig, debouncedSaveConfig, persistKeys: resolvedPersistKeys };
}
