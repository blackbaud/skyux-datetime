import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyDatePipeModule,
  SkyDatepickerModule,
  SkyDateRangePickerModule,
  SkyTimepickerModule
} from './public';

import {
  SkyFuzzyDateFactory
} from './public/modules/datepicker/fuzzy-date-factory';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDatePipeModule,
    SkyDatepickerModule,
    SkyTimepickerModule,
    SkyDateRangePickerModule
  ],
  providers: [
    SkyFuzzyDateFactory
  ]
})
export class AppExtrasModule { }
