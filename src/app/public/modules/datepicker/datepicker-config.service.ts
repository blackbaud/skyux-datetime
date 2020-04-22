import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  Subject
} from 'rxjs';

const moment = require('moment');

import 'moment/min/locales.min';

@Injectable()
export class SkyDatepickerConfigService implements OnDestroy {

  private set locale(value: string) {
    moment.locale(value || 'en-US');
  }

  public dateFormat: string;

  public maxDate: Date;

  // How do max/min/stargin day work?
  public minDate: Date;

  public startingDay = 0;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private localeProvider: SkyAppLocaleProvider
  ) {
    this.localeProvider.getLocaleInfo()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((localeInfo) => {
        this.locale = localeInfo.locale;
      });

    this.dateFormat = moment.localeData().longDateFormat('L');
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
