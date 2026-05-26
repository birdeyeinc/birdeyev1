import React, { useState } from "react";
import FreeMediaGiphy from "./index";

export default {
    title: "Modules/FreeMedia/FreeMediaGiphy",
    component: FreeMediaGiphy,
    argTypes: {
        loadMore: { action: "load more triggered" },
        handleMultipleSelectChange: { action: "selection changed" },
    },
};

// Mock data following Giphy's API structure
const mockGifs = [
    {
        id: "giphy1",
        username: "artist_one",
        images: {
            fixed_height: { url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJtYmU0Z3BqYnJtYmU0Z3BqYnJtYmU0Z3BqYnJtYmU0Z3BqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxcaOlfKDu/giphy.gif" },
            preview_gif: { url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJtYmU0Z3BqYnJtYmU0Z3BqYnJtYmU0Z3BqYnJtYmU0Z3BqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxcaOlfKDu/giphy-preview.gif" }
        }
    },
    {
        id: "giphy2",
        username: "creative_studio",
        images: {
            fixed_height: { url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJtYmU0Z3BqYnJtYmU0Z3BqYnJtYmU0Z3BqYnJtYmU0Z3BqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lI4bY2eE3KDMUE/giphy.gif" },
            preview_gif: { url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJtYmU0Z3BqYnJtYmU0Z3BqYnJtYmU0Z3BqYnJtYmU0Z3BqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lI4bY2eE3KDMUE/giphy-preview.gif" }
        }
    }
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
            <FreeMediaGiphy 
                {...args} 
                freeMediaSelected={selected}
                handleMultipleSelectChange={handleSelect}
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    gifs: mockGifs,
    isLoading: false,
    hasMore: true,
    freeMediaSource: "Giphy",
    maxFilesAllowed: 5,
};

export const LoadingState = Template.bind({});
LoadingState.args = {
    gifs: [],
    isLoading: true,
    hasMore: false,
};

export const NoResults = Template.bind({});
NoResults.args = {
    gifs: [],
    noResults: true,
    noResultImage: "https://via.placeholder.com/200?text=No+GIFs+Found",
};