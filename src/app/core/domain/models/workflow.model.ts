
export enum WorkFlowType {
    NEW_CONTRACT = 'newContract',
    ADD_ITEMS = 'addItems'
}

export interface Step {
    id: string;
    component: unknown;
    label: string;
}

export interface Workflow {
    type: WorkFlowType;
    steps: Step[];
    title: string;
}
