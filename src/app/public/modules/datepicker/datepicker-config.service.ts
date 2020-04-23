import {
  Injectable
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

const moment = require('moment');
import 'moment/min/locales.min';

@Injectable()
export class SkyDatepickerConfigService {
  public dateFormat: string;
  public minDate: Date;
  public maxDate: Date;
  public startingDay = 0;

  constructor(
    private windowRef: SkyAppWindowRef
  ) {
    const safeNavigator: any = this.windowRef.nativeWindow.navigator;

    /*istanbul ignore next */
    const userLanguage: string = (
      safeNavigator.languages &&
      safeNavigator.languages[0] ||
      safeNavigator.language ||
      safeNavigator.userLanguage ||
      'en'
    );

    moment.locale(userLanguage);

    this.dateFormat = moment.localeData().longDateFormat('L');
  }
}
