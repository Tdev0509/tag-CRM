import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingFilteringComponent } from './reporting-filtering.component';

describe('ReportingFilteringComponent', () => {
  let component: ReportingFilteringComponent;
  let fixture: ComponentFixture<ReportingFilteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingFilteringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingFilteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
