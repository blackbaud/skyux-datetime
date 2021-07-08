import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyDateTimeForRootCompatModule
 } from '../../shared/datetime-for-root-compat.module';

import {
  SkyDateRangePickerModule
} from '../date-range-picker.module';

import {
  DateRangePickerTestComponent
} from './date-range-picker.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDateRangePickerModule,
    SkyDateTimeForRootCompatModule
  ],
  declarations: [
    DateRangePickerTestComponent
  ],
  exports: [
    DateRangePickerTestComponent
  ]
})
export class DateRangePickerTestModule { }
