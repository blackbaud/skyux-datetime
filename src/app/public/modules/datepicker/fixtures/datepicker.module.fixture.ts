import {
  NgModule
} from '@angular/core';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyDatepickerModule
} from '../datepicker.module';

import {
  DatepickerCalendarTestComponent
} from './datepicker-calendar.component.fixture';

import {
  DatepickerNoFormatTestComponent
} from './datepicker-noformat.component.fixture';

import {
  DatepickerReactiveTestComponent
} from './datepicker-reactive.component.fixture';

import {
  DatepickerTestComponent
} from './datepicker.component.fixture';

// import {
//   SkyWindowRefService
// } from '@skyux/core';

// export class MockWindowService {
//   public getWindow() {
//     return {
//       navigator: {
//         languages: ['es']
//       },
//       setTimeout(cb: any) {
//         cb();
//       }
//     };
//   }
// }

@NgModule({
  declarations: [
    DatepickerCalendarTestComponent,
    DatepickerNoFormatTestComponent,
    DatepickerReactiveTestComponent,
    DatepickerTestComponent
  ],
  imports: [
    SkyDatepickerModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    DatepickerCalendarTestComponent,
    DatepickerNoFormatTestComponent,
    DatepickerReactiveTestComponent,
    DatepickerTestComponent
  ]
  // providers: [
  //   {
  //     provide: SkyWindowRefService,
  //     useClass: MockWindowService
  //   }
  // ]
})
export class DatepickerTestModule {}
