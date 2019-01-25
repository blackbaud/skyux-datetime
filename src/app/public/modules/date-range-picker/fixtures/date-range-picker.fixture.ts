import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDateRangeValue
} from '../types/date-range-value';

import {
  SkyDateRangePickerComponent
} from '../date-range-picker.component';

@Component({
  selector: 'sky-date-range-picker-fixture',
  templateUrl: './date-range-picker.fixture.html'
})
export class SkyDateRangePickerFixtureComponent {
  public label: string;
  public dateFormat: string;
  public disabled: boolean;

  public value: SkyDateRangeValue = {};

  @ViewChild(SkyDateRangePickerComponent)
  public dateRangePicker: SkyDateRangePickerComponent;
}
