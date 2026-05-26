import TimePeriodComponent from './index';

export default {
  title: "Atom/TimePeriod",
  component: TimePeriodComponent
};

export const TimePeriod = {
  args: {
    selectedDateRange: { months: 12, groupByDays: 0 }
  }
};
