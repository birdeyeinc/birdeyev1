import React, { useMemo } from "react";
import { object } from "prop-types";
import styles from "./HeatmapCustomLegend.module.scss";

const HeatmapCustomLegend = ({ reportConfig = {} }) => {
    const { parserConfig, apiData } = reportConfig;
    const { colorAxis, getMaxValueForLegend } = parserConfig || {};
    
    const minValue = colorAxis?.min ?? 0;
    const maxValue = colorAxis?.max ?? (getMaxValueForLegend && getMaxValueForLegend(apiData));

    const maxColor = colorAxis?.maxColor;
    const minColor = colorAxis?.minColor;
    
    // Memoized tick calculation to only run when min/max values change
    const ticks = useMemo(() => {
        const tickArray = [];
        const range = maxValue - minValue;
        
        if (range < 3) {
            // Small range: show all integers between min and max
            for (let i = minValue; i <= maxValue; i++) {
                tickArray.push(i);
            }
        } else {
            // Normal case: create 4 evenly distributed ticks with nice round numbers
            tickArray.push(minValue); // Always start with minValue
            
            // Calculate nice intermediate values based on range
            if (range % 4 === 0) {
                // Perfect quarter divisions (e.g., 0-100 → 0,25,75,100)
                const quarter = range / 4;
                tickArray.push(minValue + quarter);
                tickArray.push(minValue + quarter * 3);
            } else if (range >= 100) {
                // For large ranges, try to get nice quarter-like divisions
                const quarterRange = Math.floor(range / 4);
                const threeQuarterRange = Math.floor(range * 3 / 4);
                
                // Round to nearest 5 for cleaner numbers
                const firstTick = Math.round((minValue + quarterRange) / 5) * 5;
                const thirdTick = Math.round((minValue + threeQuarterRange) / 5) * 5;
                
                // Ensure they're not too close to min/max and not duplicates
                const finalFirstTick = firstTick > minValue && firstTick < maxValue ? firstTick : Math.round(minValue + range * 0.25);
                const finalThirdTick = thirdTick > finalFirstTick && thirdTick < maxValue ? thirdTick : Math.round(minValue + range * 0.75);
                
                tickArray.push(finalFirstTick);
                tickArray.push(finalThirdTick);
            } else if (range >= 20) {
                // For medium ranges, use multiples of 5
                const step = range / 3;
                const roundToFive = (value) => Math.round(value / 5) * 5;
                tickArray.push(roundToFive(minValue + step));
                tickArray.push(roundToFive(minValue + step * 2));
            } else {
                // For smaller ranges, use simple distribution
                const step = range / 3;
                tickArray.push(Math.round(minValue + step));
                tickArray.push(Math.round(minValue + step * 2));
            }
            
            tickArray.push(maxValue); // Always end with maxValue
        }
        
        return tickArray;
    }, [minValue, maxValue]);
    
    return (
        <div className={styles["legend-container"]}>
                <div className={styles["legend-bar-container"]}>
                    <div 
                        className={styles["legend-gradient-bar"]}
                        style={{
                            background: `linear-gradient(to right, ${minColor}, ${maxColor})`
                        }}
                    />
                    <div className={styles["legend-ticks"]}>
                        {ticks.map((tick, index) => (
                            <div 
                                key={tick}
                                className={styles["legend-tick"]}
                                style={{
                                    left: `${(index / (ticks.length - 1)) * 100}%`
                                }}
                            >
                                <div className={styles["legend-tick-mark"]} />
                                <div className={styles["legend-tick-label"]}>
                                    {tick}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    );
};

HeatmapCustomLegend.propTypes = {
    reportConfig: object.isRequired,
};

export default HeatmapCustomLegend;
