import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateResourceComponent } from './create-resource/create-resource.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const PAGES = [
  CreateResourceComponent,
  LoginComponent
]

@NgModule({
  declarations: [...PAGES],
  exports: [...PAGES],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PagesModule { }
