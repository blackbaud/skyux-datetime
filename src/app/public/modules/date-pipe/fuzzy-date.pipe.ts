import {
  OnDestroy,
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  SkyIntlDateFormatter
} from '@skyux/i18n/modules/i18n/intl-date-formatter';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

import {
  SkyFuzzyDate
} from '../datepicker/fuzzy-date';

import {
  SkyFuzzyDateService
} from '../datepicker/fuzzy-date.service';

@Pipe({
  name: 'skyFuzzyDate',
  pure: false
})
export class SkyFuzzyDatePipe implements OnDestroy, PipeTransform {

  private defaultLocale: string = 'en-US';

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private fuzzyDateService: SkyFuzzyDateService,
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
    if (!value) {
      return undefined;
    }

    if (!format || format.length === 0) {
      console.error('You must provide a format when using the skyFuzzyDate pipe.');
      return;
    }

    const dateLocale = locale || this.defaultLocale;
    const date = this.fuzzyDateService.getDateFromFuzzyDate(value);

    return SkyIntlDateFormatter.format(
      date,
      dateLocale,
      format
    );
  }
}
