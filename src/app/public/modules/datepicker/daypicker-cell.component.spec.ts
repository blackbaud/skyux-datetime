import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyPopoverMessageType
} from '@skyux/popovers';

import {
  SkyDatepickerCalendarInnerComponent
} from './datepicker-calendar-inner.component';

import {
  SkyDatepickerDate
} from './datepicker-date';

import {
  SkyDatepickerModule
} from './datepicker.module';

import {
  SkyDayPickerCellComponent
} from './daypicker-cell.component';

function setNextMouseOverDate(component: any, date: SkyDatepickerDate): void {
  component.daypickerPopoverService.mouseoverDateStream.next(date);
}

function getShowTooltipSpy(component: any): jasmine.Spy {
  return spyOn(component, 'showTooltip');
}

function getHideTooltipSpy(component: any): jasmine.Spy {
  return spyOn(component, 'hideTooltip');
}

function getNextMouseoverDateSpy(component: any): jasmine.Spy {
  return spyOn(component.daypickerPopoverService.mouseoverDateStream, 'next');
}

function getPopoverOpen(component: any): boolean {
  return component.popoverOpen;
}

function setPopoverOpen(component: any, open: boolean): void {
  component.popoverOpen = open;
}

function setCancelPopover(component: any, cancel: boolean): void {
  component.cancelPopover = cancel;
}

function getPopoverControllerSpy(component: any): jasmine.Spy {
  return spyOn(component.popoverController, 'next');
}

function hideTooltip(component: any): void {
  component.hideTooltip();
}

function showTooltip(component: any): void {
  component.showTooltip();
}

function setActiveUid(component: any, uid: string): void {
  component.activeUid = uid;
}

describe('daypicker cell', () => {

  let fixture: ComponentFixture<SkyDayPickerCellComponent>;
  let component: SkyDayPickerCellComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [

      ],
      imports: [
        SkyDatepickerModule
      ]
    });

    fixture = TestBed.createComponent(SkyDayPickerCellComponent);
    component = fixture.componentInstance;
    component.date = {
      current: false,
      date: new Date(2021, 9, 1),
      disabled: false,
      label: '1',
      secondary: false,
      selected: false,
      uid: '1',
      important: true,
      importantText: ['important!']
    };

    component.datepicker = new SkyDatepickerCalendarInnerComponent();
  });

  describe('set hasTooltip', () => {
    it('should set hasTooltip to false if not an important date', () => {
      component.date.important = false;
      fixture.detectChanges();

      expect(component.hasTooltip).toBeFalsy();
    });

    it('should set hasTooltip to false if an important date and importantText undefined', () => {
      component.date.importantText = undefined;

      fixture.detectChanges();

      expect(component.hasTooltip).toBeFalsy();
    });

    it('should set hasTooltip to false if an important date and no importantText items', () => {
      component.date.importantText = [];

      fixture.detectChanges();

      expect(component.hasTooltip).toBeFalsy();
    });

    it('should set hasTooltip to false if an important date and importantText item empty', () => {
      component.date.importantText = [''];

      fixture.detectChanges();

      expect(component.hasTooltip).toBeFalsy();
    });

    it('should set hasTooltip to true if important date and importantText item not empty', () => {
      fixture.detectChanges();

      expect(component.hasTooltip).toBeTruthy();
    });

  });

  describe('showTooltip on Init', () => {
    let showSpy: jasmine.Spy;
    let activeDateSpy: jasmine.Spy;
    beforeEach(() => {
      showSpy = getShowTooltipSpy(component);
      activeDateSpy = spyOn(component.datepicker, 'isActive').and.returnValue(true);
      component.activeDateHasChanged = true;
    });

    it('should not show tooltip when not active date', () => {
      activeDateSpy.and.returnValue(false);
      fixture.detectChanges();

      expect(showSpy).not.toHaveBeenCalled();
    });

    it('should not show tooltip when no tooltip', () => {
      component.date.important = false;
      fixture.detectChanges();

      expect(showSpy).not.toHaveBeenCalled();
    });

    it('should not show tooltip when active date has not changed', () => {
      component.activeDateHasChanged = false;
      fixture.detectChanges();

      expect(showSpy).not.toHaveBeenCalled();
    });

    it('should not show tooltip', () => {
      fixture.detectChanges();

      expect(showSpy).toHaveBeenCalled();
    });
  });

  describe('daypickerPopoverService mouseoverDateStream', () => {
    let hideSpy: jasmine.Spy;

    beforeEach(() => {
      hideSpy = getHideTooltipSpy(component);
      fixture.detectChanges();
    });

    it('should hide the tooltip if no mouseover date', () => {
      setNextMouseOverDate(component, undefined);

      expect(hideSpy).toHaveBeenCalled();
    });

    it('should hide the tooltip if new mouseover date', () => {
      setNextMouseOverDate (
        component,
        {
          current: false,
          date: new Date(),
          disabled: false,
          label: '2',
          secondary: false,
          selected: false,
          uid: '2'
        }
      );

      expect(hideSpy).toHaveBeenCalled();
    });

    it('should not hide the tooltip if mouseover this date', () => {
      setNextMouseOverDate (component, component.date);

      expect(hideSpy).not.toHaveBeenCalled();
    });
  });

  describe('onDayMouseenter', () => {
    let showSpy: jasmine.Spy;
    let nextDateSpy: jasmine.Spy;

    beforeEach(() => {
      showSpy = getShowTooltipSpy(component);
      nextDateSpy = getNextMouseoverDateSpy(component);
    });

    it('should not call showTooltip if no tooltip', () => {
      component.date.important = false;
      fixture.detectChanges();

      component.onDayMouseenter(undefined);

      expect(component.hasTooltip).toBeFalsy();
      expect(showSpy).not.toHaveBeenCalled();
      expect(nextDateSpy).not.toHaveBeenCalled();
    });

    it('should call showTooltip if have tooltip', () => {
      fixture.detectChanges();

      component.onDayMouseenter(undefined);

      expect(component.hasTooltip).toBeTruthy();
      expect(showSpy).toHaveBeenCalled();
      expect(nextDateSpy).toHaveBeenCalledWith(component.date);
    });

  });

  describe('onDayMouseleave', () => {
    let hideSpy: jasmine.Spy;
    let nextDateSpy: jasmine.Spy;

    beforeEach(() => {
      hideSpy = getHideTooltipSpy(component);
      nextDateSpy = getNextMouseoverDateSpy(component);
    });

    it('should not call hideTooltip if no tooltip', () => {
      component.date.important = false;
      fixture.detectChanges();

      component.onDayMouseleave(undefined);

      expect(component.hasTooltip).toBeFalsy();
      expect(hideSpy).not.toHaveBeenCalled();
      expect(nextDateSpy).toHaveBeenCalledWith(undefined);
    });

    it('should call showTooltip if have tooltip', () => {
      fixture.detectChanges();

      component.onDayMouseleave(undefined);

      expect(component.hasTooltip).toBeTruthy();
      expect(hideSpy).toHaveBeenCalled();
      expect(nextDateSpy).toHaveBeenCalledWith(undefined);
    });

  });

  describe('onPopoverClosed', () => {

    it('should set popoverOpen to false', () => {
      fixture.detectChanges();
      setPopoverOpen(component, true);

      component.onPopoverClosed(undefined);

      expect(getPopoverOpen(component)).toBeFalsy();
    });

  });

  describe('onPopoverOpen', () => {
    let hideSpy: jasmine.Spy;

    beforeEach(() => {
      hideSpy = getHideTooltipSpy(component);
    });

    it('should set popoverOpen to true', () => {
      fixture.detectChanges();
      setPopoverOpen(component, false);
      setCancelPopover(component, false);

      component.onPopoverOpened(undefined);

      expect(getPopoverOpen(component)).toBeTruthy();
      expect(hideSpy).not.toHaveBeenCalled();
    });

    it('should hide popover if cancelled', () => {
      fixture.detectChanges();
      setPopoverOpen(component, false);
      setCancelPopover(component, true);

      component.onPopoverOpened(undefined);

      expect(hideSpy).toHaveBeenCalled();
    });

  });

  describe('getImportantTextLabel', () => {

    it('should return empty string if no tooltip', () => {
      component.date.important = false;
      fixture.detectChanges();

      expect(component.getImportantTextLabel()).toBe('');
    });

    it('should return a single stringif one important text', () => {
      fixture.detectChanges();

      expect(component.getImportantTextLabel()).toBe('important!');
    });

    it('should return a comma delimited string if multiple important texts', () => {
      component.date.importantText = ['important!', 'this too'];
      fixture.detectChanges();

      expect(component.getImportantTextLabel()).toBe('important!, this too');
    });

  });

  describe('hideTooltip', () => {
    let controlerSpy: jasmine.Spy;

    beforeEach(() => {
      controlerSpy = getPopoverControllerSpy(component);
    });

    it('should close the popover if open', () => {
      fixture.detectChanges();
      setPopoverOpen(component, true);

      hideTooltip(component);

      expect(controlerSpy).toHaveBeenCalledWith({ type: SkyPopoverMessageType.Close });
    });

    it('should not close the popover if not open', () => {
      fixture.detectChanges();
      setPopoverOpen(component, false);

      hideTooltip(component);

      expect(controlerSpy).not.toHaveBeenCalled();
    });

  });

  describe('showTooltip', () => {
    let controlerSpy: jasmine.Spy;

    beforeEach(() => {
      controlerSpy = getPopoverControllerSpy(component);
    });

    it('should not open the tool tip if hasTooltip is false', fakeAsync(() => {
      component.date.important =  false;
      fixture.detectChanges();
      setPopoverOpen(component, false);

      showTooltip(component);

      tick(500);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(controlerSpy).not.toHaveBeenCalled();
      });
    }));

    it('should not open the tool tip if already open', fakeAsync(() => {
      fixture.detectChanges();
      setPopoverOpen(component, true);

      showTooltip(component);

      tick(500);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(controlerSpy).not.toHaveBeenCalled();
      });
    }));

    it('should not open the tool tip if cancelled', fakeAsync(() => {
      fixture.detectChanges();
      setPopoverOpen(component, false);
      setActiveUid(component, component.date.uid);

      showTooltip(component);

      setCancelPopover(component, true);

      tick(500);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(controlerSpy).not.toHaveBeenCalled();
      });

    }));

    it('should not open the tool tip if activeUid differs', fakeAsync(() => {
      fixture.detectChanges();
      setPopoverOpen(component, false);
      setActiveUid(component, '2');

      showTooltip(component);

      tick(500);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(controlerSpy).not.toHaveBeenCalled();
      });

    }));

    it('should open the tool tip', fakeAsync(() => {
      fixture.detectChanges();
      setPopoverOpen(component, false);
      setActiveUid(component, component.date.uid);

      showTooltip(component);

      tick(500);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(controlerSpy).toHaveBeenCalledWith({ type: SkyPopoverMessageType.Open });
      });

    }));

  });
});
