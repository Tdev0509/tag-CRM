import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProtectedMediaComponent } from './protected-media.component';

const routes: Routes = [
  {
    path: '',
    component: ProtectedMediaComponent,
    children: [
      {
        path: 'protected-media',
        component: ProtectedMediaComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectedMediaRoutingModule {}
