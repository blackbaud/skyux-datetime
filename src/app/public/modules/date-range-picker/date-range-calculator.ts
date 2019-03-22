import {
  Observable
} from 'rxjs/Observable';

import {
  SkyDateRangeCalculatorName
} from './date-range-calculator-name';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeValidationResult
} from './date-range-validation-result';

import {
  SkyDateRange
} from './date-range';

export interface SkyDateRangeCalculator {
  captionResourceKey: string;
  type: SkyDateRangeCalculatorType;
  name: SkyDateRangeCalculatorName;
  getValue: (startDate?: Date, endDate?: Date) => SkyDateRange;
  validate?: (startDate?: Date, endDate?: Date) => Observable<SkyDateRangeValidationResult>;
}
