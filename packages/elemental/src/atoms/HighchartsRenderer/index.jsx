/**
 * ⚠️ DO NOT override or modify this component directly unless absolutely necessary.
 * This is a low-level primitive atom — changes here affect all chart consumers.
 *
 * If you need to extend or customize chart behavior, use the higher-level composed components:
 *   - components/GraphTable
 *   - components/GraphToolbarContainer
 */
// eslint-disable-next-line no-unused-vars
import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HighchartsSunBurst from "highcharts-v2/modules/sunburst.js";
import HighchartsDrillDown from "highcharts-v2/modules/drilldown";
import HighchartsMore from "highcharts-v2/highcharts-more";
import Heatmap from "highcharts-v2/modules/heatmap";
import Streamgraph from "highcharts-v2/modules/streamgraph";
import variablePie from "highcharts-v2/modules/variable-pie";
import HighchartsTreemap from "highcharts-v2/modules/treemap";
import HighchartsSankeyChart from "highcharts-v2/modules/sankey";
import HighchartsBoost from "highcharts-v2/modules/boost";
import HighchartsAccessibilityModule from "highcharts-v2/modules/accessibility";
import HighchartsFunnel from "highcharts-v2/modules/funnel";
import PropTypes from "prop-types";

// This is required to avoid the warning "Unknown attribute viewBox. This may cause rendering issues." in console.
Highcharts.AST.allowedAttributes.push("viewBox");

// Set the default options for Highcharts, including the thousands separator for numbers.
Highcharts.setOptions({
    lang: {
        thousandsSep: ",",
    },
});

// Added this to hide foreach highchart console warning.
Highcharts.wrap(Highcharts, "each", function () {
    return function (...args) {
        Array.prototype.forEach.apply(args[0], Array.prototype.slice.call(args, 1));
    };
});

// Initialize the Highcharts modules to extend the functionality of Highcharts with additional chart types and features.
HighchartsMore(Highcharts);
HighchartsSunBurst(Highcharts);
HighchartsDrillDown(Highcharts);
Heatmap(Highcharts);
Streamgraph(Highcharts);
variablePie(Highcharts);
HighchartsBoost(Highcharts);
HighchartsTreemap(Highcharts);
HighchartsSankeyChart(Highcharts);
HighchartsAccessibilityModule(Highcharts);
HighchartsFunnel(Highcharts);

/**
 * HighchartsRenderer is a React component that renders a Highcharts chart based on the provided configuration.
 * It accepts three props: `highchartConfig`, which is the configuration object for the Highcharts chart; `chartKey`, which is a unique key for the chart (used for re-rendering); and `customContainerClassName`, which allows for custom styling of the chart container.
 * The component uses the `HighchartsReact` component from the `highcharts-react-official` package to render the chart, passing in the necessary props and container properties.
 * The default props and prop types are defined to ensure that the component receives the correct data and to provide default values for optional props.
 * @param {Object} props - The props for the HighchartsRenderer component.
 * @param {Object} props.highchartConfig - The configuration object for the Highcharts chart.
 * @param {string} [props.chartKey] - A unique key for the chart (used for re-rendering).
 * @param {string} [props.customContainerClassName] - A custom class name for styling the chart container.
 * @returns {JSX.Element} The rendered Highcharts chart.
 */
export default function HighchartsRenderer({ highchartConfig, chartKey, customContainerClassName }) {
    return (
        <HighchartsReact
            key={chartKey}
            highcharts={Highcharts}
            options={highchartConfig}
            containerProps={{
                className: customContainerClassName || "custom-scroll",
                style: { width: "100%", height: "100%" },
            }}
        />
    );
}

HighchartsRenderer.defaultProps = {
    chartKey: "default-chart-key",
    customContainerClassName: "custom-scroll",
};

HighchartsRenderer.propTypes = {
    highchartConfig: PropTypes.shape({
        chart: PropTypes.object,
        title: PropTypes.object,
        xAxis: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
        yAxis: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
        series: PropTypes.array.isRequired,
        credits: PropTypes.object,
        pane: PropTypes.object,
        legend: PropTypes.object,
        tooltip: PropTypes.object,
        plotOptions: PropTypes.object.isRequired,
    }).isRequired,
    chartKey: PropTypes.string,
    customContainerClassName: PropTypes.string,
};
