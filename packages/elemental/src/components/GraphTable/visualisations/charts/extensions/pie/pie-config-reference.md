# Pie Chart Configuration Keys - Reference Guide

This document contains one-line explanations for each configuration key used in pie.config.ts

## Root Level Configuration

| Key | Description |
|-----|-------------|
| `reportsGroup` | Identifier for grouping related reports together |
| `disableEmailBodyEdit` | Controls whether email body editing is disabled for this chart |
| `tempUniqueId` | Temporary unique identifier for the chart instance |
| `subReportsGroup` | Sub-category grouping for the report within the main reports group |

## Parser Configuration (parserConfig)

| Key | Description |
|-----|-------------|
| `disableSecondaryChart` | Disables the secondary chart view option |
| `disableCompareChart` | Disables the comparison chart functionality |
| `isCustomSpacingTop` | Enables custom top spacing for the chart container |
| `allowSizeMe` | Allows the chart to be resized/responsive |
| `isCallsAIChart` | Indicates this is an AI-related chart for calls data |
| `hideGTMGraphTitle` | Hides the GTM (Google Tag Manager) graph title |
| `dataFormat` | Specifies the data structure format - 'arrayWithKeyValue' for flat key-value pairs |
| `categoryKey` | The key used for categorizing data - 'sentiment' in this case |
| `displaySummary` | Controls whether to show summary information alongside the chart |
| `crosshairConfig` | Configuration for crosshair styling and behavior |
| `showProjectedData` | Controls whether to display projected/forecasted data |
| `yAxisText` | Text label for the Y-axis (empty for pie charts) |
| `graphTitle` | Main title displayed above the chart |
| `pieChartTitle` | Title displayed in the center of the pie chart |
| `isPieDistribution` | Flag indicating this is a sentiment distribution chart |
| `pieDistributionDataKey` | Configurable path to locate sentiment data in nested objects |
| `pieDataKeys` | Array of keys representing different sentiment categories |
| `dataPoints` | Controls whether to show individual data points |
| `pieSize` | Size of the pie chart as a percentage of container |
| `marginRight` | Right margin spacing for the chart |
| `hideAddToDashboardAction` | Hides the 'Add to Dashboard' action button |
| `spacingTop` | Top spacing for the chart (negative value moves it up) |
| `defaultChartStyle` | Default chart type to display - 'pie' in this case |
| `primaryChartStyle` | Primary chart style setting - overrides default if different |
| `legendItemDistance` | Spacing between legend items (negative brings them closer) |
| `marginLeft` | Left margin spacing for the chart |
| `legendAlignment` | Horizontal alignment of the legend - 'center', 'left', or 'right' |
| `xAxisConfig` | Configuration for X-axis (disabled for pie charts) |
| `reverseLegendOrder` | Whether to reverse the order of legend items |
| `isDynamicLabelColorInVariablePieChart` | Enables dynamic label colors in variable pie charts |
| `customiseTitlePosition` | Custom positioning for the chart title |
| `isVariablePieSliceVolumeConstant` | Keeps pie slice volume constant when variable |

## Summary Data Configuration

| Key | Description |
|-----|-------------|
| `summaryData` | Array of summary data configurations for different sentiment types |

### Each summaryData item contains:

| Key | Description |
|-----|-------------|
| `label` | Display label for the summary item |
| `dataKey` | Key to extract data value from API response |
| `showChange` | Whether to show change/growth indicators |
| `changeKey` | Key for accessing change/growth data |
| `compareDataKey` | Key for comparison data |
| `showChangeInPercent` | Whether to display change as percentage |
| `formatWithComma` | Whether to format numbers with comma separators |
| `isCustomLogicForPositiveOrNegativeClass` | Applies custom styling logic for positive/negative values |

## Series Details Configuration

| Key | Description |
|-----|-------------|
| `seriesDetails` | Array defining each data series in the pie chart |

### Each seriesDetails item contains:

| Key | Description |
|-----|-------------|
| `name` | Display name for the series/segment |
| `type` | Chart type - 'pie' for pie chart segments |
| `dataKey` | Key to extract series data from API response |
| `color` | Hex color code for the pie segment |
| `id` | Unique identifier for the series |

## Tooltip Configuration

| Key | Description |
|-----|-------------|
| `enableTooltip` | Enables tooltip display on hover |
| `tooltipFollowPointer` | Makes tooltip follow mouse pointer movement |
| `enabledSharedTooltip` | Enables shared tooltip across multiple series |
| `updateTooltipDotColorWithColumnColor` | Updates tooltip dot color to match column color |
| `addPositionerInTooltip` | Adds custom positioning logic for tooltips |
| `customToolTipFormatter` | Enables custom tooltip formatting function |
| `tooltipOutside` | Whether tooltip appears outside the chart area |
| `tooltipPositioner` | Custom function for tooltip positioning |
| `tooltipFormatter` | Custom function that defines tooltip HTML structure and content |

## Plot Data Configuration

| Key | Description |
|-----|-------------|
| `plotDataConfig` | Array of plot configuration for different chart types (unused for pie) |


| Key | Description |
|-----|-------------|
| `apiData` | Container for API response data structure |
| `summary` | Summary data containing actual and compare values |
| `actual` | Actual data values for the current period |
| `compare` | Comparison data values for the comparison period |
| `dataPoints` | Array of individual data points for chart rendering |
| `dateDiff` | Number of days difference in the date range |
| `groupByType` | Type of grouping applied to the data |
