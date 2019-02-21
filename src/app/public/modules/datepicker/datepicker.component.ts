import {
  Component,
  EventEmitter,
  OnDestroy,
  ViewChild
} from '@angular/core';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType
} from '@skyux/popovers';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyDatepickerCalendarComponent
} from './datepicker-calendar.component';

@Component({
  selector: 'sky-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class SkyDatepickerComponent implements OnDestroy {
  public get dropdownController(): Observable<SkyDropdownMessage> {
    return this._dropdownController;
  }

  public set selectedDate(value: Date) {
    this.calendar.writeValue(value);
  }

  public dateChange = new EventEmitter<Date>();
  public disabled = false;
  public maxDate: Date;
  public minDate: Date;
  public startingDay = 0;

  @ViewChild(SkyDatepickerCalendarComponent)
  private calendar: SkyDatepickerCalendarComponent;

  private _dropdownController = new Subject<SkyDropdownMessage>();

  public ngOnDestroy(): void {
    this._dropdownController.complete();
    this.dateChange.complete();
  }

  public onCalendarModeChange(): void {
    this._dropdownController.next({
      type: SkyDropdownMessageType.Reposition
    });
  }

  public onSelectedDateChange(value: Date): void {
    this.dateChange.emit(value);
    this._dropdownController.next({
      type: SkyDropdownMessageType.Close
    });
  }
}
