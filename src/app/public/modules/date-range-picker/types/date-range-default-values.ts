import {
  SkyDateRangeValue
} from './date-range-value';

import {
  SkyDateRangeFormat
} from './date-range-format';

import {
  SkyDateRangeFormatType
} from './date-range-format-type';

/*istanbul ignore next */
export class SkyDateRangeDefaultValues {
  public static DEFAULT_VALUES: SkyDateRangeFormat[] = [
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_specific_range',
      dateFieldResourceStringKey: 'skyux_date_range_picker_specific_range_from_field_label',
      formatType: SkyDateRangeFormatType.SpecificRange,
      getDateRangeValue: SkyDateRangeDefaultValues.SPECIFIC_RANGE
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_before',
      dateFieldResourceStringKey: 'skyux_date_range_picker_before_field_label',
      formatType: SkyDateRangeFormatType.Before,
      getDateRangeValue: SkyDateRangeDefaultValues.BEFORE
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_after',
      dateFieldResourceStringKey: 'skyux_date_range_picker_after_field_label',
      formatType: SkyDateRangeFormatType.After,
      getDateRangeValue: SkyDateRangeDefaultValues.AFTER
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_at_any_time',
      formatType: SkyDateRangeFormatType.AtAnyTime,
      getDateRangeValue: SkyDateRangeDefaultValues.AT_ANY_TIME
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_yesterday',
      formatType: SkyDateRangeFormatType.Yesterday,
      getDateRangeValue: SkyDateRangeDefaultValues.YESTERDAY
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_today',
      formatType: SkyDateRangeFormatType.Today,
      getDateRangeValue: SkyDateRangeDefaultValues.TODAY
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_tomorrow',
      formatType: SkyDateRangeFormatType.Tomorrow,
      getDateRangeValue: SkyDateRangeDefaultValues.TOMORROW
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_last_week',
      formatType: SkyDateRangeFormatType.LastWeek,
      getDateRangeValue: SkyDateRangeDefaultValues.LAST_WEEK
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_this_week',
      formatType: SkyDateRangeFormatType.ThisWeek,
      getDateRangeValue: SkyDateRangeDefaultValues.THIS_WEEK
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_next_week',
      formatType: SkyDateRangeFormatType.NextWeek,
      getDateRangeValue: SkyDateRangeDefaultValues.NEXT_WEEK
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_last_month',
      formatType: SkyDateRangeFormatType.LastMonth,
      getDateRangeValue: SkyDateRangeDefaultValues.LAST_MONTH
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_this_month',
      formatType: SkyDateRangeFormatType.ThisMonth,
      getDateRangeValue: SkyDateRangeDefaultValues.THIS_MONTH
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_next_month',
      formatType: SkyDateRangeFormatType.NextMonth,
      getDateRangeValue: SkyDateRangeDefaultValues.NEXT_MONTH
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_last_quarter',
      formatType: SkyDateRangeFormatType.LastQuarter,
      getDateRangeValue: SkyDateRangeDefaultValues.LAST_QUARTER
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_this_quarter',
      formatType: SkyDateRangeFormatType.ThisQuarter,
      getDateRangeValue: SkyDateRangeDefaultValues.THIS_QUARTER
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_next_quarter',
      formatType: SkyDateRangeFormatType.NextQuarter,
      getDateRangeValue: SkyDateRangeDefaultValues.NEXT_QUARTER
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_last_year',
      formatType: SkyDateRangeFormatType.LastYear,
      getDateRangeValue: SkyDateRangeDefaultValues.LAST_YEAR
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_this_year',
      formatType: SkyDateRangeFormatType.ThisYear,
      getDateRangeValue: SkyDateRangeDefaultValues.THIS_YEAR
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_next_year',
      formatType: SkyDateRangeFormatType.NextYear,
      getDateRangeValue: SkyDateRangeDefaultValues.NEXT_YEAR
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_last_fiscal_year',
      formatType: SkyDateRangeFormatType.LastFiscalYear,
      getDateRangeValue: SkyDateRangeDefaultValues.LAST_FISCAL_YEAR
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_this_fiscal_year',
      formatType: SkyDateRangeFormatType.ThisFiscalYear,
      getDateRangeValue: SkyDateRangeDefaultValues.THIS_FISCAL_YEAR
    },
    {
      resourceStringKey: 'skyux_date_range_picker_format_label_next_fiscal_year',
      formatType: SkyDateRangeFormatType.NextFiscalYear,
      getDateRangeValue: SkyDateRangeDefaultValues.NEXT_FISCAL_YEAR
    }
  ];

  private static BEFORE(date: Date): SkyDateRangeValue {
    return {
      endDate: date
    };
  }

  private static AFTER(date: Date): SkyDateRangeValue {
    return {
      startDate: date
    };
  }

  private static AT_ANY_TIME(): SkyDateRangeValue {
    return {};
  }

  private static SPECIFIC_RANGE(startDate: Date, endDate: Date) {
    return {
      startDate: startDate,
      endDate: endDate
    };
  }

  private static YESTERDAY(): SkyDateRangeValue {
    let temp = new Date();
    temp.setDate(temp.getDate() - 1);
    return {
      startDate: temp,
      endDate: temp
    };
  }

  private static TODAY(): SkyDateRangeValue {
    return  {
      startDate: new Date(),
      endDate: new Date()
    };
  }

  private static TOMORROW(): SkyDateRangeValue {
    let temp = new Date();
    temp.setDate(temp.getDate() + 1);
    return {
      startDate: temp,
      endDate: temp
    };
  }

  private static LAST_WEEK(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();
    start.setDate(start.getDate() - start.getDay() - 7);
    end.setDate(end.getDate() - end.getDay() - 1);

    return {
      startDate: start,
      endDate: end
    };
  }

  public static THIS_WEEK(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();
    start.setDate(start.getDate() - start.getDay());
    end.setDate(end.getDate() - end.getDay() + 6);

    return {
      startDate: start,
      endDate: end
    };
  }

  private static NEXT_WEEK(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();
    start.setDate(start.getDate() - start.getDay() + 7);
    end.setDate(end.getDate() - end.getDay() + 13);

    return {
      startDate: start,
      endDate: end
    };
  }

  private static LAST_MONTH(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();
    start.setDate(0);
    start.setDate(1);
    end.setDate(0);

    return {
      startDate: start,
      endDate: end
    };
  }

  private static THIS_MONTH(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();
    start.setDate(1);
    end.setDate(1);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);

    return {
      startDate: start,
      endDate: end
    };
  }

  private static NEXT_MONTH(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();

    start.setDate(1);
    start.setMonth(start.getMonth() + 1);

    end.setDate(1);
    end.setMonth(end.getMonth() + 2);
    end.setDate(0);

    return {
      startDate: start,
      endDate: end
    };
  }

  private static LAST_QUARTER(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();
    start.setDate(1);
    end.setDate(1);

    let beginningOfQuarter = Math.floor((start.getMonth() - 1) / 3) * 3;
    if (beginningOfQuarter === 0) {
      start.setFullYear(start.getFullYear() - 1);
      start.setMonth(9);
      end.setMonth(0);
      end.setDate(0);
    } else {
      start.setMonth(beginningOfQuarter - 3);
      end.setMonth(beginningOfQuarter);
      end.setDate(0);
    }

    return {
      startDate: start,
      endDate: end
    };
  }

  private static THIS_QUARTER(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();
    start.setDate(1);
    end.setDate(1);

    let beginningOfQuarter = Math.floor((start.getMonth() - 1) / 3) * 3;
    start.setMonth(beginningOfQuarter);
    end.setMonth(beginningOfQuarter + 3);
    end.setDate(0);

    return {
      startDate: start,
      endDate: end
    };
  }

  private static NEXT_QUARTER(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();
    start.setDate(1);
    end.setDate(1);

    let beginningOfQuarter = Math.floor((start.getMonth()) / 3) * 3;
    if (beginningOfQuarter === 9) {
      start.setMonth(0);
      start.setFullYear(start.getFullYear() + 1);
      end.setMonth(3);
      end.setFullYear(end.getFullYear() + 1);
      end.setDate(0);
    } else if (beginningOfQuarter === 6) {
      start.setMonth(9);
      end.setMonth(0);
      end.setFullYear(end.getFullYear() + 1);
      end.setDate(0);
    } else {
      start.setMonth(beginningOfQuarter + 3);
      end.setMonth(beginningOfQuarter + 4);
      end.setDate(0);
    }

    return {
      startDate: start,
      endDate: end
    };
  }

  private static LAST_YEAR(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();

    start.setDate(1);
    start.setMonth(0);
    start.setFullYear(start.getFullYear() - 1);

    end.setDate(1);
    end.setMonth(0);
    end.setDate(0);

    return {
      startDate: start,
      endDate: end
    };
  }

  private static THIS_YEAR(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();

    start.setDate(1);
    start.setMonth(0);

    end.setDate(1);
    end.setMonth(0);
    end.setFullYear(end.getFullYear() + 1);
    end.setDate(0);

    return {
      startDate: start,
      endDate: end
    };
  }

  private static NEXT_YEAR(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();

    start.setDate(1);
    start.setMonth(0);
    start.setFullYear(start.getFullYear() + 1);

    end.setDate(1);
    end.setMonth(0);
    end.setFullYear(start.getFullYear() + 2);
    end.setDate(0);

    return {
      startDate: start,
      endDate: end
    };
  }

  private static LAST_FISCAL_YEAR(): SkyDateRangeValue {
    let start = new Date();
    start.setDate(1);
    start.setFullYear(start.getFullYear() - 1);
    let end = new Date(start);

    if (start.getMonth() >= 9) {
      start.setMonth(9);
      end.setFullYear(start.getFullYear() + 1);
      end.setMonth(9);
      end.setDate(0);
    } else {
      start.setFullYear(start.getFullYear() - 1);
      start.setMonth(9);
      end.setMonth(9);
      end.setDate(0);
    }
    return {
      startDate: start,
      endDate: end
    };
  }

  private static THIS_FISCAL_YEAR(): SkyDateRangeValue {
    let start = new Date();
    let end = new Date();
    start.setDate(1);
    end.setDate(1);

    if (start.getMonth() >= 9) {
      start.setMonth(9);
      end.setFullYear(start.getFullYear() + 1);
      end.setMonth(9);
      end.setDate(0);
    } else {
      start.setFullYear(start.getFullYear() - 1);
      start.setMonth(9);
      end.setMonth(9);
      end.setDate(0);
    }
    return {
      startDate: start,
      endDate: end
    };
  }

  private static NEXT_FISCAL_YEAR(): SkyDateRangeValue {
    let start = new Date();
    start.setDate(1);
    start.setFullYear(start.getFullYear() + 1);
    let end = new Date(start);

    if (start.getMonth() >= 9) {
      start.setMonth(9);
      end.setFullYear(start.getFullYear() + 1);
      end.setMonth(9);
      end.setDate(0);
    } else {
      start.setFullYear(start.getFullYear() - 1);
      start.setMonth(9);
      end.setMonth(9);
      end.setDate(0);
    }
    return {
      startDate: start,
      endDate: end
    };
  }
}
