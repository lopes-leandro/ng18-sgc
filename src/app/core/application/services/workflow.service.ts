import { Injectable, signal } from '@angular/core';
import { Workflow, WorkflowType } from '@core/domain/models/workflow.model';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  // Signal para o workflow atual
  private currentWorkflow = signal<Workflow | null>(null);
  private currentStepIndex = signal<number>(0);
  private workflowData = signal<Record<string, any>>({});

  // Define workflows: A configuração vai ser baseado em componentes step
  private workflows: Record<WorkflowType, Workflow> = {} as Record<WorkflowType, Workflow>;

  // Getters como signals legíveis
  getCurrentWorkflow() {
    return this.currentWorkflow.asReadonly();
  }

  getCurrentStepIndex() {
    return this.currentStepIndex.asReadonly();
  }

  getWorkflowData() {
    return  this.workflowData.asReadonly();
  }

  // Registra workflows
  registerWorkflow(type: WorkflowType, workflow: Workflow) {
    this.workflows[type] = workflow;
  }

  // Métodos para manipular operações no workflow
  startWorkflow(type: WorkflowType, initialData: Record<string, any> = {}) {
    this.currentWorkflow.set(this.workflows[type]);
    this.currentStepIndex.set(0);
    this.workflowData.set(initialData);
  }

  goToNextStep() {
    const workflow = this.currentWorkflow();
    if (!workflow) return;

    const nextIndex = this.currentStepIndex() + 1;
    if (nextIndex < workflow.steps.length) {
      this.currentStepIndex.set(nextIndex);
    }
  }

  goToPreviousStep() {
    const currentIndex = this.currentStepIndex();
    if (currentIndex > 0) {
      this.currentStepIndex.set(currentIndex - 1);
    }
  }

  getCurrentStep() {
    const workflow = this.currentWorkflow();
    if (!workflow) return null;

    return workflow.steps[this.currentStepIndex()];
  }

  updateWorkflowData(data: Record<string, any>) {
    this.workflowData.update(current => ({...current, ...data}));
  }

  resetWorkflow() {
    this.currentWorkflow.set(null);
    this.currentStepIndex.set(0);
    this.workflowData.set({});
  }
}
