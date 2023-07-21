import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsAllowedDirective } from './is-allowed.directive';



@NgModule({
  declarations: [
    IsAllowedDirective
  ],
  exports: [
    IsAllowedDirective
  ],
  imports: [
    CommonModule
  ],
})
export class DirectivesModule { }
