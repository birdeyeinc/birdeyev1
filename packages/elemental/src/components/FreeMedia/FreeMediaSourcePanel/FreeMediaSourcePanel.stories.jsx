import FreeMediaSourcePanel from './index';

export default {
  title: 'Modules/FreeMedia/FreeMediaSourcePanel',
  component: FreeMediaSourcePanel,
};

export const Default = {
  args: {
    sources: [
      { key: 'Pexels', label: 'Pexels', icon: 'https://via.placeholder.com/24' },
      { key: 'Giphy', label: 'Giphy', icon: 'https://via.placeholder.com/24' }
    ],
    activeSource: 'Pexels'
  }
};