import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  forwardRef,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from '@angular/forms';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/takeUntil';

import { SkyDateRangeCalculator } from './date-range-calculator';
import { SkyDateRangeCalculatorName } from './date-range-calculator-name';
import { SkyDateRangeCalculatorType } from './date-range-calculator-type';
import { SkyDateRangeService } from './date-range.service';
import { SkyDateRange } from './date-range';

/* tslint:disable:no-forward-ref no-use-before-declare */
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
/* tslint:enable */

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
export class SkyDateRangePickerComponent
  implements OnInit, AfterContentInit, OnDestroy, ControlValueAccessor, Validator {

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

  public set selectedCalculator(value: SkyDateRangeCalculator) {
    if (value !== this._selectedCalculator) {
      this._selectedCalculator = value;
    }
  }

  public get selectedCalculator(): SkyDateRangeCalculator {
    return this._selectedCalculator || this.defaultCalculator;
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

  @Input()
  public set defaultCalculator(value: SkyDateRangeCalculator) {
    this._defaultCalculator = value;
  }

  public get defaultCalculator(): SkyDateRangeCalculator {
    return this._defaultCalculator || this.getCalculatorByName(
      SkyDateRangeCalculatorName.AtAnyTime
    );
  }

  private get defaultValue(): SkyDateRange {
    return this.defaultCalculator.getValue();
  }

  private get endDate(): AbstractControl {
    return this.formGroup.get('endDate');
  }

  private get startDate(): AbstractControl {
    return this.formGroup.get('startDate');
  }

  private get value(): SkyDateRange {
    return (this._value && this._value.name !== undefined) ? this._value : this.defaultValue;
  }

  private set value(value: SkyDateRange) {
    if (
      !this._value ||
      !this.dateRangesEqual(value, this._value)
    ) {
      if (!this.isFirstChange) {
        this.onChange(value);
      }

      if (this.isFirstChange && this._value) {
        this.isFirstChange = false;
      }

      this._value = value;
    }
  }

  private control: AbstractControl;
  private isFirstChange = true;
  private ngUnsubscribe = new Subject<void>();

  private _defaultCalculator: SkyDateRangeCalculator;
  private _disabled = false;
  private _selectedCalculator: SkyDateRangeCalculator;
  private _value: SkyDateRange;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dateRangeService: SkyDateRangeService,
    private formBuilder: FormBuilder
  ) {
    this.calculators = this.dateRangeService.getDefaultDateRangeCalculators();
    this.createForm();
    this.resetForm();
  }

  public ngOnInit(): void { }

  public ngAfterContentInit(): void {
    // This is needed to address a bug in Angular 4.
    // When a control value is set intially, its value is not represented on the view.
    // See: https://github.com/angular/angular/issues/13792
    if (this.control) {
      this.control.setValue(this._value, {
        emitEvent: false
      });
    }

    // Start subscribing to events after the intial value has been set.
    this.registerEventListeners();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onFieldBlur(): void {
    this.onTouched();
  }

  public writeValue(value: SkyDateRange): void {
    const merged = Object.assign({}, this.defaultValue, value);

    const calculator = this.getCalculatorByName(merged.name);
    const calculatedValue = calculator.getValue(merged.startDate, merged.endDate);

    this.value = calculatedValue;
    this.selectedCalculator = calculator;

    this.resetForm(this.value);

    // Set the empty value of the control to the default value.
    if (!value) {
      this.onChange(this.value);
    }

    this.setupForm(calculator);
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (!this.control) {
      this.control = control;
    }

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

    return;
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

  private setupForm(calculator: SkyDateRangeCalculator): void {
    let showEndDatePicker = false;
    let showStartDatePicker = false;

    switch (calculator.type) {
      case SkyDateRangeCalculatorType.Before:
        showEndDatePicker = true;
        break;

      case SkyDateRangeCalculatorType.After:
        showStartDatePicker = true;
        break;

      case SkyDateRangeCalculatorType.Range:
        showEndDatePicker = true;
        showStartDatePicker = true;
        break;

      default:
        break;
    }

    this.showEndDatePicker = showEndDatePicker;
    this.showStartDatePicker = showStartDatePicker;
    this.changeDetector.markForCheck();
  }

  private resetForm(value?: SkyDateRange): void {
    this.formGroup.setValue(value || this.defaultValue, {
      emitEvent: false
    });
  }

  private createForm(): void {
    this.formGroup = this.formBuilder.group({
      name: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl()
    });
  }

  private getCalculatorByName(name: number): SkyDateRangeCalculator {
    return this.calculators.find((calculator) => {
      return (name === calculator.name);
    });
  }

  private registerEventListeners(): void {
    this.formGroup.get('name').valueChanges
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((value) => {
        console.log('Name:', value);
        const name = parseInt(value, 10);
        this.writeValue({ name });
      });

    this.startDate.valueChanges
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((value) => {
        console.log('Start date:', value);
      });

    this.endDate.valueChanges
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((value) => {
        console.log('End date:', value);
      });
  }

  private dateRangesEqual(rangeA: SkyDateRange, rangeB: SkyDateRange): boolean {
    const isEqual = (JSON.stringify(rangeA) === JSON.stringify(rangeB));
    console.log('dateRangesEqual()', isEqual, rangeA, rangeB);
    return isEqual;
    // if (
    //   rangeA.name !== rangeB.name
    // ) {
    //   return false;
    // }

    // // Either of the start dates empty?
    // if (
    //   (!rangeA.startDate || !rangeB.startDate) &&
    //   rangeA.startDate !== rangeB.startDate
    // ) {
    //   return false;
    // }

    // if (
    //   (!rangeA.endDate || !rangeB.endDate) &&
    //   rangeA.endDate !== rangeB.endDate
    // ) {
    //   return false;
    // }

    // if (
    //   rangeA.startDate.getTime() !== rangeB.startDate.getTime() ||
    //   rangeA.endDate.getTime() !== rangeB.endDate.getTime()
    // ) {
    //   return false;
    // }

    // return true;
  }

  private onChange = (_: SkyDateRange) => {};
  private onTouched = () => {};
  private onValidatorChange = () => {};
}
