import {
  Component,
  Input,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  FormBuilder,
  FormGroup,
  Validator
} from '@angular/forms';
import { SkyDateRangeService } from './date-range.service';
import { SkyDateRange } from './types/date-range';
import { SkyDateRangeCalculatorConfig } from './types/date-range-calculator-config';
import { SkyDateRangeCalculatorType } from './types/date-range-calculator-type';

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
export class SkyDateRangePickerComponent implements ControlValueAccessor, Validator {
  @Input()
  public label: string;

  @Input()
  public disabled = false;

  @Input()
  public dateFormat: string;

  @Input()
  public calculators: SkyDateRangeCalculatorConfig[];

  public get value(): SkyDateRange {
    return this.formGroup.value as SkyDateRange;
  }

  public set value(value: SkyDateRange) {
    this._value = value;
    this.onTouched();
    this.onChange(this._value);
  }

  public set selectedCalculator(value: SkyDateRangeCalculatorConfig) {
    if (value !== this._selectedCalculator) {
      this._selectedCalculator = value;
    }
  }

  public get selectedCalculator(): SkyDateRangeCalculatorConfig {
    return this._selectedCalculator || this.calculators[0];
  }

  // public set selectedStartDate(value: Date) {
  //   if (value !== this._selectedStartDate) {
  //     this._selectedStartDate = value;
  //     console.log('Start date:', value);
  //     if (this.selectedCalculator.validate) {
  //       const result = this.selectedCalculator.validate(value, this.selectedEndDate);
  //       console.log('Start date validation result:', result);
  //     }
  //   }
  // }

  // public get selectedStartDate(): Date {
  //   return this._selectedStartDate;
  // }

  // public set selectedEndDate(value: Date) {
  //   if (value !== this._selectedEndDate) {
  //     this._selectedEndDate = value;
  //     console.log('End date:', value);
  //     if (this.selectedCalculator.validate) {
  //       this.selectedCalculator.validate(this.selectedStartDate, value)
  //         .take(1)
  //         .subscribe((result) => {
  //           if (result.errors && result.errors.length) {
  //             console.log('ERROR!', result);
  //           }
  //         });
  //     }
  //   }
  // }

  // public get selectedEndDate(): Date {
  //   return this._selectedEndDate;
  // }

  public readonly dateRangePickerId = `sky-date-range-picker-${uniqueId++}`;

  public formGroup: FormGroup;
  public showEndDatePicker = false;
  public showStartDatePicker = false;

  private _selectedCalculator: SkyDateRangeCalculatorConfig;
  // private _selectedEndDate: Date;
  // private _selectedStartDate: Date;
  private _value: SkyDateRange;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private dateRangeService: SkyDateRangeService
  ) {
    this.calculators = this.dateRangeService.getDefaultDateRangeCalculators();

    this.formGroup = this.formBuilder.group({
      handle: new FormControl(this.selectedCalculator.handle),
      startDate: new FormControl(),
      endDate: new FormControl()
    });

    this.formGroup.get('handle').valueChanges.subscribe((value) => {
      console.log('Handle changes:', value);
      // The template parses the handle value as a string, but it needs to be a number.
      const handle = parseInt(value, 10);

      this._value = undefined;

      this.updateForm({
        handle,
        startDate: undefined,
        endDate: undefined
      });
    });

    this.formGroup.get('startDate').valueChanges.subscribe((value) => {
      console.log('Start date changes:', value);
    });

    this.formGroup.get('endDate').valueChanges.subscribe((value) => {
      console.log('End date changes:', value);
    });
  }

  public writeValue(value: SkyDateRange): void {
    this.updateForm(value);
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
    console.log('ngValidate()', formControl.value);
  }

  public registerOnChange(fn: (value: SkyDateRange) => SkyDateRange): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => SkyDateRange): void {
    this.onTouched = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  // public onSelectionChange(event: any): void {
  //   const found = this.calculators.find((calculator) => {
  //     return (parseInt(event.target.value, 10) === calculator.handle);
  //   });

  //   if (found) {
  //     this.updateForm(found);
  //   }
  // }

  private updateForm(value: SkyDateRange): void {
    this.showEndDatePicker = false;
    this.showStartDatePicker = false;

    if (value) {
      this.selectedCalculator = this.getCalculatorByHandle(value.handle);

      switch (this.selectedCalculator.type) {
        case SkyDateRangeCalculatorType.Before:
          this.showEndDatePicker = true;
          break;
        case SkyDateRangeCalculatorType.After:
          this.showStartDatePicker = true;
          break;
        case SkyDateRangeCalculatorType.BeforeAndAfter:
          this.showEndDatePicker = true;
          this.showStartDatePicker = true;
          break;
        default:
          break;
      }

      if (!this._value) {
        value = this.selectedCalculator.getValue();
      }
    }

    this.value = value;
    this.changeDetector.markForCheck();
  }

  private getCalculatorByHandle(handle: number): SkyDateRangeCalculatorConfig {
    return this.calculators.find((calculator) => {
      return (handle === calculator.handle);
    });
  }

  private onChange = (_: SkyDateRange) => {};
  private onTouched = () => {};
  private onValidatorChange = () => {};
}
