import {
  Component,
  ViewChild
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyDatepickerCustomDate
} from '../datepicker-custom-date';

import {
  SkyCalendarDateRangeChangeEvent
} from '../datepicker-date-range';

import {
  SkyDatepickerInputDirective
} from '../datepicker-input.directive';

import {
  SkyDatepickerComponent
} from '../datepicker.component';

@Component({
  selector: 'datepicker-test',
  templateUrl: './datepicker.component.fixture.html'
})
export class DatepickerTestComponent {

  public customDateStream: Subject<Array<SkyDatepickerCustomDate>> =
    new Subject<Array<SkyDatepickerCustomDate>>();

  public dateFormat: string;

  public isDisabled: boolean;

  public maxDate: Date;

  public minDate: Date;

  public noValidate: boolean = false;

  public showCustomDates: boolean = false;

  public showInvalidDirective = false;

  public selectedDate: any;

  public startingDay = 0;

  public strict: boolean;

  @ViewChild(SkyDatepickerInputDirective)
  public inputDirective: SkyDatepickerInputDirective;

  @ViewChild(SkyDatepickerComponent)
  public datepicker: SkyDatepickerComponent;

  public onCalendarDateRangeChange(range: SkyCalendarDateRangeChangeEvent): void {
    // Simulate async call to fetch data and push custom dates back to the component.
    if (this.showCustomDates) {
      range.customDates = this.customDateStream;
      const customDates = [
        {
          date: new Date(1955, 10, 1),
          disabled: true

        },
        {
          date: new Date(1955, 10, 15),
          disabled: false
        },
        {
          date: new Date(1955, 10, 30),
          disabled: true
        }
      ];

      setTimeout(() => {
        this.customDateStream.next(customDates);
      });
    }
  }
}
