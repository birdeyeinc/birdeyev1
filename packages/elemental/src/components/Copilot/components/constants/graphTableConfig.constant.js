// Chart type constants
const HORIZONTAL_BAR_CHART = "bar";
const VERTICAL_BAR_CHART = "column";
const SPLINE = "spline";
const LINE_CHART = "line";
const AREA_CHART = "areaspline";

const getSpaceMultiplier = (isComparisonApplied, isCustomSpaceMultiplier = false, customSpaceMultiplier = 0, reportOverTime = false, primaryChartStyle = null, inverted = false, byLocationReport = false, isBarChart = false) => {
    let overTimeSpace = primaryChartStyle && primaryChartStyle == HORIZONTAL_BAR_CHART ? 60 : 80 ;
    // spacing
    let updateSpacingForHorizontalGraphs = !isComparisonApplied && (!inverted && primaryChartStyle === HORIZONTAL_BAR_CHART || inverted && primaryChartStyle != VERTICAL_BAR_CHART);
    let byLocationSpace = false
    if( byLocationReport && isBarChart) {
        byLocationSpace = true;
    }
    console.log("return getspacemultipler", isComparisonApplied ? 30 : (isCustomSpaceMultiplier ? customSpaceMultiplier : (reportOverTime ? overTimeSpace : (updateSpacingForHorizontalGraphs ? byLocationSpace ? 55 : 40 : 80))));
    return isComparisonApplied ? 30 : (isCustomSpaceMultiplier ? customSpaceMultiplier : (reportOverTime ? overTimeSpace : (updateSpacingForHorizontalGraphs ? byLocationSpace ? 55 : 40 : 80)));
};

const isHorizontalScrollingEnabledFn = (primaryChartStyle, defaultChartStyle, isForceHorizontalScrollNeeded) => {
    console.log("in function primaryChartStyle", primaryChartStyle);
    let isHorizontalScrollNeeded = isForceHorizontalScrollNeeded;
    switch (primaryChartStyle) {
        case "VERTICAL_BAR_CHART":
            isHorizontalScrollNeeded = true;
            break;
        case "HORIZONTAL_BAR_CHART":
            isHorizontalScrollNeeded = false;
            break;
        case "SPLINE":
        case "LINE_CHART":
        case "AREA_CHART":
        // case STACKED_AREA:
        // case STREAMGRAPH:
        // case HEATMAP:
            isHorizontalScrollNeeded = defaultChartStyle !== "HORIZONTAL_BAR_CHART";
            break;
    }

    return isHorizontalScrollNeeded;
};

const getScrollablePlotAreaConfig = (params, dataLength) => {
    console.log("params in getScrollablePlotAreaConfig", params);
    const byLocationReport = params?.byLocationReport;
    const isBarChart = params?.primaryChartStyle === "bar";
    const defaultChartStyle = params?.primaryChartStyle;
    const {primaryChartStyle, isComparisonApplied, isCustomSpaceMultiplier = false, customSpaceMultiplier = false, isCustomDataMultiplier = false, customDataMultiplier = false, isForceHorizontalScrollNeeded = false, inverted = false } = params;
    console.log("primaryChartStyle value", primaryChartStyle);
    const spaceMultiplier = getSpaceMultiplier(isComparisonApplied, isCustomSpaceMultiplier, customSpaceMultiplier, params?.reportOverTime, primaryChartStyle, inverted, byLocationReport, isBarChart);
    const dataMultiplier = 3;
    const updatedDataLength = isComparisonApplied ? dataLength * dataMultiplier : (isCustomDataMultiplier ? dataLength * customDataMultiplier : dataLength); //BIRD-50104(Soumya)
    let isHorizontalScrollNeeded = isHorizontalScrollingEnabledFn(primaryChartStyle, defaultChartStyle, isForceHorizontalScrollNeeded);
    console.log("isHorizontalScrollNeeded", isHorizontalScrollNeeded);
    if (isHorizontalScrollNeeded) {
        const minWidth = updatedDataLength * spaceMultiplier;
        console.log("returned minWidth scroll horizontal", { minWidth, opacity: 1 });
        return { minWidth, opacity: 1 };
    } else {
        const minHeight = updatedDataLength * spaceMultiplier;
        console.log("returned minHeight", { minHeight, opacity: 1 });
        return { minHeight, opacity: 1 };
    }
};

export const chartConfig = (params, dataLength) => {
    return {
        "renderTo": "chart_column",
        "height": "",
        "alignTicks": false,
        "animation": false,
        "marginTop": null,
        "marginRight": null,
        "marginBottom": null,
        "spacingTop": 14,
        "spacingRight": 0,
        "spacingBottom": 10,
        "spacingLeft": 10,
        "scrollablePlotArea": getScrollablePlotAreaConfig(params, dataLength),
        "inverted": false,
        "scrollbar": {
            "enabled": false
        }
    }
}

export const xAxisConfig = {
    "tickInterval": 1,
    "tickmarkPlacement": "off",
    "tickWidth": 1,
    "tickColor": "#e6e6e6",
    "tickLength": 8,
    "labels": {
        "autoRotation": 0,
        "enabled": true,
        "align": "center",
        "rotation": 0,
        "style": {
            "color": "#555",
            "fontWeight": 400,
            "width": 100,
            "min-width": 100,
            "textOverflow": "ellipsis",
            "whiteSpace": "nowrap",
            "fontSize": "12px",
            "position": "absolute",
            "text-align": "center"
        },
        "useHTML": false
    },
    "allowDecimals": false,
    "crosshair": {
        "color": "#e3effc"
    },
    "lineColor": "#E9E9EB"
};

export const yAxisConfig = [
    {
        "min": 0, // need from LLM
        "max": 400, // need from LLM
        "title": {
            "text": "",
            "x": -15,
            "y": -2,
            "margin": 5,
            "style": {
                "color": "#555",
                "fontSize": "12px"
            },
            "useHTML": false
        },
        "allowDecimals": false,
        "labels": {
            "margin": 10
        },
        "gridLineWidth": 0,
        "gridLineColor": "#efefef",
        "stackLabels": { // need from LLM
            "enabled": false,
            "rotation": null,
            "y": 0,
            "x": 0,
            "padding": null,
            "style": {
                "color": "#212121",
                "fontSize": "12px",
                "fontWeight": 400
            }
        },
        "tickPositions": null,
        "endOnTick": true,
        "plotLines": null,
        //"stackLabels": 20 // LLM needs to compute if this key should be sent with what value
    }
]

export const legendConfig = {
    "align": "left",
    "useHTML": true,
    "itemStyle": {
        "fontSize": "12px",
        "fontWeight": 400,
        "color": "#555555",
        "display": "flex",
        "alignItems": "center",
        "gap": "4px",
        "cursor": "pointer"
    },
    "reversed": false,
    "navigation": {
        "enabled": false
    },
    "itemDistance": 0
}

export const tooltipConfig = {
    "borderWidth": 0,
    "shared": true,
    "backgroundColor": "rgba(255,255,255,0)",
    "useHTML": true,
    "shadow": false,
    "snap": 0,
    "hideDelay": 50
}