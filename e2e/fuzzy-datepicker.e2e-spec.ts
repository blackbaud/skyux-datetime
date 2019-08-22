import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  element,
  by
} from 'protractor';

describe('Fuzzy datepicker', () => {
  beforeEach(() => {
    SkyHostBrowser.get('visual/fuzzy-datepicker');
    SkyHostBrowser.setWindowBreakpoint('lg');
  });

  it('should match previous daypicker screenshot', (done) => {
    expect('#screenshot-fuzzy-datepicker-calendar').toMatchBaselineScreenshot(done, {
      screenshotName: 'daypicker'
    });
  });

  it('should match previous monthpicker screenshot', (done) => {
    element(by.css('.sky-datepicker-calendar-title')).click();
    SkyHostBrowser.moveCursorOffScreen();
    expect('#screenshot-fuzzy-datepicker-calendar').toMatchBaselineScreenshot(done, {
      screenshotName: 'monthpicker'
    });
  });

  it('should match previous yearpicker screenshot', (done) => {
    element(by.css('.sky-datepicker-calendar-title')).click();
    element(by.css('.sky-datepicker-calendar-title')).click();
    SkyHostBrowser.moveCursorOffScreen();
    expect('#screenshot-fuzzy-datepicker-calendar').toMatchBaselineScreenshot(done, {
      screenshotName: 'yearpicker'
    });
  });

  it('should match previous fuzzy datepicker input screenshot', (done) => {
    expect('#screenshot-fuzzy-datepicker').toMatchBaselineScreenshot(done, {
      screenshotName: 'fuzzy-datepicker-input'
    });
  });

  it('should match previous fuzzy datepicker input screenshot when open', (done) => {
    element(by.css('.sky-dropdown-button')).click();
    SkyHostBrowser.moveCursorOffScreen();
    expect('#screenshot-fuzzy-datepicker').toMatchBaselineScreenshot(done, {
      screenshotName: 'fuzzy-datepicker-input-open'
    });
  });

  it('should match previous fuzzy datepicker input screenshot when invalid', (done) => {
    element(by.css('#button-set-invalid-value')).click();
    SkyHostBrowser.moveCursorOffScreen();
    SkyHostBrowser.scrollTo('#screenshot-fuzzy-datepicker');
    expect('#screenshot-fuzzy-datepicker').toMatchBaselineScreenshot(done, {
      screenshotName: 'fuzzy-datepicker-input-invalid'
    });
  });
});
