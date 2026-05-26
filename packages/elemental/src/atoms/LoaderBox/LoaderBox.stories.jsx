import React from 'react'
import LoaderBoxComponent from '.';


export default {
  title: 'Atom/LoaderBox',
  component: LoaderBoxComponent,
  tags: ["autodocs"]
};

const Template = (args) => <LoaderBoxComponent {...args} />;
export const Default = Template.bind({});
Default.args = {
  reseller: false
}
export const BirdEyeLoader = Template.bind({});
BirdEyeLoader.args = {
  type: 'loader-birdeye',
  reseller: false // reseller decides wether it will be a whitelabel loader or loader with birdeye icon
};
export const BirdEyeLoaderWithoutMessage = Template.bind({});
BirdEyeLoaderWithoutMessage.args = {
  type: 'loader-birdeye',
  reseller: false,
  message: ''
}
export const ResellerLoader = Template.bind({});
ResellerLoader.args = {
  type: 'loader-birdeye',
  reseller: true
}
export const SimpleLoader = Template.bind({});
SimpleLoader.args = {
  type: 'loader',
  reseller: false
}

export const AnimationLoader = Template.bind({});
AnimationLoader.args = {
  type: 'animation-loader',
  reseller: false,
  animationLoaderProps: {
    title: 'Setting up your integration',
    message: 'We are processing the latest step',
    showInlineLoader: true,
    activeIndex: 1,
    events: [
      { label: 'Connection verified' },
      { label: 'Mapping fields' },
      { label: 'Preparing final sync' },
    ],
  }
}
