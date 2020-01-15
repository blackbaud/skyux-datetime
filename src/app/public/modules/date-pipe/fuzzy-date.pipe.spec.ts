import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyAppLocaleInfo,
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  SkyFuzzyDate
} from '../datepicker/fuzzy-date';

import {
  FuzzyDatePipeTestModule
} from './fixtures/fuzzy-date-pipe.module.fixture';

import {
  FuzzyDatePipeTestComponent
} from './fixtures/fuzzy-date-pipe.component.fixture';

import {
  SkyFuzzyDatePipe
} from './fuzzy-date.pipe';

// #region helpers
function getFuzzyDateText(fixture: ComponentFixture<any>): string {
  return fixture.nativeElement.textContent.trim();
}
// #endregion

describe('Fuzzy date pipe', () => {
  let fixture: ComponentFixture<FuzzyDatePipeTestComponent>;
  let mockLocaleProvider: SkyAppLocaleProvider;
  let mockLocaleStream: BehaviorSubject<SkyAppLocaleInfo>;
  let component: FuzzyDatePipeTestComponent;

  beforeEach(() => {
    mockLocaleStream = new BehaviorSubject({
      locale: 'en-US'
    });

    mockLocaleProvider = {
      defaultLocale: 'en-US',
      getLocaleInfo: () => mockLocaleStream
    };

    TestBed.configureTestingModule({
      imports: [
        FuzzyDatePipeTestModule
      ],
      providers: [
        {
          provide: SkyAppLocaleProvider,
          useValue: mockLocaleProvider
        }
      ]
    });

    fixture = TestBed.createComponent(FuzzyDatePipeTestComponent);
    component = fixture.componentInstance;
  });

  it('should format a fuzzy date object', () => {
    fixture.detectChanges();
    const value = getFuzzyDateText(fixture);

    expect(value).toEqual('Nov 1955');
  });

  it('should ignore empty values', () => {
    component.dateValue = undefined;
    fixture.detectChanges();
    const value = getFuzzyDateText(fixture);

    expect(value).toEqual('');
  });

  it('should support changing locale inline', () => {
    component.locale = 'fr-FR';
    fixture.detectChanges();
    const value = getFuzzyDateText(fixture);

    expect(value).toEqual('nov. 1955');
  });

  it('should respect locale set by SkyAppLocaleProvider', () => {
    fixture.detectChanges();
    let value = getFuzzyDateText(fixture);

    expect(value).toEqual('Nov 1955');

    mockLocaleStream.next({
      locale: 'fr-FR'
    });
    fixture.detectChanges();

    expect(value).toEqual('nov. 1955');
  });

  // TODO: shouldn't this always be current locale instead of en-US?
  it('should default to en-US locale', () => {
    const date: SkyFuzzyDate = {
      year: 1955,
      month: 11
    };
    const fuzzyDatePipe = new SkyFuzzyDatePipe(mockLocaleProvider);
    const value = fuzzyDatePipe.transform(date, 'MMMM y');

    expect(value).toEqual('Nov 1955');
    expect(fuzzyDatePipe['defaultLocale']).toEqual('en-US');
  });

  it('should work as an injectable', () => {
    fixture.detectChanges();
    const date: SkyFuzzyDate = {
      year: 1955,
      month: 11
    };
    const value = component.getFuzzyDatePipeResult(
      date,
      'MMMM y',
      'fr-CA'
    );

    expect(value).toEqual('Nov 1955');
  });
});
