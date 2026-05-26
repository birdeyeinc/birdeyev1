import React from 'react';
import styles from './ChartComponent.module.scss';

const ExpandButton = ({ onClick }) => {
  return (
      <button onClick={onClick} className={styles.expandButtonToolkit} title="Expand Chart">
          <i className="icon_phoenix-zoom-out"></i>
      </button>
  );
};

export default ExpandButton;
