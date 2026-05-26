/* eslint-disable react/no-find-dom-node */
import PropTypes from "prop-types";
import React from "react";
import { findDOMNode } from "react-dom";
import clsx from "clsx";

import chunk from "lodash/chunk";
import { navigate, views } from "./utils/constants";
import { inRange, sortEvents, stableSortEvents } from "./utils/eventLevels";
import { updateEventsInRange } from "./utils";
import { notify } from "./utils/helpers";
import getPosition from "dom-helpers/position";
import * as animationFrame from "dom-helpers/animationFrame";

import Popup from "./Popup";
import Overlay from "react-overlays/Overlay";
import DateContentRow from "./DateContentRow";
import Header from "./Header";
import DateHeaderWrapper from "./dateHeaderWrapper";

let eventsForWeek = (evts, start, end, accessors, localizer) =>
    evts.filter((e) => inRange(e, start, end, accessors, localizer));

class MonthView extends React.Component {
    constructor(...args) {
        super(...args);

        this._bgRows = [];
        this._pendingSelection = [];
        this.slotRowRef = React.createRef();
        this.state = {
            rowLimit: 5,
            needLimitMeasure: true,
            isHover: false,
            selectedDate: null,
            selectedDiv: null,
            draggingOutsideAllowedArea: false,
            selectedEvent: null,
            currentColumnInfo: { ele: null, id: null, prevDay:null }
        };
    }

    componentWillReceiveProps({ date }) {
        const { date: propsDate, localizer } = this.props;
        this.setState({
            needLimitMeasure: localizer.neq(date, propsDate, "month")
        });
    }

    componentDidMount() {
        let running;

        if (this.state.needLimitMeasure) this.measureRowLimit(this.props);

        window.addEventListener(
            "resize",
            (this._resizeListener = () => {
                if (!running) {
                    animationFrame.request(() => {
                        running = false;
            this.setState({ needLimitMeasure: true }) //eslint-disable-line
                    });
                }
            }),
            false
        );
    }

    componentDidUpdate() {
        if (this.state.needLimitMeasure) this.measureRowLimit(this.props);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this._resizeListener, false);
    }

    getContainer = () => {
        return findDOMNode(this);
    }

    createPost = (date = null) => {
        if (window?.BE?.business.betaProductFeatures?.customRole ? !this.props.permissions?.readWritePermission : false) return;
        if (this.props.plusIconCallback) this.props.plusIconCallback();
        if (this.props.createPost) this.props.createPost(date);
    }; 

    updateSelectedState = (event,selectedDiv) => {
        this.setState({
            selectedDiv,
            selectedEvent: event
        });
    }; 

    updateCurrentColumnInfo = (obj) => {
        this.setState({
            currentColumnInfo: obj
        });
    }

    render() {
        let { date, localizer, className } = this.props,
            month = localizer.visibleDays(date, localizer),
            weeks = chunk(month, 7);

        const browser = navigator.userAgent;
        let isChrome = false;
        let isFireFox = false;
            
        if (browser.indexOf("Chrome") !== -1) {
            isChrome = true;
        } else if (browser.indexOf("Firefox") !== -1) {
            isFireFox = true;
        }

        this._weekCount = weeks.length;

        return (
            <div
            // dragging outside container
                onDragLeave={(e) => {
                    if (!isChrome && !isFireFox) return;
                    const relatedTarget = e.relatedTarget;
                    const box = document.querySelector(".rbc-month-view");

                    if (!relatedTarget || !box.contains(relatedTarget)) {
                        const allEvents = document.querySelectorAll(".rbc-day-bg");
                        for (let item = 0; item < allEvents.length; item++) {
                            if (allEvents[item].classList.contains("empty-cell") || allEvents[item].classList.contains("past-dates")) continue;
                            allEvents[item].style.zIndex = "0";
                            allEvents[item].style.backgroundColor = "transparent";
                        }

                        // const bottomOfCard = document.querySelector(`.bottom_card_${this.state.selectedEvent.id}`);
                        // bottomOfCard.style.display = "flex";

                        const selectedDivs = document.querySelectorAll(`.card_${this.state.selectedEvent.id}`);
                        for (let itemDiv = 0; itemDiv < selectedDivs.length; itemDiv++) {
                            selectedDivs[itemDiv].classList.remove("dragged-box");
                        }
                        this.setState({
                            draggingOutsideAllowedArea: true
                        });
                    }
                }}

                // dragging inside calendar view
                onDragEnter={() => {
                    if (this.state.draggingOutsideAllowedArea) {
                        const allEvents = document.querySelectorAll(".rbc-day-bg");
                        
                        // const bottomOfCard = document.querySelector(`.bottom_card_${this.state.selectedEvent.id}`);
                        // bottomOfCard.style.display = "none";

                        for (let item = 0; item < allEvents.length; item++) {
                            if (this.state.selectedDiv === allEvents[item] || allEvents[item].classList.contains("past-dates")) continue;
                            allEvents[item].style.zIndex = "4";
                        } 

                        const selectedDivs = document.querySelectorAll(`.card_${this.state.selectedEvent.id}`);
                        for (let itemDiv = 0; itemDiv < selectedDivs.length; itemDiv++) {
                            selectedDivs[itemDiv].classList.add("dragged-box");
                        }

                        this.setState({
                            draggingOutsideAllowedArea:false
                        });  
                    }
                }}
                onDrop={() => {
                    const allEvents = document.querySelectorAll(".rbc-day-bg");
                    
                    // const bottomOfCard = document.querySelector(`.bottom_card_${this.state.selectedEvent.id}`);
                    // bottomOfCard.style.display = "flex";

                    const selectedDivs = document.querySelectorAll(`.card_${this.state.selectedEvent.id}`);
                    for (let itemDiv = 0; itemDiv < selectedDivs.length; itemDiv++) {
                        selectedDivs[itemDiv].classList.remove("dragged-box");
                    }
                    
                    for (let item = 0; item < allEvents.length; item++) {
                        if (allEvents[item].classList.contains("empty-cell") || allEvents[item].classList.contains("past-dates")) continue;
                        allEvents[item].style.zIndex = "0";
                        allEvents[item].style.backgroundColor = "transparent";
                    }
                }}
                className={clsx("rbc-month-view", className)}
                role="table"
                aria-label="Month View"
            >
                <div className="rbc-row rbc-month-header" role="row">
                    {this.renderHeaders(weeks[0])}
                </div>
                <div className="fixed-month-header custom-scroll">
                    {weeks.map(this.renderWeek)}
                </div>
                {this.props.popup && this.renderOverlay()}
            </div>
        );
    }

  renderWeek = (week, weekIdx) => {
      let {
          events,
          components,
          selectable,
          getNow,
          selected,
          date,
          localizer,
          longPressThreshold,
          accessors,
          getters,
          showAllEvents,
          monthMaxRows,
          dispatch,
          calendarSimmerStatus,
          isSocial = false,
          customWeekAndMonthViewLoader
      } = this.props;

      const { needLimitMeasure, rowLimit } = this.state;

      // let's not mutate props
      const weeksEvents = eventsForWeek(
          [...updateEventsInRange(events, week[0], week[week.length - 1], isSocial)],
          week[0],
          week[week.length - 1],
          accessors,
          localizer
      );

      const updateDateAndHover = (isHover, selectedDate) => {
          this.setState({isHover, selectedDate});
      };
      if (isSocial) {
          stableSortEvents(weeksEvents, accessors);
      } else {
          weeksEvents.sort((a, b) => sortEvents(a, b, accessors, localizer));
      }

      return (
          <DateContentRow
              key={weekIdx}
              {...this.props}
              ref={weekIdx === 0 ? this.slotRowRef : undefined}
              container={this.getContainer}
              className="rbc-month-row"
              getNow={getNow}
              date={date}
              range={week}
              events={weeksEvents}
              maxRows={showAllEvents ? Infinity : (monthMaxRows || rowLimit)}
              selected={selected}
              selectable={selectable}
              components={components}
              accessors={accessors}
              getters={getters}
              localizer={localizer}
              renderHeader={this.readerDateHeading}
              renderForMeasure={needLimitMeasure}
              onShowMore={this.handleShowMore}
              onSelect={this.handleSelectEvent}
              onDoubleClick={this.handleDoubleClickEvent}
              onKeyPress={this.handleKeyPressEvent}
              onSelectSlot={this.handleSelectSlot}
              longPressThreshold={longPressThreshold}
              rtl={this.props.rtl}
              resizable={this.props.resizable}
              showAllEvents={showAllEvents}
              dispatch={dispatch}
              updateDateAndHover={updateDateAndHover}
              createPost={this.createPost}
              updateSelectedState={this.updateSelectedState}
              startActual={this.state.selectedEvent?.startActual}
              calendarSimmerStatus={calendarSimmerStatus}
              currentColumnInfo={this.state.currentColumnInfo}
              updateCurrentColumnInfo={this.updateCurrentColumnInfo}
              customWeekAndMonthViewLoader={customWeekAndMonthViewLoader}
          />
      );
  }

  readerDateHeading = ({ date, className }) => {
      let { events, isLoadingDone, socialChannels, showAIIcon = false, showPlusIcon = true, plusIconCallback } = this.props;
      const hoverStatus = (new Date(date)?.toISOString() === new Date(this.state.selectedDate)?.toISOString() && new Date().setHours(0,0,0,0) <= new Date(this.state.selectedDate).setHours(0,0,0,0) ) ? this.state.isHover : false;
      return (
          <DateHeaderWrapper
              permissions={this.props.permissions}
              date={date}
              className={className}
              parentProps={this.props}
              hoverStatus={hoverStatus}
              createPost={this.createPost}
              events={events}
              isLoadingDone={isLoadingDone}
              socialChannels={socialChannels}
              showAIIcon={showAIIcon}
              showPlusIcon={showPlusIcon}
              plusIconCallback={plusIconCallback}
          /> 
      );

  }

  renderHeaders(row) {
      let { localizer, components, appointmentHeader } = this.props;
      let first = row[0];
      let last = row[row.length - 1];
      let HeaderComponent = components.header || Header;
      let headerFormat = (appointmentHeader && appointmentHeader === true) ? "appointmentHeaderMonthFormat" : "weekdayFormat";

      return localizer.range(first, last, "day").map((day, idx) => (
          <div key={"header_" + idx} className="rbc-header">
              <HeaderComponent
                  date={day}
                  localizer={localizer}
                  label={localizer.format(day, headerFormat)}
              />
          </div>
      ));
  }

  renderOverlay() {
      let overlay = (this.state && this.state.overlay) || {};
      let { accessors, localizer, components, getters, selected, popupOffset } =
      this.props;

      return (
          <Overlay
              rootClose
              placement="bottom"
              show={!!overlay.position}
              onHide={() => this.setState({ overlay: null })}
              target={() => overlay.target}
          >
              {({ props }) => (
                  <Popup
                      {...props}
                      popupOffset={popupOffset}
                      accessors={accessors}
                      getters={getters}
                      selected={selected}
                      components={components}
                      localizer={localizer}
                      position={overlay.position}
                      show={this.overlayDisplay}
                      events={overlay.events}
                      slotStart={overlay.date}
                      slotEnd={overlay.end}
                      onSelect={this.handleSelectEvent}
                      onDoubleClick={this.handleDoubleClickEvent}
                      onKeyPress={this.handleKeyPressEvent}
                      handleDragStart={this.props.handleDragStart}
                  />
              )}
          </Overlay>
      );
  }

  measureRowLimit() {
      this.setState({
          needLimitMeasure: false,
          rowLimit: this.slotRowRef.current.getRowLimit()
      });
  }

  handleSelectSlot = (range, slotInfo) => {
      this._pendingSelection = this._pendingSelection.concat(range);

      clearTimeout(this._selectTimer);
      this._selectTimer = setTimeout(() => this.selectDates(slotInfo));
  }

  handleHeadingClick = (date, view, e) => {
      e.preventDefault();
      this.clearSelection();
      notify(this.props.onDrillDown, [date, view]);
  }

  handleSelectEvent = (...args) => {
      this.clearSelection();
      notify(this.props.onSelectEvent, args);
  }

  handleDoubleClickEvent = (...args) => {
      this.clearSelection();
      notify(this.props.onDoubleClickEvent, args);
  }

  handleKeyPressEvent = (...args) => {
      this.clearSelection();
      notify(this.props.onKeyPressEvent, args);
  }

  handleShowMore = (events, date, cell, slot, target) => {
      const {
          popup,
          onDrillDown,
          onShowMore,
          getDrilldownView,
          doShowMoreDrillDown
      } = this.props;
      //cancel any pending selections so only the event click goes through.
      this.clearSelection();

      if (popup) {
          let position = getPosition(cell, findDOMNode(this));

          this.setState({
              overlay: { date, events, position, target }
          });
      } else if (doShowMoreDrillDown) {
          notify(onDrillDown, [date, getDrilldownView(date) || views.DAY]);
      }

      notify(onShowMore, [events, date, slot]);
  }

  overlayDisplay = () => {
      this.setState({
          overlay: null
      });
  }

  selectDates(slotInfo) {
      let slots = this._pendingSelection.slice();

      this._pendingSelection = [];

      slots.sort((a, b) => +a - +b);

      const start = new Date(slots[0]);
      const end = new Date(slots[slots.length - 1]);
      end.setDate(slots[slots.length - 1].getDate() + 1);

      notify(this.props.onSelectSlot, {
          slots,
          start,
          end,
          action: slotInfo.action,
          bounds: slotInfo.bounds,
          box: slotInfo.box
      });
  }

  clearSelection() {
      clearTimeout(this._selectTimer);
      this._pendingSelection = [];
  }
}

MonthView.propTypes = {
    events: PropTypes.array.isRequired,
    date: PropTypes.instanceOf(Date),

    min: PropTypes.instanceOf(Date),
    max: PropTypes.instanceOf(Date),

    step: PropTypes.number,
    getNow: PropTypes.func.isRequired,

    scrollToTime: PropTypes.instanceOf(Date),
    enableAutoScroll: PropTypes.bool,
    rtl: PropTypes.bool,
    resizable: PropTypes.bool,
    width: PropTypes.number,

    accessors: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    getters: PropTypes.object.isRequired,
    localizer: PropTypes.object.isRequired,

    selected: PropTypes.object,
    selectable: PropTypes.oneOf([true, false, "ignoreEvents"]),
    longPressThreshold: PropTypes.number,

    onNavigate: PropTypes.func,
    onSelectSlot: PropTypes.func,
    onSelectEvent: PropTypes.func,
    onDoubleClickEvent: PropTypes.func,
    onKeyPressEvent: PropTypes.func,
    onShowMore: PropTypes.func,
    showAllEvents: PropTypes.bool,
    monthMaxRows: PropTypes.number,
    doShowMoreDrillDown: PropTypes.bool,
    onDrillDown: PropTypes.func,
    getDrilldownView: PropTypes.func.isRequired,
    className: PropTypes.string,
    popup: PropTypes.bool,
    handleDragStart: PropTypes.func,
    appointmentHeader: PropTypes.bool,
    dispatch: PropTypes.func,

    popupOffset: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        })
    ]),
    createPost: PropTypes.func,
    calendarSimmerStatus: PropTypes.bool,
    isSocial: PropTypes.bool,
    isLoadingDone: PropTypes.bool,
    socialChannels: PropTypes.array,
    showAIIcon: PropTypes.bool,
    permissions: PropTypes.object,
    showPlusIcon: PropTypes.bool,
    plusIconCallback: PropTypes.func,
    customWeekAndMonthViewLoader: PropTypes.node
};

MonthView.range = (date, { localizer }) => {
    let start = localizer.firstVisibleDay(date, localizer);
    let end = localizer.lastVisibleDay(date, localizer);
    return { start, end };
};

MonthView.navigate = (date, action, { localizer }) => {
    switch (action) {
        case navigate.PREVIOUS:
            return localizer.add(date, -1, "month");

        case navigate.NEXT:
            return localizer.add(date, 1, "month");

        default:
            return date;
    }
};

MonthView.title = (date, { localizer }) =>
    localizer.format(date, "monthHeaderFormat");

export default MonthView;