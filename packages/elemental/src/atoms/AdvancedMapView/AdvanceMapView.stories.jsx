import React from "react";
import AdvanceMapViewComponent from "./index";

export default {
  title: "Atom/AdvancedMapView",
  component: AdvanceMapViewComponent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: 'Advanced Map View component for displaying locations on Google Maps with clustering and custom markers.',
      },
    },
  },
};

export const Default = (props) => {
  const updateProps = {...props}
  
  // Add error boundary or fallback for missing API key
  if (!updateProps.googleMapsApiKey || updateProps.googleMapsApiKey === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
      <div style={{ padding: "20px", border: "1px dashed #ccc", textAlign: "center" }}>
        <h3>Google Maps API Key Required</h3>
        <p>Please provide a valid Google Maps API key to view the map component.</p>
        <p>Set the <code>googleMapsApiKey</code> prop with your actual API key.</p>
      </div>
    );
  }

  return (
    <div style={{ height: updateProps.mapHeight || 500, width: "100%", position: "relative" }}>
      <AdvanceMapViewComponent
        {...updateProps}
      />
    </div>
  );
};

Default.args = {
    mapHeight: 500,
    origin: "default",
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    mapId: "YOUR_MAP_ID",
    showResetZoomButton: true,
    fullscreenControl: true,
    gestureHandling: "greedy",
    fixedMinZoomLevel: true,
    "locations": [
  {
    "id": 1430515,
    "name": "1343 Middletown, RI – W Main Rd.",
    "listingScore": {
      "listingScoreRank": 87.9,
      "listingScoreDelta": 3.5
    },
    "localSeoRank": {
      "localSeoRank": 1.2,
      "localSeoRankDelta": -0.2
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 1.4,
        "rankDelta": -1.4
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1,
        "rankDelta": 0
      }
    ],
    "rankDownKeyword": [],
    "latitude": 41.5197171,
    "longitude": -71.2991857
  },
  {
    "id": 1113389,
    "name": "1106 Novato, CA - Vintage Way",
    "listingScore": {
      "listingScoreRank": 90.1,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 1.4,
      "localSeoRankDelta": 0.1
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.7
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 1.5,
        "rankDelta": 0.2
      }
    ],
    "latitude": 38.09042869,
    "longitude": -122.5551132
  },
  {
    "id": 887325,
    "name": "1054 - Howell, MI - E. Grand River",
    "listingScore": {
      "listingScoreRank": 90.2,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 1.4,
      "localSeoRankDelta": -0.7
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1,
        "rankDelta": -1.4
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.6,
        "rankDelta": -0.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.5,
        "rankDelta": -0.5
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 42.5893942,
    "longitude": -83.8796928
  },
  {
    "id": 1226709,
    "name": "1222 Billings, MT - Shiloh Crossing Blvd",
    "listingScore": {
      "listingScoreRank": 86.6,
      "listingScoreDelta": 5.6
    },
    "localSeoRank": {
      "localSeoRank": 1.4
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 45.7504842,
    "longitude": -108.6164964
  },
  {
    "id": 1520933,
    "name": "1333 Longmont, CO - E. Ken Pratt Blvd.",
    "listingScore": {
      "listingScoreRank": 85.4,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 1.5,
      "localSeoRankDelta": -9.9
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 50
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1,
        "rankDelta": -20
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.4,
        "rankDelta": -0.2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 40.1506222,
    "longitude": -105.0844822
  },
  {
    "id": 926113,
    "name": "1066 - San Luis Obispo, CA - Madonna Rd",
    "listingScore": {
      "listingScoreRank": 91.5,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 1.5,
      "localSeoRankDelta": 0.1
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2
      }
    ],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 1.8,
        "rankDelta": 0.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.4,
        "rankDelta": 0.1
      }
    ],
    "latitude": 35.2625967,
    "longitude": -120.6777301
  },
  {
    "id": 1490702,
    "name": "1374 Baraboo, WI - Great Wolf Dr. - The Dells - Lake Delton",
    "listingScore": {
      "listingScoreRank": 88.2,
      "listingScoreDelta": 0.5
    },
    "localSeoRank": {
      "localSeoRank": 1.5,
      "localSeoRankDelta": -3.7
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 6.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1,
        "rankDelta": -5.8
      },
      {
        "name": "Chicken restaurant",
        "rank": 1,
        "rankDelta": -0.8
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 43.5732471,
    "longitude": -89.7794908
  },
  {
    "id": 1530219,
    "name": "1321 Springfield, IL - Wabash Ave.",
    "listingScore": {
      "listingScoreRank": 90.7,
      "listingScoreDelta": -0.8
    },
    "localSeoRank": {
      "localSeoRank": 1.6
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.8
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 39.76459029,
    "longitude": -89.7012659
  },
  {
    "id": 1146897,
    "name": "1115 York, PA - Loucks Rd.",
    "listingScore": {
      "listingScoreRank": 87.9,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 1.7,
      "localSeoRankDelta": -3.9
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 10
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 1.8,
        "rankDelta": -3.7
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 39.9795439,
    "longitude": -76.7563725
  },
  {
    "id": 1438840,
    "name": "1288 Redding, CA - Dana Dr.",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": 8
    },
    "localSeoRank": {
      "localSeoRank": 1.7,
      "localSeoRankDelta": -5.9
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 25
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.1,
        "rankDelta": -12.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.9,
        "rankDelta": -0.2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 40.5854457,
    "longitude": -122.3556715
  },
  {
    "id": 1676795,
    "name": "1322 Fountain, CO - Mesa Ridge Pkwy.",
    "listingScore": {
      "listingScoreRank": 90.7,
      "listingScoreDelta": 10.2
    },
    "localSeoRank": {
      "localSeoRank": 1.7
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.9
      }
    ],
    "rankDownKeyword": [],
    "latitude": 38.71922319,
    "longitude": -104.7130193
  },
  {
    "id": 1523230,
    "name": "1326 Appleton, WI - W. Wisconsin Ave.",
    "listingScore": {
      "listingScoreRank": 89.5,
      "listingScoreDelta": -0.1
    },
    "localSeoRank": {
      "localSeoRank": 1.7,
      "localSeoRankDelta": -9.1
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 50
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1,
        "rankDelta": -17.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.8,
        "rankDelta": -1.3
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 44.2727673,
    "longitude": -88.4686079
  },
  {
    "id": 930481,
    "name": "1060 - Eugene, OR - 13th Ave.",
    "listingScore": {
      "listingScoreRank": 91.5,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 1.7,
      "localSeoRankDelta": -1.1
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 1.6,
        "rankDelta": -1.8
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.3
      }
    ],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.2,
        "rankDelta": 0
      }
    ],
    "latitude": 44.045713,
    "longitude": -123.0799335
  },
  {
    "id": 1455815,
    "name": "1263 Lubbock, TX - 82nd St.",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": -1.4
    },
    "localSeoRank": {
      "localSeoRank": 1.7,
      "localSeoRankDelta": -5.1
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 5
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2,
        "rankDelta": -2.9
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.9,
        "rankDelta": -7.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 33.5193182,
    "longitude": -101.9549222
  },
  {
    "id": 1493813,
    "name": "1307 Spokane, WA - N. Division St.",
    "listingScore": {
      "listingScoreRank": 88.2,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 1.7,
      "localSeoRankDelta": -13.7
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 55
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4,
        "rankDelta": -19.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.7,
        "rankDelta": -8
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 1.9
      }
    ],
    "rankDownKeyword": [],
    "latitude": 47.7135438,
    "longitude": -117.4108554
  },
  {
    "id": 1534403,
    "name": "1340 Livermore, CA - First St.",
    "listingScore": {
      "listingScoreRank": 88.5,
      "listingScoreDelta": -1
    },
    "localSeoRank": {
      "localSeoRank": 1.8,
      "localSeoRankDelta": -6.6
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 25
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 1.6,
        "rankDelta": -1.3
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 37.6942597,
    "longitude": -121.7462144
  },
  {
    "id": 1447547,
    "name": "1273 Oxnard, CA - W. Esplanade Dr.",
    "listingScore": {
      "listingScoreRank": 86.8,
      "listingScoreDelta": 2.8
    },
    "localSeoRank": {
      "localSeoRank": 1.8,
      "localSeoRankDelta": -3.6
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 5
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2,
        "rankDelta": -1.9
      },
      {
        "name": "Chicken restaurant",
        "rank": 2,
        "rankDelta": -5.7
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 34.2332132,
    "longitude": -119.1781526
  },
  {
    "id": 1307897,
    "name": "1031 Hemet, CA - South Sanderson",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": -1.4
    },
    "localSeoRank": {
      "localSeoRank": 1.9,
      "localSeoRankDelta": -10.4
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 50
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.1,
        "rankDelta": -19.9
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.2,
        "rankDelta": -1.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 33.72564779,
    "longitude": -117.0073712
  },
  {
    "id": 1356136,
    "name": "1230 Vancouver, WA - NE 6th Ave - Hazel Dell",
    "listingScore": {
      "listingScoreRank": 90.2,
      "listingScoreDelta": -1.5
    },
    "localSeoRank": {
      "localSeoRank": 1.9
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.5
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 45.6793772,
    "longitude": -122.6674081
  },
  {
    "id": 1165709,
    "name": "1186 - Ashwaubenon, WI - Oneida St. - Green Bay",
    "listingScore": {
      "listingScoreRank": 87.6,
      "listingScoreDelta": 0
    },
    "localSeoRank": {
      "localSeoRank": 1.9,
      "localSeoRankDelta": -0.8
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 2,
        "rankDelta": -0.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 44.4783854,
    "longitude": -88.0733954
  },
  {
    "id": 1667974,
    "name": "1297 Chattanooga, TN - Gunbarrel Rd.",
    "listingScore": {
      "listingScoreRank": 90.7,
      "listingScoreDelta": 1.1
    },
    "localSeoRank": {
      "localSeoRank": 1.9
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.7
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.9
      }
    ],
    "rankDownKeyword": [],
    "latitude": 35.037469,
    "longitude": -85.15156689
  },
  {
    "id": 1416265,
    "name": "1281 Davenport, IA - E 53rd St",
    "listingScore": {
      "listingScoreRank": 86.6,
      "listingScoreDelta": 10
    },
    "localSeoRank": {
      "localSeoRank": 2,
      "localSeoRankDelta": -8.2
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 40
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4,
        "rankDelta": -19.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.4,
        "rankDelta": -2
      },
      {
        "name": "Chicken restaurant",
        "rank": 2,
        "rankDelta": -2.6
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 41.5755554,
    "longitude": -90.5292532
  },
  {
    "id": 831916,
    "name": "1019 - Indio, CA - Jackson St.",
    "listingScore": {
      "listingScoreRank": 89,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 2,
      "localSeoRankDelta": -0.6
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2,
        "rankDelta": -1
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.3,
        "rankDelta": -1.6
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.4,
        "rankDelta": 0.8
      }
    ],
    "latitude": 33.7437261,
    "longitude": -116.217787
  },
  {
    "id": 1520506,
    "name": "1360 Odessa, FL - Pine Gap Spur - Starkey Ranch",
    "listingScore": {
      "listingScoreRank": 89.5,
      "listingScoreDelta": 8.7
    },
    "localSeoRank": {
      "localSeoRank": 2
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.5
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.5
      },
      {
        "name": "Chicken restaurant",
        "rank": 2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 28.1948787,
    "longitude": -82.59331809
  },
  {
    "id": 1492946,
    "name": "1278 Savannah, GA - Victory Dr.",
    "listingScore": {
      "listingScoreRank": 88.2,
      "listingScoreDelta": 0.5
    },
    "localSeoRank": {
      "localSeoRank": 2,
      "localSeoRankDelta": -2.6
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 5
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.1,
        "rankDelta": -2.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.3,
        "rankDelta": -3.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 32.04497589,
    "longitude": -81.0709811
  },
  {
    "id": 1474846,
    "name": "1225 El Paso, TX - Paseo del Norte Blvd.",
    "listingScore": {
      "listingScoreRank": 89.5,
      "listingScoreDelta": -0.1
    },
    "localSeoRank": {
      "localSeoRank": 2.1,
      "localSeoRankDelta": -0.9
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.5,
        "rankDelta": -0.7
      },
      {
        "name": "Chicken restaurant",
        "rank": 2,
        "rankDelta": -1.8
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.8
      }
    ],
    "rankDownKeyword": [],
    "latitude": 31.8846379,
    "longitude": -106.5752507
  },
  {
    "id": 1174899,
    "name": "1130 Fort Collins, CO - S. College Ave.",
    "listingScore": {
      "listingScoreRank": 91.5,
      "listingScoreDelta": 0
    },
    "localSeoRank": {
      "localSeoRank": 2.1,
      "localSeoRankDelta": 0.2
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.7
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 2.4,
        "rankDelta": 0.5
      }
    ],
    "latitude": 40.5648924,
    "longitude": -105.0764362
  },
  {
    "id": 1147287,
    "name": "1193 Framingham, MA - Cochituate Rd.",
    "listingScore": {
      "listingScoreRank": 86.2,
      "listingScoreDelta": -1.4
    },
    "localSeoRank": {
      "localSeoRank": 2.1,
      "localSeoRankDelta": 0.4
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.5
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.6
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 2.4,
        "rankDelta": 0.6
      }
    ],
    "latitude": 42.3028568,
    "longitude": -71.40202909
  },
  {
    "id": 1008151,
    "name": "1153 South Bend, IN - N. Eddy St.",
    "listingScore": {
      "listingScoreRank": 89,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 2.1,
      "localSeoRankDelta": -0.6
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1,
        "rankDelta": -1.7
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.3,
        "rankDelta": -0.9
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.9,
        "rankDelta": 1.8
      }
    ],
    "latitude": 41.6926636,
    "longitude": -86.2348189
  },
  {
    "id": 1409252,
    "name": "1289 Worcester, MA - Park Ave",
    "listingScore": {
      "listingScoreRank": 86.6,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 2.2,
      "localSeoRankDelta": -12.4
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 66.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.8,
        "rankDelta": -19.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 2,
        "rankDelta": -0.4
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 42.28238229,
    "longitude": -71.80790159
  },
  {
    "id": 1006103,
    "name": "1125 Meridian, ID - Eagle Rd",
    "listingScore": {
      "listingScoreRank": 90.2,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 2.2,
      "localSeoRankDelta": -0.7
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1,
        "rankDelta": -3.7
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.8,
        "rankDelta": 1.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.7,
        "rankDelta": 0.1
      }
    ],
    "latitude": 43.6360855,
    "longitude": -116.3537769
  },
  {
    "id": 1371978,
    "name": "1227 Conyers, GA - HWY 138 SE",
    "listingScore": {
      "listingScoreRank": 89.7,
      "listingScoreDelta": 3.6
    },
    "localSeoRank": {
      "localSeoRank": 2.2
    },
    "localSeoScore": {
      "localSeoScore": 98.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.1
      },
      {
        "name": "food near me",
        "rank": 5.4
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.5
      },
      {
        "name": "daves hot chicken",
        "rank": 1
      },
      {
        "name": "dave's hot chicken, highway 138 southeast, conyers, ga",
        "rank": 1
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 33.65171999,
    "longitude": -84.0083566
  },
  {
    "id": 1520504,
    "name": "1234 Waldorf, MD - Crain Hwy.",
    "listingScore": {
      "listingScoreRank": 90.7,
      "listingScoreDelta": 8
    },
    "localSeoRank": {
      "localSeoRank": 2.2,
      "localSeoRankDelta": -7.4
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 50
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4,
        "rankDelta": -15.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.3,
        "rankDelta": -0.3
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 3
      }
    ],
    "rankDownKeyword": [],
    "latitude": 38.6438909,
    "longitude": -76.8936465
  },
  {
    "id": 1547154,
    "name": "1337 Omaha, NE. - S. 180th St.",
    "listingScore": {
      "listingScoreRank": 89.5,
      "listingScoreDelta": 2
    },
    "localSeoRank": {
      "localSeoRank": 2.2
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 41.2352703,
    "longitude": -96.1954451
  },
  {
    "id": 1274958,
    "name": "1176 Santa Maria, CA - Betteravia Rd.",
    "listingScore": {
      "listingScoreRank": 86.8,
      "listingScoreDelta": -1.4
    },
    "localSeoRank": {
      "localSeoRank": 2.3
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 34.921259,
    "longitude": -120.433047
  },
  {
    "id": 1438843,
    "name": "1346 Vestal, NY - Vestal Pkwy E.",
    "listingScore": {
      "listingScoreRank": 88,
      "listingScoreDelta": 7.8
    },
    "localSeoRank": {
      "localSeoRank": 2.3,
      "localSeoRankDelta": -2
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 5
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3,
        "rankDelta": -4.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.4,
        "rankDelta": -0.2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 42.0961092,
    "longitude": -75.9832677
  },
  {
    "id": 1662567,
    "name": "1304 Normal, IL - E. College Ave.",
    "listingScore": {
      "listingScoreRank": 86.8,
      "listingScoreDelta": -1.4
    },
    "localSeoRank": {
      "localSeoRank": 2.3
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.8
      },
      {
        "name": "Chicken restaurant",
        "rank": 3
      }
    ],
    "rankDownKeyword": [],
    "latitude": 40.5124276,
    "longitude": -88.951561
  },
  {
    "id": 1520502,
    "name": "1282 Madison, AL - Hwy. 72",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": 10.8
    },
    "localSeoRank": {
      "localSeoRank": 2.3
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 34.7508244,
    "longitude": -86.7544759
  },
  {
    "id": 1361888,
    "name": "1275 - Coon Rapids, MN - Main St",
    "listingScore": {
      "listingScoreRank": 90.2,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 2.3
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.3
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 45.1970851,
    "longitude": -93.35668179
  },
  {
    "id": 901526,
    "name": "1039 - Houston, TX - Wallisville Rd.",
    "listingScore": {
      "listingScoreRank": 90.2,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 2.4,
      "localSeoRankDelta": -0.9
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.1,
        "rankDelta": -0.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.4,
        "rankDelta": -0.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.8,
        "rankDelta": -1.9
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 29.80787979,
    "longitude": -95.1690844
  },
  {
    "id": 1246879,
    "name": "1191 East Lansing, MI - Albert St.",
    "listingScore": {
      "listingScoreRank": 89,
      "listingScoreDelta": 7.9
    },
    "localSeoRank": {
      "localSeoRank": 2.4,
      "localSeoRankDelta": -7
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 33.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1,
        "rankDelta": -20
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.4,
        "rankDelta": -0.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.9,
        "rankDelta": -0.7
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 42.7357234,
    "longitude": -84.4824529
  },
  {
    "id": 772876,
    "name": "1023 - Tualatin, OR - Nyberg",
    "listingScore": {
      "listingScoreRank": 91.5,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 2.4,
      "localSeoRankDelta": -5
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 10
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3,
        "rankDelta": -7.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.2,
        "rankDelta": -2.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 2,
        "rankDelta": -5.2
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 45.3830243,
    "longitude": -122.7570584
  },
  {
    "id": 1131647,
    "name": "1159 Minnetonka, MN - Plymouth Rd.",
    "listingScore": {
      "listingScoreRank": 86.6,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 2.5,
      "localSeoRankDelta": -5.5
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 10
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 2.7,
        "rankDelta": -5.2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 44.9674109,
    "longitude": -93.4417543
  },
  {
    "id": 1130869,
    "name": "1150 Orem, UT - E. University Pkwy.",
    "listingScore": {
      "listingScoreRank": 87.9,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 2.5,
      "localSeoRankDelta": -0.6
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 2.8,
        "rankDelta": -0.3
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 40.2723713,
    "longitude": -111.685105
  },
  {
    "id": 1174901,
    "name": "1181 Champaign, IL - S. Neil St",
    "listingScore": {
      "listingScoreRank": 89,
      "listingScoreDelta": -1.2
    },
    "localSeoRank": {
      "localSeoRank": 2.5,
      "localSeoRankDelta": -0.5
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.4
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 3.1,
        "rankDelta": 0.1
      }
    ],
    "latitude": 40.09169639,
    "longitude": -88.2462118
  },
  {
    "id": 1174900,
    "name": "1173 Yuma, AZ - S. Yuma Palms Pkwy",
    "listingScore": {
      "listingScoreRank": 87.7,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 2.5,
      "localSeoRankDelta": 1.5
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.6
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 3.1,
        "rankDelta": 2.1
      }
    ],
    "latitude": 32.6997686,
    "longitude": -114.6010568
  },
  {
    "id": 1418689,
    "name": "1185 Wake Forest, NC – Highway 98",
    "listingScore": {
      "listingScoreRank": 86.6,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 2.5,
      "localSeoRankDelta": -10.2
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 50
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2,
        "rankDelta": -19.8
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.8,
        "rankDelta": -1.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 3.3
      }
    ],
    "rankDownKeyword": [],
    "latitude": 35.9662292,
    "longitude": -78.53206449
  },
  {
    "id": 1418688,
    "name": "1256 White Plains, NY - Tarrytown Rd.",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 2.6,
      "localSeoRankDelta": -9.4
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 50
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.9,
        "rankDelta": -17.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.2,
        "rankDelta": -1.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 41.04257399,
    "longitude": -73.7997252
  },
  {
    "id": 1523231,
    "name": "1238 Greensboro, NC - Battleground Ave.",
    "listingScore": {
      "listingScoreRank": 90.7,
      "listingScoreDelta": 10.2
    },
    "localSeoRank": {
      "localSeoRank": 2.6,
      "localSeoRankDelta": -9.8
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 55
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4,
        "rankDelta": -17.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.8,
        "rankDelta": -3.2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 3.5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 36.0965578,
    "longitude": -79.818089
  },
  {
    "id": 1330741,
    "name": "1252 Nampa, ID - N Marketplace Blvd",
    "listingScore": {
      "listingScoreRank": 91.5,
      "listingScoreDelta": 3.5
    },
    "localSeoRank": {
      "localSeoRank": 2.6,
      "localSeoRankDelta": -2.4
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 10
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1,
        "rankDelta": -11
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 3.7,
        "rankDelta": 2.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.2,
        "rankDelta": 1.4
      }
    ],
    "latitude": 43.6106413,
    "longitude": -116.5923199
  },
  {
    "id": 1430516,
    "name": "1318 Denton, TX - W. University Dr.",
    "listingScore": {
      "listingScoreRank": 88,
      "listingScoreDelta": 5.6
    },
    "localSeoRank": {
      "localSeoRank": 2.6,
      "localSeoRankDelta": -8
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 40
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4,
        "rankDelta": -19.6
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 3.8,
        "rankDelta": 0.9
      }
    ],
    "latitude": 33.23029729,
    "longitude": -97.167599
  },
  {
    "id": 1214525,
    "name": "1194 Queensbury, NY - Upper Glen St.",
    "listingScore": {
      "listingScoreRank": 91.4,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 2.7
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 43.3306998,
    "longitude": -73.67061249
  },
  {
    "id": 1338603,
    "name": "1229 - Apple Valley, MN - 149 St. W",
    "listingScore": {
      "listingScoreRank": 87.6,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 2.7,
      "localSeoRankDelta": -5.5
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 33.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2,
        "rankDelta": -15.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.6,
        "rankDelta": -0.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.6,
        "rankDelta": -0.6
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 44.73295299,
    "longitude": -93.2219554
  },
  {
    "id": 862541,
    "name": "1027 - Lancaster, CA - W. Ave K",
    "listingScore": {
      "listingScoreRank": 91.7,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 2.7,
      "localSeoRankDelta": -3.3
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 6.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1,
        "rankDelta": -3.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.9,
        "rankDelta": -1.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.2,
        "rankDelta": -4.6
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 34.6757356,
    "longitude": -118.1481913
  },
  {
    "id": 1534398,
    "name": "1294 West Palm Beach, FL - Palm Beach Lakes Blvd.",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": 2.5
    },
    "localSeoRank": {
      "localSeoRank": 2.7,
      "localSeoRankDelta": -10.2
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 55
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2,
        "rankDelta": -16.9
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.2,
        "rankDelta": -3.5
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 26.7141621,
    "longitude": -80.0943922
  },
  {
    "id": 910966,
    "name": "1075 - Palm Desert, CA - CA 111 - Fred Waring",
    "listingScore": {
      "listingScoreRank": 89,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 2.7,
      "localSeoRankDelta": -0.7
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 3.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4,
        "rankDelta": -0.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.2,
        "rankDelta": -2.1
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 3.6,
        "rankDelta": 0.2
      }
    ],
    "latitude": 33.7267198,
    "longitude": -116.4024286
  },
  {
    "id": 1518381,
    "name": "1361 Florence, KY - Houston Rd.",
    "listingScore": {
      "listingScoreRank": 90.4,
      "listingScoreDelta": 3.2
    },
    "localSeoRank": {
      "localSeoRank": 2.7,
      "localSeoRankDelta": -10.5
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 55
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2,
        "rankDelta": -19.8
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.8,
        "rankDelta": -2.5
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 39.0135998,
    "longitude": -84.63855509
  },
  {
    "id": 1049982,
    "name": "1146 Kenosha, WI - Green Bay Rd.",
    "listingScore": {
      "listingScoreRank": 91.5,
      "listingScoreDelta": -1.4
    },
    "localSeoRank": {
      "localSeoRank": 2.8
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 4.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.8
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 42.57460369,
    "longitude": -87.88673759
  },
  {
    "id": 1249834,
    "name": "1149 Mechanicsburg, PA - Carlisle Pike",
    "listingScore": {
      "listingScoreRank": 86.6,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 2.8
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.4
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 40.242046,
    "longitude": -76.99149
  },
  {
    "id": 1528398,
    "name": "1341 Quakertown, PA – N. West End Blvd.",
    "listingScore": {
      "listingScoreRank": 87.7,
      "listingScoreDelta": 0.9
    },
    "localSeoRank": {
      "localSeoRank": 2.8,
      "localSeoRankDelta": 1
    },
    "localSeoScore": {
      "localSeoScore": 96.7,
      "localSeoScoreDelta": -3.3
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 1.2,
        "rankDelta": -0.4
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 1.2
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 5.9,
        "rankDelta": 3.8
      }
    ],
    "latitude": 40.4484641,
    "longitude": -75.3620404
  },
  {
    "id": 1108060,
    "name": "1112 Salem, OR - Lancaster Dr.",
    "listingScore": {
      "listingScoreRank": 89.1,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 2.9,
      "localSeoRankDelta": -3.7
    },
    "localSeoScore": {
      "localSeoScore": 96.7,
      "localSeoScoreDelta": 6.7
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 5.9,
        "rankDelta": -0.8
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 44.940059,
    "longitude": -122.9861253
  },
  {
    "id": 1017002,
    "name": "1099 Escondido, CA - Auto Pkwy.",
    "listingScore": {
      "listingScoreRank": 86.3,
      "listingScoreDelta": -1.4
    },
    "localSeoRank": {
      "localSeoRank": 2.9,
      "localSeoRankDelta": -1.6
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 2.5
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.2,
        "rankDelta": -2.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.1,
        "rankDelta": -4
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 3.3,
        "rankDelta": 1.6
      }
    ],
    "latitude": 33.1117987,
    "longitude": -117.0993809
  },
  {
    "id": 1271870,
    "name": "1231 Manchester, NH - S. Willow St",
    "listingScore": {
      "listingScoreRank": 90.2,
      "listingScoreDelta": -1.5
    },
    "localSeoRank": {
      "localSeoRank": 3,
      "localSeoRankDelta": -2.2
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 3.3
    },
    "rankUpKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 3.3,
        "rankDelta": -0.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.8,
        "rankDelta": -0.4
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 42.9610039,
    "longitude": -71.4391881
  },
  {
    "id": 1130541,
    "name": "1134 Madison, WI - Sligo Drive - West Place",
    "listingScore": {
      "listingScoreRank": 86.8,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 3,
      "localSeoRankDelta": 1
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 2.4,
        "rankDelta": 0.4
      }
    ],
    "latitude": 43.0612718,
    "longitude": -89.5032749
  },
  {
    "id": 1409251,
    "name": "1242 Brentwood, CA - Lone Tree Way",
    "listingScore": {
      "listingScoreRank": 85.2,
      "listingScoreDelta": -0.3
    },
    "localSeoRank": {
      "localSeoRank": 3,
      "localSeoRankDelta": -3.6
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 25
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.7,
        "rankDelta": -19.3
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 4.1,
        "rankDelta": 2.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.1,
        "rankDelta": 1.1
      }
    ],
    "latitude": 37.9610883,
    "longitude": -121.7488461
  },
  {
    "id": 1207173,
    "name": "1178 Algonquin, IL - S. Randall Rd.",
    "listingScore": {
      "listingScoreRank": 89,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 3
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 4.9
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.8
      }
    ],
    "rankDownKeyword": [],
    "latitude": 42.1547731,
    "longitude": -88.33474609
  },
  {
    "id": 1353978,
    "name": "1276 Gainesville, FL - SW Archer Rd.",
    "listingScore": {
      "listingScoreRank": 85.4,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 3.1
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 29.6244131,
    "longitude": -82.37585539
  },
  {
    "id": 1225443,
    "name": "1192 Ocean Township, NJ - State Route 66",
    "listingScore": {
      "listingScoreRank": 88.8,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 3.1,
      "localSeoRankDelta": 0.4
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4.7
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 3.2,
        "rankDelta": 0.5
      }
    ],
    "latitude": 40.22837289,
    "longitude": -74.04472179
  },
  {
    "id": 1274652,
    "name": "1211 El Paso, TX - Eastlake Blvd",
    "listingScore": {
      "listingScoreRank": 87.7,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 3.1
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 31.6916508,
    "longitude": -106.2642849
  },
  {
    "id": 850013,
    "name": "1028 - San Bernardino, CA - East Harriman",
    "listingScore": {
      "listingScoreRank": 91.5,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 3.3,
      "localSeoRankDelta": -6.1
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 13.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.3,
        "rankDelta": -8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4,
        "rankDelta": -4.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.4,
        "rankDelta": -6
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 34.06702099,
    "longitude": -117.2624756
  },
  {
    "id": 1317049,
    "name": "1042 Cathedral City, CA - Date Palm - Cat City",
    "listingScore": {
      "listingScoreRank": 90.4,
      "listingScoreDelta": 3.5
    },
    "localSeoRank": {
      "localSeoRank": 3.3,
      "localSeoRankDelta": -5.1
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 25
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4,
        "rankDelta": -19.6
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 4.7,
        "rankDelta": 0.5
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.8,
        "rankDelta": 0.1
      }
    ],
    "latitude": 33.8168649,
    "longitude": -116.4586329
  },
  {
    "id": 1520505,
    "name": "1313 Jacksonville, FL - River Marsh Dr.",
    "listingScore": {
      "listingScoreRank": 85.4,
      "listingScoreDelta": 12.8
    },
    "localSeoRank": {
      "localSeoRank": 3.3
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.9
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 30.26167939,
    "longitude": -81.5283785
  },
  {
    "id": 1500131,
    "name": "1344 Newington, CT - Berlin Turnpike",
    "listingScore": {
      "listingScoreRank": 87.5,
      "listingScoreDelta": 1.9
    },
    "localSeoRank": {
      "localSeoRank": 3.3
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 3.7
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.9
      }
    ],
    "rankDownKeyword": [],
    "latitude": 41.6550297,
    "longitude": -72.72509529
  },
  {
    "id": 1018120,
    "name": "1144 San Antonio, TX - Hunt Lane",
    "listingScore": {
      "listingScoreRank": 86.5,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 3.5,
      "localSeoRankDelta": -5.7
    },
    "localSeoScore": {
      "localSeoScore": 96.7,
      "localSeoScoreDelta": 26.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.6,
        "rankDelta": -17.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.7,
        "rankDelta": -4.9
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 5.3,
        "rankDelta": 3
      }
    ],
    "latitude": 29.4455673,
    "longitude": -98.6721544
  },
  {
    "id": 1479664,
    "name": "1334 New Berlin, WI - S. Moorland Rd.",
    "listingScore": {
      "listingScoreRank": 90.7,
      "listingScoreDelta": 12.4
    },
    "localSeoRank": {
      "localSeoRank": 3.5,
      "localSeoRankDelta": -2.4
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 10
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.1,
        "rankDelta": -4.5
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.9,
        "rankDelta": -1.2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 4.5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 42.9771441,
    "longitude": -88.1090857
  },
  {
    "id": 1122625,
    "name": "1156 Warrensville Heights, OH - Richmond Rd. - Harvard Park",
    "listingScore": {
      "listingScoreRank": 86.5,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 3.6
    },
    "localSeoScore": {
      "localSeoScore": 96.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 41.44711239,
    "longitude": -81.49685559
  },
  {
    "id": 1188595,
    "name": "1135 Colorado Springs, CO - Interquest Pkwy.",
    "listingScore": {
      "listingScoreRank": 86.6,
      "listingScoreDelta": -1.4
    },
    "localSeoRank": {
      "localSeoRank": 3.6,
      "localSeoRankDelta": -0.8
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 3.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.4,
        "rankDelta": -0.5
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4.5,
        "rankDelta": -0.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.8,
        "rankDelta": -1.4
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 38.9934509,
    "longitude": -104.8042129
  },
  {
    "id": 1430517,
    "name": "1293 Orland Park, IL - S. LaGrange Rd.",
    "listingScore": {
      "listingScoreRank": 88,
      "listingScoreDelta": 3.4
    },
    "localSeoRank": {
      "localSeoRank": 3.6,
      "localSeoRankDelta": -7.5
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 42
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.8,
        "rankDelta": -18.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.6,
        "rankDelta": -2
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 4.3,
        "rankDelta": 0.3
      }
    ],
    "latitude": 41.6148426,
    "longitude": -87.8527238
  },
  {
    "id": 1500134,
    "name": "1338 Lockport, IL - W. 159th St.",
    "listingScore": {
      "listingScoreRank": 88.4,
      "listingScoreDelta": 6.3
    },
    "localSeoRank": {
      "localSeoRank": 3.6,
      "localSeoRankDelta": -3.3
    },
    "localSeoScore": {
      "localSeoScore": 96.7,
      "localSeoScoreDelta": 6.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.3,
        "rankDelta": -5.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 6,
        "rankDelta": -1.1
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 3.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 41.5972697,
    "longitude": -88.0175109
  },
  {
    "id": 1214475,
    "name": "1097 Webster, TX - Eastfield Dr. - Baybrook",
    "listingScore": {
      "listingScoreRank": 88.8,
      "listingScoreDelta": -1.3
    },
    "localSeoRank": {
      "localSeoRank": 3.7
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.9
      }
    ],
    "rankDownKeyword": [],
    "latitude": 29.5553715,
    "longitude": -95.1508032
  },
  {
    "id": 1305756,
    "name": "1218 Marana, AZ - W. Costco Dr.",
    "listingScore": {
      "listingScoreRank": 86.5,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 3.7,
      "localSeoRankDelta": -0.7
    },
    "localSeoScore": {
      "localSeoScore": 96.7,
      "localSeoScoreDelta": -3.3
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 4.6,
        "rankDelta": -0.2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.3
      }
    ],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 5.2,
        "rankDelta": 1.2
      }
    ],
    "latitude": 32.3276285,
    "longitude": -111.0488054
  },
  {
    "id": 1676793,
    "name": "1417 Montgomery, AL - Eastchase Pkwy.",
    "listingScore": {
      "listingScoreRank": 89.6,
      "listingScoreDelta": 9.7
    },
    "localSeoRank": {
      "localSeoRank": 3.7
    },
    "localSeoScore": {
      "localSeoScore": 96.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.9
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 32.36178859,
    "longitude": -86.1626805
  },
  {
    "id": 1528397,
    "name": "1291 Buford, GA - Buford Dr.",
    "listingScore": {
      "listingScoreRank": 88.2,
      "listingScoreDelta": 8.9
    },
    "localSeoRank": {
      "localSeoRank": 3.8
    },
    "localSeoScore": {
      "localSeoScore": 96.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.9
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 34.0525398,
    "longitude": -83.9936218
  },
  {
    "id": 1122626,
    "name": "1182 Chelmsford, MA - Drum Hill Rd.",
    "listingScore": {
      "listingScoreRank": 90.4,
      "listingScoreDelta": 0
    },
    "localSeoRank": {
      "localSeoRank": 3.9
    },
    "localSeoScore": {
      "localSeoScore": 96.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 8.1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.8
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 42.6250116,
    "longitude": -71.36063759
  },
  {
    "id": 1225446,
    "name": "1205 Seattle, WA - E. Pike St.",
    "listingScore": {
      "listingScoreRank": 86.8,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 4,
      "localSeoRankDelta": -8.1
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 40
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 3.4,
        "rankDelta": -8.7
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 4.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.9
      }
    ],
    "rankDownKeyword": [],
    "latitude": 47.6142778,
    "longitude": -122.3165507
  },
  {
    "id": 1225445,
    "name": "1163 San Antonio, TX - SE Military - La Picosa",
    "listingScore": {
      "listingScoreRank": 87.9,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 4,
      "localSeoRankDelta": -2.3
    },
    "localSeoScore": {
      "localSeoScore": 96.7,
      "localSeoScoreDelta": 6.7
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 4.5,
        "rankDelta": -1.8
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.5
      },
      {
        "name": "chicken restaurants near me",
        "rank": 6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 29.3505065,
    "longitude": -98.4491651
  },
  {
    "id": 981819,
    "name": "1090 - Folsom, CA - Iron Pt. Rd",
    "listingScore": {
      "listingScoreRank": 91.5,
      "listingScoreDelta": 2.5
    },
    "localSeoRank": {
      "localSeoRank": 4
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 38.6450571,
    "longitude": -121.1234089
  },
  {
    "id": 1479663,
    "name": "1305 Sparks, NV - E. Lincoln Way",
    "listingScore": {
      "listingScoreRank": 89.6,
      "listingScoreDelta": 10.2
    },
    "localSeoRank": {
      "localSeoRank": 4,
      "localSeoRankDelta": -8.7
    },
    "localSeoScore": {
      "localSeoScore": 96.7,
      "localSeoScoreDelta": 51.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4,
        "rankDelta": -15
      },
      {
        "name": "Chicken restaurant",
        "rank": 5,
        "rankDelta": -4
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 5.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 39.53331949,
    "longitude": -119.7177914
  },
  {
    "id": 1416264,
    "name": "1270 Vestavia Hills, AL - Montgomery Hwy",
    "listingScore": {
      "listingScoreRank": 87.7,
      "listingScoreDelta": 10.1
    },
    "localSeoRank": {
      "localSeoRank": 4.1,
      "localSeoRankDelta": -6
    },
    "localSeoScore": {
      "localSeoScore": 95,
      "localSeoScoreDelta": 13
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.5,
        "rankDelta": -7.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 6.7,
        "rankDelta": -4
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 33.4485272,
    "longitude": -86.7910766
  },
  {
    "id": 1288360,
    "name": "1085 McKinney, TX - Hwy 380 & Hardin Blvd.",
    "listingScore": {
      "listingScoreRank": 88.2,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 4.1
    },
    "localSeoScore": {
      "localSeoScore": 96.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.5
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 33.21841899,
    "longitude": -96.6663135
  },
  {
    "id": 1272506,
    "name": "1214 Tampa, FL - N Dale Mabry Hwy",
    "listingScore": {
      "listingScoreRank": 89,
      "listingScoreDelta": -1.4
    },
    "localSeoRank": {
      "localSeoRank": 4.1
    },
    "localSeoScore": {
      "localSeoScore": 100
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 27.9657331,
    "longitude": -82.5048937
  },
  {
    "id": 1484640,
    "name": "1336 Olathe, KS - W 119th St",
    "listingScore": {
      "listingScoreRank": 89.5,
      "listingScoreDelta": -0.3
    },
    "localSeoRank": {
      "localSeoRank": 4.2,
      "localSeoRankDelta": -8.9
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 53.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.6,
        "rankDelta": -14
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.2,
        "rankDelta": -5.2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 5.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 38.9122659,
    "longitude": -94.7623228
  },
  {
    "id": 1492945,
    "name": "1359 Kissimmee, FL - W. Irlo Bronson Hwy.",
    "listingScore": {
      "listingScoreRank": 87.9,
      "listingScoreDelta": 3.6
    },
    "localSeoRank": {
      "localSeoRank": 4.2,
      "localSeoRankDelta": -8.5
    },
    "localSeoScore": {
      "localSeoScore": 96.7,
      "localSeoScoreDelta": 36.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.4,
        "rankDelta": -9.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.4,
        "rankDelta": -9
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 5.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 28.3335169,
    "longitude": -81.5294509
  },
  {
    "id": 1027015,
    "name": "1141 Madison, WI - Annamark Drive - East",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 4.2
    },
    "localSeoScore": {
      "localSeoScore": 93.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 5.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.8
      }
    ],
    "rankDownKeyword": [],
    "latitude": 43.1322625,
    "longitude": -89.30096
  },
  {
    "id": 1424921,
    "name": "1327 Highlands Ranch, CO - Mayberry Dr.",
    "listingScore": {
      "listingScoreRank": 90.2,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 4.3,
      "localSeoRankDelta": -0.8
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 6.7
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 4.9,
        "rankDelta": -0.5
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 3.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 39.5455889,
    "longitude": -105.0036935
  },
  {
    "id": 939738,
    "name": "1122 - Lexington, KY – Richmond Rd",
    "listingScore": {
      "listingScoreRank": 90.4,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 4.3
    },
    "localSeoScore": {
      "localSeoScore": 96.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 6
      },
      {
        "name": "Chicken restaurant",
        "rank": 5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 38.0098754,
    "longitude": -84.45629719
  },
  {
    "id": 1214523,
    "name": "1177 Phoenix, AZ - East Bell Rd. - Moon Valley",
    "listingScore": {
      "listingScoreRank": 87.9,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 4.4
    },
    "localSeoScore": {
      "localSeoScore": 96.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.7
      },
      {
        "name": "chicken restaurants near me",
        "rank": 8.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 33.6399201,
    "longitude": -112.0669657
  },
  {
    "id": 910385,
    "name": "1056 - Clackamas, OR - Sunnyside Rd.",
    "listingScore": {
      "listingScoreRank": 90.2,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 4.4,
      "localSeoRankDelta": -5.9
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 20
    },
    "rankUpKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 4.5,
        "rankDelta": -3.9
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.4,
        "rankDelta": -5.5
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 45.4335656,
    "longitude": -122.5632132
  },
  {
    "id": 1542069,
    "name": "1309 Lebanon, PA - Quentin Rd.",
    "listingScore": {
      "listingScoreRank": 87.4,
      "listingScoreDelta": -0.9
    },
    "localSeoRank": {
      "localSeoRank": 4.4
    },
    "localSeoScore": {
      "localSeoScore": 96.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 6.3
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.3
      }
    ],
    "rankDownKeyword": [],
    "latitude": 40.3172258,
    "longitude": -76.423812
  },
  {
    "id": 1500132,
    "name": "1311 Magnolia, TX - FM 2978",
    "listingScore": {
      "listingScoreRank": 87.1,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 4.4,
      "localSeoRankDelta": -8.7
    },
    "localSeoScore": {
      "localSeoScore": 96.7,
      "localSeoScoreDelta": 51.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4,
        "rankDelta": -19.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.4,
        "rankDelta": -2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 8.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 30.2167408,
    "longitude": -95.5674545
  },
  {
    "id": 1416266,
    "name": "1325 Jeffersonville, IN - Town Center Blvd.",
    "listingScore": {
      "listingScoreRank": 83.2,
      "listingScoreDelta": 10.1
    },
    "localSeoRank": {
      "localSeoRank": 4.5,
      "localSeoRankDelta": -6.7
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 39.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.3,
        "rankDelta": -19.7
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.6,
        "rankDelta": -0.5
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 6.7,
        "rankDelta": 0.4
      }
    ],
    "latitude": 38.32620219,
    "longitude": -85.74740679
  },
  {
    "id": 1394005,
    "name": "1241 Toledo, OH - Monroe St.",
    "listingScore": {
      "listingScoreRank": 83.5,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 4.5,
      "localSeoRankDelta": 3.5
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": -10
    },
    "rankUpKeyword": [
      {
        "name": "daves hot chicken",
        "rank": 1,
        "rankDelta": 0
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "dave hot chicken",
        "rank": 1,
        "rankDelta": 0
      },
      {
        "name": "Halal restaurant",
        "rank": 12.1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 6
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.8
      },
      {
        "name": "dave's hot chicken toledo",
        "rank": 1,
        "rankDelta": 0
      }
    ],
    "rankDownKeyword": [],
    "latitude": 41.70163389,
    "longitude": -83.65338269
  },
  {
    "id": 1235371,
    "name": "1168 Edinburg, TX - E. Trenton Rd.",
    "listingScore": {
      "listingScoreRank": 88,
      "listingScoreDelta": -1.5
    },
    "localSeoRank": {
      "localSeoRank": 4.5,
      "localSeoRankDelta": -5.8
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 30
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.5,
        "rankDelta": -19.5
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.4,
        "rankDelta": -0.1
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 6.7,
        "rankDelta": 2.2
      }
    ],
    "latitude": 26.2623848,
    "longitude": -98.1713518
  },
  {
    "id": 772813,
    "name": "1012 - El Cajon, CA - Fletcher Pkwy.",
    "listingScore": {
      "listingScoreRank": 89,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 4.5,
      "localSeoRankDelta": -2.3
    },
    "localSeoScore": {
      "localSeoScore": 100,
      "localSeoScoreDelta": 6.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 4.5,
        "rankDelta": -5.5
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.2,
        "rankDelta": -2.8
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 4.9,
        "rankDelta": 1.3
      }
    ],
    "latitude": 32.80796629,
    "longitude": -116.9639974
  },
  {
    "id": 1235946,
    "name": "1217 Pleasant Hill, CA - Monument Blvd",
    "listingScore": {
      "listingScoreRank": 85.2,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 4.5,
      "localSeoRankDelta": -6.2
    },
    "localSeoScore": {
      "localSeoScore": 96.7,
      "localSeoScoreDelta": 33.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.2,
        "rankDelta": -17.8
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.9,
        "rankDelta": -2.2
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 5.5,
        "rankDelta": 1.4
      }
    ],
    "latitude": 37.94474,
    "longitude": -122.056004
  },
  {
    "id": 1069359,
    "name": "1065 Visalia, CA",
    "listingScore": {
      "listingScoreRank": 87.7,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 4.6
    },
    "localSeoScore": {
      "localSeoScore": 96.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 6.7
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.9
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 36.3009609,
    "longitude": -119.3141897
  },
  {
    "id": 992008,
    "name": "1138 McAllen, TX - W. Expressway 83",
    "listingScore": {
      "listingScoreRank": 88,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 4.6,
      "localSeoRankDelta": -1.6
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.6,
        "rankDelta": -0.8
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.3,
        "rankDelta": -3.2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 6.8
      }
    ],
    "rankDownKeyword": [],
    "latitude": 26.1955451,
    "longitude": -98.2630521
  },
  {
    "id": 1009083,
    "name": "1081 - College Station, TX - Texas Ave S.",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 4.7,
      "localSeoRankDelta": 1.5
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": -6.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.7,
        "rankDelta": -2.2
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 6.8,
        "rankDelta": 3.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.6,
        "rankDelta": 2.8
      }
    ],
    "latitude": 30.6158902,
    "longitude": -96.3208939
  },
  {
    "id": 1543802,
    "name": "1047 Springfield, OR - Mohawk Blvd.",
    "listingScore": {
      "listingScoreRank": 87.1,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 4.7
    },
    "localSeoScore": {
      "localSeoScore": 93.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 6.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 44.0591191,
    "longitude": -123.0004153
  },
  {
    "id": 1072845,
    "name": "1137 Mission Viejo, CA - Alicia Pkwy",
    "listingScore": {
      "listingScoreRank": 87.7,
      "listingScoreDelta": -1.4
    },
    "localSeoRank": {
      "localSeoRank": 4.7
    },
    "localSeoScore": {
      "localSeoScore": 96.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 33.6070899,
    "longitude": -117.6890945
  },
  {
    "id": 1500133,
    "name": "1277 Boca Raton, FL - SR-7 N.",
    "listingScore": {
      "listingScoreRank": 83.4,
      "listingScoreDelta": 1.9
    },
    "localSeoRank": {
      "localSeoRank": 4.7
    },
    "localSeoScore": {
      "localSeoScore": 93.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5.7
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 26.3693474,
    "longitude": -80.202517
  },
  {
    "id": 1493815,
    "name": "1303 Roseville, CA - Fairview Dr.",
    "listingScore": {
      "listingScoreRank": 84.4,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 4.8,
      "localSeoRankDelta": -1.8
    },
    "localSeoScore": {
      "localSeoScore": 96.7,
      "localSeoScoreDelta": 6.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.2,
        "rankDelta": -5
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.4,
        "rankDelta": -2.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 8.8
      }
    ],
    "rankDownKeyword": [],
    "latitude": 38.7898547,
    "longitude": -121.2839381
  },
  {
    "id": 1342757,
    "name": "1260 Chino Hills, CA - Chino Hills Pkwy",
    "listingScore": {
      "listingScoreRank": 86.3,
      "listingScoreDelta": 5.6
    },
    "localSeoRank": {
      "localSeoRank": 4.9,
      "localSeoRankDelta": -5.2
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 25.8
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.1,
        "rankDelta": -17.9
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5.6,
        "rankDelta": -1.8
      },
      {
        "name": "Chicken restaurant",
        "rank": 6,
        "rankDelta": -0.5
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 33.9820778,
    "longitude": -117.7059248
  },
  {
    "id": 1484643,
    "name": "1166 Miami, FL - NW 2nd Ave. - Wynwood",
    "listingScore": {
      "listingScoreRank": 88,
      "listingScoreDelta": 3.6
    },
    "localSeoRank": {
      "localSeoRank": 4.9,
      "localSeoRankDelta": -12.1
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 63.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2,
        "rankDelta": -19
      },
      {
        "name": "Chicken restaurant",
        "rank": 6.4,
        "rankDelta": -6.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 6.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 25.8004148,
    "longitude": -80.1988989
  },
  {
    "id": 1346773,
    "name": "1223 Shelby Township, MI - Hall Rd",
    "listingScore": {
      "listingScoreRank": 87.1,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 5,
      "localSeoRankDelta": -8.8
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 36.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.8,
        "rankDelta": -18.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5,
        "rankDelta": -5.8
      },
      {
        "name": "Chicken restaurant",
        "rank": 7.2,
        "rankDelta": -2.4
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 42.62905689,
    "longitude": -82.99244689
  },
  {
    "id": 1512060,
    "name": "1240 Carle Place, NY - Glen Clove Rd.",
    "listingScore": {
      "listingScoreRank": 89.5,
      "listingScoreDelta": 3.5
    },
    "localSeoRank": {
      "localSeoRank": 5.2
    },
    "localSeoScore": {
      "localSeoScore": 93.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 5.9
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 40.7471728,
    "longitude": -73.61680299
  },
  {
    "id": 1503386,
    "name": "1370 Fort Worth, TX - Tracewood Way",
    "listingScore": {
      "listingScoreRank": 86.9,
      "listingScoreDelta": 3.4
    },
    "localSeoRank": {
      "localSeoRank": 5.4,
      "localSeoRankDelta": -5.8
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 18.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.7,
        "rankDelta": -8.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 7,
        "rankDelta": -5.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 7.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 32.9152324,
    "longitude": -97.3098996
  },
  {
    "id": 1174902,
    "name": "1208 Southfield, MI - Telegraph Rd",
    "listingScore": {
      "listingScoreRank": 87.1,
      "listingScoreDelta": 3
    },
    "localSeoRank": {
      "localSeoRank": 5.4,
      "localSeoRankDelta": -3.2
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 3.3
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 5.8,
        "rankDelta": -2.8
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7.5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 42.499211,
    "longitude": -83.28440209
  },
  {
    "id": 1062771,
    "name": "1128 Oceanside, CA - Oceanside Blvd.",
    "listingScore": {
      "listingScoreRank": 87.7,
      "listingScoreDelta": -1.4
    },
    "localSeoRank": {
      "localSeoRank": 5.4,
      "localSeoRankDelta": 1.2
    },
    "localSeoScore": {
      "localSeoScore": 96.7,
      "localSeoScoreDelta": 1.7
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 4,
        "rankDelta": -1.5
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 7.8
      }
    ],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 4.2,
        "rankDelta": 1.4
      }
    ],
    "latitude": 33.2069844,
    "longitude": -117.28435
  },
  {
    "id": 1528399,
    "name": "1367 Rochester, NY – E. Ridge Rd.",
    "listingScore": {
      "listingScoreRank": 85.8,
      "listingScoreDelta": 9.9
    },
    "localSeoRank": {
      "localSeoRank": 5.5,
      "localSeoRankDelta": -8.6
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 48.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 5.6,
        "rankDelta": -13.7
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.9,
        "rankDelta": -4
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 43.1973537,
    "longitude": -77.58344219
  },
  {
    "id": 772877,
    "name": "1015 - Denver, CO - Broadway - Neon Local",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 5.5,
      "localSeoRankDelta": -8.5
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 70
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.7,
        "rankDelta": -12.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7.8,
        "rankDelta": -3.5
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.8,
        "rankDelta": -9.4
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 39.7150072,
    "longitude": -104.9880187
  },
  {
    "id": 1623893,
    "name": "1419 Greenville, NC - Red Banks Rd.",
    "listingScore": {
      "listingScoreRank": 87.6,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 5.5
    },
    "localSeoScore": {
      "localSeoScore": 86.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 12.3
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 35.5807523,
    "longitude": -77.37789189
  },
  {
    "id": 1175373,
    "name": "1204 Midvale, UT - Fort Union Blvd",
    "listingScore": {
      "listingScoreRank": 82.1,
      "listingScoreDelta": 0
    },
    "localSeoRank": {
      "localSeoRank": 5.5,
      "localSeoRankDelta": -3.5
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 3.3
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 6.5,
        "rankDelta": -2.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 40.6215019,
    "longitude": -111.8648001
  },
  {
    "id": 719012,
    "name": "1004 - Pacific Beach - Garnet Ave.",
    "listingScore": {
      "listingScoreRank": 86.8,
      "listingScoreDelta": 5.2
    },
    "localSeoRank": {
      "localSeoRank": 5.6,
      "localSeoRankDelta": -4.7
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 13.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 4.3,
        "rankDelta": -6.8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 6.8,
        "rankDelta": -2.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.6,
        "rankDelta": -4.9
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 32.7972729,
    "longitude": -117.2514938
  },
  {
    "id": 1008826,
    "name": "1133 - Wayne, NJ - Willowbrook Blvd.",
    "listingScore": {
      "listingScoreRank": 86.9,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 5.6,
      "localSeoRankDelta": -5.4
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 22.5
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 6.6,
        "rankDelta": -13.4
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5.3,
        "rankDelta": -3
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.1,
        "rankDelta": -3.6
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 40.8894438,
    "longitude": -74.2508699
  },
  {
    "id": 1310184,
    "name": "1123 Columbus, OH - Polaris Parkway - Westerville",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": 2.5
    },
    "localSeoRank": {
      "localSeoRank": 5.6,
      "localSeoRankDelta": -6.1
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 33.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 4.7,
        "rankDelta": -16.3
      },
      {
        "name": "chicken restaurants near me",
        "rank": 6.7,
        "rankDelta": -0.9
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.3,
        "rankDelta": -1.2
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 40.1451468,
    "longitude": -82.95774009
  },
  {
    "id": 1054256,
    "name": "1152 Schererville, IN - US Hwy 41",
    "listingScore": {
      "listingScoreRank": 86.6,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 5.6,
      "localSeoRankDelta": 0
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": -1.7
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 4,
        "rankDelta": -2.5
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 7.6
      }
    ],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 5.1,
        "rankDelta": 0.3
      }
    ],
    "latitude": 41.521013,
    "longitude": -87.4705157
  },
  {
    "id": 852259,
    "name": "1011 - San Diego, CA - Westview Parkway - Mira Mesa",
    "listingScore": {
      "listingScoreRank": 89.6,
      "listingScoreDelta": 2.5
    },
    "localSeoRank": {
      "localSeoRank": 5.7,
      "localSeoRankDelta": -3.7
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 15
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 5.6,
        "rankDelta": -7
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 5.4
      }
    ],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 6,
        "rankDelta": 0
      }
    ],
    "latitude": 32.91587899,
    "longitude": -117.1208453
  },
  {
    "id": 1407233,
    "name": "1174 Columbia, MD - Columbia Crossing",
    "listingScore": {
      "listingScoreRank": 80.7,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 5.8,
      "localSeoRankDelta": -7.2
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 48.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 4.8,
        "rankDelta": -15.7
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 6.9
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 5.6,
        "rankDelta": 0.2
      }
    ],
    "latitude": 39.195849,
    "longitude": -76.81237949
  },
  {
    "id": 897454,
    "name": "1058 - Union City, CA - Dyer St.",
    "listingScore": {
      "listingScoreRank": 88.2,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 5.8,
      "localSeoRankDelta": -5.6
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 30
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 6.8,
        "rankDelta": -10.8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5.4,
        "rankDelta": -1.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.2,
        "rankDelta": -4.4
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 37.5992833,
    "longitude": -122.0685197
  },
  {
    "id": 860936,
    "name": "1030 - Denver, CO - Platte St. Circa",
    "listingScore": {
      "listingScoreRank": 89.5,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 5.8,
      "localSeoRankDelta": -5.2
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 20
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.4,
        "rankDelta": -8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7.9,
        "rankDelta": -3.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 7,
        "rankDelta": -4.4
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 39.7577967,
    "longitude": -105.0077262
  },
  {
    "id": 1014657,
    "name": "1148 - West Covina, CA - S. Citrus Street",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 5.8,
      "localSeoRankDelta": -10.1
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 80.8
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.7,
        "rankDelta": -9.4
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7,
        "rankDelta": -10
      },
      {
        "name": "Chicken restaurant",
        "rank": 6.7,
        "rankDelta": -11.5
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 34.0694083,
    "longitude": -117.8897761
  },
  {
    "id": 1503387,
    "name": "1328 Edmonton, AB - 102 Ave. NW.",
    "listingScore": {
      "listingScoreRank": 84.7,
      "listingScoreDelta": 2.5
    },
    "localSeoRank": {
      "localSeoRank": 5.9,
      "localSeoRankDelta": -12.3
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 90
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 5.7,
        "rankDelta": -9.8
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 6.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 53.54321,
    "longitude": -113.50801
  },
  {
    "id": 1288359,
    "name": "1189 San Diego, CA - Camino De La Reina - Mission Valley",
    "listingScore": {
      "listingScoreRank": 84.6,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 5.9
    },
    "localSeoScore": {
      "localSeoScore": 93.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 6.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 32.7711866,
    "longitude": -117.142437
  },
  {
    "id": 906880,
    "name": "1087 - Indianapolis, IN - Massachusetts Ave. - Penrose",
    "listingScore": {
      "listingScoreRank": 87.1,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 5.9,
      "localSeoRankDelta": -4.6
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 15
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.7,
        "rankDelta": -11.1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5.6,
        "rankDelta": -2.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 10.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 39.7748028,
    "longitude": -86.1502154
  },
  {
    "id": 1558334,
    "name": "1248 Greenwood Village, CO - Arapahoe Rd.",
    "listingScore": {
      "listingScoreRank": 88.5,
      "listingScoreDelta": 1.1
    },
    "localSeoRank": {
      "localSeoRank": 5.9,
      "localSeoRankDelta": -8.6
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 48.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.9,
        "rankDelta": -18.7
      },
      {
        "name": "Chicken restaurant",
        "rank": 7.8,
        "rankDelta": -0.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 8
      }
    ],
    "rankDownKeyword": [],
    "latitude": 39.5951863,
    "longitude": -104.8911356
  },
  {
    "id": 858977,
    "name": "1041 - Dearborn, MI - Michigan Ave.",
    "listingScore": {
      "listingScoreRank": 89.6,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 5.9,
      "localSeoRankDelta": -10.1
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 60
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 5.2,
        "rankDelta": -14.9
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7.1,
        "rankDelta": -6.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.4,
        "rankDelta": -9.1
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 42.30548249,
    "longitude": -83.2483039
  },
  {
    "id": 1438842,
    "name": "1300 Mesquite, TX – N. Town E. Blvd.",
    "listingScore": {
      "listingScoreRank": 85.8,
      "listingScoreDelta": 7.7
    },
    "localSeoRank": {
      "localSeoRank": 6,
      "localSeoRankDelta": -9
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 48.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4,
        "rankDelta": -19.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 7.3,
        "rankDelta": -1.7
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 9.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 32.8112987,
    "longitude": -96.61874929
  },
  {
    "id": 871690,
    "name": "1022 - Beaverton, OR - SW Cedar Hills Blvd.",
    "listingScore": {
      "listingScoreRank": 83.3,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 6,
      "localSeoRankDelta": -5.7
    },
    "localSeoScore": {
      "localSeoScore": 78.3,
      "localSeoScoreDelta": 23.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.9,
        "rankDelta": -12.1
      },
      {
        "name": "food near me",
        "rank": 11.1,
        "rankDelta": -8.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.8,
        "rankDelta": -1.9
      },
      {
        "name": "restaurants",
        "rank": 16.5,
        "rankDelta": -4
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.4,
        "rankDelta": -7.8
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "daves hot chicken",
        "rank": 1.2,
        "rankDelta": 0
      }
    ],
    "rankDownKeyword": [],
    "latitude": 45.5015232,
    "longitude": -122.8071683
  },
  {
    "id": 1413754,
    "name": "1279 East Brunswick, NJ – NJ-18",
    "listingScore": {
      "listingScoreRank": 86.4,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 6,
      "localSeoRankDelta": -8.3
    },
    "localSeoScore": {
      "localSeoScore": 95,
      "localSeoScoreDelta": 65
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 3.7,
        "rankDelta": -2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 8.3
      }
    ],
    "rankDownKeyword": [],
    "latitude": 40.4546751,
    "longitude": -74.39934359
  },
  {
    "id": 854840,
    "name": "1034 - Menifee, CA - Newport Rd.",
    "listingScore": {
      "listingScoreRank": 86.9,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 6,
      "localSeoRankDelta": -2.5
    },
    "localSeoScore": {
      "localSeoScore": 81.7,
      "localSeoScoreDelta": 16.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2,
        "rankDelta": -3.8
      },
      {
        "name": "food near me",
        "rank": 9.9,
        "rankDelta": -5.4
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.6,
        "rankDelta": -1.2
      },
      {
        "name": "restaurants",
        "rank": 18.9,
        "rankDelta": -1.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.4,
        "rankDelta": -3.5
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "daves hot chicken",
        "rank": 1,
        "rankDelta": 0
      }
    ],
    "rankDownKeyword": [],
    "latitude": 33.6846811,
    "longitude": -117.1794203
  },
  {
    "id": 1366083,
    "name": "1158 - Glen Burnie, MD - Ritchie Hwy",
    "listingScore": {
      "listingScoreRank": 81.9,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 6.1
    },
    "localSeoScore": {
      "localSeoScore": 93.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 5
      },
      {
        "name": "chicken restaurants near me",
        "rank": 6.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 6.8
      }
    ],
    "rankDownKeyword": [],
    "latitude": 39.194106,
    "longitude": -76.61276099
  },
  {
    "id": 1386986,
    "name": "1155 Aventura, FL – Biscayne Blvd.",
    "listingScore": {
      "listingScoreRank": 80.2,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 6.1,
      "localSeoRankDelta": 5
    },
    "localSeoScore": {
      "localSeoScore": 80,
      "localSeoScoreDelta": -20
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "dave hot chicken",
        "rank": 1.1,
        "rankDelta": 0
      },
      {
        "name": "Halal restaurant",
        "rank": 21
      },
      {
        "name": "dave's hot chicken, biscayne boulevard, aventura, fl",
        "rank": 1,
        "rankDelta": 0
      },
      {
        "name": "chicken restaurants near me",
        "rank": 6.5
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.6
      }
    ],
    "rankDownKeyword": [
      {
        "name": "daves hot chicken",
        "rank": 1.2,
        "rankDelta": 0.1
      }
    ],
    "latitude": 25.949042,
    "longitude": -80.1457042
  },
  {
    "id": 1131688,
    "name": "1154 Monrovia, CA - W. Huntington Dr.",
    "listingScore": {
      "listingScoreRank": 83.2,
      "listingScoreDelta": -1.2
    },
    "localSeoRank": {
      "localSeoRank": 6.2,
      "localSeoRankDelta": -3.5
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 3.3
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 7.2,
        "rankDelta": -2.5
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 34.1400279,
    "longitude": -118.0105119
  },
  {
    "id": 882118,
    "name": "1096 - Menomonee Falls, WI - Falls Pkwy",
    "listingScore": {
      "listingScoreRank": 86.9,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 6.2,
      "localSeoRankDelta": -0.5
    },
    "localSeoScore": {
      "localSeoScore": 81.7,
      "localSeoScoreDelta": 6.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.7,
        "rankDelta": -1.1
      },
      {
        "name": "food near me",
        "rank": 8.9,
        "rankDelta": -4.4
      },
      {
        "name": "daves hot chicken",
        "rank": 1.2,
        "rankDelta": 0
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 4.1,
        "rankDelta": 1.1
      },
      {
        "name": "restaurants",
        "rank": 17.9,
        "rankDelta": 0.9
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.2,
        "rankDelta": 0.4
      }
    ],
    "latitude": 43.1853537,
    "longitude": -88.1096472
  },
  {
    "id": 897807,
    "name": "1061 - Wilmington, NC - Oleander Dr.",
    "listingScore": {
      "listingScoreRank": 84.9,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 6.2,
      "localSeoRankDelta": -1.1
    },
    "localSeoScore": {
      "localSeoScore": 80,
      "localSeoScoreDelta": 4
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.2,
        "rankDelta": -5.6
      },
      {
        "name": "food near me",
        "rank": 19,
        "rankDelta": -1.9
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4.1,
        "rankDelta": -2.5
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "daves hot chicken",
        "rank": 1,
        "rankDelta": 0
      },
      {
        "name": "dave's hot chicken",
        "rank": 1,
        "rankDelta": 0
      },
      {
        "name": "Chicken restaurant",
        "rank": 10.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 34.2153161,
    "longitude": -77.9052634
  },
  {
    "id": 1477430,
    "name": "1330 Homewood, IL - S Halsted St.",
    "listingScore": {
      "listingScoreRank": 85.8,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 6.2,
      "localSeoRankDelta": -3
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 18.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.3,
        "rankDelta": -3.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 7.7,
        "rankDelta": -6.2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 9.7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 41.56882989,
    "longitude": -87.63538779
  },
  {
    "id": 1360970,
    "name": "1250 Fargo, ND - 45th St.",
    "listingScore": {
      "listingScoreRank": 86,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 6.4
    },
    "localSeoScore": {
      "localSeoScore": 90
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 11.5
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 46.8549152,
    "longitude": -96.8596259
  },
  {
    "id": 1148048,
    "name": "1145 Overland Park, KS - Metcalf Ave.",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 6.4,
      "localSeoRankDelta": -6
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 33.3
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 7.9,
        "rankDelta": -4.5
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 8.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 38.9646093,
    "longitude": -94.6666826
  },
  {
    "id": 1667973,
    "name": "1314 Henderson, NV - S. Eastern Ave",
    "listingScore": {
      "listingScoreRank": 88.5,
      "listingScoreDelta": -0.6
    },
    "localSeoRank": {
      "localSeoRank": 6.4
    },
    "localSeoScore": {
      "localSeoScore": 93.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 8.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 8
      }
    ],
    "rankDownKeyword": [],
    "latitude": 36.0004729,
    "longitude": -115.1055811
  },
  {
    "id": 1181846,
    "name": "1161 El Cerrito, CA - El Cerrito Plaza",
    "listingScore": {
      "listingScoreRank": 86.9,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 6.5
    },
    "localSeoScore": {
      "localSeoScore": 90
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 6.3
      },
      {
        "name": "chicken restaurants near me",
        "rank": 6.9
      },
      {
        "name": "Chicken restaurant",
        "rank": 6.3
      }
    ],
    "rankDownKeyword": [],
    "latitude": 37.9007147,
    "longitude": -122.3000107
  },
  {
    "id": 833716,
    "name": "1009 - Las Vegas, NV - Sahara Ave.",
    "listingScore": {
      "listingScoreRank": 88,
      "listingScoreDelta": 0
    },
    "localSeoRank": {
      "localSeoRank": 6.5,
      "localSeoRankDelta": -4.2
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 16.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 4,
        "rankDelta": -8.4
      },
      {
        "name": "chicken restaurants near me",
        "rank": 8.2,
        "rankDelta": -1
      },
      {
        "name": "Chicken restaurant",
        "rank": 7.4,
        "rankDelta": -3.1
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 36.14475319,
    "longitude": -115.2956746
  },
  {
    "id": 937719,
    "name": "1089 - Woburn, MA - Mishawum Road",
    "listingScore": {
      "listingScoreRank": 89.3,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 6.6
    },
    "localSeoScore": {
      "localSeoScore": 93.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 11
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4.5
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.3
      }
    ],
    "rankDownKeyword": [],
    "latitude": 42.5046916,
    "longitude": -71.13244469
  },
  {
    "id": 992007,
    "name": "1044 San Leandro, CA - East 14th St.",
    "listingScore": {
      "listingScoreRank": 88.2,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 6.6,
      "localSeoRankDelta": -3.1
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 10
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 5.8,
        "rankDelta": -6.9
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7.2,
        "rankDelta": -0.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 6.8,
        "rankDelta": -2.2
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 37.7236229,
    "longitude": -122.1543887
  },
  {
    "id": 1395787,
    "name": "1244 Canton, OH - Whipple Ave.",
    "listingScore": {
      "listingScoreRank": 82.1,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 6.7,
      "localSeoRankDelta": -6.3
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 56.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 9.3,
        "rankDelta": -8.5
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 5.3
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 5.6,
        "rankDelta": 2
      }
    ],
    "latitude": 40.861347,
    "longitude": -81.422165
  },
  {
    "id": 1232001,
    "name": "1203 Holly Springs, NC - Grand Hill Place",
    "listingScore": {
      "listingScoreRank": 89.5,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 6.8
    },
    "localSeoScore": {
      "localSeoScore": 90
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 6.1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 7
      }
    ],
    "rankDownKeyword": [],
    "latitude": 35.6608825,
    "longitude": -78.8499123
  },
  {
    "id": 1401170,
    "name": "1259 Lewisville, TX – W. Main St.",
    "listingScore": {
      "listingScoreRank": 87.1,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 6.8,
      "localSeoRankDelta": -10.2
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 68.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.6,
        "rankDelta": -18.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 8.5,
        "rankDelta": -4.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 9.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 33.0453192,
    "longitude": -97.0117591
  },
  {
    "id": 986562,
    "name": "1114 Altamonte Springs, FL - Cranes Roost Blvd.",
    "listingScore": {
      "listingScoreRank": 83,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 7,
      "localSeoRankDelta": -6.6
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 47.5
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 5.2,
        "rankDelta": -10.5
      },
      {
        "name": "chicken restaurants near me",
        "rank": 8.2,
        "rankDelta": -3.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 7.6,
        "rankDelta": -6.1
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 28.6633246,
    "longitude": -81.3838056
  },
  {
    "id": 884196,
    "name": "1033 - Irvine, CA - Culver Dr",
    "listingScore": {
      "listingScoreRank": 88.2,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 7,
      "localSeoRankDelta": -4.9
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 26.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 7,
        "rankDelta": -7.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7.5,
        "rankDelta": -1.7
      },
      {
        "name": "Chicken restaurant",
        "rank": 6.6,
        "rankDelta": -5.8
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 33.6945378,
    "longitude": -117.7991316
  },
  {
    "id": 1216046,
    "name": "1212 Saugus, MA - Broadway",
    "listingScore": {
      "listingScoreRank": 88.4,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 7
    },
    "localSeoScore": {
      "localSeoScore": 93.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 4.8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 8.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 7.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 42.4696195,
    "longitude": -71.0247614
  },
  {
    "id": 1124439,
    "name": "1140 Tampa, FL - E. Fowler Ave. - USF",
    "listingScore": {
      "listingScoreRank": 85.5,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 7.1
    },
    "localSeoScore": {
      "localSeoScore": 90
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 7.8
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7
      },
      {
        "name": "Chicken restaurant",
        "rank": 6.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 28.0554846,
    "longitude": -82.4302654
  },
  {
    "id": 1358991,
    "name": "1170 Batavia, IL - S. Randall Rd.",
    "listingScore": {
      "listingScoreRank": 83.5,
      "listingScoreDelta": 2.5
    },
    "localSeoRank": {
      "localSeoRank": 7.1
    },
    "localSeoScore": {
      "localSeoScore": 90
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 10.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 41.8482128,
    "longitude": -88.3408552
  },
  {
    "id": 879259,
    "name": "1063 - Lakewood, OH - Detroit Ave.",
    "listingScore": {
      "listingScoreRank": 84.7,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 7.1,
      "localSeoRankDelta": -4.2
    },
    "localSeoScore": {
      "localSeoScore": 75,
      "localSeoScoreDelta": 20
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.8,
        "rankDelta": -12.1
      },
      {
        "name": "food near me",
        "rank": 13.6,
        "rankDelta": -5.4
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.4,
        "rankDelta": -2.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.9,
        "rankDelta": -6.1
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "daves hot chicken",
        "rank": 1,
        "rankDelta": 0
      }
    ],
    "rankDownKeyword": [
      {
        "name": "restaurants",
        "rank": 20,
        "rankDelta": 0.3
      }
    ],
    "latitude": 41.48520449,
    "longitude": -81.8013471
  },
  {
    "id": 995227,
    "name": "1062 Spring, TX - Kuykendahl Rd.",
    "listingScore": {
      "listingScoreRank": 86.9,
      "listingScoreDelta": -1.3
    },
    "localSeoRank": {
      "localSeoRank": 7.1,
      "localSeoRankDelta": -5.6
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 32
    },
    "rankUpKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 7.2,
        "rankDelta": -4.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 7,
        "rankDelta": -3.6
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 30.071251,
    "longitude": -95.5097979
  },
  {
    "id": 753174,
    "name": "1007 - Northridge, CA - Reseda",
    "listingScore": {
      "listingScoreRank": 86.9,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 7.3,
      "localSeoRankDelta": -1.6
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 10
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 6.4,
        "rankDelta": -6.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 7.1,
        "rankDelta": -1.7
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 8.4,
        "rankDelta": 3.1
      }
    ],
    "latitude": 34.23748049,
    "longitude": -118.5364673
  },
  {
    "id": 1127766,
    "name": "1073 Torrance, CA - Hawthorn Blvd.",
    "listingScore": {
      "listingScoreRank": 88,
      "listingScoreDelta": -1.5
    },
    "localSeoRank": {
      "localSeoRank": 7.4,
      "localSeoRankDelta": -10.3
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 93.3
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 8.9,
        "rankDelta": -8.8
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 4.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 8.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 33.87247949,
    "longitude": -118.3521759
  },
  {
    "id": 1547155,
    "name": "1280 Sandy Springs, GA - Roswell Rd. NE.",
    "listingScore": {
      "listingScoreRank": 87.1,
      "listingScoreDelta": 2
    },
    "localSeoRank": {
      "localSeoRank": 7.4
    },
    "localSeoScore": {
      "localSeoScore": 93.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 9.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 9.8
      }
    ],
    "rankDownKeyword": [],
    "latitude": 33.92720709,
    "longitude": -84.3784563
  },
  {
    "id": 1165623,
    "name": "1157 Vienna, VA - Leesburg Pike",
    "listingScore": {
      "listingScoreRank": 82.9,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 7.5,
      "localSeoRankDelta": 0.7
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 0
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 6.5,
        "rankDelta": -0.3
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 9.5
      },
      {
        "name": "chicken restaurants near me",
        "rank": 6.5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 38.9227414,
    "longitude": -77.2373741
  },
  {
    "id": 1053019,
    "name": "1151 Las Vegas, NV - N. Craig Road",
    "listingScore": {
      "listingScoreRank": 88,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 7.5,
      "localSeoRankDelta": -1.6
    },
    "localSeoScore": {
      "localSeoScore": 93.3,
      "localSeoScoreDelta": 13.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.2,
        "rankDelta": -3.3
      },
      {
        "name": "Chicken restaurant",
        "rank": 9.6,
        "rankDelta": -2.2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 9.9
      }
    ],
    "rankDownKeyword": [],
    "latitude": 36.23893,
    "longitude": -115.1669842
  },
  {
    "id": 938752,
    "name": "1057 - Oklahoma City, OK - Johnny Bench Dr.",
    "listingScore": {
      "listingScoreRank": 82.2,
      "listingScoreDelta": 8
    },
    "localSeoRank": {
      "localSeoRank": 7.5
    },
    "localSeoScore": {
      "localSeoScore": 77.1
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "chicken near me",
        "rank": 7.5
      },
      {
        "name": "Halal restaurant",
        "rank": 2.2
      },
      {
        "name": "food near me",
        "rank": 13.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4.1
      },
      {
        "name": "restaurants",
        "rank": 21
      },
      {
        "name": "daves hot chicken",
        "rank": 1
      },
      {
        "name": "Chicken restaurant",
        "rank": 3.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 35.4639277,
    "longitude": -97.5087907
  },
  {
    "id": 1369217,
    "name": "1233 - Kearny, NJ - Passaic Ave",
    "listingScore": {
      "listingScoreRank": 76.6,
      "listingScoreDelta": 3.6
    },
    "localSeoRank": {
      "localSeoRank": 7.6
    },
    "localSeoScore": {
      "localSeoScore": 73.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "dave hot chicken",
        "rank": 1.7
      },
      {
        "name": "Halal restaurant",
        "rank": 13.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 14.1
      },
      {
        "name": "dave's hot chicken near me",
        "rank": 1.4
      },
      {
        "name": "daves hot chicken",
        "rank": 1.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 13.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 40.7612459,
    "longitude": -74.160088
  },
  {
    "id": 991683,
    "name": "1091 Warren, MI - E. Thirteen Mile Rd.",
    "listingScore": {
      "listingScoreRank": 86.9,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 7.6,
      "localSeoRankDelta": -9.2
    },
    "localSeoScore": {
      "localSeoScore": 90,
      "localSeoScoreDelta": 77.5
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 6.6,
        "rankDelta": -14
      },
      {
        "name": "chicken restaurants near me",
        "rank": 8.6,
        "rankDelta": -5
      },
      {
        "name": "Chicken restaurant",
        "rank": 7.8,
        "rankDelta": -9.2
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 42.5211335,
    "longitude": -83.04818059
  },
  {
    "id": 863503,
    "name": "1029 - Houston, TX - Dennis St.",
    "listingScore": {
      "listingScoreRank": 87.1,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 7.8,
      "localSeoRankDelta": -6.6
    },
    "localSeoScore": {
      "localSeoScore": 82.5,
      "localSeoScoreDelta": 44.2
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 6.2,
        "rankDelta": -8.7
      },
      {
        "name": "chicken restaurants near me",
        "rank": 12.9,
        "rankDelta": -1.3
      },
      {
        "name": "houston hot chicken",
        "rank": 1.4,
        "rankDelta": -2.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 10.6,
        "rankDelta": -2.7
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 29.7461204,
    "longitude": -95.3776813
  },
  {
    "id": 1422857,
    "name": "1236 Yukon, OK - NW 10th St.",
    "listingScore": {
      "listingScoreRank": 77.8,
      "listingScoreDelta": 3.4
    },
    "localSeoRank": {
      "localSeoRank": 7.8,
      "localSeoRankDelta": -2.6
    },
    "localSeoScore": {
      "localSeoScore": 66.7,
      "localSeoScoreDelta": 16.7
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 2.5,
        "rankDelta": -0.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 3.2
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 17.7,
        "rankDelta": 0.1
      }
    ],
    "latitude": 35.47829209,
    "longitude": -97.7532419
  },
  {
    "id": 1055570,
    "name": "1113 Fontana, CA - Sierra Avenue",
    "listingScore": {
      "listingScoreRank": 82.1,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 7.8,
      "localSeoRankDelta": -1.4
    },
    "localSeoScore": {
      "localSeoScore": 83.3,
      "localSeoScoreDelta": -6.7
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 5.8,
        "rankDelta": -3.4
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 11.3
      },
      {
        "name": "chicken restaurants near me",
        "rank": 6.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 34.0743249,
    "longitude": -117.4354032
  },
  {
    "id": 1438841,
    "name": "1296 Richmond, VA - W Broad St.",
    "listingScore": {
      "listingScoreRank": 77,
      "listingScoreDelta": 7.8
    },
    "localSeoRank": {
      "localSeoRank": 7.9,
      "localSeoRankDelta": -4.2
    },
    "localSeoScore": {
      "localSeoScore": 66.7,
      "localSeoScoreDelta": 16.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 19.1,
        "rankDelta": -0.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.2,
        "rankDelta": -2.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.4
      }
    ],
    "rankDownKeyword": [],
    "latitude": 37.6512268,
    "longitude": -77.61355739
  },
  {
    "id": 1028400,
    "name": "1103 New Caney, TX - US Hwy 59 - Valley Ranch",
    "listingScore": {
      "listingScoreRank": 76.6,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 7.9
    },
    "localSeoScore": {
      "localSeoScore": 66.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 17.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.7
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.9
      }
    ],
    "rankDownKeyword": [],
    "latitude": 30.1312775,
    "longitude": -95.2306654
  },
  {
    "id": 926065,
    "name": "1100 - Waco, TX - Jack Kultgen Fwy",
    "listingScore": {
      "listingScoreRank": 78,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 7.9,
      "localSeoRankDelta": -2.5
    },
    "localSeoScore": {
      "localSeoScore": 66.7,
      "localSeoScoreDelta": -3.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4,
        "rankDelta": -3.3
      },
      {
        "name": "chicken restaurants near me",
        "rank": 4.4,
        "rankDelta": -3.7
      },
      {
        "name": "restaurants near me",
        "rank": 17.9,
        "rankDelta": -2.5
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [],
    "latitude": 31.5095948,
    "longitude": -97.1434046
  },
  {
    "id": 1580470,
    "name": "1363 Chesterfield, MO - Chesterfield Airport Rd.",
    "listingScore": {
      "listingScoreRank": 80.3,
      "listingScoreDelta": -1.5
    },
    "localSeoRank": {
      "localSeoRank": 7.9
    },
    "localSeoScore": {
      "localSeoScore": 76.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 14.6
      },
      {
        "name": "chicken restaurants near me",
        "rank": 6.7
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 38.6678552,
    "longitude": -90.6012342
  },
  {
    "id": 860540,
    "name": "1040 - Fort Worth, TX - Bryant Irvin - City View Center",
    "listingScore": {
      "listingScoreRank": 86.2,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 8,
      "localSeoRankDelta": -2.2
    },
    "localSeoScore": {
      "localSeoScore": 83.3,
      "localSeoScoreDelta": 3.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 2.6,
        "rankDelta": -5.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 10.1,
        "rankDelta": -1.9
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 11.3,
        "rankDelta": 0.6
      }
    ],
    "latitude": 32.6814966,
    "longitude": -97.4154039
  },
  {
    "id": 1656462,
    "name": "1402 Logan, UT - North Main St.",
    "listingScore": {
      "listingScoreRank": 75.8,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 8
    },
    "localSeoScore": {
      "localSeoScore": 66.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 21
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.5
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 41.751337,
    "longitude": -111.8348494
  },
  {
    "id": 869367,
    "name": "1046 - Port Hueneme, CA - W. Channel Islands",
    "listingScore": {
      "listingScoreRank": 80.9,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 8,
      "localSeoRankDelta": 1.2
    },
    "localSeoScore": {
      "localSeoScore": 71.7,
      "localSeoScoreDelta": -15.8
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1.4,
        "rankDelta": -1.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.4,
        "rankDelta": -1.4
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "restaurants near me",
        "rank": 20.6
      },
      {
        "name": "dave's hot chicken",
        "rank": 1.3
      }
    ],
    "rankDownKeyword": [
      {
        "name": "food near me",
        "rank": 13.7,
        "rankDelta": 1.2
      },
      {
        "name": "chicken restaurants near me",
        "rank": 5.7,
        "rankDelta": 0.8
      }
    ],
    "latitude": 34.1762655,
    "longitude": -119.2158459
  },
  {
    "id": 1438838,
    "name": "1267 Franklin, MA – Old West Central St.",
    "listingScore": {
      "listingScoreRank": 78.3,
      "listingScoreDelta": 6.6
    },
    "localSeoRank": {
      "localSeoRank": 8.1,
      "localSeoRankDelta": -3.4
    },
    "localSeoScore": {
      "localSeoScore": 66.7,
      "localSeoScoreDelta": 16.7
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 1.4,
        "rankDelta": -1.4
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 1.7
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 21,
        "rankDelta": 0.8
      }
    ],
    "latitude": 42.0910997,
    "longitude": -71.4240225
  },
  {
    "id": 917725,
    "name": "1072 - Troy, MI - W. Big Beaver Rd.",
    "listingScore": {
      "listingScoreRank": 82.7,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 8.2
    },
    "localSeoScore": {
      "localSeoScore": 73.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.8
      },
      {
        "name": "food near me",
        "rank": 13.1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 6.2
      },
      {
        "name": "restaurants",
        "rank": 20.4
      },
      {
        "name": "daves hot chicken",
        "rank": 1.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 4.6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 42.5624364,
    "longitude": -83.1618393
  },
  {
    "id": 852257,
    "name": "1043 - Santa Rosa, CA - Mendocino Ave.",
    "listingScore": {
      "listingScoreRank": 79.4,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 8.2,
      "localSeoRankDelta": -0.5
    },
    "localSeoScore": {
      "localSeoScore": 63.3,
      "localSeoScoreDelta": 3.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 1,
        "rankDelta": -3.3
      },
      {
        "name": "food near me",
        "rank": 10.6,
        "rankDelta": -4.8
      },
      {
        "name": "restaurants",
        "rank": 17.4,
        "rankDelta": -1.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.2,
        "rankDelta": -2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "food",
        "rank": 17.2
      }
    ],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 1.5,
        "rankDelta": 0.2
      }
    ],
    "latitude": 38.4615663,
    "longitude": -122.7169054
  },
  {
    "id": 1530215,
    "name": "1298 Gresham, OR - NW. Eastman Pkwy.",
    "listingScore": {
      "listingScoreRank": 77.2,
      "listingScoreDelta": 11.7
    },
    "localSeoRank": {
      "localSeoRank": 8.2
    },
    "localSeoScore": {
      "localSeoScore": 66.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 20.5
      },
      {
        "name": "chicken restaurants near me",
        "rank": 1.7
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 45.5099391,
    "longitude": -122.4340284
  },
  {
    "id": 1379724,
    "name": "1246 Union, NJ - Route 22",
    "listingScore": {
      "listingScoreRank": 78.5,
      "listingScoreDelta": 1.2
    },
    "localSeoRank": {
      "localSeoRank": 8.2,
      "localSeoRankDelta": 7.1
    },
    "localSeoScore": {
      "localSeoScore": 71.7,
      "localSeoScoreDelta": -28.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 21
      },
      {
        "name": "chicken restaurants near me",
        "rank": 12
      },
      {
        "name": "Chicken restaurant",
        "rank": 11.8
      }
    ],
    "rankDownKeyword": [
      {
        "name": "dave hot chicken",
        "rank": 1.2,
        "rankDelta": 0
      },
      {
        "name": "dave's hot chicken near me",
        "rank": 1.2,
        "rankDelta": 0.1
      },
      {
        "name": "daves hot chicken",
        "rank": 2.2,
        "rankDelta": 1.1
      }
    ],
    "latitude": 40.6911539,
    "longitude": -74.29788769
  },
  {
    "id": 1422854,
    "name": "1319 Wesley Chapel, FL - Willet Way",
    "listingScore": {
      "listingScoreRank": 83.5,
      "listingScoreDelta": 5.8
    },
    "localSeoRank": {
      "localSeoRank": 8.2,
      "localSeoRankDelta": 1.5
    },
    "localSeoScore": {
      "localSeoScore": 86.7,
      "localSeoScoreDelta": -3.3
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 3.8,
        "rankDelta": -2.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 9
      }
    ],
    "rankDownKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 11.7,
        "rankDelta": 5.2
      }
    ],
    "latitude": 28.1876112,
    "longitude": -82.3474142
  },
  {
    "id": 1015829,
    "name": "1162 - Albany, NY - Western Avenue",
    "listingScore": {
      "listingScoreRank": 80.5,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 8.3,
      "localSeoRankDelta": 0.8
    },
    "localSeoScore": {
      "localSeoScore": 66.7,
      "localSeoScoreDelta": -17.3
    },
    "rankUpKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 2.1,
        "rankDelta": -1.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.9,
        "rankDelta": -3.6
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 21,
        "rankDelta": 9.2
      }
    ],
    "latitude": 42.6774343,
    "longitude": -73.8269962
  },
  {
    "id": 971815,
    "name": "1111 - Gilbert, AZ - N. Cooper Rd.",
    "listingScore": {
      "listingScoreRank": 84.9,
      "listingScoreDelta": 1.4
    },
    "localSeoRank": {
      "localSeoRank": 8.3,
      "localSeoRankDelta": -1.3
    },
    "localSeoScore": {
      "localSeoScore": 80,
      "localSeoScoreDelta": -10
    },
    "rankUpKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 7.5,
        "rankDelta": -2.1
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 12.1
      },
      {
        "name": "Chicken restaurant",
        "rank": 5.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 33.37849099,
    "longitude": -111.8066359
  },
  {
    "id": 1438839,
    "name": "1224 Fairfax, VA - Main St. - Fair City Mall",
    "listingScore": {
      "listingScoreRank": 83.6,
      "listingScoreDelta": 7.8
    },
    "localSeoRank": {
      "localSeoRank": 8.3,
      "localSeoRankDelta": -5.6
    },
    "localSeoScore": {
      "localSeoScore": 86.7,
      "localSeoScoreDelta": 41.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 10.7,
        "rankDelta": -7.8
      },
      {
        "name": "Chicken restaurant",
        "rank": 6.9,
        "rankDelta": -2.4
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 7.2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 38.8423471,
    "longitude": -77.2759616
  },
  {
    "id": 934124,
    "name": "1093 - Arlington, TX - S. Cooper Street",
    "listingScore": {
      "listingScoreRank": 86,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 8.3
    },
    "localSeoScore": {
      "localSeoScore": 83.3
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 3.1
      },
      {
        "name": "chicken restaurants near me",
        "rank": 10.6
      },
      {
        "name": "Chicken restaurant",
        "rank": 11.1
      }
    ],
    "rankDownKeyword": [],
    "latitude": 32.66670109,
    "longitude": -97.1346337
  },
  {
    "id": 1534402,
    "name": "1339 Stamford, CT - Summer St.",
    "listingScore": {
      "listingScoreRank": 78.5,
      "listingScoreDelta": 0.1
    },
    "localSeoRank": {
      "localSeoRank": 8.3,
      "localSeoRankDelta": -4
    },
    "localSeoScore": {
      "localSeoScore": 66.7,
      "localSeoScoreDelta": 16.7
    },
    "rankUpKeyword": [
      {
        "name": "Chicken restaurant",
        "rank": 1.9,
        "rankDelta": -1.7
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 21,
        "rankDelta": 0
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2
      }
    ],
    "rankDownKeyword": [],
    "latitude": 41.0680027,
    "longitude": -73.5466445
  },
  {
    "id": 919230,
    "name": "1082 - Orlando, FL - N. Alafaya Trail - Waterford Lakes",
    "listingScore": {
      "listingScoreRank": 81.6,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 8.3,
      "localSeoRankDelta": 2.3
    },
    "localSeoScore": {
      "localSeoScore": 70,
      "localSeoScoreDelta": -20
    },
    "rankUpKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 4.8,
        "rankDelta": -1.2
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "daves chicken",
        "rank": 1
      },
      {
        "name": "Halal restaurant",
        "rank": 16.4
      },
      {
        "name": "Chicken restaurant",
        "rank": 10.9
      }
    ],
    "rankDownKeyword": [],
    "latitude": 28.5553801,
    "longitude": -81.2027507
  },
  {
    "id": 1084947,
    "name": "1136 Dublin, CA - Tassajara Rd.",
    "listingScore": {
      "listingScoreRank": 76.7,
      "listingScoreDelta": -1.4
    },
    "localSeoRank": {
      "localSeoRank": 8.5
    },
    "localSeoScore": {
      "localSeoScore": 66.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 20
      },
      {
        "name": "chicken restaurants near me",
        "rank": 2.9
      },
      {
        "name": "Chicken restaurant",
        "rank": 2.5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 37.7074504,
    "longitude": -121.8728803
  },
  {
    "id": 876112,
    "name": "1052 - Missouri City, TX - Highway 6",
    "listingScore": {
      "listingScoreRank": 81.1,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 8.6,
      "localSeoRankDelta": -3.3
    },
    "localSeoScore": {
      "localSeoScore": 68.3,
      "localSeoScoreDelta": 13.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 5.8,
        "rankDelta": -6.4
      },
      {
        "name": "food near me",
        "rank": 14.2,
        "rankDelta": -6.1
      },
      {
        "name": "restaurants",
        "rank": 16.5,
        "rankDelta": -4
      },
      {
        "name": "Chicken restaurant",
        "rank": 6.2,
        "rankDelta": -4
      }
    ],
    "rankNeutralKeyword": [],
    "rankDownKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 7.6,
        "rankDelta": 0.8
      },
      {
        "name": "daves hot chicken",
        "rank": 1,
        "rankDelta": 0
      }
    ],
    "latitude": 29.56266359,
    "longitude": -95.5625688
  },
  {
    "id": 1394006,
    "name": "1251 Chesapeake, VA - Taylor Rd.",
    "listingScore": {
      "listingScoreRank": 75.9,
      "listingScoreDelta": 10.2
    },
    "localSeoRank": {
      "localSeoRank": 8.7,
      "localSeoRankDelta": 1.4
    },
    "localSeoScore": {
      "localSeoScore": 63.3,
      "localSeoScoreDelta": -3.3
    },
    "rankUpKeyword": [
      {
        "name": "restaurants",
        "rank": 19.9,
        "rankDelta": -0.1
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 16.7
      },
      {
        "name": "dave's hot chicken, taylor road, chesapeake, va",
        "rank": 1,
        "rankDelta": 0
      },
      {
        "name": "chicken restaurants near me",
        "rank": 7.6
      },
      {
        "name": "daves hot chicken",
        "rank": 1,
        "rankDelta": 0
      },
      {
        "name": "Chicken restaurant",
        "rank": 6
      }
    ],
    "rankDownKeyword": [],
    "latitude": 36.8249078,
    "longitude": -76.4089093
  },
  {
    "id": 950879,
    "name": "1095 - Sunnyvale, CA - El Camino Real",
    "listingScore": {
      "listingScoreRank": 85.7,
      "listingScoreDelta": 1.3
    },
    "localSeoRank": {
      "localSeoRank": 8.7,
      "localSeoRankDelta": -7.6
    },
    "localSeoScore": {
      "localSeoScore": 86.7,
      "localSeoScoreDelta": 61.7
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 9,
        "rankDelta": -10.2
      },
      {
        "name": "Chicken restaurant",
        "rank": 6,
        "rankDelta": -7.3
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 11
      }
    ],
    "rankDownKeyword": [],
    "latitude": 37.3669322,
    "longitude": -122.0316139
  },
  {
    "id": 1518379,
    "name": "1257 Las Vegas, NV - S. Rainbow Blvd.",
    "listingScore": {
      "listingScoreRank": 81.4,
      "listingScoreDelta": 1
    },
    "localSeoRank": {
      "localSeoRank": 8.7,
      "localSeoRankDelta": -6.6
    },
    "localSeoScore": {
      "localSeoScore": 83.3,
      "localSeoScoreDelta": 58.3
    },
    "rankUpKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 4.7,
        "rankDelta": -12
      },
      {
        "name": "Chicken restaurant",
        "rank": 10.4,
        "rankDelta": -3.6
      }
    ],
    "rankNeutralKeyword": [
      {
        "name": "chicken restaurants near me",
        "rank": 11.1
      }
    ],
    "rankDownKeyword": [],
    "latitude": 36.0625081,
    "longitude": -115.2420576
  },
  {
    "id": 1539090,
    "name": "1284 Goodyear, AZ - W. McDowell Rd.",
    "listingScore": {
      "listingScoreRank": 74.8,
      "listingScoreDelta": -1
    },
    "localSeoRank": {
      "localSeoRank": 8.8
    },
    "localSeoScore": {
      "localSeoScore": 66.7
    },
    "rankUpKeyword": [],
    "rankNeutralKeyword": [
      {
        "name": "Halal restaurant",
        "rank": 21
      },
      {
        "name": "chicken restaurants near me",
        "rank": 3.9
      },
      {
        "name": "Chicken restaurant",
        "rank": 1.5
      }
    ],
    "rankDownKeyword": [],
    "latitude": 33.4654526,
    "longitude": -112.3859206
  }
]

};

Default.parameters = {
  docs: {
      source: {
    code: `<AdvanceMapViewComponent
    googleMapApiKey="YOUR_GOOGLE_MAP_API_KEY"
    mapId: "YOUR_GOOGLE_MAP_ID",
    locations = [
      {
        id: 887325,
        latitude: 42.5893982,
        listingScore: {
          listingScoreDelta: -0.099998474,
          listingScoreRank: 79.9
        },
        localSeoRank: {
          localSeoRank: 1,
          localSeoRankDelta: 0
        },
        localSeoScore: {
          localSeoScore: 100,
          localSeoScoreDelta: 0
        },
        longitude: -83.87964559,
        name: '1054 - Howell, MI - E. Grand River',
        rankDownKeyword: [],
        rankNeutralKeyword: [
          {
            name: 'Chicken restaurant',
            rank: 1,
            rankDelta: 0
          }
        ],
        rankUpKeyword: []
      },
      {
        id: 1006103,
        latitude: 43.6360799,
        listingScore: {
          listingScoreDelta: 0.5999985,
          listingScoreRank: 82.6
        },
        localSeoRank: {
          localSeoRank: 1,
          localSeoRankDelta: 0
        },
        localSeoScore: {
          localSeoScore: 100,
          localSeoScoreDelta: 0
        },
        longitude: -116.3537672,
        name: '1125 Meridian, ID - Eagle Rd',
        rankDownKeyword: [],
        rankNeutralKeyword: [
          {
            name: 'Chicken restaurant',
            rank: 1,
            rankDelta: 0
          }
        ],
        rankUpKeyword: []
      },
      {
        id: 1008151,
        latitude: 41.6926636,
        listingScore: {
          listingScoreDelta: -0.20000458,
          listingScoreRank: 81.7
        },
        localSeoRank: {
          localSeoRank: 1,
          localSeoRankDelta: -6
        },
        localSeoScore: {
          localSeoScore: 100,
          localSeoScoreDelta: 10
        },
        longitude: -86.2348189,
        name: '1153 South Bend, IN - N. Eddy St.',
        rankDownKeyword: [],
        rankNeutralKeyword: [],
        rankUpKeyword: [
          {
            name: 'Chicken restaurant',
            rank: 1,
            rankDelta: -6
          }
        ]
      },
      {
        id: 967703,
        latitude: 35.2206372,
        listingScore: {
          listingScoreDelta: -0.29999542,
          listingScoreRank: 81.3
        },
        localSeoRank: {
          localSeoRank: 1,
          localSeoRankDelta: -1
        },
        localSeoScore: {
          localSeoScore: 100,
          localSeoScoreDelta: 0
        },
        longitude: -80.81020289,
        name: '1104 - Charlotte, NC - Central Avenue',
        rankDownKeyword: [],
        rankNeutralKeyword: [],
        rankUpKeyword: [
          {
            name: 'Chicken restaurant',
            rank: 1,
            rankDelta: -1
          }
        ]
      },
      {
        id: 1330741,
        latitude: 43.6103023,
        listingScore: {
          listingScoreDelta: -0.19999695,
          listingScoreRank: 81.4
        },
        localSeoRank: {
          localSeoRank: 1
        },
        localSeoScore: {
          localSeoScore: 100
        },
        longitude: -116.5917039,
        name: '1252 Nampa, ID - N Marketplace Blvd',
        rankDownKeyword: [],
        rankNeutralKeyword: [
          {
            name: 'Chicken restaurant',
            rank: 1
          }
        ],
        rankUpKeyword: []
      },
      {
        id: 1216048,
        latitude: 43.0000016,
        listingScore: {
          listingScoreDelta: -0.099998474,
          listingScoreRank: 81.9
        },
        localSeoRank: {
          localSeoRank: 1
        },
        localSeoScore: {
          localSeoScore: 100
        },
        longitude: -78.8228859,
        name: '1213 Tonawanda, NY - Niagara Falls Blvd. - Buffalo',
        rankDownKeyword: [],
        rankNeutralKeyword: [
          {
            name: 'Chicken restaurant',
            rank: 1
          }
        ],
        rankUpKeyword: []
      },
      {
        id: 971815,
        latitude: 33.3784993,
        listingScore: {
          listingScoreDelta: 0,
          listingScoreRank: 82.6
        },
        localSeoRank: {
          localSeoRank: 1,
          localSeoRankDelta: -1
        },
        localSeoScore: {
          localSeoScore: 100,
          localSeoScoreDelta: 0
        },
        longitude: -111.8066007,
        name: '1111 - Gilbert, AZ - N. Cooper Rd.',
        rankDownKeyword: [],
        rankNeutralKeyword: [],
        rankUpKeyword: [
          {
            name: 'Chicken restaurant',
            rank: 1,
            rankDelta: -1
          }
        ]
      },
      {
        id: 1214525,
        latitude: 43.3306998,
        listingScore: {
          listingScoreDelta: -0.19999695,
          listingScoreRank: 84.5
        },
        localSeoRank: {
          localSeoRank: 1
        },
        localSeoScore: {
          localSeoScore: 100
        },
        longitude: -73.67061249,
        name: '1194 Queensbury, NY - Upper Glen St.',
        rankDownKeyword: [],
        rankNeutralKeyword: [
          {
            name: 'Chicken restaurant',
            rank: 1
          }
        ],
        rankUpKeyword: []
      },
      {
        id: 910385,
        latitude: 45.43365,
        listingScore: {
          listingScoreDelta: -2.0999985,
          listingScoreRank: 79.8
        },
        localSeoRank: {
          localSeoRank: 1,
          localSeoRankDelta: 0
        },
        localSeoScore: {
          localSeoScore: 100,
          localSeoScoreDelta: 0
        },
        longitude: -122.563255,
        name: '1056 - Clackamas, OR - Sunnyside Rd.',
        rankDownKeyword: [],
        rankNeutralKeyword: [
          {
            name: 'Chicken restaurant',
            rank: 1,
            rankDelta: 0
          }
        ],
        rankUpKeyword: []
      },
      {
        id: 1216046,
        latitude: 42.4695942,
        listingScore: {
          listingScoreDelta: 1,
          listingScoreRank: 80.5
        },
        localSeoRank: {
          localSeoRank: 1
        },
        localSeoScore: {
          localSeoScore: 100
        },
        longitude: -71.0248438,
        name: '1212 Saugus, MA - Broadway',
        rankDownKeyword: [],
        rankNeutralKeyword: [
          {
            name: 'Chicken restaurant',
            rank: 1
          }
        ],
        rankUpKeyword: []
      }
    ]
  mapHeight={500}
/>`,
        language: 'jsx',
        format: true,
      },
  },
};