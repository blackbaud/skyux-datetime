import {
  SkyDateRangeCalculatorHandle
} from './date-range-calculator-handle';

export interface SkyDateRange {
  handle: SkyDateRangeCalculatorHandle;
  startDate: Date;
  endDate: Date;
}
