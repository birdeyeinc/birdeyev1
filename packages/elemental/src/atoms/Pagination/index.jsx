import React from "react";
import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./Pagination.scss";
import SingleSelect from "atoms/SingleSelect";
import { getShowPageCounts } from "utils";

/* eslint-disable */
// since we dont have current as param for this purpose we have disable es lint
const textItemRender = (current, type, element) => {
    if (type === "prev") {
        return (<span> Prev </span>);
    }
    if (type === "next") {
        return (<span> Next </span>);
    }
    return element;
};

const itemRenderWithNumbers = (current, type, element) => {
    if (type === 'page') {
        return <a href={`javascript:void(0)`}>{current}</a>;
        // return <a href={`#${current}`}>{current}</a>;
    }
    return element;
};
/* eslint-disable */

class PaginationModule extends React.Component {
    constructor(props) {
        super(props);

    }
    onPageChange = (page) => {
        const { onPageChange } = this.props;
        onPageChange(page, this.props);
    }

    render() {
        const { initialPage, pageCount, pageSize, className, itemRender, showPageSize, changePageSize, totalCount, pageSizeOnTop, wrapperClass, newPagination } = this.props;

        return (
            <div className={wrapperClass}>
                <div className="clearfix pagination-wrapper">
                    <Pagination
                        showTitle={false}
                        current={initialPage}
                        pageSize={pageSize}
                        className={`${className} clearfix`}
                        showLessItems
                        itemRender={itemRender ? textItemRender : itemRenderWithNumbers}
                        total={(pageCount * pageSize)}
                        onChange={this.onPageChange}
                    />

                    {showPageSize ?
                        <div className="chart-wrapper">
                            <SingleSelect
                                name="page-size"
                                selected={pageSize}
                                onChange={changePageSize}
                                options={getShowPageCounts()}
                                top={pageSizeOnTop}
                                resetParam={{ value: "" }}
                                placeholder={"Select"}
                                displayLabel={"Select"}
                            /></div> : null}
                </div>
                <div className="pdf-row-details">{`Rows ${(initialPage * pageSize - pageSize + 1)} - ${(initialPage * pageSize)} of ${(pageCount * pageSize)}`}</div>
            </div>
        );
    }
}

PaginationModule.propTypes = {
    initialPage: PropTypes.number,
    pageCount: PropTypes.number,
    onPageChange: PropTypes.func,
    changePageSize: PropTypes.func,
    pageSize: PropTypes.number,
    className: PropTypes.string,
    itemRender: PropTypes.bool,
    showPageSize: PropTypes.bool,
    totalCount: PropTypes.number,
    pageSizeOnTop: PropTypes.bool,
    wrapperClass: PropTypes.string,
    newPagination: PropTypes.bool
};
export default PaginationModule;

// NOTES HO TO USES THIS
// initialPage is same as active page
// pageSize size of the current page eg : 10,25,..etc
// you can add class .hide-numbers which will hide the numbers b/w prev and next icons
// itemRender flag to show numbers or not in pagination
