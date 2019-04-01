import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/takeUntil';

import {
  SkyDateRangeCalculation
} from './date-range-calculation';

import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeCalculator
} from './date-range-calculator';

import {
  SkyDateRangeService
} from './date-range.service';

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
    SKY_DATE_RANGE_PICKER_VALIDATOR
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDateRangePickerComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {

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
  public set calculatorIds(value: SkyDateRangeCalculatorId[]) {
    if (value) {
      this._calculatorIds = value;
    }
  }

  public get calculatorIds(): SkyDateRangeCalculatorId[] {
    return this._calculatorIds || [
      SkyDateRangeCalculatorId.AnyTime,
      SkyDateRangeCalculatorId.Before,
      SkyDateRangeCalculatorId.After,
      SkyDateRangeCalculatorId.SpecificRange,
      SkyDateRangeCalculatorId.Yesterday,
      SkyDateRangeCalculatorId.Today,
      SkyDateRangeCalculatorId.Tomorrow,
      SkyDateRangeCalculatorId.LastWeek,
      SkyDateRangeCalculatorId.ThisWeek,
      SkyDateRangeCalculatorId.NextWeek,
      SkyDateRangeCalculatorId.LastMonth,
      SkyDateRangeCalculatorId.ThisMonth,
      SkyDateRangeCalculatorId.NextMonth,
      SkyDateRangeCalculatorId.LastQuarter,
      SkyDateRangeCalculatorId.ThisQuarter,
      SkyDateRangeCalculatorId.NextQuarter,
      SkyDateRangeCalculatorId.LastYear,
      SkyDateRangeCalculatorId.ThisYear,
      SkyDateRangeCalculatorId.NextYear,
      SkyDateRangeCalculatorId.LastFiscalYear,
      SkyDateRangeCalculatorId.ThisFiscalYear,
      SkyDateRangeCalculatorId.NextFiscalYear
    ];
  }

  @Input()
  public label: string;

  public get calculatorIdControl(): AbstractControl {
    return this.formGroup.get('calculatorId');
  }

  public get startDateControl(): AbstractControl {
    return this.formGroup.get('startDate');
  }

  public get startDateLabelResourceKey(): string {
    if (this.selectedCalculator.type === SkyDateRangeCalculatorType.Range) {
      return 'skyux_date_range_picker_start_date_label';
    }

    return 'skyux_date_range_picker_after_date_label';
  }

  public get endDateControl(): AbstractControl {
    return this.formGroup.get('endDate');
  }

  public get endDateLabelResourceKey(): string {
    if (this.selectedCalculator.type === SkyDateRangeCalculatorType.Range) {
      return 'skyux_date_range_picker_end_date_label';
    }

    return 'skyux_date_range_picker_before_date_label';
  }

  public get selectedCalculator(): SkyDateRangeCalculator {
    return this._selectedCalculator;
  }

  public readonly dateRangePickerId = `sky-date-range-picker-${uniqueId++}`;

  public calculators: SkyDateRangeCalculator[];
  public formGroup: FormGroup;
  public showEndDatePicker = false;
  public showStartDatePicker = false;

  private get defaultCalculator(): SkyDateRangeCalculator {
    return this.calculators[0];
  }

  private get defaultValue(): SkyDateRangeCalculation {
    return this.defaultCalculator.getValue();
  }

  private get value(): SkyDateRangeCalculation {
    if (
      this._value &&
      this._value.calculatorId !== undefined
    ) {
      return this._value;
    }

    return this.defaultValue;
  }

  private set value(value: SkyDateRangeCalculation) {
    const isNewValue = !this.dateRangesEqual(this._value, value);

    if (isNewValue) {
      if (this._value || value) {
        this._value = value || this.defaultValue;
      }

      if (!this.isFirstChange) {
        this.onChange(this.value);
      }

      if (this.isFirstChange) {
        this.isFirstChange = false;
      }
    }
  }

  private control: AbstractControl;
  private isFirstChange = true;
  private ngUnsubscribe = new Subject<void>();

  private _calculatorIds: SkyDateRangeCalculatorId[];
  private _disabled = false;
  private _selectedCalculator: SkyDateRangeCalculator;
  private _value: SkyDateRangeCalculation;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dateRangeService: SkyDateRangeService,
    private formBuilder: FormBuilder,
    private windowRef: SkyAppWindowRef
  ) { }

  public ngOnInit(): void {
    this.createForm();

    this.updateCalculators().then(() => {
      this.resetFormValue();

      const value = this.selectedCalculator.getValue(
        this.value.startDate,
        this.value.endDate
      );

      this.isFirstChange = true;
      this.value = value;

      // This is needed to address a bug in Angular 4.
      // When a control value is set intially, its value is not represented on the view.
      // See: https://github.com/angular/angular/issues/13792
      this.control.setValue(this.value, {
        emitEvent: false
      });

      this.setupForm();

      this.windowRef.nativeWindow.setTimeout(() => {
        this.addEventListeners();
      });
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.calculatorIds &&
      !changes.calculatorIds.firstChange
    ) {
      this.updateCalculators().then(() => {
        const id = this.calculatorIdControl.value;

        // Maintain the currently selected values if the calculators change after
        // a value has been chosen.
        const found = this.calculators.find((calculator) => {
          return (calculator.calculatorId === id);
        });

        if (!found) {
          const newValue = this.defaultCalculator.getValue();
          this.value = newValue;
          this.resetFormValue(newValue);
          this.setupForm();
        }
      });
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onFieldBlur(): void {
    this.onTouched();
  }

  public writeValue(value: SkyDateRangeCalculation | null): void {
    this.value = value;

    if (this.calculators) {
      this.resetFormValue();
      this.setupForm();
    }
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (!this.control) {
      this.control = control;
    }

    if (!this.calculators) {
      return;
    }

    const value = control.value;

    if (!value) {
      return;
    }

    const idControl = this.calculatorIdControl;
    const result = this.selectedCalculator.validate(value);

    let errors: ValidationErrors;

    if (result) {
      errors = {
        skyDateRange: {
          calculatorId: idControl.value,
          errors: result
        }
      };
    } else {
      errors = this.startDateControl.errors || this.endDateControl.errors;
    }

    if (!errors) {
      return;
    }

    idControl.setErrors(errors);
    idControl.markAsTouched();
    idControl.markAsDirty();

    // Need to mark the control as touched for the error messages to appear.
    this.control.markAsTouched();

    return errors;
  }

  public registerOnChange(fn: (value: SkyDateRangeCalculation) => SkyDateRangeCalculation): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => SkyDateRangeCalculation): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    if (this.disabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  private patchValue(value: any): void {
    const newValue = Object.assign({}, this.value, value);
    this.value = newValue;
  }

  private createForm(): void {
    this.formGroup = this.formBuilder.group({
      calculatorId: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl()
    });
  }

  private setupForm(): void {
    const calculator = this.selectedCalculator;

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

  private resetFormValue(value?: SkyDateRangeCalculation): void {
    // Clear any errors first.
    this.formGroup.setErrors({});

    this.formGroup.reset(value || this.value, {
      emitEvent: false
    });
  }

  private addEventListeners(): void {
    this.calculatorIdControl.valueChanges
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.dateRangeService.getCalculatorById(
          this.calculatorIdControl.value
        ).then((calculator) => {
          this._selectedCalculator = calculator;
          const newValue = calculator.getValue();
          this.value = newValue;
          this.resetFormValue(newValue);
          this.setupForm();
        });
      });

    this.startDateControl.valueChanges
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((value) => {
        this.patchValue({
          startDate: value
        });
      });

    this.endDateControl.valueChanges
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((value) => {
        this.patchValue({
          endDate: value
        });
      });
  }

  private dateRangesEqual(
    rangeA: SkyDateRangeCalculation,
    rangeB: SkyDateRangeCalculation
  ): boolean {
    return (JSON.stringify(rangeA) === JSON.stringify(rangeB));
  }

  private updateCalculators(): Promise<void> {
    return this.dateRangeService
      .getCalculators(this.calculatorIds)
      .then((calculators) => {
        this.calculators = calculators;
        this.changeDetector.markForCheck();
      });
  }

  private onChange = (_: SkyDateRangeCalculation) => {};
  private onTouched = () => {};
}
