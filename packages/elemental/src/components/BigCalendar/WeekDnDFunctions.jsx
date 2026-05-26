import moment from "moment";

const browser = navigator.userAgent;

let isChrome = false;
let isFireFox = false;
let isSafari = false;
let currentDraggableElement = null;

if (browser.indexOf("Chrome") !== -1) {
    isChrome = true;
} else if (browser.indexOf("Firefox") !== -1) {
    isFireFox = true;
} else if (browser.indexOf("Safari") !== -1) {
    isSafari = true;
}

const dragImage = new Image();
dragImage.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

// generic functions
export const onDragStart = (e, event, updateSelectedEvent, setReschedulePostId ,updateRotatedNode,currentColumnInfo, updateCurrentColumnInfo) => {
    if (isChrome) onDragStartChrome(e, event, updateSelectedEvent, setReschedulePostId ,updateRotatedNode);
    else if (isFireFox) onDragStartFirefox(e, event, updateSelectedEvent, setReschedulePostId ,updateRotatedNode);
    else if (isSafari) onDragStartSafari(e, event, updateSelectedEvent, setReschedulePostId ,updateRotatedNode, currentColumnInfo, updateCurrentColumnInfo);
    else onDragStartChrome(e, event, updateSelectedEvent, setReschedulePostId ,updateRotatedNode);
};

export const onDragEnter = (event, day, selectedEvent, currentDate, date,currentColumnInfo,updateCurrentColumnInfo,flag) => {
    if (isChrome) onDragEnterChorme(event, day, selectedEvent, currentDate, date); 
    else if (isFireFox) onDragEnterFireFox(event, day, selectedEvent, currentDate, date);
    else if (isSafari || (flag === "M" && currentColumnInfo.dragging)) onDragEnterSafari(event, day, selectedEvent, currentDate, date,currentColumnInfo,updateCurrentColumnInfo);  
    else onDragEnterChorme(event, day, selectedEvent, currentDate, date); 
};

export const onDragLeave = (event, day, selectedEvent,currentColumnInfo,updateCurrentColumnInfo,flag) => {
    if (isChrome) onDragLeaveChrome(event, day, selectedEvent);
    else if (isFireFox) onDragLeaveFireFox(event, day, selectedEvent);
    else if (isSafari || (flag === "M" && currentColumnInfo.dragging)) onDragLeaveSafari(event, day, selectedEvent,currentColumnInfo,updateCurrentColumnInfo); 
    else onDragLeaveChrome(event, day, selectedEvent);
};

export const onDragOver = (e) => {
    e.preventDefault();
};

export const onDrag = (e) => {
    if (isChrome) onDragChrome(e);
    else if (isFireFox) onDragFireFox(e);
    else if (isSafari) onDragSafari(e);   
    else onDragChrome(e);
};

export const onDragEnterInSchedulerBox = (boxNumber,day,selectedEvent) => {
    if (isChrome) onDragEnterInSchedulerBoxChrome(boxNumber,day,selectedEvent);
    else if (isFireFox) onDragEnterInSchedulerBoxFireFox(boxNumber,day,selectedEvent);
    else if (isSafari) onDragEnterInSchedulerBoxSafari(boxNumber,day,selectedEvent);
    else onDragEnterInSchedulerBoxChrome(boxNumber,day,selectedEvent);
};

export const onDragLeaveFromSchedulerBox = (e,boxNumber,day) => {
    if (isChrome) onDragLeaveFromSchedulerBoxChrome(e,boxNumber,day);
    else if (isFireFox) onDragLeaveFromSchedulerBoxFireFox(e,boxNumber,day);
    else onDragLeaveFromSchedulerBoxChrome(e,boxNumber,day);
};

export const removeStyleOnDrop = (rotatedNode,selectedEvent,day) => {
    if (isChrome) removeStyleOnDropChrome(rotatedNode,selectedEvent,day);
    else if (isFireFox) removeStyleOnDropFireFox(rotatedNode,selectedEvent,day);
    else if (isSafari) removeStyleOnDropSafari(rotatedNode,selectedEvent,day);
    else removeStyleOnDropChrome(rotatedNode,selectedEvent,day);
};

export const onDrop = (event, selectedEvent, box, day, setShowScheduleDatePicker, updatePostDateAndTime, date, setCurrentPostDate) => {
    if (isChrome) onDropChrome(event, selectedEvent, box, day, setShowScheduleDatePicker, updatePostDateAndTime, date, setCurrentPostDate);
    else if (isFireFox) onDropFireFox(event, selectedEvent, box, day, setShowScheduleDatePicker, updatePostDateAndTime, date, setCurrentPostDate);
    else if (isSafari) onDropSafari(event, selectedEvent, box, day, setShowScheduleDatePicker, updatePostDateAndTime, date, setCurrentPostDate);
    else onDropChrome(event, selectedEvent, box, day, setShowScheduleDatePicker, updatePostDateAndTime, date, setCurrentPostDate);
};

export const resetForSafari = (day,selectedEvent,currentColumnInfo,updateCurrentColumnInfo) => {
    if (isChrome || isFireFox) return;
    hideCards(day,selectedEvent,currentColumnInfo,updateCurrentColumnInfo);
};

export const onDragEnd = () => {
    if (isChrome) {
        const ghostImage = document.querySelector(".rotatedNode");

        if (ghostImage) {
            ghostImage.style.left = "-9000px";
            ghostImage.style.top = 0;
        }
    }
    return;
};

// week view functions
// For chrome
const onDragStartChrome = (e, event, updateSelectedEvent, setReschedulePostId ,updateRotatedNode) => {
    e.dataTransfer.setDragImage(dragImage, 0, 0);

    let bottomCard = document.querySelector(`.bottom_card_${event.id}`);
    if (!bottomCard) bottomCard = e.target;
    currentDraggableElement = bottomCard;
    //TO-DO: will check and remove it
    // bottomCard.style.visibility = "hidden";

    const ghostImage = document.querySelector(".rotatedNode");
    if (ghostImage && document.body?.contains(ghostImage)) ghostImage?.remove();

    updateSelectedEvent(event);
    setReschedulePostId(event.id);

    const selectedDiv = document.getElementById(`card_${event.id}`);

    let cardWidth = document.querySelector(".rbc-day-slot").offsetWidth;
    let rotatedNode = e.target.cloneNode(true);

    cardWidth = cardWidth === 0 ? 152 : cardWidth;

    if (rotatedNode.tagName === "IMG") return;
    selectedDiv.classList.add("dragged-box");

    rotatedNode.style.position = "absolute";
    rotatedNode.style.top = "-200px";
    rotatedNode.style.left = "-9999px";
    rotatedNode.style.opacity = "1";
    rotatedNode.style.width = cardWidth - 16 + "px";
    rotatedNode.classList.add("rotatedNode");
    rotatedNode.style.pointerEvents = "none";
    rotatedNode.style.marginTop = "0";

    let innerNode = rotatedNode.getElementsByClassName("week-event")[0];
    if (!innerNode && rotatedNode) innerNode = rotatedNode.firstChild;
    innerNode.style.transform = "rotate(-10deg)";
    updateRotatedNode(rotatedNode);

    document.body.appendChild(rotatedNode);
};

const onDragEnterChorme = (event, day, selectedEvent, currentDate, date) => {
    if (selectedEvent.day == day || currentDate === null || currentDate >= date) return;

    const droppableBox = document.getElementById(`box_container_${day}`);

    const calendarDiv = document.querySelector(".rbc-time-content");
    droppableBox.style.height = calendarDiv.offsetHeight - 30 + "px";

    const scrollPosition = calendarDiv.scrollTop;
    droppableBox.style.marginTop = scrollPosition + "px";

    const cards = document.querySelectorAll(".cards");
    const groupByDayCards = document.querySelectorAll(`.groupby_${day}`);
    const selectedCard = document.getElementById(`card_${selectedEvent.id}`);

    // hiding cards in which user currently Dragging
    for (let i = 0;i < cards.length;i++) {
        if (cards[i] !== selectedCard && Array.from(groupByDayCards).find(node => node.isEqualNode(cards[i])) !== undefined) {
            cards[i].style.display = "none";
        }
    }

    // showing dropable boxes
    const box = document.getElementById(`box_container_${day}`);
    box.style.display = "block";

    event.preventDefault();
};

const onDragLeaveChrome = (event, day, selectedEvent) => {
    const box = document.getElementById(`box_container_${day}`);
    //   const showTime = selectedEvent.end.;
    const relatedTarget = event.relatedTarget;

    // Check if the relatedTarget is null or not a child of the parent container
    if (!relatedTarget || !box.contains(relatedTarget)) {
    // Code to execute when leaving the parent container
        box.style.display = "none";

        const cards = document.querySelectorAll(".cards");
        const groupByDayCards = document.querySelectorAll(`.groupby_${day}`);
        const selectedCard = document.getElementById(`card_${selectedEvent.id}`);

        for (let i = 0;i < cards.length;i++) {
            if (cards[i] !== selectedCard && Array.from(groupByDayCards).find(node => node.isEqualNode(cards[i])) !== undefined) {
                cards[i].style.display = "block";
            }
        }
        event.preventDefault();
    }
};

const onDragChrome = (e) => {
    const ghostImage = document.querySelector(".rotatedNode");

    if (ghostImage) {
        ghostImage.style.left = (e.clientX - 50) + "px";
        ghostImage.style.top = (e.clientY - 50) + "px";
        ghostImage.style.opacity = "0.93";
    }
};

const onDragEnterInSchedulerBoxChrome = (boxNumber,day,selectedEvent) => {
    if (selectedEvent.day == day) return;
    const child = document.getElementById(`box_child_${boxNumber}_${day}`);
    child.classList.add("selected");
};

const onDragLeaveFromSchedulerBoxChrome = (e,boxNumber,day) => {
    const child = document.getElementById(`box_child_${boxNumber}_${day}`);

    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || !child.contains(relatedTarget)) {
        child.classList.remove("selected");
    }
};

const removeStyleOnDropChrome = (rotatedNode,selectedEvent,day) => {
    let bottomCard = document.querySelector(`.bottom_card_${selectedEvent.id}`);
    if (!bottomCard) bottomCard = currentDraggableElement;
    bottomCard.style.visibility = "visible";
  
    // remove fade effect
    const selectedDiv = document.getElementById(`card_${selectedEvent.id}`);
    if (selectedDiv) selectedDiv.classList.remove("dragged-box");

    // hide dropcontainer
    const boxContainer = document.getElementById(`box_container_${day}`);
    boxContainer.style.display = "none";

    // show all cards after drop at any place in screen
    const cards = document.querySelectorAll(".cards");
    for (let i = 0;i < cards.length;i++) {
        cards[i].style.display = "block";
    }

    // remove selected class from droppable boxes
    for (let i = 1;i <= 2;i++) {
        const childBox = document.getElementById(`box_child_${i}_${day}`);
        if (childBox) childBox.classList.remove("selected");
    }

    if (rotatedNode && isChrome && document.body?.contains(rotatedNode)) rotatedNode?.remove();
};

const onDropChrome = (event, selectedEvent, box, day, setShowScheduleDatePicker, updatePostDateAndTime, date, setCurrentPostDate) => {
    // if card is dropped on same day 
    if (event === undefined || selectedEvent.day === day) return;

    if ("pick_new_time" === box) {
        //  open date picker modal
        const scheduleDate = moment(selectedEvent.publishDate);
        const newDate = moment(date);
        newDate.hour(scheduleDate.hour())
            .minute(scheduleDate.minute())
            .second(scheduleDate.second()); 
        setCurrentPostDate(newDate);
        setShowScheduleDatePicker(true);
    } else {
        // api call for Keep scheduled time
        let scheduleDate = moment(selectedEvent.publishDate);
        let finalDate = moment(date);

        const combinedObj = finalDate
            .hour(scheduleDate.hour())
            .minute(scheduleDate.minute())
            .second(scheduleDate.second())
            .date(finalDate.date())
            .month(finalDate.month())
            .year(finalDate.year());

        const utcDate = moment.utc(combinedObj);

        const datePart = utcDate.format("MM/DD/YYYY");
        const timePart = utcDate.format("HH:mm:ss");

        scheduleDate = datePart.toString() + " " + timePart.toString();

        const payload = {
            scheduleDate,
            id: selectedEvent.id
        };
        updatePostDateAndTime(payload);
    }
};

// For FireFox

const onDragStartFirefox = (e, event, updateSelectedEvent, setReschedulePostId ,updateRotatedNode) => {
    const bottomCard = document.querySelector(`.bottom_card_${event.id}`);
    bottomCard.style.visibility = "hidden";

    const ghostImage = document.querySelector(".rotatedNode");
    if (ghostImage && document.body?.contains(ghostImage)) ghostImage?.remove();

    updateSelectedEvent(event);
    setReschedulePostId(event.id);

    const selectedDiv = document.getElementById(`card_${event.id}`);

    let cardWidth = document.querySelector(".rbc-day-slot").offsetWidth;
    let rotatedNode = e.target.cloneNode(true);

    cardWidth = cardWidth === 0 ? 152 : cardWidth;

    if (rotatedNode.tagName === "IMG") return;
    selectedDiv.classList.add("dragged-box");

    rotatedNode.style.position = "absolute";
    rotatedNode.style.top = "0px";
    rotatedNode.style.left = "-9999px";
    rotatedNode.style.opacity = "1";
    rotatedNode.style.width = cardWidth - 16 + "px";
    rotatedNode.classList.add("rotatedNode");
    rotatedNode.style.pointerEvents = "none";
    rotatedNode.style.marginTop = "0";

    let innerNode = rotatedNode.getElementsByClassName("week-event")[0];
    if (!innerNode && rotatedNode) innerNode = rotatedNode.firstChild;
    innerNode.style.transform = "rotate(-10deg)";
    updateRotatedNode(rotatedNode);

    document.body.appendChild(rotatedNode);
    e.dataTransfer.setDragImage(rotatedNode,cardWidth / 2,20);
};

const onDragEnterFireFox = (event, day, selectedEvent, currentDate, date) => {
    onDragEnterChorme(event, day, selectedEvent, currentDate, date);
};

const onDragLeaveFireFox = (event, day, selectedEvent) => {
    onDragLeaveChrome(event, day, selectedEvent);
};

const onDragFireFox = () => {
    return;
};

const onDragEnterInSchedulerBoxFireFox = (boxNumber,day,selectedEvent) => {
    onDragEnterInSchedulerBoxChrome(boxNumber,day,selectedEvent);
};

const onDragLeaveFromSchedulerBoxFireFox = (e,boxNumber,day) => {
    onDragLeaveFromSchedulerBoxChrome(e,boxNumber,day);
};

const removeStyleOnDropFireFox = (rotatedNode,selectedEvent,day) => {
    removeStyleOnDropChrome(rotatedNode,selectedEvent,day);
};

const onDropFireFox = (event, selectedEvent, box, day, setShowScheduleDatePicker, updatePostDateAndTime, date, setCurrentPostDate) => {
    onDropChrome(event, selectedEvent, box, day, setShowScheduleDatePicker, updatePostDateAndTime, date, setCurrentPostDate);
};

// For Safari

const onDragStartSafari = (e, event, updateSelectedEvent, setReschedulePostId ,updateRotatedNode ) => {
    const resetDivForSafari = document.getElementById("dnd_reset_safari");
    resetDivForSafari.style.zIndex = "4";

    const bottomCard = document.querySelector(`.bottom_card_${event.id}`);
    bottomCard.style.visibility = "hidden";

    let cardWidth = 0;
    let rotatedNode = e.target.cloneNode(true);
    const selectedDiv = document.getElementById(`card_${event.id}`);
    cardWidth = selectedDiv.offsetWidth;
  
    cardWidth = cardWidth === 0 ? 152 : cardWidth;

    if (rotatedNode.tagName === "IMG") return;
    selectedDiv.classList.add("dragged-box");

    rotatedNode.style.position = "absolute";
    rotatedNode.style.top = "0px";
    rotatedNode.style.left = "-9999px";
    rotatedNode.style.opacity = "1";
    rotatedNode.style.width = cardWidth - 16 + "px";
    rotatedNode.classList.add("rotatedNode");
    rotatedNode.style.marginTop = "0";
    rotatedNode.style.minHeight = "100px";
    rotatedNode.style.zIndex = "100";

    e.dataTransfer.setDragImage(rotatedNode,20,20);
    document.body.appendChild(rotatedNode);

    updateSelectedEvent(event);
    setReschedulePostId(event.id);
    updateRotatedNode(rotatedNode);
};

const onDragEnterSafari = (event, day, selectedEvent, currentDate, date,currentColumnInfo,updateCurrentColumnInfo) => {
    if (selectedEvent.day == day || currentDate === null || currentDate >= date) {
        hideCards(currentColumnInfo.prevDay,selectedEvent,currentColumnInfo,updateCurrentColumnInfo);
        return;
    }
    if (currentColumnInfo.ele !== event.currentTarget) {
        hideCards(currentColumnInfo.prevDay,selectedEvent,currentColumnInfo,updateCurrentColumnInfo);
        
        updateCurrentColumnInfo({
            ele : event.currentTarget,
            id : event.currentTarget.childNodes[0].id,
            prevDay: day
        });

        onDragEnterChorme(event,day,selectedEvent,updateCurrentColumnInfo);
    }
};

const hideCards = (day,selectedEvent,currentColumnInfo,updateCurrentColumnInfo) => {
    if (currentColumnInfo.ele) {
        const box = document.getElementById(currentColumnInfo.id);
        box.style.display = "none";

        const cards = document.querySelectorAll(".cards");
        const groupByDayCards = document.querySelectorAll(`.groupby_${day}`);
        const selectedCard = document.getElementById(`card_${selectedEvent.id}`);

        for (let i = 0;i < cards.length;i++) {
            if (cards[i] !== selectedCard && Array.from(groupByDayCards).find(node => node.isEqualNode(cards[i])) !== undefined) {
                cards[i].style.display = "block";
            }
        }

        updateCurrentColumnInfo({
            ele : null,
            id : null,
            prevDay: null
        });
    }
};

const onDragLeaveSafari = () => {
    // hideCards(currentColumnInfo,updateCurrentColumnInfo);
    return;
};

const onDragSafari = () => {
};

const onDragEnterInSchedulerBoxSafari = (boxNumber,day,selectedEvent) => {
    onDragEnterInSchedulerBoxChrome(boxNumber,day,selectedEvent);
};

// const onDragLeaveFromSchedulerBoxSafari = (e,boxNumber,day) => {
//     onDragLeaveFromSchedulerBoxChrome(e,boxNumber,day);
// };

const removeStyleOnDropSafari = (rotatedNode,selectedEvent,day) => {
    const resetDivForSafari = document.getElementById("dnd_reset_safari");
    resetDivForSafari.style.zIndex = "-10";
    removeStyleOnDropChrome(rotatedNode,selectedEvent,day);
};

const onDropSafari = (event, selectedEvent, box, day, setShowScheduleDatePicker, updatePostDateAndTime, date, setCurrentPostDate) => {
    onDropChrome(event, selectedEvent, box, day, setShowScheduleDatePicker, updatePostDateAndTime, date, setCurrentPostDate);
};