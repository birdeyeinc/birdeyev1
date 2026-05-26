import React from "react";
import PropTypes from "prop-types";
import Button from "atoms/Button";
import styles from "./Counter.module.scss";
import cx from "classnames";

const Counter = ({ 
  value, 
  onIncrement, 
  onDecrement, 
  disabled,
  min,
  max,
  size,
  width,
  height,
  className,
  style
}) => {

  const minValue = min;

  const handleDecrement = () => {
    if (!disabled && value > minValue) {
      onDecrement();
    }
  };

  const handleIncrement = () => {
    if (!disabled && (max === undefined || value < max)) {
      onIncrement();
    }
  };

  const isDecrementDisabled = disabled || value <= minValue;
  const isIncrementDisabled = disabled || (max !== undefined && value >= max);

  // Container classes
  const containerClasses = cx(
    styles["counter-container"],
    styles[`counter-${size}`],
    className
  );

  // Custom style for width/height override
  const customStyle = { ...(width && { width }), ...(height && { height }) };

  return (
    <div 
      className={containerClasses} 
      style={{ ...customStyle, ...style }} 
      role="group"
      aria-label="Counter"
      aria-disabled={disabled}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <Button 
        onClick={handleDecrement} 
        disabled={isDecrementDisabled}
        theme="secondary" 
        className={cx(styles["counter-btn"], "counter-decrement")}
        aria-label="Decrement"
      >
        −
      </Button>
      <div className={styles["counter-value"]}>{value}</div>
      <Button 
        onClick={handleIncrement} 
        disabled={isIncrementDisabled}
        theme="secondary"
        className={cx(styles["counter-btn"], "counter-increment")}
        aria-label="Increment"
      >
        +
      </Button>
    </div>
  );
};

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

Counter.defaultProps = {
  disabled: false,
  size: 'medium',
  min: 0,
  max: undefined,
  className: '',
  style: {}
};

export default Counter;
