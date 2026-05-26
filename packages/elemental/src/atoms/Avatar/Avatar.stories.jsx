import React from 'react'
import AvatarComponent from '.';

const imageSrc = "https://d1py4eyp5hehj0.cloudfront.net/upload/261968/1727210721603/Pinterest.svg.png"

export default {
  title: 'Atom/Avatar',
  component: AvatarComponent,
  tags: ["autodocs"]
};

const Template = (args) => <AvatarComponent {...args} />;

const SizeTemplate = (args) => <div style={{ display: "flex", gap: "10px" }}>
  <AvatarComponent {...args} size='extra-small' />
  <AvatarComponent {...args} size='small' />
  <AvatarComponent {...args} size='medium' />
  <AvatarComponent {...args} size='large' />
</div>;

export const Size = SizeTemplate.bind({});
Size.args = {
  src: imageSrc,
  alt: 'User Avatar',
  variant: 'circular',
};

export const AvatarWithText = Template.bind({});
AvatarWithText.args = {
  variant: 'circular',
  children: 'A', // Text to display in the avatar
};

export const AvatarWithCustomStyles = Template.bind({});
AvatarWithCustomStyles.args = {
  src: imageSrc,
  alt: 'User Avatar',
  size: 'small',
  variant: 'circular',
  styleObj: { border: '2px solid yellow' }, // Example of custom style
};

export const AvatarWithCustomClasses = Template.bind({});
AvatarWithCustomClasses.args = {
  src: imageSrc,
  alt: 'User Avatar',
  size: 'medium',
  variant: 'rounded',
  classes: {
    root: 'custom-root-class',
    img: 'custom-img-class',
  },
};
export const AvatarWithTypeLogo = Template.bind({});
AvatarWithTypeLogo.args = {
  type: 'LOGO',
  userName: 'John Doe',
  showLastname: true
};
