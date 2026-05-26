import Breadcrumbs1Component from './index';

export default {
    title: 'Atom/Breadcrumbs1',
    component: Breadcrumbs1Component
};

export const Breadcrumbs1 = {
    args: {
            crumbs: [
                { label: 'Home' },
                { label: 'Long Label Example That Might Overflow' },
                { label: 'Another Long Label That Could Cause ' }
            ],
            onCrumbClick: () => {},
        },
    argTypes: {
        crumbs: {
            description: 'An array of objects for each breadcrumb',
            control: 'object',
            table: {
                type: {
                    summary: 'Array',
                    detail: 'Each object in the array should have a `label` property of type string',
                },
            },
        },
        onCrumbClick: {
            description: 'Function that is called when a breadcrumb is clicked',
            action: 'onCrumbClick',
        },
    },
};