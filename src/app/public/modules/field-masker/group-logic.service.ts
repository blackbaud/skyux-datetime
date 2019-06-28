import {
  Injectable,
  ElementRef
} from '@angular/core';

import {
  getValidDay,
  getValidMonth
} from './date-logic-utils';

@Injectable()
export class GroupLogicService {
  private currentGroup: number;
  private dateFormat: string;
  private delimiters: string[] = [];
  private elementRef: ElementRef;
  private groupLengths: number[] = [];

  private readonly fillerCharacter: string = '0';
  private readonly dayRegex: RegExp = /d/gi;
  private readonly monthRegex: RegExp = /m/gi;
  private readonly yearRegex: RegExp = /y/gi;
  private readonly validDelimiters: RegExp = /[\\()-./]/g;

  private readonly arrowUpKey: string = 'ArrowUp';
  private readonly arrowDownKey: string = 'ArrowDown';
  private readonly arrowLeftKey: string = 'ArrowLeft';
  private readonly arrowRightKey: string = 'ArrowRight';
  private readonly endKey: string = 'End';
  private readonly homeKey: string = 'Home';
  private readonly tabKey: string = 'Tab';

  constructor() {}

  public initialize(elementRef: ElementRef, dateFormat: string): void {
    this.elementRef = elementRef;
    this.dateFormat = dateFormat;
    this.initializeGroupsAndDelimiters();
  }

  public currentGroupIsFilled(): boolean {
    let groups: string[] = this.elementRef.nativeElement.value.split(this.validDelimiters);
    let formatCharacter: string = this.dateFormat.split(this.validDelimiters)[this.currentGroup].charAt(0);

    return groups[this.currentGroup].indexOf(formatCharacter) === -1 &&
      groups[this.currentGroup].length === this.groupLengths[this.currentGroup];
  }

  public fillInCurrentGroup(): void {
    /* istanbul ignore else */
    if (this.currentGroup >= 0 && this.currentGroup < this.groupLengths.length) {
      let groups: string[] = this.elementRef.nativeElement.value.split(this.validDelimiters);
      let currentGroupValue = groups[this.currentGroup];
      if (currentGroupValue.length === 0) {
        groups[this.currentGroup] = this.dateFormat.split(this.validDelimiters)[this.currentGroup];
      } else if (currentGroupValue.length < this.groupLengths[this.currentGroup]) {
        groups[this.currentGroup] = this.getValuePrecededByZeros(currentGroupValue, this.currentGroup);
      }
      this.elementRef.nativeElement.value = this.joinGroupsWithDelimiters(groups);
    }
  }

  public groupValueIsTooHigh(): boolean {
    let formatGroup: string = this.dateFormat.split(this.validDelimiters)[this.currentGroup];
    let value: number = parseInt(this.elementRef.nativeElement.value.split(this.validDelimiters)[this.currentGroup], 10);

    return this.monthIsTooHigh(formatGroup, value) || this.dayIsTooHigh(formatGroup, value);
  }

  public validateGroups(): void {
    let formatGroups: string[] = this.dateFormat.split(this.validDelimiters);
    let valueGroups: string[] = this.elementRef.nativeElement.value.split(this.validDelimiters);
    let dateObject: DateObject = this.parseDateObjectFromInput(formatGroups, valueGroups);

    dateObject.month = getValidMonth(dateObject.month);
    dateObject.day = getValidDay(dateObject.day, dateObject.month, dateObject.year);

    this.updateValueGroupsWithUpdatedValues(formatGroups, valueGroups, dateObject);
    this.elementRef.nativeElement.value = this.joinGroupsWithDelimiters(valueGroups);
  }

  public isCurrentGroupSelected(): boolean {
    let startingIndex = this.getStartingSelectionIndex();
    let endingIndex = this.getEndingSelectionIndex(startingIndex);

    const inputElement = <HTMLInputElement>this.elementRef.nativeElement;
    return inputElement.selectionStart === startingIndex && inputElement.selectionEnd === endingIndex;
  }

  public allGroupsHaveData(value: string): boolean {
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

  public atFirstGroup(): boolean {
    return this.currentGroup === 0;
  }

  public atLastGroup(): boolean {
    return this.currentGroup === this.groupLengths.length - 1;
  }

  public highlightClickedGroup(clickTarget: HTMLInputElement): void {
    let totalLength: number = 0;

    for (let i: number = 0; i < this.groupLengths.length; ++i) {
      totalLength += this.groupLengths[i];
      if (totalLength >= clickTarget.selectionStart) {
        this.fillInCurrentGroup();
        this.setAndHighlightGroup(i);
        break;
      }
    }
  }

  public setAndHighlightGroup(group: number): void {
    this.currentGroup = group;
    this.selectCurrentGroup();
  }

  public navigateInGroupsBasedOnEvent(event: KeyboardEvent) {
    /* istanbul ignore else */
    if (event.key === this.tabKey) {
      this.fillInCurrentGroup();
      /* istanbul ignore else */
      if (event.shiftKey) {
        /* istanbul ignore else */
        if (!this.atFirstGroup()) {
          event.preventDefault();
        }
        this.moveToPreviousGroup();
      } else {
        if (!this.atLastGroup()) {
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

  public moveToNextGroup(): void {
    /* istanbul ignore else */
    if (this.currentGroup < this.groupLengths.length - 1) {
      ++this.currentGroup;
      this.selectCurrentGroup();
    }
  }

  public moveToPreviousGroup(): void {
    /* istanbul ignore else */
    if (this.currentGroup > 0) {
      --this.currentGroup;
      this.selectCurrentGroup();
    }
  }

  public moveToFirstGroup(): void {
    this.currentGroup = 0;
    this.selectCurrentGroup();
  }

  public moveToLastGroup(): void {
    this.currentGroup = this.groupLengths.length - 1;
    this.selectCurrentGroup();
  }

  private dayIsTooHigh(formatGroup: string, value: number): boolean {
    return formatGroup.charAt(0).match(this.dayRegex) && value > 3;
  }

  private getEndingSelectionIndex(startingIndex: number): number {
    return startingIndex + this.groupLengths[this.currentGroup];
  }

  private getStartingSelectionIndex(): number {
    let startingIndex = 0;
    for (let i = 0; i < this.currentGroup; ++i) {
      startingIndex += this.groupLengths[i] + 1;
    }

    return startingIndex;
  }

  private getValuePrecededByZeros(value: string, group: number): string {
    return this.fillerCharacter.repeat(this.groupLengths[group] - value.length) + value;
  }

  private initializeGroupsAndDelimiters(): void {
    let groups: string[] = this.dateFormat.split(this.validDelimiters);
    let totalLength: number = 0;

    for (let i = 0; i < groups.length; ++i) {
      totalLength += groups[i].length;
      this.groupLengths[i] = groups[i].length;
      /* istanbul ignore else */
      if (i !== groups.length - 1) {
        this.delimiters[i] = this.dateFormat.charAt(totalLength);
        ++totalLength;
      }
    }
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

  private monthIsTooHigh(formatGroup: string, value: number): boolean {
    return formatGroup.charAt(0).match(this.monthRegex) && value > 1;
  }

  private parseDateObjectFromInput(formatGroups: string[], valueGroups: string[]): DateObject {
    let day: number;
    let month: number;
    let year: number;

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

    return createDateObject(day, month, year);
  }

  private selectCurrentGroup(): void {
    let startingIndex = this.getStartingSelectionIndex();
    const inputElement = <HTMLInputElement>this.elementRef.nativeElement;

    inputElement.setSelectionRange(startingIndex, this.getEndingSelectionIndex(startingIndex));
  }

  private updateValueGroupsWithUpdatedValues(formatGroups: string[], valueGroups: string[], dateObject: DateObject) {
    for (let i = 0; i < formatGroups.length; ++i) {
      let formatGroup: string = formatGroups[i];
      /* istanbul ignore else */
      if (dateObject.day && formatGroup.charAt(0).match(this.dayRegex)) {
        valueGroups[i] = this.getValuePrecededByZeros(dateObject.day.toString(), i);
      } else if (dateObject.month && formatGroup.charAt(0).match(this.monthRegex)) {
        valueGroups[i] = this.getValuePrecededByZeros(dateObject.month.toString(), i);
      } else if (dateObject.year && formatGroup.charAt(0).match(this.yearRegex)) {
        valueGroups[i] = this.getValuePrecededByZeros(dateObject.year.toString(), i);
      }
    }
  }
}

interface DateObject {
  day: number;
  month: number;
  year: number;
}

export function createDateObject(day: number, month: number, year: number): DateObject {
  return {
    day: day,
    month: month,
    year: year
  };
}
