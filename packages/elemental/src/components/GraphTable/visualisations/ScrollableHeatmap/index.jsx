import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { object } from "prop-types";
import { getXAxisCategories, getYAxisCategories, calculateDimensions, getCellDimensions } from "./utils";
import { getChartConfigWithContainer } from "../charts/extensions/heatmap/helper";
import GraphToolbarContainer from "components/GraphToolbarContainer";
import Charts from "../charts";
import styles from "./ScrollableHeatmap.module.scss";
import { DEFAULT_MAX_CONTAINER_HEIGHT, DEFAULT_Y_AXIS_WIDTH, HEADER_HEIGHT, LEGEND_HEIGHT, WRAPPER_PADDING } from "./constants";
import HeatmapCustomLegend from "./HeatmapCustomLegend";
import NoData from "components/NoData";
import noDataImage from "assets/images/no-data-image.svg";

const ScrollableHeatmap = ({ reportConfig = {} }) => {
    const { heading, apiData, parserConfig, customContainerClassName = "" } = reportConfig;
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
    }, [reportConfig?.tempUniqueId]);

    const computedValues = useMemo(() => {
        if (apiData?.dataPoints?.length === 0) {
            return {};
        }
        let cellWidth, cellHeight;
        
        // Use dynamic cell width only if explicitly enabled and container width is available
        if (parserConfig?.dynamicCellWidth === true && containerWidth > 0) {
            ({ cellWidth, cellHeight } = getChartConfigWithContainer(reportConfig, containerWidth));
        } else {
            // For all other cases (false, undefined, or no container width), use static dimensions
            ({ cellWidth, cellHeight } = getCellDimensions(parserConfig));
        }
        const xAxisCategories = getXAxisCategories(apiData, reportConfig);
        const yAxisCategories = getYAxisCategories(reportConfig);
       
        const yAxisLabelWidth = parserConfig?.yAxisOptions?.yAxisWidth ?? DEFAULT_Y_AXIS_WIDTH;
        
        const { dynamicMinWidth, totalWidth, contentHeight } = calculateDimensions({
            cellWidth,
            cellHeight,
            xAxisCategoriesLength: xAxisCategories.length,
            yAxisCategoriesLength: yAxisCategories.length,
            yAxisLabelWidth
        });

        const maxContainerHeight = parserConfig?.maxContainerHeight || DEFAULT_MAX_CONTAINER_HEIGHT;
        const headerHeight = parserConfig?.displayHeader ? HEADER_HEIGHT : 0;
        const legendHeight = parserConfig?.isCustomLegend ? LEGEND_HEIGHT : 0;
        const scrollContainerHeight = maxContainerHeight - headerHeight - legendHeight - WRAPPER_PADDING;
        
        return {
            cellWidth,
            cellHeight,
            xAxisCategories,
            yAxisCategories,
            dynamicMinWidth,
            totalWidth,
            contentHeight,
            yAxisLabelWidth,
            scrollContainerHeight
        };
    }, [containerWidth, apiData, parserConfig, reportConfig?.tempUniqueId]);

    const { cellWidth, cellHeight, xAxisCategories, yAxisCategories, dynamicMinWidth, totalWidth, contentHeight, yAxisLabelWidth, scrollContainerHeight } = computedValues;

    const containerClassNames = `${customContainerClassName} ${styles["heatmap-container"]}`;
     const dynamicCellWidth = parserConfig?.dynamicCellWidth;
    const Header = ({displaySummary}) => {
        if (!parserConfig?.displayHeader) {
            return null;
        }

        return (
            <GraphToolbarContainer
                leftConfig={{
                    title: heading
                }}
                bodyConfig={{
                    showGraphSummary: displaySummary
                }}
                reportsDetails={reportConfig}
            />
        );
    };

    const CustomScrollContainer = () => {
        return (
            <div 
                className={styles["custom-scroll-container"]}
                style={{
                    maxHeight: `${scrollContainerHeight}px`
                }}
            >
                <div 
                    className={styles["sticky-x-axis"]}
                    style={{
                        minWidth: dynamicCellWidth ? " " : `${totalWidth}px`,
                        width: dynamicCellWidth ? xAxisCategories.length > 8 ? `${xAxisCategories.length * 113 + 125}px` : `100%` : `${totalWidth}px`,
                    }}
                >
                    <div 
                        className={styles["corner-cell"]}
                        style={{
                            width: `${yAxisLabelWidth}px`
                        }} 
                    />
                    <div 
                        className={styles["time-labels-container"]}
                        style={{
                            width: dynamicCellWidth ? (xAxisCategories.length > 8 ? `${xAxisCategories.length * 113}px` : `100%`) : `${dynamicMinWidth}px`,
                            // minWidth: `${dynamicMinWidth}px`
                             minWidth: dynamicCellWidth ?  `658px` : `${dynamicMinWidth}px`,
                        }}
                    >
                        {xAxisCategories.map((xAxisLabel, index) => {
                            let displayLabel = xAxisLabel;
                            
                            // The below logic prevents chart labels from being cluttered with AM/PM on every hour, showing them only every 12th position (offset by 8) or on the first item
                            if (apiData?.groupByType === "hour") {
                                let val = xAxisLabel.split(" ");
                                const val1 = val?.[0] || "";
                                const val2 = val?.[1] || "";
                                displayLabel = `${val1}${index === 0 || (index + 8) % 12 === 0 ? ` ${val2}` : ""}`;
                            }
                            
                            return (
                                <div
                                    key={`${xAxisLabel}-${index}`}
                                    className={styles["xAxis-label"]}
                                    style={{
                                        width: dynamicCellWidth ? (xAxisCategories.length > 8 ? "113px" : "auto") : `${cellWidth}px`,
                                        flex: dynamicCellWidth ? (xAxisCategories.length > 8 ? "" : "1") : "none"
                                    }}
                                    title={xAxisLabel}
                                >
                                    {displayLabel}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div 
                    className={styles["content-area"]}
                    style={{
                        minWidth: dynamicCellWidth ? "" : `${totalWidth}px`,
                        width: dynamicCellWidth ? xAxisCategories.length > 8 ? `${xAxisCategories.length * 113}px` : `100%` : `${totalWidth}px`,
                    }}
                >
                    <div className={styles["sticky-y-axis"]}>
                        {
                            parserConfig?.yAxisOptions?.customYAxisLabelRenderer
                                ? yAxisCategories.map((yAxisLabel, index) =>
                                    parserConfig.yAxisOptions.customYAxisLabelRenderer(reportConfig, index, yAxisLabel)
                                )
                                : yAxisCategories.map((yAxisLabel, index) => (
                                    <div
                                        key={`${yAxisLabel}-${index}`}
                                        className={styles["yAxis-label"]}
                                        style={{
                                            height: `${cellHeight}px`,
                                            width: `${yAxisLabelWidth}px`
                                        }}
                                        title={yAxisLabel}
                                    >
                                        {yAxisLabel}
                                    </div>
                                ))
                        }
                    </div>
                    <div 
                        className={styles["heatmap-chart-container"]}
                        style={{
                            width: dynamicCellWidth ? (xAxisCategories.length > 8 ? `${xAxisCategories.length * 113}px` : `calc(100% - ${yAxisLabelWidth}px)`) : `${dynamicMinWidth}px`,
                            minWidth: dynamicCellWidth ? `658px` : `${dynamicMinWidth}px`,
                            height: `${contentHeight}px`
                        }}
                    >
                        <Charts reportConfig={getChartsReportConfig(reportConfig)} />
                    </div>
                </div>
            </div>
        );
    };

    const getChartsReportConfig = useCallback((config) => {
        const updatedReportConfig = { ...config };
        // Handle cellDimensions if dynamicCellWidth is enabled
        if (config?.parserConfig?.dynamicCellWidth) {
            updatedReportConfig.parserConfig.cellDimensions = {
                ...config.parserConfig?.cellDimensions,
                cellWidth,
                cellHeight
            };
        }
        
        return updatedReportConfig;
    }, [cellWidth, cellHeight]);

    if (apiData?.dataPoints?.length === 0) {
        return (
            <div className={containerClassNames}>
                {parserConfig?.displayHeader && <Header displaySummary={false}/>}
                <NoData imageUrl={noDataImage} title={"No data available"} subtitle={"Looks like there's no data available for the report this time around"} />
            </div>
        );
    }

    return (
        <div ref={containerRef} className={containerClassNames}>
            <Header displaySummary={parserConfig?.displaySummary} />
            {
                parserConfig?.isCustomScroll ? 
                    <div className={styles["custom-scroll-container-wrapper"]}>
                        <CustomScrollContainer />
                    </div>
                    :
                    <Charts reportConfig={getChartsReportConfig(reportConfig)} />
            }
            {parserConfig?.isCustomLegend && <HeatmapCustomLegend reportConfig={reportConfig} />}
        </div>
    );
};


ScrollableHeatmap.propTypes = {
    reportConfig: object.isRequired,
};

export default ScrollableHeatmap;