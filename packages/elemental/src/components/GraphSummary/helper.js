import { formatNumberToUnits, numberWithCommas } from "components/GraphTable/common/helper";

export const getGraphId = (data) => {
    const { graphId, dashboardId, reportSequence, sectionSequence } = data;
    if (dashboardId) {
        return `${sectionSequence}_${reportSequence}_${graphId}`;
    }
    return graphId;
};


/**
 * Formats a change value based on formatting options
 * @param value - The numeric value to format
 * @param formatWithComma - Whether to apply comma formatting
 * @param formatInUnits - Whether to format in units (K, M, B, T)
 * @returns Formatted representation of the value
 */
export const getFormattedChangeValue = (value, formatWithComma = false, formatInUnits = false) => {
    if (formatWithComma) {
        return numberWithCommas(value);
    } else if (formatInUnits) {
        return formatNumberToUnits(value);
    } else {
        return value;
    }
};
