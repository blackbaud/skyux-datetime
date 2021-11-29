import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject,
  Subject
} from 'rxjs';

import {
  SkyDatepickerCustomDate
} from './datepicker-custom-date';

import {
  SkyDatepickerDate
} from './datepicker-date';

import {
  SkyCalendarDateRangeChangeEvent
} from './datepicker-date-range';

/**
 * @internal
 */
@Injectable()
export class SkyDatepickerService {

  /**
   * Fires when the range of displayed dates in the calendar change.
   */
  public calendarDateRangeChange: Subject<SkyCalendarDateRangeChangeEvent> = new Subject<SkyCalendarDateRangeChangeEvent>();

  /**
   * Returns the custom dates provided by the datepicker component.
   */
  public customDates: Subject<Array<SkyDatepickerCustomDate>> =
    new Subject<Array<SkyDatepickerCustomDate>>();

  /**
   * Specifies if the daypicker is waiting on an async process.
   */
  public isDaypickerWaiting: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Specifies if a key date popover is currently displayed.
   */
  public keyDatePopoverStream: Subject<SkyDatepickerDate> = new Subject<SkyDatepickerDate>();

}
