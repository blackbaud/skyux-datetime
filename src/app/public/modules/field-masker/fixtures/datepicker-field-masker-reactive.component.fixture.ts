import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyFieldMaskerInputDirective
} from '../field-masker-input.directive';

import {
  SkyDatepickerInputDirective
} from '../../datepicker';

@Component({
  selector: 'datepicker-reactive-test',
  templateUrl: './datepicker-field-masker-reactive.component.fixture.html'
})
export class DatepickerFieldMaskerReactiveTestComponent implements OnInit {

  @ViewChild(SkyFieldMaskerInputDirective)
  public fieldMaskerInputDirective: SkyFieldMaskerInputDirective;

  @ViewChild(SkyDatepickerInputDirective)
  public datepickerInputDirective: SkyDatepickerInputDirective;

  public minDate: Date;
  public maxDate: Date;
  public datepickerForm: FormGroup;
  public isDisabled: boolean;
  public dateControl: FormControl;
  public initialValue: Date | string;
  public noValidate: boolean = false;
  public startingDay = 0;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit() {
    this.dateControl = new FormControl(this.initialValue);

    this.datepickerForm = this.formBuilder.group({
      date: this.dateControl
    });
  }
}
