import {
  DatePipe
} from '@angular/common';

import {
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

@Pipe({
  name: 'skyDate',
  pure: false
})
export class SkyDatePipe implements PipeTransform {
  private get format(): string {
    return this._format || 'short';
  }

  private set format(value: string) {
    if (value && value !== this._format) {
      this._format = value;
    }
  }

  private set locale(value: string) {
    if (value && value !== this._locale) {
      this._locale = value;

      // Create a new pipe when the locale changes.
      this.ngDatePipe = new DatePipe(this._locale);
    }
  }

  private defaultLocale = 'en-US';
  private formattedValue: string;
  private ngDatePipe: DatePipe;
  private value: Date;

  private _format: string;
  private _locale: string;

  constructor(
    private localeProvider: SkyAppLocaleProvider
  ) {
    this.locale = this.defaultLocale;

    this.localeProvider.getLocaleInfo()
      .subscribe((localeInfo) => {
        this.locale = localeInfo.locale;
        this.updateFormattedValue();
      });
  }

  public transform(
    value: Date,
    format?: string,
    locale?: string
  ): string {
    this.value = value;
    this.format = format;
    this.locale = locale;

    this.updateFormattedValue();

    return this.formattedValue;
  }

  private updateFormattedValue(): void {
    if (this.value) {
      this.formattedValue = this.ngDatePipe.transform(this.value, this.format);
    }
  }
}
