import React, { useMemo, useState, useCallback, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ExpandButton from "./ExpandButton";
import ChartModal from "./ChartModal";
import TableComponent from "./TableComponent";
import { createChartConfig, createModalChartConfig } from "./chartUtils";
import styles from "./ChartComponent.module.scss";

import HighchartsBoost from "highcharts-v2/modules/boost";
import HighchartsTreemap from "highcharts-v2/modules/treemap";
import HighchartsSankeyChart from "highcharts-v2/modules/sankey";
import HighchartsFunnel from "highcharts/modules/funnel";

/* ✅ Initialize Highcharts modules ONCE */
HighchartsBoost(Highcharts);
HighchartsTreemap(Highcharts);
HighchartsSankeyChart(Highcharts);
HighchartsFunnel(Highcharts);

/* ✅ Error Boundary Component for Highcharts */
class HighchartsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Highcharts Error:", error, errorInfo);
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError();
    }
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

const ReportChart = ({ reportConfig = [], addToDashboardCallback = () => {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChartIndex, setSelectedChartIndex] = useState(0);
  const [chartErrors, setChartErrors] = useState({}); // Track errors per chart

  // Setup Highcharts error handler on mount
  useEffect(() => {
    const handleHighchartsError = (e) => {
      console.error("Highcharts Error Event:", e);
      // Mark ALL charts as having errors since we can't determine which specific chart failed
      // Or mark based on the currently rendered index
      setChartErrors(prev => ({
        ...prev,
        [selectedChartIndex]: true
      }));
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
  }, [selectedChartIndex, setChartErrors]);

  /* ✅ PREPARE EVERYTHING ONCE */
  const preparedConfigs = useMemo(() => {
    return reportConfig.map((cfg) => {
      const isTable = cfg?.type === "Table" && cfg?.dataGridOptions;

      if (isTable) {
        return {
          raw: cfg,
          isTable: true,
          chartConfig: null,
          modalChartConfig: null
        };
      }

      const chartConfig = createChartConfig(cfg);
    //   const chartConfig = cfg
      return {
        raw: cfg,
        isTable: false,
        chartConfig,
        // modalChartConfig: createModalChartConfig(chartConfig)
        modalChartConfig: chartConfig
      };
    });
  }, [reportConfig]);

  const openModalAtIndex = useCallback((index) => {
    setSelectedChartIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      {preparedConfigs.map((item, index) => {
        /* ================= TABLE ================= */
        if (item.isTable) {
          return (
            <TableComponent
              key={`table-${index}`}
              config={item.raw}
              addToDashboardCallback={addToDashboardCallback}
              onExpand={() => openModalAtIndex(index)}
            />
          );
        }

        /* ================= CHART ================= */
        if (!item.chartConfig) return null;

        // Check if this chart has an error
        if (chartErrors[index]) {
          return (
            <div className={styles.chartContainer} key={`chart-${index}`}>
              <div className={styles.chartWrapper}>
                <div className={styles.chartError}>
                  <div style={{ textAlign: "center", padding: "24px" }}>
                    <i className="icon_phoenix-warning-circle" style={{ fontSize: "32px", marginBottom: "12px", display: "block", color: "#f59e0b" }} />
                    <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
                      Unable to load the chart. Please try refreshing the page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className={styles.chartContainer} key={`chart-${index}`}>
            <div className={styles.chartWrapper}>
              <HighchartsErrorBoundary
                onError={() => {
                  setChartErrors(prev => ({
                    ...prev,
                    [index]: true
                  }));
                }}
              >
                <HighchartsReact
                  highcharts={Highcharts}
                  options={item.chartConfig}
                  containerProps={{
                    style: { width: "100%", height: "100%", minHeight: "200px" }
                  }}
                />
              </HighchartsErrorBoundary>
            </div>
                  
            <div className={styles.toolkitWrapper}>
              <div
                onClick={() => addToDashboardCallback(item.chartConfig)}
                className={styles.expandButtonToolkit}
              >
                <i className="icon_phoenix-add" />
              </div>

              <ExpandButton onClick={() => openModalAtIndex(index)} />
            </div>
          </div>
        );
      })}

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <ChartModal
          isOpen={isModalOpen}
          onClose={closeModal}
          chartConfigs={preparedConfigs}
          selectedChartIndex={selectedChartIndex}
          setSelectedChartIndex={setSelectedChartIndex}
          currentChartConfig={preparedConfigs[selectedChartIndex]}
          modalChartConfig={
            preparedConfigs[selectedChartIndex]?.modalChartConfig
          }
          Highcharts={Highcharts}
        />
      )}
    </>
  );
};

export default ReportChart;
