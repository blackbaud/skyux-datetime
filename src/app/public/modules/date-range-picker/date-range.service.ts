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

import { SkyDateRangeCalculatorArgs } from './date-range-calculator-args';
import { SkyDateRangeCalculatorConfig } from './date-range-calculator-config';
import { SkyDateRangeCalculatorId } from './date-range-calculator-id';
import { SkyDateRangeCalculatorInstance } from './date-range-calculator-instance';
import { SkyDateRangeCalculatorType } from './date-range-calculator-type';
import { SkyDateRangeCalculator } from './date-range-calculator';
import { SkyDateRangeValidationResult } from './date-range-validation-result';
import { SkyDateRange } from './date-range';

@Injectable()
export class SkyDateRangeService {
  private static calculators: SkyDateRangeCalculator[] = [];

  // Start the count higher than the number of available values
  // provided in the SkyDateRangeCalculatorName enum.
  private static uniqueId = 1000;

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
      getValue: (startDate, endDate) => ({ startDate, endDate })
    },

    [SkyDateRangeCalculatorId.LastFiscalYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      getValue: () => {
        const start = new Date();
        start.setDate(1);
        start.setFullYear(start.getFullYear() - 1);

        const { startDate, endDate } = this.getClosestFiscalYearRange(start);

        return {
          startDate,
          endDate
        };
      },
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_last_fiscal_year'
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
    value: SkyDateRange = {}
  ): SkyDateRange {
    const calculator = this.getCalculatorById(id);
    return calculator.getValue(value.startDate, value.endDate);
  }

  public validate(
    id: SkyDateRangeCalculatorId,
    value: SkyDateRange = {}
  ): SkyDateRangeValidationResult {
    const calculator = this.getCalculatorById(id);

    if (calculator.type === SkyDateRangeCalculatorType.Range) {
      if (
        value.startDate &&
        value.endDate &&
        value.startDate > value.endDate
      ) {
        return this.resourcesService
          .getString('skyux_date_range_picker_invalid_range_error_label')
          .map(message => message);
      }
    }

    return calculator.validate(value.startDate, value.endDate);
  }

  public getCalculatorInstanceById(
    calculatorId: SkyDateRangeCalculatorId
  ): SkyDateRangeCalculatorInstance {
    const id = parseInt(calculatorId as any, 10);
    const found = SkyDateRangeService.calculators.find((calculator) => {
      return (calculator.id === id);
    });

    return this.parseCalculatorInstance(found);
  }

  private getCalculatorById(
    calculatorId: SkyDateRangeCalculatorId
  ): SkyDateRangeCalculator {
    const id: number = parseInt(calculatorId as any, 10);
    return SkyDateRangeService.calculators.find((calculator) => {
      return (calculator.id === id);
    });
  }

  private parseCalculatorInstance(value: any): SkyDateRangeCalculatorInstance {
    return {
      id: value.id,
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

// import {
//   Injectable
// } from '@angular/core';

// import {
//   Observable
// } from 'rxjs/Observable';

// import { SkyDateRangeCalculator } from './date-range-calculator';
// import { SkyDateRangeCalculatorName } from './date-range-calculator-name';
// import { SkyDateRangeCalculatorType } from './date-range-calculator-type';
// import { SkyDateRange } from './date-range';

// @Injectable()
// export class SkyDateRangeService {
//   public get defaultDateRangeCalculators(): SkyDateRangeCalculator[] {
//     return this.defaultCalculatorConfigs;
//   }

//   // #region relative date range values

//   private get lastFiscalYear(): SkyDateRange {
//     const start = new Date();
//     start.setDate(1);
//     start.setFullYear(start.getFullYear() - 1);

//     const { startDate, endDate } = this.getClosestFiscalYearRange(start);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.LastFiscalYear,
//       startDate,
//       endDate
//     });
//   }

//   private get lastMonth(): SkyDateRange {
//     const firstDayOfMonth = new Date();
//     // First, set the day of the month to zero,
//     // which points to the last day of the previous month.
//     firstDayOfMonth.setDate(0);
//     // Finally, set the day of the month to 1.
//     firstDayOfMonth.setDate(1);

//     const lastDayOfMonth = new Date();
//     lastDayOfMonth.setDate(0);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.LastMonth,
//       startDate: firstDayOfMonth,
//       endDate: lastDayOfMonth
//     });
//   }

//   private get lastQuarter(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);

//     const endDate = new Date();
//     endDate.setDate(1);

//     const beginningOfQuarter = Math.floor((startDate.getMonth() - 1) / 3) * 3;
//     if (beginningOfQuarter === 0) {
//       startDate.setFullYear(startDate.getFullYear() - 1);
//       startDate.setMonth(9);
//       endDate.setMonth(0);
//       endDate.setDate(0);
//     } else {
//       startDate.setMonth(beginningOfQuarter - 3);
//       endDate.setMonth(beginningOfQuarter);
//       endDate.setDate(0);
//     }

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.LastQuarter,
//       startDate,
//       endDate
//     });
//   }

//   private get lastWeek(): SkyDateRange {
//     const firstDayOfWeek = new Date();
//     firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() - 7);

//     const lastDayOfWeek = new Date();
//     lastDayOfWeek.setDate(lastDayOfWeek.getDate() - lastDayOfWeek.getDay() - 1);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.LastWeek,
//       startDate: firstDayOfWeek,
//       endDate: lastDayOfWeek
//     });
//   }

//   private get lastYear(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);
//     startDate.setMonth(0);
//     startDate.setFullYear(startDate.getFullYear() - 1);

//     const endDate = new Date();
//     endDate.setDate(1);
//     endDate.setMonth(0);
//     endDate.setDate(0);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.LastYear,
//       startDate,
//       endDate
//     });
//   }

//   private get nextFiscalYear(): SkyDateRange {
//     const start = new Date();
//     start.setDate(1);
//     start.setFullYear(start.getFullYear() + 1);

//     const { startDate, endDate } = this.getClosestFiscalYearRange(start);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.NextFiscalYear,
//       startDate,
//       endDate
//     });
//   }

//   private get nextMonth(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);
//     startDate.setMonth(startDate.getMonth() + 1);

//     const endDate = new Date();
//     endDate.setDate(1);
//     endDate.setMonth(endDate.getMonth() + 2);
//     endDate.setDate(0);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.NextMonth,
//       startDate,
//       endDate
//     });
//   }

//   private get nextQuarter(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);

//     const endDate = new Date();
//     endDate.setDate(1);

//     const beginningOfQuarter = Math.floor((startDate.getMonth()) / 3) * 3;
//     if (beginningOfQuarter === 9) {
//       startDate.setMonth(0);
//       startDate.setFullYear(startDate.getFullYear() + 1);
//       endDate.setMonth(3);
//       endDate.setFullYear(endDate.getFullYear() + 1);
//       endDate.setDate(0);
//     } else if (beginningOfQuarter === 6) {
//       startDate.setMonth(9);
//       endDate.setMonth(0);
//       endDate.setFullYear(endDate.getFullYear() + 1);
//       endDate.setDate(0);
//     } else {
//       startDate.setMonth(beginningOfQuarter + 3);
//       endDate.setMonth(beginningOfQuarter + 4);
//       endDate.setDate(0);
//     }

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.NextQuarter,
//       startDate,
//       endDate
//     });
//   }

//   private get nextWeek(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - startDate.getDay() + 7);

//     const endDate = new Date();
//     endDate.setDate(endDate.getDate() - endDate.getDay() + 13);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.NextWeek,
//       startDate,
//       endDate
//     });
//   }

//   private get nextYear(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);
//     startDate.setMonth(0);
//     startDate.setFullYear(startDate.getFullYear() + 1);

//     const endDate = new Date();
//     endDate.setDate(1);
//     endDate.setMonth(0);
//     endDate.setFullYear(startDate.getFullYear() + 2);
//     endDate.setDate(0);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.NextYear,
//       startDate,
//       endDate
//     });
//   }

//   private get thisFiscalYear(): SkyDateRange {
//     const start = new Date();
//     start.setDate(1);

//     const { startDate, endDate } = this.getClosestFiscalYearRange(start);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.ThisFiscalYear,
//       startDate: startDate,
//       endDate: endDate
//     });
//   }

//   private get thisMonth(): SkyDateRange {
//     const firstDayOfMonth = new Date();
//     firstDayOfMonth.setDate(1);

//     const lastDayOfMonth = new Date();
//     lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
//     lastDayOfMonth.setDate(0);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.ThisMonth,
//       startDate: firstDayOfMonth,
//       endDate: lastDayOfMonth
//     });
//   }

//   private get thisQuarter(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);

//     const endDate = new Date();
//     endDate.setDate(1);

//     const beginningOfQuarter = Math.floor((startDate.getMonth() - 1) / 3) * 3;
//     startDate.setMonth(beginningOfQuarter);
//     endDate.setMonth(beginningOfQuarter + 3);
//     endDate.setDate(0);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.ThisQuarter,
//       startDate,
//       endDate
//     });
//   }

//   private get thisWeek(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - startDate.getDay());

//     const endDate = new Date();
//     endDate.setDate(endDate.getDate() - endDate.getDay() + 6);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.ThisWeek,
//       startDate,
//       endDate
//     });
//   }

//   private get thisYear(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);
//     startDate.setMonth(0);

//     const endDate = new Date();
//     endDate.setDate(1);
//     endDate.setMonth(0);
//     endDate.setFullYear(endDate.getFullYear() + 1);
//     endDate.setDate(0);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.ThisYear,
//       startDate,
//       endDate
//     });
//   }

//   private get today(): SkyDateRange {
//     const today = new Date();

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.Today,
//       startDate: today,
//       endDate: today
//     });
//   }

//   private get tomorrow(): SkyDateRange {
//     const today = new Date();
//     const tomorrow = new Date();

//     tomorrow.setDate(tomorrow.getDate() + 1);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.Tomorrow,
//       startDate: today,
//       endDate: tomorrow
//     });
//   }

//   private get yesterday(): SkyDateRange {
//     const today = new Date();
//     const yesterday = new Date();

//     yesterday.setDate(yesterday.getDate() - 1);

//     return this.parseDateRange({
//       name: SkyDateRangeCalculatorName.Yesterday,
//       startDate: yesterday,
//       endDate: today
//     });
//   }

//   // #endregion

//   private defaultCalculatorConfigs: SkyDateRangeCalculator[] = [
//     {
//       captionResourceKey: 'skyux_date_range_picker_format_label_specific_range',
//       type: SkyDateRangeCalculatorType.Range,
//       name: SkyDateRangeCalculatorName.SpecificRange,
//       getValue: (startDate, endDate) => {
//         return this.parseDateRange({
//           name: SkyDateRangeCalculatorName.SpecificRange,
//           startDate,
//           endDate
//         });
//       },
//       validate: () => {
//         return Observable.of({
//           errors: [{
//             message: 'The start date must come before the end date.'
//           }]
//         });
//       }
//     },
//     {
//       captionResourceKey: 'skyux_date_range_picker_format_label_before',
//       type: SkyDateRangeCalculatorType.Before,
//       name: SkyDateRangeCalculatorName.Before,
//       getValue: (startDate, endDate) => {
//         return this.parseDateRange({
//           name: SkyDateRangeCalculatorName.Before,
//           endDate
//         });
//       }
//     },
//     {
//       captionResourceKey: 'skyux_date_range_picker_format_label_after',
//       type: SkyDateRangeCalculatorType.After,
//       name: SkyDateRangeCalculatorName.After,
//       getValue: (startDate) => {
//         return this.parseDateRange({
//           name: SkyDateRangeCalculatorName.After,
//           startDate
//         });
//       }
//     },
//     {
//       captionResourceKey: 'skyux_date_range_picker_format_label_any_time',
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.AtAnyTime,
//       getValue: () => {
//         return this.parseDateRange({
//           name: SkyDateRangeCalculatorName.AtAnyTime
//         });
//       }
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.LastFiscalYear,
//       getValue: () => this.lastFiscalYear,
//       captionResourceKey: 'skyux_date_range_picker_format_label_last_fiscal_year'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.LastMonth,
//       getValue: () => this.lastMonth,
//       captionResourceKey: 'skyux_date_range_picker_format_label_last_month'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.LastQuarter,
//       getValue: () => this.lastQuarter,
//       captionResourceKey: 'skyux_date_range_picker_format_label_last_quarter'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.LastWeek,
//       getValue: () => this.lastWeek,
//       captionResourceKey: 'skyux_date_range_picker_format_label_last_week'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.LastYear,
//       getValue: () => this.lastYear,
//       captionResourceKey: 'skyux_date_range_picker_format_label_last_year'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.NextFiscalYear,
//       getValue: () => this.nextFiscalYear,
//       captionResourceKey: 'skyux_date_range_picker_format_label_next_fiscal_year'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.NextMonth,
//       getValue: () => this.nextMonth,
//       captionResourceKey: 'skyux_date_range_picker_format_label_next_month'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.NextQuarter,
//       getValue: () => this.nextQuarter,
//       captionResourceKey: 'skyux_date_range_picker_format_label_next_quarter'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.NextWeek,
//       getValue: () => this.nextWeek,
//       captionResourceKey: 'skyux_date_range_picker_format_label_next_week'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.NextYear,
//       getValue: () => this.nextYear,
//       captionResourceKey: 'skyux_date_range_picker_format_label_next_year'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.ThisFiscalYear,
//       getValue: () => this.thisFiscalYear,
//       captionResourceKey: 'skyux_date_range_picker_format_label_this_fiscal_year'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.ThisMonth,
//       getValue: () => this.thisMonth,
//       captionResourceKey: 'skyux_date_range_picker_format_label_this_month'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.ThisQuarter,
//       getValue: () => this.thisQuarter,
//       captionResourceKey: 'skyux_date_range_picker_format_label_this_quarter'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.ThisWeek,
//       getValue: () => this.thisWeek,
//       captionResourceKey: 'skyux_date_range_picker_format_label_this_week'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.ThisYear,
//       getValue: () => this.thisYear,
//       captionResourceKey: 'skyux_date_range_picker_format_label_this_year'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.Today,
//       getValue: () => this.today,
//       captionResourceKey: 'skyux_date_range_picker_format_label_today'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.Tomorrow,
//       getValue: () => this.tomorrow,
//       captionResourceKey: 'skyux_date_range_picker_format_label_tomorrow'
//     },
//     {
//       type: SkyDateRangeCalculatorType.Relative,
//       name: SkyDateRangeCalculatorName.Yesterday,
//       getValue: () => this.yesterday,
//       captionResourceKey: 'skyux_date_range_picker_format_label_yesterday'
//     }
//   ];

//   // public createCustomType(args: {
//   //   captionResourceKey: string;
//   //   getValue: () => SkyDateRange
//   // }): SkyDateRangeOption {
//   //   return {
//   //     captionResourceKey: args.caption,
//   //     dateRangeType: SkyDateRangeCalculatorType.Custom,
//   //     getValue: args.getValue
//   //   };
//   // }

//   private getClosestFiscalYearRange(startDate: Date): { startDate: Date, endDate: Date } {
//     const endDate = new Date(startDate);

//     if (startDate.getMonth() >= 9) {
//       startDate.setMonth(9);
//       endDate.setFullYear(startDate.getFullYear() + 1);
//       endDate.setMonth(9);
//       endDate.setDate(0);
//     } else {
//       startDate.setFullYear(startDate.getFullYear() - 1);
//       startDate.setMonth(9);
//       endDate.setMonth(9);
//       endDate.setDate(0);
//     }

//     return {
//       startDate,
//       endDate
//     };
//   }

//   private parseDateRange(value: any): SkyDateRange {
//     /* tslint:disable:no-null-keyword */
//     if (value.startDate === undefined) {
//       value.startDate = null;
//     }

//     if (value.endDate === undefined) {
//       value.endDate = null;
//     }
//     /* tslint:enable */

//     return value as SkyDateRange;
//   }
// }
