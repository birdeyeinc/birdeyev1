import React, { useMemo } from 'react';
import style from './MultiSegmentBar.module.scss';
import { MultiSegmentBarProps, BarProps, LabelProps, BarSegment, TooltipProps } from './interface';
import Tooltip from '../../atoms/Tooltip';
import Labels from './Labels';

const MultiSegmentBar: React.FC<MultiSegmentBarProps> = ({
  segments,
  sentimentSpread,
  bar = {},
  label = {},
  tooltip = {},
  className = '',
  metadata,
}) => {
  // Default values for nested props
  const barProps: Required<BarProps> = {
    height: bar.height ?? 40,
    width: bar.width ?? '100%',
    borderRadius: bar.borderRadius ?? '2px',
    segmentSpacing: bar.segmentSpacing ?? 1,
    style: bar.style ?? {},
  };

  const labelProps: LabelProps = {
    show: label.show ?? true,
    position: label.position ?? 'bottom',
    alignment: label.alignment ?? 'dynamic',
    matchColorToSegment: label.matchColorToSegment ?? true,
    color: label.color ?? '#000',
    fontFamily: label.fontFamily ?? 'inherit',
    fontSize: label.fontSize ?? 'inherit',
    fontWeight: label.fontWeight ?? 'normal',
    decimal: label.decimal ?? 1,
    style: label.style ?? {},
    customRender: label.customRender,
    spacing: label.spacing ?? '5px',
  };

  const tooltipProps: TooltipProps = {
    show: tooltip.show ?? false,
    position: tooltip.position ?? 'top' as const,
    renderContent: tooltip.renderContent ?? (({ total }) => `Total: ${total}`),
  };

  // Calculate segments from sentimentSpread if provided
  let calculatedSegments: BarSegment[] = [];

  if (sentimentSpread) {
    const { pos, neu, neg, colors, labels, labelColors, tooltipData } = sentimentSpread;

    // Default colors if not provided
    const defaultColors = {
      pos: '#4CAE3D',
      neu: '#FBC123',
      neg: '#F3382B',
    };

    // Create segments in the order: neg, neu, pos
    calculatedSegments = [
      {
        value: neg,
        color: colors?.neg ?? defaultColors.neg,
        label: labels?.neg ?? `${neg}`,
        tooltipData: tooltipData?.neg,
        labelColor: labelColors?.neg,
      },
      {
        value: neu,
        color: colors?.neu ?? defaultColors.neu,
        label: labels?.neu ?? `${neu}`,
        tooltipData: tooltipData?.neu,
        labelColor: labelColors?.neu,
      },
      {
        value: pos,
        color: colors?.pos ?? defaultColors.pos,
        label: labels?.pos ?? `${pos}`,
        tooltipData: tooltipData?.pos,
        labelColor: labelColors?.pos,
      },
    ];
  }

  // Use either provided segments or calculated segments
  const segmentsToRender = segments || calculatedSegments;

  if (!segmentsToRender.length) {
    return null; // Return nothing if no segments to render
  }

  // Calculate total to ensure segments add up to 100%
  const total = segmentsToRender.reduce((sum, segment) => sum + segment.value, 0);

  // Calculate normalized percentages
  const normalizedSegments = useMemo(() => {
    const segmentsWithPercentages = segmentsToRender.map(segment => ({
      ...segment,
      percentage: parseFloat(((segment.value * 100) / total)?.toFixed(1))
    }));

    // Calculate adjustment factor
    const sumOfPercentages = segmentsWithPercentages.reduce((sum, segment) => sum + segment.percentage, 0);
    
    // If the sum of percentages is 0, return the original segments without adjustment
    if (sumOfPercentages === 0) {
      return segmentsWithPercentages;
    }
    
    const adjustmentFactor = 100 / sumOfPercentages;
    
    // Apply adjustment factor to each percentage
    return segmentsWithPercentages.map(segment => ({
      ...segment,
      percentage: parseFloat((segment.percentage * adjustmentFactor).toFixed(1))
    }));
  }, [segmentsToRender, total]);

  // Calculate effective width considering spacing
  const effectiveSegmentWidth = (percentage: number, isLast: boolean) => {
    if (isLast) return `${percentage}%`;

    // If we have spacing, we need to account for it in width calculations
    if (barProps.segmentSpacing && barProps.segmentSpacing !== 0) {
      return `calc(${percentage}% - ${typeof barProps.segmentSpacing === 'number' ?
        `${barProps.segmentSpacing}px` : barProps.segmentSpacing})`;
    }

    return `${percentage}%`;
  };

  // Generate label style
  const getLabelStyle = (segment: typeof normalizedSegments[0]) => {
    return {
      fontFamily: labelProps.fontFamily,
      fontSize: labelProps.fontSize,
      fontWeight: labelProps.fontWeight,
      color: segment.labelColor ?? (labelProps.matchColorToSegment ? segment.color : labelProps.color),
      ...labelProps.style,
    };
  };

  // Get border radius for a segment based on its position
  const getSegmentBorderRadius = (index: number) => {
    // Find the first and last segments with non-zero values for proper border radius
    const visibleSegments = normalizedSegments.map((segment, idx) => ({ ...segment, originalIndex: idx }))
      .filter(segment => segment.percentage > 0);

    if (visibleSegments.length === 0) return '0';

    const firstVisibleIndex = visibleSegments[0].originalIndex;
    const lastVisibleIndex = visibleSegments[visibleSegments.length - 1].originalIndex;

    const isFirstVisible = index === firstVisibleIndex;
    const isLastVisible = index === lastVisibleIndex;
    const currentSegment = normalizedSegments[index];

    // Only apply border radius to segments with non-zero values
    if (currentSegment.percentage === 0) return '0';

    if (isFirstVisible && isLastVisible) return barProps.borderRadius; // Single visible segment case
    if (isFirstVisible) return `${barProps.borderRadius} 0 0 ${barProps.borderRadius}`; // First visible segment - left side only
    if (isLastVisible) return `0 ${barProps.borderRadius} ${barProps.borderRadius} 0`; // Last visible segment - right side only
    return '0'; // Middle segments - no border radius
  };

  const renderedTooltipContent = tooltipProps.show && tooltipProps.renderContent
    ? tooltipProps.renderContent({ segments: normalizedSegments, total, metadata })
    : null;

  return (
    <Tooltip
      text={typeof renderedTooltipContent === 'string' ? renderedTooltipContent : null}
      customHTML={typeof renderedTooltipContent !== 'string' ? renderedTooltipContent : null}
      position={tooltipProps.position}
      disabledTooltip={!tooltipProps.show}
    >
      <div
        className={`${style["multi-segment-bar-container"]} ${className}`}
        style={{ width: barProps.width }}
      >
        {labelProps.position === 'top' && (
          <Labels
            position="top"
            normalizedSegments={normalizedSegments}
            labelProps={labelProps}
            effectiveSegmentWidth={effectiveSegmentWidth}
            getLabelStyle={getLabelStyle}
          />
        )}

        <div
          className={style["bar-container"]}
          style={{
            height: barProps.height,
            borderRadius: barProps.borderRadius,
            gap: barProps.segmentSpacing,
            ...barProps.style,
          }}
        >
          {normalizedSegments.map((segment, index) => (
            <div
              key={`segment-${index}`}
              className={`${style['segment']}`}
              style={{
                backgroundColor: segment.color,
                width: effectiveSegmentWidth(segment.percentage, index === normalizedSegments.length - 1),
                borderRadius: getSegmentBorderRadius(index),
              }}
            >
              {labelProps.position === 'inside' && labelProps.show && (
                <span className={style["segment-label"]} style={{
                  color: labelProps.matchColorToSegment ? '#fff' : labelProps.color,
                  fontFamily: labelProps.fontFamily,
                  fontSize: labelProps.fontSize,
                  fontWeight: labelProps.fontWeight,
                  ...labelProps.style
                }}>
                  {segment.label || `${segment.percentage.toFixed(labelProps.decimal)}%`}
                </span>
              )}
            </div>
          ))}
        </div>

        {labelProps.position === 'bottom' && (
          <Labels
            position="bottom"
            normalizedSegments={normalizedSegments}
            labelProps={labelProps}
            effectiveSegmentWidth={effectiveSegmentWidth}
            getLabelStyle={getLabelStyle}
          />
        )}
      </div>
    </Tooltip>
  );
};

export default MultiSegmentBar;