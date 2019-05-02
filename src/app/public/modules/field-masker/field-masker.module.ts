import {
  NgModule
} from '@angular/core';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyFieldMaskerInputDirective
} from './field-masker-input.directive';

@NgModule({
  declarations: [
    SkyFieldMaskerInputDirective
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SkyFieldMaskerInputDirective
  ]
})
export class SkyFieldMaskerModule { }
