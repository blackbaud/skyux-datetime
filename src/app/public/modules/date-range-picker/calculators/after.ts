import {
  SkyDateRangeCalculatorId
} from '../date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from '../date-range-calculator-type';

import {
  SkyDateRangeCalculator
} from '../date-range-calculator';

export const SKY_DATE_RANGE_CALCULATOR_AFTER =
  new SkyDateRangeCalculator(SkyDateRangeCalculatorId.After, {
    type: SkyDateRangeCalculatorType.After,
    shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_after',
    getValue: (startDate) => {
      return {
        startDate
      };
    }
  });
