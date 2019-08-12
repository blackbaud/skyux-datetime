import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
  async
} from '@angular/core/testing';

import {
  NgModel
} from '@angular/forms';

import {
  By
} from '@angular/platform-browser';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  DatepickerTestComponent
} from './fixtures/datepicker.component.fixture';

import {
  DatepickerNoFormatTestComponent
} from './fixtures/datepicker-noformat.component.fixture';

import {
  SkyDatepickerConfigService
} from './datepicker-config.service';

import {
  SkyDatepickerComponent
} from './datepicker.component';

import {
  DatepickerReactiveTestComponent
} from './fixtures/datepicker-reactive.component.fixture';

import {
  DatepickerTestModule
} from './fixtures/datepicker.module.fixture';
import { FuzzyDatepickerTestModule } from './fixtures/fuzzy-datepicker.module.fixture';
import { FuzzyDatepickerNoFormatTestComponent } from './fixtures/fuzzy-datepicker-noformat.component.fixture';
import { FuzzyDatepickerTestComponent } from './fixtures/fuzzy-datepicker.component.fixture';
import { FuzzyDatepickerReactiveTestComponent } from './fixtures/fuzzy-datepicker-reactive.component.fixture';
import { SkyFuzzyDateFactory } from './fuzzy-date-factory';

const moment = require('moment');

describe('datepicker', () => {

  function openDatepicker(element: HTMLElement, compFixture: ComponentFixture<any>) {
    let dropdownButtonEl = element.querySelector('.sky-dropdown-button') as HTMLElement;
    dropdownButtonEl.click();
    compFixture.detectChanges();
  }

  function setInput(
    element: HTMLElement,
    text: string,
    fixture: ComponentFixture<any>
  ) {
    const inputEl = element.querySelector('input');
    inputEl.value = text;
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(inputEl, 'change');
    fixture.detectChanges();
    tick();
  }

  function blurInput(
    element: HTMLElement,
    fixture: ComponentFixture<any>
  ) {
    const inputEl = element.querySelector('input');
    SkyAppTestUtility.fireDomEvent(inputEl, 'blur');

    fixture.detectChanges();
    tick();
  }

  describe('datepicker input', () => {
    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [
          DatepickerTestModule
        ]
      });

      spyOn(console, 'warn');
    });

    describe('nonstandard configuration', () => {
      let fixture: ComponentFixture<DatepickerNoFormatTestComponent>;
      let component: DatepickerNoFormatTestComponent;
      let nativeElement: HTMLElement;

      beforeEach(function () {
        fixture = TestBed.overrideComponent(SkyDatepickerComponent, {
          add: {
            providers: [
              {
                provide: SkyDatepickerConfigService,
                useValue: {
                  dateFormat: 'DD/MM/YYYY'
                }
              }
            ]
          }
        }).createComponent(DatepickerNoFormatTestComponent);

        nativeElement = fixture.nativeElement as HTMLElement;
        component = fixture.componentInstance;
      });

      it('should handle different format from configuration', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(nativeElement, '5/12/2017', fixture);

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');

        expect(component.selectedDate).toEqual(new Date('12/05/2017'));
      }));
    });

    describe('standard configuration', () => {
      let fixture: ComponentFixture<DatepickerTestComponent>;
      let component: DatepickerTestComponent;
      let nativeElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(DatepickerTestComponent);
        nativeElement = fixture.nativeElement as HTMLElement;
        component = fixture.componentInstance;
      });

      it('should throw an error if directive is added in isolation', function () {
        try {
          component.showInvalidDirective = true;
          fixture.detectChanges();
        } catch (err) {
          expect(err.message).toContain('skyDatepickerInput');
        }
      });

      it('should mark the control as dirty on keyup', function () {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);
        expect(ngModel.dirty).toEqual(false);
        SkyAppTestUtility.fireDomEvent(inputElement.nativeElement, 'keyup');
        fixture.detectChanges();
        expect(ngModel.dirty).toEqual(true);
      });

      it('should create the component with the appropriate styles', () => {
        fixture.detectChanges();
        expect(nativeElement.querySelector('input')).toHaveCssClass('sky-form-control');
        expect(nativeElement
          .querySelector('.sky-input-group .sky-input-group-btn .sky-dropdown-button'))
          .not.toBeNull();
      });

      it('should apply aria-label to the datepicker input when none is provided', () => {
        fixture.detectChanges();
        expect(nativeElement.querySelector('input').getAttribute('aria-label')).toBe('Date input field');
      });

      it('should not overwrite aria-label on the datepicker input when one is provided', () => {
        nativeElement.querySelector('input').setAttribute('aria-label', 'This is a date field.');
        fixture.detectChanges();
        expect(nativeElement.querySelector('input').getAttribute('aria-label')).toBe('This is a date field.');
      });

      it('should keep the calendar open on mode change', fakeAsync(() => {
        fixture.detectChanges();
        openDatepicker(nativeElement, fixture);
        tick();
        fixture.detectChanges();
        tick();

        let dropdownMenuEl = nativeElement.querySelector('.sky-popover-container');
        expect(dropdownMenuEl).not.toHaveCssClass('sky-popover-hidden');

        let titleEl = nativeElement.querySelector('.sky-datepicker-calendar-title') as HTMLButtonElement;

        titleEl.click();
        tick();
        fixture.detectChanges();
        tick();

        dropdownMenuEl = nativeElement.querySelector('.sky-popover-container');
        expect(dropdownMenuEl).not.toHaveCssClass('sky-popover-hidden');
      }));

      it('should pass date back when date is selected in calendar', fakeAsync(() => {
        component.selectedDate = new Date('5/12/2017');
        fixture.detectChanges();
        openDatepicker(nativeElement, fixture);
        tick();
        fixture.detectChanges();
        tick();

        expect(nativeElement.querySelector('td .sky-datepicker-btn-selected'))
          .toHaveText('12');

        expect(nativeElement.querySelector('.sky-datepicker-calendar-title'))
          .toHaveText('May 2017');

        // Click May 2nd
        let dateButtonEl
          = nativeElement
            .querySelectorAll('tbody tr td .sky-btn-default').item(2) as HTMLButtonElement;

        dateButtonEl.click();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.selectedDate).toEqual(new Date('5/2/2017'));
        expect(nativeElement.querySelector('input').value).toBe('05/02/2017');
      }));

      it('should be accessible', async(() => {
        fixture.detectChanges();
        openDatepicker(nativeElement, fixture);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(fixture.nativeElement).toBeAccessible();
        });
      }));

      describe('initialization', () => {
        it('should handle initializing with a Date object', fakeAsync(() => {
          component.selectedDate = new Date('5/12/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
        }));

        it('should handle initializing with a string with the expected format', fakeAsync(() => {
          component.selectedDate = '5/12/2017';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');

          expect(component.selectedDate).toEqual(new Date('05/12/2017'));
        }));

        it('should handle initializing with a ISO string', fakeAsync(() => {
          component.selectedDate = '2009-06-15T00:00:01';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('06/15/2009');

          expect(component.selectedDate)
            .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
        }));

        it('should handle initializing with an ISO string with offset', fakeAsync(() => {
          component.selectedDate = '1994-11-05T08:15:30-05:00';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('11/05/1994');

          expect(component.selectedDate)
            .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
        }));

        it('should handle two digit years', fakeAsync(() => {
          component.selectedDate = '5/12/17';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');

          expect(component.selectedDate).toEqual(new Date('05/12/2017'));
        }));

        it('should handle undefined initialization', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('');

          expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
        }));
      });

      describe('input change', () => {
        it('should handle input change with a string with the expected format', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(nativeElement, '5/12/2017', fixture);
          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
          expect(component.selectedDate).toEqual(new Date('5/12/2017'));
        }));

        it('should handle input change with a ISO string', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '2009-06-15T00:00:01', fixture);
          expect(nativeElement.querySelector('input').value).toBe('06/15/2009');
          expect(component.selectedDate)
            .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
        }));

        it('should handle input change with an ISO string with offset', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '1994-11-05T08:15:30-05:00', fixture);

          expect(nativeElement.querySelector('input').value).toBe('11/05/1994');

          expect(component.selectedDate)
            .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
        }));

        it('should handle two digit years', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '5/12/98', fixture);

          expect(nativeElement.querySelector('input').value).toBe('05/12/1998');

          expect(component.selectedDate).toEqual(new Date('05/12/1998'));
        }));

        it('should handle undefined date', fakeAsync(() => {
          component.selectedDate = '5/12/17';

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          component.selectedDate = undefined;
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('');
          expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
        }));

        it('should pass date to calendar', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '5/12/2017', fixture);

          openDatepicker(nativeElement, fixture);
          tick();
          fixture.detectChanges();
          tick();

          expect(nativeElement.querySelector('td .sky-datepicker-btn-selected'))
            .toHaveText('12');

          expect(nativeElement.querySelector('.sky-datepicker-calendar-title'))
            .toHaveText('May 2017');
        }));
      });

      describe('formats', () => {
        it('should handle a dateFormat on the input different than the default', fakeAsync(() => {
          component.format = 'DD/MM/YYYY';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(nativeElement, '5/12/2017', fixture);

          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');

          expect(component.selectedDate).toEqual(new Date('12/05/2017'));
        }));
      });

      describe('model change', () => {
        it('should handle model change with a Date object', fakeAsync(() => {
          fixture.detectChanges();
          component.selectedDate = new Date('5/12/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
        }));

        it('should handle model change with a string with the expected format', fakeAsync(() => {
          fixture.detectChanges();
          component.selectedDate = '5/12/2017';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
          expect(component.selectedDate).toEqual(new Date('5/12/2017'));
        }));

        it('should handle model change with a ISO string', fakeAsync(() => {
          fixture.detectChanges();
          component.selectedDate = '2009-06-15T00:00:01';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('06/15/2009');
          expect(component.selectedDate)
            .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
        }));

        it('should handle model change with an ISO string with offset', fakeAsync(() => {
          fixture.detectChanges();
          component.selectedDate = '1994-11-05T08:15:30-05:00';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('11/05/1994');

          expect(component.selectedDate)
            .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
        }));

        it('should handle two digit years', fakeAsync(() => {
          fixture.detectChanges();
          component.selectedDate = '5/12/98';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('05/12/1998');

          expect(component.selectedDate).toEqual(new Date('05/12/1998'));
        }));
      });

      describe('validation', () => {
        let ngModel: NgModel;
        beforeEach(() => {
          let inputElement = fixture.debugElement.query(By.css('input'));
          ngModel = <NgModel>inputElement.injector.get(NgModel);
        });

        it('should validate properly when invalid date is passed through input change',
          fakeAsync(() => {
            fixture.detectChanges();
            tick();
            setInput(nativeElement, 'abcdebf', fixture);
            fixture.detectChanges();

            expect(nativeElement.querySelector('input').value).toBe('abcdebf');

            expect(component.selectedDate).toBe('abcdebf');

            expect(ngModel.valid).toBe(false);
            expect(ngModel.pristine).toBe(false);
            expect(ngModel.touched).toBe(true);

          }));

        it('should validate properly when invalid date on initialization', fakeAsync(() => {
          component.selectedDate = 'abcdebf';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.selectedDate)
            .toBe('abcdebf');

          expect(ngModel.valid).toBe(false);

          expect(ngModel.touched).toBe(true);

          blurInput(fixture.nativeElement, fixture);
          expect(ngModel.valid).toBe(false);
          expect(ngModel.touched).toBe(true);
        }));

        it('should validate properly when invalid date on model change', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          component.selectedDate = 'abcdebf';

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.selectedDate)
            .toBe('abcdebf');

          expect(ngModel.valid).toBe(false);

        }));

        it('should validate properly when input changed to empty string', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);

          setInput(fixture.nativeElement, '', fixture);

          expect(nativeElement.querySelector('input').value).toBe('');

          expect(component.selectedDate)
            .toBe('');

          expect(ngModel.valid).toBe(true);
        }));

        it('should handle invalid and then valid date', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);

          setInput(fixture.nativeElement, '2/12/2015', fixture);

          expect(nativeElement.querySelector('input').value).toBe('02/12/2015');

          expect(component.selectedDate)
            .toEqual(new Date('2/12/2015'));

          expect(ngModel.valid).toBe(true);
        }));

        it('should handle calendar date on invalid date', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);
          tick();

          openDatepicker(fixture.nativeElement, fixture);
          tick();
        }));

        it('should handle noValidate property', fakeAsync(() => {
          component.noValidate = true;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.selectedDate)
            .toBe('abcdebf');

          expect(ngModel.valid).toBe(true);

        }));
      });

      describe('min max date', () => {

        let ngModel: NgModel;
        beforeEach(() => {
          let inputElement = fixture.debugElement.query(By.css('input'));
          ngModel = <NgModel>inputElement.injector.get(NgModel);
        });
        it('should handle change above max date', fakeAsync(() => {
          component.selectedDate = new Date('5/21/2017');
          component.maxDate = new Date('5/25/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, '5/26/2017', fixture);

          expect(ngModel.valid).toBe(false);

        }));

        it('should handle change below min date', fakeAsync(() => {
          component.selectedDate = new Date('5/21/2017');
          component.minDate = new Date('5/4/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, '5/1/2017', fixture);

          expect(ngModel.valid).toBe(false);
        }));

        it('should pass max date to calendar', fakeAsync(() => {
          component.selectedDate = new Date('5/21/2017');
          component.maxDate = new Date('5/25/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          openDatepicker(fixture.nativeElement, fixture);
          tick();

          let dateButtonEl
            = fixture.nativeElement
              .querySelectorAll('tbody tr td .sky-btn-default').item(30) as HTMLButtonElement;

          expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
        }));

        it('should pass min date to calendar', fakeAsync(() => {
          component.selectedDate = new Date('5/21/2017');
          component.minDate = new Date('5/4/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          openDatepicker(fixture.nativeElement, fixture);
          tick();

          let dateButtonEl
            = fixture.nativeElement
              .querySelectorAll('tbody tr td .sky-btn-default').item(1) as HTMLButtonElement;

          expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
        }));

        it('should pass starting day to calendar', fakeAsync(() => {
          component.selectedDate = new Date('5/21/2017');
          component.startingDay = 5;
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          openDatepicker(fixture.nativeElement, fixture);
          tick();

          let firstDayCol = fixture.nativeElement
            .querySelectorAll('.sky-datepicker-center.sky-datepicker-weekdays').item(0) as HTMLElement;

          expect(firstDayCol.textContent).toContain('Fr');
        }));
      });

      describe('disabled state', () => {

        it('should disable the input and dropdown when disable is set to true', fakeAsync(() => {
          component.isDisabled = true;
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
          expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
          expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeTruthy();
        }));

        it('should not disable the input and dropdown when disable is set to false', () => {
          component.isDisabled = false;
          fixture.detectChanges();

          expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
          expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
          expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeFalsy();
        });

      });

      describe('detectInputValueChange', () => {
        it('updates selectedDate without a change event', fakeAsync(() => {
          const inputEl = nativeElement.querySelector('input');
          const initialDate = '01/01/2019';
          const newDate = '12/31/2019';
           component.selectedDate = initialDate;
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe(initialDate);
          expect(component.selectedDate).toEqual(new Date(initialDate));
          tick();
          fixture.detectChanges();

          inputEl.value = newDate;

          expect(nativeElement.querySelector('input').value).toBe(newDate);
          expect(component.selectedDate).toEqual(new Date(initialDate));
            fixture.detectChanges();

          component.inputDirective.detectInputValueChange();

          expect(nativeElement.querySelector('input').value).toBe(newDate);
          expect(component.selectedDate).toEqual(new Date(newDate));
        }));

       });
    });

    describe('reactive form', () => {
      let fixture: ComponentFixture<DatepickerReactiveTestComponent>;
      let component: DatepickerReactiveTestComponent;
      let nativeElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(DatepickerReactiveTestComponent);
        nativeElement = fixture.nativeElement as HTMLElement;
        component = fixture.componentInstance;
      });

      afterEach(() => {
        fixture.destroy();
      });

      describe('initial value', () => {
        it('should set the initial value correctly', fakeAsync(() => {
          component.initialValue = '5/12/2017';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
          expect(component.dateControl.value).toEqual(new Date('5/12/2017'));
        }));
      });

      describe('input change', () => {
        it('should handle input change with a string with the expected format', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(nativeElement, '5/12/2017', fixture);
          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
          expect(component.dateControl.value).toEqual(new Date('5/12/2017'));
        }));

        it('should handle input change with a ISO string', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '2009-06-15T00:00:01', fixture);
          expect(nativeElement.querySelector('input').value).toBe('06/15/2009');
          expect(component.dateControl.value)
            .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
        }));

        it('should handle input change with an ISO string with offset', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '1994-11-05T08:15:30-05:00', fixture);

          expect(nativeElement.querySelector('input').value).toBe('11/05/1994');

          expect(component.dateControl.value)
            .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
        }));

        it('should handle two digit years', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '5/12/98', fixture);

          expect(nativeElement.querySelector('input').value).toBe('05/12/1998');

          expect(component.dateControl.value).toEqual(new Date('05/12/1998'));
        }));

        it('should handle undefined date', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue('5/12/17');

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          component.dateControl.setValue(undefined);
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('');
          expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
        }));

        it('should pass date to calendar', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '5/12/2017', fixture);

          openDatepicker(nativeElement, fixture);
          tick();
          fixture.detectChanges();
          tick();

          expect(nativeElement.querySelector('td .sky-datepicker-btn-selected'))
            .toHaveText('12');

          expect(nativeElement.querySelector('.sky-datepicker-calendar-title'))
            .toHaveText('May 2017');
        }));
      });

      describe('model change', () => {
        it('should handle model change with a Date object', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue(new Date('5/12/2017'));
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
        }));

        it('should handle model change with a string with the expected format', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue('5/12/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
          expect(component.dateControl.value).toEqual(new Date('5/12/2017'));
        }));

        it('should handle model change with a ISO string', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue('2009-06-15T00:00:01');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('06/15/2009');
          expect(component.dateControl.value)
            .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
        }));

        it('should handle model change with an ISO string with offset', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue('1994-11-05T08:15:30-05:00');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('11/05/1994');

          expect(component.dateControl.value)
            .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
        }));

        it('should handle two digit years', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue('5/12/98');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('05/12/1998');

          expect(component.dateControl.value).toEqual(new Date('05/12/1998'));
        }));
      });

      describe('Angular form control statuses', function () {
        it('should set correct statuses when initialized without value', fakeAsync(function () {
          fixture.componentInstance.initialValue = undefined;
          fixture.detectChanges();
          tick();

          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(true);
          expect(component.dateControl.touched).toBe(false);
        }));

        it('should set correct statuses when initialized with value', fakeAsync(function () {
          fixture.componentInstance.initialValue = '1/1/2000';
          fixture.detectChanges();
          tick();

          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(true);
          expect(component.dateControl.touched).toBe(false);
        }));

        it('should set correct statuses after user types within input', fakeAsync(function () {
          fixture.detectChanges();
          tick();

          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(true);
          expect(component.dateControl.touched).toBe(false);

          setInput(nativeElement, '1/1/2000', fixture);
          blurInput(nativeElement, fixture);
          fixture.detectChanges();
          tick();

          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(false);
          expect(component.dateControl.touched).toBe(true);
        }));

        it('should set correct statuses after user selects from calendar', fakeAsync(function () {
          fixture.detectChanges();
          tick();

          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(true);
          expect(component.dateControl.touched).toBe(false);

          openDatepicker(fixture.nativeElement, fixture);
          tick();
          fixture.detectChanges();
          tick();

          fixture.nativeElement.querySelector('.sky-datepicker-btn-selected').click();
          fixture.detectChanges();
          tick();

          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(false);
          expect(component.dateControl.touched).toBe(true);
        }));
      });

      describe('validation', () => {

        it('should validate properly when invalid date is passed through input change',
          fakeAsync(() => {
            fixture.detectChanges();
            tick();
            setInput(nativeElement, 'abcdebf', fixture);
            fixture.detectChanges();

            expect(nativeElement.querySelector('input').value).toBe('abcdebf');

            expect(component.dateControl.value).toBe('abcdebf');

            expect(component.dateControl.valid).toBe(false);
            expect(component.dateControl.pristine).toBe(false);
            expect(component.dateControl.touched).toBe(true);

          }));

        it('should validate properly when invalid date on initialization', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue('abcdebf');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.dateControl.value)
            .toBe('abcdebf');

          expect(component.dateControl.valid).toBe(false);

          expect(component.dateControl.touched).toBe(true);

          blurInput(fixture.nativeElement, fixture);
          expect(component.dateControl.valid).toBe(false);
          expect(component.dateControl.touched).toBe(true);
        }));

        it('should validate properly when invalid date on model change', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          component.dateControl.setValue('abcdebf');

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.dateControl.value)
            .toBe('abcdebf');

          expect(component.dateControl.valid).toBe(false);

        }));

        it('should validate properly when input changed to empty string', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);

          setInput(fixture.nativeElement, '', fixture);

          expect(nativeElement.querySelector('input').value).toBe('');

          expect(component.dateControl.value)
            .toBe('');

          expect(component.dateControl.valid).toBe(true);
        }));

        it('should handle invalid and then valid date', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);

          setInput(fixture.nativeElement, '2/12/2015', fixture);

          expect(nativeElement.querySelector('input').value).toBe('02/12/2015');

          expect(component.dateControl.value)
            .toEqual(new Date('2/12/2015'));

          expect(component.dateControl.valid).toBe(true);
        }));

        it('should handle calendar date on invalid date', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);
          tick();

          openDatepicker(fixture.nativeElement, fixture);
          tick();
        }));

        it('should handle noValidate property', fakeAsync(() => {
          component.noValidate = true;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.dateControl.value)
            .toBe('abcdebf');

          expect(component.dateControl.valid).toBe(true);

        }));
      });

      describe('min max date', () => {
        it('should handle change above max date', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue(new Date('5/21/2017'));
          component.maxDate = new Date('5/25/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, '5/26/2017', fixture);

          expect(component.dateControl.valid).toBe(false);

        }));

        it('should handle change below min date', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue(new Date('5/21/2017'));
          component.minDate = new Date('5/4/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, '5/1/2017', fixture);

          expect(component.dateControl.valid).toBe(false);
        }));

        it('should pass max date to calendar', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue(new Date('5/21/2017'));
          component.maxDate = new Date('5/25/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          openDatepicker(fixture.nativeElement, fixture);
          tick();

          let dateButtonEl
            = fixture.nativeElement
              .querySelectorAll('tbody tr td .sky-btn-default').item(30) as HTMLButtonElement;

          expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
        }));

        it('should pass min date to calendar', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue(new Date('5/21/2017'));
          component.minDate = new Date('5/4/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          openDatepicker(fixture.nativeElement, fixture);
          tick();

          let dateButtonEl
            = fixture.nativeElement
              .querySelectorAll('tbody tr td .sky-btn-default').item(1) as HTMLButtonElement;

          expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
        }));

        it('should pass starting day to calendar', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue(new Date('5/21/2017'));
          component.startingDay = 5;
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          openDatepicker(fixture.nativeElement, fixture);
          tick();

          let firstDayCol = fixture.nativeElement
            .querySelectorAll('.sky-datepicker-center.sky-datepicker-weekdays').item(0) as HTMLElement;

          expect(firstDayCol.textContent).toContain('Fr');
        }));
      });

      describe('disabled state', () => {

        it('should disable the input and dropdown when disable is set to true', () => {
          fixture.detectChanges();
          component.dateControl.disable();
          fixture.detectChanges();

          expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
          expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
          expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeTruthy();
        });

        it('should not disable the input and dropdown when disable is set to false', () => {
          fixture.detectChanges();
          component.dateControl.enable();
          fixture.detectChanges();

          expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
          expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
          expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeFalsy();
        });

      });

    });

    describe('default locale configuration', () => {
      let fixture: ComponentFixture<DatepickerNoFormatTestComponent>;
      let component: DatepickerNoFormatTestComponent;
      let nativeElement: HTMLElement;

      class MockWindowService {
        public getWindow() {
          return {
            navigator: {
              languages: ['es']
            }
          };
        }
      }

      let mockWindowService = new MockWindowService();
      beforeEach(() => {
        TestBed.overrideProvider(
          SkyWindowRefService,
          {
            useValue: mockWindowService
          }
        );

        fixture = TestBed.createComponent(DatepickerNoFormatTestComponent);
        nativeElement = fixture.nativeElement as HTMLElement;
        component = fixture.componentInstance;

        fixture.detectChanges();
      });

      it('should display formatted date based on locale by default', fakeAsync(() => {
        component.selectedDate = new Date('10/24/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('24/10/2017');
      }));
    });
  });

  describe('fuzzy datepicker input', () => {
    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [
          FuzzyDatepickerTestModule
        ],
        providers: [
          SkyFuzzyDateFactory
        ]
      });

      spyOn(console, 'warn');
    });

    describe('nonstandard configuration', () => {
      let fixture: ComponentFixture<FuzzyDatepickerNoFormatTestComponent>;
      let component: FuzzyDatepickerNoFormatTestComponent;
      let nativeElement: HTMLElement;

      beforeEach(function () {
        fixture = TestBed.overrideComponent(SkyDatepickerComponent, {
          add: {
            providers: [
              {
                provide: SkyDatepickerConfigService,
                useValue: {
                  dateFormat: 'DD/MM/YYYY'
                }
              }
            ]
          }
        }).createComponent(FuzzyDatepickerNoFormatTestComponent);

        nativeElement = fixture.nativeElement as HTMLElement;
        component = fixture.componentInstance;
      });

      it('should handle different format from configuration', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(nativeElement, '5/12/2017', fixture);

        expect(nativeElement.querySelector('input').value).toBe('5/12/2017');

        expect(component.selectedDate).toEqual({ day: 5, month: 12, year: 2017 });
      }));
    });

    describe('standard configuration', () => {
      let fixture: ComponentFixture<FuzzyDatepickerTestComponent>;
      let component: FuzzyDatepickerTestComponent;
      let nativeElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(FuzzyDatepickerTestComponent);
        nativeElement = fixture.nativeElement as HTMLElement;
        component = fixture.componentInstance;
      });

      it('should throw an error if directive is added in isolation', function () {
        try {
          component.showInvalidDirective = true;
          fixture.detectChanges();
        } catch (err) {
          expect(err.message).toContain('skyFuzzyDatepickerInput');
        }
      });

      it('should mark the control as dirty on keyup', function () {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);
        expect(ngModel.dirty).toEqual(false);
        SkyAppTestUtility.fireDomEvent(inputElement.nativeElement, 'keyup');
        fixture.detectChanges();
        expect(ngModel.dirty).toEqual(true);
      });

      it('should create the component with the appropriate styles', () => {
        fixture.detectChanges();
        expect(nativeElement.querySelector('input')).toHaveCssClass('sky-form-control');
        expect(nativeElement
          .querySelector('.sky-input-group .sky-input-group-btn .sky-dropdown-button'))
          .not.toBeNull();
      });

      it('should apply aria-label to the datepicker input when none is provided', () => {
        fixture.detectChanges();
        expect(nativeElement.querySelector('input').getAttribute('aria-label')).toBe('Date input field');
      });

      it('should not overwrite aria-label on the datepicker input when one is provided', () => {
        nativeElement.querySelector('input').setAttribute('aria-label', 'This is a date field.');
        fixture.detectChanges();
        expect(nativeElement.querySelector('input').getAttribute('aria-label')).toBe('This is a date field.');
      });

      it('should keep the calendar open on mode change', fakeAsync(() => {
        fixture.detectChanges();
        openDatepicker(nativeElement, fixture);
        tick();
        fixture.detectChanges();
        tick();

        let dropdownMenuEl = nativeElement.querySelector('.sky-popover-container');
        expect(dropdownMenuEl).not.toHaveCssClass('sky-popover-hidden');

        let titleEl = nativeElement.querySelector('.sky-datepicker-calendar-title') as HTMLButtonElement;

        titleEl.click();
        tick();
        fixture.detectChanges();
        tick();

        dropdownMenuEl = nativeElement.querySelector('.sky-popover-container');
        expect(dropdownMenuEl).not.toHaveCssClass('sky-popover-hidden');
      }));

      it('should pass date back when date is selected in calendar', fakeAsync(() => {
        component.selectedDate = new Date('5/12/2017');
        fixture.detectChanges();
        openDatepicker(nativeElement, fixture);
        tick();
        fixture.detectChanges();
        tick();

        expect(nativeElement.querySelector('td .sky-datepicker-btn-selected'))
          .toHaveText('12');

        expect(nativeElement.querySelector('.sky-datepicker-calendar-title'))
          .toHaveText('May 2017');

        // Click May 2nd
        let dateButtonEl
          = nativeElement
            .querySelectorAll('tbody tr td .sky-btn-default').item(2) as HTMLButtonElement;

        dateButtonEl.click();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.selectedDate).toEqual({ year: 2017, day: 2, month: 5 });
        expect(nativeElement.querySelector('input').value).toBe('05/02/2017');
      }));

      it('should be accessible', async(() => {
        fixture.detectChanges();
        openDatepicker(nativeElement, fixture);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(fixture.nativeElement).toBeAccessible();
        });
      }));

      describe('initialization', () => {
        it('should handle initializing with a Date object', fakeAsync(() => {
          component.selectedDate = new Date('5/12/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
          expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 2017 });
        }));

        it('should handle initializing with a string with the expected format', fakeAsync(() => {
          component.selectedDate = '5/12/2017';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(nativeElement.querySelector('input').value).toBe('5/12/2017');

          expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 2017 });
        }));

        it('should be invalid when initializing with a ISO string', fakeAsync(() => {
          component.selectedDate = '2009-06-15T00:00:01';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('2009-06-15T00:00:01');
          expect(nativeElement.querySelector('input')).toHaveCssClass('ng-invalid');

        //  expect(component.selectedDate)
        //    .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
        }));

        it('should be invalid when initializing with an ISO string with offset', fakeAsync(() => {
          component.selectedDate = '1994-11-05T08:15:30-05:00';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('1994-11-05T08:15:30-05:00');
          expect(nativeElement.querySelector('input')).toHaveCssClass('ng-invalid');
         // expect(component.selectedDate)
         //   .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
        }));

        it('should handle two digit years', fakeAsync(() => {
          component.selectedDate = '5/12/17';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('5/12/17');
          expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 2017 });
        }));

        it('should handle undefined initialization', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('');

          expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
        }));
      });

      describe('input change', () => {
        it('should handle input change with a string with the expected format', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(nativeElement, '5/12/2017', fixture);

          expect(nativeElement.querySelector('input').value).toBe('5/12/2017');
          expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 2017 });
        }));

        it('should be invalid following input change with a ISO string', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '2009-06-15T00:00:01', fixture);

          expect(nativeElement.querySelector('input').value).toBe('2009-06-15T00:00:01');
          expect(nativeElement.querySelector('input')).toHaveCssClass('ng-invalid');

          expect(component.selectedDate).toEqual('2009-06-15T00:00:01');
        }));

        it('should handle input change with an ISO string with offset', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '1994-11-05T08:15:30-05:00', fixture);

          expect(nativeElement.querySelector('input').value).toBe('1994-11-05T08:15:30-05:00');
          expect(nativeElement.querySelector('input')).toHaveCssClass('ng-invalid');

          expect(component.selectedDate).toEqual('1994-11-05T08:15:30-05:00');
        }));

        it('should handle two digit years', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '5/12/98', fixture);

          expect(nativeElement.querySelector('input').value).toBe('5/12/98');
          expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 1998 });
        }));

        it('should handle undefined date', fakeAsync(() => {
          component.selectedDate = '5/12/17';

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          component.selectedDate = undefined;
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('');
          expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
        }));

        it('should pass date to calendar', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '5/12/2017', fixture);

          openDatepicker(nativeElement, fixture);
          tick();
          fixture.detectChanges();
          tick();

          expect(nativeElement.querySelector('td .sky-datepicker-btn-selected'))
            .toHaveText('12');

          expect(nativeElement.querySelector('.sky-datepicker-calendar-title'))
            .toHaveText('May 2017');
        }));
      });

      describe('formats', () => {
        it('should handle a dateFormat on the input different than the default', fakeAsync(() => {
          component.dateFormat = 'DD/MM/YYYY';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(nativeElement, '5/12/2017', fixture);

          expect(nativeElement.querySelector('input').value).toBe('5/12/2017');
          expect(component.selectedDate).toEqual({ day: 5, month: 12, year: 2017 });
        }));

        it('should handle a dateFormat excluding year on the input different than the default', fakeAsync(() => {
          component.dateFormat = 'MM/DD';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(nativeElement, '5/12', fixture);

          expect(nativeElement.querySelector('input').value).toBe('5/12');
          expect(component.selectedDate).toEqual({ day: 12, month: 5, year: undefined });
        }));

        it('should handle a dateFormat excluding day on the input different than the default', fakeAsync(() => {
          component.dateFormat = 'MM/YYYY';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(nativeElement, '5/2017', fixture);

          expect(nativeElement.querySelector('input').value).toBe('5/2017');
          expect(component.selectedDate).toEqual({ month: 5, year: 2017, day: undefined });
        }));

        it('should handle a dateFormat with a 2 digit year excluding day on the input different than the default', fakeAsync(() => {
          component.dateFormat = 'MM/YY';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(nativeElement, '5/17', fixture);

          expect(nativeElement.querySelector('input').value).toBe('5/17');
          expect(component.selectedDate).toEqual({ month: 5, year: 2017, day: undefined });
        }));
      });

      describe('model change', () => {
        it('should handle model change with a Date object', fakeAsync(() => {
          fixture.detectChanges();
          component.selectedDate = new Date('5/12/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
        }));

        it('should handle model change with a string with the expected format', fakeAsync(() => {
          fixture.detectChanges();
          component.selectedDate = '5/12/2017';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('5/12/2017');
          expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 2017 });
        }));

        it('should be invalid following model change with a ISO string', fakeAsync(() => {
          fixture.detectChanges();
          component.selectedDate = '2009-06-15T00:00:01';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('2009-06-15T00:00:01');
          expect(nativeElement.querySelector('input')).toHaveCssClass('ng-invalid');
        }));

        it('should be invalid following model change with an ISO string with offset', fakeAsync(() => {
          fixture.detectChanges();
          component.selectedDate = '1994-11-05T08:15:30-05:00';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('1994-11-05T08:15:30-05:00');
          expect(nativeElement.querySelector('input')).toHaveCssClass('ng-invalid');
        }));

        it('should handle two digit years', fakeAsync(() => {
          fixture.detectChanges();
          component.selectedDate = '5/12/98';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('5/12/98');

          expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 1998 });
        }));
      });

      describe('validation', () => {
        let ngModel: NgModel;
        beforeEach(() => {
          let inputElement = fixture.debugElement.query(By.css('input'));
          ngModel = <NgModel>inputElement.injector.get(NgModel);
        });

      it('should validate properly when invalid date is passed through input change',
          fakeAsync(() => {
            fixture.detectChanges();
            tick();
            setInput(nativeElement, 'abcdebf', fixture);
            fixture.detectChanges();

            expect(nativeElement.querySelector('input').value).toBe('abcdebf');
            expect(component.selectedDate).toEqual('abcdebf');

            expect(ngModel.valid).toBe(false);
            expect(ngModel.pristine).toBe(false);
            expect(ngModel.touched).toBe(true);
          }));

        it('should validate properly when invalid date on initialization', fakeAsync(() => {
          component.selectedDate = 'abcdebf';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.selectedDate)
            .toBe('abcdebf');

          expect(ngModel.valid).toBe(false);

          expect(ngModel.touched).toBe(true);

          blurInput(fixture.nativeElement, fixture);
          expect(ngModel.valid).toBe(false);
          expect(ngModel.touched).toBe(true);
        }));

        it('should validate properly when invalid date on model change', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          component.selectedDate = 'abcdebf';

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.selectedDate)
            .toBe('abcdebf');

          expect(ngModel.valid).toBe(false);

        }));

        it('should validate properly when input changed to empty string', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);

          setInput(fixture.nativeElement, '', fixture);

          expect(nativeElement.querySelector('input').value).toBe('');

          expect(component.selectedDate)
            .toBe('');

          expect(ngModel.valid).toBe(true);
        }));

        it('should handle invalid and then valid date', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);

          setInput(fixture.nativeElement, '2/12/2015', fixture);

          expect(nativeElement.querySelector('input').value).toBe('2/12/2015');

          expect(component.selectedDate).toEqual({ day: 12, month: 2, year: 2015 });

          expect(ngModel.valid).toBe(true);
        }));

        it('should handle calendar date on invalid date', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);
          tick();

          openDatepicker(fixture.nativeElement, fixture);
          tick();
        }));

        it('should handle noValidate property', fakeAsync(() => {
          component.noValidate = true;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.selectedDate)
            .toBe('abcdebf');

          expect(ngModel.valid).toBe(true);

        }));

        it('should validate properly when an invalid date format is passed through input change',
          fakeAsync(() => {
            let expectedValidationMessage = 'Specialized invalid date format message';
            fixture.componentInstance.dateFormat = 'mm/dd/yyyy';
            fixture.componentInstance.dateFormatErrorMessage = expectedValidationMessage;

            fixture.detectChanges();
            tick();

            setInput(nativeElement, '2015/2/12', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2015/2/12');

            expect(ngModel.valid).toBe(false);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(ngModel.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            setInput(nativeElement, '2/12/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/12/2015');

            expect(ngModel.valid).toBe(true);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors).toBeNull();
          }));

          it('should validate properly when the fuzzy date cannot be in future'
            + ' and a future date is passed through input change', fakeAsync(() => {
            let expectedValidationMessage = 'Date cannot be in the future.';
            fixture.componentInstance.cannotBeFuture = true;

            fixture.detectChanges();
            tick();

            let futureDateString = moment().add(1, 'days').format('L');

            setInput(nativeElement, futureDateString, fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe(futureDateString);

            expect(ngModel.valid).toBe(false);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(ngModel.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            let todayDateString = moment().format('L');

            setInput(nativeElement, todayDateString, fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe(todayDateString);

            expect(ngModel.valid).toBe(true);
            expect(ngModel.touched).toBe(true);

            expect(ngModel.errors).toBeNull();
          }));

          it('should validate properly when the fuzzy date cannot be in future'
            + ' overriding the default error message and a future date is passed'
            + ' through input change', fakeAsync(() => {
            let expectedValidationMessage = 'Specialized cannot be in future message';
            fixture.componentInstance.cannotBeFuture = true;
            fixture.componentInstance.cannotBeFutureErrorMessage = expectedValidationMessage;

            fixture.detectChanges();
            tick();

            let futureDateString = moment().add(1, 'days').format('L');

            setInput(nativeElement, futureDateString, fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe(futureDateString);

            expect(ngModel.valid).toBe(false);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(ngModel.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            let todayDateString = moment().format('L');

            setInput(nativeElement, todayDateString, fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe(todayDateString);

            expect(ngModel.valid).toBe(true);
            expect(ngModel.touched).toBe(true);

            expect(ngModel.errors).toBeNull();
          }));

          it('should validate properly when year is required and values are passed through input change', fakeAsync(() => {
            let expectedValidationMessage = 'Please select a year.';
            fixture.componentInstance.yearRequired = true;

            fixture.detectChanges();
            tick();

            setInput(nativeElement, '2/12', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/12');
            expect(ngModel.valid).toBe(false);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(ngModel.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            setInput(nativeElement, '2/12/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/12/2015');
            expect(ngModel.valid).toBe(true);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors).toBeNull();
          }));

        it('should validate properly when year is required overriding the default error message'
          + ' and values are passed through input change', fakeAsync(() => {
            let expectedValidationMessage = 'Specialized year required error message';
            fixture.componentInstance.yearRequired = true;
            fixture.componentInstance.yearRequiredErrorMessage = expectedValidationMessage;

            fixture.detectChanges();
            tick();

            setInput(nativeElement, '2/12', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/12');
            expect(ngModel.valid).toBe(false);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(ngModel.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            setInput(nativeElement, '2/12/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/12/2015');
            expect(ngModel.valid).toBe(true);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors).toBeNull();
          }));
      });

      describe('min max fuzzy date', () => {

        let ngModel: NgModel;
        beforeEach(() => {
          let inputElement = fixture.debugElement.query(By.css('input'));
          ngModel = <NgModel>inputElement.injector.get(NgModel);
        });

        it('should validate properly when the date is passed through input change'
          + ' beyond the max fuzzy date', fakeAsync(() => {
            let expectedValidationMessage = 'The current date is beyond the maximum allowed date.';
            fixture.componentInstance.maxFuzzyDate = { month: 2, day: 15, year: 2015 };

            fixture.detectChanges();
            tick();

            setInput(nativeElement, '2/16/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/16/2015');
            expect(ngModel.valid).toBe(false);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(ngModel.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            setInput(nativeElement, '2/15/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/15/2015');
            expect(ngModel.valid).toBe(true);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors).toBeNull();
          }));

        it('should validate properly when the date is passed through input change'
          + ' beyond the max fuzzy date overriding the default error message', fakeAsync(() => {
            let expectedValidationMessage = 'Specialized beyond max fuzzy date message';
            fixture.componentInstance.maxFuzzyDate = { month: 2, day: 15, year: 2015 };
            fixture.componentInstance.maxFuzzyDateErrorMessage = expectedValidationMessage;

            fixture.detectChanges();
            tick();

            setInput(nativeElement, '2/16/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/16/2015');
            expect(ngModel.valid).toBe(false);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(ngModel.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            setInput(nativeElement, '2/15/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/15/2015');
            expect(ngModel.valid).toBe(true);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors).toBeNull();
          }));

          it('should validate properly when the date is passed through input change'
            + ' prior to the min fuzzy date', fakeAsync(() => {
            let expectedValidationMessage = 'The current date is before the minimum allowed date.';
            fixture.componentInstance.minFuzzyDate = { month: 2, day: 15, year: 2015 };

            fixture.detectChanges();
            tick();

            setInput(nativeElement, '2/14/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/14/2015');
            expect(ngModel.valid).toBe(false);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(ngModel.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            setInput(nativeElement, '2/15/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/15/2015');
            expect(ngModel.valid).toBe(true);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors).toBeNull();
          }));

          it('should validate properly when the date is passed through input change'
            + ' prior to the min fuzzy date overriding the default error message', fakeAsync(() => {
            let expectedValidationMessage = 'Specialized beyond max fuzzy date message';
            fixture.componentInstance.minFuzzyDate = { month: 2, day: 15, year: 2015 };
            fixture.componentInstance.minFuzzyDateErrorMessage = expectedValidationMessage;

            fixture.detectChanges();
            tick();

            setInput(nativeElement, '2/14/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/14/2015');
            expect(ngModel.valid).toBe(false);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(ngModel.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            setInput(nativeElement, '2/15/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/15/2015');
            expect(ngModel.valid).toBe(true);
            expect(ngModel.touched).toBe(true);
            expect(ngModel.errors).toBeNull();
          }));

        it('should handle change above max fuzzy fuzzy date', fakeAsync(() => {
          component.selectedDate = new Date('5/21/2017');
          component.maxFuzzyDate = { month: 5, day: 25, year: 2017 };
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, '5/26/2017', fixture);

          expect(ngModel.valid).toBe(false);

        }));

        it('should handle change below min fuzzy date', fakeAsync(() => {
          component.selectedDate = new Date('5/21/2017');
          component.minFuzzyDate = { month: 5, day: 4, year: 2017 };
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, '5/1/2017', fixture);

          expect(ngModel.valid).toBe(false);
        }));

        it('should pass max date to calendar', fakeAsync(() => {
          component.selectedDate = new Date('5/21/2017');
          component.maxFuzzyDate = { month: 5, day: 25, year: 2017 };
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          openDatepicker(fixture.nativeElement, fixture);
          tick();

          let dateButtonEl
            = fixture.nativeElement
              .querySelectorAll('tbody tr td .sky-btn-default').item(30) as HTMLButtonElement;

          expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
        }));

        it('should pass min date to calendar', fakeAsync(() => {
          component.selectedDate = new Date('5/21/2017');
          component.minFuzzyDate = { month: 5, day: 4, year: 2017 };
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          openDatepicker(fixture.nativeElement, fixture);
          tick();

          let dateButtonEl
            = fixture.nativeElement
              .querySelectorAll('tbody tr td .sky-btn-default').item(1) as HTMLButtonElement;

          expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
        }));

        it('should pass starting day to calendar', fakeAsync(() => {
          component.selectedDate = new Date('5/21/2017');
          component.startingDay = 5;
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          openDatepicker(fixture.nativeElement, fixture);
          tick();

          let firstDayCol = fixture.nativeElement
            .querySelectorAll('.sky-datepicker-center.sky-datepicker-weekdays').item(0) as HTMLElement;

          expect(firstDayCol.textContent).toContain('Fr');
        }));
      });

      describe('disabled state', () => {

        it('should disable the input and dropdown when disable is set to true', fakeAsync(() => {
          component.isDisabled = true;
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
          expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
          expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeTruthy();
        }));

        it('should not disable the input and dropdown when disable is set to false', () => {
          component.isDisabled = false;
          fixture.detectChanges();

          expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
          expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
          expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeFalsy();
        });

      });

    });

    describe('reactive form', () => {
      let fixture: ComponentFixture<FuzzyDatepickerReactiveTestComponent>;
      let component: FuzzyDatepickerReactiveTestComponent;
      let nativeElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(FuzzyDatepickerReactiveTestComponent);
        nativeElement = fixture.nativeElement as HTMLElement;
        component = fixture.componentInstance;
      });

      afterEach(() => {
        fixture.destroy();
      });

      describe('initial value', () => {
        it('should set the initial value correctly', fakeAsync(() => {
          component.initialValue = '5/12/2017';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('5/12/2017');
          expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 2017 });
        }));
      });

      describe('input change', () => {
        it('should handle input change with a string with the expected format', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(nativeElement, '5/12/2017', fixture);
          expect(nativeElement.querySelector('input').value).toBe('5/12/2017');
          expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 2017 });
        }));

        it('should be invalid following input change with a ISO string', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '2009-06-15T00:00:01', fixture);

          expect(nativeElement.querySelector('input').value).toBe('2009-06-15T00:00:01');
          expect(nativeElement.querySelector('input')).toHaveCssClass('ng-invalid');
        }));

        it('should be invalid following input change with an ISO string with offset', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '1994-11-05T08:15:30-05:00', fixture);

          expect(nativeElement.querySelector('input').value).toBe('1994-11-05T08:15:30-05:00');
          expect(nativeElement.querySelector('input')).toHaveCssClass('ng-invalid');
        }));

        it('should handle two digit years', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '5/12/98', fixture);

          expect(nativeElement.querySelector('input').value).toBe('5/12/98');

          expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 1998 });
        }));

        it('should handle undefined date', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue('5/12/17');

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          component.dateControl.setValue(undefined);
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('');
          expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
        }));

        it('should pass date to calendar', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          setInput(nativeElement, '5/12/2017', fixture);

          openDatepicker(nativeElement, fixture);
          tick();
          fixture.detectChanges();
          tick();

          expect(nativeElement.querySelector('td .sky-datepicker-btn-selected'))
            .toHaveText('12');

          expect(nativeElement.querySelector('.sky-datepicker-calendar-title'))
            .toHaveText('May 2017');
        }));
      });

      describe('model change', () => {
        it('should handle model change with a Date object', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue(new Date('5/12/2017'));
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('5/12/2017');
        }));

        it('should handle model change with a string with the expected format', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue('5/12/2017');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('5/12/2017');
          expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 2017 });
        }));

        it('should be invalid following model change with a ISO string', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue('2009-06-15T00:00:01');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('2009-06-15T00:00:01');
          expect(nativeElement.querySelector('input')).toHaveCssClass('ng-invalid');
        }));

        it('should be invalid following model change with an ISO string with offset', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue('1994-11-05T08:15:30-05:00');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('1994-11-05T08:15:30-05:00');
          expect(nativeElement.querySelector('input')).toHaveCssClass('ng-invalid');
        }));

        it('should handle two digit years', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue('5/12/98');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('5/12/1998');

          expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 1998 });
        }));
      });

      describe('Angular form control statuses', function () {
        it('should set correct statuses when initialized without value', fakeAsync(function () {
          fixture.componentInstance.initialValue = undefined;
          fixture.detectChanges();
          tick();

          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(true);
          expect(component.dateControl.touched).toBe(false);
        }));

        it('should set correct statuses when initialized with value', fakeAsync(function () {
          fixture.componentInstance.initialValue = '1/1/2000';
          fixture.detectChanges();
          tick();

          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(true);
          expect(component.dateControl.touched).toBe(false);
        }));

        it('should set correct statuses after user types within input', fakeAsync(function () {
          fixture.detectChanges();
          tick();

          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(true);
          expect(component.dateControl.touched).toBe(false);

          setInput(nativeElement, '1/1/2000', fixture);
          blurInput(nativeElement, fixture);
          fixture.detectChanges();
          tick();

          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(false);
          expect(component.dateControl.touched).toBe(true);
        }));

        it('should set correct statuses after user selects from calendar', fakeAsync(function () {
          fixture.detectChanges();
          tick();

          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(true);
          expect(component.dateControl.touched).toBe(false);

          openDatepicker(fixture.nativeElement, fixture);
          tick();
          fixture.detectChanges();
          tick();

          fixture.nativeElement.querySelector('.sky-datepicker-btn-selected').click();
          fixture.detectChanges();
          tick();

          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(false);
          expect(component.dateControl.touched).toBe(true);
        }));
      });

      describe('validation', () => {

        it('should validate properly when invalid date is passed through input change',
          fakeAsync(() => {
            fixture.detectChanges();
            tick();
            setInput(nativeElement, 'abcdebf', fixture);
            fixture.detectChanges();

            expect(nativeElement.querySelector('input').value).toBe('abcdebf');

            expect(component.dateControl.value).toEqual('abcdebf');

            expect(component.dateControl.valid).toBe(false);
            expect(component.dateControl.pristine).toBe(false);
            expect(component.dateControl.touched).toBe(true);

          }));

        it('should validate properly when invalid date on initialization', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue('abcdebf');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.dateControl.value)
            .toBe('abcdebf');

          expect(component.dateControl.valid).toBe(false);

          expect(component.dateControl.touched).toBe(true);

          blurInput(fixture.nativeElement, fixture);
          expect(component.dateControl.valid).toBe(false);
          expect(component.dateControl.touched).toBe(true);
        }));

        it('should validate properly when invalid date on model change', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          component.dateControl.setValue('abcdebf');

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.dateControl.value)
            .toBe('abcdebf');

          expect(component.dateControl.valid).toBe(false);

        }));

        it('should validate properly when input changed to empty string', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);

          setInput(fixture.nativeElement, '', fixture);

          expect(nativeElement.querySelector('input').value).toBe('');

          expect(component.dateControl.value)
            .toBe('');

          expect(component.dateControl.valid).toBe(true);
        }));

        it('should handle invalid and then valid date', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);

          setInput(fixture.nativeElement, '2/12/2015', fixture);

          expect(nativeElement.querySelector('input').value).toBe('2/12/2015');

          expect(component.dateControl.value).toEqual( { day: 12, month: 2, year: 2015 });
          expect(component.dateControl.valid).toBe(true);
        }));

        it('should handle calendar date on invalid date', fakeAsync(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);
          tick();

          openDatepicker(fixture.nativeElement, fixture);
          tick();
        }));

        it('should validate properly when an invalid date format is passed through input change',
          fakeAsync(() => {
            let expectedValidationMessage = 'Specialized invalid date format message';
            fixture.componentInstance.dateFormat = 'mm/dd/yyyy';
            fixture.componentInstance.dateFormatErrorMessage = expectedValidationMessage;

            fixture.detectChanges();
            tick();

            setInput(nativeElement, '2015/2/12', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2015/2/12');

            expect(component.dateControl.valid).toBe(false);
            expect(component.dateControl.pristine).toBe(false);
            expect(component.dateControl.touched).toBe(true);

            expect(component.dateControl.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(component.dateControl.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            setInput(nativeElement, '2/12/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/12/2015');

            expect(component.dateControl.errors).toBeNull();

            expect(component.dateControl.valid).toBe(true);
            expect(component.dateControl.pristine).toBe(false);
            expect(component.dateControl.touched).toBe(true);
          }));

          it('should validate properly when the fuzzy date cannot be in future'
            + 'and a future date is passed through input change', fakeAsync(() => {
            let expectedValidationMessage = 'Specialized cannot be in future message';
            fixture.componentInstance.cannotBeFuture = true;
            fixture.componentInstance.cannotBeFutureErrorMessage = expectedValidationMessage;

            fixture.detectChanges();
            tick();

            let futureDateString = moment().add(1, 'days').format('L');

            setInput(nativeElement, futureDateString, fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe(futureDateString);

            expect(component.dateControl.valid).toBe(false);
            expect(component.dateControl.pristine).toBe(false);
            expect(component.dateControl.touched).toBe(true);

            expect(component.dateControl.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(component.dateControl.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            let todayDateString = moment().format('L');

            setInput(nativeElement, todayDateString, fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe(todayDateString);

            expect(component.dateControl.errors).toBeNull();

            expect(component.dateControl.valid).toBe(true);
            expect(component.dateControl.pristine).toBe(false);
            expect(component.dateControl.touched).toBe(true);
          }));

        it('should validate properly when year is required and values are passed through input change', fakeAsync(() => {
            let expectedValidationMessage = 'Specialized year required error message';
            fixture.componentInstance.yearRequired = true;
            fixture.componentInstance.yearRequiredErrorMessage = expectedValidationMessage;

            fixture.detectChanges();
            tick();

            setInput(nativeElement, '2/12', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/12');

            expect(component.dateControl.valid).toBe(false);
            expect(component.dateControl.pristine).toBe(false);
            expect(component.dateControl.touched).toBe(true);

            expect(component.dateControl.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(component.dateControl.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            setInput(nativeElement, '2/12/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/12/2015');

            expect(component.dateControl.errors).toBeNull();

            expect(component.dateControl.valid).toBe(true);
            expect(component.dateControl.pristine).toBe(false);
            expect(component.dateControl.touched).toBe(true);
          }));

        it('should handle noValidate property', fakeAsync(() => {
          component.noValidate = true;

          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, 'abcdebf', fixture);

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.dateControl.value)
            .toBe('abcdebf');

          expect(component.dateControl.valid).toBe(true);

        }));
      });

      describe('min max fuzzy date', () => {
        it('should validate properly when the date is passed through input change beyond the max fuzzy date', fakeAsync(() => {
            let expectedValidationMessage = 'Specialized beyond max fuzzy date message';
            fixture.componentInstance.maxFuzzyDate = { month: 2, day: 15, year: 2015 };
            fixture.componentInstance.maxFuzzyDateErrorMessage = expectedValidationMessage;

            fixture.detectChanges();
            tick();

            setInput(nativeElement, '2/16/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/16/2015');

            expect(component.dateControl.valid).toBe(false);
            expect(component.dateControl.pristine).toBe(false);
            expect(component.dateControl.touched).toBe(true);

            expect(component.dateControl.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(component.dateControl.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            setInput(nativeElement, '2/15/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/15/2015');

            expect(component.dateControl.errors).toBeNull();

            expect(component.dateControl.valid).toBe(true);
            expect(component.dateControl.pristine).toBe(false);
            expect(component.dateControl.touched).toBe(true);
          }));

          it('should validate properly when the date is passed through input change beyond the max fuzzy date', fakeAsync(() => {
            let expectedValidationMessage = 'Specialized beyond max fuzzy date message';
            fixture.componentInstance.minFuzzyDate = { month: 2, day: 15, year: 2015 };
            fixture.componentInstance.minFuzzyDateErrorMessage = expectedValidationMessage;

            fixture.detectChanges();
            tick();

            setInput(nativeElement, '2/14/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/14/2015');

            expect(component.dateControl.valid).toBe(false);
            expect(component.dateControl.pristine).toBe(false);
            expect(component.dateControl.touched).toBe(true);

            expect(component.dateControl.errors.skyFuzzyDate.invalid)
              .toBeTruthy();
            expect(component.dateControl.errors.skyFuzzyDate.validationErrorMessage)
              .toEqual(expectedValidationMessage);

            setInput(nativeElement, '2/15/2015', fixture);
            fixture.detectChanges();
            tick();

            expect(nativeElement.querySelector('input').value).toBe('2/15/2015');

            expect(component.dateControl.errors).toBeNull();

            expect(component.dateControl.valid).toBe(true);
            expect(component.dateControl.pristine).toBe(false);
            expect(component.dateControl.touched).toBe(true);
          }));

        it('should handle change above max fuzzy date passed on model change', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue(new Date('5/21/2017'));
          component.maxFuzzyDate = { month: 5, day: 25, year: 2017 };
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, '5/26/2017', fixture);

          expect(component.dateControl.valid).toBe(false);

        }));

        it('should handle change below min fuzzy date passed on model change', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue(new Date('5/21/2017'));
          component.minFuzzyDate = { month: 5, day: 4, year: 2017 };
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          setInput(fixture.nativeElement, '5/1/2017', fixture);

          expect(component.dateControl.valid).toBe(false);
        }));

        it('should pass max date to calendar', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue(new Date('5/21/2017'));
          component.maxFuzzyDate = { month: 5, day: 25, year: 2017 };
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          openDatepicker(fixture.nativeElement, fixture);
          tick();

          let dateButtonEl
            = fixture.nativeElement
              .querySelectorAll('tbody tr td .sky-btn-default').item(30) as HTMLButtonElement;

          expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
        }));

        it('should pass min date to calendar', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue(new Date('5/21/2017'));
          component.minFuzzyDate = { month: 5, day: 4, year: 2017 };
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          openDatepicker(fixture.nativeElement, fixture);
          tick();

          let dateButtonEl
            = fixture.nativeElement
              .querySelectorAll('tbody tr td .sky-btn-default').item(1) as HTMLButtonElement;

          expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
        }));

        it('should pass starting day to calendar', fakeAsync(() => {
          fixture.detectChanges();
          component.dateControl.setValue(new Date('5/21/2017'));
          component.startingDay = 5;
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          openDatepicker(fixture.nativeElement, fixture);
          tick();

          let firstDayCol = fixture.nativeElement
            .querySelectorAll('.sky-datepicker-center.sky-datepicker-weekdays').item(0) as HTMLElement;

          expect(firstDayCol.textContent).toContain('Fr');
        }));
      });

      describe('disabled state', () => {

        it('should disable the input and dropdown when disable is set to true', () => {
          fixture.detectChanges();
          component.dateControl.disable();
          fixture.detectChanges();

          expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
          expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
          expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeTruthy();
        });

        it('should not disable the input and dropdown when disable is set to false', () => {
          fixture.detectChanges();
          component.dateControl.enable();
          fixture.detectChanges();

          expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
          expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
          expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeFalsy();
        });

      });

    });

    describe('default locale configuration', () => {
      let fixture: ComponentFixture<FuzzyDatepickerNoFormatTestComponent>;
      let component: FuzzyDatepickerNoFormatTestComponent;
      let nativeElement: HTMLElement;

      class MockWindowService {
        public getWindow() {
          return {
            navigator: {
              languages: ['es']
            }
          };
        }
      }

      let mockWindowService = new MockWindowService();
      beforeEach(() => {
        TestBed.overrideProvider(
          SkyWindowRefService,
          {
            useValue: mockWindowService
          }
        );

        fixture = TestBed.createComponent(FuzzyDatepickerNoFormatTestComponent);
        nativeElement = fixture.nativeElement as HTMLElement;
        component = fixture.componentInstance;

        fixture.detectChanges();
      });

      it('should display formatted date based on locale by default', fakeAsync(() => {
        component.selectedDate = new Date('10/24/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('24/10/2017');
      }));
    });
  });

});
