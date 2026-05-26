import { merge } from "lodash";
import { defaultChartDataOptions, getDefaultChartOptions } from "../../common/chartOptions";
import { baseConverter } from "../../common/converter";
import { getxAxisOptions, getYAxisOptions } from "../../common/helper";
import { getCommonLegend } from "../../common/legend";
import { getSeriesPlotOptions } from "../../common/plotOptions";
import { defaultShowToolTip } from "../../common/tooltip";
import { getCommonSeriesData } from "../../common/series";

const getAreaSplinePlot = () => {
    return {
        dataLabels: {
            allowOverlap: false,
            crop: false,
            overflow: "none",
            inside: false,
        },
        labelRank: 5,
        turboThreshold: 0,
        animation: false,
        borderRadiusTopLeft: 4,
        borderRadiusTopRight: 4,
        states: {
            hover: {
                enabled: true,
                radius: 3,
            },
            inactive: {
                halo: null,
            },
        },
        events: {},
        stacking: null,
        pointWidth: 20,
        marker: {
            enabled: false,
            radius: 3,
            symbol: "circle",
            lineColor: null,
            lineWidth: 0,
        },
        minPointLength: 3,
        stickyTracking: true,
        pointPadding: 0.25,
        groupPadding: 0.2,
        lineWidth: 2,
        clip: false,
        cursor: "default",
    };
};

/** ================================== Main Config keys utilities ======================================= */

export const getSeriesData = (reportConfig) => {
    return getCommonSeriesData(reportConfig)
};

/**
 * Default function to generate xAxis configuration for Highcharts.
 * This will only be used if `parserConfig.utilityFns.getxAxis` is not provided.
 *
 * @param {Object} reportConfig - The report configuration object.
 * @returns {Object} xAxis configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/xAxis for available options.
 */
const getxAxis = (reportConfig) => {
    return getxAxisOptions(reportConfig);
};

const getyAxis = (reportConfig, extraData) => {
    return getYAxisOptions(reportConfig, extraData);
};

const getChartOptions = (reportConfig, chartConfig) => {
    const { parserConfig } = reportConfig || {};
    const { primaryChartStyle } = parserConfig || {};
    return {
        renderTo: `chart_${primaryChartStyle}`,
        ...merge(defaultChartDataOptions(), getDefaultChartOptions(reportConfig, chartConfig)),
    };
};

const getTitle = () => {
    return {
        text: "",
        verticalAlign: "middle",
        y: -10,
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
const getPlotOptions = (reportConfig) => {
    const {
        parserConfig: { plotDataConfig },
    } = reportConfig;
    const { series, ...rest } = plotDataConfig;

    return {
        series: merge(getSeriesPlotOptions(reportConfig), series),
        areaspline: getAreaSplinePlot(),
        ...rest,
    };
};

const getLegend = (reportConfig) => {
    return getCommonLegend(reportConfig);
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
