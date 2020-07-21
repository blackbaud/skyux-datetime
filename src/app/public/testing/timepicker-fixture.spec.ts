import {
  TestBed
} from '@angular/core/testing';

import {
  Component
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyTimepickerModule
} from '@skyux/datetime';

import {
  SkyPopoverModule
} from '@skyux/popovers';

import {
  SkyTimepickerFixture
} from './timepicker-fixture';

@Component({
  selector: 'timepicker-test',
  template: `
  <div>
<sky-timepicker
data-sky-id="test-timepicker"
(selectedTimeChanged)="onTimeChange()"
#timepickerTest>
  <input
    type="text"
    [disabled]="disabled"
    [skyTimepickerInput]="timepickerTest"
    [timeFormat]="format12"
    [(ngModel)]="selectedTime"
    #time="ngModel"
  />
</sky-timepicker>
</div>
`
})
class TestComponent {

  public disabled = false;

  public selectedTime: any = '8:30 PM';

  public timeObject = {
    hour: 20,
    minute: 30,
    meridie: 'PM',
    timezone: -4,
    iso8601: new Date('Tue Jul 14 2020 20:30:00 GMT-0400 (Eastern Daylight Time)'),
    local: '8:30 PM',
    customFormat: 'h:mm A'
  };

  public onTimeChange = () => {};
}

describe('Timepicker fixture', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent
      ],
      imports: [
        FormsModule,
        SkyTimepickerModule,
        SkyPopoverModule
      ]
    });
  });

  it('should expose the public properties', async () => {
    const fixture = TestBed.createComponent(
      TestComponent
    );

    fixture.detectChanges();

    const timepicker = new SkyTimepickerFixture(
      fixture,
      'test-timepicker'
    );

    await fixture.whenStable();
    expect(timepicker.disabled).toBe(false);
    expect(timepicker.time).toEqual(fixture.componentInstance.selectedTime.local);
  });

  it('should set the timepicker time', async () => {
    const newTime = '4:30 AM';
    const fixture = TestBed.createComponent(
      TestComponent
    );

    fixture.detectChanges();

    const timepicker = new SkyTimepickerFixture(
      fixture,
      'test-timepicker'
    );

    await fixture.whenStable();
    expect(timepicker.time).toEqual(fixture.componentInstance.selectedTime.local);

    timepicker.time = newTime;

    expect(timepicker.time).toEqual(newTime);
  });

  it('should set the timepicker disabled state', async () => {
    const fixture = TestBed.createComponent(
      TestComponent
    );

    fixture.detectChanges();

    const timepicker = new SkyTimepickerFixture(
      fixture,
      'test-timepicker'
    );

    await fixture.whenStable();

    expect(timepicker.disabled).toBeFalse();

    timepicker.disabled = true;

    expect(timepicker.disabled).toBeTrue();
  });

  it('should indicate if the timepicker input is valid', async () => {
    const fixture = TestBed.createComponent(
      TestComponent
    );

    const timepicker = new SkyTimepickerFixture(
      fixture,
      'test-timepicker'
    );

    await fixture.whenStable();

    expect(timepicker.valid).toBeTrue();

    timepicker.time = 'badValue';

    expect(timepicker.valid).toBeFalse();
  });

  it('should select the time from the dropdown and emit selectedTimeChanged', async () => {
    const fixture = TestBed.createComponent(
      TestComponent
    );

    const timepicker = new SkyTimepickerFixture(
      fixture,
      'test-timepicker'
    );
    spyOn(fixture.componentInstance, 'onTimeChange');
    fixture.detectChanges();

    await fixture.whenStable();

    expect(timepicker.time).toEqual(fixture.componentInstance.selectedTime.local);

    await timepicker.selectTime(2, 2, 1);

    expect(timepicker.time).toEqual('3:10 PM');
    expect(fixture.componentInstance.onTimeChange).toHaveBeenCalled();
  });
});
