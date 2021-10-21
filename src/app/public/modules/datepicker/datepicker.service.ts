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

  private _pickerDates: Array<SkyDatepickerDate> = [];
  private _rangeBeginDate: Date;
  private _customDates: Array<SkyDatepickerCustomDate>;

  /**
   * Accepts the custom dates for the current date range and applies them to the date picker dates
   * @param customDates - the array of custom dates for the date range
   */
  public setCustomDates(customDates: Array<SkyDatepickerCustomDate>) {
    this.customDates.next(customDates);
    this._customDates = customDates;
    this.applyCustomDates();
  }

  /**
   * Accepts the range of dates currently displayed in the picker applies any custom dates
   * and sets the next range to be consumed if it has changed
   * @param pickerDates - the array of dates currently displayed in the picker
   */
  public setPickerDateRange(pickerDates: Array<SkyDatepickerDate>) {
    this._pickerDates = pickerDates;
    if (
        !this._rangeBeginDate ||
        this._rangeBeginDate.getTime() !== this._pickerDates[0].date.getTime()
    ) {
      // the date range has changed emit event
      this._rangeBeginDate = pickerDates[0].date;
      this._customDates = [];
      this.customDates.next(this._customDates);
      this.dayRangeChange.next({
        startDate: this._rangeBeginDate,
        endDate: pickerDates[pickerDates.length - 1].date
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
    if (
      this._customDates &&
      this._pickerDates
    ) {
      this._customDates.forEach(custom => {
        date = this._pickerDates.find(d => {
          return d.date.getTime() === custom.date.getTime();
        });
        if (date) {
          date.important = custom.important;
          if (custom.disabled) {
            date.disabled = true;
          }
          if (date.important) {
            // important text to be displayed only when the date is flagged as important
            date.importantText = custom.importantText;
          }
        }
      });
    }
  }
}
