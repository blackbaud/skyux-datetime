import {
  SkyDateRangeType
} from './date-range-type';

export interface SkyDateRange {
  dateRangeType: SkyDateRangeType;
  startDate: Date;
  endDate: Date;
}
