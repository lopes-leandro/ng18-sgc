import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { FormFieldComponent } from '@shared/components/ui/form-field/form-field.component';

@Component({
  selector: 'app-commercial-conditions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent
  ],
  templateUrl: './commercial-conditions.component.html',
  styleUrl: './commercial-conditions.component.scss'
})
export class CommercialConditionsComponent implements OnInit {
  data = input<Record<string, any>>({});
  onComplete = input<(data: Record<string, any>) => void>();
  onBack = input<() => void>();

  form!: FormGroup;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.creatingForm();

    // Pre-carregamento do formulário se os dados existirem
    if (this.data()) {
      this.form.patchValue(this.data());
    }

  }

  private creatingForm() {
    this.form = this.fb.group({
      duration: [12, [Validators.required, Validators.min(1)]],
      totalValue: [0, [Validators.required, Validators.min(0)]],
      paymentMethod: ['', Validators.required],
      notes: ['']
    });
  }

    get durationControl(): FormControl {
      return this.form.get('duration') as FormControl;
    }

    get totalValueControl(): FormControl {
      return this.form.get('totalValue') as FormControl;
    }

    get paymentMethodControl(): FormControl {
      return this.form.get('paymentMethod') as FormControl;
    }

    get notesControl(): FormControl {
      return this.form.get('notes') as FormControl;
    }

  submitForm() {
    const onCallback = this.onComplete();
    if (this.form.valid && onCallback) {
      onCallback(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  goBack() {
    const onCallback = this.onBack();
    if(onCallback) onCallback();
  }
}
