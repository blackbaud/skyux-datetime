import {
  ComponentFixture
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX timepicker component.
 */
export class SkyTimepickerFixture {

  private debugEl: DebugElement;

  constructor(
    private fixture: ComponentFixture<any>,
    private skyTestId: string
  ) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(this.fixture, this.skyTestId, 'sky-timepicker');
  }

  /**
   * The timepicker's currently selected time.
   */
  public get time(): string {
    return this.getTimepickerInputEl().nativeElement.value;
  }

  /**
   * Set the timepicker's selected time.
   */
  public set time(value: string) {
    const timepickerInputEl = this.getTimepickerInputEl().nativeElement;
    timepickerInputEl.value = value;
    this.fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(timepickerInputEl, 'change');
    this.fixture.detectChanges();
  }

  /**
   * Flag indicating if timepicker input is disabled.
   */
  public get disabled(): boolean {
    return this.getTimepickerInputEl().nativeElement.disabled;
  }

  /**
   * Set the timepicker's disabled value
   */
  public set disabled(value: boolean) {
    this.getTimepickerInputEl().nativeElement.disabled = value;
  }

  /**
   * Flag indicating if timepicker input is valid.
   */
  public get valid(): boolean {
    return !this.getTimepickerInputEl().nativeElement.classList.contains('ng-invalid');
  }

  /**
   * Select the timepicker's time by interacting with the dropdown.
   * @param hourIndex The index of the hour option to select. For the 12 hour clock, hour 1 is
   * index 0. For the 24 hour clock, hour 0 is index 0.
   * @param minutesIndex The index of the minutes option to select. For both clocks minutes 00 is
   * index 0. The 12 hour clock has 12 options; the 24 hour clock has 4 options.
   * @param meridieIndex Only applies to 12 hour clock. The index of the miridie to select. AM is 0 and PM is 1.
   */
  public async selectTime(hourIndex?: number, minutesIndex?: number, meridieIndex?: number): Promise<any> {
    await this.clickTimepickerButtonEl();

    const timepickerColumns = document.querySelectorAll('.sky-timepicker-column');

    if (hourIndex) {
      const hourColumn = timepickerColumns && timepickerColumns[0];
      const allHourButtons = hourColumn && hourColumn.querySelectorAll('li button');
      const hourButton = allHourButtons && allHourButtons[hourIndex];
      const hourButtonEl = hourButton && (hourButton as HTMLButtonElement);

      hourButtonEl.click();
    }

    if (minutesIndex) {
      const minutesColumn = timepickerColumns && timepickerColumns[1];
      const allMinutesButtons = minutesColumn && minutesColumn.querySelectorAll('li button');
      const minutesButton = allMinutesButtons && allMinutesButtons[minutesIndex];
      const minutesButtonEl = minutesButton && (minutesButton as HTMLButtonElement);

      minutesButtonEl.click();
    }

    if (meridieIndex) {
      const meridieColumn = timepickerColumns && timepickerColumns[2];
      const allMeridieButtons = meridieColumn && meridieColumn.querySelectorAll('li button');
      const meridieButton = allMeridieButtons && allMeridieButtons[meridieIndex];
      const meridieButtonEl = meridieButton && (meridieButton as HTMLButtonElement);

      meridieButtonEl.click();
    }

    const doneButtonEl = (document.querySelector(('.sky-timepicker-footer button')) as HTMLButtonElement);
    doneButtonEl.click();

    return this.fixture.whenStable();
  }

  private async clickTimepickerButtonEl(): Promise<any> {
    this.fixture.detectChanges();

    const timepickerButton = this.debugEl.query(
      By.css('.sky-timepicker .sky-input-group-timepicker-btn button')
    ).nativeElement;

    timepickerButton.click();

    return this.fixture.whenStable();
  }

  private getTimepickerInputEl(): DebugElement {
    return this.debugEl.query(
      By.css('.sky-timepicker input')
    );
  }
}
