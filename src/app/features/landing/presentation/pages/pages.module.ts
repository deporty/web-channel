import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { RouterModule } from '@angular/router';
import { QuotationComponent } from './quotation/quotation.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [QuotationComponent, WelcomeComponent],
  exports: [WelcomeComponent],
  imports: [
    CommonModule,
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CoreModule,
    RouterModule,
    MatListModule,
    MatButtonModule,
  ],
})
export class PagesModule {}
