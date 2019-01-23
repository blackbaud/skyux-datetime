import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyDateTimeResourcesModule
} from '../shared/datetime-resources.module';

import {
  SkyDatepickerModule
} from '../datepicker/datepicker.module';

import {
  SkyDateRangePickerComponent
} from './date-range-picker.component';

@NgModule({
  declarations: [
    SkyDateRangePickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyI18nModule,
    SkyDateTimeResourcesModule,
    SkyDatepickerModule
  ],
  exports: [
    SkyDateRangePickerComponent
  ]
})
export class SkyDateRangePickerModule { }
