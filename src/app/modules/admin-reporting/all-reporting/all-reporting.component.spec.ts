import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReportingComponent } from './all-reporting.component';

describe('AllReportingComponent', () => {
  let component: AllReportingComponent;
  let fixture: ComponentFixture<AllReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllReportingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
