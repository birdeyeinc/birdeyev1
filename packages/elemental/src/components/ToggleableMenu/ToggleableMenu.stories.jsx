
import React from 'react';
import ToggleableMenu from './';

export default {
    title: 'Component/ToggleableMenu',
    component: ToggleableMenu,
    tags: ["autodocs"],
};

const Template = (args) => <ToggleableMenu {...args} />;

export const Default = Template.bind({});
Default.args = {
    menuArray: [
        {
            title: {
                text: "Section 1",
                infoTooltip: {
                    type: "white",
                    tooltipHtml: "This is section 1 help text",
                    size: "medium"
                }
            },
            content: <div>Content for section 1</div>,
            subTitle: "This is a subtitle for section 1",
            learnMore: "https://example.com",
            ctaBtn: [
                {
                    type: "primary",
                    text: "Action",
                    onClickAction: () => alert("CTA clicked!")
                }
            ]
        },
        {
            title: {
                text: "Section 2"
            },
            content: <div>Content for section 2</div>
        }
    ]
};
