import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {
  token: string;
  constructor() {
    this.token = '';
  }

  saveToken(token: string) {
    if (token) {
      this.token = token;
    }
  }
  isTokenValid() {
    return this.token != null && this.token != undefined && this.token != '';
  }
}
