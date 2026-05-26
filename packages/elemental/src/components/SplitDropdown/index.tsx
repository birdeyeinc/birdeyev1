import React from "react";
// @ts-ignore
import ReactDOM from "react-dom";
import ActionFooter from "./components/ActionFooter";
import LeftPanel from "./components/LeftPanel";
import RightPanelRenderer from "./components/RightPanelRenderer";
import useSplitDropdownState from "./hooks/useSplitDropdownState";
import usePortalPosition from "./hooks/usePortalPosition";
import { SplitDropdownProps } from "./interface";
import style from "./SplitDropdown.module.scss";

const SplitDropdown: React.FC<SplitDropdownProps> = ({
    items,
    onApply,
    onLeftItemChange,
    defaultSelectedKey,
    isSingleSelectLeft = false,
    triggerLabel = "Select",
    triggerJSX,
    leftPanelHeader,
    closeOnOutsideClick = true,
    autoPosition = true,
    dropdownHeight = 280,
    className = "",
    leftPanelWidth,
    isOpen: controlledIsOpen,
    onOpenChange,
    usePortal = false,
    enableKeyboardNavigation = false,
    isReseller = false
}) => {
    const {
        containerRef,
        portalPanelRef,
        isOpen,
        toggleDropdown,
        closeDropdown,
        openDirection,
        activeItemKey,
        activeItemSelection,
        committedItemKey,
        committedItem,
        activeItem,
        selectedDropdownHeight,
        draftValues,
        selectedDraftValue,
        selectedListState,
        customPanelProps,
        shouldShowRightPanel,
        handleItemClick,
        handleRightPanelValueChange,
        handleApply,
        handleClear,
        shouldShowFooter,
        focusedIndex,
        leftPanelRef,
        handleKeyDown,
    } = useSplitDropdownState({
        items,
        defaultSelectedKey,
        onApply,
        onLeftItemChange,
        isSingleSelectLeft,
        closeOnOutsideClick,
        autoPosition,
        dropdownHeight,
        isOpen: controlledIsOpen,
        onOpenChange,
        enableKeyboardNavigation,
        usePortal,
    });

    const hasSelectedItem = Boolean(activeItemSelection && shouldShowRightPanel);
    const triggerText = committedItemKey ? committedItem?.label || triggerLabel : triggerLabel;
    const dropdownClassName = `${style["dropdown-panels"]} ${openDirection === "above" ? style["open-above"] : ""}`;

    const portalPosition = usePortalPosition(containerRef, isOpen, dropdownHeight, autoPosition, usePortal, closeDropdown, portalPanelRef);

    const dropdownPanel = isOpen ? (
        <div
            ref={portalPanelRef}
            className={dropdownClassName}
            style={{
                height: hasSelectedItem ? selectedDropdownHeight : "auto",
                ...(usePortal ? {
                    position: "fixed",
                    top: portalPosition.placement === "below" ? portalPosition.top : undefined,
                    bottom: portalPosition.placement === "above" ? window?.innerHeight - portalPosition.top : undefined,
                    left: portalPosition.left,
                } : {}),
            }}
            data-test-id="el-test-split-dropdown-panels"
        >
            <div className={style["panels-body"]} data-test-id="el-test-split-dropdown-panels-body">
                <LeftPanel
                    items={items}
                    activeItemKey={activeItemKey}
                    onItemClick={handleItemClick}
                    header={leftPanelHeader}
                    leftPanelWidth={leftPanelWidth}
                    draftValues={draftValues}
                    focusedIndex={focusedIndex}
                    leftPanelRef={leftPanelRef}
                />

                {activeItem && shouldShowRightPanel && (
                    <RightPanelRenderer
                        item={activeItem.item}
                        onValueChange={handleRightPanelValueChange}
                        draftValue={selectedDraftValue}
                        customPanelProps={customPanelProps}
                        listState={selectedListState}
                        isReseller={isReseller}
                    />
                )}
            </div>

            {shouldShowFooter && (
                <ActionFooter
                    onApply={handleApply}
                    onClear={handleClear}
                />
            )}
        </div>
    ) : null;

    return (
        <div
            className={`${style["split-dropdown"]} ${className}`}
            ref={containerRef}
            onKeyDown={handleKeyDown}
            data-test-id="el-test-split-dropdown"
        >
            <button
                type="button"
                className={style["trigger"]}
                onClick={toggleDropdown}
                data-test-id="el-test-split-dropdown-trigger"
            >
                {triggerJSX || (
                    <>
                        <span className={style["trigger-label"]}>
                            {triggerText}
                        </span>
                        <i
                            className={`icon_phoenix-cheveron_open ${style["trigger-icon"]} ${isOpen ? style["trigger-icon-open"] : ""
                                }`}
                        />
                    </>
                )}
            </button>

            {usePortal
                ? ReactDOM.createPortal(dropdownPanel, document.body)
                : dropdownPanel}
        </div>
    );
};

export default SplitDropdown;