import { TestBed } from '@angular/core/testing';

import { expect } from '@skyux-sdk/testing';
// import { SkyAppResourcesService } from '@skyux/i18n';
import { SkyAppTestModule } from '@skyux-sdk/builder/runtime/testing/browser';
import { SkyFuzzyDateFactory } from './fuzzy-date-factory';

import { SkyFuzzyDate } from './fuzzy-date';

let moment = require('moment');

describe('SkyFuzzyDateFactory', () => {
  let factory: SkyFuzzyDateFactory;
    let defaultDateFormat = 'mm/dd/yyyy';

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          SkyAppTestModule
        ],
        providers: [
          SkyFuzzyDateFactory
        ]
      });

      factory = TestBed.get(SkyFuzzyDateFactory);
    });

  describe('getFuzzyDateFromDateString', () => {
    it('returns a fuzzy date object when provided with a valid full date string.', function () {
      // arrange
      let expected = { month: 1, day: 29, year: 1990 },
          stringDate = factory.getDateStringFromFuzzyDate(expected, defaultDateFormat),
          actual;

      // act
      actual = factory.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid full date string with non-US date format.', function () {
      // arrange
      let expected = { month: 1, day: 29, year: 1990 },
          dateFormat = 'dd/mm/yyyy',
          stringDate = factory.getDateStringFromFuzzyDate(expected, dateFormat),
          actual;

      // act
      actual = factory.getFuzzyDateFromDateString(stringDate, dateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid month year date string.', function () {
        // arrange
        let expected: SkyFuzzyDate = { day: undefined, month: 1, year: 1989 },
            stringDate = factory.getDateStringFromFuzzyDate(expected, defaultDateFormat),
            actual;

        // act
        actual = factory.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid month year date string with non-US date format.', function () {
        // arrange
        let expected: SkyFuzzyDate = { day: undefined, month: 1, year: 1990 },
            dateFormat = 'dd/mm/yyyy',
            stringDate = factory.getDateStringFromFuzzyDate(expected, dateFormat),
            actual;

        // act
        actual = factory.getFuzzyDateFromDateString(stringDate, dateFormat);

        // assert
        expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid month year date string with a 2 digit year dateformat.', function () {
      // arrange
      let expected: SkyFuzzyDate = { day: undefined, month: 1, year: 1989 },
          dateFormat = 'mm/yy',
          stringDate = '1/89',
          actual;

          console.log('stringDate: ' + stringDate);
      // act
      actual = factory.getFuzzyDateFromDateString(stringDate, dateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid day month date string.', function () {
        // arrange
        let expected: SkyFuzzyDate = { year: undefined, month: 2, day: 12 },
            stringDate = factory.getDateStringFromFuzzyDate(expected, defaultDateFormat),
            actual;

        // act
        actual = factory.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid date using words such as "January".', function () {
        // arrange
        let expected: SkyFuzzyDate = { year: undefined, month: 11, day: 18 },
            stringDate = 'November 18',
            actual;

        // act
        actual = factory.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toEqual(expected);
    });

    it('returns null if the date provided is not valid.', function () {
        // arrange
        let stringDate = 'fsfsafd',
            actual;

        // act
        actual = factory.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toBeUndefined();
    });

    it('returns a fuzzy date object when provided with a valid leap year date string.', function () {
        // arrange
        let expected = { month: 2, day: 29, year: 2000 },
            stringDate = factory.getDateStringFromFuzzyDate(expected, defaultDateFormat),
            actual;

        // act
        actual = factory.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toEqual(expected);
    });

    it('returns null if the date provided if 2/29 is provided as a full date with a non-leap-year year date.', function () {
        // arrange
        let stringDate = factory.getDateStringFromFuzzyDate({ month: 2, day: 29, year: 2001 }, defaultDateFormat),
            actual;

        // act
        actual = factory.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toBeUndefined();
    });

    it('returns null if the date provided if 2/29 is provided as a month day date.', function () {
        // arrange
        let stringDate = factory.getDateStringFromFuzzyDate({ month: 2, day: 29 }, defaultDateFormat),
            actual;

        // act
        actual = factory.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

        // assert
        expect(actual).toBeUndefined();
    });

    it('returns null if the date provided has more than 3 date components.', function () {
        // arrange
        let stringDate = '01/02/2003/4',
            actual;

        // act
        actual = factory.getFuzzyDateFromDateString(stringDate, defaultDateFormat);

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
        actual = factory.getDateStringFromFuzzyDate(fuzzyDate, 'mm/dd/yyyy');

        // assert
        expect(actual).toBe(expected);
    });

    it('returns a valid month year date string based on the provided month year fuzzy date', function () {
        // arrange
        let fuzzyDate: SkyFuzzyDate = { month: 2, year: 1960 },
            expected = fuzzyDate.month + '/' + fuzzyDate.year,
            actual;

        // act
        actual = factory.getDateStringFromFuzzyDate(fuzzyDate, 'mm/dd/yyyy');

        // assert
        expect(actual).toBe(expected);
    });

    it('returns a valid month day date string based on the provided month day fuzzy date', function () {
        // arrange
        let fuzzyDate: SkyFuzzyDate = { month: 2, day: 14 },
            expected = fuzzyDate.month + '/' + fuzzyDate.day,
            actual;

        // act
        actual = factory.getDateStringFromFuzzyDate(fuzzyDate, 'mm/dd/yyyy');

        // assert
        expect(actual).toBe(expected);
    });

    it('returns a valid year date string based on the provided year fuzzy date', function () {
        // arrange
        let fuzzyDate: SkyFuzzyDate = { year: 1985 },
            expected = fuzzyDate.year,
            actual;

        // act
        actual = factory.getDateStringFromFuzzyDate(fuzzyDate, 'mm/dd/yyyy');

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
        actual = factory.getMomentFromFuzzyDate(fuzzyDate);

        // assert
        expect(actual).toEqual(expected);
    });

    it('defaults the year to 2000 with fuzzy date\'s not having a year', function () {
        // arrange
        let fuzzyDate: SkyFuzzyDate = { month: 11, day: 5 },
            expected = moment([2000, fuzzyDate.month - 1, fuzzyDate.day]),
            actual;

        // act
        actual = factory.getMomentFromFuzzyDate(fuzzyDate);

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
        actual = factory.getFuzzyDateRange(startFuzzyDate, endFuzzyDate);

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
        actual = factory.getFuzzyDateRange(startFuzzyDate, endFuzzyDate);

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
        actual = factory.getFuzzyDateRange(startFuzzyDate, endFuzzyDate);

        // assert
        expect(actual.valid).toBeFalsy();
    });

    it('returns empty years, months, days values with valid = false if the end date is not after the start date.', function () {
        // arrange
        let startFuzzyDate: SkyFuzzyDate = { month: 2, year: 1960 },
            endFuzzyDate: SkyFuzzyDate = { month: 4, year: 1950 },
            actual;

        // act
        actual = factory.getFuzzyDateRange(startFuzzyDate, endFuzzyDate);

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
        actual = factory.getCurrentFuzzyDate();

        // assert
        expect(actual).toEqual(expected);
    });
  });

});
