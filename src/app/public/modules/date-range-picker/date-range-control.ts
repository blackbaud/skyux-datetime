import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class SkyDateRangeControl {
  public get labelChange(): Observable<string> {
    return this._labelChange;
  }

  public isVisible = false;

  private _labelChange = new BehaviorSubject<string>('');

  constructor(
    public control: AbstractControl,
    private defaultLabel: string
  ) {
    this._labelChange.next(defaultLabel);
  }

  public setLabel(value: string): void {
  }

  public show(): void {
  }

  public reset(): void {
    this.isVisible = false;
    this._labelChange.next(this.defaultLabel);
    this.control.disable();
  }
}
