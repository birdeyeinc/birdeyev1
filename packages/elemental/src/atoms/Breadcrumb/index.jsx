
import React from "react";
import map from "lodash/map";
import Tooltip from "../Tooltip";
import SingleSelect from "../SingleSelect";
import Styles from "./Breadcrumb.module.scss";
import PropTypes from "prop-types";

function Link({ to, onClick, children }) {
    return (
        <a href={to} onClick={onClick}>
            {children}
        </a>
    );
}

function Breadcrumb(props) {
    const { crumbData, isLocationSwitcher, backCallback, backCallbackWithoutLink } = props;

    const generateBreadcrumb = () => {
        let templateListArray = [];
        templateListArray.push(map(crumbData, (crumbVal, index) => {
            if (crumbVal.href || crumbVal.customBackFunc) {
                return (
                    <li key={index}>
                        {isLocationSwitcher ?
                            crumbVal.switchWithHref ? (
                                <Link to={crumbVal["href"]}>
                                    <div>{getTooltipLabel(crumbVal)}</div>
                                </Link>) : (
                                backCallbackWithoutLink ?
                                    <span className={Styles["backCallbackWithoutLink"]} onClick={() => backCallbackWithoutLink(crumbVal["href"])}>
                                        <div className="custom-tooltip-wrapper">{getTooltipLabel(crumbVal)}</div>
                                    </span> :
                                    <Link onClick={() => backCallback(crumbVal["href"])}>
                                        <div className="custom-tooltip-wrapper">{getTooltipLabel(crumbVal)}</div>
                                    </Link>) :
                            crumbVal.customBackFunc ? (
                                crumbVal.renderWithoutLink ?
                                    <li onClick={() => crumbVal.customBackFunc()}>
                                        <div className={Styles["withoutLinkBox"]}>{getTooltipLabel(crumbVal)}</div>
                                    </li>
                                    :
                                    <Link onClick={() => crumbVal.customBackFunc()}>
                                        <div>{getTooltipLabel(crumbVal)}</div>
                                    </Link>
                            ) : (
                                <Link to={crumbVal["href"]}>
                                    <div>{getTooltipLabel(crumbVal)}</div>
                                </Link>
                            )
                        }
                    </li>
                );
            } else {
                if (crumbVal.locationSwitchDropdown) {
                    return renderSingleSelect(crumbVal);
                }
                return (
                    <li>
                        <div>{getTooltipLabel(crumbVal)}</div>
                    </li>
                );
            }
        }));

        let template = (
            <ul className={Styles["breadcrumblist"]}>
                {templateListArray}
            </ul>
        );
        return template;
    };

    const getTooltipLabel = (crumbVal) => {
        let { label, enableTooltip, ellipsisCharLimit } = crumbVal;
        let charCountLimit = ellipsisCharLimit || 16;
        if (label?.length > charCountLimit && enableTooltip) {
            return (<div className="custom-tooltip-light">
                <Tooltip
                    text={label}
                    hideOnScroll
                    tooltipClass={"custom-tooltip-box"}
                    position="top-right"
                >
                    <span>{label?.slice(0, charCountLimit) + "..."}</span>
                </Tooltip>
            </div>);
        } else {
            return label;
        }
    };

    // const switchLocation = (obj) => {
    //     const { dispatch, customEnterpriseOption } = props;
    //     const { business } = BE;
    //     let { label, value } = obj;
    //     let optionObj = {
    //         label,
    //         value
    //     };
    //     if (customEnterpriseOption && (label === customEnterpriseOption.label)) {
    //         optionObj.afterSwitchHref = "/dashboard/account/employees";
    //     }
    //     dispatch(switchLocationStore(optionObj, business));
    // };

    const renderSingleSelect = (crumbVal) => {
        const { customDropdownOnChange, customSelected, customOptions, businessList, businessListGroup } = crumbVal;
        const { customEnterpriseOption } = props;
        const customEnterpriseLabel = customEnterpriseOption && customEnterpriseOption.label;
        const customEnterpriseValue = customEnterpriseOption && customEnterpriseOption.value;
        // const { businessListGroup } = BE;
        // const businessList = BE.businessList(BE);
        let selectedLocation = null;
        let selLoc = sessionStorage.getItem("selLoc");
        selLoc = selLoc && JSON.parse(selLoc);
        const isSelLocLabelNotEnterprise = selLoc && selLoc["label"] && selLoc["label"].toLowerCase() !== customEnterpriseLabel;
        if (isSelLocLabelNotEnterprise) {
            selectedLocation = {
                label: selLoc["label"],
                value: selLoc["value"]
            };
        } else {
            selectedLocation = {
                label: customEnterpriseLabel,
                value: customEnterpriseValue
            };
        }

        let template = (
            <li className="location-switcher-link">
                <SingleSelect
                    className="mb-0 max-limit location-switcher-text"
                    name="alias"
                    inlineMode
                    options={customOptions || getDropDownOptions(businessListGroup || businessList, !!businessListGroup)}
                    selected={customSelected || (selectedLocation && selectedLocation.value)}
                    onChange={customDropdownOnChange}
                    customSize="xx-large"
                    showSearch
                    searchPlaceHolder="Search"
                    windowing
                    displayLabel="Select"
                />
            </li>
        );
        return template;
    };

    function getDropDownOptions(locationList, group) {
        let newList = [];
        if (group) {
            newList = {};
            Object.keys(locationList).forEach(function (key) {
                const list = locationList[key];

                const optionList = map(list, (item) => {
                    const { businessId, businessAlias, businessName } = item;
                    const label = businessAlias || businessName;

                    return {
                        label,
                        value: businessId
                    };
                });

                newList[key] = optionList;
            });
        } else {

            newList = map(locationList, (item) => {
                const { businessId, businessAlias, businessName, alias, name } = item;
                const label = businessAlias || businessName || alias || name;
                return {
                    label,
                    value: businessId
                };
            });
        }
        if (props.customEnterpriseOption) {
            newList.unshift({
                label: props.customEnterpriseOption.label,
                value: props.customEnterpriseOption.value
            });
        }
        return newList;
    }

    return (
        <div className={Styles["breadcrumb-wrapper"]}>
            {generateBreadcrumb()}
        </div>
    );
}

Breadcrumb.propTypes = {
    crumbData: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    isLocationSwitcher: PropTypes.bool,
    backCallback: PropTypes.func,
    backCallbackWithoutLink: PropTypes.func
};

export default Breadcrumb;