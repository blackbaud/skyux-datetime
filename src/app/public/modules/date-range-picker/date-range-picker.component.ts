import {
  Component,
  Input,
  forwardRef
} from '@angular/core';

import {
  ControlValueAccessor, NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
  SkyDateRangeDefaultValues
} from './types/date-range-default-values';
import { SkyDateRangeFormat } from './types';

@Component({
  selector: 'sky-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => SkyDateRangePickerComponent),
      multi: true
    }
  ]
})
export class SkyDateRangePickerComponent implements ControlValueAccessor {
  @Input()
  public label: string;

  @Input()
  public disabled = false;

  public dateRangeFormats = SkyDateRangeDefaultValues.DEFAULT_VALUES;

  public set selectedFormat(value: SkyDateRangeFormat) {
    if (this.selectedFormat !== value) {
      this._selectedFormat = value;
      this._onTouched();
      this._onChange(
        this.selectedFormat.getDateRangeValue(this.selectedFirstDate, this.selectedSecondDate)
      );
    }
  }
  public get selectedFormat(): SkyDateRangeFormat {
    return this._selectedFormat;
  }

  public set selectedFirstDate(value: Date) {
    if (this._selectedFirstDate !== value) {
      this._selectedFirstDate = value;
      this._onTouched();
      this._onChange(
        this.selectedFormat.getDateRangeValue(this.selectedFirstDate, this.selectedSecondDate)
      );
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

  private _selectedFirstDate: Date;
  private _selectedSecondDate: Date;
  private _selectedFormat = this.dateRangeFormats[0];

  public writeValue(obj: any): void {
    if (!obj) {
      obj = {};
    }

    if (this.selectedFirstDate !== obj.startDate || this.selectedSecondDate !== obj.endDate) {
      this._selectedFirstDate = obj.startDate;
      this._selectedSecondDate = obj.startDate;
      this.updateValue();
    }
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn; }

  private updateValue() {
    this._onTouched();
    this._onChange(
      this.selectedFormat.getDateRangeValue(this.selectedFirstDate, this.selectedSecondDate)
    );
  }

  /*istanbul ignore next */
  private _onChange = (_: any) => {};
  /*istanbul ignore next */
  private _onTouched = () => {};
}
