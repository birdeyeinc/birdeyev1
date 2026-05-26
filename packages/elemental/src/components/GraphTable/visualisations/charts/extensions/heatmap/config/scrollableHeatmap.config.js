import { normalHeatmapReportConfig } from "./heatmap.config";

export const scrollableHeatmapReportConfig =  {
    ...normalHeatmapReportConfig,
    "visualisationType": "custom-scrollable-heatmap",
    "apiData": {
        "summary": {
            "actual": {
            "totalCalls": 90,
            "totalCallsGrowth": -25.6,
            "groupBy": "month",
            "totalCallsGrowthAbs": -31
            },
            "compare": {
            "totalCalls": 121,
            "groupBy": "month"
            }
        },
        "dataPoints": [
            {
            "actual": {
                "label": "8 AM",
                "totalCount": 301,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 32,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 6,
                    "TUESDAY": 7,
                    "WEDNESDAY": 2,
                    "THURSDAY": 4,
                    "FRIDAY": 6,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 14,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 2,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 3,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 9,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 3,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 20,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 2,
                    "TUESDAY": 4,
                    "WEDNESDAY": 4,
                    "THURSDAY": 0,
                    "FRIDAY": 4,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 3,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 13,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 4,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 17,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 4,
                    "WEDNESDAY": 2,
                    "THURSDAY": 1,
                    "FRIDAY": 5,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 10,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 3,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 14,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 4,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 4,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 13,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 4,
                    "TUESDAY": 1,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 3,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 5,
                    "TUESDAY": 4,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 4,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 13,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 2,
                    "TUESDAY": 3,
                    "WEDNESDAY": 3,
                    "THURSDAY": 3,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 20,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 6,
                    "TUESDAY": 6,
                    "WEDNESDAY": 3,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 9,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 4,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 29,
                    "dowCntDist": {
                    "SUNDAY": 10,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 9,
                    "THURSDAY": 2,
                    "FRIDAY": 2,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 31,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 8,
                    "TUESDAY": 5,
                    "WEDNESDAY": 1,
                    "THURSDAY": 6,
                    "FRIDAY": 0,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 17,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 3,
                    "TUESDAY": 3,
                    "WEDNESDAY": 4,
                    "THURSDAY": 2,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "9 AM",
                "totalCount": 428,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 21,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 3,
                    "TUESDAY": 4,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 5,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 3,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 25,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 3,
                    "TUESDAY": 5,
                    "WEDNESDAY": 3,
                    "THURSDAY": 2,
                    "FRIDAY": 3,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 16,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 4,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 5,
                    "FRIDAY": 3,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 29,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 1,
                    "TUESDAY": 5,
                    "WEDNESDAY": 3,
                    "THURSDAY": 6,
                    "FRIDAY": 5,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 23,
                    "dowCntDist": {
                    "SUNDAY": 7,
                    "MONDAY": 2,
                    "TUESDAY": 3,
                    "WEDNESDAY": 4,
                    "THURSDAY": 3,
                    "FRIDAY": 1,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 25,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 5,
                    "TUESDAY": 5,
                    "WEDNESDAY": 3,
                    "THURSDAY": 5,
                    "FRIDAY": 6,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 32,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 2,
                    "TUESDAY": 2,
                    "WEDNESDAY": 6,
                    "THURSDAY": 6,
                    "FRIDAY": 7,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 39,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 14,
                    "TUESDAY": 5,
                    "WEDNESDAY": 4,
                    "THURSDAY": 14,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 20,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 6,
                    "TUESDAY": 3,
                    "WEDNESDAY": 2,
                    "THURSDAY": 4,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 23,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 3,
                    "TUESDAY": 4,
                    "WEDNESDAY": 5,
                    "THURSDAY": 3,
                    "FRIDAY": 3,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 24,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 0,
                    "TUESDAY": 6,
                    "WEDNESDAY": 4,
                    "THURSDAY": 4,
                    "FRIDAY": 2,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 19,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 1,
                    "TUESDAY": 3,
                    "WEDNESDAY": 4,
                    "THURSDAY": 2,
                    "FRIDAY": 3,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 28,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 2,
                    "TUESDAY": 4,
                    "WEDNESDAY": 5,
                    "THURSDAY": 3,
                    "FRIDAY": 4,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 31,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 6,
                    "TUESDAY": 2,
                    "WEDNESDAY": 4,
                    "THURSDAY": 4,
                    "FRIDAY": 6,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 25,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 1,
                    "TUESDAY": 4,
                    "WEDNESDAY": 7,
                    "THURSDAY": 4,
                    "FRIDAY": 2,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 18,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 3,
                    "TUESDAY": 1,
                    "WEDNESDAY": 4,
                    "THURSDAY": 1,
                    "FRIDAY": 5,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 2,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 3,
                    "FRIDAY": 2,
                    "SATURDAY": 2
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "10 AM",
                "totalCount": 595,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 11,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 3,
                    "WEDNESDAY": 3,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 35,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 4,
                    "TUESDAY": 6,
                    "WEDNESDAY": 1,
                    "THURSDAY": 6,
                    "FRIDAY": 9,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 66,
                    "dowCntDist": {
                    "SUNDAY": 12,
                    "MONDAY": 1,
                    "TUESDAY": 11,
                    "WEDNESDAY": 2,
                    "THURSDAY": 19,
                    "FRIDAY": 7,
                    "SATURDAY": 14
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 63,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 10,
                    "TUESDAY": 3,
                    "WEDNESDAY": 2,
                    "THURSDAY": 20,
                    "FRIDAY": 16,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 48,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 6,
                    "TUESDAY": 9,
                    "WEDNESDAY": 9,
                    "THURSDAY": 7,
                    "FRIDAY": 8,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 25,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 5,
                    "TUESDAY": 5,
                    "WEDNESDAY": 3,
                    "THURSDAY": 2,
                    "FRIDAY": 4,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 19,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 5,
                    "TUESDAY": 3,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 27,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 5,
                    "TUESDAY": 5,
                    "WEDNESDAY": 5,
                    "THURSDAY": 5,
                    "FRIDAY": 3,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 2,
                    "TUESDAY": 1,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 64,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 7,
                    "TUESDAY": 23,
                    "WEDNESDAY": 2,
                    "THURSDAY": 8,
                    "FRIDAY": 19,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 35,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 5,
                    "TUESDAY": 9,
                    "WEDNESDAY": 8,
                    "THURSDAY": 6,
                    "FRIDAY": 0,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 29,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 3,
                    "TUESDAY": 5,
                    "WEDNESDAY": 3,
                    "THURSDAY": 3,
                    "FRIDAY": 6,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 23,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 6,
                    "TUESDAY": 3,
                    "WEDNESDAY": 0,
                    "THURSDAY": 4,
                    "FRIDAY": 1,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 71,
                    "dowCntDist": {
                    "SUNDAY": 16,
                    "MONDAY": 3,
                    "TUESDAY": 14,
                    "WEDNESDAY": 15,
                    "THURSDAY": 6,
                    "FRIDAY": 10,
                    "SATURDAY": 7
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 22,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 4,
                    "TUESDAY": 2,
                    "WEDNESDAY": 6,
                    "THURSDAY": 4,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 13,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 2,
                    "WEDNESDAY": 3,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 16,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 5,
                    "WEDNESDAY": 4,
                    "THURSDAY": 1,
                    "FRIDAY": 3,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 16,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 0,
                    "TUESDAY": 5,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 2,
                    "SATURDAY": 2
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "11 AM",
                "totalCount": 672,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 64,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 11,
                    "TUESDAY": 6,
                    "WEDNESDAY": 12,
                    "THURSDAY": 10,
                    "FRIDAY": 10,
                    "SATURDAY": 7
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 42,
                    "dowCntDist": {
                    "SUNDAY": 9,
                    "MONDAY": 1,
                    "TUESDAY": 6,
                    "WEDNESDAY": 11,
                    "THURSDAY": 5,
                    "FRIDAY": 3,
                    "SATURDAY": 7
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 61,
                    "dowCntDist": {
                    "SUNDAY": 17,
                    "MONDAY": 10,
                    "TUESDAY": 4,
                    "WEDNESDAY": 4,
                    "THURSDAY": 14,
                    "FRIDAY": 6,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 54,
                    "dowCntDist": {
                    "SUNDAY": 14,
                    "MONDAY": 1,
                    "TUESDAY": 4,
                    "WEDNESDAY": 8,
                    "THURSDAY": 12,
                    "FRIDAY": 12,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 9,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 2,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 46,
                    "dowCntDist": {
                    "SUNDAY": 12,
                    "MONDAY": 3,
                    "TUESDAY": 12,
                    "WEDNESDAY": 6,
                    "THURSDAY": 11,
                    "FRIDAY": 0,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 51,
                    "dowCntDist": {
                    "SUNDAY": 10,
                    "MONDAY": 3,
                    "TUESDAY": 3,
                    "WEDNESDAY": 3,
                    "THURSDAY": 6,
                    "FRIDAY": 14,
                    "SATURDAY": 12
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 38,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 5,
                    "TUESDAY": 7,
                    "WEDNESDAY": 11,
                    "THURSDAY": 10,
                    "FRIDAY": 0,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 62,
                    "dowCntDist": {
                    "SUNDAY": 13,
                    "MONDAY": 5,
                    "TUESDAY": 9,
                    "WEDNESDAY": 13,
                    "THURSDAY": 20,
                    "FRIDAY": 0,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 26,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 1,
                    "TUESDAY": 5,
                    "WEDNESDAY": 6,
                    "THURSDAY": 7,
                    "FRIDAY": 2,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 13,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 2,
                    "TUESDAY": 1,
                    "WEDNESDAY": 4,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 55,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 14,
                    "TUESDAY": 1,
                    "WEDNESDAY": 9,
                    "THURSDAY": 10,
                    "FRIDAY": 2,
                    "SATURDAY": 14
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 44,
                    "dowCntDist": {
                    "SUNDAY": 9,
                    "MONDAY": 3,
                    "TUESDAY": 11,
                    "WEDNESDAY": 2,
                    "THURSDAY": 3,
                    "FRIDAY": 7,
                    "SATURDAY": 9
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 9,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 3,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 12,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 4,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 1,
                    "TUESDAY": 3,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 14,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 2,
                    "TUESDAY": 1,
                    "WEDNESDAY": 3,
                    "THURSDAY": 2,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 50,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 1,
                    "TUESDAY": 9,
                    "WEDNESDAY": 9,
                    "THURSDAY": 8,
                    "FRIDAY": 5,
                    "SATURDAY": 10
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "12 PM",
                "totalCount": 589,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 27,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 4,
                    "TUESDAY": 3,
                    "WEDNESDAY": 7,
                    "THURSDAY": 4,
                    "FRIDAY": 2,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 54,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 17,
                    "TUESDAY": 5,
                    "WEDNESDAY": 1,
                    "THURSDAY": 8,
                    "FRIDAY": 13,
                    "SATURDAY": 7
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 17,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 4,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 4,
                    "FRIDAY": 3,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 37,
                    "dowCntDist": {
                    "SUNDAY": 11,
                    "MONDAY": 10,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 3,
                    "FRIDAY": 8,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 17,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 5,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 2,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 56,
                    "dowCntDist": {
                    "SUNDAY": 12,
                    "MONDAY": 6,
                    "TUESDAY": 6,
                    "WEDNESDAY": 2,
                    "THURSDAY": 8,
                    "FRIDAY": 12,
                    "SATURDAY": 10
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 61,
                    "dowCntDist": {
                    "SUNDAY": 13,
                    "MONDAY": 13,
                    "TUESDAY": 6,
                    "WEDNESDAY": 7,
                    "THURSDAY": 3,
                    "FRIDAY": 13,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 30,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 0,
                    "TUESDAY": 6,
                    "WEDNESDAY": 1,
                    "THURSDAY": 9,
                    "FRIDAY": 7,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 52,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 11,
                    "TUESDAY": 7,
                    "WEDNESDAY": 4,
                    "THURSDAY": 8,
                    "FRIDAY": 9,
                    "SATURDAY": 8
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 42,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 11,
                    "TUESDAY": 3,
                    "WEDNESDAY": 1,
                    "THURSDAY": 13,
                    "FRIDAY": 4,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 57,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 10,
                    "TUESDAY": 16,
                    "WEDNESDAY": 5,
                    "THURSDAY": 1,
                    "FRIDAY": 12,
                    "SATURDAY": 12
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 3,
                    "TUESDAY": 3,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 18,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 4,
                    "TUESDAY": 4,
                    "WEDNESDAY": 3,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 60,
                    "dowCntDist": {
                    "SUNDAY": 9,
                    "MONDAY": 5,
                    "TUESDAY": 10,
                    "WEDNESDAY": 4,
                    "THURSDAY": 7,
                    "FRIDAY": 15,
                    "SATURDAY": 10
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 10,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 2,
                    "WEDNESDAY": 3,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 16,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 4,
                    "TUESDAY": 2,
                    "WEDNESDAY": 3,
                    "THURSDAY": 0,
                    "FRIDAY": 4,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "1 PM",
                "totalCount": 645,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 31,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 5,
                    "TUESDAY": 2,
                    "WEDNESDAY": 9,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 9
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 9,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 58,
                    "dowCntDist": {
                    "SUNDAY": 12,
                    "MONDAY": 6,
                    "TUESDAY": 12,
                    "WEDNESDAY": 2,
                    "THURSDAY": 10,
                    "FRIDAY": 7,
                    "SATURDAY": 9
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 26,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 4,
                    "TUESDAY": 3,
                    "WEDNESDAY": 4,
                    "THURSDAY": 6,
                    "FRIDAY": 0,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 38,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 8,
                    "TUESDAY": 3,
                    "WEDNESDAY": 5,
                    "THURSDAY": 1,
                    "FRIDAY": 6,
                    "SATURDAY": 7
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 55,
                    "dowCntDist": {
                    "SUNDAY": 14,
                    "MONDAY": 12,
                    "TUESDAY": 8,
                    "WEDNESDAY": 3,
                    "THURSDAY": 3,
                    "FRIDAY": 8,
                    "SATURDAY": 7
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 2,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 3,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 55,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 4,
                    "TUESDAY": 11,
                    "WEDNESDAY": 8,
                    "THURSDAY": 11,
                    "FRIDAY": 13,
                    "SATURDAY": 7
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 37,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 3,
                    "TUESDAY": 1,
                    "WEDNESDAY": 7,
                    "THURSDAY": 4,
                    "FRIDAY": 7,
                    "SATURDAY": 10
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 49,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 3,
                    "TUESDAY": 7,
                    "WEDNESDAY": 6,
                    "THURSDAY": 11,
                    "FRIDAY": 14,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 3,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 24,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 3,
                    "TUESDAY": 4,
                    "WEDNESDAY": 1,
                    "THURSDAY": 4,
                    "FRIDAY": 2,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 17,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 0,
                    "TUESDAY": 5,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 3,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 23,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 2,
                    "TUESDAY": 6,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 7,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 20,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 2,
                    "TUESDAY": 5,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 5,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 29,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 8,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 11,
                    "FRIDAY": 0,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 57,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 6,
                    "TUESDAY": 8,
                    "WEDNESDAY": 4,
                    "THURSDAY": 16,
                    "FRIDAY": 14,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 43,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 5,
                    "TUESDAY": 3,
                    "WEDNESDAY": 6,
                    "THURSDAY": 10,
                    "FRIDAY": 8,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 51,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 5,
                    "TUESDAY": 9,
                    "WEDNESDAY": 12,
                    "THURSDAY": 10,
                    "FRIDAY": 9,
                    "SATURDAY": 4
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "2 PM",
                "totalCount": 698,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 62,
                    "dowCntDist": {
                    "SUNDAY": 18,
                    "MONDAY": 10,
                    "TUESDAY": 4,
                    "WEDNESDAY": 4,
                    "THURSDAY": 4,
                    "FRIDAY": 18,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 16,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 3,
                    "TUESDAY": 1,
                    "WEDNESDAY": 3,
                    "THURSDAY": 1,
                    "FRIDAY": 3,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 53,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 5,
                    "TUESDAY": 10,
                    "WEDNESDAY": 15,
                    "THURSDAY": 5,
                    "FRIDAY": 2,
                    "SATURDAY": 11
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 31,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 4,
                    "TUESDAY": 6,
                    "WEDNESDAY": 3,
                    "THURSDAY": 5,
                    "FRIDAY": 5,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 46,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 7,
                    "TUESDAY": 9,
                    "WEDNESDAY": 10,
                    "THURSDAY": 4,
                    "FRIDAY": 6,
                    "SATURDAY": 7
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 12,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 4,
                    "THURSDAY": 4,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 42,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 2,
                    "TUESDAY": 4,
                    "WEDNESDAY": 6,
                    "THURSDAY": 6,
                    "FRIDAY": 6,
                    "SATURDAY": 10
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 36,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 4,
                    "TUESDAY": 4,
                    "WEDNESDAY": 5,
                    "THURSDAY": 9,
                    "FRIDAY": 4,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 23,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 3,
                    "TUESDAY": 1,
                    "WEDNESDAY": 6,
                    "THURSDAY": 4,
                    "FRIDAY": 5,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 44,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 9,
                    "TUESDAY": 8,
                    "WEDNESDAY": 8,
                    "THURSDAY": 6,
                    "FRIDAY": 2,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 3,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 63,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 8,
                    "TUESDAY": 14,
                    "WEDNESDAY": 3,
                    "THURSDAY": 11,
                    "FRIDAY": 8,
                    "SATURDAY": 15
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 59,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 15,
                    "THURSDAY": 9,
                    "FRIDAY": 18,
                    "SATURDAY": 8
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 56,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 6,
                    "TUESDAY": 15,
                    "WEDNESDAY": 5,
                    "THURSDAY": 5,
                    "FRIDAY": 5,
                    "SATURDAY": 15
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 65,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 15,
                    "TUESDAY": 10,
                    "WEDNESDAY": 17,
                    "THURSDAY": 6,
                    "FRIDAY": 1,
                    "SATURDAY": 8
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 67,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 19,
                    "TUESDAY": 18,
                    "WEDNESDAY": 7,
                    "THURSDAY": 9,
                    "FRIDAY": 3,
                    "SATURDAY": 10
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "3 PM",
                "totalCount": 742,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 45,
                    "dowCntDist": {
                    "SUNDAY": 7,
                    "MONDAY": 2,
                    "TUESDAY": 7,
                    "WEDNESDAY": 6,
                    "THURSDAY": 9,
                    "FRIDAY": 12,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 28,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 5,
                    "WEDNESDAY": 5,
                    "THURSDAY": 6,
                    "FRIDAY": 0,
                    "SATURDAY": 10
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 69,
                    "dowCntDist": {
                    "SUNDAY": 7,
                    "MONDAY": 3,
                    "TUESDAY": 16,
                    "WEDNESDAY": 1,
                    "THURSDAY": 15,
                    "FRIDAY": 18,
                    "SATURDAY": 9
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 38,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 1,
                    "TUESDAY": 5,
                    "WEDNESDAY": 0,
                    "THURSDAY": 14,
                    "FRIDAY": 10,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 62,
                    "dowCntDist": {
                    "SUNDAY": 11,
                    "MONDAY": 4,
                    "TUESDAY": 10,
                    "WEDNESDAY": 15,
                    "THURSDAY": 2,
                    "FRIDAY": 2,
                    "SATURDAY": 18
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 42,
                    "dowCntDist": {
                    "SUNDAY": 7,
                    "MONDAY": 6,
                    "TUESDAY": 8,
                    "WEDNESDAY": 3,
                    "THURSDAY": 3,
                    "FRIDAY": 6,
                    "SATURDAY": 9
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 53,
                    "dowCntDist": {
                    "SUNDAY": 7,
                    "MONDAY": 10,
                    "TUESDAY": 3,
                    "WEDNESDAY": 7,
                    "THURSDAY": 8,
                    "FRIDAY": 5,
                    "SATURDAY": 13
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 43,
                    "dowCntDist": {
                    "SUNDAY": 7,
                    "MONDAY": 9,
                    "TUESDAY": 4,
                    "WEDNESDAY": 13,
                    "THURSDAY": 4,
                    "FRIDAY": 2,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 45,
                    "dowCntDist": {
                    "SUNDAY": 13,
                    "MONDAY": 4,
                    "TUESDAY": 7,
                    "WEDNESDAY": 12,
                    "THURSDAY": 7,
                    "FRIDAY": 0,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 18,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 3,
                    "TUESDAY": 3,
                    "WEDNESDAY": 3,
                    "THURSDAY": 5,
                    "FRIDAY": 0,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 46,
                    "dowCntDist": {
                    "SUNDAY": 9,
                    "MONDAY": 12,
                    "TUESDAY": 10,
                    "WEDNESDAY": 3,
                    "THURSDAY": 8,
                    "FRIDAY": 0,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 61,
                    "dowCntDist": {
                    "SUNDAY": 12,
                    "MONDAY": 11,
                    "TUESDAY": 12,
                    "WEDNESDAY": 9,
                    "THURSDAY": 9,
                    "FRIDAY": 6,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 43,
                    "dowCntDist": {
                    "SUNDAY": 12,
                    "MONDAY": 5,
                    "TUESDAY": 6,
                    "WEDNESDAY": 0,
                    "THURSDAY": 2,
                    "FRIDAY": 14,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 21,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 3,
                    "TUESDAY": 5,
                    "WEDNESDAY": 1,
                    "THURSDAY": 3,
                    "FRIDAY": 2,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 48,
                    "dowCntDist": {
                    "SUNDAY": 13,
                    "MONDAY": 6,
                    "TUESDAY": 1,
                    "WEDNESDAY": 3,
                    "THURSDAY": 14,
                    "FRIDAY": 7,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 18,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 3,
                    "TUESDAY": 5,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 48,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 0,
                    "TUESDAY": 3,
                    "WEDNESDAY": 8,
                    "THURSDAY": 6,
                    "FRIDAY": 13,
                    "SATURDAY": 15
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "4 PM",
                "totalCount": 685,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 9,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 2,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 51,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 13,
                    "TUESDAY": 15,
                    "WEDNESDAY": 7,
                    "THURSDAY": 4,
                    "FRIDAY": 4,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 8,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 50,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 6,
                    "TUESDAY": 12,
                    "WEDNESDAY": 14,
                    "THURSDAY": 10,
                    "FRIDAY": 3,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 19,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 4,
                    "TUESDAY": 2,
                    "WEDNESDAY": 3,
                    "THURSDAY": 5,
                    "FRIDAY": 3,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 2,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 56,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 13,
                    "TUESDAY": 1,
                    "WEDNESDAY": 10,
                    "THURSDAY": 5,
                    "FRIDAY": 14,
                    "SATURDAY": 10
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 32,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 6,
                    "TUESDAY": 6,
                    "WEDNESDAY": 0,
                    "THURSDAY": 5,
                    "FRIDAY": 4,
                    "SATURDAY": 7
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 45,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 10,
                    "TUESDAY": 4,
                    "WEDNESDAY": 5,
                    "THURSDAY": 8,
                    "FRIDAY": 6,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 32,
                    "dowCntDist": {
                    "SUNDAY": 7,
                    "MONDAY": 5,
                    "TUESDAY": 3,
                    "WEDNESDAY": 1,
                    "THURSDAY": 3,
                    "FRIDAY": 7,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 16,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 4,
                    "TUESDAY": 6,
                    "WEDNESDAY": 3,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 53,
                    "dowCntDist": {
                    "SUNDAY": 13,
                    "MONDAY": 10,
                    "TUESDAY": 15,
                    "WEDNESDAY": 10,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 56,
                    "dowCntDist": {
                    "SUNDAY": 15,
                    "MONDAY": 4,
                    "TUESDAY": 7,
                    "WEDNESDAY": 0,
                    "THURSDAY": 3,
                    "FRIDAY": 13,
                    "SATURDAY": 14
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 57,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 8,
                    "TUESDAY": 3,
                    "WEDNESDAY": 15,
                    "THURSDAY": 12,
                    "FRIDAY": 1,
                    "SATURDAY": 10
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 30,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 2,
                    "TUESDAY": 4,
                    "WEDNESDAY": 5,
                    "THURSDAY": 6,
                    "FRIDAY": 8,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 53,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 11,
                    "TUESDAY": 7,
                    "WEDNESDAY": 11,
                    "THURSDAY": 9,
                    "FRIDAY": 4,
                    "SATURDAY": 8
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 60,
                    "dowCntDist": {
                    "SUNDAY": 7,
                    "MONDAY": 9,
                    "TUESDAY": 9,
                    "WEDNESDAY": 7,
                    "THURSDAY": 15,
                    "FRIDAY": 4,
                    "SATURDAY": 9
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 47,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 9,
                    "TUESDAY": 2,
                    "WEDNESDAY": 8,
                    "THURSDAY": 5,
                    "FRIDAY": 9,
                    "SATURDAY": 12
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "5 PM",
                "totalCount": 589,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 44,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 14,
                    "TUESDAY": 2,
                    "WEDNESDAY": 14,
                    "THURSDAY": 0,
                    "FRIDAY": 5,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 17,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 4,
                    "TUESDAY": 4,
                    "WEDNESDAY": 5,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 38,
                    "dowCntDist": {
                    "SUNDAY": 7,
                    "MONDAY": 7,
                    "TUESDAY": 8,
                    "WEDNESDAY": 2,
                    "THURSDAY": 6,
                    "FRIDAY": 0,
                    "SATURDAY": 8
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 43,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 10,
                    "TUESDAY": 3,
                    "WEDNESDAY": 8,
                    "THURSDAY": 9,
                    "FRIDAY": 3,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 40,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 4,
                    "TUESDAY": 4,
                    "WEDNESDAY": 8,
                    "THURSDAY": 9,
                    "FRIDAY": 2,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 36,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 7,
                    "TUESDAY": 2,
                    "WEDNESDAY": 9,
                    "THURSDAY": 4,
                    "FRIDAY": 5,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 31,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 6,
                    "TUESDAY": 6,
                    "WEDNESDAY": 0,
                    "THURSDAY": 2,
                    "FRIDAY": 7,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 31,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 3,
                    "TUESDAY": 0,
                    "WEDNESDAY": 6,
                    "THURSDAY": 4,
                    "FRIDAY": 7,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 35,
                    "dowCntDist": {
                    "SUNDAY": 7,
                    "MONDAY": 11,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 1,
                    "FRIDAY": 7,
                    "SATURDAY": 7
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 14,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 4,
                    "WEDNESDAY": 4,
                    "THURSDAY": 1,
                    "FRIDAY": 4,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 32,
                    "dowCntDist": {
                    "SUNDAY": 11,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 3,
                    "THURSDAY": 6,
                    "FRIDAY": 0,
                    "SATURDAY": 10
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 41,
                    "dowCntDist": {
                    "SUNDAY": 8,
                    "MONDAY": 3,
                    "TUESDAY": 8,
                    "WEDNESDAY": 10,
                    "THURSDAY": 1,
                    "FRIDAY": 7,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 3,
                    "TUESDAY": 1,
                    "WEDNESDAY": 2,
                    "THURSDAY": 5,
                    "FRIDAY": 2,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 21,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 3,
                    "TUESDAY": 1,
                    "WEDNESDAY": 4,
                    "THURSDAY": 2,
                    "FRIDAY": 3,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 35,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 7,
                    "TUESDAY": 7,
                    "WEDNESDAY": 5,
                    "THURSDAY": 1,
                    "FRIDAY": 5,
                    "SATURDAY": 8
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 2,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 3,
                    "FRIDAY": 3,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 46,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 2,
                    "TUESDAY": 14,
                    "WEDNESDAY": 13,
                    "THURSDAY": 6,
                    "FRIDAY": 3,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 48,
                    "dowCntDist": {
                    "SUNDAY": 19,
                    "MONDAY": 0,
                    "TUESDAY": 4,
                    "WEDNESDAY": 2,
                    "THURSDAY": 6,
                    "FRIDAY": 4,
                    "SATURDAY": 13
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "6 PM",
                "totalCount": 445,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 43,
                    "dowCntDist": {
                    "SUNDAY": 7,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 10,
                    "THURSDAY": 9,
                    "FRIDAY": 9,
                    "SATURDAY": 8
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 10,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 2,
                    "TUESDAY": 3,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 25,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 4,
                    "TUESDAY": 2,
                    "WEDNESDAY": 3,
                    "THURSDAY": 2,
                    "FRIDAY": 5,
                    "SATURDAY": 8
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 42,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 6,
                    "TUESDAY": 4,
                    "WEDNESDAY": 7,
                    "THURSDAY": 9,
                    "FRIDAY": 5,
                    "SATURDAY": 11
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 21,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 4,
                    "TUESDAY": 5,
                    "WEDNESDAY": 3,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 30,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 9,
                    "TUESDAY": 9,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 21,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 1,
                    "TUESDAY": 4,
                    "WEDNESDAY": 2,
                    "THURSDAY": 3,
                    "FRIDAY": 4,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 20,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 3,
                    "TUESDAY": 6,
                    "WEDNESDAY": 2,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 36,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 7,
                    "TUESDAY": 4,
                    "WEDNESDAY": 1,
                    "THURSDAY": 8,
                    "FRIDAY": 6,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 47,
                    "dowCntDist": {
                    "SUNDAY": 9,
                    "MONDAY": 6,
                    "TUESDAY": 10,
                    "WEDNESDAY": 4,
                    "THURSDAY": 3,
                    "FRIDAY": 9,
                    "SATURDAY": 6
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 32,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 2,
                    "TUESDAY": 2,
                    "WEDNESDAY": 11,
                    "THURSDAY": 8,
                    "FRIDAY": 2,
                    "SATURDAY": 7
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 22,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 0,
                    "TUESDAY": 6,
                    "WEDNESDAY": 1,
                    "THURSDAY": 3,
                    "FRIDAY": 4,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 29,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 8,
                    "TUESDAY": 6,
                    "WEDNESDAY": 1,
                    "THURSDAY": 3,
                    "FRIDAY": 6,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 24,
                    "dowCntDist": {
                    "SUNDAY": 7,
                    "MONDAY": 3,
                    "TUESDAY": 5,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 6,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 3,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 3,
                    "SATURDAY": 2
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "7 PM",
                "totalCount": 326,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 6,
                    "THURSDAY": 3,
                    "FRIDAY": 2,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 29,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 9,
                    "TUESDAY": 2,
                    "WEDNESDAY": 8,
                    "THURSDAY": 4,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 12,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 3,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 1,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 42,
                    "dowCntDist": {
                    "SUNDAY": 10,
                    "MONDAY": 8,
                    "TUESDAY": 5,
                    "WEDNESDAY": 4,
                    "THURSDAY": 2,
                    "FRIDAY": 8,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 22,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 3,
                    "TUESDAY": 1,
                    "WEDNESDAY": 3,
                    "THURSDAY": 2,
                    "FRIDAY": 9,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 39,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 7,
                    "TUESDAY": 5,
                    "WEDNESDAY": 7,
                    "THURSDAY": 5,
                    "FRIDAY": 5,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 3,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 13,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 2,
                    "WEDNESDAY": 3,
                    "THURSDAY": 0,
                    "FRIDAY": 4,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 3,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 10,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 3,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 11,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 3,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 34,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 3,
                    "TUESDAY": 1,
                    "WEDNESDAY": 7,
                    "THURSDAY": 6,
                    "FRIDAY": 6,
                    "SATURDAY": 8
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 4,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 9,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 20,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 3,
                    "TUESDAY": 5,
                    "WEDNESDAY": 1,
                    "THURSDAY": 5,
                    "FRIDAY": 5,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 26,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 2,
                    "TUESDAY": 5,
                    "WEDNESDAY": 1,
                    "THURSDAY": 5,
                    "FRIDAY": 3,
                    "SATURDAY": 4
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "8 PM",
                "totalCount": 218,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 20,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 3,
                    "TUESDAY": 4,
                    "WEDNESDAY": 3,
                    "THURSDAY": 4,
                    "FRIDAY": 0,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 10,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 2,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 21,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 5,
                    "TUESDAY": 3,
                    "WEDNESDAY": 0,
                    "THURSDAY": 6,
                    "FRIDAY": 3,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 6,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 5,
                    "THURSDAY": 3,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 10,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 1,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 2,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 2,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 18,
                    "dowCntDist": {
                    "SUNDAY": 4,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 2,
                    "FRIDAY": 5,
                    "SATURDAY": 5
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 14,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 3,
                    "TUESDAY": 4,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 3,
                    "TUESDAY": 3,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 4,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 19,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 2,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 7,
                    "FRIDAY": 4,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 10,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 2,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 13,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 2,
                    "TUESDAY": 3,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 3,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 11,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 14,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 3,
                    "TUESDAY": 1,
                    "WEDNESDAY": 2,
                    "THURSDAY": 3,
                    "FRIDAY": 2,
                    "SATURDAY": 2
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "9 PM",
                "totalCount": 156,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 3,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 9,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 3,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 8,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 10,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 3,
                    "FRIDAY": 1,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 3,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 13,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 3,
                    "THURSDAY": 2,
                    "FRIDAY": 1,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 2,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 16,
                    "dowCntDist": {
                    "SUNDAY": 5,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 3,
                    "THURSDAY": 2,
                    "FRIDAY": 2,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 9,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 14,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 3,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 4,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 2,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 1,
                    "FRIDAY": 4,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 17,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 4,
                    "TUESDAY": 0,
                    "WEDNESDAY": 4,
                    "THURSDAY": 3,
                    "FRIDAY": 3,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 11,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 3,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "10 PM",
                "totalCount": 98,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 11,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 4,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 9,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 3,
                    "TUESDAY": 4,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 2,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 10,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 3,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 8,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 1,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "11 PM",
                "totalCount": 67,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 3,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 2,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "12 AM",
                "totalCount": 45,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 3,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "1 AM",
                "totalCount": 32,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "2 AM",
                "totalCount": 28,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "3 AM",
                "totalCount": 18,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "4 AM",
                "totalCount": 22,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "5 AM",
                "totalCount": 38,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "6 AM",
                "totalCount": 89,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 9,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 2,
                    "THURSDAY": 1,
                    "FRIDAY": 3,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 6,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 1,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 8,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 2,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 9,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 1,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 8,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 3,
                    "THURSDAY": 1,
                    "FRIDAY": 2,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 0,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 3,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                }
                ]
            },
            "compare": {}
            },
            {
            "actual": {
                "label": "7 AM",
                "totalCount": 186,
                "attrDist": [
                {
                    "name": "Appointment booking",
                    "callCount": 7,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 1,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment reschedule",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 1,
                    "FRIDAY": 0,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Appointment verification",
                    "callCount": 12,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 0,
                    "TUESDAY": 2,
                    "WEDNESDAY": 0,
                    "THURSDAY": 3,
                    "FRIDAY": 4,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Customer query",
                    "callCount": 13,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 2,
                    "THURSDAY": 2,
                    "FRIDAY": 3,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Insurance",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Appointment cancellation",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 3,
                    "TUESDAY": 2,
                    "WEDNESDAY": 3,
                    "THURSDAY": 4,
                    "FRIDAY": 0,
                    "SATURDAY": 3
                    }
                },
                {
                    "name": "Billing inquiry",
                    "callCount": 4,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 3,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Prescription refill",
                    "callCount": 5,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 3,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Test results",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Follow-up call",
                    "callCount": 2,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 0,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Emergency consultation",
                    "callCount": 8,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 2,
                    "TUESDAY": 1,
                    "WEDNESDAY": 0,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Lab appointment",
                    "callCount": 10,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 3,
                    "TUESDAY": 0,
                    "WEDNESDAY": 3,
                    "THURSDAY": 0,
                    "FRIDAY": 1,
                    "SATURDAY": 2
                    }
                },
                {
                    "name": "Specialist referral",
                    "callCount": 14,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 1,
                    "TUESDAY": 3,
                    "WEDNESDAY": 1,
                    "THURSDAY": 0,
                    "FRIDAY": 2,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Vaccination inquiry",
                    "callCount": 12,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 3,
                    "TUESDAY": 3,
                    "WEDNESDAY": 0,
                    "THURSDAY": 3,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Medical records",
                    "callCount": 16,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 1,
                    "TUESDAY": 1,
                    "WEDNESDAY": 4,
                    "THURSDAY": 3,
                    "FRIDAY": 2,
                    "SATURDAY": 4
                    }
                },
                {
                    "name": "Payment issues",
                    "callCount": 10,
                    "dowCntDist": {
                    "SUNDAY": 0,
                    "MONDAY": 1,
                    "TUESDAY": 3,
                    "WEDNESDAY": 3,
                    "THURSDAY": 2,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Telemedicine",
                    "callCount": 10,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 2,
                    "TUESDAY": 0,
                    "WEDNESDAY": 0,
                    "THURSDAY": 3,
                    "FRIDAY": 3,
                    "SATURDAY": 0
                    }
                },
                {
                    "name": "Health checkup",
                    "callCount": 12,
                    "dowCntDist": {
                    "SUNDAY": 3,
                    "MONDAY": 2,
                    "TUESDAY": 2,
                    "WEDNESDAY": 1,
                    "THURSDAY": 3,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "Prescription delivery",
                    "callCount": 15,
                    "dowCntDist": {
                    "SUNDAY": 2,
                    "MONDAY": 1,
                    "TUESDAY": 2,
                    "WEDNESDAY": 4,
                    "THURSDAY": 1,
                    "FRIDAY": 4,
                    "SATURDAY": 1
                    }
                },
                {
                    "name": "General inquiry",
                    "callCount": 12,
                    "dowCntDist": {
                    "SUNDAY": 1,
                    "MONDAY": 3,
                    "TUESDAY": 2,
                    "WEDNESDAY": 2,
                    "THURSDAY": 3,
                    "FRIDAY": 0,
                    "SATURDAY": 1
                    }
                }
                ]
            },
            "compare": {}
            }
        ],
        "groupByType": "hour"
    },
    "heading": "Scrollable Heatmap",
    "parserConfig": {
        ...normalHeatmapReportConfig.parserConfig,
        "displaySummary": false,
        "displayHeader": false,
        "isCustomScroll": true,
        "isDynamicMinWidth": true,
        "isDynamicMinHeight": true,
        "graphTitle": "Scrollable Heatmap",
        "summaryData": [
            {
                "label": "Total calls",
                "dataKey": "totalCalls",
                "showChange": true,
                "changeKey": "totalCallsGrowthAbs",
                "compareDataKey": "totalCalls",
                "showChangeInPercent": false,
                "formatWithComma": true,
                "tooltipClass": "insights-ai-tooltip"
            }
        ],
        "yAxisOptions": {
            "cellDimensions": {
                "cellWidth": 72,
                "cellHeight": 44
            },
            categoriesGenerator: (reportData) => {
                return (reportData?.apiData?.dataPoints?.[0]?.["actual"]?.[reportData?.parserConfig?.categoryKey]).map((value) => value?.name);
            },
            "yAxisWidth": 160
        },
        "colorAxis": {
            "min": 0,
            "minColor": "#ecf5fd",
            "maxColor": "#1976d2",
            "labels": {
                "enabled": false
            }
        },
        getMaxValueForLegend(apiData) {
            let maxValue = 0;
    
            apiData.dataPoints.forEach(dataPoint => {
                const attrDist = dataPoint?.actual?.attrDist || [];
                attrDist.forEach(attr => {
                    if (attr?.callCount && attr.callCount > maxValue) {
                        maxValue = attr.callCount;
                    }
                });
            });

            return maxValue;
        },
        "showDefaultLegend": false,
        "isCustomLegend": true
    },
    "getHardOverrideChartConfig"() {
        return {
            "chart" : {
                "marginTop": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "marginRight": 0,
            }
        }
    }
};