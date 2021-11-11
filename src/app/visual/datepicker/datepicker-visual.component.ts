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
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  distinctUntilChanged
} from 'rxjs/operators';

import {
  Subject
} from 'rxjs';

import {
  SkyDatepickerCustomDate,
  SkyDatepickerDateRange
} from '../../public/public_api';

@Component({
  selector: 'datepicker-visual',
  templateUrl: './datepicker-visual.component.html'
})
export class DatepickerVisualComponent implements OnInit {

  public customDateStream: Subject<Array<SkyDatepickerCustomDate>> =
    new Subject<Array<SkyDatepickerCustomDate>>();
  public disabled = false;
  public minDate: Date;
  public maxDate: Date;
  public noValidate = false;
  public reactiveForm: FormGroup;
  public showImportant: boolean = false;
  public selectedDate: Date = new Date(1955, 10, 5);
  public startingDay: number;
  public strict: boolean = false;
  public currentDateRange: SkyDatepickerDateRange;

  constructor(
    private formBuilder: FormBuilder,
    private themeSvc: SkyThemeService
  ) { }

  public get reactiveDate(): AbstractControl {
    return this.reactiveForm.get('selectedDate');
  }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      selectedDate: new FormControl(new Date(1955, 10, 5), Validators.required)
    });

    this.reactiveDate.statusChanges
      .pipe(distinctUntilChanged())
      .subscribe((status: any) => {
        console.log('Status changed:', status);
      });

    this.reactiveDate.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value: any) => {
        console.log('Value changed:', value);
      });
  }

  public setMinMaxDates(): void {
    this.minDate = new Date('01/01/2018');
    this.maxDate = new Date('01/01/2020');
  }

  public setStartingDay(): void {
    this.startingDay = 1;
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
    this.selectedDate = new Date('2/2/2001');
  }

  public setInvalidValue(): void {
    this.reactiveDate.setValue('invalid');
    (this.selectedDate as any) = 'invalid';
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

  public toggleShowImortantDates(): void {
    this.showImportant = !this.showImportant;
    this.outputImportantDates();
  }

  public onDateRangeChange(range: SkyDatepickerDateRange): void {
    this.currentDateRange = range;
    if (this.showImportant) {
      this.outputImportantDates();
    }
  }

  public outputImportantDates(): void {
    if (
      this.showImportant &&
      this.currentDateRange
    ) {
      let customDates: SkyDatepickerCustomDate[] = [];
      customDates.push({
        date: this.currentDateRange.startDate,
        disabled: false,
        important: true,
        importantText: ['First date']
      });

      customDates.push({
        date: this.getNextDate(this.currentDateRange.startDate, 8),
        disabled: false,
        important: true,
        importantText: ['Important']
      });

      customDates.push({
        date: this.getNextDate(this.currentDateRange.startDate, 9),
        disabled: false,
        important: true,
        importantText: ['Also Important']
      });

      customDates.push({
        date: this.getNextDate(this.currentDateRange.startDate, 10),
        disabled: true,
        important: true,
        importantText: ['Disabled']
      });

      customDates.push({
        date: this.getNextDate(this.currentDateRange.startDate, 11),
        disabled: true,
        important: false,
        importantText: []
      });

      customDates.push({
        date: this.getNextDate(this.currentDateRange.startDate, 12),
        disabled: false,
        important: true,
        importantText: []
      });

      customDates.push({
        date: this.getNextDate(this.currentDateRange.startDate, 13),
        disabled: false,
        important: true,
        importantText: ['Multiple', 'Messages']
      });

      customDates.push({
        date: this.currentDateRange.endDate,
        disabled: false,
        important: true,
        importantText: ['Last date']
      });

      this.customDateStream.next(customDates);
    } else {
      this.customDateStream.next([]);
    }
  }

  public getNextDate(startDate: Date, daystoAdd: number): Date {
    let newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + daystoAdd);
    return newDate;
  }
}
