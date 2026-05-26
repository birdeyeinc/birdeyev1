import { StylesProvider, TraitsProvider, useEditorMaybe } from "@grapesjs/react";
import React, { ReactNode } from "react";
import TraitManager from "../traits/trait-manager";
import StyleManager from "../styles/style-manager";
import style from "./right-panel.module.scss";
import { useComponentSelection } from "../../hooks/use-component-selection";

// Wrapper component with label and close icon
interface RightPanelWrapperProps {
    children?: ReactNode;
    className?: string;
    label?: string;
    showCloseIcon?: boolean;
    onClose?: () => void;
}

function RightPanelWrapper({ 
    children, 
    className, 
    label, 
    showCloseIcon = true, 
    onClose 
}: RightPanelWrapperProps) {
    const editor = useEditorMaybe();
    const { isComponentSelected, selectedComponent } = useComponentSelection();
    const showRightPanel = isComponentSelected;
    
    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            editor?.select(undefined); // Default: deselect the component
        }
    };

    const displayLabel = label !== undefined ? label : selectedComponent;

    return (
        <div className={`right-panel custom-scroll template-style-section ${style?.["template-style-section"]} ${showRightPanel ? `show ${style?.["show"]}` : "hide"} ${className || ""}`}>
            <div className="label-control display-flex display-flex-center justify-content-betweeen content-desc-block mb-20">
                <span className="content-heading capitalize">{displayLabel}</span>
                {showCloseIcon && (
                    <span onClick={handleClose} className="cursor-pointer">
                        <i className="icon_phoenix-enclose" />
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}

// Content component with trait and style providers
function RightPanelContent() {
    return (
        <>
            <TraitsProvider>
                {({ ...props }) => (
                    <TraitManager {...props} />
                )}
            </TraitsProvider>
            <StylesProvider>
                {({ ...props }) => (
                    <StyleManager {...props} />
                )}
            </StylesProvider>
        </>
    );
}

// Main component
interface RightPanelProps {
    children?: ReactNode;
}

function RightPanel({ children }: RightPanelProps) {
    return children ? (
        <>{children}</>
    ) : (
        <RightPanelWrapper>
            <RightPanelContent />
        </RightPanelWrapper>
    );
}

// Attach compound components
RightPanel.Wrapper = RightPanelWrapper;
RightPanel.Content = RightPanelContent;

// Default composition
RightPanel.Default = function DefaultRightPanel() {
    return (
        <RightPanelWrapper>
            <RightPanelContent />
        </RightPanelWrapper>
    );
};

export default RightPanel;