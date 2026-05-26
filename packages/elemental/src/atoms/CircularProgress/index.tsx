import React from 'react';
import styles from './CircularProgress.module.scss';

const DEFAULT_SIZE = 48;
const DEFAULT_STROKE_WIDTH = 2;

export interface CircularProgressProps {
  /** The progress value (0-100) */
  value?: number;
  /** The color of the progress ring */
  color?: string;
  /** The size of the progress circle in pixels */
  size?: number;
  /** The width of the ring stroke in pixels */
  ringWidth?: number;
  /** The offset for positioning */
  offset?: number;
  /** The background color of the unfilled portion */
  extraColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value = 0,
  color,
  size = DEFAULT_SIZE,
  ringWidth = DEFAULT_STROKE_WIDTH,
  offset = 0,
  extraColor,
}) => {
  const percent = Math.max(0, Math.min(100, value));
  const angle = percent * 3.6;
  const containerSize = size + ringWidth * 2;
  const innerRadius = size / 2 - ringWidth;
  const outerRadius = size / 2;

  const cssVariables = {
    '--container-size': `${containerSize}px`,
    '--ring-size': `${size}px`,
    '--ring-offset': `${offset}px`,
    '--angle': `${angle}deg`,
    '--inner-radius': `${innerRadius}px`,
    '--outer-radius': `${outerRadius}px`,
    '--progress-color': color,
    '--extra-color': extraColor,
  } as React.CSSProperties;

  return (
    <div className={styles.container} style={cssVariables}>
      <div className={styles.ringProgressFill} />
      <span className={styles.score}>{value}</span>
    </div>
  );
};

export default CircularProgress;
