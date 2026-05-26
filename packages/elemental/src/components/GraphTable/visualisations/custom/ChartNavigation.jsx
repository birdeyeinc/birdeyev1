import React from 'react';
import styles from './ChartComponent.module.scss';

const ChartNavigation = ({ 
  chartConfigs, 
  selectedChartIndex, 
  setSelectedChartIndex, 
  currentChartConfig,
  isModal = false 
}) => {
  if (chartConfigs.length <= 1) return null;

  const navigationClass = isModal ? styles.modalNavigation : styles.chartNavigation;
  const buttonClass = isModal ? styles.modalNavButton : styles.navButton;
  const infoClass = isModal ? styles.modalNavInfo : styles.navInfo;
  const titleClass = isModal ? styles.modalChartTitle : styles.chartTitle;
  const counterClass = isModal ? styles.modalChartCounter : styles.chartCounter;

  const handlePrevious = () => {
    setSelectedChartIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSelectedChartIndex(prev => Math.min(chartConfigs.length - 1, prev + 1));
  };

  return (
    <div className={navigationClass}>
      <button
        onClick={handlePrevious}
        disabled={selectedChartIndex === 0}
        className={buttonClass}
      >
        ←
      </button>
      
      <div className={infoClass}>
        <span className={titleClass}>
          {currentChartConfig?.title?.text || `Chart ${selectedChartIndex + 1}`}
        </span>
        <span className={counterClass}>
          {selectedChartIndex + 1} of {chartConfigs.length}
        </span>
      </div>
      
      <button
        onClick={handleNext}
        disabled={selectedChartIndex === chartConfigs.length - 1}
        className={buttonClass}
      >
        →
      </button>
    </div>
  );
};

export default ChartNavigation;
