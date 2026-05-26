import React, { useState } from "react";
import FreeMediaGrid from "./index";

export default {
  title: "Modules/FreeMedia/FreeMediaGrid",
  component: FreeMediaGrid,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    loadMore: { action: "load more triggered" },
    handleMultipleSelectChange: { action: "selection changed" },
    handleClickSeeMore: { action: "see more clicked" },
  },
};

// --- Mock Data Generation ---
const generateMockMedia = (count, startId = 1) => 
  Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    name: `Media item ${startId + i}.jpg`,
    photographer: `Artist ${startId + i}`,
    photographer_url: "https://www.pexels.com",
    type: i % 5 === 0 ? "video/mp4" : "image/jpeg", // Every 5th item is a video
    src: {
      large: `https://picsum.photos/800/600?random=${startId + i}`,
      small: `https://picsum.photos/200/150?random=${startId + i}`,
    },
  }));

// --- Template ---
const Template = (args) => {
  const [media, setMedia] = useState(args.media || generateMockMedia(12));
  const [selected, setSelected] = useState([]);

  const handleSelect = (item, isSelected) => {
    if (isSelected) {
      setSelected((prev) => [...prev, item]);
    } else {
      setSelected((prev) => prev.filter((i) => i.id !== item.id));
    }
    args.handleMultipleSelectChange(item, isSelected);
  };

  const handleLoadMore = () => {
    args.loadMore();
    // Simulate network delay and adding items
    setTimeout(() => {
      setMedia((prev) => [...prev, ...generateMockMedia(8, prev.length + 1)]);
    }, 1000);
  };

  return (
    <div style={{ background: "#f5f5f5", padding: "20px", borderRadius: "8px" }}>
      <FreeMediaGrid
        {...args}
        media={media}
        freeMediaSelected={selected}
        handleMultipleSelectChange={handleSelect}
        loadMore={handleLoadMore}
        // Resolvers for the mock data structure
        getImageUrl={(item) => item.src.large}
        getDisplayName={(item) => item.photographer}
        getPlaceholderSrc={(item) => item.src.small}
        getPhotographerURL={(item) => item.photographer_url}
      />
    </div>
  );
};

// --- Stories ---

export const InfiniteScrollMode = Template.bind({});
InfiniteScrollMode.args = {
  hasMore: true,
  freeMediaSource: "Pexels",
  limit: 20,
};

export const SeeMoreButtonMode = Template.bind({});
SeeMoreButtonMode.args = {
  enableSeeMore: true,
  hasMore: true,
  showFileName: true,
  freeMediaSource: "Pixabay",
};

export const GiphyStyleGrid = Template.bind({});
GiphyStyleGrid.args = {
  freeMediaSource: "Giphy", // Triggers specific height logic in SCSS
  media: generateMockMedia(10),
  hasMore: false,
};

export const SelectionLimitReached = Template.bind({});
SelectionLimitReached.args = {
  media: generateMockMedia(8),
  limit: 3,
  // We mock a pre-selected state to show the 'no-drop' cursor on others
  freeMediaSelected: [
    { id: 1 }, { id: 2 }, { id: 3 }
  ],
};

export const LoadingState = Template.bind({});
LoadingState.args = {
  media: generateMockMedia(4).map(item => ({ ...item, showShimmer: true })),
  isFreeMediaLoading: true,
  hasMore: true,
};