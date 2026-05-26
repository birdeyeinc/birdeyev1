/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import clsx from "clsx";
import { updateEventsInRange } from "./utils";
import scrollbarSize from "dom-helpers/scrollbarSize";
import React, { Fragment } from "react";
import DateContentRow from "./DateContentRow";
import ResourceHeader from "./ResourceHeader";
import { notify } from "./utils/helpers";
// import DayColumHeaderCell from "pages/social/publishPhoenix/view/DayColumnHeaderCell";
import DayColumHeaderCell from "./DayColumnHeaderCell";
// const DayColumHeaderCell = () => <div>DayColumHeaderCell</div>;

class TimeGridHeader extends React.Component {
  handleHeaderClick = (date, view, e) => {
      e.preventDefault();
      notify(this.props.onDrillDown, [date, view]);
  }

  renderHeaderCells(range) {
      let {
          localizer,
          getDrilldownView,
          getNow,
          getters,
          components,
          appointmentHeader,
          isSocial,
          permissions,
          showPlusIcon,
          plusIconCallback
      } = this.props;

      const today = getNow();      
      const { createPostWithHeader: CreatePostWithHeader } = components;
      return range.map((date, i) => {
          return (
              <>
                  {isSocial ? CreatePostWithHeader({
                      localizer,
                      getDrilldownView,
                      today,
                      getters,
                      appointmentHeader,
                      date,
                      index: i,
                      isSocial,
                      showPlusIcon,
                      plusIconCallback
                  })
                      :
                      <DayColumHeaderCell
                          permissions={permissions}
                          localizer={localizer}
                          getDrilldownView={getDrilldownView}
                          today={getDrilldownView}
                          getters={getters}
                          appointmentHeader={appointmentHeader}
                          date={date}
                          index={i}
                          isSocial={isSocial}
                          showPlusIcon={showPlusIcon}
                          plusIconCallback={plusIconCallback}
                      />
                  }
              </>
          ); 

      });
  }
  renderRow = (resource) => {
      let {
          events,
          rtl,
          selectable,
          getNow,
          range,
          getters,
          localizer,
          accessors,
          components,
          resizable,
          isSocial
      } = this.props;

      const resourceId = accessors.resourceId(resource);
      let eventsToDisplay = resource
          ? events.filter((event) => accessors.resource(event) === resourceId)
          : events;

      return (
          <DateContentRow
              isAllDay
              rtl={rtl}
              getNow={getNow}
              minRows={2}
              range={range}
              events={eventsToDisplay}
              resourceId={resourceId}
              className="rbc-allday-cell"
              selectable={selectable}
              selected={this.props.selected}
              components={components}
              accessors={accessors}
              getters={getters}
              localizer={localizer}
              onSelect={this.props.onSelectEvent}
              onDoubleClick={this.props.onDoubleClickEvent}
              onKeyPress={this.props.onKeyPressEvent}
              onSelectSlot={this.props.onSelectSlot}
              longPressThreshold={this.props.longPressThreshold}
              resizable={resizable}
              isSocial={isSocial}
          />
      );
  }

  render() {
      let {
          width,
          rtl,
          resources,
          range,
          events,
          getNow,
          accessors,
          selectable,
          components,
          getters,
          scrollRef,
          localizer,
          isOverflowing,
          components: {
              timeGutterHeader: TimeGutterHeader,
              resourceHeader: ResourceHeaderComponent = ResourceHeader
          },
          resizable,
          isSocial,
          toggleViewAllPostsDrawer,
          calendarSimmerStatus
      } = this.props;

      let style = {};
      if (isOverflowing) {
          style[rtl ? "marginLeft" : "marginRight"] = `${scrollbarSize()}px`;
      }

      const groupedEvents = resources.groupEvents(events);

      return (
          <div
              style={style}
              ref={scrollRef}
              className={clsx("rbc-time-header", isOverflowing && "rbc-overflowing")}
          >
              <div
                  className="rbc-label rbc-time-header-gutter"
                  style={{ width, minWidth: width, maxWidth: width }}
              >
                  {TimeGutterHeader && <TimeGutterHeader />}
              </div>

              {resources.map(([id, resource], idx) => {
                  const events = updateEventsInRange(groupedEvents.get(id) || [], range[0], range[range.length - 1], isSocial);
                  return (<div className="rbc-time-header-content" key={id || idx}>
                      {resource && (
                          <div className="rbc-row rbc-row-resource" key={`resource_${idx}`}>
                              <div className="rbc-header">
                                  <ResourceHeaderComponent
                                      index={idx}
                                      label={accessors.resourceTitle(resource)}
                                      resource={resource}
                                  />
                              </div>
                          </div>
                      )}
                      <div
                          className={`rbc-row rbc-time-header-cell${
                              range.length <= 1 ? " rbc-time-header-cell-single-day" : ""
                          } ${isSocial ? "rbc-time-header-week-view" : ""}`}
                      >
                          {!isSocial && this.renderHeaderCells(range)}
                          {isSocial && <Fragment>
                              <div className="week-view-header">
                                  {this.renderHeaderCells(range)}
                              </div>
                              {!calendarSimmerStatus && <div className="apple-wrap">
                                  <DateContentRow
                                      key={idx}
                                      isAllDay
                                      rtl={rtl}
                                      getNow={getNow}
                                      minRows={2}
                                      range={range}
                                      events={events}
                                      resourceId={resource && id}
                                      className="rbc-allday-cell"
                                      selectable={selectable}
                                      selected={this.props.selected}
                                      components={components}
                                      accessors={accessors}
                                      getters={getters}
                                      localizer={localizer}
                                      onSelect={this.props.onSelectEvent}
                                      onDoubleClick={this.props.onDoubleClickEvent}
                                      onKeyPress={this.props.onKeyPressEvent}
                                      onSelectSlot={this.props.onSelectSlot}
                                      onShowMore={this.props.onShowMore}
                                      longPressThreshold={this.props.longPressThreshold}
                                      resizable={resizable}
                                      isSocial={isSocial}
                                      toggleViewAllPostsDrawer={toggleViewAllPostsDrawer}
                                      weekMaxRows={this.props.weekMaxRows || 3}
                                      renderViewMoreBorder
                                  /></div>}
                          </Fragment>}
                      </div>

                      {!isSocial && <DateContentRow
                          key={idx}
                          isAllDay
                          rtl={rtl}
                          getNow={getNow}
                          minRows={2}
                          range={range}
                          events={groupedEvents.get(id) || []}
                          resourceId={resource && id}
                          className="rbc-allday-cell"
                          selectable={selectable}
                          selected={this.props.selected}
                          components={components}
                          accessors={accessors}
                          getters={getters}
                          localizer={localizer}
                          onSelect={this.props.onSelectEvent}
                          onDoubleClick={this.props.onDoubleClickEvent}
                          onKeyPress={this.props.onKeyPressEvent}
                          onSelectSlot={this.props.onSelectSlot}
                          longPressThreshold={this.props.longPressThreshold}
                          resizable={resizable}
                      />}
                  </div>);
              })}
          </div>
      );
  }
}

TimeGridHeader.propTypes = {
    range: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired,
    resources: PropTypes.object,
    getNow: PropTypes.func.isRequired,
    isOverflowing: PropTypes.bool,

    rtl: PropTypes.bool,
    resizable: PropTypes.bool,
    width: PropTypes.number,

    localizer: PropTypes.object.isRequired,
    accessors: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    getters: PropTypes.object.isRequired,

    selected: PropTypes.object,
    selectable: PropTypes.oneOf([true, false, "ignoreEvents"]),
    longPressThreshold: PropTypes.number,

    onSelectSlot: PropTypes.func,
    onSelectEvent: PropTypes.func,
    onDoubleClickEvent: PropTypes.func,
    onKeyPressEvent: PropTypes.func,
    onDrillDown: PropTypes.func,
    onShowMore: PropTypes.func,
    getDrilldownView: PropTypes.func.isRequired,
    scrollRef: PropTypes.any,
    appointmentHeader: PropTypes.bool,
    isSocial: PropTypes.bool,
    openDrawerForApple: PropTypes.func,
    toggleViewAllPostsDrawer: PropTypes.func,
    calendarSimmerStatus: PropTypes.bool,
    permissions: PropTypes.object,
    showPlusIcon: PropTypes.bool,
    plusIconCallback: PropTypes.func,
    weekMaxRows: PropTypes.number
};

export default TimeGridHeader;
