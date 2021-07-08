import {
  NgModule
} from '@angular/core';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyPageModule
} from '@skyux/layout';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyDateTimeForRootCompatModule
} from './public/modules/shared/datetime-for-root-compat.module';

import {
  SkyDatePipeModule,
  SkyDatepickerModule,
  SkyDateRangePickerModule,
  SkyTimepickerModule
} from './public/public_api';

@NgModule({
  imports: [
    SkyDateTimeForRootCompatModule
  ],
  exports: [
    SkyAppLinkModule,
    SkyDatePipeModule,
    SkyDatepickerModule,
    SkyDateRangePickerModule,
    SkyDocsToolsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyPageModule,
    SkyTimepickerModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-datetime',
        packageName: '@skyux/datetime'
      }
    }
  ]
})
export class AppExtrasModule { }
