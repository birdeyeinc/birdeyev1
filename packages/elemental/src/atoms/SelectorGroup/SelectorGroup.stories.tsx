import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import SelectorGroup from './index';

type SelectorGroupProps = React.ComponentProps<typeof SelectorGroup>;

const meta: Meta<SelectorGroupProps> = {
    title: "Atom/SelectorGroup",
    component: SelectorGroup,
    parameters: {
        docs: {
            description: {
                component: 'A selector group component for filtering and categorization. Supports icons, counts, and interactive selection. Merges provided options with defaults for sentiment analysis use cases.'
            }
        }
    },
    decorators: [
        (Story) => (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '200px',
                padding: '20px',
                backgroundColor: '#f8f9fa'
            }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        options: {
            control: 'object',
            description: 'Array of selector options with key, label, count, and optional icon'
        },
        initialSelectedKey: {
            control: 'text',
            description: 'Initial selected option key'
        },
        onChange: {
            action: 'changed',
            description: 'Callback function called when selection changes'
        }
    },
    tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<SelectorGroupProps>;

export const Default: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Default behavior with no props - shows built-in sentiment options (All, Positive, Neutral, Negative) with proper icons and zero counts. The component merges any provided options with these defaults.'
            }
        }
    }
};

export const CustomOptions: Story = {
    args: {
        options: [
            { key: 'all', label: 'All Orders', count: 2450 },
            { key: 'pending', label: 'Pending', count: 156, icon: <span style={{ color: '#FF9800', marginRight: '6px' }}>⏳</span> },
            { key: 'completed', label: 'Completed', count: 1987, icon: <span style={{ color: '#4CAF50', marginRight: '6px' }}>✅</span> },
            { key: 'cancelled', label: 'Cancelled', count: 307, icon: <span style={{ color: '#F44336', marginRight: '6px' }}>❌</span> }
        ],
        initialSelectedKey: 'all',
        onChange: (key: string) => {
            console.log('Selection changed to:', key);
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'Custom options with icons, different labels, and large counts. Shows interactive onChange callback, number formatting (toLocaleString), and various visual states. Perfect for dashboards and analytics.'
            }
        }
    }
};

export const PartialOptions: Story = {
    args: {
        options: [
            { key: 'all', label: 'All Reviews', count: 1245 },
            { key: 'pos', label: '', count: 789 },
            { key: 'neu', label: '', count: 334 }
        ],
        initialSelectedKey: 'pos'
    },
    parameters: {
        docs: {
            description: {
                story: 'Partial options demonstration - merges provided data with defaults. Updates "All" label and counts for positive/neutral sentiment, while negative keeps default count of 0. Shows the component\'s smart merging behavior.'
            }
        }
    }
};

export const LargeDataset: Story = {
    args: {
        options: [
            { key: 'total', label: 'Total Users', count: 1250000 },
            { key: 'active', label: 'Active Today', count: 89000, icon: <span style={{ color: '#4CAF50', marginRight: '6px' }}>🟢</span> },
            { key: 'premium', label: 'Premium', count: 45000, icon: <span style={{ color: '#FFD700', marginRight: '6px' }}>⭐</span> },
            { key: 'trial', label: 'Trial', count: 12500, icon: <span style={{ color: '#2196F3', marginRight: '6px' }}>🔄</span> }
        ],
        initialSelectedKey: 'total'
    },
    parameters: {
        docs: {
            description: {
                story: 'Large numbers example (millions) with professional icons. Demonstrates number formatting with commas, mixed icon styles, and various count scales. Useful for enterprise dashboards and user analytics.'
            }
        }
    }
};

export const MinimalToggle: Story = {
    args: {
        options: [
            { key: 'list', label: 'List View', count: 45 },
            { key: 'grid', label: 'Grid View', count: 45 }
        ],
        initialSelectedKey: 'list'
    },
    parameters: {
        docs: {
            description: {
                story: 'Simple two-option toggle without icons. Perfect for view mode switching, binary choices, or simple on/off states. Shows minimal configuration while maintaining full functionality.'
            }
        }
    }
};
