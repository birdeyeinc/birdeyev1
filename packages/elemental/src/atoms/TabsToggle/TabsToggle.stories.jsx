import React from 'react';
import Component from '.';

export default {
    title: 'Atom/TabsToggle',
    component: Component,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
      },
};

const Template = (args) => <div style={{width:"fit-content"}}><Component {...args} /></div>;


export const Default = Template.bind({});
Default.args = {
    tabsArray: ["Home", "About", "Setting"],
    onTabSelect: (tab)=>{alert(tab)},
    selected: "About"
};