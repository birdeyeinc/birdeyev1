import React from "react";
import FreeMediaPexels from "./index";

export default {
    title: "Modules/FreeMedia/FreeMediaPexels",
    component: FreeMediaPexels,
    argTypes: {
        onOrientationChange: { action: "orientation changed" },
        onColorChange: { action: "color changed" },
        loadMore: { action: "load more triggered" },
        handleMultipleSelectChange: { action: "item selected" },
        handleClickSeeMore: { action: "see more clicked" },
    },
};

// Mock data for photos based on Pexels API structure
const mockPhotos = [
    {
        id: 1,
        photographer: "Nature Enthusiast",
        photographer_url: "https://www.pexels.com/@nature",
        src: {
            large: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=650&w=940",
            small: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=130&w=200",
        },
    },
    {
        id: 2,
        photographer: "City Scapes",
        photographer_url: "https://www.pexels.com/@city",
        src: {
            large: "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
            small: "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&h=130&w=200",
        },
    },
];

const Template = (args) => <FreeMediaPexels {...args} />;

export const Default = Template.bind({});
Default.args = {
    photos: mockPhotos,
    isLoading: false,
    hasMore: true,
    providerText: "Photos provided by",
    maxFilesAllowed: 10,
};

export const SearchingWithFilters = Template.bind({});
SearchingWithFilters.args = {
    ...Default.args,
    searchQuery: "Forest",
    showOrientations: true,
    showColors: true,
    selectedOrientation: "Horizontal",
};

export const InitialLoading = Template.bind({});
InitialLoading.args = {
    ...Default.args,
    photos: [],
    isLoading: true,
};

export const LoadingMore = Template.bind({});
LoadingMore.args = {
    ...Default.args,
    searchQuery: "Ocean",
    isLoading: false,
    isLoadingMore: true,
    seeMoreClicked: true,
    perPageLimit: 20,
};

export const NoResultsFound = Template.bind({});
NoResultsFound.args = {
    ...Default.args,
    searchQuery: "asdfghjkl",
    noResults: true,
    noResultImage: "https://via.placeholder.com/200?text=No+Results",
};

export const SeeMoreEnabled = Template.bind({});
SeeMoreEnabled.args = {
    ...Default.args,
    enableSeeMore: true,
    hasMore: true,
};