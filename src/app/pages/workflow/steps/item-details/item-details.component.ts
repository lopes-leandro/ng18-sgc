import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { FormFieldComponent } from '@shared/components/ui/form-field/form-field.component';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent,
    CurrencyPipe
  ],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss'
})
export class ItemDetailsComponent implements OnInit {

  @Input() data: Record<string, any> = {};
  @Input() onComplete!: (data: Record<string, any>) => void;
  @Input() onBack!: () => void;

  form!: FormGroup;
  itemDetails: any[] = [];

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.creatingForm();
  }

  private creatingForm() {
    this.form = this.fb.group({
      items: this.fb.array([])
    });

    //Cria controler de formulários para cada item selecionado
    if (this.data['selectedItems'] && this.data['selectedItems'].length > 0) {
      this.itemDetails = this.data['selectedItems'];

      const itemsFormArray = this.form.get('items') as FormArray;

      this.itemDetails.forEach(
        item => itemsFormArray.push(this.createItemFormGroup(item))
      );
    }
  }

  get itemsFormArray() {
    return this.form.get('items') as FormArray
  }

  getQuantityControl(index: number): FormControl {
    const itemFormGroup = this.itemsFormArray.at(index) as FormGroup;
    return itemFormGroup.get('quantity') as FormControl;
  }

  getUnitPriceControl(index: number): FormControl {
    const itemFormGroup = this.itemsFormArray.at(index) as FormGroup;
    return itemFormGroup.get('unitPrice') as FormControl;
  }
  
  geNotesControl(index: number): FormControl {
    const itemFormGroup = this.itemsFormArray.at(index) as FormGroup;
    return itemFormGroup.get('notes') as FormControl;
  }

  getItemTotal(index: number): number {
    const itemFormGroup = this.itemsFormArray.at(index) as FormGroup;
    return itemFormGroup.get('totalPrice')?.value || 0;
  }

  getOrderSubTotal(): number {
    let subtotal = 0;

    for (let i = 0; i < this.itemsFormArray.length; i++) {
      subtotal += this.getItemTotal(i)
    }

    return subtotal;
  }

  getOrderTax(): number {
    return this.getOrderSubTotal() * 0.1;
  }

  getOrderTotal(): number {
    return this.getOrderSubTotal() + this.getOrderTax();
  }

  calculateTotals(index: number) {
    const itemFormGroup = this.itemsFormArray.at(index) as FormGroup;
    const quantity = itemFormGroup.get('quantity')?.value || 0;
    const unitPrice = itemFormGroup.get('unitPrice')?.value || 0;
    const totalPrice = quantity * unitPrice;

    itemFormGroup.patchValue({ totalPrice }, { emitEvent: false });
  }

  createItemFormGroup(item: any) {
    return this.fb.group({
      id: [item.id],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [item.price, [Validators.required, Validators.min(0)]],
      totalPrice: [item.price],
      notes: ['']
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Transformar os dados dos itens em um formato mais estruturado
    const formattedItems = this.itemsFormArray.controls.map((control: any, index: number) => {
      const itemValue = control.value;
      return {
        id: itemValue.id,
        name: this.itemDetails[index].name,
        description: this.itemDetails[index].description,
        quantity: itemValue.quantity,
        unitPrice: itemValue.unitPrice,
        totalPrice: itemValue.totalPrice,
        notes: itemValue.notes
      };
    });

    // Calcular o resumo da ordem
    const orderSummary = {
      subtotal: this.getOrderSubTotal(),
      tax: this.getOrderTax(),
      total: this.getOrderTotal()
    };

    this.onComplete({
      ...this.data,
      items: formattedItems,
      orderSummary
    });
  }
}
