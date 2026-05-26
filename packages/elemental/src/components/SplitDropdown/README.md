# SplitDropdown

SplitDropdown is a two-panel dropdown that lets users browse filter groups on the left and configure selections on the right.

- The left panel lists items.
- The right panel renders the active item's control.
- Edits stay in local draft state until the user applies them.
- Left-only items with `showRightPanel: false` apply immediately.
- Selection badges and custom selection summaries are controlled per item with `showSelectionCount`.

## Quick Start

```tsx
import React, { useState } from "react";
import { SplitDropdown } from "@birdeye/elemental";

const surveyOptions = [
  { value: "nps", label: "NPS" },
  { value: "csat", label: "CSAT" },
];

const locationOptions = [
  { value: "loc-1", label: "New York" },
  { value: "loc-2", label: "Chicago" },
];

export default function Filters() {
  const [appliedValues, setAppliedValues] = useState({
    survey: { value: "nps", label: "NPS" },
    locations: { "loc-2": "Chicago" },
  });

  const items = [
    {
      key: "survey",
      label: "Survey",
      type: "single",
      value: appliedValues.survey,
      options: surveyOptions,
    },
    {
      key: "locations",
      label: "Locations",
      type: "multi",
      value: appliedValues.locations,
      options: locationOptions,
    },
  ];

  return (
    <SplitDropdown
      items={items}
      defaultSelectedKey="survey"
      leftPanelHeader="Filters"
      onLeftItemChange={(item) => {
        console.log("Left panel selected:", item);
      }}
      onApply={(payload) => {
        setAppliedValues((prev) => {
          const next = { ...prev };

          payload.forEach((item) => {
            if ("value" in item) next[item.key] = item.value;
          });

          return next;
        });
      }}
    />
  );
}
```

## Mental Model

When the dropdown opens, it copies each item's current `value` into draft state.

- Changing a right-panel control updates only the draft.
- Clicking `Clear` resets drafts and keeps the dropdown open.
- Clicking `Apply` calls `onApply` and closes the dropdown.
- Reopening the dropdown recreates drafts from the latest `items` values.

This means the parent should store committed values, then feed them back through each item's `value` field.

## `onApply` Payload

`onApply` does not send only changed items.

In normal mode, it sends the full committed payload for every item in `items`, in order.

```ts
[
  { key: "survey", label: "Survey", value: { value: "nps", label: "NPS" } },
  { key: "locations", label: "Locations", value: { "loc-2": "Chicago" } },
  { key: "overview", label: "Overview" },
]
```

Rules:

- Items with a right panel emit `key`, `label`, and `value`.
- Left-only items emit `key` and `label` only.
- Internal fields like `options`, `pagination`, and `fetchData` are never returned.
- In `isSingleSelectLeft` mode, only the active item is returned.

## Item Types

Every item needs `key` and `label`.

### Left-only item

Use this for entries that should apply immediately and close the dropdown.

```ts
{
  key: "overview-report",
  label: "Overview Report",
  showRightPanel: false,
}
```

### Single-select item

`value` should be a `{ value, label }` object for the selected option, or `null`.

```ts
{
  key: "survey",
  label: "Survey",
  type: "single",
  value: { value: "nps", label: "NPS" },
  options: [
    { value: "nps", label: "NPS" },
    { value: "csat", label: "CSAT" },
  ],
}
```

### Multi-select item

`value` should be an object keyed by selected option values, where each map-value is the option's label.

```ts
{
  key: "locations",
  label: "Locations",
  type: "multi",
  value: { "loc-1": "New York", "loc-2": "Chicago" },
  options: [
    { value: "loc-1", label: "New York" },
    { value: "loc-2", label: "Chicago" },
  ],
}
```

Do not pass an array of values.

### Custom item

Use this when the right panel needs custom JSX.

```tsx
{
  key: "time-period",
  label: "Time Period",
  type: "custom",
  value: { months: 12, groupByDays: 0 },
  renderCustomJSXInRightPanel: ({ value, onChange, actions }) => (
    <MyPanel value={value} onChange={onChange} actions={actions} />
  ),
}
```

## Loading Data

### Non-paginated loading

Use `fetchData` for list items that should load when they become active.

`fetchData` is called each time the item becomes active:

- when the dropdown opens with that item selected
- when the user clicks that item in the left panel

The component passes the item key to `fetchData`, but most handlers can ignore it.

```ts
{
  key: "users",
  label: "Users",
  type: "multi",
  options: usersOptions,
  value: appliedValues.users,
  loading: usersLoading,
  fetchData: () => {
    if (usersLoading || usersOptions.length > 0) return;
    loadUsers();
  },
}
```

### Paginated loading

Use `pagination` for remote search and infinite scroll.

```ts
{
  key: "review-sites",
  label: "Review Sites",
  type: "single",
  options: reviewSiteOptions,
  value: appliedValues.reviewSite,
  searchPlaceholder: "Search review sites",
  pagination: {
    isLoading: reviewLoading,
    isLoadingMore: reviewLoadingMore,
    hasMore: reviewHasMore,
    onOpen: () => fetchSites(1),
    onLoadMore: () => fetchNextPage(),
    onSearch: (search) => fetchSites(1, search),
  },
}
```

For paginated items, loading state comes from `pagination.isLoading` and `pagination.isLoadingMore`, not `item.loading`.

## Custom Panels

`renderCustomJSXInRightPanel` receives:

```ts
{
  value,
  onChange,
  actions: {
    applyValue: (value) => void,
    clearAll: () => void,
  },
}
```

Usage rules:

- Call `onChange` on every interaction that should update draft state.
- Call `actions.applyValue(value)` to commit and close.
- Call `actions.clearAll()` to reset drafts and keep the dropdown open.
- Custom panels do not render the shared footer. Render your own `Apply` and `Clear` controls.

Example adapter:

```tsx
const InlineTimePeriodPanel = ({ value, onChange, actions }) => (
  <TimePeriod
    isInline
    selectedDateRange={value || defaultTimePeriodValue}
    onChangeSelectedDateRange={onChange}
    onDateChange={onChange}
    onApply={actions.applyValue}
    onClear={actions.clearAll}
    applyLabel="Apply"
    clearLabel="Clear"
  />
);
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `SplitDropdownPanelItem[]` | required | Full dropdown definition. |
| `onApply` | `(items) => void` | required | Called when the user applies committed values. |
| `onLeftItemChange` | `(item) => void` | `undefined` | Called when the user activates an item in the left panel. Receives that item's full config object. |
| `defaultSelectedKey` | `string` | first item key | Initial committed left-panel item. Dismissed sessions reset back to this item until another item is applied. |
| `isSingleSelectLeft` | `boolean` | `false` | Applies only the active item. |
| `leftPanelHeader` | `string` | `undefined` | Optional left-panel title. |
| `closeOnOutsideClick` | `boolean` | `true` | Closes on outside click and discards any un-applied left-panel navigation or draft edits from the current session. |
| `autoPosition` | `boolean` | `true` | Opens above the trigger when needed. |
| `dropdownHeight` | `number` | `280` | Default panel height. |
| `leftPanelWidth` | `number` | `240` | Left-panel width. |
| `className` | `string` | `""` | Extra root class. |
| `isOpen` | `boolean` | `undefined` | Controlled open state. Use with `onOpenChange`. |
| `onOpenChange` | `(isOpen: boolean) => void` | `undefined` | Open-state callback. |
| `usePortal` | `boolean` | `false` | Mounts the dropdown panel in `document.body`. |
| `enableKeyboardNavigation` | `boolean` | `false` | Enables left-panel keyboard navigation. |
| `triggerJSX` | `ReactNode` | `undefined` | Replaces the default trigger completely. |
| `triggerLabel` | `string` | `"Select"` | Fallback label for the default trigger. In practice, the default trigger shows the active item's label whenever an item can be resolved. Use `triggerJSX` for a fixed custom trigger label. |

## Item Fields

| Field | Applies to | Notes |
|---|---|---|
| `key` | all | Required unique key. |
| `label` | all | Left-panel label. |
| `type` | panel items | Supported values: `single`, `multi`, `custom`. |
| `showRightPanel` | all | Set `false` for left-only items. |
| `showSelectionCount` | panel items | Defaults to `true`. Set `false` to hide the left-panel badge or custom summary for that item. |
| `value` | panel items | Committed value used to initialize drafts on open. |
| `dropdownHeight` | panel items | Per-item height override. |
| `rightPanelWidth` | panel items | Per-item right-panel width. |
| `options` | `single`, `multi` | Array of `{ value, label }`. |
| `loading` | `single`, `multi` | Non-paginated loading flag. |
| `loaderComponent` | `single`, `multi` | Custom loading UI. |
| `fetchData` | `single`, `multi`, `custom` | Called with the item key when a non-paginated item becomes active. Only used when `pagination` is not present. |
| `pagination` | `single`, `multi` | Remote loading config. Supported fields currently consumed by the component are `hasMore`, `isLoading`, `isLoadingMore`, `onOpen`, `onLoadMore`, `onSearch`, `loader`, `useWindow`, `initialLoad`, `threshold`, and `containerHeight`. |
| `listProps` | `single`, `multi` | Passed through to `ListWithCheckBox`. |
| `searchPlaceholder` | `single`, `multi` | Search placeholder. |
| `noDataScreen` | `single`, `multi` | Empty-state UI. |
| `renderCustomSelectionIndicator` | panel items | Custom summary renderer for the left panel. |
| `getSelectionCount` | panel items | Custom badge-count resolver. |
| `renderCustomJSXInRightPanel` | `custom` | Right-panel render function. |

If you need to suppress selection counts for only some entries, configure those items directly:

```ts
{
  key: "locations",
  label: "Locations",
  type: "multi",
  value: { "loc-1": "New York", "loc-2": "Chicago" },
  options: locationOptions,
  showSelectionCount: false,
}
```

`error` exists in the item interface today, but the current component implementation does not render it.

## Behaviour Notes

### Single-select-left mode

When `isSingleSelectLeft` is enabled:

- only the active item is returned from `onApply`
- applying one item clears draft values for the others
- left-only items still apply immediately and close

### Portal mode

Use `usePortal` when the dropdown would otherwise be clipped by an ancestor with `overflow` or transforms.

Current portal behavior:

- the panel is rendered into `document.body`
- position is calculated from `getBoundingClientRect()`
- scrolling a trigger ancestor closes the dropdown
- scrolling inside the dropdown does not close it
- window resize closes the dropdown

### Keyboard navigation

When `enableKeyboardNavigation` is true:

- `ArrowDown` moves to the next left item
- `ArrowUp` moves to the previous left item
- `ArrowRight` or `Enter` activates the focused item
- `Escape` closes the dropdown

The first arrow press starts from the currently selected item, and the focused item is scrolled into view automatically.

### Left-panel change callback

Use `onLeftItemChange` when the parent needs to react as soon as the user activates a left-panel item, before `Apply` is pressed.

```tsx
<SplitDropdown
  items={items}
  onLeftItemChange={(item) => {
    analytics.track("split_dropdown_left_item_selected", {
      key: item.key,
      label: item.label,
      type: item.type,
    });
  }}
  onApply={handleApply}
/>
```

The callback fires for mouse selection and keyboard activation, and the argument is the complete `SplitDropdownPanelItem` for the chosen entry.
