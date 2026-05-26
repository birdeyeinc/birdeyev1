import { questionsColors, questionsColorsLight } from "components/GraphTable/common/colors";
import { VISUALIZATIONS_SHORT_CODES } from "components/GraphTable/common/constants";
import Highcharts from "highcharts";
import { has, isEmpty, cloneDeep } from "lodash";
import { blue60, comparison2Star, comparison3Star, comparison5Star, default2Star, default3Star, default5Star } from "sass/js/colors";
import { checkIfCurrentPointIsDistorted, getBarColorByRating, getCustomColour, getExtraData, getLongLabel, getSubDataKeyOrFilterKey, getSubQuestionId } from "./helper";
import { checkIfCompareFilterIsApplied, getFormattedLabel, getProjectedData } from "components/GraphTable/common/helper";

const { LINE_CHART, AREA_CHART, HORIZONTAL_BAR_CHART, VERTICAL_BAR_CHART } = VISUALIZATIONS_SHORT_CODES;

export const generateSeriesDataForMatrixDropdownRadio = (reportsRestData, apiData) => {
    const legendValue = [];
    const chartColorsList = questionsColors();
    const primaryChartStyle = reportsRestData?.parserConfig?.primaryChartStyle;
    const lightChartColorsList = questionsColorsLight();
    const rowId = getSubQuestionId(reportsRestData);
    const rowAggregatedDataPoint = apiData?.dataPoints.filter((row) => row.actual.questionId == rowId);
    const list = rowAggregatedDataPoint[0]?.actual?.parentDataPoints[0]?.subDataPoints?.map((subDataPoint, idx) => {
        legendValue.push(subDataPoint?.label);
        return {
            name: subDataPoint?.label || "",
            type: primaryChartStyle,
            color: chartColorsList[idx % chartColorsList.length],
            id: `${subDataPoint?.label}-${idx}`,
            dataKey: "count",
            yAxisLabel: "",
            showInLegend: false,
            compareColor: lightChartColorsList[idx % lightChartColorsList.length],
            showPercent: false,
            primary: true,
            axisLevel: 0,
            showExtraDataOnTooltip: "percent",
        };
    });
    return list || [];
};

export const generateSeriesDataForCheckboxAndDropdown = (reportsRestData, apiData) => {
    const legendValue = [];
    const chartColorsList = questionsColors();
    const primaryChartStyle = reportsRestData?.parserConfig?.primaryChartStyle;
    const lightChartColorsList = questionsColorsLight();
    const list = apiData?.aggregatedDataPoints?.map(({ actual }, idx) => {
        legendValue.push(actual?.label);
        return {
            name: actual?.label || "",
            type: primaryChartStyle,
            color: chartColorsList[idx % chartColorsList.length],
            id: `${actual?.label}-${idx}`,
            dataKey: "count",
            yAxisLabel: "",
            showInLegend: false,
            compareColor: lightChartColorsList[idx % lightChartColorsList.length],
            showPercent: false,
            primary: true,
            axisLevel: 0,
        };
    });
    return list;
};

export const generateChoicesForMatrixType = (data) => {
    if (!data?.length || !Array.isArray(data[0]?.actual?.subDataPoints)) return [];

    return data[0].actual.subDataPoints.map((item, index) => ({
        title: item.label,
        id: index + 1,
    }));
};

export const generateSeriesDataForMatrix = (data) => {
    const chartColors = questionsColors();
    const lightChartColors = questionsColorsLight();
    const seriesDetailsList = generateChoicesForMatrixType(data).map((item, idx) => {
        return {
            name: item.title,
            type: HORIZONTAL_BAR_CHART,
            color: chartColors[idx % chartColors.length],
            id: `stackedBar-${item.id || idx}`,
            dataKey: "count",
            showInLegend: false,
            showPercent: false,
            primary: true,
            compareColor: lightChartColors[idx % lightChartColors.length],
            percentKey: "percent",
            axisLevel: 0,
            yAxis: 0,
        };
    });
    return seriesDetailsList;
};

export const getDynamicSeriesDetails = (reportConfig) => {
    const { parserConfig, customOvertimeChart, specialChartForPdfSurvey, specialMartixChartForPdfSurvey } = reportConfig;
    // If there are seriesDetails and it's not a special PDF survey chart (or isAddWidget/isDashboard)
    if (parserConfig.seriesDetails && (specialChartForPdfSurvey?.[reportConfig?.graphId] !== true || reportConfig.isAddWidget || reportConfig.isDashboard)) {
        // If it's not a special matrix chart for PDF survey
        if (specialMartixChartForPdfSurvey?.[reportConfig?.graphId] !== true) {
            return parserConfig.seriesDetails;
        } else {
            return generateSeriesDataForMatrixDropdownRadio(reportConfig, reportConfig.apiData);
        }
    } else if (reportConfig.isAddWidget === true && customOvertimeChart?.[reportConfig.graphId] === true) {
        return generateSeriesDataForCheckboxAndDropdown(reportConfig, reportConfig.apiData);
    } else {
        return generateSeriesDataForMatrix(reportConfig.apiData.dataPoints);
    }
};

// --- getSeriesData common helpers starts ---
// --- Atomic helpers for getSeriesData ---

export function filterSeriesDetails(seriesDetails, disabledSeriesData, parserConfig) {
    let projectedSeriesName;
    let projectedDataPresentInSeries = true;
    const filtered = seriesDetails?.filter((item) => {
        if (parserConfig?.showProjectedData && parserConfig?.projectedData) {
            projectedSeriesName = parserConfig?.projectedData?.name;
            const words = projectedSeriesName?.trim().split(" ");
            words?.pop();
            projectedSeriesName = words?.join(" ");
        }
        if (disabledSeriesData.includes(item?.name)) {
            if (parserConfig?.showProjectedData && parserConfig?.projectedData && item?.name == projectedSeriesName) {
                projectedDataPresentInSeries = false;
            }
            return false;
        }
        return true;
    });
    return { filtered, projectedDataPresentInSeries, projectedSeriesName };
}

export function filterDataPointsForCustomCharts(dataPoints, disabledSeriesData) {
    return dataPoints.map((item) => {
        const actualPoints = item?.actual?.subDataPoints || [];
        const comparePoints = item?.compare?.subDataPoints || [];
        const actualList = actualPoints.filter((data) => !disabledSeriesData.includes(data?.label));
        const compareList = comparePoints.filter((data) => !disabledSeriesData.includes(data?.label));
        return {
            ...item,
            actual: {
                ...item?.actual,
                subDataPoints: actualList,
            },
            ...(item?.compare && {
                compare: {
                    ...item?.compare,
                    subDataPoints: compareList,
                },
            }),
        };
    });
}

export function assignYAxisToSeries(seriesDetails) {
    let axisNum = 0;
    let updateSeriesDetails = cloneDeep(seriesDetails);
    updateSeriesDetails?.forEach((item, index) => {
        if (index > 0 && item?.axisLevel != updateSeriesDetails?.[index - 1]?.axisLevel) {
            axisNum = axisNum + 1;
        }
        item.yAxis = axisNum;
    });
    return updateSeriesDetails;
}

export const addProjectedData = (reportConfig) => {
    const dataPoints = reportConfig?.apiData?.dataPoints;
    const apiData = reportConfig?.apiData;
    const parserConfig = reportConfig.parserConfig;
    dataPoints.forEach((item, index) => {
        if (index == dataPoints.length - 1 && apiData.groupByType != "day") {
            item["projected"] = +getProjectedData(item.actual[`${parserConfig.projectedData.dataKey}`], apiData.groupByType, item.actual.endDate);
        } else {
            item["projected"] = 0;
        }
    });
    return reportConfig;
};

export const getProjectedDetail = (reportConfig) => {
    const dataKey = reportConfig.parserConfig.projectedData.dataKey;
    const chartType = reportConfig?.parserConfig?.primaryChartStyle;
    const projectedArray = [];
    const dataPoints = reportConfig?.apiData?.dataPoints;
    dataPoints.map((item) => {
        projectedArray.push({
            y: chartType === LINE_CHART ? (item.projected ? item.projected : null) : item.projected ? item.projected - item.actual[`${dataKey}`] : null,
            label: item.actual.label,
            dataLabels: {
                formatter() {
                    return item.projected.toLocaleString("en");
                },
                color: reportConfig.parserConfig.projectedData.color,
            },
            yProj: item.projected,
        });
    });
    return projectedArray;
};

export const getProjectedYaxis = (dataPointObj, item, primaryChartStyle, plotDataConfig) => {
    const yProj = dataPointObj.projected && dataPointObj.actual[`${item.dataKey}`] ? dataPointObj.actual[`${item.dataKey}`] : null;
    const projectYAxisObj = {
        y: dataPointObj.actual[`${item.dataKey}`],
        label: dataPointObj.actual.shortLabel ? dataPointObj.actual.shortLabel : dataPointObj.actual.label,
        yActual: dataPointObj.actual[`${item.dataKey}`],
        yProj,
    };
    if (yProj) {
        projectYAxisObj["marker"] = {
            fillColor: blue60,
        };

        const lineChartPlotConfig = plotDataConfig?.find((item) => item?.type === LINE_CHART);

        if (!lineChartPlotConfig?.marker?.disableCustomMarker && [VERTICAL_BAR_CHART, HORIZONTAL_BAR_CHART].includes(primaryChartStyle)) {
            projectYAxisObj["marker"] = {
                symbol: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAsCAYAAADy8T8XAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQQSURBVHgB7ZvNbhJRFMcPlAFtazLV2CpJE6KJ4qIfpq6Vhe7bJ9A+gfYJhCeob9D6BNaNa3StsbaJ0oUGo2lTEluSQhsGKJ7/nTvDhfIxQBd83H9yuAMMLH45554z957rox5UqVRMHmJsT9gibItsprR+VJYtLcdtto9sSZ/Pl6Uu5aMuxOBiPLymKrBB1xbbWwa5RR2qI4AMbpmHdbK9TejwpEzHZ+eUOTmno7MyWSWiYrlC/ShjzEeTIbagn8yrPpq5NiZMUZotwSA3vf6nJ4AMLsLDBtnhShYD2suU6MdhsW9hedVE0AY5FzYEWCmE9wqDTLf7fVuADO8lD3E2E+B2D4qUYnDDqDs3AipIzIvwxjetftMSIMPDPBfHdYo9bmffGniPayd45Hw4KGBKxRliotn9TQGq8L78tYbW65opOm3Q0mzQedsUYkOADjyE7KefBZEoRlFT4356eu8KBccEpoYQLwCUc56I+w/fz0SGHWUhwQCi1Fr9nFgDUGbbr2zmKIZtMynhjMTyUM3O/rp737GZv/6VNDxFqUxRlG1kPzRsqN+5ANn7XvCwmLMqIttq1QpMLLsCickHCiHVA5E4aJdvzFvDXap0I1ED77tRue5cCICSaATeh/DVaiyEsvTCiFwPcD3wOV52dei21V41N4iI9cslKRHTo1rvdaJUxo3QRbCDB8bwDvD03NdeCGHpaGIttAagljcdn7oPFwLgAq6yI/7E0YkyOZdVBADFinKuoAF61dGpG60LABjBVV4nYM8qVmc70/VAa8jX+S5TCivTT1o9CQDFlp5c89LyIIVV1gVojJGWR02EXIBpAMQOFF0f19HsVcrunfDA37iantQu6FXYU5b6BoBJXE1pD/QsZTM+6QDM4kOdSNoL818NQNlYI+bB+9MB0mqtmepU9x7snLgV23XRGYO0Wms+7DLaxIsAyCSTPKQRwtoLmwvdChN2Bk47nVxq5ljDC9oa9Fx4UZj7FO9zN9hdgJJoEvDmwjqU6zV/O+h437ba/lZfu6yyZbGRrEO5qiizkM1GSLgr6nc1AOWOu3DPR7Oh+ubDkRTq4yVmIZWo7xm8UD3L3g8B8fHd0EgX2HCgZ9W+mIa9gq3a2+Ikt+4+/yk4rQ0jI4RtnefFG93XrsEyThIiNtx3DizKF4Z74dUIcLa9Zag1cVN4kJcW31dkQzTzsm9mWLsX4HUo4wy7jOu9xdeRbHtD5xaONZAD8jBXHniPhMdFbwboAXucUa1/k2yrl9Jkrkp2cMEbI85n2E+2jzpUGOw5ob+mWOrTYw4MK8iFxdRVHG/w8+hvdMxhrZPzIt0etEErCPpplmnw5SymJOQjbUfq6ZlNOeoFwwY93keov496OcCwkJykHo96/QcAYYdVlHU8TgAAAABJRU5ErkJggg==)",
                width: 40,
                height: 22,
            };
        }
    }
    return projectYAxisObj;
};

export function maybeAddProjectedSeries(series, parserConfig, reportConfig, projectedDataPresentInSeries, isCompare) {
    if (parserConfig && parserConfig.showProjectedData && !isCompare && projectedDataPresentInSeries) {
        const projectedConfig = parserConfig.projectedData;
        reportConfig = addProjectedData(reportConfig);
        const obj = {
            name: projectedConfig.name,
            type: projectedConfig.type,
            color: projectedConfig.color,
            id: projectedConfig.id,
            maxPointWidth: projectedConfig.maxPointWidth || 20,
            data: getProjectedDetail(reportConfig),
            showInLegend: projectedConfig.showInLegend,
            dataLabels: {
                enabled: false,
            },
            stack: "stack1",
        };
        series.push(obj);
    }
}

export function hasDataKeyInActualOrCompare(dataPoints, item) {
    return dataPoints?.some((obj) => has(obj?.actual, item.dataKey)) || dataPoints?.some((obj) => has(obj?.compare, item.dataKey));
}

function assignSentimentColors(data, compareData, reportConfig) {
    if (reportConfig?.parserConfig?.isSentimentByNPS) {
        data.forEach((item) => {
            switch (item?.label) {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                    item.color = default2Star;
                    break;
                case "7":
                case "8":
                    item.color = default3Star;
                    break;
                case "9":
                case "10":
                    item.color = default5Star;
                    break;
                default:
                    break;
            }
        });

        compareData?.forEach((item) => {
            switch (item?.label) {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                    item.color = comparison2Star;
                    break;
                case "7":
                case "8":
                    item.color = comparison3Star;
                    break;
                case "9":
                case "10":
                    item.color = comparison5Star;
                    break;
                default:
                    break;
            }
        });
    }
}

// --- Atomic helpers for the 'else' case ---
export function getDataObj(reportConfig, parserConfig) {
    return reportConfig.apiData.dataPoints[0]?.actual?.[`${parserConfig["categoryKey"]}`];
}
export function getCompareDataObj(reportConfig, parserConfig) {
    return reportConfig.apiData.dataPoints[0]?.compare?.[`${parserConfig["categoryKey"]}`];
}
function getYValue(dataObj, key, item, parserConfig) {
    if (!dataObj) return null;
    if (item.subDataKey) {
        return dataObj?.[key]?.[item.subDataKey];
    }
    if (parserConfig.selectedDisplayValueAs) {
        return dataObj?.[key]?.[parserConfig.seriesDetails[0].dataKey]?.[parserConfig.selectedDisplayValueAs];
    }
    return dataObj?.[key];
}
function buildCategoryDataPoint({ dataObj, key, item, categoryValueMap, showExtraDataOnTooltip, parserConfig, reportConfig }) {
    return {
        y: getYValue(dataObj, key, item, parserConfig),
        label: item.name,
        color: categoryValueMap?.[key]?.["color"] ? categoryValueMap?.[key]?.["color"] : item?.["color"],
        compareData: false,
        showCustomToolTipValue: item?.showCustomToolTipValue || false,
        showPercent: item?.showPercent || false,
        extraData: showExtraDataOnTooltip ? dataObj?.[key]?.[showExtraDataOnTooltip] : null,
        showDisplayUnits: item?.showDisplayUnits || false,
        longLabel: getLongLabel(item, reportConfig),
    };
}

function buildCategoryDataArray({ dataObj, categoryList, categoryValueMap, item, showExtraDataOnTooltip, parserConfig, reportConfig }) {
    const data = [];
    if (!dataObj) return data;
    for (const key of categoryList) {
        if (categoryValueMap[key] && (dataObj[key] || dataObj[key] === 0)) {
            data.push(
                buildCategoryDataPoint({
                    dataObj,
                    key,
                    item,
                    categoryValueMap,
                    showExtraDataOnTooltip,
                    parserConfig,
                    reportConfig,
                }),
            );
        }
    }
    return data;
}
function buildCompareCategoryDataPoint({ dataObjCompare, key, item, categoryValueMap, showExtraDataOnTooltip, parserConfig, reportConfig }) {
    return {
        y: getYValue(dataObjCompare, key, item, parserConfig),
        label: item.name,
        color: categoryValueMap?.[key]?.["compareColor"] ? categoryValueMap[key]["compareColor"] : item.subDataKey ? item?.["compareColor"] : item?.["color"],
        showCustomToolTipValue: item?.showCustomToolTipValue || false,
        showPercent: item?.showPercent || false,
        compareData: true,
        extraData: showExtraDataOnTooltip ? dataObjCompare?.[key]?.[showExtraDataOnTooltip] : null,
        showDisplayUnits: item?.showDisplayUnits || false,
        longLabel: getLongLabel(item, reportConfig),
    };
}
function buildCompareCategoryDataArray({ dataObjCompare, categoryList, categoryValueMap, item, showExtraDataOnTooltip, parserConfig, reportConfig }) {
    const compareData = [];
    if (!dataObjCompare) return compareData;
    for (const key of categoryList) {
        if (categoryValueMap[key] && (dataObjCompare[key] || dataObjCompare[key] === 0)) {
            compareData.push(
                buildCompareCategoryDataPoint({
                    dataObjCompare,
                    key,
                    item,
                    categoryValueMap,
                    showExtraDataOnTooltip,
                    parserConfig,
                    reportConfig,
                }),
            );
        }
    }
    return compareData;
}
function buildActualSeriesObj({ item, data, chartType }) {
    return {
        name: item.name,
        type: item.type || chartType,
        color: item.color,
        id: item.id,
        maxPointWidth: item.maxPointWidth || 20,
        showInLegend: item.showInLegend,
        stack: "stack1",
        ...(item?.fillColor && { fillColor: item?.fillColor }),
        data,
    };
}

function buildCompareSeriesObj({ item, compareData, chartType, lineBubbles, isComparisonFilterApplied }) {
    return {
        name: item.name,
        type: item.type,
        color: chartType === LINE_CHART || chartType === AREA_CHART || (lineBubbles && item.type == LINE_CHART) ? item.color : item.compareColor,
        dashStyle: chartType === LINE_CHART || chartType === AREA_CHART || (lineBubbles && item.type == LINE_CHART) ? "dash" : undefined,
        id: item.id,
        maxPointWidth: item.maxPointWidth || 20,
        showInLegend: isComparisonFilterApplied ? false : item.showInLegend,
        stack: "stack2",
        isCompareObj: true,
        data: compareData,
    };
}

export function buildMainSeriesForDataPoints({ dataPoints, seriesDetails, parserConfig, chartType, lineBubbles, showRespCountOnTooltip, showExtraDataOnTooltip, groupByType, reportConfig, isComparisonFilterApplied, isCxMassTextingUsageOvertime, isprojectedDataDisplay }) {
    const series = [];
    seriesDetails?.forEach((item, mainIndex) => {
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
            ...(item?.zIndex && chartType === AREA_CHART ? { zIndex: item?.zIndex } : {}),
        };
            
        if (item?.hideDataLabels) {
            obj["dataLabels"] = {};
            obj["dataLabels"]["enabled"] = false;
        }

        const compareDataObj = {
            name: item?.compareName || item.name,
            type: item.type,
            color: chartType === LINE_CHART || chartType === AREA_CHART || (lineBubbles && item.type == LINE_CHART) ? item.color : item.compareColor,
            dashStyle: chartType === LINE_CHART || chartType === AREA_CHART || (lineBubbles && item.type == LINE_CHART) ? "dash" : undefined,
            id: item.id,
            maxPointWidth: item.maxPointWidth || 20,
            showInLegend: isComparisonFilterApplied && !item?.showLegendOnCompare ? false : item.showInLegend,
            stack: "stack2",
            legendIndex: item.legendIndex,
            toolTipLabel: item.toolTipLabel,
            removePercentIconFromTooltip: item.removePercentIconFromTooltip,
            isCompareObj: true,
            ...(item?.fillColor && { fillColor: item.fillColor }),
        };

        if (item?.hideDataLabels) {
            compareDataObj["dataLabels"] = {};
            compareDataObj["dataLabels"]["enabled"] = false;
        }

        if (item.isDottedSeries) {
            obj["dashStyle"] = "dash";
            compareDataObj["dashStyle"] = "dash";
        }
        if (item.yAxis) {
            obj["yAxis"] = item.yAxis;
            compareDataObj["yAxis"] = item.yAxis;
        }
        if (item.tickPositions) {
            obj["tickPositions"] = item.tickPositions;
            compareDataObj["tickPositions"] = item.tickPositions;
        }
        if (item.dataKey || item.compareDataKey) {
            obj["dataKey"] = item.dataKey;
            compareDataObj["compareDataKey"] = item.compareDataKey || item.dataKey;
        }
        const data = [];
        const compareData = [];
        if (dataPoints?.length) {
            dataPoints.forEach((dataPointObj, index) => {
                if (parserConfig.stackedGraph) {
                    if (parserConfig.isGroupedArrayWithoutCategoryKey) {
                        data.push({
                            y: !isEmpty(dataPointObj?.actual) ? dataPointObj?.actual?.[`${item?.dataKey}`] : null,
                            label: !isEmpty(dataPointObj?.actual) && dataPointObj?.actual?.shortLabel ? dataPointObj?.actual?.shortLabel : dataPointObj?.actual && dataPointObj?.actual?.label,
                            compareData: false,
                            extraData: getExtraData(item, showExtraDataOnTooltip, dataPointObj, "actual", parserConfig, isComparisonFilterApplied),
                            longLabel: getLongLabel(dataPointObj, reportConfig),
                        });
                        if (isComparisonFilterApplied) {
                            compareData.push({
                                y: !isEmpty(dataPointObj?.compare) ? dataPointObj?.compare?.[`${item?.dataKey}`] : null,
                                label: !isEmpty(dataPointObj?.compare) && dataPointObj?.compare?.shortLabel ? dataPointObj?.compare?.shortLabel : dataPointObj?.compare && dataPointObj?.compare?.label,
                                compareData: true,
                                extraData: getExtraData(item, showExtraDataOnTooltip, dataPointObj, "compare", parserConfig, isComparisonFilterApplied),
                                longLabel: getLongLabel(dataPointObj, reportConfig),
                            });
                        }
                    } else {
                        data.push({
                            y: !isEmpty(dataPointObj?.actual)
                                ? parserConfig?.dataPointsValueInObject
                                    ? dataPointObj?.actual?.[`${item?.dataKey}`]?.[`${item?.subDataKey}`]?.[`${parserConfig?.dataPointsValueKey}`]
                                    : dataPointObj.actual?.[`${item.dataKey}`]?.[getSubDataKeyOrFilterKey(reportConfig, item?.subDataKey)]
                                : null,
                            label: !isEmpty(dataPointObj?.actual) && dataPointObj?.actual?.shortLabel ? dataPointObj?.actual?.shortLabel : dataPointObj?.actual && dataPointObj?.actual?.label,
                            compareData: false,
                            extraData: !isEmpty(dataPointObj?.actual) && showRespCountOnTooltip ? dataPointObj?.actual?.[showRespCountOnTooltip] : !isEmpty(dataPointObj?.actual) && showExtraDataOnTooltip ? dataPointObj?.actual?.[showExtraDataOnTooltip] : null,
                            showDisplayUnits: item?.showDisplayUnits || false,
                            longLabel: getLongLabel(dataPointObj, reportConfig),
                        });
                        if (isComparisonFilterApplied) {
                            compareData.push({
                                y: !isEmpty(dataPointObj?.compare)
                                    ? parserConfig?.dataPointsValueInObject
                                        ? dataPointObj?.compare?.[`${item?.dataKey}`]?.[`${item?.subDataKey}`]?.[`${parserConfig?.dataPointsValueKey}`]
                                        : dataPointObj.compare?.[`${item.dataKey}`]?.[getSubDataKeyOrFilterKey(reportConfig, item?.subDataKey)]
                                    : null,
                                label: !isEmpty(dataPointObj?.compare) && dataPointObj?.compare?.shortLabel ? dataPointObj?.compare?.shortLabel : dataPointObj?.compare && dataPointObj?.compare?.label,
                                compareData: true,
                                extraData: !isEmpty(dataPointObj?.compare) && showRespCountOnTooltip ? dataPointObj?.compare[showRespCountOnTooltip] : !isEmpty(dataPointObj?.compare) && showExtraDataOnTooltip ? dataPointObj?.compare?.[showExtraDataOnTooltip] : null,
                                showDisplayUnits: item?.showDisplayUnits || false,
                                longLabel: getLongLabel(dataPointObj, reportConfig),
                            });
                        }
                    }
                } else {
                    if (parserConfig?.showProjectedData && index == dataPoints?.length - 1 && groupByType != "day" && !isComparisonFilterApplied) {
                        const primaryChartStyle = parserConfig?.primaryChartStyle;
                        const plotDataConfig = parserConfig?.plotDataConfig;
                        const projectedYaxis = getProjectedYaxis(dataPointObj, item, primaryChartStyle, plotDataConfig);
                        if (projectedYaxis["marker"]) {
                            isprojectedDataDisplay = true;
                        }
                        data.push(projectedYaxis);
                    } else if (parserConfig.isArrayKeyValueWithMultipleValues && !isCxMassTextingUsageOvertime) {
                        data.push({
                            y: !isEmpty(dataPointObj.actual) ? dataPointObj.actual?.count : null,
                            label: !isEmpty(dataPointObj.actual) && dataPointObj.actual.shortLabel ? dataPointObj.actual.shortLabel : dataPointObj.actual && dataPointObj.actual.label,
                            yActual: !isEmpty(dataPointObj.actual) ? dataPointObj.actual?.count : null,
                            compareData: false,
                            extraData: getExtraData(item, showExtraDataOnTooltip, dataPointObj, "actual", parserConfig, isComparisonFilterApplied),
                            longLabel: getLongLabel(dataPointObj, reportConfig),
                        });
                        if (isComparisonFilterApplied) {
                            compareData.push({
                                y: !isEmpty(dataPointObj.compare) ? dataPointObj.compare?.count : null,
                                label: !isEmpty(dataPointObj.compare) && dataPointObj.compare && dataPointObj.compare.label,
                                yActual: !isEmpty(dataPointObj.compare) ? dataPointObj.compare?.count : null,
                                compareData: true,
                                extraData: getExtraData(item, showExtraDataOnTooltip, dataPointObj, "compare", parserConfig, isComparisonFilterApplied),
                                longLabel: getLongLabel(dataPointObj, reportConfig),
                            });
                        }
                    } else {
                        const showProjectedDataPoint = parserConfig?.showProjectedDataPoint && index == dataPoints?.length - 1 && groupByType != "day" && !isComparisonFilterApplied;
                        const customToolTipLabel = !isEmpty(dataPointObj?.actual) && dataPointObj?.actual?.[showExtraDataOnTooltip] ? getFormattedLabel(dataPointObj?.actual) : null;
                        data.push({
                            y: !isEmpty(dataPointObj?.actual) ? (parserConfig?.isSubDataPoints ? dataPointObj?.actual?.subDataPoints[mainIndex]?.[`${item?.dataKey}`] : dataPointObj.actual?.[`${item.dataKey}`]) : null,
                            label: !isEmpty(dataPointObj.actual) && dataPointObj.actual.shortLabel ? dataPointObj.actual.shortLabel : dataPointObj.actual && dataPointObj.actual.label,
                            yActual: !isEmpty(dataPointObj?.actual) ? (parserConfig?.isSubDataPoints ? dataPointObj?.actual?.subDataPoints[mainIndex]?.[`${item?.dataKey}`] : dataPointObj.actual?.[`${item.dataKey}`]) : null,
                            compareData: false,
                            color: parserConfig.displayBarColorByRating ? getBarColorByRating("actual", dataPointObj?.actual?.avgRating) : null,
                            showCustomToolTipValue: item?.showCustomToolTipValue || false,
                            showPercent: item?.showPercent || false,
                            projectedDataValueForToolTip: showProjectedDataPoint ? +getProjectedData(dataPointObj.actual[`${item.dataKey}`], groupByType, dataPointObj?.actual?.endDate) : null,
                            extraData: parserConfig.enableToolTipPercentForSubData
                                ? dataPointObj?.actual?.subDataPoints
                                    ? dataPointObj.actual.subDataPoints[mainIndex]?.percent
                                    : dataPointObj?.actual?.percent
                                : getExtraData(item, showExtraDataOnTooltip, dataPointObj, "actual", parserConfig, isComparisonFilterApplied),
                            customToolTipLabel: customToolTipLabel ? customToolTipLabel : null,
                            showDisplayUnits: item?.showDisplayUnits || false,
                            longLabel: getLongLabel(dataPointObj, reportConfig),
                            ...(obj?.enableMarkerOnDistortedPoints &&
                                checkIfCurrentPointIsDistorted(dataPoints, index, mainIndex, item, dataPointObj, parserConfig) && {
                                    marker: {
                                        enabled: true,
                                        radius: 5,
                                        fillColor: obj?.color,
                                        lineColor: Highcharts.color(obj?.color).setOpacity(0.25).get(),
                                        lineWidth: 10,
                                        states: {
                                            hover: {
                                                enabled: false,
                                            },
                                        },
                                    },
                                }),
                        });
                        if (!isEmpty(item.customColorForDatapoints)) {
                            data[index].color = getCustomColour(item.customColorForDatapoints, index);
                        }
                        if (isComparisonFilterApplied) {
                            compareData.push({
                                y: !isEmpty(dataPointObj?.compare) ? (parserConfig?.isSubDataPoints ? dataPointObj?.compare?.subDataPoints[mainIndex]?.[`${item?.dataKey}`] : dataPointObj?.compare?.[`${item.dataKey}`]) : null,
                                label: !isEmpty(dataPointObj?.compare) && dataPointObj.compare.shortLabel ? dataPointObj.compare.shortLabel : dataPointObj.compare?.label,
                                yActual: !isEmpty(dataPointObj?.compare) ? (parserConfig?.isSubDataPoints ? dataPointObj?.compare?.subDataPoints[mainIndex]?.[`${item?.dataKey}`] : dataPointObj?.compare?.[`${item.dataKey}`]) : null,
                                compareData: true,
                                color: parserConfig.displayBarColorByRating ? getBarColorByRating("compare", dataPointObj?.compare?.avgRating) : null,
                                showCustomToolTipValue: item?.showCustomToolTipValue || false,
                                showPercent: item?.showPercent || false,
                                extraData: parserConfig.enableToolTipPercentForSubData ? dataPointObj?.compare?.subDataPoints?.[mainIndex]?.percent : getExtraData(item, showExtraDataOnTooltip, dataPointObj, "compare", parserConfig, isComparisonFilterApplied),
                                showDisplayUnits: item?.showDisplayUnits || false,
                                longLabel: getLongLabel(dataPointObj, reportConfig),
                            });
                        }

                        if (!isEmpty(item.customColorForDatapoints)) {
                            data[index].color = getCustomColour(item.customColorForDatapoints, index);
                        }
                    }
                    assignSentimentColors(data, compareData, reportConfig);
                }
            });
        }
        obj["data"] = data;
        compareDataObj["data"] = compareData;
        if (isComparisonFilterApplied) series.push(compareDataObj);
        series.push(obj);
    });
    return { series, isprojectedDataDisplay };
}

export function buildMainSeriesForCategory({ seriesDetails, dataObj, dataObjCompare, categoryList, categoryValueMap, showExtraDataOnTooltip, parserConfig, reportConfig, chartType, lineBubbles, isComparisonFilterApplied }) {
    const series = [];
    seriesDetails?.forEach((item) => {
        const data = buildCategoryDataArray({
            dataObj,
            categoryList,
            categoryValueMap,
            item,
            showExtraDataOnTooltip,
            parserConfig,
            reportConfig,
        });
        const obj = buildActualSeriesObj({
            item,
            data,
            chartType,
        });
        if (isComparisonFilterApplied) {
            const compareData = buildCompareCategoryDataArray({
                dataObjCompare,
                categoryList,
                categoryValueMap,
                item,
                showExtraDataOnTooltip,
                parserConfig,
                reportConfig,
            });
            const compareObj = buildCompareSeriesObj({
                item,
                compareData,
                chartType,
                lineBubbles,
                isComparisonFilterApplied,
            });
            series.push(compareObj);
        }
        series.push(obj);
    });
    return series;
}
// --- getSeriesData common helpers ends ---

export function getCommonSeriesData(reportConfig) {
    let series = [];
    const { parserConfig, apiData, isCxMassTextingUsageOvertime } = reportConfig || {};
    const { primaryChartStyle, showRespCountOnTooltip, showExtraDataOnTooltip } = parserConfig || {};
    const { dataPoints, groupByType } = apiData || {};
    let seriesDetails = getDynamicSeriesDetails(reportConfig);
    const chartType = primaryChartStyle;
    const lineBubbles = reportConfig?.parserConfig?.lineBubbles;
    const disabledSeriesData = reportConfig?.disabledSeriesData;
    const isComparisonFilterApplied = checkIfCompareFilterIsApplied(reportConfig);
    let isprojectedDataDisplay = false;
    let projectedDataPresentInSeries = true;
    if (disabledSeriesData) {
        const filtered = filterSeriesDetails(seriesDetails, disabledSeriesData, parserConfig);
        seriesDetails = filtered.filtered;
        projectedDataPresentInSeries = filtered.projectedDataPresentInSeries;
    }
    // ...existing code for filtering dataPoints for custom charts and matrix reports...
    seriesDetails = assignYAxisToSeries(seriesDetails);
    if (parserConfig.dataPoints) {
        maybeAddProjectedSeries(series, parserConfig, reportConfig, projectedDataPresentInSeries);
        const seriesData = buildMainSeriesForDataPoints({
            dataPoints,
            seriesDetails,
            parserConfig,
            chartType,
            lineBubbles,
            showRespCountOnTooltip,
            showExtraDataOnTooltip,
            groupByType,
            reportConfig,
            isComparisonFilterApplied,
            isCxMassTextingUsageOvertime,
            isprojectedDataDisplay,
        });
        isprojectedDataDisplay = seriesData.isprojectedDataDisplay;
        series = [...series, ...(seriesData.series || [])];
    } else {
        const dataObj = getDataObj(reportConfig, parserConfig);
        const categoryValueMap = parserConfig.categoryValueMap;
        const categoryList = parserConfig.categoryList;
        const dataObjCompare = getCompareDataObj(reportConfig, parserConfig);
        series = buildMainSeriesForCategory({
            seriesDetails,
            dataObj,
            dataObjCompare,
            categoryList,
            categoryValueMap,
            showExtraDataOnTooltip,
            parserConfig,
            reportConfig,
            chartType,
            lineBubbles,
            isprojectedDataDisplay,
            isComparisonFilterApplied,
        });
    }
    return series;
    // return {
    //     series,
    //     isprojectedDataDisplay,
    // };
}
