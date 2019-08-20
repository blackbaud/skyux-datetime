import { Injectable } from '@angular/core';
import { SkyFuzzyDate } from './fuzzy-date';

const moment = require('moment');

@Injectable()
export class SkyFuzzyDateService {

  public getMomentFromFuzzyDate(fuzzyDate: any): any {
    if (!fuzzyDate) { return; }

    // Year to use for fuzzy dates that don't have a year.
    let defaultYear: number;

    if (fuzzyDate.month === 2 && fuzzyDate.day === 29) {
      // Needs to be a valid leap year
      defaultYear = this.getMostRecentLeapYear();
    } else {
      defaultYear = new Date().getFullYear();
    }

    return moment([fuzzyDate.year || defaultYear, (fuzzyDate.month - 1) || 0, fuzzyDate.day || 1]);
  }

  public getDateStringFromFuzzyDate(fuzzyDate: any, dateFormatString: any): string {
    if (!fuzzyDate || !dateFormatString) { return; }

    let dateString: string = '',
        separator = this.getSeparatorFromDateString(dateFormatString),
        dateFormatIndexes = this.getDateFormatIndexes(dateFormatString);

    // Get the components of the date in the order expected of the local format
    let dateComponents = [
        { value: fuzzyDate.year || 0, index: dateFormatIndexes.yearIndex },
        { value: fuzzyDate.month || 0, index: dateFormatIndexes.monthIndex },
        { value: fuzzyDate.day || 0, index: dateFormatIndexes.dayIndex }
    ];
    dateComponents.sort(function (a: any, b: any) { return a.index - b.index; });

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

  public getFuzzyDateFromSelectedDate(selectedDate: Date, dateFormatString: string): any {
    if (!selectedDate || !dateFormatString) { return; }

    let fuzzyDate: SkyFuzzyDate = {},
        dateFormatIndexes = this.getDateFormatIndexes(dateFormatString);

    if (dateFormatIndexes.yearIndex > -1) {
      fuzzyDate.year = selectedDate.getFullYear();
    }

    if (dateFormatIndexes.dayIndex > -1) {
      fuzzyDate.day = selectedDate.getDate();
    }

    if (dateFormatIndexes.monthIndex > -1) {
      // getMonth returns month 0 through 11
      fuzzyDate.month = selectedDate.getMonth() + 1;
    }

    return fuzzyDate;
  }

  public getFuzzyDateFromDateString(dateString: string, dateFormatString: string): any {
    if (!dateString || !dateFormatString) { return; }

    let day: any,
        month: any,
        year: any,
        dateFormatIndexes = this.getDateFormatIndexes(dateFormatString),
        dateComponentIndexes = [],
        yearIndex: number,
        monthIndex: number,
        dayIndex: number;

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

    yearIndex = dateComponentIndexes.indexOf(dateFormatIndexes.yearIndex);
    monthIndex = dateComponentIndexes.indexOf(dateFormatIndexes.monthIndex);
    dayIndex = dateComponentIndexes.indexOf(dateFormatIndexes.dayIndex);

    // Get the date string's components based on the separator used in the string
    let separator = this.getSeparatorFromDateString(dateString);
    let dateComponents = dateString.split(separator);

    // Look at the date string's component count
    // 3 indicates a full date
    // 2 indicates a month-year or month-day date
    // 1 indicates a year
    // Other indicates a problem
    switch (dateComponents.length) {
    case 3:
        year = dateComponents[yearIndex];
        month = dateComponents[monthIndex];
        day = dateComponents[dayIndex];
        break;
    case 2:
        year = this.getYearFromDateString(dateString, separator);

        // If a year exists in the date string, then the other component must be the month
        // Else, the  components have to be a month and a day

        if (year) {
          month = dateComponents[0] === year.toString() ? dateComponents[1] : dateComponents[0];
        } else {
          if (dayIndex > -1) {
            // mm/dd
            month = (monthIndex < dayIndex) ? dateComponents[0] : dateComponents[1];
            day = (month === dateComponents[1]) ? dateComponents[0] : dateComponents[1];
          } else {
            // mm/yy
            month = (monthIndex < yearIndex) ? dateComponents[0] : dateComponents[1];
            year = (month === dateComponents[1]) ? dateComponents[0] : dateComponents[1];
          }
        }

        break;
    case 1:
        year = dateString;
        break;
    default:
        return;
    }

    if (month) {
        // If the month component is a string ("Janaury"), we check to see if it is a valid month
        if (isNaN(parseInt(month, 10))) {
            month = moment.localeData().monthsParse(month);

            if (month === undefined) { return; }
            month += 1;
        } else {
            month = parseInt(month, 10);
        }

        // Ensure that the month is between 1 and 12
        if (!(1 <= month && month <= 12)) { return; }

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
        // If the year we got is not an integer, then we don't accept it
        if (isNaN(year) || year.toString().length !== 4) { return; }
    }

    return {
        day: day,
        month: month,
        year: year
    };
  }

  public getFuzzyDateRange(startFuzzyDate: any, endFuzzyDate: any) {
    let start,
        end,
        days,
        months,
        years,
        valid = false;

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

  public getCurrentFuzzyDate() {
    let currentDate = moment();

    return {
        day: currentDate.date(),
        month: currentDate.month() + 1,
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

  private getSeparatorFromDateString(dateString: string): string {
    let separator: string;
    let allSeparators = ['/', '.', '-', ' '];

    allSeparators.forEach(currentSeparator => {
      if (!separator && dateString.indexOf(currentSeparator) > 0) {
        separator = currentSeparator;
    }
    });

    return separator;
  }

  private getYearFromDateString(dateString: string, separator: string): number {
    let year: any;

    // Find the number value in the string that is 4 digits long.
    dateString.split(separator).forEach(dateComponent => {
      if (!year && parseInt(dateComponent, 10).toString().length === 4) {
        year = dateComponent;
      }
    });

    if (year && !isNaN(year)) {
        return parseInt(year, 10);
    }
  }

  private getDateFormatIndexes(dateFormatString: string) {
    dateFormatString = dateFormatString.toLowerCase();

    // Get the order of year, month, and day in the provided date format
    return {
      yearIndex: dateFormatString.indexOf('y'),
      monthIndex: dateFormatString.indexOf('m'),
      dayIndex: dateFormatString.indexOf('d')
    };
  }

  private isLeapYear(year: number): boolean {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }
}
