const getMaxLinkCount = (data) => {
    if (data?.apiData?.dataPoints) {
        const countArr = data?.apiData?.dataPoints?.map((item) => {
            return item.nodes.reduce((nodeAcc, node) => nodeAcc + node.links.length, 0);
        }, 0);
        return Math.max(...countArr);
    }
    return 0;
};

export const sankeyChartConfig = {
    updateDrillType: () => {
        location.href = ("http://localhost:3000/?path=/story/component-graphtable--packedbubble");
    },
    mainHeading: "Categories",
    disableEmailBodyEdit: false,
    extraReqParams: { sortOrder: 1, sortedColumn: "review-count" },
    graphId: "call-ai-by-category-objective-and-outcomes",
    heading: "Objectives & outcomes",
    chartActions: [{}],
    yAxisOptions: {
        enableDoubleYAxis: true,
        leftYAxisOptions: {
            label: "Reviews",
            min: 0,
            max: 0,
        },
        rightYAxisOptions: {
            label: "Response rate",
            min: 0,
            max: 100,
        },
    },
    displayUnit: null,
    legendValue: [],
    isCustomLegend: false,
    drillObj: { objectiveId: "DEFAULT", objectiveName: "All Objectives" },
    parserConfig: {
        allowSizeMe: true,
        byBassEqualCheck: true,
        isForceHorizontalScrollNeeded: true,
        isCallsAIChart: true,
        hideGTMGraphTitle: true,
        dontOverideChartHeight: true,
        dontOverideChartWidth: true,
        xAxisLabelsWidth: {
            bar: 120,
            spline: 90,
            column: 90,
        },
        xAxisLabelsAlignment: {
            bar: "right",
            spline: "right",
            column: "right",
        },
        xAxisLabelsRotation: {
            bar: -90,
            column: -90,
            spline: -90,
            tickInterval: 1,
            defaultRotation: -90,
            align: "right",
        },
        doubleYaxis: true,
        dataPoints: true,
        displaySummary: false,
        graphTitle: "Objectives & outcomes",
        dataFormat: "arrayKeyValue",
        spacingTop: 50,
        spacingRight: 0,
        marginLeft: 0,
        marginRight: 0,
        removeZeroValueData: false,
        removeColumnKey1: "respondedCount",
        removeColumnKey2: "responseRate",
        removeColumnKey3: "unrespondedCount",
        primaryChartStyle: "sankey",
        defaultChartStyle: "sankey",
        enableCrosshair: true,
        reverseLegendOrder: true,
        reverseTooltipDataForStack: true,
        crosshairConfig: {
            color: "#e3effc",
        },
        enableScroll: true,
        addPositionerInTooltip: true,
        hideDottedLastLine: true,
        compareStacking: "normal",
        lineChartComparisonEnabled: false,
        reportOverTime: false,
        stackTooltipTotalLabel: "Reviews",
        showTotalOnBottom: true,
        primaryYaxisTickAmount: 6,
        lineBubbles: true,
        summaryData: null,
        isCustomSpaceMultiplier: true,
        getSpaceMultiplier() {
            return 38;
        },
        isCustomDataMultiplier: true,
        getDataMultiplier() {
            return 1;
        },
        tooltipFollowPointer: true,
        seriesDetails: [
            {
                name: "Categories",
                type: "sankey",
                color: "#212121",
                id: "categories-sankey",
                dataKey: "weight",
                showInLegend: false,
                primary: true,
                borderRadius: 0,
                nodeAlignment: "top",
            },
        ],
        // to alter the legend order
        enableLegendsIndexes: false,
        plotDataConfig: { sankey: {} },
        yAxisCustomMax(maxReviews, max2) {
            const max1 = maxReviews + Math.ceil((maxReviews / 100) * 10);
            max2 = 100;
            return {
                max1,
                max2,
            };
        },
        customToolTipFormatter: false,
        customSankeyChartTooltipPointFormatter() {},
        customSankeyChartTooltipNodeFormatter() {},
        disableCustomToolTipInComparison: true,
        getCustomSankeyChartHeight(data) {
            const BUFFER_HEIGHT = 50;
            let MIN_LINK_WIDTH = 18;
            const maxLinkCount = getMaxLinkCount(data);
            let newChartHeight = maxLinkCount * MIN_LINK_WIDTH + maxLinkCount * 8 + BUFFER_HEIGHT;
            let newChartWidth = 0;
            if (data?.cardConfig?.width < 1100 && data?.apiData?.dataPoints?.length > 3) {
                newChartWidth = 1200;
            }
            if (newChartHeight) {
                newChartHeight = data?.drillObj?.objectiveId === "DEFAULT" ? Math.floor((newChartHeight * 45) / 100) : Math.floor((newChartHeight * 50) / 100);
            }
            MIN_LINK_WIDTH = 10;
            if (newChartHeight > 600) {
                return { customHeight: newChartHeight, customMinLinkWidth: MIN_LINK_WIDTH, customWidth: newChartWidth };
            } else if (newChartHeight > 350) {
                return { customHeight: 460, customMinLinkWidth: MIN_LINK_WIDTH, customWidth: newChartWidth };
            } else {
                return { customHeight: 460, customMinLinkWidth: MIN_LINK_WIDTH, customWidth: newChartWidth };
            }
        },
    },
    apiData: {
        dataPoints: [
            {
                id: "objectives",
                label: "Objectives",
                nodes: [
                    {
                        id: 2,
                        label: "Appointment booking",
                        links: [
                            {
                                label: "Appointment scheduled",
                                weight: 3876,
                            },
                            {
                                label: "Action pending",
                                weight: 394,
                            },
                            {
                                label: "Service denied",
                                weight: 360,
                            },
                            {
                                label: "Information provided",
                                weight: 316,
                            },
                            {
                                label: "Incomplete interaction",
                                weight: 92,
                            },
                            {
                                label: "Appointment cancelled",
                                weight: 2,
                            },
                            {
                                label: "Insurance verification",
                                weight: 1,
                            },
                        ],
                        colorCode: "#db61db",
                    },
                    {
                        id: 7,
                        label: "Customer query",
                        links: [
                            {
                                label: "Information provided",
                                weight: 1501,
                            },
                            {
                                label: "Action pending",
                                weight: 286,
                            },
                            {
                                label: "Service denied",
                                weight: 188,
                            },
                            {
                                label: "Appointment scheduled",
                                weight: 81,
                            },
                            {
                                label: "Incomplete interaction",
                                weight: 33,
                            },
                            {
                                label: "Appointment rescheduled",
                                weight: 3,
                            },
                            {
                                label: "Appointment cancelled",
                                weight: 1,
                            },
                        ],
                        colorCode: "#5a4c97",
                    },
                    {
                        id: 3,
                        label: "Appointment reschedule",
                        links: [
                            {
                                label: "Appointment rescheduled",
                                weight: 1375,
                            },
                            {
                                label: "Action pending",
                                weight: 131,
                            },
                            {
                                label: "Information provided",
                                weight: 98,
                            },
                            {
                                label: "Appointment scheduled",
                                weight: 37,
                            },
                            {
                                label: "Appointment cancelled",
                                weight: 20,
                            },
                            {
                                label: "Incomplete interaction",
                                weight: 13,
                            },
                            {
                                label: "Service denied",
                                weight: 12,
                            },
                        ],
                        colorCode: "#70156C",
                    },
                    {
                        id: 4,
                        label: "Appointment verification",
                        links: [
                            {
                                label: "Information provided",
                                weight: 941,
                            },
                            {
                                label: "Appointment rescheduled",
                                weight: 84,
                            },
                            {
                                label: "Appointment scheduled",
                                weight: 80,
                            },
                            {
                                label: "Action pending",
                                weight: 57,
                            },
                            {
                                label: "Incomplete interaction",
                                weight: 17,
                            },
                            {
                                label: "Appointment cancelled",
                                weight: 14,
                            },
                            {
                                label: "Service denied",
                                weight: 9,
                            },
                            {
                                label: "Insurance verification",
                                weight: 1,
                            },
                        ],
                        colorCode: "#FFB9A7",
                    },
                    {
                        id: 8,
                        label: "Insurance",
                        links: [
                            {
                                label: "Information provided",
                                weight: 423,
                            },
                            {
                                label: "Action pending",
                                weight: 125,
                            },
                            {
                                label: "Insurance verification",
                                weight: 60,
                            },
                            {
                                label: "Appointment scheduled",
                                weight: 36,
                            },
                            {
                                label: "Service denied",
                                weight: 15,
                            },
                            {
                                label: "Incomplete interaction",
                                weight: 9,
                            },
                            {
                                label: "Appointment cancelled",
                                weight: 6,
                            },
                            {
                                label: "Appointment rescheduled",
                                weight: 4,
                            },
                        ],
                        colorCode: "#1877F2",
                    },
                    {
                        id: 6,
                        label: "Emergency",
                        links: [
                            {
                                label: "Appointment scheduled",
                                weight: 283,
                            },
                            {
                                label: "Service denied",
                                weight: 172,
                            },
                            {
                                label: "Action pending",
                                weight: 105,
                            },
                            {
                                label: "Information provided",
                                weight: 93,
                            },
                            {
                                label: "Incomplete interaction",
                                weight: 8,
                            },
                            {
                                label: "Appointment rescheduled",
                                weight: 2,
                            },
                        ],
                        colorCode: "#70156C",
                    },
                    {
                        id: 1,
                        label: "Appointment cancellation",
                        links: [
                            {
                                label: "Appointment cancelled",
                                weight: 485,
                            },
                            {
                                label: "Appointment rescheduled",
                                weight: 79,
                            },
                            {
                                label: "Action pending",
                                weight: 27,
                            },
                            {
                                label: "Information provided",
                                weight: 21,
                            },
                            {
                                label: "Incomplete interaction",
                                weight: 5,
                            },
                            {
                                label: "Appointment scheduled",
                                weight: 2,
                            },
                            {
                                label: "Service denied",
                                weight: 1,
                            },
                        ],
                        colorCode: "#56B9E0",
                    },
                    {
                        id: 5,
                        label: "Treatment follow-up",
                        links: [
                            {
                                label: "Appointment scheduled",
                                weight: 164,
                            },
                            {
                                label: "Action pending",
                                weight: 163,
                            },
                            {
                                label: "Information provided",
                                weight: 92,
                            },
                            {
                                label: "Appointment rescheduled",
                                weight: 5,
                            },
                            {
                                label: "Incomplete interaction",
                                weight: 3,
                            },
                            {
                                label: "Appointment cancelled",
                                weight: 1,
                            },
                        ],
                    },
                    {
                        id: 9,
                        label: "Others",
                        links: [
                            {
                                label: "Information provided",
                                weight: 1906,
                            },
                            {
                                label: "Action pending",
                                weight: 320,
                            },
                            {
                                label: "Incomplete interaction",
                                weight: 241,
                            },
                            {
                                label: "Others",
                                weight: 45,
                            },
                            {
                                label: "Service denied",
                                weight: 39,
                            },
                            {
                                label: "Appointment scheduled",
                                weight: 16,
                            },
                            {
                                label: "Appointment rescheduled",
                                weight: 3,
                            },
                            {
                                label: "Appointment cancelled",
                                weight: 1,
                            },
                        ],
                        colorCode: "#2C3E91",
                    },
                ],
                column: 0,
            },
            {
                id: "outcomes",
                label: "Outcomes",
                nodes: [
                    {
                        id: 28,
                        label: "Information provided",
                        links: [
                            {
                                label: "Attained",
                                weight: 4935,
                            },
                            {
                                label: "Missed",
                                weight: 456,
                            },
                        ],
                        colorCode: "#8D9DCA",
                    },
                    {
                        id: 23,
                        label: "Appointment scheduled",
                        links: [
                            {
                                label: "Attained",
                                weight: 4574,
                            },
                            {
                                label: "Missed",
                                weight: 1,
                            },
                        ],
                        colorCode: "#ADB3F2",
                    },
                    {
                        id: 27,
                        label: "Action pending",
                        links: [
                            {
                                label: "Attained",
                                weight: 1563,
                            },
                            {
                                label: "Missed",
                                weight: 45,
                            },
                        ],
                        colorCode: "#B98BB4",
                    },
                    {
                        id: 24,
                        label: "Appointment rescheduled",
                        links: [
                            {
                                label: "Attained",
                                weight: 1555,
                            },
                        ],
                        colorCode: "#F89CC8",
                    },
                    {
                        id: 26,
                        label: "Service denied",
                        links: [
                            {
                                label: "Missed",
                                weight: 473,
                            },
                            {
                                label: "Attained",
                                weight: 323,
                            },
                        ],
                        colorCode: "#ABE9DF",
                    },
                    {
                        id: 25,
                        label: "Appointment cancelled",
                        links: [
                            {
                                label: "Attained",
                                weight: 317,
                            },
                            {
                                label: "Missed",
                                weight: 213,
                            },
                        ],
                        colorCode: "#FEE1A5",
                    },
                    {
                        id: 30,
                        label: "Incomplete interaction",
                        links: [
                            {
                                label: "Attained",
                                weight: 307,
                            },
                            {
                                label: "Missed",
                                weight: 114,
                            },
                        ],
                        colorCode: "#bdb7d5",
                    },
                    {
                        id: 29,
                        label: "Insurance verification",
                        links: [
                            {
                                label: "Attained",
                                weight: 62,
                            },
                        ],
                        colorCode: "#91B7CA",
                    },
                    {
                        id: 31,
                        label: "Others",
                        links: [
                            {
                                label: "Attained",
                                weight: 45,
                            },
                        ],
                        colorCode: "#93BEFD",
                    },
                ],
                column: 1,
            },
            {
                label: "Opportunities",
                id: "opportunities",
                nodes: [
                    {
                        label: "Attained",
                        links: [],
                        colorCode: "#7ED321",
                    },
                    {
                        label: "Missed",
                        links: [],
                        colorCode: "#DE1B0C",
                    },
                ],
                column: 2,
            },
        ],
    },
    redirectURL: "",
};
