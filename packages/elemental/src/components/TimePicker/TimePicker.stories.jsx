import React from "react";
import Component from ".";

export default {
    title: "Component/TimePicker",
    component: Component,
    tags: ["autodocs"],
};

const Template = (args) => <Component {...args} />;

export const Default = Template.bind({});
Default.args = {
    changeTime: () => { },
    timeObject: {
        hours: "01",
        minutes: "00",
        meridiem: "am"
    },
    timezoneLabel: "IST"
};