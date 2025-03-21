
export enum WorkflowType {
    NEW_CONTRACT = 'newContract',
    ADD_ITEMS = 'addItems'
}

export interface Step {
    id: string;
    component: any;
    label: string;
}

export interface Workflow {
    type: WorkflowType;
    steps: Step[];
    title: string;
}
