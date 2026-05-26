import type { Meta, StoryObj } from '@storybook/react';
import React, { ComponentProps } from 'react';
import { TemplateBuilderExample } from './components/example/example-editor';


type TemplateBuilderProps = ComponentProps<any>;

const meta: Meta<TemplateBuilderProps> = {
    title: "Component/TemplateBuilder",
    component: TemplateBuilderExample,
}

export default meta;

type Story = StoryObj<TemplateBuilderProps>;

export const TemplateBuilderComponent: Story = {
    render: () => {
        return <TemplateBuilderExample />;
    }
};
