import {
  Injectable
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyDatepickerCustomDate
} from './datepicker-custom-date';

import {
  SkyDatepickerDate
} from './datepicker-date';

import {
  SkyDatepickerDateRange
} from './datepicker-date-range';

@Injectable()
export class SkyDatepickerService {
  // todo proper formatting on this
  public readonly customDates: Subject<Array<SkyDatepickerCustomDate>> =
    new Subject<Array<SkyDatepickerCustomDate>>();

  public dayRangeChange: Subject<SkyDatepickerDateRange> = new Subject<SkyDatepickerDateRange>();

  private _dateRows: SkyDatepickerDate[][];
  private _rangeBeginDate: Date;
  private _customDates: Array<SkyDatepickerCustomDate>;

  /**
   * Accepts the custom dates for the current date range and applies them to the date picker dates
   * @param customDates - the array of custom dates for the date range
   */
  public setCustomDates(customDates: Array<SkyDatepickerCustomDate>): void {
    this._customDates = customDates;
    this.applyCustomDates();
    this.customDates.next(customDates);
  }

  /**
   * Accepts the date rows currently displayed in the picker applies any custom dates
   * and sets the next range to be consumed if it has changed
   * @param dateRows - the array of date rows currently displayed in the picker
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
      this.dayRangeChange.next({
        startDate: this._rangeBeginDate,
        endDate: this._dateRows[lastRow][this._dateRows[lastRow].length - 1].date
      });
    }

    if (
      this._customDates &&
      this._customDates.length > 0
    ) {
      // days refreshed without a date change, re-apply any customizations
      this.applyCustomDates();
    }
  }

  /**
   * Applies custom date properties to the existing SkyDatepickerDates displayed
   */
  private applyCustomDates(): void {
    let date: SkyDatepickerDate;
    let newDate: SkyDatepickerDate;
    let dateIndex: number;

    if (
      this._customDates &&
      this._dateRows
    ) {
      this._customDates.forEach(custom => {
        dateIndex = -1;
        this._dateRows.forEach(row => {
          if (dateIndex === -1) {
            dateIndex = row.findIndex(d => {
              return d.date.getTime() === custom.date.getTime();
            });
            if (dateIndex > -1) {
              date = row[dateIndex];
              // replace the date with a new instance so that display gets updated
              newDate = {
                current: date.current,
                date: date.date,
                disabled: custom.disabled ? true : date.disabled,
                important: custom.important,
                importantText: custom.important ? custom.importantText : undefined,
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
