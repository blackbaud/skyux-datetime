import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
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

import 'rxjs/add/operator/distinctUntilChanged';

import 'rxjs/add/operator/takeUntil';

import {
  SkyDatepickerConfigService
} from './datepicker-config.service';

import {
  SkyDatepickerComponent
} from './datepicker.component';
import { SkyDatepickerFuzzyDate } from './datepicker-fuzzy-date';
import { SkyFuzzyDateFactory } from './fuzzy-date-factory';
import { SkyDatepickerInputDirective } from './datepicker-input.directive';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyFuzzyDatepickerInputDirective),
  multi: true
};

const SKY_DATEPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyFuzzyDatepickerInputDirective),
  multi: true
};
// tslint:enable

@Directive({
  selector: '[skyFuzzyDatepickerInput]',
  providers: [
    SKY_DATEPICKER_VALUE_ACCESSOR,
    SKY_DATEPICKER_VALIDATOR
  ]
})
export class SkyFuzzyDatepickerInputDirective extends SkyDatepickerInputDirective
  implements OnInit, OnDestroy, AfterViewInit, AfterContentInit, ControlValueAccessor, Validator {

  @Input() public yearRequired = false;
  @Input() public cannotBeFuture = false;
  @Input() public dateFormatErrorMessage: any;
  @Input() public yearRequiredErrorMessage: any;
  @Input() public maxFuzzyDateErrorMessage: any;
  @Input() public minFuzzyDateErrorMessage: any;
  @Input() public cannotBeFutureErrorMessage: any;

  private _maxFuzzyDate: SkyDatepickerFuzzyDate;

  @Input()
  public set maxFuzzyDate(value: SkyDatepickerFuzzyDate) {
    console.log('setting maxFuzzyDate: ' + JSON.stringify(value));
    this._maxFuzzyDate = value;
    this.datepickerComponent.maxDate = this.maxDate;
    this.onValidatorChange();
  }

  public get maxFuzzyDate(): SkyDatepickerFuzzyDate {
    return this._maxFuzzyDate;
  }

  private _minFuzzyDate: SkyDatepickerFuzzyDate;

  @Input()
  public set minFuzzyDate(value: SkyDatepickerFuzzyDate) {
    console.log('setting minFuzzyDate: ' + JSON.stringify(value));
    this._minFuzzyDate = value;
    this.datepickerComponent.minDate = this.minDate;
    this.onValidatorChange();
  }

  @Input()
  public set skyFuzzyDatepickerInput(value: SkyDatepickerComponent) {
    if (value) {
      console.warn(
        '[Deprecation warning] You no longer need to provide a template reference variable ' +
        'to the `skyFuzzyDatepickerInput` attribute (this will be a breaking change in the next ' +
        'major version release).\n' +
        'Do this instead:\n' +
        '<sky-datepicker>\n  <input skyFuzzyDatepickerInput />\n</sky-datepicker>'
      );
    }
  }

  public get minFuzzyDate(): SkyDatepickerFuzzyDate {
    return this._minFuzzyDate;
  }

  public get maxDate(): Date {
    if (this.maxFuzzyDate) {
      let maxDate = this.fuzzyDateFactory.getMomentFromFuzzyDate(this.maxFuzzyDate);
      if (maxDate) {
          return maxDate.toDate();
      }
    } else if (this.cannotBeFuture) {
        return new Date();
    } else {
      return this.configService.maxDate;
    }
  }

  public get minDate(): Date {
    if (this.minFuzzyDate) {
      let minDate = this.fuzzyDateFactory.getMomentFromFuzzyDate(this.minFuzzyDate);
      if (minDate) {
          return minDate.toDate();
      }
    } else {
      return this.configService.minDate;
    }
  }
/*
  public ngAfterViewInit(): void {
    console.log('ngAfterViewInit - value: ' + this.value);
    console.log('ngAfterViewInit - control: ' + this.control);
    console.log('ngAfterViewInit - control.parent: ' + this.control.parent);

    if (this.control && this.control.parent && this.control.value ) {
      console.log('marking as touched...');
      this.control.markAsTouched();
    }
  }
*/
  protected get value(): any {
    return this._value;
  }

  protected set value(value: any) {
    let fuzzyDate: SkyDatepickerFuzzyDate;
    let dateValue: Date;
    let formattedDate: string;

    console.log('fuzzy date picker input - setting value');
    console.log('current value: ' + JSON.stringify(this.value));
    console.log('new value: ' + JSON.stringify(value));

    if (value instanceof Date) {
      console.log('set value - value is a date');
      dateValue = value;
      formattedDate = this.dateFormatter.format(value, this.dateFormat);
      fuzzyDate = this.fuzzyDateFactory.getFuzzyDateFromSelectedDate(value, this.dateFormat);

      // this.modelSetByDatePicker = true;

    } else if (typeof value === 'string') {
      console.log('set value - value is a string');

      formattedDate = value;
      fuzzyDate = this.fuzzyDateFactory.getFuzzyDateFromDateString(value, this.dateFormat);

      console.log('fuzzyDate: ' + JSON.stringify(fuzzyDate));
      let fuzzyMoment = this.fuzzyDateFactory.getMomentFromFuzzyDate(fuzzyDate);

      console.log('fuzzyMoment: ' + fuzzyMoment);

      if (fuzzyMoment) {
        dateValue = fuzzyMoment.toDate();
      }

      console.log('set value - fuzzyDate: ' + JSON.stringify(fuzzyDate));
      console.log('set value - dateValue: ' + dateValue);
    } else {
      fuzzyDate = value as SkyDatepickerFuzzyDate;
      formattedDate = this.fuzzyDateFactory.getDateStringFromFuzzyDate(fuzzyDate, this.dateFormat);
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

    console.log('set value - areFuzzyDatesEqual: ' + areFuzzyDatesEqual);
    console.log('set value - isNewValue: ' + isNewValue);

    this._value = fuzzyDate || value;

    console.log('_value: ' + JSON.stringify(this._value));
    console.log('value: ' + JSON.stringify(this.value));

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

    console.log('setting input value: ' + formattedDate);

    this.setInputElementValue(formattedDate || '');
  }

  constructor(
    protected changeDetector: ChangeDetectorRef,
    protected configService: SkyDatepickerConfigService,
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
    protected resourcesService: SkyLibResourcesService,
    @Optional() protected datepickerComponent: SkyDatepickerComponent,
    private fuzzyDateFactory: SkyFuzzyDateFactory
  ) {
    super(
      changeDetector, configService, elementRef,
      renderer, resourcesService, datepickerComponent);
   }

  public ngOnInit(): void {
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

  public validate(control: AbstractControl): ValidationErrors {
    console.log('fuzzy date input directive - validating');
    if (this.control) {
      console.log('control value: ' + this.control.value);
    } else {
      console.log('control is undefined');
    }

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
    console.log('fuzzy input validate - value: ' + JSON.stringify(value));

    let fuzzyDate: SkyDatepickerFuzzyDate;
    let isFuzzyDateValid = true;
    let validationErrorMessage: string;

    if (typeof value === 'string') {
      fuzzyDate = this.fuzzyDateFactory.getFuzzyDateFromDateString(value, this.dateFormat);
    } else {
      fuzzyDate = value;
    }

    if (!fuzzyDate) {
      this.resourcesService.getString('fuzzy_date_invalid_format')
        .subscribe((resource: string) => validationErrorMessage = resource);

      isFuzzyDateValid = false;
    }

    if (isFuzzyDateValid && !fuzzyDate.year && this.yearRequired) {
      this.resourcesService.getString('fuzzy_date_year_required')
      .subscribe((resource: string) => validationErrorMessage = resource);

      isFuzzyDateValid = false;
    }

    if (isFuzzyDateValid && fuzzyDate.year) {
      let fuzzyDateRange;

      if (this.maxFuzzyDate) {
          fuzzyDateRange = this.fuzzyDateFactory.getFuzzyDateRange(fuzzyDate, this.maxFuzzyDate);

          console.log('validate maxFuzzyDate - fuzzyDate: ' + JSON.stringify(fuzzyDate));
          console.log('validate maxFuzzyDate - maxFuzzyDate: ' + JSON.stringify(this.maxFuzzyDate));
          console.log('validate maxFuzzyDate - fuzzyDateRange: ' + JSON.stringify(fuzzyDateRange));

          if (!fuzzyDateRange.valid) {
            this.resourcesService.getString('fuzzy_date_max_fuzzy_date_error')
              .subscribe((resource: string) => validationErrorMessage = resource);

              isFuzzyDateValid = false;
          }
      }

      if (this.minFuzzyDate) {
          fuzzyDateRange = this.fuzzyDateFactory.getFuzzyDateRange(this.minFuzzyDate, fuzzyDate);
          if (!fuzzyDateRange.valid) {
            this.resourcesService.getString('fuzzy_date_min_fuzzy_date_error')
              .subscribe((resource: string) => validationErrorMessage = resource);

              isFuzzyDateValid = false;
          }
      }

      if (this.cannotBeFuture) {
          fuzzyDateRange = this.fuzzyDateFactory.getFuzzyDateRange(fuzzyDate, this.fuzzyDateFactory.getCurrentFuzzyDate());
          if (!fuzzyDateRange.valid) {
            this.resourcesService.getString('fuzzy_date_cannot_be_in_the_future')
              .subscribe((resource: string) => validationErrorMessage = resource);

              isFuzzyDateValid = false;
          }
      }
    }

    console.log('isFuzzyDateValid: ' + isFuzzyDateValid);
    console.log('errorMessage: ' + validationErrorMessage);

    if (!isFuzzyDateValid) {
      // Mark the invalid control as touched so that the input's invalid CSS styles appear.
      // (This is only required when the invalid value is set by the FormControl constructor.)
      this.control.markAsTouched();

      return {
        'skyDate': {
          invalid: value,
          errorMessage: validationErrorMessage
        }
      };
    }
  }
}
