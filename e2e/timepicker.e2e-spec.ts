import { expect, SkyHostBrowser, SkyVisualThemeSelector } from '@skyux-sdk/e2e';

import { by, element } from 'protractor';

describe('timepicker', () => {
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

  function validateAll(): void {
    it('should show the timepicker correctly for 12hr', (done) => {
      expect('#screenshot-timepicker12hr').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('timepicker-12hr')
      });
    });

    it('should show the timpicker correctly for 24hr', (done) => {
      expect('#screenshot-timepicker24hr').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('timepicker-24hr')
      });
    });

    it('should show the timepicker correctly after clicking on the icon for 12 hr', async (done) => {
      await element(
        by.css('#screenshot-timepicker12hr .sky-timepicker button')
      ).click();

      expect('#screenshot-timepicker12hr').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('timepicker-12hr-open')
      });
    });

    it('should show the timepicker correctly after clicking on the icon for 24 hr', async (done) => {
      await element(
        by.css('#screenshot-timepicker24hr .sky-timepicker button')
      ).click();

      await SkyHostBrowser.scrollTo('#screenshot-timepicker24hr');

      expect('#screenshot-timepicker24hr').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('timepicker-24hr-open')
      });
    });

    it('should match previous timepicker input box screenshot', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-timepicker-input-box');

      expect('#screenshot-timepicker-input-box').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('timepicker-input-box')
        }
      );
    });
  }

  beforeEach(async () => {
    await SkyHostBrowser.get('visual/timepicker');
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
