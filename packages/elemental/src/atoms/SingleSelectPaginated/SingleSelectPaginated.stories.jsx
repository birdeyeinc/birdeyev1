import React, { useState } from 'react';
import SingleSelectPaginated from '.';

export default {
    title: 'Atom/SingleSelectPaginated',
    component: SingleSelectPaginated,
    tags: ["autodocs"]
};


const mockItems = Array.from({ length: 100 }).map((_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`
  }));
  
  const mockFetchData = async ({ searchStr = "", startIndex = 0, pageSize = 25 }) => {
    const filtered = mockItems;
    return {
      data: filtered,
      totalCount: 200
    };
  };
  


export const Default = (args) => {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <SingleSelectPaginated
            {...args}
            selectedItem={selectedItem}
            onChange={(item) => {
              setSelectedItem(item);
              console.log("Selected:", item);
            }}
        />
    )
}

Default.args = {
    fetchData: mockFetchData,
    itemKey: "id",
    itemLabel: "name",
    label: "Select an Item",
    searchPlaceholder: "Search items",
    defaultPage: 25,
    callApiOnMount: false,
    excludedKeysFromList: {}
  };
  