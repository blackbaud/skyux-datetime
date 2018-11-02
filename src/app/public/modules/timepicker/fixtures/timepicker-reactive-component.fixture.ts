import {
  Component,
  ViewChild,
  OnInit
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
export class TimepickerReactiveTestComponent implements OnInit {

  public timeFormat: string = 'hh';
  public returnFormat: string = undefined;
  public selectedTime: SkyTimepickerTimeOutput;

  @ViewChild(SkyTimepickerInputDirective)
  public timepicker: SkyTimepickerInputDirective;
  public timepickerForm: FormGroup;
  public isDisabled: boolean;
  public intialValue: string;

  public timeControl: FormControl;

  public ngOnInit() {
    this.timeControl = new FormControl({ value: this.intialValue, disabled: this.isDisabled }, [Validators.required]);
    this.timepickerForm = new FormGroup({
      'time': this.timeControl
    });
  }
}
