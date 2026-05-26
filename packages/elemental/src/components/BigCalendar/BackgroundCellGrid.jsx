import PropTypes from "prop-types";
import React from "react";
import clsx from "clsx";
import moment from "moment"; 
import CalendarShimmer from "./WeekAndMonthViewLoader";

import {
    removeStyleOnDrop,
    onDragEnter,
    onDragLeave,
    onDrop,
    onDragEnterInSchedulerBox,
    onDragLeaveFromSchedulerBox,
    onDragOver
} from "./MonthDnDFunctions";

const BackgroundCellGrid = (props) => {
    const { dateCellWrapper: Wrapper, selected, getters, isEmptyCell, zIndex, mouseEnterAndLeave, moveToCreatePost, index, date, range, current, currentDate, localizer, setShowScheduleDatePicker, updatePostDateAndTime, setReschedulePostId, startActual, setCurrentPostDate, getNow, calendarSimmerStatus, currentColumnInfo, updateCurrentColumnInfo, customWeekAndMonthViewLoader } = props;
    const { className, style } = getters.dayProp(date);

    const getDay = (date) => {
        return moment(date).date();
    };
    const getMonth = (date) => {
        return moment(date).format("MMMM");
    };

    const handleClick = () => {
        if (new Date() > date) return;
        moveToCreatePost(date);
    };

    return (
        <Wrapper key={index} value={date} range={range}>
            <div
                style={{...style,zIndex}}
                className={clsx(
                    `rbc-day-bg month_day_${getDay(date)}_${getMonth(date)}`,
                    className,
                    selected && "rbc-selected-cell",
                    localizer.isSameDate(date, current) && "rbc-today",
                    currentDate &&
                    localizer.neq(currentDate, date, "month") &&
                    "rbc-off-range-bg",
                    isEmptyCell && "empty-cell",
                    new Date( date ).setHours(0,0,0,0) < new Date( getNow() ).setHours(0,0,0,0) && "past-dates"
                )}
                onClick={handleClick}
                onMouseEnter={() => mouseEnterAndLeave(true, date)}
                onMouseLeave={() => mouseEnterAndLeave(false, null)}
                onDragEnter={(e) => onDragEnter(date,currentColumnInfo,updateCurrentColumnInfo,e)}
                onDragLeave={(e) => onDragLeave(e,date,currentColumnInfo,updateCurrentColumnInfo)}
                onDrop={() => removeStyleOnDrop(date,currentColumnInfo)}
                onDragOver={(e) => onDragOver(e)}
            >
                <div id={`month_box_container_${getDay(date)}_${getMonth(date)}`} className="drop-wrap">
                    <div className="drop-block" id={`box_child_1_${getDay(date)}_${getMonth(date)}`}  onDragEnter={() => onDragEnterInSchedulerBox("1",date)} onDragLeave={(e) => onDragLeaveFromSchedulerBox("1",e,date)} onDrop={(e) => onDrop(e,date,"same_time",setCurrentPostDate,setShowScheduleDatePicker,updatePostDateAndTime,setReschedulePostId)}><p>Keep scheduled time</p><p>{moment(startActual).format("hh:mm A")}</p></div>
                    <div className="drop-block" id={`box_child_2_${getDay(date)}_${getMonth(date)}`} onDragEnter={() => onDragEnterInSchedulerBox("2",date)} onDragLeave={(e) => onDragLeaveFromSchedulerBox("2",e,date)} onDrop={(e) => onDrop(e,date,"new_time",setCurrentPostDate,setShowScheduleDatePicker,updatePostDateAndTime,setReschedulePostId)}><span>Pick a new time</span></div>
                </div>
                
                {
                    calendarSimmerStatus &&
                    <CalendarShimmer
                        rowCount={1}
                        customWeekAndMonthViewLoader={customWeekAndMonthViewLoader}
                    />
                }
            </div>
        </Wrapper>
    );
};

BackgroundCellGrid.propTypes = {
    selected: PropTypes.node,
    getters: PropTypes.object.isRequired,
    range: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    isEmptyCell: PropTypes.bool,
    index: PropTypes.number,
    date: PropTypes.any,
    current: PropTypes.instanceOf(Date),
    currentDate: PropTypes.any,
    mouseEnterAndLeave: PropTypes.func.isRequired,
    moveToCreatePost: PropTypes.func.isRequired,
    dateCellWrapper: PropTypes.func.isRequired,
    localizer: PropTypes.object.isRequired,
    setShowScheduleDatePicker: PropTypes.func,
    updatePostDateAndTime: PropTypes.func,
    setReschedulePostId: PropTypes.func,
    zIndex: PropTypes.number,
    startActual: PropTypes.instanceOf(Date),
    setCurrentPostDate: PropTypes.func,
    getNow: PropTypes.func,
    calendarSimmerStatus: PropTypes.bool,
    currentColumnInfo: PropTypes.object,
    updateCurrentColumnInfo: PropTypes.any,
    customWeekAndMonthViewLoader: PropTypes.node
};

export default BackgroundCellGrid;
