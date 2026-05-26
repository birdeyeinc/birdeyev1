
export const variablePieConfig = {
  reportsGroup: "response-time-distribution",
  tempUniqueId: "average-response-time-distribution_175368695195086",
  subReportsGroup: "response-time-distribution",
  isExternalLegend: true,
  isCustomLegend: true,
  legendValue: ["Synced", "Submitted", "Need updates", "Opted out", "Not connected"],
  legendNameFormatter: (key : any) => {
      if (key === "Synced") {
        return "syncedCount";
      } else if (key === "Submitted") {
        return "submittedCount";
      } else if (key === "Need updates") {
        return "needUpdatesCount";
      } else if (key === "Opted out") {
        return "optoutCount";
      } else if (key === "Not connected") {
        return "notConnectedCount";
      }
    },
  parserConfig: {
    "dataFormat": "grouped",
    "categoryKey": "countByListingStatus",
    "displaySummary": true,
    "graphTitle": "Listing status",
    "categoryValueMap": {
      "syncedCount": {
        "value": "Synced",
        "color": "#49a830"
      },
      "submittedCount": {
        "value": "Submitted",
        "color": "#92cb83"
      },
      "needUpdatesCount": {
        "value": "Need updates",
        "color": "#e13535"
      },
      "optoutCount": {
        "value": "Opted out",
        "color": "#b8b8b8"
      },
      "notConnectedCount": {
        "value": "Not connected",
        "color": "#e5e5e5"
      }
    },
    "isVariablePieSliceVolumeConstant": true,
    "seriesDetails": [
      {
        "primary": true,
        "color": "#ccc",
        "data": [
          {
            "name": "Synced",
            "color": "#49a830"
          },
          {
            "name": "Submitted",
            "color": "#92cb83"
          },
          {
            "name": "Need updates",
            "color": "#e13535"
          },
          {
            "name": "Opted out",
            "color": "#b8b8b8"
          },
          {
            "name": "Not connected",
            "color": "#e5e5e5"
          }
        ],
        "name": "Listing status",
        "tableViewkey": "ratingOrderData",
        "showInLegend": true,
        "dataKey": "countByListingStatus",
        "maxPointWidth": 20,
        "type": "variablepie",
        "yAxisLabel": "",
        "id": "barProjected"
      }
    ],

    "pieSize": "100%",
    "summaryData": [
      {
        "label": "LOCATIONS",
        "dataKey": "locationCount"
      }
    ],
    "defaultChartStyle": "variablepie",
    "primaryChartStyle": "variablepie",
    "legendItemDistance": -10,
    "legendAlignment": "center",
    "isDynamicLabelColorInVariablePieChart": true,
    "categoryList": [
      "syncedCount",
      "submittedCount",
      "needUpdatesCount",
      "optoutCount",
      "notConnectedCount"
    ],
    "reverseLegendOrder": false,
    // Chart Configuration
    "chartType": "variablepie",
    "chartMarginTop": 0,
    "chartAnimation": false,
    "chartWidth": 501.5,
    "chartHeight": 394,

    // Series Configuration
    "seriesDefaultColor": "#ccc",
    "seriesMaxPointWidth": 20,
    "showSeriesInLegend": false,

    // No Data Configuration
    "noDataSliceValue": 100,
    "noDataSliceColor": "#F3F3F3",

    // Label Colors
    "defaultLightLabelColor": "#212121",
    "defaultDarkLabelColor": "#fff",
    "lightColorThreshold": "#e5e5e5",

    // Plot Options
    "minPointSize": 40,
    "innerSize": "20%",
    "zMin": 0,
    "borderRadius": 5,
    "enableAnimation": false,
    "chartSize": "100%",

    // Data Labels
    "enableDataLabels": true,
    "dataLabelDistance": 0,
    "dataLabelInside": true,
    "dataLabelFormat": "{point.y}",
    "dataLabelFontSize": "12px",
    "dataLabelFontWeight": 500,
    "dataLabelFilterValue": 5,

    // Legend Click
    "legendClickDelay": 500,
    "legendClickSelectors": ".legend-text, .highcharts-legend-item text, .highcharts-legend-item",

    // Tooltip Configuration
    "tooltipOutside": true,
    "tooltipEnabled": true,
    "tooltipFollowPointer": true,
    "tooltipHideDelay": 50,

    "tooltipFormatter": function (thisObj: any): string {
      // Custom tooltip formatter for variable pie chart
      return `
        <div style="background: white; border: 1px solid #ccc; border-radius: 4px; padding: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <strong style="color: #333; font-size: 14px;">${thisObj.point.name}</strong><br/>
          <span style="color: #666; font-size: 12px;">dell: <strong>${thisObj.point.y}</strong></span><br/>

        </div>
      `;
    }
  },
  heading: "Listing status",
  filterData: {
    businessIds: [1287366],
    days: "90",
    newFilters: true,
  },
  apiData: {
    dataPoints: [
      {
        "actual": {
          "countByListingStatus": {
            "syncedCount": 0,
            "submittedCount": 2,
            "needUpdatesCount": 15,
            "optoutCount": 13,
            "notConnectedCount": 3
          }
        }
      }
    ],
    summary: {
      "actual": {
        "locationCount": 359,
        "listingCount": 1409
      }
    }
  },
  apiDetails: {
    "url": "api/listing/accuracy/sites/count",
    "method": "post"
  },
  mainHeading: "Listing status",
  graphId: "insights-listings-status"
};

