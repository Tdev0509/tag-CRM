import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { SuperadminsComponent } from './superadmins/superadmins.component';
import { AdminsComponent } from './admins/admins.component';
import { AdvertisersComponent } from './advertisers/advertisers.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { NewUserComponent } from './new-user/new-user.component';
import { NewSuperadminComponent } from './new-superadmin/new-superadmin.component';
import { NewAdminComponent } from './new-admin/new-admin.component';
import { NewAdvertiserComponent } from './new-advertiser/new-advertiser.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      {
        path: 'super-admin-users',
        component: SuperadminsComponent,
      },
      {
        path: 'admin-users',
        component: AdminsComponent,
      },
      {
        path: 'advertiser-users',
        component: AdvertisersComponent,
      },
      {
        path: 'publisher-users',
        component: UsersComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'new-super-admin',
        component: NewSuperadminComponent,
      },
      {
        path: 'new-admin',
        component: NewAdminComponent,
      },
      {
        path: 'new-advertiser',
        component: NewAdvertiserComponent,
      },
      {
        path: 'new-publisher',
        component: NewUserComponent,
      },
      {
        path: 'edit-user',
        component: EditUsersComponent,
      },
      {
        path: 'edit/:id',
        component: EditUsersComponent,
        pathMatch: 'full'
      },
      { path: '', redirectTo: 'publisher-users', pathMatch: 'full' },
      { path: '**', redirectTo: 'publisher-users', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
