import React, { useState, useMemo } from "react";
import ActionBox from "atoms/ActionBox";
import PropTypes from "prop-types";
import style from "./ChartVisualisationDropdown.module.scss";

const ChartVisualisationDropdown = (props) => {
    const { visualisationOptions, defaultSelVisualisation, updateChartVisualisationInParent, containerClassName } = props;
    
    const defaultSelection = useMemo(() => {
        if (defaultSelVisualisation) {
            if (defaultSelVisualisation.value) {
                return defaultSelVisualisation;
            } else {
                const selectedOption = visualisationOptions.find((option) => option.value === defaultSelVisualisation);
                return selectedOption || visualisationOptions[0];
            }
        } else {
            return visualisationOptions[0];
        }
    }, [visualisationOptions, defaultSelVisualisation]);

    const [currSelVisualisation, setCurrSelVisualisation] = useState(defaultSelection);
    
    //Updates the current selected chart visualisation in dropdown
    const handleVisualisationChangeInDropdown = (option) => {
        if(currSelVisualisation.value === option.value) return;
        setCurrSelVisualisation(option);
        updateChartVisualisationInParent && updateChartVisualisationInParent(option);
    };

    return (
        <div className={`el-chart-visualisation ${style["chart-vis-dropdown-container"]} ${containerClassName}`} >
            <ActionBox
                actionConfig={{
                    categories: [
                        {
                            title: "",
                            options: visualisationOptions
                        }
                    ]
                }}
                actionClickCb={handleVisualisationChangeInDropdown}
                customSelectionJsx={
                    <div className="chart-vis display-flex display-flex-center">
                        <span>
                            <img src={currSelVisualisation?.img} />
                        </span>
                        <span>
                            <i className="icon_phoenix-cheveron_open ml-5" />
                        </span>
                    </div>
                }
                selectedVal={currSelVisualisation?.value}
                popOverSize="standard"
            />
        </div>
    );
};

ChartVisualisationDropdown.propTypes = {
    visualisationOptions: PropTypes.object,
    defaultSelVisualisation: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    updateChartVisualisationInParent: PropTypes.func,
    containerClassName: PropTypes.string,
};

export default ChartVisualisationDropdown;