import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';
import { AuthGuard } from '../modules/auth/_services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        // data: { permission: 'dashboard' },
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
          
      },
      {
        path: 'builder',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./builder/builder.module').then((m) => m.BuilderModule),
          data: { permission: 'layoutBuilder' },
      },
      {
        path: 'ecommerce',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../modules/e-commerce/e-commerce.module').then(
            (m) => m.ECommerceModule
          ),
          data: { permission: 'eCommerce' },
      },
      {
        path: 'tag-management',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../modules/tag-management/tag-management.module').then(
            (m) => m.TagManagementModule
          ),
          data: { permission: 'tagManage' },
      },
      {
        path: 'protected-media',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../modules/protected-media/protected-media.module').then(
            (m) => m.ProtectedMediaModule
          ),
          data: { permission: 'protectedMedia' },
      },
      {
        path: 'company-management',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            '../modules/company-management/company-management.module'
          ).then((m) => m.CompanyManagementModule),
          data: { permission: 'companyManage' },
      },
      {
        path: 'reporting',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../modules/admin-reporting/admin-reporting.module').then(
            (m) => m.AdminReportingModule
          ),
          data: { permission: 'reportManage' },
      },
      {
        path: 'publisher-reporting',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            '../modules/publisher-reporting/publisher-reporting.module'
          ).then((m) => m.PublisherReportingModule),
          data: { permission: 'dashboard' },
      },
      {
        path: 'live-traffic',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../modules/live-traffic/live-traffic.module').then(
            (m) => m.LiveTrafficModule
          ),
          data: { permission: 'liveTraffic' },
      },
      {
        path: 'user-management',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../modules/user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
          data: { permission: 'userManage' },
      },
      {
        path: 'ngbootstrap',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../modules/ngbootstrap/ngbootstrap.module').then(
            (m) => m.NgbootstrapModule
          ),
          data: { permission: 'ngBootstrap' },
      },
      {
        path: 'material',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../modules/material/material.module').then(
            (m) => m.MaterialModule
          ),
          data: { permission: 'material' },
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'errors/404',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
