import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  forwardRef,
  OnDestroy,
  OnInit,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import {
  AbstractControl,
  AsyncValidator,
  ControlValueAccessor,
  FormControl,
  FormBuilder,
  FormGroup,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors
} from '@angular/forms';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/takeUntil';

import { SkyDateRangeCalculatorId } from './date-range-calculator-id';
import { SkyDateRangeCalculatorType } from './date-range-calculator-type';
import { SkyDateRange } from './date-range';
import { SkyDateRangeService } from './date-range.service';
import { SkyDateRangeCalculatorInstance } from './date-range-calculator-instance';

/* tslint:disable:no-forward-ref no-use-before-declare */
const SKY_DATE_RANGE_PICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyDateRangePickerComponent),
  multi: true
};

const SKY_DATE_RANGE_PICKER_VALIDATOR = {
  provide: NG_ASYNC_VALIDATORS,
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
  implements OnInit, AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor, AsyncValidator {

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
    return this.formGroup.get('id');
  }

  public get startDateControl(): AbstractControl {
    return this.formGroup.get('startDate');
  }

  public get endDateControl(): AbstractControl {
    return this.formGroup.get('endDate');
  }

  public calculators: SkyDateRangeCalculatorInstance[];

  public readonly dateRangePickerId = `sky-date-range-picker-${uniqueId++}`;

  public formGroup: FormGroup;
  public showEndDatePicker = false;
  public showStartDatePicker = false;

  private get defaultCalculator(): SkyDateRangeCalculatorInstance {
    return this.calculators[0];
  }

  private get defaultValue(): SkyDateRange {
    return this.dateRangeService.getValue(this.defaultCalculator.id);
  }

  private get value(): SkyDateRange {
    if (this._value && this._value.id !== undefined) {
      return this._value;
    }

    return this.defaultValue;
  }

  private set value(value: SkyDateRange) {
    if (
      !this._value ||
      !this.dateRangesEqual(value, this._value)
    ) {
      this._value = value;

      if (!this.isFirstChange) {
        this.onChange(value);
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
      const calculator = this.dateRangeService
        .getCalculatorInstanceById(this.calculatorIdControl.value);

      this.isFirstChange = true;
      this.value = this.dateRangeService.getValue(this.calculatorIdControl.value, this.value);

      this.setupForm(calculator);
      this.addEventListeners();
    });
  }

  public ngAfterViewInit(): void {
    // This is needed to address a bug in Angular 4.
    // When a control value is set intially, its value is not represented on the view.
    // See: https://github.com/angular/angular/issues/13792
    // if (this.control) {
    //   setTimeout(() => {
    //     this.control.setValue(this._value, {
    //       emitEvent: false
    //     });
    //   });
    // }

    // Start subscribing to events after the intial value has been set.
    // this.addEventListeners();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.calculatorIds && !changes.calculatorIds.firstChange) {
      this.updateCalculators().then(() => {
        let calculatorInstance = this.calculators.find((instance) => {
          return (instance.id === this.value.id);
        });

        // TODO: The next few lines are duplicated in the id subscription.
        if (!calculatorInstance) {
          const id = this.defaultCalculator.id;
          const newValue = this.dateRangeService.getValue(id);

          this.writeValue(newValue);
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

  public writeValue(value: SkyDateRange): void {
    // if (!this.calculators || this.disabled) {
    //   return;
    // }
    console.log('writeValue:', value);
    this.value = value;

    // const mergedValue = Object.assign({}, this.defaultValue, value);
    // const calculator = this.dateRangeService.getCalculatorInstanceById(mergedValue.id);
    // const calculatedValue = this.dateRangeService.getValue(calculator.id, mergedValue);

    // this.value = calculatedValue;

    // Set the empty value of the control to the default value.
    // if (!value) {
    //   this.onChange(this.value);
    // }

    // this.setupForm(calculator);
    // this.resetFormValue();
  }

  public validate(control: AbstractControl): Observable<ValidationErrors> {
    if (!this.control) {
      this.control = control;
    }

    if (!this.calculators) {
      return Observable.of();
    }

    const value = control.value;

    if (!value) {
      return Observable.of();
    }

    return this.dateRangeService.validate(this.calculatorIdControl.value, value)
      .first()
      .map((result) => {
        if (result) {
          const error = {
            skyDateRange: result
          };

          this.calculatorIdControl.setErrors(error);
          this.calculatorIdControl.markAsTouched();
          this.calculatorIdControl.markAsDirty();

          return Observable.of(error);
        }
      });
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

  // private patchValue(value: any): void {
  //   this.writeValue(
  //     Object.assign({}, this.value, value)
  //   );
  // }

  private createForm(): void {
    this.formGroup = this.formBuilder.group({
      id: new FormControl(),
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
    console.log('reset with:', value || this.value);
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

        this.writeValue(newValue);
        this.resetFormValue(newValue);

        const calculatorInstance = this.dateRangeService.getCalculatorInstanceById(id);

        this.setupForm(calculatorInstance);
      });

    // this.startDate.valueChanges
    //   .distinctUntilChanged()
    //   .takeUntil(this.ngUnsubscribe)
    //   .subscribe((value) => {
    //     this.patchValue({
    //       startDate: value
    //     });
    //   });

    // this.endDate.valueChanges
    //   .distinctUntilChanged()
    //   .takeUntil(this.ngUnsubscribe)
    //   .subscribe((value) => {
    //     this.patchValue({
    //       endDate: value
    //     });
    //   });
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
