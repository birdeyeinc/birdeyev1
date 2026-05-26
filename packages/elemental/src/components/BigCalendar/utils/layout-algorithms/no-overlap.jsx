import overlap from "./overlap";

function getMaxIdxDFS(node, maxIdx, visited) {
    for (let i = 0; i < node.friends.length; ++i) {
        if (visited.indexOf(node.friends[i]) > -1) continue;
        maxIdx = maxIdx > node.friends[i].idx ? maxIdx : node.friends[i].idx;
        // TODO : trace it by not object but kinda index or something for performance
        visited.push(node.friends[i]);
        const newIdx = getMaxIdxDFS(node.friends[i], maxIdx, visited);
        maxIdx = maxIdx > newIdx ? maxIdx : newIdx;
    }
    return maxIdx;
}

export default function ({
    events,
    minimumStartDifference,
    slotMetrics,
    accessors,
    isSocial
}) {
    const styledEvents = overlap({
        events,
        minimumStartDifference,
        slotMetrics,
        accessors
    });

    /**
     * Sorting styled events to optimize their visual stacking on the calendar.
     * 
     * 🧠 Purpose:
     * When events overlap (i.e., they start at the same time or overlap in duration),
     * we sort them to determine how they are rendered vertically.
     * 
     * There are two approaches here:
     * 
     * 1. 📌 isSocial = true:
     *    - Sort by `.top` (start time) first.
     *    - If two events have the same top position, use their **original order in the input**
     *      (not based on duration or height).
     *    - This is helpful in social calendars where event timing is flexible and
     *      preserving the original order improves context and familiarity.
     * 
     * 2. 📌 isSocial = false (Default logic):
     *    - Sort by `.top` (start time) first.
     *    - If two events have the same top position, compare `.top + height` (i.e., end time).
     *      Events that end later come earlier in the list.
     *    - This ensures longer events stack visually above shorter ones and avoid
     *      visual misalignment or overlap artifacts.
     * 
     * 📅 Example:
     * If 3 events start at the same time, this logic determines in what vertical order
     * they'll appear in the UI.
     */

    if (isSocial) {
        // Create a map from event to its original index
        const originalOrderMap = new Map();
        events.forEach((event, index) => {
            originalOrderMap.set(event, index);
        });

        styledEvents.sort((a, b) => {
            const aEvent = a?.event ?? {};
            const bEvent = b?.event ?? {};
            const aTop = a?.style?.top ?? 0;
            const bTop = b?.style?.top ?? 0;
          
            const aIsAI = aEvent.aiBestTimeToPost === true;
            const bIsAI = bEvent.aiBestTimeToPost === true;
          
            // 1. Sort based on vertical position (top value)
            if (aTop !== bTop) return aTop - bTop;
          
            // 2. If same top, prioritize AI event
            if (aIsAI !== bIsAI) return bIsAI - aIsAI;
          
            // 3. Tie-breaker: original input order
            const aOriginalIndex = originalOrderMap.get(aEvent) ?? 0;
            const bOriginalIndex = originalOrderMap.get(bEvent) ?? 0;
          
            return aOriginalIndex - bOriginalIndex;
        });
    } else {
        styledEvents.sort((a, b) => {
            a = a.style;
            b = b.style;
            if (a.top !== b.top) return a.top > b.top ? 1 : -1;
            else return a.top + a.height < b.top + b.height ? 1 : -1;
        });
    }
    
    for (let i = 0; i < styledEvents.length; ++i) {
        styledEvents[i].friends = [];
        delete styledEvents[i].style.left;
        delete styledEvents[i].style.left;
        delete styledEvents[i].idx;
        delete styledEvents[i].size;
    }

    for (let i = 0; i < styledEvents.length - 1; ++i) {
        const se1 = styledEvents[i];
        const y1 = se1.style.top;
        const y2 = se1.style.top + se1.style.height;

        for (let j = i + 1; j < styledEvents.length; ++j) {
            const se2 = styledEvents[j];
            const y3 = se2.style.top;
            const y4 = se2.style.top + se2.style.height;

            // be friends when overlapped
            if ((y3 <= y1 && y1 < y4) || (y1 <= y3 && y3 < y2)) {
                // TODO : hashmap would be effective for performance
                se1.friends.push(se2);
                se2.friends.push(se1);
            }
        }
    }

    for (let i = 0; i < styledEvents.length; ++i) {
        const se = styledEvents[i];
        const bitmap = [];
        for (let j = 0; j < 100; ++j) bitmap.push(1); // 1 means available

        for (let j = 0; j < se.friends.length; ++j)
            if (se.friends[j].idx !== undefined) bitmap[se.friends[j].idx] = 0; // 0 means reserved

        se.idx = bitmap.indexOf(1);
    }

    for (let i = 0; i < styledEvents.length; ++i) {
        let size = 0;

        if (styledEvents[i].size) continue;

        const allFriends = [];
        const maxIdx = getMaxIdxDFS(styledEvents[i], 0, allFriends);
        size = 100 / (maxIdx + 1);
        styledEvents[i].size = size;

        for (let j = 0; j < allFriends.length; ++j) allFriends[j].size = size;
    }

    for (let i = 0; i < styledEvents.length; ++i) {
        const e = styledEvents[i];
        e.style.left = e.idx * e.size;

        // stretch to maximum
        let maxIdx = 0;
        for (let j = 0; j < e.friends.length; ++j) {
            const idx = e.friends[j].idx;
            maxIdx = maxIdx > idx ? maxIdx : idx;
        }
        if (maxIdx <= e.idx) e.size = 100 - e.idx * e.size;

        // padding between events
        // for this feature, `width` is not percentage based unit anymore
        // it will be used with calc()
        const padding = e.idx === 0 ? 0 : 3;
        e.style.width = `calc(${e.size}% - ${padding}px)`;
        e.style.height = `calc(${e.style.height}% - 2px)`;
        e.style.xOffset = `calc(${e.style.left}% + ${padding}px)`;
    }

    return styledEvents;
}
