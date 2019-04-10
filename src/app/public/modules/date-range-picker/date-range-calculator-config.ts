import {
  SkyDateRangeCalculatorGetValueFunction
} from './date-range-calculator-date-range-function';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeCalculatorValidateFunction
} from './date-range-calculator-validate-function';

export interface SkyDateRangeCalculatorConfig {

  shortDescription: string;

  type: SkyDateRangeCalculatorType;

  getValue: SkyDateRangeCalculatorGetValueFunction;

  validate?: SkyDateRangeCalculatorValidateFunction;

}
