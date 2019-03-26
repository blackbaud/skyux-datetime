import {
  SkyDateRangeCalculatorId
} from '../date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from '../date-range-calculator-type';

import {
  SkyDateRangeCalculator
} from '../date-range-calculator';

export const SKY_DATE_RANGE_CALCULATOR_BEFORE =
  new SkyDateRangeCalculator(SkyDateRangeCalculatorId.Before, {
    type: SkyDateRangeCalculatorType.Before,
    shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_before',
    getValue: (startDate, endDate) => {
      return {
        endDate
      };
    }
  });
