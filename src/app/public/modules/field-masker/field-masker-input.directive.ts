import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Optional
} from '@angular/core';

import 'rxjs/add/operator/distinctUntilChanged';

import 'rxjs/add/operator/takeUntil';

import {
  SkyDatepickerComponent,
  SkyDatepickerConfigService
} from '../datepicker';

import {
  GroupLogicService
} from './group-logic.service';

@Directive({
  selector: '[skyFieldMaskerInput]'
})
export class SkyFieldMaskerInputDirective implements OnInit {

  @Input()
  public set dateFormat(value: string) {
    this._dateFormat = value;
  }

  public get dateFormat(): string {
    return this._dateFormat || this.configService.dateFormat;
  }

  private _dateFormat: string;

  constructor(
    private configService: SkyDatepickerConfigService,
    private elementRef: ElementRef,
    private groupLogicService: GroupLogicService,
    @Optional() private datepickerComponent: SkyDatepickerComponent
  ) {}

  public ngOnInit(): void {
    if (!this.datepickerComponent) {
      throw new Error(
        'You must wrap the `skyFieldMaskerInput` directive within a ' +
        '`<sky-datepicker>` component!'
      );
    }

    const element = this.elementRef.nativeElement;

    element.setAttribute('placeholder', this.dateFormat);
    this.groupLogicService.initialize(this.elementRef, this.dateFormat);
  }

  @HostListener('blur')
  public onInputBlur(): void {
    /* istanbul ignore else */
    if (this.elementRef.nativeElement.value === this.dateFormat) {
      this.elementRef.nativeElement.value = '';
    } else if (!this.groupLogicService.currentGroupIsFilled()) {
      this.groupLogicService.fillInCurrentGroup();
      this.groupLogicService.validateGroups();
    }
  }

  @HostListener('input')
  public onInputInput(): void {
    if (this.groupLogicService.currentGroupIsFilled() || this.groupLogicService.groupValueIsTooHigh()) {
      if (!this.groupLogicService.currentGroupIsFilled()) {
        this.groupLogicService.fillInCurrentGroup();
      }
      this.groupLogicService.validateGroups();
      this.groupLogicService.moveToNextGroup();
    }
  }

  @HostListener('keypress', ['$event'])
  public onInputKeypress(event: KeyboardEvent): void {
    if (this.eventIsNotNumericInput(event) ||
      (!this.groupLogicService.isCurrentGroupSelected() && this.groupLogicService.currentGroupIsFilled())) {
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  public onInputKeydown(event: KeyboardEvent): void {
    this.groupLogicService.navigateInGroupsBasedOnEvent(event);
  }

  @HostListener('focus')
  public onInputFocus(): void {
    if (!this.elementRef.nativeElement.value) {
      this.elementRef.nativeElement.value = this.dateFormat;
    }
    this.groupLogicService.setAndHighlightGroup(0);
  }

  @HostListener('click', ['$event'])
  public onInputClick(event: MouseEvent): void {
    this.groupLogicService.highlightClickedGroup(<HTMLInputElement>event.target);
  }

  @HostListener('paste', ['$event'])
  public blockPaste(e: ClipboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event'])
  public blockCut(e: ClipboardEvent) {
    e.preventDefault();
  }

  private eventIsNotNumericInput(event: KeyboardEvent): boolean {
    for (let i = 0; i < 10; ++i) {
      if (event.key === i.toString() || event.key === ('Numpad' + i)) {
        return false;
      }
    }
    return true;
  }
}
