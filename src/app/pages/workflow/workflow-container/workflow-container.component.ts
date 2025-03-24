import { NgComponentOutlet } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from '@core/application/services/contract.service';
import { WorkflowService } from '@core/application/services/workflow.service';
import { WorkflowType } from '@core/domain/models/workflow.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { CardComponent } from '@shared/components/ui/card/card.component';
/**Formulários da jornada do usuário */
import { NewContractComponent } from '../steps/new-contract/new-contract.component';
import { CommercialConditionsComponent } from '../steps/commercial-conditions/commercial-conditions.component';
import { DocumentationComponent } from '../steps/documentation/documentation.component';
import { ItemSelectionComponent } from '../steps/item-selection/item-selection.component';
import { ItemDetailsComponent } from '../steps/item-details/item-details.component';
import { DeliveryConditionsComponent } from '../steps/delivery-conditions/delivery-conditions.component';
import { SummaryComponent } from '@shared/components/summary/summary.component';

@Component({
  selector: 'app-workflow-container',
  standalone: true,
  imports: [CardComponent, ButtonComponent, NgComponentOutlet],
  templateUrl: './workflow-container.component.html',
  styleUrl: './workflow-container.component.scss'
})
export class WorkflowContainerComponent implements OnInit {

  private workflowService = inject(WorkflowService);
  private contractService = inject(ContractService);
  private router = inject(Router);

  // Acesso de leitura aos signals
  protected workflow = this.workflowService.getCurrentWorkflow();
  protected currentStepIndex = this.workflowService.getCurrentStepIndex();
  protected workflowData = this.workflowService.getWorkflowData();


  ngOnInit(): void {
    // Registar workflows
    this.registerWorkflows();

    // Verifica se um workflow está ativo
    if (!this.workflow()) {
      this.router.navigate(['/contracts'])
    }
  }

  private registerWorkflows() {

    // Registra o workflow Novo Contrato
    this.workflowService.registerWorkflow(WorkflowType.NEW_CONTRACT, {
      type: WorkflowType.NEW_CONTRACT,
      title: 'Novo Contrato',
      steps: [
        {id: 'step-a', component: NewContractComponent, label: 'Informações Básicas'},
        {id: 'step-b', component: CommercialConditionsComponent, label: 'Condições Contratuais'},
        {id: 'step-c', component: DocumentationComponent, label: 'Documentação'},
        {id: 'summary', component: SummaryComponent, label: 'Resumo'},
      ]
    });

    // Registra o wokflow Adicionar Itens
    this.workflowService.registerWorkflow(WorkflowType.ADD_ITEMS, {
      type: WorkflowType.ADD_ITEMS,
      title: 'Incluir Items ao Contrato',
      steps: [
        {id: 'step-d', component: ItemSelectionComponent, label: 'Seleção de Items'},
        {id: 'step-e', component: ItemDetailsComponent, label: 'Detalhes dos Items'},
        {id: 'step-f', component: DeliveryConditionsComponent, label: 'Condições de Entrega'},
        {id: 'summary', component: SummaryComponent, label: 'Resumo'},
      ]
    });
  }

  protected currentStep() {
    return this.workflowService.getCurrentStep();
  }

  protected next() {
    this.workflowService.goToNextStep();
  }

  protected goBack = () => {
    this.workflowService.goToPreviousStep();
  }

  protected completeStep = (data: Record<string, any>) => {
    this.workflowService.updateWorkflowData(data);
    this.workflowService.goToNextStep();
  }

  protected cancelWorkflow() {
    if (confirm('Tem certeza que deseja cancelar este fluxo de trabalho?')) {
      this.workflowService.resetWorkflow();
      this.router.navigate(['/contracts']);
    }
  }

  protected finishWorkflow() {

    // Manipula a lógica completa do workflow baseado no typo de workflow
    const workflowType = this.workflow()?.type;
    const data = this.workflowData();

    if (workflowType === WorkflowType.NEW_CONTRACT) {
      // Cria um novo contrato usando o serviço contrato.
      this.contractService.createContract(data).subscribe({
        next: () => {
          alert('Contrato criado com suecesso!');
          this.workflowService.resetWorkflow();
          this.router.navigate(['/contracts']);
        },
        error: (error) => {
          console.error('Error creating contract', error);
          alert('Ocorreu um erro ao criar o contrato, Tente novamente.');
        }
      });
    } else if (workflowType === WorkflowType.ADD_ITEMS) {

      // Verifica se os dados necessários estão presentes
      if (!data['contractId']) {
        console.error('Missing contractId in workflow data', data);
        alert('Id do contrato não encontrado. Tente iniciar o fluxo novamente.');
        return;
      }

      if (!data['items'] || !Array.isArray(data['items']) || data['items'].length === 0) {
        console.error('Missing or invalid items in workflow data', data);
        alert('Items do contrato não encontrados ou inválidos. Verifique os dados e tente novamente.')
        return;
      }

      // Adiciona items para um contrato existente
      this.contractService.addItemsToContract(
        data['contractId'],
        data['items'] 
      ).subscribe({
        next: () => {
          alert('Items adicionados ao contrato com sucesso!');
          this.workflowService.resetWorkflow();
          this.router.navigate(['/contracts']);
        },
        error: (error) => {
          console.error('Error adding items to contract:', error);
          alert('Ocorreu um erro ao adicionar items ao contrato. Tente novamente.');
          console.error('Dados inviados:', {
            contractId: data['contractId'],
            items: data['items']
          });                    
        }
      });
    }
  }

  protected navigateToContracts() {
    this.router.navigate(['/contracts']);
  }
}
