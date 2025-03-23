import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryConditionsComponent } from './delivery-conditions.component';

describe('DeliveryConditionsComponent', () => {
  let component: DeliveryConditionsComponent;
  let fixture: ComponentFixture<DeliveryConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryConditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
