import React from 'react';
import Component from '.';

export default {
    title: 'Atom/LoadingShimmer',
    component: Component,
    tags: ["autodocs"]
};

const Template = (args) => <Component {...args} />;

export const Default = Template.bind({});

export const DifferentWidths = Template.bind({});

DifferentWidths.args = {
    shimmerCount: [
        { height: "small-height", width: "xxxs-width" },
        { height: "small-height", width: "small-width" },
        { height: "small-height", width: "large" },
        { height: "small-height", width: "full-width" },
    ],
    displayCount: 1
}

export const DifferentHeights = Template.bind({});

DifferentHeights.args = {
    shimmerCount: [
        { height: "extra-sm-height", width: "full-width" },
        { height: "xxxs-height", width: "full-width" },
        { height: "small-height", width: "full-width" },
        { height: "medium-height", width: "full-width" },
        { height: "large-height", width: "full-width" },
        { height: "review-translating", width: "full-width" },
        { height: "carousel-height", width: "full-width" },
        { height: "full-height", width: "full-width" },
    ],
    displayCount: 1
}

export const RepeatNoOfTimes = Template.bind({});

RepeatNoOfTimes.args = {
    shimmerCount: [
        { height: "small-height", width: "small-width" },
        { height: "small-height", width: "xxxs-width" },
        { height: "small-height", width: "large" },
    ],
    displayCount: 3
}