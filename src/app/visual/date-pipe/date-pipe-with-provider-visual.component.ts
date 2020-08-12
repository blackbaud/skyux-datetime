import {
  Component
} from '@angular/core';

import {
  SkyAppLocaleInfo,
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  of,
  Observable
} from 'rxjs';

export class MyLocaleProvider extends SkyAppLocaleProvider {
  public getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    return of({
      locale: 'zh-CN'
    });
  }
}

@Component({
  selector: 'date-pipe-with-provider-visual',
  templateUrl: './date-pipe-with-provider-visual.component.html',
  providers: [
    {
      provide: SkyAppLocaleProvider,
      useClass: MyLocaleProvider
    }
  ]
})
export class DatePipeWithProviderVisualComponent {
  public dateValue = new Date('01/01/2019');
}
