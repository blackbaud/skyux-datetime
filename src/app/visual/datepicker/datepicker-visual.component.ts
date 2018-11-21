import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'datepicker-visual',
  templateUrl: './datepicker-visual.component.html'
})
export class DatepickerVisualComponent implements OnInit {
  public selectedDate: Date = new Date('4/4/2017');
  public timepickerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit() {
    this.timepickerForm = this.formBuilder.group({
      time: '4/4/2017'
    });
  }
}
