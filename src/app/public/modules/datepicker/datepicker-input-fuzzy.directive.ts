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
import { SkyFuzzyDate } from './fuzzy-date';
import { SkyFuzzyDateService } from './fuzzy-date.service';
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

  @Input() public dateFormatErrorMessage: any;
  @Input() public yearRequiredErrorMessage: any;
  @Input() public maxFuzzyDateErrorMessage: any;
  @Input() public minFuzzyDateErrorMessage: any;
  @Input() public cannotBeFutureErrorMessage: any;

  private _yearRequired: boolean = false;

  @Input()
  public set yearRequired(value: boolean) {
    this._yearRequired = value;
    this.onValidatorChange();
  }

  public get yearRequired(): boolean {
    return this._yearRequired;
  }

  private _cannotBeFuture: boolean = false;

  @Input()
  public set cannotBeFuture(value: boolean) {
    this._cannotBeFuture = value;
    this.onValidatorChange();
  }

  public get cannotBeFuture(): boolean {
    return this._cannotBeFuture;
  }

  private _maxFuzzyDate: SkyFuzzyDate;

  @Input()
  public set maxFuzzyDate(value: SkyFuzzyDate) {
    this._maxFuzzyDate = value;
    this.datepickerComponent.maxDate = this.maxDate;
    this.onValidatorChange();
  }

  public get maxFuzzyDate(): SkyFuzzyDate {
    return this._maxFuzzyDate;
  }

  private _minFuzzyDate: SkyFuzzyDate;

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

  public get maxDate(): Date {
    if (this.maxFuzzyDate) {
      let maxDate = this.fuzzyDateService.getMomentFromFuzzyDate(this.maxFuzzyDate);
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
      let minDate = this.fuzzyDateService.getMomentFromFuzzyDate(this.minFuzzyDate);
      if (minDate) {
          return minDate.toDate();
      }
    } else {
      return this.configService.minDate;
    }
  }

  protected get value(): any {
    return this._value;
  }

  protected set value(value: any) {
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
      fuzzyDate = this.fuzzyDateService.getFuzzyDateFromDateString(value, this.dateFormat);

      fuzzyMoment = this.fuzzyDateService.getMomentFromFuzzyDate(fuzzyDate);

      if (fuzzyMoment) {
        dateValue = fuzzyMoment.toDate();
      }

    } else {
      fuzzyDate = value as SkyFuzzyDate;
      formattedDate = this.fuzzyDateService.getDateStringFromFuzzyDate(fuzzyDate, this.dateFormat);
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

  constructor(
    protected changeDetector: ChangeDetectorRef,
    protected configService: SkyDatepickerConfigService,
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
    protected resourcesService: SkyLibResourcesService,
    @Optional() protected datepickerComponent: SkyDatepickerComponent,
    private fuzzyDateService: SkyFuzzyDateService
  ) {
    super(
      changeDetector, configService, elementRef,
      renderer, resourcesService, datepickerComponent);
   }

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
    let isFuzzyDateValid = true;
    let validationErrorMessage: string;

    if (typeof value === 'string') {
      fuzzyDate = this.fuzzyDateService.getFuzzyDateFromDateString(value, this.dateFormat);
    } else {
      fuzzyDate = value;
    }

    if (!fuzzyDate) {
      if (this.dateFormatErrorMessage) {
        validationErrorMessage = this.dateFormatErrorMessage;
      } else {
        this.resourcesService.getString('skyux_fuzzy_datepicker_invalid_format')
          .subscribe((resource: string) => validationErrorMessage = resource);
      }

      isFuzzyDateValid = false;
    }

    if (isFuzzyDateValid && !fuzzyDate.year && this.yearRequired) {
      if (this.yearRequiredErrorMessage) {
        validationErrorMessage = this.yearRequiredErrorMessage;
      } else {
        this.resourcesService.getString('skyux_fuzzy_datepicker_year_required')
        .subscribe((resource: string) => validationErrorMessage = resource);
      }

      isFuzzyDateValid = false;
    }

    if (isFuzzyDateValid && fuzzyDate.year) {
      let fuzzyDateRange;

      if (this.maxFuzzyDate) {
          fuzzyDateRange = this.fuzzyDateService.getFuzzyDateRange(fuzzyDate, this.maxFuzzyDate);

          if (!fuzzyDateRange.valid) {
            if (this.maxFuzzyDateErrorMessage) {
              validationErrorMessage = this.maxFuzzyDateErrorMessage;
            } else {
              this.resourcesService.getString('skyux_fuzzy_datepicker_max_fuzzy_date_error')
                .subscribe((resource: string) => validationErrorMessage = resource);
            }

            isFuzzyDateValid = false;
          }
      }

      if (this.minFuzzyDate) {
          fuzzyDateRange = this.fuzzyDateService.getFuzzyDateRange(this.minFuzzyDate, fuzzyDate);
          if (!fuzzyDateRange.valid) {
            if (this.minFuzzyDateErrorMessage) {
              validationErrorMessage = this.minFuzzyDateErrorMessage;
            } else {
              this.resourcesService.getString('skyux_fuzzy_datepicker_min_fuzzy_date_error')
                .subscribe((resource: string) => validationErrorMessage = resource);
            }

              isFuzzyDateValid = false;
          }
      }

      if (this.cannotBeFuture) {
          fuzzyDateRange = this.fuzzyDateService.getFuzzyDateRange(fuzzyDate, this.fuzzyDateService.getCurrentFuzzyDate());
          if (!fuzzyDateRange.valid) {
            if (this.cannotBeFutureErrorMessage) {
              validationErrorMessage = this.cannotBeFutureErrorMessage;
            } else {
              this.resourcesService.getString('skyux_fuzzy_datepicker_cannot_be_in_the_future')
                .subscribe((resource: string) => validationErrorMessage = resource);
            }

              isFuzzyDateValid = false;
          }
      }
    }

    if (!isFuzzyDateValid) {
      // Mark the invalid control as touched so that the input's invalid CSS styles appear.
      // (This is only required when the invalid value is set by the FormControl constructor.)
      this.control.markAsTouched();

      return {
        'skyFuzzyDate': {
          invalid: value,
          validationErrorMessage: validationErrorMessage
        }
      };
    }
  }
}
