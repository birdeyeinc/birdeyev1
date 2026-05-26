/* eslint-disable react/no-multi-comp */
/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import React from "react";
import EventCell from "./EventCell";
import { isSelected } from "./utils/selection";
import moment from "moment";
import {
    hideCards,
    onDragStart
} from "./MonthDnDFunctions";
// import { getApprovalActionOnPost, getPostPublisedStatus } from "pages/social/publishPhoenix/createPost/CreatePostHelper";
// import { checkPermission } from "utils";
import { isCalendarLongCards } from "./utils"
/* eslint-disable react/prop-types */
export default {
    propTypes: {
        slotMetrics: PropTypes.object.isRequired,

        selected: PropTypes.object,
        isAllDay: PropTypes.bool,

        accessors: PropTypes.object.isRequired,
        localizer: PropTypes.object.isRequired,
        components: PropTypes.object.isRequired,
        getters: PropTypes.object.isRequired,

        onSelect: PropTypes.func,
        onDoubleClick: PropTypes.func,
        onKeyPress: PropTypes.func
    },

    defaultProps: {
        segments: [],
        selected: {}
    },

    renderEvent(props, event) {
        let {
            selected,
            isAllDay: _,
            accessors,
            getters,
            onSelect,
            onDoubleClick,
            onKeyPress,
            localizer,
            slotMetrics,
            components,
            resizable
        } = props;

        let continuesPrior = slotMetrics.continuesPrior(event);
        let continuesAfter = slotMetrics.continuesAfter(event);

        return (
            <EventCell
                event={event}
                getters={getters}
                localizer={localizer}
                accessors={accessors}
                components={components}
                onSelect={onSelect}
                onDoubleClick={onDoubleClick}
                onKeyPress={onKeyPress}
                continuesPrior={continuesPrior}
                continuesAfter={continuesAfter}
                slotStart={slotMetrics.first}
                slotEnd={slotMetrics.last}
                selected={isSelected(event, selected)}
                resizable={resizable}
            />
        );
    },

    renderSpan(slots, len, key, content = " ", event, updateSelectedState, currentColumnInfo, updateCurrentColumnInfo, renderViewMoreBorder) {
        let per = (Math.abs(len) / slots) * 100 + "%";
        
        let isSat = false;
        let isAppleStartSat = false, isAppleEndSun = false;

        if (event) { 
            if (isCalendarLongCards(event)) {
                (moment(event.end).day() === 0 && event?.isAppleEndInsideRange) ? isAppleEndSun = true : (event?.isAppleEndOutsideRange && moment(event.start).day() === 6) ? isAppleStartSat = true : "";
            } else {
                isSat = moment(event.publishDate).day() === 6;
            }
        }
        const checkEventDraggable = event?.checkEventDraggable;
        return (
            <div
                key={key}
                className={`rbc-row-segment card_${event ? event.id : ""} ${isSat ? "right-most-card" : ""} ${event?.start?.toString() !== event?.end?.toString() ? "longCards" : ""} ${event?.isAppleEndOutsideRange ? "right-triangle" : event?.isAppleEndInsideRange ? "left-triangle" : event?.isBothFalse ? "right-triangle left-triangle" : ""} ${(isAppleEndSun || isAppleStartSat) ? "apple-short-cards" : ""} ${(event && isCalendarLongCards(event) && moment(event.start).isSame(moment(event.end), "day")) ? "apple-short-cards" : ""}`}
                draggable={checkEventDraggable ? `${checkEventDraggable(event)}` : "false"}//{`${(!event || getPostPublisedStatus(event.isPublished, event?.startActual) > 0 || !approvalActionsOnPost || event?.start?.toString() !== event?.end?.toString() || event?.aiSuggestion || event?.isPublished === 18 ? "false" : "true")}`}
                id={key}
                // IE10/11 need max-width. flex-basis doesn't respect box-sizing
                style={{ WebkitFlexBasis: per, flexBasis: per, maxWidth: per}}
                onDragStart={(e) => onDragStart(e,event,updateSelectedState)}
                onDragEnter={() => hideCards(currentColumnInfo,updateCurrentColumnInfo)}
            >
                {content}
            </div>
        );
    }
};
