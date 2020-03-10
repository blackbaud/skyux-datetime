import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  Subject
} from 'rxjs';

import {
  SkyFuzzyDate
} from './fuzzy-date';

const moment = require('moment');

interface SkyDateIndexes {
  yearIndex: number;
  monthIndex: number;
  dayIndex: number;
}

interface SkyFuzzyDateRange {
  years: string;
  months: string;
  days: string;
  valid: boolean;
}

export class FuzzyDateFormatInfo {

  public monthPosition: number;
  public dayPosition: number;
  public yearPosition: number;
  public monthMask: string;
  public dayMask: string;
  public yearMask: string;
  public maskElements: string[];
  public shortDateFormat: any;

  constructor() {
    this.maskElements = [];
  }
}

@Injectable()
export class SkyFuzzyDateService implements OnDestroy {

  private currentLocale: string;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private localeProvider: SkyAppLocaleProvider
  ) {
    this.localeProvider.getLocaleInfo()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((localeInfo) => {
        this.currentLocale = localeInfo.locale;
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getCurrentLocale(): string {
    return this.currentLocale;
  }

  public getLocaleShortFormat(): string {
    moment.locale(this.currentLocale);
    return moment.localeData().longDateFormat('LL');
  }

  public format(date: SkyFuzzyDate, format: string, locale: string): string {
    const separator = this.getSeparatorFromDateString(format);
    const _currentDateFormatInfo = this.getFuzzyDateFormatInfo(format, separator);

    if (_currentDateFormatInfo.monthPosition === -1
        || _currentDateFormatInfo.dayPosition === -1
        || _currentDateFormatInfo.yearPosition === -1
    ) {
      return '';
    }

    if (_currentDateFormatInfo.maskElements.length === 0) {
      return '';
    }

    let dateValue: string[] = [];
    // Loop through 0,1,2.
    for (let partNumber: number = 0; (partNumber <= 2); partNumber++) {
      const mask = _currentDateFormatInfo.maskElements[partNumber];
      if (mask) {
        // tslint:disable-next-line: switch-default
        switch (mask.substr(0, 1).toUpperCase()) {
          case 'Y':
            if (date.year > 0) {
              // Support both 2-digit and 4-digit year.
              switch (mask.length) {
                case 2:
                  dateValue.push(date.year.toString().slice(-2));
                  break;
                default:
                  dateValue.push(date.year.toString());
                  break;
              }
            }
            break;
          case 'M':
            if (date.month > 0 && date.month <= 12) {
              switch (mask.length) {
                case 1:
                  dateValue.push(date.month.toString());
                  break;
                case 2:
                  dateValue.push(moment().month(date.month - 1).format('MM'));
                  break;
                case 3:
                  dateValue.push(moment().month(date.month - 1).format('MMM'));
                  break;
                default:
                  dateValue.push(moment().month(date.month - 1).format('MMMM'));
                  break;
              }

            }
            break;
          case 'D':
            if (date.day > 0) {
              dateValue.push(moment().date(date.day).format(mask));
            }

            break;
        }
      }

    }

    return dateValue.join(separator);
  }

  /**
   * If not provided, years will default to current year;
   * months will default to January;
   * days will default to 1st of the month.
   */
  public getMomentFromFuzzyDate(fuzzyDate: SkyFuzzyDate): any {
    if (!fuzzyDate) {
      return;
    }

    const year = fuzzyDate.year || this.getDefaultYear(fuzzyDate);
    const month = fuzzyDate.month > 0 ? (fuzzyDate.month - 1) : 0;
    const day = fuzzyDate.day || 1;

    return moment([year, month, day]);
  }

  public getStringFromFuzzyDate(fuzzyDate: SkyFuzzyDate, dateFormat: string): string {
    if (!fuzzyDate || !dateFormat) {
      return;
    }

    const separator = this.getSeparatorFromDateString(dateFormat);
    const dateFormatIndexes = this.getDateFormatIndexes(dateFormat);
    let dateString: string = '';

    // Get the components of the date in the order expected of the local format.
    let dateComponents = [
      { value: fuzzyDate.year || 0, index: dateFormatIndexes.yearIndex },
      { value: fuzzyDate.month || 0, index: dateFormatIndexes.monthIndex },
      { value: fuzzyDate.day || 0, index: dateFormatIndexes.dayIndex }
    ];
    dateComponents.sort((a: any, b: any) => a.index - b.index);

    dateComponents.forEach(component => {
      if (component.value > 0 && component.index > -1) {
        if (dateString) {
          dateString += separator;
        }
        dateString += component.value.toString();
      }
    });

    return dateString.trim();
  }

  public getFuzzyDateFromSelectedDate(selectedDate: Date, dateFormat: string): SkyFuzzyDate {
    if (!selectedDate || !dateFormat) {
      return;
    }

    let fuzzyDate: SkyFuzzyDate = {};
    const dateFormatIndexes = this.getDateFormatIndexes(dateFormat);

    if (dateFormatIndexes.yearIndex > -1) {
      fuzzyDate.year = selectedDate.getFullYear();
    }

    if (dateFormatIndexes.dayIndex > -1) {
      fuzzyDate.day = selectedDate.getDate();
    }

    if (dateFormatIndexes.monthIndex > -1) {
      fuzzyDate.month = selectedDate.getMonth() + 1; // getMonth() is 0-indexed.
    }

    return fuzzyDate;
  }

  public getFuzzyDateFromString(date: string, dateFormat: string): SkyFuzzyDate {
    if (!date || !dateFormat) {
      return;
    }

    let day: any;
    let month: any;
    let year: any;

    const dateComponents = this.getDateComponents(date);
    const indexes = this.getDateValueIndexes(date, dateFormat);

    // Look at the date string's component count:
    // 3 indicates a full date
    // 2 indicates a month-year or month-day date
    // 1 indicates a year
    // Other indicates a problem
    switch (dateComponents.length) {
    case 3:
      year = dateComponents[indexes.yearIndex];
      month = dateComponents[indexes.monthIndex];
      day = dateComponents[indexes.dayIndex];
      break;
    case 2:
      // First, check for a 4-digit year. If year exists, then we assume the other component
      // is the month. Otherwise, we can assume the input is mm/dd or mm/yy (2-digit year).
      year = this.get4DigitYearFromDateString(date);
      if (year) {
        month = dateComponents[0] === year.toString() ? dateComponents[1] : dateComponents[0];
      } else {
        if (indexes.dayIndex > -1) {
          // mm/dd
          month = (indexes.monthIndex < indexes.dayIndex) ? dateComponents[0] : dateComponents[1];
          day = (month === dateComponents[1]) ? dateComponents[0] : dateComponents[1];
        } else {
          // mm/yy
          month = (indexes.monthIndex < indexes.yearIndex) ? dateComponents[0] : dateComponents[1];
          year = (month === dateComponents[1]) ? dateComponents[0] : dateComponents[1];
        }
      }
      break;
    case 1:
      year = date;
      break;
    default:
      return;
    }

    if (month) {
      // Check if month is valid.
      month = this.getMonthNumber(month);
      if (month === undefined) {
        return;
      }

      // Check if day is valid.
      if (day) {
        day = parseInt(day, 10);
        let fuzzyMoment = this.getMomentFromFuzzyDate({ month: month, day: day, year: year });
        if (isNaN(day) || !fuzzyMoment.isValid()) {
          return;
        }
      }
    }

    if (year) {
      year = year.toString().length === 2 ? moment.parseTwoDigitYear(year) : parseInt(year.toString(), 10);
      if (isNaN(year) || year.toString().length !== 4) {
        return;
      }
    }

    return {
      month: month,
      day: day,
      year: year
    };
  }

  public getFuzzyDateRange(startFuzzyDate: SkyFuzzyDate, endFuzzyDate: SkyFuzzyDate): SkyFuzzyDateRange {
    let start;
    let end;
    let days;
    let months;
    let years;
    let valid = false;

    if (startFuzzyDate && startFuzzyDate.year && endFuzzyDate && endFuzzyDate.year) {
      start = this.getMomentFromFuzzyDate(startFuzzyDate);
      end = this.getMomentFromFuzzyDate(endFuzzyDate);

      years = end.diff(start, 'years');
      months = end.diff(start, 'months');
      days = end.diff(start, 'days');
      valid = end.diff(start) >= 0;
    }

    return {
      years: years,
      months: months,
      days: days,
      valid: valid
    };
  }

  public getCurrentFuzzyDate(): SkyFuzzyDate {
    let currentDate = moment();

    return {
      day: currentDate.date(),
      month: currentDate.month() + 1, // month() is 0-indexed.
      year: currentDate.year()
    };
  }

  private getMostRecentLeapYear(): number {
    let leapYear = new Date().getFullYear();

    while (!this.isLeapYear(leapYear)) {
      leapYear -= 1;
    }

    return leapYear;
  }

  private getSeparatorFromDateString(date: string): string {
    let separator: string;
    let allSeparators = ['/', '.', '-', ' '];

    allSeparators.forEach(currentSeparator => {
      if (!separator && date.indexOf(currentSeparator) > 0) {
        separator = currentSeparator;
      }
    });

    return separator;
  }

  private get4DigitYearFromDateString(date: string): number {
    let year: string;
    const separator = this.getSeparatorFromDateString(date);

    // Find the number value in the string that is 4 digits long.
    date.split(separator).forEach(dateComponent => {
      if (!year && parseInt(dateComponent, 10).toString().length === 4) {
        year = dateComponent;
      }
    });

    if (year && !isNaN(Number(year))) {
      return parseInt(year, 10);
    }
  }

  private isLeapYear(year: number): boolean {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }

  private getMonthNumber(month: string): number {
    let returnValue: number;
    const monthAsNumber = parseInt(month, 10);

    // If the month component is a string ("Janaury"), we check to see if it is a valid month
    if (isNaN(monthAsNumber)) {
      if (!moment(month, 'MMMM').isValid()) {
        return;
      }
      returnValue = parseInt(moment().month(month).format('M'), 10);
    } else {
      returnValue = monthAsNumber;
    }

    // Ensure that the month is between 1 and 12
    if (!(1 <= returnValue && returnValue <= 12)) {
      return;
    }

    return returnValue;
  }

  private getDefaultYear(fuzzyDate: SkyFuzzyDate): number {
    // Check if we need to return a leap year or the current year.
    if (fuzzyDate.month === 2 && fuzzyDate.day === 29) {
      return this.getMostRecentLeapYear();
    } else {
      return new Date().getFullYear();
    }
  }

  private getDateComponents(date: string): string[] {
    const separator = this.getSeparatorFromDateString(date);
    return date.split(separator);
  }

  // Returns the order of year, month, and day from the provided date format.
  private getDateFormatIndexes(dateFormat: string): SkyDateIndexes {
    dateFormat = dateFormat.toLowerCase();
    return {
      yearIndex: dateFormat.indexOf('y'),
      monthIndex: dateFormat.indexOf('m'),
      dayIndex: dateFormat.indexOf('d')
    };
  }

  // Returns the index of each of the date components in the provided string (month, day, year).
  private getDateValueIndexes(date: string, dateFormat: string): SkyDateIndexes {
    const dateFormatIndexes = this.getDateFormatIndexes(dateFormat);
    let dateComponentIndexes = [];
    if (dateFormatIndexes.yearIndex > -1) {
      dateComponentIndexes.push(dateFormatIndexes.yearIndex);
    }

    if (dateFormatIndexes.monthIndex > -1) {
      dateComponentIndexes.push(dateFormatIndexes.monthIndex);
    }

    if (dateFormatIndexes.dayIndex > -1) {
      dateComponentIndexes.push(dateFormatIndexes.dayIndex);
    }

    dateComponentIndexes.sort(function (a, b) { return a - b; });

    return {
      yearIndex: dateComponentIndexes.indexOf(dateFormatIndexes.yearIndex),
      monthIndex: dateComponentIndexes.indexOf(dateFormatIndexes.monthIndex),
      dayIndex: dateComponentIndexes.indexOf(dateFormatIndexes.dayIndex)
    };
  }

  private getFuzzyDateFormatInfo(format: string, separator: string): FuzzyDateFormatInfo {
    let dateInfo: FuzzyDateFormatInfo = new FuzzyDateFormatInfo();
    let dateParts: string[] = format.split(separator);
    let maskPosition: number = 0;
    let definedparts: {
      [key: string]: string
     } = {};

    for (let i = 0; i < dateParts.length; i++) {
      const datePart = dateParts[i];
      // tslint:disable-next-line: switch-default
      switch (datePart.toLowerCase()) {
        case 'm':
        case 'mm':
        case 'mmm':
        case 'mmmm':
          if (!definedparts.hasOwnProperty('M')) {
            dateInfo.monthMask = datePart;
            dateInfo.monthPosition = maskPosition + 1;
            dateInfo.maskElements[maskPosition] = datePart;
            definedparts['M'] = datePart;
            maskPosition++;
          }

          break;
        case 'd':
        case 'dd':
          if (!definedparts['D']) {
            dateInfo.dayMask = datePart;
            dateInfo.dayPosition = maskPosition + 1;
            dateInfo.maskElements[maskPosition] = datePart;
            definedparts['D'] = datePart;
            maskPosition++;
          }

          break;
        case 'y':
        case 'yy':
        case 'yyy':
        case 'yyyy':
          if (!definedparts['Y']) {
            dateInfo.yearMask = datePart;
            dateInfo.yearPosition = maskPosition + 1;
            dateInfo.maskElements[maskPosition] = datePart;
            definedparts['Y'] = datePart;
            maskPosition++;
          }

          break;
      }
    }

    dateInfo.shortDateFormat = dateInfo.maskElements.join(separator);
    return dateInfo;
  }
}
