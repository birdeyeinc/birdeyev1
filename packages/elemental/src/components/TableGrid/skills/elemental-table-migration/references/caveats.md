# Implementation Caveats & Performance — Elemental Table

## Implementation-Verified Caveats (Mar 2026)
# Implementation Caveats & Performance — Elemental TableGrid

## Implementation-Verified Caveats (Mar 2026)

1. **Virtualization bypassed with accordion.** `useVirtualization` returns full flattened rows when `accordionConfig.enabled=true` because expandable rows have variable heights.

2. **`onLoadMoreSubRows` receives post-click count.** Signature is `(parentRowId, newVisibleCount)` — the count after the "See more" click, not before.

3. **`disabledStateForRow` is an object map by row ID.**
   ```js
   {
     "row-1": { isDisabled: true },
     "row-2": { isDisabled: false }
   }
   ```
   Precedence: `disabledStateForRow[rowId]?.isDisabled` first, then `row.isDisabled` fallback.

4. **VirtualizedStyleTableGrid sort API differs from TableGrid.**
   - `VirtualizedStyleTableGrid`: `sortDirection` is string (`"ASC"` / `"DESC"`)
   - `TableGrid`: `sort.sortOrder` is numeric (`0` / `1`)

5. **Column auto-fit measures header content only.** Body-cell measurement is currently disabled in implementation.

6. **`virtualizedAdapter` maps `Column.width` to header `fixWidth` internally.** For direct `TableGrid` usage, prefer `headerData.width` as the primary width field.

7. **VirtualizedStyleTableGrid adapter adds +18px to column widths.** The adapter converts `Column.width`, `minWidth`, and `maxWidth` via metadata styles with a +18px padding offset (e.g., `width: 200` becomes `width: 218px` in metadata). This accounts for cell padding. Direct `TableGrid` usage does not add this offset.

8. **Header cell renderers now receive per-cell sort state.** The renderer receives `isSorted: boolean` (true only for the currently sorted column) and `sortOrder: number` (only present when `isSorted` is true). This avoids passing raw `sortColumn`/`sortOrder` to every header — only the sorted column's props change on sort, so `memo`-wrapped header renderers can skip re-renders for non-sorted columns. The `renderer` function in `TableHeader` is stabilized with `useCallback` (depends only on `headerCellRenderer`). The VirtualizedStyleTable adapter's `wrapHeaderRenderer` maps `isSorted`/`sortOrder` to react-virtualized format (`sortBy`/`sortDirection`).

9. **`onSave` mode reset discards draft, not full reset.** In ColumnCustomizer `onSave` mode, clicking the reset button reverts draft changes back to the current context state — it does NOT call `resetConfig()` to restore to `initialConfigSnapshot`. In `onChange` mode, reset calls `resetConfig()` which restores to the initial configuration.

10. **Sort toggle behavior.** Clicking the **same column** toggles `sortOrder` between `0` (asc) and `1` (desc). Clicking a **different column** always resets `sortOrder` to `0`. This is handled in `index.tsx` `handleHeaderSortClick` — the callback is debounced by `sortDebounceWaitTime` (default: 200ms).

11. **`headerData.locked` is a dead field.** The `locked?: boolean` field exists in the `HeaderData` TypeScript type but is **never read** by any runtime component code (Table, TableHeader, TableBody, ColumnCustomizer, or TableGridColumnContext). Column locking is driven by `lockedColumns` in the `ColumnConfig` passed to `TableGridColumnProvider`. If you set `locked: true` on a header, nothing happens — use `initialColumnConfig={{ lockedColumns: ['columnKey'] }}` instead.

12. **`rowId` undefined disables accordion and disabled-state for that row.** If `rowId` is omitted, the row still renders (key falls back to `row-${index}`), but accordion expand/collapse is silently skipped (`if (rowId) handleToggleExpand(rowId)` in `TableBody.tsx:373`), and `disabledStateForRow` lookup returns `false` since there's no key to match.

13. **`virtualization.switchThreshold` default is `20`.** Both `defaultProps` and the prop destructuring use `switchThreshold: 20`. The `isVirtualizationActive` check uses `?? 20` (nullish coalescing), so passing `switchThreshold: 0` correctly means "always virtualize when enabled".

14. **Virtualization hook auto-detects scroll container.** The `useVirtualization` hook starts from `<tbody>` and walks up the DOM to find the first element with `overflow-y: auto|scroll` and `scrollHeight > clientHeight`. It does NOT use `tableContainerRef` — that ref is forwarded to the internal container div for consumer access. If `useWindow: true`, the hook uses `window` for scroll tracking instead.

15. **ColumnCustomizer `onSave` applies changes atomically via `applyBulkConfig`.** When `applyMode="onSave"`, clicking Save calls `applyBulkConfig()` which merges visibility + order into a single dispatch (uncontrolled) or single `onColumnConfigChange` callback (controlled) with `type: 'bulk'`. This prevents stale-config data loss that occurred when changes were applied as multiple individual calls. In controlled mode, consumers must handle `COLUMN_CHANGE_TYPES.BULK` alongside `RESIZE`, `REORDER`, and `VISIBILITY`. In uncontrolled mode with persistence, `bulk` triggers an immediate (non-debounced) GraphQL save.

16. **`columnVisibility` uses sparse storage.** Only hidden columns (`false`) are stored in `columnVisibility`. A missing key means the column is visible (default). The provider checks visibility via `columnVisibility[key] !== false`. When setting visibility, passing `true` or omitting the key both mean "visible" — the provider deletes the key from the map rather than storing `true`. This applies to all paths: `setColumnVisibility`, `setMultipleColumnVisibility`, `applyBulkConfig`, and the persistence layer. If you're comparing visibility snapshots, check `(vis[key] !== false)` rather than strict equality.

17. **Built-in persistence is disabled in controlled mode.** The `persistence` prop on `TableGridColumnProvider` only works in uncontrolled mode (when `columnConfig` is not provided). In controlled mode, persistence is silently ignored — use manual save/load via `onColumnConfigChange` instead.

18. **Persistence fetch runs on mount and when `tableId` changes.** The `usePersistedColumnConfig` hook fetches saved config whenever `enabled` or `tableId` changes (dependency array: `[enabled, tableId]`). `tableId` is a flat-level prop on the `Table` component — it is registered with the provider context on mount. It does not re-fetch on `headerData` changes — `headerData` is intentionally omitted to avoid refetch loops. Saved config is reconciled against current `headerData` at fetch time — columns that no longer exist in `headerData` are dropped from the fetched config.

19. **Persistence save uses different strategies per change type.** Resize changes are debounced (2.5s idle) to avoid excessive backend writes during drag. All other changes (visibility, reorder, bulk, reset) save immediately. Failed saves retry 3 times with exponential backoff (1s, 2s, 4s). The `onError` callback fires only after all retries are exhausted.

20. **`onColumnConfigChange` fires alongside persistence auto-save.** When persistence is enabled, `onColumnConfigChange` is still called for every change. Consumers can use this for local UI reactions without interfering with the auto-save. The `init` change type does not trigger a persistence save (prevents writing defaults back on mount).

21. **Row rendering is delegated to `TableGridRow` with local hover state.** Hover state no longer lives in `TableBody`; it is managed per row component. This reduces body-level hover churn because only the hovered row updates its hover state. `isHovered` remains gated by `disablePerfOptimization` and `needIsHoverProp` resolution.

---

## Performance Optimization Tips

### 1. Memoize Cell Renderers

```jsx
import { memo } from 'react';

// ✅ Good - Memoized
const MyCellRenderer = memo(({ rowData }) => (
  <span>{rowData?.value}</span>
));

// ❌ Bad - Creates new component each render
const cellRenderer = {
  name: ({ rowData }) => <span>{rowData?.value}</span>
};
```

### 2. Use Virtualization for Large Datasets

```jsx
virtualization={{ enabled: true, rowHeight: 50, switchThreshold: 20 }}
```

### 3. Avoid disablePerfOptimization Unless Necessary

```jsx
// Enables per-row hover tracking for renderers opting into isHovered
<Table disablePerfOptimization={true} />

// ✅ Use CSS for hover effects instead
// .tr_class:hover .td_class { background: #f5f5f5; }
```

### 4. Stable References

```jsx
// ✅ Define outside component or useMemo
const cellRenderer = useMemo(() => ({
  name: NameRenderer,
  status: StatusRenderer
}), []);

// ❌ Creates new object every render
<Table cellRenderer={{ name: NameRenderer }} />
```

### 5. Prefer `resizeMode="onEnd"` for Heavy Tables

`onEnd` minimizes rerenders and callback frequency by committing once at mouseup. Use `onChange` only when live resize feedback in app state is required.
