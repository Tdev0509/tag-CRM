import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedMediaRoutingModule } from './protected-media-routing.module';
import { ProtectedMediaComponent } from './protected-media.component';


@NgModule({
  declarations: [ProtectedMediaComponent],
  imports: [
    CommonModule,
    ProtectedMediaRoutingModule
  ]
})
export class ProtectedMediaModule { }
