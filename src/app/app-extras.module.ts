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
  SkyTimepickerModule,
  SkyFieldMaskerModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDatePipeModule,
    SkyDatepickerModule,
    SkyFieldMaskerModule,
    SkyTimepickerModule,
    SkyDateRangePickerModule
  ]
})
export class AppExtrasModule { }
