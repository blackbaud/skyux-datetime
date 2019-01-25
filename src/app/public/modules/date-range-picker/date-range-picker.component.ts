import {
  Component,
  Input,
  forwardRef
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  AbstractControl
} from '@angular/forms';

import {
  SkyDateRangeDefaultValues
} from './types/date-range-default-values';

import {
  SkyDateRangeFormat
} from './types/date-range-format';

import {
  SkyDateRangeFormatType
} from './types/date-range-format-type';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_DATE_RANGE_PICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line:no-forward-ref
  useExisting: forwardRef(() => SkyDateRangePickerComponent),
  multi: true
};

const SKY_DATE_RANGE_PICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyDateRangePickerComponent),
  multi: true
};
// tslint:enable

@Component({
  selector: 'sky-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    SKY_DATE_RANGE_PICKER_VALUE_ACCESSOR,
    SKY_DATE_RANGE_PICKER_VALIDATOR
  ]
})
export class SkyDateRangePickerComponent implements ControlValueAccessor {
  @Input()
  public label: string;

  @Input()
  public disabled = false;

  @Input()
  public dateFormat: string;

  public dateRangeFormats = SkyDateRangeDefaultValues.DEFAULT_VALUES;
  public isInvalid = false;

  public set selectedFormat(value: SkyDateRangeFormat) {
    if (this.selectedFormat !== value) {
      this._selectedFormat = value;
      this.updateValue();
    }
  }
  public get selectedFormat(): SkyDateRangeFormat {
    return this._selectedFormat;
  }

  public set selectedFirstDate(value: Date) {
    if (this._selectedFirstDate !== value) {
      this._selectedFirstDate = value;
      this.updateValue();
    }
  }
  public get selectedFirstDate(): Date {
    return this._selectedFirstDate;
  }

  public set selectedSecondDate(value: Date) {
    if (this._selectedSecondDate !== value) {
      this._selectedSecondDate = value;
      this.updateValue();
    }
  }
  public get selectedSecondDate(): Date {
    return this._selectedSecondDate;
  }

  public get displayFirstDatepicker(): boolean {
    return this.selectedFormat &&
      (
        this.selectedFormat.formatType === SkyDateRangeFormatType.SpecificRange ||
        this.selectedFormat.formatType === SkyDateRangeFormatType.Before ||
        this.selectedFormat.formatType === SkyDateRangeFormatType.After
      );
  }

  public get displaySecondDatepicker(): boolean {
    return this.selectedFormat &&
      this.selectedFormat.formatType === SkyDateRangeFormatType.SpecificRange;
  }

  private _selectedFirstDate: Date;
  private _selectedSecondDate: Date;
  private _selectedFormat = this.dateRangeFormats[0];

  public writeValue(obj: any): void {
    if (!obj) {
      obj = {};
    }

    if (this.selectedFirstDate !== obj.startDate || this.selectedSecondDate !== obj.endDate) {
      this._selectedFirstDate = obj.startDate;
      this._selectedSecondDate = obj.endDate;
      this.updateValue();
    }
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public validate(control: AbstractControl): {[key: string]: any} {
    let value = control.value;

    if (
      value &&
      this.selectedFormat.formatType === SkyDateRangeFormatType.SpecificRange &&
      value.startDate && value.endDate &&
      value.startDate > value.endDate
    ) {
      this.isInvalid = true;
      return {
        'skyDateRange': {
          invalid: control.value
        }
      };
    }

    this.isInvalid = false;
    return undefined;
  }

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }
  public registerOnTouched(fn: () => any): void { this.onTouched = fn; }
  public registerOnValidatorChange(fn: () => void): void { this._validatorChange = fn; }

  public onTouched = () => {};
  /*istanbul ignore next */
  private _onChange = (_: any) => {};
  /*istanbul ignore next */
  private _validatorChange = () => {};

  private updateValue() {
    this.onTouched();
    this._onChange(
      this.selectedFormat.getDateRangeValue(this.selectedFirstDate, this.selectedSecondDate)
    );
    this._validatorChange();
  }
}
