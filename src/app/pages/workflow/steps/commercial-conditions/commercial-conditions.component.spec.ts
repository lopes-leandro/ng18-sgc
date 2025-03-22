import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialConditionsComponent } from './commercial-conditions.component';

describe('CommercialConditionsComponent', () => {
  let component: CommercialConditionsComponent;
  let fixture: ComponentFixture<CommercialConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommercialConditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommercialConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
