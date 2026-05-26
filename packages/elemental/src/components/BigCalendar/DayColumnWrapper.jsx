/* eslint-disable react/prop-types */
import React from "react";

const DayColumnWrapper = ({ children, className, style, hoverCallBack }) => {

    const mouseEnter = () => {
        hoverCallBack( true );
    };
    const mouseLeave = () => {
        hoverCallBack( false );
    };
    
    return (
        <>
            { hoverCallBack ? 
                <div className={className} style={style} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} >
                    {children}
                </div>
                :
                <div className={className} style={style} >
                    {children}
                </div>
            }
        </>
    );
};

export default DayColumnWrapper;
