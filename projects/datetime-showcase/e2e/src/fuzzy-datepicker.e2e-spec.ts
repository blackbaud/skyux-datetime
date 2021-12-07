import { expect, SkyHostBrowser } from '@skyux-sdk/e2e';

import { by, element } from 'protractor';

describe('Fuzzy datepicker', () => {
  beforeEach(async () => {
    await SkyHostBrowser.get('visual/fuzzy-datepicker');
    await SkyHostBrowser.setWindowBreakpoint('lg');
  });

  it('should match previous daypicker screenshot', (done) => {
    expect('#screenshot-fuzzy-datepicker-calendar').toMatchBaselineScreenshot(
      done,
      {
        screenshotName: 'fuzzy-datepicker-daypicker',
      }
    );
  });

  it('should match previous monthpicker screenshot', async (done) => {
    await element(by.css('.sky-datepicker-calendar-title')).click();
    await SkyHostBrowser.moveCursorOffScreen();
    expect('#screenshot-fuzzy-datepicker-calendar').toMatchBaselineScreenshot(
      done,
      {
        screenshotName: 'fuzzy-datepicker-monthpicker',
      }
    );
  });

  it('should match previous yearpicker screenshot', async (done) => {
    await element(by.css('.sky-datepicker-calendar-title')).click();
    await element(by.css('.sky-datepicker-calendar-title')).click();
    await SkyHostBrowser.moveCursorOffScreen();
    expect('#screenshot-fuzzy-datepicker-calendar').toMatchBaselineScreenshot(
      done,
      {
        screenshotName: 'fuzzy-datepicker-yearpicker',
      }
    );
  });

  it('should match previous fuzzy datepicker input screenshot', (done) => {
    expect('#screenshot-fuzzy-datepicker').toMatchBaselineScreenshot(done, {
      screenshotName: 'fuzzy-datepicker-input',
    });
  });

  it('should match previous fuzzy datepicker input screenshot when open', async (done) => {
    await element(by.css('.sky-datepicker button')).click();
    await SkyHostBrowser.moveCursorOffScreen();
    expect('#screenshot-fuzzy-datepicker').toMatchBaselineScreenshot(done, {
      screenshotName: 'fuzzy-datepicker-input-open',
    });
  });

  it('should match previous fuzzy datepicker input screenshot when invalid', async (done) => {
    await element(by.css('#button-set-invalid-value')).click();
    await SkyHostBrowser.moveCursorOffScreen();
    await SkyHostBrowser.scrollTo('#screenshot-fuzzy-datepicker');
    expect('#screenshot-fuzzy-datepicker').toMatchBaselineScreenshot(done, {
      screenshotName: 'fuzzy-datepicker-input-invalid',
    });
  });
});
