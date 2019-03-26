import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeCalculatorGetValueFunction
} from './date-range-calculator-date-range-function';

import {
  SkyDateRangeCalculatorValidateFunction
} from './date-range-calculator-validate-function';

export interface SkyDateRangeCalculatorConfig {
  type: SkyDateRangeCalculatorType;

  shortDescription: string;

  getValue: SkyDateRangeCalculatorGetValueFunction;

  validate?: SkyDateRangeCalculatorValidateFunction;
}
