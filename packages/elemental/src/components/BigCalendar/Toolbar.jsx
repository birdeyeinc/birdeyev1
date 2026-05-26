import PropTypes from "prop-types";
import React from "react";
import clsx from "clsx";
import { navigate } from "./utils/constants";
import moment from "moment";
import { isEmpty } from "lodash";
// import { exportCalendarEnabled } from "utils/index";
// import SingleSelect from "components/Phoenix/SingleSelect/SingleSelect";
// import Button from "components/Phoenix/Button/Button";

class Toolbar extends React.Component {

    componentDidMount() {
        const queryParams = new URLSearchParams(window.location.search);
        const viewType = queryParams.get("calendarView");
        const dateParam = queryParams.get("date");
        let dateForCalendar = dateParam ? new Date(Number(dateParam)) : new Date();
        if (isNaN(dateForCalendar.getTime())) {
            dateForCalendar = new Date();
        }
        const { showAIBestTimeToggleHandler } = this.props;
        if (viewType) {
            if (dateForCalendar) {
                localStorage.setItem("scheduleDate", dateForCalendar.toISOString());
            }
            showAIBestTimeToggleHandler(true); 
            localStorage.setItem("activeView",viewType);
            this.triggerViewChange(viewType);
        }
    }

    triggerViewChange(viewType) {
        const validViews = ["week", "month"];
        if (validViews.includes(viewType)) {
            this.props.onView(viewType, "triggerViewChange");
        }
    }
    render() {
        let {
            localizer: { messages },
            label,
            year,
            isSocial, 
            date,
            renderCustomJSXToolbar,
            viewWidth,
            showListView,
            customRangeToolbar,
            hideArrows,
            bestTimeAIToggle,
            getActionMenu
        } = this.props;
    
        const view = this.props.view;
        let updatedYear = year;
        const monthLable = (lableArray) => {
            let monthName = label?.split(" ")?.[0];
            if (!isNaN(Number(lableArray[3]))) {
                monthName = lableArray[0];
            } else if (lableArray[0] === "December" && lableArray[3] === "January") {
                const currMonth = moment(date).format("MMMM");
                const yearLowRange = currMonth === lableArray[0] ? moment(date).format("YYYY") : moment(date).subtract(1, "year").format("YYYY");
                updatedYear = currMonth === lableArray[0] ? moment(date).add(1, "year").format("YYYY") : moment(date).format("YYYY");
                monthName = `${lableArray[0]?.slice(0,3)} ${yearLowRange} - ${lableArray[3]?.slice(0,3)}`;
            } else if (lableArray[0] !== lableArray[3]) {
                monthName = `${lableArray[0]?.slice(0,3)} - ${lableArray[3]?.slice(0,3)}`;
            }

            return monthName;
        };

        const newLable = monthLable(label?.split(" "));
        
        return (
            <div className="rbc-toolbar mb-30" style={view == "list" ? {width: `${viewWidth}px` , position:"fixed"} : {}}>
                <span className="rbc-btn-group">

                    <div className="date-block">
                        {/* {!this.props.hideCalendarText && <p className="date-block-title">Calendar</p>} */}
                        {!hideArrows && <button
                            type="button"
                            onClick={this.navigate.bind(null, navigate.PREVIOUS)}
                            className="left-button"
                        >
                            <i className="icon-cheveron_close" />
                        </button>}
                        {
                            isSocial ? 
                                <div onClick={() => this.props.setShowDatePicker(true)} className={`rbc-toolbar-label ${view == "list" ? "customRangeToolbar" : ""}`}>{view == "list" && !isEmpty(customRangeToolbar) ? customRangeToolbar : view === "week" ? newLable : label}{view === "week" ? ` ${updatedYear}` : ""}</div> :
                                <div onClick={() => this.props.setShowDatePicker(true)} className="rbc-toolbar-label">{label}{view === "week" ? `, ${year}` : ""}</div>
                        }
                        {!hideArrows && <button
                            type="button"
                            onClick={this.navigate.bind(null, navigate.NEXT)}
                            className="right-button"
                        >
                            <i className="icon-cheveron_close" />
                        </button>}
                        <button
                            type="button"
                            onClick={this.navigate.bind(null, navigate.TODAY)}
                            className="today-button"
                        >
                            {messages.today}
                        </button>
                    </div>

                    {this.props.showOnlyDayWeekView && this.props.showOnlyDayWeekView === true ? (
                        <div className="tabbing-wrapper">
                            <span className="rbc-button-grp mr-10">
                                <div className={clsx({ "rbc-active": view === "day" })}
                                    type="button"
                                    onClick={this.view.bind(null, "day")}
                                >
                                    Day
                                </div>
                                <div className={clsx({ "rbc-active": view === "week" })}
                                    type="button"
                                    onClick={this.view.bind(null, "week")}
                                >
                                    Week
                                </div>
                                {/* <div className={clsx({ "rbc-active": view === "month" })}
                                    type="button"
                                    onClick={this.view.bind(null, "month")}
                                >
                                    Month
                                </div> */}

                            </span>
                        </div>

                    ) :
                        (<div className="header-button-group">
                            <span className="rbc-button-grp mr-10">
                                {showListView && <div className={clsx({ "rbc-active": view === "list" })}
                                    type="button"
                                    onClick={this.view.bind(null, "list")}
                                >
                                    List
                                </div>}     
                                <div className={clsx({ "rbc-active": view === "week" })}
                                    type="button"
                                    onClick={this.view.bind(null, "week")}
                                >
                                    Week
                                </div>
                                <div className={clsx({ "rbc-active": view === "month" })}
                                    type="button"
                                    onClick={this.view.bind(null, "month")}
                                >
                                    Month
                                </div>
                            </span>
                            {bestTimeAIToggle && bestTimeAIToggle()}
                            {/* {getActionMenu && exportCalendarEnabled() && getActionMenu()} */}
                            {renderCustomJSXToolbar && renderCustomJSXToolbar()}
                        </div>
                        )}

                </span>
            </div >

        );
    }

    onViewChange = (event) => {
        let value = event.value;
        this.props.onView(value);
    }

    navigate = (action) => {
        this.props.onNavigate(action);
    }

    view = (view) => {
        this.props.onView(view);
    }

    viewNamesGroup(messages) {
        let viewNames = this.props.views;
        const view = this.props.view;

        if (viewNames.length > 1) {
            return viewNames.map((name) => (
                <button
                    type="button"
                    key={name}
                    className={clsx({ "rbc-active": view === name })}
                    onClick={this.view.bind(null, name)}
                >
                    {messages[name]}
                </button>
            ));
        }
    }
}

Toolbar.defaultProps = {
    hideCalendarText: false
};

Toolbar.propTypes = {
    view: PropTypes.string.isRequired,
    views: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.node.isRequired,
    localizer: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
    onView: PropTypes.func.isRequired,
    year: PropTypes.string,
    setShowDatePicker: PropTypes.func,
    showOnlyDayWeekView: PropTypes.bool,
    hideCalendarText: PropTypes.bool,
    isSocial: PropTypes.bool,
    date: PropTypes.any,
    renderCustomJSXToolbar: PropTypes.func,
    viewWidth: PropTypes.number,
    showListView: PropTypes.bool,
    customRangeToolbar: PropTypes.string,
    hideArrows: PropTypes.bool,
    bestTimeAIToggle: PropTypes.func,
    showAIBestTimeToggleHandler: PropTypes.func,
    getActionMenu: PropTypes.func
};

export default Toolbar;