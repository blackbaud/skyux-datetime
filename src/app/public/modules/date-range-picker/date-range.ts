import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

export interface SkyDateRange {
  calculatorId: SkyDateRangeCalculatorId;
  startDate?: Date | null;
  endDate?: Date | null;
}
