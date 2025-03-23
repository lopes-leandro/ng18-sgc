import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { FormFieldComponent } from '@shared/components/ui/form-field/form-field.component';


@Component({
  selector: 'app-delivery-conditions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent
  ],
  templateUrl: './delivery-conditions.component.html',
  styleUrl: './delivery-conditions.component.scss'
})
export class DeliveryConditionsComponent implements OnInit {

  @Input() data: Record<string, any> = {};
  @Input() onComplete!: (data: Record<string, any>) => void;
  @Input() onBack!: () => void;

  form!: FormGroup;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.creatingForm();

    // Atualiza a validação do formulário baseado no método de entrega
    this.form.get('deliveryMethod')?.valueChanges.subscribe(method => {
      this.updateFormValidation(method);
    });

    // Pre-carregamento do formulário se existir dados
    if (this.data['delivery']) {
      this.form.patchValue(this.data['deçivery']);

      this.updateFormValidation(this.form.get('deliveryMethod')?.value);
    }
  }

  private creatingForm() {
    this.form = this.fb.group({
      deliveryMethod: ['', Validators.required],
      deliveryDate: [''],
      deliveryNotes: [''],
      address: this.fb.group({
        zipCode: [''],
        street: [''],
        number: [''],
        complement: [''],
        district: [''],
        city: [''],
        state: ['']
      })
    });
  }

  updateFormValidation(deliveryMethod: string) {
    const addressGroup = this.form.get('address') as FormGroup;
    const deliveryDateControl = this.form.get('deliveryDate');

    // Reseta as validações
    deliveryDateControl?.clearValidators();
    Object.keys(addressGroup.controls).forEach(key => {
      addressGroup.get(key)?.clearAsyncValidators();
    });

    // Aplica validações basiada no método de entrega
    if (deliveryMethod === 'shipping' || deliveryMethod === 'onsite') {
      deliveryDateControl?.setValidators(Validators.required);

      if (deliveryMethod === 'shipping') {
        // Endereço é obrigatório para shipping
        ['zipCode', 'street', 'number', 'district', 'city', 'state'].forEach(field => {
          addressGroup.get(field)?.setValidators(Validators.required);
        });
      }
    }

    // Atualiza os controles
    deliveryDateControl?.updateValueAndValidity();
    Object.keys(addressGroup.controls).forEach(key => {
      addressGroup.get(key)?.updateValueAndValidity();
    });
  }

  shouldShowShippingAddress(): boolean {
    return this.form.get('deliveryMethod')?.value === 'shipping';
  }

  shouldShowDeliveryDate(): boolean {
    const method = this.form.get('deliveryMethod')?.value;
    return method === 'shipping' || method === 'onsite';
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.onComplete({
      ...this.data,
      delivery: this.form.value
    })
  }


  get deliveryMethodControl(): FormControl {
    return this.form.get('deliveryMethod') as FormControl;
  }

  get deliveryDateControl(): FormControl {
    return this.form.get('deliveryDate') as FormControl;
  }

  get deliveryNotesControl(): FormControl {
    return this.form.get('deliveryNotes') as FormControl;
  }

  get zipCodeControl(): FormControl {
    const addressGroup = this.form.get('address') as FormGroup;
    return addressGroup.get('zipCode') as FormControl;
  }

  get streetControl(): FormControl {
    const addressGroup = this.form.get('address') as FormGroup;
    return addressGroup.get('street') as FormControl;
  }

  get numberControl(): FormControl {
    const addressGroup = this.form.get('address') as FormGroup;
    return addressGroup.get('number') as FormControl;
  }

  get complementControl(): FormControl {
    const addressGroup = this.form.get('address') as FormGroup;
    return addressGroup.get('complement') as FormControl;
  }

  get districtControl(): FormControl {
    const addressGroup = this.form.get('address') as FormGroup;
    return addressGroup.get('district') as FormControl;
  }

  get cityControl(): FormControl {
    const addressGroup = this.form.get('address') as FormGroup;
    return addressGroup.get('city') as FormControl;
  }

  get stateControl(): FormControl {
    const addressGroup = this.form.get('address') as FormGroup;
    return addressGroup.get('state') as FormControl;
  }
}
