// import {
//   SkyDateRangeService
// } from './date-range.service';

// let _Date: any = undefined;

// function replaceDate(testDate: string) {
//   if (_Date) {
//     return;
//   }

//   _Date = Date;
//   Object.getOwnPropertyNames(Date).forEach((name) => {
//     try {
//       _Date[name] = (window as any).Date[name];
//     } catch (e) {}
//   });

//   // set Date ctor to always return same date
//   // tslint:disable-next-line
//   (window as any).Date = () => {
//     return new _Date(testDate);
//   };

//   Object.getOwnPropertyNames(_Date).forEach((name) => {
//     try {
//       (window as any).Date[name] = _Date[name];
//     } catch (e) {}
//   });
// }

// function repairDate() {
//   if (!_Date) {
//     return;
//   }

//   // tslint:disable-next-line
//   (window as any).Date = _Date;
//   Object.getOwnPropertyNames(_Date).forEach((name) => {
//     try {
//       (window as any).Date[name] = _Date[name];
//     } catch (e) {}
//   });

//   _Date = undefined;
// }

// function expectDatesEqual(expectedDate: Date, actualDate: Date): void {
//   expect(expectedDate.getDate() === actualDate.getDate());
//   expect(expectedDate.getMonth() === actualDate.getMonth());
//   expect(expectedDate.getFullYear() === actualDate.getFullYear());
// }

// describe('date range picker default values', () => {
//   afterEach(() => {
//     repairDate();
//   });

//   it('should create a specific range', () => {
//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.SpecificRange];
//     const expectedFirstDate = new Date('12/9/19 10:24PM');
//     const expectedSecondDate = new Date('12/30/19 9:13AM');
//     const actualDate = format.getDateRangeValue(expectedFirstDate, expectedSecondDate);

//     expectDatesEqual(expectedFirstDate, actualDate.startDate);
//     expectDatesEqual(expectedSecondDate, actualDate.endDate);
//   });

//   it('should create a Before range', () => {
//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.Before];
//     const expectedFirstDate = new Date('2/19/1993');
//     const actualDate = format.getDateRangeValue(expectedFirstDate);

//     expect(actualDate.startDate).toBeFalsy();
//     expectDatesEqual(expectedFirstDate, actualDate.endDate);
//   });

//   it('should create a After range', () => {
//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.After];
//     const expectedFirstDate = new Date('2/19/1993');
//     const actualDate = format.getDateRangeValue(expectedFirstDate);

//     expect(actualDate.endDate).toBeFalsy();
//     expectDatesEqual(expectedFirstDate, actualDate.startDate);
//   });

//   it('should create an At any time range', () => {
//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.AtAnyTime];
//     const actualDate = format.getDateRangeValue();

//     expect(actualDate.startDate).toBeFalsy();
//     expect(actualDate.endDate).toBeFalsy();
//   });

//   it('should create a yesterday range', () => {
//     replaceDate('2/20/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.Yesterday];
//     const expectedDate = new Date('2/19/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedDate, actualDate.startDate);
//     expectDatesEqual(expectedDate, actualDate.endDate);
//   });

//   it('should create a today range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.Today];
//     const expectedDate = new Date('2/19/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedDate, actualDate.startDate);
//     expectDatesEqual(expectedDate, actualDate.endDate);
//   });

//   it('should create a tomorrow range', () => {
//     replaceDate('2/18/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.Tomorrow];
//     const expectedDate = new Date('2/19/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedDate, actualDate.startDate);
//     expectDatesEqual(expectedDate, actualDate.endDate);
//   });

//   it('should create a last week range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.LastWeek];
//     const expectedStartDate = new Date('2/7/1993');
//     const expectedEndDate = new Date('2/13/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a this week range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.ThisWeek];
//     const expectedStartDate = new Date('2/14/1993');
//     const expectedEndDate = new Date('2/20/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a next week range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.NextWeek];
//     const expectedStartDate = new Date('2/21/1993');
//     const expectedEndDate = new Date('2/27/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a last month range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.LastMonth];
//     const expectedStartDate = new Date('1/1/1993');
//     const expectedEndDate = new Date('1/31/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a this month range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.ThisMonth];
//     const expectedStartDate = new Date('2/1/1993');
//     const expectedEndDate = new Date('2/28/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a next month range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.NextMonth];
//     const expectedStartDate = new Date('3/1/1993');
//     const expectedEndDate = new Date('3/31/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a last quarter range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.LastQuarter];
//     const expectedStartDate = new Date('10/1/1992');
//     const expectedEndDate = new Date('12/31/1992');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a last quarter range starting mid-year', () => {
//     replaceDate('8/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.LastQuarter];
//     const expectedStartDate = new Date('1/1/1993');
//     const expectedEndDate = new Date('3/31/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a this quarter range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.ThisQuarter];
//     const expectedStartDate = new Date('1/1/1993');
//     const expectedEndDate = new Date('3/31/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a next quarter range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.NextQuarter];
//     const expectedStartDate = new Date('4/1/1993');
//     const expectedEndDate = new Date('6/30/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a next quarter range starting mid-year', () => {
//     replaceDate('8/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.NextQuarter];
//     const expectedStartDate = new Date('10/1/1993');
//     const expectedEndDate = new Date('12/31/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a next quarter range starting mid-year', () => {
//     replaceDate('11/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.NextQuarter];
//     const expectedStartDate = new Date('1/1/1994');
//     const expectedEndDate = new Date('3/31/1994');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a last year range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.LastYear];
//     const expectedStartDate = new Date('1/1/1992');
//     const expectedEndDate = new Date('12/31/1992');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a this year range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.ThisYear];
//     const expectedStartDate = new Date('1/1/1993');
//     const expectedEndDate = new Date('12/31/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a next year range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.NextYear];
//     const expectedStartDate = new Date('1/1/1994');
//     const expectedEndDate = new Date('12/31/1994');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a last fiscal year range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.LastFiscalYear];
//     const expectedStartDate = new Date('10/1/1991');
//     const expectedEndDate = new Date('9/30/1992');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a last fiscal year range starting from the end of the year', () => {
//     replaceDate('11/19/1992');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.LastFiscalYear];
//     const expectedStartDate = new Date('10/1/1991');
//     const expectedEndDate = new Date('9/30/1992');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a this fiscal year range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.ThisFiscalYear];
//     const expectedStartDate = new Date('10/1/1992');
//     const expectedEndDate = new Date('9/30/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a this fiscal year range starting from the end of the year', () => {
//     replaceDate('11/19/1992');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.ThisFiscalYear];
//     const expectedStartDate = new Date('10/1/1992');
//     const expectedEndDate = new Date('9/30/1993');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a next fiscal year range', () => {
//     replaceDate('2/19/1993');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.NextFiscalYear];
//     const expectedStartDate = new Date('10/1/1993');
//     const expectedEndDate = new Date('9/30/1994');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });

//   it('should create a next fiscal year range starting from the end of the year', () => {
//     replaceDate('11/19/1992');

//     const format = SkyDateRangeDefaultValues.DEFAULT_VALUES[SkyDateRangeFormatType.NextFiscalYear];
//     const expectedStartDate = new Date('10/1/1993');
//     const expectedEndDate = new Date('9/30/1994');

//     const actualDate = format.getDateRangeValue();
//     expectDatesEqual(expectedStartDate, actualDate.startDate);
//     expectDatesEqual(expectedEndDate, actualDate.endDate);
//   });
// });
