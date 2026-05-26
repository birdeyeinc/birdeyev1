import React, { useState } from "react";
import AiImageInput from "./index";

export default {
  title: "Component/AiImageInput",
  component: AiImageInput,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onSubmit: { action: "submitted" },
    onImageSelect: { action: "image selected" },
    onOrientationChange: { action: "orientation changed" },
  },
};

// --- Mock Data ---
const mockImages = [
  "https://picsum.photos/400/400?random=1",
  "https://picsum.photos/400/400?random=2",
  "https://picsum.photos/400/400?random=3",
  "https://picsum.photos/400/400?random=4",
];

// --- Templates ---
const Template = (args) => {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState(null);
  const [orientation, setOrientation] = useState("square");

  return (
    <div style={{ width: "500px", padding: "20px", background: "#fff" }}>
      <AiImageInput
        {...args}
        value={value}
        onChange={setValue}
        orientation={orientation}
        onOrientationChange={setOrientation}
        selectedImage={selected}
        onImageSelect={setSelected}
      />
    </div>
  );
};

// --- Stories ---

/**
 * Default state showing the input and orientation options.
 */
export const Default = Template.bind({});
Default.args = {
  placeholder: "Describe the image you want to generate...",
  aiPhraseText: "BirdAI",
};

/**
 * Demonstrates the loading/shimmer state while images are being generated.
 */
export const LoadingState = Template.bind({});
LoadingState.args = {
  isLoading: true,
  loadingItemCount: 4,
  aiPhraseText: "BirdAI",
};

/**
 * State showing successfully generated images in the grid.
 */
export const GeneratedImages = Template.bind({});
GeneratedImages.args = {
  images: mockImages,
  gridColumns: 2,
};

/**
 * Demonstrates the 3-column grid layout for more compact image display.
 */
export const ThreeColumnGrid = Template.bind({});
ThreeColumnGrid.args = {
  images: [...mockImages, "https://picsum.photos/400/400?random=5", "https://picsum.photos/400/400?random=6"],
  gridColumns: 3,
};

/**
 * Disabled state for the entire input section.
 */
export const DisabledState = Template.bind({});
DisabledState.args = {
  isDisabled: true,
  value: "A futuristic city in the clouds",
};

/**
 * Hidden orientation options, useful for simpler generation workflows.
 */
export const MinimalInput = Template.bind({});
MinimalInput.args = {
  showOrientationOptions: false,
  placeholder: "Fast generation prompt...",
};