export const splineDottedConfig = {
    tempUniqueId: "birdeye_score_card-175266347674987",
    parserConfig: {
        dataFormat: "arrayWithKeyValue",
        displaySummary: false,
        cardTitleTooltipText: "",
        graphTitle: "Sentiment score",
        reportOverTime: true,
        yAxisConfig: {
            labels: {
                disabled: true
            }
        },
        chart: {
            height: 300,
        },
        seriesDetails: [
            {
                name: "Current score",
                type: "spline",
                color: "#0099FF",
                maxPointWidth: 20,
                stack: "stack1",
                id: "currentScore",
                dataKey: "currentScore",
                showInLegend: false,
            },
            {
                color: "#7ED321",
                stack: "stack2",
                name: "Target score",
                isDottedSeries: true,
                showInLegend: false,
                dataKey: "targetScore",
                maxPointWidth: 20,
                type: "spline",
                id: "targetScore",
                industryAverage: true,
            },
        ],
        dataPoints: true,
        chartVisualisationConfig: {
            defaultType: {
                value: "spline",
            },
            show: false,
        },
        tableConfig: {
            actual: [],
        },
        kpiDataConfig: [
            {
                label: "Current score",
                dataKey: "currentScore",
                color: "#0099FF",
            },
            {
                label: "Target score",
                dataKey: "targetScore",
                color: "#7ED321",
            },
        ],
        defaultChartSTyle: "spline",
        primaryChartStyle: "spline",
        downloadActionsConfig: {
            show: false,
        },
        plotDataConfig: {
            spline: {
                marker: {
                    enabled: false,
                },
            },
            series: {},
        },
    },
    heading: "Sentiment score",
    apiData: {
        summary: {
            actual: {
                currentScore: 4.5,
                targetScore: 4.8,
            },
        },
        dataPoints: [
            {
                actual: {
                    label: "Jun 2024",
                    shortLabel: "Jun '24",
                    startDate: "06/01/2024",
                    endDate: "06/30/2024",
                    currentScore: 4,
                    targetScore: 4,
                },
            },
            {
                actual: {
                    label: "Jul 2024",
                    shortLabel: "Jul '24",
                    startDate: "07/01/2024",
                    endDate: "07/31/2024",
                    currentScore: null,
                    targetScore: 4.1,
                },
            },
            {
                actual: {
                    label: "Aug 2024",
                    shortLabel: "Aug '24",
                    startDate: "08/01/2024",
                    endDate: "08/31/2024",
                    currentScore: null,
                    targetScore: 4.2,
                },
            },
            {
                actual: {
                    label: "Sep 2024",
                    shortLabel: "Sep '24",
                    startDate: "09/01/2024",
                    endDate: "09/30/2024",
                    currentScore: null,
                    targetScore: 4.3,
                },
            },
            {
                actual: {
                    label: "Oct 2024",
                    shortLabel: "Oct '24",
                    startDate: "10/01/2024",
                    endDate: "10/31/2024",
                    currentScore: null,
                    targetScore: 4.4,
                },
            },
            {
                actual: {
                    label: "Nov 2024",
                    shortLabel: "Nov '24",
                    startDate: "11/01/2024",
                    endDate: "11/30/2024",
                    currentScore: null,
                    targetScore: 4.5,
                },
            },
            {
                actual: {
                    label: "Dec 2024",
                    shortLabel: "Dec '24",
                    startDate: "12/01/2024",
                    endDate: "12/31/2024",
                    currentScore: null,
                    targetScore: 4.6,
                },
            },
            {
                actual: {
                    label: "Jan 2025",
                    shortLabel: "Jan '25",
                    startDate: "01/01/2025",
                    endDate: "01/31/2025",
                    currentScore: null,
                    targetScore: 4.7,
                },
            },
            {
                actual: {
                    label: "Feb 2025",
                    shortLabel: "Feb '25",
                    startDate: "02/01/2025",
                    endDate: "02/28/2025",
                    currentScore: null,
                    targetScore: 4.8,
                },
            },
            {
                actual: {
                    label: "Mar 2025",
                    shortLabel: "Mar '25",
                    startDate: "03/01/2025",
                    endDate: "03/31/2025",
                    currentScore: null,
                    targetScore: 4.9,
                },
            },
            {
                actual: {
                    label: "Apr 2025",
                    shortLabel: "Apr '25",
                    startDate: "04/01/2025",
                    endDate: "04/30/2025",
                    currentScore: null,
                    targetScore: 5,
                },
            },
            {
                actual: {
                    label: "May 2025",
                    shortLabel: "May '25",
                    startDate: "05/01/2025",
                    endDate: "05/31/2025",
                    currentScore: null,
                    targetScore: 5.1,
                },
            },
        ],
        groupByType: "month",
    },
    apiDetails: {
        url: "api/insight/actions/progress/sentiment-score/over-time/graph",
        method: "post",
        mockResponse: {
            summary: {
                actual: {
                    currentScore: 4.5,
                    targetScore: 4.8,
                },
            },
            dataPoints: [
                {
                    actual: {
                        label: "Jun 2024",
                        shortLabel: "Jun '24",
                        startDate: "06/01/2024",
                        endDate: "06/30/2024",
                        currentScore: 4.1,
                        targetScore: null,
                    },
                },
                {
                    actual: {
                        label: "Jul 2024",
                        shortLabel: "Jul '24",
                        startDate: "07/01/2024",
                        endDate: "07/31/2024",
                        currentScore: null,
                        targetScore: 4.1,
                    },
                },
                {
                    actual: {
                        label: "Aug 2024",
                        shortLabel: "Aug '24",
                        startDate: "08/01/2024",
                        endDate: "08/31/2024",
                        currentScore: null,
                        targetScore: 4.2,
                    },
                },
                {
                    actual: {
                        label: "Sep 2024",
                        shortLabel: "Sep '24",
                        startDate: "09/01/2024",
                        endDate: "09/30/2024",
                        currentScore: null,
                        targetScore: 4.3,
                    },
                },
                {
                    actual: {
                        label: "Oct 2024",
                        shortLabel: "Oct '24",
                        startDate: "10/01/2024",
                        endDate: "10/31/2024",
                        currentScore: null,
                        targetScore: 4.4,
                    },
                },
                {
                    actual: {
                        label: "Nov 2024",
                        shortLabel: "Nov '24",
                        startDate: "11/01/2024",
                        endDate: "11/30/2024",
                        currentScore: null,
                        targetScore: 4.5,
                    },
                },
                {
                    actual: {
                        label: "Dec 2024",
                        shortLabel: "Dec '24",
                        startDate: "12/01/2024",
                        endDate: "12/31/2024",
                        currentScore: null,
                        targetScore: 4.6,
                    },
                },
                {
                    actual: {
                        label: "Jan 2025",
                        shortLabel: "Jan '25",
                        startDate: "01/01/2025",
                        endDate: "01/31/2025",
                        currentScore: null,
                        targetScore: 4.7,
                    },
                },
                {
                    actual: {
                        label: "Feb 2025",
                        shortLabel: "Feb '25",
                        startDate: "02/01/2025",
                        endDate: "02/28/2025",
                        currentScore: null,
                        targetScore: 4.8,
                    },
                },
                {
                    actual: {
                        label: "Mar 2025",
                        shortLabel: "Mar '25",
                        startDate: "03/01/2025",
                        endDate: "03/31/2025",
                        currentScore: null,
                        targetScore: 4.9,
                    },
                },
                {
                    actual: {
                        label: "Apr 2025",
                        shortLabel: "Apr '25",
                        startDate: "04/01/2025",
                        endDate: "04/30/2025",
                        currentScore: null,
                        targetScore: 5,
                    },
                },
                {
                    actual: {
                        label: "May 2025",
                        shortLabel: "May '25",
                        startDate: "05/01/2025",
                        endDate: "05/31/2025",
                        currentScore: null,
                        targetScore: 5.1,
                    },
                },
            ],
            grouByType: "month",
        },
    },
    minCardHeight: "134",
    graphId: "birdeye_score_card",
    layoutConfig: {
        maxWidth: 6,
    },
    loading: false,
};
