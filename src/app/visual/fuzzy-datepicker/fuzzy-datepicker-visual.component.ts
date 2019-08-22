import {
  Component,
  OnInit
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  SkyFuzzyDateService
} from '../../public/modules/datepicker/fuzzy-date.service';

@Component({
  selector: 'fuzzy-datepicker-visual',
  templateUrl: './fuzzy-datepicker-visual.component.html'
})
export class FuzzyDatepickerVisualComponent implements OnInit {
  public disabled = false;
  public dateFormat: any = 'MM/DD/YYYY';
  public minFuzzyDate: any;
  public maxFuzzyDate: any;
  public yearRequired: boolean;
  public cannotBeFuture: boolean;

  public noValidate = false;
  public reactiveForm: FormGroup;
  public selectedFuzzyDate: any = { month: 4, day: 4, year: 2017 };
  public startingDay: number;

  constructor(
    private formBuilder: FormBuilder,
    private fuzzyDateService: SkyFuzzyDateService
  ) { }

  public get reactiveDate(): AbstractControl {
    return this.reactiveForm.get('selectedFuzzyDate');
  }

  // This property is only necessary to support the datepicker-calendar
  //    on the page with the fuzzy datepicker
  public get selectedDate(): any {
    let fuzzyMoment = this.fuzzyDateService.getMomentFromFuzzyDate(this.selectedFuzzyDate);
    let selectedDate: any;

    if (fuzzyMoment) {
      selectedDate = fuzzyMoment.toDate();
    }

    return selectedDate;
  }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      selectedFuzzyDate: new FormControl('4/4/2017', Validators.required)
    });

    this.reactiveDate.statusChanges
      .distinctUntilChanged()
      .subscribe((status: any) => {
        console.log('Status changed:', status);
      });

    this.reactiveDate.valueChanges
      .distinctUntilChanged()
      .subscribe((value: any) => {
        console.log('Value changed:', value);
      });
  }

  public setMinMaxDates(): void {
    this.minFuzzyDate = { day: 1, month: 1, year: 2018 };
    this.maxFuzzyDate = { day: 1, month: 1, year: 2020 };
  }

  public setStartingDay(): void {
    this.startingDay = 1;
  }

  public toggleYearRequired(): void {
    this.yearRequired = !this.yearRequired;
    console.log('year required: ' + this.yearRequired);
  }

  public toggleCannotBeFuture(): void {
    this.cannotBeFuture = !this.cannotBeFuture;
    console.log('cannot be future: ' + this.cannotBeFuture);
  }

  public toggleDisabled(): void {
    if (this.reactiveDate.disabled) {
      this.reactiveDate.enable();
    } else {
      this.reactiveDate.disable();
    }

    this.disabled = !this.disabled;
  }

  public setValue(): void {
    this.reactiveDate.setValue(new Date('2/2/2001'));
    this.selectedFuzzyDate = new Date('2/2/2001');
  }

  public setInvalidValue(): void {
    this.reactiveDate.setValue('invalid');
    this.selectedFuzzyDate = 'invalid';
  }

  public get selectedDateForDisplay(): string {
    return JSON.stringify(this.selectedFuzzyDate);
  }

  public get reactiveFormSelectedDateForDisplay(): string {
    return JSON.stringify(this.reactiveDate.value);
  }
}
