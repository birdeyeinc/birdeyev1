import TabHeaderComponent from './index';

export default {
  title: "Atom/TabHeader",
  component: TabHeaderComponent,
  tags: ["autodocs"],
};

export const TabHeader = {
    args:{
        content: [
            {
                "label": "Links",
                "value": 1,
                count: 4,
                countStyle: "count-badge--gray",
                activeCountStyle: "count-badge--blue",
                displayErrorIcon: true
            },
            {
                "label": "Customization",
                "value": 2,
                count: 8,
                countStyle: "count-badge--gray",
                activeCountStyle: "count-badge--blue"
            }
        ],
        activeTab: 1,
        changeActiveTab: (args)=>console.log(args)
    }
};
