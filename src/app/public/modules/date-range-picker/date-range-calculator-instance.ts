import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

export interface SkyDateRangeCalculatorInstance {
  id: SkyDateRangeCalculatorId;
  shortDescription: string;
  type: SkyDateRangeCalculatorType;
}
