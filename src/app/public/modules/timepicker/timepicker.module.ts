import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  SkyAffixModule,
  SkyCoreAdapterService,
  SkyOverlayModule
} from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/indicators';
import { SkyThemeModule, SkyThemeService } from '@skyux/theme';

import { SkyDateTimeResourcesModule } from '../shared/datetime-resources.module';

import { SkyTimepickerComponent } from './timepicker.component';
import { SkyTimepickerInputDirective } from './timepicker.directive';

@NgModule({
  declarations: [SkyTimepickerInputDirective, SkyTimepickerComponent],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIconModule,
    SkyDateTimeResourcesModule,
    SkyAffixModule,
    SkyOverlayModule,
    SkyThemeModule
  ],
  providers: [SkyCoreAdapterService, SkyThemeService],
  exports: [SkyTimepickerInputDirective, SkyTimepickerComponent]
})
export class SkyTimepickerModule {}
