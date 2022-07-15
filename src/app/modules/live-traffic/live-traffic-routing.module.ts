import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyTrafficComponent } from './daily-traffic/daily-traffic.component';
import { GrafanaComponent } from './grafana/grafana.component';
import { LiveTrafficComponent } from './live-traffic.component';
import { ViewQueriesComponent } from './view-queries/view-queries.component';

const routes: Routes = [
  {
    path: '',
    component: LiveTrafficComponent,
    children: [
      {
        path: 'view-queries',
        component: ViewQueriesComponent,
      },
      {
        path: 'daily-traffic',
        component: DailyTrafficComponent,
      },
      {
        path: 'grafana',
        component: GrafanaComponent,
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveTrafficRoutingModule {}
