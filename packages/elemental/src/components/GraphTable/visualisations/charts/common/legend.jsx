import React from "react";
import { checkIfCompareFilterIsApplied } from "components/GraphTable/common/helper";
import has from "lodash/has";
import { VISUALIZATIONS_SHORT_CODES } from "components/GraphTable/common/constants/index";
const { DONUT_CHART, VARIABLE_PIE_CHART, PIE_CHART } = VISUALIZATIONS_SHORT_CODES;

export const getLegendDotColor = (color) => {
    if (typeof color === "string") {
        return color;
    }
    if (has(color, "stops")) {
        return color?.stops?.[1]?.[1];
    }
};

export function getCommonLegend(reportConfig) {
    const { parserConfig } = reportConfig;
    const isLegendsDisable = parserConfig.disableLegends;
    const isCompareFilterApplied = checkIfCompareFilterIsApplied(reportConfig) && !parserConfig.disableCompareChart;

    return {
        align: "left",
        useHTML: true,
        labelFormatter() {
            let color = this.color;
            let name = this.name;
            let visible = this.visible;
            let fSize = parserConfig?.customLegendFontSize || 12;
            const legendDotColor = getLegendDotColor(color);
            return `
                <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${legendDotColor};"></span>
                <span style="font-size:12px;font-weight:400;vertical-align:middle;">${name}</span>
            `;
        },
        itemStyle: {
            fontSize: "12px",
            fontWeight: 400,
            color: "#555555",
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: isCompareFilterApplied || isLegendsDisable ? "default" : "pointer",
            ...(isLegendsDisable && { pointerEvents: "none" }),
        },
        reversed: parserConfig.reverseLegendOrder ? parserConfig.reverseLegendOrder : false,
        navigation: {
            enabled: false,
        },
        itemDistance: 0,
        ...(parserConfig?.legendsLeftPadding && { x: parserConfig.legendsLeftPadding })
    };
}

export function legendClickHandler(params, id, setDisabledSeriesData, disabledSeriesData) {
        let ds = [...disabledSeriesData];
        if (ds.includes(id)) {
            ds = ds.filter(item => item !== id);
        } else if ((params?.legendValue.length - ds.length) < 2) {
            return;
        } else {
            ds = [...ds, id];
        }
        setDisabledSeriesData(ds);
}

export function getCustomLegends(params, chartConfig, disabledSeriesData = [], setDisabledSeriesData) {
    const { disabledSeries = [], parserConfig, legendValue: newLegendValue } = params || {};
    let seriesData = [PIE_CHART, DONUT_CHART, VARIABLE_PIE_CHART].includes(parserConfig?.primaryChartStyle) ? chartConfig?.series?.[0]?.data : parserConfig?.seriesDetails;
    if (parserConfig?.isDataInSeriesExists) {
        seriesData = [...chartConfig?.series?.[0]?.data, chartConfig?.series?.[1]?.data[0]];
    }

    const filteredLegendValue = newLegendValue?.filter((legend) => !disabledSeries?.includes(legend));
    if (!filteredLegendValue?.length) {
        return null;
    }
    return (
        <div className="custom-scroll legend-item" >
            {filteredLegendValue?.map((item) => {
                const seriesItem = seriesData?.find((val) => {
                    return val?.name == item;
                });
                const legendColor = seriesItem?.legendColor || seriesItem?.color;
                const disableLegend = disabledSeriesData?.includes(item);
                return (
                    <span
                        key={item}
                        className="legend-box"
                        onClick={() => {
                            legendClickHandler(params, item, setDisabledSeriesData, disabledSeriesData);
                        }}
                    >
                        <span className={`legend-icon ${disableLegend ? "disabled-legend-icon" : ""}`} style={{ color: legendColor }}>●{" "} </span>
                        <span className={`${disableLegend ? "disabled-legend-label" : ""}`}>{item}</span>
                    </span>
                );
            })}
        </div>
    );
}