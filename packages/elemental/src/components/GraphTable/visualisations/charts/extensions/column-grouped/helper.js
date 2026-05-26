import { checkIfCompareFilterIsApplied, formatNumberToUnits } from "components/GraphTable/common/helper";
import { merge } from "lodash";
import { defaultChartDataOptions, getDefaultChartOptions } from "../../common/chartOptions";
import { baseConverter } from "../../common/converter";
import { getCategories, getExtraData, getLongLabel, getxAxisOptions, getYAxisOptions } from "../../common/helper";
import { getCommonLegend } from "../../common/legend";
import { canToggleSeries, defaultBarPlotData, defaultColumnPlotData, getSeriesPlotOptions, handleReviewProjectedOnLegendClick } from "../../common/plotOptions";
import { assignYAxisToSeries, filterSeriesDetails, hasDataKeyInActualOrCompare } from "../../common/series";
import { defaultShowToolTip } from "../../common/tooltip";

const getCustomColumnPlot = (reportConfig) => {
    const { parserConfig } = reportConfig;
    const { plotDataConfig, enableDataLabelRotation, barGrouping, primaryChartStyle } = parserConfig;
    const plotData = plotDataConfig?.[primaryChartStyle] || {};
    const defaultColProperties = defaultColumnPlotData(reportConfig);
    const defaultBarProperties = defaultBarPlotData(reportConfig);
    let defaultProperties = {};
    if (defaultColProperties?.[primaryChartStyle]) {
        defaultProperties = defaultColProperties[primaryChartStyle];
    }
    if (defaultBarProperties?.[primaryChartStyle]) {
        defaultProperties = defaultBarProperties[primaryChartStyle];
    }
    const isLegendsDisable = parserConfig.disableLegends;
    const isCompareFilterApplied = checkIfCompareFilterIsApplied(reportConfig) && !parserConfig.disableCompareChart;

    const dataLabelRotation = plotData?.dataLabels?.rotation && enableDataLabelRotation ? plotData.dataLabels.rotation(getCategories(reportConfig)) : defaultProperties.plotData?.dataLabels?.rotation();

    return Object.assign({}, defaultProperties, {
        dataLabels: {
            enabled: false,
            rotation: dataLabelRotation,
            y: plotData.dataLabels.y ? (isCompareFilterApplied ? plotData.dataLabels.y - 10 : plotData.dataLabels.y - 5) : null,
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
        className: "",
        grouping: barGrouping ? false : undefined,
        events: Object.assign({}, defaultProperties.events, {
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
    const series = [];
    const { parserConfig, apiData } = reportConfig || {};
    const { showExtraDataOnTooltip, seriesDetails, groupedDataLabel } = parserConfig || {};
    const { dataPoints } = apiData || {};
    const disabledSeriesData = reportConfig?.disabledSeriesData;
    const isComparisonFilterApplied = checkIfCompareFilterIsApplied(reportConfig);
    let updatedSeriesDetails = seriesDetails;
    if (disabledSeriesData) {
        const filtered = filterSeriesDetails(seriesDetails, disabledSeriesData, parserConfig);
        updatedSeriesDetails = filtered.filtered;
    }
    // ...existing code for filtering dataPoints for custom charts and matrix reports...
    updatedSeriesDetails = assignYAxisToSeries(updatedSeriesDetails);
    const groupedSeriesDetails = updatedSeriesDetails?.filter((item) => item.isGroupingSeries);

    updatedSeriesDetails?.forEach((item) => {
        // All the logic for obj, compareDataObj, data, compareData, and pushing to series
        // Move the entire forEach body from getSeriesData here, using the passed-in arguments
        // Use assignSentimentColors, getExtraData, getLongLabel, etc. as needed
        // At the end, push compareDataObj and obj to series as in the original
        const hasDataKey = hasDataKeyInActualOrCompare(dataPoints, item);
        const obj = {
            name: item.name,
            type: item.type,
            color: item.color,
            id: item.id,
            maxPointWidth: item.maxPointWidth || 20,
            showInLegend: hasDataKey ? item.showInLegend : false,
            stack: "stack1",
            legendIndex: item.legendIndex,
            toolTipLabel: item.toolTipLabel,
            removePercentIconFromTooltip: item.removePercentIconFromTooltip,
            enableMarkerOnDistortedPoints: item.enableMarkerOnDistortedPoints,
            ...(item?.fillColor && { fillColor: item?.fillColor }),
            ...(item?.zIndex ? { zIndex: item?.zIndex } : {}),
        };

        if (item?.hideDataLabels) {
            obj["dataLabels"] = {};
            obj["dataLabels"]["enabled"] = false;
        }

        if (item.yAxis) {
            obj["yAxis"] = item.yAxis;
        }
        if (item.tickPositions) {
            obj["tickPositions"] = item.tickPositions;
        }
        if (item.dataKey || item.compareDataKey) {
            obj["dataKey"] = item.dataKey;
        }
        const data = [];
        if (dataPoints?.length) {
            dataPoints.forEach((dataPointObj) => {
                const dataLabel = groupedDataLabel ? groupedDataLabel : dataPointObj?.actual?.label;
                data.push({
                    y: dataPointObj?.actual?.[item.dataKey] || null,
                    label: dataLabel,
                    groupedDataLabel,
                    extraData: getExtraData(item, showExtraDataOnTooltip, dataPointObj, "actual", parserConfig, isComparisonFilterApplied),
                    longLabel: getLongLabel(dataPointObj, reportConfig),
                });
            });
        }
        obj["data"] = data;
        series.push(obj);
    });

    groupedSeriesDetails;
    return series;
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
    const categoriesList = reportConfig?.parserConfig?.categoriesList || [];
    return merge(getxAxisOptions(reportConfig), { categories: categoriesList });
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
    const { series, column, bar, ...rest } = plotDataConfig;

    return {
        series: merge(getSeriesPlotOptions(reportConfig), series),
        column: merge(getCustomColumnPlot(reportConfig), column),
        bar: merge(getCustomColumnPlot(reportConfig), bar),
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
