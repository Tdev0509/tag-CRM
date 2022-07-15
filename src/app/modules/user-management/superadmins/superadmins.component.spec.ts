import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminsComponent } from './superadmins.component';

describe('SuperadminsComponent', () => {
  let component: SuperadminsComponent;
  let fixture: ComponentFixture<SuperadminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperadminsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
