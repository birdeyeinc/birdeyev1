export const REPORTS_CONFIG = {
    disableEmailBodyEdit: false,
    tempUniqueId: "reputationScoreOverTimeDetails1750915838942108",
    parserConfig: {
        xAxisConfig: {
            enabled: true,
        },
        dataFormat: "arrayWithKeyValue",
        displaySummary: false,
        crosshairConfig: {
            color: "#e3effc",
        },
        showProjectedData: false,
        enableDataLabelRotation: true,
        yAxisText: "",
        stackedGraph: true,
        addPositionerInTooltip: true,
        doubleYaxis: false,
        graphTitle: "Birdeye Score over time",
        xAxisLabelsAlignment: {
            bar: "right",
            column: "right",
            spline: "right",
            areaspline: "right",
        },
        seriesDetails: [
            {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        x2: 1,
                        y1: 0,
                        y2: 1,
                    },
                    stops: [
                        [0, "rgba(15, 113, 149, 0.1)"],
                        [1, "rgba(15, 113, 149, 0)"],
                    ],
                },
                primary: true,
                color: "#0f7195",
                name: "Birdeye Score",
                showInLegend: true,
                dataKey: "experience",
                subDataKey: "score",
                zIndex: 10,
                maxPointWidth: 20,
                type: "areaspline",
                yAxisLabel: "",
                id: "experience",
                yAxis: 0,
            },
            {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        x2: 1,
                        y1: 0,
                        y2: 1,
                    },
                    stops: [
                        [0, "rgba(204, 204, 204, 0.3)"],
                        [1, "rgba(204, 204, 204, 0)"],
                    ],
                },
                primary: true,
                color: "#ccc",
                name: "Industry average",
                showInLegend: true,
                dataKey: "industryAverage",
                subDataKey: "score",
                zIndex: 5,
                maxPointWidth: 20,
                type: "areaspline",
                yAxisLabel: "",
                id: "lineProjected",
                yAxis: 0,
            },
        ],
        isCustomSpaceMultiplier: true,
        getSpaceMultiplier: () => {
            return 80;
        },
        isMultipleKeyValue: true,
        dataPoints: true,
        reversedStacks: false,
        plotDataConfig: {
            areaspline: {
                dataLabels: {
                    allowOverlap: false,
                    crop: false,
                    overflow: "none",
                    inside: false,
                },
                labelRank: 5,
                turboThreshold: 0,
                animation: false,
                borderRadiusTopLeft: 4,
                borderRadiusTopRight: 4,
                states: {
                    hover: {
                        enabled: true,
                        radius: 3,
                    },
                    inactive: {
                        halo: null,
                    },
                },
                events: {},
                stacking: null,
                pointWidth: 20,
                marker: {
                    enabled: false,
                    radius: 3,
                    symbol: "circle",
                    lineColor: null,
                    lineWidth: 0,
                },
                minPointLength: 3,
                stickyTracking: true,
                pointPadding: 0.25,
                groupPadding: 0.2,
                lineWidth: 2,
                clip: false,
                cursor: "default",
            },
        },
        spacingBottom: 10,
        marginRight: 0,
        xAxisLabelsWidth: {
            bar: 120,
            column: 90,
        },
        removeZeroValueData: false,
        tableConfig: {
            isDynamicTable: true,
            sortingIconWidthConsider: true,
            actual: [
                {
                    dataLabel: "Date",
                    dataKey: "label",
                    width: 280,
                    enableSort: true,
                    columnKey: "date",
                },
                {
                    dataLabel: "Birdeye Score",
                    dataKey: "experienceScore",
                    width: 130,
                    enableSort: true,
                    columnKey: "experienceScore",
                },
                {
                    dataLabel: "Industry average",
                    dataKey: "industryAverage",
                    width: 130,
                    enableSort: true,
                    columnKey: "industryAverage",
                    isDataAvailable: true,
                },
            ],
        },
        enableScroll: true,
        lineBubbles: true,
        defaultChartStyle: "areaspline",
        primaryChartStyle: "areaspline",
        marginLeft: 0,
        reportOverTime: true,
        xAxisLabelsRotation: {
            bar: -90,
            column: -90,
            spline: -90,
            areaspline: -90,
            tickInterval: 1,
            defaultRotation: -90,
            align: "center",
        },
        hideDottedLastLine: true,
        spacingRight: 0,
        yAxisTickInterval: 20,
        yAxisConfig: {
            enabled: true,
        },
        enableCrosshair: true,
        reverseLegendOrder: false,
    },
    heading: "Birdeye Score over time",
    apiData: {
        dataPoints: [
            {
                actual: {
                    listing: {
                        score: 21,
                    },
                    experienceScore: 27.6,
                    endDate: "03/28/2025",
                    experience: {
                        score: 27.6,
                    },
                    sentiment: {
                        score: 33.3,
                    },
                    startDate: "03/28/2025",
                    label: "Mar 28, 2025",
                    shortLabel: "Mar 28 '25",
                    reputation: {
                        score: 28.2,
                    },
                    industryAverage: {
                        score: 54.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 21,
                    },
                    experienceScore: 10.5,
                    endDate: "03/29/2025",
                    experience: {
                        score: 10.5,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "03/29/2025",
                    label: "Mar 29, 2025",
                    shortLabel: "Mar 29 '25",
                    reputation: {
                        score: 0,
                    },
                    industryAverage: {
                        score: 48.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 21,
                    },
                    experienceScore: 38.9,
                    endDate: "03/30/2025",
                    experience: {
                        score: 38.9,
                    },
                    sentiment: {
                        score: 50,
                    },
                    startDate: "03/30/2025",
                    label: "Mar 30, 2025",
                    shortLabel: "Mar 30 '25",
                    reputation: {
                        score: 45.3,
                    },
                    industryAverage: {
                        score: 15.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 21,
                    },
                    experienceScore: 53.7,
                    endDate: "03/31/2025",
                    experience: {
                        score: 53.7,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "03/31/2025",
                    label: "Mar 31, 2025",
                    shortLabel: "Mar 31 '25",
                    reputation: {
                        score: 38.7,
                    },
                    industryAverage: {
                        score: 10.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 21,
                    },
                    experienceScore: 19.3,
                    endDate: "04/01/2025",
                    experience: {
                        score: 19.3,
                    },
                    sentiment: {
                        score: 17.3,
                    },
                    startDate: "04/01/2025",
                    label: "Apr 01, 2025",
                    shortLabel: "Apr 01 '25",
                    reputation: {
                        score: 19.6,
                    },
                    industryAverage: {
                        score: 11.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 21.8,
                    },
                    experienceScore: 52.5,
                    endDate: "04/02/2025",
                    experience: {
                        score: 52.5,
                    },
                    sentiment: {
                        score: 90,
                    },
                    startDate: "04/02/2025",
                    label: "Apr 02, 2025",
                    shortLabel: "Apr 02 '25",
                    reputation: {
                        score: 44.6,
                    },
                    industryAverage: {
                        score: 33.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 21.8,
                    },
                    experienceScore: 57.8,
                    endDate: "04/03/2025",
                    experience: {
                        score: 57.8,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "04/03/2025",
                    label: "Apr 03, 2025",
                    shortLabel: "Apr 03 '25",
                    reputation: {
                        score: 50.4,
                    },
                    industryAverage: {
                        score: 50.3,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 21.8,
                    },
                    experienceScore: 43.2,
                    endDate: "04/04/2025",
                    experience: {
                        score: 43.2,
                    },
                    sentiment: {
                        score: 76.3,
                    },
                    startDate: "04/04/2025",
                    label: "Apr 04, 2025",
                    shortLabel: "Apr 04 '25",
                    reputation: {
                        score: 30.4,
                    },
                    industryAverage: {
                        score: 26.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 21.8,
                    },
                    experienceScore: 58.1,
                    endDate: "04/05/2025",
                    experience: {
                        score: 58.1,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "04/05/2025",
                    label: "Apr 05, 2025",
                    shortLabel: "Apr 05 '25",
                    reputation: {
                        score: 51.3,
                    },
                    industryAverage: {
                        score: 16.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 21.8,
                    },
                    experienceScore: 28.2,
                    endDate: "04/06/2025",
                    experience: {
                        score: 28.2,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "04/06/2025",
                    label: "Apr 06, 2025",
                    shortLabel: "Apr 06 '25",
                    reputation: {
                        score: 34.6,
                    },
                    industryAverage: {
                        score: 11.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22,
                    },
                    experienceScore: 57.9,
                    endDate: "04/07/2025",
                    experience: {
                        score: 57.9,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "04/07/2025",
                    label: "Apr 07, 2025",
                    shortLabel: "Apr 07 '25",
                    reputation: {
                        score: 50.4,
                    },
                    industryAverage: {
                        score: 16.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22,
                    },
                    experienceScore: 11.6,
                    endDate: "04/08/2025",
                    experience: {
                        score: 11.6,
                    },
                    sentiment: {
                        score: 6,
                    },
                    startDate: "04/08/2025",
                    label: "Apr 08, 2025",
                    shortLabel: "Apr 08 '25",
                    reputation: {
                        score: 7.1,
                    },
                    industryAverage: {
                        score: 31.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22,
                    },
                    experienceScore: 36.2,
                    endDate: "04/09/2025",
                    experience: {
                        score: 36.2,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "04/09/2025",
                    label: "Apr 09, 2025",
                    shortLabel: "Apr 09 '25",
                    reputation: {
                        score: 50.4,
                    },
                    industryAverage: {
                        score: 42.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.1,
                    },
                    experienceScore: 58.1,
                    endDate: "04/10/2025",
                    experience: {
                        score: 58.1,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "04/10/2025",
                    label: "Apr 10, 2025",
                    shortLabel: "Apr 10 '25",
                    reputation: {
                        score: 50.8,
                    },
                    industryAverage: {
                        score: 50.3,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.4,
                    },
                    experienceScore: 29.7,
                    endDate: "04/11/2025",
                    experience: {
                        score: 29.7,
                    },
                    sentiment: {
                        score: 40.6,
                    },
                    startDate: "04/11/2025",
                    label: "Apr 11, 2025",
                    shortLabel: "Apr 11 '25",
                    reputation: {
                        score: 25.8,
                    },
                    industryAverage: {
                        score: 40.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.4,
                    },
                    experienceScore: 42,
                    endDate: "04/12/2025",
                    experience: {
                        score: 42,
                    },
                    sentiment: {
                        score: 66.7,
                    },
                    startDate: "04/12/2025",
                    label: "Apr 12, 2025",
                    shortLabel: "Apr 12 '25",
                    reputation: {
                        score: 36,
                    },
                    industryAverage: {
                        score: 38.9,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.4,
                    },
                    experienceScore: 35.3,
                    endDate: "04/13/2025",
                    experience: {
                        score: 35.3,
                    },
                    sentiment: {
                        score: 49.7,
                    },
                    startDate: "04/13/2025",
                    label: "Apr 13, 2025",
                    shortLabel: "Apr 13 '25",
                    reputation: {
                        score: 33.3,
                    },
                    industryAverage: {
                        score: 15.3,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.6,
                    },
                    experienceScore: 36.5,
                    endDate: "04/14/2025",
                    experience: {
                        score: 36.5,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "04/14/2025",
                    label: "Apr 14, 2025",
                    shortLabel: "Apr 14 '25",
                    reputation: {
                        score: 50.4,
                    },
                    industryAverage: {
                        score: 34.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.8,
                    },
                    experienceScore: 44.3,
                    endDate: "04/15/2025",
                    experience: {
                        score: 44.3,
                    },
                    sentiment: {
                        score: 62.5,
                    },
                    startDate: "04/15/2025",
                    label: "Apr 15, 2025",
                    shortLabel: "Apr 15 '25",
                    reputation: {
                        score: 46.9,
                    },
                    industryAverage: {
                        score: 42.3,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.8,
                    },
                    experienceScore: 58.5,
                    endDate: "04/16/2025",
                    experience: {
                        score: 58.5,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "04/16/2025",
                    label: "Apr 16, 2025",
                    shortLabel: "Apr 16 '25",
                    reputation: {
                        score: 51.3,
                    },
                    industryAverage: {
                        score: 49.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.8,
                    },
                    experienceScore: 13.8,
                    endDate: "04/17/2025",
                    experience: {
                        score: 13.8,
                    },
                    sentiment: {
                        score: 18.2,
                    },
                    startDate: "04/17/2025",
                    label: "Apr 17, 2025",
                    shortLabel: "Apr 17 '25",
                    reputation: {
                        score: 0.4,
                    },
                    industryAverage: {
                        score: 45.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.8,
                    },
                    experienceScore: 48.6,
                    endDate: "04/18/2025",
                    experience: {
                        score: 48.6,
                    },
                    sentiment: {
                        score: 84.1,
                    },
                    startDate: "04/18/2025",
                    label: "Apr 18, 2025",
                    shortLabel: "Apr 18 '25",
                    reputation: {
                        score: 37.9,
                    },
                    industryAverage: {
                        score: 39.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.8,
                    },
                    experienceScore: 35.6,
                    endDate: "04/19/2025",
                    experience: {
                        score: 35.6,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "04/19/2025",
                    label: "Apr 19, 2025",
                    shortLabel: "Apr 19 '25",
                    reputation: {
                        score: 48.5,
                    },
                    industryAverage: {
                        score: 46.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.8,
                    },
                    experienceScore: 28.4,
                    endDate: "04/20/2025",
                    experience: {
                        score: 28.4,
                    },
                    sentiment: {
                        score: 40.8,
                    },
                    startDate: "04/20/2025",
                    label: "Apr 20, 2025",
                    shortLabel: "Apr 20 '25",
                    reputation: {
                        score: 21.1,
                    },
                    industryAverage: {
                        score: 25.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 23.8,
                    },
                    experienceScore: 54.8,
                    endDate: "04/21/2025",
                    experience: {
                        score: 54.8,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "04/21/2025",
                    label: "Apr 21, 2025",
                    shortLabel: "Apr 21 '25",
                    reputation: {
                        score: 39.2,
                    },
                    industryAverage: {
                        score: 50.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 23.9,
                    },
                    experienceScore: 47.5,
                    endDate: "04/22/2025",
                    experience: {
                        score: 47.5,
                    },
                    sentiment: {
                        score: 75,
                    },
                    startDate: "04/22/2025",
                    label: "Apr 22, 2025",
                    shortLabel: "Apr 22 '25",
                    reputation: {
                        score: 42.9,
                    },
                    industryAverage: {
                        score: 50.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 23.9,
                    },
                    experienceScore: 8,
                    endDate: "04/23/2025",
                    experience: {
                        score: 8,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "04/23/2025",
                    label: "Apr 23, 2025",
                    shortLabel: "Apr 23 '25",
                    reputation: {
                        score: 0.4,
                    },
                    industryAverage: {
                        score: 41.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 23.9,
                    },
                    experienceScore: 58.7,
                    endDate: "04/24/2025",
                    experience: {
                        score: 58.7,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "04/24/2025",
                    label: "Apr 24, 2025",
                    shortLabel: "Apr 24 '25",
                    reputation: {
                        score: 50.8,
                    },
                    industryAverage: {
                        score: 15.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 24.3,
                    },
                    experienceScore: 58.7,
                    endDate: "04/25/2025",
                    experience: {
                        score: 58.7,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "04/25/2025",
                    label: "Apr 25, 2025",
                    shortLabel: "Apr 25 '25",
                    reputation: {
                        score: 50.6,
                    },
                    industryAverage: {
                        score: 49.3,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 24.6,
                    },
                    experienceScore: 58.8,
                    endDate: "04/26/2025",
                    experience: {
                        score: 58.8,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "04/26/2025",
                    label: "Apr 26, 2025",
                    shortLabel: "Apr 26 '25",
                    reputation: {
                        score: 50.4,
                    },
                    industryAverage: {
                        score: 49.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 24.6,
                    },
                    experienceScore: 37.7,
                    endDate: "04/27/2025",
                    experience: {
                        score: 37.7,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "04/27/2025",
                    label: "Apr 27, 2025",
                    shortLabel: "Apr 27 '25",
                    reputation: {
                        score: 50.8,
                    },
                    industryAverage: {
                        score: 16.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 24.6,
                    },
                    experienceScore: 39.4,
                    endDate: "04/28/2025",
                    experience: {
                        score: 39.4,
                    },
                    sentiment: {
                        score: 58.3,
                    },
                    startDate: "04/28/2025",
                    label: "Apr 28, 2025",
                    shortLabel: "Apr 28 '25",
                    reputation: {
                        score: 34.6,
                    },
                    industryAverage: {
                        score: 46.9,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 24.6,
                    },
                    experienceScore: 56.8,
                    endDate: "04/29/2025",
                    experience: {
                        score: 56.8,
                    },
                    sentiment: {
                        score: 93.3,
                    },
                    startDate: "04/29/2025",
                    label: "Apr 29, 2025",
                    shortLabel: "Apr 29 '25",
                    reputation: {
                        score: 51.3,
                    },
                    industryAverage: {
                        score: 33.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 24.6,
                    },
                    experienceScore: 36.5,
                    endDate: "04/30/2025",
                    experience: {
                        score: 36.5,
                    },
                    sentiment: {
                        score: 60.6,
                    },
                    startDate: "04/30/2025",
                    label: "Apr 30, 2025",
                    shortLabel: "Apr 30 '25",
                    reputation: {
                        score: 23.5,
                    },
                    industryAverage: {
                        score: 43.9,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 24.9,
                    },
                    experienceScore: 43.2,
                    endDate: "05/01/2025",
                    experience: {
                        score: 43.2,
                    },
                    sentiment: {
                        score: 70,
                    },
                    startDate: "05/01/2025",
                    label: "May 01, 2025",
                    shortLabel: "May 01 '25",
                    reputation: {
                        score: 34,
                    },
                    industryAverage: {
                        score: 54.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 24.9,
                    },
                    experienceScore: 12.4,
                    endDate: "05/02/2025",
                    experience: {
                        score: 12.4,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "05/02/2025",
                    label: "May 02, 2025",
                    shortLabel: "May 02 '25",
                    reputation: {
                        score: 0,
                    },
                    industryAverage: {
                        score: 21,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 24.9,
                    },
                    experienceScore: 23.1,
                    endDate: "05/03/2025",
                    experience: {
                        score: 23.1,
                    },
                    sentiment: {
                        score: 12.5,
                    },
                    startDate: "05/03/2025",
                    label: "May 03, 2025",
                    shortLabel: "May 03 '25",
                    reputation: {
                        score: 32.1,
                    },
                    industryAverage: {
                        score: 46.5,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 24.9,
                    },
                    experienceScore: 33.7,
                    endDate: "05/04/2025",
                    experience: {
                        score: 33.7,
                    },
                    sentiment: {
                        score: 50,
                    },
                    startDate: "05/04/2025",
                    label: "May 04, 2025",
                    shortLabel: "May 04 '25",
                    reputation: {
                        score: 25.8,
                    },
                    industryAverage: {
                        score: 11.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 25.1,
                    },
                    experienceScore: 12.6,
                    endDate: "05/05/2025",
                    experience: {
                        score: 12.6,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "05/05/2025",
                    label: "May 05, 2025",
                    shortLabel: "May 05 '25",
                    reputation: {
                        score: 0,
                    },
                    industryAverage: {
                        score: 40.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 25.2,
                    },
                    experienceScore: 12.6,
                    endDate: "05/06/2025",
                    experience: {
                        score: 12.6,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "05/06/2025",
                    label: "May 06, 2025",
                    shortLabel: "May 06 '25",
                    reputation: {
                        score: 0,
                    },
                    industryAverage: {
                        score: 47.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 25.2,
                    },
                    experienceScore: 59.2,
                    endDate: "05/07/2025",
                    experience: {
                        score: 59.2,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "05/07/2025",
                    label: "May 07, 2025",
                    shortLabel: "May 07 '25",
                    reputation: {
                        score: 51.3,
                    },
                    industryAverage: {
                        score: 47.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 25.2,
                    },
                    experienceScore: 58.9,
                    endDate: "05/08/2025",
                    experience: {
                        score: 58.9,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "05/08/2025",
                    label: "May 08, 2025",
                    shortLabel: "May 08 '25",
                    reputation: {
                        score: 50.4,
                    },
                    industryAverage: {
                        score: 49.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 25.2,
                    },
                    experienceScore: 59.4,
                    endDate: "05/09/2025",
                    experience: {
                        score: 59.4,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "05/09/2025",
                    label: "May 09, 2025",
                    shortLabel: "May 09 '25",
                    reputation: {
                        score: 51.7,
                    },
                    industryAverage: {
                        score: 47.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 25.2,
                    },
                    experienceScore: 58.9,
                    endDate: "05/10/2025",
                    experience: {
                        score: 58.9,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "05/10/2025",
                    label: "May 10, 2025",
                    shortLabel: "May 10 '25",
                    reputation: {
                        score: 50.4,
                    },
                    industryAverage: {
                        score: 13.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 25.2,
                    },
                    experienceScore: 15,
                    endDate: "05/11/2025",
                    experience: {
                        score: 15,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "05/11/2025",
                    label: "May 11, 2025",
                    shortLabel: "May 11 '25",
                    reputation: {
                        score: 20.4,
                    },
                    industryAverage: {
                        score: 8.5,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 25.2,
                    },
                    experienceScore: 8.4,
                    endDate: "05/12/2025",
                    experience: {
                        score: 8.4,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "05/12/2025",
                    label: "May 12, 2025",
                    shortLabel: "May 12 '25",
                    reputation: {
                        score: 0.4,
                    },
                    industryAverage: {
                        score: 50.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 25.2,
                    },
                    experienceScore: 37.8,
                    endDate: "05/13/2025",
                    experience: {
                        score: 37.8,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "05/13/2025",
                    label: "May 13, 2025",
                    shortLabel: "May 13 '25",
                    reputation: {
                        score: 50.4,
                    },
                    industryAverage: {
                        score: 50.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 25.2,
                    },
                    experienceScore: 43.6,
                    endDate: "05/14/2025",
                    experience: {
                        score: 43.6,
                    },
                    sentiment: {
                        score: 67.6,
                    },
                    startDate: "05/14/2025",
                    label: "May 14, 2025",
                    shortLabel: "May 14 '25",
                    reputation: {
                        score: 37.2,
                    },
                    industryAverage: {
                        score: 48.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 25.2,
                    },
                    experienceScore: 54,
                    endDate: "05/15/2025",
                    experience: {
                        score: 54,
                    },
                    sentiment: {
                        score: 90,
                    },
                    startDate: "05/15/2025",
                    label: "May 15, 2025",
                    shortLabel: "May 15 '25",
                    reputation: {
                        score: 45.6,
                    },
                    industryAverage: {
                        score: 28.6,
                    },
                },
            },
        ],
        groupByType: "day",
    },
    legendValue: ["Birdeye Score", "Industry average"],
    yAxisOptions: {
        enableDoubleYAxis: false,
        leftYAxisOptions: {
            label: "",
            min: 0,
            max: 100,
        },
        rightYAxisOptions: null,
    },
    apiDetails: {
        url: "api/insight/experience/over-time",
        breakdownUrl: "api/insight/experience/breakdown/over-time",
        industryAvgUrl: "api/insight/experience/industry/over-time",
        method: "post",
    },
    graphId: "insights-experience-score-over-time",
    redirectURL: "",
    extraReqParams: {},
    showDelta: true,
    chartActions: [{}],
    globalFilters: {},
    cardConfig: {
        width: 1577,
        height: 490,
        isDynamicTableHeight: true,
    },
    multiChartId: "reputation-score-over-time",
    hideSummary: false,
    step: null,
    disablePNG: true,
    disablePPT: true,
    isInsightPage: true,
    showActionsDownload: true,
    disableActionForNoData: true,
    filterCount: {},
    isFullWidthEnabled: true,
    router: "/dashboard/insights-analytics/experience",
    createdBy: "",
};
