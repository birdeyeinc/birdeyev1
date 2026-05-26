let apiResponse = [
    {
        chartCommonConfig: {
            graphId: "chart_message_session_c1ade033_b87b7277_29df861d",
            doubleYaxis: false,
            primaryChartStyle: "PIE_CHART",
            reportOverTime: false,
            parserConfig: {
                graphTitle: "Quarterly Review Sentiments Distribution",
                seriesDetails: [
                    {
                        primary: true,
                        color: "#ccc",
                        showDisplayUnits: true,
                        name: "Response time",
                        tableViewkey: "ratingOrderData",
                        showInLegend: false,
                        dataKey: "avgResponseTime",
                        maxPointWidth: 20,
                        type: "pie",
                        yAxisLabel: "Review time",
                        id: "barProjected",
                    },
                ],
                dataPoints: false,
                categoryKey: "avgResponseByRating",
                categoryValueMap: {
                    0: {
                        value: "No rating",
                        color: "#CCCCCC",
                        compareColor: "#E5E5E5",
                    },
                    1: {
                        value: "1 star",
                        color: "#DE1B0C",
                        compareColor: "#F99E8F",
                    },
                    2: {
                        value: "2 star",
                        color: "#FF6A4D",
                        compareColor: "#FFB9A7",
                    },
                    3: {
                        value: "3 star",
                        color: "#FBC123",
                        compareColor: "#FEE1A5",
                    },
                    4: {
                        value: "4 star",
                        color: "#7ED321",
                        compareColor: "#C0EBA2",
                    },
                    5: {
                        value: "5 star",
                        color: "#4CAE3D",
                        compareColor: "#A9D8A2",
                    },
                },
                categoryList: ["0", "1", "2", "3", "4", "5"],
                dataFormat: "grouped",
                tooltip: {
                    pointFormat: "<b>{point.name}</b>: {point.percentage:.1f}% ({point.rawValue:,.0f})",
                    useHTML: true,
                },
            },
        },
        apiData: {
            dataPoints: [
                {
                    actual: {
                        avgResponseByRating: {
                            0: 33,
                            1: 44,
                            2: 55,
                            3: 66,
                            4: 66,
                            5: 77,
                        },
                    },
                },
            ],
            dateDiff: 3,
            groupByType: "category",
            dataPresent: true,
            totalRecords: 4,
            chartType: "pie",
            categories: ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"],
            seriesCount: 1,
        },
    },
];