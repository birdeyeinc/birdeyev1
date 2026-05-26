import React from "react";
import PropTypes from "prop-types";
import onClickOutside from "react-onclickoutside";
import { SecondSideRailNavProps, SecondSideRailNavState } from "./interface";
import SecondSideRailNavView from "./view";
import styles from "./SecondSideRailNav.module.scss"
import { SUB_MENU_POP_UP_MAX_HEIGHT } from "./constants";
import { createNewPathName } from "./helper";
import { isEqual } from "lodash";

class SecondSideRailNav extends React.Component<SecondSideRailNavProps, SecondSideRailNavState> {
    shouldUpdate: boolean;
    parentIndexClicked: number | null;
    constructor(props) {
        super(props);
        const defaultSelectedParent = props.selectedOption && props.selectedOption.selectedParent;
        this.state = {
            toggleSubOptions: defaultSelectedParent ? { [defaultSelectedParent]: defaultSelectedParent } : { 0: 0 },
        };
        this.shouldUpdate = false;
        this.parentIndexClicked = null;
    }

    componentDidMount(): void {
        this.shouldUpdate = false;
    }

    componentWillReceiveProps(nextProps: SecondSideRailNavProps): void {
        if (this.props.searchTerm !== nextProps.searchTerm) {
            this.shouldUpdate = true;
            const defaultSelectedParent = nextProps?.selectedOption && nextProps?.selectedOption?.selectedParent;
            this.setState({
                toggleSubOptions: defaultSelectedParent ? { [defaultSelectedParent]: defaultSelectedParent } : { 0: 0 }
            });
        }
        if (this.props?.selectedOption?.selectedParent !== nextProps?.selectedOption?.selectedParent || this.props?.selectedOption?.selectedSubOption !== nextProps?.selectedOption?.selectedSubOption) {
            const prevToggleOptionState = this.state.toggleSubOptions;
            const defaultSelectedParent = nextProps?.selectedOption && nextProps?.selectedOption?.selectedParent;
            const preventDefaultSubOptionClose = this.props?.preventDefaultSubOptionClose;

            const isChildrenExist = this.props?.selectedOption?.selectedSubOption || this.props?.selectedOption?.selectedSubOption == 0;
            const updatedSelectedOption = isChildrenExist ? {} : { [this.props?.selectedOption?.selectedParent]: null };

            let updatedToggleSubOptions = defaultSelectedParent ? { [defaultSelectedParent]: defaultSelectedParent } : { 0: 0 };

            if (preventDefaultSubOptionClose) {
                updatedToggleSubOptions = defaultSelectedParent ? { ...prevToggleOptionState, ...updatedSelectedOption, [defaultSelectedParent]: defaultSelectedParent } : { 0: 0, ...prevToggleOptionState, ...updatedSelectedOption };
            }
            this.setState({
                toggleSubOptions: updatedToggleSubOptions
            });
        }
        if(nextProps.resetParentAccordionIndex!==null){
           if(!isEqual(nextProps.resetParentAccordionIndex,this.props.resetParentAccordionIndex)){
            this.handleViewSubOption(nextProps.resetParentAccordionIndex, '');
           }
        }
        if (!isEqual(nextProps.staticMenuData, this.props.staticMenuData)) {
            this.shouldUpdate = true;
        }
        if (!isEqual(nextProps.customOptionsCount, this.props.customOptionsCount)) {
            this.shouldUpdate = true;
        }
    }

    shouldComponentUpdate(): boolean {
        return this.shouldUpdate;
    }


    //close subsuboption popup on click outside
    handleClickOutside = () => {
        const { handleSelectedOption, selectedOption } = this.props;
        handleSelectedOption({ ...selectedOption, hoverParent: null, hoverSubOption: null }, true, false);
        this.props.updateSubSubOptions({});
        this.shouldUpdate = true;
    }

    //to show suboption on click of parent option (eg: review, inbox)
    handleViewSubOption = (parentOptionIndex: number, searchTerm: string) => {
        const { handleSelectedOption, selectedOption, closeAccordionHandler } = this.props;
        let toggleSuboption = { ...this.state.toggleSubOptions };
        let isKeyAdded = toggleSuboption.hasOwnProperty(parentOptionIndex);
        if (searchTerm && !isKeyAdded) {
            this.setState({
                toggleSubOptions: { ...this.state.toggleSubOptions, [parentOptionIndex]: null }
            });
        } else if (typeof (this.state.toggleSubOptions[parentOptionIndex]) === "number") {
            this.setState({
                toggleSubOptions: { ...this.state.toggleSubOptions, [parentOptionIndex]: null }
            });
            this.props.updateSubSubOptions({});
        } else {
            this.setState({
                toggleSubOptions: { [parentOptionIndex]: parentOptionIndex }
            });
            this.parentIndexClicked = parentOptionIndex;
        }
        closeAccordionHandler(parentOptionIndex);
        handleSelectedOption({ ...selectedOption, hoverParent: null, hoverSubOption: null }, true, false);
        this.shouldUpdate = true;
    }

    //to show subsuboption(e.g. - overview, by location) on hover of suboption (eg. - Reviews and rating, review nps) and to set dynamic axis
    handleMouseEnter = (parentOptionIndex: number, subIndex: number) => {
        const { handleSelectedOption, handleSearchInStaticMenuChildren, updateSubSubOptions, selectedOption } = this.props;
        let timer;
        clearTimeout(timer);
        timer = setTimeout(() => {
            handleSelectedOption({ ...selectedOption, hoverParent: parentOptionIndex, hoverSubOption: subIndex }, true, false);
            const subContent = document.getElementById(`suboption-${parentOptionIndex}-${subIndex}`);
            let axis = subContent && subContent?.getBoundingClientRect()?.toJSON();
            let subMenuPos = this.props?.staticMenuData?.[parentOptionIndex]?.children?.[subIndex]?.children;
            if (subMenuPos && subMenuPos.length) {
                const showItem = subMenuPos.filter((item: any) => {
                    return item.show;
                });
                let subMenuItemsHeight = showItem.length ? ((showItem.length * axis.height) + 20) : ((subMenuPos.length * axis.height) - 12);
                let elementHeight = subMenuItemsHeight > SUB_MENU_POP_UP_MAX_HEIGHT ? SUB_MENU_POP_UP_MAX_HEIGHT : subMenuItemsHeight;
                let availableHeight = window.innerHeight - axis.top - 25;
                let subSubOptionTopValue;

                if (availableHeight < elementHeight) {
                    let availableHeightFromTop = window.innerHeight - (window.innerHeight - axis.top);
                    let buffer = elementHeight > availableHeightFromTop ? elementHeight - availableHeightFromTop + 15 : 0;
                    subSubOptionTopValue = axis.top - elementHeight + buffer;
                } else {
                    subSubOptionTopValue = axis.top;
                }
                updateSubSubOptions({ children: this.props.staticMenuData[parentOptionIndex]?.children[subIndex]?.children, index: subIndex, parentIndex: parentOptionIndex, top: subSubOptionTopValue, left: axis.left + axis.width, height: elementHeight });
                handleSearchInStaticMenuChildren(false);
            } else {
                updateSubSubOptions({ children: null, index: subIndex, parentIndex: parentOptionIndex, top: "", left: "", height: "" });
            }
        }, 100);
        this.shouldUpdate = true;
    }

    //to select subsuboption(eg: by location, by source) on click on it
    handleOptionSelections = (e: any, selectedParent: number, selectedSubOption: number | null, selectedSubSubOption: number | null, href: string | null | undefined, hrefOptionObj: any) => {
        const { handleSelectedOption, onNavItemClick, localChangesPresent } = this.props;
        if (!localChangesPresent) {
            handleSelectedOption({ selectedParent, selectedSubOption, selectedSubSubOption, hoverParent: null, hoverSubOption: null }, true, true);
        }
        if (href) {
            const indexHierarchy = selectedParent + (selectedSubOption !== null ? `-${selectedSubOption}` : "") + (selectedSubSubOption !== null ? `-${selectedSubSubOption}` : "");
            onNavItemClick(e, href, indexHierarchy, hrefOptionObj);
        }
        this.props.updateSubSubOptions({});
        this.shouldUpdate = true;
    }

    handleSubOptionCount = (parentOption: any) => {
        const { searchTerm } = this.props;
        let count = 0;
        parentOption.children?.map((item: any) => {
            if (searchTerm) {
                if (item.show) {
                    count++;
                }
            } else {
                if (item) {
                    count++;
                }
            }

        });

        return count;
    }

    handleDynamicMenuSelection = (e, index: any, href: string) => {
        const { handleSelectedOption, onNavItemClick, moduleName, onClickCreateButton } = this.props;
        handleSelectedOption(index, false, false);
        const path = createNewPathName(moduleName);
        if (href?.indexOf(path) > 0) {
            onClickCreateButton && onClickCreateButton();
        }
        if (href) {
            onNavItemClick(e, href);
        }
    };

    handleMouseLeave = () => {
        this.handleClickOutside();
    };

    render() {
        const { disabled, staticMenuData, searchTerm, selectedOption, subSubOptions, handleSearchInStaticMenuChildren, isSearchFoundInStaticMenuChildren, moduleName, ctaButtonType, ctaButtonLabel, ctaButtonIcon, ctaButtonCallback, ctaButtonShow, ctaButtonCaption, customOptionsCount, allowRenavigation, customOptionsCountByIdentifier, onContextMenuClick,
            ctaButtonTooltip, ctaButtonDisabled, connectSocialButton, ctaButtonCallbackForBulkSchedule, bulkScheduleStatus, bulkSchedulngPermission, ctaButtonDisabledClass, overflowThreshold } = this.props;
        const { handleViewSubOption, handleMouseEnter, handleOptionSelections, handleSubOptionCount, state, handleDynamicMenuSelection, handleMouseLeave } = this;
        const { toggleSubOptions } = state;
        return (
            <div className={`el-second-side-railnav ${styles["railnavMenuWrapper"]} ${disabled ? styles["secondSideRailNavDisabled"] : ""}`}>
                <SecondSideRailNavView
                    staticMenuData={staticMenuData}
                    toggleSubOptions={toggleSubOptions}
                    parentIndexClicked={this.parentIndexClicked}
                    subSubOptions={subSubOptions}
                    handleViewSubOption={handleViewSubOption}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    handleOptionSelections={handleOptionSelections}
                    selectedOption={selectedOption}
                    searchTerm={searchTerm}
                    handleSearchInStaticMenuChildren={handleSearchInStaticMenuChildren}
                    isSearchFoundInStaticMenuChildren={isSearchFoundInStaticMenuChildren}
                    handleSubOptionCount={handleSubOptionCount}
                    handleDynamicMenuSelection={handleDynamicMenuSelection}
                    moduleName={moduleName}
                    customOptionsCount={customOptionsCount}
                    customOptionsCountByIdentifier={customOptionsCountByIdentifier}
                    ctaButtonShow={ctaButtonShow}
                    ctaButtonType={ctaButtonType}
                    ctaButtonLabel={ctaButtonLabel}
                    ctaButtonIcon={ctaButtonIcon}
                    ctaButtonCallback={ctaButtonCallback}
                    ctaButtonCaption={ctaButtonCaption}
                    ctaButtonDisabled={ctaButtonDisabled}
                    ctaButtonDisabledClass={ctaButtonDisabledClass}
                    ctaButtonTooltip={ctaButtonTooltip}
                    allowRenavigation={allowRenavigation}
                    onContextMenuClick={onContextMenuClick}
                    connectSocialButton={connectSocialButton}
                    ctaButtonCallbackForBulkSchedule={ctaButtonCallbackForBulkSchedule}
                    bulkScheduleStatus={bulkScheduleStatus}
                    bulkSchedulngPermission={bulkSchedulngPermission}
                    accordionState={this.props.accordionState}
                    overflowThreshold={overflowThreshold}
                    dispatch={this.props.dispatch}
                />
            </div>
        );
    }

}
(SecondSideRailNav as any).propTypes = {
    disabled: PropTypes.bool,
    heading: PropTypes.string,
    staticMenuData: PropTypes.any,
    dispatch: PropTypes.any,
    onClickCreateButton: PropTypes.any,
    searchTerm: PropTypes.string,
    selectedOption: PropTypes.any,
    subSubOptions: PropTypes.any,
    isSearchFoundInStaticMenuChildren: PropTypes.bool,
    handleSelectedOption: PropTypes.func,
    updateSubSubOptions: PropTypes.func,
    handleSearchInStaticMenuChildren: PropTypes.func,
    onNavItemClick: PropTypes.func,
    moduleName: PropTypes.string,
    customOptionsCount: PropTypes.any,
    customOptionsCountByIdentifier: PropTypes.bool,
    ctaButtonShow: PropTypes.bool,
    ctaButtonType: PropTypes.string,
    ctaButtonLabel: PropTypes.string,
    ctaButtonIcon: PropTypes.string,
    ctaButtonCallback: PropTypes.func,
    ctaButtonCaption: PropTypes.string,
    ctaButtonDisabled: PropTypes.bool,
    ctaButtonTooltip: PropTypes.any,
    allowRenavigation: PropTypes.bool,
    localChangesPresent: PropTypes.bool,
    onContextMenuClick: PropTypes.func,
    connectSocialButton: PropTypes.bool,
    ctaButtonCallbackForBulkSchedule: PropTypes.func,
    bulkScheduleStatus: PropTypes.string,
    bulkSchedulngPermission: PropTypes.bool,
    preventDefaultSubOptionClose: PropTypes.bool,
    accordionState: PropTypes.shape({
        accordionState: PropTypes.objectOf(PropTypes.bool),
    }),
    closeAccordionHandler: PropTypes.func,
    ctaButtonDisabledClass: PropTypes.string,
    overflowThreshold: PropTypes.number,
    resetParentAccordionIndex: PropTypes.number
}

export default onClickOutside(SecondSideRailNav);