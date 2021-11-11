import {
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyDatepickerCustomDate
} from './datepicker-custom-date';

import {
  SkyDatepickerDate
} from './datepicker-date';

import {
  SkyDatepickerService
} from './datepicker.service';

//#region helpers
function setRangeBeginDate(date: Date, service: any): void {
  service._rangeBeginDate = date;
}

function setCustomDates(customDates: SkyDatepickerCustomDate[], service: any): void {
  service._customDates = customDates;
}

function setDateRows(dateRows: SkyDatepickerDate[][], service: any): void {
  service._dateRows = dateRows;
}

function getDateRows(service: any): SkyDatepickerDate[][] {
  return service._dateRows;
}

function getApplySpy(service: any): jasmine.Spy {
  return spyOn(service, 'applyCustomDates');
}
//#endregion

describe('SkyDatepickerService', () => {

  let service: SkyDatepickerService;

  const customDates: Array<SkyDatepickerCustomDate> = [
    {
      date: new Date(2021, 9, 1),
      disabled: false,
      important: true,
      importantText: ['important!']
    },
    {
      date: new Date(2021, 9, 3),
      disabled: true,
      important: false,
      importantText: ['not applied']
    },
    {
      date: new Date(2021, 9, 5),
      disabled: true,
      important: true,
      importantText: ['disabled!']
    },
    {
      date: new Date(2021, 9, 15),
      disabled: false,
      important: true,
      importantText: ['out of range!']
    }
  ];

  const dateRows: SkyDatepickerDate[][] = [
    [
      {
        current: false,
        date: new Date(2021, 9, 1),
        disabled: false,
        important: false,
        importantText: undefined,
        label: '1',
        secondary: false,
        selected: false,
        uid: '1'
      },
      {
        current: false,
        date: new Date(2021, 9, 2),
        disabled: false,
        important: false,
        importantText: undefined,
        label: '2',
        secondary: false,
        selected: false,
        uid: '2'
      },
      {
        current: false,
        date: new Date(2021, 9, 3),
        disabled: false,
        important: false,
        importantText: undefined,
        label: '3',
        secondary: false,
        selected: false,
        uid: '3'
      }
    ],
    [
      {
        current: false,
        date: new Date(2021, 9, 4),
        disabled: false,
        important: false,
        importantText: undefined,
        label: '4',
        secondary: false,
        selected: false,
        uid: '4'
      },
      {
        current: false,
        date: new Date(2021, 9, 5),
        disabled: false,
        important: false,
        importantText: undefined,
        label: '5',
        secondary: false,
        selected: false,
        uid: '5'
      },
      {
        current: false,
        date: new Date(2021, 9, 6),
        disabled: false,
        important: false,
        importantText: undefined,
        label: '6',
        secondary: false,
        selected: false,
        uid: '6'
      }
    ]
  ];

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        SkyDatepickerService,
        SkyAppWindowRef
      ]
    });

    service = new SkyDatepickerService();
    tick();
  }));

  describe('setCustomDates', () => {
    it(`should set custom dates and apply them to the current picker dates array`, () => {
      const customDatesSpy: jasmine.Spy = spyOn(service.customDates, 'next');
      const applySpy: jasmine.Spy = getApplySpy(service);

      service.setCustomDates(customDates);

      expect(customDatesSpy).toHaveBeenCalledWith(customDates);
      expect(applySpy).toHaveBeenCalled();
    });
  });

  describe('setPickerDateRange', () => {
    let dayRangeSpy: jasmine.Spy;
    let applySpy: jasmine.Spy;

    beforeEach(() => {
      setCustomDates(customDates, service);
      dayRangeSpy = spyOn(service.dayRangeChange, 'next');
      applySpy = getApplySpy(service);
    });

    it(`should apply existing custom dates when the date range does not change`, () => {
      setRangeBeginDate(new Date(2021, 9, 1), service);

      service.setPickerDateRange(dateRows);

      expect(dayRangeSpy).not.toHaveBeenCalled();
      expect(applySpy).toHaveBeenCalled();
    });

    it(`should not apply custom dates when there are none and the date range does not change`, () => {
      setRangeBeginDate(new Date(2021, 9, 1), service);
      setCustomDates([], service);

      service.setPickerDateRange(dateRows);

      expect(dayRangeSpy).not.toHaveBeenCalled();
      expect(applySpy).not.toHaveBeenCalled();
    });

    it(`should not apply custom dates when undefined and the date range does not change`, () => {
      setRangeBeginDate(new Date(2021, 9, 1), service);
      setCustomDates(undefined, service);

      service.setPickerDateRange(dateRows);

      expect(dayRangeSpy).not.toHaveBeenCalled();
      expect(applySpy).not.toHaveBeenCalled();
    });

    it(`should set the new date range if no existing range begin`, () => {
      service.setPickerDateRange(dateRows);

      expect(dayRangeSpy).toHaveBeenCalled();
      expect((service as any)._rangeBeginDate.getTime()).toBe(customDates[0].date.getTime());
      expect(applySpy).not.toHaveBeenCalled();
    });

    it(`should set the new date range if new existing range begin`, () => {
      setRangeBeginDate(new Date(2021, 8, 1), service);
      service.setPickerDateRange(dateRows);

      expect(dayRangeSpy).toHaveBeenCalled();
      expect((service as any)._rangeBeginDate.getTime()).toBe(customDates[0].date.getTime());
      expect(applySpy).not.toHaveBeenCalled();
    });

  });

  describe('applyCustomDates', () => {
    it(`should apply custom dates to the dateRows array`, () => {
      setCustomDates(customDates, service);
      setDateRows(dateRows, service);

      (service as any).applyCustomDates();
      let updatedRows = getDateRows(service);
      expect(updatedRows[0][0].important).toBeTruthy();
      expect(updatedRows[0][0].disabled).toBeFalsy();
      expect(updatedRows[0][0].importantText[0]).toBe('important!');
      expect(updatedRows[0][0].uid).toBe('1');

      expect(updatedRows[0][1].important).toBeFalsy();
      expect(updatedRows[0][1].disabled).toBeFalsy();
      expect(updatedRows[0][1].importantText).toBeUndefined();
      expect(updatedRows[0][1].uid).toBe('2');

      expect(updatedRows[0][2].important).toBeFalsy();
      expect(updatedRows[0][2].disabled).toBeTruthy();
      expect(updatedRows[0][2].importantText).toBeUndefined();
      expect(updatedRows[0][2].uid).toBe('3');

      expect(updatedRows[1][0].important).toBeFalsy();
      expect(updatedRows[1][0].disabled).toBeFalsy();
      expect(updatedRows[1][0].importantText).toBeUndefined();
      expect(updatedRows[1][0].uid).toBe('4');

      expect(updatedRows[1][1].important).toBeTruthy();
      expect(updatedRows[1][1].disabled).toBeTruthy();
      expect(updatedRows[1][1].importantText[0]).toBe('disabled!');
      expect(updatedRows[1][1].uid).toBe('5');

      expect(updatedRows[1][2].important).toBeFalsy();
      expect(updatedRows[1][2].disabled).toBeFalsy();
      expect(updatedRows[1][2].importantText).toBeUndefined();
      expect(updatedRows[1][2].uid).toBe('6');
    });

    it(`should not apply custom dates if undefined`, () => {
      setCustomDates(customDates, service);
      setDateRows(dateRows, service);

      (service as any).applyCustomDates();

      expect(getDateRows(service)).toBe(dateRows);
    });

    it(`should not apply custom dates if dateRows undefined`, () => {
      setCustomDates(customDates, service);
      setDateRows(undefined, service);

      (service as any).applyCustomDates();

      expect(getDateRows(service)).toBe(undefined);
    });
  });
});
