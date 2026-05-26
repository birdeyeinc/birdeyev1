import React, { useState } from 'react'
import { Calendar, momentLocalizer } from "./index";
import moment from 'moment';
import DayColumHeaderCell from './DayColumnHeaderCell';
import Button from 'atoms/Button';
import AiBestTimeToPost from "atoms/AiBestTimeToPost/AiBestTimeToPost";

export default {
  title: 'Component/Calendar',
  component: Calendar,
  tags: ["autodocs"]
};

const format = {
  dayFormat: "ddd Do",
  timeGutterFormat: "ha"
};

const localizer = momentLocalizer(moment);

function newDate(dateStr) {
  return new Date(dateStr); // mimic your format
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const yesteryear = new Date(today);
yesteryear.setDate(yesteryear.getDate() - 1);

// Format: "MM/DD/YYYY"
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

function buildDateObject(date) {
  return {
    publishDate: date.toISOString(),
    startActual: newDate(date.toISOString()),
    datePublish: date.getTime(),
    start: newDate(date.toISOString()),
    end: newDate(date.toISOString()),
    actualPostDate: formatDate(date),
    date: date
  };
}
// Object with today’s values
const datesToday = buildDateObject(today);

// Object with tomorrow’s values
const datesTomorrow = buildDateObject(tomorrow);

// Object with yesteryear’s values
const datesYesteryear = buildDateObject(yesteryear);

const pickDate = [datesYesteryear, datesToday, datesTomorrow];

function getFinalDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
// Normal Event
const eventsData = Array.from({ length: 3 }, (_, k) => k).flatMap((i) => {
  return Array.from({ length: 5 }, (_, j) => ({
    "id": 5956303 + i + j,
    "postText": "Test " + i + j,
    "publishDate": today.toISOString(),
    datePublish: today.getTime(),
    "scheduleInfoId": 4759857,
    "start": pickDate[i].start,
    "month": 6,
    "day": 4,
    "year": 2025,
    "finalDate": getFinalDate(pickDate[i].date),
    "end": pickDate[i].end,
    "startActual": pickDate[i].startActual,
    "actualPostDate": pickDate[i].startActual
  }))
});
// AI Card Event
eventsData.unshift({
  "datePublish": 1751918400000,
  "aiBestTimeToPost": true,
  "publishDate": "2025-07-07T20:00:00.000Z",
  "postingSites": [
    "twitter"
  ],
  "isAllDayEvent": false,
  "start": pickDate[2].start,
  "month": 6,
  "day": 8,
  "year": 2025,
  "finalDate": "2025-6-8",
  "end": pickDate[2].end,
  "startActual": "2025-07-07T20:00:00.000Z",
  "actualPostDate": "07/07/2025"
})
/*************************************Component Render*********************/
const eventWrapper = ({ event, children }) => {
  if (event?.aiBestTimeToPost) return (<AiBestTimeToPost datePublish={event.datePublish} dispatch={() => {}} />);
  return (<div style={{ backgroundColor: "red" }}><div>{event.id + " " + event.postText}</div><div>{event.postText}</div></div>);
};

const components = {
  eventWrapper,
  week: {},
  createPostWithHeader: ({ localizer, getDrilldownView, isSocial, today, getters, appointmentHeader, date, index, permissions, showPlusIcon, plusIconCallback }) => (
    <DayColumHeaderCell
      dispatch={() => { }}
      localizer={localizer}
      getDrilldownView={getDrilldownView}
      today={today}
      getters={getters}
      appointmentHeader={appointmentHeader}
      date={date}
      isSocial={isSocial}
      index={index}
      permissions={permissions}
      showPlusIcon={showPlusIcon}
      plusIconCallback={plusIconCallback}
    />
  )
}

const defaultProps = {
  toolbar: true,
  components: components,
  events: eventsData,
  localizer: localizer,
  startAccessor: "start",
  endAccessor: "end",
  formats: format,
  step: 60,
  timeslots: 2,
  isSocial: true,
  showAIIcon: false,
  showPlusIcon: false,
  toggleViewAllPostsDrawer: () => alert("View more"),
  renderDates: {
    "2Jul2025": true,
    "3Jul2025": false,
    "4Jul2025": false,
    "5Jul2025": false
  }
}

export const Default = ({ ...args }) => {
  const [view, setView] = useState("week");
  const [date, setDate] = useState(moment());
  return (<Calendar {...args}
    {...defaultProps}
    onView={(active) => setView(active)}
    view={view}
    date={date}
    onNavigate={(date) => setDate(moment(date))}
  />);
};

export const WithCustomToolbarButtons = ({ ...args }) => {
  const [view, setView] = useState("week");
  const [date, setDate] = useState(moment());
  return (<Calendar {...args}
    {...defaultProps}
    view={view}
    date={date}
    onView={(active) => setView(active)}
    onNavigate={(date) => setDate(moment(date))}
    setShowDatePicker={() => alert("Custom date picker")}
    //Custom button handling
    renderCustomJSXToolbar={() => <div className="ml-5"><Button label="B2" theme="secondary" /></div>}
    bestTimeAIToggle={() => <div className="ml-5"><Button label="B1" theme="secondary" /></div>}
    // Drag and Drop props
    checkEventDraggable={() => true}
    setReschedulePostId={() => { }}
    updatePostDateAndTime={(data) => alert("Scheduled for the same time " + data.scheduleDate)}
    setCurrentPostDate={(date) => alert("Scheduled for the different time " + date.toDate())}
    setShowScheduleDatePicker={(data) => {
      console.log(data, "datadata")
    }}
    isMonthView={view === "month"}
  />);
}

export const WithPlusIcon = ({ ...args }) => {
  const [view, setView] = useState("week");
  const [date, setDate] = useState(moment());
  return (<Calendar {...args}
    {...defaultProps}
    date={date}
    // view and update view props
    view={view}
    onView={(active) => setView(active)}
    // navigate to different week/month/today props
    onNavigate={(date) => setDate(moment(date))}
    setShowDatePicker={() => alert("Custom date picker")}
    //Custom button props
    renderCustomJSXToolbar={() => <div className="ml-5"><Button label="B2" theme="secondary" /></div>}
    bestTimeAIToggle={() => <div className="ml-5"><Button label="B1" theme="secondary" /></div>}
    // plus icon and callback props
    showPlusIcon
    plusIconCallback={() => alert()}
    showListView
    isMonthView={view === "month"}

    customAICard={<AiBestTimeToPost datePublish={1751976000000} dispatch={() => {}} />}
    showAiBestTime
    aiPosts={{}}
  />);
}

export const WithShimmer = ({ ...args }) => {
  const [view, setView] = useState("week");
  const [date, setDate] = useState(moment());
  return (<Calendar {...args}
    {...defaultProps}
    date={date}
    // view and update view props
    view={view}
    onView={(active) => setView(active)}
    // navigate to different week/month/today props
    onNavigate={(date) => setDate(moment(date))}
    setShowDatePicker={() => alert("Custom date picker")}
    //Custom button props
    renderCustomJSXToolbar={() => <div className="ml-5"><Button label="B2" theme="secondary" /></div>}
    bestTimeAIToggle={() => <div className="ml-5"><Button label="B1" theme="secondary" /></div>}
    // plus icon and callback props
    showPlusIcon
    plusIconCallback={() => alert()}
    showListView
    isMonthView={view === "month"}
    customRangeToolbar="07/02/2025 - 08/01/2025"
    calendarSimmerStatus={true}
  // Custom Shimmer handling
  // customListViewCalendarShimmer={<CalendarListViewShimmer noOfShimmers={4} initialLoader />}
  // customWeekAndMonthViewLoader={<CalendarShimmer rowCount={1} />}
  />);
}