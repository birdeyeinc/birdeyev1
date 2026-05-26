import React from 'react';
import CommonDrawerComponent from './index';

export default {
  title: 'Atom/CommonDrawer',
  component: CommonDrawerComponent,
}

export const CommonDrawer = {
  args: {
    isOpen: true,
    title: 'Example Drawer',
    children: <div style={{ padding: '20px' }}>This is some content inside the drawer.</div>,
    onClose: () => alert('Close button clicked'),
    width: '650px',
    shouldScroll: false,
    headerRightContent: null,
    buttonPosition: 'left',
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    width: { control: 'text' },
    shouldScroll: { control: 'boolean' },
    buttonPosition: {
      control: { type: 'radio' },
      options: ['right', 'left'],
    },
    onClose: { action: 'closed' },
  },
};