import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  BehaviorSubject,
  Subject,
  Observable
} from 'rxjs';

const moment = require('moment');

import 'moment/min/locales.min';

@Injectable()
export class SkyDatepickerConfigService implements OnDestroy {

  public set dateFormat(value: string) {
    if (value !== this._dateFormat) {
      this._dateFormat = value;
      this._dateFormatChange.next();
    }
  }

  public get dateFormat(): string {
    return this._dateFormat || 'MM/DD/YYYY';
  }

  public set locale(value: string) {
    if (value !== this._locale) {
      this._locale = value;
      moment.locale(this.locale);
      this.localeStream.next(this._locale);
    }
  }

  public get locale(): string {
    return this._locale || 'en-US';
  }

  public get dateFormatChange(): Observable<void> {
    return this._dateFormatChange.asObservable();
  }

  public localeStream = new BehaviorSubject<string>(this.locale);

  public maxDate: Date;

  public minDate: Date;

  public startingDay = 0;

  private ngUnsubscribe = new Subject<void>();

  private _dateFormat: string;

  private _dateFormatChange = new Subject<void>();

  private _locale: string;

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this._dateFormatChange.complete();

    this._dateFormatChange =
      this.localeStream = undefined;
  }
}
