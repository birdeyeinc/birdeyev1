let apiResponse = [
    {
        chartCommonConfig: {
            graphId: "chart_message_session_c1ade033_b87b7277_29df861d",
            doubleYaxis: false,
            primaryChartStyle: "PIE_CHART",
            reportOverTime: true,
            parserConfig: {
                graphTitle: "Quarterly Review Sentiments Distribution",
                seriesDetails: [
                    {
                        name: "Reviews",
                        type: "VERTICAL_BAR_CHART",
                        color: "#ccc",
                        id: "barProjected",
                        maxPointWidth: 20,
                        dataKey: "countByRating",
                        yAxisLabel: "Reviews",
                        tableViewkey: "ratingOrderData",
                        showInLegend: false,
                        primary: true,
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
                xAxisTitle: "",
                yAxisTitles: [],
                legendEnabled: true,
                tooltipEnabled: true,
                // isGroupedArrayWithoutCategoryKey: true,
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
                        totalCount: 0,
                        avgRating: 0,
                        startDate: "01/02/1970",
                        endDate: "06/12/2023",
                        countByRating: {
                            0: 33,
                            1: 12,
                            2: 2,
                            3: 0,
                            4: 10,
                            5: 211,
                        },
                    },
                    compare: {
                        totalCount: 0,
                        avgRating: 0,
                        startDate: "01/02/1970",
                        endDate: "06/12/2023",
                        countByRating: {
                            0: 33,
                            1: 12,
                            2: 2,
                            3: 0,
                            4: 10,
                            5: 211,
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