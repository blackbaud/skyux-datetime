import {
  AfterContentInit,
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
  ChangeDetectorRef
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
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator, AfterContentInit {

  @Input()
  public dateFormat: string;

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
  public maxDate: Date;

  @Input()
  public minDate: Date;

  @Input()
  public skyDatepickerInput: SkyDatepickerComponent;

  @Input()
  public skyDatepickerNoValidate = false;

  @Input()
  public startingDay: number;

  public get value(): Date {
    return this._value;
  }

  // TODO: The value can be either a string or a Date object.
  public set value(value: Date) {
    this.onTouched();

    const isNewValue = (
      (!value || !this._value) ||
      value.getTime() !== this._value.getTime()
    );

    if (isNewValue) {
      this._value = value;
      this.onChange(value);
      this.skyDatepickerInput.selectedDate = value;

      if (value) {
        const formattedDate = this.dateFormatter.format(value, this.dateFormat);
        this.setInputValue(formattedDate);
      }
    }
  }

  private control: AbstractControl;
  private dateFormatter = new SkyDateFormatter();
  private ngUnsubscribe = new Subject<void>();

  private _disabled = false;
  private _value: Date;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private configService: SkyDatepickerConfigService,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private resourcesService: SkyLibResourcesService
  ) {
    this.configureOptions();
  }

  public ngOnInit(): void {
    const element = this.elementRef.nativeElement;

    this.renderer.setElementClass(
      element,
      'sky-form-control',
      true
    );

    this.skyDatepickerInput.dateChange
      .takeUntil(this.ngUnsubscribe)
      .subscribe((value: Date) => {
        this.writeValue(value);
      });

    if (!element.getAttribute('aria-label')) {
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
      this.skyDatepickerInput.minDate = this.minDate;
    }

    if (changes.maxDate) {
      this.onValidatorChange();
      this.skyDatepickerInput.maxDate = this.maxDate;
    }

    if (changes.startingDay) {
      this.onValidatorChange();
      this.skyDatepickerInput.startingDay = this.startingDay;
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('blur', ['$event'])
  public onInputBlur(event: any): void {
    this.writeValue(event.target.value);
  }

  public writeValue(value: any): void {
    if (this.disabled) {
      return;
    }

    if (value instanceof Date) {
      this.value = value;
      return;
    }

    if (typeof value === 'string') {
      const date = this.dateFormatter.getDateFromString(value, this.dateFormat);
      if (this.dateFormatter.dateIsValid(date)) {
        this.value = date;
        return;
      }
    }

    this.value = undefined;
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
    this.skyDatepickerInput.disabled = disabled;
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

    if (typeof value === 'string') {
      return;
    }

    const isDateValid = this.dateFormatter.dateIsValid(value);
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

    return;
  }

  private setInputValue(value: string): void {
    this.renderer.setElementProperty(
      this.elementRef.nativeElement,
      'value',
      value
    );
  }

  private configureOptions(): void {
    if (this.configService.dateFormat) {
      this.dateFormat = this.configService.dateFormat;
    }

    if (this.configService.maxDate) {
      this.maxDate = this.configService.maxDate;
    }

    if (this.configService.minDate) {
      this.minDate = this.configService.minDate;
    }

    if (this.configService.startingDay) {
      this.startingDay = this.configService.startingDay;
    }
  }

  private onChange = (_: any) => {};
  private onTouched = () => {};
  private onValidatorChange = () => {};
}
