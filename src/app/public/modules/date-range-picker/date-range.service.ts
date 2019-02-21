import {
  Injectable
} from '@angular/core';
import { SkyDateRangeCalculatorConfig } from './types/date-range-calculator-config';
import { SkyDateRangeCalculatorHandle } from './types/date-range-calculator-handle';
import { SkyDateRangeCalculatorType } from './types/date-range-calculator-type';
import { SkyDateRange } from './types/date-range';
import { Observable } from 'rxjs';

@Injectable()
export class SkyDateRangeService {
  // #region relative date range values

  private get lastFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);
    start.setFullYear(start.getFullYear() - 1);

    const { startDate, endDate } = this.getClosestFiscalYearRange(start);

    return {
      handle: SkyDateRangeCalculatorHandle.LastFiscalYear,
      startDate,
      endDate
    };
  }

  private get lastMonth(): SkyDateRange {
    const firstDayOfMonth = new Date();
    // First, set the day of the month to zero,
    // which points to the last day of the previous month.
    firstDayOfMonth.setDate(0);
    // Finally, set the day of the month to 1.
    firstDayOfMonth.setDate(1);

    const lastDayOfMonth = new Date();
    lastDayOfMonth.setDate(0);

    return {
      handle: SkyDateRangeCalculatorHandle.LastMonth,
      startDate: firstDayOfMonth,
      endDate: lastDayOfMonth
    };
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

    return {
      handle: SkyDateRangeCalculatorHandle.LastQuarter,
      startDate,
      endDate
    };
  }

  private get lastWeek(): SkyDateRange {
    const firstDayOfWeek = new Date();
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() - 7);

    const lastDayOfWeek = new Date();
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() - lastDayOfWeek.getDay() - 1);

    return {
      handle: SkyDateRangeCalculatorHandle.LastWeek,
      startDate: firstDayOfWeek,
      endDate: lastDayOfWeek
    };
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

    return {
      handle: SkyDateRangeCalculatorHandle.LastYear,
      startDate,
      endDate
    };
  }

  private get nextFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);
    start.setFullYear(start.getFullYear() + 1);

    const { startDate, endDate } = this.getClosestFiscalYearRange(start);

    return {
      handle: SkyDateRangeCalculatorHandle.NextFiscalYear,
      startDate,
      endDate
    };
  }

  private get nextMonth(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(startDate.getMonth() + 1);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(endDate.getMonth() + 2);
    endDate.setDate(0);

    return {
      handle: SkyDateRangeCalculatorHandle.NextMonth,
      startDate,
      endDate
    };
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

    return {
      handle: SkyDateRangeCalculatorHandle.NextQuarter,
      startDate,
      endDate
    };
  }

  private get nextWeek(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 7);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - endDate.getDay() + 13);

    return {
      handle: SkyDateRangeCalculatorHandle.NextWeek,
      startDate,
      endDate
    };
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

    return {
      handle: SkyDateRangeCalculatorHandle.NextYear,
      startDate,
      endDate
    };
  }

  private get thisFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);

    const { startDate, endDate } = this.getClosestFiscalYearRange(start);

    return {
      handle: SkyDateRangeCalculatorHandle.ThisFiscalYear,
      startDate: startDate,
      endDate: endDate
    };
  }

  private get thisMonth(): SkyDateRange {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);

    const lastDayOfMonth = new Date();
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
    lastDayOfMonth.setDate(0);

    return {
      handle: SkyDateRangeCalculatorHandle.ThisMonth,
      startDate: firstDayOfMonth,
      endDate: lastDayOfMonth
    };
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

    return {
      handle: SkyDateRangeCalculatorHandle.ThisQuarter,
      startDate,
      endDate
    };
  }

  private get thisWeek(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - endDate.getDay() + 6);

    return {
      handle: SkyDateRangeCalculatorHandle.ThisWeek,
      startDate,
      endDate
    };
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

    return {
      handle: SkyDateRangeCalculatorHandle.ThisYear,
      startDate,
      endDate
    };
  }

  private get today(): SkyDateRange {
    const today = new Date();

    return {
      handle: SkyDateRangeCalculatorHandle.Today,
      startDate: today,
      endDate: today
    };
  }

  private get tomorrow(): SkyDateRange {
    const today = new Date();
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      handle: SkyDateRangeCalculatorHandle.Tomorrow,
      startDate: today,
      endDate: tomorrow
    };
  }

  private get yesterday(): SkyDateRange {
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    return {
      handle: SkyDateRangeCalculatorHandle.Yesterday,
      startDate: yesterday,
      endDate: today
    };
  }

  // #endregion

  private defaultCalculatorConfigs: SkyDateRangeCalculatorConfig[] = [
    {
      captionResourceKey: 'skyux_date_range_picker_format_label_specific_range',
      type: SkyDateRangeCalculatorType.BeforeAndAfter,
      handle: SkyDateRangeCalculatorHandle.SpecificRange,
      getValue: (startDate, endDate) => {
        return {
          handle: SkyDateRangeCalculatorHandle.SpecificRange,
          startDate,
          endDate
        };
      },
      validate: (startDate: Date, endDate: Date) => {
        return Observable.of({
          errors: [{
            message: 'The start date must come before the end date.'
          }]
        });
      }
    },
    {
      captionResourceKey: 'skyux_date_range_picker_format_label_before',
      type: SkyDateRangeCalculatorType.Before,
      handle: SkyDateRangeCalculatorHandle.Before,
      getValue: (startDate, endDate) => {
        return {
          handle: SkyDateRangeCalculatorHandle.Before,
          startDate: undefined,
          endDate
        };
      }
    },
    {
      captionResourceKey: 'skyux_date_range_picker_format_label_after',
      type: SkyDateRangeCalculatorType.After,
      handle: SkyDateRangeCalculatorHandle.After,
      getValue: (startDate) => {
        return {
          handle: SkyDateRangeCalculatorHandle.After,
          startDate,
          endDate: undefined
        };
      }
    },
    {
      captionResourceKey: 'skyux_date_range_picker_format_label_at_any_time',
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.AtAnyTime,
      getValue: () => ({
        handle: SkyDateRangeCalculatorHandle.AtAnyTime,
        startDate: undefined,
        endDate: undefined
      })
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.LastFiscalYear,
      getValue: () => this.lastFiscalYear,
      captionResourceKey: 'skyux_date_range_picker_format_label_last_fiscal_year'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.LastMonth,
      getValue: () => this.lastMonth,
      captionResourceKey: 'skyux_date_range_picker_format_label_last_month'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.LastQuarter,
      getValue: () => this.lastQuarter,
      captionResourceKey: 'skyux_date_range_picker_format_label_last_quarter'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.LastWeek,
      getValue: () => this.lastWeek,
      captionResourceKey: 'skyux_date_range_picker_format_label_last_week'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.LastYear,
      getValue: () => this.lastYear,
      captionResourceKey: 'skyux_date_range_picker_format_label_last_year'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.NextFiscalYear,
      getValue: () => this.nextFiscalYear,
      captionResourceKey: 'skyux_date_range_picker_format_label_next_fiscal_year'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.NextMonth,
      getValue: () => this.nextMonth,
      captionResourceKey: 'skyux_date_range_picker_format_label_next_month'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.NextQuarter,
      getValue: () => this.nextQuarter,
      captionResourceKey: 'skyux_date_range_picker_format_label_next_quarter'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.NextWeek,
      getValue: () => this.nextWeek,
      captionResourceKey: 'skyux_date_range_picker_format_label_next_week'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.NextYear,
      getValue: () => this.nextYear,
      captionResourceKey: 'skyux_date_range_picker_format_label_next_year'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.ThisFiscalYear,
      getValue: () => this.thisFiscalYear,
      captionResourceKey: 'skyux_date_range_picker_format_label_this_fiscal_year'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.ThisMonth,
      getValue: () => this.thisMonth,
      captionResourceKey: 'skyux_date_range_picker_format_label_this_month'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.ThisQuarter,
      getValue: () => this.thisQuarter,
      captionResourceKey: 'skyux_date_range_picker_format_label_this_quarter'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.ThisWeek,
      getValue: () => this.thisWeek,
      captionResourceKey: 'skyux_date_range_picker_format_label_this_week'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.ThisYear,
      getValue: () => this.thisYear,
      captionResourceKey: 'skyux_date_range_picker_format_label_this_year'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.Today,
      getValue: () => this.today,
      captionResourceKey: 'skyux_date_range_picker_format_label_today'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.Tomorrow,
      getValue: () => this.tomorrow,
      captionResourceKey: 'skyux_date_range_picker_format_label_tomorrow'
    },
    {
      type: SkyDateRangeCalculatorType.Relative,
      handle: SkyDateRangeCalculatorHandle.Yesterday,
      getValue: () => this.yesterday,
      captionResourceKey: 'skyux_date_range_picker_format_label_yesterday'
    }
  ];

  // public createCustomType(args: {
  //   captionResourceKey: string;
  //   getValue: () => SkyDateRange
  // }): SkyDateRangeOption {
  //   return {
  //     captionResourceKey: args.caption,
  //     dateRangeType: SkyDateRangeCalculatorType.Custom,
  //     getValue: args.getValue
  //   };
  // }

  public getDefaultDateRangeCalculators(): SkyDateRangeCalculatorConfig[] {
    return this.defaultCalculatorConfigs;
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
