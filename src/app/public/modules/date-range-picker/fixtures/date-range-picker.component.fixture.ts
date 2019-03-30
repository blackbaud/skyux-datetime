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
  SkyDateRangeCalculation
} from '../date-range-calculation';
import { SkyDateRangeCalculatorId } from '../date-range-calculator-id';
import { SkyDateRangePickerComponent } from '../date-range-picker.component';

@Component({
  selector: 'date-range-picker-test',
  templateUrl: './date-range-picker.component.fixture.html'
})
export class DateRangePickerTestComponent implements OnInit {
  @ViewChild('reactiveDateRangePicker', { read: SkyDateRangePickerComponent })
  public reactiveDateRangePicker: SkyDateRangePickerComponent;

  @ViewChild('templateDrivenDateRangePicker', { read: SkyDateRangePickerComponent })
  public templateDrivenDateRangePicker: SkyDateRangePickerComponent;

  public calculatorIds: SkyDateRangeCalculatorId[];

  public dateFormat: string;

  public disabled = false;

  public label: string;

  public reactiveForm: FormGroup;

  public templateDrivenValue: SkyDateRangeCalculation;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      reactiveDateRange: new FormControl()
    });
  }
}
