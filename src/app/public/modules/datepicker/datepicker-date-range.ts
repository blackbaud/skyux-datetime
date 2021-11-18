import {
  Observable
} from 'rxjs';

import {
  SkyDatepickerCustomDate
} from '../../public_api';

/**
 * Specifies a range of dates displayed in the calendar.
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

  /**
   * Provides an observable that allows the consumer to push custom dates back to the calendar
   * when the `SkyCalendarDateRangeChangeEvent` event fires. This is useful
   * for displaying key dates or disabled dates each time the calendar changes.
   */
  customDates?: Observable<SkyDatepickerCustomDate[]>;

}
