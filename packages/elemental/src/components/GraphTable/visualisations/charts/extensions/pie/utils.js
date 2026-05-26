import { every, get, isEmpty } from "lodash";
import {
  parserConstant,
  VISUALIZATIONS_SHORT_CODES,
} from "../../../../common/constants";
import * as colors from "sass/js/colors";
import {
  formatNumberToUnits,
  numberWithCommas,
} from "components/GraphTable/common/helper";

const { GROUPED, ARRAY_KEY_VALUE, GROUPED_ARRAY_KEY_VALUE } = parserConstant;

const { PIE_CHART } = VISUALIZATIONS_SHORT_CODES;

// Helper function to get distribution keys from config or use defaults
const getDistributionKeys = (parserConfig) => {
  return parserConfig?.pieDataKeys || [];
};

// Helper function to sum all distribution values from nested data using Lodash
const sumDistributionValues = (nestedData, distributionKeys) => {
  return distributionKeys?.reduce((sum, key) => sum + get(nestedData, key, 0), 0) || 0;
};

// Helper function to navigate through nested data path dynamically using Lodash
const getNestedDataByPath = (data, path) => {
  if (!path) return null;
  return get(data, path, null);
};

// As of now we are not developing for compare data, so this function is a placeholder
function checkIfCompareFilterIsApplied() {
  return false;
}

export const getSeriesDataForPieChart = (reportsDetails, type) => {
  const parserConfig = reportsDetails.parserConfig;
  const disableLegends = parserConfig?.disableLegends;

  let disabledSeriesData;
  if (reportsDetails?.isCustomLegend) {
    disabledSeriesData = reportsDetails?.disabledSeriesData || [];
    disabledSeriesData = reportsDetails?.legendNameFormatter
      ? disabledSeriesData.map((item) =>
          reportsDetails?.legendNameFormatter(item)
        )
      : disabledSeriesData; // Kundan Singh ||  if legend name and category name are different then we can get with legendNameformatter
  }

  if (parserConfig.dataFormat === GROUPED) {
    const seriesDetails = parserConfig.seriesDetails;
    const dataObj = get(reportsDetails?.apiData?.dataPoints?.[0]?.[type], `${parserConfig["categoryKey"]}`, undefined);
    const categoryValueMap = parserConfig.categoryValueMap;
    let categoryList = parserConfig.categoryList;

    if (reportsDetails?.isCustomLegend) {
      categoryList = categoryList.filter(
        (item) => !disabledSeriesData.includes(item)
      );
    }

    const series = [];
    const isCompareFilterApplied =
      checkIfCompareFilterIsApplied(reportsDetails);
    seriesDetails.forEach((item) => {
      const obj = {
        name: item.name,
        type: item.type,
        color: item.color,
        id: item.id,
        maxPointWidth: item.maxPointWidth || 20,
        showInLegend: reportsDetails?.isCustomLegend
          ? false
          : !isCompareFilterApplied
          ? true
          : false,
      };
      const enableExtraData = item.enableExtraData || false;
      const actualDataKey = item.actualDataKey || null;
      const data = [];
      for (const key of categoryList) {
        if (
          categoryValueMap?.[key] &&
          (dataObj?.[key] || dataObj?.[key] == 0)
        ) {
          if (parserConfig?.selectedDisplayValueAs) {
            data.push({
              y:
                dataObj?.[key]?.[parserConfig?.seriesDetails?.[0]?.dataKey]?.[
                  parserConfig?.selectedDisplayValueAs
                ] || 0,
              name: categoryValueMap?.[key]?.["value"],
              color: categoryValueMap?.[key]?.["color"]
                ? type === "actual"
                  ? categoryValueMap?.[key]?.["color"]
                  : categoryValueMap?.[key]?.["compareColor"]
                : item?.["color"],
            });
          } else if (
            reportsDetails?.parserConfig?.isGroupedWithoutCategoryKey
          ) {
            // isGroupedWithoutCategoryKey is used for dataFormat = GROUPED where response is without categoryKey
            data.push({
              y: dataObj[key].total,
              name: categoryValueMap[key]["value"],
              color: categoryValueMap[key]["color"]
                ? type === "actual"
                  ? categoryValueMap[key]["color"]
                  : categoryValueMap[key]["compareColor"]
                : item["color"],
              type,
            });
          } else {
            data.push({
              y: enableExtraData ? dataObj?.[key][actualDataKey] || 0 : dataObj?.[key] || 0,
              name: categoryValueMap?.[key]?.["value"],
              color: categoryValueMap?.[key]?.["color"]
                ? type === "actual"
                  ? categoryValueMap[key]["color"]
                  : categoryValueMap?.[key]?.["compareColor"]
                : item?.["color"],
              ...(enableExtraData && {extraData: dataObj?.[key]["extraData"]}),
              events: {
                legendItemClick() {
                  return disableLegends ? false : true; // Prevent the default behavior
                },
              },
            });
          }
        }
      }
      const isNoData = every(data, (item) => !item?.y);
      if (isEmpty(data) || isNoData) {
        data.push({
          color: "#F3F3F3",
          y: 100,
          noData: true,
        });
        obj["noData"] = true;
      } else {
        obj["noData"] = false;
      }
      obj["data"] = data;
      series.push(obj);
    });
    return series;
  } else if (parserConfig.dataFormat === ARRAY_KEY_VALUE) {
    const seriesDetails = parserConfig.seriesDetails;
    const series = [];
    const isCompareFilterApplied =
      checkIfCompareFilterIsApplied(reportsDetails);
    const obj = {
      name: parserConfig?.pieChartTitle || parserConfig?.seriesDetails[0]?.name,
      type: seriesDetails[0]?.type,
      id: seriesDetails[0]?.id,
      maxPointWidth: seriesDetails[0]?.maxPointWidth || 20,
      showInLegend: !isCompareFilterApplied ? true : false,
    };

    let data = seriesDetails.reduce((accumulator, current) => {
      const newObj = {
        dataKey: current?.dataKey,
        y: 0,
        name: current?.name,
        color: type === "actual" ? current?.color : current?.compareColor,
      };
      accumulator.push(newObj);
      return accumulator;
    }, []);
    reportsDetails?.apiData?.dataPoints?.forEach((itemObj) => {
      data?.forEach((dataObj) => {
        let value = 0;
        
        // Handle nested data structure with configurable path
        if (parserConfig.isPieDistribution && parserConfig.pieDistributionDataKey) {
          const nestedData = getNestedDataByPath(itemObj[`${type}`], parserConfig.pieDistributionDataKey);
          
          if (nestedData) {
            value = nestedData[dataObj?.dataKey] || 0; // Extract pos/neg/neu value
          }
        } else if (itemObj[`${type}`][dataObj?.dataKey]) {
          value = itemObj[`${type}`][dataObj?.dataKey];
        }
        
        if (value) {
          dataObj.y += value;
        }
      });
    });

    data.forEach((item) => {
      delete item.dataKey;
    });

    const filteredData = data.filter((value) => value?.y !== 0);
    if (isEmpty(filteredData)) {
      let item = series?.[0]?.data?.[0] || {};
      data = [];
      data.push({
        ...item,
        color: "#F3F3F3",
        y: 100,
        legendColor: item?.color,
        noData: true,
        dataLabels: { enabled: false }
      });
      obj["noData"] = true;
    } else {
      obj["noData"] = false;
    }
    if (parserConfig.isArrayKeyValueWithMultipleValues) {
      if (type === "actual") {
        const itemDataArray = [];
        reportsDetails?.apiData?.dataPoints?.forEach((itemObj) => {
          const itemDataObj = {};
          data?.forEach(() => {
            itemDataObj["y"] = itemObj[`${type}`].count;
            itemDataObj["name"] = itemObj[`${type}`].label;
            switch (itemObj[`${type}`].label) {
              case "0":
              case "1":
              case "2":
              case "3":
              case "4":
              case "5":
              case "6":
                itemDataObj["color"] = colors.default2Star;
                break;
              case "7":
              case "8":
                itemDataObj["color"] = colors.default3Star;
                break;
              case "9":
              case "10":
                itemDataObj["color"] = colors.default5Star;
                break;
              default:
                break;
            }
            itemDataArray.push(itemDataObj);
          });
        });
        data = itemDataArray;
      } else {
        const itemDataArray = [];
        reportsDetails?.apiData?.dataPoints?.forEach((itemObj) => {
          const itemDataObj = {};
          data?.forEach(() => {
            itemDataObj["y"] = itemObj[`${type}`].count;
            itemDataObj["name"] = itemObj[`${type}`].label;
            switch (itemObj[`${type}`].label) {
              case "0":
              case "1":
              case "2":
              case "3":
              case "4":
              case "5":
              case "6":
                itemDataObj["color"] = colors.comparison2Star;
                break;
              case "7":
              case "8":
                itemDataObj["color"] = colors.comparison3Star;
                break;
              case "9":
              case "10":
                itemDataObj["color"] = colors.comparison5Star;
                break;
              default:
                break;
            }
            itemDataArray.push(itemDataObj);
          });
        });
        data = itemDataArray;
      }
    }

    if (
      parserConfig.isSentimentByNPS &&
      parserConfig.primaryChartStyle === PIE_CHART
    ) {
      let detractorsSum = 0;
      let passivesSum = 0;
      let promotersSum = 0;
      let totalSum = 0;
      reportsDetails?.apiData?.dataPoints?.forEach((item) => {
        const y = item[`${type}`].count;
        switch (item[`${type}`].label) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
            detractorsSum += y;
            totalSum += y;
            break;
          case "7":
          case "8":
            passivesSum += y;
            totalSum += y;
            break;
          case "9":
          case "10":
            promotersSum += y;
            totalSum += y;
            break;
          default:
            break;
        }
      });
      const itemDataArray = [
        {
          name: "Detractors",
          y: detractorsSum,
          color:
            type === "actual" ? colors.default2Star : colors.comparison2Star,
          point: {
            extraData: ((detractorsSum / totalSum) * 100).toFixed(1),
          },
        },
        {
          name: "Passives",
          y: passivesSum,
          color: type === "actual" ? colors.default3Star : colors.comparison3Star,
          point: {
            extraData: ((passivesSum / totalSum) * 100).toFixed(1),
          },
        },
        {
          name: "Promoters",
          y: promotersSum,
          color:
            type === "actual" ? colors.default5Star : colors.comparison5Star,
          point: {
            extraData: ((promotersSum / totalSum) * 100).toFixed(1),
          },
        },
      ];
      data = itemDataArray;
    }
    obj["data"] = data;
    series.push(obj);
    return series;
  } else if (parserConfig.dataFormat === GROUPED_ARRAY_KEY_VALUE) {
    const seriesDetails = parserConfig.seriesDetails;
    const { dataPoints = [] } = reportsDetails?.apiData || {};
    const series = [];
    const isCompareFilterApplied =
      checkIfCompareFilterIsApplied(reportsDetails);
    seriesDetails.forEach((item) => {
      const obj = {
        name: item.name,
        type: item.type,
        color: item.color,
        id: item.id,
        maxPointWidth: item.maxPointWidth || 20,
        showInLegend: !isCompareFilterApplied ? true : false,
      };
      let data = [
        {
          y: 0,
          name: item?.name || "",
          color: item.color,
        },
      ];
      for (const point of dataPoints) {
        if (!isEmpty(point[type])) {
          if (parserConfig.selectedDisplayValueAs) {
            data[0].y +=
              point?.[type]?.[item?.dataKey]?.[
                parserConfig.selectedDisplayValueAs
              ] || 0;
          } else {
            data[0].y += point?.[type]?.[item?.dataKey] || 0;
          }
        }
      }
      const isNoData = data[0]?.y === 0;
      if (isNoData) {
        data = [];
        data.push({
          color: colors.gray20,
          y: 100,
          noData: true,
        });
        obj["noData"] = true;
      } else {
        obj["noData"] = false;
      }
      obj["data"] = data;
      series.push(obj);
    });
    return series;
  }
};

const getTitleJSXForPie = (total, totalUnModified, title) => {
  return total
          ? `
                        <span class="icon tootip-parent header-tooltip" style="cursor: pointer; display: flex; flex-direction: column; align-items: center;">
                            <span style="font-weight: 500; font-size:18px; color:${colors.gray900}; text-align: center;">${total} </span>
                            <span style="font-weight:400; font-size:12px; color:${colors.gray80}"> ${title}</span>
                            <div class="tooltip-white minus-ml-20">
                                <div class="inner grey-heading" style="width: auto; min-width: 150px;">
                                    <p class="grey-heading" style="display: flex; align-items: center; justify-content: center;">
                                        <span style="font-weight:400; font-size:14px; color:${colors.gray80}">${title}&nbsp;-&nbsp;</span>
                                        <span style="font-weight:500; font-size:14px; color:${colors.gray900}; text-align: center;">${totalUnModified}</span>
                                    </p>
                                </div>
                            </div>
                        </span>
                    `
          : `
                        <div style="display: flex;flex-direction: column; align-items: center;">
                            <span style="font-weight: 500; font-size:18px; color:${colors.gray900}; text-align: center">${total} </span>
                            <span style="font-weight:400; font-size:12px; color:${colors.gray80}"> ${title}</span>
                        </div>
                    `;
}

export const getTitleForPie = (reportDetails, type) => {
  const parserConfig = reportDetails.parserConfig;
  if (parserConfig.primaryChartStyle === "pie") {
    const dataFormat = parserConfig.dataFormat;
    let title;
    let dataObj;
    let totalUnModified = 0;
    let total = 0;
    switch (dataFormat) {
      case GROUPED:
        title = parserConfig?.seriesDetails[0]?.name;
        dataObj = get(reportDetails?.apiData?.dataPoints?.[0]?.[type], `${parserConfig["categoryKey"]}`, undefined);
        for (const key in dataObj) {
          if (
            parserConfig?.skipKeyFromTotalCalculation?.length &&
            parserConfig?.skipKeyFromTotalCalculation?.indexOf(key) > -1
          ) {
            continue;
          }
          if (parserConfig.selectedDisplayValueAs) {
            total +=
              dataObj[key][parserConfig.seriesDetails[0].dataKey][
                parserConfig.selectedDisplayValueAs
              ];
          } else if (parserConfig?.isGroupedWithoutCategoryKey) {
            // isGroupedWithoutCategoryKey is used for dataFormat = GROUPED where response is without categoryKey
            total = dataObj.sentInfo.total;
          } else {
            total = total + dataObj[key];
          }
        }
        totalUnModified = numberWithCommas(total);
        total = formatNumberToUnits(total, false, true);
        if (total == 1 && title == "Reviews") {
          title = "Review";
        }
        if (total == 1 && title == "Customers") {
          title = "Customer";
        }
        if (total == 1 && title == "Calls") {
          title = "Call";
        }
        return getTitleJSXForPie(total, totalUnModified, title);
      case ARRAY_KEY_VALUE:
        title =
          parserConfig?.pieChartTitle || parserConfig?.seriesDetails[0]?.name;
        dataObj = reportDetails?.apiData?.dataPoints;
        total = dataObj?.reduce((acc, curr) => {
          let totalVal;
          if (parserConfig?.totalValueForPieFollowers) {
            totalVal =
              acc +
              curr[`${type}`]?.followersGain +
              curr[`${type}`]?.followersLost;
          } else if (parserConfig?.totalValueForPieLikes) {
            totalVal =
              acc + curr[`${type}`]?.likesGain + curr[`${type}`]?.likesLost;
          } else if (parserConfig?.totalValueForPiePostMetric) {
            totalVal =
              acc +
              curr[`${type}`]?.postImpressions +
              curr[`${type}`]?.postReach +
              curr[`${type}`]?.postEngagements;
          } else if (parserConfig?.isSentimentByNPS) {
            totalVal = acc + curr[`${type}`].count;
          } else if (parserConfig?.isPieDistribution) {
            // Custom logic for pie distribution data with configurable path
            const distributionKeys = getDistributionKeys(parserConfig);
            
            if (parserConfig.pieDistributionDataKey) {
              const nestedData = getNestedDataByPath(curr[`${type}`], parserConfig.pieDistributionDataKey);
              
              if (nestedData) {
                totalVal = acc + sumDistributionValues(nestedData, distributionKeys); // Sum all distribution values
              } else {
                // Fallback to flat structure if nested path doesn't exist
                totalVal = acc + sumDistributionValues(curr[`${type}`] || {}, distributionKeys);
              }
            } else {
              // Fallback to flat structure if no path configured
              totalVal = acc + sumDistributionValues(curr[`${type}`] || {}, distributionKeys);
            }
          } else {
            totalVal = acc + curr[`${type}`]?.totalCount;
          }

          if (isNaN(totalVal)) return acc;
          return totalVal ? totalVal : 0;
        }, 0);
        totalUnModified = numberWithCommas(total);
        total = formatNumberToUnits(total);

        if (total == 1 && title == "Reviews") {
          title = "Review";
        }
        if (total == 1 && title == "Customers") {
          title = "Customer";
        }
        if (total == 1 && title == "Calls") {
          title = "Call";
        }
        return getTitleJSXForPie(total, totalUnModified, title);
      case GROUPED_ARRAY_KEY_VALUE:
        title = parserConfig?.seriesDetails[0]?.name;
        dataObj = reportDetails?.apiData?.dataPoints;
        for (const item of dataObj) {
          if (parserConfig.selectedDisplayValueAs) {
            total +=
              item[type]?.[parserConfig.seriesDetails[0].dataKey]?.[
                parserConfig.selectedDisplayValueAs
              ] || 0;
          } else {
            total =
              total +
              (item?.[type]?.[parserConfig.seriesDetails[0].dataKey] || 0);
          }
        }
        total = formatNumberToUnits(total, false, true);
        return `<div><span style="font-weight: 500;font-size:18px;color:${colors.gray900};text-align: center">${total} </span><br /><span style="font-weight:400;font-size:12px;color:${colors.gray80}"> ${title}</span></div>`;
      default:
        return "";
    }
  } else {
    return "";
  }
};

export const pieplotData = (reportconfig, chartData, chartConfig) => {
  const noData = chartConfig?.seriesData?.[0]?.["noData"];
  const parserConfig = reportconfig?.parserConfig;

  return {
    innerSize: "65%",
    allowPointSelect: !noData,
    states: {
      hover: {
        enabled: !noData,
      },
      inactive: {
        enabled: !noData,
      },
      select: {
        enabled: !noData,
      },
    },
    cursor: noData ? "default" : "pointer",
    connectorShape: "none",
    borderWidth: 0,
    borderRadius: 0,
    size: parserConfig?.pieSize || "80%",
    dataLabels: {
      enabled: !noData,
      connectorWidth: 0,
      formatter() {
        return this.percentage > 5
          ? this.percentage.toFixed(1) + "%"
          : null;
      },
      distance: "-18%",
      style: {
        fontWeight: 500,
        textOutline: "none",
        fontSize: "12px",
      },
    },
    showInLegend: true,
  };
};
