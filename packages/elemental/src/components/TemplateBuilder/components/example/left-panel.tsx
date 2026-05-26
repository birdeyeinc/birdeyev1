import { BlocksProvider, BlocksResultProps } from "@grapesjs/react";
import { DynamicAccordion } from "atoms/Accordion";
import React, { ReactNode } from "react";
import BlockManager from "../blocks/block-manager";
import style from "./left-panel.module.scss";

// Wrapper component for the left panel container
interface LeftPanelWrapperProps {
    children?: ReactNode;
    className?: string;
}

function LeftPanelWrapper({ children, className }: LeftPanelWrapperProps) {
    return (
        <div className={`chat-section ${style?.["chat-section"]} ${className || ""}`}>
            <div className={`manual-editor-container ${style?.["manual-editor-container"]}`}>
                {children}
            </div>
        </div>
    );
}

// Content component with blocks provider and accordion
interface LeftPanelContentProps {
    items?: any[];
}

function LeftPanelContent({ items = [] }: LeftPanelContentProps) {
    const getEditorBlocks = (props: BlocksResultProps) => {
        try {
            return Array.from(props?.mapCategoryBlocks ?? [])?.map(([category, blocks], index) => ({
                title: category || `Category ${index + 1}`,
                content: (
                    <BlockManager
                        {...props}
                        blocks={blocks || []}
                    />
                ),
            })) || [];
        } catch (error) {
            console.warn("Error in rendering editor blocks: ", error);
            return [];
        }
    };

    return (
        <BlocksProvider>
            {({ ...props }) => (
                <DynamicAccordion
                    defaultOpenIndex={[0]}
                    items={[...items, ...getEditorBlocks(props)]}
                />
            )}
        </BlocksProvider>
    );
}

// Main component
interface LeftPanelProps {
    children?: ReactNode;
    items?: any[];
}

function LeftPanel({ children, items = [] }: LeftPanelProps) {
    return children ? (
        <>{children}</>
    ) : (
        <LeftPanelWrapper>
            <LeftPanelContent items={items} />
        </LeftPanelWrapper>
    );
}

// Attach compound components
LeftPanel.Wrapper = LeftPanelWrapper;
LeftPanel.Content = LeftPanelContent;

// Default composition
LeftPanel.Default = function DefaultLeftPanel({ items = [] }: { items?: any[] }) {
    return (
        <LeftPanelWrapper>
            <LeftPanelContent items={items} />
        </LeftPanelWrapper>
    );
};

export default LeftPanel;