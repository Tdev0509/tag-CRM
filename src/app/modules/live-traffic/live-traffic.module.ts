import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveTrafficRoutingModule } from './live-traffic-routing.module';
import { GrafanaComponent } from './grafana/grafana.component';
import { ViewQueriesComponent } from './view-queries/view-queries.component';
import { LiveTrafficComponent } from './live-traffic.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DailyTrafficComponent } from './daily-traffic/daily-traffic.component';

@NgModule({
  declarations: [GrafanaComponent, ViewQueriesComponent, LiveTrafficComponent, DailyTrafficComponent],
  imports: [CommonModule, LiveTrafficRoutingModule, NgxDatatableModule],
})
export class LiveTrafficModule {}
