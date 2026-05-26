import { merge } from "lodash";
import { defaultChartDataOptions, getDefaultChartOptions } from "../../common/chartOptions";
import { baseConverter } from "../../common/converter";
import { getxAxisOptions, getYAxisOptions } from "../../common/helper";
import { getCommonLegend } from "../../common/legend";
import { defaultColumnPlotData, getSeriesPlotOptions, handleReviewProjectedOnLegendClick } from "../../common/plotOptions";
import { defaultShowToolTip } from "../../common/tooltip";
import { getCommonSeriesData } from "../../common/series";
import { checkIfCompareFilterIsApplied, formatNumberToUnits, getDecimaledValue } from "components/GraphTable/common/helper";

const getCustomBarPlotOptions = (reportConfig, extraData) => {
    const { parserConfig, chartDisplayType } = reportConfig;
    const {
        plotDataConfig: { bar },
        showGridLines,
        isDataLablePercent,
    } = parserConfig;
    const defaultProperties = defaultColumnPlotData(reportConfig);
    const isLegendsDisable = parserConfig.disableLegends;
    const isCompareFilterApplied = checkIfCompareFilterIsApplied(reportConfig) && !parserConfig.disableCompareChart;
    const categoriesLength = extraData?.xAxis?.categories?.length || 0;
    const tickInterval = categoriesLength ? categoriesLength : 1;
    return Object.assign({}, defaultProperties.column, {
        dataLabels: {
            enabled: showGridLines ? false : bar.dataLabels.enabled,
            verticalAlign: bar.dataLabels.verticalAlign ? bar.dataLabels.verticalAlign : "top",
            y: bar.dataLabels.y ? bar.dataLabels.y : null,
            formatter() {
                if ((!tickInterval || this.point.x % tickInterval == 0) && isDataLablePercent) {
                    return bar.dataLabels.formatter ? bar.dataLabels.formatter(this.y, chartDisplayType) + "%" : formatNumberToUnits(this.y) + "%";
                } else {
                    if (this?.series?.name === "Rating") {
                        const data = bar.dataLabels.formatter ? bar.dataLabels.formatter(this.y, chartDisplayType) : formatNumberToUnits(this.y);
                        const newData = Number(data);
                        const finalData = getDecimaledValue(newData);
                        return finalData;
                    } else {
                        return bar.dataLabels.formatter ? bar.dataLabels.formatter(bar.dataLabels.percentage ? this.point.extraData : this.y, chartDisplayType) : formatNumberToUnits(this.y);
                    }
                }
            },
            style: {
                color: bar.dataLabels.color,
                fontSize: bar.dataLabels.fontSize,
                fontWeight: bar.dataLabels.fontWeight,
            },
            useHTML: bar?.dataLabels?.useHTML,
        },
        inside: bar.inside,
        className: bar.isStroked ? "stack-stroked" : "",
        stacking: isCompareFilterApplied ? bar.compareStacking : bar.stacking,
        events: Object.assign({}, defaultProperties.column.events, {
            legendItemClick() {
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
        cursor: bar.cursor || "pointer",
        ...(bar?.point ? { point: bar?.point } : {}),
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
const getPlotOptions = (reportConfig, extraData) => {
    const {
        parserConfig: { plotDataConfig },
    } = reportConfig;
    const { series, bar, ...rest } = plotDataConfig;

    return {
        series: merge(getSeriesPlotOptions(reportConfig), series),
        bar: merge(getCustomBarPlotOptions(reportConfig, extraData), bar),
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
    { key: "xAxis", fn: "getxAxis", order: 4 },
    { key: "yAxis", fn: "getyAxis", order: 5 },
    { key: "plotOptions", fn: "getPlotOptions", order: 6 },
    { key: "tooltip", fn: "getTooltip", order: 7 },
    { key: "pane", fn: "getPane", order: 8 },
    { key: "colorAxis", fn: "getColorAxis", order: 9 },
    { key: "chart", fn: "getChartOptions", order: 10 },
    { key: "legend", fn: "getLegend", order: 11 },
];

export function converter(reportConfig) {
    return baseConverter(reportConfig, configKeysWithOrder, fallbackFns);
}
