import { SkyFuzzyDate } from './fuzzy-date';

let moment = require('moment');

export class SkyFuzzyDateFactory {

  public getSeparatorFromDateString(dateString: string): string {
    let separator: string;
    let allSeparators = ['/', '.', '-', ' '];

    if (!dateString) { return; }

    allSeparators.forEach(currentSeparator => {
      if (!separator && dateString.indexOf(currentSeparator) > 0) {
        separator = currentSeparator;
    }
    });

    return separator;
  }

  public getYearFromDateString(dateString: string, separator: string): number {
      let year: any;

      if (!dateString) { return; }

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

  public getMomentFromFuzzyDate(fuzzyDate: any): any {
    // Year to use for fuzzy dates that don't have a year.
    let defaultYear: number = new Date().getFullYear();

    if (!fuzzyDate) { return; }

    if (fuzzyDate.month === 2 && fuzzyDate.day === 29) {
      // Needs to be a valid year for leap years.
      defaultYear = this.getMostRecentLeapYear(defaultYear);
    }

    return moment([fuzzyDate.year || defaultYear, (fuzzyDate.month - 1) || 0, fuzzyDate.day || 1]);
  }

  public getDateStringFromFuzzyDate(fuzzyDate: any, dateFormatString: any): string {
    let dateString: string = '';
    let separator: any;

    if (!fuzzyDate || !dateFormatString) { return; }

    dateFormatString = dateFormatString.toLowerCase();

    // Get the components of the date in the order expected of the local format
    let dateComponents = [
        { value: fuzzyDate.year || 0, index: dateFormatString.indexOf('y') },
        { value: fuzzyDate.month || 0, index: dateFormatString.indexOf('m') },
        { value: fuzzyDate.day || 0, index: dateFormatString.indexOf('d') }
    ];
    dateComponents.sort(function (a: any, b: any) { return a.index - b.index; });

    separator = this.getSeparatorFromDateString(dateFormatString);

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
    let fuzzyDate: SkyFuzzyDate = {},
        yearIndex,
        monthIndex,
        dayIndex;

    if (!selectedDate || !dateFormatString) { return; }

    dateFormatString = dateFormatString.toLowerCase();

    // Get the order of year, month, and day in the provided date format
    yearIndex = dateFormatString.indexOf('y');
    monthIndex = dateFormatString.indexOf('m');
    dayIndex = dateFormatString.indexOf('d');

    if (yearIndex > -1) {
      fuzzyDate.year = selectedDate.getFullYear();
    }

    if (dayIndex > -1) {
      fuzzyDate.day = selectedDate.getDate();
    }

    if (monthIndex > -1) {
      // getMonth returns month 0 through 11
      fuzzyDate.month = selectedDate.getMonth() + 1;
    }

    return fuzzyDate;
  }

  public getFuzzyDateFromDateString(dateString: string, dateFormatString: string): any {
    let day,
        month,
        year,
        separator,
        dateComponents,
        yearIndex,
        monthIndex,
        dayIndex,
        dateComponentIndexes = [];

    if (!dateString || !dateFormatString) { return; }

    dateFormatString = dateFormatString.toLowerCase();

    // Get the order of year, month, and day in the provided date format
    yearIndex = dateFormatString.indexOf('y');
    monthIndex = dateFormatString.indexOf('m');
    dayIndex = dateFormatString.indexOf('d');

    // dateComponentIndexes = [yearIndex, monthIndex, dayIndex];

    if (yearIndex > -1) {
      dateComponentIndexes.push(yearIndex);
    }

    if (monthIndex > -1) {
      dateComponentIndexes.push(monthIndex);
    }

    if (dayIndex > -1) {
      dateComponentIndexes.push(dayIndex);
    }

    dateComponentIndexes.sort(function (a, b) { return a - b; });

    yearIndex = dateComponentIndexes.indexOf(yearIndex);
    monthIndex = dateComponentIndexes.indexOf(monthIndex);
    dayIndex = dateComponentIndexes.indexOf(dayIndex);

    // Get the date string's components based on the separator used in the string
    separator = this.getSeparatorFromDateString(dateString);
    dateComponents = dateString.split(separator);

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

  public  getCurrentFuzzyDate() {
    let currentDate = moment();
    return {
        day: currentDate.date(),
        month: currentDate.month() + 1,
        year: currentDate.year()
    };
  }

  public getMostRecentLeapYear(currentYear: number): number {
    if (!currentYear || currentYear < 4) {
      return;
    }

    let leapYear = currentYear;

    while (!this.isLeapYear(leapYear)) {
      leapYear -= 1;
    }

    return leapYear;
  }

  private isLeapYear(year: number): boolean {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }
}
