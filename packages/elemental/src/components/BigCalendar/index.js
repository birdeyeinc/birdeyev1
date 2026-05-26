import EventWrapper from "./EventWrapper";
import BackgroundWrapper from "./BackgroundWrapper";
import "./css/react-big-calendar.css";
export const components = {
    eventWrapper: EventWrapper,
    timeSlotWrapper: BackgroundWrapper,
    dateCellWrapper: BackgroundWrapper
};

export { default as Calendar } from "./Calendar";
export { DateLocalizer } from "./localizer";
export { default as momentLocalizer } from "./localizers/moment";
export { default as luxonLocalizer } from "./localizers/luxon";
export { default as globalizeLocalizer } from "./localizers/globalize";
export { default as dateFnsLocalizer } from "./localizers/date-fns";
export { default as move } from "./utils/move";
export { views as Views, navigate as Navigate } from "./utils/constants";
export {default as DayColumnWrapper} from "./DayColumnWrapper"
export {default as Header} from "./Header"
/**
 * customAICard: to render custom AI card in calendar cell like AIBestTimeToPost(Social)
 * showPlusIcon: to show plus icon in calendar while overing on the cell just like in Social
 * plusIconCallback: callback function to handle plus icon click
 * showListView: to show list view button in the toolbar
 * renderCustomJSXToolbar: to render custom JSX in the toolbar like filter toggle button
 * bestTimeAIToggle: to render AI toggle button in the toolbar as Social
 * setShowDatePicker: to show date picker on click of date in the toolbar
 * customRangeToolbar: to show custom range in the toolbar like "07/02/2025 - 08/01/2025"
 * calendarSimmerStatus: to show shimmer in the calendar while loading data
 * customWeekAndMonthViewLoader: to render custom shimmer in week and month view
 * customListViewCalendarShimmer: to render custom shimmer in list view
 * // Drag and Drop props
    - checkEventDraggable: to enable draggable div
    setReschedulePostId: to set reschedule post id on drag and drop
    updatePostDateAndTime: to update post date and time on drag and drop
    setCurrentPostDate: to set current post date on drag and drop
    setShowScheduleDatePicker: to show schedule date picker on drag and drop
    isMonthView: to check if the view is month view or not
 * aiPosts: to pass AI posts data to the calendar
*/
