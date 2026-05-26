
import React from 'react';
import TagComponent from './index';

export default {
  title: 'Atom/Tag',
  component: TagComponent,
  tags: ["autodocs"]
};

const Template = (args) => <TagComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Default Tag',
};

export const SmallTag = Template.bind({});
SmallTag.args = {
  title: 'Small Tag',
  size: 'small',
};


export const Interactive = Template.bind({});
Interactive.args = {
  title: 'Interactive Tag',
  onClick: () => alert('Tag clicked!'),
  onRemove: () => alert('Remove clicked!'),
};

export const ActiveTag = Template.bind({});
ActiveTag.args = {
  title: 'Active Tag',
  active: true,
};

export const InvalidEmailTag = Template.bind({});
InvalidEmailTag.args = {
  title: 'Invalid Email Tag',
  isValidEmail: false,
  isApprovalTab: true,
};

export const AITag = Template.bind({});
AITag.args = {
  title: 'AI Generated Tag',
  aiSuggestion: true,
  isTagDeletable: (title, aiSuggestion) => aiSuggestion,
};

