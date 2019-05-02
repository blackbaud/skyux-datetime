import {
  NgModule
} from '@angular/core';

import {
  SkyDatePipeModule,
  SkyDatepickerModule,
  SkyDateRangePickerModule,
  SkyTimepickerModule,
  SkyFieldMaskerModule
} from './public';

@NgModule({
  exports: [
    SkyDatePipeModule,
    SkyDatepickerModule,
    SkyFieldMaskerModule,
    SkyTimepickerModule,
    SkyDateRangePickerModule
  ]
})
export class AppExtrasModule { }
