import merge from "lodash/merge";
import { converter } from "./helper";

/**
 * here we get chartConfig useing converter, now if someone want to override couple of keys
 * and dont want to pass utilityFns for small change in existing output
 * for that dev can pass `getHardOverrideChartConfig` function which will return object with keys/nestedkey
 * which will override in finalChartConfig
 */
export function getChartConfig(reportConfig) {
    let chartConfig = converter(reportConfig);
    let updatedChartConfig = merge(chartConfig, reportConfig?.getHardOverrideChartConfig ? reportConfig.getHardOverrideChartConfig(chartConfig, reportConfig) : {});
    return updatedChartConfig;
}
