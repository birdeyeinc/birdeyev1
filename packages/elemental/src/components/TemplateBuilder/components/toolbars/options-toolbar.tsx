import React, { PropsWithChildren, ReactNode, useState } from "react";
import {
    DEFAULT_TOOLBAR_DEVICES,
    DEFAULT_TOOLBAR_OPTIONS,
    DEVICE_COMMAND,
    ToolbarDeviceType,
    ToolbarOptionType
} from "../../utils/constants";
import Tooltip from "atoms/Tooltip";
import Button from "atoms/Button";
import { useEditorMaybe } from "@grapesjs/react";
import style from "./options-toolbar.module.scss";

const DefaultLeft = () => {
    return (
        <div className="left-section">
            <span></span>
        </div>
    );
};

const DefaultCenter = () => {
    const editor = useEditorMaybe();
    const [activeDevice, setActiveDevice] = useState<ToolbarDeviceType>(DEVICE_COMMAND.DESKTOP);
    const handleDeviceCommand = (command: ToolbarDeviceType) => {
        editor?.setDevice(command);
        setActiveDevice(command);
    };

    return (
        <div className={`center-section display-flex display-flex-center ${style?.["toolbar-tabs"]}`}>
            {DEFAULT_TOOLBAR_DEVICES.map((option) => (
                <div
                    className={`display-flex display-flex-center justify-content-center ${style?.["btn-link"]} ${activeDevice === option.value ? `${style?.["active"]}` : ""}`}
                    key={option.type}
                    onClick={() => handleDeviceCommand(option?.value)}
                >
                    <i className={option.icon} />
                </div>
            ))}
        </div>
    )
};

const DefaultRight = ({ extraOptions }: { extraOptions?: React.ReactNode }) => {
    const editor = useEditorMaybe();

    const handleOptionCommand = (command: ToolbarOptionType) => {
        switch (command) {
            default:
                editor?.runCommand(command);
                break;
        }
    };
    return (
        <div className={`right-section toolbar-options display-flex display-flex-center ${style?.["toolbar-options"]}`}>
            {DEFAULT_TOOLBAR_OPTIONS.map((option) => (
                <Tooltip
                    text={option.label}
                    position={"bottom"}
                >
                    <Button
                        type="secondary"
                        key={option.type}
                        onClick={() => handleOptionCommand(option?.value)}
                    >
                        <i className={option?.icon} />
                    </Button>
                </Tooltip>
            ))}
            {/* EXTRA OPTIONS */}
            {extraOptions ? extraOptions : null}
        </div>
    )
};

const Default = () => {
    return (
        <>
            <DefaultLeft />
            <DefaultCenter />
            <DefaultRight />
        </>
    );
};

function OptionsToolbar({ children }: PropsWithChildren<any>) {

    return (
        <div id="options-toolbar" className={`display-flex display-flex-center justify-content-betweeen ${style?.["toolbar-container"]}`}>
            {children}
        </div>
    );
};

// Sub-components with proper types
interface SectionProps {
    children?: ReactNode;
    className?: string;
}

OptionsToolbar.Left = ({ children, className }: SectionProps) => (
    <div className={`left-section ${className || ""}`}>{children}</div>
);

OptionsToolbar.Center = ({ children, className }: SectionProps) => (
    <div className={`center-section ${className || ""}`}>{children}</div>
);

OptionsToolbar.Right = ({ children, className }: SectionProps) => (
    <div className={`right-section ${className || ""}`}>{children}</div>
);

OptionsToolbar.Default = Default;
OptionsToolbar.DefaultLeft = DefaultLeft;
OptionsToolbar.DefaultCenter = DefaultCenter;
OptionsToolbar.DefaultRight = DefaultRight;


export default OptionsToolbar;