import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TagManagementComponent } from '../tag-management/tag-management.component';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyManagementComponent } from './company-management.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { NewCompanyComponent } from './new-company/new-company.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyManagementComponent,
    children: [
      {
        path: 'companies',
        component: CompaniesComponent
      },
      {
        path: 'new',
        component: NewCompanyComponent
      },
      {
        path: 'edit/:id',
        component: EditCompanyComponent,
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
export class CompanyManagementRoutingModule { }
