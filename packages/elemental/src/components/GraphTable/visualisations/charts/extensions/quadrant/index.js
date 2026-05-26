import merge from "lodash/merge";
import { converter } from "./helper";
import './index.scss';
/**
 * here we get chartConfig using converter, now if someone want to override couple of keys
 * and dont want to pass utilityFns for small change in existing output
 * for that dev can pass `getHardOverrideChartConfig` function which will return object with keys/nestedkey
 * which will override in finalChartConfig
 */
export function getChartConfig(reportConfig) {
    const chartConfig = converter(reportConfig);
    const updatedChartConfig = merge(
        chartConfig, 
        reportConfig?.getHardOverrideChartConfig ? reportConfig.getHardOverrideChartConfig(chartConfig, reportConfig) : {}
    );
    return updatedChartConfig;
}
