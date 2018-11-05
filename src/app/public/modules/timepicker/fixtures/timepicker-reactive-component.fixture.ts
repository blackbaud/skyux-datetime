import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyTimepickerInputDirective
} from '../timepicker.directive';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SkyTimepickerTimeOutput } from '../timepicker.interface';
@Component({
  selector: 'sky-test-cmp',
  template: require('./timepicker-component.fixture.html')
})
export class TimepickerReactiveTestComponent {

  public timeFormat: string = 'hh';
  public returnFormat: string = undefined;
  public selectedTime: SkyTimepickerTimeOutput;

  @ViewChild(SkyTimepickerInputDirective)
  public timepicker: SkyTimepickerInputDirective;
  public timepickerForm: FormGroup;
  public isDisabled: boolean;
  public timeControl: FormControl;

  constructor() {
    this.timeControl = new FormControl({ value: '2:55 AM', disabled: this.isDisabled }, [Validators.required]);
    this.timepickerForm = new FormGroup({
      'time': this.timeControl
    });
  }
}
