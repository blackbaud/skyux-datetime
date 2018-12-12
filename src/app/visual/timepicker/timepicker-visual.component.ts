import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'timepicker-visual',
  templateUrl: './timepicker-visual.component.html'
})
export class TimepickerVisualComponent implements OnInit {
  public reactiveForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public get reactiveTime() {
    return this.reactiveForm.get('time');
  }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      time: new FormControl('2:15 PM', [Validators.required])
    });
  }
}
