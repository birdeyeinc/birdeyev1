
import React from "react";
import { get, isEmpty } from "lodash";

import starImage from "assets/images/summary/yellow-star.svg";

import { capitalizeFirstLetter,checkForNoDataAvailable,isTabletDevice } from "utils/index";
import { formatNumberToUnits, getComparisonLabels, getDecimaledValue,numberWithCommas } from "components/GraphTable/common/helper";
import { getGraphId, getFormattedChangeValue } from "./helper";

import Tooltip from "atoms/Tooltip";

interface IGraphSummaryProps{
    reportDetails: any;
    gridItemStyle: Record<string, any>;
}
const onTabletDevice = isTabletDevice();
function GraphSummary(props:IGraphSummaryProps) {
    const { reportDetails } = props;
    const summaryWrapperExtraClass = onTabletDevice ? "small" : "large";
    const getSummaryPositiveOrNegativeClass = (value:any, isGrowthNegative = true, changeKey = "", isCustomLogicForPositiveOrNegativeClass = false) => {
        // isGrowthNegative - is used to toggle growth value (+/-) for specific metrics, out of all metrics within a widget (effects single metric in widget) - can be used in combination with percentageGrowthIsNegative
        // percentageGrowthIsNegative - which was initially here, is used to toggle growth class for primary metrics (effects complete widget)
        const { parserConfig } = reportDetails;
        const { percentageGrowthIsNegative, customLogicToGetPositiveOrNegativeClass } = parserConfig;

        if (isCustomLogicForPositiveOrNegativeClass) {
            const finalClass = customLogicToGetPositiveOrNegativeClass && customLogicToGetPositiveOrNegativeClass(changeKey, value);
            return finalClass;
        }

        if (value > 0) {
            return percentageGrowthIsNegative && isGrowthNegative
                ? "negative reversed"
                : "positive";
        } else {
            return percentageGrowthIsNegative && isGrowthNegative
                ? "positive reversed"
                : "negative";
        }
    };
    const getSummaryJSX = () => {
        const {
            parserConfig,
            // customGraphTitle,
            apiData,
            // graphId,
            // tagData,
            // compareGraphSummaryTitle,
            // groupBy = "",
            // module,
            // reportTitle,
            // isLightWeightPage,
            // router,
            hideSummary,
            isDefaultComparisonFilterApplied,
            // customGraphTitleJSX,
            disabledSeries = [],
            // isCustomMatrixRatingOverTimeLocationReport = false,
            navigateOnAnotherRoute,
        } = reportDetails;
        const {
            // graphTitle,
            showTotalInSummary = false,
            fontSize,
            // graphSubTitle = "",
            isApiDataRootLevel = false,
        } = parserConfig;
        // const tagName = tagData?.name || apiData?.summary?.actual?.tagName;

        const totalCount = apiData?.summary?.actual?.totalCount;
        let summaryConfig: any[] = parserConfig.summaryData;
        const selectedDisplayValueAs = parserConfig.selectedDisplayValueAs;
        let summaryJSX, totalCountIndividual;
        const summaryData = apiData.summary?.actual;
        const summaryDataCompare = apiData?.summary?.compare;

        const isResponseRateDistribution = false; //graphId === RESP_RATE_DISTRIBUTION.graphId;
        // const isRelativeRankLocation = false; //graphId === R_R_LOCATION.graphId;
        const ifCompareFilterIsApplied = false; //checkIfCompareFilterIsApplied(props);
        const actualAndCompareWith:any = getComparisonLabels(reportDetails) || {}; //getComparisonLabels(this.props) || {};
        // const showSearchBox = parserConfig.showSearchBox || false;
        const appliedFilterComparisonLabel:any = {}; //isDefaultComparisonFilterApplied ? this.getAppliedFilterComparisonLabel() : {};
        const hideSummaryTooltip = parserConfig?.hideSummaryTooltip || false;
        // if (compareGraphSummaryTitle) {
        //     const splittedCompareSummaryTitle = compareGraphSummaryTitle.split(/\svs\s/);
        //     const actual = splittedCompareSummaryTitle[0];
        //     const compareWith = splittedCompareSummaryTitle[1];
        //     actualAndCompareWith = { actual, compareWith };
        // }
        // if (isRelativeRankLocation) {
        //     const { locationRank = 0, total = 0 } = this?.chartConfig?.seriesData?.[0] || {};
        //     if (!locationRank && summaryConfig.length > 2) {
        //         summaryConfig = clone(summaryConfig);
        //         summaryConfig?.pop();
        //     } else {
        //         summaryData.locationRank = ordinalSuffixOf(locationRank);
        //     }
        //     totalCountIndividual = total;
        // }

        if (disabledSeries?.length) {
            summaryConfig = summaryConfig.filter(
                (item) =>
                    !disabledSeries.includes(
                        item?.label === "NPS"
                            ? item?.label
                            : capitalizeFirstLetter(item?.label?.toLowerCase()),
                    ),
            );
        }

        if (parserConfig.displaySummary) {
            summaryJSX = summaryConfig?.map((item) => {
                let value;
                const {
                    dataKey,
                    indexKey,
                    label,
                    showFloatOnly,
                    showPercent,
                    showStar,
                    noLabelManipulation,
                    showCurrency,
                    currencySymbolKey,
                    showChange,
                    changeKey,
                    showChangeInPercent,
                    showTotal,
                    customText = "",
                    isValueFromNestedArray,
                    sourceId,
                    showDelta = false,
                    redirectURL = "",
                    formatSummaryMetric,
                    isGrowthNegative = true,
                    currencySymbol,
                    formatWithComma = false,
                    formatInUnits = false,
                    isCustomLogicForPositiveOrNegativeClass = false
                } = item;
                const summaryDataValue = get(summaryData, dataKey, undefined);
                value = selectedDisplayValueAs
                    ? summaryDataValue?.[selectedDisplayValueAs]
                    : summaryDataValue;
                let summaryPoint = summaryData;
                const changeKeyValue = get(summaryData, changeKey, undefined);
                if (showFloatOnly) {
                    if (window.BE.business?.avgRating === "2") {
                        value = getDecimaledValue(value);
                    } else {
                        const num = Number(value);
                        value = isNaN(num) ? "" : num.toFixed(1);
                    }
                }
                if (isValueFromNestedArray && dataKey == "sources") {
                    const findSource = summaryDataValue?.find(
                        (item:any) => item?.id === sourceId,
                    );
                    value = findSource ? findSource?.[indexKey] : 0;
                    summaryPoint = findSource;
                }
                if (isApiDataRootLevel) {
                    value = apiData[dataKey];
                }
                value = value ? value : checkForNoDataAvailable(value) ? "-" : 0;
                // if(showCurrency && currencySymbolKey) {
                //     value = summaryData[currencySymbolKey] + value;
                // }
                const showActualUnitLabel =
                    dataKey === "avgResponseTime" ||
                    dataKey === "avgResolutionTime" ||
                    dataKey === "unassignedAvgTime" ||
                    dataKey === "assignedAvgTime" ||
                    dataKey === "countByStatus";

                const renderDeltaJsxInSummary = parserConfig?.renderDeltaJsxInSummary; //BIRD-42962 (Soumya) : Added option to conditionally render jsx in summary section to show delta value corresponding to the attributes we are showing in summary
                const finalValue =
                    showTotal && totalCountIndividual
                        ? totalCountIndividual
                        : dataKey === "avgRatingDecimaled"
                          ? getDecimaledValue(value)
                          : value;
                return (
                    <div
                        className="custom-ratingcontent"
                        key={dataKey}
                        onClick={() =>
                            redirectURL ? navigateOnAnotherRoute(redirectURL) : undefined
                        }
                    >
                        <div className="custom-ratingdata" key="summaryCount">
                            <span
                                className={`rating-text ${isResponseRateDistribution || showPercent ? "rating-text-percentage" : ""}`}
                                style={fontSize ? { fontSize: `${fontSize}px` } : {}}
                            >
                                {showCurrency && currencySymbolKey
                                    ? summaryData[currencySymbolKey]
                                    : currencySymbol
                                      ? currencySymbol
                                      : ""}
                                {!formatSummaryMetric
                                    ? formatNumberToUnits(finalValue)
                                    : formatSummaryMetric(finalValue)}
                            </span>
                            {showTotalInSummary || (showTotal && totalCountIndividual) ? (
                                <span className="sub">
                                    / {formatNumberToUnits(showTotal ? value : totalCount)}
                                </span>
                            ) : null}
                            {value === "-" || finalValue === "-" ? (
                                ""
                            ) : isResponseRateDistribution || showPercent ? (
                                <span className="subRating-text">%</span>
                            ) : null}
                            {showDelta && renderDeltaJsxInSummary
                                ? renderDeltaJsxInSummary(summaryData, item)
                                : ""}{" "}
                            {/* BIRD-62638 || Kundan || item data was required to plot particular delta */}
                            <span className="custom-ratingtext">
                                {showActualUnitLabel && selectedDisplayValueAs
                                    ? capitalizeFirstLetter(selectedDisplayValueAs)
                                    : ""}
                                {customText && value !== "-" ? customText : null}
                            </span>
                            {showStar ? (
                                <span>
                                    <img src={`${starImage}`} alt="star" />
                                </span>
                            ) : null}
                            {showChange && summaryPoint && changeKeyValue ? (
                                <span
                                    style={{ paddingLeft: "5px" }}
                                    className={getSummaryPositiveOrNegativeClass(
                                        changeKeyValue,
                                        isGrowthNegative,
                                        changeKey,
                                        isCustomLogicForPositiveOrNegativeClass
                                    )}
                                >
                                    {/* <i className={this.getSummaryPositiveOrNegativeIconClass(summaryPoint[changeKey])} /> */}
                                    {(changeKeyValue > 0 ? "+" : "") + getFormattedChangeValue(changeKeyValue, formatWithComma, formatInUnits)}
                                    {showChangeInPercent ? "% " : ""}
                                </span>
                            ) : null}
                        </div>
                        <div className="custom-ratingtext" key="label">
                            {noLabelManipulation
                                ? label
                                : capitalizeFirstLetter(label?.toLowerCase())}
                        </div>
                    </div>
                );
            });
        }
        return (
            <div className="custom-detailreviewbox mt-5">
                {!!summaryJSX &&
                    !hideSummary &&
                    (!hideSummaryTooltip ? (
                        <div
                            className={`tooltip-wrap ${parserConfig?.enableLargeSummaryFonts ? "profile-summary-style" : ""} ${parserConfig?.enableSmallSummaryFonts ? "small-summary-container-style" : ""}`}
                        >
                            {summaryConfig.map((item, index) => {
                                const {
                                    label,
                                    indexKey,
                                    showPercent,
                                    showFloatOnly,
                                    dataKey,
                                    customText = "",
                                    showTotal,
                                    tooltipDataKey,
                                    showCountInTooltip,
                                    customTooltipLabel = "",
                                    isValueFromNestedArray,
                                    sourceId,
                                    isAbbreviation,
                                    showDelta = false,
                                    compareDataKey,
                                    tooltipCompareDataKey,
                                    tooltipDatalabel = [],
                                    tooltipDatakey = [],
                                    formatSummaryMetric,
                                    redirectURL,
                                    currencySymbol,
                                    tooltipClass,
                                } = item;
                                const summaryDataValue = get(summaryData, dataKey, undefined);
                                let actualValue = !isEmpty(summaryData)
                                    ? selectedDisplayValueAs
                                        ? summaryDataValue?.[selectedDisplayValueAs]
                                        : summaryDataValue
                                    : "";
                                if (showCountInTooltip) {
                                    actualValue = !isEmpty(summaryData)
                                        ? selectedDisplayValueAs
                                            ? summaryDataValue?.[selectedDisplayValueAs]
                                            : summaryDataValue
                                        : "";
                                }
                                if (isValueFromNestedArray && dataKey == "sources") {
                                    const findSource = summaryDataValue?.find(
                                        (item) => item.id === sourceId,
                                    );
                                    actualValue = findSource ? findSource?.[indexKey] : 0;
                                }
                                if (showFloatOnly) {
                                    if (window.BE.business?.avgRating === "2") {
                                        actualValue = getDecimaledValue(actualValue);
                                    } else {
                                        const num = Number(actualValue);
                                        actualValue = isNaN(num) ? "" : num.toFixed(1);
                                    }
                                }
                                if (isApiDataRootLevel) {
                                    actualValue = apiData[dataKey];
                                }
                                if (checkForNoDataAvailable(actualValue)) {
                                    actualValue = "-";
                                }
                                const showActualUnitLabel =
                                    dataKey === "avgResponseTime" ||
                                    dataKey === "avgResolutionTime" ||
                                    dataKey === "unassignedAvgTime" ||
                                    dataKey === "assignedAvgTime" ||
                                    dataKey === "countByStatus";
                                let tooltipTitle = capitalizeFirstLetter(
                                    customTooltipLabel
                                        ? customTooltipLabel?.toLowerCase()
                                        : label?.toLowerCase(),
                                );
                                if (isAbbreviation) {
                                    tooltipTitle = tooltipTitle?.toUpperCase();
                                }

                                const renderDeltaJsxInSummary =
                                    parserConfig?.renderDeltaJsxInSummary; //BIRD-42962 (Soumya) : Added option to conditionally render jsx in summary section to show delta value corresponding to the attributes we are showing in summary tooltip section
                                const compareDataKeyValue = get(summaryDataCompare, compareDataKey, undefined);
                                let compareValue = !isEmpty(summaryDataCompare)
                                    ? selectedDisplayValueAs
                                        ? compareDataKeyValue?.[
                                              selectedDisplayValueAs
                                          ]
                                        : compareDataKeyValue
                                    : "";
                                if (showCountInTooltip) {
                                    compareValue = !isEmpty(summaryDataCompare)
                                        ? selectedDisplayValueAs
                                            ? compareDataKeyValue?.[
                                                  selectedDisplayValueAs
                                              ]
                                            : summaryDataCompare[tooltipCompareDataKey]
                                        : "";
                                }
                                if (isValueFromNestedArray && compareDataKey == "sources") {
                                    const findSource = compareDataKeyValue?.find(
                                        (item:any) => item.id === sourceId,
                                    );
                                    compareValue = findSource ? findSource?.[indexKey] : 0;
                                }
                                if (showFloatOnly && !isEmpty(compareValue)) {
                                    compareValue = compareValue?.toFixed(1);
                                }
                                if (checkForNoDataAvailable(compareValue)) {
                                    compareValue = "-";
                                }
                                const showCompareUnitLabel =
                                    compareDataKey === "avgResponseTime" ||
                                    compareDataKey === "avgResolutionTime" ||
                                    compareDataKey === "unassignedAvgTime" ||
                                    compareDataKey === "assignedAvgTime" ||
                                    compareDataKey === "countByStatus";
                                const showCompareDataInTooltip = !isEmpty(summaryDataCompare);
                                const hideComparisionLabelInSummary =
                                    parserConfig?.hideComparisionLabelInSummary || false;

                                // if(actualValue === 0){
                                //     return null;
                                // }
                                return (
                                    <Tooltip
                                        key={item.label}
                                        tooltipClass={`inner ${tooltipClass || ""}`}
                                        hideOnScroll
                                        size="medium"
                                        position="right"
                                        customHTML={
                                            <>
                                                {(ifCompareFilterIsApplied ||
                                                    isDefaultComparisonFilterApplied) &&
                                                    showCompareDataInTooltip &&
                                                    apiData?.summary?.compare?.totalCount !== 0 && (
                                                        <>
                                                            {!hideComparisionLabelInSummary && (
                                                                <p
                                                                    className="kpi-tooltip"
                                                                    title={
                                                                        actualAndCompareWith[
                                                                            "compareWith"
                                                                        ] ||
                                                                        appliedFilterComparisonLabel[
                                                                            "compareWith"
                                                                        ]
                                                                    }
                                                                >
                                                                    {actualAndCompareWith[
                                                                        "compareWith"
                                                                    ] ||
                                                                        appliedFilterComparisonLabel[
                                                                            "compareWith"
                                                                        ]}
                                                                </p>
                                                            )}
                                                            <div className="tooltip-parent">
                                                                <div
                                                                    className="tooltip-data mb-10"
                                                                    key={
                                                                        customTooltipLabel
                                                                            ? customTooltipLabel
                                                                            : label
                                                                    }
                                                                >
                                                                    <small
                                                                        className="data-label"
                                                                        title={capitalizeFirstLetter(
                                                                            customTooltipLabel
                                                                                ? customTooltipLabel?.toLowerCase()
                                                                                : label?.toLowerCase(),
                                                                        )}
                                                                    >
                                                                        {capitalizeFirstLetter(
                                                                            customTooltipLabel
                                                                                ? customTooltipLabel?.toLowerCase()
                                                                                : label?.toLowerCase(),
                                                                        )}
                                                                    </small>
                                                                    <small className="data-label-val">
                                                                        {!formatSummaryMetric
                                                                            ? item.label ===
                                                                              "RATING"
                                                                                ? getDecimaledValue(
                                                                                      compareValue,
                                                                                  )
                                                                                : numberWithCommas(
                                                                                      compareValue,
                                                                                  )
                                                                            : formatSummaryMetric(
                                                                                  compareValue,
                                                                              )}
                                                                        {showCountInTooltip ||
                                                                        compareValue === "-"
                                                                            ? ""
                                                                            : isResponseRateDistribution ||
                                                                                showPercent
                                                                              ? "%"
                                                                              : ""}
                                                                        {item.customText
                                                                            ? ` ${item.customText}`
                                                                            : null}
                                                                        <span className="custom-ratingtext">
                                                                            {showCompareUnitLabel &&
                                                                            selectedDisplayValueAs
                                                                                ? ` ${capitalizeFirstLetter(selectedDisplayValueAs)}`
                                                                                : ""}
                                                                        </span>
                                                                    </small>
                                                                </div>
                                                                {tooltipDatalabel?.length > 0 &&
                                                                    tooltipDatalabel?.map(
                                                                        (
                                                                            tooltip: string,
                                                                            index: number,
                                                                        ) => (
                                                                            <div
                                                                                className="tooltip-data mb-10"
                                                                                key={tooltip}
                                                                            >
                                                                                <small
                                                                                    className="data-label"
                                                                                    title={
                                                                                        tooltipTitle
                                                                                    }
                                                                                >
                                                                                    {tooltip}
                                                                                </small>
                                                                                <small className="data-label-val">
                                                                                    {summaryDataCompare[
                                                                                        tooltipDatakey[
                                                                                            index
                                                                                        ]
                                                                                    ] != undefined
                                                                                        ? summaryDataCompare[
                                                                                              tooltipDatakey[
                                                                                                  index
                                                                                              ]
                                                                                          ]
                                                                                        : "-"}
                                                                                </small>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                            </div>
                                                        </>
                                                    )}
                                                {ifCompareFilterIsApplied ||
                                                isDefaultComparisonFilterApplied ? (
                                                    <>
                                                        {isEmpty(summaryDataCompare) ? null : (
                                                            <hr />
                                                        )}
                                                        <p
                                                            className="kpi-tooltip"
                                                            title={
                                                                actualAndCompareWith["actual"] ||
                                                                appliedFilterComparisonLabel[
                                                                    "actual"
                                                                ]
                                                            }
                                                        >
                                                            {actualAndCompareWith["actual"] ||
                                                                appliedFilterComparisonLabel[
                                                                    "actual"
                                                                ]}
                                                        </p>
                                                    </>
                                                ) : null}
                                                <div className="tooltip-parent">
                                                    <div
                                                        className="tooltip-data mb-10"
                                                        key={
                                                            customTooltipLabel
                                                                ? customTooltipLabel
                                                                : label
                                                        }
                                                    >
                                                        <small
                                                            className="data-label"
                                                            title={tooltipTitle}
                                                        >
                                                            {tooltipTitle}
                                                        </small>
                                                        <small className="data-label-val">
                                                            {currencySymbol ? currencySymbol : null}
                                                            {!formatSummaryMetric
                                                                ? numberWithCommas(
                                                                      showTotal &&
                                                                          totalCountIndividual
                                                                          ? totalCountIndividual
                                                                          : actualValue || 0,
                                                                  )
                                                                : formatSummaryMetric(
                                                                      showTotal &&
                                                                          totalCountIndividual
                                                                          ? totalCountIndividual
                                                                          : actualValue || 0,
                                                                  )}
                                                            {showCountInTooltip ||
                                                            actualValue === "-"
                                                                ? ""
                                                                : isResponseRateDistribution ||
                                                                    showPercent
                                                                  ? "%"
                                                                  : ""}
                                                            {showTotal && totalCountIndividual
                                                                ? ` / ${formatNumberToUnits(actualValue)}`
                                                                : ""}
                                                            {customText && actualValue !== "-"
                                                                ? ` ${customText}`
                                                                : null}
                                                            <span className="custom-ratingtext">
                                                                {showActualUnitLabel &&
                                                                selectedDisplayValueAs
                                                                    ? ` ${capitalizeFirstLetter(selectedDisplayValueAs)}`
                                                                    : ""}
                                                            </span>
                                                            {showDelta && renderDeltaJsxInSummary
                                                                ? renderDeltaJsxInSummary(
                                                                      summaryData,
                                                                  )
                                                                : ""}
                                                        </small>
                                                    </div>
                                                    {tooltipDatalabel?.length > 0 &&
                                                        tooltipDatalabel?.map(
                                                            (tooltip: string, index: number) => (
                                                                <div
                                                                    className="tooltip-data mb-10"
                                                                    key={tooltip}
                                                                >
                                                                    <small
                                                                        className="data-label"
                                                                        title={tooltipTitle}
                                                                    >
                                                                        {tooltip}
                                                                    </small>
                                                                    <small className="data-label-val">
                                                                        {summaryData[
                                                                            tooltipDatakey[index]
                                                                        ] != undefined
                                                                            ? summaryData[
                                                                                  tooltipDatakey[
                                                                                      index
                                                                                  ]
                                                                              ]
                                                                            : "-"}
                                                                    </small>
                                                                </div>
                                                            ),
                                                        )}
                                                </div>
                                            </>
                                        }
                                    >
                                        <div
                                            className={`custom-reviewcontentbox  ${redirectURL ? "cursor-pointer" : ""} ${parserConfig.summaryData.length > 3 ? "summary-medium" : "summary-regular"} ${parserConfig?.customSummaryMetricClassname}`}
                                        >
                                            {summaryJSX[index]}
                                        </div>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    ) : (
                        <div
                            className={`custom-reviewcontentbox ${parserConfig.summaryData.length > 3 ? "summary-medium" : "summary-regular"}`}
                        >
                            {summaryJSX}
                        </div>
                    ))}
            </div>
        );
    };
    const { parserConfig, cardConfig } = reportDetails;
    const highChartKey = getGraphId(reportDetails);
    const reportCardWidth =
        props.gridItemStyle?.width ||
        cardConfig?.width ||
        document.querySelector(".report-card-wrapper")?.clientWidth ||
        0;

    return (
        <>
            {parserConfig.displaySummary ? (
                <div
                    className={`summary-filter-wrapper ${summaryWrapperExtraClass} ${parserConfig?.customHeaderClass || ""}`}
                    id={"summary-" + highChartKey}
                >
                    <div
                        className={`custom-leftbox ${reportCardWidth <= 583 ? (reportCardWidth <= 350 ? "micro-card small-card" : "small-card") : "big-card"}`}
                    >
                        {getSummaryJSX()}
                    </div>
                </div>
            ) : null}
        </>
    );
    // if(props.customGraphSummaryJSX) {
    //     return props.customGraphSummaryJSX(getSummaryJSX, getSummaryPositiveOrNegativeClass);
    // }
    // return(getSummaryJSX());
}
export default GraphSummary;
