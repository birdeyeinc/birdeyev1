import { forEach, isEmpty, merge } from "lodash";
import { defaultChartDataOptions, getDefaultChartOptions } from "../../common/chartOptions";
import { baseConverter } from "../../common/converter";
import { getCommonLegend } from "../../common/legend";
import { defaultSankeyPlotData } from "../../common/plotOptions";
import { defaultToolTipOptions, getDefaultSankeyChartTooltipNodeFormatter, getDefaultSankeyChartTooltipPointFormatter } from "../../common/tooltip";
/** ================================== Helpers ================================== */
const getCustomSankeyPlotOptions = (reportConfig, customSankeyPlotOptions) => {
    if (isEmpty(customSankeyPlotOptions)) {
        return {};
    }
    const sankeyAnimationObj = {
        duration: customSankeyPlotOptions?.animation !== undefined && customSankeyPlotOptions.animation === false ? 0 : 1000,
    };
    return {
        dataLabels: {
            enabled: customSankeyPlotOptions.dataLabels.enabled,
            rotation: 0,
            verticalAlign: customSankeyPlotOptions.dataLabels.verticalAlign || "top",
            useHTML: customSankeyPlotOptions.dataLabels.useHTML || false,
            nodeFormatter() {
                return customSankeyPlotOptions.dataLabels.nodeFormatter ? customSankeyPlotOptions.dataLabels.nodeFormatter(this, reportConfig) : this.point.name;
            },
            style: customSankeyPlotOptions.dataLabels.style,
            allowOverlap: customSankeyPlotOptions.dataLabels.allowOverlap,
            overflow: customSankeyPlotOptions.dataLabels.overflow,
            crop: customSankeyPlotOptions.dataLabels.crop,
            align: customSankeyPlotOptions.dataLabels.align,
        },
        minLinkWidth: customSankeyPlotOptions?.minLinkWidth || 1,
        states: customSankeyPlotOptions.states,
        point: customSankeyPlotOptions.point,
        animation: sankeyAnimationObj,
    };
};

const getSeriesDataForSankeyChart = (reportConfig) => {
    const { parserConfig, apiData, graphId, drillObj, disableDrill } = reportConfig || {};
    const { seriesDetails } = parserConfig || {};
    const series = [];
    const { dataKey } = seriesDetails?.[0] || {};
    const seriesObj = {
        ...(seriesDetails?.[0] || {}),
        nodes: [],
        data: [],
        columns: [],
        linkOpacity: 0.25,
    };
    const style = {};
    const nodeIds = apiData?.dataPoints.slice(1).reduce((acc, curr) => {
        if (curr?.nodes?.length) {
            curr.nodes.forEach((node) => {
                if (node.id) {
                    acc[node.label] = node.id;
                } else {
                    acc[node.label] = node.label;
                }
            });
        }
        return acc;
    }, {});
    forEach(apiData?.dataPoints, (datapointObj) => {
        const { nodes, column } = datapointObj || {};
        if (graphId === "call-ai-by-category-objective-and-outcomes" && column === 0 && drillObj?.objectiveId === "DEFAULT" && !disableDrill) {
            style["cursor"] = "pointer";
        }
        seriesObj.columns.push(datapointObj?.label);
        if (nodes?.length) {
            forEach(nodes, (node) => {
                const { label, links, colorCode, id } = node || {};
                seriesObj.nodes.push({
                    id: id || label,
                    name: label,
                    nodeId: id,
                    color: colorCode,
                    column,
                    dataLabels: {
                        x: column === apiData?.dataPoints?.length - 1 ? -25 : 25,
                        align: column === apiData?.dataPoints?.length - 1 ? "right" : "left",
                        style,
                    },
                    isDrillDown: drillObj?.objectiveId !== "DEFAULT" || disableDrill,
                });
                if (links?.length) {
                    forEach(links, (link) => {
                        seriesObj.data.push({
                            from: id || label, // The node that the link runs from.
                            to: nodeIds[link?.label], // The node that the link runs to.
                            weight: link?.[dataKey], // The weight of the link.
                        });
                    });
                }
            });
        }
    });
    if (graphId === "call-ai-by-category-objective-and-outcomes") {
        const attainedLinkIndex = seriesObj?.data?.findIndex((item) => item.to === "Attained");
        if (attainedLinkIndex > -1) {
            // To show Missed node always on top
            const newLinkData = { ...(seriesObj.data[attainedLinkIndex] || {}) };
            if (newLinkData) {
                newLinkData.from = "Missed";
                newLinkData.to = "Missed";
                newLinkData.weight = 0;
                seriesObj.data.unshift(newLinkData);
            }
        }
    }
    series.push(seriesObj);
    return series;
};
/** ================================== Main Config keys utilities ======================================= */
/**
 * Get the series data for the sankey chart.
 * @param {object} reportConfig - report config object
 * @returns {object} series data for the sankey chart
 * @see https://api.highcharts.com/highcharts/series.sankey
 */
const getSeriesData = (reportConfig) => {
    const { parserConfig, drillObj, updateDrillType, disableDrill } = reportConfig || {};
    const { getCustomSankeyChartHeight } = parserConfig || {};
    const sankeySeriesData = getSeriesDataForSankeyChart(reportConfig);
    if (getCustomSankeyChartHeight) {
        const { customMinLinkWidth } = getCustomSankeyChartHeight(reportConfig);
        if (customMinLinkWidth && sankeySeriesData?.length) {
            sankeySeriesData[0].minLinkWidth = customMinLinkWidth;
        }
    }
    return [
        {
            ...(sankeySeriesData[0] || {}),
            point: {
                events: {
                    click() {
                        if (this.column === 0 && updateDrillType && this.nodeId && drillObj?.objectiveId === "DEFAULT" && !disableDrill) {
                            updateDrillType({
                                column: this.column,
                                objectiveId: this.nodeId,
                                objective: this.name,
                            });
                        }
                    },
                },
            },
        },
    ];
};

/**
 * Get the chart options for the sankey chart.
 * @param {object} reportConfig - The report configuration object.
 * @param {object} chartConfig - The chart configuration object.
 * @returns {object} chart options for the sankey chart.
 * @see https://api.highcharts.com/highcharts/chart
 */
const getChartOptions = (reportConfig, chartConfig) => {
    const { parserConfig } = reportConfig || {};
    const { primaryChartStyle, getCustomSankeyChartHeight, sankeyChartAnimationOptions, sankeyChartCustomEvents } = parserConfig || {};
    const defaultSankeyChartOptions = {
        height: 460,
        animation: {
            duration: 300,
        },
        events: {
            render() {
                const labels = this.options.series[0].columns;
                const columnLength = labels.length;
                const COL_WIDTH = 20;
                const singleColWidth = (this.chartWidth - COL_WIDTH) / (columnLength - 1);
                let positions = [0, singleColWidth, singleColWidth * 2, singleColWidth * 3, singleColWidth * 4 - 52];
                if (columnLength === 4) {
                    positions = [0, singleColWidth, singleColWidth * 2, singleColWidth * 3 - 52];
                }
                if (columnLength === 3) {
                    positions = [0, singleColWidth, singleColWidth * 2 - 52];
                }
                if (this.customLabels) {
                    this.customLabels.forEach((label) => label.destroy());
                }
                this.customLabels = [];
                labels.forEach((label, i) => {
                    this.customLabels.push(
                        this.renderer
                            .text(label)
                            .attr({
                                x: positions[i],
                                y: 30,
                                align: "left",
                            })
                            .css({
                                zIndex: 1,
                                fontSize: "12px",
                            })
                            .add(),
                    );
                });
            },
        },
    };
    if (sankeyChartAnimationOptions) {
        defaultSankeyChartOptions.animation = sankeyChartAnimationOptions;
    }
    if (sankeyChartCustomEvents) {
        defaultSankeyChartOptions.events = { ...defaultSankeyChartOptions.events, ...sankeyChartCustomEvents };
    }
    if (getCustomSankeyChartHeight) {
        const { customHeight, customWidth } = getCustomSankeyChartHeight(reportConfig);
        if (customHeight) {
            defaultSankeyChartOptions.height = customHeight;
        }
        if (customWidth >= 0) {
            defaultSankeyChartOptions.width = customWidth;
        }
    }
    const modifiedChartParams = getDefaultChartOptions(reportConfig, chartConfig);
    return {
        renderTo: `chart_${primaryChartStyle}`,
        ...merge(defaultChartDataOptions(), modifiedChartParams, defaultSankeyChartOptions),
    };
};

/**
 * Get the default title configuration for Highcharts.
 * @returns default title configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/title
 */
const getTitle = () => {
    return {
        text: "",
        verticalAlign: "middle",
        y: -10,
    };
};

/**
 * Get the default subtitle configuration for Highcharts.
 * @returns default subtitle configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/subtitle
 */
const getSubTitle = () => {
    return {};
};

/**
 *
 * @param {object} reportConfig - The report configuration object.
 * @returns {object} plotOptions configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/plotOptions
 */
const getPlotOptions = (reportConfig) => {
    const {
        parserConfig: { plotDataConfig },
    } = reportConfig;
    const { sankey, ...rest } = plotDataConfig;
    const customSankeyPlotOptions = getCustomSankeyPlotOptions(reportConfig, sankey);
    const defaultPlotOptions = defaultSankeyPlotData();
    return {
        sankey: merge(defaultPlotOptions.sankey, customSankeyPlotOptions),
        ...rest,
    };
};

/**
 * Get the default legend configuration for Highcharts.
 * @param {object} reportConfig - The report configuration object.
 * @returns {object} legend configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/legend
 */
const getLegend = (reportConfig) => {
    return getCommonLegend(reportConfig);
};

/**
 * Get the default tooltip configuration for Highcharts.
 * @param {object} reportConfig - The report configuration object.
 * @param {object} chartConfig - The chart configuration object.
 * @returns {object} tooltip configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/tooltip
 */
export const getTooltip = (reportConfig, chartConfig) => {
    const defaultProperties = defaultToolTipOptions(true);
    const { parserConfig, hideSankeyTooltip } = reportConfig || {};
    const { customToolTipFormatter, customSankeyChartTooltipPointFormatter, customSankeyChartTooltipNodeFormatter } = parserConfig || {};
    const tooltipOptions = {
        ...defaultProperties,
        outside: true,
        enabled: hideSankeyTooltip ? false : true,
        padding: 0,
        followPointer: parserConfig?.tooltipFollowPointer,
        useHTML: true,
        headerFormat: null,
    };
    return Object.assign(tooltipOptions, {
        pointFormatter() {
            return customToolTipFormatter && customSankeyChartTooltipPointFormatter ? customSankeyChartTooltipPointFormatter.bind(this, reportConfig, chartConfig) : getDefaultSankeyChartTooltipPointFormatter.call(this);
        },
        nodeFormatter() {
            return customToolTipFormatter && customSankeyChartTooltipNodeFormatter ? customSankeyChartTooltipNodeFormatter.bind(this, reportConfig, chartConfig) : getDefaultSankeyChartTooltipNodeFormatter.call(this);
        },
    });
};

/**
 * Get the default xAxis configuration for Highcharts.
 * @returns null for xAxis as it is not required in sankey chart
 * @see https://api.highcharts.com/highcharts/xAxis
 */
const getxAxis = () => {
    return null;
};

/**
 * Get the default yAxis configuration for Highcharts.
 * @returns null for yAxis as it is not required in sankey chart
 * @see https://api.highcharts.com/highcharts/yAxis
 */
const getyAxis = () => {
    return null;
};

/**
 * Get the default colorAxis configuration for Highcharts.
 * @returns null for colorAxis as it is not required in sankey chart
 * @see https://api.highcharts.com/highcharts/colorAxis
 */
const getColorAxis = () => {
    return null;
};

/**
 * Get the default pane configuration for Highcharts.
 * @returns null for pane as it is not required in sankey chart
 * @see https://api.highcharts.com/highcharts/pane
 */
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
