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

fdescribe('Date range picker', function () {
  let fixture: ComponentFixture<DateRangePickerTestComponent>;
  let component: DateRangePickerTestComponent;

  function detectChanges(): void {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

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
    detectChanges();

    const labelElement = fixture.nativeElement.querySelectorAll(
      'label'
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

  it('should allow setting specific calculators', fakeAsync(function () {
    component.calculatorIds = [
      SkyDateRangeCalculatorId.Before,
      SkyDateRangeCalculatorId.After,
      SkyDateRangeCalculatorId.SpecificRange
    ];

    detectChanges();

    expect(component.reactiveDateRangePicker.calculatorIds).toEqual([
      SkyDateRangeCalculatorId.Before,
      SkyDateRangeCalculatorId.After,
      SkyDateRangeCalculatorId.SpecificRange
    ]);
  }));

  it('should allow setting calculators asynchronously', fakeAsync(function () {
    component.setCalculatorIdsAsync();

    detectChanges();

    expect(component.reactiveDateRangePicker.calculatorIds).toEqual([
      SkyDateRangeCalculatorId.After
    ]);
  }));

  it('should allow setting the field label', fakeAsync(function () {
    component.label = 'My label';

    detectChanges();

    const labelElement = fixture.nativeElement.querySelectorAll(
      'label'
    ).item(0);

    expect(component.reactiveDateRangePicker.label).toEqual('My label');
    expect(labelElement.textContent).toContain('My label');
  }));

  it('should allow setting the date format', fakeAsync(function () {}));

  it('should only show end date picker for Before type', fakeAsync(function () {}));

  it('should only show start date picker for After type', fakeAsync(function () {}));

  it('should both pickers for Range type', fakeAsync(function () {}));

  it('should handle partial date range values', function () {});

  it('should set disabled state', fakeAsync(function () {}));

  it('should mark the control as touched when select is blurred', fakeAsync(function () {}));

  it('should catch validation errors from each calculator', fakeAsync(function () {}));

  it('should maintain selected value when calculators change', fakeAsync(function () {}));

  it('should not emit changes on the first change', fakeAsync(function () {}));

  it('should', fakeAsync(function () {}));
});
