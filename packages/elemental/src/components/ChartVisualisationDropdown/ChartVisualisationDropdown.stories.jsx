import React from 'react';
import ChartVisualisationDropdown from '.';
import verticalBarChart from "assets/images/common/vertical_bar.svg";
import radialChart from "assets/images/common/Radial-chart.svg";
import horizontalBarChart from "assets/images/common/horizontal_bar.svg";

export default {
    title: 'Component/ChartVisualisationDropdown',
    component: ChartVisualisationDropdown,
    tags: ["autodocs"]
};

const visualisationOptions = [
    { label: "Radial chart", img : radialChart , value: "RADIAL_CHART", enable: true },
    { label: "Vertical bar chart", img : verticalBarChart , value: "VERTICAL_BAR_CHART", enable: true },
    { label: "Horizontal bar chart", img :horizontalBarChart , value: "HORIZONTAL_BAR_CHART", enable: true },
];

const Template = (args) => <ChartVisualisationDropdown {...args} />;


export const Default = Template.bind({});
Default.args = {
    visualisationOptions,
    updateChartVisualisationInParent: ()=>{},
    defaultSelVisualisation: { label: "Vertical bar chart", img : verticalBarChart , value: "VERTICAL_BAR_CHART", enable: true },
};