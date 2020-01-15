// This class is mostly ported from the Angular 4.x DatePipe in order to maintain the old
// behavior of using the `Intl` API for formatting dates rather than having to register every
// supported locale.
// https://github.com/angular/angular/blob/4.4.x/packages/common/src/pipes/date_pipe.ts

import {
  SkyIntlDateFormatter
} from '@skyux/i18n/modules/i18n/intl-date-formatter';
import { SkyFuzzyDate } from '../datepicker/fuzzy-date';

const ISO8601_DATE_REGEX =
    /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
//    1        2       3         4          5          6          7          8  9     10      11

function isNumeric(value: any): boolean {
  return !isNaN(value - parseFloat(value));
}

export class SkyDateFormatUtility {

  private static _ALIASES: {[key: string]: string} = {
    'medium': 'yMMMdjms',
    'short': 'yMdjm',
    'fullDate': 'yMMMMEEEEd',
    'longDate': 'yMMMMd',
    'mediumDate': 'yMMMd',
    'shortDate': 'yMd',
    'mediumTime': 'jms',
    'shortTime': 'jm'
  };

  /* istanbul ignore next */
  constructor() { }

  public static format(
    locale: string,
    value: any,
    pattern: string
  ): string | null {

    let date: Date;

    if (isBlank(value) || value !== value) {
      return undefined;
    }

    if (typeof value === 'string') {
      value = value.trim();
    }

    if (isDate(value)) {
      date = value;
    } else if (isNumeric(value)) {
      date = new Date(parseFloat(value));
    } else if (typeof value === 'string' && /^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
      /*
      For ISO Strings without time the day, month and year must be extracted from the ISO String
      before Date creation to avoid time offset and errors in the new Date.
      If we only replace '-' with ',' in the ISO String ("2015,01,01"), and try to create a new
      date, some browsers (e.g. IE 9) will throw an invalid Date error
      If we leave the '-' ("2015-01-01") and try to create a new Date("2015-01-01") the timeoffset
      is applied
      Note: ISO months are 0 for January, 1 for February, ...
      */
      const [y, m, d] = value.split('-').map((val: string) => parseInt(val, 10));
      date = new Date(y, m - 1, d);
    } else {
      date = new Date(value);
    }

    if (!isDate(date)) {
      let match: RegExpMatchArray|null;
      /* istanbul ignore next */
      /* tslint:disable-next-line:no-conditional-assignment */
      if ((typeof value === 'string') && (match = value.match(ISO8601_DATE_REGEX))) {
        date = isoStringToDate(match);
      } else {
        throw new Error('Invalid value: ' + value);
      }
    }

    return SkyIntlDateFormatter.format(
      date,
      locale,
      SkyDateFormatUtility._ALIASES[pattern] || pattern
    );
  }

  public static formatFuzzyDate(
    locale: string,
    value: SkyFuzzyDate,
    pattern: string
  ): string | null {

    // TODO: Validation?

    const date = getDateFromFuzzyDate(value);
    const fuzzyDateFormat = getFuzzyDateFormat(pattern, value);

    return SkyIntlDateFormatter.format(
      date,
      locale,
      fuzzyDateFormat
    );
  }
}

function isBlank(obj: any): boolean {
  return !obj;
}

function isDate(obj: any): obj is Date {
  return obj instanceof Date && !isNaN(obj.valueOf());
}

/* istanbul ignore next */
function isoStringToDate(match: RegExpMatchArray): Date {
  const date = new Date(0);
  let tzHour = 0;
  let tzMin = 0;
  const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
  const timeSetter = match[8] ? date.setUTCHours : date.setHours;

  if (match[9]) {
    tzHour = toInt(match[9] + match[10]);
    tzMin = toInt(match[9] + match[11]);
  }
  dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
  const h = toInt(match[4] || '0') - tzHour;
  const m = toInt(match[5] || '0') - tzMin;
  const s = toInt(match[6] || '0');
  const ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
  timeSetter.call(date, h, m, s, ms);
  return date;
}

/* istanbul ignore next */
function toInt(str: string): number {
  return parseInt(str, 10);
}

/**
 * Filters out any date components that aren't a part of the provided fuzzyDate.
 * For example, a fuzzy date of month/year wouldn't need a day component.
 */
function getFuzzyDateFormat(dateFormat: string, fuzzyDate: SkyFuzzyDate): string {
  if (!fuzzyDate.day || fuzzyDate.day === 0) {
    dateFormat = dateFormat.replace(/D+(\/| |\.|-|, )?/gi, '');
  }

  if (!fuzzyDate.month || fuzzyDate.month === 0) {
    dateFormat = dateFormat.replace(/M+(\/| |\.|-|, )?/gi, '');
  }

  if (!fuzzyDate.year || fuzzyDate.year === 0) {
    dateFormat = dateFormat.replace(/Y+(\/| |\.|-|, )?/gi, '');
  }

  // Remove components that wouldn't make sense with a fuzzy date (hrs, min, sec, etc...)
  dateFormat = dateFormat.replace(/G|j|h|H|m|s|Z|a/g, '');

  return dateFormat;
}

/**
 * If not provided, years will default to current year;
 * months will default to January;
 * days will default to 1st of the month.
 */
function getDateFromFuzzyDate(fuzzyDate: SkyFuzzyDate): Date {
  if (!fuzzyDate) {
    return;
  }

  const year = fuzzyDate.year || getDefaultYear(fuzzyDate);
  const month = fuzzyDate.month - 1 || 0;
  const day = fuzzyDate.day || 1;

  return new Date(year, month, day);
}

function getDefaultYear(fuzzyDate: SkyFuzzyDate): number {
  // Check if we need to return a leap year or the current year.
  if (fuzzyDate.month === 2 && fuzzyDate.day === 29) {
    return getMostRecentLeapYear();
  } else {
    return new Date().getFullYear();
  }
}

function getMostRecentLeapYear(): number {
  let leapYear = new Date().getFullYear();

  while (!isLeapYear(leapYear)) {
    leapYear -= 1;
  }

  return leapYear;
}

function isLeapYear(year: number): boolean {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}
