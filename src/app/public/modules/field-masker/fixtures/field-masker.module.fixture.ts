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
  DatepickerFieldMaskerTestComponent
} from './datepicker-field-masker.component.fixture';

import {
  SkyDatepickerModule
} from '../../datepicker';
import { SkyFieldMaskerModule } from '../field-masker.module';

@NgModule({
  declarations: [
    DatepickerFieldMaskerTestComponent
  ],
  imports: [
    SkyDatepickerModule,
    SkyFieldMaskerModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    DatepickerFieldMaskerTestComponent
  ]
})
export class FieldMaskerTestModule { }
