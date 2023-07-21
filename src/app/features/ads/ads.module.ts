import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './presentation/components/components.module';

@NgModule({
  exports: [ComponentsModule],
  imports: [CommonModule, ComponentsModule, ],
})
export class AdsModule {}
