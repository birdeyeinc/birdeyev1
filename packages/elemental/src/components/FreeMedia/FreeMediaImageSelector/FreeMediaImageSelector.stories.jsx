import React, { useState } from "react";
import FreeMediaImageSelector from "./index";

export default {
  title: "Modules/FreeMedia/FreeMediaImageSelector",
  component: FreeMediaImageSelector,
  argTypes: {
    onChangeHandler: { action: "image clicked" },
    onChangeCheckboxHandler: { action: "checkbox toggled" },
    cancelUpload: { action: "upload cancelled" },
  },
};

const Template = (args) => {
  const [selected, setSelected] = useState(args.isSelected || false);

  const handleToggle = (val) => {
    setSelected(val);
    args.onChangeHandler(val);
  };

  return (
    <div style={{ width: "300px" }}>
      <FreeMediaImageSelector
        {...args}
        isSelected={selected}
        onChangeHandler={handleToggle}
        onChangeCheckboxHandler={() => handleToggle(!selected)}
      />
    </div>
  );
};

export const DefaultImage = Template.bind({});
DefaultImage.args = {
  imageUrl: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg",
  displayName: "James Wheeler",
  photographerURL: "https://www.pexels.com/@soulofmatter",
  placeholderSrc: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&h=130&w=200",
  limit: 5,
  totalSelected: 2,
};

export const VideoSupport = Template.bind({});
VideoSupport.args = {
  ...DefaultImage.args,
  isVideo: true,
  imageUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  displayName: "Video Contributor",
};

export const SelectedState = Template.bind({});
SelectedState.args = {
  ...DefaultImage.args,
  isSelected: true,
};

export const LimitReached = Template.bind({});
LimitReached.args = {
  ...DefaultImage.args,
  isSelected: false,
  totalSelected: 5,
  limit: 5,
};

export const ShimmerLoading = Template.bind({});
ShimmerLoading.args = {
  ...DefaultImage.args,
  useNormalHtmlImageTag: true,
  showShimmer: true,
  imageUrl: "", // Empty to force loading state
};

export const BrokenImage = Template.bind({});
BrokenImage.args = {
  imageUrl: "https://invalid-url-link.com/image.jpg",
  displayName: "Unknown Author",
  brokenImageSrc: "https://via.placeholder.com/300x196?text=Image+Not+Found",
};