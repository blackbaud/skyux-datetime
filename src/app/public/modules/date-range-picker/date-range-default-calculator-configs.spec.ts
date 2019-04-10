import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SKY_DEFAULT_CALCULATOR_CONFIGS as configs
} from './date-range-default-calculator-configs';

import {
  SkyDateRangeRelativeValue
} from './date-range-relative-value';

describe('Default calculator configs', function () {
  const expectations: any = {
    [SkyDateRangeCalculatorId.Today]: {
      getValue: 'today'
    },
    [SkyDateRangeCalculatorId.Tomorrow]: {
      getValue: 'tomorrow'
    },
    [SkyDateRangeCalculatorId.Yesterday]: {
      getValue: 'yesterday'
    },
    [SkyDateRangeCalculatorId.LastFiscalYear]: {
      getValue: 'lastFiscalYear'
    },
    [SkyDateRangeCalculatorId.LastMonth]: {
      getValue: 'lastMonth'
    },
    [SkyDateRangeCalculatorId.LastQuarter]: {
      getValue: 'lastQuarter'
    },
    [SkyDateRangeCalculatorId.LastWeek]: {
      getValue: 'lastWeek'
    },
    [SkyDateRangeCalculatorId.LastYear]: {
      getValue: 'lastYear'
    },
    [SkyDateRangeCalculatorId.ThisFiscalYear]: {
      getValue: 'thisFiscalYear'
    },
    [SkyDateRangeCalculatorId.ThisMonth]: {
      getValue: 'thisMonth'
    },
    [SkyDateRangeCalculatorId.ThisQuarter]: {
      getValue: 'thisQuarter'
    },
    [SkyDateRangeCalculatorId.ThisWeek]: {
      getValue: 'thisWeek'
    },
    [SkyDateRangeCalculatorId.ThisYear]: {
      getValue: 'thisYear'
    },
    [SkyDateRangeCalculatorId.NextFiscalYear]: {
      getValue: 'nextFiscalYear'
    },
    [SkyDateRangeCalculatorId.NextMonth]: {
      getValue: 'nextMonth'
    },
    [SkyDateRangeCalculatorId.NextQuarter]: {
      getValue: 'nextQuarter'
    },
    [SkyDateRangeCalculatorId.NextWeek]: {
      getValue: 'nextWeek'
    },
    [SkyDateRangeCalculatorId.NextYear]: {
      getValue: 'nextYear'
    }
  };

  it('should call specific functions from Relative Value', function () {
    configs.forEach((config) => {
      if (config.calculatorId in expectations) {
        const spy = spyOnProperty(
          SkyDateRangeRelativeValue as any,
          expectations[config.calculatorId].getValue,
          'get'
        );

        const startDate = new Date();
        const endDate = new Date();

        config.getValue(startDate, endDate);

        expect(spy).toHaveBeenCalled();
      }
    });
  });
});
