import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import GridContainerComponent from './GridContainer';
import GridItem from './GridItem';

type GridContainerProps = React.ComponentProps<typeof GridContainerComponent>;

const meta: Meta<GridContainerProps> = {
    title: "Atom/GridContainer",
    component: GridContainerComponent,
}

export default meta;

type Story = StoryObj<GridContainerProps>;

export const GridContainer: Story = {
    args: {
        gridLayouts: {
            lg: [
                { i: "a", x: 0, y: 0, w: 3, h: 2 },
                { i: "b", x: 3, y: 0, w: 3, h: 2 },
                { i: "c", x: 6, y: 0, w: 3, h: 2 },
                { i: "d", x: 9, y: 0, w: 3, h: 2 },
                { i: "e", x: 0, y: 2, w: 3, h: 2 },
                { i: "f", x: 3, y: 2, w: 3, h: 2 },
                { i: "g", x: 6, y: 2, w: 3, h: 2 },
                { i: "h", x: 9, y: 2, w: 3, h: 2 }
            ]
        },
        children: [
            <GridItem key="a" layoutConfig={{ i: "a", x: 0, y: 0, w: 3, h: 2 }} isDefaultEditable isDraggable isResizable>
                <div style={{ margin: 20 }}>Grid Item 1</div>
            </GridItem>,
            <GridItem key="b" layoutConfig={{ i: "b", x: 1, y: 0, w: 3, h: 2 }} isDraggable isResizable>
                <div style={{ margin: 20 }}>Grid Item 2</div>
            </GridItem>,
            <GridItem key="c" layoutConfig={{ i: "c", x: 4, y: 0, w: 3, h: 2 }} isDraggable isResizable>
                <div style={{ margin: 20 }}>Grid Item 3</div>
            </GridItem>,
            <GridItem key="d" layoutConfig={{ i: "d", x: 7, y: 0, w: 3, h: 2 }} isDraggable isResizable>
                <div style={{ margin: 20 }}>Grid Item 4</div>
            </GridItem>,
            <GridItem key="e" layoutConfig={{ i: "e", x: 0, y: 2, w: 3, h: 2 }} isDraggable isResizable>
                <div style={{ margin: 20 }}>Grid Item 5</div>
            </GridItem>,
            <GridItem key="f" layoutConfig={{ i: "f", x: 3, y: 2, w: 3, h: 2 }} isDraggable isResizable>
                <div style={{ margin: 20 }}>Grid Item 6</div>
            </GridItem>,
            <GridItem key="g" layoutConfig={{ i: "g", x: 6, y: 2, w: 3, h: 2 }} isDraggable isResizable>
                <div style={{ margin: 20 }}>Grid Item 7</div>
            </GridItem>,
            <GridItem key="h" layoutConfig={{ i: "h", x: 9, y: 2, w: 3, h: 2 }} isDraggable isResizable>
                <div style={{ margin: 20 }}>Grid Item 8</div>
            </GridItem>
        ],
        isResizable: true,
        isDraggable: true,
        onBreakpointChange: () => { },
        onLayoutChange: () => { },
        handleResizeStop: () => { },
        handleOnDragStop: () => { },
        handleOnResize: () => { },
        handleOnDrag: () => { },
        customRowHeight: undefined,
        customMargin: undefined,
        customResizeHandles: ["e", "s", "w", "ne", "se", "sw", "nw"],
        customResizeHandleTemplate: null
    },
    argTypes: {
        gridLayouts: { control: { type: "object" } },
        children: { control: { type: "object" } },
        isResizable: { control: { type: "boolean" } },
        isDraggable: { control: { type: "boolean" } },
        onBreakpointChange: { control: { type: "function" } },
        onLayoutChange: { control: { type: "function" } },
        handleResizeStop: { control: { type: "function" } },
        handleOnDragStop: { control: { type: "function" } },
        handleOnResize: { control: { type: "function" } },
        handleOnDrag: { control: { type: "function" } },
        customRowHeight: { control: { type: "number" } },
        customMargin: { control: { type: "array" } },
        customResizeHandles: { control: { type: "array" } },
        customResizeHandleTemplate: { control: { type: "object" } }
    }
};
