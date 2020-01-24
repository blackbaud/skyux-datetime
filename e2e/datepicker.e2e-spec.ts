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
      screenshotName: 'datepicker-daypicker'
    });
  });

  it('should match previous monthpicker screenshot', (done) => {
    element(by.css('.sky-datepicker-calendar-title')).click();
    SkyHostBrowser.moveCursorOffScreen();
    expect('#screenshot-datepicker-calendar').toMatchBaselineScreenshot(done, {
      screenshotName: 'datepicker-monthpicker'
    });
  });

  it('should match previous yearpicker screenshot', (done) => {
    element(by.css('.sky-datepicker-calendar-title')).click();
    element(by.css('.sky-datepicker-calendar-title')).click();
    SkyHostBrowser.moveCursorOffScreen();
    expect('#screenshot-datepicker-calendar').toMatchBaselineScreenshot(done, {
      screenshotName: 'datepicker-yearpicker'
    });
  });

  it('should match previous datepicker input screenshot', (done) => {
    expect('#screenshot-datepicker').toMatchBaselineScreenshot(done, {
      screenshotName: 'datepicker-input'
    });
  });

  it('should match previous datepicker input screenshot when open', (done) => {
    element(by.css('.sky-dropdown-button')).click();
    SkyHostBrowser.moveCursorOffScreen();
    expect('#screenshot-datepicker').toMatchBaselineScreenshot(done, {
      screenshotName: 'datepicker-input-open'
    });
  });

  it('should match previous datepicker input screenshot when invalid', (done) => {
    element(by.css('#button-set-invalid-value')).click();
    SkyHostBrowser.moveCursorOffScreen();
    SkyHostBrowser.scrollTo('#screenshot-datepicker');
    expect('#screenshot-datepicker').toMatchBaselineScreenshot(done, {
      screenshotName: 'datepicker-input-invalid'
    });
  });
});
