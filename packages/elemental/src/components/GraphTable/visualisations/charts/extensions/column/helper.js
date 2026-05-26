import { merge } from "lodash";
import { baseConverter } from "../../common/converter";
import { defaultShowToolTip } from "../../common/tooltip";
import { defaultChartDataOptions, getDefaultChartOptions } from "../../common/chartOptions";
import { getCommonLegend } from "../../common/legend";
import { canToggleSeries, defaultColumnPlotData, getSeriesPlotOptions, handleReviewProjectedOnLegendClick } from "../../common/plotOptions";
import { checkIfCompareFilterIsApplied, formatNumberToUnits } from "components/GraphTable/common/helper";
import { getCommonSeriesData } from "../../common/series";
import { getCategories, getxAxisOptions, getYAxisOptions } from "../../common/helper";

const getColumnSplinePlot = (reportConfig) => {
    const { parserConfig } = reportConfig;
    const {
        plotDataConfig: { column },
        enableDataLabelRotation,
    } = parserConfig;
    const defaultProperties = defaultColumnPlotData(reportConfig);
    const isLegendsDisable = parserConfig.disableLegends;
    const isCompareFilterApplied = checkIfCompareFilterIsApplied(reportConfig) && !parserConfig.disableCompareChart;
    return Object.assign({}, defaultProperties.column, {
        dataLabels: {
            enabled: false,
            rotation: column?.dataLabels?.rotation && enableDataLabelRotation ? column.dataLabels.rotation(getCategories(reportConfig)) : defaultProperties.column?.dataLabels?.rotation(),
            verticalAlign: "top",
            y: column.dataLabels.y ? (isCompareFilterApplied ? column.dataLabels.y - 10 : column.dataLabels.y - 5) : null,
            formatter() {
                return formatNumberToUnits(this.y);
            },
            style: {
                color: "#212121",
                fontSize: "12px",
                fontWeight: 400,
            },
        },
        inside: false,
        stacking: "normal",
        className: "",
        events: Object.assign({}, defaultProperties.column.events, {
            legendItemClick() {
                if (!canToggleSeries(this)) return false;

                if (isCompareFilterApplied || isLegendsDisable) {
                    return false;
                }

                const series = this;
                let visibleSeriesCount = 0;
                const seriesArr = this.chart.series;
                const isVisible = series.visible;
                for (let i = 0; i < seriesArr.length; i++) {
                    if (seriesArr[i].visible && seriesArr[i].name !== "Reviews Projected") {
                        visibleSeriesCount++;
                    }
                }
                if (visibleSeriesCount === 1 && isVisible) {
                    return false;
                }

                handleReviewProjectedOnLegendClick(this, reportConfig);
            },
        }),
    });
};

/** ================================== Main Config keys utilities ======================================= */

export const getSeriesData = (reportConfig) => {
    return getCommonSeriesData(reportConfig);
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
    const { series, column, ...rest } = plotDataConfig;

    return {
        series: merge(getSeriesPlotOptions(reportConfig), series),
        column: merge(getColumnSplinePlot(reportConfig), column),
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
