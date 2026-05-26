import PropTypes from "prop-types";
import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
// import AiBestTimeToPost from "../AiBestTimeToPost/AiBestTimeToPost";
import AiLogo from "assets/AiBestTimeToPost.svg";
const AiBestTimeToPost = () => <div>AiBestTimeToPost</div>
const DateHeader = ({ label, drilldownView, hoverStatus, callBackFtn = null, isNewDate, date, isAISuggestion, dispatch, isLoadingDone, events, socialChannels = [], showAIIcon = false, permissions, showPlusIcon = true, plusIconCallback }) => {
    const gridDate = moment(date);
    const [showAiBestTime, setShowAiBestTime] = useState(false);
    const aiDivRef = useRef(null);
    const dateToFilter = new Date(date);
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getFullYear() === dateToFilter.getFullYear() &&
            eventDate.getMonth() === dateToFilter.getMonth() &&
            eventDate.getDate() === dateToFilter.getDate();
    });

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!drilldownView) {
        return <span>{label}</span>;
    }

    const handleClick = (e) => {
        if (!e.target.closest(".ai-best-time") && (window?.BE?.business.betaProductFeatures?.customRole ? permissions?.readWritePermission : true)) {
            callBackFtn && callBackFtn(e);
        }
    };
    const handleClickOutside = (event) => {
        if (aiDivRef.current && !aiDivRef.current.contains(event.target)) {
            setShowAiBestTime(false);
        }
    };

    const showAiBestTimes = (e) => {
        e.stopPropagation(); // Prevents handleClick from being triggered
        setShowAiBestTime(true);
    };

    const onOpenModal = (reset = false) => {
        const dayToAdd = 7;
        const divClass = "class-" + moment(date).add(dayToAdd, "day").format("DD-MM-YYYY");

        const div = document.querySelector(`.${divClass}`) || {style: {zIndex: 0}};
    
        if (reset) {
            div.style.zIndex = 3;
        } else {
            div.style.zIndex = 0;
        }
    };

    const getHeaderWithAIicon = () => {
        let headerIconJSX;
        if (showAIIcon && ((!hoverStatus && isNewDate) || hoverStatus) && (isAISuggestion && isLoadingDone)) {
            headerIconJSX = (<div ref={aiDivRef} className="header-with-ai-icon">
                {(window?.BE?.business.betaProductFeatures?.customRole ? permissions?.readWritePermission : true) && <i className={`icon_phoenix-add-circle ${hoverStatus ? "" : "header-hover"}`} />}
                <div onClick={(e) => showAiBestTimes(e)} className="ai-icon-with-dropdown"><img src={AiLogo} alt="AI Logo" />
                    {showAiBestTime &&
                    <div className="month-view-ai-dropdown">
                        {filteredEvents?.map(event => (
                                event?.aiBestTimeToPost && (
                                <AiBestTimeToPost datePublish={event?.datePublish} dispatch={dispatch} socialChannels={socialChannels} onMount={onOpenModal} permissions={permissions} />
                            )
                        ))}
                    </div>
                    }
                </div>
                
            </div>);
        } else if (((!hoverStatus && isNewDate) || hoverStatus) && showPlusIcon) {
            headerIconJSX = (window?.BE?.business.betaProductFeatures?.customRole ? permissions?.readWritePermission : true) && (<i className={`icon_phoenix-add-circle ${hoverStatus ? "" : "header-hover"}`} />);
        } else if (showAIIcon && (isAISuggestion && isLoadingDone)) {
            headerIconJSX = (
                 filteredEvents?.map(event => (
                    event?.aiBestTimeToPost && (
                         <AiBestTimeToPost datePublish={event?.datePublish} dispatch={dispatch} socialChannels={socialChannels} onMount={onOpenModal} permissions={permissions} />
                     )
                 ))
            );
        }
        return headerIconJSX;
    };

    return (
        <div>
            <div className="rbc-month-view-header-wrapper" onClick={handleClick}>
                <button
                    type="button"
                    className="rbc-button-link"
                    role="cell"
                    id={gridDate.format("DD-MM-YYYY")}
                >
                    {label}
                </button>
                {getHeaderWithAIicon()}
            </div>
        </div>
    );
};

DateHeader.propTypes = {
    label: PropTypes.node,
    date: PropTypes.instanceOf(Date),
    drilldownView: PropTypes.string,
    onDrillDown: PropTypes.func,
    isOffRange: PropTypes.bool,
    hoverStatus: PropTypes.bool,
    callBackFtn: PropTypes.func,
    isNewDate: PropTypes.bool,
    isAdminUser: PropTypes.bool,
    isAISuggestion: PropTypes.bool,
    dispatch: PropTypes.func,
    isLoadingDone: PropTypes.bool,
    events: PropTypes.object,
    socialChannels: PropTypes.object,
    showAIIcon: PropTypes.bool,
    permissions: PropTypes.object,
    showPlusIcon: PropTypes.bool,
    plusIconCallback: PropTypes.func
};

export default DateHeader;