import React from 'react'
import TextAreaComponent from '.';

const imageSrc = "https://d1py4eyp5hehj0.cloudfront.net/upload/261968/1727210721603/Pinterest.svg.png"

export default {
    title: 'Atom/TextArea',
    component: TextAreaComponent,
    tags: ["autodocs"]
};

const Template = (args) => <TextAreaComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
    maxLength: "512",
    name: "responseArea",
    label: "Description (optional)"
}
export const TextAreaErrorTooltip = Template.bind({});
TextAreaErrorTooltip.args = {
    type: "text",
    maxLength: "3",
    id: "ticket-description",
    name: "ticket_description",
    placeholder: "Description",
    value: 'Text are with validation message, empty textarea and click outside to check the custom message',
    validationError: 'It has reached max length'
}
export const TextAreaErrorOutside = Template.bind({});
TextAreaErrorOutside.args = {
    type: "text",
    maxLength: "3",
    id: "ticket-description",
    name: "ticket_description",
    placeholder: "Description",
    showErrorOutside: true,
    value: 'Text are with validation message, empty textarea and click outside to check the custom message',
    validationError: 'It has reached max length'
}
