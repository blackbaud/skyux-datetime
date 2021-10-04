import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { SkyPopoverMessage, SkyPopoverMessageType } from '@skyux/popovers';
import { SkyPopoverComponent } from '@skyux/popovers/modules/popover/popover.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';

import {
  SkyDatepickerDate
} from './datepicker-date';
import { SkyDaypickerPopoverService } from './daypicker-popover.service';

/**
 * @internal
 */
@Component({
  selector: 'sky-daypicker-cell',
  templateUrl: 'daypicker-cell.component.html',
  styleUrls: ['./daypicker-cell.component.scss']
})
export class SkyDayPickerCellComponent implements OnInit, OnDestroy {

  @Input()
  public date: SkyDatepickerDate;

  @Input()
  public datepicker: SkyDatepickerCalendarInnerComponent;

  @Input()
  public activeDateHasChanged: boolean;

  public hasTooltip: boolean = false;

  public popoverController = new Subject<SkyPopoverMessage>();

  private activeUid: string = '';

  private popoverOpen: boolean = false;

  private ngUnsubscribe = new Subject<void>();

  private cancelPopover: boolean = false;

  public constructor(private daypickerPopoverService: SkyDaypickerPopoverService) {

  }

  public ngOnInit(): void {
    this.hasTooltip =
      this.date.important &&
      this.date.importantText &&
      this.date.importantText.length > 0;

    // show the tooltip if this is the active date and is not the
    // initial active date (activeDateHasChanged)
    if (
      this.datepicker.isActive(this.date) &&
      this.activeDateHasChanged &&
      this.hasTooltip
    ) {
      this.activeUid = this.date.uid;
      this.showTooltip();
    }

    if (this.hasTooltip) {
      // subscribe to the mouseover date stream to get date currently active
      this.daypickerPopoverService.mouseoverDateStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(date => {
        if (date) {
          this.activeUid = date.uid;
        } else {
          this.activeUid = '';
        }
        // if this day has an open popover and they have moved off of the day close the popover
        if (this.date.uid !== this.activeUid) {
          this.hideTooltip();
        }
      });
    }

  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onDayMouseenter(event: MouseEvent): void {
    // entering a cell check to see if a tooltip should be displayed and if so signal
    // new active day to other days
    this.cancelPopover = false;
    if (this.hasTooltip) {
      this.showTooltip();
      this.daypickerPopoverService.mouseoverDateStream.next(this.date);
    }
  }

  public onDayMouseleave(event: MouseEvent): void {
    // leaving the cell hide any tooltip and signal to other cells there is no active
    // tooltip (will close a tooltip that is open due to being the selected day)
    this.cancelPopover = true;
    if (this.hasTooltip) {
      this.hideTooltip();
    }
    this.daypickerPopoverService.mouseoverDateStream.next(undefined);
  }

  public onPopoverClosed(event: SkyPopoverComponent): void {
    this.popoverOpen = false;
  }

  public onPopoverOpened(event: SkyPopoverComponent): void {
    this.popoverOpen = true;
    if (this.cancelPopover) {
      // there is the potential for the popover to get opened just as the user leaves a
      // date, if that happens close it
      this.hideTooltip();
      this.cancelPopover = false;
    }
  }

  public getImportantTextLabel(): string {
    if (this.hasTooltip) {
      return this.date.importantText.join(', ');
    } else {
      return '';
    }
  }

  private hideTooltip(): void {
    if (this.popoverOpen) {
      this.popoverController.next({ type: SkyPopoverMessageType.Close });
    }
  }

  private showTooltip(): void {
    if (
      this.hasTooltip &&
      !this.popoverOpen
    ) {
      // wait half a second before showing the tooltip
      setTimeout(() => {
        // open the popover as long as they haven't moved off the date in the interim
        if (
          !this.cancelPopover &&
          this.activeUid === this.date.uid
        ) {
          this.popoverController.next({ type: SkyPopoverMessageType.Open });
        }
      }, 500);
    }
  }
}
