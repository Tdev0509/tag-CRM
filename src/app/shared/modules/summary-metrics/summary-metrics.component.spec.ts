import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryMetricsComponent } from './summary-metrics.component';

describe('SummaryMetricsComponent', () => {
  let component: SummaryMetricsComponent;
  let fixture: ComponentFixture<SummaryMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryMetricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
