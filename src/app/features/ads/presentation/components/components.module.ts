import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner/banner.component';
import { UsecasesModule } from '../../usecases/usecases.module';
import { MatButtonModule } from '@angular/material/button';

const COMPONENTS = [BannerComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [CommonModule, UsecasesModule, MatButtonModule],
})
export class ComponentsModule {}
