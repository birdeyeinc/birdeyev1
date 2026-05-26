import React from 'react';
import style from './MultiSegmentBar.module.scss';
import { LabelProps, BarSegment } from './interface';

interface LabelsComponentProps {
    position: 'top' | 'bottom';
    normalizedSegments: (BarSegment & { percentage: number })[];
    labelProps: LabelProps;
    effectiveSegmentWidth: (percentage: number, isLast: boolean) => string;
    getLabelStyle: (segment: BarSegment & { percentage: number }) => React.CSSProperties;
}

const Labels: React.FC<LabelsComponentProps> = ({
    position,
    normalizedSegments,
    labelProps,
    effectiveSegmentWidth,
    getLabelStyle,
}) => {
    if (!labelProps.show) return null;

    const labelSpacingStyle = {
        marginTop: position === 'bottom' ? labelProps.spacing : undefined,
        marginBottom: position === 'top' ? labelProps.spacing : undefined,
    };

    // Use alignment from props for the container class
    const alignmentClass = labelProps.alignment;

    return (
        <div
            className={`${style['percentage-labels']} ${style[position]} ${alignmentClass ? style[alignmentClass] : ''}`}
            style={labelSpacingStyle}
        >
            {normalizedSegments
                .filter(segment => alignmentClass === 'dynamic' ? segment.percentage > 0 : true)
                .map((segment) => {
                    const originalIndex = normalizedSegments.findIndex(s => s === segment);
                    const labelStyle = {
                        ...getLabelStyle(segment),
                        ...(alignmentClass === 'dynamic' ? {
                            width: effectiveSegmentWidth(segment.percentage, originalIndex === normalizedSegments.length - 1)
                        } : {}),
                    };

                    return (
                        <div
                            key={`label-${position}-${originalIndex}`}
                            className={style["label"]}
                            style={labelStyle}
                        >
                            {labelProps.customRender
                                ? labelProps.customRender(segment, originalIndex)
                                : segment.percentage === 0 || segment.percentage === 100
                                    ? `${segment.percentage}%`
                                    : `${segment.percentage.toFixed(labelProps.decimal)}%`}
                        </div>
                    );
                })}
        </div>
    );
};

export default Labels;
