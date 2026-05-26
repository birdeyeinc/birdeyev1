/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-key */
import React from "react";
import PropTypes from "prop-types";
import Styles from "./StairCaseGraph.module.scss";
import { getEncodedStyleClass, numberWithCommas } from "utils";
import Tooltip from "atoms/Tooltip";

const getModuleStyle = (str)=>getEncodedStyleClass(str,Styles)

const StairCaseGraph = (props) => {
    const { data, 
        className,
        showHover 
    } = props;
    
    function getTooltipHtml(tooltip) {
        const { label, values, showTotal, zeroRow, type } = tooltip || {};
        
        if (!label && !values || (values && values.length == 0)) {
            return null;
        }
        
        return (
            <div className={`el-staircase-graph ${getModuleStyle(`tooltip-list  ${type ? type : ""}`)}`}>
                <div className={getModuleStyle("tooltip-label")}>{label}</div>
                <div className={getModuleStyle("responses-wrapper")}>
                    {zeroRow && (
                        getRow(zeroRow, true, "zero-row")
                    )}
                    {values.map((v) => {
                        return (
                            getRow(v)
                        );
                    })}
                    {showTotal && (
                        getRow(showTotal, false, "total-response")
                    )}
                </div>
            </div>
        );
    }
    
    function getRow(v, hidePercent, customClass) {
        return (
            <div className={getModuleStyle(`table-row ${customClass ? customClass : ""} `)}>
                <div className={getModuleStyle("left-col")}>
                    {
                        v.logo && (v.type === "referral" ? <img className={getModuleStyle("logo")} src={v.logo}/>
                            : <span className={`${v.logo} ${getModuleStyle(logo)}`}/>)
                    }
                    <div>{v.text ? v.text : "" }</div>
                </div>
                <div className={getModuleStyle(`right-col ${v.rightDirecClass ? v.rightDirecClass : ""}`)}>
                    {(v.count || v.count === 0) && <span>{numberWithCommas(v.count)}</span>}
                    {(v.percent || v.percent === 0) && <span className={getModuleStyle("tooltip-percent")}>{v.percent}{!hidePercent && "%"}</span>}
                </div>
            </div> 
        );
    }

    return (
        <div className={Styles["print-container-wrapper"]}>
            {data.map((v, ii) => {
                return (
                    <div className={`${className} ${getModuleStyle(`graph-wrap ${ii % 2 !== 0 ? "right-side" : ""}`)}`} >
                        {v.values.map((q) => {
                            return (
                                <div className={Styles["graph-row"]}>
                                    {(q.percent || q.percent === 0) && (
                                        <span className={Styles["percent"]}>
                                            {(q.label === "Delivered" && q.percent != 0) ? "100" : Math.round(q.percent)}%
                                        </span>
                                    )}
                                    <div className={getModuleStyle(`row-container ${q.styleName ? q.styleName : ""}`)}>
                                        <div className={Styles["filled-data"]} style={{width: v.values[0].count ? ((q.count * 100) / v.values[0].count) + "%" : "0%"}} />
                                        <div className={Styles["graph-data"]}>
                                            <span className={Styles["count"]}>
                                                {/* //moved sent label inside graph div */}
                                                <span className={Styles["count-txt"]}>{q.label}
                                                    {q.icon && (
                                                        <Tooltip
                                                            hideOnScroll
                                                            text={q.icon}
                                                            customContainerClassName="inline-flex"
                                                        >
                                                            <i className={"icon_phoenix-question-circle gray-question"}/>
                                                        </Tooltip>
                                                    )}
                                                </span>
                                            </span>
                                            <span className={`${getModuleStyle("count-txt total-count")} semibold`}>{numberWithCommas(q.count)}</span>
                                        </div>
                                        {showHover && getTooltipHtml(q.tooltip)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>  
                );
            })}
        </div>
    );
};

StairCaseGraph.propTypes = {
    data: PropTypes.array,
    className: PropTypes.string,
    showHover: PropTypes.bool
};

export default StairCaseGraph;