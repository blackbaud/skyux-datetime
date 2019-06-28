export function getValidMonth(month: number): number {
  if (month === 0) {
    return 1;
  } else if (month > 12) {
    return 12;
  } else {
    return month;
  }
}

export function getValidDay(day: number, month: number, year: number): number {
  if (day === 0) {
    return 1;
  } else if (day) {
    return getValidDayBasedOnMonthAndYear(day, month, year);
  } else {
    return day;
  }
}

function getValidDayBasedOnMonthAndYear(day: number, month: number, year: number): number {
  if (month === 2) {
    /* istanbul ignore else */
    if ((!year || (year && isLeapYear(year))) && day >= 29) {
      return 29;
    } else if (day > 28) {
      return 28;
    }
  } else if ((!month || (month && monthHas31Days(month))) && day >= 31) {
    return 31;
  } else if (day > 30) {
    return 30;
  }
  return day;
}

function monthHas31Days(month: number): boolean {
  return [1, 3, 5, 7, 8, 10, 12].indexOf(month) !== -1;
}

// https://en.wikipedia.org/wiki/Leap_year#Algorithm
function isLeapYear(year: number): boolean {
  return year % 4 === 0 && !(year % 100 === 0 && year % 400 !== 0);
}
