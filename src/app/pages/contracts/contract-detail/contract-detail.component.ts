import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '@core/application/services/contract.service';
import { Contract } from '@core/domain/models/contract.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { CardComponent } from '@shared/components/ui/card/card.component';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [ButtonComponent, CardComponent, DatePipe, CurrencyPipe],
  templateUrl: './contract-detail.component.html',
  styleUrl: './contract-detail.component.scss'
})
export class ContractDetailComponent implements OnInit {


  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contractService = inject(ContractService);

  contract: Contract | undefined;
  loading = true;

  ngOnInit(): void {
    this.loadContractDetails();
  }

  private loadContractDetails(): void {
    const contractId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(contractId);
    
    if (!isNaN(contractId)) {
      this.contractService.getContractById(contractId).subscribe({
        next: (contract) => {          
          this.contract = contract;
          this.loading = false;
        },
        error: () => {
          this.contract = undefined;
          this.loading = false;    
        }
      })
    } else {
      this.contract = undefined;
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/contracts']);
  }

  addItems() {
    if (this.contract) {
      //Workflow
      this.router.navigate(['/workflow']);
    }
  }

  getContractTypeLabel(type: string): string {
    const types: Record<string, string> = {
      'service': 'Serviço',
      'product': 'Produto',
      'mixed': 'Misto'
    }
    return types[type] || type;
  }

  getStatusLabel(status: string): string {
    const statuses: Record<string, string> = {
      'draft': 'Rascunho',
      'active': 'Ativo',
      'completed': 'Concluído',
      'cancelled': 'Cancelado'
    }
    return statuses[status] || status;
  }

  getTotalItemsValue(): number {
    if (!this.contract?.items || this.contract.items.length === 0) {
      return 0
    }
    return this.contract.items.reduce((total, item) => total + item.totalPrice, 0);
  }


}
