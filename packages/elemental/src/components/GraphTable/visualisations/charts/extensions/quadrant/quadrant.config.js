import { forEach } from "lodash";
import { getSeriesData } from "../areaspline/helper";

export const getLinearGradientCSS = (color) => {
    const { linearGradient, stops } = color;
    let angle;
    if (linearGradient) {
        if (linearGradient.x1 === 0 && linearGradient.x2 === 1 && linearGradient.y1 === 0 && linearGradient.y2 === 1) {
            angle = 45;
        } else {
            angle = 0;
        }
        const gradientStops = stops.map((stop) => `${stop[1]} ${stop[0] * 100}%`).join(", ");
        return `linear-gradient(${angle}deg, ${gradientStops})`;
    } else {
        return color;
    }
};

const renderQuadrants = (chart, reportConfig) => {
    const { parserConfig } = reportConfig || {};
    const { quadrantConfig, quadrantLabels } = parserConfig || {};
    
    // Skip if no quadrant config provided
    if (!quadrantConfig && !quadrantLabels) {
        return;
    }
    
    const xAxis = chart.xAxis[0];
    const yAxis = chart.yAxis[0];
    
    // Calculate midpoints (make these configurable if needed)
    const xMid = (xAxis.min + xAxis.max) / 2;
    const yMid = (yAxis.min + yAxis.max) / 2;
    
    // Convert to pixel coordinates
    const xMidPixel = xAxis.toPixels(xMid, false);
    const yMidPixel = yAxis.toPixels(yMid, false);
    
    // Draw four quadrants if quadrantConfig exists
    if (quadrantConfig) {
        // Top-left quadrant (2 - Underperforming)
        if (quadrantConfig["2"]) {
            chart.renderer.rect(
                xAxis.left,
                yAxis.top,
                xMidPixel - xAxis.left,
                yMidPixel - yAxis.top,
                0
            )
            .attr({
                fill: quadrantConfig["2"].bgColor || 'rgba(254, 239, 199, 0.3)',
                zIndex: 0,
                opacity: 0.3,
            })
            .add();
        }
        
        // Top-right quadrant (1 - Leading)
        if (quadrantConfig["1"]) {
            chart.renderer.rect(
                xMidPixel,
                yAxis.top,
                xAxis.left + xAxis.width - xMidPixel,
                yMidPixel - yAxis.top,
                0
            )
            .attr({
                fill: quadrantConfig["1"].bgColor || 'rgba(186, 228, 180, 0.3)',
                zIndex: 0,
                opacity: 0.3,
            })
            .add();
        }
        
        // Bottom-left quadrant (3 - Lagging)
        if (quadrantConfig["3"]) {
            chart.renderer.rect(
                xAxis.left,
                yMidPixel,
                xMidPixel - xAxis.left,
                yAxis.top + yAxis.height - yMidPixel,
                0
            )
            .attr({
                fill: quadrantConfig["3"].bgColor || 'rgba(253, 219, 216, 0.3)',
                zIndex: 0,
                opacity: 0.3,
            })
            .add();
        }
        
        // Bottom-right quadrant (4 - Emerging)
        if (quadrantConfig["4"]) {
            chart.renderer.rect(
                xMidPixel,
                yMidPixel,
                xAxis.left + xAxis.width - xMidPixel,
                yAxis.top + yAxis.height - yMidPixel,
                0
            )
            .attr({
                fill: quadrantConfig["4"].bgColor || 'rgba(220, 241, 217, 0.3)',
                zIndex: 0,
                opacity: 0.3,
            })
            .add();
        }
    }
    
    // Render quadrant labels if provided
    if (quadrantLabels && quadrantLabels.length) {
        const xMin = xAxis.min;
        const xMax = xAxis.max;
        const yMin = yAxis.min;
        const yMax = yAxis.max;
        
        const xOffset = 10;
        const yOffset = 10;
        
        quadrantLabels.forEach(label => {
            const isLeft = label.x < (xMin + xMax) / 2;
            const isTop = label.y > (yMin + yMax) / 2;
            
            let xPixel = xAxis.toPixels(label.x, false);
            let yPixel = yAxis.toPixels(label.y, false);
            
            if (isLeft) {
                xPixel = xAxis.left + xOffset;
            } else {
                xPixel = xAxis.left + xAxis.width - xOffset;
            }
            
            if (isTop) {
                yPixel = yAxis.top + yOffset;
            } else {
                yPixel = yAxis.top + yAxis.height - yOffset;
            }
            
            const labelElement = chart.renderer.label(
                label.text,
                xPixel,
                yPixel,
                'rect',
                null,
                null,
                true
            )
            .attr({
                fill: label.backgroundColor || label.headingPillColor,
                padding: label.padding || 8,
                r: label.borderRadius || 5,
                zIndex: 6
            })
            .css({
                color: label.color || label.headingTextColor || '#fff',
                fontSize: label.fontSize || '11px',
                fontWeight: label.fontWeight || 'bold'
            })
            .add();
            
            const bbox = labelElement.getBBox();
            
            let finalX = xPixel;
            let finalY = yPixel;
            
            if (!isLeft) {
                finalX = xPixel - bbox.width;
            }
            
            if (!isTop) {
                finalY = yPixel - bbox.height;
            }
            
            labelElement.attr({
                x: finalX,
                y: finalY
            });
        });
    }
};

export const quadrantChartConfig = {
    updateDrillType: () => {
        location.href = ("http://localhost:3000/?path=/story/component-graphtable--bubble");
    },
    mainHeading: "Competitor Analysis",
    heading: "How do you compare on satisfaction and market presence",
    disableEmailBodyEdit: false,
    graphId: "competitor-analysis-bubble",
    chartActions: [{}],
    
    // Y-Axis configuration
    yAxisOptions: {
        enableDoubleYAxis: false,
        leftYAxisOptions: {
            label: "Market presence",
            min: 0,
            max: 2500,
        },
    },
    
    displayUnit: null,
    legendValue: [],
    isCustomLegend: false,
    drillObj: {},
    
    // Parser configuration
    parserConfig: {
        allowSizeMe: true,
        byBassEqualCheck: true,
        isForceHorizontalScrollNeeded: false,
        hideGTMGraphTitle: false,
        dontOverideChartHeight: true,
        dontOverideChartWidth: true,
        
        // Chart type
        primaryChartStyle: "bubble",
        defaultChartStyle: "bubble",
        
        // Chart dimensions
        graphTitle: "How do you compare on satisfaction and market presence",
        dataFormat: "arrayKeyValue",
        spacingTop: 50,
        spacingRight: 50,
        spacingBottom: 80,
        marginLeft: 80,
        marginRight: 80,
        yAxisText: "Market presence",
        xAxisText: "Satisfaction",
        
        // Bubble chart specific config
        bubbleChartConfig: {
            minSize: 1,
            maxSize: 1,
            plotBorderWidth: 0,
            zoomType: 'xy',
        },

        // Plot data configuration - controls bubble styling
        plotDataConfig: [
            {
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    crop: false,
                    overflow: "allow",
                    inside: false,
                    useHTML: true,
                    formatter(data, reportsConfig) {
                        const { chartDisplayType } = reportsConfig || {};
                        let logoUrl = data?.point?.logoUrl;
                        let label = data?.point?.label;
                        const fileName = logoUrl ? logoUrl.split("/").pop() : "";
                        let color = getLinearGradientCSS(data?.point?.color);
                        
                        if (label == "You") {
                            color = "rgb(9, 68, 89)";
                        }
                        if (!logoUrl || fileName === "defaultbusiness.png") {
                            logoUrl = null;
                        }
                        if (label === "You") {
                            label = window?.BE?.business?.name || "You";
                        }
                        
                            const getInitials = (name) => {
                                if (!name) return "?";
                                const words = name.trim().split(/\s+/);
                                if (words.length === 1) {
                                    return words[0].substring(0, 2).toUpperCase();
                                }
                                return words.map(word => word[0]).join("").substring(0, 2).toUpperCase();
                            };
                            
                            const initials = getInitials(label);
                            
                            return `
                                <div class="custom-quadrant-datalabels" style="${logoUrl ? "" : `background: ${color}`}; border-color: ${color}; box-shadow: 0 0 0 3px white, 0 0 0 5px ${color};">
                                    ${logoUrl ? `<img src="${logoUrl}" alt="${label}" />` : `<span class="datalabel">${initials}</span>`}
                                </div>
                            `;
                        return '';
                    },
                    verticalAlign: "middle"
                },
                marker: {
                    enabled: false,
                    fillOpacity: 0,
                    lineColor: "white",
                    lineWidth: 0
                },
                states: {
                    hover: {
                        enabled: false,
                        halo: null
                    },
                    inactive: {
                        opacity: 0.6
                    }
                },
                point: {
                    events: {
                        mouseOver(e) {
                            if (e?.target?.dataLabel?.div?.children?.[0]) {
                                e.target.dataLabel.div.children[0].style.zIndex = 100;
                            }
                            if (e?.target?.chartDisplayType === "location") {
                                e.target.graphic.attr({ zIndex: 1 });
                            }
                        },
                        mouseOut(e) {
                            if (e?.target?.dataLabel?.div?.children?.[0]) {
                                if (e?.target?.groupId !== "self") {
                                    e.target.dataLabel.div.children[0].style.zIndex = 2;
                                }
                            }
                            if (e?.target?.chartDisplayType === "location" && e?.target?.groupId !== "self") {
                                e.target.graphic.attr({ zIndex: -1 });
                            }
                        }
                    }
                },
                // maxSize: 10,
                stickyTracking: false,
                jitter: {
                    x: 0.1,
                    y: 0.1
                }
            }
        ],
        
        // X-Axis configuration
        xAxisConfig: {
            gridLineWidth: 0,
            lineWidth: 0,
            title: "Satisfaction",
            min: 0,
            max: 5,
            tickInterval: 1,
        },
        
        // Y-Axis configuration
        yAxisConfig: {
            startOnTick: false,
            endOnTick: false,
            title: "Market presence",
            min: 0,
            max: 2500,
            gridLineWidth: 0,
            lineWidth: 1,
            lineColor: '#ccd6eb',
        },
        
        // Quadrant configuration - Maps to quadrant numbers
        quadrantConfig: {
            "1": {
                bgColor: "#BAE4B4",  // Top-right (Leading)
                headingPillColor: "#377E2C",
                headingTextColor: "white"
            },
            "2": {
                bgColor: "#FEEFC7",  // Top-left (Underperforming)
                headingPillColor: "#E6AA04",
                headingTextColor: "white"
            },
            "3": {
                bgColor: "#FDDBD8",  // Bottom-left (Lagging)
                headingPillColor: "#F3382B",
                headingTextColor: "white"
            },
            "4": {
                bgColor: "#DCF1D9",  // Bottom-right (Emerging)
                headingPillColor: "#4CAE3D",
                headingTextColor: "white"
            }
        },
        
        // Quadrant labels
        quadrantLabels: [
            {
                text: 'Underperforming',
                x: 0.5,
                y: 2350,
                headingPillColor: '#E6AA04',
                headingTextColor: '#fff',
                borderRadius: 5,
                padding: 8,
                fontSize: '11px',
                fontWeight: '500'
            },
            {
                text: 'Leading',
                x: 4.5,
                y: 2350,
                headingPillColor: '#377E2C',
                headingTextColor: '#fff',
                borderRadius: 5,
                padding: 8,
                fontSize: '11px',
                fontWeight: '500'
            },
            {
                text: 'Lagging',
                x: 0.5,
                y: 150,
                headingPillColor: '#F3382B',
                headingTextColor: '#fff',
                borderRadius: 5,
                padding: 8,
                fontSize: '11px',
                fontWeight: '500'
            },
            {
                text: 'Emerging',
                x: 4.5,
                y: 150,
                headingPillColor: '#4CAE3D',
                headingTextColor: '#fff',
                borderRadius: 5,
                padding: 8,
                fontSize: '11px',
                fontWeight: '500'
            }
        ],
        
        // Legend configuration
        legendConfig: {
            enabled: true,
            align: 'left',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            itemStyle: {
                fontSize: '12px',
                fontWeight: 'normal'
            },
            symbolRadius: 6,
            symbolHeight: 12,
            symbolWidth: 12,
            itemMarginBottom: 5
        },
        
        // Tooltip configuration
        tooltipFollowPointer: true,
        customToolTipFormatter: true,
        tooltipFormatter(point) {
            return `
                <div style="padding: 8px;">
                    <strong>${point.series.name}</strong><br/>
                    <span>Reviews: ${point.x}</span><br/>
                    <span>Rating: ${point.y}</span>
                </div>
            `;
        },
        
        // Series details
        seriesDetails: [
            {
                name: "You",
                type: "bubble",
                color: "#0d5a8f",
                id: "you",
                showInLegend: true,
            },
            {
                name: "Altima dental",
                type: "bubble",
                color: "#7e57c2",
                id: "altima-dental",
                showInLegend: true,
            },
            {
                name: "Coast dental",
                type: "bubble",
                color: "#ec407a",
                id: "coast-dental",
                showInLegend: true,
            },
            {
                name: "Toothworks",
                type: "bubble",
                color: "#ffa726",
                id: "toothworks",
                showInLegend: true,
            },
            {
                name: "Peach Tree Dental",
                type: "bubble",
                color: "#ef5350",
                id: "peachtree-dental",
                showInLegend: true,
            },
            {
                name: "White Teeth",
                type: "bubble",
                color: "#66bb6a",
                id: "whiteteeth",
                showInLegend: true,
            }
        ],

        utilityFns: {
            getChartOptions (reportConfig, chartConfig) {
                const { parserConfig } = reportConfig || {};
                const { primaryChartStyle, bubbleChartConfig } = parserConfig || {};            
                const defaultBubbleChartOptions = {
                    type: 'bubble',
                    // height: 600,
                    plotBorderWidth: bubbleChartConfig?.plotBorderWidth || 1,
                    zoomType: bubbleChartConfig?.zoomType || 'xy',
                    events: {
                        load: function() {
                            renderQuadrants(this, reportConfig);
                        }
                    }
                };
                return {
                    renderTo: `chart_${primaryChartStyle}`,
                    ...defaultBubbleChartOptions
                };
            },
        },
    },
    
    // API Data
    apiData: {
        dataPoints: [
            {
                id: "you",
                name: "You",
                label: "You",
                data: [[4.2, 1500]],
                color: "#0d5a8f",
                initials: "Q",
                logoUrl: null
            },
            {
                id: "altima-dental",
                name: "Altima dental",
                label: "Altima dental",
                data: [[2.2, 2000]],
                color: "#7e57c2",
                initials: "M3",
                logoUrl: null
            },
            {
                id: "coast-dental",
                name: "Coast dental",
                label: "Coast dental",
                data: [[3.2, 1600]],
                color: "#ec407a",
                initials: "M6",
                logoUrl: null
            },
            {
                id: "toothworks",
                name: "Toothworks",
                label: "Toothworks",
                data: [[3.2, 1900]],
                color: "#ffa726",
                initials: "M2",
                logoUrl: null
            },
            {
                id: "peachtree-dental",
                name: "Peach Tree Dental",
                label: "Peach Tree Dental",
                data: [[4.0, 1850]],
                color: "#ef5350",
                initials: "M4",
                logoUrl: null
            },
            {
                id: "whiteteeth",
                name: "White Teeth",
                label: "White Teeth",
                data: [[2.9, 2100]],
                color: "#66bb6a",
                initials: "M5",
                logoUrl: null
            }
        ]
    },    
    redirectURL: "",
};