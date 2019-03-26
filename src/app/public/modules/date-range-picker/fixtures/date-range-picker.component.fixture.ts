import {
  Component, ViewChild, OnInit
} from '@angular/core';
import { SkyDateRangePickerComponent } from '../date-range-picker.component';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SkyDateRangeCalculator } from '../date-range-calculator';

@Component({
  selector: 'date-range-picker-test',
  templateUrl: './date-range-picker.component.fixture.html'
})
export class DateRangePickerTestComponent implements OnInit {
  @ViewChild(SkyDateRangePickerComponent)
  public dateRangePicker: SkyDateRangePickerComponent;

  public calculators: SkyDateRangeCalculator[];

  public dateFormat: string;

  public defaultCalculator: SkyDateRangeCalculator;

  public label: string;

  public reactiveForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      lastDonation: new FormControl()
    });
  }
}
