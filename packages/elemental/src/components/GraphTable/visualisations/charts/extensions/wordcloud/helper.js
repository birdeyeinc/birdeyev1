import { merge } from "lodash";
import { green100, red90, yellow90 } from "sass/js/colors";
import { numberWithCommas } from "utils/index";
import { baseConverter } from "../../common/converter";
import Styles from "../../styles/charts.module.scss";

const getWordCloudPlotOptions = (reportConfig) => {
    const { parserConfig, onWordSelection } = reportConfig || {};
    const { disableWordCloudClick } = parserConfig || {};
    return {
        cursor: disableWordCloudClick ? undefined : "pointer",
        events: {
            click: disableWordCloudClick
                ? undefined
                : function () {
                      onWordSelection(this);
                  },
        },
    };
};

/** ================================== Main Config keys utilities ======================================= */
const getColorFormattedData = (data, color, totalCount, sentiment, dataKey) => {
    const formattedData = [];
    const noBreakSpace = String.fromCharCode(0xa0);
    data?.forEach((ele, index) => {
        totalCount += 1;
        totalCount <= 45 &&
            formattedData.push({
                name: `${noBreakSpace}${ele.name}${noBreakSpace}`,
                weight: ele?.[dataKey] || 0,
                color,
                mentions: ele?.[dataKey] || 0,
                id: `${ele.id}-${sentiment}-${index}`,
                elementId: ele.id,
                sentiment,
            });
    });
    return formattedData;
};

const preprocessData = (data, dataKey) => {
    const colorData = [];
    let totalCount = 0;
    if (data?.["NEGATIVE"]) {
        const formattedData = getColorFormattedData(data?.["NEGATIVE"], red90, totalCount, "NEGATIVE", dataKey);
        totalCount += formattedData.length;
        colorData.push(...formattedData);
    }

    if (data?.["NEUTRAL"]) {
        const formattedData = getColorFormattedData(data?.["NEUTRAL"], yellow90, totalCount, "NEUTRAL", dataKey);
        totalCount += formattedData.length;
        colorData.push(...formattedData);
    }

    if (data?.["POSITIVE"]) {
        const formattedData = getColorFormattedData(data?.["POSITIVE"], green100, totalCount, "POSITIVE", dataKey);
        totalCount += formattedData.length;
        colorData.push(...formattedData);
    }

    return colorData;
};

const getThemeBasedData = (data, theme) => {
    const { themes } = data || {};
    let newData = themes;
    if (theme == "pos") {
        newData = themes?.["POSITIVE"] ? { POSITIVE: themes?.["POSITIVE"] } : {};
    } else if (theme == "neg") {
        newData = themes?.["NEGATIVE"] ? { NEGATIVE: themes?.["NEGATIVE"] } : {};
    } else if (theme == "neu") {
        newData = themes?.["NEUTRAL"] ? { NEUTRAL: themes?.["NEUTRAL"] } : {};
    }

    return newData;
};

export const getSeriesData = (reportConfig) => {
    const series = [];
    const { parserConfig, apiData, selectedWordCloudTheme } = reportConfig || {};
    const { seriesDetails } = parserConfig || {};
    if (seriesDetails?.length) {
        return seriesDetails.map((seriesDetail) => {
            return {
                ...seriesDetail,
                data: preprocessData(getThemeBasedData(apiData, selectedWordCloudTheme), seriesDetail?.dataKey),
            };
        });
    }
    return series;
};

const getChartOptions = (reportConfig) => {
    const { parserConfig, isLightWeightPage } = reportConfig || {};
    const { primaryChartStyle, chartWidthCustom, chart } = parserConfig || {};
    return {
        type: "wordcloud",
        renderTo: `chart_${primaryChartStyle}`,
        margin: 0,
        width: isLightWeightPage && chartWidthCustom,
        backgroundColor: "transparent",
        ...(chart || {})
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
    return {
        text: "",
    };
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
    const { wordcloud } = plotDataConfig;

    return {
        wordcloud: merge(getWordCloudPlotOptions(reportConfig), wordcloud),
    };
};

export const getTooltip = () => {
    return {
        borderWidth: 0,
        shared: true,
        backgroundColor: "rgba(255,255,255,0)",
        shadow: false,
        snap: 0,
        hideDelay: 50,
        useHTML: true,
        formatter() {
            const point = this.point;
            return `<div class="${Styles["wordCloudTooltipMain"]}">
                        <div class="${Styles["wordCloudTooltipTitle"]}">${point?.name?.trim()}</div>
                        <div class="${Styles["wordCloudTooltipWeight"]}"><span>Total mentions</span><strong>${numberWithCommas(point.mentions)}</strong></div>
                    </div>
                `;
        },
    };
};

const getColors = (reportConfig) => {
    const { parserConfig } = reportConfig || {};
    const { colors } = parserConfig || {};
    return colors || ["transparent"];
};

const fallbackFns = {
    getChartOptions,
    getTitle,
    getSubTitle,
    getPlotOptions,
    getSeriesData,
    getTooltip,
    getColors,
};

const configKeysWithOrder = [
    { key: "title", fn: "getTitle", order: 1 },
    { key: "subtitle", fn: "getSubTitle", order: 2 },
    { key: "series", fn: "getSeriesData", order: 3 },
    { key: "plotOptions", fn: "getPlotOptions", order: 4 },
    { key: "tooltip", fn: "getTooltip", order: 5 },
    { key: "chart", fn: "getChartOptions", order: 6 },
    { key: "colors", fn: "getColors", order: 7 },
];

export function converter(reportConfig) {
    return baseConverter(reportConfig, configKeysWithOrder, fallbackFns);
}
