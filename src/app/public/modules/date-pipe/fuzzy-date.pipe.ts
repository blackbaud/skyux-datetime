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

const moment = require('moment');

@Pipe({
  name: 'skyFuzzyDate',
  pure: false
})
export class SkyFuzzyDatePipe implements OnDestroy, PipeTransform {

  private formatAliases: {[key: string]: string} = {
    'medium': 'MMM d, y, h:mm:ss a',
    'short': 'M/d/yy, h:mm a',
    'fullDate': 'EEEE, MMMM d, y',
    'longDate': 'MMMM d, y',
    'mediumDate': 'MMM d, y',
    'shortDate': 'M/d/yy',
    'mediumTime': 'h:mm:ss a',
    'shortTime': 'h:mm a'
  };

  private defaultFormat: any;

  private defaultLocale: any;

  private set format(value: string) {
    this._format = this.formatAliases[value] || value;
  }

  private get format(): string {
    return this._format;
  }

  private formattedValue: string;

  private locale: string;

  private value: SkyFuzzyDate;

  private ngUnsubscribe = new Subject<void>();

  private _format: string;

  constructor(
    private localeProvider: SkyAppLocaleProvider
  ) {
    // TODO: Make sure this is gettling the legit locale data.
    this.defaultLocale = moment.localeData();
    this.defaultFormat = 'short';

    this.localeProvider.getLocaleInfo()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
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

    this.value = value;
    this.format = format;
    this.locale = locale;

    this.formattedValue = SkyDateFormatUtility.format(locale, this.getDateFromFuzzyDate(value), format);

    return this.formattedValue;
  }

  /**
   * If not provided, years will default to current year;
   * months will default to January;
   * days will default to 1st of the month.
   */
  private getDateFromFuzzyDate(fuzzyDate: SkyFuzzyDate): any {
    if (!fuzzyDate) {
      return;
    }

    const year = fuzzyDate.year || this.getDefaultYear(fuzzyDate);
    const month = fuzzyDate.month - 1 || 0;
    const day = fuzzyDate.day || 1;

    return moment([year, month, day]);
  }

  private getDefaultYear(fuzzyDate: SkyFuzzyDate): number {
    // Check if we need to return a leap year or the current year.
    if (fuzzyDate.month === 2 && fuzzyDate.day === 29) {
      return this.getMostRecentLeapYear();
    } else {
      return new Date().getFullYear();
    }
  }

  private getMostRecentLeapYear(): number {
    let leapYear = new Date().getFullYear();

    while (!this.isLeapYear(leapYear)) {
      leapYear -= 1;
    }

    return leapYear;
  }

  private isLeapYear(year: number): boolean {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }
}
