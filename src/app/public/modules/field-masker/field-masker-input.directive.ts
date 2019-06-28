import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  ValidationErrors
} from '@angular/forms';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/distinctUntilChanged';

import 'rxjs/add/operator/takeUntil';

import {
  SkyDateFormatter,
  SkyDatepickerComponent,
  SkyDatepickerConfigService
} from '../datepicker';

import {
  getValidDay,
  getValidMonth
} from './date-logic-utils';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyFieldMaskerInputDirective),
  multi: true
};

const SKY_DATEPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyFieldMaskerInputDirective),
  multi: true
};
// tslint:enable

@Directive({
  selector: '[skyFieldMaskerInput]',
  providers: [
    SKY_DATEPICKER_VALUE_ACCESSOR,
    SKY_DATEPICKER_VALIDATOR
  ]
})
export class SkyFieldMaskerInputDirective implements OnInit, OnDestroy, AfterViewInit, AfterContentInit, ControlValueAccessor, Validator {

  @Input()
  public set dateFormat(value: string) {
    this._dateFormat = value;
  }

  public get dateFormat(): string {
    return this._dateFormat || this.configService.dateFormat;
  }

  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'disabled',
      value
    );
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  public set maxDate(value: Date) {
    this._maxDate = value;
    this.datepickerComponent.maxDate = this.maxDate;

    this.onValidatorChange();
  }

  public get maxDate(): Date {
    return this._maxDate || this.configService.maxDate;
  }

  @Input()
  public set minDate(value: Date) {
    this._minDate = value;
    this.datepickerComponent.minDate = this.minDate;

    this.onValidatorChange();
  }

  public get minDate(): Date {
    return this._minDate || this.configService.minDate;
  }

  @Input()
  public skyDatepickerNoValidate = false;

  @Input()
  public set startingDay(value: number) {
    this._startingDay = value;
    this.datepickerComponent.startingDay = this.startingDay;

    this.onValidatorChange();
  }

  public get startingDay(): number {
    return this._startingDay || this.configService.startingDay;
  }

  private get value(): any {
    return this._value;
  }

  private set value(value: any) {
    const dateValue = this.getDateValue(value);

    const areDatesEqual = (
      this._value instanceof Date &&
      dateValue &&
      dateValue.getTime() === this._value.getTime()
    );

    const isNewValue = (
      dateValue !== this._value ||
      !areDatesEqual
    );

    this._value = (dateValue || value);

    if (isNewValue) {
      this.onChange(this._value);

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.isFirstChange && this.control) {
        this.control.markAsPristine();
      }

      if (this.isFirstChange && this._value) {
        this.isFirstChange = false;
      }

      this.datepickerComponent.selectedDate = this._value;
    }

    if (dateValue) {
      const formattedDate = this.dateFormatter.format(dateValue, this.dateFormat);
      this.setInputElementValue(formattedDate);
    } else {
      this.setInputElementValue(value || '');
    }
  }

  private validDelimiters: RegExp = /[\\()-./]/g;
  private control: AbstractControl;
  private currentGroup: number;
  private dateFormatter = new SkyDateFormatter();
  private delimiters: string[] = [];
  private isFirstChange = true;
  private groupLength: number[] = [];
  private ngUnsubscribe = new Subject<void>();

  private dayRegex: RegExp = /d/gi;
  private monthRegex: RegExp = /m/gi;
  private yearRegex: RegExp = /y/gi;
  private fillerCharacter: string = '0';

  private tabKey: string = 'Tab';
  private arrowUpKey: string = 'ArrowUp';
  private arrowDownKey: string = 'ArrowDown';
  private arrowLeftKey: string = 'ArrowLeft';
  private arrowRightKey: string = 'ArrowRight';
  private endKey: string = 'End';
  private homeKey: string = 'Home';

  private _dateFormat: string;
  private _disabled = false;
  private _maxDate: Date;
  private _minDate: Date;
  private _startingDay: number;
  private _value: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private configService: SkyDatepickerConfigService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private resourcesService: SkyLibResourcesService,
    @Optional() private datepickerComponent: SkyDatepickerComponent
  ) { }

  public ngOnInit(): void {
    if (!this.datepickerComponent) {
      throw new Error(
        'You must wrap the `skyDatepickerInput` directive within a ' +
        '`<sky-datepicker>` component!'
      );
    }

    const element = this.elementRef.nativeElement;

    element.setAttribute('placeholder', this.dateFormat);

    this.renderer.addClass(
      element,
      'sky-form-control'
    );

    const hasAriaLabel = element.getAttribute('aria-label');

    if (!hasAriaLabel) {
      this.resourcesService.getString('skyux_date_field_default_label')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((value: string) => {
          this.renderer.setAttribute(
            element,
            'aria-label',
            value
          );
        });
    }

    this.initializeGroupsAndDelimiters();
  }

  public ngAfterContentInit(): void {
    this.datepickerComponent.dateChange
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((value: Date) => {
        this.isFirstChange = false;
        this.value = value;
        this.onTouched();
      });
  }

  public ngAfterViewInit(): void {
    // This is needed to address a bug in Angular 4.
    // When a control value is set intially, its value is not represented on the view.
    // See: https://github.com/angular/angular/issues/13792
    /* istanbul ignore else */
    if (this.control) {
      this.control.setValue(this.value, {
        emitEvent: false
      });

      this.changeDetector.detectChanges();
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('change', ['$event'])
  public onInputChange(event: any) {
    this.isFirstChange = false;
    this.value = event.target.value;
  }

  @HostListener('blur')
  public onInputBlur(): void {
    this.onTouched();
    /* istanbul ignore else */
    if (this.elementRef.nativeElement.value === this.dateFormat) {
      this.writeValue(undefined);
    } else if (!this.currentGroupIsFilled()) {
      this.fillInCurrentGroup();
      this.validateGroup();
    }
  }

  @HostListener('keyup', ['$event'])
  public onInputKeyup(): void {
    this.control.markAsDirty();
  }

  @HostListener('input')
  public onInputInput(): void {
    if (this.currentGroupIsFilled() || this.groupValueIsTooHigh()) {
      if (!this.currentGroupIsFilled()) {
        this.fillInCurrentGroup();
      }
      this.validateGroup();
      this.moveToNextGroup();
    }
  }

  @HostListener('keypress', ['$event'])
  public onInputKeypress(event: KeyboardEvent): void {
    if (this.eventIsNotNumericInput(event) || (!this.isCurrentGroupSelected() && this.currentGroupIsFilled())) {
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  public onInputKeydown(event: KeyboardEvent): void {
    /* istanbul ignore else */
    if (event.key === this.tabKey) {
      this.fillInCurrentGroup();
      /* istanbul ignore else */
      if (event.shiftKey) {
        /* istanbul ignore else */
        if (this.currentGroup > 0) {
          event.preventDefault();
        }
        this.moveToPreviousGroup();
      } else {
        if (this.currentGroup < this.groupLength.length - 1) {
          event.preventDefault();
        }
        this.moveToNextGroup();
      }
    } else if ([this.arrowDownKey, this.endKey].indexOf(event.key) !== -1) {
      this.moveToLastGroup();
      event.preventDefault();
    } else if ([this.arrowUpKey, this.homeKey].indexOf(event.key) !== -1) {
      this.moveToFirstGroup();
      event.preventDefault();
    } else if (event.key === this.arrowLeftKey) {
      this.moveToPreviousGroup();
      event.preventDefault();
    } else if (event.key === this.arrowRightKey) {
      this.moveToNextGroup();
      event.preventDefault();
    }
  }

  @HostListener('focus')
  public onInputFocus(): void {
    if (!this.value) {
      this.writeValue(this.dateFormat);
    }
    this.currentGroup = 0;
    const inputElement = <HTMLInputElement>this.elementRef.nativeElement;
    inputElement.setSelectionRange(0, this.groupLength[this.currentGroup]);
  }

  @HostListener('click', ['$event'])
  public onInputClick(event: MouseEvent): void {
    let totalLength: number = 0;
    let target: HTMLInputElement = <HTMLInputElement>event.target;
    for (let i: number = 0; i < this.groupLength.length; ++i) {
      totalLength += this.groupLength[i];
      if (totalLength >= target.selectionStart) {
        this.fillInCurrentGroup();
        this.currentGroup = i;
        this.selectCurrentGroup();
        break;
      }
    }
  }

  @HostListener('paste', ['$event'])
  public blockPaste(e: ClipboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event'])
  public blockCut(e: ClipboardEvent) {
    e.preventDefault();
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (!this.control) {
      this.control = control;
    }

    if (this.skyDatepickerNoValidate) {
      return;
    }

    const value: any = control.value;

    if (!value) {
      return;
    }

    const dateValue = this.getDateValue(value);
    const isDateValid = (dateValue && this.dateFormatter.dateIsValid(dateValue));

    if (!isDateValid) {
      // Mark the invalid control as touched so that the input's invalid CSS styles appear.
      // (This is only required when the invalid value is set by the FormControl constructor.)
      this.control.markAsTouched();

      return {
        'skyDate': {
          invalid: value
        }
      };
    }

    const minDate = this.minDate;

    if (
      minDate &&
      this.dateFormatter.dateIsValid(minDate) &&
      value < minDate
    ) {
      return {
        'skyDate': {
          minDate
        }
      };
    }

    const maxDate = this.maxDate;

    if (
      maxDate &&
      this.dateFormatter.dateIsValid(maxDate) &&
      value > maxDate
    ) {
      return {
        'skyDate': {
          maxDate
        }
      };
    }
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.datepickerComponent.disabled = disabled;
  }

  private initializeGroupsAndDelimiters(): void {
    let groups: string[] = this.dateFormat.split(this.validDelimiters);
    let totalLength: number = 0;

    for (let i = 0; i < groups.length; ++i) {
      totalLength += groups[i].length;
      this.groupLength[i] = groups[i].length;
      /* istanbul ignore else */
      if (i !== groups.length - 1) {
        this.delimiters[i] = this.dateFormat.charAt(totalLength);
        ++totalLength;
      }
    }
  }

  private currentGroupIsFilled(): boolean {
    let groups: string[] = this.elementRef.nativeElement.value.split(this.validDelimiters);
    let formatCharacter: string = this.dateFormat.split(this.validDelimiters)[this.currentGroup].charAt(0);

    return groups[this.currentGroup].indexOf(formatCharacter) === -1 &&
      groups[this.currentGroup].length === this.groupLength[this.currentGroup];
  }

  private groupValueIsTooHigh(): boolean {
    let formatGroup: string = this.dateFormat.split(this.validDelimiters)[this.currentGroup];
    let value: number = parseInt(this.elementRef.nativeElement.value.split(this.validDelimiters)[this.currentGroup], 10);

    return this.monthIsTooHigh(formatGroup, value) || this.dayIsTooHigh(formatGroup, value);
  }

  private monthIsTooHigh(formatGroup: string, value: number): boolean {
    return formatGroup.charAt(0).match(this.monthRegex) && value > 1
  }

  private dayIsTooHigh(formatGroup: string, value: number): boolean {
    return formatGroup.charAt(0).match(this.dayRegex) && value > 3;
  }

  private fillInCurrentGroup(): void {
    /* istanbul ignore else */
    if (this.currentGroup >= 0 && this.currentGroup < this.groupLength.length) {
      let groups: string[] = this.elementRef.nativeElement.value.split(this.validDelimiters);
      let currentGroupValue = groups[this.currentGroup];
      if (currentGroupValue.length === 0) {
        groups[this.currentGroup] = this.dateFormat.split(this.validDelimiters)[this.currentGroup];
      } else if (currentGroupValue.length < this.groupLength[this.currentGroup]) {
        groups[this.currentGroup] = this.getValuePrecededByZeros(currentGroupValue);
      }
      this.elementRef.nativeElement.value = this.joinGroupsWithDelimiters(groups);
    }
  }

  private getValuePrecededByZeros(value: string): string {
    return this.fillerCharacter.repeat(this.groupLength[this.currentGroup] - value.length) + value;
  }

  private validateGroup(): void {
    let formatGroups: string[] = this.dateFormat.split(this.validDelimiters);
    let valueGroups: string[] = this.elementRef.nativeElement.value.split(this.validDelimiters);
    let year: number;
    let month: number;
    let day: number;

    for (let i = 0; i < formatGroups.length; ++i) {
      let formatGroup: string = formatGroups[i];
      /* istanbul ignore else */
      if (formatGroup.charAt(0).match(this.yearRegex)) {
        year = parseInt(valueGroups[i], 10);
      } else if (formatGroup.charAt(0).match(this.monthRegex)) {
        month = parseInt(valueGroups[i], 10);
      } else if (formatGroup.charAt(0).match(this.dayRegex)) {
        day = parseInt(valueGroups[i], 10);
      }
    }

    month = getValidMonth(month);
    day = getValidDay(day, month, year);

    for (let i = 0; i < formatGroups.length; ++i) {
      let formatGroup: string = formatGroups[i];
      /* istanbul ignore else */
      if (year && formatGroup.charAt(0).match(this.yearRegex)) {
        valueGroups[i] = this.fillerCharacter.repeat(this.groupLength[i] - year.toString().length) + year.toString();
      } else if (month && formatGroup.charAt(0).match(this.monthRegex)) {
        valueGroups[i] = this.fillerCharacter.repeat(this.groupLength[i] - month.toString().length) + month.toString();
      } else if (day && formatGroup.charAt(0).match(this.dayRegex)) {
        valueGroups[i] = this.fillerCharacter.repeat(this.groupLength[i] - day.toString().length) + day.toString();
      }
    }

    this.elementRef.nativeElement.value = this.joinGroupsWithDelimiters(valueGroups);
  }

  private joinGroupsWithDelimiters(groups: string[]): string {
    let dateWithDelimiters: string = '';

    for (let i = 0; i < groups.length; ++i) {
      dateWithDelimiters += groups[i];
      if (i < this.delimiters.length) {
        dateWithDelimiters += this.delimiters[i];
      }
    }

    return dateWithDelimiters;
  }

  private moveToNextGroup(): void {
    /* istanbul ignore else */
    if (this.currentGroup < this.groupLength.length - 1) {
      ++this.currentGroup;
      this.selectCurrentGroup();
    }
  }

  private moveToPreviousGroup(): void {
    /* istanbul ignore else */
    if (this.currentGroup > 0) {
      --this.currentGroup;
      this.selectCurrentGroup();
    }
  }

  private moveToFirstGroup(): void {
    this.currentGroup = 0;
    this.selectCurrentGroup();
  }

  private moveToLastGroup(): void {
    this.currentGroup = this.groupLength.length - 1;
    this.selectCurrentGroup();
  }

  private selectCurrentGroup(): void {
    let startingIndex = this.getStartingSelectionIndex();
    const inputElement = <HTMLInputElement>this.elementRef.nativeElement;

    inputElement.setSelectionRange(startingIndex, this.getEndingSelectionIndex(startingIndex));
  }

  private isCurrentGroupSelected(): boolean {
    let startingIndex = this.getStartingSelectionIndex();
    let endingIndex = this.getEndingSelectionIndex(startingIndex);

    const inputElement = <HTMLInputElement>this.elementRef.nativeElement;
    return inputElement.selectionStart === startingIndex && inputElement.selectionEnd === endingIndex;
  }

  private getStartingSelectionIndex(): number {
    let startingIndex = 0;
    for (let i = 0; i < this.currentGroup; ++i) {
      startingIndex += this.groupLength[i] + 1;
    }

    return startingIndex;
  }

  private getEndingSelectionIndex(startingIndex: number): number {
    return startingIndex + this.groupLength[this.currentGroup];
  }

  private setInputElementValue(value: string): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'value',
      value
    );
  }

  private getDateValue(value: any): Date {
    let dateValue: Date;
    if (value instanceof Date) {
      dateValue = value;
    } else if (typeof value === 'string' && this.allGroupsHaveData(value)) {
      const date = this.dateFormatter.getDateFromString(value, this.dateFormat);
      if (this.dateFormatter.dateIsValid(date)) {
        dateValue = date;
      }
    }

    return dateValue;
  }

  private allGroupsHaveData(value: string): boolean {
    let valueGroups: string[] = value.split(this.validDelimiters);
    let dateFormatGroups: string[] = this.dateFormat.split(this.validDelimiters);

    if (valueGroups.length === dateFormatGroups.length) {
      for (let i = 0; i < valueGroups.length; ++i) {
        if (valueGroups[i] === dateFormatGroups[i]) {
          return false;
        }
      }
    }

    return true;
  }

  private eventIsNotNumericInput(event: KeyboardEvent): boolean {
    for (let i = 0; i < 10; ++i) {
      if (event.key === i.toString() || event.key === ('Numpad' + i)) {
        return false;
      }
    }
    return true;
  }

  private onChange = (_: any) => {};
  /*istanbul ignore next */
  private onTouched = () => {};
  private onValidatorChange = () => {};
}
