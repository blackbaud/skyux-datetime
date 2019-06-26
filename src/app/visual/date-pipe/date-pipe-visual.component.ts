import {
  Component,
  OnInit
} from '@angular/core';

import {
  skyFormatDate
} from '../../public';

@Component({
  selector: 'date-pipe-visual',
  templateUrl: './date-pipe-visual.component.html'
})
export class DatePipeVisualComponent implements OnInit {

  public dateValue1 = new Date('01/01/2019');
  public dateValue2 = new Date('02/02/2019');
  public dateValue3 = new Date('03/03/2019');
  public format: string;
  public locale: string;

  public ngOnInit(): void {
    const result = skyFormatDate(new Date('01/01/2019'), 'short', 'en-US');
    console.log('Result:', result);
  }

  public toggleLocale(): void {
    if (this.locale === 'en-GB') {
      this.locale = 'en-US';
    } else {
      this.locale = 'en-GB';
    }
  }

  public toggleFormat(): void {
    if (this.format === 'medium') {
      this.format = 'short';
    } else {
      this.format = 'medium';
    }
  }
}
