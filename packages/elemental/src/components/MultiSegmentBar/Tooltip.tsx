import React from 'react';
import style from './MultiSegmentBar.module.scss';
import { TooltipProps, BarSegment, BarProps } from './interface';

interface TooltipComponentProps {
    isVisible: boolean;
    normalizedSegments: (BarSegment & { percentage: number })[];
    total: number;
    tooltipProps: Required<TooltipProps>;
    barProps: Required<BarProps>;
}

const Tooltip: React.FC<TooltipComponentProps> = ({
    isVisible,
    normalizedSegments,
    total,
    tooltipProps,
    barProps,
}) => {
    if (!isVisible || !tooltipProps.show) {
        return null;
    }

    // Calculate tooltip position based on preference
    let tooltipStyle: React.CSSProperties = {
        backgroundColor: tooltipProps.backgroundColor,
        color: tooltipProps.textColor,
        padding: tooltipProps.padding,
        borderRadius: tooltipProps.borderRadius,
        boxShadow: tooltipProps.boxShadow,
        fontFamily: tooltipProps.fontFamily,
        fontSize: tooltipProps.fontSize,
        ...tooltipProps.style,
    };

    // Position tooltip based on preferred position
    const barHeight = typeof barProps.height === 'number' ?
        `${barProps.height}px` : barProps.height;

    if (tooltipProps.position === 'top') {
        tooltipStyle.bottom = `calc(100% + ${tooltipProps.offset}px)`;
    } else { // bottom
        tooltipStyle.top = `calc(${barHeight} + ${tooltipProps.offset}px)`;
    }

    // Render tooltip content
    const tooltipContent = tooltipProps.renderContent
        ? tooltipProps.renderContent({ segments: normalizedSegments, total })
        : `Total: ${total}`;

    return (
        <div
            className={`${style['segment-tooltip']} ${style[tooltipProps.position]}`}
            style={tooltipStyle}
        >
            {tooltipContent}
        </div>
    );
};

export default Tooltip;
