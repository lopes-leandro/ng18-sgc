import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from '@core/application/services/contract.service';
import { WorkflowService } from '@core/application/services/workflow.service';
import { Contract } from '@core/domain/models/contract.model';
import { WorkflowType } from '@core/domain/models/workflow.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { CardComponent } from '@shared/components/ui/card/card.component';


@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [ButtonComponent, CardComponent, CurrencyPipe, DatePipe],
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.scss'
})
export class ContractListComponent implements OnInit {


  private router = inject(Router);
  private contractService = inject(ContractService);
  private workflowService = inject(WorkflowService);

  protected contracts: Contract[] = [];

  ngOnInit(): void {
    this.loadContracts();
  }

  private loadContracts() {
    this.contractService.getContracts().subscribe(contracts => {
      this.contracts = contracts;
    });
  }

  protected createNewContract() {
    // Serviço do Workflow para Novo Contrato
    this.workflowService.startWorkflow(WorkflowType.NEW_CONTRACT);

    this.router.navigate(['/workflow']);
  }

  protected addItemsToContract(contract: Contract) {
    // Serviço do Workflow para Adicionar Item
    this.workflowService.startWorkflow(WorkflowType.ADD_ITEMS, {
      contractId: contract.id,
      contractName: contract.clientName
    })
    this.router.navigate(['/workflow']);
  }

  protected viewContract(contract: Contract) {
    this.router.navigate(['/contracts', contract.id]);
  }
}
