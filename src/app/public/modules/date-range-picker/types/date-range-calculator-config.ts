import {
  Observable
} from 'rxjs/Observable';

import {
  SkyDateRangeCalculatorHandle
} from './date-range-calculator-handle';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeValidationResult
} from './date-range-validation-result';

import {
  SkyDateRange
} from './date-range';

export interface SkyDateRangeCalculatorConfig {
  captionResourceKey: string;
  type: SkyDateRangeCalculatorType;
  handle: SkyDateRangeCalculatorHandle;
  getValue: (startDate?: Date, endDate?: Date) => SkyDateRange;
  validate?: (startDate?: Date, endDate?: Date) => Observable<SkyDateRangeValidationResult>;
}
