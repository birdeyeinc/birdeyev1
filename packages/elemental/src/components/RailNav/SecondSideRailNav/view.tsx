/* eslint-disable react/no-multi-comp */
import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SecondSideRailNavViewProps } from "./interface";
import { isTabletDevice, getSimplifiedCount } from "utils";
import styles from "./SecondSideRailNav.module.scss";
import headerStyles from "atoms/TabHeader/TabHeader.module.scss";
import { createNewPathName } from "./helper";
import Button from "atoms/Button";
import { isEmpty } from "lodash";
import ActionBox from "atoms/ActionBox";
import { FILE_UPLOAD_STATUS } from "./constants";
import TabHeader from "atoms/TabHeader";
import Tooltip from "atoms/Tooltip";
import { MODULES } from "./constants";
import { MODULE_NAMES } from "./../constants.js";
import Chip from "atoms/Chip";

// import { push } from "redux-json-router";

const MODULES_X_HIDEEN_SUB_OPTION:string[] = ["enterprise-report"];
const MODULES_X_HIDEEN_SUB_OPTION_COUNT:any[] = [];

const SUB_SUB_MENU = {
    children: [],
    isL4MenuEnable: false,
    moduleName: "",
    shouldShowCount: true
};

// TooltipWrapper component to eliminate code repetition
interface TooltipWrapperProps {
    option: any;
    children: React.ReactNode;
    linkTextWrapper?: (html: string) => React.ReactNode;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ 
    option, 
    children, 
    linkTextWrapper = (html) => html 
}) => {
    if (!option.tooltipHTML) {
        return <>{children}</>;
    }

    return (
        <Tooltip
            tooltipClass={option?.tooltipClassName ? `${styles[option.tooltipClassName]} inner` : "inner"}
            linkText={linkTextWrapper(option.tooltipHTML)}
            text=""
            hideOnScroll
            position="right"
        >
            {children}
        </Tooltip>
    );
};

// CaptionSpan component to handle the caption rendering logic
interface CaptionSpanProps {
    option: any;
    className?: string;
    showTitle?: boolean;
}

const CaptionSpan: React.FC<CaptionSpanProps> = ({ option, className = "", showTitle = false }) => {
    const titleProp = showTitle ? { title: option.caption } : {};
    
    if (option.makeCaptionItalicAsterick) {
        return (
            <span className={`${className} italic`} {...titleProp}>
                * {option.caption}
            </span>
        );
    }
    
    return (
        <span className={className} {...titleProp}>
            {option.caption}
        </span>
    );
};

interface IL4MenuComponent {
    onTabClick?: (href: string) => void;
   changeURL?:any;
   /** Replaces the default ActionBox overflow renderer in TabHeader. Receives overflow items + clickTab. */
   overflowRenderer?: (items: any[], clickTab: (href: string) => void) => React.ReactNode;
}
export const L4MenuComponent: React.FC<IL4MenuComponent> = ({ onTabClick, changeURL, overflowRenderer }) => {
    const pathname = window.location.pathname;
    const [activeContainer, setActiveContainer] = useState<string>(() => {
        // Check if the pathname contains `ranking-`
        if (pathname.includes("ranking-") && !pathname.includes("bing") && !pathname.includes("apple")) {
            return pathname.replace(/ranking-(serp|maps)/, "ranking"); // Replace "ranking-serp" and "ranking-maps" with "ranking"
        }
        return pathname; // Default behavior
    });
    const [selectedChips, setSelectedChips] = useState<string[]>([]); // State to track selected chips

    const tabContent = useMemo(() => (
        SUB_SUB_MENU.children.map((child: any) => (
            SUB_SUB_MENU.shouldShowCount && !(SUB_SUB_MENU.moduleName === MODULES.LISTINGS_V2 || SUB_SUB_MENU.moduleName === MODULES.LISTINGS || pathname.includes(MODULES.LISTING_REPORTS)) ? {
                activeCountStyle: "count-badge--blue",
                count: child.childrenCount || 0,
                countStyle: "count-badge--gray",
                label: child.caption,
                value: child.href
            } : {
                label: child.caption,
                value: child.href
            }
        ))
    ), []);

    const chipContent = useMemo(() => {
        const selectedTab = SUB_SUB_MENU.children.find((child) => child.href.includes(activeContainer))?.children || [];
        const chips = selectedTab.map((child) => ({
            label: child.caption,
            value: child.href
        }));

        // Set the first chip as selected by default
        if (chips.length > 0 && selectedChips.length === 0) {
            setSelectedChips([chips[0].value]);
        }

        return chips;
    }, [activeContainer]);

    const clickTab = useCallback((href: string) => {
        // Check if the href contains `ranking-`
        const updatedHref = href.includes("ranking-") && !href.includes("bing") && !href.includes("apple")
            ? href.replace(/ranking-(serp|maps)/, "ranking") // Replace "ranking-serp" and "ranking-maps" with "ranking"
            : href; // Default behavior
        if(onTabClick)
            onTabClick(updatedHref);
        // dispatch(push(href));
        setActiveContainer(updatedHref);
        changeURL(href);
    }, []);

    const handleChipClick = (chipValue: string) => {
        setSelectedChips([chipValue]); // Update the selected chip
        clickTab(chipValue); // Navigate to the clicked chip
    };

    return (
        SUB_SUB_MENU.children.length && (MODULES_X_HIDEEN_SUB_OPTION.includes(SUB_SUB_MENU.moduleName) || SUB_SUB_MENU.isL4MenuEnable) ? (
            <div>
                <TabHeader
                    clickTab={clickTab}
                    activeTab={activeContainer}
                    content={tabContent}
                    showMore={true}
                    noSeperator={"true"}
                    overflowRenderer={overflowRenderer}
                />
                {chipContent.length > 0 ?
                    <div className={`chip-container ${styles["chipContainer"]}`}>
                        {chipContent.map((chip: any) => (
                            // <div
                            //     key={chip.value}
                            //     className={`${styles["chip"]} ${(pathname === chip.value) ? styles["selected"] : ''}`}
                            //     onClick={() => handleChipClick(chip.value)}
                            // >
                            //     {chip.label}
                            // </div>
                            <Chip
                                key={chip.value}
                                label={chip.label}
                                variant="outlined"
                                size="small"
                                clickable
                                onClick={() => handleChipClick(chip.value)}
                                customParentStyleClass={`${(pathname === chip.value) ? "selected-chip" : ''}`}
                            />
                        ))}
                    </div>
                    : null
                }
            </div>
        ) : null
    );
};
// export const L4MenuComponent: React.FC<IL4MenuComponent> = ({ onTabClick, changeURL }) => {
//     const [activeContainer, setActiveContainer] = useState<string>(window.location.pathname);

//     const tabContent = useMemo(() => (
//         SUB_SUB_MENU.children.map((child:any) => (
//             SUB_SUB_MENU.shouldShowCount ?
//                 {
//                     activeCountStyle: 'count-badge--blue',
//                     count: child.childrenCount || 0,
//                     countStyle: 'count-badge--gray',
//                     label: child.caption,
//                     value: child.href
//                 }
//                 :
//                 {
//                     label: child.caption,
//                     value: child.href

//                 }
//         ))
//     ), []);



//     const clickTab = useCallback((href: string) => {
//         if(onTabClick)
//             onTabClick(href);
//         // dispatch(push(href));
//         setActiveContainer(href);
//         changeURL(href);
//     }, [onTabClick]);

//     return (
//         SUB_SUB_MENU.children.length && (MODULES_X_HIDEEN_SUB_OPTION.includes(SUB_SUB_MENU.moduleName) || SUB_SUB_MENU.isL4MenuEnable) ? 
//         <TabHeader
//             clickTab={clickTab}
//             activeTab={activeContainer}
//             content={tabContent}
//             showMore={true}
//             noSeperator={"true"}
//             customClass={headerStyles["l4-menu-tab"]}
//         />
//             : null
//     );
// };

const SecondSideRailNavView: React.FC<SecondSideRailNavViewProps> = (props: SecondSideRailNavViewProps) => {
    let {
        staticMenuData,
        handleViewSubOption,
        toggleSubOptions,
        handleMouseEnter,
        handleMouseLeave,
        subSubOptions,
        handleOptionSelections,
        selectedOption,
        searchTerm,
        handleSearchInStaticMenuChildren,
        isSearchFoundInStaticMenuChildren,
        handleSubOptionCount,
        moduleName,
        ctaButtonShow,
        allowRenavigation,
        customOptionsCount,
        customOptionsCountByIdentifier,
        onContextMenuClick,
        parentIndexClicked,
        connectSocialButton,
        ctaButtonCallbackForBulkSchedule,
        bulkScheduleStatus,
        bulkSchedulngPermission,
        accordionState,
        overflowThreshold = 5,
        dispatch
    } = props;
    const isTablet = isTabletDevice() || window.innerWidth <= 1024;
    const containerRefs = useRef(staticMenuData.map(() => createRef()));
    const [selectedSubMenuParentCaption, setSelectedSubMenuParentCaption] = useState<string | undefined>(undefined);
    const [expandedParents, setExpandedParents] = useState<Set<number>>(new Set());
    
    // Effect to handle className-based state update
    useEffect(() => {
        staticMenuData.forEach((parentOption: any, parentOptionIndex: number) => {
            let isSelelected = Number(selectedOption.selectedParent) === parentOptionIndex;
            if (window?.location?.pathname === "/dashboard/social/get-started" && parentOption?.href == window?.location?.pathname) {
                isSelelected = true;
            }
            let toggledOptionData = searchTerm ? parentOption : staticMenuData[toggleSubOptions[parentOptionIndex]];

            isSelelected = isSelelected || (searchTerm && !toggleSubOptions.hasOwnProperty(parentOptionIndex) || (searchTerm && toggleSubOptions.hasOwnProperty(parentOptionIndex) && toggleSubOptions[parentOptionIndex])) || accordionState?.[parentOption?.caption];
            if (accordionState && accordionState?.[parentOption?.caption] === false && (toggleSubOptions.hasOwnProperty(parentOptionIndex) && toggleSubOptions[parentOptionIndex])) {
                isSelelected = false;
            }
            const shouldShowSubMenu =
                toggledOptionData?.children?.length > 0 ||
                accordionState?.[parentOption?.caption];
            const parentMenuClass = `${styles["custom-parentmenu-content"]}${selectedSubMenuParentCaption === parentOption.caption ? ` ${styles["selected-parent"]}` : ""}${parentOption.className ? ` ${parentOption.className}` : ""}`;
            const parentMenuboxClass = `parent-menubox ${(parentOption?.children?.length? shouldShowSubMenu : isSelelected) ? "selected-item" : ""}`;
            // If both classNames match, remove selected caption
            if (parentMenuboxClass.includes("selected-item") && parentMenuClass.includes("selected-state")) {
                setSelectedSubMenuParentCaption(undefined);
            }
        });
    }, [staticMenuData, selectedOption, searchTerm, toggleSubOptions, accordionState]);

    useEffect(() => {
        if (parentIndexClicked !== null) {
            scrollSubItemListInView(parentIndexClicked);
        }
    }, [parentIndexClicked]);

    useEffect(() => {
        if (staticMenuData.length) {
            const currentPath = window?.location?.pathname;
            let count = 0
            staticMenuData.forEach((item:any) => {
                item.children?.forEach((child:any) => {
                    child.children?.forEach((childrenOfChildren:any) => {
                        if (childrenOfChildren.href && currentPath && currentPath.includes(childrenOfChildren.href)) {
                            count++
                            SUB_SUB_MENU.isL4MenuEnable = child.l4Menu;
                            SUB_SUB_MENU.shouldShowCount = !MODULES_X_HIDEEN_SUB_OPTION_COUNT.includes(moduleName) && (child?.showCount !== null || child?.showCount !== undefined ? child.showCount : true);
                            SUB_SUB_MENU.moduleName = moduleName;
                            SUB_SUB_MENU.children = child.children;
                        } else {
                            if (!count) {
                                SUB_SUB_MENU.children = []
                            }
                        }
                    });
                });
            });
        }
        return () => {
            SUB_SUB_MENU.children = []
        }
    }, [staticMenuData, window?.location?.pathname]);


    const handleL4MenuVisibility = (shouldVisible: boolean) => {
        if (shouldVisible) {
            SUB_SUB_MENU.isL4MenuEnable = true
        } else {
            SUB_SUB_MENU.isL4MenuEnable = false
        }
    }

    const renderCtaButton = () => {
        const {
            ctaButtonType,
            ctaButtonLabel,
            ctaButtonIcon,
            ctaButtonCallback,
            ctaButtonCaption,
            ctaButtonDisabled,
            ctaButtonTooltip,
            ctaButtonDisabledClass
        } = props;
        let ctaHtml;
        switch (ctaButtonType) {
            case "large": {
                ctaHtml = (
                    <div className={(!connectSocialButton && bulkSchedulngPermission) ? "post-button-wrapper" : ""}>
                        <Button
                            label={ctaButtonLabel}
                            icon={ctaButtonIcon}
                            type="primary"
                            onClick={() => ctaButtonCallback()}
                            className={!connectSocialButton && bulkSchedulngPermission ? styles["create-post-button"] : "width-100 mb-20"}
                            disabled={ctaButtonDisabled}
                            tooltip={ctaButtonTooltip}
                        />
                        {(!connectSocialButton && bulkSchedulngPermission) && <ActionBox
                            actionConfig={{
                                categories: [{
                                    title: "",
                                    options: [{
                                        value: "bulkImport",
                                        label: (<span className={styles["option-with-icon"]}>Schedule in bulk {(bulkScheduleStatus === FILE_UPLOAD_STATUS.UPLOADING || bulkScheduleStatus === FILE_UPLOAD_STATUS.PROCESSING) && <i className="icon_phoenix-upload" />}</span>),
                                        enable: true,
                                        disabled: bulkScheduleStatus === FILE_UPLOAD_STATUS.UPLOADING || bulkScheduleStatus === FILE_UPLOAD_STATUS.PROCESSING,
                                        callBack: () => ctaButtonCallbackForBulkSchedule(),
                                        tooltipOnLabel: {
                                            customContainerClassName: styles["menu-button-tooltip-wrapper"],
                                            tooltipText: (bulkScheduleStatus === FILE_UPLOAD_STATUS.UPLOADING || bulkScheduleStatus === FILE_UPLOAD_STATUS.PROCESSING) ? "Bulk scheduling in progress" : "",
                                            isVisible: bulkScheduleStatus === FILE_UPLOAD_STATUS.UPLOADING || bulkScheduleStatus === FILE_UPLOAD_STATUS.PROCESSING
                                        }
                                    }]
                                }]
                            }}
                            actionClickCb={(selectedItem) => !(bulkScheduleStatus === FILE_UPLOAD_STATUS.UPLOADING || bulkScheduleStatus === FILE_UPLOAD_STATUS.PROCESSING) && selectedItem.callBack()}
                            noLabel
                            customClassName={styles["saved-filter-actionbox"]}
                            isBlueActionBox
                            popOverSize="medium"
                        />}
                    </div>
                );
                break;
            }

            case "small": {
                ctaHtml = (
                    <div className={styles["custom-dash-wrapper"]}>
                        <div className="custom-dash-content">
                            <h1 className={styles["custom-headingbox"]}>
                                <strong>{ctaButtonCaption}</strong>
                                <span
                                    className={styles["cursor-pointer"]}
                                    onClick={() => {
                                        const path = createNewPathName(moduleName);
                                        ctaButtonCallback(path);
                                    }}>
                                    <i className="icon_phoenix-plus" />
                                </span>
                            </h1>
                        </div>
                    </div>
                );
                break;
            }

            case "large-secondary": {
                ctaHtml = (
                    <div className={`${(!connectSocialButton && bulkSchedulngPermission) ? styles["post-button-wrapper"] : ""} ${styles["secondary-large"]}`}>
                        <div className={styles["dash-heading-box"]}
                            onClick={() => {
                                if (!ctaButtonDisabled)
                                    ctaButtonCallback();
                            }}
                        >
                            <strong>{ctaButtonLabel}</strong>
                            <span className={`${styles["cursor-pointer"]} ${ctaButtonDisabled && ctaButtonDisabledClass ? styles[ctaButtonDisabledClass] : ""} ${ctaButtonDisabled ? "dash-disabled" : ""}`}>
                                <i className="icon_phoenix-plus" />
                            </span>
                        </div>
                        {(!connectSocialButton && bulkSchedulngPermission) &&
                            <div className={styles["action-box"]}>
                                <ActionBox
                                    actionConfig={{
                                        categories: [{
                                            title: "",
                                            options: [{
                                                value: "bulkImport",
                                                label: <span className={styles["option-with-icon"]}>Schedule in bulk</span>,
                                                enable: true,
                                                disabled: bulkScheduleStatus === FILE_UPLOAD_STATUS.UPLOADING || bulkScheduleStatus === FILE_UPLOAD_STATUS.PROCESSING,
                                                callBack: () => ctaButtonCallbackForBulkSchedule()
                                            }]
                                        }]
                                    }}
                                    actionClickCb={(selectedItem) => !(bulkScheduleStatus === FILE_UPLOAD_STATUS.UPLOADING || bulkScheduleStatus === FILE_UPLOAD_STATUS.PROCESSING) && selectedItem.callBack()}
                                    noLabel
                                    customClassName={styles["saved-filter-actionbox"]}
                                    popOverSize="medium"
                                    customDropdownIcon="icon_phoenix-vertical-dots"
                                />
                            </div>
                        }
                    </div>
                );
                break;
            }

            default:
                break;
        }
        return ctaHtml;
    };

    const hideReportsOption = (parentOption:any, parentOptionIndex:any) => {
        let isHide = true;
        if (!searchTerm || !staticMenuData || !parentOption.hideOnEmptySearch) {
            return false;
        } else if (parentOption.hideOnEmptySearch) {
            staticMenuData.forEach((item:any, index:number) => {
                if (item.show && index > parentOptionIndex) {
                    isHide = false;
                }
            });
            return isHide;
        } else {
            return false;
        }
    };

    const isAllowedNavigation = (href:string) => {
        return allowRenavigation || window?.location?.pathname !== href;
    };

    const getSubMenuCount = (subOption:any) => {
        let subOptionCount = 0;
        let count = 0;
        const parentVisible = searchTerm ? subOption.show : true;
        let isAnyChildVisible = false;
        subOption?.children?.forEach((item:any) => {
            const showSubOption = searchTerm ? item.show : true;
            count += item.childrenCount || 0;
            if (showSubOption) {
                isAnyChildVisible = true;
                subOptionCount += item.childrenCount || 0;
            }
        });
        // for the case when no child is visible but parent is visible - show full count
        if (!isAnyChildVisible && parentVisible) {
            return subOption?.children ? count : subOption.childrenCount;
        }
        return subOptionCount;
    };

    const isTrulyVisible = (element) => {
        const rect = element.getBoundingClientRect();

        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const elAtPoint = document.elementFromPoint(x, y);
        return element.contains(elAtPoint) || elAtPoint === element;
    }


    const isElementInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect?.top >= 0 &&
            rect?.left >= 0 &&
            rect?.bottom <= (window?.innerHeight || document?.documentElement?.clientHeight) &&
            rect?.right <= (window?.innerWidth || document?.documentElement?.clientWidth)
        );
    };

    const scrollSubItemListInView = (index) => {
        let subItemsInViewport = true;
        const container = containerRefs.current?.[index]?.current;

        if (!container) {
            return;
        }

        subItemsInViewport = Array.from(container.children).every((child) =>
            isElementInViewport(child)
        );

        if(MODULE_NAMES.REVIEWS) {
            const selectedElement: any = Array.from(container.children).find((element:any) => element.className.includes("selected-item"))
            if (selectedElement && !isTrulyVisible(selectedElement)) {
                selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } else {
            if (!subItemsInViewport) {
                container.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };

    const toggleShowMore = (parentIndex: number) => {
        setExpandedParents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(parentIndex)) newSet.delete(parentIndex);
            else newSet.add(parentIndex);
            return newSet;
        });
    };

    const renderShowMoreToggle = (option: any, index: number) => {
        if (!(option?.children?.length) || !(option?.showMoreDisplayCount) ||
            option.children.length <= option.showMoreDisplayCount) {
            return null;
        }
        return (
            <div onClick={() => toggleShowMore(index)}>
                {
                    expandedParents.has(index) ?
                        (option?.showLessCustomJsx && option?.showLessCustomJsx()) || "Show Less" :
                        (option?.showMoreCustomJsx && option?.showMoreCustomJsx()) || "Show More"
                }
            </div>
        );
    };

    return (
        <div
            className={styles["custom-menubox"]}
            onMouseLeave={() => {
                if (!isTablet) {
                    handleMouseLeave();
                }
            }}
        >
            {ctaButtonShow ? renderCtaButton() : null}
            {/* 1st level */}
            <ul>
                {staticMenuData && staticMenuData.map((parentOption: any, parentOptionIndex: number) => {
                    if (parentOption.isSeparator) {
                        return (<li key={parentOption?.caption}>
                            <div className={`${styles["custom-dash-wrapper"]} ${parentOptionIndex ? "mt-15" : ""}`}>
                                <div className={`custom-dash-content ${parentOption.clickCallback ? styles["separator-plus"] : ""}`}>
                                    <h1 className={`${styles["custom-headingbox"]} ${hideReportsOption(parentOption, parentOptionIndex) ? "hide" : ""}`}>
                                        <TooltipWrapper option={parentOption}>
                                            <CaptionSpan option={parentOption} className={parentOption?.service === MODULES.INBOX ? styles["l3-with-tooltip-ellipses"] : ""} />
                                        </TooltipWrapper>
                                    </h1>
                                    {parentOption?.customIcon && <i className={`${parentOption.customIcon} ${styles["custom-parent-icon"]} ${styles["plus-icon"]}`} 
                                        onClick={parentOption.clickCallback ? () => {
                                            parentOption.clickCallback(dispatch);
                                        } : undefined}
                                    />}
                                </div>
                            </div>
                        </li>);
                    }
                    let showParent = searchTerm ? parentOption.show : true;
                    let isSelelected = Number(selectedOption.selectedParent) === parentOptionIndex;//staticMenuData[toggleSubOptions[parentOptionIndex]];
                    if (window?.location?.pathname === "/dashboard/social/get-started" && parentOption?.href == window?.location?.pathname) {
                        isSelelected = true;
                    }
                    let optionCount = customOptionsCountByIdentifier ? (customOptionsCount && customOptionsCount[parentOption.identifier]) : (customOptionsCount && customOptionsCount[parentOption.caption]);

                    let toggledOptionData = searchTerm ? parentOption : staticMenuData[toggleSubOptions[parentOptionIndex]];
                    if ((searchTerm && toggleSubOptions.hasOwnProperty(parentOptionIndex) && !toggleSubOptions[parentOptionIndex])) { // on hide updating data
                        toggledOptionData = staticMenuData[toggleSubOptions[parentOptionIndex]];
                    }
                    if (accordionState && !accordionState?.[parentOption?.caption] && Object.keys(accordionState)?.length) {
                        toggledOptionData = undefined;
                    }
                    isSelelected = isSelelected || (searchTerm && !toggleSubOptions.hasOwnProperty(parentOptionIndex) || (searchTerm && toggleSubOptions.hasOwnProperty(parentOptionIndex) && toggleSubOptions[parentOptionIndex])) || accordionState?.[parentOption?.caption];
                    if (accordionState && accordionState?.[parentOption?.caption] === false && (toggleSubOptions.hasOwnProperty(parentOptionIndex) && toggleSubOptions[parentOptionIndex])) {
                        isSelelected = false;
                    }
                    const shouldShowSubMenu =
                        toggledOptionData?.children?.length > 0 ||
                        accordionState?.[parentOption?.caption];

                    const subMenuClass = `${styles["custom-submenubox"]} ${shouldShowSubMenu ? styles["open"] + " " + (toggledOptionData?.children?.length < overflowThreshold ? styles["overflow-visible"] : "custom-scroll") : styles["close"]}`;
                    const subMenuStyle = { maxHeight: shouldShowSubMenu ? 340 : 0 };
                    const isSelectedParent = selectedSubMenuParentCaption === parentOption.caption;
                    const parentMenuClass = `${styles["custom-parentmenu-content"]}${isSelectedParent ? ` ${styles["selected-parent"]}` : ""}${parentOption.className ? ` ${parentOption.className}` : ""}`;

                    const shouldSetCaption =
                        ((toggledOptionData?.children?.length > 0) ||
                            accordionState?.[parentOption?.caption] ||
                            (parentOptionIndex !== selectedOption.selectedParent)) && parentOption?.children?.length;

                    const childrenList = !!(parentOption?.children && parentOption?.showMoreDisplayCount && (parentOption.children.length > parentOption.showMoreDisplayCount) && !expandedParents.has(parentOptionIndex)) 
                        ? parentOption?.children?.slice(0, parentOption.showMoreDisplayCount)
                        : parentOption?.children;

                    const removeSelectedSubMenuParentCaption = () => {
                        setSelectedSubMenuParentCaption(undefined);
                    };

                    const handleParentMenuClick = (e, parentOption) => {
                        if (shouldSetCaption) {
                            setSelectedSubMenuParentCaption(staticMenuData[selectedOption?.selectedParent]?.caption);
                        } else {
                            removeSelectedSubMenuParentCaption();
                        }

                        if (parentOption?.children?.length) {
                            if (!shouldShowSubMenu) {
                                if (typeof parentOption?.onAccordionClick === 'function') {
                                    parentOption.onAccordionClick(parentOption.caption);
                                }
                            }
                            handleViewSubOption(parentOptionIndex, searchTerm);
                        } else {
                            const shouldNavigate = parentOption.href && (!isSelelected || isAllowedNavigation(parentOption.href));
                            handleOptionSelections(e, parentOptionIndex, null, null, shouldNavigate ? parentOption.href : "", parentOption);
                        }
                    };
                    return (
                        parentOption && showParent && <li>
                            <div className={`${styles["parent-menubox"]} ${(parentOption?.children?.length? shouldShowSubMenu : isSelelected) ? styles["selected-item"] : ""}`}>
                                <div className={parentMenuClass} onClick={(e) => handleParentMenuClick(e, parentOption)}
                                    onMouseEnter={() => {
                                        if (!isTablet) {
                                            handleMouseEnter(parentOptionIndex, null);
                                        }
                                    }} >
                                    {parentOption?.children?.length ? <span className={styles["custommenu-icon"]} /> : parentOption.rightIconClass ? <i className={parentOption.rightIconClass} /> : parentOption.contextMenu && parentOption?.createdBy?.id == window.BE.user.id && onContextMenuClick ?
                                        <ActionBox
                                            popOverSize={"small"}
                                            customClassName={styles["saved-filter-actionbox"]}
                                            popOverDirection={"left"}
                                            openBasedOnWindowHeight
                                            actionConfig={{
                                                categories: [{
                                                    title: "",
                                                    options: parentOption.contextMenu.options
                                                }]
                                            }}
                                            overrideDefault
                                            actionClickCb={(value) => onContextMenuClick(value, parentOption)}
                                            customSelectionJsx={
                                                <span className={styles["delete-saved-filter"]} id="li-icon-dropdown">
                                                    <i className="icon_phoenix-vertical-menu phoenix-icon" />
                                                </span>
                                            }
                                            scrollActionBoxIntoView
                                            scrollActionBoxBehaviour="nearest" /> : null}
                                    <h2>
                                        <div className={`${styles["caption-text"]} ${selectedSubMenuParentCaption === parentOption.caption ? styles["active-parent"] : ""}`}>
                                            <TooltipWrapper option={parentOption}>
                                                <CaptionSpan option={parentOption} className={parentOption?.service == MODULES.INBOX ? styles["l3-with-tooltip-ellipses"] : ""} />
                                            </TooltipWrapper>
                                            {!!parentOption.showAIIcon && <span className={styles['ai-icon-container']}><i className="icon_phoenix-ai-icon" /></span>}
                                            {!!parentOption.isBeta && !parentOption.isNewFeature && <span className={styles["betaPill"]}>BETA</span>}
                                        </div>
                                        {optionCount && (!parentOption.children || !parentOption.children.length) ? <span className={styles["child-count"]}>{getSimplifiedCount(optionCount)}</span> : optionCount === 0 ? <span className={styles["child-count"]}>0</span> : null}
                                        {parentOption.isNewFeature && (<span className={styles["new-feature"]}>NEW</span>)}
                                        {parentOption.showTabWarning && parentOption.tabWarningJSX}
                                        {parentOption?.flatCount ? <span className={styles["child-count"]}>{parentOption.flatCount}</span> : null}
                                    </h2>

                                    {parentOption?.customIcon && <i className={`${parentOption.customIcon} ${styles["custom-parent-icon"]}`} />}
                                </div>
                                <span className="custom-numericbox hidden">{handleSubOptionCount(parentOption)}</span>

                            </div>
                            {/* {toggledOptionData?.children?.length > 0 || accordionState?.[parentOption?.caption] ? <div className={`${styles["custom-submenubox"]} ${toggledOptionData?.children?.length > 0 || accordionState?.[parentOption?.caption] ? `${styles["open"]} custom-scroll` : styles["close"]}`} style={{ maxHeight: toggledOptionData?.children?.length > 0 || accordionState?.[parentOption?.caption] ? 340 : 0 }} ref={containerRefs?.current?.[parentOptionIndex]}> */}
                               { 
                               shouldShowSubMenu ?
                                <div className={subMenuClass}
                                    style={subMenuStyle}
                                    ref={containerRefs?.current?.[parentOptionIndex]}>
                                {/* 2nd level */}
                                {childrenList?.map?.((subOption: any, subIndex: number) => {
                                    const showSubOption = searchTerm ? subOption.show : true;
                                    let optionCount = null;
                                    if (customOptionsCount && customOptionsCount[parentOption.caption] && typeof customOptionsCount[parentOption.caption] != "number") {
                                        optionCount = customOptionsCount[parentOption.caption]?.[subOption.caption];
                                    } else {
                                        optionCount = (customOptionsCount && customOptionsCount[subOption.caption]) || getSubMenuCount(subOption);
                                    }

                                    const isSubOptionSelected = parentOption.isDashboard ?
                                        subOption?.isDefault ? subOption.href === `${window?.location?.pathname}${window?.location?.search}` : (
                                            subOption.href == window?.location?.pathname
                                        ) : (
                                            selectedOption.selectedParent === parentOptionIndex && selectedOption.selectedSubOption === subIndex
                                        );
                                    return (
                                        subOption && !isEmpty(subOption) && showSubOption && <div key={subOption?.caption} className={`${styles["custom-submenucontent"]} ${isSubOptionSelected ? styles["selected-item"] : (selectedOption.hoverParent === parentOptionIndex && selectedOption.hoverSubOption === subIndex) ? styles["hover-item"] : ""} `}>
                                            {!subOption.href ?
                                                <li
                                                    id={`suboption-${parentOptionIndex}-${subIndex}`}
                                                    onMouseEnter={() => {
                                                        if (!isTablet) {
                                                            let shouldShowTabView = false; 

                                                            if (subOption?.l4Menu) {
                                                                shouldShowTabView = subOption?.l4Menu;
                                                            }

                                                            if (!subOption?.l4Menu) {
                                                                shouldShowTabView = MODULES_X_HIDEEN_SUB_OPTION.includes(moduleName); 
                                                            }

                                                            if (shouldShowTabView) { 
                                                                handleL4MenuVisibility(true); // tab view
                                                            } else {
                                                                handleMouseEnter(parentOptionIndex, subIndex); // pophover
                                                            }
                                                        }
                                                    }}
                                                    onClick={(e) => {
                                                        sessionStorage?.removeItem("L4TabContent");
                                                        removeSelectedSubMenuParentCaption();
                                                        if (MODULES_X_HIDEEN_SUB_OPTION.includes(moduleName) || subOption.l4Menu) {
                                                            handleL4MenuVisibility(false)
                                                            handleOptionSelections(e, parentOptionIndex, subIndex, null, (subOption.children[0].href && (!isSubOptionSelected || isAllowedNavigation(subOption.children[0].href))) ? subOption.children[0].href : "", subOption?.children[0])
                                                        }
                                                        if (isTablet) {
                                                            handleMouseEnter(parentOptionIndex, subIndex);
                                                        }
                                                    }}
                                                >
                                                    <span className={styles["caption"]} title={subOption.caption}>
                                                        <TooltipWrapper 
                                                            option={subOption}
                                                            linkTextWrapper={(html) => <span className={styles["tooltip-text"]}>{html}</span>}
                                                        >
                                                            <CaptionSpan option={subOption} className={subOption?.service == MODULES.INBOX ? styles["l3-with-tooltip-ellipses"] : ""} showTitle />
                                                        </TooltipWrapper>
                                                    </span>
                                                     {!MODULES_X_HIDEEN_SUB_OPTION_COUNT.includes(moduleName) &&
                                                        subOption?.showCount !== false && optionCount ? (
                                                        <span className={styles["child-count"]}>{getSimplifiedCount(optionCount)}</span>
                                                    ) : null}
                                                    {subOption.contextMenu?.options?.length && onContextMenuClick ?
                                                        <ActionBox
                                                            popOverSize={"small"}
                                                            customClassName={styles["saved-filter-actionbox"]}
                                                            popOverDirection={"left"}
                                                            openBasedOnWindowHeight
                                                            actionConfig={{
                                                                categories: [{
                                                                    title: "",
                                                                    options: subOption.contextMenu.options
                                                                }]
                                                            }}
                                                            overrideDefault
                                                            actionClickCb={(value) => onContextMenuClick(value, subOption)}
                                                            customSelectionJsx={
                                                                <span className={styles["delete-saved-filter"]} id="li-icon-dropdown">
                                                                    <i className="icon_phoenix-vertical-menu phoenix-icon" />
                                                                </span>
                                                            }
                                                            scrollActionBoxIntoView
                                                            scrollActionBoxBehaviour="nearest" /> : null}
                                                        {subOption?.flatCount && <span className={styles["child-count"]}>{subOption.flatCount}</span>}
                                                </li>
                                                :
                                                <li id={`suboption-${parentOptionIndex}-${subIndex}`} className="non-subgroup-content" onClick={(e) => {
                                                    removeSelectedSubMenuParentCaption();
                                                    handleOptionSelections(e, parentOptionIndex, subIndex, null, (subOption.href && (!isSubOptionSelected || isAllowedNavigation(subOption.href))) ? subOption.href : "", subOption);
                                                }}
                                                    onMouseEnter={() => {
                                                        if (!isTablet) {
                                                            handleMouseEnter(parentOptionIndex, subIndex);
                                                        }
                                                    }}>
                                                    <span className={styles["caption"]} title={subOption.caption}>
                                                        <TooltipWrapper option={subOption}>
                                                            <CaptionSpan option={subOption} className={subOption?.service == MODULES.INBOX ? styles["l3-with-tooltip-ellipses"] : ""} />
                                                        </TooltipWrapper>
                                                    </span>
                                                    {!MODULES_X_HIDEEN_SUB_OPTION_COUNT.includes(moduleName) &&
                                                        subOption?.showCount !== false && optionCount ? <span className={styles["child-count"]}>{getSimplifiedCount(optionCount)}</span> : null}
                                                    {subOption.isNewFeature && (<span className={styles["new-feature"]}>NEW</span>)}
                                                    {subOption.showTabWarning && subOption.tabWarningJSX}
                                                    {subOption?.customIcon && <i className={`${subOption.customIcon} custom-sub-icon`} />}
                                                    {!!subOption?.isBeta && !subOption?.isNewFeature && <span className={styles["betaPill"]}>BETA</span>}
                                                    {subOption.contextMenu?.options?.length && onContextMenuClick ?
                                                        <ActionBox
                                                            popOverSize={"small"}
                                                            customClassName={styles["saved-filter-actionbox"]}
                                                            popOverDirection={"left"}
                                                            openBasedOnWindowHeight
                                                            actionConfig={{
                                                                categories: [{
                                                                    title: "",
                                                                    options: subOption.contextMenu.options
                                                                }]
                                                            }}
                                                            overrideDefault
                                                            actionClickCb={(value) => onContextMenuClick(value, subOption)}
                                                            customSelectionJsx={
                                                                <span className={styles["delete-saved-filter"]} id="li-icon-dropdown">
                                                                    <i className="icon_phoenix-vertical-menu phoenix-icon" />
                                                                </span>
                                                            }
                                                            scrollActionBoxIntoView
                                                            scrollActionBoxBehaviour="nearest" /> : null}
                                                        {subOption?.flatCount && <span className={styles["child-count"]}>{subOption.flatCount}</span>}
                                                </li>
                                            }
                                            {/* 3rd level */}
                                            {(subSubOptions.parentIndex === parentOptionIndex && subSubOptions.index === subIndex) && subSubOptions && subSubOptions.children && subSubOptions.children.length > 0 ?
                                                <ul
                                                    className={`${styles["custom-submenulist"]} custom-scroll`}
                                                    onScroll={(e) => e.stopPropagation()}
                                                    style={
                                                        parentOptionIndex === 0 &&
                                                            handleSubOptionCount(parentOption) > 3 &&
                                                            subIndex > 2
                                                            ? { left: subSubOptions.left, top: subSubOptions.top }
                                                            : { top: subSubOptions.top, left: subSubOptions.left }
                                                    }
                                                >
                                                    {subSubOptions.children.map((childOption: any, subSubIndex: number) => {
                                                        if (childOption.show && !isSearchFoundInStaticMenuChildren) {
                                                            handleSearchInStaticMenuChildren(true);
                                                        }
                                                        const showSubSubOption = searchTerm ? childOption.show ? true : subOption.show ? isSearchFoundInStaticMenuChildren ? false : true : true : true;
                                                        const isSelected = selectedOption.selectedParent === parentOptionIndex && selectedOption.selectedSubOption === subIndex && selectedOption.selectedSubSubOption === subSubIndex;
                                                        return (
                                                            childOption && showSubSubOption && <li className={isSelected && styles["selected-item"]}>
                                                                <div
                                                                    key={childOption?.caption}
                                                                    className={styles["custom-submenu-item"]}
                                                                    onClick={(e) => {
                                                                        removeSelectedSubMenuParentCaption();
                                                                        handleOptionSelections(e, parentOptionIndex, subIndex, subSubIndex, (childOption.href && !isSelected) ? childOption.href : "",childOption);
                                                                    }}
                                                                    title={childOption.caption}
                                                                >
                                                                    {childOption.caption}
                                                                    {childOption?.childrenCount && <span className={styles["child-count"]}>{childOption?.childrenCount}</span>}
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul> : null}
                                        </div>
                                    );
                                })}
                                {renderShowMoreToggle(parentOption, parentOptionIndex)}
                            </div> : null}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};


export default SecondSideRailNavView;
