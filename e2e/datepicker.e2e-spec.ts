import {
  expect,
  SkyHostBrowser,
  SkyVisualThemeSelector
} from '@skyux-sdk/e2e';

import {
  element,
  by
} from 'protractor';

describe('Datepicker', () => {
  let currentTheme: string;
  let currentThemeMode: string;

  async function selectTheme(theme: string, mode: string): Promise<void> {
    currentTheme = theme;
    currentThemeMode = mode;

    return SkyVisualThemeSelector.selectTheme(theme, mode);
  }

  function getScreenshotName(name: string): string {
    if (currentTheme) {
      name += '-' + currentTheme;
    }

    if (currentThemeMode) {
      name += '-' + currentThemeMode;
    }

    return name;
  }

  async function validateInputBox(done: DoneFn): Promise<void> {
    await SkyHostBrowser.scrollTo('#screenshot-datepicker-input-box');

    expect('#screenshot-datepicker-input-box').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName('datepicker-input-box')
    });
  }

  beforeEach(async () => {
    await SkyHostBrowser.get('visual/datepicker');
    await SkyHostBrowser.setWindowBreakpoint('lg');
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
    element(by.css('.sky-datepicker button')).click();
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

  it('should match previous datepicker input screenshot', (done) => {
    validateInputBox(done);
  });

  describe('when modern theme', () => {

    beforeEach(async () => {
      await selectTheme('modern', 'light');
    });

    it('should match previous datepicker input screenshot', (done) => {
      validateInputBox(done);
    });

  });

  describe('when modern theme in dark mode', () => {

    beforeEach(async () => {
      await selectTheme('modern', 'dark');
    });

    it('should match previous datepicker input screenshot', (done) => {
      validateInputBox(done);
    });

  });

});
