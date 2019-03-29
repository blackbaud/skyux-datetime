import {
  SkyDateRangeCalculation
} from './date-range-calculation';

import {
  SkyDateRangeCalculatorArgs
} from './date-range-calculator-args';

import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeValidationResult
} from './date-range-validation-result';

export class SkyDateRangeCalculator {
  public shortDescription: string;
  public readonly shortDescriptionResourceKey: string;
  public readonly type: SkyDateRangeCalculatorType;

  constructor(
    public readonly calculatorId: SkyDateRangeCalculatorId,
    private args: SkyDateRangeCalculatorArgs
  ) {
    this.type = args.type;
    this.shortDescription = args.shortDescription;
    this.shortDescriptionResourceKey = args.shortDescriptionResourceKey;
  }

  public getValue(
    startDateInput?: Date,
    endDateInput?: Date
  ): SkyDateRangeCalculation {
    const {
      startDate,
      endDate
    } = this.args.getValue(startDateInput, endDateInput);

    return {
      calculatorId: this.calculatorId,
      startDate,
      endDate
    };
  }

  public validate(
    startDate?: Date,
    endDate?: Date
  ): SkyDateRangeValidationResult {
    if (!this.args.validate) {
      return;
    }

    return this.args.validate(startDate, endDate);
  }
}
