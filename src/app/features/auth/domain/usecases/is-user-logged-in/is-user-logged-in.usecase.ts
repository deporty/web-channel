import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TokenService } from 'src/app/core/infrastructure/services/token/token.service';
@Injectable()
export class IsUserLoggedInUsecase {
  constructor(private tokenService: TokenService) {}
  call(): Observable<boolean> {
    return of(this.tokenService.isTokenValid());
  }
}
