export const reportdata = {
    disableEmailBodyEdit: false,
    tempUniqueId: "repuationScoreOverTimeDetails1751000611910116",
    parserConfig: {
        dataFormat: "arrayWithKeyValue",
        displaySummary: false,
        crosshairConfig: {
            color: "#e3effc",
        },
        yAxisCustomMax: function (max1, max2) {
            max1 = 110;
            return {
                max1,
                max2,
            };
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
            column: "center",
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
                dataKey: "experience",
                subDataKey: "score",
                zIndex: 10,
                maxPointWidth: 20,
                type: "column",
                yAxisLabel: "",
                yAxis: 0,
                showInLegend: true,
                id: "experience",
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
                color: "#cccccc",
                name: "Industry average",
                dataKey: "industryAverage",
                subDataKey: "score",
                zIndex: 5,
                maxPointWidth: 20,
                type: "column",
                yAxisLabel: "",
                yAxis: 0,
                showInLegend: true,
                id: "lineProjected",
            },
        ],
        getSpaceMultiplier: () => {
            return 80;
        },
        getDataMultiplier: (primaryChartStyle) => {
            if (primaryChartStyle == "bar" || primaryChartStyle == "column") {
                return 3;
            } else {
                return 1;
            }
        },
        isCustomSpaceMultiplier: true,
        isMultipleKeyValue: true,
        dataPoints: true,
        reversedStacks: false,
        plotDataConfig: {
            column: {
                dataLabels: {
                    enabled: true,
                    y: -20,
                },
                stacking: null,
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
        primaryChartStyle: "column",
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
    filterData: {
        businessIds: [],
        excludedBizIds: [],
        customLevelData: [],
        cityStateData: {},
        days: "90",
        groupByDays: "1",
        newFilters: true,
        reviewSiteIds: [
            "2",
            "1",
            "110",
            "100",
            "342",
            "266",
            "419",
            "91",
            "276",
            "11",
            "334",
            "20",
            "273",
            "214",
            "146",
            "353",
            "414",
            "7",
            "30",
            "95",
            "299",
            "344",
            "226",
            "201",
            "211",
            "165",
            "127",
            "394",
            "424",
            "401",
            "81",
            "51",
            "47",
            "289",
            "306",
            "3",
            "130",
            "107",
            "295",
            "117",
            "41",
            "144",
            "101",
            "425",
            "34",
            "399",
            "15",
            "492",
            "421",
            "411",
            "169",
            "124",
            "315",
            "296",
            "212",
            "279",
            "134",
            "10",
            "407",
            "420",
            "72",
            "294",
            "208",
            "38",
            "111",
            "277",
            "271",
            "49",
            "403",
            "80",
            "82",
            "8",
            "112",
            "423",
            "311",
            "31",
            "184",
            "337",
            "74",
            "6",
            "287",
            "57",
            "426",
            "22",
            "327",
            "369",
            "45",
            "324",
            "33",
            "418",
            "83",
            "396",
            "116",
            "174",
            "118",
            "415",
            "332",
            "62",
            "142",
            "58",
            "402",
            "417",
            "346",
            "36",
            "397",
            "301",
            "17",
            "5045",
            "139",
            "150",
            "213",
            "5043",
            "285",
            "412",
            "131",
            "209",
            "422",
            "170",
            "406",
            "52",
            "71",
            "221",
            "202",
            "189",
            "50",
            "115",
            "427",
            "281",
            "291",
            "16",
            "76",
            "9",
            "312",
            "75",
            "207",
            "97",
            "428",
            "23",
            "26",
            "325",
            "367",
            "89",
            "103",
            "21",
            "283",
            "24",
            "413",
            "27",
            "408",
            "4",
            "5",
            "63",
            "32",
            "42",
            "29",
            "400",
            "392",
        ],
    },
    apiData: {
        dataPoints: [
            {
                actual: {
                    listing: {
                        score: 22.3,
                    },
                    experienceScore: 53,
                    endDate: "03/29/2025",
                    experience: {
                        score: 53,
                    },
                    sentiment: {
                        score: 88.3,
                    },
                    startDate: "03/29/2025",
                    label: "Mar 29, 2025",
                    shortLabel: "Mar 29 '25",
                    reputation: {
                        score: 47.4,
                    },
                    industryAverage: {
                        score: 43.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.3,
                    },
                    experienceScore: 46.8,
                    endDate: "03/30/2025",
                    experience: {
                        score: 46.8,
                    },
                    sentiment: {
                        score: 74.1,
                    },
                    startDate: "03/30/2025",
                    label: "Mar 30, 2025",
                    shortLabel: "Mar 30 '25",
                    reputation: {
                        score: 43.2,
                    },
                    industryAverage: {
                        score: 38.5,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.3,
                    },
                    experienceScore: 46.4,
                    endDate: "03/31/2025",
                    experience: {
                        score: 46.4,
                    },
                    sentiment: {
                        score: 74.1,
                    },
                    startDate: "03/31/2025",
                    label: "Mar 31, 2025",
                    shortLabel: "Mar 31 '25",
                    reputation: {
                        score: 41.9,
                    },
                    industryAverage: {
                        score: 42.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.3,
                    },
                    experienceScore: 46.4,
                    endDate: "04/01/2025",
                    experience: {
                        score: 46.4,
                    },
                    sentiment: {
                        score: 74.4,
                    },
                    startDate: "04/01/2025",
                    label: "Apr 01, 2025",
                    shortLabel: "Apr 01 '25",
                    reputation: {
                        score: 41.6,
                    },
                    industryAverage: {
                        score: 41.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.3,
                    },
                    experienceScore: 49.3,
                    endDate: "04/02/2025",
                    experience: {
                        score: 49.3,
                    },
                    sentiment: {
                        score: 82,
                    },
                    startDate: "04/02/2025",
                    label: "Apr 02, 2025",
                    shortLabel: "Apr 02 '25",
                    reputation: {
                        score: 42.5,
                    },
                    industryAverage: {
                        score: 38.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.4,
                    },
                    experienceScore: 43.5,
                    endDate: "04/03/2025",
                    experience: {
                        score: 43.5,
                    },
                    sentiment: {
                        score: 69.6,
                    },
                    startDate: "04/03/2025",
                    label: "Apr 03, 2025",
                    shortLabel: "Apr 03 '25",
                    reputation: {
                        score: 37.6,
                    },
                    industryAverage: {
                        score: 39.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.5,
                    },
                    experienceScore: 43.2,
                    endDate: "04/04/2025",
                    experience: {
                        score: 43.2,
                    },
                    sentiment: {
                        score: 67.1,
                    },
                    startDate: "04/04/2025",
                    label: "Apr 04, 2025",
                    shortLabel: "Apr 04 '25",
                    reputation: {
                        score: 39.4,
                    },
                    industryAverage: {
                        score: 41.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.5,
                    },
                    experienceScore: 44.7,
                    endDate: "04/05/2025",
                    experience: {
                        score: 44.7,
                    },
                    sentiment: {
                        score: 70,
                    },
                    startDate: "04/05/2025",
                    label: "Apr 05, 2025",
                    shortLabel: "Apr 05 '25",
                    reputation: {
                        score: 40.9,
                    },
                    industryAverage: {
                        score: 41,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.5,
                    },
                    experienceScore: 47.3,
                    endDate: "04/06/2025",
                    experience: {
                        score: 47.3,
                    },
                    sentiment: {
                        score: 73.7,
                    },
                    startDate: "04/06/2025",
                    label: "Apr 06, 2025",
                    shortLabel: "Apr 06 '25",
                    reputation: {
                        score: 44.9,
                    },
                    industryAverage: {
                        score: 38,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.5,
                    },
                    experienceScore: 42.6,
                    endDate: "04/07/2025",
                    experience: {
                        score: 42.6,
                    },
                    sentiment: {
                        score: 56.6,
                    },
                    startDate: "04/07/2025",
                    label: "Apr 07, 2025",
                    shortLabel: "Apr 07 '25",
                    reputation: {
                        score: 48.4,
                    },
                    industryAverage: {
                        score: 42,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.5,
                    },
                    experienceScore: 45.3,
                    endDate: "04/08/2025",
                    experience: {
                        score: 45.3,
                    },
                    sentiment: {
                        score: 71.9,
                    },
                    startDate: "04/08/2025",
                    label: "Apr 08, 2025",
                    shortLabel: "Apr 08 '25",
                    reputation: {
                        score: 40.7,
                    },
                    industryAverage: {
                        score: 41.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.5,
                    },
                    experienceScore: 49.7,
                    endDate: "04/09/2025",
                    experience: {
                        score: 49.7,
                    },
                    sentiment: {
                        score: 82.9,
                    },
                    startDate: "04/09/2025",
                    label: "Apr 09, 2025",
                    shortLabel: "Apr 09 '25",
                    reputation: {
                        score: 42.6,
                    },
                    industryAverage: {
                        score: 40.9,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 49.4,
                    endDate: "04/10/2025",
                    experience: {
                        score: 49.4,
                    },
                    sentiment: {
                        score: 78.1,
                    },
                    startDate: "04/10/2025",
                    label: "Apr 10, 2025",
                    shortLabel: "Apr 10 '25",
                    reputation: {
                        score: 46.5,
                    },
                    industryAverage: {
                        score: 43,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 48.4,
                    endDate: "04/11/2025",
                    experience: {
                        score: 48.4,
                    },
                    sentiment: {
                        score: 76.5,
                    },
                    startDate: "04/11/2025",
                    label: "Apr 11, 2025",
                    shortLabel: "Apr 11 '25",
                    reputation: {
                        score: 45,
                    },
                    industryAverage: {
                        score: 42.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 50.9,
                    endDate: "04/12/2025",
                    experience: {
                        score: 50.9,
                    },
                    sentiment: {
                        score: 85,
                    },
                    startDate: "04/12/2025",
                    label: "Apr 12, 2025",
                    shortLabel: "Apr 12 '25",
                    reputation: {
                        score: 44.1,
                    },
                    industryAverage: {
                        score: 42.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 45.9,
                    endDate: "04/13/2025",
                    experience: {
                        score: 45.9,
                    },
                    sentiment: {
                        score: 71,
                    },
                    startDate: "04/13/2025",
                    label: "Apr 13, 2025",
                    shortLabel: "Apr 13 '25",
                    reputation: {
                        score: 43.2,
                    },
                    industryAverage: {
                        score: 36.3,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46.9,
                    endDate: "04/14/2025",
                    experience: {
                        score: 46.9,
                    },
                    sentiment: {
                        score: 78.2,
                    },
                    startDate: "04/14/2025",
                    label: "Apr 14, 2025",
                    shortLabel: "Apr 14 '25",
                    reputation: {
                        score: 39,
                    },
                    industryAverage: {
                        score: 40.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 49,
                    endDate: "04/15/2025",
                    experience: {
                        score: 49,
                    },
                    sentiment: {
                        score: 79.9,
                    },
                    startDate: "04/15/2025",
                    label: "Apr 15, 2025",
                    shortLabel: "Apr 15 '25",
                    reputation: {
                        score: 43.6,
                    },
                    industryAverage: {
                        score: 44.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46.2,
                    endDate: "04/16/2025",
                    experience: {
                        score: 46.2,
                    },
                    sentiment: {
                        score: 74.1,
                    },
                    startDate: "04/16/2025",
                    label: "Apr 16, 2025",
                    shortLabel: "Apr 16 '25",
                    reputation: {
                        score: 41.1,
                    },
                    industryAverage: {
                        score: 44.9,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 45.5,
                    endDate: "04/17/2025",
                    experience: {
                        score: 45.5,
                    },
                    sentiment: {
                        score: 67.5,
                    },
                    startDate: "04/17/2025",
                    label: "Apr 17, 2025",
                    shortLabel: "Apr 17 '25",
                    reputation: {
                        score: 45.5,
                    },
                    industryAverage: {
                        score: 46.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 48.6,
                    endDate: "04/18/2025",
                    experience: {
                        score: 48.6,
                    },
                    sentiment: {
                        score: 80,
                    },
                    startDate: "04/18/2025",
                    label: "Apr 18, 2025",
                    shortLabel: "Apr 18 '25",
                    reputation: {
                        score: 42,
                    },
                    industryAverage: {
                        score: 45.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46.8,
                    endDate: "04/19/2025",
                    experience: {
                        score: 46.8,
                    },
                    sentiment: {
                        score: 75.2,
                    },
                    startDate: "04/19/2025",
                    label: "Apr 19, 2025",
                    shortLabel: "Apr 19 '25",
                    reputation: {
                        score: 41.5,
                    },
                    industryAverage: {
                        score: 44.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 48.8,
                    endDate: "04/20/2025",
                    experience: {
                        score: 48.8,
                    },
                    sentiment: {
                        score: 77.8,
                    },
                    startDate: "04/20/2025",
                    label: "Apr 20, 2025",
                    shortLabel: "Apr 20 '25",
                    reputation: {
                        score: 45.1,
                    },
                    industryAverage: {
                        score: 42.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 44.6,
                    endDate: "04/21/2025",
                    experience: {
                        score: 44.6,
                    },
                    sentiment: {
                        score: 68.2,
                    },
                    startDate: "04/21/2025",
                    label: "Apr 21, 2025",
                    shortLabel: "Apr 21 '25",
                    reputation: {
                        score: 42.2,
                    },
                    industryAverage: {
                        score: 45.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 44.1,
                    endDate: "04/22/2025",
                    experience: {
                        score: 44.1,
                    },
                    sentiment: {
                        score: 67.1,
                    },
                    startDate: "04/22/2025",
                    label: "Apr 22, 2025",
                    shortLabel: "Apr 22 '25",
                    reputation: {
                        score: 41.9,
                    },
                    industryAverage: {
                        score: 43.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 44.9,
                    endDate: "04/23/2025",
                    experience: {
                        score: 44.9,
                    },
                    sentiment: {
                        score: 68.8,
                    },
                    startDate: "04/23/2025",
                    label: "Apr 23, 2025",
                    shortLabel: "Apr 23 '25",
                    reputation: {
                        score: 42.4,
                    },
                    industryAverage: {
                        score: 45.3,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 45.6,
                    endDate: "04/24/2025",
                    experience: {
                        score: 45.6,
                    },
                    sentiment: {
                        score: 71.1,
                    },
                    startDate: "04/24/2025",
                    label: "Apr 24, 2025",
                    shortLabel: "Apr 24 '25",
                    reputation: {
                        score: 42.1,
                    },
                    industryAverage: {
                        score: 45.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 40.7,
                    endDate: "04/25/2025",
                    experience: {
                        score: 40.7,
                    },
                    sentiment: {
                        score: 58.4,
                    },
                    startDate: "04/25/2025",
                    label: "Apr 25, 2025",
                    shortLabel: "Apr 25 '25",
                    reputation: {
                        score: 40.4,
                    },
                    industryAverage: {
                        score: 46.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 45.9,
                    endDate: "04/26/2025",
                    experience: {
                        score: 45.9,
                    },
                    sentiment: {
                        score: 72.6,
                    },
                    startDate: "04/26/2025",
                    label: "Apr 26, 2025",
                    shortLabel: "Apr 26 '25",
                    reputation: {
                        score: 41.7,
                    },
                    industryAverage: {
                        score: 45.5,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 42.5,
                    endDate: "04/27/2025",
                    experience: {
                        score: 42.5,
                    },
                    sentiment: {
                        score: 62,
                    },
                    startDate: "04/27/2025",
                    label: "Apr 27, 2025",
                    shortLabel: "Apr 27 '25",
                    reputation: {
                        score: 42.3,
                    },
                    industryAverage: {
                        score: 41,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 41.8,
                    endDate: "04/28/2025",
                    experience: {
                        score: 41.8,
                    },
                    sentiment: {
                        score: 62,
                    },
                    startDate: "04/28/2025",
                    label: "Apr 28, 2025",
                    shortLabel: "Apr 28 '25",
                    reputation: {
                        score: 40.1,
                    },
                    industryAverage: {
                        score: 42.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 51.7,
                    endDate: "04/29/2025",
                    experience: {
                        score: 51.7,
                    },
                    sentiment: {
                        score: 86.1,
                    },
                    startDate: "04/29/2025",
                    label: "Apr 29, 2025",
                    shortLabel: "Apr 29 '25",
                    reputation: {
                        score: 45.3,
                    },
                    industryAverage: {
                        score: 43.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 50.8,
                    endDate: "04/30/2025",
                    experience: {
                        score: 50.8,
                    },
                    sentiment: {
                        score: 82.7,
                    },
                    startDate: "04/30/2025",
                    label: "Apr 30, 2025",
                    shortLabel: "Apr 30 '25",
                    reputation: {
                        score: 46.1,
                    },
                    industryAverage: {
                        score: 45.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 42.9,
                    endDate: "05/01/2025",
                    experience: {
                        score: 42.9,
                    },
                    sentiment: {
                        score: 64.8,
                    },
                    startDate: "05/01/2025",
                    label: "May 01, 2025",
                    shortLabel: "May 01 '25",
                    reputation: {
                        score: 40.5,
                    },
                    industryAverage: {
                        score: 43.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 42.3,
                    endDate: "05/02/2025",
                    experience: {
                        score: 42.3,
                    },
                    sentiment: {
                        score: 64.2,
                    },
                    startDate: "05/02/2025",
                    label: "May 02, 2025",
                    shortLabel: "May 02 '25",
                    reputation: {
                        score: 39.3,
                    },
                    industryAverage: {
                        score: 43.5,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 41,
                    endDate: "05/03/2025",
                    experience: {
                        score: 41,
                    },
                    sentiment: {
                        score: 59.9,
                    },
                    startDate: "05/03/2025",
                    label: "May 03, 2025",
                    shortLabel: "May 03 '25",
                    reputation: {
                        score: 39.9,
                    },
                    industryAverage: {
                        score: 42.3,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46.5,
                    endDate: "05/04/2025",
                    experience: {
                        score: 46.5,
                    },
                    sentiment: {
                        score: 74.6,
                    },
                    startDate: "05/04/2025",
                    label: "May 04, 2025",
                    shortLabel: "May 04 '25",
                    reputation: {
                        score: 41.2,
                    },
                    industryAverage: {
                        score: 42.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46.1,
                    endDate: "05/05/2025",
                    experience: {
                        score: 46.1,
                    },
                    sentiment: {
                        score: 75.7,
                    },
                    startDate: "05/05/2025",
                    label: "May 05, 2025",
                    shortLabel: "May 05 '25",
                    reputation: {
                        score: 38.9,
                    },
                    industryAverage: {
                        score: 43.3,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 40.3,
                    endDate: "05/06/2025",
                    experience: {
                        score: 40.3,
                    },
                    sentiment: {
                        score: 61.2,
                    },
                    startDate: "05/06/2025",
                    label: "May 06, 2025",
                    shortLabel: "May 06 '25",
                    reputation: {
                        score: 36.5,
                    },
                    industryAverage: {
                        score: 43.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 43.4,
                    endDate: "05/07/2025",
                    experience: {
                        score: 43.4,
                    },
                    sentiment: {
                        score: 68,
                    },
                    startDate: "05/07/2025",
                    label: "May 07, 2025",
                    shortLabel: "May 07 '25",
                    reputation: {
                        score: 38.7,
                    },
                    industryAverage: {
                        score: 45.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 42.6,
                    endDate: "05/08/2025",
                    experience: {
                        score: 42.6,
                    },
                    sentiment: {
                        score: 65.5,
                    },
                    startDate: "05/08/2025",
                    label: "May 08, 2025",
                    shortLabel: "May 08 '25",
                    reputation: {
                        score: 38.9,
                    },
                    industryAverage: {
                        score: 45.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 44,
                    endDate: "05/09/2025",
                    experience: {
                        score: 44,
                    },
                    sentiment: {
                        score: 69.4,
                    },
                    startDate: "05/09/2025",
                    label: "May 09, 2025",
                    shortLabel: "May 09 '25",
                    reputation: {
                        score: 39,
                    },
                    industryAverage: {
                        score: 45.5,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 44.1,
                    endDate: "05/10/2025",
                    experience: {
                        score: 44.1,
                    },
                    sentiment: {
                        score: 68,
                    },
                    startDate: "05/10/2025",
                    label: "May 10, 2025",
                    shortLabel: "May 10 '25",
                    reputation: {
                        score: 40.9,
                    },
                    industryAverage: {
                        score: 42.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46.7,
                    endDate: "05/11/2025",
                    experience: {
                        score: 46.7,
                    },
                    sentiment: {
                        score: 74.5,
                    },
                    startDate: "05/11/2025",
                    label: "May 11, 2025",
                    shortLabel: "May 11 '25",
                    reputation: {
                        score: 42.1,
                    },
                    industryAverage: {
                        score: 39.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 42.1,
                    endDate: "05/12/2025",
                    experience: {
                        score: 42.1,
                    },
                    sentiment: {
                        score: 68.4,
                    },
                    startDate: "05/12/2025",
                    label: "May 12, 2025",
                    shortLabel: "May 12 '25",
                    reputation: {
                        score: 34.5,
                    },
                    industryAverage: {
                        score: 42.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 40.7,
                    endDate: "05/13/2025",
                    experience: {
                        score: 40.7,
                    },
                    sentiment: {
                        score: 61.6,
                    },
                    startDate: "05/13/2025",
                    label: "May 13, 2025",
                    shortLabel: "May 13 '25",
                    reputation: {
                        score: 37.1,
                    },
                    industryAverage: {
                        score: 44.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 47.1,
                    endDate: "05/14/2025",
                    experience: {
                        score: 47.1,
                    },
                    sentiment: {
                        score: 77.8,
                    },
                    startDate: "05/14/2025",
                    label: "May 14, 2025",
                    shortLabel: "May 14 '25",
                    reputation: {
                        score: 40,
                    },
                    industryAverage: {
                        score: 44.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 40.8,
                    endDate: "05/15/2025",
                    experience: {
                        score: 40.8,
                    },
                    sentiment: {
                        score: 63.9,
                    },
                    startDate: "05/15/2025",
                    label: "May 15, 2025",
                    shortLabel: "May 15 '25",
                    reputation: {
                        score: 35.1,
                    },
                    industryAverage: {
                        score: 44.3,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 42,
                    endDate: "05/16/2025",
                    experience: {
                        score: 42,
                    },
                    sentiment: {
                        score: 66.2,
                    },
                    startDate: "05/16/2025",
                    label: "May 16, 2025",
                    shortLabel: "May 16 '25",
                    reputation: {
                        score: 36.5,
                    },
                    industryAverage: {
                        score: 45.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 42.4,
                    endDate: "05/17/2025",
                    experience: {
                        score: 42.4,
                    },
                    sentiment: {
                        score: 62.9,
                    },
                    startDate: "05/17/2025",
                    label: "May 17, 2025",
                    shortLabel: "May 17 '25",
                    reputation: {
                        score: 41,
                    },
                    industryAverage: {
                        score: 46.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 42.9,
                    endDate: "05/18/2025",
                    experience: {
                        score: 42.9,
                    },
                    sentiment: {
                        score: 66.2,
                    },
                    startDate: "05/18/2025",
                    label: "May 18, 2025",
                    shortLabel: "May 18 '25",
                    reputation: {
                        score: 39.1,
                    },
                    industryAverage: {
                        score: 42.5,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 40.6,
                    endDate: "05/19/2025",
                    experience: {
                        score: 40.6,
                    },
                    sentiment: {
                        score: 58.7,
                    },
                    startDate: "05/19/2025",
                    label: "May 19, 2025",
                    shortLabel: "May 19 '25",
                    reputation: {
                        score: 39.8,
                    },
                    industryAverage: {
                        score: 41.9,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 42,
                    endDate: "05/20/2025",
                    experience: {
                        score: 42,
                    },
                    sentiment: {
                        score: 64.8,
                    },
                    startDate: "05/20/2025",
                    label: "May 20, 2025",
                    shortLabel: "May 20 '25",
                    reputation: {
                        score: 37.9,
                    },
                    industryAverage: {
                        score: 45.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 44,
                    endDate: "05/21/2025",
                    experience: {
                        score: 44,
                    },
                    sentiment: {
                        score: 71,
                    },
                    startDate: "05/21/2025",
                    label: "May 21, 2025",
                    shortLabel: "May 21 '25",
                    reputation: {
                        score: 37.4,
                    },
                    industryAverage: {
                        score: 44.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 40.9,
                    endDate: "05/22/2025",
                    experience: {
                        score: 40.9,
                    },
                    sentiment: {
                        score: 63,
                    },
                    startDate: "05/22/2025",
                    label: "May 22, 2025",
                    shortLabel: "May 22 '25",
                    reputation: {
                        score: 36.2,
                    },
                    industryAverage: {
                        score: 44.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 34.9,
                    endDate: "05/23/2025",
                    experience: {
                        score: 34.9,
                    },
                    sentiment: {
                        score: 46.7,
                    },
                    startDate: "05/23/2025",
                    label: "May 23, 2025",
                    shortLabel: "May 23 '25",
                    reputation: {
                        score: 34.8,
                    },
                    industryAverage: {
                        score: 44.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46.6,
                    endDate: "05/24/2025",
                    experience: {
                        score: 46.6,
                    },
                    sentiment: {
                        score: 75.8,
                    },
                    startDate: "05/24/2025",
                    label: "May 24, 2025",
                    shortLabel: "May 24 '25",
                    reputation: {
                        score: 40.4,
                    },
                    industryAverage: {
                        score: 44.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46.9,
                    endDate: "05/25/2025",
                    experience: {
                        score: 46.9,
                    },
                    sentiment: {
                        score: 73.6,
                    },
                    startDate: "05/25/2025",
                    label: "May 25, 2025",
                    shortLabel: "May 25 '25",
                    reputation: {
                        score: 43.6,
                    },
                    industryAverage: {
                        score: 42.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 40.2,
                    endDate: "05/26/2025",
                    experience: {
                        score: 40.2,
                    },
                    sentiment: {
                        score: 60.3,
                    },
                    startDate: "05/26/2025",
                    label: "May 26, 2025",
                    shortLabel: "May 26 '25",
                    reputation: {
                        score: 37,
                    },
                    industryAverage: {
                        score: 41.5,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 43.9,
                    endDate: "05/27/2025",
                    experience: {
                        score: 43.9,
                    },
                    sentiment: {
                        score: 70.9,
                    },
                    startDate: "05/27/2025",
                    label: "May 27, 2025",
                    shortLabel: "May 27 '25",
                    reputation: {
                        score: 37.2,
                    },
                    industryAverage: {
                        score: 43.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 38.5,
                    endDate: "05/28/2025",
                    experience: {
                        score: 38.5,
                    },
                    sentiment: {
                        score: 56.5,
                    },
                    startDate: "05/28/2025",
                    label: "May 28, 2025",
                    shortLabel: "May 28 '25",
                    reputation: {
                        score: 35.9,
                    },
                    industryAverage: {
                        score: 44.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 56.7,
                    endDate: "05/29/2025",
                    experience: {
                        score: 56.7,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "05/29/2025",
                    label: "May 29, 2025",
                    shortLabel: "May 29 '25",
                    reputation: {
                        score: 46.1,
                    },
                    industryAverage: {
                        score: 44.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 41.5,
                    endDate: "05/30/2025",
                    experience: {
                        score: 41.5,
                    },
                    sentiment: {
                        score: 58.3,
                    },
                    startDate: "05/30/2025",
                    label: "May 30, 2025",
                    shortLabel: "May 30 '25",
                    reputation: {
                        score: 43,
                    },
                    industryAverage: {
                        score: 44,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 55.7,
                    endDate: "05/31/2025",
                    experience: {
                        score: 55.7,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "05/31/2025",
                    label: "May 31, 2025",
                    shortLabel: "May 31 '25",
                    reputation: {
                        score: 43,
                    },
                    industryAverage: {
                        score: 41.9,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 37.1,
                    endDate: "06/01/2025",
                    experience: {
                        score: 37.1,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "06/01/2025",
                    label: "Jun 01, 2025",
                    shortLabel: "Jun 01 '25",
                    reputation: {
                        score: 51.5,
                    },
                    industryAverage: {
                        score: 39.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46.3,
                    endDate: "06/02/2025",
                    experience: {
                        score: 46.3,
                    },
                    sentiment: {
                        score: 63.6,
                    },
                    startDate: "06/02/2025",
                    label: "Jun 02, 2025",
                    shortLabel: "Jun 02 '25",
                    reputation: {
                        score: 52,
                    },
                    industryAverage: {
                        score: 39.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 42.9,
                    endDate: "06/03/2025",
                    experience: {
                        score: 42.9,
                    },
                    sentiment: {
                        score: 57.9,
                    },
                    startDate: "06/03/2025",
                    label: "Jun 03, 2025",
                    shortLabel: "Jun 03 '25",
                    reputation: {
                        score: 47.5,
                    },
                    industryAverage: {
                        score: 42.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 52.6,
                    endDate: "06/04/2025",
                    experience: {
                        score: 52.6,
                    },
                    sentiment: {
                        score: 85,
                    },
                    startDate: "06/04/2025",
                    label: "Jun 04, 2025",
                    shortLabel: "Jun 04 '25",
                    reputation: {
                        score: 49.1,
                    },
                    industryAverage: {
                        score: 41.5,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 57.4,
                    endDate: "06/05/2025",
                    experience: {
                        score: 57.4,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "06/05/2025",
                    label: "Jun 05, 2025",
                    shortLabel: "Jun 05 '25",
                    reputation: {
                        score: 48.3,
                    },
                    industryAverage: {
                        score: 43.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46.7,
                    endDate: "06/06/2025",
                    experience: {
                        score: 46.7,
                    },
                    sentiment: {
                        score: 70.9,
                    },
                    startDate: "06/06/2025",
                    label: "Jun 06, 2025",
                    shortLabel: "Jun 06 '25",
                    reputation: {
                        score: 45.8,
                    },
                    industryAverage: {
                        score: 44.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 57.4,
                    endDate: "06/07/2025",
                    experience: {
                        score: 57.4,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "06/07/2025",
                    label: "Jun 07, 2025",
                    shortLabel: "Jun 07 '25",
                    reputation: {
                        score: 48.2,
                    },
                    industryAverage: {
                        score: 42.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46,
                    endDate: "06/08/2025",
                    experience: {
                        score: 46,
                    },
                    sentiment: {
                        score: 66.7,
                    },
                    startDate: "06/08/2025",
                    label: "Jun 08, 2025",
                    shortLabel: "Jun 08 '25",
                    reputation: {
                        score: 48,
                    },
                    industryAverage: {
                        score: 37.9,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 49.7,
                    endDate: "06/09/2025",
                    experience: {
                        score: 49.7,
                    },
                    sentiment: {
                        score: 78.6,
                    },
                    startDate: "06/09/2025",
                    label: "Jun 09, 2025",
                    shortLabel: "Jun 09 '25",
                    reputation: {
                        score: 46.8,
                    },
                    industryAverage: {
                        score: 40.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 48.9,
                    endDate: "06/10/2025",
                    experience: {
                        score: 48.9,
                    },
                    sentiment: {
                        score: 73.9,
                    },
                    startDate: "06/10/2025",
                    label: "Jun 10, 2025",
                    shortLabel: "Jun 10 '25",
                    reputation: {
                        score: 49.4,
                    },
                    industryAverage: {
                        score: 43.5,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 39.8,
                    endDate: "06/11/2025",
                    experience: {
                        score: 39.8,
                    },
                    sentiment: {
                        score: 58.3,
                    },
                    startDate: "06/11/2025",
                    label: "Jun 11, 2025",
                    shortLabel: "Jun 11 '25",
                    reputation: {
                        score: 37.8,
                    },
                    industryAverage: {
                        score: 43.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 54.6,
                    endDate: "06/12/2025",
                    experience: {
                        score: 54.6,
                    },
                    sentiment: {
                        score: 89.6,
                    },
                    startDate: "06/12/2025",
                    label: "Jun 12, 2025",
                    shortLabel: "Jun 12 '25",
                    reputation: {
                        score: 50.3,
                    },
                    industryAverage: {
                        score: 42.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 50.1,
                    endDate: "06/13/2025",
                    experience: {
                        score: 50.1,
                    },
                    sentiment: {
                        score: 75.9,
                    },
                    startDate: "06/13/2025",
                    label: "Jun 13, 2025",
                    shortLabel: "Jun 13 '25",
                    reputation: {
                        score: 51,
                    },
                    industryAverage: {
                        score: 41.5,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46.2,
                    endDate: "06/14/2025",
                    experience: {
                        score: 46.2,
                    },
                    sentiment: {
                        score: 66.7,
                    },
                    startDate: "06/14/2025",
                    label: "Jun 14, 2025",
                    shortLabel: "Jun 14 '25",
                    reputation: {
                        score: 48.7,
                    },
                    industryAverage: {
                        score: 40.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 36.2,
                    endDate: "06/15/2025",
                    experience: {
                        score: 36.2,
                    },
                    sentiment: {
                        score: 43.1,
                    },
                    startDate: "06/15/2025",
                    label: "Jun 15, 2025",
                    shortLabel: "Jun 15 '25",
                    reputation: {
                        score: 42.5,
                    },
                    industryAverage: {
                        score: 37.6,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 46.3,
                    endDate: "06/16/2025",
                    experience: {
                        score: 46.3,
                    },
                    sentiment: {
                        score: 66.7,
                    },
                    startDate: "06/16/2025",
                    label: "Jun 16, 2025",
                    shortLabel: "Jun 16 '25",
                    reputation: {
                        score: 48.8,
                    },
                    industryAverage: {
                        score: 40.1,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 47.9,
                    endDate: "06/17/2025",
                    experience: {
                        score: 47.9,
                    },
                    sentiment: {
                        score: 71.4,
                    },
                    startDate: "06/17/2025",
                    label: "Jun 17, 2025",
                    shortLabel: "Jun 17 '25",
                    reputation: {
                        score: 49,
                    },
                    industryAverage: {
                        score: 42.7,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 22.7,
                    },
                    experienceScore: 57.5,
                    endDate: "06/18/2025",
                    experience: {
                        score: 57.5,
                    },
                    sentiment: {
                        score: 100,
                    },
                    startDate: "06/18/2025",
                    label: "Jun 18, 2025",
                    shortLabel: "Jun 18 '25",
                    reputation: {
                        score: 48.4,
                    },
                    industryAverage: {
                        score: 44.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 26.9,
                    },
                    experienceScore: 41.3,
                    endDate: "06/19/2025",
                    experience: {
                        score: 41.3,
                    },
                    sentiment: {
                        score: 50,
                    },
                    startDate: "06/19/2025",
                    label: "Jun 19, 2025",
                    shortLabel: "Jun 19 '25",
                    reputation: {
                        score: 46.7,
                    },
                    industryAverage: {
                        score: 43.5,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 26.9,
                    },
                    experienceScore: 52.7,
                    endDate: "06/20/2025",
                    experience: {
                        score: 52.7,
                    },
                    sentiment: {
                        score: 81,
                    },
                    startDate: "06/20/2025",
                    label: "Jun 20, 2025",
                    shortLabel: "Jun 20 '25",
                    reputation: {
                        score: 49.3,
                    },
                    industryAverage: {
                        score: 40.3,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 26.9,
                    },
                    experienceScore: 48.2,
                    endDate: "06/21/2025",
                    experience: {
                        score: 48.2,
                    },
                    sentiment: {
                        score: 75,
                    },
                    startDate: "06/21/2025",
                    label: "Jun 21, 2025",
                    shortLabel: "Jun 21 '25",
                    reputation: {
                        score: 42,
                    },
                    industryAverage: {
                        score: 42.2,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 26.9,
                    },
                    experienceScore: 36,
                    endDate: "06/22/2025",
                    experience: {
                        score: 36,
                    },
                    sentiment: {
                        score: 33.3,
                    },
                    startDate: "06/22/2025",
                    label: "Jun 22, 2025",
                    shortLabel: "Jun 22 '25",
                    reputation: {
                        score: 48,
                    },
                    industryAverage: {
                        score: 36,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 26.9,
                    },
                    experienceScore: 43,
                    endDate: "06/23/2025",
                    experience: {
                        score: 43,
                    },
                    sentiment: {
                        score: 62.5,
                    },
                    startDate: "06/23/2025",
                    label: "Jun 23, 2025",
                    shortLabel: "Jun 23 '25",
                    reputation: {
                        score: 39,
                    },
                    industryAverage: {
                        score: 41.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 27,
                    },
                    experienceScore: 20.4,
                    endDate: "06/24/2025",
                    experience: {
                        score: 20.4,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "06/24/2025",
                    label: "Jun 24, 2025",
                    shortLabel: "Jun 24 '25",
                    reputation: {
                        score: 34.9,
                    },
                    industryAverage: {
                        score: 41.4,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 27,
                    },
                    experienceScore: 22.1,
                    endDate: "06/25/2025",
                    experience: {
                        score: 22.1,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "06/25/2025",
                    label: "Jun 25, 2025",
                    shortLabel: "Jun 25 '25",
                    reputation: {
                        score: 39.9,
                    },
                    industryAverage: {
                        score: 41.8,
                    },
                },
            },
            {
                actual: {
                    listing: {
                        score: 27,
                    },
                    experienceScore: 13.5,
                    endDate: "06/26/2025",
                    experience: {
                        score: 13.5,
                    },
                    sentiment: {
                        score: 0,
                    },
                    startDate: "06/26/2025",
                    label: "Jun 26, 2025",
                    shortLabel: "Jun 26 '25",
                    reputation: {
                        score: 0,
                    },
                    industryAverage: {
                        score: 42.3,
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
            max: 110,
        },
        rightYAxisOptions: null,
    },
    isCustomLegend: true,
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
        width: 1127,
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
    disabledSeriesData: [],
};
