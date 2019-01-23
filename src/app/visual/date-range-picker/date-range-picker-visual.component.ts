import {
  Component
} from '@angular/core';
import { SkyDateRangeValue } from '../../public';

@Component({
  selector: 'date-range-picker-visual',
  templateUrl: './date-range-picker-visual.component.html'
})
export class DateRangePickerVisualComponent {
  public value: SkyDateRangeValue;
  public disabled = false;
}
