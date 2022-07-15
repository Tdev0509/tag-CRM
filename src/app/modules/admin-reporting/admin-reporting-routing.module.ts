import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllReportingComponent } from './all-reporting/all-reporting.component';
import { ApptitudeComponent } from './apptitude/apptitude.component';
import { HopkinsComponent } from './hopkins/hopkins.component';
import { ImgageAdvantageComponent } from './imgage-advantage/imgage-advantage.component';
import { MediaNetComponent } from './media-net/media-net.component';
import { PerionComponent } from './perion/perion.component';
import { AdminReportingComponent } from './admin-reporting.component';
import { ThirdPartyComponent } from './third-party/third-party.component';
import { BingDirectComponent } from './bing-direct/bing-direct.component';
import { LyonsComponent } from './lyons/lyons.component';
import { RubiComponent } from './rubi/rubi.component';
import { VerizonDirectComponent } from './verizon-direct/verizon-direct.component';
import { ManualUpdateComponent } from './manual-update/manual-update.component';
import { ManualSplitUpdateComponent } from './manual-split-update/manual-split-update.component';

const routes: Routes = [
  {
    path: '',
    component: AdminReportingComponent,
    children: [
      {
        path: 'perion',
        component: PerionComponent,
      },
      {
        path: 'image-advantage',
        component: ImgageAdvantageComponent,
      },
      {
        path: 'hopkins',
        component: HopkinsComponent,
      },
      {
        path: 'apptitude',
        component: ApptitudeComponent,
      },
      {
        path: 'media-net',
        component: MediaNetComponent,
      },
      {
        path: 'bing-direct',
        component: BingDirectComponent,
      },
      {
        path: 'lyons',
        component: LyonsComponent,
      },
      {
        path: 'rubi',
        component: RubiComponent,
      },
      {
        path: 'verizon-direct',
        component: VerizonDirectComponent,
      },
      {
        path: 'third-party',
        component: ThirdPartyComponent,
      },
      {
        path: 'manual-stat-update',
        component: ManualUpdateComponent,
      },
      {
        path: 'manual-split-update',
        component: ManualSplitUpdateComponent,
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
export class AdminReportingRoutingModule {}
