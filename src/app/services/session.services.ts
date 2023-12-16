import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  newUser,
  ErrorInterface,
  existingUser,
  userProfile,
} from '../interfaces/main';
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

  getUserInfo(userId: string) {
    try {
      return new Promise((resolve, reject) => {
        this.http.get(`${this.BackenUrl}/auth/getAUser/${userId}`).subscribe(
          (data: any) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  editUserInfo(user: userProfile) {
    try {
      return new Promise((resolve, reject) => {
        this.http.put(`${this.BackenUrl}/auth/editUser`, user).subscribe(
          (data: any) => {
            console.log(data);
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
      });
    } catch (error) {
      throw error;
    }
  }

  getAllUsers() {
    try {
      return new Promise((resolve, reject) => {
        this.http.get(`${this.BackenUrl}/auth/getAllUsers`).subscribe(
          (data: any) => {
            console.log(data);
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
