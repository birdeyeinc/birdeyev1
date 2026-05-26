import React, { Fragment } from "react"
import { isEmpty, map, filter } from "lodash";

interface Props {
    isPasteDate: boolean; 
    day: string;
    month: string; 
    year:string;
    weekDay: string;
    isPreviousDay: boolean;
    isCurrentDay: boolean;
    date: Date;
    onClickOfButton?: (date: Date) => void;
    eventWrapper: (event: object) => any;
    cellWiseEvents: any;
    isSameMonth: boolean;
    isLastCard: boolean;
    aiPosts: any;
    socialChannels: any;
    permissions?: any;
    customAICard?: any
}

const ListViewCard: React.FC<Props> = (props) => {

  const { isPasteDate, day, month, year, weekDay, isCurrentDay ,date, onClickOfButton, eventWrapper, cellWiseEvents, isLastCard, aiPosts = {}, socialChannels = [], permissions, customAICard } = props;


  const renderDateDiv = (currentDay : string) => {
    return <div className="calendar-date-wrap">
      <div className={`day-name ${isCurrentDay ? "current-date-text" : ""}`}><span className="weekday">{weekDay},&nbsp;</span> {month}&nbsp; <span className="list-date">{day}</span>
      {/* To-Do: should be props based */}
      {!isPasteDate && !isEmpty(cellWiseEvents[currentDay]) && (window?.BE?.business.betaProductFeatures?.customRole ? permissions?.readWritePermission : true) && <span onClick={() => onClickOfButton(date)} className='add-post-on-date'><i className="icon_phoenix-add-circle"></i></span>}
      </div>
    </div>
  }

  const renderEvents = (currentDay: string) => {
    const filteredEvents = filter(cellWiseEvents[currentDay], (event:any) => !(event?.aiBestTimeToPost));
    return <Fragment>
      {
        (isEmpty(filteredEvents) && !isPasteDate) ? (
          (window?.BE?.business.betaProductFeatures?.customRole ? permissions?.readWritePermission : true) && <button onClick={() => onClickOfButton(date)} className="create-post-cta"><i className="icon_phoenix-add-circle"></i> Create post</button>
        ) : (
          map(cellWiseEvents[currentDay], (event: any) => {
            {/* To-Do: should be props based */}
            return <div className="list-view-cards">{event?.aiBestTimeToPost ?  "" : eventWrapper({event})}</div>
          })
        )
      }
    </Fragment>
  }

  return (
    <Fragment>
        <div className={`calendar-card-box ${isPasteDate ? "calendar-past-date" : ""} ${isLastCard ? "list-last-card" : ""}`}>
            {/* Rendring Date Div */}
            {renderDateDiv(day+weekDay+month+year)}
            {aiPosts && <div className="list-view-besttime-post">
              {
                aiPosts[day+weekDay+month+year]?.map((event: any) => {
                  if(event?.aiBestTimeToPost && customAICard) {
                    return customAICard;
                  }
                }) 
              }
            </div>}
            <div className="list-view-box-wrapper">{renderEvents(day+weekDay+month+year)}</div>
        </div>
    </Fragment>
  )
}

export default ListViewCard