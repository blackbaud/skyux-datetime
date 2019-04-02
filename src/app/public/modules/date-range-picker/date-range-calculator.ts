import {
  ValidationErrors
} from '@angular/forms';

import {
  SkyDateRangeCalculation
} from './date-range-calculation';

import {
  SkyDateRangeCalculatorConfig
} from './date-range-calculator-config';

import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRange
} from './date-range';

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
