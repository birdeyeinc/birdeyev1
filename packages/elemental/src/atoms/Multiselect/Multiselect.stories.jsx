import React from "react";
import Component from ".";

export default {
  title: "Atom/MultiSelect",
  component: Component,
  tags: ["autodocs"],
  argTypes: {
    selected: {
      control: "array",
      description: "The array of selected values.",
    },
    selectAll: {
      control: "boolean"
    },
    emptyPlaceholder: {
      control: "text",
      description:
        'if we are passing value as "none" and noDefaultSelection as false then we get "None" placeholder when we have 0 selected items',
    },
    allSelectedPlaceholder: {
      control: "text",
      description: "Placeholder text for select all option, default is 'Select all'",
    },
    onBlur: {
      control: "function",
      description: "Callback triggered on toggle dropdown, reset to default and Apply changes cta.",
    },
    options: {
      control: "object", // You can use 'array' or 'object' depending on your actual use case
      description: "The list of options for the multiselect.",
    },
    sortSelected: {
      control: "boolean",
      description: "Sort the selected items if 'ctaButtonsEnabled' is enable.",
    },
    enableSelectNone: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
      description: "Disables the multiselect.",
    },
    label: {
      control: "text",
      description: "Label for the multiselect.",
    },
    showSearch: {
      control: "boolean",
      description: "Whether to show a search input.",
    },
    searchPlaceHolder: {
      control: "text",
      description: "Placeholder text for the search input.",
    },
    levelSearch: {
      control: "boolean",
    },
    tooltip: {
      control: "object", // dont know 
    },
    tooltipAction: {
      control: "object", // dont know
    },
    customLinks: {
      control: "object", // dont know
    },
    customPlaceHolderSelectionText: {
      control: "boolean",
      description: "if we want to show text like '2 out of 7 options included for this question'",
    },
    ctaButtonsEnabled: {
      control: "boolean",
      description: "It will enable/show Apply or cta buttons.",
    },
    size: {
      control: "text",
      description: "Size of the multiselect.",
    },
    selectedLabel: {
      control: "text",
      description: "Label displayed when items are selected.",
    },
    parentNode: {
      control: "node",
      description: "Parent node for the multiselect.",
    },
    fixedDropdown: {
      control: "boolean",
      description: "Whether the dropdown is fixed in position. it will require 'appendElementToScroll' function also.",
    },
    name: {
      control: "boolean",
      description: "Whether the component has a name attribute.",
    },
    isLocationsAvailable: {
      control: "boolean",
      description: "Whether location options are available.",
    },
    key: {
      control: "text",
      description: "Key used for identifying the multiselect.",
    },
    appendElementToScroll: {
      control: "function",
      description: "Callback to append elements to scroll. it will be used if 'fixedDropdown' is enable.",
    },
    parentId: {
      control: "node",
      description: "Parent ID for the multiselect.",
    },
    isResetAllowed: {
      control: "boolean",
      description: "It will show selected items in blue color.",
    },
    validationTrigger: {
      control: "text",
      description: "Trigger for validation.",
    },
    _attachToFormWrapper: {
      control: "function",
    },
    _detachFromFormWrapper: {
      control: "function",
    },
    _fieldValidator: {
      control: "function",
    },
    _renderValidationErrors: {
      control: "function",
    },
    hasTooltip: {
      control: "boolean",
    },
    showSelecteAll: {
      control: "boolean",
      description: 'Whether to show the "Select All" option.',
    },
    andSeperator: {
      control: "boolean",
      description: 'Whether to display an "and" separator.',
    },
    orSeperator: {
      control: "boolean",
      description: 'Whether to display an "or" separator.',
    },
    selectionLimit: {
      control: "number",
      description: "Limit on the number of selections.",
    },
    supportMultipleList: {
      control: "boolean",
    },
    listKeys: {
      control: "array",
      description: "List of keys for the options.", // dont know
    },
    openCallback: {
      control: "function",
      description: "Callback triggered when the dropdown opens.",
    },
    delayClickOutside: {
      control: "object",
      description: "Delay settings for clicking outside the dropdown.",
    },
    selectedAliasPlaceholder: {
      control: "text",
    },
    closeCallback: {
      control: "function",
      description: "Callback triggered when the dropdown closes.",
    },
    extendWidth: {
      control: "boolean",
    },
    customInfoJsx: {
      control: "node",
    },
    noDefaultSelection: {
      control: "boolean",
      description: "Whether there is no default selection.",
    },
    showSelectAllDisplayLabel: {
      control: "boolean",
      description: "Whether to show the display label for Select All and it will show 'All selected'.",
    },
    customSelectedVal: {
      control: "text",
      description: "Custom value for selected items. It will only work with inline mode.",
    },
    inlineMode: {
      control: "boolean",
    },
    customSize: {
      control: 'select',
      options: ['small', 'medium', 'large', 'x-large', 'xx-large', 'xxx-large'],
      description: "Custom size for the multiselect. It will not work with inlineMode.",
    },
    hideLabelInDropDownOptions: {
      control: "boolean",
    },
    position: {
      control: "text",
    },
    filterLabelTooltipInfo: {
      control: "object",
      description: "Tooltip information for filtered labels.",
    },
    hidePlaceholder: {
      control: "boolean",
    },
    top: {
      control: "boolean",
    },
    showTooltipOutside: {
      control: "boolean",
    },
    customClassName: {
      control: "text",
      description: "Custom CSS class name.",
    },
    removeNoSelectedClass: {
      control: "boolean",
    },
    id: {
      control: "text",
      description: "ID for the multiselect.",
    },
    showPhoenixTooltip: {
      control: "boolean",
    },
    supportCustomAddEventHandler: {
      control: "boolean",
    },
    hideGroupCheckbox: {
      control: "boolean",
    },
    showConcisePlaceholder: {
      control: "boolean",
    },
    allSelectedCustomPlaceholder: {
      control: "text",
    },
    disabledText: {
      control: "text",
    },
    disabledTextClass: {
      control: "text",
    },
    canOptionsInvalid: {
      control: "boolean",
    },
    fullWidth: {
      control: "boolean",
    },
    multipleSearch: {
      control: "boolean",
    },
    searchStr: {
      control: "text",
    },
    getSearchKeywords: {
      control: "function",
    },
    labelWithIcon: {
      control: "boolean",
    },
    keywordText: {
      control: "text",
    },
    toggleDivId: {
      control: "text",
    },
    removeLabelTextTransform: {
      control: "boolean",
    },
    freezeOptions: {
      control: "boolean",
    },
    ctaButtonCustomText: {
      control: "text",
    },
    scrollIntoView: {
      control: "boolean",
    },
    ellipsis: {
      control: "text",
    },
    resetValue: {
      control: "array", // Can be 'array' or 'boolean'
    },
    labelExactMatch: {
      control: "boolean",
    },
    customWidthClass: {
      control: "text",
    },
    customClearTip: {
      control: "text",
    },
    hideSelectAllOption: {
      control: "boolean",
    },
    triggerBlurOnAllDiselect: {
      control: "boolean",
    },
    disableSelectAllOption: {
      control: "boolean",
    },
    openDropDownOnHover: {
      control: "boolean",
    },
    isLoading: {
      control: "boolean",
    },
    iconMode: {
      control: "boolean",
    },
    placeholderWithSelectionLimit: {
      control: "text",
    },
    disabledCheckboxTooltip: {
      control: "text",
    },
    isExternalSourceWithTemplates: {
      control: "boolean",
      description: "Whether the source is Yelp and templates are being rendered.",
    },
  },
};

const options = [
  {
    label: "Email",
    value: "email",
    customJSX: <div style={{ fontSize: "12px", color: "#555"}}>Send via email</div>,
  },
  {
    label: "Text",
    value: "sms",
    customJSX: <div style={{ fontSize: "12px", color: "#555"}}>Send via text message</div>,

  },
  {
    label: "Survey link",
    value: "link",
    customJSX: <div style={{ fontSize: "12px", color: "#555"}}>Generate a survey link</div>,

  },
  {
    label: "Embedded",
    value: "embed",
  },
  {
    label: "Preview",
    value: "preview",
  },
  {
    label: "EmojiPreview",
    value: "preview 😀",
    hasEmojis: true, 
  },
];

const Template = (args) => <Component {...args} />;

export const Default = Template.bind({});
Default.args = {
  selected: [],
  onBlur: () => {},
  placeholder: "Select category",
  label: "Select category",
  options,
};

export const HiddenSelectAllOption = Template.bind({});
HiddenSelectAllOption.args = {
  ...Default.args,
  showSelecteAll: false,
};

export const HiddenSearchBar = Template.bind({});
HiddenSearchBar.args = {
  ...Default.args,
  showSearch: false,
};

export const YelpTemplatesMode = Template.bind({});
YelpTemplatesMode.args = {
  ...Default.args,
  isExternalSourceWithTemplates: true,
};


export const WithSelectLimitAndDifferentPlaceholders = Template.bind({});

WithSelectLimitAndDifferentPlaceholders.args = {
  extendLeft: true,
  placeholder: "Select category",
  label: "Select category",
  emptyPlaceholder: "none",
  selectedAliasPlaceholder: "LISTING_CATEGORIES",
  name: "facebookCategory",
  showSelectAllDisplayLabel: true,
  selected: [],
  displayName: "MultiSelect",
  options: [
    {
      label: "Interest",
      value: "1500",
    },
    {
      label: "Literary Arts",
      value: "856055631167537",
    },
    {
      label: "Performance Art",
      value: "756092301147942",
    },
    {
      label: "Performing Arts",
      value: "1758092431143387",
    },
    {
      label: "Science",
      value: "2900",
    },
    {
      label: "Sports",
      value: "964585346994407",
    },
    {
      label: "Visual Arts",
      value: "1080612391976317",
    },
    {
      label: "Feed for Workplace",
      value: "160648811266809",
    },
  ],
  required: true,
  sortSelected: true,
  showSearch: true,
  noDefaultSelection: false,
  selectionLimit: 3,
  searchPlaceHolder: "Search placeholder",
};
