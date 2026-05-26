import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import DateHeader from "./DateHeader";
import DayColumnWrapper from "./DayColumnWrapper";
import moment from "moment";
import { isEmpty } from "lodash";

const DateHeaderWrapper = ({ date, className, hoverStatus = false, parentProps, createPost = null, dispatch, socialChannels, showAIIcon = false, permissions, showPlusIcon = true, plusIconCallback }) => {

    let { date: currentDate, getDrilldownView, localizer, events, isLoadingDone } = parentProps;
    let isOffRange = localizer.neq(date, currentDate, "month");
    let isCurrent = localizer.isSameDate(date, currentDate);
    let drilldownView = getDrilldownView(date);
    let label = localizer.format(date, "dateFormat");
    let DateHeaderComponent = parentProps.components.dateHeader || DateHeader;
    const aiEvents = events?.filter(event => event?.aiBestTimeToPost);
    const [aiTimes, setAiTimes] = useState({});

    useEffect(() => {
        if (isEmpty(aiTimes) && !isEmpty(aiEvents)) {
            let res = {};

            aiEvents?.forEach((event) => {
                const key = moment(event?.publishDate)?.startOf("day")?.valueOf();
                const value = moment(event?.publishDate)?.valueOf();

                if (!res[key]) {
                    res[key] = value;
                }
            });

            setAiTimes(res);
        }
    }, [aiEvents]);

    const [isHover, setIsHover] = useState(hoverStatus);

    const checkActualPostDateAndAIBestTime = () => {
        let isAISuggestion = false;
        let aiBestTimeDatePublish = null;

        const unixString = moment(date)?.valueOf();

        if (aiTimes[unixString]) {
            isAISuggestion = true;
            aiBestTimeDatePublish = aiTimes[unixString];
        }

        return { isAISuggestion, aiBestTimeDatePublish };
    };
    const { isAISuggestion, aiBestTimeDatePublish } = checkActualPostDateAndAIBestTime();

    const getValiddateToHover = () => {
        return new Date().setHours(0,0,0,0) <= new Date(date).setHours(0,0,0,0);
    };

    const hoverCallBack = ( hoverStatus ) => {
        if (hoverStatus && getValiddateToHover()) {
            setIsHover( true );
        } else {
            setIsHover( false );
        }        
    };

    useEffect(() => {
        setIsHover( hoverStatus );
    }, [hoverStatus]);

    const handleClick = () => {
        if (getValiddateToHover()) {
            createPost(date);
        }
    };

    return (
        <DayColumnWrapper
            className={clsx(
                className,
                isOffRange && "rbc-off-range",
                isCurrent && "rbc-current"
            )}
            role="cell"
            hoverCallBack={hoverCallBack}
        >
            <DateHeaderComponent
                permissions={permissions}
                label={label}
                date={date}
                drilldownView={drilldownView}
                isOffRange={isOffRange}
                // onDrillDown={(e) => this.handleHeadingClick(date, drilldownView, e)}
                hoverStatus={isHover}
                callBackFtn={() => handleClick()}
                isNewDate={getValiddateToHover()}
                isAISuggestion={isAISuggestion}
                aiBestTimeDatePublish={aiBestTimeDatePublish}
                dispatch={dispatch}
                events={events}
                isLoadingDone={isLoadingDone}
                socialChannels={socialChannels}
                showAIIcon={showAIIcon}
                showPlusIcon={showPlusIcon}
                plusIconCallback={plusIconCallback}
            />
            <></>
        </DayColumnWrapper>
    );
};

DateHeaderWrapper.propTypes = {
    date: PropTypes.instanceOf(Date),
    className: PropTypes.string,
    hoverStatus: PropTypes.bool,
    parentProps: PropTypes.object.isRequired,
    createPost: PropTypes.func.isRequired,
    dispatch: PropTypes.func,
    isLoadingDone: PropTypes.bool,
    socialChannels: PropTypes.array,
    showAIIcon: PropTypes.bool,
    permissions: PropTypes.object,
    showPlusIcon: PropTypes.bool,
    plusIconCallback: PropTypes.func
};

export default DateHeaderWrapper;
