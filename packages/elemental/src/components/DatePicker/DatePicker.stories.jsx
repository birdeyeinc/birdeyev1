import React, { useState } from "react";
import DatePicker from "./";
import { isEmpty } from "lodash";
import moment from "moment-timezone";

export default {
    title: "Component/DatePicker",
    component: DatePicker,
    tags: ["autodocs"]
};

const Template = (args) => <DatePicker {...args} />;
export const Default = Template.bind({});
Default.args = {
    showPicker: false,
    dynamicClass: "last-activity-date story-book-style",
    insidePopup: false,
    sendDateTime: null,
    onClickApplyChanges: null,
    dateRangeFormat: "MM/DD/YYYY",
    startDt: "03/18/2025",
    endDt: "03/30/2025",
    cancelCalendarPopup: null,
    enableFutureDates: true,
    showTimePickerAbove: true
}
export const Custom = Template.bind({});
Custom.args = {
    range: false,
    enableFutureDates: true,
    showPicker: true,

    dynamicClass: "profile-datepicker",
    startDt: moment(),
    minDate: moment(),
    explicitMinDt: moment(),

    firstTimeFlag: true,
    cancelCalendarPopup: () => console.log("cancelCalendarPopup"),
    showValidateTimeError: true,
    validateTime: true,
    showTimePicker: true,
    showTimePickerAbove: false,
    ignorePreventDefault: true,
    applyButtonLabel: "Schedule",

    showTimezone: true,
    showInfo: true,
    infoText:
        "This date is not applicable to your Apple post as it has its own start date"

}