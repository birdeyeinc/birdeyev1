import { comparisonTypes, VISUALIZATIONS_SHORT_CODES } from "components/GraphTable/common/constants";
import {
    calculatePercentageChange,
    checkIfCompareFilterIsApplied,
    extractSpanContent,
    formatNumberToUnits,
    formatTimeToUnits,
    getComparisonLabels,
    getMaxValueForYAxis,
    getRotationDataPointsCount,
    getSproutedLabel,
    getTimeLabelFormatter,
    getTimePeriodLabelForChart,
    yAxisCountOptions,
    yAxisCountOptionsBoth,
} from "components/GraphTable/common/helper";
import { isEmpty } from "lodash";
import { comparison2Star, comparison3Star, comparison4Star, comparison5Star, default2Star, default3Star, default4Star, default5Star, gray300, gray60, gray900 } from "sass/js/colors";

const { LINE_CHART, AREA_CHART, HORIZONTAL_BAR_CHART, VERTICAL_BAR_CHART, HEATMAP, STACKED_AREA, QUADRANT_CHART } = VISUALIZATIONS_SHORT_CODES;

export const getCategories = (reportConfig) => {
    const dataPoints = reportConfig?.apiData?.dataPoints;
    const parserConfig = reportConfig?.parserConfig;
    if (parserConfig?.dataPoints && dataPoints.length) {
        return dataPoints.map((item) => item?.actual?.shortLabel || item?.actual?.label || item?.actual?.name).filter(Boolean);
    }
    // Fallback for when dataPoints false in parserConfig
    const { categoryKey, categoryValueMap, categoryList, seriesDetails, selectedDisplayValueAs } = parserConfig || {};
    const dataObj = dataPoints?.[0]?.actual?.[categoryKey] || {};
    return (categoryList || []).reduce((acc, key) => {
        const valueObj = dataObj[key]?.[seriesDetails?.[0]?.dataKey];
        const hasValue = selectedDisplayValueAs ? valueObj?.[selectedDisplayValueAs] !== undefined : dataObj[key] !== undefined;
        if (hasValue) {
            acc.push(categoryValueMap?.[key]?.value);
        }
        return acc;
    }, []);
};

export const getSourceIds = (reportConfig) => {
    const sourceIds = [];
    const parserConfig = reportConfig.parserConfig;
    if (parserConfig.dataPoints) {
        const dataPoints = reportConfig?.apiData?.dataPoints;
        dataPoints?.forEach((item) => {
            if (!isEmpty(item.actual)) {
                sourceIds.push(item.actual && item.actual.sourceId);
            }
        });
    }
    return sourceIds;
};

export const getSubDataKeyOrFilterKey = (reportData, subDataKey) => {
    const { parserConfig } = reportData;
    return parserConfig.selectedDisplayValueAs ? parserConfig.selectedDisplayValueAs : subDataKey;
};

export const getExtraData = (seriesDetailsItem, showExtraDataOnTooltip, dataObj, type, parserConfig, isComparisonFilterApplied, isRaceChart) => {
    if (parserConfig?.showTotalAndPercentChangeInTooltip) {
        let { actual = {} } = dataObj;
        const { compare = {} } = dataObj || {};
        if (isRaceChart) {
            actual = dataObj;
        }
        const doesValuesExist = Number.isFinite(actual[seriesDetailsItem.dataKey]) && Number.isFinite(compare[seriesDetailsItem.dataKey]);
        const percentChange = !isEmpty(actual) && !isEmpty(compare) && doesValuesExist ? calculatePercentageChange(actual[seriesDetailsItem.dataKey], compare[seriesDetailsItem.dataKey]) : 0;

        const emptyValueRepresentation = parserConfig?.representEmptyValuesAsNull ? null : 0;
        const actualAggregatedValue = !isEmpty(actual) ? actual[parserConfig?.tooltipTotalDataKey || "total"] : emptyValueRepresentation;
        const compareAggregatedValue = !isEmpty(compare) ? compare[parserConfig?.tooltipTotalDataKey || "total"] : emptyValueRepresentation;

        return {
            actualAggregatedValue,
            compareAggregatedValue,
            percentChange: percentChange ? percentChange.toFixed(1).replace(/\.0+$/, "") : 0,
        };
    } else if (seriesDetailsItem?.showExtraDataOnTooltip) {
        // Added this check to show nps score in comparison tooltip because we don't have nps percentile .
        if (isComparisonFilterApplied && seriesDetailsItem.compareExtraDataTooltip) {
            seriesDetailsItem.showExtraDataOnTooltip = seriesDetailsItem.compareExtraDataTooltip;
        }
        if (isRaceChart) {
            return !isEmpty(dataObj) && !parserConfig.stackedGraph ? dataObj[seriesDetailsItem.showExtraDataOnTooltip] : null;
        }
        return !isEmpty(dataObj[type]) && !parserConfig.stackedGraph ? dataObj[type][seriesDetailsItem.showExtraDataOnTooltip] : null;
    } else {
        if (isRaceChart) {
            return !isEmpty(dataObj) && showExtraDataOnTooltip && !parserConfig.stackedGraph ? dataObj[showExtraDataOnTooltip] : null;
        }
        return !isEmpty(dataObj[type]) && showExtraDataOnTooltip && !parserConfig.stackedGraph ? dataObj[type][showExtraDataOnTooltip] : null;
    }
};

export const getLongLabel = (item, reportConfig) => {
    const { isRaceChartDownload, parserConfig } = reportConfig || {};
    const { isBySourceGraph, isByLocationGraph, isLeaderboardGraph, isQRPerformanceGraph, isReviewTagByCountGraph, isEmployeeGraph } = parserConfig || {};

    const ifCompareFilterApplied = checkIfCompareFilterIsApplied(reportConfig);

    if (parserConfig.dataPoints) {
        const { actualAndCompareWith = {} } = reportConfig;
        const { comparisonType } = actualAndCompareWith;

        const comparisonLabel = getComparisonLabels(reportConfig);
        let comparisonLabelValue = Object.values(comparisonLabel || {});
        if (comparisonType === comparisonTypes.TIME_PERIOD && !parserConfig?.reportOverTime) {
            comparisonLabelValue = getTimePeriodLabelForChart(actualAndCompareWith);
        }

        const itemDate = item?.actual?.label || item?.actual?.shortLabel;
        const checkDate = new Date(itemDate);
        let label = isRaceChartDownload ? item?.shortLabel : ifCompareFilterApplied && (comparisonType === comparisonTypes.LOCATION || (isNaN(checkDate) && !parserConfig?.reportOverTime) || parserConfig?.isCustomRating || parserConfig?.isCustomNpsRating) ? comparisonLabelValue : itemDate;
        if (ifCompareFilterApplied && typeof label === "object") {
            label = label.reverse();
        }

        if (ifCompareFilterApplied && comparisonType !== comparisonTypes.LOCATION && !isBySourceGraph) {
            const compareLabel = item?.compare?.label || item?.compare?.shortLabel || item?.compare?.name;
            if (label && compareLabel && parserConfig?.reportOverTime && !isByLocationGraph && !isLeaderboardGraph && !isQRPerformanceGraph && !isReviewTagByCountGraph && !isEmployeeGraph) {
                label = [compareLabel, label];
            } else {
                label = typeof label === "object" && label?.length > 1 ? label || compareLabel : [compareLabel, label];
            }
        }
        if (!label && ifCompareFilterApplied) {
            label = item?.compare?.label || item?.compare?.shortLabel || item?.compare?.name;
            if (!isBySourceGraph) {
                label = `<span title="${label}">${label}</span>`;
            }
        }
        return (typeof label === "object" && label?.length > 1) || parserConfig?.reportOverTime ? label : [label];
    } else {
        if (ifCompareFilterApplied) {
            const { actualAndCompareWith = {} } = reportConfig;
            const { comparisonType } = actualAndCompareWith;
            const comparisonLabel = getComparisonLabels(reportConfig);
            let comparisonLabelValue = Object.values(comparisonLabel || {});
            if (comparisonType === comparisonTypes.TIME_PERIOD && !parserConfig?.reportOverTime) {
                comparisonLabelValue = getTimePeriodLabelForChart(actualAndCompareWith);
            }
            if (typeof comparisonLabelValue === "object") {
                comparisonLabelValue = comparisonLabelValue.reverse();
            }
            return comparisonLabelValue;
        }
        return item?.name;
    }
};

export const getSubQuestionId = (reportsData) => {
    const storageId = new URLSearchParams(window.location.search).get("storageId");
    const pdfDataObj = storageId ? JSON.parse(localStorage.getItem(storageId) || "{}") : {};

    return pdfDataObj?.extraReqParams?.subQuestionId || reportsData?.subQuestionId || reportsData?.graphId?.split("-").pop();
};

export const getBarColorByRating = (type, rating) => {
    if (type == "actual") {
        if (rating >= 1 && rating <= 1.9) {
            return default2Star;
        } else if (rating >= 2 && rating <= 2.9) {
            return default3Star;
        } else if (rating >= 3 && rating <= 3.9) {
            return default4Star;
        } else if (rating >= 4 && rating <= 5) {
            return default5Star;
        }
    } else if (type == "compare") {
        if (rating >= 1 && rating <= 1.9) {
            return comparison2Star;
        } else if (rating >= 2 && rating <= 2.9) {
            return comparison3Star;
        } else if (rating >= 3 && rating <= 3.9) {
            return comparison4Star;
        } else if (rating >= 4 && rating <= 5) {
            return comparison5Star;
        }
    }
    return gray60;
};

export const checkIfCurrentPointIsDistorted = (dataPoints, index, mainIndex, item, dataPointObj, parserConfig) => {
    let isDistorted = false;
    const getYValue = (pointObj) => {
        return !isEmpty(pointObj?.actual) ? (parserConfig?.isSubDataPoints ? pointObj?.actual?.subDataPoints[mainIndex]?.[`${item?.dataKey}`] : pointObj.actual?.[`${item.dataKey}`]) : null;
    };
    const currentValue = getYValue(dataPointObj);
    if (index == 0) {
        const nextValObj = dataPoints[index + 1];
        const nextYValue = getYValue(nextValObj);
        if (nextYValue == undefined && currentValue != undefined) {
            isDistorted = true;
        }
    }
    if (index == dataPoints.length - 1 && currentValue != undefined) {
        const prevValObj = dataPoints[index - 1];
        const prevYValue = getYValue(prevValObj);
        if (prevYValue == undefined) {
            isDistorted = true;
        }
    } else {
        const prevValObj = dataPoints[index - 1];
        const nextValObj = dataPoints[index + 1];
        const prevYValue = getYValue(prevValObj);
        const nextYValue = getYValue(nextValObj);
        if (prevYValue == undefined && nextYValue == undefined && currentValue != undefined) {
            isDistorted = true;
        }
    }
    return isDistorted;
};

export const getCustomColour = (colourList, index) => {
    if (index < colourList.length) {
        return colourList[index];
    }
    return null;
};

// --- getXAxisOptions helper starts ---
export const getxAxisOptions = (reportConfig) => {
    const { parserConfig = {}, actualAndCompareWith = {}, isLightWeightPage, fileType, apiData } = reportConfig || {};
    const {
        displayDataBySource,
        reportOverTime,
        shouldAlignVertically,
        xAxisLabelsWidth,
        xAxisLabelsAlignment,
        primaryChartStyle,
        xAxisText,
        skipTickintervalForBar,
        defaultChartStyle,
        xAxisLabelSpacing = null,
        isCustomRating,
        enableCrosshair,
        crosshairConfig,
        xAxisConfig = { enabled: true },
        xAxisLabelsRotation = {},
        disableTickWidth,
    } = parserConfig;
    const groupByType = apiData?.groupByType || "";
    const isPNG = fileType == "png";
    const { comparisonType } = actualAndCompareWith;
    const categories = getCategories(reportConfig);
    const chartStyle = primaryChartStyle;
    const isComparisonFilterApplied = checkIfCompareFilterIsApplied(reportConfig);
    const isLabelRotationEnabled = categories.length > getRotationDataPointsCount(reportOverTime) || shouldAlignVertically;

    // Width & Alignment
    let width = typeof xAxisLabelsWidth === "object" ? xAxisLabelsWidth[chartStyle] || "90px" : xAxisLabelsWidth || "90px";
    if (reportOverTime) width += 10;
    let align = "center";
    if (typeof xAxisLabelsAlignment === "object") {
        align = xAxisLabelsAlignment[chartStyle] || align;
    }

    // Rotation & TickInterval
    let rotation = 0,
        tickInterval = 1;
    if ([VERTICAL_BAR_CHART, LINE_CHART, AREA_CHART].includes(chartStyle)) {
        if (isComparisonFilterApplied) {
            rotation = chartStyle === VERTICAL_BAR_CHART ? xAxisLabelsRotation?.column : xAxisLabelsRotation?.spline;
            if (defaultChartStyle === HORIZONTAL_BAR_CHART && chartStyle === LINE_CHART) rotation = 0;
            tickInterval = xAxisLabelsRotation?.tickInterval || tickInterval;
            align = xAxisLabelsRotation?.align || align;
        } else {
            rotation = isLabelRotationEnabled ? xAxisLabelsRotation?.defaultRotation : 0;
            if (defaultChartStyle === HORIZONTAL_BAR_CHART && chartStyle === LINE_CHART) rotation = 0;
            tickInterval = xAxisLabelsRotation?.tickInterval || tickInterval;
            align = isLabelRotationEnabled ? xAxisLabelsRotation?.align : align;
        }
    }
    if (skipTickintervalForBar && [HORIZONTAL_BAR_CHART, LINE_CHART, VERTICAL_BAR_CHART].includes(chartStyle)) {
        tickInterval = 1;
    }

    // Special tweaks for comparison/location/time period
    if (isComparisonFilterApplied && comparisonType === comparisonTypes.LOCATION) {
        if (chartStyle === HORIZONTAL_BAR_CHART || (chartStyle === LINE_CHART && parserConfig.defaultChartStyle == HORIZONTAL_BAR_CHART)) {
            align = "right";
        }
        if (chartStyle === HORIZONTAL_BAR_CHART) tickInterval = xAxisLabelsRotation?.tickInterval || tickInterval;
    }
    if (isComparisonFilterApplied && [comparisonTypes.LOCATION, comparisonTypes.TIME_PERIOD].includes(comparisonType) && categories?.length < 9) {
        rotation = 0;
        align = "center";
    }
    if (chartStyle === HORIZONTAL_BAR_CHART) align = "right";
    if (displayDataBySource && chartStyle === VERTICAL_BAR_CHART) {
        rotation = -45;
        align = "right";
    }
    if ([LINE_CHART, HORIZONTAL_BAR_CHART].includes(chartStyle)) align = "right";
    if (chartStyle == HEATMAP && xAxisLabelsRotation?.heatMap) rotation = xAxisLabelsRotation.heatMap;

    // HTML/Label options
    const useHTML = !!xAxisConfig.useHTML;
    const disableSproutLabel = isPNG || !!xAxisConfig?.disableSproupLabel;
    let tickWidth = disableTickWidth ? 0 : [VERTICAL_BAR_CHART, LINE_CHART, AREA_CHART].includes(primaryChartStyle) && defaultChartStyle != HORIZONTAL_BAR_CHART ? 1 : 0;
    const tickColor = xAxisConfig?.tickColor ? "#CCCCCC" : "#e6e6e6";
    const lineColor = xAxisConfig?.lineColor ? "#EAEAEA" : "#E9E9EB";
    const labelColor = xAxisConfig?.color || gray300;
    const tickLength = xAxisConfig.tickLength || 8;
    const fontWeight = xAxisConfig?.style?.fontWeight || 400;

    if (!disableSproutLabel && reportOverTime) {
        align = "center";
    }
    // Labels config
    const isLabelsEnabled = disableSproutLabel && categories?.length > 15 ? (isPNG ? true : false) : xAxisConfig?.enabled;
    if (!isLabelsEnabled) {
        tickWidth = 0;
    }
    const labels = {
        autoRotation: reportOverTime && !disableSproutLabel ? 0 : undefined,
        enabled: isLabelsEnabled,
        ...(xAxisLabelSpacing ? { y: xAxisLabelSpacing } : {}),
        align,
        rotation: rotation && (!(reportOverTime && !disableSproutLabel) || isLightWeightPage) && !isCustomRating ? rotation : 0,
        style: {
            color: labelColor,
            fontWeight,
            width,
            "min-width": width,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "12px",
            position: "absolute",
            "text-align": align,
        },
        formatter() {
            if (xAxisConfig?.formatter) return xAxisConfig.formatter(this);
            if (reportOverTime && !disableSproutLabel && typeof groupByType !== "undefined") {
                return getSproutedLabel(this, reportConfig)?.split("****")?.join("<br/>");
            }
            if (useHTML && typeof this.value == "string") return extractSpanContent(this.value);
            if (typeof groupByType !== "undefined") return getTimeLabelFormatter(this, groupByType);
            return this.value;
        },
        useHTML,
    };

    return {
        categories: categories?.length ? categories : null,
        title: { text: xAxisText || "", useHTML },
        tickInterval,
        tickmarkPlacement: "off",
        tickWidth,
        tickColor,
        tickLength,
        labels,
        allowDecimals: false,
        crosshair: enableCrosshair ? crosshairConfig : null,
        lineColor,
    };
};
// --- getXAxisOptions helper ends ---

// --- getYAxisOptions helper starts ---
export const getYAxisOptions = (reportConfig, extraData) => {
    const { isRaceChartDownload, disabledSeries, parserConfig, module } = reportConfig || {};
    const {
        isYaxisRightLabelPercent,
        enableLeftYaxisStackLabel,
        primaryChartStyle,
        lineBubbles,
        seriesDetails,
        yAxisConfig = {},
        stackedGraph,
        plotDataConfig = {},
        isYaxisLabelsEnabledForVeritcalChart,
        isYaxisLabelRepresentedByTime,
        isYaxisLeftLabelPercent,
        doubleYaxis,
        primaryYaxisTickAmount,
        addCustomtickPositionsPrimaryYaxis,
        tickPositionsPrimaryYaxis,
        addCustomtickPositions,
        tickPositions,
        endOnTickFlag,
        endOnTick,
        plotLines,
        yAxisTickInterval,
        enableLedtYAxisTitle,
        reversedStacks,
        disableGridLine,
        yAxisGridLineColor,
    } = parserConfig || {};
    const { title, tickAmount, formatYValueToUnits } = yAxisConfig;
    const chartStyle = primaryChartStyle;
    const isComparisonEnabled = checkIfCompareFilterIsApplied(reportConfig);
    const { max1, max2, min = 0 } = getMaxValueForYAxis(reportConfig, disabledSeries || []);
    const categoriesLength = extraData?.xAxis?.categories?.length;
    const showGridLines = [LINE_CHART, AREA_CHART].includes(chartStyle) || (lineBubbles && isComparisonEnabled);

    // Helper for formatting Y values
    const formatY = (val) => {
        if (isYaxisLabelRepresentedByTime) return formatTimeToUnits(val);
        if (isYaxisLeftLabelPercent || (isYaxisRightLabelPercent && seriesDetails?.length === 1 && seriesDetails[0]?.name === "Response rate")) {
            return `${formatNumberToUnits(val)}%`;
        }
        if (formatYValueToUnits) return val ? formatNumberToUnits(val) : null;
        return formatNumberToUnits(val);
    };

    // Double Y axis
    if (doubleYaxis && seriesDetails?.some((s) => s.yAxis > 0)) {
        const interval = primaryYaxisTickAmount ? Math.floor(max1 / primaryYaxisTickAmount) : Math.floor(max1 / 5);
        const oppositetickInterval = Math.floor(max2 / 5);
        const defaultProps = yAxisCountOptionsBoth({
            title: { enabledY: true, enabledY1: true },
            max: max1,
            tickInterval: interval,
            gridLineWidth: showGridLines ? 1 : 0,
            oppositeYmin: parserConfig?.customYmin || 0,
            oppositeYmax: max2,
            oppositetickInterval,
            gridLineWidthYOpposite: showGridLines ? 1 : 0,
            tickAmount: primaryYaxisTickAmount,
            chartStyle,
            inverted: parserConfig?.inverted,
        });

        return [
            {
                ...defaultProps[0],
                labels: {
                    ...defaultProps[0].labels,
                    enabled: showGridLines,
                    margin: 10,
                    formatter() {
                        return formatNumberToUnits(this.value);
                    },
                    style: { fontSize: "12px" },
                },
                stackLabels: {
                    enabled: showGridLines ? false : enableLeftYaxisStackLabel && chartStyle !== LINE_CHART,
                    rotation: isComparisonEnabled && chartStyle === VERTICAL_BAR_CHART ? -90 : 0,
                    x: categoriesLength > 13 || isComparisonEnabled ? (chartStyle == HORIZONTAL_BAR_CHART ? 5 : -2) : 0,
                    formatter() {
                        return formatNumberToUnits(this.total);
                    },
                    style: { fontWeight: "400", color: gray900, fontSize: "12px" },
                },
                tickPositions: addCustomtickPositionsPrimaryYaxis && chartStyle === LINE_CHART ? tickPositionsPrimaryYaxis : null,
                endOnTick: endOnTickFlag ? endOnTick : true,
            },
            {
                ...defaultProps[1],
                labels: {
                    ...defaultProps[0].labels,
                    enabled: showGridLines,
                    margin: 10,
                    formatter() {
                        return isYaxisRightLabelPercent ? `${formatNumberToUnits(this.value)}%` : formatNumberToUnits(this.value);
                    },
                    style: { fontSize: "12px" },
                },
                tickPositions: addCustomtickPositions ? tickPositions : null,
                endOnTick: endOnTickFlag ? endOnTick : true,
            },
        ];
    }

    // Single Y axis
    const yaxisObject = {
        ...yAxisCountOptions({
            min: parserConfig?.calculateYaxisMinValue ? min : 0,
            max: max1,
            tickAmount,
            gridLineColor: yAxisGridLineColor,
            gridLineWidth: showGridLines ? 1 : 0,
        })[0],
        labels: {
            enabled: [LINE_CHART, STACKED_AREA, AREA_CHART, QUADRANT_CHART].includes(chartStyle) || (lineBubbles && isComparisonEnabled) || isYaxisLabelsEnabledForVeritcalChart,
            margin: 10,
            formatter() {
                return formatY(this.value);
            },
        },
        stackLabels: {
            enabled:
                showGridLines || (stackedGraph === false && module != "listings") || (seriesDetails?.length === 1 && seriesDetails?.[0]?.id?.toLowerCase().includes("line"))
                    ? false
                    : enableLeftYaxisStackLabel
                    ? true
                    : ![LINE_CHART, AREA_CHART, STACKED_AREA].includes(chartStyle) && !(chartStyle === HORIZONTAL_BAR_CHART && !isComparisonEnabled && !stackedGraph),
            rotation: plotDataConfig[chartStyle]?.dataLabels?.rotation && chartStyle !== HORIZONTAL_BAR_CHART && isComparisonEnabled ? plotDataConfig[chartStyle].dataLabels.rotation(extraData?.xAxis?.categories, isComparisonEnabled) : null,
            y: isComparisonEnabled && chartStyle !== HORIZONTAL_BAR_CHART ? -10 : 0,
            x: isComparisonEnabled && chartStyle !== HORIZONTAL_BAR_CHART ? -2 : 0,
            padding: plotDataConfig[chartStyle]?.dataLabels?.padding || null,
            formatter() {
                return formatNumberToUnits(this.total);
            },
            style: {
                color: plotDataConfig[chartStyle]?.dataLabels?.color,
                fontSize: plotDataConfig[chartStyle]?.dataLabels?.fontSize,
                fontWeight: plotDataConfig[chartStyle]?.dataLabels?.fontWeight,
            },
        },
        reversedStacks,
        tickPositions: seriesDetails?.[0]?.tickPositions || null,
        endOnTick: endOnTickFlag ? endOnTick : true,
        plotLines: plotLines || null,
        ...(yAxisTickInterval ? { tickInterval: yAxisTickInterval } : {}),
    };
    if (yAxisConfig?.labels?.disabled) {
        yaxisObject.labels.enabled = false;
    }
    if (enableLedtYAxisTitle) yaxisObject.title.text = parserConfig?.seriesDetails?.[0]?.yAxisLabel;
    if (title) yaxisObject.title = title;
    if (disableGridLine) yaxisObject.gridLineColor = "transparent";
    if (isRaceChartDownload && yaxisObject) {
        delete yaxisObject.min;
        if (!tickAmount) delete yaxisObject.max;
        yaxisObject.tickPixelInterval = 150;
        yaxisObject.labels.enabled = true;
        yaxisObject.softMax = 1;
    }

    return [yaxisObject];
};
// --- getYAxisOptions helper ends ---
