
import React from 'react';
import TagsInput from '.';

export default {
  title: 'Component/TagsInput',
  component: TagsInput,
  tags: ["autodocs"]
};

const Template = (args) => <TagsInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Enter tags...',
  name: 'default-tags',
  onTagsUpdate: (name, tags, errorState) => console.log('Tags updated:', { name, tags, errorState }),
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  placeholder: 'Enter tags...',
  name: 'default-value-tags',
  defaultValue: ['React', 'JavaScript', 'Storybook'],
  onTagsUpdate: (name, tags, errorState) => console.log('Tags updated:', { name, tags, errorState }),
};

export const EmailValidation = Template.bind({});
EmailValidation.args = {
  placeholder: 'Enter email addresses',
  name: 'email-tags',
  supportTextTags: false,
  errorMsg: 'Please enter valid email addresses',
  labelText: 'Enter email addresses separated by a comma',
  onTagsUpdate: (name, tags, errorState) => console.log('Tags updated:', { name, tags, errorState }),
};

export const TextTags = Template.bind({});
TextTags.args = {
  placeholder: 'Enter text tags',
  name: 'text-tags',
  supportTextTags: true,
  labelText: 'Enter keywords separated by a comma',
  onTagsUpdate: (name, tags, errorState) => console.log('Tags updated:', { name, tags, errorState }),
};

export const CustomError = Template.bind({});
CustomError.args = {
  placeholder: 'Enter tags...',
  name: 'error-tags',
  customError: true,
  customErrorMessage: 'This is a custom error message',
  onTagsUpdate: (name, tags, errorState) => console.log('Tags updated:', { name, tags, errorState }),
};

export const AutoFocus = Template.bind({});
AutoFocus.args = {
  placeholder: 'Enter tags...',
  name: 'autofocus-tags',
  autoFocus: true,
  onTagsUpdate: (name, tags, errorState) => console.log('Tags updated:', { name, tags, errorState }),
};

export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: 'Enter tags...',
  name: 'disabled-tags',
  disabled: true,
  defaultValue: ['Disabled', 'Tags'],
  onTagsUpdate: (name, tags, errorState) => console.log('Tags updated:', { name, tags, errorState }),
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  placeholder: 'Enter tags...',
  name: 'no-label-tags',
  showLabel: false,
  onTagsUpdate: (name, tags, errorState) => console.log('Tags updated:', { name, tags, errorState }),
};

export const CustomBreakBehavior = Template.bind({});
CustomBreakBehavior.args = {
  placeholder: 'Press Enter or Tab to add tags',
  name: 'custom-break-tags',
  onlyBreakOnEnterAndTab: true,
  supportTextTags: true,
  onTagsUpdate: (name, tags, errorState) => console.log('Tags updated:', { name, tags, errorState }),
};

export const BreakOnEnterTabAndComma = Template.bind({});
BreakOnEnterTabAndComma.args = {
  placeholder: 'Press Enter, Tab or Comma to add tags',
  name: 'enter-tab-comma-tags',
  onlyBreakOnEnterTabAndComma: true,
  supportTextTags: true,
  insightsInput: true,
  showAsTextArea: true,
  customPlaceholderText: 'Add relevant keywords',
  showLabel: false,
  allowBlank: false,
  scrollToBottomOnAdd: true,
  showErrorOutside: true,
  tagConfig: { variantType: 'outlined', color: 'grey' },
  onTagsUpdate: (name, tags, errorState) => console.log('Tags updated:', { name, tags, errorState }),
};

// export const InsightsInput = Template.bind({});
// InsightsInput.args = {
//   placeholder: 'Type or select keywords',
//   name: 'insights-tags',
//   insightsInput: true,
//   showAsTextArea: true,
//   customPlaceholderText: 'Type or select keywords',
//   onTagsUpdate: (name, tags, errorState) => console.log('Tags updated:', { name, tags, errorState }),
// };

export const MandatoryEmailValidation = Template.bind({});
MandatoryEmailValidation.args = {
  placeholder: 'Enter email addresses',
  name: 'mandatory-email-tags',
  isMendatoryBeEmail: true,
  errorMsg: 'There should be at least one non-birdeye email',
  onTagsUpdate: (name, tags, errorState) => console.log('Tags updated:', { name, tags, errorState }),
};

