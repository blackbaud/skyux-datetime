import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import {
  SkyDatepickerAdapterService
} from './datepicker-adapter.service';

import {
  SkyDatepickerCalendarInnerComponent
} from './datepicker-calendar-inner.component';

import {
  SkyDatepickerConfigService
} from './datepicker-config.service';

import {
  SkyDateFormatter
} from './date-formatter';
import { SkyDatepickerDate } from './datepicker-date';
import { Observable, Subject } from 'rxjs';
import { SkyDatepickerCustomDate } from './datepicker-custom-date';
import { SkyDatepickerDateRange } from './datepicker-date-range';
import { takeUntil } from 'rxjs/operators';

/**
 * @internal
 */
@Component({
  selector: 'sky-datepicker-calendar',
  templateUrl: './datepicker-calendar.component.html',
  styleUrls: ['./datepicker-calendar.component.scss'],
  providers: [SkyDatepickerAdapterService]
})
export class SkyDatepickerCalendarComponent implements AfterViewInit, OnInit, OnDestroy {

  @Input()
  public minDate: Date;

  @Input()
  public maxDate: Date;

  /** currently selected date */
  @Input()
  public selectedDate: Date;

  /** starting day of the week from 0-6 (0=Sunday, ..., 6=Saturday) */
  @Input()
  public set startingDay(start: number) {
    this._startingDay = start;
  }

  /** dates with customized information/display */
  @Input()
   public customDateStream: Observable<Array<SkyDatepickerCustomDate>>;

  public get startingDay() {
    return this._startingDay || 0;
  }

  @Output()
  public selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>(undefined);

  @Output()
  public calendarModeChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  public dateRangeChange: EventEmitter<SkyDatepickerDateRange> = new EventEmitter<SkyDatepickerDateRange>(undefined);

  /**
   * @internal
   * Indicates if the calendar element's visiblity property is 'visible'.
   */
  public get isVisible(): boolean {
    return this.adapter.elementIsVisible();
  }

  @ViewChild(SkyDatepickerCalendarInnerComponent, {
    read: SkyDatepickerCalendarInnerComponent,
    static: true
  })
  public _datepicker: SkyDatepickerCalendarInnerComponent;

  protected _now: Date = new Date();

  private formatter = new SkyDateFormatter();

  private _startingDay: number;

  private _pickerDates: Array<SkyDatepickerDate> = [];

  private _rangeBeginDate: Date;

  private _customDates: Array<SkyDatepickerCustomDate> = [];

  private ngUnsubscribe = new Subject();

  public constructor(
    private adapter: SkyDatepickerAdapterService,
    private config: SkyDatepickerConfigService,
    private elementRef: ElementRef) {
    this.configureOptions();
  }

  public ngOnInit(): void {
    if (this.customDateStream) {
      this.customDateStream
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(dates => {
          this._customDates = dates;
          this.applyCustomDates();
      });
    }
  }

  public ngAfterViewInit(): void {
    this.adapter.init(this.elementRef);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public configureOptions(): void {
    Object.assign(this, this.config);
  }

  public onCalendarModeChange(event: string): void {
    this.calendarModeChange.emit(event);
  }

  public onSelectedDateChange(event: Date): void {
    this.selectedDateChange.emit(event);
  }

  public onDayRangeChange(event: Array<SkyDatepickerDate>): void {
    this._pickerDates = event;
    if (
        !this._rangeBeginDate ||
        this._rangeBeginDate.getTime() !== this._pickerDates[0].date.getTime()
    ) {
      // the date range has changed emit event
      this._rangeBeginDate = this._pickerDates[0].date;
      this._customDates = [];
      this.dateRangeChange.emit({ startDate: this._rangeBeginDate, endDate: this._pickerDates[event.length - 1].date });
    }

    if (
      this._customDates &&
      this._customDates.length > 0
    ) {
      // days refreshed without a date change, re-apply any customizations
      this.applyCustomDates();
    }
  }

  public writeValue(value: Date): void {
    if (value !== undefined
      && this.formatter.dateIsValid(value)
      && this.selectedDate !== undefined
      && this._datepicker.compareHandlerDay(value, this.selectedDate) === 0) {
      return;
    }

    if (this.formatter.dateIsValid(value)) {
      this.selectedDate = value;
      this._datepicker.select(value, false);
    } else {
      this.selectedDate = new Date();
      this._datepicker.select(new Date(), false);
    }

  }

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
