const reportdata = {
  parserConfig: {
    disableLegends: false,
    primaryChartStyle: 'column',
    defaultChartStyle: 'spline',
    dataFormat: 'arrayWithKeyValue',
    dataPoints: true,
    reportOverTime: true,
    enableScroll: true,
    enableCrosshair: true,
    crosshairConfig: { color: '#e3effc' },
    marginBottom: 78,
    spacingTop: 14,
    spacingRight: 30,
    isCustomSpaceMultiplier: true,
    getSpaceMultiplier: () => 80,
    getDataMultiplier: () => 3,
    doubleYaxis: true,
    plotDataConfig: {
      column: {
        stacking: 'normal',
        borderRadiusTopLeft: 4,
        borderRadiusTopRight: 4,
        dataLabels: { enabled: false, style: { color: '#212121', fontSize: '12px', fontWeight: 400 } }
      },
      spline: {
        // Remove separate marker dot since pill acts as visual marker
        marker: { enabled: false },
        lineWidth: 2,
        dataLabels: {
          enabled: true,
          useHTML: true,
          allowOverlap: true,
          inside: true,
          y: 10,
          x: 0,
          padding: 0,
          style: { fontSize: '11px', fontWeight: 400, color: '#fff', textOutline: 'none' },
          formatter() {
            const raw = this.y;
            // Format percentage (keep integer if whole number)
            const val = (Math.round(raw * 100) / 100).toFixed(2).replace(/\.00$/, '').replace(/(\.[0-9])0$/, '$1');
            // Optionally highlight latest point (uncomment if desired)
            const isLast = this.point === this.series.data[this.series.data.length - 1];
            const bg = '#2C3E91';
            return `<span style="display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:36px;max-width:40px;height:22px;padding:2px 6px;border-radius:24px;background:${bg};line-height:1;font-size:11px;font-weight:400;color:#fff;">${val}%</span>`;
          }
        }
      },
      series: { pointWidth: 20 }
    },
    seriesDetails: [
      {
        name: 'Not responded',
        type: 'column',
        id: 'notResponded',
        dataKey: 'unrespondedCount',
        color: '#CCCCCC',
        stack: 'stack1',
        primary: true,
        axisLevel: 0,
        showInLegend: true,
        maxPointWidth: 20,
        fillColor: { linearGradient: { x1:0,x2:1,y1:0,y2:1 }, stops: [[0,'rgba(204,204,204,0.1)'],[1,'rgba(204,204,204,0)']] }
      },
      {
        name: 'Responded',
        type: 'column',
        id: 'responded',
        dataKey: 'respondedCount',
        color: '#0099FF',
        stack: 'stack1',
        axisLevel: 0,
        showInLegend: true,
        maxPointWidth: 20,
        fillColor: { linearGradient: { x1:0,x2:1,y1:0,y2:1 }, stops: [[0,'rgba(0,153,255,0.1)'],[1,'rgba(0,153,255,0)']] }
      },
      {
        name: 'Response rate',
        type: 'spline',
        id: 'responseRate',
        dataKey: 'responseRate',
        color: '#2C3E91',
        axisLevel: 1,
        showInLegend: true,
        maxPointWidth: 20,
        yAxis: 1,
        fillColor: { linearGradient: { x1:0,x2:1,y1:0,y2:1 }, stops: [[0,'rgba(44,62,145,0.1)'],[1,'rgba(44,62,145,0)']] }
      }
    ],
    yAxisConfigs: [
      { min: 0, labels: { enabled: false }, gridLineWidth: 0 },
      { min: 0, max: 100, tickInterval: 20, labels: { enabled: false }, gridLineWidth: 0 }
    ],
    xAxisFormatter: (label) => label,
  },
  apiData: {
    summary: { actual: { totalResponded: 23776, totalUnresponded: 157182, totalCount: 180958, responseRate: 13.14 } },
    dataPoints: [
      { actual: { label: 'Aug 2024', shortLabel: "Aug '24", unrespondedCount: 8304, respondedCount: 760, responseRate: 8 }, projected: 0 },
      { actual: { label: 'Sep 2024', shortLabel: "Sep '24", unrespondedCount: 20145, respondedCount: 2407, responseRate: 11 }, projected: 0 },
      { actual: { label: 'Oct 2024', shortLabel: "Oct '24", unrespondedCount: 19107, respondedCount: 2310, responseRate: 11 }, projected: 0 },
      { actual: { label: 'Nov 2024', shortLabel: "Nov '24", unrespondedCount: 17071, respondedCount: 2185, responseRate: 11 }, projected: 0 },
      { actual: { label: 'Dec 2024', shortLabel: "Dec '24", unrespondedCount: 19105, respondedCount: 2488, responseRate: 12 }, projected: 0 },
      { actual: { label: 'Jan 2025', shortLabel: "Jan '25", unrespondedCount: 19209, respondedCount: 2441, responseRate: 11 }, projected: 0 },
      { actual: { label: 'Feb 2025', shortLabel: "Feb '25", unrespondedCount: 16720, respondedCount: 2252, responseRate: 12 }, projected: 0 },
      { actual: { label: 'Mar 2025', shortLabel: "Mar '25", unrespondedCount: 18640, respondedCount: 2780, responseRate: 13 }, projected: 0 },
      { actual: { label: 'Apr 2025', shortLabel: "Apr '25", unrespondedCount: 9279, respondedCount: 2446, responseRate: 21 }, projected: 0 },
      { actual: { label: 'May 2025', shortLabel: "May '25", unrespondedCount: 6380, respondedCount: 2002, responseRate: 24 }, projected: 0 },
      { actual: { label: 'Jun 2025', shortLabel: "Jun '25", unrespondedCount: 1593, respondedCount: 896, responseRate: 36 }, projected: 0 },
      { actual: { label: 'Jul 2025', shortLabel: "Jul '25", unrespondedCount: 1316, respondedCount: 748, responseRate: 36 }, projected: 0 },
      { actual: { label: 'Aug 2025', shortLabel: "Aug '25", unrespondedCount: 313, respondedCount: 61, responseRate: 16 }, projected: 0 }
    ],
    dateDiff: 365,
    groupByType: 'month',
    dataPresent: true
  }
};

export const columnGroupedLine = reportdata;