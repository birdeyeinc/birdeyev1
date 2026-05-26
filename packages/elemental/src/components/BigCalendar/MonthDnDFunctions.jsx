import moment from "moment";

const browser = navigator.userAgent;

let isChrome = false;
let isFireFox = false;
let isSafari = false;

if (browser.indexOf("Chrome") !== -1) {
    isChrome = true;
} else if (browser.indexOf("Firefox") !== -1) {
    isFireFox = true;
} else if (browser.indexOf("Safari") !== -1) {
    isSafari = true;
}

const getDay = (date) => {
    return moment(date).date();
};
const getMonth = (date) => {
    return moment(date).format("MMMM");
};

export const reset = () => {
    if (!isChrome && !isFireFox && isSafari) {
        const allDropBoxes = document.querySelectorAll(".drop-wrap");
        allDropBoxes.forEach((item) => {
            item.style.display = "none";
        });
    }
};

export const onDragStart = (ev,event,updateSelectedState) => {
    if (!event) return;
    // const bottomOfCard = document.querySelector(`.bottom_card_${event.id}`);
    // bottomOfCard.style.display = "none";
    // drag and drop ghost images will be removed when user starts dragging
    const ghostImage = document.querySelector(".rotatedNode");
    if (ghostImage && document.body?.contains(ghostImage)) ghostImage?.remove();

    let selectedDiv = document.querySelectorAll(`.card_${event.id}`);
    for (let itemDiv = 0; itemDiv < selectedDiv.length; itemDiv++) {
        selectedDiv[itemDiv].classList.add("dragged-box");
    }

    selectedDiv = selectedDiv[0];
    let rotatedNode = ev.target.cloneNode(true);

    let width = document.querySelector(".rbc-event")?.offsetWidth;
    if (!width) width = ev.target.offsetWidth;
    const currentDiv = document.querySelector(`.month_day_${event.day}_${moment(event.end).format("MMMM")}`);

    rotatedNode.style.position = "absolute";
    rotatedNode.style.top = "0px";
    rotatedNode.style.left = "-6000px";
    rotatedNode.style.width = width + "px";
    rotatedNode.style.opacity = "1";
    rotatedNode.classList.add("rotatedNode");

    const allEvents = document.querySelectorAll(".rbc-day-bg");

    for (let item = 0; item < allEvents.length; item++) {
        if (currentDiv === allEvents[item] || allEvents[item].classList.contains("past-dates")) continue;
        allEvents[item].style.zIndex = "4";
    }

    if (!isSafari) {
        let innerNode = rotatedNode.getElementsByClassName("rbc-event")[0];
        if (!innerNode && rotatedNode) innerNode = rotatedNode.firstChild;
        innerNode.style.transform = "rotate(-10deg)";
    }

    document.body.appendChild(rotatedNode);
    ev.dataTransfer.setDragImage(rotatedNode, width / 2 , 50);

    updateSelectedState(event,currentDiv);

    ev.dataTransfer.setData("text", JSON.stringify(event));
    ev.dataTransfer.setData("publishDate",event.publishDate.toString());
};

export const removeStyleOnDrop = (date) => {
    const rotatedNode = document.querySelector(".rotatedNode");
    if (rotatedNode && document.body?.contains(rotatedNode))  rotatedNode?.remove();

    const boxContainer = document.getElementById(`month_box_container_${getDay(date)}_${getMonth(date)}`);
    const droppedDayDiv = document.querySelector(`.month_day_${getDay(date)}_${getMonth(date)}`);
    droppedDayDiv.style.backgroundColor = "inherit";
    for (let i = 1;i <= 2;i++) {
        const div = document.getElementById(`box_child_${i}_${getDay(date)}_${getMonth(date)}`);
        if (div) {
            div.classList.remove("selected");
        }
    }

    boxContainer.style.display = "none";

    const allEvents = document.querySelectorAll(".rbc-day-bg");
    for (let i = 0;i < allEvents.length;i++) {
        if (allEvents[i].classList.contains("empty-cell") || allEvents[i].classList.contains("past-dates")) continue;
        allEvents[i].style.zIndex = "4";
        allEvents[i].style.backgroundColor = "transparent";
    }

    const longEvents = document.querySelectorAll(".longCards");

    for (let i = 0; i < longEvents.length; i++) {
        longEvents[i].style.zIndex = "2";
    }

};

export const onDragEnter = (date,currentColumnInfo,updateCurrentColumnInfo,e) => {
    if (!isChrome && !isFireFox && isSafari) onDragEnterSafari(date,currentColumnInfo,updateCurrentColumnInfo,e);
    else onDragEnterOther(date);
};

export const onDragLeave = (e,date,currentColumnInfo,updateCurrentColumnInfo) => {
    if (!isChrome && !isFireFox && isSafari)  onDragLeaveSafari(e,date,currentColumnInfo,updateCurrentColumnInfo);
    else onDragLeaveOther(e,date);
};

export const onDrop = (e,date,box,setCurrentPostDate,setShowScheduleDatePicker,updatePostDateAndTime,setReschedulePostId) => {
    const data = JSON.parse(e.dataTransfer.getData("text"));
    const id = data.id;
    // const bottomOfCard = document.querySelector(`.bottom_card_${id}`);
    // bottomOfCard.style.display = "flex";
    
    let publishDate = e.dataTransfer.getData("publishDate");
    publishDate = moment(new Date(publishDate));
    setReschedulePostId(data.id);

    if (box === "new_time") {
        const newDate = moment(date);
        newDate.hour(publishDate.hour())
            .minute(publishDate.minute())
            .second(publishDate.second()); 
        setCurrentPostDate(newDate);
        setShowScheduleDatePicker(true);
    } else {
        let finalDate = moment(date);
        
        const combinedObj = finalDate
            .hour(publishDate.hour())
            .minute(publishDate.minute())
            .second(publishDate.second())
            .date(finalDate.date())
            .month(finalDate.month())
            .year(finalDate.year());

        const utcDate = moment.utc(combinedObj);

        const datePart = utcDate.format("MM/DD/YYYY");
        const timePart = utcDate.format("HH:mm:ss");

        const scheduleDate = datePart.toString() + " " + timePart.toString();

        const payload = {
            scheduleDate,
            id
        };
        updatePostDateAndTime(payload);
    }
};

export const onDragEnterInSchedulerBox = (boxNumber,date) => {
    onDragEnterInSchedulerBoxOther(boxNumber,date);
};

export const onDragLeaveFromSchedulerBox = (boxNumber,e,date) => {
    onDragLeaveFromSchedulerBoxOther(boxNumber,e,date);
};

export const onDragOver = (e) => {
    e.preventDefault();
};

// safari
const onDragEnterSafari = (date,currentColumnInfo,updateCurrentColumnInfo,e) => {
    if (new Date() > date) return;
    if (currentColumnInfo.ele !== e.currentTarget) {
        hideCards(currentColumnInfo,updateCurrentColumnInfo);
        updateCurrentColumnInfo({
            ele: e.currentTarget,
            id: `month_box_container_${getDay(date)}_${getMonth(date)}`,
            prevDay: date
        });
        onDragEnterOther(date);
    }
};

export const hideCards = (currentColumnInfo,updateCurrentColumnInfo) => {
    if (currentColumnInfo.ele) {
        const date = currentColumnInfo.prevDay;
        const boxContainer = document.getElementById(currentColumnInfo.id);
        boxContainer.style.display = "none";
        const prevDiv = document.querySelector(`.month_day_${getDay(date)}_${getMonth(date)}`);
        prevDiv.style.backgroundColor = "transparent";

        updateCurrentColumnInfo({
            ele: null,
            id: null,
            prevDay: null
        });
    }
};

const onDragLeaveSafari = () => {
};

// const onDragEnterInSchedulerBoxSafari = () => {
// };

// const onDragLeaveFromSchedulerBoxSafari = () => {
// };

// other browser

const onDragEnterOther = (date) => {
    if (new Date() > date) return;
    const nextDiv = document.querySelector(`.month_day_${getDay(date)}_${getMonth(date)}`);
    const boxContainer = document.getElementById(`month_box_container_${getDay(date)}_${getMonth(date)}`);
    boxContainer.style.display = "block";
    nextDiv.style.backgroundColor = "white";
};

const onDragLeaveOther = (e,date) => {
    const prevDiv = document.querySelector(`.month_day_${getDay(date)}_${getMonth(date)}`);
    const relatedTarget = e.relatedTarget;

    if ((!relatedTarget || !prevDiv.contains(relatedTarget)) && !prevDiv.classList.contains("past-dates")) {
        const boxContainer = document.getElementById(`month_box_container_${getDay(date)}_${getMonth(date)}`);
        boxContainer.style.display = "none";
        prevDiv.style.backgroundColor = "transparent";
    }
};

const onDragEnterInSchedulerBoxOther = (boxNumber,date) => {
    const div = document.getElementById(`box_child_${boxNumber}_${getDay(date)}_${getMonth(date)}`);
    div.classList.add("selected");
};

const onDragLeaveFromSchedulerBoxOther = (boxNumber,e,date) => {
    const parent = document.getElementById(`box_child_${boxNumber}_${getDay(date)}_${getMonth(date)}`);
    const relatedTarget = e.relatedTarget;

    if (!relatedTarget || !parent.contains(relatedTarget)) {
        parent.classList.remove("selected");
    }
};