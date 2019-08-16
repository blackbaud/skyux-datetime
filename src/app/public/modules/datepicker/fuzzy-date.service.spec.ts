import { TestBed } from '@angular/core/testing';

import { expect } from '@skyux-sdk/testing';
import { SkyAppTestModule } from '@skyux-sdk/builder/runtime/testing/browser';
import { SkyFuzzyDateService } from './fuzzy-date.service';

import { SkyFuzzyDate } from './fuzzy-date';

let moment = require('moment');

describe('SkyFuzzyDateservice', () => {
  let service: SkyFuzzyDateService;
    let defaultDateFormat = 'mm/dd/yyyy';

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          SkyAppTestModule
        ],
        providers: [
          SkyFuzzyDateService
        ]
      });

      service = TestBed.get(SkyFuzzyDateService);
    });

  describe('getSeparatorFromDateString', () => {
    it('should find the expected date string separators',
      function() {
        let separator = service.getSeparatorFromDateString('5/12/2017');
        expect(separator).toEqual('/');

        separator = service.getSeparatorFromDateString('5.12.2017');
        expect(separator).toEqual('.');

        separator = service.getSeparatorFromDateString('5-12-2017');
        expect(separator).toEqual('-');

        separator = service.getSeparatorFromDateString('5 12 2017');
        expect(separator).toEqual(' ');
      });

      it('should return undefined for an undefined or empty date string',
      function() {
        let separator = service.getSeparatorFromDateString(undefined);
        expect(separator).toBeUndefined();

        separator = service.getSeparatorFromDateString('');
        expect(separator).toBeUndefined();
      });
  });

  describe('getYearFromDateString', () => {
    it('should properly return the year from a date string',
      function() {
        let year = service.getYearFromDateString('5/12/2017', '/');
        expect(year).toEqual(2017);

        year = service.getYearFromDateString('2015/5/12', '/');
        expect(year).toEqual(2015);
      });

    it('should return an undefined year from a date string with a 2-digit year',
      function() {
        let year = service.getYearFromDateString('5/12/17', '/');
        expect(year).toBeUndefined();
      });

    it('should return an undefined year from an undefined or empty date string',
      function() {
        let year = service.getYearFromDateString(undefined, '/');
        expect(year).toBeUndefined();

        year = service.getYearFromDateString('', '/');
        expect(year).toBeUndefined();
      });
  });

  describe('getFuzzyDateFromSelectedDate', () => {

    it('returns a fuzzy date object when provided a date object and the default date format', function() {
      let expectedMonth = 5,
          expectedDay = 12,
          expectedYear = 2017,
          selectedDate = new Date('5/12/2017');

          let fuzzyDate = service.getFuzzyDateFromSelectedDate(selectedDate, defaultDateFormat);

          expect(fuzzyDate).toEqual({ year: expectedYear, month: expectedMonth, day: expectedDay });
    });

    it('returns a fuzzy date object when provided a date object and a date format excluding year', function() {
      let expectedMonth = 5,
          expectedDay = 12,
          selectedDate = new Date('5/12/2017');

          let fuzzyDate = service.getFuzzyDateFromSelectedDate(selectedDate, 'mm/dd');

          expect(fuzzyDate).toEqual({ month: expectedMonth, day: expectedDay });
    });

    it('returns a fuzzy date object when provided a date object and a date format excluding day', function() {
      let expectedMonth = 5,
          expectedYear = 2017,
          selectedDate = new Date('5/12/2017');

          let fuzzyDate = service.getFuzzyDateFromSelectedDate(selectedDate, 'mm/yyyy');

          expect(fuzzyDate).toEqual({ year: expectedYear, month: expectedMonth });
    });

    it('returns a fuzzy date object when provided a date object and a date format excluding month', function() {
      // Unlikely scenario, though including to reach 100% coverage
      let expectedDay = 12,
          expectedYear = 2017,
          selectedDate = new Date('5/12/2017');

          let fuzzyDate = service.getFuzzyDateFromSelectedDate(selectedDate, 'dd/yyyy');

          expect(fuzzyDate).toEqual({ year: expectedYear, day: expectedDay });
    });

    it('returns an undefined fuzzy date object when provided an undefined date object', function() {
          let fuzzyDate = service.getFuzzyDateFromSelectedDate(undefined, defaultDateFormat);

          expect(fuzzyDate).toBeUndefined();
    });

    it('returns an undefined fuzzy date object when provided an undefined date format', function() {
      let expectedMonth = 5,
          expectedDay = 12,
          expectedYear = 2017,
          selectedDate = new Date(expectedYear, expectedMonth, expectedDay);

          let fuzzyDate = service.getFuzzyDateFromSelectedDate(selectedDate, undefined);

          expect(fuzzyDate).toBeUndefined();
    });
  });

  describe('getFuzzyDateFromDateString', () => {
    it('returns a fuzzy date object when provided with a valid full date string.', function () {
      // arrange
      let expected = { month: 1, day: 29, year: 1990 },
          stringDate = service.getDateStringFromFuzzyDate(expected, defaultDateFormat),
          actual;

      // act
      actual = service.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid full date string with non-US date format.', function () {
      // arrange
      let expected = { month: 1, day: 29, year: 1990 },
          dateFormat = 'dd/mm/yyyy',
          stringDate = service.getDateStringFromFuzzyDate(expected, dateFormat),
          actual;

      // act
      actual = service.getFuzzyDateFromDateString(stringDate, dateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid month year date string.', function () {
        // arrange
        let expected: SkyFuzzyDate = { day: undefined, month: 1, year: 1989 },
            stringDate = service.getDateStringFromFuzzyDate(expected, defaultDateFormat),
            actual;

        // act
        actual = service.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid month year date string with non-US date format.', function () {
        // arrange
        let expected: SkyFuzzyDate = { day: undefined, month: 1, year: 1990 },
            dateFormat = 'dd/mm/yyyy',
            stringDate = service.getDateStringFromFuzzyDate(expected, dateFormat),
            actual;

        // act
        actual = service.getFuzzyDateFromDateString(stringDate, dateFormat);

        // assert
        expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid month year date string with a 2 digit year dateformat.', function () {
      // arrange
      let expected: SkyFuzzyDate = { day: undefined, month: 1, year: 1989 },
          dateFormat = 'mm/yy',
          stringDate = '1/89',
          actual;

      // act
      actual = service.getFuzzyDateFromDateString(stringDate, dateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid day month date string.', function () {
        // arrange
        let expected: SkyFuzzyDate = { year: undefined, month: 2, day: 12 },
            stringDate = service.getDateStringFromFuzzyDate(expected, defaultDateFormat),
            actual;

        // act
        actual = service.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid date using words such as "January".', function () {
        // arrange
        let expected: SkyFuzzyDate = { year: undefined, month: 11, day: 18 },
            stringDate = 'November 18',
            actual;

        // act
        actual = service.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toEqual(expected);
    });

    it('returns null if the date provided is not valid.', function () {
        // arrange
        let stringDate = 'fsfsafd',
            actual;

        // act
        actual = service.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toBeUndefined();
    });

    it('returns a fuzzy date object when provided with a valid leap year date string.', function () {
        // arrange
        let expected = { month: 2, day: 29, year: 2000 },
            stringDate = service.getDateStringFromFuzzyDate(expected, defaultDateFormat),
            actual;

        // act
        actual = service.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object if 2/29 is provided excluding year.', function () {
      // arrange
      let expectedFuzzyDate: SkyFuzzyDate = { month: 2, day: 29, year: undefined };
      let stringDate = service.getDateStringFromFuzzyDate(expectedFuzzyDate, defaultDateFormat),
          actual;

      // act
      actual = service.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toEqual(expectedFuzzyDate);
  });

    it('returns null if 2/29 is provided as a full date including a non-leap-year.', function () {
        // arrange
        let stringDate = service.getDateStringFromFuzzyDate({ month: 2, day: 29, year: 2001 }, defaultDateFormat),
            actual;

        // act
        actual = service.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toBeUndefined();
    });

    it('returns null if the date provided has more than 3 date components.', function () {
        // arrange
        let stringDate = '01/02/2003/4',
            actual;

        // act
        actual = service.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toBeUndefined();
    });

    it('returns a fuzzy date object if the date provided includes a string month.', function () {
      // arrange
      let stringDate = 'January 1 2003',
          actual;

      moment.locale('en');

      // act
      actual = service.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toEqual({ month: 1, day: 1, year: 2003 });
    });

    it('returns null if the date provided includes an invalid string month.', function () {
      // arrange
      let stringDate = 'FakeMonth 1 2003',
          actual;

      moment.locale('en');

      // act
      actual = service.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toBeUndefined();
    });
  });

  describe('getDateStringFromFuzzyDate', function () {
    it('returns a valid date string based on the provided fuzzy date', function () {
        // arrange
        let fuzzyDate: SkyFuzzyDate = { month: 2, day: 14, year: 1960 },
            expected = fuzzyDate.month + '/' + fuzzyDate.day + '/' + fuzzyDate.year,
            actual;

        // act
        actual = service.getDateStringFromFuzzyDate(fuzzyDate, 'mm/dd/yyyy');

        // assert
        expect(actual).toBe(expected);
    });

    it('returns a valid month year date string based on the provided month year fuzzy date', function () {
        // arrange
        let fuzzyDate: SkyFuzzyDate = { month: 2, year: 1960 },
            expected = fuzzyDate.month + '/' + fuzzyDate.year,
            actual;

        // act
        actual = service.getDateStringFromFuzzyDate(fuzzyDate, 'mm/dd/yyyy');

        // assert
        expect(actual).toBe(expected);
    });

    it('returns a valid month day date string based on the provided month day fuzzy date', function () {
        // arrange
        let fuzzyDate: SkyFuzzyDate = { month: 2, day: 14 },
            expected = fuzzyDate.month + '/' + fuzzyDate.day,
            actual;

        // act
        actual = service.getDateStringFromFuzzyDate(fuzzyDate, 'mm/dd/yyyy');

        // assert
        expect(actual).toBe(expected);
    });

    it('returns a valid year date string based on the provided year fuzzy date', function () {
        // arrange
        let fuzzyDate: SkyFuzzyDate = { year: 1985 },
            expected = fuzzyDate.year,
            actual;

        // act
        actual = service.getDateStringFromFuzzyDate(fuzzyDate, 'mm/dd/yyyy');

        // assert
        expect(actual).toBe(expected.toString());
    });
  });

  describe('getMomentFromFuzzyDate', function () {
    it('returns a valid moment object based on the provided fuzzy date', function () {
        // arrange
        let fuzzyDate: SkyFuzzyDate = { month: 11, day: 5, year: 1850 },
            expected = moment([fuzzyDate.year, fuzzyDate.month - 1, fuzzyDate.day]),
            actual;

        // act
        actual = service.getMomentFromFuzzyDate(fuzzyDate);

        // assert
        expect(actual).toEqual(expected);
    });

    it('defaults the year to the current year with fuzzy date\'s not having a year', function () {
        // arrange
        let fuzzyDate: SkyFuzzyDate = { month: 11, day: 5 },
            currentYear = new Date().getFullYear(),
            expected = moment([currentYear, fuzzyDate.month - 1, fuzzyDate.day]),
            actual;

        // act
        actual = service.getMomentFromFuzzyDate(fuzzyDate);

        // assert
        expect(actual).toEqual(expected);
    });
  });

  describe('getFuzzyDateRange', function () {
    it('returns a date range of years, months, and days when provided with 2 full fuzzy dates.', function () {
        // arrange
        let startFuzzyDate: SkyFuzzyDate = { month: 2, day: 14, year: 1960 },
            endFuzzyDate: SkyFuzzyDate = { month: 4, day: 16, year: 1962 },
            actual;

        // act
        actual = service.getFuzzyDateRange(startFuzzyDate, endFuzzyDate);

        // assert
        expect(actual.years).toEqual(2);
        expect(actual.months).toEqual(26);
        expect(actual.days).toEqual(792);
    });

    it('returns a fuzzy date range when provided with partial fuzzy dates.', function () {
        // arrange
        let startFuzzyDate: SkyFuzzyDate = { month: 2, year: 1960 },
            endFuzzyDate: SkyFuzzyDate = { month: 4, day: 16, year: 1962 },
            actual;

        // act
        actual = service.getFuzzyDateRange(startFuzzyDate, endFuzzyDate);

        // assert
        expect(actual.years).toEqual(2);
        expect(actual.months).toEqual(26);
    });

    it('returns empty years, months, days values with valid = false if no years are provided.', function () {
        // arrange
        let startFuzzyDate: SkyFuzzyDate = { month: 2, year: 1960 },
            endFuzzyDate: SkyFuzzyDate = { month: 4, day: 16 },
            actual;

        // act
        actual = service.getFuzzyDateRange(startFuzzyDate, endFuzzyDate);

        // assert
        expect(actual.valid).toBeFalsy();
    });

    it('returns empty years, months, days values with valid = false if the end date is not after the start date.', function () {
        // arrange
        let startFuzzyDate: SkyFuzzyDate = { month: 2, year: 1960 },
            endFuzzyDate: SkyFuzzyDate = { month: 4, year: 1950 },
            actual;

        // act
        actual = service.getFuzzyDateRange(startFuzzyDate, endFuzzyDate);

        // assert
        expect(actual.valid).toBeFalsy();
    });
  });

  describe('getCurrentFuzzyDate', function () {
    it('returns a full fuzzy date that coincides with the date of today.', function () {
        // arrange
        let currentDate = new Date(),
            expected: SkyFuzzyDate,
            actual: SkyFuzzyDate;
        expected = { month: currentDate.getMonth() + 1, day: currentDate.getDate(), year: currentDate.getFullYear() };

        // act
        actual = service.getCurrentFuzzyDate();

        // assert
        expect(actual).toEqual(expected);
    });
  });

  describe('getMostRecentLeapYear', function() {
    it('should return the current year when it is a leap year', function() {
      let leapYear = service.getMostRecentLeapYear(2000);
      expect(leapYear).toEqual(2000);
    });

    it('should return the most recent leap year', function() {
      let leapYear = service.getMostRecentLeapYear(2019);
      expect(leapYear).toEqual(2016);
    });

    it('should returned undefined for undefined current year', function() {
      let leapYear = service.getMostRecentLeapYear(undefined);
      expect(leapYear).toBeUndefined();
    });

    it('should returned undefined for current year less than 4', function() {
      let leapYear = service.getMostRecentLeapYear(3);
      expect(leapYear).toBeUndefined();
    });
  });
});
