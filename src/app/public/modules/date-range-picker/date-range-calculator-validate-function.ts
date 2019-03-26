import {
  SkyDateRangeValidationResult
} from './date-range-validation-result';

export type SkyDateRangeCalculatorValidateFunction = (
  startDateInput?: Date,
  endDateInput?: Date
) => SkyDateRangeValidationResult;
