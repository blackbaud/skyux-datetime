import {
  SkyDateRange
} from './date-range';

export abstract class SkyDateRangeRelativeValue {
  public static get lastFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);
    start.setFullYear(start.getFullYear() - 1);

    const { startDate, endDate } = this.getClosestFiscalYearRange(start);

    return {
      startDate,
      endDate
    };
  }

  public static get lastMonth(): SkyDateRange {
    const firstDayOfMonth = new Date();
    // First, set the day of the month to zero,
    // which points to the last day of the previous month.
    firstDayOfMonth.setDate(0);
    // Finally, set the day of the month to 1.
    firstDayOfMonth.setDate(1);

    const lastDayOfMonth = new Date();
    lastDayOfMonth.setDate(0);

    return SkyDateRangeRelativeValue.parseValue({
      startDate: firstDayOfMonth,
      endDate: lastDayOfMonth
    });
  }

  public static get lastQuarter(): SkyDateRange {
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

    return SkyDateRangeRelativeValue.parseValue({
      startDate,
      endDate
    });
  }

  public static get lastWeek(): SkyDateRange {
    const firstDayOfWeek = new Date();
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() - 7);

    const lastDayOfWeek = new Date();
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() - lastDayOfWeek.getDay() - 1);

    return SkyDateRangeRelativeValue.parseValue({
      startDate: firstDayOfWeek,
      endDate: lastDayOfWeek
    });
  }

  public static get lastYear(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(0);
    startDate.setFullYear(startDate.getFullYear() - 1);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(0);
    endDate.setDate(0);

    return SkyDateRangeRelativeValue.parseValue({
      startDate,
      endDate
    });
  }

  public static get nextFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);
    start.setFullYear(start.getFullYear() + 1);

    const { startDate, endDate } = this.getClosestFiscalYearRange(start);

    return SkyDateRangeRelativeValue.parseValue({
      startDate,
      endDate
    });
  }

  public static get nextMonth(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(startDate.getMonth() + 1);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(endDate.getMonth() + 2);
    endDate.setDate(0);

    return SkyDateRangeRelativeValue.parseValue({
      startDate,
      endDate
    });
  }

  public static get nextQuarter(): SkyDateRange {
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

    return SkyDateRangeRelativeValue.parseValue({
      startDate,
      endDate
    });
  }

  public static get nextWeek(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 7);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - endDate.getDay() + 13);

    return SkyDateRangeRelativeValue.parseValue({
      startDate,
      endDate
    });
  }

  public static get nextYear(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(0);
    startDate.setFullYear(startDate.getFullYear() + 1);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(0);
    endDate.setFullYear(startDate.getFullYear() + 2);
    endDate.setDate(0);

    return SkyDateRangeRelativeValue.parseValue({
      startDate,
      endDate
    });
  }

  public static get thisFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);

    const { startDate, endDate } = this.getClosestFiscalYearRange(start);

    return SkyDateRangeRelativeValue.parseValue({
      startDate: startDate,
      endDate: endDate
    });
  }

  public static get thisMonth(): SkyDateRange {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);

    const lastDayOfMonth = new Date();
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
    lastDayOfMonth.setDate(0);

    return SkyDateRangeRelativeValue.parseValue({
      startDate: firstDayOfMonth,
      endDate: lastDayOfMonth
    });
  }

  public static get thisQuarter(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);

    const endDate = new Date();
    endDate.setDate(1);

    const beginningOfQuarter = Math.floor((startDate.getMonth() - 1) / 3) * 3;
    startDate.setMonth(beginningOfQuarter);
    endDate.setMonth(beginningOfQuarter + 3);
    endDate.setDate(0);

    return SkyDateRangeRelativeValue.parseValue({
      startDate,
      endDate
    });
  }

  public static get thisWeek(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - endDate.getDay() + 6);

    return SkyDateRangeRelativeValue.parseValue({
      startDate,
      endDate
    });
  }

  public static get thisYear(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(0);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(0);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setDate(0);

    return SkyDateRangeRelativeValue.parseValue({
      startDate,
      endDate
    });
  }

  public static get today(): SkyDateRange {
    const today = new Date();

    return SkyDateRangeRelativeValue.parseValue({
      startDate: today,
      endDate: today
    });
  }

  public static get tomorrow(): SkyDateRange {
    const today = new Date();
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    return SkyDateRangeRelativeValue.parseValue({
      startDate: today,
      endDate: tomorrow
    });
  }

  public static get yesterday(): SkyDateRange {
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    return SkyDateRangeRelativeValue.parseValue({
      startDate: yesterday,
      endDate: today
    });
  }

  public static getClosestFiscalYearRange(startDate: Date): SkyDateRange {
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

    return SkyDateRangeRelativeValue.parseValue({
      startDate,
      endDate
    });
  }

  private static parseValue(value: any): SkyDateRange {
    /* tslint:disable:no-null-keyword */
    if (value.startDate === undefined) {
      value.startDate = null;
    }

    if (value.endDate === undefined) {
      value.endDate = null;
    }
    /* tslint:enable */

    return value;
  }
}
