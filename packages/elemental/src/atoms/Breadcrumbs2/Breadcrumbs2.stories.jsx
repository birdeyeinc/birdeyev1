import Breadcrumbs2Component from './index';

export default {
  title: "Atom/Breadcrumbs2",
  component: Breadcrumbs2Component
};

export const Breadcrumbs2 = {
  args: {
    items: [
      { label: 'Home' , href: '/'},
      { label: 'Long Label Example That Might Overflow' , onClick: () => {} },
      { label: 'Another Long Label That Could Cause ' , href: '#' }
      ]
  }
};
