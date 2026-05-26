import moment, { Moment } from 'moment';
import { map, filter, forEach, isEmpty } from "lodash";
import React, { useState, useEffect, useMemo, Fragment } from 'react';
import ListViewCard from './ListViewCard';
import clsx from "clsx";

interface ListViewProps {
  startDate: Moment;
  endDate: Moment;
  events: any[],
  eventWrapper: (event: object) => HTMLElement;
  renderDates: { [key: number]: string };
  listViewCallStatus?: Date;
  onPageScroll: () => void;
  onClickOfButton?: (date: Date) => void;
  aiPosts?: any;
  socialChannels?: any;
  permissions?: any;
  customAICard?: any
};


type CellData = {
  day: string;
  weekDay: string;
  year: string;
  month: string;
  isCurrentDay: boolean;
  isPasteDate: boolean;
  isRenderCell: boolean | string;
  isPreviousDay: boolean;
  date: Date;
};

const ListView : React.FC<ListViewProps> = (props) => {
  const {
    startDate,
    endDate,
    events = [],
    eventWrapper,
    renderDates,
    onPageScroll,
    onClickOfButton,
    aiPosts,
    socialChannels,
    permissions,
    customAICard
  } = props;

  const [renderCellsData, setRenderCellsData]  = useState<CellData[]>([]);
  const [cellWiseEvents, setCellWiseEvents] = useState({});

  useEffect(() => {
    window.addEventListener("scroll", onPageScroll);


    return () => {
      window.removeEventListener("scroll", onPageScroll);
    }
  }, [])
 
  useEffect(() => {
    let cellsData: CellData[] = [];

    let currentDate: any = startDate.clone();

    while (currentDate.isSameOrBefore(endDate, 'day')) {
        cellsData.push({
          day: currentDate.format("D"),
          weekDay: currentDate.format("ddd"),
          year: currentDate.format("YYYY"),
          month: currentDate.format("MMM"),
          isCurrentDay: currentDate.isSame(moment().local(), "day"),
          isPreviousDay: currentDate.isSame(moment().local().add(-1, "day"), "day"),
          isPasteDate: currentDate.isBefore(moment().local(), "day"),
          isRenderCell: renderDates[currentDate.format("D")+currentDate.format("MMM")+currentDate.format("YYYY")],
          date: currentDate.toDate()
        });
        currentDate.add(1, "day");
    }

    setRenderCellsData(cellsData);
  },[moment(startDate).toDate().toString(), renderDates]);

  const localEvents = useMemo(() => {
    return events;
  }, [events]);

  useEffect(() => {
    if(!isEmpty(localEvents)) {
      const keys = [];
      let start = startDate.clone();
      let end = endDate.clone();
      
      while(start.isSameOrBefore(end, "day")) {
        keys.push(start.format("D")+start.format("ddd")+start.format("MMM")+start.format("YYYY"));
        start.add(1, "day");
      }

      let updatedCellsEvent = cellWiseEvents;

      forEach(keys, (key: string) => {
        updatedCellsEvent = {
          ...updatedCellsEvent,
          [key]: filter(events, (event: any) => {
            const eventDate = moment(event.start);

            if (eventDate.format("D")+eventDate.format("ddd")+eventDate.format("MMM")+eventDate.format("YYYY") == key) return true;

            return false;
          })
        }
      })

      setCellWiseEvents(updatedCellsEvent);
    }
  }, [localEvents])

  return (
    <div id="wrapper" className="rbc-list-view" /*css={calendarCardListView}*/>
      {map(renderCellsData, (cellData: CellData, index: number) => {
        const { isPasteDate, day, month, year, weekDay, isRenderCell, isCurrentDay ,isPreviousDay ,date } = cellData;
        
        if(!isRenderCell) return null;

        return (
          <ListViewCard 
            isPasteDate={isPasteDate}
            day={day}
            month={month}
            year={year}
            weekDay={weekDay}
            isPreviousDay={isPreviousDay}
            date={date}
            onClickOfButton={onClickOfButton}
            eventWrapper={eventWrapper}
            isCurrentDay={isCurrentDay}
            cellWiseEvents={cellWiseEvents}
            isSameMonth={moment(startDate).local().isSame(moment(endDate).local(), "month")}
            isLastCard={index === renderCellsData.length - 1}
            aiPosts={aiPosts}
            socialChannels={socialChannels}
            permissions={permissions}
            customAICard={customAICard}
          />
        )
      })}
    </div>
  )
}

export default ListView