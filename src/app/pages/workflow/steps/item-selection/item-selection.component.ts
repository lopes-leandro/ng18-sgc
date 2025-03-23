import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-item-selection',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    ButtonComponent
  ],
  templateUrl: './item-selection.component.html',
  styleUrl: './item-selection.component.scss'
})
export class ItemSelectionComponent implements OnInit {

  @Input() data: Record<string, any> = {};
  @Input() onComplete!: (data: Record<string, any>) => void;
  @Input() onBack!: () => void;
  
  form!: FormGroup;
  selectedItems: number[] = [];

  // Dados fake para itens disponíveis (viriam de um serviço em um aplicativo real)
  availableItems = [
    { id: 1, name: 'Consultoria Básica', description: 'Serviço de consultoria básica com 10 horas de atendimento', price: 1500 },
    { id: 2, name: 'Suporte Premium', description: 'Suporte técnico 24/7 com tempo de resposta garantido', price: 2800 },
    { id: 3, name: 'Desenvolvimento Web', description: 'Desenvolvimento de aplicações web com tecnologias modernas', price: 5000 },
    { id: 4, name: 'Hospedagem Cloud', description: 'Serviço de hospedagem em nuvem com alta disponibilidade', price: 1200 },
    { id: 5, name: 'Treinamento', description: 'Treinamento personalizado para equipes de até 10 pessoas', price: 3500 },
    { id: 6, name: 'Auditoria de Segurança', description: 'Análise completa de segurança da informação', price: 4200 }
  ];

  private fb = inject(FormBuilder);


  ngOnInit(): void {
    this.creatingForm();
  }

  private creatingForm() {
    // Este formulário rastreia o estado dos itens selecionados,
    // que é gerenciado separadamente no array selectedItems
    this.form = this.fb.group({});
  }

  private creatingForm_Old() {

    // Formato Convencional para rastrear o estado da seleção dos itens.
    this.form = this.fb.group({
      selectedItems: [this.selectedItems, [Validators.required, Validators.minLength(1)]]
    });

    // Escuta as mudanças no controle e atualiza o array
    this.form.get('selectedItems')?.valueChanges.subscribe(values => {
      this.selectedItems = values;
    })
  }

  toggleItemSelection(itemId: number) {
    const index = this.selectedItems.indexOf(itemId);
    if (index === -1) {
      this.selectedItems.push(itemId);
    } else {
      this.selectedItems.splice(index, 1);
    }
  }

  submitForm() {
    if (this.selectedItems.length === 0) {
      alert('Selecione pelo menos um item para continuar.');
      return;
    }

    // Obtem os objetos completos dos itens para os ID's selecionados.
    const selectedItemsFull = this.availableItems.filter(
      item => this.selectedItems.includes(item.id)
    );

    this.onComplete({
      ...this.data,
      selectedItemIds: this.selectedItems,
      selectedItems: selectedItemsFull
    })
  }
}
