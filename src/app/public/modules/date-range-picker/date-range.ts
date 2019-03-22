import {
  SkyDateRangeCalculatorName
} from './date-range-calculator-name';

export interface SkyDateRange {
  name: SkyDateRangeCalculatorName;
  startDate?: Date | null;
  endDate?: Date | null;
}
