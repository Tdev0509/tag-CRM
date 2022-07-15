import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublisherReportingComponent } from './publisher-reporting.component';
import { PublisherComponent } from './publisher/publisher.component';

const routes: Routes = [
  {
    path: '',
    component: PublisherReportingComponent,
    children: [
      {
        path: ':tagId',
        component: PublisherComponent,
        pathMatch: 'full',
      },
      
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PublisherReportingRoutingModule { }
