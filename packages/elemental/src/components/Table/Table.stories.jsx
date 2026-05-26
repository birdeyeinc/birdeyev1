import TableComponent from './index';
import noResult from "assets/images/search.svg";

export default {
  title: "Component/Table",
  component: TableComponent
};

const tableData = {
  "totalCount": 25,
  "headerData": [
      {
          "order": 0,
          "value": "alias",
          "label": "Location",
          "enabled": true,
          "sortable": true,
          "copyToClipboard": true,
          "fixed": true
      },
      {
          "order": 1,
          "value": "enterprise_name",
          "label": "Business name",
          "enabled": true,
          "sortable": true,
          "copyToClipboard": false,
          "fixed": true
      },
      {
          "order": 2,
          "value": "created",
          "label": "Created on",
          "enabled": true,
          "sortable": true,
          "copyToClipboard": false,
          "fixed": false
      },
      {
          "order": 3,
          "value": "cr_by",
          "label": "Created by",
          "enabled": true,
          "sortable": true,
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
      }
  ],
  "data": [
      {
          "businessId": 100081670,
          "accountId": 100081639,
          "businessNumber": 170661430815491,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " AUSTRALIA"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo",
          "accordionMetadata": {
            updatePrimaryRowOnAccordionOpen: {
                "businessId": 100081670,
                "accountId": 100081639,
                "businessNumber": 170661430815491,
                "isCorporate": 0,
                "rowData": [
                    {
                        "order": 0,
                        "value": " AUSTRALIA(124)"
                    },
                    {
                        "order": 1,
                        "value": "Final Testing(1324)"
                    },
                    {
                        "order": 2,
                        "value": "Jan 30, 2024(1243)"
                    },
                    {
                        "order": 3,
                        "value": "Ansh Gupta(523523)"
                    },
                    {
                        "order": 4,
                        "value": "Demo(1356)"
                    }
                ],
                "status": "Demo"
            },
            secondaryRow: true
          }
      },
      {
        "businessId": 100081670,
        "accountId": 100081639,
        "businessNumber": 170661430815491,
        "isCorporate": 0,
        "rowData": [
            {
                "order": 0,
                "value": " "
            },
            {
                "order": 1,
                "value": "Final Testing"
            },
            {
                "order": 2,
                "value": "Jan 30, 2024"
            },
            {
                "order": 3,
                "value": "Ansh Gupta"
            },
            {
                "order": 4,
                "value": "Demo"
            }
        ],
        "status": "Demo",
        "accordionMetadata": {
          primaryRow: " AUSTRALIA"
        }
    },
    {
        "businessId": 100081670,
        "accountId": 100081639,
        "businessNumber": 170661430815491,
        "isCorporate": 0,
        "rowData": [
            {
                "order": 0,
                "value": " "
            },
            {
                "order": 1,
                "value": "Final Testing"
            },
            {
                "order": 2,
                "value": "Jan 30, 2024"
            },
            {
                "order": 3,
                "value": "Ansh Gupta"
            },
            {
                "order": 4,
                "value": "Demo"
            }
        ],
        "status": "Demo",
        "accordionMetadata": {
          primaryRow: " AUSTRALIA"
        }
    },
      {
          "businessId": 100081657,
          "accountId": 100081639,
          "businessNumber": 170661425762679,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " Abu Dhabi 1"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081664,
          "accountId": 100081639,
          "businessNumber": 170661428477373,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " BELGIUM 2"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081697,
          "accountId": 100081639,
          "businessNumber": 170661441214295,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " CANADA"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo",
          "accordionMetadata": {
            updatePrimaryRowOnAccordionOpen: {
                "businessId": 100081670,
                "accountId": 100081639,
                "businessNumber": 170661430815491,
                "isCorporate": 0,
                "rowData": [
                    {
                        "order": 0,
                        "value": " CANADA(124)"
                    },
                    {
                        "order": 1,
                        "value": "Final Testing(1324)"
                    },
                    {
                        "order": 2,
                        "value": "Jan 30, 2024(1243)"
                    },
                    {
                        "order": 3,
                        "value": "Ansh Gupta(523523)"
                    },
                    {
                        "order": 4,
                        "value": "Demo(1356)"
                    }
                ],
                "status": "Demo"
            },
            secondaryRow: true
          }
      },
      {
        "businessId": 100081697,
        "accountId": 100081639,
        "businessNumber": 170661441214295,
        "isCorporate": 0,
        "rowData": [
            {
                "order": 0,
                "value": " "
            },
            {
                "order": 1,
                "value": "Final Testing"
            },
            {
                "order": 2,
                "value": "Jan 30, 2024"
            },
            {
                "order": 3,
                "value": "Ansh Gupta"
            },
            {
                "order": 4,
                "value": "Demo"
            }
        ],
        "status": "Demo",
        "accordionMetadata": {
            primaryRow: " CANADA"
          }
    },
      {
          "businessId": 100081700,
          "accountId": 100081639,
          "businessNumber": 170661442347615,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " CHINA"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081671,
          "accountId": 100081639,
          "businessNumber": 170661431199193,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " CZECH"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081673,
          "accountId": 100081639,
          "businessNumber": 170661431970535,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " EGYPT"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081685,
          "accountId": 100081639,
          "businessNumber": 170661436565905,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " FINLAND"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081699,
          "accountId": 100081639,
          "businessNumber": 170661441987554,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " FRANCE"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081672,
          "accountId": 100081639,
          "businessNumber": 170661431589544,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " GERMANY"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081674,
          "accountId": 100081639,
          "businessNumber": 170661432351704,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " HONG KONG"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081665,
          "accountId": 100081639,
          "businessNumber": 170661428866279,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " HUNGURY"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081689,
          "accountId": 100081639,
          "businessNumber": 170661438119234,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " INDIA"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081686,
          "accountId": 100081639,
          "businessNumber": 170661436950023,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " INDONESIA"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081687,
          "accountId": 100081639,
          "businessNumber": 170661437338258,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " IRELAND"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081688,
          "accountId": 100081639,
          "businessNumber": 170661437718615,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " ISRAEL"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081682,
          "accountId": 100081639,
          "businessNumber": 170661435437285,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " ITALY"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081690,
          "accountId": 100081639,
          "businessNumber": 170661438505139,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " JAPAN"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081666,
          "accountId": 100081639,
          "businessNumber": 170661429252307,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " KENYA"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081668,
          "accountId": 100081639,
          "businessNumber": 170661430025314,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " LUXEMBORG"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081692,
          "accountId": 100081639,
          "businessNumber": 170661439287958,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " MACAU"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081659,
          "accountId": 100081639,
          "businessNumber": 170661426548106,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " MALAYSIA"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081691,
          "accountId": 100081639,
          "businessNumber": 170661438901287,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " MOROCO"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Demo"
              }
          ],
          "status": "Demo"
      },
      {
          "businessId": 100081663,
          "accountId": 100081639,
          "businessNumber": 170661428098688,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " NEITHERLAND"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Active"
              }
          ],
          "status": "Active"
      },
      {
          "businessId": 100081681,
          "accountId": 100081639,
          "businessNumber": 170661435057110,
          "isCorporate": 0,
          "rowData": [
              {
                  "order": 0,
                  "value": " NEW ZEALAND"
              },
              {
                  "order": 1,
                  "value": "Final Testing"
              },
              {
                  "order": 2,
                  "value": "Jan 30, 2024"
              },
              {
                  "order": 3,
                  "value": "Ansh Gupta"
              },
              {
                  "order": 4,
                  "value": "Active"
              }
          ],
          "status": "Active"
      }
  ]
};

const clientSideSortTableData = {
  "tableId": "performance_on_customer_sentiments",
  "headerData": [
    {
      "order": 0,
      "value": "name",
      "label": "Brands",
      "enabled": true,
      "sortable": true,
      "copyToClipboard": false,
      "fixed": false
    },
    {
      "order": 1,
      "value": "sentiment-score",
      "label": "Sentiment score",
      "enabled": true,
      "sortable": true,
      "copyToClipboard": false,
      "fixed": false
    },
    {
      "order": 2,
      "value": "trends",
      "label": "Last 90 days",
      "enabled": true,
      "sortable": false,
      "copyToClipboard": false,
      "fixed": false
    },
    {
      "order": 3,
      "value": "distribution",
      "label": "Distribution",
      "enabled": true,
      "sortable": false,
      "copyToClipboard": false,
      "fixed": false
    },
    {
      "order": 4,
      "value": "most-mention-categories",
      "label": "Most mentioned categories",
      "enabled": true,
      "sortable": false,
      "copyToClipboard": false,
      "fixed": false
    }
  ],
  "data": [
    {
      "rowData": [
        {
          "value": "H&R Block",
          "id": 1499248,
          "subName": "8820 Locations",
          "isSelfBusiness": true
        },
        {
          "value": 44.4,
          "delta": true,
          "deltaValue": 8.3
        },
        {
          "value": [36.4, 49.7, 50.8, 48.4, 43.4, 38, 50.4],
          "sentimentScore": 44.4,
          "delta": false,
          "loadingTrends": false
        },
        {
          "value": { "pos": 28.8, "neg": 68.7, "neu": 2.5 },
          "key": "distribution"
        },
        {
          "value": [
            { "id": 39910, "name": "Experience", "mentions": 221 },
            { "id": 41007, "name": "Results", "mentions": 190 },
            { "id": 39909, "name": "Staff", "mentions": 154 }
          ],
          "id": 1499248
        }
      ]
    },
    {
      "rowData": [
        {
          "value": "Jackson Hewitt",
          "id": 171856,
          "subName": "4829 Locations",
          "isSelfBusiness": false
        },
        {
          "value": 87.8,
          "delta": true,
          "deltaValue": 19.4
        },
        {
          "value": [80.4, 83.8, 86.3, 93.3, 90.3, 80.2, 100],
          "sentimentScore": 87.8,
          "delta": false,
          "loadingTrends": false
        },
        {
          "value": { "pos": 79.3, "neg": 18.7, "neu": 2 },
          "key": "distribution"
        },
        {
          "value": [
            { "id": 39910, "name": "Experience", "mentions": 96 },
            { "id": 39909, "name": "Staff", "mentions": 51 },
            { "id": 41007, "name": "Results", "mentions": 15 }
          ],
          "id": 171856
        }
      ]
    },
    {
      "rowData": [
        {
          "value": "Liberty Tax",
          "id": 171857,
          "subName": "1780 Locations",
          "isSelfBusiness": false
        },
        {
          "value": 94,
          "delta": true,
          "deltaValue": 3.6
        },
        {
          "value": [85.5, 92.8, 94.8, 96.4, 90.6, 94.6, 100],
          "sentimentScore": 94,
          "delta": false,
          "loadingTrends": false
        },
        {
          "value": { "pos": 84, "neg": 14.5, "neu": 1.5 },
          "key": "distribution"
        },
        {
          "value": [
            { "id": 39910, "name": "Experience", "mentions": 257 },
            { "id": 39909, "name": "Staff", "mentions": 69 },
            { "id": 41007, "name": "Results", "mentions": 48 }
          ],
          "id": 171857
        }
      ]
    },
    {
      "rowData": [
        {
          "value": "Turbo Tax",
          "id": 175041,
          "subName": "638 Locations",
          "isSelfBusiness": false
        },
        {
          "value": 95.1,
          "delta": true,
          "deltaValue": -1.7
        },
        {
          "value": [96.7, 99.2, 98, 94.9, 82.3, 87.1, 100],
          "sentimentScore": 95.1,
          "delta": false,
          "loadingTrends": false
        },
        {
          "value": { "pos": 88.8, "neg": 9.7, "neu": 1.6 },
          "key": "distribution"
        },
        {
          "value": [
            { "id": 39910, "name": "Experience", "mentions": 112 },
            { "id": 39909, "name": "Staff", "mentions": 32 },
            { "id": 48206, "name": "Competitors", "mentions": 26 }
          ],
          "id": 175041
        }
      ]
    },
    {
      "rowData": [
        {
          "value": "1West - 10001",
          "id": 140861,
          "subName": "1 Location",
          "isSelfBusiness": false
        },
        {
          "value": 81.1,
          "delta": true,
          "deltaValue": 14.4
        },
        {
          "value": [0, 66.7, 100, 100, 66.7, 100, 93.7],
          "sentimentScore": 81.1,
          "delta": false,
          "loadingTrends": false
        },
        {
          "value": { "pos": 77.6, "neg": 20.9, "neu": 1.5 },
          "key": "distribution"
        },
        {
          "value": [
            { "id": 39910, "name": "Experience", "mentions": 7 },
            { "id": 48205, "name": "Cost / Value", "mentions": 1 }
          ],
          "id": 140861
        }
      ]
    },
    {
      "rowData": [
        {
          "value": "1st Franklin Financial - 70072",
          "id": 145965,
          "subName": "1 Location",
          "isSelfBusiness": false
        },
        {
          "value": 87.5,
          "delta": true,
          "deltaValue": -12.5
        },
        {
          "value": [100, 100, 100, 100, 100, 100, 50],
          "sentimentScore": 87.5,
          "delta": false,
          "loadingTrends": false
        },
        {
          "value": { "pos": 91.7, "neg": 8.3, "neu": 0 },
          "key": "distribution"
        },
        {
          "value": [
            { "id": 39910, "name": "Experience", "mentions": 2 },
            { "id": 39909, "name": "Staff", "mentions": 1 }
          ],
          "id": 145965
        }
      ]
    }
  ],
  "totalCount": 6
};

const disableRowHoverActionTableData = {
  "data": [
    {
      "rowData": [
        {
          "value": "A.C. Lewis Management",
          "id": "00"
        },
        {
          "value": "hskjdfhsdkj",
          "id": "01"
        },
        {
          "value": 0,
          "id": "02"
        },
        {
          "value": 0,
          "id": "03"
        },
        {
          "value": 2,
          "id": "04"
        }
      ]
    },
    {
      "rowData": [
        {
          "value": "AA0012",
          "id": "10"
        },
        {
          "value": "sjdfhkgkjghdkjgh",
          "id": "11"
        },
        {
          "value": 32,
          "id": "12"
        },
        {
          "value": 0,
          "id": "13"
        },
        {
          "value": 1,
          "id": "14"
        }
      ]
    },
    {
      "rowData": [
        {
          "value": "AA00123",
          "id": "20"
        },
        {
          "value": "sjdfhkgkjghdkjgh",
          "id": "21"
        },
        {
          "value": 0,
          "id": "22"
        },
        {
          "value": 0,
          "id": "23"
        },
        {
          "value": 1,
          "id": "24"
        }
      ]
    },
    {
      "rowData": [
        {
          "value": "AA001234",
          "id": "30"
        },
        {
          "value": "sjdfhkgkjghdkjgh",
          "id": "31"
        },
        {
          "value": 22,
          "id": "32"
        },
        {
          "value": 0,
          "id": "33"
        },
        {
          "value": 1,
          "id": "34"
        }
      ]
    }
  ],
  "headerData": [
    {
      "order": 0,
      "value": "businessNameCol",
      "label": "Business Name",
      "enabled": true,
      "sortable": true,
      "copyToClipboar": false,
      "fixed": true
    },
    {
      "order": 1,
      "value": "businessNumberCol",
      "label": "Business ID",
      "enabled": true,
      "sortable": true,
      "copyToClipboar": false,
      "fixed": true
    },
    {
      "order": 2,
      "value": "totalLocationsCol",
      "label": "Total Locations",
      "enabled": true,
      "copyToClipboar": false,
      "fixed": true
    },
    {
      "order": 3,
      "value": "mappedLocationsCol",
      "label": "Mapped Locations",
      "enabled": true,
      "copyToClipboar": false,
      "fixed": true
    },
    {
      "order": 4,
      "value": "unmappedLocationsCol",
      "label": "Unmapped Locations",
      "enabled": true,
      "copyToClipboar": false,
      "fixed": true
    }
  ]
}


export const Table = {
  args: {
    tableData: tableData,
    loaderProps: {
      isLoading: true,
      type: "loader-birdeye",
      isReseller: false
    },
    noDataProps: {
      noResultsImageSrc: noResult,
      subtitle: "Try different keywords or remove selected filters",
      className: "nodata"
    },
    isFirstRowFixed: true,
    accordionConfig: {
        enableAccordion: true,
        defaultAccordionState: {isOpen: true, primaryRowId: ' AUSTRALIA'},
        disableAccordionClick: false
    },
    disableRowHoverAction: (rowData) => {return false;} ,
    // virtualization : { enabled: true, overscan: 5, rowHeight: 50, switchThreshold: 1000 },  // rowHeight auto-detected!
  }
};

export const ClientSideSortTable = {
  args: {
    tableData: clientSideSortTableData,
    enableClientSideSort: true,
    sortComparator: (a, b, sortColumn, order) => {
      const headers = clientSideSortTableData.headerData;
      const columnIndex = headers.findIndex(header => header.value === sortColumn);
      
      if (columnIndex === -1) return 0;
      
      const aValue = a.rowData[columnIndex];
      const bValue = b.rowData[columnIndex];
      
      let comparison = 0;
      
      // Handle different column types
      if (sortColumn === 'name') {
        comparison = aValue.value.localeCompare(bValue.value);
      } else if (sortColumn === 'sentiment-score') {
        comparison = aValue.value - bValue.value;
      }
      
      // order: 0 = ascending, 1 = descending
      return order === 0 ? comparison : -comparison;
    },
    isHeaderFixed: true,
    tableContainerClass: "performance_on_customer_sentiments",
    cellRenderer: {
      "name": ({ rowData }) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>{rowData.value}</strong>
          <small style={{ color: '#666' }}>{rowData.subName}</small>
        </div>
      ),
      "sentiment-score": ({ rowData }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <strong>{rowData.value}</strong>
          {rowData.delta && (
            <span style={{ 
              color: rowData.deltaValue > 0 ? 'green' : 'red',
              fontSize: '12px'
            }}>
              {rowData.deltaValue > 0 ? '↑' : '↓'} {Math.abs(rowData.deltaValue)}%
            </span>
          )}
        </div>
      ),
      "trends": ({ rowData }) => (
        <div style={{ fontSize: '12px' }}>
          {rowData.value?.join(', ')}
        </div>
      ),
      "distribution": ({ rowData }) => (
        <div style={{ fontSize: '11px' }}>
          <div>Pos: {rowData.value?.pos}%</div>
          <div>Neg: {rowData.value?.neg}%</div>
          <div>Neu: {rowData.value?.neu}%</div>
        </div>
      ),
      "most-mention-categories": ({ rowData }) => (
        <div style={{ fontSize: '12px' }}>
          {rowData.value?.slice(0, 3).map((cat, idx) => (
            <div key={idx}>{cat.name} ({cat.mentions})</div>
          ))}
        </div>
      )
    },
    customHeadersMaxWidth: {
      "sentiment-score": "140px",
      "trends": "180px",
      "name": "200px",
      "distribution": "150px",
      "most-mention-categories": "290px"
    },
    customHeadersFixWidth: {
      "sentiment-score": "140px",
      "trends": "180px",
      "name": "200px",
      "distribution": "150px",
      "most-mention-categories": "290px"
    },
    customHeadersMinWidth: {
      "sentiment-score": "140px",
      "trends": "180px",
      "name": "200px",
      "distribution": "150px",
      "most-mention-categories": "290px"
    },
    loaderProps: {
      isLoading: false,
      type: "loader-birdeye",
      isReseller: false
    },
    noDataProps: {
      noResultsImageSrc: noResult,
      subtitle: "Try different keywords or remove selected filters",
      className: "nodata"
    }
  }
};

export const RowHoverDisabledTable = {
  args: {
    tableData: disableRowHoverActionTableData,
    loaderProps: {
      isLoading: false,
      type: "loader-birdeye",
      isReseller: false
    },
    virtualization: {
        enabled: true,
        overscan: 5,
        rowHeight: 50,
        switchThreshold: 20
    },
    noDataProps: {
      noResultsImageSrc: noResult,
      subtitle: "Try different keywords or remove selected filters",
      className: "nodata"
    },
    isFirstRowFixed: true,
    rowHoverAction : {
        enable: true,
        customJSX: () => (
            <div className="custom-content">
                <button>Preview</button>
            </div>
        ),
        config: () => ({
            categories: [
                {
                    title: "",
                    options: [
                        {
                            label: "Test Label",
                            value: "TEST",
                            enable: true,
                            callBack: (row) => {
                                console.log("Testing")
                            }
                        }
                    ]
                }
            ]
        })
    },
    disableRowHoverAction: ( rowData ) => {
        return rowData[2].value === 0;
    }
  }
};

