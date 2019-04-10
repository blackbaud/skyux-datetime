import {
  ValidationErrors
} from '@angular/forms';

import {
  SkyDateRangeCalculation
} from './types/date-range-calculation';

import {
  SkyDateRangeCalculatorConfig
} from './types/date-range-calculator-config';

import {
  SkyDateRangeCalculatorId
} from './types/date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from './types/date-range-calculator-type';

import {
  SkyDateRange
} from './types/date-range';

export class SkyDateRangeCalculator {
  public readonly shortDescription: string;
  public readonly type: SkyDateRangeCalculatorType;

  constructor(
    public readonly calculatorId: SkyDateRangeCalculatorId,
    private config: SkyDateRangeCalculatorConfig
  ) {
    this.type = config.type;
    this.shortDescription = config.shortDescription;
  }

  public getValue(startDate?: Date, endDate?: Date): SkyDateRangeCalculation {
    const result = this.config.getValue(startDate, endDate);

    /* tslint:disable:no-null-keyword */
    // Angular form controls use null for the "empty" value.
    return {
      calculatorId: this.calculatorId,
      startDate: result.startDate || null,
      endDate: result.endDate || null
    };
    /* tslint:enable */
  }

  public validate(value?: SkyDateRange): ValidationErrors {
    if (!this.config.validate) {
      return;
    }

    return this.config.validate(value);
  }
}
