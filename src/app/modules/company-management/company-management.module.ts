import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyManagementRoutingModule } from './company-management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewCompanyComponent } from './new-company/new-company.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/shared/service/snackbar.service';
import { CompaniesComponent } from './companies/companies.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { MatSelectModule } from '@angular/material/select';
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  declarations: [NewCompanyComponent, CompaniesComponent, EditCompanyComponent],
  imports: [
    CommonModule,
    CompanyManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatSelectModule,
    NgxDatatableModule,
    InlineSVGModule.forRoot()
  ],
  providers: [SnackbarService],
  entryComponents: [NewCompanyComponent],
})
export class CompanyManagementModule {}
