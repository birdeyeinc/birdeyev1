/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-find-dom-node */
import PropTypes from "prop-types";
import React from "react";
import { findDOMNode } from "react-dom";
import clsx from "clsx";
import { notify } from "./utils/helpers";
import { dateCellSelection, getSlotAtX, pointInBox } from "./utils/selection";
import Selection, { getBoundsForNode, isEvent } from "./Selection";
import BackgroundCellGrid from "./BackgroundCellGrid";

class BackgroundCells extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            selecting: false,
            dragOverDate: null
        };
    }

    componentDidMount() {
        this.props.selectable && this._selectable();
    }

    componentWillUnmount() {
        this._teardownSelectable();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectable && !this.props.selectable) this._selectable();

        if (!nextProps.selectable && this.props.selectable)
            this._teardownSelectable();
    }

    render() {
        let {
            range,
            getNow,
            getters,
            date: currentDate,
            components,
            localizer,
            updateDateAndHover,
            getDatesWithNoPost,
            createPost,
            disableDragStart,
            calendarSimmerStatus,
            currentColumnInfo,
            updateCurrentColumnInfo,
            isSocial,
            appleEventDates = {}
        } = this.props;
        let { selecting, startIdx, endIdx } = this.state;
        let current = getNow(); 

        const moveToCreatePost = (date = null) => {
            createPost(date);
        };

        const mouseEnterAndLeave = (status, date) => {
            updateDateAndHover(status, date);
        };

        const { dateCellWrapper: Wrapper } = components;
        
        return (
            <div className="rbc-row-bg">
                {
                    isSocial ?
                        <>
                            {range.map((date, index) => {
                                const selected = selecting && index >= startIdx && index <= endIdx;
                                const isEmptyCell = (getDatesWithNoPost[date] && !appleEventDates[date.toString()]) ? true : false;
                                const zIndex = isEmptyCell ? 2 : 0;

                                return (
                                    <BackgroundCellGrid
                                        key={index}
                                        {...this.props}
                                        selected={selected}
                                        getters={getters}
                                        isEmptyCell={isEmptyCell}
                                        zIndex={zIndex}
                                        index={index}
                                        date={date}
                                        range={range}
                                        dateCellWrapper={components.dateCellWrapper}
                                        currentDate={currentDate}
                                        current={current}
                                        localizer={localizer}
                                        moveToCreatePost={moveToCreatePost}
                                        mouseEnterAndLeave={mouseEnterAndLeave}
                                        disableDragStart={disableDragStart}
                                        calendarSimmerStatus={calendarSimmerStatus}
                                        currentColumnInfo={currentColumnInfo}
                                        updateCurrentColumnInfo={updateCurrentColumnInfo}
                                    />
                                );

                            })}
                        </>
                        :
                        <>
                            {range.map((date, index) => {
                                let selected = selecting && index >= startIdx && index <= endIdx;
                                const { className, style } = getters.dayProp(date);
                                return (
                                    <Wrapper key={index} value={date} range={range}>
                                        <div
                                            style={style}
                                            className={clsx(
                                                "rbc-day-bg",
                                                className,
                                                selected && "rbc-selected-cell",
                                                localizer.isSameDate(date, current) && "rbc-today",
                                                currentDate &&
                                                localizer.neq(currentDate, date, "month") &&
                                                "rbc-off-range-bg"
                                            )}
                                        />
                                    </Wrapper>
                                );
                            })}
                        </>
                }
            </div>
        );
    }

    _selectable() {
        let node = findDOMNode(this);
        let selector = (this._selector = new Selection(this.props.container, {
            longPressThreshold: this.props.longPressThreshold
        }));

        let selectorClicksHandler = (point, actionType) => {
            if (!isEvent(findDOMNode(this), point)) {
                let rowBox = getBoundsForNode(node);
                let { range, rtl } = this.props;

                if (pointInBox(rowBox, point)) {
                    let currentCell = getSlotAtX(rowBox, point.x, rtl, range.length);

                    this._selectSlot({
                        startIdx: currentCell,
                        endIdx: currentCell,
                        action: actionType,
                        box: point
                    });
                }
            }

            this._initial = {};
            this.setState({ selecting: false });
        };

        selector.on("selecting", (box) => {
            let { range, rtl } = this.props;

            let startIdx = -1;
            let endIdx = -1;

            if (!this.state.selecting) {
                notify(this.props.onSelectStart, [box]);
                this._initial = { x: box.x, y: box.y };
            }
            if (selector.isSelected(node)) {
                let nodeBox = getBoundsForNode(node)
        ;({ startIdx, endIdx } = dateCellSelection(
                    this._initial,
                    nodeBox,
                    box,
                    range.length,
                    rtl
                ));
            }

            this.setState({
                selecting: true,
                startIdx,
                endIdx
            });
        });

        selector.on("beforeSelect", (box) => {
            if (this.props.selectable !== "ignoreEvents") return;

            return !isEvent(findDOMNode(this), box);
        });

        selector.on("click", (point) => selectorClicksHandler(point, "click"));

        selector.on("doubleClick", (point) =>
            selectorClicksHandler(point, "doubleClick")
        );

        selector.on("select", (bounds) => {
            this._selectSlot({ ...this.state, action: "select", bounds });
            this._initial = {};
            this.setState({ selecting: false });
            notify(this.props.onSelectEnd, [this.state]);
        });
    }

    _teardownSelectable() {
        if (!this._selector) return;
        this._selector.teardown();
        this._selector = null;
    }

    _selectSlot({ endIdx, startIdx, action, bounds, box }) {
        if (endIdx !== -1 && startIdx !== -1)
            this.props.onSelectSlot &&
        this.props.onSelectSlot({
            start: startIdx,
            end: endIdx,
            action,
            bounds,
            box,
            resourceId: this.props.resourceId
        });
    }
}

BackgroundCells.propTypes = {
    date: PropTypes.any,
    getNow: PropTypes.func.isRequired,

    getters: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,

    container: PropTypes.func,
    dayPropGetter: PropTypes.func,
    selectable: PropTypes.oneOf([true, false, "ignoreEvents"]),
    longPressThreshold: PropTypes.number,

    onSelectSlot: PropTypes.func.isRequired,
    onSelectEnd: PropTypes.func,
    onSelectStart: PropTypes.func,

    range: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    rtl: PropTypes.bool,
    type: PropTypes.string,
    resourceId: PropTypes.any,

    localizer: PropTypes.any,
    updateDateAndHover: PropTypes.func.isRequired,
    getDatesWithNoPost: PropTypes.object,
    createPost: PropTypes.func.isRequired,
    calendarSimmerStatus: PropTypes.bool,
    currentColumnInfo: PropTypes.object,
    updateCurrentColumnInfo: PropTypes.func,
    isSocial: PropTypes.bool,
    appleEventDates: PropTypes.object
};

export default BackgroundCells;
