import React from "react";
import "./simple.scss";

const NoDataSimple = (props) => {
    const {
        title,
        subtitle,
        customClassName,
        imageUrl
    } = props;

    return (
        <div data-testid="el-test-no-data" className={`el-no-data-simple ${customClassName}`}>
            <img src={imageUrl || ""} />
            <div className="title">{title || "No results found"}</div>
            <div className="txt">{subtitle}</div>
        </div>
    );
};
export default NoDataSimple