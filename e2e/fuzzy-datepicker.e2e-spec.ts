import { expect, SkyHostBrowser } from '@skyux-sdk/e2e';

import { by, element } from 'protractor';

describe('Fuzzy datepicker', () => {
  beforeEach(() => {
    SkyHostBrowser.get('visual/fuzzy-datepicker');
    SkyHostBrowser.setWindowBreakpoint('lg');
  });

  it('should match previous daypicker screenshot', (done) => {
    expect('#screenshot-fuzzy-datepicker-calendar').toMatchBaselineScreenshot(
      done,
      {
        screenshotName: 'fuzzy-datepicker-daypicker'
      }
    );
  });

  it('should match previous monthpicker screenshot', (done) => {
    element(by.css('.sky-datepicker-calendar-title')).click();
    SkyHostBrowser.moveCursorOffScreen();
    expect('#screenshot-fuzzy-datepicker-calendar').toMatchBaselineScreenshot(
      done,
      {
        screenshotName: 'fuzzy-datepicker-monthpicker'
      }
    );
  });

  it('should match previous yearpicker screenshot', (done) => {
    element(by.css('.sky-datepicker-calendar-title')).click();
    element(by.css('.sky-datepicker-calendar-title')).click();
    SkyHostBrowser.moveCursorOffScreen();
    expect('#screenshot-fuzzy-datepicker-calendar').toMatchBaselineScreenshot(
      done,
      {
        screenshotName: 'fuzzy-datepicker-yearpicker'
      }
    );
  });

  it('should match previous fuzzy datepicker input screenshot', (done) => {
    expect('#screenshot-fuzzy-datepicker').toMatchBaselineScreenshot(done, {
      screenshotName: 'fuzzy-datepicker-input'
    });
  });

  it('should match previous fuzzy datepicker input screenshot when open', (done) => {
    element(by.css('.sky-datepicker button')).click();
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
