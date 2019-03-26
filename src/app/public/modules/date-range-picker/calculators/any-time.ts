import {
  SkyDateRangeCalculatorId
} from '../date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from '../date-range-calculator-type';

import {
  SkyDateRangeCalculator
} from '../date-range-calculator';
// import { Observable } from 'rxjs';

export const SKY_DATE_RANGE_CALCULATOR_ANY_TIME =
  new SkyDateRangeCalculator(SkyDateRangeCalculatorId.AnyTime, {
    type: SkyDateRangeCalculatorType.Relative,
    shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_any_time',
    getValue: () => ({})
  });
