import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HopkinsComponent } from './hopkins.component';

describe('HopkinsComponent', () => {
  let component: HopkinsComponent;
  let fixture: ComponentFixture<HopkinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HopkinsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HopkinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
