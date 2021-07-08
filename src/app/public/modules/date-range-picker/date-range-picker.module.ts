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
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyDatepickerModule
} from '../datepicker/datepicker.module';

import {
  SkyDateTimeResourcesModule
} from '../shared/datetime-resources.module';

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
    ReactiveFormsModule,
    SkyI18nModule,
    SkyDatepickerModule,
    SkyDateTimeResourcesModule,
    SkyInputBoxModule
  ],
  exports: [
    SkyDateRangePickerComponent
  ]
})
export class SkyDateRangePickerModule { }
