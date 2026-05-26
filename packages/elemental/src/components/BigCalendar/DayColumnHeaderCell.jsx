import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
// import { push } from "redux-json-router";
import Header from "./Header";
import DayColumnWrapper from "./DayColumnWrapper";

const DayColumHeaderCell = ({ getDrilldownView, isSocial, appointmentHeader, localizer, getters: { dayProp }, today, date, index, dispatch, permissions, showPlusIcon = true, plusIconCallback }) => {
    const [isHover, setIsHover] = useState( false );
    const drilldownView = getDrilldownView(date);
    const label = !isSocial ? localizer.format(date, "dayFormat") : `${localizer.format(date, "weekdayFormat")} ${Number(localizer.format(date, "dateFormat"))}`;

    const { className, style } = dayProp(date);

    const createPost = () => {
        if (plusIconCallback) return plusIconCallback();
        dispatch(push(`/dashboard/social/publish/createpost?startDate=${ date.getTime() }`));
    };

    const header = (
        <Header date={date} label={label} localizer={localizer} appointmentHeader={appointmentHeader} isSocial={isSocial} isHover={(window?.BE?.business.betaProductFeatures?.customRole ? permissions?.readWritePermission : true) ? isHover : false} createPostCallBack={createPost} showPlusIcon={showPlusIcon} />
    );

    const hoverStatus = (hoverState) => {
        if ( isSocial && new Date( date ).setHours(0,0,0,0) >= new Date( today).setHours(0,0,0,0) ) {
            setIsHover( hoverState );
        }
    };
    
    return (
        <DayColumnWrapper
            key={index}
            style={{...style, borderBottom:"none" }}
            className={clsx(
                "rbc-header",
                className,
                localizer.isSameDate(date, today) && "rbc-today"
            )}
            hoverCallBack={hoverStatus}
        >
            {drilldownView ? (
                <button
                    type="button"
                    className="rbc-button-link"
                // onClick={e => this.handleHeaderClick(date, drilldownView, e)}
                >
                    {header}
                </button>
            ) : (
                <span>{header}</span>
            )}
        </DayColumnWrapper>
    );
};

DayColumHeaderCell.propTypes = {
    getDrilldownView: PropTypes.func.isRequired,
    appointmentHeader: PropTypes.bool,
    isSocial: PropTypes.bool,
    localizer: PropTypes.object.isRequired,
    getters: PropTypes.object.isRequired,
    today: PropTypes.object,
    date: PropTypes.object.isRequired,
    index: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    permissions: PropTypes.object,
    showPlusIcon: PropTypes.bool,
    plusIconCallback: PropTypes.func
};

export default DayColumHeaderCell;
