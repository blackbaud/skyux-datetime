import {
  Component,
  Input,
  forwardRef,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl
} from '@angular/forms';

import { SkyDateRange } from './date-range';
import { SkyDateRangeService } from './date-range.service';
import { SkyDateRangeOption } from './date-range-option';
import { SkyDateRangeType } from './date-range-type';
import { SkyDateRangeOptionContext } from './date-range-option-context';
import { SkyDateRangeControl } from './date-range-control';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_DATE_RANGE_PICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyDateRangePickerComponent),
  multi: true
};

const SKY_DATE_RANGE_PICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyDateRangePickerComponent),
  multi: true
};
// tslint:enable

let uniqueId = 0;

@Component({
  selector: 'sky-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    SKY_DATE_RANGE_PICKER_VALUE_ACCESSOR,
    SKY_DATE_RANGE_PICKER_VALIDATOR,
    SkyDateRangeService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDateRangePickerComponent implements ControlValueAccessor {
  @Input()
  public label: string;

  @Input()
  public disabled = false;

  @Input()
  public dateFormat: string;

  @Input()
  public dateRangeOptions: SkyDateRangeOption[];

  public get value(): SkyDateRange {
    return this._value;
  }

  public set value(value: SkyDateRange) {
    this._value = value;
    this.onTouched();
    this.onChange(this._value);
  }

  public readonly dateRangePickerId = `sky-date-range-picker-${uniqueId++}`;

  public isInvalidRange = false;

  private _value: SkyDateRange;

  constructor(
    private dateRangeService: SkyDateRangeService
  ) {
    this.dateRangeOptions = this.dateRangeService.getDefaultDateRangeOptions();
  }

  public writeValue(value: SkyDateRange): void {
    if (value) {
      this.value = value;
    }
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  // public validate(control: AbstractControl): {[key: string]: { invalid: SkyDateRange }} {
  //   const value = control.value;

  //   if (
  //     value &&
  //     this.selectedFormat.formatType === SkyDateRangeFormatType.SpecificRange &&
  //     value.startDate && value.endDate &&
  //     value.startDate > value.endDate
  //   ) {
  //     this.isInvalidRange = true;

  //     return {
  //       'skyDateRange': {
  //         invalid: value
  //       }
  //     };
  //   }

  //   this.isInvalidRange = false;
  // }

  public validate(formControl: FormControl): any {
    console.log('validate:', formControl.value);
  }

  public registerOnChange(fn: (value: SkyDateRange) => SkyDateRange): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => SkyDateRange): void {
    this.onTouched = fn;
  }

  public onSelectionChange(event: any): void {
    console.log('Selection change:', event.target.value);
    const found = this.dateRangeOptions.find((option) => {
      return (parseInt(event.target.value, 10) === option.dateRangeType);
    });

    if (found) {
      // if (found.settings) {

      // }

      // TODO:
      // Watch start and end date controls for selection changes?

      const value = found.getValue();
      console.log('value?', value);
      this.value = value;
    }
  }

  public onStartDateChange(event: any): void {
    console.log('Start date change:', event.target.value);
  }

  public onEndDateChange(event: any): void {
    console.log('End date change:', event.target.value);
  }

  private onTouched = () => {};
  private onChange = (_: SkyDateRange) => {};
}
