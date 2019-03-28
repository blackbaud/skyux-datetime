export type SkyDateRangeCalculatorGetValueFunction = (
  startDateInput?: Date,
  endDateInput?: Date
) => {
  startDate?: Date | null,
  endDate?: Date | null
};
