import React from "react";
import MediaGalleryComponent from "./index";

export default {
  title: "Component/MediaGallery",
  component: MediaGalleryComponent,
  tags: ["autodocs"],
};

const Template = (args) => <MediaGalleryComponent {...args} />;

export const WithImages = Template.bind({});
WithImages.args = {
  attachedFiles: [
    {
      url: "https://picsum.photos/800/400",
      type: "IMAGE",
      caption: "Sample Image 1"
    },
    {
      url: "https://picsum.photos/800/401",
      type: "IMAGE",
      caption: "Sample Image 2"
    }
  ],
  extraProps: { lazyLoad: true, arrows: true },
  showAttachedFiles: true,
  showSlideInfo: true,
  showFileName: true,
  showDownload: true,
  showOnTop: true,
  updateCurrentSlide: () => {},
  closeModal: () => {},
  initialSlide: 0,
  showOriginalName: true
};

export const WithVideo = Template.bind({});
WithVideo.args = {
  attachedFiles: [
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      type: "VIDEO",
      caption: "Sample Video1"
    },
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      type: "VIDEO",
      caption: "Sample Video2"
    },
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      type: "VIDEO",
      caption: "Sample Video3"
    },
    {
      url: "https://picsum.photos/800/400",
      type: "IMAGE",
      caption: "Sample Image"
    },
    {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      type: "VIDEO",
      caption: "YouTube Video"
    }
  ],
  extraProps: { lazyLoad: true, arrows: true },
  showAttachedFiles: true,
  showSlideInfo: true,
  showDownload: true,
  showOnTop: true,
  updateCurrentSlide: () => {},
  closeModal: () => {},
};
