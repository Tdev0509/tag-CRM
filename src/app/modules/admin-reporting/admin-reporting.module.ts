import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReportingRoutingModule } from './admin-reporting-routing.module';
import { RouterModule } from '@angular/router';
import { PerionComponent } from './perion/perion.component';
import { ImgageAdvantageComponent } from './imgage-advantage/imgage-advantage.component';
import { HopkinsComponent } from './hopkins/hopkins.component';
import { ApptitudeComponent } from './apptitude/apptitude.component';
import { AllReportingComponent } from './all-reporting/all-reporting.component';
import { MediaNetComponent } from './media-net/media-net.component';
import { ThirdPartyComponent } from './third-party/third-party.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { BingDirectComponent } from './bing-direct/bing-direct.component';
import { LyonsComponent } from './lyons/lyons.component';
import { RubiComponent } from './rubi/rubi.component';
import { VerizonDirectComponent } from './verizon-direct/verizon-direct.component';
import { ManualUpdateComponent } from './manual-update/manual-update.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { InlineSVGModule } from 'ng-inline-svg';
import { ManualSplitUpdateComponent } from './manual-split-update/manual-split-update.component';

@NgModule({
  declarations: [
    PerionComponent,
    ImgageAdvantageComponent,
    HopkinsComponent,
    ApptitudeComponent,
    AllReportingComponent,
    MediaNetComponent,
    ThirdPartyComponent,
    BingDirectComponent,
    LyonsComponent,
    RubiComponent,
    VerizonDirectComponent,
    ManualUpdateComponent,
    ManualSplitUpdateComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    AdminReportingRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    SharedModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    InlineSVGModule
  ],
  entryComponents: [],
})
export class AdminReportingModule {}
