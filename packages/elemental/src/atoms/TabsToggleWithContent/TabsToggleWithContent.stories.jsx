import React from "react";
import TabsToggleWithContent from "./index";

export default {
    title: "atom/TabsToggleWithContent",
    component: TabsToggleWithContent,
    argTypes: {
        activeIndex: { control: "number" },
        phoenixLayout: { control: "boolean" },
        toggleCallback: { action: "toggleCallback" },
    },
};

const Template = (args) => <TabsToggleWithContent {...args} />;


export const Default = Template.bind({});

Default.args = {
    activeIndex: 0,
    phoenixLayout: false,
    tabData: [
        {
            id: 1,
            title: "Tab 1",
            icon: "icon-class-1",
            content: <div className="mt-15">Content for Tab 1</div>,
        },
        {
            id: 2,
            title: "Tab 2",
            icon: "icon-class-2",
            content: <div className="mt-15">Content for Tab 2</div>,
        },
        {
            id: 3,
            title: "Tab 3",
            icon: "icon-class-3",
            content: <div className="mt-15">Content for Tab 3</div>,
        },
    ],
    toggleCallback: (index) => {
        console.log("Tab toggled to index:", index);
    },
}

export const WithPhoenixLayout = Template.bind({});
WithPhoenixLayout.args = {
    ...Default.args,
    phoenixLayout: true,
};

// export const WithConfirmCallback = Template.bind({});
// WithConfirmCallback.args = {
//     activeIndex: 0,
//     phoenixLayout: false,
//     tabData: [
//         {
//             id: 1,
//             title: "Tab 1",
//             content: <div>Content for Tab 1</div>,
//         },
//         {
//             id: 2,
//             title: "Tab 2",
//             content: <div>Content for Tab 2</div>,
//             confirmCallback: ({ callback }) => {
//                 if (window.confirm("Are you sure you want to switch tabs?")) {
//                     callback();
//                 }
//             },
//         },
//     ],
// };