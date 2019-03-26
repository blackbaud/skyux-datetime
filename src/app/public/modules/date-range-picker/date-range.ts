import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

export interface SkyDateRange {
  id?: SkyDateRangeCalculatorId;
  startDate?: Date | null;
  endDate?: Date | null;
}
