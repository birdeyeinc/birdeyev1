  let apiResponse = [
      {
          chartCommonConfig: {
              visualisationType: "Table",
              parserConfig: {
                  tableConfig: {
                      // actual is basically column configuration object
                      actual: [
                          {
                              // headerLabel is for label for header cell
                              headerLabel: "Breakdown",
                              // data.key is a path so it will look into apidata and find value which we need to show in cell
                              dataKey: "actual.label",
                              // if we need to show sort icons and we need to enable sorting ( for that we need to pass sortinghandler function also )
                              enableSort: true,
                              // this key used when we need to render any customJSX for header cell or body cell,
                              // it will look into headerRenderMap and cellRenderMap respectivly for customJSX fn
                              columnKey: "experienceScoreBreakdownKey",
                          },
                          {
                              headerLabel: "Score",
                              dataKey: "actual.score",
                              enableSort: true,
                              columnKey: "experienceScoreKey",
                          },
                          {
                              headerLabel: "Industry average",
                              dataKey: "actual.industryAverage",
                              enableSort: false,
                              columnKey: "industryAvgScorekey",
                              isDataAvailable: true,
                          },
                          {
                              headerLabel: "testing average",
                              dataKey: "actual.testingAverage",
                              enableSort: false,
                              columnKey: "testingAvgScorekey",
                              isDataAvailable: true,
                          },
                      ],
                      sortProps: {
                          // if we want to enable clientSide sorting, but for that also we need to pass `sortingHandler`
                          isClientSortEnabled: true,
                          // if `isClientSortEnabled` is `true`, then sortingHandler should return `sortedRowsData`
                          // if `isClientSortEnabled` is `false`, then through api call we need to handle sorting and pass sorted apiData again
                          sortingHandler: ({ sortby: columnKey, sortOrder, rowsData }) => {
                              let sortedArray;
                              const order = sortOrder == 0 ? "asc" : "desc";
                              switch (columnKey) {
                                  case "experienceScoreBreakdownKey": {
                                      sortedArray = orderBy(
                                          rowsData,
                                          (point) => {
                                              return point.rowData[0].value;
                                          },
                                          order,
                                      );
                                      break;
                                  }
                                  case "experienceScoreKey": {
                                      sortedArray = orderBy(
                                          rowsData,
                                          (point) => {
                                              return point.rowData[1].value;
                                          },
                                          order,
                                      );
                                      break;
                                  }
                              }
                              return sortedArray;
                          },
                      },
                      utilityFns: {},
                  },
              },
          },
          apiData: {
              dataPoints: [
                  {
                      actual: {
                          shortLabel: "Sentiment Score",
                          label: "Sentiment Score",
                          key: "sentiment",
                          score: 93.8,
                          industryAverage: 81.1,
                          testingAverage: 79.5,
                      },
                  },
                  {
                      actual: {
                          shortLabel: "Reputation Score",
                          label: "Reputation Score",
                          key: "reputation",
                          score: 58.2,
                          industryAverage: 51.4,
                          testingAverage: 55.3,
                      },
                  },
              ]
          },
      },
  ];