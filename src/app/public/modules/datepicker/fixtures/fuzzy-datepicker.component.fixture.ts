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
  @ViewChild(SkyFuzzyDatepickerInputDirective)
  public inputDirective: SkyFuzzyDatepickerInputDirective;

  public maxFuzzyDate: any;
  public maxFuzzyDateErrorMessage: any;
  public minFuzzyDate: any;
  public minFuzzyDateErrorMessage: any;
  public dateFormat: any = 'MM/DD/YYYY';
  public dateFormatErrorMessage: any;
  public yearRequired: boolean;
  public yearRequiredErrorMessage: any;
  public cannotBeFuture: boolean;
  public cannotBeFutureErrorMessage: any;

  public minDate: Date;
  public maxDate: Date;

  public selectedDate: any;

  public noValidate: boolean = false;
  public startingDay = 0;
  public isDisabled: boolean;
  public showInvalidDirective = false;
}
