import React from 'react';
import ChartVisualisationDropdown from "components/ChartVisualisationDropdown";

export interface VisualisationOption {
    label: string;
    img: string|null;
    refKey:string;
    value: string;
    enable: boolean;
    shimmerType?: string;
}

interface ChartVisualisationConfig {
    show?: boolean;
    options: VisualisationOption[];
    onSelection?: (option: VisualisationOption) => void;
    getConfigForGraph?: (option: VisualisationOption) => any;
    defaultType?: VisualisationOption | string;
}
interface DownloadActionsConfig {
    show?: boolean;
    actionButtonJSX?: React.ReactNode;
}

interface GraphToolbarRightProps {
    childrenJSX?: React.ReactNode;
    chartVisualisationConfig?: ChartVisualisationConfig;
    downloadActionsConfig?: DownloadActionsConfig;
}

const GraphToolbarRight: React.FC<GraphToolbarRightProps> = ({
    childrenJSX,
    chartVisualisationConfig = { show: false, options: [], defaultType: {}, onSelection: () => { } },
    downloadActionsConfig = { show: true },
}) => {
    const showChartVisualisation = chartVisualisationConfig.show ?? true;
    const showDownloadActions = downloadActionsConfig.show ?? true;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {childrenJSX}
            {showChartVisualisation && (
                <ChartVisualisationDropdown
                    visualisationOptions={chartVisualisationConfig.options}
                    defaultSelVisualisation={chartVisualisationConfig.defaultType}
                    updateChartVisualisationInParent={chartVisualisationConfig.onSelection}
                />
            )}
            {(showDownloadActions && downloadActionsConfig.actionButtonJSX) && (<>{downloadActionsConfig.actionButtonJSX}</>)}
        </div>
    );
};

export default React.memo(GraphToolbarRight);