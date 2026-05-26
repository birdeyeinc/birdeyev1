import type { Meta, StoryObj } from '@storybook/react';
import CircularProgress from '.';

const meta: Meta<typeof CircularProgress> = {
  title: 'Atom/CircularProgress',
  component: CircularProgress,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CircularProgress>;

export const Default: Story = {
  args: {
    value: 86.4,
    size: 48,
    ringWidth: 2,
    color: '#43a047',
    offset: 2,
  },
};
