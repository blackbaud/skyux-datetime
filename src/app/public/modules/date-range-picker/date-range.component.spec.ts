import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { DateRangePickerTestComponent } from './fixtures/date-range-picker.component.fixture';
import { DateRangePickerTestModule } from './fixtures/date-range-picker.module.fixture';
import { SkyDateRangePickerComponent } from './date-range-picker.component';

fdescribe('Date range picker', function () {
  let fixture: ComponentFixture<DateRangePickerTestComponent>;
  let picker: SkyDateRangePickerComponent;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        DateRangePickerTestModule
      ]
    });

    fixture = TestBed.createComponent(DateRangePickerTestComponent);
    picker = fixture.componentInstance.dateRangePicker;
  });

  afterEach(function () {
    fixture.destroy();
  });

  it('should set defaults', function () {
    fixture.detectChanges();
    expect(picker.label).toEqual('');
  });

  it('should handle partial date range values', function () {});
});
