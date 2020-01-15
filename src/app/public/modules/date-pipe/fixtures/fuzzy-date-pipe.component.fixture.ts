import {
  Component
} from '@angular/core';

import {
  SkyFuzzyDate
} from '../../datepicker/fuzzy-date';

import {
  SkyFuzzyDatePipe
} from '../fuzzy-date.pipe';

@Component({
  selector: 'date-pipe-test',
  templateUrl: './date-pipe.component.fixture.html'
})
export class FuzzyDatePipeTestComponent {

  public dateValue: SkyFuzzyDate = {
    year: 1955,
    month: 11
  };

  public format: string;

  public locale: string;

  constructor(
    private fuzzyDatePipe: SkyFuzzyDatePipe
  ) { }

  public getFuzzyDatePipeResult(
    value: SkyFuzzyDate,
    format: string,
    locale: string
  ): string {
    return this.fuzzyDatePipe.transform(value, format, locale);
  }
}
