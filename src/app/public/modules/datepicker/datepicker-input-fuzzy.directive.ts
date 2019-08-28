import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  ValidationErrors
} from '@angular/forms';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/distinctUntilChanged';

import 'rxjs/add/operator/takeUntil';

import {
  SkyDateFormatter
} from './date-formatter';

import {
  SkyDatepickerConfigService
} from './datepicker-config.service';

import {
  SkyDatepickerComponent
} from './datepicker.component';
import { SkyFuzzyDate } from './fuzzy-date';
import { SkyFuzzyDateService } from './fuzzy-date.service';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_FUZZY_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyFuzzyDatepickerInputDirective),
  multi: true
};

const SKY_FUZZY_DATEPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyFuzzyDatepickerInputDirective),
  multi: true
};
// tslint:enable

@Directive({
  selector: '[skyFuzzyDatepickerInput]',
  providers: [
    SKY_FUZZY_DATEPICKER_VALUE_ACCESSOR,
    SKY_FUZZY_DATEPICKER_VALIDATOR
  ]
})
export class SkyFuzzyDatepickerInputDirective
  implements OnInit, OnDestroy, AfterViewInit, AfterContentInit, ControlValueAccessor, Validator {

  @Input()
  public set dateFormat(value: string) {
    this._dateFormat = value;
  }

  public get dateFormat(): string {
    return this._dateFormat || this.configService.dateFormat;
  }

  @Input()
  public set yearRequired(value: boolean) {
    this._yearRequired = value;
    this.onValidatorChange();
  }

  public get yearRequired(): boolean {
    return this._yearRequired;
  }

  @Input()
  public set cannotBeFuture(value: boolean) {
    this._cannotBeFuture = value;
    this.onValidatorChange();
  }

  public get cannotBeFuture(): boolean {
    return this._cannotBeFuture;
  }

  @Input()
  public set maxFuzzyDate(value: SkyFuzzyDate) {
    this._maxFuzzyDate = value;
    this.datepickerComponent.maxDate = this.maxDate;
    this.onValidatorChange();
  }

  public get maxFuzzyDate(): SkyFuzzyDate {
    return this._maxFuzzyDate;
  }

  @Input()
  public set minFuzzyDate(value: SkyFuzzyDate) {
    this._minFuzzyDate = value;
    this.datepickerComponent.minDate = this.minDate;
    this.onValidatorChange();
  }

  public get minFuzzyDate(): SkyFuzzyDate {
    return this._minFuzzyDate;
  }

  @Input()
  public set skyFuzzyDatepickerInput(value: SkyDatepickerComponent) { }

  @Input()
  public skyDatepickerNoValidate = false;

  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'disabled',
      value
    );
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  public set startingDay(value: number) {
    this._startingDay = value;
    this.datepickerComponent.startingDay = this.startingDay;

    this.onValidatorChange();
  }

  public get startingDay(): number {
    return this._startingDay || this.configService.startingDay;
  }

  public get maxDate(): Date {
    if (this.maxFuzzyDate) {
      let maxDate = this.fuzzyDateService.getMomentFromFuzzyDate(this.maxFuzzyDate);
      if (maxDate.isValid()) {
          return maxDate.toDate();
      }
    } else if (this.cannotBeFuture) {
        return new Date();
    }
    return this.configService.maxDate;
  }

  public get minDate(): Date {
    if (this.minFuzzyDate) {
      const minDate = this.fuzzyDateService.getMomentFromFuzzyDate(this.minFuzzyDate);
      if (minDate.isValid()) {
        return minDate.toDate();
      }
    }
    return this.configService.minDate;
  }

  private get value(): any {
    return this._value;
  }

  private set value(value: any) {
    let fuzzyDate: SkyFuzzyDate;
    let fuzzyMoment: any;
    let dateValue: Date;
    let formattedDate: string;

    if (value instanceof Date) {
      dateValue = value;
      formattedDate = this.dateFormatter.format(value, this.dateFormat);
      fuzzyDate = this.fuzzyDateService.getFuzzyDateFromSelectedDate(value, this.dateFormat);

    } else if (typeof value === 'string') {
      formattedDate = value;
      fuzzyDate = this.fuzzyDateService.getFuzzyDateFromString(value, this.dateFormat);

      fuzzyMoment = this.fuzzyDateService.getMomentFromFuzzyDate(fuzzyDate);

      if (fuzzyMoment) {
        dateValue = fuzzyMoment.toDate();
      }

    } else {
      fuzzyDate = value as SkyFuzzyDate;
      formattedDate = this.fuzzyDateService.getStringFromFuzzyDate(fuzzyDate, this.dateFormat);
      fuzzyMoment = this.fuzzyDateService.getMomentFromFuzzyDate(fuzzyDate);

      if (fuzzyMoment) {
        dateValue = fuzzyMoment.toDate();
      }
    }

    const areFuzzyDatesEqual = (
      this._value && fuzzyDate
      && (
        (!this._value.day && !fuzzyDate.day)
        || this._value.day === fuzzyDate.day
      )
      && (
        (!this._value.month && !fuzzyDate.month)
        || this._value.month === fuzzyDate.month
      )
      && (
        (!this._value.year && !fuzzyDate.year)
        || this._value.year === fuzzyDate.year
      )
    );

    const isNewValue = (
      fuzzyDate !== this._value ||
      !areFuzzyDatesEqual
    );

    this._value = fuzzyDate || value;

    if (isNewValue) {
      this.onChange(this._value);

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.isFirstChange && this.control) {
        this.control.markAsPristine();
      }

      if (this.isFirstChange && this._value) {
        this.isFirstChange = false;
      }

      this.datepickerComponent.selectedDate = dateValue;
    }

    this.setInputElementValue(formattedDate || '');
  }

  private control: AbstractControl;

  private dateFormatter = new SkyDateFormatter();

  private isFirstChange = true;

  private ngUnsubscribe = new Subject<void>();

  private _cannotBeFuture: boolean = false;

  private _dateFormat: string;

  private _disabled = false;

  private _maxFuzzyDate: SkyFuzzyDate;

  private _minFuzzyDate: SkyFuzzyDate;

  private _startingDay: number;

  private _value: any;

  private _yearRequired: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private configService: SkyDatepickerConfigService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private resourcesService: SkyLibResourcesService,
    @Optional() private datepickerComponent: SkyDatepickerComponent,
    private fuzzyDateService: SkyFuzzyDateService
  ) { }

  public ngOnInit(): void {
    if (this.yearRequired) {
      if (this.dateFormat.toLowerCase().indexOf('y') === -1) {
        throw new Error('You have configured conflicting settings. Year is required and dateFormat does not include year.');
      }
    }

    if (!this.datepickerComponent) {
      throw new Error(
        'You must wrap the `skyFuzzyDatepickerInput` directive within a ' +
        '`<sky-datepicker>` component!'
      );
    }

    const element = this.elementRef.nativeElement;

    this.renderer.addClass(
      element,
      'sky-form-control'
    );

    const hasAriaLabel = element.getAttribute('aria-label');

    if (!hasAriaLabel) {
      this.resourcesService.getString('skyux_date_field_default_label')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((value: string) => {
          this.renderer.setAttribute(
            element,
            'aria-label',
            value
          );
        });
    }
  }

  public ngAfterContentInit(): void {
    this.datepickerComponent.dateChange
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((value: Date) => {
        this.isFirstChange = false;
        this.value = value;
        this.onTouched();
      });
  }

  public ngAfterViewInit(): void {
    // This is needed to address a bug in Angular 4.
    // When a control value is set intially, its value is not represented on the view.
    // See: https://github.com/angular/angular/issues/13792
    // Of note is the parent check which allows us to determine if the form is reactive.
    // Without this check there is a changed before checked error
    /* istanbul ignore else */

    if (this.control && this.control.parent) {
      setTimeout(() => {
        this.control.setValue(this.value, {
          emitEvent: false
        });

        this.changeDetector.markForCheck();
      });
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('change', ['$event'])
  public onInputChange(event: any) {
    this.onValueChange(event.target.value);
  }

  @HostListener('blur')
  public onInputBlur(): void {
    this.onTouched();
  }

  @HostListener('keyup')
  public onInputKeyup(): void {
    this.control.markAsDirty();
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (!this.control) {
      this.control = control;
    }

    if (this.skyDatepickerNoValidate) {
      return;
    }

    if (!this.control.value) {
      return;
    }

    const value: any = control.value;

    let fuzzyDate: SkyFuzzyDate;
    let validationError: any;

    if (typeof value === 'string') {
      fuzzyDate = this.fuzzyDateService.getFuzzyDateFromString(value, this.dateFormat);
    } else {
      fuzzyDate = value;
    }

    if (!fuzzyDate) {
      validationError = {
        'skyFuzzyDate': {
          invalid: value
        }
      };
    }

    if (!validationError && !fuzzyDate.year && this.yearRequired) {
      validationError = {
        'skyFuzzyDate': {
          yearRequired: value
        }
      };
    }

    if (!validationError && fuzzyDate.year) {
      let fuzzyDateRange;

      if (this.maxFuzzyDate) {
          fuzzyDateRange = this.fuzzyDateService.getFuzzyDateRange(fuzzyDate, this.maxFuzzyDate);

          if (!fuzzyDateRange.valid) {
            validationError = {
              'skyFuzzyDate': {
                maxFuzzyDate: value
              }
            };
          }
      }

      if (!validationError && this.minFuzzyDate) {
          fuzzyDateRange = this.fuzzyDateService.getFuzzyDateRange(this.minFuzzyDate, fuzzyDate);
          if (!fuzzyDateRange.valid) {
            validationError = {
              'skyFuzzyDate': {
                minFuzzyDate: value
              }
            };
          }
      }

      if (!validationError && this.cannotBeFuture) {
          fuzzyDateRange = this.fuzzyDateService.getFuzzyDateRange(fuzzyDate, this.fuzzyDateService.getCurrentFuzzyDate());
          if (!fuzzyDateRange.valid) {
            validationError = {
              'skyFuzzyDate': {
                cannotBeFuture: value
              }
            };
          }
      }
    }

    if (validationError) {
      // Mark the invalid control as touched so that the input's invalid CSS styles appear.
      // (This is only required when the invalid value is set by the FormControl constructor.)
      this.control.markAsTouched();
    }

    return validationError;
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.datepickerComponent.disabled = disabled;
  }

  /**
   * Detects changes to the underlying input element's value and updates the ngModel accordingly.
   * This is useful if you need to update the ngModel value before the input element loses focus.
   */
  public detectInputValueChange(): void {
    this.onValueChange(this.elementRef.nativeElement.value);
  }

  private onValueChange(newValue: string): void {
    this.isFirstChange = false;
    this.value = newValue;
  }

  private setInputElementValue(value: string): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'value',
      value
    );
  }

  private onChange = (_: any) => {};
  /*istanbul ignore next */
  private onTouched = () => {};
  private onValidatorChange = () => {};
}
