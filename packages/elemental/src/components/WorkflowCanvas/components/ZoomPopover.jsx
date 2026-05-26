import React, { useCallback } from 'react';
import Button from "atoms/Button";
import Popover from "atoms/Popover";
import Tooltip from "atoms/Tooltip";
import { useReactFlow, useViewport } from '@xyflow/react';

const ZOOM_OPTIONS = [
    { label: `Zoom in`, value: "zoom_in" },
    { label: `Zoom out`, value: "zoom_out" },
    { label: `Zoom to fit`, value: "fit_view" },
];

const ZoomPopover = ({ wrapperClass, isOpen, handleZoomPopover, handleZoomCallback, isVertical = true, removeFitView = false }) => {
    const rf = useReactFlow();
    const { zoom } = useViewport();

    const handleZoomAction = useCallback(
        (selectedValue) => {
            switch (selectedValue) {
                case "zoom_in":
                    try {
                        rf.zoomTo(zoom + 0.25, { duration: 200 });
                    } catch { }
                    break;
                case "zoom_out":
                    try {
                        rf.zoomTo(zoom - 0.25, { duration: 200 });
                    } catch { }
                    break;
                case "fit_view":
                    rf.fitView({
                        duration: 400,
                        padding: isVertical ? 0.4 : 0,
                        maxZoom: 1
                    });
                    break;
                default:
                    break;
            }
            handleZoomCallback();
        },
        [zoom]
    );

    return (
        <Popover
            float="right"
            onMouseClick={handleZoomPopover}
            showOnClick={isOpen}
            enableClick
            fixed
            size="medium"
            customId={`zoom-popover`}
            showBtnIcon
            custom={
                <Tooltip text={"Zoom options"} position="top">
                    <Button type="secondary" theme={"secondary"} className="zoom-button">
                        {
                            <>
                                {Math.round(zoom * 100)}%
                                <i className="icon_phoenix-down-arrow ml-4" />
                            </>
                        }
                    </Button>
                </Tooltip>
            }
            customClick
            className={`layout-dropdown ${wrapperClass}`}
            >
                <div className={`action-table-popover ${isOpen ? "open-popover" : "hidden"}`} onClick={(e) => e.stopPropagation()}>
                    <div className="zoom-block">
                        {ZOOM_OPTIONS.filter(option => !(removeFitView && option.value === "fit_view")).map((option) => (
                            <div className={`option-item`} key={option.value} onClick={() => handleZoomAction(option?.value)}>
                                {option.label}
                            </div>
                        ))}
                    </div>
                </div>
        </Popover>
    );
};

export default ZoomPopover;