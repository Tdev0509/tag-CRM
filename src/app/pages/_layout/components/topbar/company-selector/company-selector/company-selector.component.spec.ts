import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySelectorComponent } from './company-selector.component';

describe('CompanySelectorComponent', () => {
  let component: CompanySelectorComponent;
  let fixture: ComponentFixture<CompanySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanySelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
