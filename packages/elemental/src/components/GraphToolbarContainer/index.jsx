import React, { useEffect, useMemo } from "react";
import styles from "./GraphToolbarContainer.module.scss";
import { cloneDeep } from "lodash";
import noDataImage from "assets/images/no-data-image.svg";
import { updateChartStyle } from "./helper";

import PropTypes from "prop-types";
import GraphTable from "components/GraphTable";
import GraphToolbarRight from "./ToolbarRight";
import GraphToolbarLeft from "./ToolbarLeft";
import GraphSummary from "components/GraphSummary";
import NoData from "components/NoData";

function WidgetNoData({ title = "No data available", subtitle = "Looks like there's no data available for the chart this time around", imageUrl = noDataImage, noDataJsx }) {
    return noDataJsx ? noDataJsx() : <NoData imageUrl={imageUrl} title={title} subtitle={subtitle} />;
}

WidgetNoData.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    imageUrl: PropTypes.string,
    noDataJsx: PropTypes.any,
};

const GraphToolbarContainer = ({
    reportsDetails: _reportsDetails = null,
    leftConfig = {},
    rightConfig = {},
    bodyConfig = {},
    isAddWidget = false,
}) => {
    const reportsDetails = useMemo(() => cloneDeep(_reportsDetails), [_reportsDetails]);
    const showGraph = bodyConfig.showGraph ?? true;
    const leftSideVisible = leftConfig.isVisible ?? true;
    const rightSideVisible = rightConfig.isVisible ?? true;
    const isRenderingOneSide = (leftSideVisible && !rightSideVisible) || (!leftSideVisible && rightSideVisible);

    const [selectedGraphConfig, setSelectedGraphConfig] = React.useState(null);
    const { widgetNodataConfig } = reportsDetails || {};
    useEffect(() => {
        if (rightConfig.chartVisualisationConfig?.defaultType && reportsDetails && showGraph) {
            const graphConfig = handleChartStyleUpdate(rightConfig.chartVisualisationConfig.defaultType);
            setSelectedGraphConfig(graphConfig);
        }
    }, [rightConfig.chartVisualisationConfig?.defaultType, reportsDetails, showGraph]);

    const handleChartStyleUpdate = (selectedOption) => {
        let updatedChartStyle;
        if (rightConfig.chartVisualisationConfig.getConfigForGraph) {
            updatedChartStyle = rightConfig.chartVisualisationConfig.getConfigForGraph(selectedOption);
        } else {
            updatedChartStyle = updateChartStyle(reportsDetails, selectedOption);
        }
        return updatedChartStyle;
    };
    const handleGraphTypeChange = (option) => {
        if(showGraph){
            const graphConfig = handleChartStyleUpdate(option);
            setSelectedGraphConfig(graphConfig);
        }
        if (rightConfig.chartVisualisationConfig?.onSelection) {
            rightConfig.chartVisualisationConfig.onSelection(option);
        }
    };
    const derivedChartVisualisationConfig = React.useMemo(
        () => ({
            ...rightConfig.chartVisualisationConfig,
            onSelection: handleGraphTypeChange,
        }),
        [rightConfig.chartVisualisationConfig, handleGraphTypeChange],
    );
    return (
        <div className={`el-graph ${styles["graph-toolbar-container"]}`}>
            {!isAddWidget ? <div className={styles["graph-toolbar-header"]} style={isRenderingOneSide ? {}: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                {
                    (leftSideVisible) &&
                    <GraphToolbarLeft {...leftConfig} />
                }
                {
                    (rightSideVisible) &&
                    <GraphToolbarRight
                        childrenJSX={rightConfig.childrenJSX}
                        chartVisualisationConfig={derivedChartVisualisationConfig}
                        downloadActionsConfig={rightConfig.downloadActionsConfig}
                    />
                }
            </div> : null}
            <div className={styles["graph-toolbar-body"]}>
                {widgetNodataConfig?.enable && widgetNodataConfig?.hasNoData(reportsDetails) ? (
                    <WidgetNoData {...widgetNodataConfig} />
                ) : (
                    <>
                        {bodyConfig.childrenJSX && bodyConfig.childrenJSX}
                        {bodyConfig.showGraphSummary && !isAddWidget && <GraphSummary reportDetails={reportsDetails} />}
                        {showGraph && selectedGraphConfig && <GraphTable reportConfig={cloneDeep(selectedGraphConfig)} visualisationType="chart" />}
                    </>
                )}
            </div>
        </div>
    );
};

GraphToolbarContainer.propTypes = {
    reportsDetails: PropTypes.object,
    leftConfig: PropTypes.object,
    rightConfig: PropTypes.object,
    bodyConfig: PropTypes.object,
    isAddWidget: PropTypes.bool,
};

export default GraphToolbarContainer;
