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
  public minFuzzyDate: any;
  public dateFormat: any = 'MM/DD/YYYY';
  public yearRequired: boolean;
  public cannotBeFuture: boolean;

  public selectedDate: any;

  public noValidate: boolean = false;
  public startingDay = 0;
  public isDisabled: boolean;
  public showInvalidDirective = false;
}
