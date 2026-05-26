import React from "react";
import CountryPhoneInput from "./index";

export default {
  title: "Component/CountryPhoneInput",
  component: CountryPhoneInput,
  tags: ["autodocs"],
};

const Template = (args) => <CountryPhoneInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  countryProps: {
    "countryInputName": "country",
    "displayCountryLabel": "Select",
    "countryInputPlaceholder": "Select country",
    "isCountryDisabled": false,
    "isCountryRequired": true,
    "countryOptions": [
      {
        "label": "US - United States   +1",
        "value": "US",
        "noTitle": true
      },
      {
        "label": "CA - Canada   +1",
        "value": "CA",
        "noTitle": true
      },
      {
        "label": "AU - Australia   +61",
        "value": "AU",
        "noTitle": true
      },
      {
        "label": "CN - China   +86",
        "value": "CN",
        "noTitle": true
      },
      {
        "label": "FR - France   +33",
        "value": "FR",
        "noTitle": true
      },
      {
        "label": "IN - India   +91",
        "value": "IN",
        "noTitle": true
      },
      {
        "label": "IT - Italy   +39",
        "value": "IT",
        "noTitle": true
      },
      {
        "label": "MX - Mexico   +52",
        "value": "MX",
        "noTitle": true
      },
      {
        "label": "NZ - New Zealand   +64",
        "value": "NZ",
        "noTitle": true
      },
      {
        "label": "PR - Puerto Rico   +1",
        "value": "PR",
        "noTitle": true
      },
      {
        "label": "TW - Taiwan   +886",
        "value": "TW",
        "noTitle": true
      },
      {
        "label": "UK - United Kingdom   +44",
        "value": "UK",
        "noTitle": true
      },
      {
        "label": "VI - Virgin Islands   +1",
        "value": "VI",
        "noTitle": true
      }
    ],
    "countryCustomVal": "+ 1",
    "selectedCountryCode": "US"
  },
  phoneInputProps: {
    "phoneInputName": "customerPhone",
    "phoneInputPlaceholder": "Phone",
    "phoneInputValue": "",
    "isPhoneRequired": true,
    "phoneInputErrorObj": {
      "required": "Email or Phone is required field.",
      "isValidPhone": "Please specify a valid US phone number"
    },
    "validationTrigger": "onBlur",
    "tickAll": false
  },
  tooltip: {
    "align": "right",
    "position": "left"
  },
  countryCustomVal: "+ 1",
  customClassName: "custom-country-phone-input",
  onBlur: (value, event) => console.log("Input blurred:", value, event),
  ShowParentError: (errorClasses, name, value) =>
    console.log("Error in parent:", errorClasses, name, value),
};

export const DisabledCountrySelection = Template.bind({});
DisabledCountrySelection.args = {
  ...Default.args,
  countryProps: {
    ...Default.args.countryProps,
    isCountryDisabled: true,
  },
};

export const PreFilledPhoneNumber = Template.bind({});
PreFilledPhoneNumber.args = {
  ...Default.args,
  phoneInputProps: {
    ...Default.args.phoneInputProps,
    phoneInputValue: "+1 123-456-7890",
  },
};
