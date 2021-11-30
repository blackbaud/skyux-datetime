import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDatepickerCalendarComponent
} from '../datepicker-calendar.component';

import {
  SkyDatepickerCustomDate
} from '../datepicker-custom-date';

@Component({
  selector: 'datepicker-calendar-test',
  template: require('./datepicker-calendar.component.fixture.html')
})
export class DatepickerCalendarTestComponent {

  public customDates: SkyDatepickerCustomDate[];

  public minDate: Date;

  public maxDate: Date;

  public selectedDate: any;

  public startingDay: number;

   @ViewChild(SkyDatepickerCalendarComponent)
   public datepicker: SkyDatepickerCalendarComponent;
}
