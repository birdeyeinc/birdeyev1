import { chartElemColor, chartIntialLimits, entityTypes } from "components/GraphTable/common/constants";
import { getSentimentClass } from "components/GraphTable/common/helper";
import { isEmpty, merge } from "lodash";
import { gray20, gray300, gray900, green300, red90, white } from "sass/js/colors";
import { capitalizeFirstLetter, getTextWidth, isWindows } from "utils/index";
import { baseConverter } from "../../common/converter";
import { getTooltipForSunburst } from "../../common/tooltip";

const { CATEGORY, SUB_CATEGORY, KEYWORD, ADJECTIVE } = entityTypes;

// Global variable to hold chart instance
let globalChartInstance = null;
let prevSelectedNodePoint = null;

/** ================================== Utility functions ======================================= */

const findMaxKeySentiment = (sentiment) => {
    return !isEmpty(sentiment) ? getSentimentClass({ sentiment })?.slice(0, 3) : "empty";
};

const calculateAverage = (arr) => arr.reduce((acc, num) => acc + num, 0) / arr.length;
const calculateSum = (arr) => arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

const findMentionsAndSentimentAggregate = (nodes) => {
    const aggregateObj = {
        value: [],
        mentions: [],
        score: [],
        spread: {
            pos: [],
            neg: [],
            neu: [],
        },
    };
    nodes?.forEach((elem) => {
        if (elem?.sentiment?.spread) {
            aggregateObj["spread"]["pos"].push(elem.sentiment.spread.pos);
            aggregateObj["spread"]["neg"].push(elem.sentiment.spread.neg);
            aggregateObj["spread"]["neu"].push(elem.sentiment.spread.neu);
        }
        if (elem?.sentiment?.score >= 0) {
            aggregateObj["score"].push(elem.sentiment.score);
        }
        if (elem.mentions) {
            aggregateObj["value"].push(elem.mentions);
            aggregateObj["mentions"].push(elem.mentions);
        }
    });

    aggregateObj["value"] = Math.round(calculateAverage(aggregateObj["value"]));
    aggregateObj["mentions"] = Math.round(calculateSum(aggregateObj["mentions"]));
    aggregateObj["score"] = calculateAverage(aggregateObj["score"]);
    for (const key in aggregateObj.spread) {
        aggregateObj.spread[key] = Math.round(calculateSum(aggregateObj.spread[key]));
    }
    return aggregateObj;
};

const updateMiscellaneousForSubcat = (subcat) => {
    subcat.name = "Misc";
    subcat["dataLabels"] = {};
};

const updateOthersMentionsAndSentiment = (othersElem, nodesInOthers) => {
    const aggregateObj = findMentionsAndSentimentAggregate(nodesInOthers);
    othersElem.maxKey = findMaxKeySentiment(aggregateObj);
    othersElem.color = chartElemColor[othersElem.maxKey];
    othersElem.mentions = aggregateObj.mentions;
    othersElem.value = aggregateObj.value;
    othersElem.totalNodes = nodesInOthers.length;
    othersElem.sentiment = {
        spread: aggregateObj?.spread,
    };
    othersElem.className = othersElem.maxKey + "_bubble";
};

const equalizeChildNodeValues = (elem, mentionsSum, keywordData, adjectiveData) => {
    // updating child node values (kw and adj) based on parent node so as to fill the empty space
    const elemVal = elem.value || elem.mentions;
    // elem.type can be CATEGORY in case of subcat skip
    const isEqualiseNodes = elem.type === SUB_CATEGORY || elem.type === KEYWORD || keywordData[elem.id];
    if (isEqualiseNodes && mentionsSum[elem.id] < elemVal) {
        const childData = keywordData[elem.id] || adjectiveData[elem.id];
        if (childData?.length) {
            const childType = childData[0]?.type;
            const maxNodes = Math.min(chartIntialLimits[childType], childData.length);
            const adjustmentFactor = (elemVal - mentionsSum[elem.id]) / maxNodes;
            childData?.forEach((node) => {
                if (node.value) {
                    node.value += adjustmentFactor;
                }
            });
        }
    }
};

const getSunburstLevels = (levelsData) => {
    const { totalLevels = 5, reduceWidthLevels = [], hideLevels = [] } = levelsData;
    const levels = [
        {
            level: 1,
            levelIsConstant: false,
            dataLabels: {
                filter: {
                    property: "outerArcLength",
                    operator: ">",
                    value: 64,
                },
            },
            levelSize: {
                value: 0.7,
            },
        },
    ];
    for (let i = 2; i <= totalLevels; i++) {
        const level = {
            level: i,
            colorByPoint: true,
            colorVariation: {
                key: "brightness",
                to: -0.5,
            },
        };
        if (reduceWidthLevels.includes(i) || hideLevels.includes(i)) {
            level["levelSize"] = {
                value: reduceWidthLevels.includes(i) ? 0.2 : 0,
            };
            level["dataLabels"] = {
                enabled: false,
            };
        }
        levels.push(level);
    }
    return levels;
};

export const getDataLabelsDefaultStyle = (addEllipses = false, chartData = null) => {
    const isClusterView = chartData?.reportDetails?.drillToThemeView;
    // @ts-ignore
    const isFirefox = document.documentElement !== undefined && document.documentElement.style.MozAppearance !== undefined;
    let fontWeight = 500;
    let fontSize = 10;
    let width = "65%";
    if (isClusterView) {
        fontWeight = 400;
        fontSize = 9;
        width = "90%";
    }
    const ellipsesStyle = addEllipses
        ? {
              textOverflow: "ellipsis", // or 'wrap' for wrapping
              whiteSpace: "nowrap",
              width,
          }
        : {};
    return {
        style: {
            color: gray900, // default
            fontWeight,
            fontSize,
            textOutline: "none",
            ...ellipsesStyle,
        },
        formatter() {
            const clsName = this.point.type === ADJECTIVE || this.point.id.startsWith("others_") ? "cursor-default" : "";
            let style = "visibility: visible;";
            let name = this.point.name;
            let label = name;
            if (!chartData?.reportDetails?.drillToThemeView) {
                if ((this.point.dataLabel?.width + 4 > this.point.graphic?.width && this.point.reduceFontSize) || this.point.isEllipsisAdded) {
                    const maxChars = Math.floor(this.point.graphic.width / 5);
                    name = name.length > maxChars ? name.substring(0, maxChars - 3) + "..." : name;
                    this.point["isEllipsisAdded"] = true;
                }
                if (this.point.dataLabel?.width + 4 > this.point.graphic?.width || this.point.reduceFontSize) {
                    this.point["reduceFontSize"] = true;
                    style += "font-size: 8px;";
                }
                if (name?.endsWith("...") && name?.length <= 7) {
                    name = "";
                }
            } else {
                const maxLength = 10;
                const pointWidth = this.point.graphic.width;
                if (pointWidth > 100) {
                    fontSize = 14;
                    style += `alignment-baseline: central;`;
                } else if (pointWidth >= 80 && pointWidth < 100) {
                    fontSize = 11;
                } else {
                    fontSize = 9;
                }
                if (label.length > maxLength) {
                    const lines = [];
                    const words = label.split(" ");
                    words.forEach((word, index) => {
                        const wordSpace = getTextWidth(word, fontSize, "Inter, arial, sans-serif", 400);
                        const diff = pointWidth - wordSpace;
                        if (diff <= 5) {
                            word = word.substring(0, maxLength - 3) + "...";
                        }
                        lines.push(`<span class="custom-bubble-label" style="margin-bottom: ${index != words.length - 1 && !isFirefox ? `-${fontSize}px` : "0px"};">${word}</span>`);
                    });
                    label = lines.join(`<br/>`);
                }
                name = label;
                style += `font-size: ${fontSize}px;display: flex;flex-direction: column;justify-content: center;align-items: center;`;
            }
            if (this.point.isSelected && this.point.maxKey === "pos") {
                return `<span style="color: ${green300}; ${style}" class=${clsName}>${name}</span>`;
            } else if (this.point.isSelected && this.point.maxKey === "neu") {
                return `<span style="color: ${gray900}; ${style}" class=${clsName}>${name}</span>`;
            } else if (this.point.isSelected && this.point.maxKey === "neg") {
                return `<span style="color: ${red90}; ${style}" class=${clsName}>${name}</span>`;
            } else if (this.point.maxKey === "neu") {
                return `<span style="color: ${gray900}; ${style}" class=${clsName}>${name}</span>`;
            } else if (this.point.dummy) {
                return `<span style="color: ${gray300}; ${style}" class="cursor-default">${name}</span>`;
            }
            return `<span style="${style} color: ${white};" class=${clsName}>${name}</span>`;
        },
    };
};

const removeTitleTooltip = () => {
    const titles = document.querySelectorAll(".highcharts-data-label title");
    titles?.forEach(function (title) {
        title.textContent = "";
    });
};

const handleOnClickDrillToNode = (event, chartInstance, data, sunburstSeriesData = {}) => {
    const point = event.point;
    let drillId = point && point.drillId;
    if ((point?.options?.dataLabels && !point?.options?.dataLabels.enabled) || point?.options?.dummy) {
        return;
    }
    // Added below condition to drill down for adjective level
    if (!point.drillId && point?.options?.type == ADJECTIVE) {
        if (!point.drilled) {
            drillId = point?.id;
        } else {
            drillId = point?.parent;
        }
    }

    if (drillId && !point.noDrill) {
        let args = { reduceWidthLevels: [5] };
        const isDrillDown = drillId == point?.options?.id;
        if (isDrillDown) {
            args = point?.type !== CATEGORY ? {} : args; // drill down
        } else {
            if (!point?.type || point?.type === CATEGORY) {
                args = { reduceWidthLevels: [4], hideLevels: [5] };
            }
            if (point?.type === KEYWORD || point?.type === ADJECTIVE) {
                args = {};
            }
        }

        // remove dummy subcategory while drill down and drill up in case subcategory is not present
        const seriesData = chartInstance.series[0].data || [];
        const node = point?.node || {};
        let subcat = isDrillDown ? (node.children?.length > 1 ? {} : node.children?.[0]?.point) : node.parentNode?.point; // click/drillUp on sunburst
        if (!subcat && (!isDrillDown || point.type === CATEGORY)) {
            // Back button click
            subcat = seriesData.find((elem) => {
                return isDrillDown ? elem.parent === drillId : elem.id === drillId;
            });
        }
        // Case: more than one subcat, one of them is Misc/dummy
        const subcatArr = subcat?.node?.parentNode?.children;
        if (!isDrillDown && subcat && subcat.dummy && subcat.type === SUB_CATEGORY) {
            drillId = subcat.parent;
            args = { reduceWidthLevels: [5] };
        }
        subcat = subcatArr?.length === 1 ? subcat : {};

        const skipSubCategory = subcat && subcat.dummy && subcat.type === SUB_CATEGORY;
        if (skipSubCategory) {
            // if only one dummy subcat - skip
            args = { hideLevels: [3] };
            if (!isDrillDown) {
                drillId = subcat.parent;
            }
        }
        const levels = getSunburstLevels(args);
        const seriesOptions = chartInstance.options.series;
        seriesOptions[0].levels = levels;
        chartInstance.update({ series: seriesOptions });
        chartInstance.series[0].setRootNode(drillId);
        const selectedNode = isDrillDown ? point?.node?.children?.find((child) => !child?.point?.dummy)?.point : node?.point || event?.selectedNodeObj;
        data?.updateDrillType && data?.updateDrillType(point, sunburstSeriesData, selectedNode);
    }
    removeTitleTooltip();
};

const updateSelectedNodeStyle = (node, chartInstance, onLoad = false) => {
    const selectedNode = node.selectedNode || {};
    const selectedNodeId = selectedNode.logicalId || selectedNode.id;
    const chartType = chartInstance?.series[0]?.options?.type || chartInstance?.options?.chart?.type;
    let selectedNodePoint,
        isNodeFound = false;
    const dataPoints = chartInstance?.series[0]?.data || [];
    const selectedNodeType = selectedNode?.entityType || CATEGORY;
    for (let i = 0; i < dataPoints.length; i++) {
        const elem = dataPoints[i];
        const id = elem.logicalId || elem.id;
        isNodeFound = isNodeFound || id == selectedNodeId;
        let isSelected = onLoad && !selectedNodeId ? elem.type === selectedNodeType : id == selectedNodeId;

        if (!isSelected && !isNodeFound && isEmpty(selectedNodePoint) && elem.id?.startsWith("others_")) {
            const rootNode = chartInstance?.series[0]?.rootNode || "0";
            isSelected = elem.type === selectedNodeType && (chartType !== "sunburst" || elem.parent === rootNode); // rootNode only available for sunburst
        }

        const isCurrentlySelected = elem.isSelected ? true : false;
        const color = elem.maxKey ? (isSelected ? chartElemColor[elem.maxKey + "_selected"] : chartElemColor[elem.maxKey]) : white;
        if (isSelected !== isCurrentlySelected || elem.color !== color) {
            if (isSelected) {
                selectedNodePoint = elem;
            }
        }
        if (onLoad && isSelected) {
            break;
        }
    }
    return { selectedNodePoint };
};

const removeSelectedState = (selectedPoint) => {
    if (selectedPoint) {
        const color = chartElemColor[selectedPoint.maxKey];
        selectedPoint?.update({ color, isSelected: false }, false);
    }
};

const addOrRemoveTooltipDelay = (chartInstance, addDelay) => {
    // Add safety checks
    if (!chartInstance || !chartInstance.tooltip) {
        console.warn("Chart instance or tooltip not available");
        return;
    }
    
    const tooltip = chartInstance.tooltip;
    const tooltipOptions = tooltip.options;
    
    if (!tooltipOptions) {
        console.warn("Tooltip options not available");
        return;
    }
    
    tooltipOptions.originalFormatter = tooltipOptions.originalFormatter || tooltipOptions.formatter;

    if (addDelay) {
        tooltip.hide();
        tooltipOptions.formatter = function () {
            return false;
        };
        setTimeout(() => {
            tooltipOptions.formatter = tooltipOptions.originalFormatter;
            try {
                if (chartInstance && typeof chartInstance.redraw === 'function') {
                    chartInstance.redraw();
                }
            } catch (error) {
                console.error("Error during chart redraw:", error);
            }
        }, 1000); // added delay of 1 second
    } else {
        tooltipOptions.formatter = tooltipOptions.originalFormatter;
        try {
            if (chartInstance && typeof chartInstance.redraw === 'function') {
                chartInstance.redraw();
            }
        } catch (error) {
            console.error("Error during chart redraw:", error);
        }
    }
};

const updateFirstNodeAsSelected = (nodeObj, chartInstance, data, seriesData, noCallback = false) => {
    const { selectedNodeType, parentId } = nodeObj;
    const dataPoints = chartInstance?.series?.[0]?.data;
    const selectedNodePoint = dataPoints.find((point) => point.type === selectedNodeType && (point.parent == parentId || !parentId) && !point.options?.dummy);
    if (noCallback) {
        return selectedNodePoint;
    }
    if (selectedNodePoint) {
        // initially if table is not rendered
        data?.updateDrillType && data?.updateDrillType({}, seriesData, selectedNodePoint);
    }
};

const handleUpdateChartNodesInSunburst = (nodeObj, chartInstance, data, dataForSunburst, isLoad = false, prevSelected = null) => {
    const { selectedNode, drillId, type } = nodeObj;
    const isDifferentNodeSelected = !prevSelected || selectedNode?.id != prevSelected?.logicalId; // if selecting the same node as prev
    const updatedSelectedObj = !isEmpty(selectedNode) && isDifferentNodeSelected ? updateSelectedNodeStyle(nodeObj, chartInstance, isLoad) : {};
    const updatedNodeObj = nodeObj;

    try {
        if (chartInstance && typeof chartInstance.redraw === 'function') {
            chartInstance.redraw(false);
        }
    } catch (error) {
        console.error("Error during chart redraw:", error);
        return null;
    }
    const selectedNodeObj = updateFirstNodeAsSelected({ selectedNodeType: type, parentId: drillId }, chartInstance, data, dataForSunburst, true);
    handleOnClickDrillToNode({ point: updatedNodeObj, selectedNodeObj }, chartInstance, data, dataForSunburst);
    return updatedSelectedObj?.selectedNodePoint;
};

const getHoverStateHandling = (event, isHover, isShowBorder = false, isNodeClicked = false) => {
    const point = event && event.target;
    const categoryElement = point.graphic && point.graphic.element;
    const { options } = point || {};
    const isDataLabelsEnabled = !options?.dataLabels || options?.dataLabels?.enabled;
    if (categoryElement && isDataLabelsEnabled) {
        const color = point.maxKey ? (point.isSelected ? chartElemColor[point.maxKey + "_selected"] : chartElemColor[point.maxKey]) : white;
        if (!isNodeClicked || point.isSelected) {
            categoryElement.style.color = color;
            categoryElement.style.fill = isHover ? color : "";
        }
        categoryElement.style.stroke = isShowBorder ? white : gray20;
        categoryElement.style.borderRadius = isHover ? "3px" : "0";
    }
    if (!isDataLabelsEnabled) {
        categoryElement.style.filter = "none";
        categoryElement.style.boxShadow = "none";
        categoryElement.style.stroke = isShowBorder ? white : gray20;
        categoryElement.style.cursor = "default";
    }
    if (point.type === ADJECTIVE || point.id?.startsWith("others_")) {
        categoryElement.style.cursor = "default";
    }
};

const getSeriesDataForSunburst = (reportConfig) => {
    const dataPoints = reportConfig?.apiData?.dataPoints;
    const typeCount = {},
        dummySubcategoryObj = {},
        mentionsSum = {},
        keywordData = {},
        adjectiveData = {},
        extraNodes = { id: [] };
    const isLightWeightPage = reportConfig?.isLightWeightPage;
    const showAll = reportConfig?.showAll;
    const series = [
        {
            id: "0",
            name: "",
            parent: "",
            dataLabels: {
                enabled: false,
            },
            color: white,
            maxKey: "",
        },
    ];

    for (let i = 0; i < dataPoints.length; i++) {
        const type = dataPoints[i].type;
        const parent = dataPoints[i].parent;
        typeCount[type] = typeCount[type] || {};
        typeCount[type][parent] = typeCount[type][parent] || 0;
        dummySubcategoryObj[parent] = dummySubcategoryObj[parent] || {};
        const nodeToBeAdded = typeCount[type]?.[parent] < chartIntialLimits[type] && !extraNodes["id"].includes(dataPoints[i].parent);

        const entityData = type === KEYWORD ? keywordData : adjectiveData;

        if (nodeToBeAdded) {
            // update response data objects as needed in sunburst
            const sentiment = dataPoints[i]?.sentiment;
            let maxKey = findMaxKeySentiment(sentiment);

            if (dataPoints[i].dummy) {
                dataPoints[i]["dataLabels"] = { enabled: false };
                maxKey = "transparent";
                if (dummySubcategoryObj[parent]["nonDummy"]) {
                    updateMiscellaneousForSubcat(dataPoints[i]);
                }
                dummySubcategoryObj[parent]["dummySubcatIndex"] = series.length;
            } else {
                const index = dummySubcategoryObj?.[parent]?.dummySubcatIndex;
                if (index) {
                    updateMiscellaneousForSubcat(series[index]);
                }
                dummySubcategoryObj[parent]["nonDummy"] = true;
            }
            dataPoints[i].mentions = dataPoints[i].value;
            dataPoints[i].value = typeCount[type][parent] < chartIntialLimits[type] || dataPoints[i].dummy ? dataPoints[i].mentions : null;
            dataPoints[i].color = maxKey ? chartElemColor[maxKey] : white;
            dataPoints[i].maxKey = maxKey;
            dataPoints[i].nameActual = dataPoints[i].nameActual || dataPoints[i].name;
            dataPoints[i].name = capitalizeFirstLetter(dataPoints[i].name);
            if (type !== CATEGORY) {
                mentionsSum[parent] = mentionsSum[parent] || 0;
                if (dataPoints[i].value) {
                    mentionsSum[parent] += dataPoints[i].value;
                }
            }

            const seriesPoint = { ...dataPoints[i] };
            series.push(seriesPoint);

            entityData[parent] = (entityData[parent] || []).concat(seriesPoint);
            typeCount[type][parent]++;
        } else {
            const seriesPoint = { ...dataPoints[i] };
            entityData[parent] = (entityData[parent] || []).concat(seriesPoint);
            if (!(isLightWeightPage && showAll) && typeCount[type][parent] === chartIntialLimits[type]) {
                const othersElem = {
                    id: "others_" + dataPoints[i].type + dataPoints[i].parent,
                    name: "Others",
                    type: dataPoints[i].type,
                    parent: dataPoints[i].parent,
                    noDrill: true,
                };
                series.push(othersElem);
                typeCount[type][parent]++;
                entityData[parent].push(othersElem);
            }

            extraNodes["id"].push(seriesPoint?.id);
            extraNodes[parent] = extraNodes[parent] || [];
            extraNodes[parent].push(seriesPoint);
        }
    }
    // change the parent of all elems which fall under hidden points
    if (isLightWeightPage && showAll) {
        return series;
    } else {
        series?.forEach((elem) => {
            let parentObj;

            // Finding aggregate for size and color of Others
            if (elem.id?.startsWith("others_")) {
                const nodesInOthers = extraNodes[elem.parent];
                updateOthersMentionsAndSentiment(elem, nodesInOthers);
            }

            const newElem = { ...elem };
            if (newElem.dummy) {
                parentObj = parentObj || series.find((dataElem) => dataElem.id === elem.parent);
                newElem.mentions = parentObj?.mentions;
            }

            // updating child node values (kw and adj) based on parent node so as to fill the empty space
            equalizeChildNodeValues(newElem, mentionsSum, keywordData, adjectiveData);
        });
        return series;
    }
};

/** ================================== Main Config keys utilities ======================================= */

export const getSeriesData = (reportConfig) => {
    const { parserConfig, getActiveEntity, drillTo } = reportConfig || {};
    const rootNode = drillTo?.currentNode || {};
    const rootId = rootNode.id || "";
    const dataForSunburst = getSeriesDataForSunburst(reportConfig);
    const { seriesDetails, isCatView } = parserConfig || {};
    const isAnimationOn = dataForSunburst?.length <= 1000;
    const seriesDetail = seriesDetails?.[0] || {};
    const isCateViewSunburst = isCatView;
    let isNodeClicked = false;
    let args = { reduceWidthLevels: [4], hideLevels: [5] };
    if (rootNode.type) {
        const reduceWidthLastLevel = rootNode.type === CATEGORY;
        args = reduceWidthLastLevel ? { reduceWidthLevels: [5] } : {};
        if (reduceWidthLastLevel) {
            const subCatNode = dataForSunburst.filter((elem) => elem.parent === rootNode.id);
            if (subCatNode?.length === 1 && subCatNode[0]?.dummy) {
                args = { hideLevels: [3] };
            }
        }
    }
    return [
        {
            ...(seriesDetail || {}),
            data: dataForSunburst,
            rootId,
            dataGrouping: {
                enabled: true,
                forced: true,
                units: [["dataForSunburst", [1]]],
            },
            name: "Root",
            allowDrillToNode: false,
            borderRadius: 0,
            cursor: "pointer",
            turboThreshold: 0, // removed default sunburst dataPoint limit (1000)
            dataLabels: getDataLabelsDefaultStyle(),
            animation: isAnimationOn
                ? true
                : {
                      duration: 0,
                  },
            events: {
                click(event) {
                    isNodeClicked = true;
                    globalChartInstance = this.chart;
                    const point = event.point;
                    let isParentOthers = point?.parent?.startsWith("others_");
                    const isDrillUp = point?.drillId != point?.options?.id;
                    if (isDrillUp) {
                        // in case the parent is Others, expand
                        const parentPoint = point?.node?.parentNode?.point;
                        if (parentPoint?.dummy) {
                            // in case parent is dummy subcat, needs to be skipped
                            isParentOthers = parentPoint?.parent?.startsWith("others_");
                        }
                        if (isParentOthers) {
                            const parentNode = parentPoint?.dummy ? parentPoint?.node?.parentNode?.point : parentPoint;
                            const node = { drillId: parentNode.id, noDrill: true, type: parentNode.type };
                            handleOnClickDrillToNode({ point: node }, globalChartInstance, reportConfig, dataForSunburst);
                        }
                    }
                    const isOthersClicked = point?.drillId?.startsWith("others_") || point?.options?.id?.startsWith("others_");
                    if (!isOthersClicked) {
                        removeSelectedState(prevSelectedNodePoint);
                    }
                    const activeEntity = getActiveEntity && getActiveEntity();
                    if (activeEntity?.type == ADJECTIVE) return;
                    if (isCateViewSunburst && point?.options?.type == CATEGORY) return;
                    handleOnClickDrillToNode(event, globalChartInstance, reportConfig, dataForSunburst);
                    addOrRemoveTooltipDelay(globalChartInstance, true);
                },
                updateChartNodes(nodeObj) {
                    isNodeClicked = true;
                    const isDifferentNode = nodeObj?.selectedNode?.id != prevSelectedNodePoint?.logicalId;
                    if (isDifferentNode) {
                        removeSelectedState(prevSelectedNodePoint);
                    }
                    // Added below if condition to drill down sunbusrt if table row get clicked.
                    if (nodeObj?.tableRowClicked) {
                        const selectedNodeObj = updateSelectedNodeStyle(nodeObj, globalChartInstance);
                        const point = selectedNodeObj["selectedNodePoint"];
                        nodeObj = point;
                    }
                    prevSelectedNodePoint = handleUpdateChartNodesInSunburst(nodeObj, globalChartInstance, reportConfig, dataForSunburst, false, prevSelectedNodePoint);
                },
            },
            point: {
                events: {
                    mouseOver: (event) => {
                        getHoverStateHandling(event, true, true, isNodeClicked);
                        setTimeout(() => (isNodeClicked = false), 100);
                    },
                    mouseOut: (event) => {
                        getHoverStateHandling(event, false, true);
                    },
                },
            },
            levels: getSunburstLevels(args),
        },
    ];
};

const getChartOptions = (_reportConfig, chartConfig) => {
    const isAnimationOn = !isWindows() && (chartConfig?.series?.[0]?.data?.length || 0) <= 1000;
    return {
        type: "sunburst",
        animation: isAnimationOn
            ? true
            : {
                  duration: 0,
              },
        // width: 480,
        // height: 480,
        marginTop: 0,
        backgroundColor: "transparent",
        events: {
            load(event) {
                globalChartInstance = event.target;
            },
        },
    };
};

const getTitle = () => {
    return {
        text: "",
    };
};

const getSubTitle = () => {
    return {
        text: "",
    };
};

/**
 *
 * @param {Object} reportConfig - The report configuration object.
 * @returns {Object} plotOptions configuration for Highcharts.
 * @see https://api.highcharts.com/highcharts/plotOptions
 */
const getPlotOptions = (reportConfig, chartConfig) => {
    const {
        parserConfig: { plotDataConfig },
    } = reportConfig;
    const { sunburst } = plotDataConfig;
    const isAnimationOn =  !isWindows() && chartConfig?.dataForSunburst?.length <= 1000;
    const plotDataAnimation = isAnimationOn
        ? {}
        : {
              animation: false,
              states: {
                  normal: {
                      animation: false,
                  },
              },
          };
    return {
        series: merge(
            {
                ...plotDataAnimation,
                stickyTracking: false,
                borderColor: white, // Set your desired border color here
            },
            sunburst,
        ),
    };
};

export const getTooltip = () => {
    return getTooltipForSunburst();
};

const getBoostOptions = () => {
    return {
        enabled: true, // Enable the boost module
        useGPUTranslations: true, // Use GPU for translations
    };
};

const getNavigationOptions = () => {
    return {
        breadcrumbs: {
            showFullPath: false,
            format: " ",
            buttonTheme: {
                fill: "transparent",
                padding: 0,
                stroke: "transparent",
                "stroke-width": 0,
            },
        },
    };
};

const fallbackFns = {
    getChartOptions,
    getTitle,
    getSubTitle,
    getPlotOptions,
    getSeriesData,
    getTooltip,
    getBoostOptions,
    getNavigationOptions,
};

const configKeysWithOrder = [
    { key: "title", fn: "getTitle", order: 1 },
    { key: "subtitle", fn: "getSubTitle", order: 2 },
    { key: "series", fn: "getSeriesData", order: 3 },
    { key: "plotOptions", fn: "getPlotOptions", order: 4 },
    { key: "tooltip", fn: "getTooltip", order: 5 },
    { key: "chart", fn: "getChartOptions", order: 6 },
    { key: "boost", fn: "getBoostOptions", order: 7 },
    { key: "navigation", fn: "getNavigationOptions", order: 8 },
];

export function converter(reportConfig) {
    return baseConverter(reportConfig, configKeysWithOrder, fallbackFns);
}
