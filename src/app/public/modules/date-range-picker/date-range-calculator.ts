import {
  Observable
} from 'rxjs/Observable';

import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeValidationResult
} from './date-range-validation-result';

import {
  SkyDateRange
} from './date-range';

import {
  SkyDateRangeCalculatorArgs
} from './date-range-calculator-args';

export class SkyDateRangeCalculator {
  public shortDescription: string;
  public readonly shortDescriptionResourceKey: string;
  public readonly type: SkyDateRangeCalculatorType;

  constructor(
    public readonly id: SkyDateRangeCalculatorId,
    private args: SkyDateRangeCalculatorArgs
  ) {
    this.type = args.type;
    this.shortDescription = args.shortDescription;
    this.shortDescriptionResourceKey = args.shortDescriptionResourceKey;
  }

  public getValue(
    startDate?: Date,
    endDate?: Date
  ): SkyDateRange {
    const result = this.args.getValue(startDate, endDate);

    return this.parseDateRange(result);
  }

  public validate(
    startDate?: Date,
    endDate?: Date
  ): SkyDateRangeValidationResult {
    const defaultResult = Observable.of(undefined);

    if (!this.args.validate) {
      return defaultResult;
    }

    return this.args.validate(startDate, endDate) || defaultResult;
  }

  private parseDateRange(value: any = {}): SkyDateRange {
    /* tslint:disable:no-null-keyword */
    if (value.startDate === undefined) {
      value.startDate = null;
    }

    if (value.endDate === undefined) {
      value.endDate = null;
    }
    /* tslint:enable */

    value.id = this.id;

    return value as SkyDateRange;
  }
}
