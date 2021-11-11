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
  Observable,
  Subject
}from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyDateFormatter
} from './date-formatter';

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
  SkyDatepickerCustomDate
} from './datepicker-custom-date';

import {
  SkyDatepickerDateRange
} from './datepicker-date-range';

import {
  SkyDatepickerService
} from './datepicker.service';

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

  /**
   * A stream of customized dates.
   */
  @Input()
  public customDateStream: Observable<Array<SkyDatepickerCustomDate>>;

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

  public get startingDay() {
    return this._startingDay || 0;
  }

  @Output()
  public calendarModeChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  public dateRangeChange: EventEmitter<SkyDatepickerDateRange> = new EventEmitter<SkyDatepickerDateRange>(undefined);

  @Output()
  public selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>(undefined);

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

  private ngUnsubscribe = new Subject();

  private _startingDay: number;

  public constructor(
    private adapter: SkyDatepickerAdapterService,
    private config: SkyDatepickerConfigService,
    private elementRef: ElementRef,
    private datePickerService: SkyDatepickerService
  ) {
    this.configureOptions();
  }

  public ngOnInit(): void {
    if (this.customDateStream) {
      this.customDateStream
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(dates => {
          this.datePickerService.setCustomDates(dates);
      });
    }

    this.datePickerService.dayRangeChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(range => {
        this.dateRangeChange.emit(range);
    });
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

}
