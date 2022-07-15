import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbAlertConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { ValidateEqualModule } from 'ng-validate-equal';
import { UserPasswordResetComponent } from './edit-users/user-password-reset/user-password-reset.component';
import { SnackbarService } from 'src/app/shared/service/snackbar.service';
import { AddTagComponent } from './edit-users/add-tag/add-tag.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddCompanyComponent } from './edit-users/add-company/add-company.component';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { PermissionComponent } from './roles/permission/permission.component';
import { SuperadminsComponent } from './superadmins/superadmins.component';
import { AdminsComponent } from './admins/admins.component';
import { AdvertisersComponent } from './advertisers/advertisers.component';
import { NewUserComponent } from './new-user/new-user.component';
import { NewSuperadminComponent } from './new-superadmin/new-superadmin.component';
import { NewAdminComponent } from './new-admin/new-admin.component';
import { NewAdvertiserComponent } from './new-advertiser/new-advertiser.component';
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  declarations: [
    UsersComponent,
    RolesComponent,
    UserManagementComponent,
    EditUsersComponent,
    UserPasswordResetComponent,
    AddTagComponent,
    AddCompanyComponent,
    PermissionComponent,
    SuperadminsComponent,
    AdminsComponent,
    AdvertisersComponent,
    NewUserComponent,
    NewSuperadminComponent,
    NewAdminComponent,
    NewAdvertiserComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    NgbModule,
    MatIconModule,
    MatCheckboxModule,
    UserManagementRoutingModule,
    ValidateEqualModule,
    NgxDatatableModule,
    MatListModule,
    MatDialogModule,
    InlineSVGModule.forRoot()
  ],
  providers: [SnackbarService],
  entryComponents: [
    UserPasswordResetComponent,
    AddTagComponent,
    AddCompanyComponent,
    EditUsersComponent,
  ],
})
export class UserManagementModule {}
