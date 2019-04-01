import {
  SkyDateRangeRelativeValue
} from './date-range-relative-value';

import {
  SkyDateRange
} from './date-range';

fdescribe('Date range relative values', function () {
  const BASE_DATE = '1/1/2000';

  let now: Date;

  beforeEach(function () {
    now = new Date(BASE_DATE);
    mockDate(now);
  });

  function mockDate(date: Date): void {
    jasmine.clock().mockDate(date);
  }

  function verifyThisQuarter(
    today: Date,
    expectedStartDate: Date,
    expectedEndDate: Date
  ): void {
    mockDate(today);
    verifyRange(
      SkyDateRangeRelativeValue.thisQuarter,
      expectedStartDate,
      expectedEndDate
    );
  }

  function verifyRange(
    range: SkyDateRange,
    expectedStartDate: Date,
    expectedEndDate: Date
  ): void {
    expect(range.startDate.getTime()).toEqual(expectedStartDate.getTime());
    expect(range.endDate.getTime()).toEqual(expectedEndDate.getTime());
  }

  it('should return today', function () {
    verifyRange(
      SkyDateRangeRelativeValue.today,
      now,
      now
    );
  });

  it('should return tomorrow', function () {
    verifyRange(
      SkyDateRangeRelativeValue.tomorrow,
      now,
      new Date('1/2/2000')
    );
  });

  it('should return yesterday', function () {
    verifyRange(
      SkyDateRangeRelativeValue.yesterday,
      new Date('12/31/1999'),
      now
    );
  });

  it('should return this week', function () {
    verifyRange(
      SkyDateRangeRelativeValue.thisWeek,
      new Date('12/26/1999'),
      new Date('1/1/2000')
    );
  });

  it('should return next week', function () {
    verifyRange(
      SkyDateRangeRelativeValue.nextWeek,
      new Date('1/2/2000'),
      new Date('1/8/2000')
    );
  });

  it('should return last week', function () {
    verifyRange(
      SkyDateRangeRelativeValue.lastWeek,
      new Date('12/19/1999'),
      new Date('12/25/1999')
    );
  });

  it('should return this month', function () {
    verifyRange(
      SkyDateRangeRelativeValue.thisMonth,
      now,
      new Date('1/31/2000')
    );
  });

  it('should return next month', function () {
    verifyRange(
      SkyDateRangeRelativeValue.nextMonth,
      new Date('2/1/2000'),
      new Date('2/29/2000')
    );
  });

  it('should return last month', function () {
    verifyRange(
      SkyDateRangeRelativeValue.lastMonth,
      new Date('12/1/1999'),
      new Date('12/31/1999')
    );
  });

  it('should return this quarter', function () {
    verifyThisQuarter(
      new Date('2/13/2000'),
      new Date('1/1/2000'),
      new Date('3/31/2000')
    );

    verifyThisQuarter(
      new Date('4/2/2000'),
      new Date('4/1/2000'),
      new Date('6/30/2000')
    );

    verifyThisQuarter(
      new Date('9/22/2000'),
      new Date('7/1/2000'),
      new Date('9/30/2000')
    );

    verifyThisQuarter(
      new Date('12/31/2000'),
      new Date('10/1/2000'),
      new Date('12/31/2000')
    );
  });

  it('should return next quarter', function () {
    verifyRange(
      SkyDateRangeRelativeValue.nextQuarter,
      new Date('4/1/2000'),
      new Date('6/30/2000')
    );
  });

  it('should return last quarter', function () {
    verifyRange(
      SkyDateRangeRelativeValue.lastQuarter,
      new Date('10/1/1999'),
      new Date('12/31/1999')
    );
  });

  it('should return this year', function () {
    verifyRange(
      SkyDateRangeRelativeValue.thisYear,
      new Date('1/1/2000'),
      new Date('12/31/2000')
    );
  });

  it('should return next year', function () {
    verifyRange(
      SkyDateRangeRelativeValue.nextYear,
      new Date('1/1/2001'),
      new Date('12/31/2001')
    );
  });

  it('should return last year', function () {
    verifyRange(
      SkyDateRangeRelativeValue.lastYear,
      new Date('1/1/1999'),
      new Date('12/31/1999')
    );
  });

  it('should return this fiscal year', function () {
    verifyRange(
      SkyDateRangeRelativeValue.thisFiscalYear,
      new Date('10/1/1999'),
      new Date('9/30/2000')
    );

    // Set date to first day of fiscal year.
    mockDate(new Date('10/1/2000'));

    verifyRange(
      SkyDateRangeRelativeValue.thisFiscalYear,
      new Date('10/1/2000'),
      new Date('9/30/2001')
    );
  });

  it('should return next fiscal year', function () {
    verifyRange(
      SkyDateRangeRelativeValue.nextFiscalYear,
      new Date('10/1/2000'),
      new Date('9/30/2001')
    );
  });

  it('should return last fiscal year', function () {
    verifyRange(
      SkyDateRangeRelativeValue.lastFiscalYear,
      new Date('10/1/1998'),
      new Date('9/30/1999')
    );
  });
});
