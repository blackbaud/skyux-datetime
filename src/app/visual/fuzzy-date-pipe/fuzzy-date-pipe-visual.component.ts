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
  SkyFuzzyDatePipe
} from '../../public';

import {
  SkyFuzzyDate
} from '../../public/modules/datepicker/fuzzy-date';

@Component({
  selector: 'fuzzy-date-pipe-visual',
  templateUrl: './fuzzy-date-pipe-visual.component.html'
})
export class FuzzyDatePipeVisualComponent implements OnInit, OnDestroy {

  public fuzzyDate: SkyFuzzyDate = {
    month: 11,
    year: 1955
  };

  public format: string = 'MMM Y';

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

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private datePipe: SkyFuzzyDatePipe,
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
    const result = this.datePipe.transform({ month: 11, year: 1955 }, 'MMMM y', 'en-US');
    console.log('Result from calling pipe directly:', result);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public dateForDisplay(): string {
    return JSON.stringify(this.fuzzyDate);
  }

  public onResetClick(): void {
    this.locale = undefined;
    this.format = 'MMM y';
  }
}
