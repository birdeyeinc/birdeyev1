import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { cloneDeep, isEqual } from "lodash";
import styles from "./RailNav.module.scss";
import SearchFilter from "atoms/SearchFilter";
import SecondSideRailNav from "./SecondSideRailNav";
import { dynamicMenuPathName, getPageTitle, getRailNavTitleTier, getSelectedParentAndSubOptionIndex, removeRedirectUri } from "./helper";
import ConfirmationModal from "components/ConfirmationModal";
import Loader from "atoms/LoaderBox";
import onClickOutside from "react-onclickoutside";
import { getEncodedStyleClass, getEncodedStyleForeignClass } from "utils/index";
import { MODULES } from "./SecondSideRailNav/constants";


class RailNav extends Component {
    constructor(props) {
        super(props);
        this.defaultStaticMenuData = props.staticMenuOptions;
        this.defaultDynamicMenuData = props.dynamicMenuOptions;
        this.noDynamicMenuData = this.defaultDynamicMenuData?.length === 0;
        const selectedIndexObj = getSelectedParentAndSubOptionIndex(props.moduleName, this.noDynamicMenuData, props.activeIndex);
        this.state = {
            searchData: { searchTerm: "", isStaticSearchAvailable: true },
            staticMenuData: this.defaultStaticMenuData,
            dynamicMenuData: this.defaultDynamicMenuData,
            socialEngageCount: null,
            selectedOption: {
                staticMenuSelectedOption: {
                    selectedParent: selectedIndexObj.selectedParent,
                    selectedSubOption: selectedIndexObj.selectedSubOption,
                    selectedSubSubOption: selectedIndexObj.selectedSubSubOption,
                    hoverParent: null,
                    hoverSubOption: null
                },
                dynamicMenuSelectedOption: null
            },
            subSubOptions: { children: [], index: null, parentIndex: null, top: null, left: null, height: null },
            isSearchFoundInStaticMenuChildren: false,
            filterEditMode: false,
            editFilterDetails: null,
            deleteConfirmationModalOptions: this.getDefaultConfirmationModalOptions(),
            showRailNav: false,
            accordionState: this.accordionStateHandler(this.defaultStaticMenuData)
        };
        this.shouldUpdate = false;
    }
    componentWillMount() {
        const { searchExactNavUrl = false } = this.props
        this.defaultStaticMenuData.map((item, parentIndex) => {
            if(!item.children?.length && this.props.hasSimilarParentPathWithQueryParams && item.href){
                const fileteredHref = removeRedirectUri(window.location.href);
                fileteredHref.indexOf(item.href) > 1 && this.setState({
                    selectedOption: { staticMenuSelectedOption: { selectedParent: parentIndex, selectedSubOption: null, selectedSubSubOption: null, hoverParent: null, hoverSubOption: null }, dynamicMenuSelectedOption: null }
                });
            } else {
                const currentPath = window.location.pathname + window.location.search;
                item.children?.map((subItem, subIndex) => {
                subItem.href ?  (searchExactNavUrl ? currentPath === subItem.href : window.location.href.indexOf(subItem.href) > 1) && this.setState({
                    selectedOption: { staticMenuSelectedOption: { selectedParent: parentIndex, selectedSubOption: subIndex, selectedSubSubOption: null, hoverParent: null, hoverSubOption: null }, dynamicMenuSelectedOption: null }
                })
                    :
                    subItem.children?.map((child, childIndex) => {
                        if (window.location.href.indexOf(child.href) > 1) {
                            this.setState({
                                selectedOption: { staticMenuSelectedOption: { selectedParent: parentIndex, selectedSubOption: subIndex, selectedSubSubOption: childIndex, hoverParent: null, hoverSubOption: null }, dynamicMenuSelectedOption: null }
                            });
                        }
                    });
            });
        }
        });

        this.shouldUpdate = true;
    }

    componentDidMount() {
        const { staticMenuData, selectedOption, dynamicMenuData } = this.state;
        const { moduleName, autoHide } = this.props;
        const resellerInfoName = window?.BE?.business?.resellerInfo?.name || "";
        const { staticMenuSelectedOption } = selectedOption || {};
        if (staticMenuSelectedOption) {
            const { selectedParent = 0, selectedSubOption = 0, selectedSubSubOption = 0 } = staticMenuSelectedOption || {};
            const { pageTitle = "" } = staticMenuData?.[selectedParent]?.[selectedSubOption]?.[selectedSubSubOption] || staticMenuData?.[selectedParent] || {};
            if (pageTitle) {
                window.document.title = pageTitle;
            }
        }
        if (dynamicMenuData?.length && selectedOption?.dynamicMenuSelectedOption >= 0) {
            const { dashboardName = "" } = dynamicMenuData[selectedOption?.dynamicMenuSelectedOption] || {};
            const pageTitleText = getPageTitle(moduleName);
            const pageTitle = `${pageTitleText}${dashboardName ? ` | ${dashboardName}` : ""} | ${resellerInfoName}`;
            window.document.title = pageTitle;
        }
        if (autoHide) {
            window.addEventListener("message", this.messageHandler.bind(this));
        }
        if (this.props.setLeftNavigationL2)
            this.props.setLeftNavigationL2(moduleName);
        this.shouldUpdate = false;
    }

    //to recieve props after api hit on search dynamic menu
    componentWillReceiveProps(nextprops) {
        const { moduleName } = this.props;
        let selectedDynamicOption = window.location.pathname.split("/")[4];
        const resellerInfoName = window?.BE?.business?.resellerInfo?.name || "";
        const pageTitleText = getPageTitle(moduleName);

        const dynamicMenuOptionPathName = dynamicMenuPathName(moduleName);
        if (selectedDynamicOption && window.location.pathname.includes(dynamicMenuOptionPathName) && nextprops?.dynamicReportData?.length > 0) {
            let index = 0;
            for (let i = 0; i < nextprops.dynamicReportData?.length; i++) {
                let item = nextprops.dynamicReportData[i];
                if (item.id == selectedDynamicOption) {
                    index = i;
                }
            }

            const { dashboardName = "" } = nextprops?.dynamicReportData[index] || {};
            const pageTitle = `${pageTitleText}${dashboardName ? ` | ${dashboardName}` : ""} | ${resellerInfoName}`;
            window.document.title = pageTitle;
        }
        if (!isEqual(nextprops.staticMenuOptions, this.props.staticMenuOptions)) {
            this.defaultStaticMenuData = nextprops.staticMenuOptions;
            this.setState({
                staticMenuData: this.defaultStaticMenuData
            });
        }
        if (nextprops.activeIndex !== this.props.activeIndex) {
            const selectedIndexObj = getSelectedParentAndSubOptionIndex(moduleName, this.noDynamicMenuData, nextprops.activeIndex);
            const { selectedParent, selectedSubOption, selectedSubSubOption } = selectedIndexObj;
            this.setState({
                selectedOption: { staticMenuSelectedOption: { selectedParent, selectedSubOption, selectedSubSubOption, hoverParent: null, hoverSubOption: null }, dynamicMenuSelectedOption: null }
            });
        } else {
            const { selectedOption, staticMenuData } = this.state;
            const { staticMenuSelectedOption, dynamicMenuSelectedOption } = selectedOption;
            const { selectedParent, selectedSubOption, selectedSubSubOption, hoverParent, hoverSubOption } = staticMenuSelectedOption;
            let selectedTab = staticMenuData?.[selectedParent];
            if (selectedTab && !window.location.href.includes(selectedTab.href) && selectedTab?.children?.length) {
                let subSelectedTab = selectedTab?.children?.[selectedSubOption];
                if (subSelectedTab && !window.location.href.includes(subSelectedTab.href)) {
                    let subIndex = selectedTab?.children.findIndex((option) => window.location.href.includes(option.href));
                    this.setState({
                        selectedOption: { staticMenuSelectedOption: { selectedParent, selectedSubOption: subIndex >= 0 ? subIndex : selectedSubOption, selectedSubSubOption, hoverParent, hoverSubOption }, dynamicMenuSelectedOption }
                    });
                }

            }
        }
        if (nextprops.socialEngageCount != null) {
            this.setState({
                socialEngageCount: nextprops.socialEngageCount
            });
        }
        this.shouldUpdate = true;
        if (!isEqual(nextprops.dynamicAppleReportData, this.props.dynamicAppleReportData) && Object.keys(nextprops.dynamicAppleReportData).length > 0) {
            this.setState({
                staticMenuData: this.getDefaultSideNavData(nextprops.dynamicReportData, nextprops.dynamicAppleReportData)
            });
        }
    }

    shouldComponentUpdate() {
        return this.shouldUpdate;
    }

    componentWillUnmount() {
        if (this.props.setLeftNavigationL2)
            this.props.setLeftNavigationL2("");
        window.removeEventListener("message", this.messageHandler.bind(this));
    }

    accordionStateHandler = (staticMenuData) => {
        let menuObj = {};
        let options = staticMenuData;
        if (options?.length) {
            options.forEach((option) => {
                const { caption } = option;
                if (option && option?.children && option?.hasOwnProperty("show")) {
                    menuObj[caption] = option?.show;
                }
            });
        }
        return menuObj;
    }

    messageHandler(ev) {
        if (ev.data == "rail nav clicked") {
            this.setState({ showRailNav: true });
            this.shouldUpdate = true;
        } else if (ev.data == "rail nav closed") {
            this.setState({ showRailNav: false });
            this.shouldUpdate = true;
        }
    }

    //to select option in static and dynamic menu
    handleSelectedOption = (selectedOptionObj, isStaticSelectedOption, isStaticOptionSelected) => {
        const { staticMenuData, dynamicMenuData } = this.state;
        const { moduleName } = this.props;
        if (isStaticSelectedOption && isStaticOptionSelected) {
            const { selectedParent = 0, selectedSubOption = 0, selectedSubSubOption = 0 } = selectedOptionObj || {};
            const { pageTitle = "" } = staticMenuData?.[selectedParent]?.[selectedSubOption]?.[selectedSubSubOption] || staticMenuData?.[selectedParent] || {};
            if (pageTitle) {
                window.document.title = pageTitle;
            }
        }
        if (dynamicMenuData?.length && !isStaticSelectedOption && !isStaticOptionSelected) {
            const resellerInfoName = window?.BE?.business?.resellerInfo?.name || "";
            const { selectedParent = 0 } = selectedOptionObj || {};
            const { dashboardName = "" } = dynamicMenuData[selectedParent] || {};
            const pageTitleText = getPageTitle(moduleName);
            const pageTitle = `${pageTitleText}${dashboardName ? ` | ${dashboardName}` : ""} | ${resellerInfoName}`;
            window.document.title = pageTitle;
        }
        this.setState((prevState) => {
            return {
                selectedOption: {
                    staticMenuSelectedOption: isStaticOptionSelected ? selectedOptionObj : prevState.selectedOption.staticMenuSelectedOption,
                    dynamicMenuSelectedOption: isStaticSelectedOption ? isStaticOptionSelected ? null : prevState.selectedOption.dynamicMenuSelectedOption : selectedOptionObj
                }
            };
        });
        this.shouldUpdate = true;
    }

    //to change data for static and dynamic menu based on search input
    onChangeSearchTerm = (searchValue) => {
        let searchedStaticMenuData = cloneDeep(this.defaultStaticMenuData);
        let searchedDynamicMenuData = cloneDeep(this.defaultDynamicMenuData);
        let isStaticSearchAvailable = true;
        if (searchValue) {
            isStaticSearchAvailable = this.filterStaticMenuOnSearch(searchedStaticMenuData, searchValue);
            searchedDynamicMenuData = this.filterDynamicDataOnSearch(searchedDynamicMenuData, searchValue);
        }
        this.setState({
            staticMenuData: searchedStaticMenuData,
            dynamicMenuData: searchedDynamicMenuData,
            searchData: { searchTerm: searchValue, isStaticSearchAvailable },
            subSubOptions: { children: [], index: null, parentIndex: null, top: null, left: null, height: null },
            selectedOption: {
                ...this.state.selectedOption, staticMenuSelectedOption: { ...this.state.selectedOption.staticMenuSelectedOption, hoverParent: null, hoverSubOption: null }
            },
            isSearchFoundInStaticMenuChildren: false
        });
        this.shouldUpdate = true;
    };

    //to filter static menu data on basis of search input
    filterStaticMenuOnSearch = (staticMenuDataArr, searchStr) => {
        let isSearch = false;
        staticMenuDataArr.map((item) => {
            if (item && !item.isSeparator) {
                let { caption = "", children, keywords = "" } = item;
                if (caption?.toLowerCase().includes(searchStr.toLowerCase()) || keywords.includes(searchStr.toLowerCase())) {
                    item.show = true;
                    isSearch = true;
                }
                if (children && children.length > 0) {
                    let isSearchAvailable = this.filterStaticMenuOnSearch(children, searchStr);
                    if (isSearchAvailable) {
                        item.show = true;
                        isSearch = true;
                    }
                }
            }
        }
        );
        return isSearch;
    }

    //to filter dynamic menu data on basis of search input
    filterDynamicDataOnSearch = (defaultDynamicMenuData, searchValue) => {
        let dynamicMenuSearchedData = defaultDynamicMenuData?.filter((item) => {
            return item.dashboardName.toLowerCase().includes(searchValue.toLowerCase());
        });

        return dynamicMenuSearchedData;
    }

    //to clear search box on click of cross
    onCrossSearch = () => {
        this.setState({
            staticMenuData: this.defaultStaticMenuData,
            dynamicMenuData: this.defaultDynamicMenuData,
            searchData: { searchTerm: "", isStaticSearchAvailable: true }
        });
        this.shouldUpdate = true;
    }

    updateSubSubOptions = (params) => {
        const { children, index, parentIndex, top, left, height } = params;
        this.setState({
            subSubOptions: { children, index, parentIndex, top, left, height }
        });
        this.shouldUpdate = true;
    }

    handleScroll = () => {
        this.setState((prevState) => {
            return {
                selectedOption: {
                    staticMenuSelectedOption: prevState?.selectedOption?.staticMenuSelectedOption
                }
            };
        });
        this.updateSubSubOptions({});
        this.shouldUpdate = true;
    }

    //to check if any of static children option is matched to searchStr to hide other subsuboptions
    handleSearchInStaticMenuChildren = (flag) => {
        this.setState({
            isSearchFoundInStaticMenuChildren: flag
        });
        this.shouldUpdate = true;
    }

    getUpdateFilterSuccessMessage = () => {
        const message = <span><b>{this.state.editFilterDetails?.name}</b> {"Filter updated"} successfully</span>;
        return message;
    };
    getDeleteFilterSuccessMessage = (name) => {
        const message = <span><b>{name}</b> {"filter deleted"} successfully</span>;
        return message;
    };
    onEditSubmit = (item) => {
        const filterData = item;
        filterData.filterModule = this.props.module;
        this.props.externalUpdateNewSavedFilter(this.state.editFilterDetails, filterData, this.props.savedFilterList, this.getUpdateFilterSuccessMessage.bind(this), this.handleFilterEditMode.bind(this))
        // this.props.dispatch(this.externalUpdateNewSavedFilter(this.state.editFilterDetails, filterData, this.props.savedFilterList, this.getUpdateFilterSuccessMessage, this.handleFilterEditMode));
    }

    renderSaveFilterModal = () => {
        const { filterEditMode, editFilterDetails } = this.state;
        const { hideSubTitle, renderSaveFilterModal } = this.props;
        if (renderSaveFilterModal) {
            return renderSaveFilterModal({
                filterEditMode,
                editFilterDetails,
                handleFilterEditMode: this.handleFilterEditMode.bind(this),
                onSubmitFilter: this.onEditSubmit.bind(this),
                disableShare: true,
                hideSubTitle
            });
        }
        return null;
    }

    handleFilterEditMode = (val, selectFilterDetails) => {
        this.shouldUpdate = true;
        this.setState({ filterEditMode: val, editFilterDetails: selectFilterDetails });
        this.props.contextMenueCallback.call(null, "edit", selectFilterDetails);
    }

    handleFilterDeleteMode = (filterValue) => {
        this.props.externalDeleteNEWSavedFilter(filterValue, this.props.savedFilterList, this.getDeleteFilterSuccessMessage.bind(null, filterValue.name), this.props.contextMenueCallback.bind(null, "delete", filterValue));
        // this.props.dispatch(externalDeleteNEWSavedFilter(filterValue, this.props.savedFilterList, this.getDeleteFilterSuccessMessage.bind(null, filterValue.name), this.props.contextMenueCallback.bind(null, "delete", filterValue)));
    }

    onContextMenuClick = (selectedItem, filterValue) => {
        const { showConfirmationModal } = this;
        switch (selectedItem.value) {
            case ("edit"):
                this.handleFilterEditMode(true, filterValue);
                break;
            case ("delete"):
                let isInboxContext = false;
                if (filterValue.service == MODULES.INBOX) {
                    isInboxContext = true;
                }
                const deleteDescription = isInboxContext 
                    ? `<span>Users who have access to <strong>${filterValue.originalFilter.name}</strong> will no longer be able to view it.</span>`
                    : `<span>Are you sure you want to delete <strong>${filterValue.name}</strong> filter?</span>`;

                showConfirmationModal({
                    onConfirmCallback: this.handleFilterDeleteMode.bind(this, filterValue),
                    description: deleteDescription
                });
        }
    };

    showConfirmationModal = (options) => {
        this.shouldUpdate = true;
        const { onConfirmCallback, description } = options;
        this.setState({
            deleteConfirmationModalOptions: {
                show: true,
                description,
                onConfirm: onConfirmCallback
            }
        });
    };

    hideConfirmationModal = (onConfirmCallback) => {
        this.shouldUpdate = true;
        this.setState({ deleteConfirmationModalOptions: this.getDefaultConfirmationModalOptions() });
        typeof (onConfirmCallback) == "function" && onConfirmCallback();
    };

    getConfirmationModal = () => {
        const { show, description, onConfirm } = this.state.deleteConfirmationModalOptions;
        const { hideConfirmationModal } = this;
        return (<ConfirmationModal
            show={show}
            title={"Delete saved filter"}
            confirmButtonLabel={"Delete"}
            customWidth={450}
            description={description}
            onConfirm={hideConfirmationModal.bind(this, onConfirm)}
            onCancel={hideConfirmationModal}
            isDelFilter
            customCTAClassName="mt-20"
            type="standard"
        />);
    };

    getDefaultConfirmationModalOptions = () => {
        return {
            show: false,
            description: "",
            onConfirm: null
        };
    };

    handleClickOutside = () => {
        const { autoHide } = this.props;
        const { showRailNav } = this.state;
        if (autoHide && showRailNav) {
            this.setState({ showRailNav: false });
            this.shouldUpdate = true;
        }
    }

    closeAccordionHandler = (index) => {
        let parentkeyName = this.state.staticMenuData[index];
        const { caption } = parentkeyName;
        if (typeof (this.state.accordionState?.[caption]) === "boolean") {
            this.setState({
                accordionState: { ...this.state.accordionState, [caption]: !this.state.accordionState?.[caption] }
            });
        }
    }

    render() {
        const { searchPlaceholder, onNavItemClick, dispatch, moduleName, onClickCreateButton, showSearchFilter, customClassName, customOptionsCount, ctaButtonConfig = {}, allowRenavigation, localChangesPresent, connectSocialButton, bulkScheduleStatus, bulkSchedulngPermission, customOptionsCountByIdentifier, preventDefaultSubOptionClose = false, isLoading = false, autoHide, showSocialFreeTrialBadge, title = "", whiteLabelReseller, customHeader, renderSocialFreeTrialBadge, renderBottomBadge, loaderType, isReseller, isHolidayThemeEnabled, overflowThreshold,resetParentAccordionIndex=null, breakpoint = 800, renderLeftNavFooter, showLeftNavFooter } = this.props;
        const { ctaButtonType, ctaButtonLabel, ctaButtonIcon, ctaButtonCallback, ctaButtonShow, ctaButtonCaption, ctaButtonDisabled, ctaButtonTooltip, ctaButtonCallbackForBulkSchedule, ctaButtonDisabledClass } = ctaButtonConfig;
        const { onChangeSearchTerm, onCrossSearch, handleSelectedOption, updateSubSubOptions, handleScroll, handleSearchInStaticMenuChildren, state } = this;
        const { searchData, staticMenuData, dynamicMenuData, selectedOption, subSubOptions, isSearchFoundInStaticMenuChildren, filterEditMode, showRailNav } = state;
        const accountTypes = [2, 3];
        const navTitle = moduleName === "setup" ? "Settings" : (title || customHeader || "");
        const navTitleStr = typeof navTitle === "string" ? navTitle : "";
        const titleTier = getRailNavTitleTier(navTitleStr);
        return (
            <div className={`el-railnav ${styles["side-panel-nav-wrapper"]} ${getEncodedStyleForeignClass(customClassName, styles)} ${autoHide && !showRailNav ? styles[`hide-rail-nav-${breakpoint}`] : ""} ${autoHide && showRailNav ? styles[`animate-rail-nav-${breakpoint}`] : ""}`} disabled={this.props.disabled}>
                <div className={styles["rail-nav-title"]} data-title-tier={titleTier}>
                    {accountTypes.includes(window?.BE?.business?.accountType) ? <p className={styles["sub-title"]}>{window?.BE?.business?.name}</p> : null}
                    {navTitle}
                </div>
                {
                    isLoading ?
                        <Loader type={loaderType} reseller={whiteLabelReseller} /> :
                        <Fragment>
                            {showSearchFilter ? <div className={styles["side-panel-search"]}>
                                <SearchFilter
                                    placeholder={searchPlaceholder || "Search"}
                                    autoComplete={"off"}
                                    autoFocus
                                    disableAutoFocusOnUpdate
                                    debounceDelay={500}
                                    searchStr={searchData.searchTerm}
                                    onInputValueChange={onChangeSearchTerm}
                                    onCrossClickAction={onCrossSearch}
                                    customClass={styles["custom-filterbox"]}
                                />
                            </div> : null}
                            {!searchData.isStaticSearchAvailable && !dynamicMenuData?.length ?
                                <div className={styles["custom-nodatabox"]}>
                                    <span>Couldn't find any matches for "{searchData.searchTerm}"</span>
                                    Try different keywords.
                                </div> :
                                <div className={`${styles["left-section"]} custom-scroll`} onScroll={handleScroll}>
                                    {(staticMenuData?.length > 0 && searchData.isStaticSearchAvailable) ?
                                        <SecondSideRailNav
                                            disabled={this.props.disabled}
                                            staticMenuData={staticMenuData}
                                            dyanmicMenuDataAvailable={dynamicMenuData.length > 0}
                                            searchTerm={searchData.searchTerm}
                                            handleSelectedOption={handleSelectedOption}
                                            selectedOption={selectedOption.staticMenuSelectedOption}
                                            updateSubSubOptions={updateSubSubOptions}
                                            subSubOptions={subSubOptions}
                                            handleSearchInStaticMenuChildren={handleSearchInStaticMenuChildren}
                                            isSearchFoundInStaticMenuChildren={isSearchFoundInStaticMenuChildren}
                                            onNavItemClick={onNavItemClick}
                                            dispatch={dispatch}
                                            onClickCreateButton={onClickCreateButton}
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
                                            ctaButtonTooltip={ctaButtonTooltip}
                                            allowRenavigation={allowRenavigation}
                                            localChangesPresent={localChangesPresent}
                                            onContextMenuClick={this.onContextMenuClick}
                                            connectSocialButton={connectSocialButton}
                                            ctaButtonCallbackForBulkSchedule={ctaButtonCallbackForBulkSchedule}
                                            ctaButtonDisabledClass={ctaButtonDisabledClass}
                                            bulkScheduleStatus={bulkScheduleStatus}
                                            bulkSchedulngPermission={bulkSchedulngPermission}
                                            preventDefaultSubOptionClose={preventDefaultSubOptionClose}
                                            accordionState={this.state.accordionState}
                                            closeAccordionHandler={this.closeAccordionHandler}
                                            overflowThreshold={overflowThreshold}
                                            resetParentAccordionIndex={resetParentAccordionIndex}
                                        // key={Math.random()}
                                        />
                                        : null}
                                </div>
                            }
                            {filterEditMode && this.renderSaveFilterModal()}
                            {this.getConfirmationModal()}
                            {renderBottomBadge && typeof(renderBottomBadge) === "function" && renderBottomBadge()}
                            {showSocialFreeTrialBadge ? renderSocialFreeTrialBadge() : null}
                            {showLeftNavFooter ? renderLeftNavFooter() : null}
                        </Fragment>
                }
                {
                    isHolidayThemeEnabled ?
                        (isHolidayThemeEnabled() ? <div className={`santa-rail-nav-gif-wrapper ${styles["fadeOut"]}`}>
                            <div className="santa-rail-nav-gif" />
                        </div> : null)
                        : null
                }
            </div>
        );
    }
}

RailNav.propTypes = {
    dispatch: PropTypes.func,
    staticMenuOptions: PropTypes.array,
    dynamicMenuOptions: PropTypes.array,
    searchPlaceholder: PropTypes.string,
    // onSearchDynamicMenu: PropTypes.func,
    // getSocialEngageCount: PropTypes.func,
    dynamicReportData: PropTypes.array,
    onNavItemClick: PropTypes.func,
    // leftMenuCollapseByButton: PropTypes.func,
    moduleName: PropTypes.string,
    onClickCreateButton: PropTypes.func,
    showSearchFilter: PropTypes.bool,
    customClassName: PropTypes.string,
    customOptionsCount: PropTypes.object,
    ctaButtonConfig: PropTypes.object,
    allowRenavigation: PropTypes.bool,
    activeIndex: PropTypes.string,
    localChangesPresent: PropTypes.bool,
    customOptionsCountByIdentifier: PropTypes.bool,
    dynamicAppleReportData: PropTypes.object,
    savedFilterList: PropTypes.array,
    module: PropTypes.string,
    contextMenueCallback: PropTypes.func,
    connectSocialButton: PropTypes.bool,
    bulkScheduleStatus: PropTypes.string,
    bulkSchedulngPermission: PropTypes.bool,
    hideSubTitle: PropTypes.bool,
    preventDefaultSubOptionClose: PropTypes.bool,
    showSocialFreeTrialBadge: PropTypes.bool,
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    autoHide: PropTypes.bool,
    disabled: PropTypes.bool,
    whiteLabelReseller: PropTypes.bool,
    customHeader: PropTypes.string,
    renderSaveFilterModal: PropTypes.func,
    externalUpdateNewSavedFilter: PropTypes.func,
    externalDeleteNEWSavedFilter: PropTypes.func,
    renderSocialFreeTrialBadge: PropTypes.func,
    renderBottomBadge: PropTypes.func,
    setLeftNavigationL2: PropTypes.func,
    isResller: PropTypes.bool,
    isHolidayThemeEnabled: PropTypes.func,
    loaderType: PropTypes.string,
    overflowThreshold: PropTypes.number,
    hasSimilarParentPathWithQueryParams: PropTypes.bool,
    searchExactNavUrl: PropTypes.bool,  // ensures exact match when query params are passed
    resetParentAccordionIndex: PropTypes.number,
    breakpoint: PropTypes.number,
    renderLeftNavFooter: PropTypes.func,
    showLeftNavFooter: PropTypes.bool
};

RailNav.defaultProps = {
    staticMenuOptions: [],
    dynamicMenuOptions: [],
    dynamicReportData: [],
    showSearchFilter: false,
    allowRenavigation: false,
    disabled: false,
    whiteLabelReseller: false,
    dynamicAppleReportData: {},
    hasSimilarParentPathWithQueryParams: false,
    searchExactNavUrl: false,
    breakpoint: 800
};


const clickOutsideConfig = {
    handleClickOutside: (instance) => instance.handleClickOutside.bind(instance)
};

export default onClickOutside(RailNav, clickOutsideConfig);
