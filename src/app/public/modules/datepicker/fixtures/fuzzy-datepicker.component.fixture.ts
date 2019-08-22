import {
  Component,
  ViewChild
} from '@angular/core';
import {
  SkyFuzzyDatepickerInputDirective
} from '../datepicker-input-fuzzy.directive';

@Component({
  selector: 'fuzzy-datepicker-test',
  templateUrl: './fuzzy-datepicker.component.fixture.html'
})
export class FuzzyDatepickerTestComponent {

  public cannotBeFuture: boolean;

  public dateFormat: any = 'MM/DD/YYYY';

  public isDisabled: boolean;

  public maxFuzzyDate: any;

  public minFuzzyDate: any;

  public noValidate: boolean = false;

  public selectedDate: any;

  public showInvalidDirective = false;

  public startingDay = 0;

  public yearRequired: boolean;

  @ViewChild(SkyFuzzyDatepickerInputDirective)
  public inputDirective: SkyFuzzyDatepickerInputDirective;
}
