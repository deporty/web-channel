import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { PagesModule } from './presentation/pages/pages.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, LandingRoutingModule, PagesModule],
})
export class LandingModule {}
