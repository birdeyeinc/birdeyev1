import { VISUALIZATIONS_SHORT_CODES } from "components/GraphTable/common/constants";
import { checkIfCompareFilterIsApplied } from "components/GraphTable/common/helper";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsWordCloud from "highcharts/modules/wordcloud";
import Heatmap from "highcharts/modules/heatmap";
import HighchartsSunBurst from "highcharts/modules/sunburst.js";
import HighchartsDrillDown from "highcharts/modules/drilldown";
import HighchartsAccessibility from "highcharts/modules/accessibility";
import HighchartsMore from "highcharts/highcharts-more";
import React, { memo, useEffect, useRef, useState } from "react";
import ChartsStyles from "./styles/charts.module.scss";
import { isEqual } from "lodash";
import { object } from "prop-types";
import VariablePie from "highcharts/modules/variable-pie";
import TreeMap from "highcharts/modules/treemap";
import { getCustomLegends } from "components/GraphTable/visualisations/charts/common/legend";
VariablePie(Highcharts);
TreeMap(Highcharts);
import HighchartsSankeyChart from "highcharts/modules/sankey";

// Importing Highcharts AST to allow viewBox attribute in SVG
Highcharts.AST.allowedAttributes.push("viewBox");

// Setting thousands separator for Highcharts
// This is to ensure that Highcharts uses comma as thousands separator for numbers in the charts.
// This is useful for better readability of large numbers in charts.
Highcharts.setOptions({
    lang: {
        thousandsSep: ",",
    },
});

// Added this to hide foreach highchart console warning.
Highcharts.wrap(Highcharts, "each", function (proceed, arr, fn, ctx) {
    if (Array.isArray(arr)) {
        arr.forEach(fn, ctx);
    } else {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});

// Importing HighchartsMore module for Highcharts
HighchartsMore(Highcharts);
// Importing WordCloud module for Highcharts
HighchartsWordCloud(Highcharts);
// Importing SunBurst module for Highcharts
HighchartsSunBurst(Highcharts);
// Importing HighchartsDrillDown module for Highcharts
HighchartsDrillDown(Highcharts);
// Importing HighchartsAccessibility module for Highcharts
HighchartsAccessibility(Highcharts);
// Importing Heatmap module for Highcharts
Heatmap(Highcharts);
// Importing Sankey module for Highcharts
HighchartsSankeyChart(Highcharts);

const { PIE_CHART, RADIAL_CHART, AREA_CHART, VERTICAL_BAR_CHART, HORIZONTAL_BAR_CHART, SPLINE, LINE_CHART, WORD_CLOUD, PACKED_BUBBLE, HEATMAP, SUNBURST_CHART, SANKEY_CHART, TREE_MAP } = VISUALIZATIONS_SHORT_CODES;

const Charts = ({ reportConfig }) => {
    const { parserConfig, graphId = "" } = reportConfig;
    const { primaryChartStyle, barGrouping, customContainerClasses = "", customContainerStyles = {} } = parserConfig;
    const [finalConfig, setFinalConfig] = useState(null);
    const [secondaryChartConfig, setSecondaryChartConfig] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChartIndex, setSelectedChartIndex] = useState(0);
    const [disabledSeriesData, setDisabledSeriesData] = useState([]);

    const mainChartKey = useRef(null);
    const secondaryChartKey = useRef(null);

    const isCompareApplied = checkIfCompareFilterIsApplied(reportConfig);

    useEffect(() => {
        let isMounted = true;
        async function loadConfig() {
            let module;
            switch (primaryChartStyle) {
                case AREA_CHART:
                    module = await import("./extensions/areaspline/index");
                    break;
                case VERTICAL_BAR_CHART: {
                    module = await import("./extensions/column/index");
                    if (barGrouping) {
                        module = await import("./extensions/column-grouped/index");
                    }
                    break;
                }
                case HORIZONTAL_BAR_CHART:
                    module = await import("./extensions/bar/index");
                    if (barGrouping) {
                        module = await import("./extensions/column-grouped/index");
                    }
                    break;
                case LINE_CHART:
                case SPLINE:
                    module = await import("./extensions/spline/index");
                    break;
                case WORD_CLOUD:
                    module = await import("./extensions/wordcloud/index");
                    break;
                case PIE_CHART:
                    module = await import("./extensions/pie/index");
                    break;
                case HEATMAP:
                    module = await import("./extensions/heatmap/index");
                    break;
                case PACKED_BUBBLE:
                    module = await import("./extensions/packedbubble/index");
                    break;
                case SUNBURST_CHART:
                    module = await import("./extensions/sunburst/index");
                    break;
                case SANKEY_CHART:
                    module = await import("./extensions/sankey");
                    break;
                case VISUALIZATIONS_SHORT_CODES.QUADRANT_CHART:
                    module = await import("./extensions/quadrant");
                    break;
                case "variablepie":
                    module = await import("./extensions/variablepie/index");
                    break;
                case TREE_MAP:
                    module = await import("./extensions/treemap/index");
                    break;
                case "table":
                    module = await import("../Table");
                default:
                    setFinalConfig(null);
                    return;
            }
            if (module && module.getChartConfig && isMounted) {
                const finalChartConfig = module.getChartConfig({...reportConfig, disabledSeriesData});
                console.log("🚀 ~ loadConfig ~ finalChartConfig:", finalChartConfig);
                setFinalConfig(finalChartConfig);
                mainChartKey.current = `MAIN_CHART_${finalChartConfig?.chart?.renderTo}_${Date.now()}`;
            } else {
                setFinalConfig(null);
                setSecondaryChartConfig(null);
            }
        }
        loadConfig();
        return () => {
            isMounted = false;
        };
    }, [primaryChartStyle, reportConfig, barGrouping, disabledSeriesData]);

    const handlePrimaryChartCallBack = (chart) => {
        // You can perform any actions with the main chart instance here if needed
        if (reportConfig?.getPrimaryChartCallBack && typeof reportConfig.getPrimaryChartCallBack === "function") {
            reportConfig.getPrimaryChartCallBack(chart);
        }
    };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

    if (!finalConfig) return null;

    const isComparePIEChart = (primaryChartStyle === PIE_CHART || primaryChartStyle === RADIAL_CHART) && isCompareApplied;
    const mainWrapperClassName = isComparePIEChart ? "compare-wrap" : "";
    return (
        <div className={`el-highchart-container ${mainWrapperClassName} ${ChartsStyles["charts-wrapper"]}`} style={{ height: "100%" }}>
            {secondaryChartConfig ? (
                <HighchartsReact
                    key={secondaryChartKey.current}
                    highcharts={Highcharts}
                    options={secondaryChartConfig}
                    containerProps={{
                        className: `${primaryChartStyle} be-analytics-high-chart-box pie-chart-compare ${customContainerClasses}`,
                        id: `pie_comparison_chart_${finalConfig?.chart?.renderTo}`,
                        style: { height: "100%", width: "100%", ...customContainerStyles },
                    }}
                    immutable
                />
            ) : null}
            <HighchartsReact
                key={mainChartKey.current}
                highcharts={Highcharts}
                options={finalConfig}
                containerProps={{
                    className: `${primaryChartStyle} be-analytics-high-chart-box compare-chart ${customContainerClasses}`,
                    id: `chart_${graphId || finalConfig?.chart?.renderTo}`,
                    style: { height: "100%", width: "100%", ...customContainerStyles },
                    'data-testid': `el-test-chart_${graphId || finalConfig?.chart?.renderTo}`,
                }}
                immutable
                callback={handlePrimaryChartCallBack}
            />
            {reportConfig.isExternalLegend &&
                <div className={`${reportConfig?.isCustomLegendContainerClass || ""} ${ChartsStyles["legend-container"]}`}>
                    {reportConfig?.customLegendJsx ? reportConfig?.customLegendJsx(reportConfig, setDisabledSeriesData, disabledSeriesData) : getCustomLegends(reportConfig, finalConfig, disabledSeriesData, setDisabledSeriesData)}
                </div>
            }
        </div>
    );
};

Charts.propTypes = {
    reportConfig: object.isRequired,
};

const arePropsEqual = (prevProps, nextProps) => {
    if (!isEqual(prevProps.reportConfig, nextProps.reportConfig)) {
        return false;
    }
    return true;
};

export default memo(Charts, arePropsEqual);
