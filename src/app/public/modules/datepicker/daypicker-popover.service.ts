import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SkyDatepickerDate } from './datepicker-date';

/**
 * @internal
 */
@Injectable()
export class SkyDaypickerPopoverService {

  public mouseoverDateStream: Subject<SkyDatepickerDate> = new Subject<SkyDatepickerDate>();

  constructor(

  ) {
  }
}
