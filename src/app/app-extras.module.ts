import {
  NgModule
} from '@angular/core';

import {
  SkyDatepickerModule,
  SkyDateRangePickerModule,
  SkyTimepickerModule
} from './public';

@NgModule({
  exports: [
    SkyDatepickerModule,
    SkyTimepickerModule,
    SkyDateRangePickerModule
  ]
})
export class AppExtrasModule { }
