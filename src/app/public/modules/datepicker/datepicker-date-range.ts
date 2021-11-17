import {
  Observable
} from 'rxjs';

import {
  SkyDatepickerCustomDate
} from '../../public_api';

/**
 * Specifies a range of dates.
 */
export interface SkyCalendarDateRangeChangeEvent {

  /**
   * The end date.
   */
  endDate: Date;

  /**
   * The start date.
   */
  startDate: Date;

  customDates?: Observable<SkyDatepickerCustomDate[]>;

}
