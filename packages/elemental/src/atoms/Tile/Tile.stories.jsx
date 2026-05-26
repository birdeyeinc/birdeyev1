import React from 'react';
import TileComponent from '.';

export default {
    title: 'Atom/Tile',
    component: TileComponent,
    tags: ["autodocs"],
    argTypes: {
        payload: {
            control: 'object',
            description: 'Data for the tile(s). Can be a single object or array of objects'
        },
        errorMessage: {
            control: 'text',
            description: 'Custom error message to display'
        },
        showTotalPages: {
            control: 'boolean',
            description: 'Whether to show total page count'
        },
        buttonText: {
            control: 'text',
            description: 'Text to display on the action button'
        },
        downloadUrl: {
            control: 'text',
            description: 'URL for download functionality'
        },
        onButtonClick: {
            action: 'clicked',
            description: 'Callback function when button is clicked'
        },
        displayTilesTogether: {
            control: 'boolean',
            description: 'Whether to display multiple tiles together'
        },
        hideButton: {
            control: 'boolean',
            description: 'Whether to hide the action button'
        },
        BE: {
            control: 'object',
            description: 'Business entity information'
        },
        imageCdnLink: {
            control: 'text',
            description: 'CDN link for image sources'
        }
    }
};

const Template = (args) => <TileComponent {...args} />;

export const SingleTile = Template.bind({});
SingleTile.args = {
    payload: {
        integrationSource: 'quickbooks',
        integrationSourceDisplayName: "Integration 1",
        broken: 5,
        total: 100,
        errorMessage: "Error occurred"
    },
    showTotalPages: true,
    buttonText: "Reconnect",
    downloadUrl: "https://example.com/download",
    hideButton: false,
    BE: {
        business: {
            accountType: 1,
            resellerInfo: { name: 'Test Reseller' },
            brandInfo: { name: 'Test Brand' }
        }
    },
    imageCdnLink: "",
    onButtonClick: () => console.log('Button clicked'),
    errorMessage: "Custom error message"
};

export const MultipleTiles = Template.bind({});
MultipleTiles.args = {
    payload: [
        {
            integrationSource: 'source1',
            integrationSourceDisplayName: "Integration 1",
            broken: 3,
            total: 50,
            errorMessage: "Error 1"
        },
        {
            integrationSource: 'source2',
            integrationSourceDisplayName: "Integration 2",
            broken: 2,
            total: 30,
            errorMessage: "Error 2"
        }
    ],
    displayTilesTogether: true,
    showTotalPages: true,
    downloadUrl: "https://example.com/download",
    hideButton: false,
    BE: {
        business: {
            accountType: 1,
            resellerInfo: { name: 'Test Reseller' },
            brandInfo: { name: 'Test Brand' }
        }
    },
    imageCdnLink: "",
    onButtonClick: () => console.log('Button clicked'),
    errorMessage: "Custom error message"
};
