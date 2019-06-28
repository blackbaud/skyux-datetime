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

import {
  SkyFieldMaskerModule
} from '../field-masker.module';

import {
  DatepickerFieldMaskerNoFormatTestComponent
} from './datepicker-field-masker-noformat.component.fixture';

import {
  DatepickerFieldMaskerReactiveTestComponent
} from './datepicker-field-masker-reactive.component.fixture';

import {
  GroupLogicService
} from '../group-logic.service';

@NgModule({
  declarations: [
    DatepickerFieldMaskerNoFormatTestComponent,
    DatepickerFieldMaskerReactiveTestComponent,
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
    DatepickerFieldMaskerNoFormatTestComponent,
    DatepickerFieldMaskerReactiveTestComponent,
    DatepickerFieldMaskerTestComponent
  ],
  providers: [
    GroupLogicService
  ]
})
export class FieldMaskerTestModule { }
