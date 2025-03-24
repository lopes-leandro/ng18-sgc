import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { FormFieldComponent } from '@shared/components/ui/form-field/form-field.component';

@Component({
  selector: 'app-new-contract',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent
  ],
  templateUrl: './new-contract.component.html',
  styleUrl: './new-contract.component.scss'
})
export class NewContractComponent implements OnInit {
  data = input<Record<string, any>>({});
  onComplete = input<(data: Record<string, any>) => void>();
  onBack = input<() => void>();
  
  form!: FormGroup;
  
  private fb = inject(FormBuilder);
  
  ngOnInit(): void {
    this.creatingForm();

    // Pre-carregamento do formulário se existir dados
    if (this.data()) {
      this.form.patchValue(this.data());
    }
  }

  get clientNameControl(): FormControl {
    return this.form.get('clientName') as FormControl;
  }

  get contractTypeControl(): FormControl {
    return this.form.get('contractType') as FormControl;
  }

  get startDateControl(): FormControl {
    return this.form.get('startDate') as FormControl;
  }

  submitForm() {
    const onCallback = this.onComplete();
    if (this.form.valid && onCallback) {
      onCallback(this.form.value)
    } else {
      this.form.markAllAsTouched();
    }
  }

  private creatingForm() {
    this.form = this.fb.group({
      clientName: ['', Validators.required],
      contractType: ['', Validators.required],
      startDate: ['', Validators.required]
    });
  }
}
