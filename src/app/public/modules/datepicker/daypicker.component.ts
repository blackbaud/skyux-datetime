import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';

import {
  SkyDatepickerCalendarInnerComponent
} from './datepicker-calendar-inner.component';

import {
  SkyDatepickerDate
} from './datepicker-date';

/**
 * @internal
 */
@Component({
  selector: 'sky-daypicker',
  templateUrl: 'daypicker.component.html',
  styleUrls: ['./daypicker.component.scss']
})
export class SkyDayPickerComponent implements OnInit {

  @Output()
  public dayRangeChange: EventEmitter<Array<SkyDatepickerDate>> = new                EventEmitter<Array<SkyDatepickerDate>>(undefined);

  public labels: any[] = [];
  public title: string;
  public rows: Array<Array<SkyDatepickerDate>> = [];
  public weekNumbers: number[] = [];
  public datepicker: SkyDatepickerCalendarInnerComponent;
  public CURRENT_THEME_TEMPLATE: any;

  private daysInMonth: Array<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  public constructor(datepicker: SkyDatepickerCalendarInnerComponent) {
    this.datepicker = datepicker;
  }

  public ngOnInit(): void {

    this.datepicker.stepDay = {months: 1};

    this.datepicker.setRefreshViewHandler(() => {
      this.refreshDayView();
    }, 'day');

    this.datepicker.setCompareHandler(this.compareDays, 'day');

    this.datepicker.setKeydownHandler((key: string, event: KeyboardEvent) => {
      this.keydownDays(key, event);
    }, 'day');

    this.datepicker.refreshView();
  }

  public onDayCellClick(event: Event, date: SkyDatepickerDate) {
    if (date.disabled && !date.importantText) {
      // I was unable to find a way to make the popover directive conditional short of duplicating
      // the date cell and using ngIf to have versions with and without the popover. Conditionally
      // setting the trigger works, but on click of a disabled cell it will show an empty
      // popover which I am preventing here
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
  protected getDates(startDate: Date, n: number): Date[] {
    let dates: Date[] = new Array(n);
    let current = new Date(startDate.getTime());
    let i = 0;
    let date: Date;
    while (i < n) {
      date = new Date(current.getTime());
      date = this.datepicker.fixTimeZone(date);
      dates[i++] = date;
      current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
    }
    return dates;
  }

  private compareDays(date1: Date, date2: Date): number {
    let d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    let d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return d1.getTime() - d2.getTime();
  }

  private refreshDayView() {
    let year = this.datepicker.activeDate.getFullYear();
    let month = this.datepicker.activeDate.getMonth();
    let firstDayOfMonth = new Date(year, month, 1);
    let difference = this.datepicker.startingDay - firstDayOfMonth.getDay();
    let numDisplayedFromPreviousMonth = (difference > 0)
      ? 7 - difference
      : -difference;
    let firstDate = new Date(firstDayOfMonth.getTime());

    /* istanbul ignore else */
    /* sanity check */
    if (numDisplayedFromPreviousMonth > 0) {
      firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
    }

    // 42 is the number of days on a six-week calendar
    let days: Date[] = this.getDates(firstDate, 42);
    let pickerDates: Array<SkyDatepickerDate> = [];
    for (let i = 0; i < 42; i++) {
      let _dateObject = this.datepicker.createDateObject(
        days[i],
        this.datepicker.formatDay,
        days[i].getMonth() !== month,
        this.datepicker.datepickerId + '-' + i
      );
      pickerDates[i] = _dateObject;
    }

    this.dayRangeChange.emit(pickerDates);

    this.labels = [];
    for (let j = 0; j < 7; j++) {
      this.labels[j] = {};
      this.labels[j].abbr =
        this.datepicker.dateFilter(pickerDates[j].date, this.datepicker.formatDayHeader);
      this.labels[j].full = this.datepicker.dateFilter(pickerDates[j].date, 'EEEE');
    }

    this.title =
      this.datepicker.dateFilter(this.datepicker.activeDate, this.datepicker.formatDayTitle);
    this.rows = this.datepicker.createCalendarRows(pickerDates, 7);
  }

  private keydownDays(key: string, event: KeyboardEvent) {
    let date = this.datepicker.activeDate.getDate();
    /* istanbul ignore else */
    /* sanity check */
    if (key === 'left') {
      date = date - 1;
    } else if (key === 'up') {
      date = date - 7;
    } else if (key === 'right') {
      date = date + 1;
    } else if (key === 'down') {
      date = date + 7;
    } else if (key === 'pageup' || key === 'pagedown') {
      let month = this.datepicker.activeDate.getMonth() + (key === 'pageup' ? - 1 : 1);
      this.datepicker.activeDate.setMonth(month, 1);
      date =
      Math.min(
        this.getDaysInMonth(
          this.datepicker.activeDate.getFullYear(),
          this.datepicker.activeDate.getMonth()
        ),
        date);
    } else if (key === 'home') {
      date = 1;
    } else if (key === 'end') {
      date = this.getDaysInMonth(
        this.datepicker.activeDate.getFullYear(),
        this.datepicker.activeDate.getMonth()
      );
    }
    this.datepicker.activeDate.setDate(date);
  }

  private getDaysInMonth(year: number, month: number) {
    return month === 1 && year % 4 === 0 &&
      (year % 400 === 0 || year % 100 !== 0) ? 29 : this.daysInMonth[month];
  }

}
