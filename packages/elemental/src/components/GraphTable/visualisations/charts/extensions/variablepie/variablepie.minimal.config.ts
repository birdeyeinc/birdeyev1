/**
 * Minimal Variable Pie Chart Configuration
 * This configuration includes only the essential settings needed to render a basic variable pie chart
 */
export const variablePieMinimalConfig = {
  reportsGroup: "minimal-variable-pie",
  tempUniqueId: "minimal-variable-pie_12345",
  subReportsGroup: "minimal-variable-pie", 
  parserConfig: {
    // Data configuration
    "dataFormat": "grouped",
    "categoryKey": "chartData",
    
    // Chart basic settings
    "chartType": "variablepie",
    "graphTitle": "Variable Pie Chart",
    
    // Variable pie specific setting - REQUIRED for proper data processing
    "isVariablePieSliceVolumeConstant": true,
    
    // Category list - must match keys in categoryValueMap and data
    "categoryList": [
      "category1",
      "category2", 
      "category3"
    ],
    
    // Category mapping - replace with your actual data
    "categoryValueMap": {
      "category1": {
        "value": "Category 1",
        "color": "#49a830"
      },
      "category2": {
        "value": "Category 2", 
        "color": "#92cb83"
      },
      "category3": {
        "value": "Category 3",
        "color": "#e13535"
      }
    },
    
    // Series configuration
    "seriesDetails": [
      {
        "primary": true,
        "name": "Data Series",
        "color": "#ccc"
      }
    ],
    
    // Chart dimensions
    "chartWidth": 600,
    "chartHeight": 400,
    
    // Default chart style
    "defaultChartStyle": "variablepie",
    "primaryChartStyle": "variablepie"
  },
  
  // Correct data structure matching the expected format
  apiData: {
    dataPoints: [
      {
        "actual": {
          "chartData": {
            "category1": 300,
            "category2": 150,
            "category3": 50
          }
        }
      }
    ]
  }
};

/**
 * Even more minimal configuration with absolute minimum settings
 */
export const variablePieBasicConfig = {
  reportsGroup: "basic-variable-pie",
  parserConfig: {
    "dataFormat": "grouped",
    "categoryKey": "basicData",
    "chartType": "variablepie",
    
    // REQUIRED: Variable pie specific setting for proper data processing
    "isVariablePieSliceVolumeConstant": true,
    
    // Must include categoryList
    "categoryList": [
      "value1",
      "value2", 
      "value3"
    ],
    
    "categoryValueMap": {
      "value1": { "value": "Item 1", "color": "#FF6B6B" },
      "value2": { "value": "Item 2", "color": "#4ECDC4" },
      "value3": { "value": "Item 3", "color": "#45B7D1" }
    },
    
    "seriesDetails": [{
      "primary": true,
      "name": "Basic Series"
    }],
    
    "defaultChartStyle": "variablepie",
    "primaryChartStyle": "variablepie"
  },
  
  // Correct data structure
  apiData: {
    dataPoints: [
      {
        "actual": {
          "basicData": {
            "value1": 200,
            "value2": 100, 
            "value3": 50
          }
        }
      }
    ]
  }
};
