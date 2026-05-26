import React from 'react';
import Component from '.';

export default {
    title: 'Atom/RatingStar',
    component: Component,
    tags: ["autodocs"]
};

const Template = (args) => <Component {...args} />;


export const Default = Template.bind({});
Default.args = {
    rating: 3,
    ratingClass: "bew-avgstars"
};

export const Default2 = Template.bind({})
Default2.args = {
    backgroundObject:{"backgroundColor":"black", "height":"15px", "width": "30%"},
    starCssON:{"color":"yellow"},
    starCssOFF:{"color": "#7fb8f0"},
    rating: 3.5
}

export const RatingStarWithBinaryMode = Template.bind({});
RatingStarWithBinaryMode.args = {
    rating: 1,
    binaryStarMode: true,
    starCssON: {"color": "#FFD700"}
};