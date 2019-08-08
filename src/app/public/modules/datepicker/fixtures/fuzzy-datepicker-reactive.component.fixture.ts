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

import { SkyFuzzyDatepickerInputDirective } from '../datepicker-input-fuzzy.directive';

@Component({
  selector: 'fuzzy-datepicker-reactive-test',
  templateUrl: './fuzzy-datepicker-reactive.component.fixture.html'
})
export class FuzzyDatepickerReactiveTestComponent implements OnInit {

  @ViewChild(SkyFuzzyDatepickerInputDirective)
  public inputDirective: SkyFuzzyDatepickerInputDirective;

  public maxFuzzyDate: any;
  public minFuzzyDate: any;

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
