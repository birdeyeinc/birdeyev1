import React from "react";
import NoData from "./index";
import noDataImg from "assets/images/search.svg";

export default {
    title: "Component/NoData",
    component: NoData,
    parameters: {
        layout: "centered",
    },
};

const Template = (args) => <NoData {...args} />;

export const Default = Template.bind({});

Default.args = {
    pageHeading: "No Data Found (Page Heading)",
    customClassName: 'no-data-wrap',
    title: "Default No Data (Title)",
    imageUrl: "https://via.placeholder.com/150",
    subtitle: "Default No Data (Subtitle)",
    ctaHTML: <button>Default No Data (CTA)</button>
};
export const NoDataAsCustomHTML = Template.bind({});
NoDataAsCustomHTML.args = {
    customImageHtml: <div>
        <h1>Custom HTML No Data (Image)</h1>
        <img src="https://via.placeholder.com/150" />
    </div>,
};
export const NoDataArchiveState = Template.bind({});
NoDataArchiveState.args = {
    pageHeading: "No Data Found (Archive, Page Heading)",
    isArchive: true
};
export const NoDataAsSimpleVariant = Template.bind({});
NoDataAsSimpleVariant.args = {
    variant: "simple",
    imageUrl: noDataImg,
    title: "This is a title",
    subtitle: "This is a subtitle",
    className: "nodata"
};