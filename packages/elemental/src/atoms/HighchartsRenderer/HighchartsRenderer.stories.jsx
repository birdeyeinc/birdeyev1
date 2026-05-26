import HighchartsRenderer from "./index";

export default {
    title: "Atom/HighchartsRenderer",
    component: HighchartsRenderer,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "Low-level Highcharts wrapper. **Do not override unless absolutely necessary.** For custom chart layouts use `components/GraphTable` or `components/GraphToolbarContainer`.",
            },
        },
    },
};

const Template = (args) => (
    <div style={{ height: 400 }}>
        <HighchartsRenderer {...args} />
    </div>
);

// ---------------------------------------------------------------------------
// Line Chart
// ---------------------------------------------------------------------------
export const LineChart = Template.bind({});
LineChart.storyName = "Line Chart";
LineChart.args = {
    chartKey: "line-chart",
    highchartConfig: {
        chart: { type: "line" },
        title: { text: "Monthly Average Temperature" },
        xAxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
        yAxis: { title: { text: "Temperature (°C)" } },
        plotOptions: { line: { dataLabels: { enabled: false } } },
        credits: { enabled: false },
        series: [
            { name: "Tokyo", data: [7, 6, 9, 14, 18, 22, 26, 25, 22, 17, 12, 8] },
            { name: "London", data: [4, 4, 7, 11, 14, 18, 20, 19, 15, 10, 6, 3] },
        ],
    },
};

// ---------------------------------------------------------------------------
// Bar Chart
// ---------------------------------------------------------------------------
export const BarChart = Template.bind({});
BarChart.storyName = "Bar Chart";
BarChart.args = {
    chartKey: "bar-chart",
    highchartConfig: {
        chart: { type: "bar" },
        title: { text: "Fruit Consumption" },
        xAxis: { categories: ["Apples", "Bananas", "Oranges"] },
        yAxis: { title: { text: "Amount" } },
        plotOptions: { bar: { dataLabels: { enabled: true } } },
        credits: { enabled: false },
        series: [
            { name: "Jane", data: [5, 3, 4] },
            { name: "John", data: [2, 2, 3] },
        ],
    },
};

// ---------------------------------------------------------------------------
// Pie Chart
// ---------------------------------------------------------------------------
export const PieChart = Template.bind({});
PieChart.storyName = "Pie Chart";
PieChart.args = {
    chartKey: "pie-chart",
    highchartConfig: {
        chart: { type: "pie" },
        title: { text: "Browser Market Share" },
        xAxis: {},
        yAxis: {},
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: { enabled: true, format: "<b>{point.name}</b>: {point.percentage:.1f} %" },
            },
        },
        credits: { enabled: false },
        series: [
            {
                name: "Share",
                data: [
                    { name: "Chrome", y: 64.0 },
                    { name: "Safari", y: 19.3 },
                    { name: "Firefox", y: 4.0 },
                    { name: "Edge", y: 3.8 },
                    { name: "Other", y: 8.9 },
                ],
            },
        ],
    },
};

// ---------------------------------------------------------------------------
// Column Chart
// ---------------------------------------------------------------------------
export const ColumnChart = Template.bind({});
ColumnChart.storyName = "Column Chart";
ColumnChart.args = {
    chartKey: "column-chart",
    highchartConfig: {
        chart: { type: "column" },
        title: { text: "Monthly Sales" },
        xAxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
        yAxis: { title: { text: "Units Sold" } },
        plotOptions: { column: { pointPadding: 0.2, borderWidth: 0 } },
        credits: { enabled: false },
        series: [
            { name: "Product A", data: [49, 71, 106, 129, 144, 176] },
            { name: "Product B", data: [83, 78, 98, 93, 106, 84] },
        ],
    },
};

// ---------------------------------------------------------------------------
// Custom Container Class
// ---------------------------------------------------------------------------
export const CustomContainerClass = Template.bind({});
CustomContainerClass.storyName = "Custom Container Class";
CustomContainerClass.args = {
    chartKey: "custom-class-chart",
    customContainerClassName: "my-custom-chart-container",
    highchartConfig: {
        chart: { type: "area" },
        title: { text: "Custom Container Class Applied" },
        xAxis: { categories: ["Q1", "Q2", "Q3", "Q4"] },
        yAxis: { title: { text: "Revenue ($K)" } },
        plotOptions: { area: { fillOpacity: 0.5 } },
        credits: { enabled: false },
        series: [{ name: "Revenue", data: [120, 180, 210, 310] }],
    },
};
