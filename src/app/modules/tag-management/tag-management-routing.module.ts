import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewTagComponent } from './new-tag/new-tag.component';
import { EditTagComponent } from './edit-tag/edit-tag.component';
import { TagsComponent } from './tags/tags.component';
import { TagManagementComponent } from './tag-management.component';
import { TemplateComponent } from './template/template.component';

const routes: Routes = [
  {
    path: '',
    component: TagManagementComponent,
    children: [
      {
        path: 'tags',
        component: TagsComponent
      },
      {
        path: 'templates',
        component: TemplateComponent
      },
      {
        path: 'new',
        component: NewTagComponent
      },
      {
        path: 'edit/:id',
        component: EditTagComponent,
        pathMatch: 'full'
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagManagementRoutingModule { }
