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
    expect('#screenshot-timepicker12hr').toMatchBaselineScreenshot(done);
  });

  it('should show the timpicker correctly for 24hr', (done) => {
    expect('#screenshot-timepicker24hr').toMatchBaselineScreenshot(done);
  });

  it('should show the timepicker correctly after clicking on the icon for 12 hr', (done) => {
    element(by.css('#screenshot-timepicker12hr .sky-dropdown-button')).click();
    expect('#screenshot-timepicker12hr .sky-popover-body').toMatchBaselineScreenshot(done);
  });

  it('should show the timepicker correctly after clicking on the icon for 24 hr', (done) => {
    element(by.css('#screenshot-timepicker24hr .sky-dropdown-button')).click();
    expect('#screenshot-timepicker24hr .sky-popover-body').toMatchBaselineScreenshot(done);
  });
});
