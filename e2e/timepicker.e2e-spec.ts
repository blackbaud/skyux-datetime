import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  by,
  element
} from 'protractor';

describe('timepicker', () => {
  beforeEach(() => {
    SkyHostBrowser.get('visual/timepicker');
    SkyHostBrowser.setWindowBreakpoint('lg');
  });

  it('should show the timepicker correctly for 12hr', (done) => {
    expect('#screenshot-timepicker12hr').toMatchBaselineScreenshot(done, {
      screenshotName: 'timepicker-12hr'
    });
  });

  it('should show the timpicker correctly for 24hr', (done) => {
    expect('#screenshot-timepicker24hr').toMatchBaselineScreenshot(done, {
      screenshotName: 'timepicker-24hr'
    });
  });

  it('should show the timepicker correctly after clicking on the icon for 12 hr', (done) => {
    element(by.css('#screenshot-timepicker12hr .sky-dropdown-button')).click();
    expect('#screenshot-timepicker12hr').toMatchBaselineScreenshot(done, {
      screenshotName: 'timepicker-12hr-open'
    });
  });

  it('should show the timepicker correctly after clicking on the icon for 24 hr', (done) => {
    element(by.css('#screenshot-timepicker24hr .sky-dropdown-button')).click();
    SkyHostBrowser.scrollTo('#screenshot-timepicker24hr');
    expect('#screenshot-timepicker24hr').toMatchBaselineScreenshot(done, {
      screenshotName: 'timepicker-24hr-open'
    });
  });
});
