import React, { useMemo, useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Modal from "../../../../atoms/Modal";
import ChartNavigation from "./ChartNavigation";
import TableComponent from "./TableComponent";
import styles from "./ChartComponent.module.scss";

/* ✅ Error Boundary Component for Highcharts in Modal */
class ModalHighchartsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Modal Highcharts Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.chartError}>
          <div style={{ textAlign: "center", padding: "24px" }}>
            <i className="icon_phoenix-warning-circle" style={{ fontSize: "32px", marginBottom: "12px", display: "block", color: "#f59e0b" }} />
            <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
              Unable to load the chart. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === "development" && (
              <p style={{ margin: "8px 0 0 0", color: "#9ca3af", fontSize: "12px", fontFamily: "monospace" }}>
                {this.state.errorMessage}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ChartModal = ({
  isOpen,
  onClose,
  chartConfigs,              // ← preparedConfigs from ReportChart
  selectedChartIndex,
  setSelectedChartIndex,
  currentChartConfig,        // ← preparedConfigs[selectedChartIndex]
  modalChartConfig,
  Highcharts
}) => {
  const [chartError, setChartError] = useState(false);

  /* ✅ currentChartConfig is already normalized */
  const isTableData = currentChartConfig?.isTable;

  // Reset error state when selected chart changes
  useEffect(() => {
    setChartError(false);
  }, [selectedChartIndex]);

  // Setup Highcharts error handler
  useEffect(() => {
    const handleHighchartsError = (e) => {
      console.error("Highcharts Error Event:", e);
      setChartError(true);
    };

    // Listen for Highcharts errors
    if (window.Highcharts) {
      window.Highcharts.onError = handleHighchartsError;
    }

    return () => {
      if (window.Highcharts) {
        window.Highcharts.onError = undefined;
      }
    };
  }, []);

  const modalTitle = useMemo(() => {
    const titleText =
      currentChartConfig?.raw?.title?.text ||
      (isTableData ? "Table" : "Chart");

    const indexInfo = `(${selectedChartIndex + 1}/${chartConfigs.length})`;

    return `${isTableData ? "Table View" : "Chart View"} - ${titleText} ${indexInfo}`;
  }, [currentChartConfig, isTableData, selectedChartIndex, chartConfigs.length]);

  return (
    <Modal
      dialogOptions={{
        isOpen,
        onCloseModal: onClose,
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEsc: true,
        showCloseIcon: true,
        title: modalTitle
      }}
      size="extraLarge"
    >
      <div className={styles.modalContent}>
        {/* ✅ Navigation now works without recomputation */}
        {/* <ChartNavigation
          chartConfigs={chartConfigs}
          selectedChartIndex={selectedChartIndex}
          setSelectedChartIndex={setSelectedChartIndex}
          isModal
        /> */}

        {isTableData ? (
          <TableComponent
            config={currentChartConfig.raw}
            isModal
          />
        ) : chartError ? (
          <div className={styles.chartError}>
            <div style={{ textAlign: "center", padding: "24px" }}>
              <i className="icon_phoenix-warning-circle" style={{ fontSize: "32px", marginBottom: "12px", display: "block", color: "#f59e0b" }} />
              <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
                Unable to load the chart. Please try refreshing the page.
              </p>
            </div>
          </div>
        ) : (
          <ModalHighchartsErrorBoundary>
            <HighchartsReact
              key={`modal-chart-${selectedChartIndex}`}
              highcharts={Highcharts}
              options={modalChartConfig}
              containerProps={{
                style: {
                  width: "100%",
                  height: "100%",
                  flex: 1
                }
              }}
            />
          </ModalHighchartsErrorBoundary>
        )}
      </div>
    </Modal>
  );
};

export default ChartModal;
