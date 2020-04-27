import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  TemplateRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  SkyAffixAutoFitContext,
  SkyAffixer,
  SkyAffixService,
  SkyCoreAdapterService,
  SkyOverlayInstance,
  SkyOverlayService
} from '@skyux/core';

import {
  fromEvent,
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyDatepickerCalendarComponent
} from './datepicker-calendar.component';

let nextId = 0;

@Component({
  selector: 'sky-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDatepickerComponent implements OnDestroy, OnInit {

  /**
   * @internal
   * Indicates if the calendar button element or any of its children have focus.
   * @deprecated This property will be removed in the next major version release.
   */
  public get buttonIsFocused(): boolean {
    /* sanity check */
    /* istanbul ignore if */
    if (!this.triggerButtonRef) {
      return false;
    }
    const activeEl = document.activeElement;
    return this.triggerButtonRef.nativeElement === activeEl;
  }

  /**
   * @internal
   * Indicates if the calendar element or any of its children have focus.
   * @deprecated This property will be removed in the next major version release.
   */
  public get calendarIsFocused(): boolean {
    if (!this.calendarRef) {
      return false;
    }

    const focusedEl = document.activeElement;
    return this.calendarRef.nativeElement.contains(focusedEl);
  }

  /**
   * @internal
   * Indicates if the calendar element's visiblity property is 'visible'.
   * @deprecated This property will be removed in the next major version release.
   */
  public get calendarIsVisible(): boolean {
    return this.calendar ? this.calendar.isVisible : false;
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  public set disabled(value: boolean) {
    this._disabled = value;
    this.changeDetector.markForCheck();
  }

  public set selectedDate(value: Date) {
    this._selectedDate = value;
    if (this.calendar) {
      this.calendar.writeValue(this._selectedDate);
    }
  }

  public calendarId: string;

  public dateChange = new EventEmitter<Date>();

  public isOpen: boolean = false;

  public isVisible: boolean = false;

  public maxDate: Date;

  public minDate: Date;

  public startingDay: number;

  public triggerButtonId: string;

  @ViewChild(SkyDatepickerCalendarComponent)
  private calendar: SkyDatepickerCalendarComponent;

  @ViewChild('calendarRef', {
    read: ElementRef
  })
  private set calendarRef(value: ElementRef) {
    if (value) {
      this._calendarRef = value;
      this.calendar.writeValue(this._selectedDate);

      // Wait for the calendar component to render before guaging dimensions.
      setTimeout(() => {
        this.destroyAffixer();
        this.createAffixer();

        setTimeout(() => {
          this.coreAdapter.getFocusableChildrenAndApplyFocus(
            this.calendarRef,
            '.sky-datepicker-calendar-inner',
            false
          );

          this.isVisible = true;
          this.changeDetector.markForCheck();
        });
      });
    }
  }

  private get calendarRef(): ElementRef {
    return this._calendarRef;
  }

  @ViewChild('calendarTemplateRef', {
    read: TemplateRef
  })
  private calendarTemplateRef: TemplateRef<any>;

  @ViewChild('triggerButtonRef', {
    read: ElementRef
  })
  private triggerButtonRef: ElementRef;

  private affixer: SkyAffixer;

  private calendarUnsubscribe: Subject<void>;

  private ngUnsubscribe = new Subject();

  private overlay: SkyOverlayInstance;

  private _calendarRef: ElementRef;

  private _disabled = false;

  private _selectedDate: Date;

  constructor(
    private affixService: SkyAffixService,
    private changeDetector: ChangeDetectorRef,
    private coreAdapter: SkyCoreAdapterService,
    private overlayService: SkyOverlayService
  ) {
    const uniqueId = nextId++;
    this.calendarId = `sky-datepicker-calendar-${uniqueId}`;
    this.triggerButtonId = `sky-datepicker-button-${uniqueId}`;
  }

  public ngOnInit(): void {
    this.addTriggerButtonEventListeners();
  }

  public ngOnDestroy(): void {
    this.dateChange.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.removePickerEventListeners();
    this.destroyAffixer();
    this.destroyOverlay();
  }

  public onCalendarModeChange(): void {
    // Let the calendar populate in the DOM before recalculating placement.
    setTimeout(() => {
      this.affixer.reaffix();
    });
  }

  public onSelectedDateChange(value: Date): void {
    this.dateChange.emit(value);
    this.closePicker();
  }

  public onTriggerButtonClick(): void {
    this.openPicker();
  }

  private closePicker() {
    this.destroyAffixer();
    this.destroyOverlay();
    this.removePickerEventListeners();
    this.triggerButtonRef.nativeElement.focus();
    this.isOpen = false;
  }

  private openPicker(): void {
    this.isVisible = false;
    this.changeDetector.markForCheck();

    this.removePickerEventListeners();
    this.calendarUnsubscribe = new Subject<void>();
    this.destroyOverlay();
    this.createOverlay();

    this.isOpen = true;
    this.changeDetector.markForCheck();
  }

  private createAffixer(): void {
    const affixer = this.affixService.createAffixer(this.calendarRef);

    // Hide calendar when trigger button is scrolled off screen.
    affixer.placementChange
      .pipe(takeUntil(this.calendarUnsubscribe))
      .subscribe((change) => {
        this.isVisible = (change.placement !== null);
        this.changeDetector.markForCheck();
      });

    affixer.affixTo(this.triggerButtonRef.nativeElement, {
      autoFitContext: SkyAffixAutoFitContext.Viewport,
      enableAutoFit: true,
      horizontalAlignment: 'right',
      isSticky: true,
      placement: 'below'
    });

    this.affixer = affixer;
  }

  private destroyAffixer(): void {
    /*istanbul ignore else*/
    if (this.affixer) {
      this.affixer.destroy();
      this.affixer = undefined;
    }
  }

  private createOverlay(): void {
    const overlay = this.overlayService.create({
      enableClose: false,
      enablePointerEvents: false
    });

    overlay.backdropClick
      .pipe(takeUntil(this.calendarUnsubscribe))
      .subscribe(() => {
        if (this.isOpen) {
          this.closePicker();
        }
      });

    overlay.attachTemplate(this.calendarTemplateRef);

    this.overlay = overlay;
  }

  private destroyOverlay(): void {
    /*istanbul ignore else*/
    if (this.overlay) {
      this.overlayService.close(this.overlay);
      this.overlay = undefined;
    }
  }

  private addTriggerButtonEventListeners(): void {
    fromEvent(window.document, 'keydown')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        if (key === 'escape' && this.isOpen) {
          this.closePicker();
        }
      });
  }

  private removePickerEventListeners(): void {
    /* istanbul ignore else */
    if (this.calendarUnsubscribe) {
      this.calendarUnsubscribe.next();
      this.calendarUnsubscribe.complete();
      this.calendarUnsubscribe = undefined;
    }
  }
}
