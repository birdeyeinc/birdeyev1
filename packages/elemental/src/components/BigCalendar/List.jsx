/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { navigate } from "./utils/constants";
import TimeGrid from "./TimeGrid";
import moment from "moment";
import ListView from "./ListView";
import ListViewLoader from "./ListViewLoader";

class List extends React.Component {

    getLoader = () => {
        const { customListViewCalendarShimmer, listViewCallStatus, onListViewBottomReached, customListViewCalendarShimmerClassName } = this.props;
        if (customListViewCalendarShimmer) return (<div className="rbc-list-view-shimmer"><div className={`shimmer-list-view-wrapper custom-list-view-shimmer ${customListViewCalendarShimmerClassName}`}>{customListViewCalendarShimmer}</div></div>);
        if (listViewCallStatus) return (<ListViewLoader noOfShimmers={1} onListViewBottomReached={onListViewBottomReached} />);
        return (<ListViewLoader noOfShimmers={4} initialLoader />);
    }

    render() {
        const {
            date,
            components,
            events,
            calendarSimmerStatus = false,
            renderDates,
            onListViewBottomReached,
            onListViewTopReached,
            listViewCallStatus,
            onPageScroll,
            onClickOfButton,
            customRangeStart,
            customRangeEnd,
            aiPosts,
            socialChannels = [],
            permissions,
            customAICard
        } = this.props;

        let range = List.range(date, this.props);

        const startDate = customRangeStart || moment(range.start);
        const endDate = customRangeEnd || moment(range.end);

        const { eventWrapper } = components;

        if (calendarSimmerStatus) { 
            return this.getLoader();
        }

        return (
            <Fragment>
                <ListView
                    permissions={permissions} 
                    startDate={startDate}
                    endDate={endDate}
                    events={events}
                    eventWrapper={eventWrapper}
                    renderDates={renderDates}
                    onListViewBottomReached={onListViewBottomReached}
                    onListViewTopReached={onListViewTopReached}
                    listViewCallStatus={listViewCallStatus}
                    onPageScroll={onPageScroll}
                    onClickOfButton={onClickOfButton}
                    aiPosts={aiPosts}
                    socialChannels={socialChannels}
                    customAICard={customAICard}
                />
                { listViewCallStatus ? this.getLoader() : <p className="no-more-date-list-view">There is no more posts within this date range. To see more, adjust the date range and content filters.</p>}
            </Fragment>
        );
        
    }
}

List.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    localizer: PropTypes.any,
    min: PropTypes.instanceOf(Date),
    max: PropTypes.instanceOf(Date),
    scrollToTime: PropTypes.instanceOf(Date),
    enableAutoScroll: PropTypes.bool,
    showTimeSlots: PropTypes.bool,
    addAppointmentClass: PropTypes.bool,
    socialChannels: PropTypes.array,
    customListViewCalendarShimmer: PropTypes.any,
    customListViewCalendarShimmerClassName: PropTypes.string,
    customAICard: PropTypes.node
};

List.defaultProps = TimeGrid.defaultProps;

List.range = (date, { localizer }) => {
    let start = localizer.startOf(date, "month");
    let end = localizer.endOf(date, "month");
    return { start, end };
};

List.navigate = (date, action, { localizer }) => {
    switch (action) {
        case navigate.PREVIOUS:
            return localizer.add(date, -1, "month");

        case navigate.NEXT:
            return localizer.add(date, 1, "month");

        default:
            return date;
    }
};

List.title = (date, { localizer }) =>
    localizer.format(date, "monthHeaderFormat");

export default List;
