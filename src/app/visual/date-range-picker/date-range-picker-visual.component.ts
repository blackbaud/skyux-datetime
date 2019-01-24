import {
  Component,
  OnInit
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl
} from '@angular/forms';

import {
  SkyDateRangeValue
} from '../../public/modules/date-range-picker/types/date-range-value';

@Component({
  selector: 'date-range-picker-visual',
  templateUrl: './date-range-picker-visual.component.html',
  styleUrls: ['./date-range-picker-visual.component.scss']
})
export class DateRangePickerVisualComponent implements OnInit {
  public value: SkyDateRangeValue = {};
  public disabled = false;
  public reactiveForm: FormGroup;

  public get reactiveRange(): AbstractControl {
    return this.reactiveForm.get('selectedRange');
  }

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      selectedRange: new FormControl({})
    });

    this.reactiveForm.statusChanges.subscribe((status: any) => {
      console.log('Reactive date status:', status);
    });

    this.reactiveForm.valueChanges.subscribe((value: any) => {
      console.log('Reactive date value:', value);
    });
  }
}
