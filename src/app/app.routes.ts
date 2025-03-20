import { Routes } from '@angular/router';
import { ContractDetailComponent } from '@pages/contracts/contract-detail/contract-detail.component';
import { ContractListComponent } from '@pages/contracts/contract-list/contract-list.component';
import { WorkflowContainerComponent } from '@pages/workflow/workflow-container/workflow-container.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'contracts',
        pathMatch: 'full'
    },
    {
        path: 'contracts',
        component: ContractListComponent
    },
    {
        path: 'contracts/:id',
        component: ContractDetailComponent
    },
    {
        path: 'workflow',
        component: WorkflowContainerComponent
    },
    {
        path: '**',
        redirectTo: 'contracts'
    }
];
