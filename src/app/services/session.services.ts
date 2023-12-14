import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { newUser, ErrorInterface, existingUser } from '../interfaces/main';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SessionService {
  constructor(private http: HttpClient) {}

  private newUser: newUser = {
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    repeat_password: '',
    captchaResponse: undefined,
    profilePicture: 'image.png',
  };
  private existingUser = {
    user_info: '',
    password: '',
  };

  private BackenUrl: string =
    'http://localhost:7338' ||
    'https://viewerverdict-backend-production.up.railway.app';

  createUser(newUser: newUser) {
    return this.http.post(`${this.BackenUrl}/auth/create`, newUser).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  loginUser(existingUser: existingUser) {
    return this.http.post(`${this.BackenUrl}/auth/login`, existingUser).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  resetPassword(email: string) {
    return this.http
      .post(`${this.BackenUrl}/auth/reset_password`, { email })
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(error);
        })
      );
  }
}
