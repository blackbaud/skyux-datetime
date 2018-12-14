import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Renderer,
  SimpleChanges
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validator
} from '@angular/forms';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyDatepickerComponent
} from './datepicker.component';

import {
  SkyDateFormatter
} from './date-formatter';

import {
  SkyDatepickerConfigService
} from './datepicker-config.service';

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
export class SkyDatepickerInputDirective implements
  OnInit, OnDestroy, ControlValueAccessor, Validator, OnChanges, AfterViewInit {

  public pickerChangedSubscription: Subscription;

  @Input()
  public skyDatepickerInput: SkyDatepickerComponent;

  @Input()
  public dateFormat: string;

  @Input()
  public skyDatepickerNoValidate: boolean = false;

  @Input()
  public minDate: Date;

  @Input()
  public maxDate: Date;

  @Input()
  public startingDay: number = 0;

  @Input()
  public get disabled(): boolean {
    return this._disabled || false;
  }
  public set disabled(value: boolean) {
    this.skyDatepickerInput.disabled = value;
    this.renderer.setElementProperty(
      this.elRef.nativeElement,
      'disabled',
      value);
    this._disabled = value;
  }

  private get modelValue(): Date {
    return this._modelValue;
  }
  private set modelValue(value: Date) {
    if (value !== this.modelValue && (this.dateFormatter.dateIsValid(value) || !value)) {
      this._modelValue = value;
      this._onChange(value);
    }
  }

  private dateFormatter = new SkyDateFormatter();
  private _modelValue: Date;
  private _disabled: boolean;

  public constructor(
    private renderer: Renderer,
    private elRef: ElementRef,
    private config: SkyDatepickerConfigService,
    private resourcesService: SkyLibResourcesService,
    @Optional() private injector: Injector,
    @Optional() private changeDetector: ChangeDetectorRef
  ) {
    this.configureOptions();
  }

  public configureOptions(): void {
    Object.assign(this, this.config);
  }

  public ngOnInit() {
    this.renderer.setElementClass(this.elRef.nativeElement, 'sky-form-control', true);
    this.pickerChangedSubscription = this.skyDatepickerInput.dateChanged
      .subscribe((newDate: Date) => {
        this.writeValue(newDate);
        this._onTouched();
      });

    if (!this.elRef.nativeElement.getAttribute('aria-label')) {
      this.resourcesService.getString('skyux_date_field_default_label')
        .subscribe((value: string) => {
          this.renderer.setElementAttribute(
            this.elRef.nativeElement,
            'aria-label',
            value
          );
        });
    }
  }

  public ngAfterViewInit(): void {
    let control: FormControl = (<NgControl>this.injector.get(NgControl)).control as FormControl;
    if (control && this.modelValue) {
      control.setValue(this.modelValue, { emitEvent: false });
      this.changeDetector.detectChanges();
    }
  }

  public ngOnDestroy() {
    /* istanbul ignore else */
    /* sanity check */
    if (this.pickerChangedSubscription) {
      this.pickerChangedSubscription.unsubscribe();
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['minDate']) {
      this._validatorChange();
      this.skyDatepickerInput.setMinDate(this.minDate);
    }

    if (changes['maxDate']) {
      this._validatorChange();
      this.skyDatepickerInput.setMaxDate(this.maxDate);
    }

    if (changes['startingDay']) {
      this._validatorChange();
      this.skyDatepickerInput.startingDay = this.startingDay;
    }
  }

  @HostListener('change', ['$event'])
  public onChange(event: any) {
    this.writeValue(event.target.value);
  }

  @HostListener('blur')
  public onBlur() {
    this._onTouched();
  }

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }

  public registerOnTouched(fn: () => any): void { this._onTouched = fn; }

  public registerOnValidatorChange(fn: () => void): void { this._validatorChange = fn; }

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public writeValue(value: any) {
    let dateValue: Date;
    if (this.dateFormatter.dateIsValid(value)) {
      this.modelValue = value;
      dateValue = value;
    } else if (value) {
      dateValue = this.dateFormatter.getDateFromString(value, this.dateFormat);
      if (this.dateFormatter.dateIsValid(dateValue)) {
        this.modelValue = dateValue;
      } else {
        this._onChange(value);
      }
    } else {
      this.modelValue = value;
    }

    if (this.dateFormatter.dateIsValid(dateValue) || !value) {
      this.writeModelValue(this.modelValue);
    } else {
      this.renderer.setElementProperty(
        this.elRef.nativeElement,
        'value',
        value);
    }
  }

  public validate(control: AbstractControl): {[key: string]: any} {
    let value = control.value;

    if (!value) {
      return undefined;
    }

    let dateValue = this.dateFormatter.getDateFromString(value, this.dateFormat);

    if (!this.dateFormatter.dateIsValid(dateValue) && !this.skyDatepickerNoValidate) {
      return {
        'skyDate': {
          invalid: control.value
        }
      };
    }

    if (this.minDate &&
      this.dateFormatter.dateIsValid(this.minDate) &&
      this.dateFormatter.dateIsValid(value) &&
      value < this.minDate) {

      return {
        'skyDate': {
          minDate: this.minDate
        }
      };
    }

    if (this.maxDate &&
      this.dateFormatter.dateIsValid(this.maxDate) &&
      this.dateFormatter.dateIsValid(value) &&
      value > this.maxDate) {
        return {
          'skyDate': {
            maxDate: this.maxDate
          }
        };
      }

    return undefined;
  }

  private writeModelValue(model: Date) {
    this.renderer.setElementProperty(
      this.elRef.nativeElement,
      'value',
      model ? this.dateFormatter.format(model, this.dateFormat) : '');

    this.skyDatepickerInput.setSelectedDate(model);
  }

  /*istanbul ignore next */
  private _onChange = (_: any) => {};
  /*istanbul ignore next */
  private _onTouched = () => {};
  private _validatorChange = () => {};
}
