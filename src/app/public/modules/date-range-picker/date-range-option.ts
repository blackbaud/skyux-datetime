import { SkyDateRangeType } from './date-range-type';
import { SkyDateRangeOptionContext } from './date-range-option-context';
import { SkyDateRange } from './date-range';

export interface SkyDateRangeOption {
  dateRangeType: SkyDateRangeType;
  caption: string;
  getValue: (context?: SkyDateRangeOptionContext) => SkyDateRange;
  showStartDateControl?: boolean;
  showEndDateControl?: boolean;
}
