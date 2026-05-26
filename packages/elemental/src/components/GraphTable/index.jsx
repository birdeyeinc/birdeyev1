import React from "react";
import { object } from "prop-types";
import TableContainer from "./visualisations/Table";
import Charts from "./visualisations/charts";
import ScrollableHeatmap from "./visualisations/ScrollableHeatmap";
import ReportChart from "./visualisations/custom";
import ReportTable from "./visualisations/ReportTable";

const GraphTable = ({ reportConfig, copilotChart, addToDashboardCallback }) => {
    // console.log("reportConfig in GraphTable:", reportConfig);
    const { visualisationType = "chart" } = reportConfig || {};

    switch (copilotChart || visualisationType) {
        case "chart":
            return <Charts key={reportConfig.graphId} reportConfig={reportConfig} />;
        case "Table":
            return <TableContainer reportConfig={reportConfig} />;
        case "custom-scrollable-heatmap":
            return <ScrollableHeatmap reportConfig={reportConfig} />;
        case "copilot-chart":
            return <ReportChart addToDashboardCallback={addToDashboardCallback} reportConfig={reportConfig} />;
        case "copilot-table":
            return <ReportTable reportConfig={reportConfig} />
        default:
            return null;
    }
};

GraphTable.propTypes = {
    reportConfig: object.isRequired,
};

export default GraphTable;
