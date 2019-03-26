import {
  SkyDateRangeCalculatorGetValueFunction
} from './date-range-calculator-date-range-function';

import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeCalculatorValidateFunction
} from './date-range-calculator-validate-function';

export interface SkyDateRangeCalculatorArgs {
  type: SkyDateRangeCalculatorType;

  shortDescription?: string;

  shortDescriptionResourceKey?: string;

  // errorMessageResourceKey?: string;

  getValue: SkyDateRangeCalculatorGetValueFunction;

  validate?: SkyDateRangeCalculatorValidateFunction;
}
