import React from 'react';
import RailNavHamburger from './';

export default {
    title: 'Atom/RailNavHamburger',
    component: RailNavHamburger
};

const Template = (args) => <RailNavHamburger {...args} />;

export const Default = Template.bind({});
Default.args = {
    top: 10,
    left: 10,
    breakpoint: 800
};