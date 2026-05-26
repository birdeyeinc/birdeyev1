import React from 'react';
import RailNav from '.';
import { L4MenuComponent } from './SecondSideRailNav/view';

export default {
    title: 'Component/RailNav',
    component: RailNav,
    argTypes: {
        breakpoint: {
            control: { type: "radio" },
            options: [800, 1200],
            description: "Breakpoint for responsive behavior",
            defaultValue: 800,
        },
    },
};

const Template = (args) => <RailNav {...args} />;

export const Default = Template.bind({});
Default.args = {
    staticMenuOptions: [
        { caption: "Created by me", children: [{ caption: "File 1" }, { caption: "File 2" }], href: "#" },
        { caption: "Shared with me", children: [{ caption: "File A" }, { caption: "File B" }], href: "#" },
        { caption: "Reports", hideOnEmptySearch: true, isSeparator: true },
        { caption: "Reviews", children: [{ caption: "Review 1" }, { caption: "Review 2" }], isProduct: true },
        { caption: "Inbox", children: [{ caption: "Message 1" }, { caption: "Message 2" }], isProduct: true },
        { caption: "Listings", children: [{ caption: "Listing 1" }, { caption: "Listing 2" }], isProduct: true },
        { caption: "Social", children: [{ caption: "Post 1" }, { caption: "Post 2" }], isProduct: true },
        { caption: "Surveys", children: [{ caption: "Survey 1" }, { caption: "Survey 2" }], isProduct: true },
        { caption: "Campaigns", children: [{ caption: "Campaign 1" }, { caption: "Campaign 2" }], isProduct: true },
        { caption: "Ticketing", children: [{ caption: "Ticket 1" }, { caption: "Ticket 2" }], id: "ticketing" },
        { caption: "Contacts", children: [{ caption: "Contact 1" }, { caption: "Contact 2" }], isProduct: true },
    ],
    dyanmicMenuDataAvailable: true,
    searchTerm: "",
    handleSelectedOption: (option) => console.log("Selected Option:", option),
    selectedOption: {
        selectedParent: 0,
        selectedSubOption: 0,
        selectedSubSubOption: null,
        hoverParent: 1,
        hoverSubOption: null,
    },
    updateSubSubOptions: (options) => console.log("Updated SubSubOptions:", options),
    subSubOptions: {
        children: null,
        index: null,
        parentIndex: 1,
        top: "50px",
        left: "100px",
        height: "200px",
    },
    handleSearchInStaticMenuChildren: (term) => console.log("Search Term:", term),
    isSearchFoundInStaticMenuChildren: false,
    onNavItemClick: (item) => console.log("Nav Item Clicked:", item),
    dispatch: (action) => console.log("Dispatched Action:", action),
    moduleName: "enterprise-report",
    ctaButtonShow: true,
    ctaButtonType: "small",
    ctaButtonCallback: () => console.log("CTA Button Clicked"),
    ctaButtonCaption: "Dashboards",
    allowRenavigation: false,
    onContextMenuClick: (event) => console.log("Context Menu Clicked:", event),
    accordionState: {},
    closeAccordionHandler: () => console.log("Accordion Closed"),
    searchPlaceholder: "Search...",
    onSearchDynamicMenu: (term) => console.log("Dynamic Menu Search Term:", term),
    getSocialEngageCount: () => console.log("Fetching Social Engage Count"),
    leftMenuCollapseByButton: () => console.log("Left Menu Collapsed"),
    showSearchFilter: true,
    customClassName: "custom-railnav-class",
    customOptionsCount: { option1: 10, option2: 20 },
    ctaButtonConfig: {
        type: "primary",
        label: "CTA Button",
        icon: "icon-class",
        callback: () => console.log("CTA Button Config Clicked"),
    },
    activeIndex: "1",
    localChangesPresent: false,
    customOptionsCountByIdentifier: true,
    dynamicAppleReportData: { report1: "data1", report2: "data2" },
    savedFilterList: [{ id: 1, name: "Filter 1" }, { id: 2, name: "Filter 2" }],
    module: "module-name",
    contextMenueCallback: (event) => console.log("Context Menu Callback Triggered", event),
    connectSocialButton: true,
    bulkScheduleStatus: "active",
    bulkSchedulngPermission: true,
    hideSubTitle: false,
    preventDefaultSubOptionClose: false,
    showSocialFreeTrialBadge: false,
    isLoading: false,
    title: "RailNav Title",
    autoHide: true,
    disabled: false,
    whiteLabelReseller: false,
    customHeader: "Custom Header",
    renderSaveFilterModal: () => console.log("Render Save Filter Modal"),
    externalUpdateNewSavedFilter: () => console.log("External Update New Saved Filter"),
    externalDeleteNEWSavedFilter: () => console.log("External Delete New Saved Filter"),
    renderSocialFreeTrialBadge: () => console.log("Render Social Free Trial Badge"),
    setLeftNavigationL2: () => console.log("Set Left Navigation L2"),
    isResller: false,
    isHolidayThemeEnabled: () => console.log("Holiday Theme Enabled"),
    loaderType: "spinner",
    breakpoint: 800,
};

export const L4Menu = () => {
    const SecondSideRailNavProps = {
    staticMenuOptions: [
        { caption: "Created by me", children: [{ caption: "File 1" }, { caption: "File 2" }], href: "#" },
        { caption: "Shared with me", children: [{ caption: "File A" }, { caption: "File B" }], href: "#" },
        { caption: "Reports", hideOnEmptySearch: true, isSeparator: true },
        { caption: "Reviews", children: [{ caption: "Review 1" }, { caption: "Review 2" }], isProduct: true },
        { caption: "Inbox", children: [{ caption: "Message 1" }, { caption: "Message 2" }], isProduct: true },
        { caption: "Listings", children: [{ caption: "Listing 1" }, { caption: "Listing 2" }], isProduct: true },
        { caption: "Social", children: [{ caption: "Post 1" }, { caption: "Post 2" }], isProduct: true },
        { caption: "Surveys", children: [{ caption: "Survey 1" }, { caption: "Survey 2" }], isProduct: true },
        { caption: "Campaigns", children: [{ caption: "Campaign 1" }, { caption: "Campaign 2" }], isProduct: true },
        { caption: "Ticketing", children: [{ caption: "Ticket 1" }, { caption: "Ticket 2" }], id: "ticketing" },
        { caption: "Contacts", children: [{ caption: "Contact 1" }, { caption: "Contact 2" }], isProduct: true },
    ],
    dyanmicMenuDataAvailable: true,
    searchTerm: "",
    handleSelectedOption: (option) => console.log("Selected Option:", option),
    selectedOption: {
        selectedParent: 0,
        selectedSubOption: 0,
        selectedSubSubOption: null,
        hoverParent: 1,
        hoverSubOption: null,
    },
    updateSubSubOptions: (options) => console.log("Updated SubSubOptions:", options),
    subSubOptions: {
        children: null,
        index: null,
        parentIndex: 1,
        top: "50px",
        left: "100px",
        height: "200px",
    },
    handleSearchInStaticMenuChildren: (term) => console.log("Search Term:", term),
    isSearchFoundInStaticMenuChildren: false,
    onNavItemClick: (item) => console.log("Nav Item Clicked:", item),
    dispatch: (action) => console.log("Dispatched Action:", action),
    moduleName: "enterprise-report",
    ctaButtonShow: true,
    ctaButtonType: "small",
    ctaButtonCallback: () => console.log("CTA Button Clicked"),
    ctaButtonCaption: "Dashboards",
    allowRenavigation: false,
    onContextMenuClick: (event) => console.log("Context Menu Clicked:", event),
    accordionState: {},
    closeAccordionHandler: () => console.log("Accordion Closed"),
    searchPlaceholder: "Search...",
    onSearchDynamicMenu: (term) => console.log("Dynamic Menu Search Term:", term),
    getSocialEngageCount: () => console.log("Fetching Social Engage Count"),
    leftMenuCollapseByButton: () => console.log("Left Menu Collapsed"),
    showSearchFilter: true,
    customClassName: "custom-railnav-class",
    customOptionsCount: { option1: 10, option2: 20 },
    ctaButtonConfig: {
        type: "primary",
        label: "CTA Button",
        icon: "icon-class",
        callback: () => console.log("CTA Button Config Clicked"),
    },
    activeIndex: "1",
    localChangesPresent: false,
    customOptionsCountByIdentifier: true,
    dynamicAppleReportData: { report1: "data1", report2: "data2" },
    savedFilterList: [{ id: 1, name: "Filter 1" }, { id: 2, name: "Filter 2" }],
    module: "module-name",
    contextMenueCallback: (event) => console.log("Context Menu Callback Triggered", event),
    connectSocialButton: true,
    bulkScheduleStatus: "active",
    bulkSchedulngPermission: true,
    hideSubTitle: false,
    preventDefaultSubOptionClose: false,
    showSocialFreeTrialBadge: false,
    isLoading: false,
    title: "RailNav Title",
    autoHide: true,
    disabled: false,
    whiteLabelReseller: false,
    customHeader: "Custom Header",
    renderSaveFilterModal: () => console.log("Render Save Filter Modal"),
    externalUpdateNewSavedFilter: () => console.log("External Update New Saved Filter"),
    externalDeleteNEWSavedFilter: () => console.log("External Delete New Saved Filter"),
    renderSocialFreeTrialBadge: () => console.log("Render Social Free Trial Badge"),
    setLeftNavigationL2: () => console.log("Set Left Navigation L2"),
    isResller: false,
    isHolidayThemeEnabled: () => console.log("Holiday Theme Enabled"),
    loaderType: "spinner",
};
        return(

                <div>
                    <div>
                        {/* <RailNav {...SecondSideRailNavProps} /> */}
                    </div>
                    <div>
                        <L4MenuComponent
                            //pathName={"/dashboard/analytics-dash/reports/reviews/reviews-and-rating/overview"}
                            // clickTab={clickTab}
                            // activeTab={activeContainer}
                            // content={tabContent}
                            // showMore
                         />
                    </div>
                </div> 
            
            )
}