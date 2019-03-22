import {
  AfterViewInit,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer,
  SimpleChanges,
  ChangeDetectorRef,
  Optional,
  AfterContentInit
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

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyDatepickerInputDirective),
  multi: true
};

const SKY_DATEPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyDatepickerInputDirective),
  multi: true
};
// tslint:enable

@Directive({
  selector: '[skyDatepickerInput]',
  providers: [
    SKY_DATEPICKER_VALUE_ACCESSOR,
    SKY_DATEPICKER_VALIDATOR
  ]
})
export class SkyDatepickerInputDirective
  implements OnInit, OnChanges, OnDestroy, AfterContentInit, ControlValueAccessor, Validator {

  @Input()
  public set dateFormat(value: string) {
    this._dateFormat = value;
  }

  public get dateFormat(): string {
    return this._dateFormat || this.configService.dateFormat;
  }

  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
    this.renderer.setElementProperty(
      this.elementRef.nativeElement,
      'disabled',
      value
    );
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  public set maxDate(value: Date) {
    this._maxDate = value;
  }

  public get maxDate(): Date {
    return this._maxDate || this.configService.maxDate;
  }

  @Input()
  public set minDate(value: Date) {
    this._minDate = value;
  }

  public get minDate(): Date {
    return this._minDate || this.configService.minDate;
  }

  /**
   * @deprecated Use other method
   */
  @Input()
  public set skyDatepickerInput(value: SkyDatepickerComponent) {
    if (value) {
      console.warn(
        '[Deprecation warning] You no longer need to provide a template reference variable ' +
        'to the `skyDatepickerInput` attribute (this will be a breaking change in the next release).\n' +
        'Do this instead:\n' +
        '<sky-datepicker>\n  <input skyDatepickerInput />\n</sky-datepicker>'
      );
    }

    if (!this.datepickerComponent) {
      this.datepickerComponent = value;
    }
  }

  @Input()
  public skyDatepickerNoValidate = false;

  @Input()
  public set startingDay(value: number) {
    this._startingDay = value;
  }

  public get startingDay(): number {
    return this._startingDay || this.configService.startingDay;
  }

  private get value(): any {
    return this._value;
  }

  private set value(value: any) {
    const dateValue = this.getDateValue(value);

    const areDatesEqual = (
      this._value instanceof Date &&
      dateValue && dateValue.getTime() === this._value.getTime()
    );

    const isNewValue = (
      dateValue !== this._value ||
      !areDatesEqual
    );

    this._value = (dateValue || value);

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

      this.datepickerComponent.selectedDate = this._value;
    }

    if (dateValue) {
      const formattedDate = this.dateFormatter.format(dateValue, this.dateFormat);
      this.setInputElementValue(formattedDate);
    } else {
      this.setInputElementValue(value || '');
    }
  }

  private control: AbstractControl;
  private dateFormatter = new SkyDateFormatter();
  private isFirstChange = true;
  private ngUnsubscribe = new Subject<void>();

  private _dateFormat: string;
  private _disabled = false;
  private _maxDate: Date;
  private _minDate: Date;
  private _startingDay: number;
  private _value: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private configService: SkyDatepickerConfigService,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private resourcesService: SkyLibResourcesService,
    @Optional() private datepickerComponent: SkyDatepickerComponent
  ) { }

  public ngOnInit(): void {
    if (!this.datepickerComponent) {
      throw new Error(
        'You must wrap the `skyDatepickerInput` directive within a ' +
        '`<sky-datepicker>` component!'
      );
    }

    const element = this.elementRef.nativeElement;

    this.renderer.setElementClass(
      element,
      'sky-form-control',
      true
    );

    const hasAriaLabel = element.getAttribute('aria-label');
    if (!hasAriaLabel) {
      this.resourcesService.getString('skyux_date_field_default_label')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((value: string) => {
          this.renderer.setElementAttribute(
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
        this.writeValue(value);
        this.onTouched();
      });

    // This is needed to address a bug in Angular 4.
    // When a control value is set intially, its value is not represented on the view.
    // See: https://github.com/angular/angular/issues/13792
    if (this.control) {
      this.control.setValue(this.value, {
        emitEvent: false
      });

      this.changeDetector.detectChanges();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.minDate) {
      this.onValidatorChange();
      this.datepickerComponent.minDate = this.minDate;
    }

    if (changes.maxDate) {
      this.onValidatorChange();
      this.datepickerComponent.maxDate = this.maxDate;
    }

    if (changes.startingDay) {
      this.onValidatorChange();
      this.datepickerComponent.startingDay = this.startingDay;
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('change', ['$event'])
  public onInputChange(event: any) {
    this.isFirstChange = false;
    this.writeValue(event.target.value);
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

    const value: any = control.value;

    if (!value) {
      return;
    }

    const dateValue = this.getDateValue(value);
    const isDateValid = (dateValue && this.dateFormatter.dateIsValid(dateValue));

    if (!isDateValid) {
      return {
        'skyDate': {
          invalid: value
        }
      };
    }

    const minDate = this.minDate;

    if (
      minDate &&
      this.dateFormatter.dateIsValid(minDate) &&
      value < minDate
    ) {
      return {
        'skyDate': {
          minDate
        }
      };
    }

    const maxDate = this.maxDate;

    if (
      maxDate &&
      this.dateFormatter.dateIsValid(maxDate) &&
      value > maxDate
    ) {
      return {
        'skyDate': {
          maxDate
        }
      };
    }
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

  private setInputElementValue(value: string): void {
    this.renderer.setElementProperty(
      this.elementRef.nativeElement,
      'value',
      value
    );
  }

  private getDateValue(value: any): Date {
    let dateValue: Date;
    if (value instanceof Date) {
      dateValue = value;
    } else if (typeof value === 'string') {
      const date = this.dateFormatter.getDateFromString(value, this.dateFormat);
      if (this.dateFormatter.dateIsValid(date)) {
        dateValue = date;
      }
    }

    return dateValue;
  }

  private onChange = (_: any) => {};
  /*istanbul ignore next */
  private onTouched = () => {};
  private onValidatorChange = () => {};
}
