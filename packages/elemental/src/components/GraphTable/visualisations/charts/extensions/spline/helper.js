import { merge } from "lodash";
import { baseConverter } from "../../common/converter";
import { defaultShowToolTip } from "../../common/tooltip";
import { defaultChartDataOptions, getDefaultChartOptions } from "../../common/chartOptions";
import { getCommonLegend } from "../../common/legend";
import { canToggleSeries, defaultColumnPlotData, getSeriesPlotOptions, handleReviewProjectedOnLegendClick } from "../../common/plotOptions";
import { getCommonSeriesData } from "../../common/series";
import { getCategories, getxAxisOptions, getYAxisOptions } from "../../common/helper";
import { checkIfCompareFilterIsApplied, formatNumberToUnits, getDecimaledValue } from "components/GraphTable/common/helper";
import { VISUALIZATIONS_SHORT_CODES } from "components/GraphTable/common/constants";

const { VERTICAL_BAR_CHART, HORIZONTAL_BAR_CHART } = VISUALIZATIONS_SHORT_CODES;

const getSplinePlot = (reportConfig) => {
    const { parserConfig } = reportConfig;
    const {
        plotDataConfig: { spline },
    } = parserConfig;
    const tickInterval = 1;
    const categories = getCategories(reportConfig);
    const categoriesLength = categories?.length;
    const isLegendsDisable = parserConfig.disableLegends;
    const isCompareFilterApplied = checkIfCompareFilterIsApplied(reportConfig);
    const primaryChartStyle = parserConfig.primaryChartStyle;
    const defaultProperties = defaultColumnPlotData(reportConfig);
    return Object.assign({}, defaultProperties.column, {
        dataLabels: Object.assign({}, defaultProperties.column.dataLabels, {
            verticalAlign: "middle",
            color: "#ffffff",
            allowOverlap: true,
            zIndex: 6,
            style: {
                fontSize: "12px",
                fontWeight: 400,
            },
            y: -1,
            x: -1,
            formatter() {
                if (!tickInterval || this.point.x % tickInterval == 0) {
                    const data = spline?.dataLabels.formatter ? spline?.dataLabels.formatter(this.y, this?.series?.name) : formatNumberToUnits(this.y);
                    if (this?.series?.name === "Rating") {
                        const newData = Number(data);
                        const finalData = getDecimaledValue(newData);
                        return finalData;
                    } else {
                        return data;
                    }
                }
            },
            enabled: false,
        }),
        marker: {
            enabled: categoriesLength === 1 ? (spline?.marker?.enabled !== undefined ? spline?.marker?.enabled : true) : false, //BIRD-34189(Soumya) : Added option to disable markers in case of line chart
            // radius: primaryChartStyle == LINE_CHART ? 3 : item.marker.radius(categories, isCompareFilterApplied, primaryChartStyle),
            symbol: "circle",
            ...(!spline?.marker?.disableCustomMarker && !isCompareFilterApplied && [VERTICAL_BAR_CHART, HORIZONTAL_BAR_CHART].includes(primaryChartStyle)
                ? {
                      symbol: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAsCAYAAADy8T8XAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQeSURBVHgB7Zs/TFNBHMd/ZXER0kETYh3egAEmnokNm3bUxASIOAER4iJEg0wMDrSDgy5ITHATjOiCiXQwMj7dQBLrghAYaiKERIYGXJzw973evXe0fe1ry9A/901+vXuvrwwffne/u9/9Xoiq0MnJSZibGNsNNovNZgtLq0Vl2NKyTbF9YXNCoVCGKlSIKhCDi3EzQx6wetcK2xsGuUJlqiyADK6fm1nKepvQt9Rv2t455HaPtnb/0PHff8JqUa3nz9Gl9jaKsHV2XKDo1QhF7cv6I2m2BINcDPo3AwFkcBY3C5QdrgLQ0nKK3n5I1SysoALQqB2hibFe0ZfC8B5gkOlSvy8JkOFNchNnCwPWq4U1Aa4R1XezWweJeRHe+KLYb4oCZHiY5+Low+PmF9fq3uNKCfAmRnup71a3uhVniAm/530B6vCev/zasF7np+FBm6YfXVeXvhALAlTw4G2TTz6JQNGMQqB5PXeH2jj4kA/EPIByzhPjfvD+e9rePaRmFgIMIEpN5c6JLfqFjLZx9DFsmx0ehOXZM2YhNSMZuWrJef4jWzj5ebPp5rxiWmIWCKKU3TQs6N+5AJnsKDf2/sERR9t1MjotrECOsiuQmNxQCOkeOCMe5HUeIBqdlloDS82qjgAoiVoAl1z9SUaFhaEsvdCS+QDXA+/hY94jbOSjd8tubBAjtkWmpMSYRsQxKi4tuNpgBw+M4QqLZTP3lRbmQrmxELlQD+B3431BtbXjro8FwB70tjmXZxRMG97W1gJAkVHePzgmo2Da8nZoPQBooWfmv+DSUnph1wOPGjzPd5bKBWhUhQBQHOnJnJdRALV6rDIuwPMGYGBF2ltVNw2AYmndxdlXo2DSTu+EB/5CL+d81KiIOjsuqu4PAHTEzSvGA4MKB/JSjgKYgQeaQFJaEXEQ745Wp0UW1oh5cGjQJqPiuma73pcEO7UOFMd1I3cNwFJC5YLUIj4EQCbpcJPG+mbYeKGvUPohI3BaVXLpO5EpfICwmQvzhblP8z73gN0FKIk68MJx70EjqXGv6Cill7/l7oXH2DIYxmYoexrm2IDhS9ld24D+3SmAsh5OuCcKa6JexGlaYYc2/dAtMkrk1gzmZWNk7YeAOPf0dlNv8bDe0+piCtYKFitvi5M8ukNtyFKzlbfxsM3xvHih50oVWMZJQkyubvLJ/DrtNXjmGiuQBxwwRrwY4AsPClLi+5iyEMOiboYP3xu1egFeh+pUme+rvsRXSZZ0oXJL/FsUyA0+iK93j4THDTE4eJyWKHXYxs6kyFyXrOCCN1rqHg6ZcaaMWkKAhdXq+QpgIXHcxekoZFTEqw75rzlMlfO+SKUv2qAUBPU0/VT/UsmUhNzSlqWKACppr3rBcECPa4tq+1UvBQyJZIeqfNXrP/VFk0fm1xZcAAAAAElFTkSuQmCC)",
                      width: 40,
                      height: 22,
                  }
                : {}),
        },
        states: {
            hover: {
                enabled: true, // Enable marker on hover
                // radius: primaryChartStyle == LINE_CHART ? 3 : item.marker.radius(categories, isCompareFilterApplied, primaryChartStyle),
            },
        },
        lineWidth: 2,
        ...(spline?.clip !== undefined ? { clip: spline?.clip } : {}), //Adding this to prevent lines to be clipped at the bottom, removing half of the drawn width
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
        stacking: null,
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
    const { series, spline, ...rest } = plotDataConfig;

    return {
        series: merge(getSeriesPlotOptions(reportConfig), series),
        spline: merge(getSplinePlot(reportConfig), spline),
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
