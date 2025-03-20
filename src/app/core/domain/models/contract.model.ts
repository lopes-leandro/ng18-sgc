export interface Contract {
    id: number;
    clientName: string;
    contractType: string;
    startDate: Date;
    value: number;
    items: ContractItem[];
    status: ContractStatus;
}

export interface ContractItem {
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export enum ContractStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    COMPLETED = 'completed',
    CANCELED = 'cancelled'
}