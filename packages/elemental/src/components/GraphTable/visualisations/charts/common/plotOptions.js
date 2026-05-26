import { checkIfCompareFilterIsApplied, formatNumberToUnits, getMaxValueForYAxis } from "components/GraphTable/common/helper";
import { getCategories } from "./helper";

export function canToggleSeries(clickedSeries) {
    const chart = clickedSeries.chart;
    const otherVisible = chart.series.filter((s) => s !== clickedSeries && s.visible);
    return !clickedSeries.visible || otherVisible.length > 0;
}

export const handleReviewProjectedOnLegendClick = (event, reportConfig) => {
    const series = event;
    const { parserConfig } = reportConfig || {};
    const { customYmin } = parserConfig || {};
    const rightYMin = customYmin ? customYmin : 0;
    const seriesArr = event.chart.series;
    if (series.name === "Review count") {
        for (let i = 0; i < seriesArr.length; i++) {
            if (seriesArr[i].visible && seriesArr[i].name === "Reviews projected") {
                seriesArr[i].hide();
            } else if (!seriesArr[i].visible && seriesArr[i].name === "Reviews projected") {
                seriesArr[i].show();
            }
        }
    }
    setTimeout(() => {
        const disabledSeries = [];
        for (const item of seriesArr) {
            if (!item.visible) {
                disabledSeries.push(item.name);
            }
        }
        const { max1 = 0, max2 = 0 } = getMaxValueForYAxis(reportConfig, disabledSeries);
        if (max1 && series?.chart?.yAxis?.[0]) {
            series.chart.yAxis[0].setExtremes(0, max1);
        }
        if (max2 && series?.chart?.yAxis[1]) {
            series.chart.yAxis[1].setExtremes(rightYMin, max2);
        }
    });
};

export const getSeriesPlotOptions = (reportConfig) => {
    const isLegendsDisable = reportConfig?.parserConfig.disableLegends;
    const ifCompareFilterApplied = checkIfCompareFilterIsApplied(reportConfig);
    let pointWidth = 20;
    if (reportConfig.parserConfig.maxPointWidth) {
        pointWidth = reportConfig.parserConfig.maxPointWidth;
    }
    return {
        pointWidth: pointWidth,
        stickyTracking: true,
        pointPadding: 0.25,
        animation: false,
        labelRank: 5,
        turboThreshold: 0,
        groupPadding: 0.2,
        borderRadiusTopLeft: 4,
        borderRadiusTopRight: 4,
        dataLabels: {
            allowOverlap: false,
            crop: false,
            overflow: "none",
            inside: false,
        },
        minPointLength: 1,
        marker: {
            radius: 3,
            symbol: "circle",
        },
        states: {
            hover: {
                enabled: true, // Enable marker on hover
                radius: 3,
            },
        },
        lineWidth: 1,
        cursor: "default", // Added default cursor as pointer on point/series hover. Can be modified by individual config.
        events: {
            mouseOut() {
                this.chart.tooltip.update({
                    isHidden: true,
                });
            },
            legendItemClick() {
                if (!canToggleSeries(this)) return false;

                if (ifCompareFilterApplied || isLegendsDisable) {
                    return false;
                }
                const legendItem = this.legendItem;
                let visibleSeriesCount = 0;
                const seriesArr = this.chart.series;
                const isVisible = this.visible;
                for (let i = 0; i < seriesArr.length; i++) {
                    if (seriesArr[i].visible && seriesArr[i].name !== "Reviews Projected") {
                        visibleSeriesCount++;
                    }
                }
                if (visibleSeriesCount === 1 && isVisible) {
                    return false;
                }

                if (isVisible && legendItem?.css) {
                    legendItem.css({
                        textDecoration: "line-through",
                        backgroundColor: "red",
                    });
                } else if (legendItem.css) {
                    legendItem.css({
                        textDecoration: "none",
                    });
                }
                handleReviewProjectedOnLegendClick(this, reportConfig);
            },
        },
    };
};

export const defaultColumnPlotData = (reportConfig) => {
    const categories = getCategories(reportConfig);

    return {
        column: {
            dataLabels: {
                enabled: false,
                rotation: () => {
                    return categories.length > 13 ? -90 : 0;
                },
                verticalAlign: "top",
                y: 0,
                fontSize: "12px",
                fontWeight: 400,
                color: "#212121",
                formatter: (value) => {
                    return formatNumberToUnits(value);
                },
                stacking: "normal",
                style: {
                    fontSize: "12px",
                    fontWeight: "500",
                    textShadow: false,
                    textOutline: false,
                },
            },
            inside: false,
            labelRank: 5,
            turboThreshold: 0,
            animation: false,
            borderRadiusTopLeft: 4,
            borderRadiusTopRight: 4,
            states: {
                hover: {
                    enabled: false,
                },
                inactive: {
                    enabled: false,
                },
            },
            events: {
                legendItemClick() {
                    const series = this;
                    let visibleSeriesCount = 0;
                    const seriesArr = this.chart.series;
                    const isVisible = series.visible;

                    for (let i = 0; i < seriesArr.length; i++) {
                        if (seriesArr[i].visible && seriesArr[i].name !== "Reviews Projected") {
                            visibleSeriesCount++;
                        }
                    }

                    if (isVisible && visibleSeriesCount > 1) {
                        series.hide();
                    } else {
                        series.show();
                    }

                    series.chart.legend.render();
                    series.chart.redraw();
                    return false;
                },
            },
        },
    };
};

export const defaultBarPlotData = (reportConfig) => {
    const categories = getCategories(reportConfig);

    return {
        column: {
            dataLabels: {
                enabled: false,
                verticalAlign: "middle",
                format: "{point.y}",
                fontSize: "12px",
                fontWeight: 400,
                color: "#212121",
                text: "",
                rotation: () => {
                    return categories.length > 13 ? -90 : 0;
                },
            },
            inside: false,
            labelRank: 5,
            turboThreshold: 0,
            animation: false,
            borderRadiusTopLeft: 4,
            borderRadiusTopRight: 4,
            states: {
                hover: {
                    enabled: false,
                },
                inactive: {
                    enabled: false,
                },
            },
            events: {
                legendItemClick() {
                    const series = this;
                    let visibleSeriesCount = 0;
                    const seriesArr = this.chart.series;
                    const isVisible = series.visible;

                    for (let i = 0; i < seriesArr.length; i++) {
                        if (seriesArr[i].visible && seriesArr[i].name !== "Reviews Projected") {
                            visibleSeriesCount++;
                        }
                    }

                    if (isVisible && visibleSeriesCount > 1) {
                        series.hide();
                    } else {
                        series.show();
                    }

                    series.chart.legend.render();
                    series.chart.redraw();
                    return false;
                },
            },
        },
    };
};

/* SANKEY CHART PLOT HELPERS STARTS */
const getAllLinks = (point) => {
    if (point?.isNode) {
        return [point, ...point.linksTo, ...point.linksFrom];
    } else if (point) {
        return [point];
    }
};

export function sankeyHoverHandler(point, state) {
    const allLinks = getAllLinks(point);
    if (allLinks?.length) {
        const filteredLinks = allLinks.filter((link) => link.isNode || link.weight);
        const columnLength = point.series.nodeColumns?.length;
        const linksArrP1 = point?.isNode ? point.linksTo : [];
        const linksArrP2 = point?.isNode ? point.linksFrom : [];
        let combinedLinksArr = [];
        if (point?.isNode && point.column === 0) {
            combinedLinksArr = [...linksArrP2];
        } else if (point?.isNode && point.column > 0 && point.column <= columnLength - 1) {
            combinedLinksArr = linksArrP1.length > 1 ? [...linksArrP1] : [...linksArrP2];
        }
        const allPercentValueArr = combinedLinksArr
            .filter((link) => link.weight)
            .reduce((acc, curr) => {
                if (curr.isNode) {
                    return acc;
                }
                if (curr.fromNode.name === point.name && curr.toNode.name === point.name) {
                    acc.push(Math.round((curr.weight / curr.toNode.sum) * 100 * 100) / 100);
                } else if (curr.fromNode?.name === point.name) {
                    acc.push(Math.round((curr.weight / curr.fromNode.sum) * 100 * 100) / 100);
                } else {
                    acc.push(Math.round((curr.weight / curr.toNode.sum) * 100 * 100) / 100);
                }
                return acc;
            }, []);
        const minPercentValue = Math.min(...allPercentValueArr);
        const totalPercent = minPercentValue === 100 ? minPercentValue : allPercentValueArr.reduce((acc, curr) => acc + curr, 0);
        const linkFormattingProcessed = [];
        filteredLinks.forEach((link) => {
            let label = link.name;
            let weight = link.sum;
            let percent = 100;
            let formattedWeight = formatNumberToUnits(weight);
            if (link.isNode) {
                label = state ? `${label} - ${formattedWeight}` : `${label}`;
                link?.dataLabel.textSetter(label);
            } else {
                weight = link.weight;
                formattedWeight = formatNumberToUnits(weight);
                if (point?.isNode) {
                    if (link?.fromNode?.dataLabel) {
                        if (link?.fromNode?.destroyed || link?.toNode?.destroyed) return;
                        if (link.fromNode.name === point.name && link.toNode.name === point.name) {
                            percent = Math.round((weight / link.fromNode.sum) * 100 * 100) / 100;
                            const tempPercentValue = percent;

                            if (totalPercent > 100 && minPercentValue === percent && !linkFormattingProcessed.includes(percent)) {
                                percent = parseFloat((percent - 0.01).toFixed(2));
                            } else if (totalPercent < 100 && minPercentValue === percent && !linkFormattingProcessed.includes(percent)) {
                                percent = parseFloat((percent + 0.01).toFixed(2));
                            }

                            linkFormattingProcessed.push(tempPercentValue);

                            label = state ? `${link.fromNode.name} - ${formattedWeight} (${percent}%)` : `${link.fromNode.name}`;
                            link?.toNode?.dataLabel.textSetter(label);
                        } else if (link.fromNode?.name === point.name) {
                            percent = Math.round((weight / link.fromNode.sum) * 100 * 100) / 100;
                            const tempPercentValue = percent;

                            if (totalPercent > 100 && minPercentValue === percent && !linkFormattingProcessed.includes(percent)) {
                                percent = parseFloat((percent - 0.01).toFixed(2));
                            } else if (totalPercent < 100 && minPercentValue === percent && !linkFormattingProcessed.includes(percent)) {
                                percent = parseFloat((percent + 0.01).toFixed(2));
                            }

                            linkFormattingProcessed.push(tempPercentValue);

                            label = state ? `${link.toNode.name} - ${formattedWeight} (${percent}%)` : `${link.toNode.name}`;
                            link?.toNode?.dataLabel.textSetter(label);
                        } else {
                            percent = Math.round((weight / link.toNode.sum) * 100 * 100) / 100;
                            const tempPercentValue = percent;

                            if (totalPercent > 100 && minPercentValue === percent && !linkFormattingProcessed.includes(percent)) {
                                percent = parseFloat((percent - 0.01).toFixed(2));
                            } else if (totalPercent < 100 && minPercentValue === percent && !linkFormattingProcessed.includes(percent)) {
                                percent = parseFloat((percent + 0.01).toFixed(2));
                            }

                            linkFormattingProcessed.push(tempPercentValue);

                            label = state ? `${link.fromNode.name} - ${formattedWeight} (${percent}%)` : `${link.fromNode.name}`;
                            link?.fromNode?.dataLabel.textSetter(label);
                        }
                    }
                }
            }
            if (link?.toNode?.dataLabel?.options?.x < 0 && point.isNode) {
                let x = link.toNode.dataLabel.alignAttr.x;
                if (state) {
                    const isSameNode = point.isNode && point.name === link.toNode.name;
                    const nodeLabel = isSameNode ? `${link.toNode.name} - ${formatNumberToUnits(link.toNode.sum)}` : label;
                    const labelWidth = nodeLabel.length * 5.5 + 20;
                    x = link.toNode.nodeX - labelWidth;
                }
                link.toNode.dataLabel.attr({ x });
            }
        });
    }
}

export const defaultSankeyPlotData = () => {
    return {
        sankey: {
            dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    crop: false,
                    overflow: "allow",
                    useHTML: false,
                    nodeFormatter() {
                        return this?.point?.name;
                    },
                    verticalAlign: "middle",
                    align: "left",
                    style: {
                        color: "#212121",
                        fontSize: "12px",
                        fontWeight: 500,
                        letterSpacing: 0.05,
                    },
                },
                minLinkWidth: 8,
                point: {
                    events: {
                        mouseOver() {
                            if (this.isNode && this.column === 0 && !this.isDrillDown) {
                                this?.graphic.css({
                                    cursor: "pointer",
                                });
                            }
                            sankeyHoverHandler(this, "hover");
                        },
                        mouseOut() {
                            if (this.isNode && this.column === 0 && !this.isDrillDown) {
                                this?.graphic.css({
                                    cursor: "default",
                                });
                            }
                            sankeyHoverHandler(this, "");
                        },
                    },
                },
                states: {
                    hover: {
                        linkOpacity: 0.5,
                    },
                    inactive: {
                        linkOpacity: 0.025,
                    },
                },
                stacking: "normal",
                animation: false,
        }
    };
};
/* SANKEY CHART PLOT HELPERS ENDS */