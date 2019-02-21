import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'date-range-picker-visual',
  templateUrl: './date-range-picker-visual.component.html',
  styleUrls: ['./date-range-picker-visual.component.scss']
})
export class DateRangePickerVisualComponent implements OnInit {
  public disabled = false;
  public reactiveForm: FormGroup;

  // public get reactiveRange(): AbstractControl {
  //   return this.reactiveForm.get('lastDonation');
  // }

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      // lastDonation: new FormControl({}),
      birthday: new FormControl({})
    });

    // this.reactiveForm.statusChanges.subscribe((status: any) => {
    //   console.log('Reactive date status:', status);
    // });

    // this.reactiveForm.valueChanges.subscribe((value: any) => {
    //   console.log('Reactive date value:', value);
    // });
  }

  public toggleDisabled(): void {
    this.disabled = !this.disabled;

    if (this.reactiveForm.disabled) {
      this.reactiveForm.enable();
    } else {
      this.reactiveForm.disable();
    }
  }
}
