import {
  OnDestroy,
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

import {
  SkyFuzzyDate
} from '../datepicker/fuzzy-date';

import {
  SkyDateFormatUtility
} from './date-format-utility';

@Pipe({
  name: 'skyFuzzyDate',
  pure: false
})
export class SkyFuzzyDatePipe implements OnDestroy, PipeTransform {

  private defaultLocale: string = 'en-US';

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private localeProvider: SkyAppLocaleProvider
  ) {
    this.localeProvider.getLocaleInfo()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((localeInfo) => {
        this.defaultLocale = localeInfo.locale;
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public transform(
    value: SkyFuzzyDate,
    format: string,
    locale?: string
  ): string {
    if (!format || format.length === 0) {
      console.error('You must provide a format when using the skyFuzzyDate pipe.');
      return;
    }

    const dateLocale = locale || this.defaultLocale;

    return SkyDateFormatUtility.formatFuzzyDate(dateLocale, value, format);
  }
}
