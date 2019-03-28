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
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/observable/race';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/takeUntil';

import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRangeCalculatorInstance
} from './date-range-calculator-instance';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeService
} from './date-range.service';

import {
  SkyDateRange
} from './date-range';

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
      SkyDateRangeCalculatorId.LastFiscalYear
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

  public get endDateControl(): AbstractControl {
    return this.formGroup.get('endDate');
  }

  public readonly dateRangePickerId = `sky-date-range-picker-${uniqueId++}`;

  public calculators: SkyDateRangeCalculatorInstance[];
  public formGroup: FormGroup;
  public showEndDatePicker = false;
  public showStartDatePicker = false;

  private get defaultCalculator(): SkyDateRangeCalculatorInstance {
    return this.calculators[0];
  }

  private get defaultValue(): SkyDateRange {
    return this.dateRangeService.getValue(this.defaultCalculator.calculatorId);
  }

  private get value(): SkyDateRange {
    if (
      this._value &&
      this._value.calculatorId !== undefined
    ) {
      return this._value;
    }

    return this.defaultValue;
  }

  private set value(value: SkyDateRange) {
    if (
      !this._value ||
      !this.dateRangesEqual(this._value, value)
    ) {
      this._value = this.dateRangeService.parseDateRange(value || this.defaultValue);

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
  private _value: SkyDateRange;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dateRangeService: SkyDateRangeService,
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.createForm();

    this.updateCalculators().then(() => {
      this.resetFormValue();

      const calculator = this.dateRangeService.getCalculatorInstanceById(
        this.value.calculatorId
      );

      const value = this.dateRangeService.getValue(
        calculator.calculatorId,
        this.value
      );

      this.isFirstChange = true;
      this.value = value;

      // This is needed to address a bug in Angular 4.
      // When a control value is set intially, its value is not represented on the view.
      // See: https://github.com/angular/angular/issues/13792
      this.control.setValue(this.value, {
        emitEvent: false
      });

      this.setupForm(calculator);
      this.addEventListeners();
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.calculatorIds && !changes.calculatorIds.firstChange) {
      this.updateCalculators().then(() => {
        let calculatorInstance = this.calculators.find((instance) => {
          return (instance.calculatorId === this.value.calculatorId);
        });

        // TODO: The next few lines are duplicated in the id subscription.
        if (!calculatorInstance) {
          const id = this.defaultCalculator.calculatorId;
          const newValue = this.dateRangeService.getValue(id);

          this.value = newValue;
          this.resetFormValue(newValue);

          calculatorInstance = this.dateRangeService.getCalculatorInstanceById(id);

          this.setupForm(calculatorInstance);
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

  // Only use writeValue for external value assignments!
  public writeValue(value: SkyDateRange | null): void {
    this.value = value;

    if (this.calculators) {
      const calculator = this.dateRangeService.getCalculatorInstanceById(this.value.calculatorId);
      this.setupForm(calculator);
      this.resetFormValue();
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
    const result = this.dateRangeService.validate(idControl.value, value);

    let errors: {[_: string]: any};

    if (result) {
      errors = {
        skyDateRange: result
      };
    } else {
      if (
        this.startDateControl.errors ||
        this.endDateControl.errors
      ) {
        errors = this.startDateControl.errors;
      }
    }

    if (!errors) {
      return;
    }

    idControl.setErrors(errors);
    idControl.markAsTouched();
    idControl.markAsDirty();

    // Need to mark the control as touched for the errors to appear.
    this.control.markAsTouched();

    return errors;
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

  private setupForm(calculator: SkyDateRangeCalculatorInstance): void {
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

  private resetFormValue(value?: SkyDateRange): void {
    this.formGroup.setValue(value || this.value, {
      emitEvent: false
    });
  }

  private addEventListeners(): void {
    this.calculatorIdControl.valueChanges
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((id) => {
        const newValue = this.dateRangeService.getValue(id);
        const calculatorInstance = this.dateRangeService.getCalculatorInstanceById(id);

        this.value = newValue;
        this.resetFormValue(newValue);
        this.setupForm(calculatorInstance);
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

    Observable.race(
      this.startDateControl.statusChanges,
      this.endDateControl.statusChanges
    )
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((status) => {
        if (status === 'INVALID') {
          setTimeout(() => {
            this.onValidatorChange();
          });
        }
      });
  }

  private dateRangesEqual(rangeA: SkyDateRange, rangeB: SkyDateRange): boolean {
    return (JSON.stringify(rangeA) === JSON.stringify(rangeB));
  }

  private updateCalculators(): Promise<void> {
    return this.dateRangeService.getCalculatorInstances(this.calculatorIds)
      .then((calculators) => {
        this.calculators = calculators;
        this.changeDetector.markForCheck();
      });
  }

  private onChange = (_: SkyDateRange) => {};
  private onTouched = () => {};
  private onValidatorChange = () => {};
}
