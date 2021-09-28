import {
  Component,
  Input
} from '@angular/core';

import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';

import {
  SkyDatepickerDate
} from './datepicker-date';

/**
 * @internal
 */
@Component({
  selector: 'sky-daypicker-button',
  templateUrl: 'daypicker-button.component.html',
  styleUrls: ['./daypicker-button.component.scss']
})
export class SkyDayPickerButtonComponent {

  @Input()
  public date: SkyDatepickerDate;

  @Input()
  public datepicker: SkyDatepickerCalendarInnerComponent;

}
