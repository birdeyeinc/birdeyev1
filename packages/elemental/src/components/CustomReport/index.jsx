import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import "./CustomReport.model.scss";
import { noop } from "lodash";
import ActionBox from "atoms/ActionBox";
import LoaderBox from "atoms/LoaderBox";

const CustomReport = ({ ai_chart_identifier, router, chart_id, dispatch, dashboardId, reportIdentifier, sectionSequence, reportSequence, beAPIResource, apiEndPoints, addUpdateRemoveSingleReportDataAction }) => {
    const [reportConfig, setReportConfig] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await beAPIResource[apiEndPoints.generateChart.method](apiEndPoints.generateChart.url, {
                message_id: ai_chart_identifier,
                chart_id: [chart_id],
                timeZoneId: window.BE?.business?.timezoneId,
            });
            setReportConfig(response.data[0].chart_configs[0]);
        };
        fetchData();
    }, []);

    return reportConfig ? (
        <div className="customReport">
            {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span className="icon minus-mt-4 display-block" style={{ width: "13px" }}>
                            <img src={aiIcon} alt="AI Icon" style={{ marginLeft: "-3px" }} />
                        </span>
                      
                        <div style={{ fontSize: "16px", fontWeight: 400 }}>
                            Changes in ratings in last 1 year
                        </div>
                    </div>
                  <CopilotButton router={router} /> 
                    <div style={{ border: "1px solid #E5E9F0", padding: "6px 12px", cursor: "pointer", fontSize: "14px", }}>
                        Modify
                    </div> 
                </div> */}

            {window.location.href.includes("/edit") && (
                <div className="customReport__actionBox">
                    {/* Show ActionBox only when URL contains 'edit' */}
                    <div>
                        <ActionBox
                            actionConfig={{
                                categories: [
                                    {
                                        title: "",
                                        options: [
                                            {
                                                label: "Remove",
                                                value: "REMOVE",
                                                noTitle: true,
                                                enable: true,
                                            },
                                        ],
                                    },
                                ],
                            }}
                            actionClickCb={(value) => {
                                // below function will help to remove the report from dashboard
                                console.log("dashboardId", dashboardId);
                                const payload = { dashboardId, draftDashboardId: null, reportIdentifier, sectionSequence, reportSequence };
                                console.log("payload", payload);
                                dispatch(addUpdateRemoveSingleReportDataAction({ reportAction: "REMOVE", reportPayload: payload, finalReportData: reportConfig }, noop));

                                console.log("value", value);
                            }}
                            // noLabel
                            // customSelectionJsx={<i style={{ padding: 0 }} className="icon_phoenix-vertical-dots phoenix-icon" />}
                            // isBlueActionBox
                            popOverSize="medium"
                        />
                    </div>
                </div>
            )}

            <div className={`customReport__chartContainer ${window.location.href.includes("/edit") ? "customReport__chartContainer--edit" : "customReport__chartContainer--normal"}`}>
                <HighchartsReact
                    key={`chart-${ai_chart_identifier}`} // Force re-render on chart change
                    highcharts={Highcharts}
                    options={reportConfig}
                    containerProps={{
                        className: "custom-scroll",
                        style: { width: "100%", height: "100%" },
                    }}
                />
            </div>
            <div className="customReport__infoPanel">
                <div>
                    <span className="icon_phoenix-info-line customReport__infoPanel__icon"></span>
                </div>
                <div className="customReport__infoPanel__text">This is an AI generated report based on prompts. Use the modify option to make changes to the chart.</div>
            </div>
        </div>
    ) : (
        <div className="customReport__loader">
            <LoaderBox />
        </div>
    );
};

export default CustomReport;
