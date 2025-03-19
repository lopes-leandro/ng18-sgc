import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowContainerComponent } from './workflow-container.component';

describe('WorkflowContainerComponent', () => {
  let component: WorkflowContainerComponent;
  let fixture: ComponentFixture<WorkflowContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
