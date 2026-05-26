import React from 'react';
import FieldDrivenSearch from './index';

export default {
    title: 'Component/FieldDrivenSearch',
    component: FieldDrivenSearch,
    tags: ['autodocs'],
    argTypes: {
        fieldOptions: {
            control: 'object',
            description: 'Array of field options for the dropdown',
            table: {
                type: {
                    summary: 'array',
                    detail: `[{
                        label: string,
                        value: string | number
                    }]`
                }
            }
        },
        selectedField: {
            control: 'text',
            description: 'Currently selected field value',
            table: {
                type: { summary: 'string | number' }
            }
        },
        onFieldChange: {
            action: 'onFieldChange',
            description: 'Callback when field selection changes',
            table: {
                type: { summary: 'function' }
            }
        },
        searchStr: {
            control: 'text',
            description: 'Current search string value',
            table: {
                type: { summary: 'string' }
            }
        },
        onSearchChange: {
            action: 'onSearchChange',
            description: 'Callback when search input changes',
            table: {
                type: { summary: 'function' }
            }
        },
        onChange: {
            action: 'onChange',
            description: 'Unified callback when either field or search changes. Receives { field, search }',
            table: {
                type: { summary: 'function' }
            }
        },
        className: {
            control: 'text',
            description: 'Custom CSS class for the component wrapper',
            table: {
                type: { summary: 'string' }
            }
        },
        fieldWidth: {
            control: 'number',
            description: 'Width of the field select box in pixels',
            table: {
                type: { summary: 'number' }
            }
        },
        dropdownWidth: {
            control: 'number',
            description: 'Width of the dropdown popup in pixels',
            table: {
                type: { summary: 'number' }
            }
        },
        singleSelectProps: {
            control: 'object',
            description: 'Additional props to pass to the SingleSelect component',
            table: {
                type: { summary: 'object' }
            }
        },
        searchFilterProps: {
            control: 'object',
            description: 'Additional props to pass to the SearchFilter component',
            table: {
                type: { summary: 'object' }
            }
        }
    }
};

const Template = (args) => <FieldDrivenSearch {...args} />;

export const Default = Template.bind({});
Default.args = {
    fieldOptions: [
        { label: 'Pages', value: 'pages' },
        { label: 'Locations', value: 'locations' },
        { label: 'Handles', value: 'handles' }
    ],
    selectedField: 'pages',
    searchStr: '',
    // fieldWidth: 150,
    dropdownWidth: 200,
    onFieldChange: (option) => console.log('Field changed:', option),
    onSearchChange: (searchStr) => console.log('Search changed:', searchStr),
    onChange: (data) => console.log('Unified onChange:', data)
};

export const WithSearchValue = Template.bind({});
WithSearchValue.args = {
    ...Default.args,
    searchStr: 'test search',
    selectedField: 'locations'
};

export const CustomWidths = Template.bind({});
CustomWidths.args = {
    ...Default.args,
    fieldWidth: 120,
    dropdownWidth: 250
};

export const WithCustomProps = Template.bind({});
WithCustomProps.args = {
    ...Default.args,
    singleSelectProps: {
        placeholder: 'Choose field',
        align: 'left',
        displayLabel: 'Select new'
    },
    searchFilterProps: {
        placeholder: 'Type to search...',
        debounceDelay: 500,
        maxLength: 50
    }
};

export const WithSearchCallbacks = Template.bind({});
WithSearchCallbacks.args = {
    ...Default.args,
    searchFilterProps: {
        onCrossClickAction: () => console.log('Search cleared'),
        onBlur: () => console.log('Search input blurred'),
        onFocus: () => console.log('Search input focused')
    }
};

export const WithOnlyUnifiedCallback = Template.bind({});
WithOnlyUnifiedCallback.args = {
    ...Default.args,
    onFieldChange: undefined,
    onSearchChange: undefined,
    onChange: (data) => console.log('Only unified onChange:', data)
};
