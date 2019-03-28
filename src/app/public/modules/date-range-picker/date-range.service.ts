import {
  Injectable
} from '@angular/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/operator/first';

import {
  SkyDateRangeCalculatorArgs
} from './date-range-calculator-args';

import {
  SkyDateRangeCalculatorConfig
} from './date-range-calculator-config';

import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRangeCalculatorInstance
} from './date-range-calculator-instance';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeCalculator
} from './date-range-calculator';

import {
  SkyDateRangeValidationResult
} from './date-range-validation-result';

import {
  SkyDateRange
} from './date-range';

@Injectable()
export class SkyDateRangeService {
  private static calculators: SkyDateRangeCalculator[] = [];

  // Start the count higher than the number of available values
  // provided in the SkyDateRangeCalculatorId enum.
  private static uniqueId = 1000;

  private get lastMonth(): SkyDateRange {
    const firstDayOfMonth = new Date();
    // First, set the day of the month to zero,
    // which points to the last day of the previous month.
    firstDayOfMonth.setDate(0);
    // Finally, set the day of the month to 1.
    firstDayOfMonth.setDate(1);

    const lastDayOfMonth = new Date();
    lastDayOfMonth.setDate(0);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.LastMonth,
      startDate: firstDayOfMonth,
      endDate: lastDayOfMonth
    });
  }

  private get lastQuarter(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);

    const endDate = new Date();
    endDate.setDate(1);

    const beginningOfQuarter = Math.floor((startDate.getMonth() - 1) / 3) * 3;
    if (beginningOfQuarter === 0) {
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setMonth(9);
      endDate.setMonth(0);
      endDate.setDate(0);
    } else {
      startDate.setMonth(beginningOfQuarter - 3);
      endDate.setMonth(beginningOfQuarter);
      endDate.setDate(0);
    }

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.LastQuarter,
      startDate,
      endDate
    });
  }

  private get lastWeek(): SkyDateRange {
    const firstDayOfWeek = new Date();
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() - 7);

    const lastDayOfWeek = new Date();
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() - lastDayOfWeek.getDay() - 1);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.LastWeek,
      startDate: firstDayOfWeek,
      endDate: lastDayOfWeek
    });
  }

  private get lastYear(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(0);
    startDate.setFullYear(startDate.getFullYear() - 1);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(0);
    endDate.setDate(0);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.LastYear,
      startDate,
      endDate
    });
  }

  private get nextFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);
    start.setFullYear(start.getFullYear() + 1);

    const { startDate, endDate } = this.getClosestFiscalYearRange(start);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.NextFiscalYear,
      startDate,
      endDate
    });
  }

  private get nextMonth(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(startDate.getMonth() + 1);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(endDate.getMonth() + 2);
    endDate.setDate(0);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.NextMonth,
      startDate,
      endDate
    });
  }

  private get nextQuarter(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);

    const endDate = new Date();
    endDate.setDate(1);

    const beginningOfQuarter = Math.floor((startDate.getMonth()) / 3) * 3;
    if (beginningOfQuarter === 9) {
      startDate.setMonth(0);
      startDate.setFullYear(startDate.getFullYear() + 1);
      endDate.setMonth(3);
      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate.setDate(0);
    } else if (beginningOfQuarter === 6) {
      startDate.setMonth(9);
      endDate.setMonth(0);
      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate.setDate(0);
    } else {
      startDate.setMonth(beginningOfQuarter + 3);
      endDate.setMonth(beginningOfQuarter + 4);
      endDate.setDate(0);
    }

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.NextQuarter,
      startDate,
      endDate
    });
  }

  private get nextWeek(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 7);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - endDate.getDay() + 13);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.NextWeek,
      startDate,
      endDate
    });
  }

  private get nextYear(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(0);
    startDate.setFullYear(startDate.getFullYear() + 1);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(0);
    endDate.setFullYear(startDate.getFullYear() + 2);
    endDate.setDate(0);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.NextYear,
      startDate,
      endDate
    });
  }

  private get thisFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);

    const { startDate, endDate } = this.getClosestFiscalYearRange(start);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.ThisFiscalYear,
      startDate: startDate,
      endDate: endDate
    });
  }

  private get thisMonth(): SkyDateRange {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);

    const lastDayOfMonth = new Date();
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
    lastDayOfMonth.setDate(0);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.ThisMonth,
      startDate: firstDayOfMonth,
      endDate: lastDayOfMonth
    });
  }

  private get thisQuarter(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);

    const endDate = new Date();
    endDate.setDate(1);

    const beginningOfQuarter = Math.floor((startDate.getMonth() - 1) / 3) * 3;
    startDate.setMonth(beginningOfQuarter);
    endDate.setMonth(beginningOfQuarter + 3);
    endDate.setDate(0);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.ThisQuarter,
      startDate,
      endDate
    });
  }

  private get thisWeek(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - endDate.getDay() + 6);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.ThisWeek,
      startDate,
      endDate
    });
  }

  private get thisYear(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(0);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(0);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setDate(0);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.ThisYear,
      startDate,
      endDate
    });
  }

  private get today(): SkyDateRange {
    const today = new Date();

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.Today,
      startDate: today,
      endDate: today
    });
  }

  private get tomorrow(): SkyDateRange {
    const today = new Date();
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.Tomorrow,
      startDate: today,
      endDate: tomorrow
    });
  }

  private get yesterday(): SkyDateRange {
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    return this.parseDateRange({
      calculatorId: SkyDateRangeCalculatorId.Yesterday,
      startDate: yesterday,
      endDate: today
    });
  }

  private calculatorConfigs: {
    [id: number]: SkyDateRangeCalculatorArgs
  } = {

    [SkyDateRangeCalculatorId.AnyTime]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_any_time',
      getValue: () => ({})
    },

    [SkyDateRangeCalculatorId.Before]: {
      type: SkyDateRangeCalculatorType.Before,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_before',
      getValue: (startDate, endDate) => ({ endDate })
    },

    [SkyDateRangeCalculatorId.After]: {
      type: SkyDateRangeCalculatorType.After,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_after',
      getValue: (startDate) => ({ startDate })
    },

    [SkyDateRangeCalculatorId.SpecificRange]: {
      type: SkyDateRangeCalculatorType.Range,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_specific_range',
      getValue: (startDate, endDate) => ({ startDate, endDate }),
      validate: (startDate, endDate) => {
        if (
          startDate &&
          endDate &&
          startDate > endDate
        ) {
          return 'endDateBeforeStartDate';
        }
      }
    },

    [SkyDateRangeCalculatorId.LastFiscalYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_last_fiscal_year',
      getValue: () => {
        const start = new Date();
        start.setDate(1);
        start.setFullYear(start.getFullYear() - 1);

        const { startDate, endDate } = this.getClosestFiscalYearRange(start);

        return {
          startDate,
          endDate
        };
      }
    },

    [SkyDateRangeCalculatorId.LastMonth]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_last_month',
      getValue: () => this.lastMonth
    },

    [SkyDateRangeCalculatorId.LastQuarter]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_last_quarter',
      getValue: () => this.lastQuarter
    },

    [SkyDateRangeCalculatorId.LastWeek]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_last_week',
      getValue: () => this.lastWeek
    },

    [SkyDateRangeCalculatorId.LastYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_last_year',
      getValue: () => this.lastYear
    },

    [SkyDateRangeCalculatorId.NextFiscalYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_next_fiscal_year',
      getValue: () => this.nextFiscalYear
    },

    [SkyDateRangeCalculatorId.NextMonth]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_next_month',
      getValue: () => this.nextMonth
    },

    [SkyDateRangeCalculatorId.NextQuarter]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_next_quarter',
      getValue: () => this.nextQuarter
    },

    [SkyDateRangeCalculatorId.NextWeek]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_next_week',
      getValue: () => this.nextWeek
    },

    [SkyDateRangeCalculatorId.NextYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_next_year',
      getValue: () => this.nextYear
    },

    [SkyDateRangeCalculatorId.ThisFiscalYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_this_fiscal_year',
      getValue: () => this.thisFiscalYear
    },

    [SkyDateRangeCalculatorId.ThisMonth]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_this_month',
      getValue: () => this.thisMonth
    },

    [SkyDateRangeCalculatorId.ThisQuarter]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_this_quarter',
      getValue: () => this.thisQuarter
    },

    [SkyDateRangeCalculatorId.ThisWeek]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_this_week',
      getValue: () => this.thisWeek
    },

    [SkyDateRangeCalculatorId.ThisYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_this_year',
      getValue: () => this.thisYear
    },

    [SkyDateRangeCalculatorId.Today]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_today',
      getValue: () => this.today
    },

    [SkyDateRangeCalculatorId.Tomorrow]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_tomorrow',
      getValue: () => this.tomorrow
    },

    [SkyDateRangeCalculatorId.Yesterday]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_yesterday',
      getValue: () => this.yesterday
    }
  };

  constructor(
    private resourcesService: SkyLibResourcesService
  ) {
    this.createDefaultCalculators();
  }

  public createCalculator(config: SkyDateRangeCalculatorConfig): SkyDateRangeCalculatorInstance {
    const newId = SkyDateRangeService.uniqueId++;
    const calculator = new SkyDateRangeCalculator(newId, config);

    SkyDateRangeService.calculators.push(calculator);

    return this.parseCalculatorInstance(calculator);
  }

  public getCalculatorInstances(
    ids: SkyDateRangeCalculatorId[]
  ): Promise<SkyDateRangeCalculatorInstance[]> {
    const tasks: Observable<void>[] = [];

    const calculators: SkyDateRangeCalculator[] = ids.map((id) => {
      return this.getCalculatorById(id);
    });

    calculators.forEach((calculator) => {
      if (calculator.shortDescriptionResourceKey) {
        tasks.push(
          this.resourcesService.getString(calculator.shortDescriptionResourceKey)
            .first()
            .map((value) => {
              calculator.shortDescription = value;
            })
        );
      }
    });

    return new Promise((resolve) => {
      Observable.forkJoin(tasks).first().subscribe(() => {
        const result = calculators.map((calculator) => {
          return this.parseCalculatorInstance(calculator);
        });

        resolve(result);
      });
    });
  }

  public getValue(
    id: SkyDateRangeCalculatorId,
    value: {
      startDate?: Date;
      endDate?: Date;
    } = { }
  ): SkyDateRange {
    const calculator = this.getCalculatorById(id);

    return calculator.getValue(value.startDate, value.endDate);
  }

  public validate(
    id: SkyDateRangeCalculatorId,
    value: {
      startDate?: Date;
      endDate?: Date;
    } = { }
  ): {
    calculatorId: SkyDateRangeCalculatorId,
    error: {
      [_: string]: boolean
    }
  } {
    const calculator = this.getCalculatorById(id);

    const result: SkyDateRangeValidationResult = calculator.validate(
      value.startDate,
      value.endDate
    );

    if (result) {
      const formatted: any = {};

      formatted[result.trim().replace(/ /g, '')] = true;

      return {
        calculatorId: calculator.calculatorId,
        error: formatted
      };
    }

    return;
  }

  public getCalculatorInstanceById(
    calculatorId: SkyDateRangeCalculatorId
  ): SkyDateRangeCalculatorInstance {
    const id = parseInt(calculatorId as any, 10);

    const found = SkyDateRangeService.calculators.find((calculator) => {
      return (calculator.calculatorId === id);
    });

    return this.parseCalculatorInstance(found);
  }

  public parseDateRange(
    value: {calculatorId: any, startDate?: Date, endDate?: Date}
  ): SkyDateRange {
    /* tslint:disable:no-null-keyword */
    if (value.startDate === undefined) {
      value.startDate = null;
    }

    if (value.endDate === undefined) {
      value.endDate = null;
    }
    /* tslint:enable */

    // ID will come in as a string if derived from a template control.
    if (typeof value.calculatorId === 'string') {
      value.calculatorId = parseInt(value.calculatorId, 10);
    }

    return value as SkyDateRange;
  }

  private getCalculatorById(
    calculatorId: SkyDateRangeCalculatorId
  ): SkyDateRangeCalculator {
    const id: number = parseInt(calculatorId as any, 10);
    return SkyDateRangeService.calculators.find((calculator) => {
      return (calculator.calculatorId === id);
    });
  }

  private parseCalculatorInstance(value: any): SkyDateRangeCalculatorInstance {
    return {
      calculatorId: value.calculatorId,
      type: value.type,
      shortDescription: value.shortDescription
    };
  }

  private createDefaultCalculators(): void {
    SkyDateRangeService.calculators = Object.keys(this.calculatorConfigs).map((key) => {
      const id = parseInt(key, 10);
      return new SkyDateRangeCalculator(id, this.calculatorConfigs[id]);
    });
  }

  private getClosestFiscalYearRange(startDate: Date): { startDate: Date, endDate: Date } {
    const endDate = new Date(startDate);

    if (startDate.getMonth() >= 9) {
      startDate.setMonth(9);
      endDate.setFullYear(startDate.getFullYear() + 1);
      endDate.setMonth(9);
      endDate.setDate(0);
    } else {
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setMonth(9);
      endDate.setMonth(9);
      endDate.setDate(0);
    }

    return {
      startDate,
      endDate
    };
  }
}
