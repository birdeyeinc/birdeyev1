import { comparison3Star, comparison4Star, green100, red30, red90, white, yellow90 } from "sass/js/colors";

export const comparisonTypes = {
    TIME_PERIOD: "daterange",
    LOCATION: "location",
};

export const listingAccuracyWidgets = {
    LISTINGS_ACCURACY_BY_SITE: "insights-listings-accuracy-by-site",
    LISTINGS_STATUS: "insights-listings-status",
    LISTINGS_ACCURACY_SCORE: "insights-listings-accuracy-score",
    FIELD_ACCURACY: "insights-listings-field-accuracy",
    LISTINGS_ACCURACY_SINGLE_LOC_TABLE: "insights-listings-single-loc-table",
    LISTINGS_ACCURACY_SINGLE_SITE_TABLE: "insights-listings-single-site-table",
};

export const VISUALIZATIONS_SHORT_CODES = {
    VERTICAL_BAR_CHART: "column",
    HORIZONTAL_BAR_CHART: "bar",
    LINE_CHART: "spline", // Coverted to Spline chart as per JIRA BIRD-17304
    PIE_CHART: "pie",
    DONUT_CHART: "donut",
    TABLE: "table",
    AREA_CHART: "areaspline",
    SPLINE: "spline",
    HEATMAP: "heatmap",
    STREAMGRAPH: "streamgraph",
    STACKED_AREA: "area",
    QUADRANT_CHART: "bubble",
    SANKEY_CHART: "sankey",
    VARIABLE_PIE_CHART: "variablepie",
    SINGLE_DATA_WIDGET: "SingleDataWidget",
    PROGRESS_BAR_WIDGET: "ProgressBarWidget",
    SPEEDOMETER: "gauge",
    RADIAL_CHART: "radial",
    PACKED_BUBBLE: "packedbubble",
    WORD_CLOUD: "wordcloud",
    SUNBURST_CHART: "sunburst",
    TREE_MAP: "treemap",
};

export const parserConstant = {
    ARRAY_KEY_VALUE: "arrayWithKeyValue",
    GROUPED_ARRAY: "arrayWithGrouped",
    GROUPED: "grouped",
    GROUPED_ARRAY_KEY_VALUE: "groupedArrayWithKeyValue",
};

export const COMPETITOR_GRAPH_IDS = {
    competitiveDistribution: "competitiveDistribution",
    ratingAndReviewsOverview: "ratingAndReviewsOverview",
    breakdownOvertime: "breakdownOvertime",
    leaderboardBySource: "leaderboardBySource",
    leaderboardByLocation: "leaderboardByLocation",
};

export const appConst = {
    DAY: "day",
    WEEK: "week",
    MONTH: "month",
    QUARTER: "quarter",
    YEAR: "year",
};

export const I_ACTIVE_CONVERSATIONS_CHANNELS = {
    module: "inbox",
    reportsGroup: "channels",
    subModule: "inbox",
    graphId: "channels-active-conversations",
};

export const I_CHANNELS_RECEIVED_MESSAGES = {
    module: "inbox",
    reportsGroup: "channels",
    subModule: "inbox",
    graphId: "channels-received-messages",
};

export const QR_SCAN_CLK_OVERALL_PERF = {
    module: "reviews",
    reportsGroup: "qr-code-performance",
    subModule: "conversion",
    graphId: "qr-scan-click-overall-performance",
};

export const competitorAverageSeries = {
    name: "Competitor average",
    color: "#8f8f8f",
};

export const benchmarkingConstant = {
    GROUPED_COLUMN_CHART: "groupedColumnChart",
    REPUTATION_SCORE_SCATTER: "reputation-score-scatter-chart",
};

export const chartIntialLimits = {
    CATEGORY: 25,
    SUB_CATEGORY: 20,
    KEYWORD: 25,
    ADJECTIVE: 25,
    SPLIT_PACKED: 10,
    ALL_CHART_LIMIT: 25
};

export const entityTypes = {
    "CATEGORY": "CATEGORY",
    "SUB_CATEGORY": "SUB_CATEGORY",
    "KEYWORD": "KEYWORD",
    "ADJECTIVE": "ADJECTIVE",
    "LOCATION": "LOCATION"
};

export const chartElemColor = {
    pos: green100,
    neu: yellow90,
    neg: red90,
    empty: white,
    transparent: "transparent",
    "pos_selected": comparison4Star,
    "neu_selected": comparison3Star,
    "neg_selected": red30
};

export const chartElementConfig = {
    CATEGORY: {
        parent: "",
        child: "SUB_CATEGORY",
        title: "category",
        parentTitle: "category",
        allCatSelected: true,
        plural: "all categories",
        level: 0,
        TABLE_ENTITY_TYPE: entityTypes.SUB_CATEGORY,
    },
    SUB_CATEGORY: {
        parent: "CATEGORY",
        child: "KEYWORD",
        title: "subcategory",
        parentTitle: "category",
        plural: "subcategories",
        level: 1,
        TABLE_ENTITY_TYPE: entityTypes.KEYWORD,
    },
    KEYWORD: {
        parent: "SUB_CATEGORY",
        child: "ADJECTIVE",
        title: "keyword",
        parentTitle: "category",
        plural: "keywords",
        level: 2,
        TABLE_ENTITY_TYPE: entityTypes.ADJECTIVE,
    },
    ADJECTIVE: {
        parent: "KEYWORD",
        child: "",
        title: "adjective",
        parentTitle: "keyword",
        plural: "adjectives",
        level: 3,
        TABLE_ENTITY_TYPE: entityTypes.ADJECTIVE,
    }
};