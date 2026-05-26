import PropTypes from "prop-types";
import React, { useRef, useState } from 'react';
import {
    useMount,
    useMeasure,
    usePrevious,
    useShallowCompareEffect,
    useUpdateEffect
} from 'react-use';

function OverflowList(props) {
    const {
        items,
        collapseFrom = 'end',
        minVisibleItems = 0,
        tagName = 'div',
        className = '',
        alwaysRenderOverflow = false,
        overflowRenderer,
        itemRenderer,
        onVisibleItemsRender
    } = props;

    const [state, setState] = useState({
        visible: items,
        overflow: [],
        lastOverflowCount: 0,
        overflowDirection: 'none',
    });

    const spacer = useRef(null);
    const isPartitioningDone = useRef(false);

    useShallowCompareEffect(() => {
        repartition(false);
    }, [state]);

    useMount(() => {
        repartition(false);
    });

    useUpdateEffect(() => {
        setState(() => ({
            overflowDirection: 'none',
            lastOverflowCount: 0,
            overflow: [],
            visible: items,
        }));
    }, [items]);

    const WrapperComponent = tagName;

    const maybeOverflow =
        state.overflow.length === 0 && !alwaysRenderOverflow
            ? null
            : overflowRenderer(state.overflow);

    const repartition = (growing) => {
        if (!spacer.current) {
            return;
        }

        if (growing) {
            setState((state) => ({
                overflowDirection: 'grow',
                lastOverflowCount:
                    state.overflowDirection === 'none'
                        ? state.overflow.length
                        : state.lastOverflowCount,
                overflow: [],
                visible: props.items,
            }));
        } else if (spacer.current.getBoundingClientRect().width < 0.9) {
            setState((state) => {
                if (minVisibleItems != null && state.visible.length <= minVisibleItems) {
                    return state;
                }
                const collapseFromStart = collapseFrom === 'start';
                const visible = state.visible.slice();
                const next = collapseFromStart ? visible.shift() : visible.pop();
                if (!next) {
                    return state;
                }
                const overflow = collapseFromStart
                    ? [...state.overflow, next]
                    : [next, ...state.overflow];
                return {
                    ...state,
                    overflowDirection: //Added this state to determine if the partitioning is done
                        state.overflowDirection === 'none'
                            ? 'shrink'
                            : state.overflowDirection,
                    overflow,
                    visible,
                };
            });
        } else {
            setState((prevState) => {
                return { ...prevState, overflowDirection: 'none' };
            });
        }
    };

    const [ref, { width }] = useMeasure();
    const previousWidth = usePrevious(width);

    React.useEffect(() => {
        if (!previousWidth) return;

        repartition(width > previousWidth);
    }, [width, previousWidth]);

    //Added this logic to determine if the partitioning is done
    useUpdateEffect(() => {
        if (state?.overflowDirection === 'none' && !isPartitioningDone.current) {
            isPartitioningDone.current = true;
            onVisibleItemsRender && onVisibleItemsRender(state.visible);
        } else if (state.overflowDirection !== 'none') {
            isPartitioningDone.current = false;
        }
    }, [state.visible, state.overflow, state.overflowDirection]);

    return (
        <WrapperComponent
            ref={ref}
            className={className}
            style={{
                display: 'flex',
                flexWrap: 'nowrap',
                minWidth: 0,
            }}
        >
            {collapseFrom === 'start' ? maybeOverflow : null}
            {state.visible.map(itemRenderer)}
            {collapseFrom === 'end' ? maybeOverflow : null}
            <div style={{ flexShrink: 1, width: 1 }} ref={spacer} />
        </WrapperComponent>
    );
}

OverflowList.propTypes = {
    items: PropTypes.array,
    itemRenderer: PropTypes.func,
    overflowRenderer: PropTypes.func,
    minVisibleItems: PropTypes.number,
    collapseFrom: PropTypes.string,
    className: PropTypes.string,
    tagName: PropTypes.string,
    alwaysRenderOverflow: PropTypes.bool,
    onVisibleItemsRender: PropTypes.func
}

export default OverflowList;