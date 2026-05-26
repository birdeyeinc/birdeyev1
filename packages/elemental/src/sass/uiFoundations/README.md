# UI Foundations - Design System Classes

This folder contains standardized, reusable CSS classes that can be used across all Birdeye applications.

## Usage in Current Repo (Elemental)

Classes are already available globally. Just use them in your JSX:

```jsx
<div className="ds-page-header">
  <h1 className="ds-page-header-title">Dashboard</h1>
  <button className="ds-button-secondary">Settings</button>
</div>
```

## Usage in Other Repos

### Step 1: Install Elemental Package

```bash
yarn add @birdeye/elemental
```

### Step 2: Import in Your Global SCSS

```scss
// src/styles/global.scss or app.scss
@import '@birdeye/elemental/src/sass/uiFoundations/index';
```

### Step 3: Use Classes Anywhere

```jsx
// No imports needed in components!
function MyComponent() {
  return (
    <div className="ds-page-header">
      <h1 className="ds-page-header-title">My Page</h1>
      <button className="ds-button-secondary">Action</button>
    </div>
  );
}
```

## Available Classes

### Page Layout
- `.ds-page-header` - Standard page header container (52px height, centered vertically)

### Typography
- `.ds-page-header-title` - Main page title (18px, 400 weight)
- `.ds-page-subheader` - Page subheader (16px, 400 weight)

### Buttons
- `.ds-button-secondary` - Secondary button style with border

## Development

When adding new foundation classes:

1. Create a new file in `uiFoundations/` (e.g., `_typography.scss`)
2. Add the import to `uiFoundations/_index.scss`
3. Classes will automatically be available globally

## Notes

- All classes use the `ds-` prefix (design system) to avoid conflicts
- Dependencies (variables, mixins) are already included in each file
- No need to import variables or mixins when using these classes
