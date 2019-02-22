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

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

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

  private get locale(): string {
    return this._locale;
  }

  private set locale(value: string) {
    if (value && value !== this._locale) {
      this._locale = value;

      // Create a new pipe when the locale changes.
      this.ngDatePipe = new DatePipe(this.locale);
    }
  }

  private defaultLocale = 'en-US';
  private ngDatePipe: DatePipe;
  private transformStream = new BehaviorSubject<string>('');
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
        this.notifyTransform();
      });
  }

  public transform(
    value: Date,
    format?: string,
    locale?: string
  ): BehaviorSubject<string> {
    this.value = value;
    this.format = format;
    this.locale = locale;

    this.notifyTransform();

    return this.transformStream;
  }

  private notifyTransform(): void {
    if (this.value) {
      this.transformStream.next(
        this.ngDatePipe.transform(this.value, this.format)
      );
    }
  }
}
