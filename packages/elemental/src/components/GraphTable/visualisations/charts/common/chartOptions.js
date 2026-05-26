import { benchmarkingConstant, COMPETITOR_GRAPH_IDS, competitorAverageSeries, I_ACTIVE_CONVERSATIONS_CHANNELS, I_CHANNELS_RECEIVED_MESSAGES, parserConstant, VISUALIZATIONS_SHORT_CODES } from "components/GraphTable/common/constants";
import { checkIfCompareFilterIsApplied } from "components/GraphTable/common/helper";

const { HORIZONTAL_BAR_CHART, VERTICAL_BAR_CHART, SPLINE, LINE_CHART, AREA_CHART } = VISUALIZATIONS_SHORT_CODES;
const { GROUPED } = parserConstant;
const { GROUPED_COLUMN_CHART } = benchmarkingConstant;

export const defaultChartDataOptions = () => {
    return {
        height: 450,
        alignTicks: false,
        animation: false,
        marginTop: 100,
    };
};

export const isENTLightWeightPdfPage = () => {
    return window?.location?.pathname?.indexOf("er-independent-pdf-page") > -1;
};

export const isInsightsLightWeightPdfPage = () => {
    return window?.location?.pathname?.indexOf("insights-independent-pdf-page") > -1;
};

export const getChartMarginBottom = (params) => {
    let mb =
        params?.marginBottom && ((!params?.inverted && params?.primaryChartStyle !== HORIZONTAL_BAR_CHART) || (params?.inverted && params?.primaryChartStyle == VERTICAL_BAR_CHART))
            ? typeof params?.marginBottom == "function"
                ? params?.marginBottom(params?.categoriesLength)
                : params?.marginBottom
            : null;
    const disableSproutLabel = params?.isPNG || params?.graphId == I_ACTIVE_CONVERSATIONS_CHANNELS.graphId || params?.graphId == I_CHANNELS_RECEIVED_MESSAGES.graphId;
    if (params?.reportOverTime) {
        if (params?.isPNG && params?.groupByType == "week" && params?.isComparisonApplied) {
            mb = 150;
        } else if (params?.isOldLegends || disableSproutLabel) {
            mb = null;
        } else {
            mb = 78;
        }
    }
    if (params?.isOldLegends) {
        mb = null;
    }

    return mb;
};

const getSpaceMultiplier = (isComparisonApplied, isCustomSpaceMultiplier = false, customSpaceMultiplier = 0, reportOverTime = false, primaryChartStyle = null, inverted = false) => {
    const overTimeSpace = primaryChartStyle && primaryChartStyle == HORIZONTAL_BAR_CHART ? 60 : 80;
    const updateSpacingForHorizontalGraphs = !isComparisonApplied && ((!inverted && primaryChartStyle === HORIZONTAL_BAR_CHART) || (inverted && primaryChartStyle != VERTICAL_BAR_CHART));
    return isComparisonApplied ? 30 : isCustomSpaceMultiplier ? customSpaceMultiplier : reportOverTime ? overTimeSpace : updateSpacingForHorizontalGraphs ? 40 : 80;
};

export const isHorizontalScrollingEnabledFn = (primaryChartStyle, defaultChartStyle, isForceHorizontalScrollNeeded) => {
    let isHorizontalScrollNeeded = isForceHorizontalScrollNeeded;
    switch (primaryChartStyle) {
        case VERTICAL_BAR_CHART:
            isHorizontalScrollNeeded = true;
            break;
        case HORIZONTAL_BAR_CHART:
            isHorizontalScrollNeeded = false;
            break;
        case SPLINE:
        case LINE_CHART:
        case AREA_CHART:
            // case STACKED_AREA:
            // case STREAMGRAPH:
            // case HEATMAP:
            isHorizontalScrollNeeded = defaultChartStyle !== HORIZONTAL_BAR_CHART;
            break;
    }

    return isHorizontalScrollNeeded;
};

const getScrollablePlotAreaConfig = (params) => {
    if (isENTLightWeightPdfPage() || isInsightsLightWeightPdfPage()) {
        return {};
    }
    const { dataLength, primaryChartStyle, defaultChartStyle, isComparisonApplied, isCustomSpaceMultiplier, customSpaceMultiplier, isCustomDataMultiplier, customDataMultiplier, isForceHorizontalScrollNeeded = false, inverted } = params;
    const spaceMultiplier = getSpaceMultiplier(isComparisonApplied, isCustomSpaceMultiplier, customSpaceMultiplier, params?.reportOverTime, primaryChartStyle, inverted);
    const dataMultiplier = 3;
    const updatedDataLength = isComparisonApplied ? dataLength * dataMultiplier : isCustomDataMultiplier ? dataLength * customDataMultiplier : dataLength; //BIRD-50104(Soumya)
    const isHorizontalScrollNeeded = isHorizontalScrollingEnabledFn(primaryChartStyle, defaultChartStyle, isForceHorizontalScrollNeeded);

    if (isHorizontalScrollNeeded) {
        const minWidth = updatedDataLength * spaceMultiplier;
        return { minWidth, opacity: 1 };
    } else {
        const minHeight = updatedDataLength * spaceMultiplier;
        return { minHeight, opacity: 1 };
    }
};

export const defaultChartSettings = (params) => {
    return {
        animation: params?.animation ? params.animation : false,
        height: params?.height ? params.height : "",

        marginTop: params?.marginTop ? params.marginTop : null,
        marginRight: params?.marginRight ? params.marginRight : null,
        marginBottom: getChartMarginBottom(params),

        // Change done by Satyam, replaced ternary operator with null coalescing operator
        spacingTop: params?.spacingTop ?? (!isENTLightWeightPdfPage() ? 14 : 15),
        spacingRight: params?.spacingRight ?? (!isENTLightWeightPdfPage() ? 30 : null),
        spacingBottom: params?.spacingBottom ?? (!isENTLightWeightPdfPage() ? 30 : 0),
        spacingLeft: params?.spacingLeft ?? (!isENTLightWeightPdfPage() ? 15 : null),

        // TODO ENT Reporting: get minHeight value from data length
        scrollablePlotArea: getScrollablePlotAreaConfig(params),
        inverted: params?.inverted ? params.inverted : false,
        scrollbar: { enabled: false },
        //ignoreHiddenSeries: params?.ignoreHiddenSeries ? params.ignoreHiddenSeries : false
        ...(params?.chart ? params?.chart : {}), //Manish Kumar: BIRD-67996: for default chart event
        ...(params?.enableZoom ? { zooming: params?.chartZoomConfig, resetZoomButton: null } : {}),
    };
};

export const getDefaultChartOptions = (reportConfig, chartConfig) => {
    const { isRaceChartDownload, graphId } = reportConfig || {};
    const chart = reportConfig?.parserConfig?.chart || {};

    const parserConfig = reportConfig.parserConfig;
    const { defaultChartStyle, primaryChartStyle, dataFormat, isCustomSpaceMultiplier = false, getSpaceMultiplier, isCustomDataMultiplier = false, getDataMultiplier } = parserConfig;
    const marginTop = parserConfig.marginTop;
    const marginRight = parserConfig.marginRight;
    const marginBottom = parserConfig.marginBottom;
    const marginLeft = parserConfig.marginLeft;

    const spacingTop = parserConfig.spacingTop;
    const spacingRight = parserConfig.spacingRight;
    const spacingBottom = parserConfig.spacingBottom;
    const spacingLeft = parserConfig?.enableScroll ? 0 : parserConfig.spacingLeft;

    const inverted = (parserConfig.inverted && primaryChartStyle === LINE_CHART) || primaryChartStyle == HORIZONTAL_BAR_CHART;
    let dataLength = reportConfig?.apiData?.dataPoints?.length;
    if (graphId === COMPETITOR_GRAPH_IDS.leaderboardBySource) {
        dataLength = chartConfig?.series?.[0]?.data?.length;
    }
    if (isRaceChartDownload) {
        dataLength = chartConfig?.series?.[0]?.data?.length;
    }

    if (dataFormat === GROUPED) {
        const newDataLength = chartConfig?.series?.[0]?.data?.length;
        if (newDataLength > dataLength) {
            dataLength = newDataLength;
        }
    }

    //Manish Kumar: BIRD-67996: [3] : In grouped column chart datalength calculation i.e number of column
    if (reportConfig?.parserConfig?.graphId == GROUPED_COLUMN_CHART) {
        dataLength = chartConfig?.series?.reduce((acc, item) => {
            return item?.name === competitorAverageSeries?.name ? acc : acc + item?.data?.length;
        }, 0);
    }

    const defaultChartConfig = {
        width: "100%",
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        spacingTop,
        spacingRight,
        spacingBottom,
        spacingLeft,
        enableScroll: true,
        dataLength,
        inverted,
        defaultChartStyle,
        primaryChartStyle,
        isComparisonApplied: checkIfCompareFilterIsApplied(reportConfig),
        chartDimensions: {
            width: reportConfig?.chartConfig?.width,
            height: reportConfig?.chartConfig?.height,
        },
        isRaceChartDownload,
        chart,
        isCustomSpaceMultiplier,
        customSpaceMultiplier: isCustomSpaceMultiplier ? getSpaceMultiplier(primaryChartStyle) : null,
        isCustomDataMultiplier,
        customDataMultiplier: isCustomDataMultiplier ? getDataMultiplier(primaryChartStyle) : null,
        groupByType: reportConfig?.filterData?.groupByType || reportConfig?.apiData?.groupByType,
        isCustomLegend: reportConfig?.isCustomLegend,
        reportOverTime: reportConfig?.parserConfig?.reportOverTime,
        isOldLegends: reportConfig?.parserConfig?.seriesDetails?.[0]?.showInLegend,
        graphId: reportConfig?.graphId,
        categoriesLength: dataLength,
        isPNG: reportConfig?.fileType == "png",
        isForceHorizontalScrollNeeded: parserConfig?.isForceHorizontalScrollNeeded || false,
    };
    if (parserConfig?.enableZoom) {
        const chartZoomConfig = {
            type: parserConfig?.zoomingAxis,
            resetButton: parserConfig?.resetZoomCTAConfig,
        };
        defaultChartConfig["enableZoom"] = parserConfig?.enableZoom;
        defaultChartConfig["chartZoomConfig"] = chartZoomConfig;
    }
    if (isRaceChartDownload) {
        defaultChartConfig["animation"] = { duration: 1000 };
    }
    const finalChartConfig = defaultChartSettings(defaultChartConfig);
    if (parserConfig?.disabledMultiChartScroll || (typeof parserConfig?.scrollEnabled !== "undefined" && !parserConfig?.scrollEnabled)) {
        finalChartConfig["scrollablePlotArea"] = {};
    }
    return finalChartConfig;
};
