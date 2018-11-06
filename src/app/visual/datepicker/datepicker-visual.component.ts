import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'datepicker-visual',
  templateUrl: './datepicker-visual.component.html'
})
export class DatepickerVisualComponent implements OnInit {

  public dateTimeForm: FormGroup;

  public disable: boolean;

  private dateControl: FormControl;
  private timeControl: FormControl;

  public ngOnInit() {
    this.dateControl = new FormControl({ value: '', disabled: this.disable }, [Validators.required]);
    this.timeControl = new FormControl({ value: '2:55 AM', disabled: this.disable }, [Validators.required]);
    this.dateTimeForm = new FormGroup({
      'date': this.dateControl,
      'time': this.timeControl
    });
  }

  public toggleDisable() {
    this.disable = !this.disable;
    if (this.disable) {
      this.dateControl.disable();
      this.timeControl.disable();
    } else {
      this.dateControl.enable();
      this.timeControl.enable();
    }
  }

  public printInfo() {
    console.log(this.dateTimeForm.get('time').value);
  }
}
