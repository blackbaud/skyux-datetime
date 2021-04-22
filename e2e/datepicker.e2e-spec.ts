import { expect, SkyHostBrowser, SkyVisualThemeSelector } from '@skyux-sdk/e2e';

import { element, by } from 'protractor';

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

  function validateAll() {
    it('should match previous daypicker screenshot', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-datepicker-calendar');

      expect('#screenshot-datepicker-calendar').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('datepicker-daypicker')
        }
      );
    });

    it('should match previous monthpicker screenshot', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-datepicker-calendar');
      await element(by.css('.sky-datepicker-calendar-title')).click();
      await SkyHostBrowser.moveCursorOffScreen();

      expect('#screenshot-datepicker-calendar').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('datepicker-monthpicker')
        }
      );
    });

    it('should match previous yearpicker screenshot', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-datepicker-calendar');
      await element(by.css('.sky-datepicker-calendar-title')).click();
      await element(by.css('.sky-datepicker-calendar-title')).click();
      await SkyHostBrowser.moveCursorOffScreen();

      expect('#screenshot-datepicker-calendar').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('datepicker-yearpicker')
        }
      );
    });

    it('should match previous datepicker input screenshot', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-datepicker');

      expect('#screenshot-datepicker').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('datepicker-input')
      });
    });

    it('should match previous datepicker input screenshot when open', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-datepicker');
      await element(by.css('.sky-datepicker button')).click();
      await SkyHostBrowser.moveCursorOffScreen();

      expect('#screenshot-datepicker').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('datepicker-input-open')
      });
    });

    it('should match previous datepicker input screenshot when invalid', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-datepicker');
      await element(by.css('#button-set-invalid-value')).click();
      await SkyHostBrowser.moveCursorOffScreen();
      await SkyHostBrowser.scrollTo('#screenshot-datepicker');

      expect('#screenshot-datepicker').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('datepicker-input-invalid')
      });
    });

    it('should match previous datepicker input screenshot', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-datepicker-input-box');

      expect('#screenshot-datepicker-input-box').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('datepicker-input-box')
        }
      );
    });

    it('should match previous datepicker input screenshot when disabled', async (done) => {
      await element(by.css('#toggle-disabled-btn')).click();
      await SkyHostBrowser.scrollTo('#screenshot-datepicker-input-box');

      expect('#screenshot-datepicker-input-box').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('datepicker-input-box-disabled')
        }
      );
    });
  }

  beforeEach(async () => {
    await SkyHostBrowser.get('visual/datepicker');
    await SkyHostBrowser.setWindowBreakpoint('lg');
  });

  validateAll();

  describe('when modern theme', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'light');
    });

    validateAll();
  });

  describe('when modern theme in dark mode', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'dark');
    });

    validateAll();
  });
});
