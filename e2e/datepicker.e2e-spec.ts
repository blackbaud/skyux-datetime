import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  element,
  by
} from 'protractor';

describe('Datepicker', () => {
  beforeEach(() => {
    SkyHostBrowser.get('visual/datepicker');
    SkyHostBrowser.setWindowBreakpoint('lg');
  });

  it('should match previous daypicker screenshot', (done) => {
    expect('#screenshot-datepicker-calendar').toMatchBaselineScreenshot(done, {
      screenshotName: 'daypicker'
    });
  });

  it('should match previous monthpicker screenshot', (done) => {
    element(by.css('.sky-datepicker-calendar-title')).click();
    expect('#screenshot-datepicker-calendar').toMatchBaselineScreenshot(done, {
      screenshotName: 'monthpicker'
    });
  });

  it('should match previous yearpicker screenshot', (done) => {
    element(by.css('.sky-datepicker-calendar-title')).click();
    element(by.css('.sky-datepicker-calendar-title')).click();
    expect('#screenshot-datepicker-calendar').toMatchBaselineScreenshot(done, {
      screenshotName: 'yearpicker'
    });
  });

  it('should match previous datepicker input screenshot', (done) => {
    expect('#screenshot-datepicker').toMatchBaselineScreenshot(done, {
      screenshotName: 'datepicker-input'
    });
  });

  it('should match previous datepicker input screenshot when open', (done) => {
    element(by.css('.sky-dropdown-button')).click();
    expect('#screenshot-datepicker').toMatchBaselineScreenshot(done, {
      screenshotName: 'datepicker-input-open'
    });
  });
});
