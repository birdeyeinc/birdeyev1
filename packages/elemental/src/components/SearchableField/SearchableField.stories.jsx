import React from 'react';
import SearchableField from '.';

export default {
    title: 'component/SearchableField',
    component: SearchableField,
    tags: ["autodocs"],
    argTypes: {
        fieldLabel: { control: 'text' },
        placeholder: { control: 'text' },
        searchableFieldValue: { control: 'array' },
        searchableFieldAPIList: { control: 'array' },
        searchFieldErr: { control: 'text' },
        searchFieldErrMessage: { control: 'text' },
        disabled: { control: 'boolean' },
        tooltipAllowed: { control: 'boolean' },
        showLoader: { control: 'boolean' },
        multiple: { control: 'boolean' },
        maxSelected: { control: 'number' },
        limit: { control: 'number' },
        autoFocus: { control: 'boolean' },
        showSuggestions: { control: 'boolean' },
        showAlreadySelectedTags: { control: 'boolean' },
        clearText: { control: 'boolean' },
        addEllipsis: { control: 'boolean' }
    }
};

const Template = (args) => <SearchableField {...args} />;

export const Default = Template.bind({});
Default.args = {
    fieldLabel: 'Search Field',
    placeholder: 'Search...',
    searchableFieldValue: [],
    searchableFieldAPIList: [],
    searchFieldErr: '',
    multiple: false,
    showSuggestions: true,
    showAlreadySelectedTags: true,
    clearText: true
};

Default.parameters = {
    docs: {
        source: {
            code: `<SearchableField 
                fieldLabel="Search Field"
                placeholder="Search..."
                searchableFieldValue={[]}
                searchableFieldAPIList={[]}
                searchFieldErr=""
                multiple={false}
                showSuggestions={true}
                showAlreadySelectedTags={true}
                clearText={true}
            />`,
            language: 'jsx',
            format: true,
        },
    },
};

export const WithTags = Template.bind({});
WithTags.args = {
    fieldLabel: 'Search with Tags',
    placeholder: 'Search...',
    searchableFieldValue: [
        { value: 'tag1', isValid: true },
        { value: 'tag2', isValid: true }
    ],
    searchableFieldAPIList: [],
    multiple: true
};



export const WithEllipsis = Template.bind({});
WithEllipsis.args = {
    fieldLabel: 'Search with Ellipsis',
    placeholder: 'Search...',
    addEllipsis: true,
    searchableFieldValue: [
        { value: 'This is a very long tag that should be truncated', isValid: true }
    ],
    searchableFieldAPIList: []
};
