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

import {
  GroupLogicService
} from './group-logic.service';

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
  ],
  providers: [
    GroupLogicService
  ]
})
export class SkyFieldMaskerModule { }
