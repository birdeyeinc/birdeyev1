import { isEmpty } from "lodash";
import { baseConverter } from "../../common/converter";
import { getCategories } from "../../common/helper";
import { getCellDimensions, getXAxisCategories, getYAxisCategories } from "components/GraphTable/visualisations/ScrollableHeatmap/utils";
import { parserConstant } from "components/GraphTable/common/constants";
import { gray900, white } from "sass/js/colors";
import { defaultShowToolTip } from "../../common/tooltip";
import { OVERALL_WRAPPER_PADDING, DEFAULT_Y_AXIS_WIDTH} from "../../../ScrollableHeatmap/constants"

const getHeatMapPlotOptions = (parserConfig) => {
    const { disableHeatmapHover } = parserConfig || {};
    return {
        dataLabels: {
            enabled: true,
            color: gray900,
            style: {
                fontSize: "12px",
                fontWeight: "400",
                textOutline: "none",
            }
        },
        states: {
            hover: {
                enabled: !disableHeatmapHover,
            }
        },
        borderWidth: 1,
        borderColor: white
    }
};

const getDynamicMinWidth = (xAxisCategories, cellWidth) => {
    return xAxisCategories?.length * cellWidth;
};

const getDynamicMinHeight = (yAxisCategories, cellHeight) => {
    return yAxisCategories?.length * cellHeight;
};

/** ================================== Main Config keys utilities ======================================= */

const getChartOptions = (reportConfig) => {
    const { parserConfig, apiData } = reportConfig || {};
    const { primaryChartStyle, isDynamicMinWidth = false, isDynamicMinHeight = false } = parserConfig || {};
    
    const xAxisCategories = getXAxisCategories(apiData, reportConfig);
    const yAxisCategories = getYAxisCategories(reportConfig);

    const { cellWidth, cellHeight } = getCellDimensions(parserConfig);
    
    return {
        renderTo: `chart_${primaryChartStyle}`,
        type: "heatmap",
        ...(isDynamicMinWidth ? { width: getDynamicMinWidth(xAxisCategories, cellWidth) } : {}),
        ...(isDynamicMinHeight ? { height: getDynamicMinHeight(yAxisCategories, cellHeight) } : {})
    };
};

const getTitle = () => {
    return {
        text: "",
        style: {
            display: "none"
        }
    };
};

const getSubTitle = () => {
    return {
        text: "",
        style: {
            display: "none"
        }
    };
};

const getxAxis = (reportConfig) => {
    const { parserConfig } = reportConfig || {};
    return {
        categories: getCategories(reportConfig),
        opposite: false,
        lineWidth: 0,
        tickWidth: 0,
        labels: {
            enabled: parserConfig?.isCustomScroll ? false : true
        },
        title: {
            text: null
        }
    };
};

const getyAxis = (reportConfig) => {
    const { parserConfig } = reportConfig || {};
    const { yAxisOptions } = parserConfig || {};

    return {
        categories: yAxisOptions?.categoriesGenerator(reportConfig),
        reversed: true,
        lineWidth: 0,
        tickWidth: 0,
        labels: {
            enabled: parserConfig?.isCustomScroll ? false : true
        },
        title: {
            text: null
        }
    }
};

const getColorAxis = (reportConfig) => {
    const { parserConfig } = reportConfig || {};
    const { colorAxis } = parserConfig || {};

    return !isEmpty(colorAxis) ? colorAxis : null
};

const getPlotOptions = (reportConfig) => {
    return {
        heatmap: getHeatMapPlotOptions(reportConfig?.parserConfig)
    };
};

export const getSeriesData = (reportConfig) => {
    const { apiData, parserConfig } = reportConfig;
    
    const categoryKey = parserConfig?.categoryKey;
    const valueKey = parserConfig?.valueKey;
    const extraDataKey = parserConfig?.extraDataKey;
    const doNotShowZeroIfValueIsNull = parserConfig?.doNotShowZeroIfValueIsNull;
    
    const seriesObj = {
        name: parserConfig?.graphTitle,
        data: []
    };
    
    const data = [];
    
    const createDataPoint = (xIndex, yIndex, value, extraData) => {
        let finalValue;
        
        // Check if value is null or undefined (not present)
        if (value === null || value === undefined || value === "") {
            finalValue = doNotShowZeroIfValueIsNull ? "-" : 0;
        } 
        // If value exists (even if it's 0), use it
        else {
            finalValue = Number(value);
        }
        
        const config = {
            x: xIndex,
            y: yIndex,
            value: finalValue,
            extraData
        };
        
        return config;
    };
    
    apiData?.dataPoints?.forEach((dataPoint, xIndex) => {
        const actualData = dataPoint?.actual;
        
        if (parserConstant.ARRAY_KEY_VALUE) {
            actualData?.[categoryKey].forEach((item, yIndex) => {
                const value = item?.[valueKey];
                const extraData = item?.[extraDataKey] || item?.extraData || {};
                const config = createDataPoint(xIndex, yIndex, value, extraData);
                data.push(config);
            });
        } else if (parserConstant.GROUPED_ARRAY) {
            Object.values(actualData?.[categoryKey]).forEach((value, yIndex) => {
                const extraData = actualData?.[extraDataKey] || actualData?.extraData || {};
                const config = createDataPoint(xIndex, yIndex, value, extraData);
                data.push(config);
            });
        }
    });
    
    seriesObj.data = data;
    
    return [seriesObj];
};

const getLegend = (reportConfig) => {
    const showLegend = reportConfig?.parserConfig?.showDefaultLegend ?? true;

    return {
        enabled: showLegend,
        align: "left",
        padding: 0
    };
};

export const getTooltip = (reportConfig, chartConfig) => {
    const tooltipClass = "";
    return defaultShowToolTip(tooltipClass, reportConfig, chartConfig);
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
export function getChartConfigWithContainer(reportConfig, containerWidth) {
    const { parserConfig, apiData } = reportConfig || {};
    const { cellWidth: minCellWidth, cellHeight } = getCellDimensions(parserConfig);
    const xAxisCategories = getXAxisCategories(apiData, reportConfig);

    const autoCellWidth = containerWidth && xAxisCategories.length > 0
        ? (containerWidth - (parserConfig?.yAxisOptions?.yAxisWidth ?? DEFAULT_Y_AXIS_WIDTH) - OVERALL_WRAPPER_PADDING) / xAxisCategories.length
        : minCellWidth;
    const cellWidth = Math.max(autoCellWidth, minCellWidth);

    return {
        cellWidth,
        cellHeight,
    };
}
