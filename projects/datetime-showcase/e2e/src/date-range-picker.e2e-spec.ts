import { expect, SkyHostBrowser, SkyVisualThemeSelector } from '@skyux-sdk/e2e';

import { SkyHostBrowserBreakpoint } from '@skyux-sdk/e2e/host-browser/host-browser-breakpoint';

import { by, element } from 'protractor';

describe('Date range picker', () => {
  //#region helpers
  let browserSize: SkyHostBrowserBreakpoint;
  let currentTheme: string;
  let currentThemeMode: string;

  async function selectTheme(theme: string, mode: string): Promise<void> {
    currentTheme = theme;
    currentThemeMode = mode;

    return SkyVisualThemeSelector.selectTheme(theme, mode);
  }

  async function setBrowserSize(size: SkyHostBrowserBreakpoint): Promise<void> {
    browserSize = size;

    return SkyHostBrowser.setWindowBreakpoint(size);
  }

  function getScreenshotName(name: string): string {
    if (browserSize) {
      name += '-' + browserSize;
    }

    if (currentTheme) {
      name += '-' + currentTheme;
    }

    if (currentThemeMode) {
      name += '-' + currentThemeMode;
    }

    return name;
  }

  function runTests(): void {
    it('should match previous `SpecificRange` screenshot', (done) => {
      expect('#screenshot-date-range-picker').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('date-range-picker-specific-range'),
      });
    });

    it('should match previous `Before` screenshot', async (done) => {
      await element(by.css('#screenshot-date-range-picker select')).click();
      await element
        .all(by.css('#screenshot-date-range-picker select option'))
        .get(1)
        .click();
      expect('#screenshot-date-range-picker').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('date-range-picker-before'),
      });
    });

    it('should match previous `After` screenshot', async (done) => {
      await element(by.css('#screenshot-date-range-picker select')).click();
      await element
        .all(by.css('#screenshot-date-range-picker select option'))
        .get(2)
        .click();
      expect('#screenshot-date-range-picker').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('date-range-picker-after'),
      });
    });

    it('should match previous default value screenshot', async (done) => {
      await element(by.css('#screenshot-date-range-picker select')).click();
      await element
        .all(by.css('#screenshot-date-range-picker select option'))
        .get(3)
        .click();
      expect('#screenshot-date-range-picker').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('date-range-picker-default-value'),
      });
    });
  }
  //#endregion

  describe('(size: lg)', () => {
    beforeEach(async () => {
      currentTheme = undefined;
      currentThemeMode = undefined;
      await SkyHostBrowser.get('visual/date-range-picker');
      await setBrowserSize('lg');
    });

    runTests();

    describe('when modern theme', () => {
      beforeEach(async () => {
        await selectTheme('modern', 'light');
      });

      runTests();
    });

    describe('when modern theme in dark mode', () => {
      beforeEach(async () => {
        await selectTheme('modern', 'dark');
      });

      runTests();
    });
  });

  describe('(size: xs)', () => {
    beforeEach(async () => {
      currentTheme = undefined;
      currentThemeMode = undefined;
      await SkyHostBrowser.get('visual/date-range-picker');
      await setBrowserSize('xs');
    });

    runTests();

    describe('when modern theme', () => {
      beforeEach(async () => {
        await selectTheme('modern', 'light');
      });

      runTests();
    });

    describe('when modern theme in dark mode', () => {
      beforeEach(async () => {
        await selectTheme('modern', 'dark');
      });

      runTests();
    });
  });
});
