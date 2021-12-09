import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipeVisualComponent } from './date-pipe/date-pipe-visual.component';
import { DateRangePickerVisualComponent } from './date-range-picker/date-range-picker-visual.component';
import { DatepickerVisualComponent } from './datepicker/datepicker-visual.component';
import { FuzzyDatePipeVisualComponent } from './fuzzy-date-pipe/fuzzy-date-pipe-visual.component';
import { FuzzyDatepickerVisualComponent } from './fuzzy-datepicker/fuzzy-datepicker-visual.component';
import { TimepickerVisualComponent } from './timepicker/timepicker-visual.component';
import { DatePipeWithProviderVisualComponent } from './date-pipe/date-pipe-with-provider-visual.component';
import { VisualComponent } from './visual.component';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIdModule } from '@skyux/core';
import { RouterModule } from '@angular/router';
import {
  SkyDatepickerModule,
  SkyDatePipeModule,
  SkyDateRangePickerModule,
  SkyTimepickerModule,
} from 'projects/datetime/src/public-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyE2eThemeSelectorModule } from '@skyux/e2e-client';

@NgModule({
  declarations: [
    DatePipeVisualComponent,
    DatePipeWithProviderVisualComponent,
    DateRangePickerVisualComponent,
    DatepickerVisualComponent,
    FuzzyDatePipeVisualComponent,
    FuzzyDatepickerVisualComponent,
    TimepickerVisualComponent,
    VisualComponent,
  ],
  imports: [
    NoopAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyTimepickerModule,
    SkyDatePipeModule,
    SkyDatepickerModule,
    SkyDateRangePickerModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyTimepickerModule,
    RouterModule,
    SkyE2eThemeSelectorModule,
  ],
})
export class VisualModule {}
