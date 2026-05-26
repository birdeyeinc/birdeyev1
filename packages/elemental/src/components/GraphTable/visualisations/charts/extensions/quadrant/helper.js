import { forEach, isEmpty, merge } from "lodash";
import { defaultChartDataOptions, getDefaultChartOptions } from "../../common/chartOptions";
import { baseConverter } from "../../common/converter";
import { getCommonLegend } from "../../common/legend";
import { defaultToolTipOptions } from "../../common/tooltip";

/** ================================== Helpers ================================== */

/**
 * Get series data for bubble chart
 * @param {object} reportConfig - report config object
 * @returns {array} series data for bubble chart
 */
const getSeriesDataForBubbleChart = (reportConfig) => {
    const { parserConfig, apiData } = reportConfig || {};
    const { seriesDetails, plotDataConfig } = parserConfig || {};

    const series = [];

    // Marker customization from plotDataConfig (size + shape)
    const markerConfig = plotDataConfig?.[0]?.marker || null;

    forEach(apiData?.dataPoints, (dataPoint) => {
        const { id, name, data, color, initials, logoUrl } = dataPoint || {};

        const seriesConfig =
            seriesDetails?.find(s => s.id === id || s.name === name) ||
            seriesDetails?.[0] ||
            {};

        // Transform each bubble point
        const transformedData = data.map(point => ({
            x: point[0],
            y: point[1],
            z: point[2],
            name: point[3] || initials || name.substring(0, 2).toUpperCase(),
            color: color || seriesConfig.color,
            logoUrl,
            ...dataPoint
        }));

        const seriesObject = {
            type: "bubble",
            name,
            id,
            data: transformedData,
            color: color || seriesConfig.color,
            showInLegend:
                seriesConfig.showInLegend !== undefined
                    ? seriesConfig.showInLegend
                    : true,
            enableMouseTracking: true
        };

        // -------------------------------
        // ⭐ BASIC DOT MARKERS (3px etc)
        // -------------------------------
        
        if (markerConfig) {
            // User-defined marker size + shape
            seriesObject.marker = {
                symbol: markerConfig.symbol || "circle",
                width: markerConfig.width || 3,
                height: markerConfig.height || 3,
                lineWidth: 0,
                fillOpacity: 1
            };
        } else {
            // Default 3px dots
            seriesObject.marker = {
                enabled: true,
                symbol: "circle",
                width: 3,
                height: 3,
                radius: 1.5, // matches 3px
                lineWidth: 0,
                fillOpacity: 1   
            };
        }

        // Remove dataLabels COMPLETELY
        seriesObject.dataLabels = {
            enabled: false
        };

        series.push(seriesObject);
    });

    return series;
};



/** ================================== Main Config keys utilities ======================================= */

/**
 * Get the series data for the bubble chart.
 * @param {object} reportConfig - report config object
 * @returns {array} series data for the bubble chart
 * @see https://api.highcharts.com/highcharts/series.bubble
 */
const getSeriesData = (reportConfig) => {
    return getSeriesDataForBubbleChart(reportConfig);
};

/**
 * Get the chart options for the bubble chart.
 * @param {object} reportConfig - The report configuration object.
 * @param {object} chartConfig - The chart configuration object.
 * @returns {object} chart options for the bubble chart.
 * @see https://api.highcharts.com/highcharts/chart
 */
const getChartOptions = (reportConfig, chartConfig) => {
    const { parserConfig } = reportConfig || {};
    const { primaryChartStyle, bubbleChartConfig } = parserConfig || {};

    return {
        renderTo: `chart_${primaryChartStyle}`,
        type: "bubble",
        spacingTop: 10,
        marginTop: 0,
      };
    
};

/**
 * Get the title configuration for bubble chart.
 * @param {object} reportConfig - The report configuration object.
 * @returns {object} title configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/title
 */
const getTitle = (reportConfig) => {
    const { heading } = reportConfig || {};
    return {
        text: heading || "",
        align: 'left',
        style: {
            fontSize: '16px',
            fontWeight: '500'
        }
    };
};

/**
 * Get the subtitle configuration for bubble chart.
 * @returns {object} subtitle configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/subtitle
 */
const getSubTitle = () => {
    return {
        text: ''
    };
};

/**
 * Get the xAxis configuration for bubble chart.
 * @param {object} reportConfig - The report configuration object.
 * @returns {object} xAxis configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/xAxis
 */
const getxAxis = (reportConfig) => {
    const { parserConfig } = reportConfig || {};
    const { xAxisConfig } = parserConfig || {};
    
    if (!xAxisConfig) {
        return {
            gridLineWidth: 0,
            lineWidth: 0,  // Hide x-axis line
            title: {
                text: parserConfig?.xAxisText || 'X Axis',
            },
            min: 0,
            max: 5,
            tickInterval: 1
        };
    }
    
    return {
        gridLineWidth: xAxisConfig.gridLineWidth !== undefined ? xAxisConfig.gridLineWidth : 0,
        lineWidth: 0,  // Hide x-axis line
        title: {
            text: xAxisConfig.title || parserConfig?.xAxisText || 'X Axis',
            style: {
                fontSize: '12px',
                fontWeight: '500'
            }
        },
        min: xAxisConfig.min !== undefined ? xAxisConfig.min : 0,
        max: xAxisConfig.max !== undefined ? xAxisConfig.max : 5,
        tickInterval: xAxisConfig.tickInterval !== undefined ? xAxisConfig.tickInterval : 1,
        plotBands: xAxisConfig.plotBands || [],
        labels: {
            style: {
                fontSize: '11px'
            }
        }
    };
};

/**
 * Get the yAxis configuration for bubble chart.
 * @param {object} reportConfig - The report configuration object.
 * @returns {object} yAxis configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/yAxis
 */
const getyAxis = (reportConfig) => {
    const { parserConfig, yAxisOptions } = reportConfig || {};
    const { yAxisConfig } = parserConfig || {};
    const { leftYAxisOptions } = yAxisOptions || {};
    
    if (!yAxisConfig && !leftYAxisOptions) {
        return {
            gridLineWidth: 0,  // Hide grid lines
            title: {
                text: parserConfig?.yAxisText || 'Y Axis'
            },
            min: 0
        };
    }
    
    const config = yAxisConfig || {};
    const label = leftYAxisOptions?.label || config.title || parserConfig?.yAxisText || 'Y Axis';
    
    return {
        gridLineWidth: 0,  // Changed from default to 0 - removes horizontal grid lines
        startOnTick: config.startOnTick !== undefined ? config.startOnTick : false,
        endOnTick: config.endOnTick !== undefined ? config.endOnTick : false,
        title: {
            text: label,
            style: {
                fontSize: '12px',
                fontWeight: '500'
            }
        },
        min: leftYAxisOptions?.min || config.min || 0,
        max: leftYAxisOptions?.max || config.max,
        // plotBands: config.plotBands || [],
        labels: {
            style: {
                fontSize: '11px'
            }
        }
    };
};
/**
 * Get the plotOptions for bubble chart.
 * @param {object} reportConfig - The report configuration object.
 * @returns {object} plotOptions configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/plotOptions
 */
const getPlotOptions = (reportConfig) => {
    const { parserConfig } = reportConfig || {};
    const { bubbleChartConfig, plotDataConfig } = parserConfig || {};
    
    // Get config from plotDataConfig if provided
    const maxSizeConfig = plotDataConfig?.[0]?.maxSize || 10;
    const stickyTrackingConfig = plotDataConfig?.[0]?.stickyTracking;
    const jitterConfig = plotDataConfig?.[0]?.jitter;
    const stackingConfig = plotDataConfig?.[0]?.stacking;
    
    return {
        bubble: {
            minSize: bubbleChartConfig?.minSize || 36,
            maxSize: maxSizeConfig !== undefined ? maxSizeConfig : (bubbleChartConfig?.maxSize || 3),
            stickyTracking: stickyTrackingConfig !== undefined ? stickyTrackingConfig : false,
            jitter: jitterConfig,
            stacking: stackingConfig,
            // Don't set dataLabels here - let series-level config take precedence
        },
    };
};

/**
 * Get the legend configuration for bubble chart.
 * @param {object} reportConfig - The report configuration object.
 * @returns {object} legend configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/legend
 */
const getLegend = (reportConfig) => {
    const { parserConfig } = reportConfig || {};
    const { legendConfig } = parserConfig || {};
    
    const defaultLegend = getCommonLegend(reportConfig);
    
    if (!legendConfig) {
        return {
            ...defaultLegend,
            align: 'left',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            itemStyle: {
                fontSize: '12px',
                fontWeight: 'normal'
            }
        };
    }
    
    return merge(defaultLegend, legendConfig);
};

/**
 * Get the tooltip configuration for bubble chart.
 * @param {object} reportConfig - The report configuration object.
 * @param {object} chartConfig - The chart configuration object.
 * @returns {object} tooltip configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/tooltip
 */
export const getTooltip = (reportConfig, chartConfig) => {
    const { parserConfig } = reportConfig || {};
    const { customToolTipFormatter, tooltipFormatter, tooltipFollowPointer } = parserConfig || {};
    
    const defaultProperties = defaultToolTipOptions(true);
    
    const tooltipOptions = {
        ...defaultProperties,
        useHTML: true,
        followPointer: tooltipFollowPointer !== undefined ? tooltipFollowPointer : true,
        padding: 8,
        borderRadius: 4,
        borderWidth: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        shadow: true,
        style: {
            fontSize: '12px'
        }
    };
    
    if (customToolTipFormatter && tooltipFormatter) {
        return Object.assign(tooltipOptions, {
            formatter() {
                return tooltipFormatter(this.point);
            }
        });
    }
    
    // Default tooltip formatter
    return Object.assign(tooltipOptions, {
        formatter() {
            return `
                <div style="padding: 4px;">
                    <strong>${this.series.name}</strong><br/>
                    <span>X: ${this.x}</span><br/>
                    <span>Y: ${this.y}</span>
                </div>
            `;
        }
    });
};

/**
 * Get annotations for quadrant labels
 * @param {object} reportConfig - The report configuration object.
 * @returns {array} annotations configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/annotations
 */
const getAnnotations = (reportConfig) => {
    const { parserConfig } = reportConfig || {};
    const { quadrantLabels } = parserConfig || {};
    
    if (!quadrantLabels || !quadrantLabels.length) {
        return [];
    }
    
    return [{
        draggable: '',
        labelOptions: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            useHTML: false,
            allowOverlap: true,
            crop: false,
            overflow: 'allow'
        },
        labels: quadrantLabels.map(label => ({
            point: {
                x: label.x,
                y: label.y,
                xAxis: 0,
                yAxis: 0
            },
            useHTML: false,
            text: label.text,
            backgroundColor: label.backgroundColor,
            borderRadius: label.borderRadius || 5,
            padding: label.padding || 8,
            allowOverlap: true,
            crop: false,
            overflow: 'allow',
            style: {
                color: label.color || '#fff',
                fontSize: label.fontSize || '11px',
                fontWeight: label.fontWeight || 'bold'
            }
        }))
    }];
};

/**
 * Get the colorAxis configuration.
 * @returns {null} colorAxis not needed for bubble chart
 * @see https://api.highcharts.com/highcharts/colorAxis
 */
const getColorAxis = () => {
    return null;
};

/**
 * Get the pane configuration.
 * @returns {null} pane not needed for bubble chart
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
    getAnnotations
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
    { key: "annotations", fn: "getAnnotations", order: 12 }
];

export function converter(reportConfig) {
    return baseConverter(reportConfig, configKeysWithOrder, fallbackFns);
}