import React from 'react';
import MediaCollage from '.';

export default {
    title: 'Component/MediaCollage',
    component: MediaCollage,
};


const Template = (args) => <MediaCollage {...args} />;

export const SingleCollage = Template.bind({});
SingleCollage.args = {
    threshold: 3,
    attachments: [
        { completeURL: 'https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273391/1744115418382.png', type: 'image', 'ext': 'png' },
    ],
    direction: 'horizontal',
    channel: 'facebook',
    isSocialPreview: true,
    withOuterBorders: true,
    socialChannelCardWidth: 300,
    isDrawer: true,
    setSlider: () => { },
    playVideoIcon: true,
    isInboxAttachments: true,
    videoFullScreenMode: true,
};

export const DoubleCollage = Template.bind({});
DoubleCollage.args = {
    threshold: 3,
    attachments: [
        { completeURL: 'https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273391/1744115418382.png', type: 'image', 'ext': 'png' },
        { completeURL: 'https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273513/de0dd46b8a824571b7cd42f9040bf25f.png', type: 'image', 'ext': 'png' },
    ],
    direction: 'horizontal',
    channel: 'facebook',
    isSocialPreview: true,
    withOuterBorders: true,
    socialChannelCardWidth: 300,
    isDrawer: true,
    setSlider: () => { },
    playVideoIcon: true,
    isInboxAttachments: true,
    videoFullScreenMode: true,
};

export const TripleCollage = Template.bind({});
TripleCollage.args = {
    threshold: 3,
    attachments: [
        { completeURL: 'https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273391/1744115418382.png', type: 'image', 'ext': 'png' },
        { completeURL: 'https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273513/de0dd46b8a824571b7cd42f9040bf25f.png', type: 'image', 'ext': 'png' },
        { completeURL: 'https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273570/1741078874717.jpeg', type: 'image', 'ext': 'jpeg' },
    ],
    direction: 'horizontal',
    channel: 'facebook',
    isSocialPreview: true,
    withOuterBorders: true,
    socialChannelCardWidth: 300,
    isDrawer: true,
    setSlider: () => { },
    playVideoIcon: true,
    isInboxAttachments: true,
    videoFullScreenMode: true,
};

export const MultipleCollage = Template.bind({});
MultipleCollage.args = {
    threshold: 3,
    attachments: [
        { completeURL: 'https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273391/1744115418382.png', type: 'image', 'ext': 'png' },
        { completeURL: 'https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273513/de0dd46b8a824571b7cd42f9040bf25f.png', type: 'image', 'ext': 'png' },
        { completeURL: 'https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273570/1741078874717.jpeg', type: 'image', 'ext': 'jpeg' },
        { completeURL: 'https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273570/1741078874717.jpeg', type: 'image', 'ext': 'jpeg' },
    ],
    direction: 'horizontal',
    channel: 'facebook',
    isSocialPreview: true,
    withOuterBorders: true,
    socialChannelCardWidth: 300,
    isDrawer: true,
    setSlider: () => { },
    playVideoIcon: true,
    isInboxAttachments: true,
    videoFullScreenMode: true,
};