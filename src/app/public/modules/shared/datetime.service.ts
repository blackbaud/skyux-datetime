import {
  Injectable
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  Observable,
  Subject
} from 'rxjs';

const moment = require('moment');

/**
 * @internal
 */
@Injectable()
export class SkyDateTimeService {

  private _localeInfo = new Subject<{ locale: string; dateFormat: string; }>();

  constructor(
    localeProvider: SkyAppLocaleProvider
  ) {
    localeProvider.getLocaleInfo()
      .subscribe((localeInfo) => {

        moment.locale(localeInfo.locale || 'en-US');

        this._localeInfo.next({
          locale: localeInfo.locale,
          dateFormat: moment.localeData().longDateFormat('L')
        });
      });
  }

  public get localeInfo(): Observable<{ locale: string; dateFormat: string; }> {
    return this._localeInfo.asObservable();
  }

}
