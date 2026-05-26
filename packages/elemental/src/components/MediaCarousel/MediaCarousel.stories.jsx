import React from "react";
import MediaCarouselComponent from "./index";

export default {
  title: "Component/MediaCarousel",
  component: MediaCarouselComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => <div style={{width: "1000px"}}><MediaCarouselComponent {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
  images: [
    {
      "type": "PHOTO",
      "url": "https://ddjkm7nmu27lx.cloudfront.net/1501707/reviews/original/e9uldbruyk/1742188035682.jpeg",
      "caption": "",
      "thumbnailUrl": "https://ddjkm7nmu27lx.cloudfront.net/1501707/reviews/600x600/2tavp1jv47/1742188035890.jpeg"
    },
    {
      "type": "PHOTO",
      "url": "https://ddjkm7nmu27lx.cloudfront.net/1501707/reviews/original/l2cw68ukeo/1742188035093.jpeg",
      "caption": "",
      "thumbnailUrl": "https://ddjkm7nmu27lx.cloudfront.net/1501707/reviews/600x600/esjyljrmxv/1742188035335.jpeg"
    },
    {
      "type": "VIDEO",
      "url": "https://lh3.googleusercontent.com/ggms/AF1QipP_bLxeZDObVYlTFkwocTYY39tipts_KIjAiahb=m37",
      "caption": "",
      "thumbnailUrl": "https://lh3.googleusercontent.com/ggms/AF1QipP_bLxeZDObVYlTFkwocTYY39tipts_KIjAiahb=m37"
    },
    {
      "type": "PHOTO",
      "url": "https://ddjkm7nmu27lx.cloudfront.net/1501707/reviews/original/03wc191rw8/1742188036116.jpeg",
      "caption": "",
      "thumbnailUrl": "https://ddjkm7nmu27lx.cloudfront.net/1501707/reviews/600x600/vo2ig3eja5/1742188036301.jpeg"
    },{
      "type": "PHOTO",
      "url": "https://ddjkm7nmu27lx.cloudfront.net/1501707/reviews/original/e9uldbruyk/1742188035682.jpeg",
      "caption": "",
      "thumbnailUrl": "https://ddjkm7nmu27lx.cloudfront.net/1501707/reviews/600x600/2tavp1jv47/1742188035890.jpeg"
    },
    {
      "type": "PHOTO",
      "url": "https://ddjkm7nmu27lx.cloudfront.net/1501707/reviews/original/l2cw68ukeo/1742188035093.jpeg",
      "caption": "",
      "thumbnailUrl": "https://ddjkm7nmu27lx.cloudfront.net/1501707/reviews/600x600/esjyljrmxv/1742188035335.jpeg"
    },
    {
      "type": "VIDEO",
      "url": "https://lh3.googleusercontent.com/ggms/AF1QipP_bLxeZDObVYlTFkwocTYY39tipts_KIjAiahb=m37",
      "caption": "",
      "thumbnailUrl": "https://lh3.googleusercontent.com/ggms/AF1QipP_bLxeZDObVYlTFkwocTYY39tipts_KIjAiahb=m37"
    },
    {
      "type": "PHOTO",
      "url": "https://ddjkm7nmu27lx.cloudfront.net/1501707/reviews/original/03wc191rw8/1742188036116.jpeg",
      "caption": "",
      "thumbnailUrl": "https://ddjkm7nmu27lx.cloudfront.net/1501707/reviews/600x600/vo2ig3eja5/1742188036301.jpeg"
    }
  ],
  itemHeight: 120,
  itemWidth: 180,
  isPDFLitePage: false,
};
