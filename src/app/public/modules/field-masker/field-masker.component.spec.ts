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
  FieldMaskerTestModule
} from './fixtures/field-masker.module.fixture';

import {
  DatepickerFieldMaskerTestComponent
} from './fixtures/datepicker-field-masker.component.fixture';

import {
  SkyDatepickerComponent,
  SkyDatepickerConfigService
} from '../datepicker';

import {
  DatepickerFieldMaskerReactiveTestComponent
} from './fixtures/datepicker-field-masker-reactive.component.fixture';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  DatepickerFieldMaskerNoFormatTestComponent
} from './fixtures/datepicker-field-masker-noformat.component.fixture';

const moment = require('moment');

describe('datepicker with field masker', () => {

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

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        FieldMaskerTestModule
      ]
    });

    spyOn(console, 'warn');
  });

  describe('nonstandard configuration', () => {
    let fixture: ComponentFixture<DatepickerFieldMaskerNoFormatTestComponent>;
    let component: DatepickerFieldMaskerNoFormatTestComponent;
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
      }).createComponent(DatepickerFieldMaskerNoFormatTestComponent);

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
    let fixture: ComponentFixture<DatepickerFieldMaskerTestComponent>;
    let component: DatepickerFieldMaskerTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(DatepickerFieldMaskerTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    it('should throw an error if directive is added in isolation', function () {
      try {
        component.showInvalidDirective = true;
        fixture.detectChanges();
      } catch (err) {
        expect(err.message).toContain('skyFieldMaskerInput');
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
      let dateButtonEl = nativeElement
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
        component.selectedDate = new Date('05/12/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
      }));

      it('should handle initializing with a string with the expected format', fakeAsync(() => {
        component.selectedDate = '05/12/2017';
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

      it('should handle undefined initialization', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('');

        expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
      }));

      it('should set placeholder as date format', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').placeholder).toBe(component.inputDirective.dateFormat);
      }));
    });

    describe('input change', () => {
      it('should handle input change with a string with the expected format', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(nativeElement, '05/12/2017', fixture);
        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
        expect(component.selectedDate).toEqual(new Date('05/12/2017'));
      }));

      it('should handle undefined date', fakeAsync(() => {
        component.selectedDate = '05/12/17';

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
        setInput(nativeElement, '05/12/2017', fixture);

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
        component.selectedDate = new Date('05/12/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
      }));

      it('should handle model change with a string with the expected format', fakeAsync(() => {
        fixture.detectChanges();
        component.selectedDate = '05/12/2017';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
        expect(component.selectedDate).toEqual(new Date('05/12/2017'));
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
    });

    describe('field masker', () => {
      it('should show date format as value when input is focused', fakeAsync(() => {
        fixture.detectChanges();
        expect(nativeElement.querySelector('input').value).toBe('');

        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe(component.inputDirective.dateFormat);
      }));

      it('accepts lowercase letters for date format as well as uppercase', fakeAsync(() => {
        component.format = 'mm/dd/yyyy';
        fixture.detectChanges();
        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
        fixture.detectChanges();

        nativeElement.querySelector('input').value = '01/dd/yyyy';
        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
        fixture.detectChanges();

        let inputElement: HTMLInputElement = nativeElement.querySelector('input');
        expect(inputElement.selectionStart).toEqual(3);
        expect(inputElement.selectionEnd).toEqual(5);

        nativeElement.querySelector('input').value = '01/20/yyyy';
        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
        fixture.detectChanges();

        inputElement = nativeElement.querySelector('input');
        expect(inputElement.selectionStart).toEqual(6);
        expect(inputElement.selectionEnd).toEqual(10);
      }));

      it('should not change value on focus if value is set', fakeAsync(() => {
        fixture.detectChanges();
        component.selectedDate = '05/12/2017';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');

        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
      }));

      it('should highlight first section when input is focused', fakeAsync(() => {
        fixture.detectChanges();
        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
        fixture.detectChanges();

        let inputElement: HTMLInputElement = nativeElement.querySelector('input');
        expect(inputElement.selectionStart).toEqual(0);
        expect(inputElement.selectionEnd).toEqual(2);
      }));

      it('should reset value to blank if input blurs without any user input', fakeAsync(() => {
        fixture.detectChanges();
        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
        fixture.detectChanges();

        blurInput(nativeElement, fixture);

        expect(nativeElement.querySelector('input').value).toBe('');
      }));

      it('should not convert to date on change event if any groups are not filled', fakeAsync(() => {
        fixture.detectChanges();
        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
        fixture.detectChanges();

        nativeElement.querySelector('input').value = '01/DD/YYYY';
        fixture.debugElement.query(By.css('input')).triggerEventHandler('change', {
          target: {
            value: '01/DD/YYYY'
          }
        });
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('01/DD/YYYY');

        nativeElement.querySelector('input').value = 'MM/01/YYYY';
        fixture.debugElement.query(By.css('input')).triggerEventHandler('change', {
          target: {
            value: 'MM/01/YYYY'
          }
        });
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('MM/01/YYYY');

        nativeElement.querySelector('input').value = 'MM/DD/2019';
        fixture.debugElement.query(By.css('input')).triggerEventHandler('change', {
          target: {
            value: 'MM/DD/2019'
          }
        });
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('MM/DD/2019');
      }));

      ['/', '\\', '-', '(', ')', '.'].forEach((delimiter) => {
        it(`handles using ${delimiter} as a delimiter`, fakeAsync(() => {
          component.format = `MM${delimiter}DD${delimiter}YYYY`;
          fixture.detectChanges();
          expect(nativeElement.querySelector('input').placeholder).toBe(component.format);
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(0);
          expect(inputElement.selectionEnd).toEqual(2);

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          inputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(3);
          expect(inputElement.selectionEnd).toEqual(5);

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          inputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(6);
          expect(inputElement.selectionEnd).toEqual(10);
        }));
      });

      it('should handle using mixed delimiters', fakeAsync(() => {
        component.format = 'MM/DD-YYYY';
        fixture.detectChanges();
        expect(nativeElement.querySelector('input').placeholder).toBe(component.format);
        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
        fixture.detectChanges();

        let inputElement: HTMLInputElement = nativeElement.querySelector('input');
        expect(inputElement.selectionStart).toEqual(0);
        expect(inputElement.selectionEnd).toEqual(2);
        expect(nativeElement.querySelector('input').value).toBe('MM/DD-YYYY');

        nativeElement.querySelector('input').value = '4/DD-YYYY';
        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
        fixture.detectChanges();

        inputElement = nativeElement.querySelector('input');
        expect(inputElement.selectionStart).toEqual(3);
        expect(inputElement.selectionEnd).toEqual(5);
        expect(nativeElement.querySelector('input').value).toBe('04/DD-YYYY');

        nativeElement.querySelector('input').value = '04/4-YYYY';
        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
        fixture.detectChanges();

        inputElement = nativeElement.querySelector('input');
        expect(inputElement.selectionStart).toEqual(6);
        expect(inputElement.selectionEnd).toEqual(10);
        expect(nativeElement.querySelector('input').value).toBe('04/04-YYYY');
      }));

      it('should replace empty group with placeholder text', fakeAsync(() => {
        fixture.detectChanges();
        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
        fixture.detectChanges();
        nativeElement.querySelector('input').value = '/DD/YYYY';
        fixture.detectChanges();

        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
          keyboardEventInit: {key: 'Tab'}
        });
        fixture.detectChanges();

        let inputElement: HTMLInputElement = nativeElement.querySelector('input');
        expect(inputElement.value).toEqual('MM/DD/YYYY');
        expect(inputElement.selectionStart).toEqual(3);
        expect(inputElement.selectionEnd).toEqual(5);
      }));

      describe('navigation keys', () => {
        it('pushing tab highlights next group until leaving element', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(3);
          expect(inputElement.selectionEnd).toEqual(5);

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          inputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(6);
          expect(inputElement.selectionEnd).toEqual(10);
        }));

        it('pushing arrow right highlights next group', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'ArrowRight'}
          });
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(3);
          expect(inputElement.selectionEnd).toEqual(5);

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'ArrowRight'}
          });
          fixture.detectChanges();

          inputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(6);
          expect(inputElement.selectionEnd).toEqual(10);
        }));

        it('shift + tab should move selection back', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(6);
          expect(inputElement.selectionEnd).toEqual(10);

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {
              key: 'Tab', shiftKey: true
            }
          });
          fixture.detectChanges();

          inputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(3);
          expect(inputElement.selectionEnd).toEqual(5);
        }));

        it('left arrow should move selection back', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(6);
          expect(inputElement.selectionEnd).toEqual(10);

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'ArrowLeft'}
          });
          fixture.detectChanges();

          inputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(3);
          expect(inputElement.selectionEnd).toEqual(5);
        }));

        it('up arrow should move selection to first group', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(6);
          expect(inputElement.selectionEnd).toEqual(10);

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'ArrowUp'}
          });
          fixture.detectChanges();

          inputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(0);
          expect(inputElement.selectionEnd).toEqual(2);
        }));

        it('home key should move selection to first group', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(6);
          expect(inputElement.selectionEnd).toEqual(10);

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Home'}
          });
          fixture.detectChanges();

          inputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(0);
          expect(inputElement.selectionEnd).toEqual(2);
        }));

        it('down arrow should move selection to last group', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(0);
          expect(inputElement.selectionEnd).toEqual(2);

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'ArrowDown'}
          });
          fixture.detectChanges();

          inputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(6);
          expect(inputElement.selectionEnd).toEqual(10);
        }));

        it('end key should move selection to last group', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(0);
          expect(inputElement.selectionEnd).toEqual(2);

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'End'}
          });
          fixture.detectChanges();

          inputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(6);
          expect(inputElement.selectionEnd).toEqual(10);
        }));

        it('should fill in group if only partially filled and tab is pushed', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          nativeElement.querySelector('input').value = '1/MM/YYYY';
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('01/MM/YYYY');

          nativeElement.querySelector('input').value = '01/11/YYYY';
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('01/11/YYYY');

          nativeElement.querySelector('input').value = '01/11/11';
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('01/11/0011');
        }));

        it('should fill in group if only partially filled and input is blurred', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          nativeElement.querySelector('input').value = '1/MM/YYYY';
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'blur');
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('01/MM/YYYY');
        }));

        it('should allow you to move through the groups via Tab even if the groups are filled', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();
          nativeElement.querySelector('input').value = '01/DD/YYYY';
          fixture.detectChanges();

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {
              key: 'Tab', shiftKey: true
            }
          });
          fixture.detectChanges();

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keyup', { keyboardEventInit:
              { key: 'Tab' }
          });
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(0);
          expect(inputElement.selectionEnd).toEqual(2);
        }));
      });

      describe('user input behavior', () => {
        it(`should not move to next section if user inputs 1 for month`, fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          nativeElement.querySelector('input').value = '1/DD/YYYY';
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.value).toEqual('1/DD/YYYY');
          expect(inputElement.selectionStart).not.toEqual(3);
          expect(inputElement.selectionEnd).not.toEqual(5);
        }));

        ['2', '3', '4', '5', '6', '7', '8', '9'].forEach((input) => {
          it(`should move to next section and fill group if user inputs ${input} for month`, fakeAsync(() => {
            fixture.detectChanges();
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
            fixture.detectChanges();

            nativeElement.querySelector('input').value = input + '/DD/YYYY';
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
            fixture.detectChanges();

            let inputElement: HTMLInputElement = nativeElement.querySelector('input');
            expect(inputElement.value).toEqual(`0${input}/DD/YYYY`);
            expect(inputElement.selectionStart).toEqual(3);
            expect(inputElement.selectionEnd).toEqual(5);
          }));
        });

        ['1', '2', '3'].forEach((input) => {
          it(`should not move to next section if user inputs ${input} for day`, fakeAsync(() => {
            fixture.detectChanges();
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
            fixture.detectChanges();

            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
              keyboardEventInit: {key: 'Tab'}
            });
            fixture.detectChanges();

            nativeElement.querySelector('input').value = 'MM/' + input + '/YYYY';
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
            fixture.detectChanges();

            let inputElement: HTMLInputElement = nativeElement.querySelector('input');
            expect(inputElement.value).toEqual(`MM/${input}/YYYY`);
            expect(inputElement.selectionStart).not.toEqual(6);
            expect(inputElement.selectionEnd).not.toEqual(10);
          }));
        });

        ['4', '5', '6', '7', '8', '9'].forEach((input) => {
          it(`should move to next section and fill group if user inputs ${input} for day`, fakeAsync(() => {
            fixture.detectChanges();
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
            fixture.detectChanges();

            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
              keyboardEventInit: {key: 'Tab'}
            });
            fixture.detectChanges();

            nativeElement.querySelector('input').value = 'MM/' + input + '/YYYY';
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
            fixture.detectChanges();

            let inputElement: HTMLInputElement = nativeElement.querySelector('input');
            expect(inputElement.value).toEqual(`MM/0${input}/YYYY`);
            expect(inputElement.selectionStart).toEqual(6);
            expect(inputElement.selectionEnd).toEqual(10);
          }));
        });

        it('should highlight next group once current group is filled', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          nativeElement.querySelector('input').value = '01/DD/YYYY';
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(3);
          expect(inputElement.selectionEnd).toEqual(5);

          nativeElement.querySelector('input').value = '01/20/YYYY';
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
          fixture.detectChanges();

          inputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(6);
          expect(inputElement.selectionEnd).toEqual(10);
        }));

        it('should not allow non-numeric input', fakeAsync(() => {
          let letters: string[] = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
            'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          for (let i = 0; i < letters.length; ++i) {
            let keyPressEvent = new KeyboardEvent('keypress', { key: 'Key' + letters[i] });
            let keyPressSpy = spyOn(keyPressEvent, 'preventDefault');
            component.inputDirective.onInputKeypress(keyPressEvent);
            fixture.detectChanges();

            expect(keyPressSpy).toHaveBeenCalled();
          }
        }));

        [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ].forEach(
          (numberInput: string) => {
            it(`should allow ${numberInput} as an input`, fakeAsync(() => {
              fixture.detectChanges();
              SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
              fixture.detectChanges();

              let keyPressEvent = new KeyboardEvent('keypress', { key: numberInput });
              let keyPressSpy = spyOn(keyPressEvent, 'preventDefault');
              component.inputDirective.onInputKeypress(keyPressEvent);
              fixture.detectChanges();

              expect(keyPressSpy).not.toHaveBeenCalled();
            }));
          }
        );

        it('should select the group that the user clicked into', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          fixture.debugElement.query(By.css('input')).triggerEventHandler('click', {
            target: {
              selectionStart: 4
            }
          });
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.selectionStart).toEqual(3);
          expect(inputElement.selectionEnd).toEqual(5);
        }));

        it('should prevent paste events', fakeAsync(() => {
          fixture.detectChanges();
          let pasteEvent = new ClipboardEvent('paste');

          let pasteSpy = spyOn(pasteEvent, 'preventDefault');
          component.inputDirective.blockPaste(pasteEvent);
          expect(pasteSpy).toHaveBeenCalled();
        }));

        it('should prevent cut events', fakeAsync(() => {
          fixture.detectChanges();
          let cutEvent = new ClipboardEvent('cut');

          let cutSpy = spyOn(cutEvent, 'preventDefault');
          component.inputDirective.blockCut(cutEvent);
          expect(cutSpy).toHaveBeenCalled();
        }));
      });

      it('should not change input if group is filled', fakeAsync(() => {
        fixture.detectChanges();
        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
        fixture.detectChanges();

        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
          keyboardEventInit: {
            key: 'Tab'
          }
        });

        nativeElement.querySelector('input').value = 'MM/12/YYYY';
        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
        fixture.detectChanges();

        let inputElement: HTMLInputElement = nativeElement.querySelector('input');
        expect(inputElement.value).toEqual('MM/12/YYYY');

        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
          keyboardEventInit: {
            key: 'Tab', shiftKey: true
          }
        });
        fixture.detectChanges();
        inputElement.selectionStart = 3;
        inputElement.selectionEnd = 3;
        fixture.detectChanges();

        let keyPressEvent = new KeyboardEvent('keypress', { key: '2' });
        let keyPressSpy = spyOn(keyPressEvent, 'preventDefault');
        component.inputDirective.onInputKeypress(keyPressEvent);
        fixture.detectChanges();

        expect(keyPressSpy).toHaveBeenCalled();
      }));

      describe('input validation', () => {
        it('should update month of 00 to 01', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          nativeElement.querySelector('input').value = '00/DD/YYYY';
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.value).toEqual('01/DD/YYYY'
          );
        }));

        it('should update month of 13 to 12', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          nativeElement.querySelector('input').value = '13/DD/YYYY';
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.value).toEqual('12/DD/YYYY');
        }));

        it('should update day of 32 to 31 if month is blank', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          nativeElement.querySelector('input').value = 'MM/32/YYYY';
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.value).toEqual('MM/31/YYYY');
        }));

        it('should update day of 00 to 01', fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keydown', {
            keyboardEventInit: {key: 'Tab'}
          });
          fixture.detectChanges();

          nativeElement.querySelector('input').value = 'MM/00/YYYY';
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.value).toEqual('MM/01/YYYY');
        }));

        ['01', '03', '05', '07', '08', '10', '12'].forEach((month) => {
          it(`should update day of 32 to 31 if month is ${month}`, fakeAsync(() => {
            fixture.detectChanges();
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
            fixture.detectChanges();

            nativeElement.querySelector('input').value = `${month}/32/YYYY`;
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
            fixture.detectChanges();

            let inputElement: HTMLInputElement = nativeElement.querySelector('input');
            expect(inputElement.value).toEqual(`${month}/31/YYYY`);
          }));
        });

        ['04', '06', '09', '11'].forEach((month) => {
          it(`should update day of 32 to 30 if month is ${month}`, fakeAsync(() => {
            fixture.detectChanges();
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
            fixture.detectChanges();

            nativeElement.querySelector('input').value = `${month}/32/YYYY`;
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
            fixture.detectChanges();

            let inputElement: HTMLInputElement = nativeElement.querySelector('input');
            expect(inputElement.value).toEqual(`${month}/30/YYYY`);
          }));
        });

        it(`should update day of 32 to 29 if month is 2 and year is blank`, fakeAsync(() => {
          fixture.detectChanges();
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
          fixture.detectChanges();

          nativeElement.querySelector('input').value = `02/32/YYYY`;
          SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
          fixture.detectChanges();

          let inputElement: HTMLInputElement = nativeElement.querySelector('input');
          expect(inputElement.value).toEqual('02/29/YYYY');
        }));

        ['2000', '2020', '2400'].forEach((year) => {
          it(`should update day of 32 to 29 if month is 2 and year is a leap year: ${year}`, fakeAsync(() => {
            fixture.detectChanges();
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
            fixture.detectChanges();

            nativeElement.querySelector('input').value = `02/32/${year}`;
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
            fixture.detectChanges();

            let inputElement: HTMLInputElement = nativeElement.querySelector('input');
            expect(inputElement.value).toEqual(`02/29/${year}`);
          }));
        });

        ['2019', '2100', '2200', '2300'].forEach((year) => {
          it(`should update day of 32 to 28 if month is 2 and year is a common year: ${year}`, fakeAsync(() => {
            fixture.detectChanges();
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
            fixture.detectChanges();

            nativeElement.querySelector('input').value = `02/32/${year}`;
            SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'input');
            fixture.detectChanges();

            let inputElement: HTMLInputElement = nativeElement.querySelector('input');
            expect(inputElement.value).toEqual(`02/28/${year}`);
          }));
        });
      });
    });
  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<DatepickerFieldMaskerReactiveTestComponent>;
    let component: DatepickerFieldMaskerReactiveTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(DatepickerFieldMaskerReactiveTestComponent);
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

        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
        fixture.detectChanges();

        setInput(nativeElement, '01/01/2000', fixture);
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

          expect(component.dateControl.value)
            .toBe('abcdebf');

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

        expect(component.dateControl.value).toBe('abcdebf');

        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
        fixture.detectChanges();

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
    let fixture: ComponentFixture<DatepickerFieldMaskerNoFormatTestComponent>;
    let component: DatepickerFieldMaskerNoFormatTestComponent;
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

      fixture = TestBed.createComponent(DatepickerFieldMaskerNoFormatTestComponent);
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
