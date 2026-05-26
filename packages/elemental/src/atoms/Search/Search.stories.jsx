import React from 'react';
import Search from '.';

export default {
    title: 'Atom/Search',
    component: Search,
    tags: ["autodocs"],
    argTypes: {
        items: { control: 'array' },
        initialSelected: { control: 'array' },
        placeholder: { control: 'text' },
        NotFoundPlaceholder: { control: 'text' },
        maxSelected: { control: 'number' },
        multiple: { control: 'boolean' },
        searchKey: { control: 'text' },
        delay: { control: 'number' },
        focus: { control: 'boolean' },
        clearText: { control: 'boolean' },
        showSuggestions: { control: 'boolean' },
        showAlreadySelectedTags: { control: 'boolean' },
        showLazyLoadLoader: { control: 'boolean' }
    }
};

const Template = (args) => <Search {...args} />;

const sampleItems = [
    { id: 1, value: 'Item 1', key: 'item1' },
    { id: 2, value: 'Item 2', key: 'item2' },
    { id: 3, value: 'Item 3', key: 'item3' },
    { id: 4, value: 'Item 4', key: 'item4' }
];

export const Default = Template.bind({});
Default.args = {
    items: sampleItems,
    placeholder: 'Search...',
    searchKey: 'value',
    showSuggestions: true,
    showAlreadySelectedTags: true
};

Default.parameters = {
    docs: {
        source: {
            code: `<Search 
                items={sampleItems}
                placeholder="Search..."
                searchKey="value"
                showSuggestions={true}
                showAlreadySelectedTags={true}
            />`,
            language: 'jsx',
            format: true,
        },
    },
};

