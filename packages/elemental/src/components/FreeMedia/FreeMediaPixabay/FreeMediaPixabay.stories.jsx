import React, { useState } from "react";
import FreeMediaPixabay from "./index";

export default {
    title: "Modules/FreeMedia/FreeMediaPixabay",
    component: FreeMediaPixabay,
    argTypes: {
        onOrientationChange: { action: "orientation changed" },
        onColorChange: { action: "color changed" },
        onOrderChange: { action: "order changed" },
        loadMore: { action: "load more triggered" },
        handleMultipleSelectChange: { action: "item selected" },
    },
};

// Mock data based on Pixabay API response structure
const mockPhotos = [
    {
        id: 54321,
        user: "PixabayArtist",
        user_id: "9876",
        largeImageURL: "https://picsum.photos/id/10/1200/800",
        previewURL: "https://picsum.photos/id/10/200/150",
    },
    {
        id: 67890,
        user: "NaturePhotog",
        user_id: "5432",
        largeImageURL: "https://picsum.photos/id/20/1200/800",
        previewURL: "https://picsum.photos/id/20/200/150",
    },
];

const Template = (args) => {
    const [selected, setSelected] = useState([]);

    const handleSelect = (item, isSelected) => {
        if (isSelected) {
            setSelected((prev) => [...prev, item]);
        } else {
            setSelected((prev) => prev.filter((i) => i.id !== item.id));
        }
        args.handleMultipleSelectChange(item, isSelected);
    };

    return (
        <div style={{ padding: "20px", background: "#f0f2f5" }}>
            <FreeMediaPixabay 
                {...args} 
                freeMediaSelected={selected}
                handleMultipleSelectChange={handleSelect}
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    photos: mockPhotos,
    isLoading: false,
    hasMore: true,
    freeMediaSource: "Pixabay",
    maxFilesAllowed: 10,
};

export const SearchingWithFilters = Template.bind({});
SearchingWithFilters.args = {
    ...Default.args,
    searchQuery: "Mountains",
    selectedOrientation: "Horizontal",
    selectedOrder: "Popular",
};

export const LoadingState = Template.bind({});
LoadingState.args = {
    ...Default.args,
    photos: [],
    isLoading: true,
};

export const NoResults = Template.bind({});
NoResults.args = {
    ...Default.args,
    searchQuery: "xyz789",
    noResults: true,
    noResultImage: "https://via.placeholder.com/200?text=No+Pixabay+Results",
};