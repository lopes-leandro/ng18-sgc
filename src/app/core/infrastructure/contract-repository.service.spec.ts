import { TestBed } from '@angular/core/testing';

import { ContractRepositoryService } from './contract-repository.service';

describe('ContractRepositoryService', () => {
  let service: ContractRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
