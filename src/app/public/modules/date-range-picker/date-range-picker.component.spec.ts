import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  FormsModule
} from '@angular/forms';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyDateRangePickerFixtureComponent
} from './fixtures/date-range-picker.fixture';

import {
  SkyDateRangePickerModule
} from './date-range-picker.module';

describe('Date range picker component', () => {
  let fixture: ComponentFixture<SkyDateRangePickerFixtureComponent>;
  let component: SkyDateRangePickerFixtureComponent;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SkyDateRangePickerFixtureComponent
      ],
      imports: [
        SkyDateRangePickerModule,
        NoopAnimationsModule,
        FormsModule
      ]
    });

    fixture = TestBed.createComponent(SkyDateRangePickerFixtureComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
  });

  function setSelectFieldIndex(index: number) {
    const select = nativeElement.querySelector('select');
    select.selectedIndex = index;
    fixture.detectChanges();
    SkyAppTestUtility.fireDomEvent(select, 'change');
  }

  it('should use form value', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    setSelectFieldIndex(0);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    component.value = {
      startDate: new Date('12/2/2003'),
      endDate: new Date('12/17/2004')
    };
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const startDate = component.dateRangePicker.selectedFirstDate;
    const endDate = component.dateRangePicker.selectedSecondDate;

    expect(startDate.getDate()).toBe(2);
    expect(startDate.getMonth()).toBe(11);
    expect(startDate.getFullYear()).toBe(2003);

    expect(endDate.getDate()).toBe(17);
    expect(endDate.getMonth()).toBe(11);
    expect(endDate.getFullYear()).toBe(2004);
  }));

  it('should show two datepickers for specific range', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    setSelectFieldIndex(0);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(nativeElement.querySelectorAll('sky-datepicker').length).toBe(2);
  }));

  it('should show one datepicker for before', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    setSelectFieldIndex(1);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(nativeElement.querySelectorAll('sky-datepicker').length).toBe(1);
  }));

  it('should show one datepicker for after', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    setSelectFieldIndex(2);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(nativeElement.querySelectorAll('sky-datepicker').length).toBe(1);
  }));

  it('should not show datepickers for default values', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    setSelectFieldIndex(3);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(nativeElement.querySelectorAll('sky-datepicker').length).toBe(0);
  }));

  it('should show label input on date range picker', fakeAsync(() => {
    const expectedLabel = 'I am a real label';
    component.label = expectedLabel;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    setSelectFieldIndex(0);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(
      nativeElement.querySelector('.sky-date-range-picker-label').textContent.includes(expectedLabel)
    ).toBeTruthy();
  }));

  it('should disable inputs when disabled is passed in', fakeAsync(() => {
    component.disabled = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(nativeElement.querySelector('select').disabled).toBeTruthy();
    expect(nativeElement.querySelectorAll('input')[0].disabled).toBeTruthy();
    expect(nativeElement.querySelectorAll('input')[1].disabled).toBeTruthy();
  }));

  it('should propagate dateformat input to datepickers', fakeAsync(() => {
    const expectedFormat = 'DD/MM/YYYY';
    component.dateFormat = expectedFormat;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    setSelectFieldIndex(0);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const dateInputs = nativeElement.querySelectorAll('input');
    dateInputs[0].value = '11/02/1992';
    SkyAppTestUtility.fireDomEvent(dateInputs[0], 'change');

    dateInputs[1].value = '15/12/1993';
    SkyAppTestUtility.fireDomEvent(dateInputs[1], 'change');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const startDate = component.value.startDate;
    const endDate = component.value.endDate;

    expect(startDate.getDate()).toBe(11);
    expect(startDate.getMonth()).toBe(1);
    expect(startDate.getFullYear()).toBe(1992);

    expect(endDate.getDate()).toBe(15);
    expect(endDate.getMonth()).toBe(11);
    expect(endDate.getFullYear()).toBe(1993);
  }));

  it('should validate specific range being out of order', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    setSelectFieldIndex(0);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const dateInputs = nativeElement.querySelectorAll('input');
    dateInputs[0].value = '12/19/1993';
    SkyAppTestUtility.fireDomEvent(dateInputs[0], 'change');

    dateInputs[1].value = '11/02/1992';
    SkyAppTestUtility.fireDomEvent(dateInputs[1], 'change');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(nativeElement.querySelector('form')).toHaveCssClass('ng-invalid');
  }));
});
