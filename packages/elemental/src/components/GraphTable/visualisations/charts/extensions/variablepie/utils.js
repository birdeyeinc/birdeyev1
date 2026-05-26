// import { every, get, isEmpty } from "lodash";
import React from "react";
import {
  parserConstant,
  // VISUALIZATIONS_SHORT_CODES,
} from "../../../../common/constants";
import { getLegendDotColor } from "../../common/legend";

const { GROUPED } = parserConstant;
import { gray70, gray50, default2Star, default4Star, default5Star } from "sass/js/colors";

// const { PIE_CHART, VARIABLE_PIE_CHART } = VISUALIZATIONS_SHORT_CODES;


export const getSeriesDataForVariablePieChart = (reportsDetails, type) => {
    const parserConfig = reportsDetails.parserConfig;
    const isDynamicLabelColorInVariablePieChart = parserConfig?.isDynamicLabelColorInVariablePieChart;
    const getDynamicLabelColorForVariablePieChart = parserConfig?.getDynamicLabelColorForVariablePieChart;
    let disabledSeriesData;

    if (reportsDetails?.isCustomLegend) {
        disabledSeriesData = reportsDetails?.disabledSeriesData || [];
        disabledSeriesData = reportsDetails?.legendNameFormatter ? disabledSeriesData.map((item) => reportsDetails?.legendNameFormatter(item)) : disabledSeriesData; 
    }

    //y denotes the volume of each slice & z denoted the radius of each slice

    if (parserConfig.dataFormat === GROUPED) {
        const seriesDetails = parserConfig.seriesDetails;
        const dataObj = reportsDetails?.apiData?.dataPoints?.[0]?.[type]?.[`${parserConfig["categoryKey"]}`];
        const categoryValueMap = parserConfig.categoryValueMap;
        let categoryList = parserConfig.categoryList;
        if (reportsDetails?.isCustomLegend) {
            categoryList = categoryList.filter(item => !disabledSeriesData.includes(item));
        }

        const series = [];
        seriesDetails.forEach((item) => {
            const obj = {
                name: item?.name,
                color: parserConfig?.seriesDefaultColor || "#ccc",
                maxPointWidth: parserConfig?.seriesMaxPointWidth || 20,
                showInLegend: reportsDetails?.isCustomLegend ? false : item?.showInLegend
            };
            const data = [];
            for (const key of categoryList) {
                if (categoryValueMap?.[key] && (dataObj?.[key] || (dataObj?.[key] == 0 && !parserConfig?.skipVariablePieZeroData))) {
                    if (parserConfig?.isVariablePieSliceVolumeConstant) {
                        const itemName = categoryValueMap?.[key]?.["value"];
                        const itemColor = categoryValueMap?.[key]?.["color"] || "";
                        const defaultLightColor = parserConfig?.defaultLightLabelColor || "#212121";
                        const defaultDarkColor = parserConfig?.defaultDarkLabelColor || "#fff";
                        const lightColorThreshold = parserConfig?.lightColorThreshold || "#e5e5e5";
                        
                        const labelColor = isDynamicLabelColorInVariablePieChart && getDynamicLabelColorForVariablePieChart 
                            ? getDynamicLabelColorForVariablePieChart(itemName)
                            : (itemColor === lightColorThreshold ? defaultLightColor : defaultDarkColor);
                        
                        data.push({
                            y: dataObj?.[key],
                            z: dataObj?.[key],
                            name: itemName,
                            color: itemColor,
                            labelColor: labelColor,
                            showInLegend: true
                        });
                    }
                }
            }

            obj["data"] = data;
            const isNoData = data.every((dataObj) => dataObj.y === 0 && dataObj.z === 0);
            if (isNoData) {
                obj["noData"] = true;
            }
            series.push(obj);
        });
        const isNoData = series.every((obj) => obj.data.every((dataObj) => dataObj.y === 0 && dataObj.z === 0));
        if (isNoData) {
            let item = series?.[0]?.data?.[0] || {};
            series[0].data = [{
                ...item,
                y: parserConfig?.noDataSliceValue || 100,
                z: parserConfig?.noDataSliceValue || 100,
                legendColor: item?.color,
                color: parserConfig?.noDataSliceColor || "#F3F3F3",
                dataLabels: { enabled: false }
            }];
        }
        return series;
    }

    return;
};

//Function to determing center of each slice in variable radius pie chart and place the datalabels in the center 
export const redrawDatalabelsForVariableChart = function() {
    let chart = this,
        cX = chart?.series[0]?.center[0],
        cY = chart?.series[0]?.center[1],
        shapeArgs, ang, posX, posY, bBox;

    chart?.series[0]?.data.forEach((point) => {

        if (point?.dataLabel) {
            bBox = point?.dataLabel?.getBBox();
            shapeArgs = point?.shapeArgs;
            ang = (shapeArgs?.end - shapeArgs?.start) / 2 + shapeArgs?.start;
            posX = cX + (shapeArgs?.r / 2) * Math.cos(ang);
            posY = cY + (shapeArgs?.r / 2) * Math.sin(ang);

            /*
            point.dataLabel._pos.x = posX + ((point?.labelPosition?.alignment == "right" ? (1) : (-1)) * bBox?.width / 2);
            point.dataLabel._pos.y = posY -  bBox?.height / 2;
            */

            point.dataLabel.align({
                x: posX + ((point?.dataLabel?.dataLabelPosition?.alignment == "right" ? (1) : (-1)) * bBox?.width / 2),
                y: posY - bBox.height / 2
            }, false);
        }
    });

    //chart.series[0].placeDataLabels();
}

export const variablePiePlotData = (chartData) => {
    const isNoData = chartData?.chartConfig?.seriesData?.[0]?.noData;
    const finalConfig = {};

    const parserConfig = chartData?.reportDetails?.parserConfig;
    const states = {
        hover: {
            enabled: !isNoData
        },
        inactive: {
            enabled: !isNoData
        }
    };
    finalConfig["variablepie"] = {
        minPointSize: parserConfig?.minPointSize || 40,
        innerSize: parserConfig?.innerSize || "20%",
        zMin: parserConfig?.zMin || 0,
        borderRadius: parserConfig?.borderRadius || 5,
        animation: parserConfig?.enableAnimation !== undefined ? parserConfig.enableAnimation : false,
        // Ensure legend symbols are shown
        showInLegend: true,
        legendSymbol: 'circle',
        dataLabels: {
            enabled: isNoData ? false : (parserConfig?.enableDataLabels !== false),
            distance: parserConfig?.dataLabelDistance || 0,
            inside: parserConfig?.dataLabelInside !== false,
            connectorWidth: parserConfig?.dataLabelConnectorWidth || 0,
            allowOverlap: parserConfig?.dataLabelAllowOverlap !== undefined ? parserConfig.dataLabelAllowOverlap : false,
            crop: parserConfig?.dataLabelCrop !== undefined ? parserConfig.dataLabelCrop : false,
            overflow: parserConfig?.dataLabelOverflow || 'allow',
            padding: parserConfig?.dataLabelPadding || 0,
            minSize: parserConfig?.dataLabelMinSize || 8,
            verticalAlign: parserConfig?.dataLabelVerticalAlign || 'middle',
            align: parserConfig?.dataLabelAlign || 'center',
            x: parserConfig?.dataLabelX || 0,
            y: parserConfig?.dataLabelY || 0,
            filter: {
                property: parserConfig?.dataLabelFilterProperty || 'percentage',
                operator: parserConfig?.dataLabelFilterOperator || '>',
                value: parserConfig?.dataLabelFilterValue || 5
            },
             formatter: parserConfig?.dataLabelFormatter || function() {
                // Custom positioning for variable pie slices
                return `<span style="text-align: center; display: block;">${this.y}</span>`;
            },
            useHTML: parserConfig?.dataLabelUseHTML !== false,
            style: {
                fontSize: parserConfig?.dataLabelFontSize || "12px",
                fontWeight: parserConfig?.dataLabelFontWeight || 500,
                textOutline: parserConfig?.dataLabelTextOutline || "1px contrast",
                textAlign: parserConfig?.dataLabelTextAlign || "center",
                color: parserConfig?.dataLabelColor || "contrast",
            },
        },
        size: parserConfig?.chartSize || "100%",
        showInLegend: parserConfig?.showInLegend !== false,
        states,
        events: {
            legendItemClick: function(event) {
                return undefined; // Return undefined to allow default behavior
            }
        },
        point: {
            events: {
                // Handle individual point legend clicks
                legendItemClick: function(event) {
                    // Allow default Highcharts behavior
                    return undefined;
                }
            }
        }
    };

    return finalConfig;
};

export const getVariableChartConfig = (data, chartContainerId) => {
    const seriesDataForRadialChart = getSeriesDataForVariablePieChart(data, "actual");
    const parserConfig = data?.parserConfig;

    const actualRadialChartConfig = {
        chartContainerId,
        chart: {
            type: parserConfig?.chartType || "variablepie",
            marginTop: parserConfig?.chartMarginTop || 0,
            animation: parserConfig?.chartAnimation !== undefined ? parserConfig.chartAnimation : false,
            events: {
                //The below functions which gets triggered on these 2 events : load & redraw, calculates the center of each slice and position each dataLabel approximately in the center
                load: function() {
                    redrawDatalabelsForVariableChart.call(this);
                    // Note: Legend click handling is now managed in helper.js for better consistency and cleanup
                },
                redraw: redrawDatalabelsForVariableChart
            }
        },
        plotData: {
            method: variablePiePlotData
        },
        legendOptions: {
            align: parserConfig?.legendAlignment ? parserConfig?.legendAlignment : "center",
            enabled: true,
            padding: 0,
            useHTML: true,
            // Use default Highcharts legend formatting for better native integration
            ...(parserConfig?.legendItemDistance ? { itemDistance: parserConfig?.legendItemDistance } : {})
        },
        seriesData: seriesDataForRadialChart
    };

    return actualRadialChartConfig;
};