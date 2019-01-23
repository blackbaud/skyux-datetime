import {
  SkyDateRangeValue
} from './date-range-value';

import {
  SkyDateRangeFormatType
} from './date-range-format-type';

export interface SkyDateRangeFormat {
  resourceStringKey: string;

  dateFieldResourceStringKey?: string;

  formatType: SkyDateRangeFormatType;

  getDateRangeValue(date1?: Date, date2?: Date): SkyDateRangeValue;
}
