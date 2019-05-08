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

const moment = require('moment');

fdescribe('datepicker with field masker', () => {

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
    });

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

    it('should reset value to blank if input blurs without any user input', fakeAsync(() => {
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'blur');
      fixture.detectChanges();

      expect(nativeElement.querySelector('input').value).toBe('');
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

    it('should highlight next group once current group is filled', fakeAsync(() => {
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
      fixture.detectChanges();

      nativeElement.querySelector('input').value = '01/DD/YYYY';
      SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keyup');
      fixture.detectChanges();

      let inputElement: HTMLInputElement = nativeElement.querySelector('input');
      expect(inputElement.selectionStart).toEqual(3);
      expect(inputElement.selectionEnd).toEqual(5);

      nativeElement.querySelector('input').value = '01/20/YYYY';
      SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'keyup');
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

    it('should not allow non-numeric input', fakeAsync(() => {
      let letters: string[] = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(nativeElement.querySelector('input'), 'focus');
      fixture.detectChanges();

      for (let i = 0; i < letters.length; ++i) {
        let keyPressEvent = new KeyboardEvent('keypress', { key: 'Key' + letters[0] });
        let keyPressSpy = spyOn(keyPressEvent, 'preventDefault');
        component.inputDirective.onInputKeypress(keyPressEvent);
        fixture.detectChanges();

        expect(keyPressSpy).toHaveBeenCalled();
      }
    }));
  });
});
