import {
  TestBed,
  ComponentFixture
} from '@angular/core/testing';

import {
  SkyAppLocaleInfo,
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  expect
} from '@skyux-sdk/testing';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/take';

import {
  SkyDatePipe
} from './date.pipe';

import {
  DatePipeTestComponent
} from './fixtures/date-pipe.component.fixture';

import {
  DatePipeTestModule
} from './fixtures/date-pipe.module.fixture';

describe('Date pipe', () => {
  let fixture: ComponentFixture<DatePipeTestComponent>;
  let mockLocaleProvider: SkyAppLocaleProvider;
  let mockLocaleStream: BehaviorSubject<SkyAppLocaleInfo>;

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
        DatePipeTestModule
      ],
      providers: [
        {
          provide: SkyAppLocaleProvider,
          useValue: mockLocaleProvider
        }
      ]
    });

    fixture = TestBed.createComponent(DatePipeTestComponent);
  });

  it('should format a date object', () => {
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent;
    expect(value.trim()).toEqual('1/1/2000, 12:00 AM');
  });

  it('should support Angular DatePipe formats', () => {
    fixture.componentInstance.format = 'fullDate';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent;
    expect(value.trim()).toEqual('Saturday, January 1, 2000');
  });

  it('should support changing locale inline', () => {
    fixture.componentInstance.locale = 'fr-CA';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent;
    expect(value.trim()).toEqual('2000-01-01 00 h 00');
  });

  it('should respect locale set by SkyAppLocaleProvider', () => {
    fixture.detectChanges();

    let value = fixture.nativeElement.textContent;
    expect(value.trim()).toEqual('1/1/2000, 12:00 AM');

    mockLocaleStream.next({
      locale: 'fr-CA'
    });

    fixture.detectChanges();

    value = fixture.nativeElement.textContent;
    expect(value.trim()).toEqual('2000-01-01 00 h 00');
  });

  it('should only transform if the value is set', () => {
    const date = new Date('01/01/2001');
    const pipe = new SkyDatePipe(mockLocaleProvider);

    const spy = spyOn(pipe['ngDatePipe'], 'transform').and.callThrough();

    pipe.transform(date).take(1).subscribe(() => {
      expect(spy.calls.count()).toEqual(1);
      spy.calls.reset();

      pipe.transform(undefined).take(1).subscribe(() => {
        expect(spy.calls.count()).toEqual(0);
      });
    });
  });

  it('should default to en-US locale', () => {
    const date = new Date('01/01/2001');
    const pipe = new SkyDatePipe(mockLocaleProvider);

    pipe.transform(date, 'short').take(1).subscribe((value) => {
      expect(value).toEqual('1/1/2001, 12:00 AM');
      expect(pipe['locale']).toEqual('en-US');
    });
  });
});
