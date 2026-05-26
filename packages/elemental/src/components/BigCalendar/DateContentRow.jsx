/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-find-dom-node */
import clsx from "clsx";
import getHeight from "dom-helpers/height";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { findDOMNode } from "react-dom";
import BackgroundCells from "./BackgroundCells";
import BackgroundCellsOther from "./BackgroundCellsOther";
import EventRow from "./EventRow";
import EventEndingRow from "./EventEndingRow";
import NoopWrapper from "./NoopWrapper";
import ScrollableWeekWrapper from "./ScrollableWeekWrapper";
import * as DateSlotMetrics from "./utils/DateSlotMetrics";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

class DateContentRow extends React.Component {
    constructor(...args) {
        super(...args);

        this.slotMetrics = DateSlotMetrics.getSlotMetrics();
        this.maxRows = 5;
    }

  handleSelectSlot = (slot) => {
      const { range, onSelectSlot } = this.props;

      onSelectSlot(range.slice(slot.start, slot.end + 1), slot);
  }

  handleShowMore = (slot, target, events, date) => {
      const { range, weekMaxRows, onShowMore } = this.props;

      if (onShowMore) {
          const slotEvents = events || [];
          const slotDate = date || range[slot - 1];
          onShowMore(slotEvents, slotDate, target, slot, target);
      }
      if (this.props.toggleViewAllPostsDrawer) {
          this.props.toggleViewAllPostsDrawer(range[slot - 1], true, weekMaxRows || this.maxRows);
      }
    }      

  createHeadingRef = (r) => {
      this.headingRow = r;
  }

  createEventRef = (r) => {
      this.eventRow = r;
  }

  getContainer = () => {
      const { container } = this.props;
      return container ? container() : findDOMNode(this);
  }

  getRowLimit() {
      let eventHeight = getHeight(this.eventRow);
      let headingHeight = this.headingRow ? getHeight(this.headingRow) : 0;
      let eventSpace = getHeight(findDOMNode(this)) - headingHeight;

      return Math.max(Math.floor(eventSpace / eventHeight), 1);
  }

  renderHeadingCell = (date, index) => {
      let { renderHeader, getNow, localizer, dispatch } = this.props;
      const dateClass = "class-" + moment(date).format("DD-MM-YYYY");

      return renderHeader({
          date,
          dispatch,
          key: `header_${index}`,
          className: clsx(
              "rbc-date-cell",
              localizer.isSameDate(date, getNow()) && "rbc-now",
              new Date( date ).setHours(0,0,0,0) < new Date( getNow() ).setHours(0,0,0,0) && "rbc-past-date",
              `${dateClass}`
          )
      });
  }

  renderDummy = () => {
      let { className, range, renderHeader, showAllEvents } = this.props;
      return (
          <div className={className}>
              <div
                  className={clsx(
                      "rbc-row-content",
                      showAllEvents && "rbc-row-content-scrollable"
                  )}
              >
                  {renderHeader && (
                      <div className="rbc-row" ref={this.createHeadingRef}>
                          {range.map(this.renderHeadingCell)}
                      </div>
                  )}
                  <div className="rbc-row" ref={this.createEventRef}>
                      <div className="rbc-row-segment">
                          <div className="rbc-event">
                              <div className="rbc-event-content">&nbsp;</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  componentDidUpdate(prevProps) {
      const today = this.props.getNow() || new Date();
      const scrollDateId = moment(today).format("DD-MM-YYYY");
      const elementToScrollTo = document.getElementById(scrollDateId);
      if (elementToScrollTo) {
          if (!isEqual(prevProps.calendarSimmerStatus, this.props.calendarSimmerStatus) || !isEqual(prevProps.events, this.props.events)) {
              elementToScrollTo.scrollIntoView({ behavior: "smooth" });
          }
      }
  }

  render() {
      const {
          date,
          rtl,
          range,
          className,
          selected,
          selectable,
          renderForMeasure,
          accessors,
          getters,
          components,
          getNow,
          renderHeader,
          onSelect,
          localizer,
          onSelectStart,
          onSelectEnd,
          onDoubleClick,
          onKeyPress,
          resourceId,
          longPressThreshold,
          isAllDay,
          resizable,
          showAllEvents,
          updateDateAndHover,
          createPost,
          updateSelectedState,
          calendarSimmerStatus,
          currentColumnInfo,
          updateCurrentColumnInfo,
          isMonthView,
          isSocial,
          weekMaxRows = undefined,
          hideDefaultViewMore = false,
          renderViewMoreBorder,
          customWeekAndMonthViewLoader,
          checkEventDraggable
      } = this.props;

      if (renderForMeasure) return this.renderDummy();

      const effectiveMaxRows = isMonthView 
          ? (this.props.maxRows || this.maxRows) 
          : (weekMaxRows || this.maxRows);
      let metrics = this.slotMetrics({...this.props, maxRows: effectiveMaxRows});
      let { levels, extra } = metrics;

      let ScrollableWeekComponent = showAllEvents
          ? ScrollableWeekWrapper
          : NoopWrapper;
      let WeekWrapper = components.weekWrapper;

      const eventRowProps = {
          selected,
          accessors,
          getters,
          localizer,
          components,
          onSelect,
          onDoubleClick,
          onKeyPress,
          resourceId,
          slotMetrics: metrics,
          resizable,
          updateSelectedState,
          currentColumnInfo,
          updateCurrentColumnInfo,
          renderViewMoreBorder,
          isSocial,
          isMonthView,
          checkEventDraggable          
      };

      const getDatesWithNoPost = (levels, range) => {
          let dateObj1 = {};
          levels.forEach((element) => {
              if (!isEmpty(element.event) && element.event.publishDate) {
                  const publishDate = new Date(element.event.publishDate).setHours(0, 0, 0, 0);
                  const key = new Date(publishDate)?.toISOString().substring(0, 10);
                  dateObj1[key] = publishDate;

              }
          });
        
          let datesWithNoPost = {};
          range.forEach((element) => {
              const key = new Date(element)?.toISOString().substring(0, 10);
              if ( !dateObj1[key] ) {
                  datesWithNoPost[element] = element;
              }
          });
          return datesWithNoPost;
      };
      
      return (
          <div className={className} role="rowgroup">
              {
                  (isMonthView && isSocial) ? (
                      <Fragment>
                          <BackgroundCells
                              {...this.props}
                              localizer={localizer}
                              date={date}
                              getNow={getNow}
                              rtl={rtl}
                              range={range}
                              selectable={selectable}
                              container={this.getContainer}
                              getters={getters}
                              onSelectStart={onSelectStart}
                              onSelectEnd={onSelectEnd}
                              onSelectSlot={this.handleSelectSlot}
                              components={components}
                              longPressThreshold={longPressThreshold}
                              resourceId={resourceId}
                              updateDateAndHover={updateDateAndHover}
                              getDatesWithNoPost={getDatesWithNoPost(levels[0] || [], range)}
                              createPost={createPost}
                              calendarSimmerStatus={calendarSimmerStatus}
                              currentColumnInfo={currentColumnInfo}
                              updateCurrentColumnInfo={updateCurrentColumnInfo}
                              isMonthView={isMonthView}
                              customWeekAndMonthViewLoader={customWeekAndMonthViewLoader}
                              checkEventDraggable={checkEventDraggable}
                          />
                      </Fragment>
                  ) : (
                      <Fragment>
                          <BackgroundCellsOther
                              {...this.props}
                              localizer={localizer}
                              date={date}
                              getNow={getNow}
                              rtl={rtl}
                              range={range}
                              selectable={selectable}
                              container={this.getContainer}
                              getters={getters}
                              onSelectStart={onSelectStart}
                              onSelectEnd={onSelectEnd}
                              onSelectSlot={this.handleSelectSlot}
                              components={components}
                              longPressThreshold={longPressThreshold}
                              resourceId={resourceId}
                              isSocial={isSocial}
                              checkEventDraggable={checkEventDraggable}
                          />
                      </Fragment>
                  )
              }
              <div
                  className={clsx(
                      "rbc-row-content",
                      showAllEvents && "rbc-row-content-scrollable"
                  )}
                  role="row"
              >                  
                  <ScrollableWeekComponent>
                      <WeekWrapper isAllDay={isAllDay} {...eventRowProps}>
                          <div
                              onDragOver={e => e.preventDefault()}
                          >
                              {renderHeader && (
                                  <div className="rbc-row " ref={this.createHeadingRef}>
                                      {range.map(this.renderHeadingCell)}
                                  </div>
                              )}
                              {!calendarSimmerStatus && levels.map((segs, idx) => {
                                  if (isSocial && isEmpty(segs)) return null;
                                  return <EventRow key={idx} segments={segs} {...eventRowProps} />;
                              }
                              )}
                              {!calendarSimmerStatus && !!extra.length && !hideDefaultViewMore && (
                                  <EventEndingRow
                                      segments={extra}
                                      onShowMore={this.handleShowMore}
                                      {...eventRowProps}
                                      renderViewMoreBorder={renderViewMoreBorder}
                                  />
                              )}
                          </div>
                      </WeekWrapper>
                  </ScrollableWeekComponent>
              </div>
          </div>
      );
  }
}

DateContentRow.propTypes = {
    date: PropTypes.instanceOf(Date),
    events: PropTypes.array.isRequired,
    range: PropTypes.array.isRequired,

    rtl: PropTypes.bool,
    resizable: PropTypes.bool,
    resourceId: PropTypes.any,
    renderForMeasure: PropTypes.bool,
    renderHeader: PropTypes.func,

    container: PropTypes.func,
    selected: PropTypes.object,
    selectable: PropTypes.oneOf([true, false, "ignoreEvents"]),
    longPressThreshold: PropTypes.number,

    onShowMore: PropTypes.func,
    showAllEvents: PropTypes.bool,
    onSelectSlot: PropTypes.func,
    onSelect: PropTypes.func,
    onSelectEnd: PropTypes.func,
    onSelectStart: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onKeyPress: PropTypes.func,
    dayPropGetter: PropTypes.func,
    className: PropTypes.string,
    getNow: PropTypes.func.isRequired,
    isAllDay: PropTypes.bool,

    accessors: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    getters: PropTypes.object.isRequired,
    localizer: PropTypes.object.isRequired,

    minRows: PropTypes.number.isRequired,
    maxRows: PropTypes.number.isRequired,
    createPost: PropTypes.func,
    updateDateAndHover: PropTypes.func,
    updateSelectedState: PropTypes.func,
    toggleViewAllPostsDrawer: PropTypes.func,
    calendarSimmerStatus: PropTypes.bool,
    currentColumnInfo: PropTypes.object,
    updateCurrentColumnInfo: PropTypes.func,
    isMonthView: PropTypes.bool,
    isSocial: PropTypes.bool,
    unlockInfinitRowsForEventRendering: PropTypes.bool,
    hideDefaultViewMore: PropTypes.bool,
    weekMaxRows: PropTypes.number,
    renderViewMoreBorder: PropTypes.bool,
    dispatch: PropTypes.func,
    customWeekAndMonthViewLoader: PropTypes.node,
    checkEventDraggable: PropTypes.func
};

DateContentRow.defaultProps = {
    minRows: 0,
    maxRows: Infinity
};

export default DateContentRow;
