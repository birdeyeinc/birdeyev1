import React, { useState } from "react";
import InfoComponent from "./";

export default {
    title: "Component/InfoComponent",
    component: InfoComponent,
    tags: ["autodocs"]
};

const Template = (args) => <InfoComponent {...args} />;
export const Default = Template.bind({});
Default.args = {
    infoHTML: <span>These contacts will be automatically tagged with. You can filter contacts and run campaigns using this tag.</span>,
    showCrossIcon: true,
    closeInfo: () => { },
    customClassName: "light-blue-banner import-banner",
}
