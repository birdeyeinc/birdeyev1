import { baseConverter } from "../../common/converter";
import { getLegendDotColor } from "../../common/legend";
import { defaultShowToolTip } from "../../common/tooltip";
import { getSeriesDataForVariablePieChart, variablePiePlotData, redrawDatalabelsForVariableChart } from "./utils";


/**
 * Variable Pie Chart Configuration Utilities
 * Provides functions for generating Highcharts configuration for variable pie charts
 */

export const getSeriesData = (reportConfig) => {
  return getSeriesDataForVariablePieChart(reportConfig, "actual");
};

/**
 * Generate xAxis configuration for Highcharts variable pie charts
 */
const getxAxis = () => {
  return [
    {
      categories: null,
      tickInterval: "2"
    }
  ];
};

/**
 * Generate yAxis configuration with configurable title and labels
 */
const getyAxis = (reportConfig) => {
  const { parserConfig } = reportConfig || {};
  return {
    title: {
      text: parserConfig?.yAxisTitle || null,
      style: {
        color: parserConfig?.yAxisTitleColor || "#555"
      }
    },
    labels: {
      enabled: parserConfig?.yAxisLabelsEnabled !== undefined ? parserConfig.yAxisLabelsEnabled : false,
      style: {
        color: parserConfig?.yAxisLabelsColor || "#555"
      }
    }
  };
};

/**
 * Generate chart configuration with native Highcharts legend functionality
 */
const getChartOptions = (reportConfig) => {
  const { parserConfig } = reportConfig || {};
  const { primaryChartStyle } = parserConfig || {};
  const configOptions = parserConfig || {};
  
  return {
    type: configOptions?.chartType || "variablepie",
    marginTop: configOptions?.chartMarginTop || 0,
    animation: configOptions?.chartAnimation !== undefined ? configOptions.chartAnimation : false,
    events: {
      load: function() {
        redrawDatalabelsForVariableChart.call(this);
      },
      redraw: redrawDatalabelsForVariableChart
    },
    width: configOptions?.chartWidth || 501.5,
    height: configOptions?.chartHeight || 394,
    renderTo: `chart_${primaryChartStyle || 'insights-listings-status'}`
  };
};

const getTitle = (reportConfig) => {
  return {
    text: ""
  };
};

const getSubTitle = () => {
  return {};
};

/**
 * Generate plot options configuration for variable pie charts
 */
const getPlotOptions = (reportConfig, chartConfig) => {
  const plotData = variablePiePlotData({ reportDetails: reportConfig, chartConfig });
  return plotData;
};


/**
 * Generate legend configuration with custom formatter for Highcharts 11.2 variable pie compatibility
 */
const getLegend = (reportConfig, chartConfig) => {
  const { parserConfig } = reportConfig || {};
  
  return {
    enabled: parserConfig?.legendEnabled !== false,
    align: parserConfig?.legendAlignment || "center",
    layout: parserConfig?.legendLayout || 'horizontal',
    itemDistance: parserConfig?.legendItemDistance || -10,
    padding: parserConfig?.legendPadding || 0,
    symbolWidth: parserConfig?.legendSymbolWidth || 12,
    symbolHeight: parserConfig?.legendSymbolHeight || 12,
    symbolRadius: parserConfig?.legendSymbolRadius || 6,
    symbolPadding: parserConfig?.legendSymbolPadding || 5,
    itemStyle: {
      fontSize: parserConfig?.legendFontSize || '12px',
      fontWeight: parserConfig?.legendFontWeight || 400,
      color: parserConfig?.legendTextColor || '#333',
      cursor: 'pointer'
    },
    itemHoverStyle: {
      color: parserConfig?.legendHoverTextColor || '#000',
      fontWeight: '500'
    },
    itemHiddenStyle: {
      color: parserConfig?.legendHiddenTextColor || '#ccc',
      textDecoration: 'line-through'
    },
    // Use HTML formatter to show colored circles (required for Highcharts 11.2 variable pie)
    useHTML: true,
    labelFormatter: function() {
      const color = this.color || '#ccc';
      const name = this.name || '';
      const legendDotColor = getLegendDotColor(color);
      
      // Simple HTML structure with colored circle
      return `<span style="display:inline-flex;align-items:center;">
                <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${legendDotColor};margin-right:5px;"></span>
                <span>${name}</span>
              </span>`;
    },
    navigation: {
      enabled: false
    }
  };
};

/**
 * Generate tooltip configuration with custom formatter support
 */

export const getTooltip = (reportConfig, chartConfig) => {
      const tooltipClass = "";
      return defaultShowToolTip(tooltipClass, reportConfig, chartConfig);
};

const getColorAxis = () => null;
const getPane = () => null;
const getCredits = () => ({ enabled: false });
const getExporting = () => ({ enabled: false });
const getAccessibility = () => ({ enabled: false });

const fallbackFns = {
  getxAxis,
  getyAxis,
  getChartOptions,
  getTitle,
  getSubTitle,
  getPlotOptions,
  getLegend,
  getSeriesData,
  getTooltip,
  getColorAxis,
  getPane,
  getCredits,
  getExporting,
  getAccessibility,
};

/**
 * Configuration keys with order for variable pie chart generation
 */
const configKeysWithOrder = [
  { key: "xAxis", fn: "getxAxis", order: 1 },
  { key: "chart", fn: "getChartOptions", order: 2 },
  { key: "credits", fn: "getCredits", order: 3 },
  { key: "title", fn: "getTitle", order: 4 },
  { key: "subtitle", fn: "getSubTitle", order: 5 },
  { key: "plotOptions", fn: "getPlotOptions", order: 6 },
  { key: "yAxis", fn: "getyAxis", order: 7 },
  { key: "legend", fn: "getLegend", order: 8 },
  { key: "exporting", fn: "getExporting", order: 9 },
  { key: "series", fn: "getSeriesData", order: 10 },
  { key: "tooltip", fn: "getTooltip", order: 11 },
  { key: "accessibility", fn: "getAccessibility", order: 12 },
  { key: "colorAxis", fn: "getColorAxis", order: 13 },
  { key: "pane", fn: "getPane", order: 14 },
];

/**
 * Convert report configuration to Highcharts variable pie chart configuration
 */
export function converter(reportConfig) {
  return baseConverter(reportConfig, configKeysWithOrder, fallbackFns);
}
