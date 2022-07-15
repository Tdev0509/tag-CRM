import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingRevenueChartComponent } from './reporting-revenue-chart.component';

describe('ReportingRevenueChartComponent', () => {
  let component: ReportingRevenueChartComponent;
  let fixture: ComponentFixture<ReportingRevenueChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingRevenueChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingRevenueChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
