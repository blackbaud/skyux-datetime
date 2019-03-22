import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  forwardRef
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator
} from '@angular/forms';

import { SkyDateRangeCalculator } from './date-range-calculator';
import { SkyDateRangeCalculatorType } from './date-range-calculator-type';
import { SkyDateRangeService } from './date-range.service';
import { SkyDateRange } from './date-range';

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
  public dateFormat: string;

  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
    this.changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  public calculators: SkyDateRangeCalculator[];

  @Input()
  public label: string;

  public get value(): SkyDateRange {
    return this.formGroup.value as SkyDateRange;
  }

  public set value(value: SkyDateRange) {
    this._value = value;
    this.onTouched();
    this.onChange(this._value);
  }

  public set selectedCalculator(value: SkyDateRangeCalculator) {
    if (value !== this._selectedCalculator) {
      this._selectedCalculator = value;
    }
  }

  public get selectedCalculator(): SkyDateRangeCalculator {
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

  private get endDate(): AbstractControl {
    return this.formGroup.get('endDate');
  }

  private get startDate(): AbstractControl {
    return this.formGroup.get('startDate');
  }

  private _disabled = false;
  private _selectedCalculator: SkyDateRangeCalculator;
  // private _selectedEndDate: Date;
  // private _selectedStartDate: Date;
  private _value: SkyDateRange;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dateRangeService: SkyDateRangeService,
    private formBuilder: FormBuilder
  ) {
    this.calculators = this.dateRangeService.getDefaultDateRangeCalculators();

    this.formGroup = this.formBuilder.group({
      name: new FormControl(this.selectedCalculator.name),
      startDate: new FormControl(),
      endDate: new FormControl()
    });

    this.registerEventListeners();
  }

  public onFieldBlur(): void {
    this.onTouched();
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

    if (this.disabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  private updateForm(value: SkyDateRange): void {
    this.showEndDatePicker = false;
    this.showStartDatePicker = false;

    this.endDate.reset();
    this.startDate.reset();

    if (value) {
      this.selectedCalculator = this.getCalculatorByName(value.name);

      switch (this.selectedCalculator.type) {
        case SkyDateRangeCalculatorType.Before:
          this.showEndDatePicker = true;
          break;

        case SkyDateRangeCalculatorType.After:
          this.showStartDatePicker = true;
          break;

        case SkyDateRangeCalculatorType.Range:
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

  private getCalculatorByName(name: number): SkyDateRangeCalculator {
    return this.calculators.find((calculator) => {
      return (name === calculator.name);
    });
  }

  private registerEventListeners(): void {
    this.formGroup.get('name').valueChanges.subscribe((value) => {
      // The template parses the name value as a string, but it needs to be a number.
      const name = parseInt(value, 10);

      this._value = undefined;

      this.updateForm({
        name,
        startDate: undefined,
        endDate: undefined
      });
    });

    this.startDate.valueChanges.subscribe((value) => {
      console.log('Start date changes:', value);
    });

    this.endDate.valueChanges.subscribe((value) => {
      console.log('End date changes:', value);
    });
  }

  private onChange = (_: SkyDateRange) => {};
  private onTouched = () => {};
  private onValidatorChange = () => {};
}
