import {
  NgModule
} from '@angular/core';

import {
  SkyDatepickerModule,
  SkyDateRangePickerModule,
  SkyTimepickerModule
} from './public';

@NgModule({
  imports: [
    SkyDatepickerModule,
    SkyTimepickerModule,
    SkyDateRangePickerModule
  ],
  exports: [
    SkyDatepickerModule,
    SkyTimepickerModule,
    SkyDateRangePickerModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
