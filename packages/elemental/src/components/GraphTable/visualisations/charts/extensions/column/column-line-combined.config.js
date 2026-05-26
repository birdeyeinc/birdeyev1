const reportdata = {
  parserConfig: {
    disableLegends: false,
    primaryChartStyle: "column",
    defaultChartStyle: "spline",
    dataFormat: "arrayWithKeyValue",
    dataPoints: true,
    reportOverTime: true,
    enableScroll: true,
    enableCrosshair: true,
    crosshairConfig: { color: "#e3effc" },
    marginBottom: 78,
    marginLeft: 0,
    spacingTop: 14,
    spacingRight: 30,
    isCustomSpaceMultiplier: true,
    getSpaceMultiplier: () => 80,
    getDataMultiplier: () => 3,
    // showProjectedData: false,
    // projectedData: {
    //   name: "Reviews projected",
    //   type: "column",
    //   color: "#a4ccf4",
    //   id: "reviewsProjected",
    //   dataKey: "totalCount",
    //   maxPointWidth: 20,
    //   showInLegend: true,
    //   stack: "stack1"
    // },
    doubleYaxis: true,
    plotDataConfig: {
      column: {
        dataLabels: { enabled: true, y: -25, style: { color: '#212121', fontSize: '12px', fontWeight: 400 } },
        stacking: 'normal',
        borderRadiusTopLeft: 4,
        borderRadiusTopRight: 4,
      },
      spline: {
        dataLabels: {
          enabled: true,
          useHTML: true,
          inside: true,
          align: 'center',
          verticalAlign: 'middle',
            y: 0,
          x: 0,
          padding: 0,
          allowOverlap: true,
          crop: false,
          style: { fontSize: '11px', fontWeight: 400, color: '#fff', textOutline: 'none' },
          formatter() {
            const raw = this.y;
            const val = (Math.round(raw * 100) / 100).toFixed(2).replace(/\.00$/, '').replace(/(\.[0-9])0$/, '$1');
            const isLast = this.point === this.series.data[this.series.data.length - 1];
            const bg = isLast && this.point.yProj ? '#a4ccf4' : '#2C3E91';
            // styles per spec
            // width dynamic but constrained via min/max; explicit height 22px; radius 24px; padding top/bottom token approx 2px
            return `<span style="display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:36px;max-width:40px;height:22px;padding:2px 6px;border-radius:24px;border:1px solid transparent;background:${bg};line-height:1;font-size:11px;font-weight:400;color:#fff;">${val}</span>`;
          }
        },
        marker: { enabled: false },
        lineWidth: 2,
      },
      series: {
        pointWidth: 20,
      }
    },
    seriesDetails: [
      {
        name: "Reviews",
        type: "column",
        primary: true,
        id: "reviews",
        dataKey: "totalCount",
        color: "#0099FF",
        maxPointWidth: 20,
        axisLevel: 0,
        stack: "stack1",
        showInLegend: true,
        fillColor: {
          linearGradient: { x1: 0, x2: 1, y1: 0, y2: 1 },
          stops: [ [0, "rgba(0,153,255,0.1)"], [1, "rgba(0,153,255,0)"] ]
        }
      },
      {
        name: "Rating",
        type: "spline",
        id: "rating",
        dataKey: "avgRatingDecimaled",
        color: "#2C3E91",
        maxPointWidth: 20,
        axisLevel: 1,
        showInLegend: true,
        fillColor: {
          linearGradient: { x1: 0, x2: 1, y1: 0, y2: 1 },
            stops: [ [0, "rgba(44,62,145,0.1)"], [1, "rgba(44,62,145,0)"] ]
        }
      }
    ],
    yAxisConfigs: [
      { min: 0, labels: { enabled: false }, gridLineWidth: 0 },
      { min: 0, max: 5, tickInterval: 1, labels: { enabled: false }, gridLineWidth: 0 }
    ],
    xAxisFormatter: (label) => label,
  },
  apiData: {
    summary: { actual: { totalCount: 180958, avgRating: 4.5, avgRatingDecimaled: "4.47" } },
    dataPoints: [
      { actual: { label: "Aug 2024", shortLabel: "Aug '24", totalCount: 9064,  avgRating: 4.5, avgRatingDecimaled: 4.48, startDate: "08/21/2024", endDate: "08/31/2024" }, projected: 0 },
      { actual: { label: "Sep 2024", shortLabel: "Sep '24", totalCount: 22552, avgRating: 4.5, avgRatingDecimaled: 4.49, startDate: "09/01/2024", endDate: "09/30/2024" }, projected: 0 },
      { actual: { label: "Oct 2024", shortLabel: "Oct '24", totalCount: 21417, avgRating: 4.5, avgRatingDecimaled: 4.48, startDate: "10/01/2024", endDate: "10/31/2024" }, projected: 0 },
      { actual: { label: "Nov 2024", shortLabel: "Nov '24", totalCount: 19256, avgRating: 4.5, avgRatingDecimaled: 4.5,  startDate: "11/01/2024", endDate: "11/30/2024" }, projected: 0 },
      { actual: { label: "Dec 2024", shortLabel: "Dec '24", totalCount: 21593, avgRating: 4.5, avgRatingDecimaled: 4.45, startDate: "12/01/2024", endDate: "12/31/2024" }, projected: 0 },
      { actual: { label: "Jan 2025", shortLabel: "Jan '25", totalCount: 21650, avgRating: 4.4, avgRatingDecimaled: 4.44, startDate: "01/01/2025", endDate: "01/31/2025" }, projected: 0 },
      { actual: { label: "Feb 2025", shortLabel: "Feb '25", totalCount: 18972, avgRating: 4.5, avgRatingDecimaled: 4.46, startDate: "02/01/2025", endDate: "02/28/2025" }, projected: 0 },
      { actual: { label: "Mar 2025", shortLabel: "Mar '25", totalCount: 21420, avgRating: 4.5, avgRatingDecimaled: 4.49, startDate: "03/01/2025", endDate: "03/31/2025" }, projected: 0 },
      { actual: { label: "Apr 2025", shortLabel: "Apr '25", totalCount: 11725, avgRating: 4.5, avgRatingDecimaled: 4.47, startDate: "04/01/2025", endDate: "04/30/2025" }, projected: 0 },
      { actual: { label: "May 2025", shortLabel: "May '25", totalCount: 8382,  avgRating: 4.3, avgRatingDecimaled: 4.34, startDate: "05/01/2025", endDate: "05/31/2025" }, projected: 0 },
      { actual: { label: "Jun 2025", shortLabel: "Jun '25", totalCount: 2489,  avgRating: 4.7, avgRatingDecimaled: 4.67, startDate: "06/01/2025", endDate: "06/30/2025" }, projected: 0 },
      { actual: { label: "Jul 2025", shortLabel: "Jul '25", totalCount: 2064,  avgRating: 4.8, avgRatingDecimaled: 4.77, startDate: "07/01/2025", endDate: "07/31/2025" }, projected: 0 },
      { actual: { label: "Aug 2025", shortLabel: "Aug '25", totalCount: 374,   avgRating: 4.7, avgRatingDecimaled: 4.7,  startDate: "08/01/2025", endDate: "08/21/2025" }, projected: 553 }
    ],
    dateDiff: 365,
    groupByType: "month",
    dataPresent: true
  }
};

export const columnLineCombined = reportdata;