import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  DateRangePickerTestComponent
} from './fixtures/date-range-picker.component.fixture';

import {
  DateRangePickerTestModule
} from './fixtures/date-range-picker.module.fixture';

import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

describe('Date range picker', function () {
  let fixture: ComponentFixture<DateRangePickerTestComponent>;
  let component: DateRangePickerTestComponent;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        DateRangePickerTestModule
      ]
    });

    fixture = TestBed.createComponent(DateRangePickerTestComponent);
    component = fixture.componentInstance;
  });

  afterEach(function () {
    fixture.destroy();
  });

  it('should set defaults', fakeAsync(function () {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    const labelElement = fixture.nativeElement.querySelectorAll(
      `label`
    ).item(0);

    expect(labelElement.textContent).toContain('Select a date range');

    const picker = component.reactiveDateRangePicker;
    expect(picker.dateFormat).toEqual(undefined);
    expect(picker.label).toEqual(undefined);
    expect(picker.calculatorIds).toEqual([
      SkyDateRangeCalculatorId.AnyTime,
      SkyDateRangeCalculatorId.Before,
      SkyDateRangeCalculatorId.After,
      SkyDateRangeCalculatorId.SpecificRange,
      SkyDateRangeCalculatorId.Yesterday,
      SkyDateRangeCalculatorId.Today,
      SkyDateRangeCalculatorId.Tomorrow,
      SkyDateRangeCalculatorId.LastWeek,
      SkyDateRangeCalculatorId.ThisWeek,
      SkyDateRangeCalculatorId.NextWeek,
      SkyDateRangeCalculatorId.LastMonth,
      SkyDateRangeCalculatorId.ThisMonth,
      SkyDateRangeCalculatorId.NextMonth,
      SkyDateRangeCalculatorId.LastQuarter,
      SkyDateRangeCalculatorId.ThisQuarter,
      SkyDateRangeCalculatorId.NextQuarter,
      SkyDateRangeCalculatorId.LastYear,
      SkyDateRangeCalculatorId.ThisYear,
      SkyDateRangeCalculatorId.NextYear,
      SkyDateRangeCalculatorId.LastFiscalYear,
      SkyDateRangeCalculatorId.ThisFiscalYear,
      SkyDateRangeCalculatorId.NextFiscalYear
    ]);
  }));

  it('should handle partial date range values', function () {});
});
