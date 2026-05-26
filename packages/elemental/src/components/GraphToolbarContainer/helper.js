import { VISUALIZATIONS_SHORT_CODES } from "components/GraphTable/common/constants";

export const customDeepClone = (obj) => {
    if (obj === null || typeof obj !== "object" || "isActiveClone" in obj) return obj;
    let temp = null;
    if (obj instanceof Date) {
        // @ts-ignore
        temp = new obj.constructor();
    } else if (Array.isArray(obj)) {
        temp = [];
    } else {
        // Handle objects including class instances like AxiosHeaders
        try {
            // For plain objects, create using Object.create
            if (obj.constructor === Object) {
                temp = {};
            } else {
                // For class instances (like AxiosHeaders), convert to plain object
                // This is safer than trying to recreate the class instance
                temp = {};
            }
        } catch (error) {
            // Fallback to plain object if constructor fails
            temp = {};
        }
    }

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj["isActiveClone"] = null;
            temp[key] = customDeepClone(obj[key]);
            delete obj["isActiveClone"];
        }
    }
    return temp;
};
export const updateChartStyle = (reportDetails, selectedOption) => {
    if (selectedOption.visualisationType === "chart")  {
        const chartStyle = selectedOption.value;
        reportDetails.visualisationType = "chart";
        const seriesDetails = reportDetails.parserConfig.seriesDetails || [];
        seriesDetails.forEach((element) => {
            if (element.primary) {
                element.type = chartStyle;
            } else {
                if (!element.originalType) {
                    element.originalType = element.type;
                }
                if (chartStyle === VISUALIZATIONS_SHORT_CODES.AREA_CHART) {
                    element.type = chartStyle;
                } else {
                    element.type = element.originalType;
                }
            }
        });
        reportDetails.parserConfig.seriesDetails = seriesDetails;
    } else {
        reportDetails.visualisationType = selectedOption.visualisationType;
    }
    reportDetails.parserConfig.primaryChartStyle = selectedOption?.value;
    return customDeepClone(reportDetails);
};
