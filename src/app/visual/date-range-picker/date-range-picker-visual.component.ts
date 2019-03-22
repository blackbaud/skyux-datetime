import {
  Component,
  OnInit
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';
import { SkyDateRangeCalculatorName } from '../../public/modules/date-range-picker/date-range-calculator-name';
import { SkyDateRange } from '../../public/modules/date-range-picker/date-range';

@Component({
  selector: 'date-range-picker-visual',
  templateUrl: './date-range-picker-visual.component.html',
  styleUrls: ['./date-range-picker-visual.component.scss']
})
export class DateRangePickerVisualComponent implements OnInit {
  public disabled = false;
  public reactiveForm: FormGroup;

  public get reactiveRange(): AbstractControl {
    return this.reactiveForm.get('lastDonation');
  }

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      lastDonation: new FormControl()
    });

    // this.reactiveForm.statusChanges.subscribe((status) => {
    //   console.log('Date range status change:', status);
    // });

    this.reactiveRange.valueChanges
      .distinctUntilChanged()
      .subscribe((value) => {
        console.log('[CONSUMER] Date range value change:', value);
      });
  }

  public toggleDisabled(): void {
    this.disabled = !this.disabled;

    if (this.reactiveForm.disabled) {
      this.reactiveForm.enable();
    } else {
      this.reactiveForm.disable();
    }
  }

  public resetForm(): void {
    this.reactiveForm.reset();
    this.reactiveForm.markAsPristine();
    this.reactiveForm.markAsUntouched();
  }

  public setRange(): void {
    const range: SkyDateRange = {
      name: SkyDateRangeCalculatorName.SpecificRange,
      startDate: new Date('1/1/2012'),
      endDate: new Date('1/1/2013')
    };

    this.reactiveRange.setValue(range);
  }
}
