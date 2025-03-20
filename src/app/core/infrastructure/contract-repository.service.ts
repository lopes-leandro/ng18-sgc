import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Contract } from '@core/domain/models/contract.model';


@Injectable({
  providedIn: 'root'
})
export class ContractRepositoryService {

  private apiUrl = 'api/contract';
  private http = inject(HttpClient);

  private mockContracts: Contract[] = [
    {
      id: 1,
      clientName: 'Empresa ABC',
      contractType: 'service',
      startDate: new Date(2023, 0, 15),
      value: 15000,
      items: [],
      status: 'active' as any
    },
    {
      id: 2,
      clientName: 'Corporação XYZ',
      contractType: 'product',
      startDate: new Date(2023, 1, 22),
      value: 28500,
      items: [],
      status: 'active' as any
    },
    {
      id: 3,
      clientName: 'Indústrias 123',
      contractType: 'mixed',
      startDate: new Date(2023, 2, 10),
      value: 9800,
      items: [{id: 1, description: 'Item 1', quantity: 5, totalPrice: 10, unitPrice: 2}],
      status: 'active' as any
    }
  ];

  getAll(): Observable<Contract[]> {
    return of(this.mockContracts);
  }

  getById(id: number): Observable<Contract | undefined> {
    const contract = this.mockContracts.find(c => c.id === id);
    return of(contract);
  }

  create(contract: Contract): Observable<Contract> {
    const newContract = {
      ...contract,
      id: this.mockContracts.length + 1
    }
    this.mockContracts.push(newContract);
    return of(newContract);
  }

  update(contract: Contract): Observable<Contract> {
   const index = this.mockContracts.findIndex(c => c.id === contract.id);
   if (index !== -1) {
    this.mockContracts[index] = {...contract};
    return of(this.mockContracts[index]);
   }
   return of(contract) 
  }

  addItems(contractId: number, items: any[]): Observable<Contract> {
    const index = this.mockContracts.findIndex(c => c.id === contractId);
    if (index !== -1) {
      const formattedItems = items.map(item => ({
        id: item.id,
        description: item.name || item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      }));

      const updateContract = {
        ...this.mockContracts[index],
        items: [...this.mockContracts[index].items, ...formattedItems],
        value: this.mockContracts[index].value + formattedItems.reduce((sum, item) => sum + item.totalPrice, 0)
      };

      this.mockContracts[index] = updateContract;
      return of(updateContract);
    }
    return of(this.mockContracts[index]);
  }


}
