import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Modal from '../../../../../atoms/Modal';
import ChartNavigation from './ChartNavigation';
import styles from './ChartComponent.module.scss';

const ChartModal = ({
  isOpen,
  onClose,
  chartConfigs,
  selectedChartIndex,
  setSelectedChartIndex,
  currentChartConfig,
  modalChartConfig,
  Highcharts
}) => {
    console.log("chartConfigs model",chartConfigs);
  return (
    <Modal
      dialogOptions={{
        isOpen,
        onCloseModal: onClose,
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEsc: true,
        showCloseIcon: true,
        title: `Chart View - ${currentChartConfig?.title?.text || 'Chart'} (${selectedChartIndex + 1}/${chartConfigs.length})`,
      }}
      size="extraLarge"
    >
      <div className={styles.modalContent}>
        {/* <ChartNavigation
          chartConfigs={chartConfigs}
          selectedChartIndex={selectedChartIndex}
          setSelectedChartIndex={setSelectedChartIndex}
          currentChartConfig={currentChartConfig}
          isModal={true}
        /> */}

        <HighchartsReact
          key={`modal-chart-${selectedChartIndex}`} // Force re-render on chart change
          highcharts={Highcharts}
          options={modalChartConfig}
          containerProps={{
            style: { 
              width: "100%", 
              height: "100%",
              flex: 1
            },
          }}
        />
      </div>
    </Modal>
  );
};

export default ChartModal;
