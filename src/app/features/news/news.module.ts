import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './presentation/components/components.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ComponentsModule],
  exports: [ComponentsModule],
})
export class NewsModule {}
