import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup, FormBuilder
} from '@angular/forms';

@Component({
  selector: 'timepicker-visual',
  templateUrl: './timepicker-visual.component.html'
})
export class TimepickerVisualComponent implements OnInit {
  public timepickerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit() {
    this.timepickerForm = this.formBuilder.group({
      time: '2:15 PM'
    });
  }
}
