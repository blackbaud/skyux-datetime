import {
  SkyDateRangeControl
} from './date-range-control';

export class SkyDateRangeOptionContext {
  constructor(
    public startDateControl: SkyDateRangeControl,
    public endDateControl: SkyDateRangeControl
  ) { }
}
