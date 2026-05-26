import React from "react";
import Component from "./index";

export default {
  title: "Atom/SearchFilter",
  component: Component,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    resetSearch: { control: "boolean" },
    resetSearchVal: { control: "boolean" },
    inputMode: { control: "boolean" },
    placeholder: { control: "text" },
    onCrossClickAction: { action: "crossClick" },
    onInputValueChange: { action: "inputChange" },
    customStyle: { control: "object" },
    debounceDelay: { control: "number" },
    searchStr: { control: "text" },
    customClass: { control: "text" },
    searchTooltipText: { control: "text" },
    customTooltipCls: { control: "text" },
    hideSearchIcon: {
      description: "Hide the `reset / cross` icon inside the input.",
      type: { name: "boolean" },
    },
    hideGlassIcon: { control: "boolean" },
    autoFocus: { control: "boolean" },
    disableAutoFocusOnUpdate: { control: "boolean" },
    disableAutoFocusOnMount: { control: "boolean" },
    onBlur: { action: "blur" },
    onKeyDown: { action: "keyDown" },
    onFocus: { action: "focus" },
    id: { control: "text" },
    label: { control: "text" },
    xLargeHeight: {
      control: "boolean",
      description: "Enable large height for the search input.",
      type: { name: "boolean" },
    },
    showCloseIconForEmptyValue: { control: "boolean" },
    displayError: { control: "boolean" },
    errorMessage: { control: "text" },
    maxLength: {
      control: "number",
      description: "Maximum length allowed for the search input.",
      type: { name: "number" },
    },
    multipleSearch: { control: "boolean" },
    getSearchKeywords: { action: "getSearchKeywords" },
    showErrorOutside: {
      control: "boolean",
      description: "large search filter",
    },
    showLoadingInput: { control: "boolean" },
    onClickOutside: { action: "clickOutside" },
  },
};

const Template = (args) => <Component {...args} />;

export const Default = Template.bind({});

Default.args = {};

export const ErrorState = Template.bind({});

ErrorState.args = {
  displayError: true,
  errorMessage: "Error Message will be here...",
};

export const LargeVariant = Template.bind({});

LargeVariant.args = {
  xLargeHeight: true,
};
