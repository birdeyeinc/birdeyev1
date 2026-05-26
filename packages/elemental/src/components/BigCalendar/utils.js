import moment from "moment";
import { forEach, cloneDeep } from "lodash";

export const updateEventsInRange = (events = [], startDate, endDate, isSocial = false) => {
    if (!isSocial) return events;
    startDate = moment(startDate).startOf("day");
    endDate = moment(endDate).startOf("day");

    const tempEvents = cloneDeep(events);
    forEach(tempEvents, event => {
        if (isCalendarLongCards(event)) {
            const eventStart = moment(event.start).startOf("day");
            const eventEnd = moment(event.end).startOf("day");
            const isStartInRange = eventStart.isSameOrAfter(startDate) && eventStart.isSameOrBefore(endDate);
            const isEndInRange = eventEnd.isSameOrAfter(startDate) && eventEnd.isSameOrBefore(endDate);

            if (isStartInRange && !isEndInRange) {
                event.isAppleEndOutsideRange = true;
                event.isAppleEndInsideRange = false;
                event.isBothFalse = false;
            } else if (!isStartInRange && isEndInRange) {
                event.isAppleEndOutsideRange = false;
                event.isAppleEndInsideRange = true;
                event.isBothFalse = false;
            } else if (!isStartInRange && !isEndInRange) {
                event.isAppleEndOutsideRange = false;
                event.isAppleEndInsideRange = false;
                event.isBothFalse = true;
            }
        }

    });

    return tempEvents;
};

export const isCalendarLongCards = (event) => {
    const site = event?.postingSites?.[0];
    const appleConnect = site == "apple_connect";
    return appleConnect;
}