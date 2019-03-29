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
  SkyAppResourcesService
} from '@skyux/i18n';

import {
  SkyDateRangeCalculatorId,
  SkyDateRangeCalculatorType,
  SkyDateRangeService,
  SkyDateRange
} from '../../public';

@Component({
  selector: 'date-range-picker-visual',
  templateUrl: './date-range-picker-visual.component.html',
  styleUrls: ['./date-range-picker-visual.component.scss']
})
export class DateRangePickerVisualComponent implements OnInit {
  public calculatorIds: SkyDateRangeCalculatorId[];
  public disabled = false;
  public reactiveForm: FormGroup;

  public get reactiveRange(): AbstractControl {
    return this.reactiveForm.get('lastDonation');
  }

  public get constituentName(): AbstractControl {
    return this.reactiveForm.get('constituentName');
  }

  constructor(
    private dateRangeService: SkyDateRangeService,
    private formBuilder: FormBuilder,
    private resourcesService: SkyAppResourcesService
  ) { }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      constituentName: new FormControl(undefined, [Validators.required]),
      lastDonation: new FormControl()
      // lastDonation: new FormControl({
      //   calculatorId: SkyDateRangeCalculatorId.LastFiscalYear
      // }, [Validators.required])
    });

    this.reactiveRange.statusChanges
      .distinctUntilChanged()
      .subscribe((status) => {
        console.log(
          '[CONSUMER] Date range status change:',
          status,
          this.reactiveRange.errors
        );
      });

    this.reactiveRange.valueChanges
      .distinctUntilChanged()
      .subscribe((value) => {
        console.log('[CONSUMER] Date range value change:', value);
      });
  }

  public toggleDisabled(): void {
    this.disabled = !this.disabled;

    if (this.reactiveForm.disabled) {
      this.reactiveForm.enable();
    } else {
      this.reactiveForm.disable();
    }
  }

  public resetForm(): void {
    this.reactiveForm.reset();
    this.reactiveForm.markAsPristine();
    this.reactiveForm.markAsUntouched();
  }

  public setRange(): void {
    const range: SkyDateRange = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/1/2012'),
      endDate: new Date('1/1/2013')
    };

    this.reactiveRange.setValue(range);
  }

  public setInvalidRange(): void {
    const range: SkyDateRange = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/1/2013'),
      endDate: new Date('1/1/2012')
    };

    this.reactiveRange.setValue(range);
  }

  public setInvalidDates(): void {
    const range: SkyDateRange = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: 'asdf' as any,
      endDate: 'asdf' as any
    };

    this.reactiveRange.setValue(range);
  }

  public submit(): void {
    const value = this.reactiveForm.value;
    console.log(value, this.constituentName.errors);
    alert(JSON.stringify(value));
  }

  public setCalculatorIds(): void {
    this.resourcesService
      .getString('skyux_date_range_picker_invalid_range_error_label')
      .first()
      .subscribe((value) => {
        const instance = this.dateRangeService.createCalculator({
          shortDescription: value,
          type: SkyDateRangeCalculatorType.Relative,
          getValue: () => ({
            startDate: new Date(),
            endDate: new Date('1/1/1')
          })
        });

        this.calculatorIds = [
          SkyDateRangeCalculatorId.SpecificRange,
          SkyDateRangeCalculatorId.LastFiscalYear,
          instance.calculatorId
        ];
      });
  }
}