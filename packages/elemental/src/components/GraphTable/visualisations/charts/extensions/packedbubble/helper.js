import { baseConverter } from "../../common/converter";

/** ================================== Main Config keys utilities ======================================= */
export const getSeriesData = (reportConfig) => {
    const series = [];
    const { parserConfig, apiData } = reportConfig || {};
    const { seriesDetails } = parserConfig || {};
    if (seriesDetails?.length) {
        return seriesDetails.map((seriesDetail) => {
            return {
                ...seriesDetail,
                data: apiData,
            };
        });
    }
    return series;
};

const getChartOptions = (reportConfig) => {
    const { parserConfig, isLightWeightPage } = reportConfig || {};
    const { primaryChartStyle, chartWidthCustom, chart } = parserConfig || {};
    return {
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

const getSubTitle = () => ({text: ""});

const getXAxisConfig = () => {
    return [{
        categories: null,
        tickInterval: "2"
    }]
}

const getYAxisConfig = () => {
    return {
        labels: {
            enabled: false,
            formatter() {
                return this.value ? this.value.toLocaleString("en") : this.value
            },
            style: {
                color: "#555"
            }
        },
        title: {
            text: null,
            style: {
                color: "#555"
            }
        }
    }
}

const getLegendConfig = () => ({enabled: false});

const fallbackFns = {
    getChartOptions,
    getTitle,
    getSubTitle,
    getSeriesData,
    getXAxisConfig,
    getYAxisConfig,
    getLegendConfig
};

const configKeysWithOrder = [
    { key: "title", fn: "getTitle", order: 1 },
    { key: "subtitle", fn: "getSubTitle", order: 2 },
    { key: "series", fn: "getSeriesData", order: 3 },
    { key: "plotOptions", fn: "getPlotOptions", order: 4 },
    { key: "tooltip", fn: "getTooltip", order: 5 },
    { key: "chart", fn: "getChartOptions", order: 6 },
    { key: "colors", fn: "getColors", order: 7 },
    { key: "xAxis", fn: "getXAxisConfig", order: 8 },
    { key: "yAxis", fn: "getYAxisConfig", order: 9 },
    { key: "legend", fn: "getLegendConfig", order: 10 }
];

export function converter(reportConfig) {
    return baseConverter(reportConfig, configKeysWithOrder, fallbackFns);
}