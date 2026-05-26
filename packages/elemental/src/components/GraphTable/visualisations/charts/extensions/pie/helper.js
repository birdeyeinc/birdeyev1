import { baseConverter } from "../../common/converter";
import { getLegendDotColor } from "../../common/legend";
import { defaultShowToolTip } from "../../common/tooltip";
import { getSeriesDataForPieChart, getTitleForPie, pieplotData } from "./utils";
import { gray300 } from "sass/js/colors";


/** ================================== Main Config keys utilities ======================================= */

export const getSeriesData = (reportConfig) => {
  return getSeriesDataForPieChart(reportConfig, "actual");
};

/**
 * Default function to generate xAxis configuration for Highcharts.
 * This will only be used if `parserConfig.utilityFns.getxAxis` is not provided.
 *
 * @param {Object} reportConfig - The report configuration object.
 * @returns {Object} xAxis configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/xAxis for available options.
 */
const getxAxis = () => {
  return {
    categories: null,
    tickInterval: 2,
  };
};

const getyAxis = () => {
  return {
    title: {
      text: null,
      style: {
        color: gray300,
      },
    },
    labels: {
      enabled: false,
      style: {
        color: gray300,
        //fontWeight: 300
      },
      formatter() {
        return this.value ? this.value.toLocaleString("en") : this.value;
      },
    },
  };
};

const getChartOptions = (reportConfig) => {
  const { parserConfig } = reportConfig || {};
  const { primaryChartStyle } = parserConfig || {};
  return {
    renderTo: `chart_${primaryChartStyle}`,
    type: "pie",
    spacingTop: 10,
    marginTop: 0,
  };
};

const getTitle = (reportConfig) => {
  const { parserConfig } = reportConfig || {};
  const { disablePieTitle } = parserConfig || {};
  return {
    useHTML: true,
    text: disablePieTitle ? null : getTitleForPie(reportConfig, "actual"),
    align: "center",
    verticalAlign: "middle",
    y: 10,
  };
};

const getSubTitle = () => {
  return {};
};

/**
 *
 * @param {Object} reportConfig - The report configuration object.
 * @returns {Object} plotOptions configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/plotOptions
 */
const getPlotOptions = (reportConfig, chartConfig) => {
  return {
    pie: pieplotData(reportConfig, chartConfig),
  };
};

const getLegend = (reportConfig, chartConfig) => {
  const { parserConfig } = reportConfig || {};
  const noData = chartConfig?.series[0]?.["noData"] || false;
  return {
    align: parserConfig?.legendAlignment
      ? parserConfig?.legendAlignment
      : "left",
    enabled: !noData,
    padding: 0,
    useHTML: true,
    itemStyle: {
      fontSize: '12px',
      fontWeight: 400,
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    labelFormatter() {
      const color = this.color;
      const name = this.name;
      const legendDotColor = getLegendDotColor(color);
      return `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${legendDotColor};">
      </span><span style="font-size:12px;font-weight:400;vertical-align:middle;">${name}</span>`;
    },
    reversed: parserConfig.reverseLegendOrder
      ? parserConfig.reverseLegendOrder
      : false,
    ...(parserConfig?.legendItemDistance
      ? { itemDistance: parserConfig?.legendItemDistance }
      : { itemDistance: 8 }),
  };
};

export const getTooltip = (reportConfig, chartConfig) => {
  const tooltipClass = "";
  return defaultShowToolTip(tooltipClass, reportConfig, chartConfig);
};

const getColorAxis = () => {
  return null;
};

const getPane = () => {
  return null;
};

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
};

const configKeysWithOrder = [
  { key: "title", fn: "getTitle", order: 1 },
  { key: "subtitle", fn: "getSubTitle", order: 2 },
  { key: "series", fn: "getSeriesData", order: 3 },
  { key: "plotOptions", fn: "getPlotOptions", order: 4 },
  { key: "xAxis", fn: "getxAxis", order: 5 },
  { key: "yAxis", fn: "getyAxis", order: 6 },
  { key: "tooltip", fn: "getTooltip", order: 7 },
  { key: "pane", fn: "getPane", order: 8 },
  { key: "colorAxis", fn: "getColorAxis", order: 9 },
  { key: "chart", fn: "getChartOptions", order: 10 },
  { key: "legend", fn: "getLegend", order: 11 },
];

export function converter(reportConfig) {
  return baseConverter(reportConfig, configKeysWithOrder, fallbackFns);
}
