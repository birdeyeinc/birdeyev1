/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-find-dom-node */
import PropTypes from "prop-types";
import moment from "moment";
import React, { Fragment } from "react";
import { findDOMNode } from "react-dom";
import clsx from "clsx";

import Selection, { getBoundsForNode, isEvent } from "./Selection";
import * as TimeSlotUtils from "./utils/TimeSlots";
import { isSelected } from "./utils/selection";

import { notify } from "./utils/helpers";
import * as DayEventLayout from "./utils/DayEventLayout";
import TimeSlotGroup from "./TimeSlotGroup";
import TimeGridEvent from "./TimeGridEvent";
import { DayLayoutAlgorithmPropType } from "./utils/propTypes";

import DayColumnWrapper from "./DayColumnWrapper";
import CalendarShimmer from "./WeekAndMonthViewLoader";

import {
    onDragEnter,
    onDragLeave,
    onDragEnterInSchedulerBox,
    onDragLeaveFromSchedulerBox,
    onDrag,
    onDragOver,
    onDragStart,
    onDrop,
    removeStyleOnDrop,
    onDragEnd
} from "./WeekDnDFunctions";
// import { getApprovalActionOnPost, getPostPublisedStatus } from "pages/social/publishPhoenix/createPost/CreatePostHelper";
// import { checkPermission } from "utils";

const getApprovalActionOnPost = () => true;
const getPostPublisedStatus = () => true;
class DayColumn extends React.Component {
  state = { selecting: false, timeIndicatorPosition: null }
  intervalTriggered = false
  dragImage = new Image();
  nonAIBTPPosts= []

  constructor(...args) {
      super(...args);
      this.state = {
          shimmerCards: 4
      };
      this.slotMetrics = TimeSlotUtils.getSlotMetrics(this.props);
  }

  componentDidMount() {
      this.props.selectable && this._selectable();

      if (this.props.isNow) {
          this.setTimeIndicatorPositionUpdateInterval();
      }
      const calendarDiv = document.getElementById("wrapper");
      const heightOfWrapper = calendarDiv.offsetHeight;

      this.setState({
          shimmerCards: Math.round(heightOfWrapper / 50)
      });

      this.dragImage.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  }

  componentWillUnmount() {
      this._teardownSelectable();
      this.clearTimeIndicatorInterval();
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.selectable && !this.props.selectable) this._selectable();
      if (!nextProps.selectable && this.props.selectable)
          this._teardownSelectable();

      this.slotMetrics = this.slotMetrics.update(nextProps);
  }

  componentDidUpdate(prevProps, prevState) {
      const { getNow, isNow, localizer, date, min, max } = this.props;
      const getNowChanged = localizer.neq(prevProps.getNow(), getNow(), "minutes");

      if (prevProps.isNow !== isNow || getNowChanged) {
          this.clearTimeIndicatorInterval();

          if (isNow) {
              const tail =
          !getNowChanged &&
          localizer.eq(prevProps.date, date, "minutes") &&
          prevState.timeIndicatorPosition === this.state.timeIndicatorPosition;

              this.setTimeIndicatorPositionUpdateInterval(tail);
          }
      } else if (
          isNow &&
      (localizer.neq(prevProps.min, min, "minutes") ||
        localizer.neq(prevProps.max, max, "minutes"))
      ) {
          this.positionTimeIndicator();
      }
  }

  /**
   * @param tail {Boolean} - whether `positionTimeIndicator` call should be
   *   deferred or called upon setting interval (`true` - if deferred);
   */
  setTimeIndicatorPositionUpdateInterval(tail = false) {
      if (!this.intervalTriggered && !tail) {
          this.positionTimeIndicator();
      }

      this._timeIndicatorTimeout = window.setTimeout(() => {
          this.intervalTriggered = true;
          this.positionTimeIndicator();
          this.setTimeIndicatorPositionUpdateInterval();
      }, 60000);
  }

  clearTimeIndicatorInterval() {
      this.intervalTriggered = false;
      window.clearTimeout(this._timeIndicatorTimeout);
  }

  positionTimeIndicator() {
      const { min, max, getNow } = this.props;
      const current = getNow();

      if (current >= min && current <= max) {
          const top = this.slotMetrics.getCurrentTimePosition(current);
          this.intervalTriggered = true;
          this.setState({ timeIndicatorPosition: top });
      } else {
          this.clearTimeIndicatorInterval();
      }
  }

  validDateToCreatePost = (date, today) => {
      return new Date( date ).setHours(0,0,0,0) >= new Date( today).setHours(0,0,0,0);
  }

  getDay = (date) => {
      let day = date.toString().split(" ")[2];
      day = day < 10 ? day % 10 : day;
      return day;
  }

  handleShowMore = () => {
      const { range, weekId, onShowMore, totalEvents, date } = this.props;
      if (onShowMore) {
          onShowMore(totalEvents, date, null);
      } else {
          this.props.toggleViewAllPostsDrawer(range[weekId], false, this.nonAIBTPPosts.length);
      }
  };

  getShowMoreLabel = () => {
      const { noOfPostInDay, weekId, noOfPostsPerDay, calendarSimmerStatus } = this.props;

      if (noOfPostInDay[weekId + 1] > noOfPostsPerDay && !calendarSimmerStatus) {
          return (<button onClick={this.handleShowMore} className={clsx("rbc-button-link", "rbc-show-more")} key={weekId}>View more</button>);
      } else return null;
  };

  render() {
      const {
          currentDate,
          updateCurrentDate,
          selectedEvent,
          date,
          max,
          rtl,
          isNow,
          resource,
          accessors,
          localizer,
          getters: { dayProp, ...getters },
          components: { eventContainerWrapper: EventContainer, ...components },
          showCurrentDateTimeIndicator,
          getNow,
          setShowScheduleDatePicker,
          updatePostDateAndTime,
          rotatedNode,
          setCurrentPostDate,
          isSocial,
          currentColumnInfo,
          updateCurrentColumnInfo
      } = this.props;
      // TODO: CHECK LATER, GETTING CONSOLE WARNING ON THIS LINE
      if (currentDate === null || this.props.isNow) {
          updateCurrentDate(this.props.date);
      }

      let { slotMetrics } = this;
      let { selecting, top, height, startDate, endDate } = this.state;

      let selectDates = { start: startDate, end: endDate };

      const { className, style } = dayProp(max);

      const DayColumnWrapperComponent =
      components.dayColumnWrapper || DayColumnWrapper;

      const { createPost: CreatePost } = components;
      const day = this.getDay(date);

      return (
          <DayColumnWrapperComponent
              date={date}
              style={style}
              className={clsx(
                  className,
                  "rbc-day-slot",
                  "rbc-time-column",
                  isNow && "rbc-now rbc-today",
                  new Date( date ).setHours(0,0,0,0) < new Date( getNow() ).setHours(0,0,0,0) && "past-dates",
                  selecting && "rbc-slot-selecting"
              )}
              slotMetrics={slotMetrics}
          >
              {slotMetrics.groups.map((grp, idx) => (
                  <TimeSlotGroup
                      key={idx}
                      group={grp}
                      resource={resource}
                      getters={getters}
                      components={components}
                  />
              ))}

              <EventContainer
                  localizer={localizer}
                  resource={resource}
                  accessors={accessors}
                  getters={getters}
                  components={components}
                  slotMetrics={slotMetrics}
              >
                  { isSocial ? 
                      <Fragment>
                          <div id="wrapper" 
                              onDrop={() => removeStyleOnDrop(rotatedNode,selectedEvent,day)} 
                              onDragOver={(e) => onDragOver(e)} 
                              onDragEnter={(event) => onDragEnter(event,day,selectedEvent,currentDate,this.props.date,currentColumnInfo,updateCurrentColumnInfo)} 
                              onDragLeave={(event) => onDragLeave(event,day,selectedEvent,currentColumnInfo,updateCurrentColumnInfo)} 
                              className={clsx("rbc-events-container", rtl && "rtl")}>
                     
                                <div className="drop-wrap" id={`box_container_${day}`} style={{display: "none"}}>
                                    { !this.props.isContentHub && (
                                        <div className={`drop-block common_box_${day}`} id={`box_child_1_${day}`} onDrop={(event) => onDrop(event,selectedEvent,"keep_scheduled_time",day,setShowScheduleDatePicker,updatePostDateAndTime,date)} onDragEnter={() => onDragEnterInSchedulerBox("1",day,selectedEvent)} onDragLeave={(e) => onDragLeaveFromSchedulerBox(e,"1",day)}><p>Keep scheduled time</p><p>{moment(selectedEvent.startActual).format("hh:mm A")}</p></div>
                                    )}
                                    <div className={`drop-block common_box_${day}`} id={`box_child_2_${day}`} onDrop={(event) => onDrop(event,selectedEvent,"pick_new_time",day,setShowScheduleDatePicker,updatePostDateAndTime,date,setCurrentPostDate)} onDragEnter={() => onDragEnterInSchedulerBox("2",day,selectedEvent)} onDragLeave={(e) => onDragLeaveFromSchedulerBox(e,"2",day)}>
                                        <span>{this.props.isContentHub ? "Pick a time" : "Pick new post time"}</span>
                                    </div>
                                </div>
                              {this.props.backgroundEvents.length > 0 && this.renderEvents({
                                  events: this.props.backgroundEvents,
                                  isBackgroundEvent: true
                              })}
                              <div className="social_calendar_column">
                                  {this.renderEvents({ events: this.props.totalEvents })}
                              </div>
                              {CreatePost && CreatePost({ classes: `${new Date( date ).setHours(0,0,0,0) >= new Date( getNow() ).setHours(0,0,0,0) ? "create-post-cta" : "disable-create-post-cta"}`, style: {}, publishDate: date })}
                          </div>
                      </Fragment> 
                      : 
                      <div id="wrapper" >
                          {this.props.backgroundEvents.length > 0 && this.renderEvents({
                              events: this.props.backgroundEvents,
                              isBackgroundEvent: true
                          })}
                          {this.renderEvents({ events: this.props.events })}
                      </div>
                  }
              </EventContainer>

              {selecting && (
                  <div className="rbc-slot-selection" style={{ top, height }}>
                      <span>{localizer.format(selectDates, "selectRangeFormat")}</span>
                  </div>
              )}
              {isNow && this.intervalTriggered && showCurrentDateTimeIndicator && (
                  <div
                      className="rbc-current-time-indicator"
                      style={{ top: `${this.state.timeIndicatorPosition}%` }}
                  />
              )}
          </DayColumnWrapperComponent>
      );
  }

  renderEvents ({ events, isBackgroundEvent }) {
      let {
          rtl,
          selected,
          accessors,
          localizer,
          getters,
          components,
          step,
          timeslots,
          dayLayoutAlgorithm,
          resizable,
          eventPositionInPercent,
          updateSelectedEvent,
          setReschedulePostId,
          updateRotatedNode,
          isSocial,
          isSat,
          calendarSimmerStatus,
          isSun,
          currentColumnInfo,
          updateCurrentColumnInfo,
          weekId,
          noOfPostsPerDay,
          customWeekAndMonthViewLoader,
          checkEventDraggable
      } = this.props;

      const { slotMetrics } = this;
      const { messages } = localizer;

      let styledEvents = DayEventLayout.getStyledEvents({
          events,
          accessors,
          slotMetrics,
          minimumStartDifference: Math.ceil((step * timeslots) / 2),
          dayLayoutAlgorithm,
          isSocial
      });
      if (styledEvents.length > noOfPostsPerDay && isSocial) {
          // 1. Slice the first N events (retains order)
          const mainEvents = styledEvents?.slice(0, noOfPostsPerDay);

          // 2. Get all AI events from styledEvents
          const allAIEvents = styledEvents?.filter((e) => e?.event?.aiBestTimeToPost);

          // 3. Filter AI events that are NOT already in mainEvents
          const remainingAIEvents = allAIEvents?.length > 0
              ? allAIEvents.filter((aiEvent) => {
                  return (
                    aiEvent?.event?.aiBestTimeToPost === true &&
                    !mainEvents.some(
                        (mainEvent) =>
                            moment(mainEvent?.event?.start).isSame(aiEvent?.event?.start)
                    )
                  );
              })
              : [];

          // 4. Final events: main (original order), then remaining AI events
          styledEvents = [...(mainEvents || []), ...remainingAIEvents];
          this.nonAIBTPPosts = styledEvents.filter((post) => !post?.event?.aiBestTimeToPost);
      }
      const getChildren = (event,style,idx,label,continuesPrior,continuesAfter) => {
          return (<TimeGridEvent
              style={style}
              event={event}
              label={label}
              key={"evt_" + idx}
              getters={getters}
              rtl={rtl}
              components={components}
              continuesPrior={continuesPrior}
              continuesAfter={continuesAfter}
              accessors={accessors}
              selected={isSelected(event, selected)}
              onClick={(e) => this._select(event, e)}
              onDoubleClick={(e) => this._doubleClick(event, e)}
              isBackgroundEvent={isBackgroundEvent}
              onKeyPress={(e) => this._keyPress(event, e)}
              resizable={resizable}
              eventPositionInPercent={eventPositionInPercent}
              weekId={weekId}
          />);
      };

      const renderTimeGridEvent = (event,style,idx,label,continuesPrior,continuesAfter) => {
          const children = getChildren(event,style,idx,label,continuesPrior,continuesAfter);
          if (isSocial) {
              return (
                  <div 
                      onDrag={onDrag} 
                      id={`card_${event.id}`} 
                      className={`cards groupby_${event.day} ${isSun ? "left-align-post" : ""} ${(isSat && idx !== 0) ? "right-most-card" : ""} ${(isSat && idx === 0 && event.mediaSequence !== null ) ? "right-most-card" : ""} ${(idx === 0 && event.mediaSequence === null) ? "first-post" : ""}`}
                      draggable={checkEventDraggable && checkEventDraggable(event) ? "true" : "false"}
                      onDragEnd={() => onDragEnd()}
                      onDragStart={e => onDragStart(e,event,updateSelectedEvent,setReschedulePostId,updateRotatedNode,currentColumnInfo, updateCurrentColumnInfo)}>
                      {children}
                  </div>);
          } else {
              return (<Fragment>
                  {children}
              </Fragment>);
          }
      };

      return (
          <Fragment>
              { (calendarSimmerStatus && isSocial) ?
                  <CalendarShimmer 
                      rowCount={this.state.shimmerCards}
                      label="week"
                      customWeekAndMonthViewLoader={customWeekAndMonthViewLoader}
                  />
                  :
                  styledEvents.map(({ event, style }, idx) => {
                      let end = accessors.end(event);
                      let start = accessors.start(event);
                      let format = "eventTimeRangeFormat";
                      let label;

                      const startsBeforeDay = slotMetrics.startsBeforeDay(start);
                      const startsAfterDay = slotMetrics.startsAfterDay(end);

                      if (startsBeforeDay) format = "eventTimeRangeEndFormat";
                      else if (startsAfterDay) format = "eventTimeRangeStartFormat";

                      if (startsBeforeDay && startsAfterDay) label = messages.allDay;
                      else label = localizer.format({ start, end }, format);

                      let continuesPrior = startsBeforeDay || slotMetrics.startsBefore(start);
                      let continuesAfter = startsAfterDay || slotMetrics.startsAfter(end);
                      return (
                          renderTimeGridEvent(event, style, idx, label, continuesPrior, continuesAfter)
                      );
                  })
              }
              {isSocial && this.getShowMoreLabel()}
          </Fragment>
      );
  }

  _selectable = () => {
      let node = findDOMNode(this);
      const { longPressThreshold, localizer } = this.props;
      let selector = (this._selector = new Selection(() => findDOMNode(this), {
          longPressThreshold
      }));

      let maybeSelect = (box) => {
          let onSelecting = this.props.onSelecting;
          let current = this.state || {};
          let state = selectionState(box);
          let { startDate: start, endDate: end } = state;

          if (onSelecting) {
              if (
                  (localizer.eq(current.startDate, start, "minutes") &&
            localizer.eq(current.endDate, end, "minutes")) ||
          onSelecting({ start, end, resourceId: this.props.resource }) === false
              )
                  return;
          }

          if (
              this.state.start !== state.start ||
        this.state.end !== state.end ||
        this.state.selecting !== state.selecting
          ) {
              this.setState(state);
          }
      };

      let selectionState = (point) => {
          let currentSlot = this.slotMetrics.closestSlotFromPoint(
              point,
              getBoundsForNode(node)
          );

          if (!this.state.selecting) {
              this._initialSlot = currentSlot;
          }

          let initialSlot = this._initialSlot;
          if (localizer.lte(initialSlot, currentSlot)) {
              currentSlot = this.slotMetrics.nextSlot(currentSlot);
          } else if (localizer.gt(initialSlot, currentSlot)) {
              initialSlot = this.slotMetrics.nextSlot(initialSlot);
          }

          const selectRange = this.slotMetrics.getRange(
              localizer.min(initialSlot, currentSlot),
              localizer.max(initialSlot, currentSlot)
          );

          return {
              ...selectRange,
              selecting: true,

              top: `${selectRange.top}%`,
              height: `${selectRange.height}%`
          };
      };

      let selectorClicksHandler = (box, actionType) => {
          if (!isEvent(findDOMNode(this), box)) {
              const { startDate, endDate } = selectionState(box);
              this._selectSlot({
                  startDate,
                  endDate,
                  action: actionType,
                  box
              });
          }
          this.setState({ selecting: false });
      };

      selector.on("selecting", maybeSelect);
      selector.on("selectStart", maybeSelect);

      selector.on("beforeSelect", (box) => {
          if (this.props.selectable !== "ignoreEvents") return;

          return !isEvent(findDOMNode(this), box);
      });

      selector.on("click", (box) => selectorClicksHandler(box, "click"));

      selector.on("doubleClick", (box) =>
          selectorClicksHandler(box, "doubleClick")
      );

      selector.on("select", (bounds) => {
          if (this.state.selecting) {
              this._selectSlot({ ...this.state, action: "select", bounds });
              this.setState({ selecting: false });
          }
      });

      selector.on("reset", () => {
          if (this.state.selecting) {
              this.setState({ selecting: false });
          }
      });
  }

  _teardownSelectable = () => {
      if (!this._selector) return;
      this._selector.teardown();
      this._selector = null;
  }

  _selectSlot = ({ startDate, endDate, action, bounds, box }) => {
      let current = startDate,
          slots = [];

      while (this.props.localizer.lte(current, endDate)) {
          slots.push(current);
          current = new Date(+current + this.props.step * 60 * 1000); // using Date ensures not to create an endless loop the day DST begins
      }

      notify(this.props.onSelectSlot, {
          slots,
          start: startDate,
          end: endDate,
          resourceId: this.props.resource,
          action,
          bounds,
          box
      });
  }

  _select = (...args) => {
      notify(this.props.onSelectEvent, args);
  }

  _doubleClick = (...args) => {
      notify(this.props.onDoubleClickEvent, args);
  }

  _keyPress = (...args) => {
      notify(this.props.onKeyPressEvent, args);
  }
}

DayColumn.propTypes = {
    events: PropTypes.array.isRequired,
    backgroundEvents: PropTypes.array.isRequired,
    step: PropTypes.number.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    min: PropTypes.instanceOf(Date).isRequired,
    max: PropTypes.instanceOf(Date).isRequired,
    getNow: PropTypes.func.isRequired,
    isNow: PropTypes.bool,

    rtl: PropTypes.bool,
    resizable: PropTypes.bool,

    accessors: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    getters: PropTypes.object.isRequired,
    localizer: PropTypes.object.isRequired,

    showMultiDayTimes: PropTypes.bool,
    culture: PropTypes.string,
    timeslots: PropTypes.number,

    selected: PropTypes.object,
    selectable: PropTypes.oneOf([true, false, "ignoreEvents"]),
    eventOffset: PropTypes.number,
    longPressThreshold: PropTypes.number,

    onSelecting: PropTypes.func,
    onSelectSlot: PropTypes.func.isRequired,
    onSelectEvent: PropTypes.func.isRequired,
    onDoubleClickEvent: PropTypes.func.isRequired,
    onKeyPressEvent: PropTypes.func,

    className: PropTypes.string,
    dragThroughEvents: PropTypes.bool,
    resource: PropTypes.any,
    eventPositionInPercent: PropTypes.bool,

    dayLayoutAlgorithm: DayLayoutAlgorithmPropType,

    showCurrentDateTimeIndicator: PropTypes.bool,
    updatePostDateAndTime: PropTypes.func,
    setReschedulePostId: PropTypes.func,
    setShowScheduleDatePicker: PropTypes.func,
    currentDate: PropTypes.any,
    updateCurrentDate: PropTypes.func,
    selectedEvent: PropTypes.object,
    updateSelectedEvent: PropTypes.func,
    rotatedNode: PropTypes.object,
    updateRotatedNode: PropTypes.func,
    isSocial: PropTypes.bool,
    setCurrentPostDate: PropTypes.func,
    isSat: PropTypes.bool,
    calendarSimmerStatus: PropTypes.bool,
    isSun: PropTypes.bool,
    currentColumnInfo: PropTypes.object,
    updateCurrentColumnInfo: PropTypes.func,
    weekId: PropTypes.number,
    range: PropTypes.array,
    toggleViewAllPostsDrawer: PropTypes.func,
    noOfPostInDay: PropTypes.object,
    viewMoreCount: PropTypes.number,
    noOfPostsPerDay: PropTypes.number,
    totalEvents: PropTypes.array,
    customWeekAndMonthViewLoader: PropTypes.node,
    checkEventDraggable: PropTypes.func,
    onShowMore: PropTypes.func,
    isContentHub: PropTypes.bool
};

DayColumn.defaultProps = {
    dragThroughEvents: true,
    timeslots: 2
};

export default DayColumn;
