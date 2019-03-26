import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDateRangePickerModule
} from '../date-range-picker.module';

import {
  DateRangePickerTestComponent
} from './date-range-picker.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    SkyDateRangePickerModule
  ],
  declarations: [
    DateRangePickerTestComponent
  ],
  exports: [
    DateRangePickerTestComponent
  ]
})
export class DateRangePickerTestModule { }
