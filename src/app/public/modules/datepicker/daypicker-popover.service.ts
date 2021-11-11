import {
  Injectable
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyDatepickerDate
} from './datepicker-date';

/**
 * @internal
 */
@Injectable()
export class SkyDaypickerPopoverService {

  /**
   * Specifies if a key date popover is currently displayed.
   */
  public keyDatePopoverStream: Subject<SkyDatepickerDate> = new Subject<SkyDatepickerDate>();

}
