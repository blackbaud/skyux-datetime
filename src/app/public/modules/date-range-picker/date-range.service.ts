import {
  Injectable
} from '@angular/core';

import { SkyDateRangeType } from './date-range-type';
import { SkyDateRange } from './date-range';
import { SkyDateRangeOption } from './date-range-option';

@Injectable()
export class SkyDateRangeService {
  // #region relative date range values

  private get lastFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);
    start.setFullYear(start.getFullYear() - 1);

    const { startDate, endDate } = this.getClosestFiscalYearRange(start);

    return {
      dateRangeType: SkyDateRangeType.LastFiscalYear,
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
      dateRangeType: SkyDateRangeType.LastMonth,
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
      dateRangeType: SkyDateRangeType.LastQuarter,
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
      dateRangeType: SkyDateRangeType.LastWeek,
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
      dateRangeType: SkyDateRangeType.LastYear,
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
      dateRangeType: SkyDateRangeType.NextFiscalYear,
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
      dateRangeType: SkyDateRangeType.NextMonth,
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
      dateRangeType: SkyDateRangeType.NextQuarter,
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
      dateRangeType: SkyDateRangeType.NextWeek,
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
      dateRangeType: SkyDateRangeType.NextYear,
      startDate,
      endDate
    };
  }

  private get thisFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);

    const { startDate, endDate } = this.getClosestFiscalYearRange(start);

    return {
      dateRangeType: SkyDateRangeType.ThisFiscalYear,
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
      dateRangeType: SkyDateRangeType.ThisMonth,
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
      dateRangeType: SkyDateRangeType.ThisQuarter,
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
      dateRangeType: SkyDateRangeType.ThisWeek,
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
      dateRangeType: SkyDateRangeType.ThisYear,
      startDate,
      endDate
    };
  }

  private get today(): SkyDateRange {
    const today = new Date();

    return {
      dateRangeType: SkyDateRangeType.Today,
      startDate: today,
      endDate: today
    };
  }

  private get tomorrow(): SkyDateRange {
    const today = new Date();
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      dateRangeType: SkyDateRangeType.Tomorrow,
      startDate: today,
      endDate: tomorrow
    };
  }

  private get yesterday(): SkyDateRange {
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    return {
      dateRangeType: SkyDateRangeType.Yesterday,
      startDate: yesterday,
      endDate: today
    };
  }

  // #endregion

  private defaultDateRangeOptions: SkyDateRangeOption[] = [
    {
      caption: 'skyux_date_range_picker_format_label_specific_range',
      dateRangeType: SkyDateRangeType.SpecificRange,
      showStartDateControl: true,
      showEndDateControl: true,
      getValue: (context) => {
        return {
          dateRangeType: SkyDateRangeType.SpecificRange,
          startDate: context.startDateControl.control.value,
          endDate: context.endDateControl.control.value
        };
      }
    },
    {
      caption: 'skyux_date_range_picker_format_label_before',
      dateRangeType: SkyDateRangeType.Before,
      showEndDateControl: true,
      getValue: (context) => {
        return {
          dateRangeType: SkyDateRangeType.Before,
          startDate: undefined,
          endDate: context.endDateControl.control.value
        };
      }
    },
    {
      caption: 'skyux_date_range_picker_format_label_after',
      dateRangeType: SkyDateRangeType.After,
      showStartDateControl: true,
      getValue: (context) => {
        return {
          dateRangeType: SkyDateRangeType.After,
          startDate: context.startDateControl.control.value,
          endDate: undefined
        };
      }
    },
    {
      dateRangeType: SkyDateRangeType.AtAnyTime,
      getValue: () => ({
        dateRangeType: SkyDateRangeType.AtAnyTime,
        startDate: undefined,
        endDate: undefined
      }),
      caption: 'skyux_date_range_picker_format_label_at_any_time'
    },
    {
      dateRangeType: SkyDateRangeType.LastFiscalYear,
      getValue: () => this.lastFiscalYear,
      caption: 'skyux_date_range_picker_format_label_last_fiscal_year'
    },
    {
      dateRangeType: SkyDateRangeType.LastMonth,
      getValue: () => this.lastMonth,
      caption: 'skyux_date_range_picker_format_label_last_month'
    },
    {
      dateRangeType: SkyDateRangeType.LastQuarter,
      getValue: () => this.lastQuarter,
      caption: 'skyux_date_range_picker_format_label_last_quarter'
    },
    {
      dateRangeType: SkyDateRangeType.LastWeek,
      getValue: () => this.lastWeek,
      caption: 'skyux_date_range_picker_format_label_last_week'
    },
    {
      dateRangeType: SkyDateRangeType.LastYear,
      getValue: () => this.lastYear,
      caption: 'skyux_date_range_picker_format_label_last_year'
    },
    {
      dateRangeType: SkyDateRangeType.NextFiscalYear,
      getValue: () => this.nextFiscalYear,
      caption: 'skyux_date_range_picker_format_label_next_fiscal_year'
    },
    {
      dateRangeType: SkyDateRangeType.NextMonth,
      getValue: () => this.nextMonth,
      caption: 'skyux_date_range_picker_format_label_next_month'
    },
    {
      dateRangeType: SkyDateRangeType.NextQuarter,
      getValue: () => this.nextQuarter,
      caption: 'skyux_date_range_picker_format_label_next_quarter'
    },
    {
      dateRangeType: SkyDateRangeType.NextWeek,
      getValue: () => this.nextWeek,
      caption: 'skyux_date_range_picker_format_label_next_week'
    },
    {
      dateRangeType: SkyDateRangeType.NextYear,
      getValue: () => this.nextYear,
      caption: 'skyux_date_range_picker_format_label_next_year'
    },
    {
      dateRangeType: SkyDateRangeType.ThisFiscalYear,
      getValue: () => this.thisFiscalYear,
      caption: 'skyux_date_range_picker_format_label_this_fiscal_year'
    },
    {
      dateRangeType: SkyDateRangeType.ThisMonth,
      getValue: () => this.thisMonth,
      caption: 'skyux_date_range_picker_format_label_this_month'
    },
    {
      dateRangeType: SkyDateRangeType.ThisQuarter,
      getValue: () => this.thisQuarter,
      caption: 'skyux_date_range_picker_format_label_this_quarter'
    },
    {
      dateRangeType: SkyDateRangeType.ThisWeek,
      getValue: () => this.thisWeek,
      caption: 'skyux_date_range_picker_format_label_this_week'
    },
    {
      dateRangeType: SkyDateRangeType.ThisYear,
      getValue: () => this.thisYear,
      caption: 'skyux_date_range_picker_format_label_this_year'
    },
    {
      dateRangeType: SkyDateRangeType.Today,
      getValue: () => this.today,
      caption: 'skyux_date_range_picker_format_label_today'
    },
    {
      dateRangeType: SkyDateRangeType.Tomorrow,
      getValue: () => this.tomorrow,
      caption: 'skyux_date_range_picker_format_label_tomorrow'
    },
    {
      dateRangeType: SkyDateRangeType.Yesterday,
      getValue: () => this.yesterday,
      caption: 'skyux_date_range_picker_format_label_yesterday'
    }
  ];

  // public createCustomType(args: {
  //   caption: string;
  //   getValue: () => SkyDateRange
  // }): SkyDateRangeOption {
  //   return {
  //     caption: args.caption,
  //     dateRangeType: SkyDateRangeType.Custom,
  //     getValue: args.getValue
  //   };
  // }

  public getDefaultDateRangeOptions(
    args?: { dateRangeTypes?: SkyDateRangeType[] }
  ): SkyDateRangeOption[] {
    return this.defaultDateRangeOptions;
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
