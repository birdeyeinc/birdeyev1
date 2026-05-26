import { capitalizeFirstLetter, numberWithCommas } from "utils/index";
import Styles from "../styles/charts.module.scss";
import { checkForNullValue, getDecimaledValue } from "components/GraphTable/common/helper";
import { chartElementConfig, COMPETITOR_GRAPH_IDS, parserConstant, QR_SCAN_CLK_OVERALL_PERF, VISUALIZATIONS_SHORT_CODES } from "components/GraphTable/common/constants";
import { cloneDeep } from "lodash";

const { GROUPED } = parserConstant;
const { PIE_CHART } = VISUALIZATIONS_SHORT_CODES;

const getSummaryPositiveOrNegativeClass = (value, reportsData) => {
    const { parserConfig } = reportsData;
    const { percentageGrowthIsNegative } = parserConfig;
    if (value == 0 || value == 0.0) {
        return "";
    } else if (value > 0) {
        return percentageGrowthIsNegative ? "negative reversed" : "positive";
    } else {
        return percentageGrowthIsNegative ? "positive reversed" : "negative";
    }
};

export const defaultToolTipOptions = (customToolTipFormatter) => {
    return {
        borderWidth: 0,
        shared: true,
        backgroundColor: "rgba(255,255,255,0)",
        useHTML: customToolTipFormatter ? true : false,
        shadow: false,
        snap: 0,
        hideDelay: 50,
    };
};

const getToolTipValueFormatter = (value) => {
    return isNaN(value) ? value : Math.round(value);
};

const formatTooltipAggregatedValue = (reportsData, d, extraDataKey) => {
    const { parserConfig, reportsGroup } = reportsData || {};
    const value = d.points[0]?.point?.extraData?.[extraDataKey];

    if ((value === undefined || value === null) && reportsGroup === "response-trends") {
        return "-";
    }

    const percentJSX = d.points[0]?.point?.showPercent ? `<span>%<span>` : "";

    if (parserConfig?.customTooltipYAxisValueFormatter) {
        return `${parserConfig?.customTooltipYAxisValueFormatter(value)}${percentJSX}`;
    }

    return `${numberWithCommas(value || 0)}${percentJSX}`;
};

const getTooltipSeriesName = (item) => {
    const seriesName = item?.series?.name;
    if (item?.series?.userOptions?.toolTipLabel) {
        return item?.series?.userOptions?.toolTipLabel;
    } else {
        return seriesName;
    }
};

const getValueName = (d, item, reportsData) => {
    const { parserConfig, isRaceChartDownload } = reportsData || {};
    const showtooltipValueLabelSeriesName = parserConfig?.showtooltipValueLabelSeriesName;
    const { primaryChartStyle } = parserConfig;
    const dataFormat = parserConfig.dataFormat;
    const groupedWithStack = parserConfig.groupedWithStack;
    if (((dataFormat === GROUPED || (parserConfig?.comparisonDateOverTime && primaryChartStyle === PIE_CHART)) && !groupedWithStack) || (showtooltipValueLabelSeriesName && primaryChartStyle === PIE_CHART)) {
        if (isRaceChartDownload) {
            return d?.point?.label;
        }
        return d.x;
    } else {
        return getTooltipSeriesName(item);
    }
};

const getTooltipLabel = (d, reportsData) => {
    const { parserConfig, isRaceChartDownload, graphId } = reportsData || {};
    const showtooltipValueLabelSeriesName = parserConfig?.showtooltipValueLabelSeriesName;
    const { primaryChartStyle, isToolTipTitlePrefix, toolTipTitlePrefixValue } = parserConfig;
    const dataFormat = parserConfig.dataFormat;
    const groupedWithStack = parserConfig.groupedWithStack;
    const isTitlePrefixString = isToolTipTitlePrefix ? toolTipTitlePrefixValue : "";
    if ((d.series.name === "Scans" || d.series.name === "Clicks" || d.x === "Scans" || d.x === "Clicks") && reportsData?.graphId === QR_SCAN_CLK_OVERALL_PERF.graphId) {
        return "Total";
    }
    if (parserConfig?.barGrouping || ((dataFormat === GROUPED || (parserConfig?.comparisonDateOverTime && primaryChartStyle === PIE_CHART)) && !groupedWithStack) || (showtooltipValueLabelSeriesName && primaryChartStyle === PIE_CHART)) {
        return d.series.name;
    } else {
        if (isRaceChartDownload) {
            return `${isTitlePrefixString} ${d?.point.label}`;
        }
        if (graphId === COMPETITOR_GRAPH_IDS.competitiveDistribution) {
            return d?.point?.label;
        }
        return parserConfig?.reportOverTime ? d?.point?.options?.longLabel : `${isTitlePrefixString} ${d?.x}`;
    }
};

const getPointsWhichAreNotPloted = (d, parserConfig, isCompareFilterIsApplied = false) => {
    const { extraDataTooltipLabel, extraDataTooltipLabelColor, showExtraDataOnTooltip, customTooltipText, showPercentileData, showTotalPercentInTooltip, customDataFormatterWhichAreNotPlotted, customDataFormatter } = parserConfig;
    d = cloneDeep(d);
    // d.points = d.points.map((item) => {
    //     item.point.showDisplayUnits = false;
    // });
    if (showExtraDataOnTooltip) {
        const actualPoints = d.points.filter((item) => {
            return !item?.point?.options?.compareData && !item?.point?.options?.totalCount;
        });
        const comparePoints = d.points.filter((item) => {
            return item?.point?.options.compareData === true && !item?.point?.options?.totalCount;
        });
        const points = [actualPoints[0]];
        if (customDataFormatterWhichAreNotPlotted) {
            const points = customDataFormatter(actualPoints);
            return points;
        }
        if (points?.[0]) {
            let computedTotal = 0;
            let totalPercentVal = 0;
            actualPoints.map((item) => {
                computedTotal += item.y;
                totalPercentVal += item?.point?.options?.extraData;
            });
            points[0].y = showTotalPercentInTooltip ? computedTotal : points[0]?.point?.options?.extraData;
            points[0].series.name = extraDataTooltipLabel;
            points[0].series.color = extraDataTooltipLabelColor;
            points[0].point.showPercent = false;
            if (showPercentileData && showTotalPercentInTooltip) {
                points[0].point.extraData = totalPercentVal;
            }
        }
        if (isCompareFilterIsApplied && comparePoints?.[0]) {
            const comparePoint = [comparePoints[0]];
            if (comparePoint?.[0]) {
                let computedTotal = 0;
                let totalPercentVal = 0;
                comparePoints.map((item) => {
                    computedTotal += item.y;
                    totalPercentVal += item?.point?.options?.extraData;
                });
                comparePoint[0].y = showTotalPercentInTooltip ? computedTotal : comparePoint[0]?.point?.options?.extraData;
                comparePoint[0].series.name = extraDataTooltipLabel;
                comparePoint[0].series.color = extraDataTooltipLabelColor;
                comparePoint[0].point.showPercent = false;
                if (showPercentileData && showTotalPercentInTooltip) {
                    comparePoint[0].point.extraData = totalPercentVal;
                }
            }
            return [...points, ...comparePoint];
        } else {
            return points;
        }
    } else {
        const points = d.points;
        if (points.length > 0 && points?.[0]) {
            points[0].y = points[0]?.point?.options.extraData;
            points[0].series.name = extraDataTooltipLabel;
            points[0].series.color = extraDataTooltipLabelColor;
            points[0].customText = customTooltipText;
        }
        if (points.length > 1) {
            points[1].y = points[1]?.point?.options.extraData;
            points[1].series.name = extraDataTooltipLabel;
            points[1].series.color = extraDataTooltipLabelColor;
        }
        return points;
    }
};

export const defaultToolTipFormatter = (d, toolTipClassName, ChartStyles, reportsData) => {
    const { parserConfig, isRaceChartDownload } = reportsData;
    const { showRespCountOnTooltip, showExtraDataOnTooltip, selectedDisplayValueAs, seriesDetails, showTimeUnitInTooltipLabel } = parserConfig;
    if (showRespCountOnTooltip || showExtraDataOnTooltip) {
        const tempPoint = getPointsWhichAreNotPloted(d, parserConfig);
        d.points = [...d.points, ...tempPoint];
    }
    if (seriesDetails[0]?.showDisplayUnits && d?.points?.[0]) {
        d.points[0].showDisplayUnits = seriesDetails[0]?.showDisplayUnits;
    }
    return `<div class="${ChartStyles.parentContainerTooltip} ${ChartStyles.parentgeneraltooltip} ${ChartStyles.threeColumnsWithColorDots} ${toolTipClassName ? toolTipClassName : ""}" >
        <div class="${ChartStyles.labelMain}">${getTooltipLabel(d, reportsData)}${seriesDetails[0]?.showDisplayUnits && showTimeUnitInTooltipLabel ? ` (${selectedDisplayValueAs})` : ""}</div>
        <table style="width:100%;" class="${ChartStyles.NpsTooltipParent}">
            <tbody>
                ${
                    parserConfig.showPercentileData
                        ? `<tr class="${ChartStyles.toolTipBody}">
                    <td>
                        <div class="${ChartStyles.volumeBlock}">Components</div>
                    </td>
                    <td>
                        Count
                    </td>
                    <td style="margin-left: 10px;">
                        Percentage
                    </td>
                </tr>`
                        : ""
                }

                ${
                    parserConfig.showTotalAndPercentChangeInTooltip && !parserConfig?.hideTotalInTooltip
                        ? `<tr class="${ChartStyles.toolTipBody}">
                    <td>
                        <div class="${ChartStyles.volumeBlock}">${parserConfig?.tooltipAggregatedHeaderLabel || "Net"}</div>
                    </td>
                    <td>${formatTooltipAggregatedValue(reportsData, d, "actualAggregatedValue")}</td>
                </tr>`
                        : ""
                }
                
                ${d.points
                    .map(
                        (item) => `<tr class="${ChartStyles.toolTipBody}">
                    <td>
                        ${item.series.color ? `<div style="background-color:${isRaceChartDownload ? item?.color : item.series.color}" class="${ChartStyles.tooltipDot}"></div>` : ""}
                        <div class="${ChartStyles.volumeBlock}" title="${getValueName(d, item, reportsData)}">${getValueName(d, item, reportsData)}${item?.showDisplayUnits && !showTimeUnitInTooltipLabel ? ` (${selectedDisplayValueAs})` : ""}</div>
                    </td>
                    <td>
                        ${
                            parserConfig?.customTooltipYAxisValueFormatter
                                ? parserConfig?.customTooltipYAxisValueFormatter(item.y)
                                : item?.point?.showString
                                ? item?.series?.name === "Rating"
                                    ? getDecimaledValue(item.y)
                                    : item.y
                                : item?.point?.showCustomToolTipValue
                                ? numberWithCommas(+getToolTipValueFormatter(item?.series?.name === "Rating" ? getDecimaledValue(item.y) : item.y))
                                : item?.point?.showCustomHTML
                                ? item?.series?.name === "Rating"
                                    ? getDecimaledValue(item.y)
                                    : item.y
                                : numberWithCommas(item?.series?.name === "Rating" ? getDecimaledValue(item.y) : item.y)
                        }
                        ${item?.point?.showPercent ? `<span style="margin-left: -3px">%<span>` : ""}
                        ${
                            parserConfig.showTotalAndPercentChangeInTooltip && item?.point?.extraData?.percentChange
                                ? `<span class=${getSummaryPositiveOrNegativeClass(item?.point?.extraData?.percentChange, reportsData)}>
                                ${item?.point?.extraData?.percentChange > 0 ? "+" : ""}${Number(item?.point?.extraData?.percentChange).toFixed(1)}%
                            </span>`
                                : ""
                        }
                    </td>
                    ${
                        parserConfig.showPercentileData && !item.totalData
                            ? `<td style="margin-left: 10px;">
                        ${checkForNullValue(item?.point?.extraData) ? item?.point?.extraData + "%" : "N/A"}
                    </td>`
                            : parserConfig.showPercentileData && item.totalData
                            ? `<td style="margin-left: 10px;">
                        N/A
                    </td>`
                            : ""
                    }
                </tr>`,
                    )
                    .join("")}
            </tbody>
        </table>
    </div>`;
};

export const getTotalForActual = (obj, parserConfig) => {
    let total = 0;
    let isActualDataPresent = null;
    const { excludeSeriesDataWhileCalculatingTotalForTooltip } = parserConfig;
    obj.points.forEach((element) => {
        if (excludeSeriesDataWhileCalculatingTotalForTooltip && !excludeSeriesDataWhileCalculatingTotalForTooltip.find((item) => item === element.series.name)) {
            if (element.point.options.compareData === false) {
                total += element.point.options.y;
                isActualDataPresent = true;
            }
        } else if (!excludeSeriesDataWhileCalculatingTotalForTooltip) {
            if (element.point.options.compareData === false) {
                total += element.point.options.y;
                isActualDataPresent = true;
            }
        }
    });
    if (!isActualDataPresent) {
        return null;
    }
    return total;
};

// Sankey Custom Tooltip
export function getDefaultSankeyChartTooltipPointFormatter() {
    const tooltipParam = {
        from: this.fromNode.name,
        to: this.toNode.name,
        weight: numberWithCommas(this.weight),
        suffix: this.weight > 1 ? "calls" : "call",
        seperator: ":"
    };
    const { from, to, weight, suffix = "", seperator = "" } = tooltipParam || {};
    return `
        <div class="${Styles.sankeyTooltipContainer}">
            <div class="${Styles.sankeyTooltipLabelMain}">${from}&nbsp;<i class="icon_phoenix-arrow-right"></i>&nbsp;${to}${seperator}&nbsp;<span>${weight} ${suffix}</span></div>
        </div>
    `;
};

export function getDefaultSankeyChartTooltipNodeFormatter() {
    const tooltipParam = {
        name: this.name,
        nodeTotalSum: numberWithCommas(this.sum),
        suffix: this.sum > 1 ? "calls" : "call",
        seperator: ":"
    };
    const { name, nodeTotalSum, suffix, seperator } = tooltipParam || {};
    return `
        <div class="${Styles.sankeyTooltipContainer}">
            <div class="${Styles.sankeyTooltipLabelMain}">${name}${seperator}&nbsp;<span>${nodeTotalSum} ${suffix}</span></div>
        </div>
    `;
};
// Sankey Custom Tooltip Ends

/** ================================== Common Series utilities ======================================= */
export const defaultShowToolTip = (toolTipClassName = "", reportsData, chartConfig) => {
    const { parserConfig } = reportsData;
    const defaultProperties = defaultToolTipOptions(true);

    return {
        ...defaultProperties,
        formatter() {
            const obj = this;
            if (obj.point.noTooltip) {
                return false;
            }
             if (!obj.points && obj.point) {
                obj["points"] = [obj.point];
                obj.x = obj.key;
            }
            // Update color if needed
            if (parserConfig.updateTooltipDotColorWithColumnColor && obj.points?.[0].series.color) {
                obj.points[0].series.color = obj.points[0].color;
            }
            if (chartConfig?.seriesData?.[0]?.hideTooltipColor) {
                obj.points[0].series.color = false;
            }

            // Use custom or default formatter
            const ChartStyles = Styles;
            return parserConfig.tooltipFormatter ? parserConfig.tooltipFormatter(obj, reportsData, chartConfig) : defaultToolTipFormatter(obj, toolTipClassName, ChartStyles, reportsData);
        },
        shared: typeof parserConfig.enabledSharedTooltip === "boolean" ? parserConfig.enabledSharedTooltip : typeof parserConfig.enabledSharedTooltip === "function" ? parserConfig.enabledSharedTooltip(reportsData) : true,
        ...(parserConfig.tooltipOutside !== undefined && { outside: parserConfig.tooltipOutside }),
        ...(parserConfig.tooltipPositioner && { positioner: parserConfig.tooltipPositioner }),
    };
};

export const getTooltipForSunburst = () => {
    const defaultProperties = defaultToolTipOptions(true);
    return Object.assign({}, defaultProperties, {
        headerFormat: "",
        // useHTML: true,
        shared: false,
        formatter() {
            const point =
                (this.point.isParentNode
                    ? {
                          ...this.series?.options,
                          type: this.series?.options?.entityType,
                          options: this.series?.options,
                      }
                    : this.point) || {};
            if (point.options?.dummy || !point.options?.value) {
                return false;
            }
            const title = chartElementConfig[point.type]?.title;
            const type = title?.charAt(0)?.toUpperCase() + title?.slice(1);
            const spread = point.sentiment?.spread || {};
            const isOthersNode = point.id?.startsWith("others_");
            const totalNodes = point.options?.totalNodes;
            let name = isOthersNode ? `${totalNodes} ${totalNodes > 1 ? chartElementConfig[point.type]?.plural : point.type}` : point.name;
            if (!name && point.nameActual) {
                name = capitalizeFirstLetter(point.nameActual);
            }
            return `
                <div class="${Styles.insightsTooltipContainer}">
                    <div>${type} : <span>${name}</span></div>
                    <div>Mentions : <span>${numberWithCommas(point.mentions)}</span></div> 
                    <div>Sentiment : <span class="${Styles.negative} ${spread.neg >= 0 ? `${Styles.dot}` : ""}">${numberWithCommas(spread.neg)}</span>
                        <span class="${Styles.neutral} ${spread.neu >= 0 ? `${Styles.dot}` : ""}">${numberWithCommas(spread.neu)}</span>
                        <span class="${Styles.positive}">${numberWithCommas(spread?.pos)}</span>
                    </div>
                </div>
            `;
        },
    });
};