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

import { getLocaleDateFormat, FormatWidth } from '@angular/common';

@Pipe({
  name: 'skyFuzzyDate',
  pure: false
})
export class SkyFuzzyDatePipe implements OnDestroy, PipeTransform {

  // TODO: figure out how to format by default. Should I use service.getStringFromFuzzyDate?
  private defaultFormat: string = 'mm/yy';

  private defaultLocale: string = 'en-US';

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private localeProvider: SkyAppLocaleProvider
  ) {
    // Default to the current locale's Medium format.
    // This will help to differentiate between month/day and month/year
    // See more: https://angular.io/api/common/FormatWidth
    this.defaultFormat = getLocaleDateFormat('en-US', FormatWidth.Medium);
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
    format?: string,
    locale?: string
  ): string {
    const dateLocale = locale || this.defaultLocale;
    const dateFormat = format || this.defaultFormat;

    return SkyDateFormatUtility.formatFuzzyDate(dateLocale, value, dateFormat);
  }
}
