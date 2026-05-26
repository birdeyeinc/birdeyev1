export const columnBaseConfig = {
    reportsGroup: "reviews-and-rating",
    disableEmailBodyEdit: false,
    tempUniqueId: "review-distribution-by-rating_175100643664898",
    subReportsGroup: "reviews-and-rating",
    parserConfig: {
        yAxisCustomMax(max1, max2) {
            max1 = max1 + Math.ceil((max1 / 100) * 45);
            return {
                max1,
                max2,
            };
        },
        // dataFormat: "arrayWithKeyValue",
        // stackedGraph: true,
        // categoryKey: "countByRating",
        displaySummary: false,
        crosshairConfig: {
            color: "#e3effc",
        },
        showProjectedData: false,
        // yAxisText: "Reviews",
        doubleYaxis: false,
        // graphTitle: "Reviews by rating",
        xAxisLabelsAlignment: {
            bar: "right",
            column: "center",
            spline: "center",
        },
        seriesDetails: [

        ],
        yAxisConfigs: [
            { min: 0, labels: { enabled: false }, gridLineWidth: 0 },
            { min: 0, max: 5, tickInterval: 1, labels: { enabled: false }, gridLineWidth: 0 }
        ],
        xAxisFormatter: (label) => label,
        dataPoints: true,
        plotDataConfig: {
            column: {
                column: {
                    dataLabels: {
                        enabled: true,
                        y: -20,
                    },
                    stacking: null,
               //   stacking: 'normal',// for stacked column
                },
                spline: {
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        inside: true,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 0,
                        x: 0,
                        padding: 0,
                        allowOverlap: true,
                        crop: false,
                        style: { fontSize: '11px', fontWeight: 400, color: '#fff', textOutline: 'none' },
                        formatter() {
                            const raw = this.y;
                            const val = (Math.round(raw * 100) / 100).toFixed(2).replace(/\.00$/, '').replace(/(\.[0-9])0$/, '$1');
                            const isLast = this.point === this.series.data[this.series.data.length - 1];
                            const bg = isLast && this.point.yProj ? '#a4ccf4' : '#2C3E91';
                            // styles per spec
                            // width dynamic but constrained via min/max; explicit height 22px; radius 24px; padding top/bottom token approx 2px
                            return `<span style="display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:36px;max-width:40px;height:22px;padding:2px 6px;border-radius:24px;border:1px solid transparent;background:${bg};line-height:1;font-size:11px;font-weight:400;color:#fff;">${val}</span>`;
                        }
                    },
                    marker: { enabled: false },
                    lineWidth: 2,
                },
            },
            bar: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        verticalAlign: "middle",
                        format: "{point.y}",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#212121",
                        text: "",
                    },
                    inside: false,
                    type: "bar",
                },
                spline: {
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        inside: true,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 0,
                        x: 0,
                        padding: 0,
                        allowOverlap: true,
                        crop: false,
                        style: { fontSize: '11px', fontWeight: 400, color: '#fff', textOutline: 'none' },
                        formatter() {
                            const raw = this.y;
                            const val = (Math.round(raw * 100) / 100).toFixed(2).replace(/\.00$/, '').replace(/(\.[0-9])0$/, '$1');
                            const isLast = this.point === this.series.data[this.series.data.length - 1];
                            const bg = isLast && this.point.yProj ? '#a4ccf4' : '#2C3E91';
                            // styles per spec
                            // width dynamic but constrained via min/max; explicit height 22px; radius 24px; padding top/bottom token approx 2px
                            return `<span style="display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:36px;max-width:40px;height:22px;padding:2px 6px;border-radius:24px;border:1px solid transparent;background:${bg};line-height:1;font-size:11px;font-weight:400;color:#fff;">${val}</span>`;
                        }
                    },
                    marker: { enabled: false },
                    lineWidth: 2,
                },
            },
            pie: [
                {
                    dataLabels: {
                        enabled: true,
                        showUnitInBracket: true,
                        color: "#212121",
                        stackLabels: false,
                        fontWeight: 400,
                        verticalAlign: "top",
                        fontSize: "12px",
                        y: -15,
                    },
                    stacking: "normal",
                    inside: false,
                    type: "column",
                    compareStacking: "normal",
                },
                {
                    dataLabels: {
                        enabled: true,
                        verticalAlign: "middle",
                        format: "{point.y}",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#212121",
                        text: "",
                    },
                    stacking: "normal",
                    inside: false,
                    type: "bar",
                },
                {
                    dataLabels: {
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 400,
                        verticalAlign: "middle",
                        enabled: false,
                    },
                    type: "spline",
                },
                {
                    dataLabels: {
                        allowOverlap: false,
                        crop: false,
                        overflow: "none",
                        inside: false,
                    },
                    minPointLength: 3,
                    marker: {
                        enabled: true,
                    },
                    type: "series",
                },
            ]
        },
        marginRight: 0,
        lineChartComparisonEnabled: true,
        updateTooltipDotColorWithColumnColor: true,
        defaultChartStyle: "bar",
        primaryChartStyle: "bar",
        marginLeft: 0,
        hideDottedLastLine: true,
        categoryList: ["0", "1", "2", "3", "4", "5"],
        compareStacking: "normal",
        enableCrosshair: true,
        reverseLegendOrder: false,
    },
    displayValueAs: {
        days: false,
        hours: false,
        minutes: false,
    },
    heading: "Reviews by rating",
    globalFilterApplied: false,
    filterData: {
        // questionType: [],
        // fieldFilters: [],
        // localFilter: false,
        // reportSources: [],
        // ticketType: [],
        // currentChange: {
        //     key: ["userIds", "tagIds", "tags", "ratings", "reviewResponseOptions", "surveyIds", "ticketType", "contentTypes", "secondaryFieldFilters"],
        // },
        // employeeIds: [],
        // messages: [],
        // groupByDays: "1",
        // excludedBizIds: [],
        // customerSentiment: [],
        // reviewSites: [],
        // days: "90",
        // businessIds: [],
        // surveyIds: [],
    },
    apiData: {
        dataPoints: [
            {
                actual: {
                    startDate: "03/29/2025",
                    endDate: "06/26/2025",
                    countByRating: {
                        0: 14,
                        1: 39,
                        2: 34,
                        3: 27,
                        4: 51,
                        5: 284,
                    },
                }
            },
        ],
        dataPresent: true,
    },
    isInsightsAvailable: true,
    legendValue: ["Different star ratings"],
    yAxisOptions: {
        enableDoubleYAxis: false,
        leftYAxisOptions: {
            label: "Reviews",
            min: 0,
            max: 0,
        },
        rightYAxisOptions: null,
    },
    isDefaultComparisonFilterApplied: false,
    displayUnit: {
        value: true,
        percentage: true,
        supportedChart: "PC",
    },
    apiDetails: {
        // isReportsEnabled: true,
        // roleBaseKey: "Reports/Review_reports/reviews_by_rating",
        // url: "review/report/overview/rating-distribution/time",
        // method: "post",
        // mockResponse: {
        //     dataPoints: [
        //         {
        //             actual: {
        //                 totalCount: 0,
        //                 avgRating: 0,
        //                 startDate: "01/02/1970",
        //                 endDate: "06/12/2023",
        //                 countByRating: {
        //                     0: 33,
        //                     1: 12,
        //                     2: 2,
        //                     3: 0,
        //                     4: 10,
        //                     5: 211,
        //                 },
        //             },
        //             compare: {
        //                 totalCount: 0,
        //                 avgRating: 0,
        //                 startDate: "01/02/1970",
        //                 endDate: "06/12/2023",
        //                 countByRating: {
        //                     0: 33,
        //                     1: 12,
        //                     2: 2,
        //                     3: 0,
        //                     4: 10,
        //                     5: 211,
        //                 },
        //             },
        //         },
        //     ],
        // },
        // params: {
        //     size: 100,
        // },
        // hierarchyRoleBaseKey: "",
    },
    isVisible: true,
    mainHeading: "Reviews & ratings by rating",
    graphId: "review-distribution-by-rating",
    isRaceChartDownload: false,
    subModule: "by-rating",
    module: "reviews",
    layoutConfig: {
        maxH: 8,
        minW: 6,
        h: 4,
        i: "grid_id",
        maxW: 12,
        minH: 4,
        w: 12,
        x: 0,
        y: null,
    },
    defaultLayoutSize: "S",
    localFilterData: {
        comparisonFilter: {
            previous: true,
            key: "previous_period",
        },
        comparisonType: "daterange",
        reportSources: [],
        selectedMonth: [],
        selectedkeywords: [],
        ticketType: [],
        graphId: "review-distribution-by-rating",
        employeeIds: [],
        experienceScores: [],
        userIds: [],
        tableSortConfig: {},
        timePeriod: {
            days: "90",
            groupByDays: "1",
            key: "last_90_days",
        },
        reviewFilterOptions: [],
        hierarchyLevel: "",
        excludedBizIds: [],
        compareDataValues: {
            comparisonType: "daterange",
            values: {
                actual: {
                    days: "90",
                    groupByDays: "1",
                    key: "last_90_days",
                },
                compareWith: {
                    previous: true,
                    key: "previous_period",
                },
            },
        },
        customerSentiment: [],
        selectedSeries: [],
        surveySites: [],
        chartStyle: "bar",
        reviewSites: [],
        allMonths: [],
        sortBy: {},
        ratings: [],
        allSurveyDropdownData: {},
        customerType: null,
        requireCumulative: false,
        employeeCodes: [],
        businessIds: [],
        previousURL: "",
        finalPayload: {
            comparisonFilter: {
                previous: true,
                key: "previous_period",
            },
            sizeParam: 100,
            groupByDays: "1",
            groupByType: null,
            groupBy: null,
            days: "90",
            newFilters: true,
            key: "last_90_days",
        },
        tags: [],
        displayBy: {},
        surveyScores: [],
        selectedDisplayValueAs: "",
        surveyIds: [],
        sourceTypes: [],
        socialSites: [],
    },
    supportedFilters: {
        timePeriod: true,
        locationAndHierarchy: true,
        reviewSources: true,
        reviewRating: true,
        users: false,
        tags: false,
    },
    displayUnits: [
        {
            label: "Shortened number",
            value: "SHORT_NUM",
        },
        {
            label: "Full number",
            value: "FULL_NUM",
        },
        {
            label: "Hundreds",
            value: "H",
        },
        {
            label: "Thousands",
            value: "K",
        },
        {
            label: "Millions",
            value: "M",
        },
        {
            label: "Billions",
            value: "B",
        },
        {
            label: "Trillions",
            value: "T",
        },
    ],
    tableSortConfig: {},
    order: 2,
    subReportHeading: "Reviews by rating",
    raceChartConfig: {
        enabled: true,
        apiDetails: {
            url: "review/report/overview/race-distribution-by-rating",
            method: "post",
            mockResponse: {},
        },
        raceDataTimeLabelKey: "shortLabel",
        raceDataPointsKey: "timelineDataPoints",
        raceSummaryKey: "timelineSummary",
    },
    hierarchyLevel: "",
    tagsAvailable: true,
    disabledSeries: [],
    redirectURL: "/dashboard/reviews/feed?nav-tab=Custom&",
    extraReqParams: {
        sortOrder: 1,
        sortedColumn: "review-count",
    },
    visualizationTypes: ["column", "bar", "table", "bar", "spline"],
    finalPayload: {
        comparisonFilter: {
            previous: true,
            key: "previous_period",
        },
        sizeParam: 100,
        groupByDays: "1",
        groupByType: null,
        groupBy: null,
        days: "90",
        newFilters: true,
        key: "last_90_days",
    },
    displayBy: {
        daily: false,
        weekly: false,
        monthly: false,
        quarterly: false,
        yearly: false,
    },
    compareOptions: ["TIME_PERIOD", "LOCATION"],
    isDefaultEditable: false,
    showDelta: true,
    tagIds: [],
    chartActions: [{}],
    globalFilters: {
        days: "90",
        groupByDays: "1",
        businessIds: [],
        currentChange: {
            key: ["userIds", "tagIds", "tags", "ratings", "reviewResponseOptions", "surveyIds", "ticketType", "contentTypes", "secondaryFieldFilters"],
        },
        localFilter: false,
        reviewSites: [],
        reportSources: [],
        ticketType: [],
        customerSentiment: [],
        employeeIds: [],
        fieldFilters: [],
        surveyIds: [],
        excludedBizIds: [],
        messages: [],
        questionType: [],
    },
    gridItemStyle: {
        height: 552,
        width: 1573,
    },
    filterCount: {
        "review-distribution-by-rating": 1,
    },
    isFullWidthEnabled: true,
    router: "/dashboard/analytics-dash/reports/reviews/reviews-and-rating/by-rating",
    createdBy: "",
};
