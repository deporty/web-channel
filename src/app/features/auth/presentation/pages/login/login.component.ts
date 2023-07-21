import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  FormControlName,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { PartialObserver, Subscription } from 'rxjs';
import { LoginUserUsecase } from '../../../domain/usecases/login-user/login-user.usecase';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HomeComponent } from 'src/app/features/home/ui/pages/home/home.component';
import { HomeRoutingModule } from 'src/app/features/home/home-routing.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  static route = 'login';

  messages = {
    'Empty Credentials': 'Algunas de las credenciales están vacías',
    'Wrong credentials': 'Las credenciales son incorrectas.',
  };
  formGroup: UntypedFormGroup;

  loginSubscription!: Subscription;

  constructor(
    private _snackBar: MatSnackBar,
    private loginUsecase: LoginUserUsecase,
    private router: Router
  ) {
    this.formGroup = new UntypedFormGroup({
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.min(8),
      ]),
    });
  }


  

  login() {
    if (this.formGroup.valid) {
      const value = this.formGroup.value;

      const observer: PartialObserver<any> = {
        next: (credentials: string) => {
          this.openSnackBar('Ingreso exitoso', 'Cerrar');
          this.router.navigate([HomeRoutingModule.route])
          
        },
        error: (error: Error) => {
          const message = (this.messages as any)[error.name];
          this.openSnackBar(message, 'Cerrar');
        },
      };

      this.loginSubscription = this.loginUsecase
        .call({
          email: value.email,
          password: value.password,
        })
        .subscribe(observer);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }
}
