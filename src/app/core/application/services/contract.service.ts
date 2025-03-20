import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contract, ContractStatus } from '@core/domain/models/contract.model';
import { ContractRepositoryService } from '@core/infrastructure/contract-repository.service';


@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private contractRepository = inject(ContractRepositoryService);

  getContracts(): Observable<Contract[]> {
    return this.contractRepository.getAll();
  }

  getContractById(id: number): Observable<Contract | undefined> {
    return this.contractRepository.getById(id);
  }

  createContract(contract: Partial<Contract>): Observable<Contract> {
    const newContract: Contract = {
      ...contract,
      id: 0,
      status: ContractStatus.DRAFT,
      items: [],
      value: 0
    } as Contract;
    return this.contractRepository.create(newContract);
  }

  updateContract(contract: Contract): Observable<Contract> {
    return this.contractRepository.update(contract);
  }

  addItemsToContract(contractId: number, items: any[]): Observable<Contract> {
    return this.contractRepository.addItems(contractId, items);
  }
}
