import TextAreaCounterWrapper from "./index";

export default {
    title: "Component/TextAreaCounterWrapper",
    component: TextAreaCounterWrapper,
    tags: ["autodocs"]
}

const Template = (args) => <TextAreaCounterWrapper {...args} />;

export const Default = Template.bind({});

Default.args = {
    maxLen: Infinity,
    contentEditable: true,
    onChange: (value) => console.log(value),
    autoSize: true
};


// export const HideCounter = Template.bind({});

// HideCounter.args = {
//     ...Default.args,
//     hideCounter: true
// };

// export const WithCustomNumber = Template.bind({});

// WithCustomNumber.args = {
//     ...Default.args,
//     maxLen: 500
// };

// export const WithCustomPlaceholder = Template.bind({});

// WithCustomPlaceholder.args = {
//     maxLen: Infinity,
//     contentEditable: true,
//     onChange: (value) => console.log(value),
//     placeholder: "CUSTOM_TEXT_AREA_PLACEHOLDER"
// };

// export const WithEmojiPicker = Template.bind({});

// WithEmojiPicker.args = {
//     ...Default.args,
//     emojiPicker: true,
//     emojiPickerPosition: "bottom",
//     emojiToolTipPosition: "bottom-left"
// };

// export const WithEmojiPickerAsDisabled = Template.bind({});

// WithEmojiPickerAsDisabled.args = {
//     ...WithEmojiPickerAsDisabled.args,
//     disableEmojiPicker: true
// };

// export const WithEmojiPickerPositionVariants = () => <div style={{ gap: "10px" }}>
//     <TextAreaCounterWrapper {...{ ...WithEmojiPicker.args, emojiPickerPosition: "bottom" }} />
//     <TextAreaCounterWrapper {...{ ...WithEmojiPicker.args, emojiPickerPosition: "top" }} />
// </div>;

// export const WithPersonalizedTokens = Template.bind({});

// WithPersonalizedTokens.args = {
//     ...WithEmojiPicker.args,
//     tokenMenu: true,
//     tokenMenuType: "SURVEY_TITLE",
//     customWidthOpen: "235"
// }

// export const WithFileUploader = Template.bind({});

// WithFileUploader.args = {
//     ...WithPersonalizedTokens.args,
//     showAttachmentIcon: true,
//     attachmentTooltipPosition: "bottom-left",
//     attachmentErrorCallback: (err) => {
//         console.log("errorCallback", err)
//     },
//     attachmentUploadCallback: (files) => {
//         console.log(files, "files")
//     },
//     attachmentResolution: {
//         imageSizeLimit: 11111111211
//     }
// }

// export const WithFileUploaderAsDisabled = Template.bind({});

// WithFileUploaderAsDisabled.args = {
//     ...WithFileUploader.args,
//     showDisabledAttachment: true
// }

// export const WithFileUploaderOnlyForImage = Template.bind({});

// WithFileUploaderOnlyForImage.args = {
//     ...WithFileUploader.args,
//     attachmentSupportedTypes: "image/jpg,image/jpeg,image/png",
//     attachmentTooltipText: "Attach only image/jpg,image/jpeg,image/png"
// }

// export const WithSocialPostLib = Template.bind({});

// WithSocialPostLib.args = {
//     ...WithFileUploader.args,
//     isReseller: false,
//     showPostLib: true,
//     createPostInIframe: false,
//     postLibModalCb: () => {
//         console.log("render post lib")
//     }
// }