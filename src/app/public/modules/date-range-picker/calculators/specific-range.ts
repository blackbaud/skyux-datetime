import {
  SkyDateRangeCalculatorId
} from '../date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from '../date-range-calculator-type';

import {
  SkyDateRangeCalculator
} from '../date-range-calculator';

import {
  Observable
} from 'rxjs/Observable';

export const SKY_DATE_RANGE_CALCULATOR_SPECIFIC_RANGE =
  new SkyDateRangeCalculator(SkyDateRangeCalculatorId.SpecificRange, {
    type: SkyDateRangeCalculatorType.Range,
    shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_specific_range',

    getValue: (startDate, endDate) => {
      return {
        startDate,
        endDate
      };
    },

    validate: (startDate, endDate) => {
      if (
        startDate &&
        endDate &&
        startDate > endDate
      ) {
        return Observable.of({
          message: 'Error y\'all!'
        });
      }
    }
  });
