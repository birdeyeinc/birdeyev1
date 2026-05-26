// Temporary utilities for bot response generation
// This can be moved to a more appropriate location later

/**
 * Enhanced bot response generator to return array of blocks
 * @param {string} userMessage - The user's message
 * @param {Object} context - The current context
 * @returns {Array} Array of message blocks
 */
export const generateBotResponse = (userMessage, context) => {
    // Here you would make your actual API call with the context
    // Example API call structure:
    // const response = await apiHelper.sendMessage({
    //   message: userMessage,
    //   context: context
    // });

    console.log('Sending message with context:', { userMessage, context });

    // Return the complete array as a single response
    // This simulates what your LLM would return
    return [
        {
          type: "heading",
          level: 2,
          content: "📌  Report Confirmation",
        },
        {
            type: "text",
            content: `# Executive Summary: Average Rating Decline – June 2025
## Overview
The average customer rating declined marginally in June 2025, dropping from **4.34 to 4.32**. While the overall movement is small, the underlying drivers reveal concentrated operational issues at specific locations, platform-level volatility, and a meaningful rise in negative sentiment across core service themes — warranting focused attention.

---

## Key Drivers

### 1. Severe Rating Drops at a Small Number of Locations
The most significant contributor was sharp month-over-month declines at a handful of locations with multiple reviews:

| Location | Prior Rating | June Rating | Reviews |
|---|---|---|---|
| 4043 – Hobbs, NM | 5.0 | 2.6 | 8 |
| 2352 – Ashtabula, OH | 3.15 | 1.67 | 8 |
| 1310 – Springfield, OH | 3.29 | 1.0 | 6 |
| 4187 – Fremont, OH | 5.0 | 2.6 | 6 |

Recurring themes in reviews at these locations included **communication failures, unprofessional staff behavior, excessive costs, oral health complications, and allegations of fraudulent practices**.

### 2. Platform-Level Pressure from Healthgrades and BBB
Declines were concentrated on lower-volume but highly volatile review platforms:
- **Healthgrades** fell **0.88 points** to **2.83**
- **BBB** fell **0.46 points** to **1.29**
- **Google and Yelp** each declined only **0.02**, indicating the mainstream channels remained largely stable

The disproportionate impact from Healthgrades and BBB amplified the overall average decline beyond what high-volume platforms reflect.

### 3. Rise in Negative Feedback Across Core Service Themes
Negative mention volumes increased most in service and treatment-related categories:

| Theme | Negative Mentions |
|---|---|
| Overall poor service quality | 436 |
| Treatment completion & procedural issues | 319 |
| Oral health complications | 239 |
| Excessive costs | 223 |
| Office environment issues | 42 |

### 4. Broader Sentiment Deterioration
Negative sentiment worsened notably across operational dimensions, with **Communication** representing the largest volume at **1,671 negative mentions**. Advertising (168) and Accessibility (173) also saw elevated negative feedback, with little to no offsetting positive momentum in these areas.

---

## Bottom Line
The June 2025 rating decline, though modest at the aggregate level, is driven by **acute performance issues at a small set of locations** and **disproportionate negative exposure on secondary review platforms**. The volume and nature of complaints — spanning service quality, cost, communication, and ethics — suggest systemic issues at the affected locations rather than isolated incidents. Targeted intervention at the four flagged locations and a focused effort to address communication and cost-related complaints should be prioritized to prevent further rating erosion.`
        },
        // {
        //     type: "text",
        //     content: "## Ordered\n\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit\n3. Integer molestie lorem at massa\n\n1. You can use sequential numbers...\n1. ...or keep all the numbers as `1.`\n\nStart numbering with offset:\n\n57. foo\n58. bar"
        // },
        // {
        //   type: "error",
        //   content:
        //     "An error occurred while processing your request. Please try again later.",
        // },
        // {
        //   type: "divider",
        // },
        // {
        //   type: "fileHandle",
        //   label: "Add an image",
        //   actions: [
        //     {
        //       type: "generate",
        //       source: "ai",
        //       label: "Generate using AI",
        //     },
        //     {
        //       type: "upload",
        //       source: "library",
        //       label: "Upload from library",
        //     },
        //     {
        //       type: "upload",
        //       source: "freeMedia",
        //       label: "Upload from Free media",
        //     },
        //     {
        //       type: "upload",
        //       source: "system",
        //       label: "Upload from system",
        //     },
        //   ],
        // },
        // {
        //   type: "heading",
        //   level: 2,
        //   content: "📌  Report Confirmation",
        // },
        // {
        //   type: "error",
        //   content:
        //     "An error occurred while processing your request. Please try again later.",
        // },
        // {
        //   type: "divider",
        // },
        // {
        //   type: "fileHandle",
        //   label: "Add an image",
        //   actions: [
        //     {
        //       type: "generate",
        //       source: "ai",
        //       label: "Generate using AI",
        //     },
        //     {
        //       type: "upload",
        //       source: "library",
        //       label: "Upload from library",
        //     },
        //     {
        //       type: "upload",
        //       source: "freeMedia",
        //       label: "Upload from Free media",
        //     },
        //     {
        //       type: "upload",
        //       source: "system",
        //       label: "Upload from system",
        //     },
        //   ],
        // },
        // {
        //   type: "fileHandle",
        //   label: "Add an image",
        //   actions: [
        //     {
        //       type: "generate",
        //       source: "ai",
        //       label: "Generate using AI",
        //     },
        //     {
        //       type: "upload",
        //       source: "library",
        //       label: "Upload from library",
        //     },
        //     {
        //       type: "upload",
        //       source: "freeMedia",
        //       label: "Upload from Free media",
        //     },
        //     {
        //       type: "upload",
        //       source: "system",
        //       label: "Upload from system",
        //     },
        //   ],
        // },
        // {
        //   "type": "text",
        //   "content": "Hi! I'm here to make reporting easier. How can I help you today?"
        // },
        // {
        //   "type": "suggestions",
        //   "options": [
        //     {
        //       "label": "Why is there a dip in rating since June?",
        //       "prompt": "generate negative review analysis for June ratings dip"
        //     },
        //     {
        //       "label": "Show review sentiment for Jun to Aug",
        //       "prompt": "generate survey score analysis for June to August period"
        //     },
        //     {
        //       "label": "Do you want to show report from aug to sep?",
        //       "prompt": "generate report for August to September period"
        //     }
        //   ]
        // },
        // {
        //   "type": "select",
        //   "attributes": {
        //     "label": "Select a page",
        //     "submitCTA": "Confirm"
        //   },
        //   "options": [
        //     {
        //       "label": "Home",
        //       "value": "home"
        //     },
        //     {
        //       "label": "Reports",
        //       "value": "reports"
        //     },
        //     {
        //       "label": "Analytics",
        //       "value": "analytics"
        //     }
        //   ]
        // },
        // {
        //   "type": "inputLabel",
        //   "attributes":
        //   {
        //     "inputType": "text",
        //     "submitCTA": "confirm",
        //     "value": "Select field"
        //   },
        //   "prompt": "User input added is"
        // },
        // {
        //   "type": "select",
        //   "attributes": {
        //     "label": "Select a page",
        //     "submitCTA": "Confirm"
        //   },
        //   "options": [
        //     {
        //       "label": "Review on Birdeye - Thank you page(1)",
        //       "meta": {
        //         "id": 56,
        //         "label": "Review on Birdeye Thank You",
        //         "landingPageName": "Review on Birdeye - Thank you page(1)",
        //         "landingPageType": "review-ty",
        //         "thumbnailUrl": "http://d2xt3xymj142xp.cloudfront.net/html-rendered-images/image-a80b0c58-b50a-4b9d-8d3d-210e8640bfc7.jpeg"
        //       },
        //       "value": "56"
        //     },
        //     {
        //       "label": "Aug 8 Afternoon Rating Thank You",
        //       "meta": {
        //         "id": 37,
        //         "label": "Review on Birdeye Thank You",
        //         "landingPageName": "Aug 8 Afternoon Rating Thank You",
        //         "landingPageType": "review-ty",
        //         "thumbnailUrl": "https://d2xt3xymj142xp.cloudfront.net/html-rendered-images/image-2c3c9727-787a-400d-8e44-010889c4b72e.jpeg"
        //       },
        //       "value": "37"
        //     }
        //   ],
        // },
        // {
        //   "type": "applyChanges",
        //   "payload": {
        //     "templateHTML": "<div>Sample HTML content</div>"
        //   }
        // },
        // {
        //   "type": "collapsible",
        //   "title": "📊 Monthly Analytics Details",
        //   "content": [
        //     {
        //       "type": "text",
        //       "content": "Here's _your_ monthly analytics overview for **August** 2025: "
        //     },
        //     {
        //       "type": "text",
        //       "content": ">>and",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "• **Total Reviews:** 1,247 (+15% from last month)\n• **Average Rating:** 4.2/5 ⭐\n• **Response Rate:** 89%"
        //     },
        //     {
        //       "type": "text",
        //       "content": ">>>Last updated: 2 hours ago \n",
        //       "variant": "lightText"
        //     }
        //   ]
        // },
        // {
        //   "type": "card",
        //   "title": "📊 Monthly Report Summary",
        //   "content": [
        //     {
        //       "type": "text",
        //       "content": "Where age is over 45"
        //     },
        //     {
        //       "type": "text",
        //       "content": "and",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "Where total visits is greater than or equal to 1"
        //     },
        //     {
        //       "type": "text",
        //       "content": "and",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Where appointment details is not equal to diabetes screening",
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Or",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Where appointment details is not equal to diabetes screening",
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Or",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Where appointment details is not equal to diabetes screening",
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Or",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Last appointment date is less than **12 months**.",
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Or",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Last visited date is more than **6 months**",
        //     },
        //     {
        //       "type": "text",
        //       "content": "and",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Where appointment details is not equal to diabetes screening",
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Or",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Last appointment date is less than **12 months**.",
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Or",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Last visited date is more than **6 months**",
        //     },
        //     {
        //       "type": "text",
        //       "content": "and",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "Last visited date is more than **6 months**",
        //     },
        //     {
        //       "type": "text",
        //       "content": "and",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "Last appointment date is less than **12 months**.",
        //     },
        //   ],
        //   "highlights": [
        //     "Sentiment analysis shows 78% positive feedback",
        //     "Peak engagement on weekends",
        //     "Mobile users show higher satisfaction rates"
        //   ]
        // },
        // {
        //   type: "actions",
        // },
        // {
        //   "type": "stepper",
        //   "stepperId": "stepper-12345",
        //   "steps": [
        //     {
        //       "id": 1,
        //       "label": "Prompt analysed",
        //       "processed": true
        //     },
        //     {
        //       "id": 2,
        //       "label": "Checking reports...",
        //       "processed": false
        //     },
        //     {
        //       "id": 3,
        //       "label": "Recommended actions...",
        //       "processed": false
        //     }
        //   ]
        // },
        // {
        //   "type": "text",
        //   "content": "Hi! I'm here to make reporting easier. How can I help you today?"
        // },
        // {
        //   "type": "suggestions",
        //   "options": [
        //     {
        //       "label": "Why is there a dip in rating since June?",
        //       "prompt": "generate negative review analysis for June ratings dip"
        //     },
        //     {
        //       "label": "Show review sentiment for Jun to Aug",
        //       "prompt": "generate survey score analysis for June to August period"
        //     },
        //     {
        //       "label": "Do you want to show report from aug to sep?",
        //       "prompt": "generate report for August to September period"
        //     }
        //   ]
        // },
        // {
        //   "type": "select",
        //   "attributes": {
        //     "label": "Select a page",
        //     "submitCTA": "Confirm"
        //   },
        //   "options": [
        //     {
        //       "label": "Home",
        //       "value": "home"
        //     },
        //     {
        //       "label": "Reports",
        //       "value": "reports"
        //     },
        //     {
        //       "label": "Analytics",
        //       "value": "analytics"
        //     }
        //   ]
        // },
        // {
        //   "type": "inputLabel",
        //   "attributes":
        //   {
        //     "inputType": "text",
        //     "submitCTA": "confirm",
        //     "value": "Select field"
        //   },
        //   "prompt": "User input added is"
        // },
        // {
        //   "type": "applyChanges",
        //   "payload": {
        //     "templateHTML": "<div>Sample HTML content</div>"
        //   }
        // },
        // {
        //   "type": "collapsible",
        //   "title": "📊 Monthly Analytics Details",
        //   "content": [
        //     {
        //       "type": "text",
        //       "content": "Here's _your_ monthly analytics overview for **August** 2025: "
        //     },
        //     {
        //       "type": "text",
        //       "content": ">>and",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "• **Total Reviews:** 1,247 (+15% from last month)\n• **Average Rating:** 4.2/5 ⭐\n• **Response Rate:** 89%"
        //     },
        //     {
        //       "type": "text",
        //       "content": ">>>Last updated: 2 hours ago \n",
        //       "variant": "lightText"
        //     }
        //   ]
        // },
        // {
        //   "type": "card",
        //   "title": "📊 Monthly Report Summary",
        //   "content": [
        //     {
        //       "type": "text",
        //       "content": "Where age is over 45"
        //     },
        //     {
        //       "type": "text",
        //       "content": "and",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "Where total visits is greater than or equal to 1"
        //     },
        //     {
        //       "type": "text",
        //       "content": "and",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Where appointment details is not equal to diabetes screening",
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Or",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Where appointment details is not equal to diabetes screening",
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Or",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Where appointment details is not equal to diabetes screening",
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Or",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Last appointment date is less than **12 months**.",
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Or",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Last visited date is more than **6 months**",
        //     },
        //     {
        //       "type": "text",
        //       "content": "and",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Where appointment details is not equal to diabetes screening",
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Or",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Last appointment date is less than **12 months**.",
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Or",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "> Last visited date is more than **6 months**",
        //     },
        //     {
        //       "type": "text",
        //       "content": "and",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "Last visited date is more than **6 months**",
        //     },
        //     {
        //       "type": "text",
        //       "content": "and",
        //       "variant": "lightText"
        //     },
        //     {
        //       "type": "text",
        //       "content": "Last appointment date is less than **12 months**.",
        //     },
        //   ],
        //   "highlights": [
        //     "Sentiment analysis shows 78% positive feedback",
        //     "Peak engagement on weekends",
        //     "Mobile users show higher satisfaction rates"
        //   ]
        // },
        // {
        //   type: "actions",
        // },
        // {
        //   "type": "stepper",
        //   "stepperId": "stepper-12345",
        //   "steps": [
        //     {
        //       "id": 1,
        //       "label": "Prompt analysed",
        //       "processed": true
        //     },
        //     {
        //       "id": 2,
        //       "label": "Checking reports...",
        //       "processed": false
        //     },
        //     {
        //       "id": 3,
        //       "label": "Recommended actions...",
        //       "processed": false
        //     }
        //   ]
        // },
        // {
        //   "type": "text",
        //   "content": "**Analysis Period: Last 12 months** - This review analysis reveals a significant distribution of ratings, with a majority of reviews being 5-star, indicating a generally positive customer sentiment."
        // },
        // {
        //   "type": "text",
        //   "content": "**Key Insights**\n\n• The majority of reviews (139,296) are 5-star, indicating high customer satisfaction.\n• 4-star reviews are the second most common, with 18,227 reviews, suggesting a generally positive experience.\n• 1-star reviews account for 14,202, highlighting areas for potential improvement.\n"
        // },
        // {
        //   "type": "text",
        //   "content": "**Recommendations**\n\n• Focus on maintaining the high standards that lead to 5-star reviews.\n• Investigate the reasons behind 1-star reviews to identify areas for improvement.\n• Encourage customers to leave reviews to increase the volume of feedback.\n"
        // },
        // {
        //   "type": "chart",
        //   "content": [
        //     {
        //       "credits": {
        //         "enabled": false
        //       },
        //       "renderTo": "chart_column",
        //       "chart": {
        //         "type": "funnel",
        //         "scrollablePlotArea": {
        //           "minWidth": 300
        //         }
        //       },
        //       "title": {
        //         "text": "Rating Distribution Funnel Chart"
        //       },
        //       "xAxis": {
        //         "dataColumn": "RATING_CATEGORY",
        //         "title": {
        //           "text": "Rating Category"
        //         },
        //         "categories": [
        //           "5-Star",
        //           "4-Star",
        //           "1-Star",
        //           "3-Star",
        //           "2-Star",
        //           "Unrated"
        //         ]
        //       },
        //       "yAxis": [
        //         {
        //           "min": 0,
        //           "title": {
        //             "text": "Review Count"
        //           },
        //           "labels": {
        //             "style": {
        //               "color": "#7cb5ec"
        //             }
        //           }
        //         }
        //       ],
        //       "series": [
        //         {
        //           "name": "Review Count",
        //           "data": [
        //             139296,
        //             18227,
        //             14202,
        //             6927,
        //             3662,
        //             1437
        //           ],
        //           "dataColumn": "REVIEW_COUNT",
        //           "color": "#7cb5ec",
        //           "yAxis": 0,
        //           "type": "funnel",
        //           "id": "reviewCount",
        //           "maxPointWidth": 20,
        //           "showInLegend": true,
        //           "stack": "stack1",
        //           "fillColor": {
        //             "linearGradient": {
        //               "x1": 0,
        //               "x2": 1,
        //               "y1": 0,
        //               "y2": 1
        //             },
        //             "stops": [
        //               [
        //                 0,
        //                 "rgba(15, 113, 149, 0.1)"
        //               ],
        //               [
        //                 1,
        //                 "rgba(15, 113, 149, 0)"
        //               ]
        //             ]
        //           },
        //           "dataKey": "REVIEW_COUNT"
        //         }
        //       ],
        //       "legend": {
        //         "enabled": true
        //       },
        //       "tooltip": {
        //         "enabled": true,
        //         "shared": true,
        //         "useHTML": true,
        //         "backgroundColor": "rgba(255, 255, 255, 0.95)",
        //         "borderColor": "#cccccc",
        //         "borderRadius": 8,
        //         "shadow": true,
        //         "followPointer": true,
        //         "hideDelay": 200
        //       },
        //       "sql_id": 1,
        //       "chart_id": "chart_message_session_4547c2f9_9a4ab57b_94f844da"
        //     }
        //   ]
        // },
        // {
        //   "type": "chart",
        //   "content": [
        //       {
        //   title: { text: "Monthly Data" },

        //   series: [
        //       { name: "Revenue", data: [100, 120, 130, 140] },
        //       { name: "Profit", data: [40, 45, 49, 52] }
        //   ],

        //   exporting: {
        //       enabled: true,
        //       showTable: true
        //   }
        //   }
        //   ]
        // },
        // {
        //   "type": "table",
        //   "content": [
        //     {
        //       "chartCommonConfig": {
        //         "visualisationType": "Table",
        //         "tableId": "rating_by_review_funnel_chart",
        //         "parserConfig": {
        //           "tableConfig": {
        //             "actual": [
        //               {
        //                 "headerLabel": "Rating Category",
        //                 "dataKey": "actual.rating_category",
        //                 "enableSort": true,
        //                 "columnKey": "rating_category",
        //                 "isDataAvailable": true
        //               },
        //               {
        //                 "headerLabel": "Review Count",
        //                 "dataKey": "actual.review_count",
        //                 "enableSort": true,
        //                 "columnKey": "review_count",
        //                 "isDataAvailable": true
        //               }
        //             ],
        //             "sortProps": {
        //               "isClientSortEnabled": true
        //             }
        //           }
        //         }
        //       },
        //       "apiData": {
        //         "dataPoints": [
        //           {
        //             "actual": {
        //               "label": "5-Star",
        //               "shortLabel": "5-Star",
        //               "rating_category": "5-Star",
        //               "review_count": 139296
        //             }
        //           },
        //           {
        //             "actual": {
        //               "label": "4-Star",
        //               "shortLabel": "4-Star",
        //               "rating_category": "4-Star",
        //               "review_count": 18227
        //             }
        //           },
        //           {
        //             "actual": {
        //               "label": "1-Star",
        //               "shortLabel": "1-Star",
        //               "rating_category": "1-Star",
        //               "review_count": 14202
        //             }
        //           },
        //           {
        //             "actual": {
        //               "label": "3-Star",
        //               "shortLabel": "3-Star",
        //               "rating_category": "3-Star",
        //               "review_count": 6927
        //             }
        //           },
        //           {
        //             "actual": {
        //               "label": "2-Star",
        //               "shortLabel": "2-Star",
        //               "rating_category": "2-Star",
        //               "review_count": 3662
        //             }
        //           },
        //           {
        //             "actual": {
        //               "label": "Unrated",
        //               "shortLabel": "Unrated",
        //               "rating_category": "Unrated",
        //               "review_count": 1437
        //             }
        //           }
        //         ],
        //         "dataPresent": true,
        //         "totalRecords": 6,
        //         "columnCount": 2
        //       }
        //     }
        //   ]
        // },
        //   {
        //       "type": "text",
        //       "content": "**Analysis Period: Last 12 months** - This review analysis reveals a consistent trend in review counts and average ratings over the past year, with notable fluctuations in specific months."
        //   },
        //   {
        //       "type": "text",
        //       "content": "**Key Insights**\n\n• December 2024 had the highest number of total reviews at 24,059, with a strong average rating of 4.46.\n• October 2025 showed a significant drop in total reviews to 895, but the average rating peaked at 4.67.\n• November 2025 had the fewest reviews, only 2, but both were positive, resulting in a perfect average rating of 5.0.\n"
        //   },
        //   {
        //       "type": "text",
        //       "content": "**Recommendations**\n\n• Investigate the factors contributing to the high review count and positive ratings in December 2024 to replicate this success in other months.\n• Address the decline in review counts observed in October and November 2025 to maintain engagement.\n• Continue to encourage positive reviews to sustain high average ratings.\n"
        //   },
        //     {
        //         "type": "chart",
        //         "content": [
        //             {
        //                 "renderTo": "chart_column",
        //                 "scrollablePlotArea": {
        //                     "minWidth": 7200,
        //                     "opacity": 1
        //                 },
        //                 "chart": {
        //                     "type": "column"
        //                 },
        //                 "title": {
        //                     "text": "Monthly Rating Report"
        //                 },
        //                 "xAxis": {
        //                     "dataColumn": "TIME_PERIOD",
        //                     "title": {
        //                         "text": "Time Period"
        //                     },
        //                     "categories": [
        //                         "Dec 2024",
        //                         "Jan 2025",
        //                         "Feb 2025",
        //                         "Mar 2025",
        //                         "Apr 2025",
        //                         "May 2025",
        //                         "Jun 2025",
        //                         "Jul 2025",
        //                         "Aug 2025",
        //                         "Sep 2025",
        //                         "Oct 2025",
        //                         "Nov 2025"
        //                     ]
        //                 },
        //                 "yAxis": [
        //                     {
        //                         "min": 0,
        //                         "title": {
        //                             "text": "Total Reviews"
        //                         },
        //                         "labels": {
        //                             "style": {
        //                                 "color": "#1f77b4"
        //                             }
        //                         }
        //                     },
        //                     {
        //                         "title": {
        //                             "text": "Average Rating"
        //                         },
        //                         "labels": {
        //                             "style": {
        //                                 "color": "#ff7f0e"
        //                             }
        //                         },
        //                         "opposite": true
        //                     }
        //                 ],
        //                 "series": [
        //                     {
        //                         "name": "Total Reviews",
        //                         "data": [
        //                             24018,
        //                             23901,
        //                             20922,
        //                             23540,
        //                             13986,
        //                             13155,
        //                             17850,
        //                             19634,
        //                             19465,
        //                             13900,
        //                             1240,
        //                             200
        //                         ],
        //                         "dataColumn": "TOTAL_REVIEWS",
        //                         "color": "#1f77b4",
        //                         "yAxis": 0,
        //                         "type": "column",
        //                         "id": "totalReviews",
        //                         "maxPointWidth": 20,
        //                         "showInLegend": true
        //                     },
        //                     {
        //                         "name": "Average Rating",
        //                         "data": [
        //                             4.46,
        //                             4.45,
        //                             4.47,
        //                             4.49,
        //                             4.48,
        //                             4.39,
        //                             4.4,
        //                             4.41,
        //                             4.42,
        //                             4.46,
        //                             4.72,
        //                             4.12
        //                         ],
        //                         "dataColumn": "AVERAGE_RATING",
        //                         "color": "#ff7f0e",
        //                         "yAxis": 1,
        //                         "type": "line"
        //                     }
        //                 ],
        //                 "legend": {
        //                     "enabled": true
        //                 },
        //                 "tooltip": {
        //                     "enabled": true,
        //                     "shared": true,
        //                     "useHTML": true,
        //                     "backgroundColor": "rgba(255, 255, 255, 0.95)",
        //                     "borderColor": "#cccccc",
        //                     "borderRadius": 8,
        //                     "shadow": true,
        //                     "followPointer": true,
        //                     "hideDelay": 200
        //                 },
        //                 "chart_id": "chart_message_session_4f6a7649_fd49ee83_894bc742"
        //             },
        //             {
        //                 "renderTo": "chart_column",
        //                 "scrollablePlotArea": {
        //                     "minWidth": 7200,
        //                     "opacity": 1
        //                 },
        //                 "chart": {
        //                     "type": "column"
        //                 },
        //                 "title": {
        //                     "text": "Monthly Review Summary"
        //                 },
        //                 "xAxis": {
        //                     "dataColumn": "TIME_PERIOD",
        //                     "title": {
        //                         "text": "Time Period"
        //                     },
        //                     "categories": [
        //                         "Dec 2024",
        //                         "Jan 2025",
        //                         "Feb 2025",
        //                         "Mar 2025",
        //                         "Apr 2025",
        //                         "May 2025",
        //                         "Jun 2025",
        //                         "Jul 2025",
        //                         "Aug 2025",
        //                         "Sep 2025",
        //                         "Oct 2025",
        //                         "Nov 2025"
        //                     ]
        //                 },
        //                 "yAxis": [
        //                     {
        //                         "min": 0,
        //                         "title": {
        //                             "text": "Primary Metrics (e.g., Review Count)"
        //                         },
        //                         "labels": {
        //                             "style": {
        //                                 "color": "#1f77b4"
        //                             }
        //                         }
        //                     },
        //                     {
        //                         "title": {
        //                             "text": "Secondary Metrics (e.g., Percentages, Ratings)"
        //                         },
        //                         "labels": {
        //                             "style": {
        //                                 "color": "#ff7f0e"
        //                             }
        //                         },
        //                         "opposite": true
        //                     }
        //                 ],
        //                 "series": [
        //                     {
        //                         "name": "Total Reviews",
        //                         "data": [
        //                             12,
        //                             42,
        //                             22,
        //                             19,
        //                             40,
        //                             36,
        //                             14,
        //                             36,
        //                             21,
        //                             20,
        //                             29,
        //                             15
        //                         ],
        //                         "dataColumn": "TOTAL_REVIEWS",
        //                         "color": "#1f77b4",
        //                         "yAxis": 0,
        //                         "type": "column",
        //                         "id": "totalReviews",
        //                         "maxPointWidth": 20,
        //                         "showInLegend": true,
        //                         "stack": "stack1"
        //                     },
        //                     {
        //                         "name": "Responded Reviews",
        //                         "data": [
        //                             7,
        //                             31,
        //                             11,
        //                             9,
        //                             27,
        //                             23,
        //                             8,
        //                             24,
        //                             10,
        //                             14,
        //                             21,
        //                             9
        //                         ],
        //                         "dataColumn": "RESPONDED_REVIEWS",
        //                         "color": "#aec7e8",
        //                         "yAxis": 0,
        //                         "type": "column",
        //                         "id": "respondedReviews",
        //                         "maxPointWidth": 20,
        //                         "showInLegend": true,
        //                         "stack": "stack1"
        //                     },
        //                     {
        //                         "name": "Average Rating",
        //                         "data": [
        //                             3.5,
        //                             3.62,
        //                             3.27,
        //                             3.79,
        //                             3.55,
        //                             3.92,
        //                             3.93,
        //                             3.89,
        //                             4,
        //                             3.5,
        //                             3.97,
        //                             3.8
        //                         ],
        //                         "dataColumn": "AVERAGE_RATING",
        //                         "color": "#ff7f0e",
        //                         "yAxis": 1,
        //                         "type": "line"
        //                     },
        //                     {
        //                         "name": "Response Rate %",
        //                         "data": [
        //                             "58.33",
        //                             "73.81",
        //                             "50.00",
        //                             "47.37",
        //                             "67.50",
        //                             "63.89",
        //                             "57.14",
        //                             "66.67",
        //                             "47.62",
        //                             "70.00",
        //                             "72.41",
        //                             "60.00"
        //                         ],
        //                         "dataColumn": "RESPONSE_RATE_PERCENT",
        //                         "color": "#2ca02c",
        //                         "yAxis": 1,
        //                         "type": "line"
        //                     }
        //                 ],
        //                 "legend": {
        //                     "enabled": true
        //                 },
        //                 "tooltip": {
        //                     "enabled": true,
        //                     "shared": true,
        //                     "useHTML": true,
        //                     "backgroundColor": "rgba(255, 255, 255, 0.95)",
        //                     "borderColor": "#cccccc",
        //                     "borderRadius": 8,
        //                     "shadow": true,
        //                     "followPointer": true,
        //                     "hideDelay": 200
        //                 },
        //                 "chart_id": "chart_message_session_493ccc13_ffc0ce8e_12f2f714"
        //             }
        //         ]
        //     },
        //   {
        //       "type": "table",
        //       "content": [
        //           {
        //               "chartCommonConfig": {
        //                   "visualisationType": "Table",
        //                   "tableId": "monthly_review_summary",
        //                   "parserConfig": {
        //                       "tableConfig": {
        //                           "actual": [
        //                               {
        //                                   "headerLabel": "Time Period",
        //                                   "dataKey": "actual.time_period",
        //                                   "enableSort": true,
        //                                   "columnKey": "time_period",
        //                                   "isDataAvailable": true
        //                               },
        //                               {
        //                                   "headerLabel": "Total Reviews",
        //                                   "dataKey": "actual.total_reviews",
        //                                   "enableSort": true,
        //                                   "columnKey": "total_reviews",
        //                                   "isDataAvailable": true
        //                               },
        //                               {
        //                                   "headerLabel": "Average Rating",
        //                                   "dataKey": "actual.average_rating",
        //                                   "enableSort": true,
        //                                   "columnKey": "average_rating",
        //                                   "isDataAvailable": true
        //                               },
        //                               {
        //                                   "headerLabel": "Responded Reviews",
        //                                   "dataKey": "actual.responded_reviews",
        //                                   "enableSort": true,
        //                                   "columnKey": "responded_reviews",
        //                                   "isDataAvailable": true
        //                               },
        //                               {
        //                                   "headerLabel": "Response Rate Percent",
        //                                   "dataKey": "actual.response_rate_percent",
        //                                   "enableSort": true,
        //                                   "columnKey": "response_rate_percent",
        //                                   "isDataAvailable": true
        //                               }
        //                           ],
        //                           "sortProps": {
        //                               "isClientSortEnabled": true
        //                           }
        //                       }
        //                   }
        //               },
        //               "apiData": {
        //                   "dataPoints": [
        //                       {
        //                           "actual": {
        //                               "label": "Jan 2025",
        //                               "shortLabel": "Jan 2025",
        //                               "time_period": "Jan 2025",
        //                               "total_reviews": 23872,
        //                               "average_rating": 4.45,
        //                               "responded_reviews": 3002,
        //                               "response_rate_percent": 12.58
        //                           }
        //                       },
        //                       {
        //                           "actual": {
        //                               "label": "Feb 2025",
        //                               "shortLabel": "Feb 2025",
        //                               "time_period": "Feb 2025",
        //                               "total_reviews": 20919,
        //                               "average_rating": 4.47,
        //                               "responded_reviews": 2665,
        //                               "response_rate_percent": 12.74
        //                           }
        //                       },
        //                       {
        //                           "actual": {
        //                               "label": "Mar 2025",
        //                               "shortLabel": "Mar 2025",
        //                               "time_period": "Mar 2025",
        //                               "total_reviews": 23527,
        //                               "average_rating": 4.49,
        //                               "responded_reviews": 3296,
        //                               "response_rate_percent": 14.01
        //                           }
        //                       },
        //                       {
        //                           "actual": {
        //                               "label": "Apr 2025",
        //                               "shortLabel": "Apr 2025",
        //                               "time_period": "Apr 2025",
        //                               "total_reviews": 13963,
        //                               "average_rating": 4.48,
        //                               "responded_reviews": 2919,
        //                               "response_rate_percent": 20.91
        //                           }
        //                       },
        //                       {
        //                           "actual": {
        //                               "label": "May 2025",
        //                               "shortLabel": "May 2025",
        //                               "time_period": "May 2025",
        //                               "total_reviews": 13147,
        //                               "average_rating": 4.39,
        //                               "responded_reviews": 2934,
        //                               "response_rate_percent": 22.32
        //                           }
        //                       },
        //                       {
        //                           "actual": {
        //                               "label": "Jun 2025",
        //                               "shortLabel": "Jun 2025",
        //                               "time_period": "Jun 2025",
        //                               "total_reviews": 17821,
        //                               "average_rating": 4.4,
        //                               "responded_reviews": 2937,
        //                               "response_rate_percent": 16.48
        //                           }
        //                       },
        //                       {
        //                           "actual": {
        //                               "label": "Jul 2025",
        //                               "shortLabel": "Jul 2025",
        //                               "time_period": "Jul 2025",
        //                               "total_reviews": 19620,
        //                               "average_rating": 4.41,
        //                               "responded_reviews": 2951,
        //                               "response_rate_percent": 15.04
        //                           }
        //                       },
        //                       {
        //                           "actual": {
        //                               "label": "Aug 2025",
        //                               "shortLabel": "Aug 2025",
        //                               "time_period": "Aug 2025",
        //                               "total_reviews": 19451,
        //                               "average_rating": 4.42,
        //                               "responded_reviews": 3304,
        //                               "response_rate_percent": 16.99
        //                           }
        //                       },
        //                       {
        //                           "actual": {
        //                               "label": "Sep 2025",
        //                               "shortLabel": "Sep 2025",
        //                               "time_period": "Sep 2025",
        //                               "total_reviews": 13898,
        //                               "average_rating": 4.46,
        //                               "responded_reviews": 2251,
        //                               "response_rate_percent": 16.2
        //                           }
        //                       },
        //                       {
        //                           "actual": {
        //                               "label": "Oct 2025",
        //                               "shortLabel": "Oct 2025",
        //                               "time_period": "Oct 2025",
        //                               "total_reviews": 1235,
        //                               "average_rating": 4.73,
        //                               "responded_reviews": 368,
        //                               "response_rate_percent": 29.8
        //                           }
        //                       },
        //                       {
        //                           "actual": {
        //                               "label": "Nov 2025",
        //                               "shortLabel": "Nov 2025",
        //                               "time_period": "Nov 2025",
        //                               "total_reviews": 198,
        //                               "average_rating": 4.06,
        //                               "responded_reviews": 142,
        //                               "response_rate_percent": 71.72
        //                           }
        //                       },
        //                       {
        //                           "actual": {
        //                               "label": "Dec 2025",
        //                               "shortLabel": "Dec 2025",
        //                               "time_period": "Dec 2025",
        //                               "total_reviews": 16,
        //                               "average_rating": 3.56,
        //                               "responded_reviews": 7,
        //                               "response_rate_percent": 43.75
        //                           }
        //                       }
        //                   ],
        //                   "dataPresent": true,
        //                   "totalRecords": 12,
        //                   "columnCount": 5
        //               }
        //           }
        //       ]
        //   }
        // {
        //     "type": "table",
        //     "content": [
        //         {
        //             "chartCommonConfig": {
        //                 "visualisationType": "Table",
        //                 "tableId": "reviews_&_ratings_over_time_report",
        //                 "parserConfig": {
        //                     "tableConfig": {
        //                         "actual": [
        //                             {
        //                                 "headerLabel": "Time Period",
        //                                 "dataKey": "actual.time_period",
        //                                 "enableSort": true,
        //                                 "columnKey": "time_period",
        //                                 "isDataAvailable": true
        //                             },
        //                             {
        //                                 "headerLabel": "Total Reviews",
        //                                 "dataKey": "actual.total_reviews",
        //                                 "enableSort": true,
        //                                 "columnKey": "total_reviews",
        //                                 "isDataAvailable": true
        //                             },
        //                             {
        //                                 "headerLabel": "Average Rating",
        //                                 "dataKey": "actual.average_rating",
        //                                 "enableSort": true,
        //                                 "columnKey": "average_rating",
        //                                 "isDataAvailable": true
        //                             },
        //                             {
        //                                 "headerLabel": "Positive Reviews",
        //                                 "dataKey": "actual.positive_reviews",
        //                                 "enableSort": true,
        //                                 "columnKey": "positive_reviews",
        //                                 "isDataAvailable": true
        //                             },
        //                             {
        //                                 "headerLabel": "Negative Reviews",
        //                                 "dataKey": "actual.negative_reviews",
        //                                 "enableSort": true,
        //                                 "columnKey": "negative_reviews",
        //                                 "isDataAvailable": true
        //                             },
        //                             {
        //                                 "headerLabel": "Neutral Reviews",
        //                                 "dataKey": "actual.neutral_reviews",
        //                                 "enableSort": true,
        //                                 "columnKey": "neutral_reviews",
        //                                 "isDataAvailable": true
        //                             }
        //                         ],
        //                         "sortProps": {
        //                             "isClientSortEnabled": true
        //                         }
        //                     }
        //                 }
        //             },
        //             "apiData": {
        //                 "dataPoints": [
        //                     {
        //                         "actual": {
        //                             "label": "Dec 2024",
        //                             "shortLabel": "Dec 2024",
        //                             "time_period": "Dec 2024",
        //                             "total_reviews": 24059,
        //                             "average_rating": 4.46,
        //                             "positive_reviews": 20832,
        //                             "negative_reviews": 2263,
        //                             "neutral_reviews": 943
        //                         }
        //                     },
        //                     {
        //                         "actual": {
        //                             "label": "Jan 2025",
        //                             "shortLabel": "Jan 2025",
        //                             "time_period": "Jan 2025",
        //                             "total_reviews": 23920,
        //                             "average_rating": 4.45,
        //                             "positive_reviews": 20669,
        //                             "negative_reviews": 2309,
        //                             "neutral_reviews": 919
        //                         }
        //                     },
        //                     {
        //                         "actual": {
        //                             "label": "Feb 2025",
        //                             "shortLabel": "Feb 2025",
        //                             "time_period": "Feb 2025",
        //                             "total_reviews": 20970,
        //                             "average_rating": 4.47,
        //                             "positive_reviews": 18191,
        //                             "negative_reviews": 1917,
        //                             "neutral_reviews": 813
        //                         }
        //                     },
        //                     {
        //                         "actual": {
        //                             "label": "Mar 2025",
        //                             "shortLabel": "Mar 2025",
        //                             "time_period": "Mar 2025",
        //                             "total_reviews": 23636,
        //                             "average_rating": 4.49,
        //                             "positive_reviews": 20663,
        //                             "negative_reviews": 2066,
        //                             "neutral_reviews": 881
        //                         }
        //                     },
        //                     {
        //                         "actual": {
        //                             "label": "Apr 2025",
        //                             "shortLabel": "Apr 2025",
        //                             "time_period": "Apr 2025",
        //                             "total_reviews": 14019,
        //                             "average_rating": 4.48,
        //                             "positive_reviews": 12193,
        //                             "negative_reviews": 1252,
        //                             "neutral_reviews": 552
        //                         }
        //                     },
        //                     {
        //                         "actual": {
        //                             "label": "May 2025",
        //                             "shortLabel": "May 2025",
        //                             "time_period": "May 2025",
        //                             "total_reviews": 13151,
        //                             "average_rating": 4.38,
        //                             "positive_reviews": 11147,
        //                             "negative_reviews": 1455,
        //                             "neutral_reviews": 524
        //                         }
        //                     },
        //                     {
        //                         "actual": {
        //                             "label": "Jun 2025",
        //                             "shortLabel": "Jun 2025",
        //                             "time_period": "Jun 2025",
        //                             "total_reviews": 17806,
        //                             "average_rating": 4.4,
        //                             "positive_reviews": 15116,
        //                             "negative_reviews": 2003,
        //                             "neutral_reviews": 660
        //                         }
        //                     },
        //                     {
        //                         "actual": {
        //                             "label": "Jul 2025",
        //                             "shortLabel": "Jul 2025",
        //                             "time_period": "Jul 2025",
        //                             "total_reviews": 19568,
        //                             "average_rating": 4.41,
        //                             "positive_reviews": 16684,
        //                             "negative_reviews": 2119,
        //                             "neutral_reviews": 741
        //                         }
        //                     },
        //                     {
        //                         "actual": {
        //                             "label": "Aug 2025",
        //                             "shortLabel": "Aug 2025",
        //                             "time_period": "Aug 2025",
        //                             "total_reviews": 19408,
        //                             "average_rating": 4.42,
        //                             "positive_reviews": 16630,
        //                             "negative_reviews": 2055,
        //                             "neutral_reviews": 712
        //                         }
        //                     },
        //                     {
        //                         "actual": {
        //                             "label": "Sep 2025",
        //                             "shortLabel": "Sep 2025",
        //                             "time_period": "Sep 2025",
        //                             "total_reviews": 13830,
        //                             "average_rating": 4.46,
        //                             "positive_reviews": 11974,
        //                             "negative_reviews": 1333,
        //                             "neutral_reviews": 511
        //                         }
        //                     },
        //                     {
        //                         "actual": {
        //                             "label": "Oct 2025",
        //                             "shortLabel": "Oct 2025",
        //                             "time_period": "Oct 2025",
        //                             "total_reviews": 895,
        //                             "average_rating": 4.67,
        //                             "positive_reviews": 834,
        //                             "negative_reviews": 39,
        //                             "neutral_reviews": 21
        //                         }
        //                     },
        //                     {
        //                         "actual": {
        //                             "label": "Nov 2025",
        //                             "shortLabel": "Nov 2025",
        //                             "time_period": "Nov 2025",
        //                             "total_reviews": 2,
        //                             "average_rating": 5,
        //                             "positive_reviews": 2,
        //                             "negative_reviews": 0,
        //                             "neutral_reviews": 0
        //                         }
        //                     }
        //                 ],
        //                 "dataPresent": true,
        //                 "totalRecords": 12,
        //                 "columnCount": 6
        //             }
        //         }
        //     ]
        // },
        // {
        //   type: 'multiSelectDropDown',
        //   placeholder: "Select locations",
        //   label: "Select locations",
        //   options: [
        //     { value: "category1", label: "Category 1 test" },
        //     { value: "category2", label: "Category 2" },
        //     { value: "category3", label: "Category 3" }
        //   ]
        // },
        // {
        //   type: 'multiSelectPaginatedDropDown',
        //   placeHolderText: 'Business Locations',
        //   options: {
        //     list: [
        //       { id: 1, name: "Option 1 2222" },
        //       { id: 2, name: "Option 2" },
        //       { id: 3, name: "Option 3" }
        //     ],
        //     count: 3
        //   }
        // },
        // {
        //   type: "heading",
        //   level: 2,
        //   content: "📌  Report Confirmation",
        // },

        //     {
        //     "content": [
        //         {
        //             "chart": {
        //                 "scrollablePlotArea": {
        //                     "minWidth": 150
        //                 },
        //                 "type": "column"
        //             },
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_a7ef3508",
        //             "credits": {
        //                 "enabled": false
        //             },
        //             "duplicate_check": false,
        //             "legend": {
        //                 "align": "left",
        //                 "enabled": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "plotOptions": {
        //                 "series": {
        //                     "maxPointWidth": 20
        //                 }
        //             },
        //             "series": [
        //                 {
        //                     "color": "#0099FF",
        //                     "data": [
        //                         2,
        //                         0,
        //                         3
        //                     ],
        //                     "dataColumn": "COUNT",
        //                     "name": "Responses",
        //                     "type": "column",
        //                     "yAxis": 0
        //                 }
        //             ],
        //             "sql_id": 1,
        //             "title": {
        //                 "align": "left",
        //                 "style": {
        //                     "color": "#555555",
        //                     "fontSize": "18px",
        //                     "fontWeight": 400
        //                 },
        //                 "text": "How often do you visit Business Name ? [Business Name]"
        //             },
        //             "tooltip": {
        //                 "enabled": true,
        //                 "shared": true
        //             },
        //             "xAxis": {
        //                 "categories": [
        //                     "Weekly",
        //                     "Monthly",
        //                     "Rarely"
        //                 ],
        //                 "dataColumn": "OPTION",
        //                 "labels": {
        //                     "autoRotation": false,
        //                     "rotation": 0
        //                 }
        //             },
        //             "yAxis": [
        //                 {
        //                     "labels": {
        //                         "enabled": false
        //                     }
        //                 }
        //             ]
        //         },
        //         {
        //             "chart": {
        //                 "scrollablePlotArea": {
        //                     "minWidth": 150
        //                 },
        //                 "type": "column"
        //             },
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_c4979df9",
        //             "credits": {
        //                 "enabled": false
        //             },
        //             "duplicate_check": false,
        //             "legend": {
        //                 "align": "left",
        //                 "enabled": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "plotOptions": {
        //                 "series": {
        //                     "maxPointWidth": 20
        //                 }
        //             },
        //             "series": [
        //                 {
        //                     "color": "#2C3E91",
        //                     "data": [
        //                         3,
        //                         1,
        //                         3
        //                     ],
        //                     "dataColumn": "COUNT",
        //                     "name": "Responses",
        //                     "type": "column",
        //                     "yAxis": 0
        //                 }
        //             ],
        //             "sql_id": 1,
        //             "title": {
        //                 "align": "left",
        //                 "style": {
        //                     "color": "#555555",
        //                     "fontSize": "18px",
        //                     "fontWeight": 400
        //                 },
        //                 "text": "What types of stores do you usually shop"
        //             },
        //             "tooltip": {
        //                 "enabled": true,
        //                 "shared": true
        //             },
        //             "xAxis": {
        //                 "categories": [
        //                     "Clothing",
        //                     "Beauty",
        //                     "Home Decor"
        //                 ],
        //                 "dataColumn": "OPTION",
        //                 "labels": {
        //                     "autoRotation": false,
        //                     "rotation": 0
        //                 }
        //             },
        //             "yAxis": [
        //                 {
        //                     "labels": {
        //                         "enabled": false
        //                     }
        //                 }
        //             ]
        //         },
        //         {
        //             "chart": {
        //                 "scrollablePlotArea": {
        //                     "minWidth": 200
        //                 },
        //                 "type": "column"
        //             },
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_d63e96eb",
        //             "credits": {
        //                 "enabled": false
        //             },
        //             "duplicate_check": false,
        //             "legend": {
        //                 "align": "left",
        //                 "enabled": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "plotOptions": {
        //                 "series": {
        //                     "maxPointWidth": 20
        //                 }
        //             },
        //             "series": [
        //                 {
        //                     "color": "#6665DD",
        //                     "data": [
        //                         1,
        //                         0,
        //                         2,
        //                         2
        //                     ],
        //                     "dataColumn": "COUNT",
        //                     "name": "Responses",
        //                     "type": "column",
        //                     "yAxis": 0
        //                 }
        //             ],
        //             "sql_id": 1,
        //             "title": {
        //                 "align": "left",
        //                 "style": {
        //                     "color": "#555555",
        //                     "fontSize": "18px",
        //                     "fontWeight": 400
        //                 },
        //                 "text": "What age group do you belong to?"
        //             },
        //             "tooltip": {
        //                 "enabled": true,
        //                 "shared": true
        //             },
        //             "xAxis": {
        //                 "categories": [
        //                     "Under 18",
        //                     "18-35",
        //                     "35-50",
        //                     "Above 50"
        //                 ],
        //                 "dataColumn": "OPTION",
        //                 "labels": {
        //                     "autoRotation": false,
        //                     "rotation": 0
        //                 }
        //             },
        //             "yAxis": [
        //                 {
        //                     "labels": {
        //                         "enabled": false
        //                     }
        //                 }
        //             ]
        //         },
        //         {
        //             "chart": {
        //                 "scrollablePlotArea": {
        //                     "minWidth": 550
        //                 },
        //                 "type": "column"
        //             },
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_f9c4d054",
        //             "credits": {
        //                 "enabled": false
        //             },
        //             "duplicate_check": false,
        //             "legend": {
        //                 "align": "left",
        //                 "enabled": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "plotOptions": {
        //                 "series": {
        //                     "maxPointWidth": 20
        //                 }
        //             },
        //             "series": [
        //                 {
        //                     "color": "#FBC123",
        //                     "data": [
        //                         0,
        //                         0,
        //                         0,
        //                         0,
        //                         0,
        //                         0,
        //                         1,
        //                         1,
        //                         1,
        //                         2,
        //                         0
        //                     ],
        //                     "dataColumn": "RESPONSE_COUNT",
        //                     "name": "Responses",
        //                     "type": "column",
        //                     "yAxis": 0
        //                 }
        //             ],
        //             "sql_id": 1,
        //             "title": {
        //                 "align": "left",
        //                 "style": {
        //                     "color": "#555555",
        //                     "fontSize": "18px",
        //                     "fontWeight": 400
        //                 },
        //                 "text": "Please rate us based on your experience"
        //             },
        //             "tooltip": {
        //                 "enabled": true,
        //                 "shared": true
        //             },
        //             "xAxis": {
        //                 "categories": [
        //                     "0",
        //                     "1",
        //                     "2",
        //                     "3",
        //                     "4",
        //                     "5",
        //                     "6",
        //                     "7",
        //                     "8",
        //                     "9",
        //                     "10"
        //                 ],
        //                 "dataColumn": "SCALE_POINT",
        //                 "labels": {
        //                     "autoRotation": false,
        //                     "rotation": 0
        //                 }
        //             },
        //             "yAxis": [
        //                 {
        //                     "labels": {
        //                         "enabled": false
        //                     }
        //                 }
        //             ]
        //         },
        //         {
        //             "chart": {
        //                 "scrollablePlotArea": {
        //                     "minWidth": 550
        //                 },
        //                 "type": "column"
        //             },
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_0bc25a29",
        //             "credits": {
        //                 "enabled": false
        //             },
        //             "duplicate_check": false,
        //             "legend": {
        //                 "align": "left",
        //                 "enabled": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "plotOptions": {
        //                 "series": {
        //                     "maxPointWidth": 20
        //                 }
        //             },
        //             "series": [
        //                 {
        //                     "color": "#DB61DB",
        //                     "data": [
        //                         0,
        //                         0,
        //                         0,
        //                         1,
        //                         1,
        //                         0,
        //                         0,
        //                         0,
        //                         3,
        //                         0,
        //                         0
        //                     ],
        //                     "dataColumn": "RESPONSE_COUNT",
        //                     "name": "Responses",
        //                     "type": "column",
        //                     "yAxis": 0
        //                 }
        //             ],
        //             "sql_id": 1,
        //             "title": {
        //                 "align": "left",
        //                 "style": {
        //                     "color": "#555555",
        //                     "fontSize": "18px",
        //                     "fontWeight": 400
        //                 },
        //                 "text": "How likely are you to recommend us to your family and friends?"
        //             },
        //             "tooltip": {
        //                 "enabled": true,
        //                 "shared": true
        //             },
        //             "xAxis": {
        //                 "categories": [
        //                     "0",
        //                     "1",
        //                     "2",
        //                     "3",
        //                     "4",
        //                     "5",
        //                     "6",
        //                     "7",
        //                     "8",
        //                     "9",
        //                     "10"
        //                 ],
        //                 "dataColumn": "SCALE_POINT",
        //                 "labels": {
        //                     "autoRotation": false,
        //                     "rotation": 0
        //                 }
        //             },
        //             "yAxis": [
        //                 {
        //                     "labels": {
        //                         "enabled": false
        //                     }
        //                 }
        //             ]
        //         },
        //         {
        //             "chart": {
        //                 "scrollablePlotArea": {
        //                     "minHeight": 250
        //                 },
        //                 "type": "bar"
        //             },
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_41987f41",
        //             "credits": {
        //                 "enabled": false
        //             },
        //             "duplicate_check": false,
        //             "legend": {
        //                 "align": "left",
        //                 "enabled": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "plotOptions": {
        //                 "bar": {
        //                     "stacking": "percentage"
        //                 },
        //                 "series": {
        //                     "maxPointWidth": 20
        //                 }
        //             },
        //             "series": [
        //                 {
        //                     "color": "#DE1B0C",
        //                     "data": [
        //                         1,
        //                         1,
        //                         2,
        //                         1,
        //                         1
        //                     ],
        //                     "dataColumn": "Extremely unsatisfactory count",
        //                     "name": "Extremely Unsatisfactory",
        //                     "type": "bar",
        //                     "yAxis": 0
        //                 },
        //                 {
        //                     "color": "#FBC123",
        //                     "data": [
        //                         0,
        //                         2,
        //                         0,
        //                         0,
        //                         0
        //                     ],
        //                     "dataColumn": "Unsatisfactory count",
        //                     "name": "Unsatisfactory",
        //                     "type": "bar",
        //                     "yAxis": 0
        //                 },
        //                 {
        //                     "color": "#6665DD",
        //                     "data": [
        //                         0,
        //                         1,
        //                         1,
        //                         2,
        //                         1
        //                     ],
        //                     "dataColumn": "Neutral count",
        //                     "name": "Neutral",
        //                     "type": "bar",
        //                     "yAxis": 0
        //                 },
        //                 {
        //                     "color": "#4CAE3D",
        //                     "data": [
        //                         2,
        //                         0,
        //                         2,
        //                         2,
        //                         2
        //                     ],
        //                     "dataColumn": "Satisfactory count",
        //                     "name": "Satisfactory",
        //                     "type": "bar",
        //                     "yAxis": 0
        //                 },
        //                 {
        //                     "color": "#2C3E91",
        //                     "data": [
        //                         2,
        //                         1,
        //                         0,
        //                         0,
        //                         1
        //                     ],
        //                     "dataColumn": "Extremely satisfactory count",
        //                     "name": "Extremely Satisfactory",
        //                     "type": "bar",
        //                     "yAxis": 0
        //                 }
        //             ],
        //             "sql_id": 1,
        //             "title": {
        //                 "align": "left",
        //                 "style": {
        //                     "color": "#555555",
        //                     "fontSize": "18px",
        //                     "fontWeight": 400
        //                 },
        //                 "text": "Please rate our services"
        //             },
        //             "tooltip": {
        //                 "enabled": true,
        //                 "shared": true
        //             },
        //             "xAxis": {
        //                 "categories": [
        //                     "Cleaning",
        //                     "Gym",
        //                     "Parking",
        //                     "Pool",
        //                     "Rooms"
        //                 ],
        //                 "dataColumn": "CATEGORY",
        //                 "labels": {
        //                     "autoRotation": false,
        //                     "rotation": 0
        //                 }
        //             },
        //             "yAxis": [
        //                 {
        //                     "labels": {
        //                         "enabled": false
        //                     }
        //                 }
        //             ]
        //         },
        //         {
        //             "chart": {
        //                 "scrollablePlotArea": {
        //                     "minHeight": 200
        //                 },
        //                 "type": "bar"
        //             },
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_9006a23b",
        //             "credits": {
        //                 "enabled": false
        //             },
        //             "duplicate_check": false,
        //             "legend": {
        //                 "align": "left",
        //                 "enabled": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "plotOptions": {
        //                 "bar": {
        //                     "stacking": "percentage"
        //                 },
        //                 "series": {
        //                     "maxPointWidth": 20
        //                 }
        //             },
        //             "series": [
        //                 {
        //                     "color": "#DE1B0C",
        //                     "data": [
        //                         1,
        //                         1,
        //                         1,
        //                         1
        //                     ],
        //                     "dataColumn": "Extremely unsatisfactory count",
        //                     "name": "Extremely Unsatisfactory",
        //                     "type": "bar",
        //                     "yAxis": 0
        //                 },
        //                 {
        //                     "color": "#FBC123",
        //                     "data": [
        //                         2,
        //                         1,
        //                         1,
        //                         0
        //                     ],
        //                     "dataColumn": "Unsatisfactory count",
        //                     "name": "Unsatisfactory",
        //                     "type": "bar",
        //                     "yAxis": 0
        //                 },
        //                 {
        //                     "color": "#6665DD",
        //                     "data": [
        //                         1,
        //                         0,
        //                         3,
        //                         2
        //                     ],
        //                     "dataColumn": "Neutral count",
        //                     "name": "Neutral",
        //                     "type": "bar",
        //                     "yAxis": 0
        //                 },
        //                 {
        //                     "color": "#4CAE3D",
        //                     "data": [
        //                         1,
        //                         3,
        //                         0,
        //                         2
        //                     ],
        //                     "dataColumn": "Satisfactory count",
        //                     "name": "Satisfactory",
        //                     "type": "bar",
        //                     "yAxis": 0
        //                 }
        //             ],
        //             "sql_id": 1,
        //             "title": {
        //                 "align": "left",
        //                 "style": {
        //                     "color": "#555555",
        //                     "fontSize": "18px",
        //                     "fontWeight": 400
        //                 },
        //                 "text": "Which of these food you liked"
        //             },
        //             "tooltip": {
        //                 "enabled": true,
        //                 "shared": true
        //             },
        //             "xAxis": {
        //                 "categories": [
        //                     "Breakfast",
        //                     "Dinner",
        //                     "Lunch",
        //                     "Snacks"
        //                 ],
        //                 "dataColumn": "CATEGORY",
        //                 "labels": {
        //                     "autoRotation": false,
        //                     "rotation": 0
        //                 }
        //             },
        //             "yAxis": [
        //                 {
        //                     "labels": {
        //                         "enabled": false
        //                     }
        //                 }
        //             ]
        //         },
        //         {
        //             "chart": {
        //                 "scrollablePlotArea": {
        //                     "minWidth": 550
        //                 },
        //                 "type": "column"
        //             },
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_3ca59e98",
        //             "credits": {
        //                 "enabled": false
        //             },
        //             "duplicate_check": false,
        //             "legend": {
        //                 "align": "left",
        //                 "enabled": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "plotOptions": {
        //                 "series": {
        //                     "maxPointWidth": 20
        //                 }
        //             },
        //             "series": [
        //                 {
        //                     "color": "#FBC123",
        //                     "data": [
        //                         0,
        //                         1,
        //                         0,
        //                         0,
        //                         2,
        //                         2,
        //                         0,
        //                         0,
        //                         0,
        //                         0,
        //                         0
        //                     ],
        //                     "dataColumn": "RESPONSE_COUNT",
        //                     "name": "Responses",
        //                     "type": "column",
        //                     "yAxis": 0
        //                 }
        //             ],
        //             "sql_id": 1,
        //             "title": {
        //                 "align": "left",
        //                 "style": {
        //                     "color": "#555555",
        //                     "fontSize": "18px",
        //                     "fontWeight": 400
        //                 },
        //                 "text": "Please rate us based on your experience"
        //             },
        //             "tooltip": {
        //                 "enabled": true,
        //                 "shared": true
        //             },
        //             "xAxis": {
        //                 "categories": [
        //                     "0",
        //                     "1",
        //                     "2",
        //                     "3",
        //                     "4",
        //                     "5",
        //                     "6",
        //                     "7",
        //                     "8",
        //                     "9",
        //                     "10"
        //                 ],
        //                 "dataColumn": "SCALE_POINT",
        //                 "labels": {
        //                     "autoRotation": false,
        //                     "rotation": 0
        //                 }
        //             },
        //             "yAxis": [
        //                 {
        //                     "labels": {
        //                         "enabled": false
        //                     }
        //                 }
        //             ]
        //         },
        //         {
        //             "chart": {
        //                 "scrollablePlotArea": {
        //                     "minHeight": 100
        //                 },
        //                 "type": "bar"
        //             },
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_b508004c",
        //             "credits": {
        //                 "enabled": false
        //             },
        //             "duplicate_check": false,
        //             "legend": {
        //                 "align": "left",
        //                 "enabled": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "plotOptions": {
        //                 "series": {
        //                     "maxPointWidth": 20
        //                 }
        //             },
        //             "series": [
        //                 {
        //                     "color": "#0099FF",
        //                     "data": [
        //                         2,
        //                         2
        //                     ],
        //                     "dataColumn": "COUNT",
        //                     "name": "Responses",
        //                     "type": "bar",
        //                     "yAxis": 0
        //                 }
        //             ],
        //             "sql_id": 1,
        //             "title": {
        //                 "align": "left",
        //                 "style": {
        //                     "color": "#555555",
        //                     "fontSize": "18px",
        //                     "fontWeight": 400
        //                 },
        //                 "text": "We would appreciate if you can review us on these sites."
        //             },
        //             "tooltip": {
        //                 "enabled": true,
        //                 "shared": true
        //             },
        //             "xAxis": {
        //                 "categories": [
        //                     "Birdeye",
        //                     "Google"
        //                 ],
        //                 "dataColumn": "ANSWER",
        //                 "labels": {
        //                     "autoRotation": false,
        //                     "rotation": 0
        //                 }
        //             },
        //             "yAxis": [
        //                 {
        //                     "labels": {
        //                         "enabled": false
        //                     }
        //                 }
        //             ]
        //         },
        //         {
        //             "chart": {
        //                 "scrollablePlotArea": {
        //                     "minWidth": 150
        //                 },
        //                 "type": "column"
        //             },
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_d531dc54",
        //             "credits": {
        //                 "enabled": false
        //             },
        //             "duplicate_check": false,
        //             "legend": {
        //                 "align": "left",
        //                 "enabled": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "plotOptions": {
        //                 "series": {
        //                     "maxPointWidth": 20
        //                 }
        //             },
        //             "series": [
        //                 {
        //                     "color": "#DE1B0C",
        //                     "data": [
        //                         1,
        //                         1,
        //                         1
        //                     ],
        //                     "dataColumn": "rating 1",
        //                     "name": "Rating 1",
        //                     "type": "column",
        //                     "yAxis": 0
        //                 },
        //                 {
        //                     "color": "#FBC123",
        //                     "data": [
        //                         0,
        //                         0,
        //                         0
        //                     ],
        //                     "dataColumn": "rating 2",
        //                     "name": "Rating 2",
        //                     "type": "column",
        //                     "yAxis": 0
        //                 },
        //                 {
        //                     "color": "#6665DD",
        //                     "data": [
        //                         1,
        //                         0,
        //                         0
        //                     ],
        //                     "dataColumn": "rating 3",
        //                     "name": "Rating 3",
        //                     "type": "column",
        //                     "yAxis": 0
        //                 },
        //                 {
        //                     "color": "#4CAE3D",
        //                     "data": [
        //                         1,
        //                         2,
        //                         1
        //                     ],
        //                     "dataColumn": "rating 4",
        //                     "name": "Rating 4",
        //                     "type": "column",
        //                     "yAxis": 0
        //                 },
        //                 {
        //                     "color": "#2C3E91",
        //                     "data": [
        //                         0,
        //                         0,
        //                         1
        //                     ],
        //                     "dataColumn": "rating 5",
        //                     "name": "Rating 5",
        //                     "type": "column",
        //                     "yAxis": 0
        //                 }
        //             ],
        //             "sql_id": 1,
        //             "title": {
        //                 "align": "left",
        //                 "style": {
        //                     "color": "#555555",
        //                     "fontSize": "18px",
        //                     "fontWeight": 400
        //                 },
        //                 "text": "Please select the correct rating"
        //             },
        //             "tooltip": {
        //                 "enabled": true,
        //                 "shared": true
        //             },
        //             "xAxis": {
        //                 "categories": [
        //                     "Amenities",
        //                     "Location",
        //                     "Staff"
        //                 ],
        //                 "dataColumn": "CATEGORY",
        //                 "labels": {
        //                     "autoRotation": false,
        //                     "rotation": 0
        //                 }
        //             },
        //             "yAxis": [
        //                 {
        //                     "labels": {
        //                         "enabled": false
        //                     }
        //                 }
        //             ]
        //         },
        //         {
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_2971de19",
        //             "dataGridOptions": {
        //                 "data": {
        //                     "columns": [
        //                         {
        //                             "name": "ANSWER"
        //                         },
        //                         {
        //                             "name": "RESPONSE_DATE"
        //                         }
        //                     ],
        //                     "rows": [
        //                         [
        //                             "NOPE",
        //                             "2025-10-28"
        //                         ],
        //                         [
        //                             "sdsdss",
        //                             "2025-10-29"
        //                         ],
        //                         [
        //                             "test",
        //                             "2025-10-31"
        //                         ],
        //                         [
        //                             "shubham survey teest",
        //                             "2025-12-09"
        //                         ],
        //                         [
        //                             "this is sample concern",
        //                             "2025-10-28"
        //                         ]
        //                     ]
        //                 },
        //                 "editable": false,
        //                 "exporting": true,
        //                 "sortable": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "sql_id": 1,
        //             "subtitle": {
        //                 "text": "Total Records: 5"
        //             },
        //             "title": {
        //                 "text": "Any concern you want to highlight"
        //             },
        //             "type": "Table"
        //         },
        //         {
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_13e618a9",
        //             "dataGridOptions": {
        //                 "data": {
        //                     "columns": [
        //                         {
        //                             "name": "ANSWER"
        //                         },
        //                         {
        //                             "name": "RESPONSE_DATE"
        //                         }
        //                     ],
        //                     "rows": [
        //                         [
        //                             "I will tell later",
        //                             "2025-10-28"
        //                         ],
        //                         [
        //                             "great",
        //                             "2025-10-29"
        //                         ],
        //                         [
        //                             "test",
        //                             "2025-10-31"
        //                         ],
        //                         [
        //                             "shubham survey teest",
        //                             "2025-12-09"
        //                         ],
        //                         [
        //                             "The food was fantastic and well priced but our waiter took forever and seemed like he was in a bad mood. Usually when we come in we get a different person, but I guess they quit recently due to frustrations with management. Hire him back!\t",
        //                             "2025-10-28"
        //                         ]
        //                     ]
        //                 },
        //                 "editable": false,
        //                 "exporting": true,
        //                 "sortable": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "sql_id": 1,
        //             "subtitle": {
        //                 "text": "Total Records: 5"
        //             },
        //             "title": {
        //                 "text": "Tell us you recent experience at our store in City&nbsp;"
        //             },
        //             "type": "Table"
        //         },
        //         {
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_994f4a92",
        //             "dataGridOptions": {
        //                 "data": {
        //                     "columns": [
        //                         {
        //                             "name": "ANSWER"
        //                         },
        //                         {
        //                             "name": "RESPONSE_DATE"
        //                         }
        //                     ],
        //                     "rows": [
        //                         [
        //                             "NA",
        //                             "2025-10-28"
        //                         ],
        //                         [
        //                             "feedback",
        //                             "2025-10-29"
        //                         ],
        //                         [
        //                             "Test",
        //                             "2025-10-31"
        //                         ],
        //                         [
        //                             "shubham survey teest",
        //                             "2025-12-09"
        //                         ],
        //                         [
        //                             "NA",
        //                             "2025-10-28"
        //                         ]
        //                     ]
        //                 },
        //                 "editable": false,
        //                 "exporting": true,
        //                 "sortable": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "sql_id": 1,
        //             "subtitle": {
        //                 "text": "Total Records: 5"
        //             },
        //             "title": {
        //                 "text": "Question text"
        //             },
        //             "type": "Table"
        //         },
        //         {
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_5f350230",
        //             "dataGridOptions": {
        //                 "data": {
        //                     "columns": [
        //                         {
        //                             "name": "RESPONSE_ID"
        //                         },
        //                         {
        //                             "name": "RESPONSE_DATE"
        //                         },
        //                         {
        //                             "name": "CUSTOMER_ID"
        //                         },
        //                         {
        //                             "name": "First name"
        //                         },
        //                         {
        //                             "name": "Last name"
        //                         },
        //                         {
        //                             "name": "Email"
        //                         },
        //                         {
        //                             "name": "Phone"
        //                         }
        //                     ],
        //                     "rows": [
        //                         [
        //                             24453498,
        //                             "2025-10-28",
        //                             499474807,
        //                             "Sandeep",
        //                             "Gupta",
        //                             "Sandeep.gupta@birdeye.com",
        //                             "9803280192"
        //                         ],
        //                         [
        //                             24470160,
        //                             "2025-10-29",
        //                             499842952,
        //                             "Sandeep",
        //                             "Gupta",
        //                             "s@s.com",
        //                             "9803280191"
        //                         ],
        //                         [
        //                             24507489,
        //                             "2025-10-31",
        //                             500610833,
        //                             "Test",
        //                             "Test",
        //                             "test@gamil.com",
        //                             "+18143133377"
        //                         ],
        //                         [
        //                             25128821,
        //                             "2025-12-09",
        //                             512514367,
        //                             "shubham survey teest",
        //                             "shubham survey teest",
        //                             "shubham@birdeye.com",
        //                             "+1 3515853096"
        //                         ]
        //                     ]
        //                 },
        //                 "editable": false,
        //                 "exporting": true,
        //                 "sortable": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "sql_id": 1,
        //             "subtitle": {
        //                 "text": "Total Records: 4"
        //             },
        //             "title": {
        //                 "text": "Please enter your contact information"
        //             },
        //             "type": "Table"
        //         },
        //         {
        //             "chart_id": "chart_message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690_38e9f829",
        //             "dataGridOptions": {
        //                 "data": {
        //                     "columns": [
        //                         {
        //                             "name": "ANSWER"
        //                         },
        //                         {
        //                             "name": "RESPONSE_DATE"
        //                         },
        //                         {
        //                             "name": "CUSTOMER_FIRST_NAME"
        //                         },
        //                         {
        //                             "name": "CUSTOMER_LAST_NAME"
        //                         }
        //                     ],
        //                     "rows": [
        //                         [
        //                             "10-01-2025, 10:00 AM",
        //                             "2025-10-28",
        //                             "Sandeep",
        //                             "Gupta"
        //                         ],
        //                         [
        //                             "10-01-2025, 10:00 AM",
        //                             "2025-10-29",
        //                             "Sandeep",
        //                             "Gupta"
        //                         ],
        //                         [
        //                             "10-31-2025, 10:00 AM",
        //                             "2025-10-31",
        //                             "Test",
        //                             "Test"
        //                         ],
        //                         [
        //                             "12-09-2025, 10:00 AM",
        //                             "2025-12-09",
        //                             "shubham survey teest",
        //                             "shubham survey teest"
        //                         ]
        //                     ]
        //                 },
        //                 "editable": false,
        //                 "exporting": true,
        //                 "sortable": true
        //             },
        //             "message_id": "message_reviews-d0b6944a-f489-49dd-9e93-3e56dfb2e132-1767786335705_a9551690",
        //             "sql_id": 1,
        //             "subtitle": {
        //                 "text": "Total Records: 4"
        //             },
        //             "title": {
        //                 "text": "Travel date time"
        //             },
        //             "type": "Table"
        //         }
        //     ],
        //     "type": "chart",
        //     "componentId": "1767786407583.6575-block-1"
        // }
        // {
        //     "type": "text",
        //     "content": "Found 50 locations out of ....",
        // },
        // {
        //     "options": {
        //         "count": 10,
        //         "list": [
        //             {
        //                 "address": "4835 Venice Blvd.",
        //                 "alias": "Los Angeles, CA",
        //                 "city": "Los Angeles",
        //                 "id": 1386985,
        //                 "name": "Hollywood Olive Garden (Los Angeles, CA) - 4835 Venice Blvd., Los Angeles"
        //             },
        //             {
        //                 "address": "39145 Farwell Dr",
        //                 "alias": "Fremont, CA",
        //                 "city": "Fremont",
        //                 "id": 1387113,
        //                 "name": "East Bay Olive Garden (Fremont, CA) - 39145 Farwell Dr, Fremont"
        //             },
        //             {
        //                 "address": "940 Blossom Hill Road",
        //                 "alias": "San Jose, CA",
        //                 "city": "San Jose",
        //                 "id": 1387119,
        //                 "name": "Silicon Valley Olive Garden (San Jose, CA) - 940 Blossom Hill Road, San Jose"
        //             },
        //             {
        //                 "address": "2671 W March Ln",
        //                 "alias": "Stockton, CA",
        //                 "city": "Stockton",
        //                 "id": 1387493,
        //                 "name": "Central Valley Olive Garden (Stockton, CA) - 2671 W March Ln, Stockton"
        //             },
        //             {
        //                 "address": "721 W Olive Ave",
        //                 "alias": "Merced, CA",
        //                 "city": "Merced",
        //                 "id": 1387494,
        //                 "name": "Yosemite Olive Garden (Merced, CA) - 721 W Olive Ave, Merced"
        //             },
        //             {
        //                 "address": "1780 Challenge Way",
        //                 "alias": "Sacramento, CA",
        //                 "city": "Sacramento",
        //                 "id": 1387495,
        //                 "name": "Gold Rush Olive Garden (Sacramento, CA) - 1780 Challenge Way, Sacramento"
        //             },
        //             {
        //                 "address": "1176 Admiral Callaghan Ln",
        //                 "alias": "Vallejo, CA",
        //                 "city": "Vallejo",
        //                 "id": 1387496,
        //                 "name": "Six Flags Olive Garden (Vallejo, CA) - 1176 Admiral Callaghan Ln, Vallejo"
        //             },
        //             {
        //                 "address": "2330 N Tustin St",
        //                 "alias": "Orange, CA",
        //                 "city": "Orange",
        //                 "id": 1387498,
        //                 "name": "Disney Land Olive Garden (Orange, CA) - 2330 N Tustin St, Orange"
        //             },
        //             {
        //                 "address": "1701 New Stine Rd",
        //                 "alias": "Bakersfield, CA",
        //                 "city": "Bakersfield",
        //                 "id": 1387839,
        //                 "name": "Nashville West Olive Garden (Bakersfield, CA) - 1701 New Stine Rd, Bakersfield"
        //             },
        //             {
        //                 "address": "11555 Carmel Mountain Rd",
        //                 "alias": "San Diego, CA",
        //                 "city": "San Diego",
        //                 "id": 1387840,
        //                 "name": "Lego Land Olive Garden (San Diego, CA) - 11555 Carmel Mountain Rd, San Diego"
        //             }
        //         ]
        //     },
        //     "placeHolderText": "Business Locations",
        //     "type": "multiSelectPaginatedDropDown"
        // },
        {
            "content": [
          {
    "type": "Table",
    "title": {
        "text": "Monthly Review Trends (Table Data)"
    },
    "sql_id": 1,
    "chart_id": "chart_message_dashboard-d9c292d7-c885-49bf-b58b-47e8fafbbad1-1773735908158_88cdb7eb_b57de741",
    "end_date": "2026-03-17",
    "subtitle": {
        "text": "Total Records: 12"
    },
    "message_id": "message_dashboard-d9c292d7-c885-49bf-b58b-47e8fafbbad1-1773735908158_30e04ad7",
    "start_date": "2025-03-17",
    "is_modified": true,
    "suggestions": [
        {
            "label": "Add to dashboard",
            "prompt": "add this chart to dashboard",
            "event_type": "window",
            "event_target": "ADD_TO_DASHBOARD"
        },
        {
            "label": "Change to Horizontal Bar chart",
            "prompt": "convert this chart to horizontal bar chart",
            "event_type": "",
            "event_target": ""
        }
    ],
    "dataGridOptions": {
        "data": {
            "columns": [
                {
                    "name": "PERIOD START DATE"
                },
                {
                    "name": "PERIOD END DATE"
                },
                {
                    "name": "TIME PERIOD"
                },
                {
                    "name": "TOTAL REVIEWS"
                },
                {
                    "name": "AVERAGE RATING"
                }
            ],
            "rows": [
                [
                    "2025-04-01",
                    "2025-04-30",
                    "Apr 2025",
                    14278,
                    4.48
                ],
                [
                    "2025-05-01",
                    "2025-05-31",
                    "May",
                    13627,
                    4.4
                ],
                [
                    "2025-06-01",
                    "2025-06-30",
                    "Jun",
                    18987,
                    4.41
                ],
                [
                    "2025-07-01",
                    "2025-07-31",
                    "Jul",
                    20719,
                    4.41
                ],
                [
                    "2025-08-01",
                    "2025-08-31",
                    "Aug",
                    20415,
                    4.42
                ],
                [
                    "2025-09-01",
                    "2025-09-30",
                    "Sep",
                    19405,
                    4.45
                ],
                [
                    "2025-10-01",
                    "2025-10-31",
                    "Oct",
                    18538,
                    4.45
                ],
                [
                    "2025-11-01",
                    "2025-11-30",
                    "Nov",
                    16006,
                    4.41
                ],
                [
                    "2025-12-01",
                    "2025-12-31",
                    "Dec",
                    17749,
                    4.32
                ],
                [
                    "2026-01-01",
                    "2026-01-31",
                    "Jan 2026",
                    19003,
                    4.35
                ],
                [
                    "2026-02-01",
                    "2026-02-28",
                    "Feb",
                    31896,
                    4.69
                ],
                [
                    "2026-03-01",
                    "2026-03-31",
                    "Mar",
                    4301,
                    4.45
                ]
            ]
        },
        "editable": false,
        "exporting": true,
        "sortable": true
    },
    "dashboard_chart_id": "77349ef28c471906"
}
            ],
            "type": "chart"
        },
           {
            "type": "multiSelectDropDown",
            "attributes": {
                "label": "Select metrics for your report",
                "submitCTA": "Continue",
                "placeholder": "Choose one or more metrics"
            },
            "options": [
                {
                    "label": "Total Reviews",
                    "value": "1",
                },
                {
                    "label": "Average Rating",
                    "value": "2",
                },
                {
                    "label": "Response Rate",
                    "value": "3",
                },
                {
                    "label": "Sentiment Analysis",
                    "value": "4",
                },
                {
                    "label": "Review Volume Trends",
                    "value": "5",
                }
            ],
            "selectedOptions": ["1", "2", "3"],
            "prompt": "Generate report with selected metrics:"
        },

        {
            "type": "text",
            "content": "Found 10 locations for your query."
        },
        {
            "type": "multiSelectDropDown",
            "content": null,
            "attributes": {
                "label": "Select business locations",
                "submitCTA": "Continue",
                "placeholder": "Choose one or more locations"
            },
            "options": [
                {
                    "label": "Los Angeles, CA (4835 Venice Blvd., Los Angeles)",
                    "value": "1386985"
                },
                {
                    "label": "Fremont, CA (39145 Farwell Dr, Fremont)",
                    "value": "1387113"
                },
                {
                    "label": "San Jose, CA (940 Blossom Hill Road, San Jose)",
                    "value": "1387119"
                },
                {
                    "label": "Stockton, CA (2671 W March Ln, Stockton)",
                    "value": "1387493"
                },
                {
                    "label": "Merced, CA (721 W Olive Ave, Merced)",
                    "value": "1387494"
                },
                {
                    "label": "Sacramento, CA (1780 Challenge Way, Sacramento)",
                    "value": "1387495"
                },
                {
                    "label": "Vallejo, CA (1176 Admiral Callaghan Ln, Vallejo)",
                    "value": "1387496"
                },
                {
                    "label": "Orange, CA (2330 N Tustin St, Orange)",
                    "value": "1387498"
                },
                {
                    "label": "Bakersfield, CA (1701 New Stine Rd, Bakersfield)",
                    "value": "1387839"
                },
                {
                    "label": "San Diego, CA (11555 Carmel Mountain Rd, San Diego)",
                    "value": "1387840"
                }
            ],
            "selectedOptions": [],
            "prompt": "Generate report for selected locations:"
        },
        {
            "content": [
                {
                    "type": "Table",
                    "title": {
                        "text": "Monthly Review Trends (Table Data)"
                    },
                    "sql_id": 1,
                    "chart_id": "chart_message_dashboard-d9c292d7-c885-49bf-b58b-47e8fafbbad1-1773735908158_88cdb7eb_b57de741",
                    "end_date": "2026-03-17",
                    "subtitle": {
                        "text": "Total Records: 12"
                    },
                    "message_id": "message_dashboard-d9c292d7-c885-49bf-b58b-47e8fafbbad1-1773735908158_30e04ad7",
                    "start_date": "2025-03-17",
                    "is_modified": true,
                    "suggestions": [
                        {
                            "label": "Add to dashboard",
                            "prompt": "add this chart to dashboard",
                            "event_type": "window",
                            "event_target": "ADD_TO_DASHBOARD"
                        },
                        {
                            "label": "Change to Horizontal Bar chart",
                            "prompt": "convert this chart to horizontal bar chart",
                            "event_type": "",
                            "event_target": ""
                        }
                    ],
                    "dataGridOptions": {
                        headerData: [
                            {
                                "order": 0,
                                "value": "location",
                                "label": "Location",
                                "enabled": true,
                                "sortable": false,
                                "copyToClipboard": true,
                                "fixed": true
                            },
                            {
                                "order": 1,
                                "value": "business_name",
                                "label": "Business Name",
                                "enabled": true,
                                "sortable": false,
                                "copyToClipboard": false,
                                "fixed": false
                            },
                            {
                                "order": 2,
                                "value": "created",
                                "label": "Created On",
                                "enabled": true,
                                "sortable": false,
                                "copyToClipboard": false,
                                "fixed": false
                            },
                            {
                                "order": 3,
                                "value": "created_by",
                                "label": "Created By",
                                "enabled": true,
                                "sortable": false,
                                "copyToClipboard": false,
                                "fixed": false
                            },
                            {
                                "order": 4,
                                "value": "status",
                                "label": "Status",
                                "enabled": true,
                                "sortable": false,
                                "copyToClipboard": false,
                                "fixed": false
                            },
                            {
                                "order": 5,
                                "value": "rating",
                                "label": "Rating",
                                "enabled": true,
                                "sortable": false,
                                "copyToClipboard": false,
                                "fixed": false
                            }
                        ],
                        data: [
                            {
                                "rowId": "row-0",
                                "rowData": {
                                    "location": {
                                        "value": "New York - 1"
                                    },
                                    "business_name": {
                                        "value": "Business 1"
                                    },
                                    "created": {
                                        "value": "Feb 1, 2024"
                                    },
                                    "created_by": {
                                        "value": "John Doe"
                                    },
                                    "status": {
                                        "value": "Active"
                                    },
                                    "rating": {
                                        "value": 5
                                    }
                                },
                                "status": "Active" //optional
                            },
                            {
                                "rowId": "row-1",
                                "rowData": {
                                    "location": {
                                        "value": "Los Angeles - 2"
                                    },
                                    "business_name": {
                                        "value": "Business 2"
                                    },
                                    "created": {
                                        "value": "Feb 2, 2024"
                                    },
                                    "created_by": {
                                        "value": "Jane Smith"
                                    },
                                    "status": {
                                        "value": "Demo"
                                    },
                                    "rating": {
                                        "value": 5
                                    }
                                },
                                "status": "Demo"  //optional
                            },
                        ]
                    },
                    "dashboard_chart_id": "77349ef28c471906"
                }
            ],
            "type": "chart"
        },
    ];
};


