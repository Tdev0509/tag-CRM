import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingFilteringComponent } from './reporting-filtering/reporting-filtering.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReportingRevenueChartComponent } from './reporting-revenue-chart/reporting-revenue-chart.component';
import { SummaryMetricsComponent } from './summary-metrics/summary-metrics.component';
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  declarations: [
    ReportingFilteringComponent,
    ReportingRevenueChartComponent,
    SummaryMetricsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatListModule,
    InlineSVGModule
  ],
  exports: [
    ReportingFilteringComponent,
    ReportingRevenueChartComponent,
    SummaryMetricsComponent,
  ],
})
export class SharedModule {}
