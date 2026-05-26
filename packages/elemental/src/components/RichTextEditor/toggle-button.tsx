import React from "react";
import Button from "atoms/Button";
import Tooltip from "atoms/Tooltip";
import { ToggleButtonProps } from "./types";


export const ToggleButton = ({ children, active, className, tooltipText, ...props }: ToggleButtonProps) => {
    const button = (
        <Button type="secondary" className={`toggle-button mr-4 display-flex justify-content-center display-flex-center ${active ? "active" : ""} ${className}`} {...props}>
            {children}
        </Button>
    );

    if (tooltipText) {
        return (
            <Tooltip text={tooltipText}>
                {button}
            </Tooltip>
        );
    }

    return button;
};
