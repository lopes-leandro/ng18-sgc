import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { FormFieldComponent } from '@shared/components/ui/form-field/form-field.component';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent
  ],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.scss'
})
export class DocumentationComponent implements OnInit {

  @Input() data: Record<string, any> = {};
  @Input() onComplete!: (data: Record<string, any>) => void;
  @Input() onBack!: () => void;

  form!: FormGroup;

  // Lista dos documentos obrigatórios (normalmente viria de um serviço)
  documentList = [
    { name: 'Contrato Social', description: 'Cópia autenticada do contrato social da empresa' },
    { name: 'CNPJ', description: 'Comprovante de inscrilção e situação cadastral' },
    { name: 'Certidão Negativa', description: 'Certidão negativa de débitos federais' },
    { name: 'Procuração', description: 'Se aplicável, procuração do representante legal' },
    { name: 'Comprovante Bancários', description: 'Dados bancários para pagamentos' },
  ];

  private fb = inject(FormBuilder);

  ngOnInit(): void {

    this.creatingForm();

    // Pre-carregamento do formulário se existir dados
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  private creatingForm() {
    // Cria controles de formulários dinâmicos para percorrer documentos.
    const documentControls: Record<string, any> = {}

    this.documentList.forEach((doc, index) => {
      documentControls[`doc_${index}`] = [false];
    });

    documentControls['documentNotes'] = [''];

    console.log(documentControls);
    
    this.form = this.fb.group(documentControls);
  }

  get documentNotes(): FormControl {
    return this.form.get('documentNotes') as FormControl;
  }

  submitForm() {
    // Transforma os dados dentro do formulário em um formato estruturado
    const formValue = this.form.value;
    const documents = this.documentList.map((doc, index) => ({
      name: doc.name,
      selected: formValue[`doc_${index}`]
    }));
    const result = {
      documents,
      documentNotes: formValue.documentNotes
    };
    
    this.onComplete(result);
  }
}
