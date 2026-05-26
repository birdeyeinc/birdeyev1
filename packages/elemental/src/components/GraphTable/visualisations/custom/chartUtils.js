/**
 * Deep clone an object to prevent mutations affecting original data
 * @param {Object} obj - Object to clone
 * @returns {Object} Deep cloned object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === "object") {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Creates a chart configuration for regular display
 * @param {Object} currentChartConfig - The base chart configuration
 * @returns {Object} Processed chart configuration
 */
export const createChartConfig = (currentChartConfig) => {
  if (!currentChartConfig) return null;

  // Deep clone to prevent any mutations affecting the original config
  const clonedConfig = currentChartConfig

  return {
    ...clonedConfig,
    title: {
      ...clonedConfig.title,
      style: {
        fontSize: "14px",
        fontWeight: "normal",
        ...clonedConfig.title?.style,
      },
    },
    chart: {
      ...clonedConfig.chart,
      animation: false,
      reflow: true,
      height: "50%",
      spacing: [10, 10, 15, 10],
    },
    plotOptions: {
      ...clonedConfig.plotOptions,
      series: {
        ...clonedConfig.plotOptions?.series,
        animation: false,
      },
    },
    credits: {
      enabled: false,
    },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 768 },
          chartOptions: {
            chart: { height: 250 },
            title: { style: { fontSize: "12px" } },
            legend: { enabled: false },
            xAxis: {
              ...clonedConfig.xAxis,
              labels: { rotation: -45, style: { fontSize: "10px" } },
              title: { text: null },
            },
            yAxis: clonedConfig.yAxis?.map((y) => ({
              ...y,
              title: { text: null },
            })),
          },
        },
        {
          condition: { maxWidth: 480 },
          chartOptions: {
            chart: { height: 200 },
            title: { style: { fontSize: "11px" } },
            xAxis: {
              ...clonedConfig.xAxis,
              labels: { rotation: -60, style: { fontSize: "9px" } },
            },
          },
        },
      ],
    },
    series: clonedConfig.series.map((s) => ({
      ...s, // Deep clone each series to prevent cross-contamination
      animation: false,
      data: s.data.map((v) =>
        typeof v === "string" ? parseFloat(v) : v
      ),
    })),
  };
};

/**
 * Creates a chart configuration for modal display
 * @param {Object} chartConfig - The processed chart configuration
 * @returns {Object} Modal-optimized chart configuration
 */
export const createModalChartConfig = (chartConfig) => {
  if (!chartConfig) return null;

  // Deep clone the chart config to prevent any mutations
  const clonedChartConfig = deepClone(chartConfig);

  // Use the EXACT same configuration as the regular chart, just modify sizing
  return {
    ...clonedChartConfig, // Use the already processed chartConfig
    chart: {
      ...clonedChartConfig.chart,
      height: null, // Let modal auto-size
      width: null,  // Let modal auto-size
    },
    title: {
      ...clonedChartConfig.title,
      style: {
        ...clonedChartConfig.title?.style,
        fontSize: "18px", // Slightly larger for modal
      },
    },
  };
};
