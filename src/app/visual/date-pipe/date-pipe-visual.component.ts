import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  Subject
} from 'rxjs';

import {
  SkyDatePipe
} from '../../public';

@Component({
  selector: 'date-pipe-visual',
  templateUrl: './date-pipe-visual.component.html'
})
export class DatePipeVisualComponent implements OnInit, OnDestroy {

  public format: string = 'short';

  // Pre-defined format options from SkyDateFormatUtility.
  public formatList: string[] = [
    'medium',
    'short',
    'fullDate',
    'longDate',
    'mediumDate',
    'shortDate',
    'mediumTime',
    'shortTime'
  ];

  public locale: string;

  public localeList: string[] = [
    'de-DE',
    'fr-FR',
    'en-CA',
    'es-ES',
    'en-GB',
    'en-US',
    'es-MX',
    'it-IT',
    'ja-JP',
    'pt-BR',
    'ru-RU',
    'zh-CN'
  ];

  public myDate = new Date('11/05/1955');

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private datePipe: SkyDatePipe,
    private localeProvider: SkyAppLocaleProvider
  ) {
    // Update locale to the browser's current locale.
    this.localeProvider.getLocaleInfo()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((localeInfo) => {
        this.locale = localeInfo.locale;
      });
  }

  public ngOnInit(): void {
    const result = this.datePipe.transform(new Date('01/01/2019'), 'short', 'en-US');
    console.log('Result from calling pipe directly:', result);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public dateForDisplay(): string {
    return JSON.stringify(this.myDate);
  }

  public onResetClick(): void {
    this.locale = 'en-US';
    this.format = 'short';
  }
}
