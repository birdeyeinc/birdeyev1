import GraphTable from "./";
import { REPORTS_CONFIG } from "./visualisations/charts/extensions/areaspline/areaspline.config";
import { reportdata } from "./visualisations/charts/extensions/column/column.config";
import { barReportConfig } from "./visualisations/charts/extensions/bar/bar.config";
import { groupedColumnReportData } from "./visualisations/charts/extensions/column-grouped/column.config";
import { splineReportdata } from "./visualisations/charts/extensions/spline/spline.config";
import { tableReportData } from "./visualisations/Table/table.config";
import { wordCloudReportConfig } from "./visualisations/charts/extensions/wordcloud/word.cloud.config";
import { splineDottedConfig } from "./visualisations/charts/extensions/spline/spline.dotted.config";
import { pieConfig } from "./visualisations/charts/extensions/pie/pie.config";
import { normalHeatmapReportConfig } from "./visualisations/charts/extensions/heatmap/config/heatmap.config";
import { scrollableHeatmapReportConfig } from "./visualisations/charts/extensions/heatmap/config/scrollableHeatmap.config";
import { packedBubbleReportConfig } from "./visualisations/charts/extensions/packedbubble/packedbubble.config";
import { columnLineCombined } from "./visualisations/charts/extensions/column/column-line-combined.config";
import { columnGroupedLine } from "./visualisations/charts/extensions/column/column-grouped-line.config";
import { variablePieConfig } from "./visualisations/charts/extensions/variablepie/variablepie.config";
import { sunBurstChartConfig } from "./visualisations/charts/extensions/sunburst/sunburst.config";
import { sankeyChartConfig } from "./visualisations/charts/extensions/sankey/sankey.config";
import { quadrantChartConfig } from "./visualisations/charts/extensions/quadrant/quadrant.config";
import { treemapReportConfig } from "./visualisations/charts/extensions/treemap/treemap.config";


export default {
    title: "Component/GraphTable",
    component: GraphTable,
    parameters: {
        layout: "centered",
    },
};

const Template = (args) => <GraphTable {...args} />;

const ScrollableHeatmapTemplate = (args) => (
    <div style={{ width: "1000px" }}>
        <GraphTable {...args} />
    </div>
);

export const AreaSpline = Template.bind({});
export const Bar = Template.bind({});
export const Column = Template.bind({});
export const ColumnLineCombined = Template.bind({});
export const GroupedColumn = Template.bind({});
export const ColumnGroupedLine = Template.bind({});
export const Spline = Template.bind({});
export const Table = Template.bind({});
export const WordCloud = Template.bind({});
export const SplineDotted = Template.bind({});
export const Pie = Template.bind({});
export const Heatmap = Template.bind({}); //Normal Heatmap
export const ScrollableHeatmap = ScrollableHeatmapTemplate.bind({}); //Heatmap with custom horizontal and vertical scrollbars
export const Packedbubble = Template.bind({});
export const VariablePie = Template.bind({});
export const TreeMap = Template.bind({});

VariablePie.args = {
    reportConfig: variablePieConfig
};
export const Sunburst = Template.bind({});
export const Sankey = Template.bind({});
export const Quadrant = Template.bind({});

SplineDotted.args = {
    reportConfig: splineDottedConfig,
};

Pie.args = {
    reportConfig: pieConfig,
};

AreaSpline.args = {
    reportConfig: REPORTS_CONFIG,
};

Bar.args = {
    reportConfig: barReportConfig,
};

Column.args = {
    reportConfig: reportdata,
};

ColumnLineCombined.args = {
    reportConfig: columnLineCombined,
};

GroupedColumn.args = {
    reportConfig: groupedColumnReportData,
};

ColumnGroupedLine.args = {
    reportConfig: columnGroupedLine,
};

Spline.args = {
    reportConfig: splineReportdata,
};

Table.args = {
    reportConfig: tableReportData.reportData,
};

WordCloud.args = {
    reportConfig: wordCloudReportConfig,
};

Heatmap.args = {
    reportConfig: normalHeatmapReportConfig,
};

ScrollableHeatmap.args = {
    reportConfig: scrollableHeatmapReportConfig,
};

Packedbubble.args = {
    reportConfig: packedBubbleReportConfig,
};

Sunburst.args = {
    reportConfig: sunBurstChartConfig,
};

Sankey.args = {
    reportConfig: sankeyChartConfig
};

Quadrant.args = {
    reportConfig: quadrantChartConfig
};

TreeMap.args = {
    reportConfig: treemapReportConfig,
};

