import React from 'react';
import AppFreezeComponent from './index';
import './AppFreeze.scss';

export default {
  title: 'Atom/AppFreeze',
  component: AppFreezeComponent,
} 
export const AppFreeze = {
  args: {
    enabled: true
  },
  argTypes: {
    enabled: { control: 'boolean' }
  }
};