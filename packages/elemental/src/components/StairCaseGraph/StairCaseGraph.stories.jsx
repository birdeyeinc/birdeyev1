import React from 'react';
import StairCaseGraph from '.';

export default {
    title: 'Component/StairCaseGraph',
    component: StairCaseGraph,
    tags: ["autodocs"]
};

const Template = (args) => <StairCaseGraph {...args} />;

export const Default = Template.bind({});
Default.args = {
    data: [
        {
          "label": "",
          "values": [
            {
              "label": "Delivered",
              "count": 6,
              "percent": 60,
              "tooltip": "Hello",
              "extraData": [
                {
                  "text": "Email bounced",
                  "count": 2,
                  "percent": 20,
                  "failureId": 12
                },
                {
                  "text": "Email id not present",
                  "count": 1,
                  "percent": 10,
                  "failureId": 3
                },
                {
                  "text": "Contact is unengaged",
                  "count": 1,
                  "percent": 10,
                  "failureId": 10
                }
              ],
              "failureData": {
                "count": 4,
                "percent": 40
              },
              "scheduledInfo": {
                "count": 0,
                "percent": 0
              }
            },
            {
              "label": "Opened",
              "count": 2,
              "percent": 33,
              "icon": null
            },
            {
              "label": "Review clicks",
              "count": 0,
              "percent": 0,
              "extraData": [],
              "styleName": "positive-status",
              "icon": null
            }
          ]
        }
      ],
};