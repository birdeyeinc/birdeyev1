import React from "react";
import SentimentScore from "./index";

export default {
    title: "Component/SentimentScore",
    component: SentimentScore,
    parameters: {
        layout: 'centered',
    },
};

const Template = (args) => <SentimentScore {...args} />;

export const Default = Template.bind({});
Default.args = {
    score: 8,
    size: "large",
};