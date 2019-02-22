import {
  Component
} from '@angular/core';

import {
  SkyAppLocaleInfo,
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  Observable
} from 'rxjs/Observable';

export class MyLocaleProvider extends SkyAppLocaleProvider {
  public getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    return Observable.of({
      locale: 'fr-CA'
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
