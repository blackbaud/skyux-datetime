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
   * Returns the custom dates provided by the datepicker component.
   */
  public readonly customDates: Subject<Array<SkyDatepickerCustomDate>> =
    new Subject<Array<SkyDatepickerCustomDate>>();

  /**
   * Fires when the range of displayed dates in the calendar change.
   */
  public calendarDateRangeChange: Subject<SkyCalendarDateRangeChangeEvent> = new Subject<SkyCalendarDateRangeChangeEvent>();

  /**
   * Specifies if the daypicker is waiting on an async process.
   */
  public isDaypickerWaiting: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Specifies if a key date popover is currently displayed.
   */
  public keyDatePopoverStream: Subject<SkyDatepickerDate> = new Subject<SkyDatepickerDate>();

  /**
   * Custom dates provided by the datepicker component.
   */
  private _customDates: Array<SkyDatepickerCustomDate> = [];

  /**
   * The dates currently displayed in the calendar.
   */
  private _dateRows: SkyDatepickerDate[][] = [];

  /**
   * The first date that appears in the `_dateRows` array.
   */
  private _rangeBeginDate: Date;

  /**
   * Sets the custom dates for the current date range displayed in the calendar.
   * @param customDates - the array of custom dates for the date range
   */
  public setCustomDates(customDates: Array<SkyDatepickerCustomDate>): void {
    this._customDates = customDates || [];
    this.applyCustomDates();
    this.customDates.next(customDates);
  }

  /**
   * Sets the date rows currently displayed in the picker and applies any custom dates.
   * @param dateRows - the array of date rows currently displayed in the calendar
   */
  public setPickerDateRange(dateRows: SkyDatepickerDate[][]): void {
    this._dateRows = dateRows;
    if (
        !this._rangeBeginDate ||
        this._rangeBeginDate.getTime() !== this._dateRows[0][0].date.getTime()
    ) {
      const lastRow = this._dateRows.length - 1;
      // the date range has changed emit event
      this._rangeBeginDate = this._dateRows[0][0].date;
      this._customDates = [];
      this.customDates.next(this._customDates);
      this.calendarDateRangeChange.next({
        startDate: this._rangeBeginDate,
        endDate: this._dateRows[lastRow][this._dateRows[lastRow].length - 1].date
      });
    }

    if (this._customDates && this._customDates.length > 0) {
      // days refreshed without a date change, re-apply any customizations
      this.applyCustomDates();
    }
  }

  /**
   * Returns true if `date` is found in the `customDates` array and marked as `disabled`.
   */
  public isDateDisabled(date: Date): boolean {
    if (date) {
      const customDateMatch = this._customDates.find(d => {
        return d.date.getTime() === date.getTime();
      });
      if (customDateMatch) {
        return !!customDateMatch.disabled;
      }
    }
    return false;
  }

  /**
   * Applies custom date properties to the existing dates displayed in the calendar.
   */
  private applyCustomDates(): void {
    let date: SkyDatepickerDate;
    let newDate: SkyDatepickerDate;
    let dateIndex: number;

    /* istanbul ignore else */
    if (this._customDates && this._dateRows) {
      this._customDates.forEach(customDate => {
        dateIndex = -1;
        this._dateRows.forEach(row => {
          if (dateIndex === -1) {
            dateIndex = row.findIndex(d => {
              return d.date.getTime() === customDate.date.getTime();
            });
            if (dateIndex > -1) {
              date = row[dateIndex];
              // Replace the date with a new instance so that display gets updated.
              newDate = {
                current: date.current,
                date: date.date,
                disabled: !!customDate.disabled || !!date.disabled,
                keyDate: !!customDate.keyDate || !!date.keyDate,
                keyDateText: !!customDate.keyDate ?
                  (customDate.keyDateText || date.keyDateText) : undefined,
                label: date.label,
                secondary: date.secondary,
                selected: date.selected,
                uid: date.uid
              };
              row[dateIndex] = newDate;
            }
          }
        });
      });
    }
  }
}
