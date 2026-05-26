import { DEFAULT_CELL_WIDTH, DEFAULT_CELL_HEIGHT, DEFAULT_Y_AXIS_WIDTH } from "./constants";

export const getXAxisCategories = (apiData, reportDetails) => {
  if (reportDetails?.parserConfig?.xAxisOptions?.categoriesGenerator) {
    return reportDetails.parserConfig.xAxisOptions.categoriesGenerator(reportDetails);
  }
  return apiData?.dataPoints?.map(item => item?.actual?.label) ?? [];
};

export const getYAxisCategories = (reportDetails) => {
  return reportDetails?.parserConfig?.yAxisOptions?.categoriesGenerator?.(reportDetails) ?? [];
};

export const calculateDimensions = (obj) => {
    const { cellWidth, cellHeight, xAxisCategoriesLength, yAxisCategoriesLength, yAxisLabelWidth } = obj;

    const dynamicMinWidth = xAxisCategoriesLength * cellWidth;
    const totalWidth = yAxisLabelWidth + dynamicMinWidth;
    const contentHeight = yAxisCategoriesLength * cellHeight;

    return {
        dynamicMinWidth,
        totalWidth,
        contentHeight
    };
};

export const getCellDimensions = (parserConfig) => {
    const cellWidth = parserConfig?.dynamicCellWidth 
        ? "" 
        : (parserConfig?.cellDimensions?.cellWidth ?? DEFAULT_CELL_WIDTH);
    
    return {
        cellWidth,
        cellHeight: parserConfig?.cellDimensions?.cellHeight ?? DEFAULT_CELL_HEIGHT
    };
};
