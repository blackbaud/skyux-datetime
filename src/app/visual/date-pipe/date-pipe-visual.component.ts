import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyDatePipe
} from '../../public';

@Component({
  selector: 'date-pipe-visual',
  templateUrl: './date-pipe-visual.component.html'
})
export class DatePipeVisualComponent implements OnInit {

  public date = new Date('11/26/2020');

  public format: string = 'short';

  // Pre-defined format options from SkyDateFormatUtility.
  public formatList: string[] = [
    'medium',
    'short',
    'fullDate',
    'longDate',
    'mediumDate',
    'shortDate',
    'mediumTime',
    'shortTime'
  ];

  public locale: string = 'en-US';

  public localeList: string[] = [
    'de-DE',
    'fr-FR',
    'en-CA',
    'es-ES',
    'en-GB',
    'en-US',
    'es-MX',
    'it-IT',
    'ja-JP',
    'pt-BR',
    'ru-RU',
    'zh-CN'
  ];

  constructor(
    private datePipe: SkyDatePipe
  ) { }

  public ngOnInit(): void {
    const result = this.datePipe.transform(new Date('01/01/2019'), 'short', 'en-US');
    console.log('Result from calling pipe directly:', result);
  }
}
