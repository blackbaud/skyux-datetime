import {
  Component,
  OnInit
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'datepicker-visual',
  templateUrl: './datepicker-visual.component.html'
})
export class DatepickerVisualComponent implements OnInit {
  public disabled = false;
  public minDate: Date;
  public maxDate: Date;
  public noValidate = false;
  public reactiveForm: FormGroup;
  public selectedDate = '5/12/2017';
  public startingDay: number;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public get reactiveDate(): AbstractControl {
    return this.reactiveForm.get('selectedDate');
  }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      selectedDate: new FormControl('4/4/2017', Validators.required)
    });

    this.reactiveDate.statusChanges.subscribe((status: any) => {
      console.log('Status changed:', status);
    });

    this.reactiveDate.valueChanges.subscribe((value: any) => {
      console.log('Value changed:', value);
    });
  }

  public setMinMaxDates(): void {
    this.minDate = new Date('01/01/2018');
    this.maxDate = new Date('01/01/2020');
  }

  public setStartingDay(): void {
    this.startingDay = 1;
  }

  public toggleDisabled(): void {
    if (this.reactiveDate.disabled) {
      this.reactiveDate.enable();
    } else {
      this.reactiveDate.disable();
    }

    this.disabled = !this.disabled;
  }
}
