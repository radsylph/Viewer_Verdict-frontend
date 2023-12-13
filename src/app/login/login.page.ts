import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorInterface, existingUser } from '../interfaces/main';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController
  ) {}

  async setToken(token: string) {
    await Preferences.set({
      key: 'token',
      value: token,
    });
    this.navigation.navigateForward('/main/tabs/home');
  }

  async getToken() {
    const token = await Preferences.get({ key: 'token' });
    if (token.value) {
      this.navigation.navigateForward('/main/tabs/home');
    }
  }

  ngOnInit() {
    this.getToken();
    this.existingUser = {
      user_info: '',
      password: '',
    };
  }

  showPassword() {
    const input = document.getElementById('password') as HTMLInputElement;
    const button = document.getElementById('show_password') as HTMLInputElement;
    if (input.type == 'password') {
      input.type = 'text';
      button.name = 'eye-off';
    } else {
      input.type = 'password';
      button.name = 'eye';
    }
  }

  existingUser: existingUser = {
    user_info: '',
    password: '',
  };

  async Login() {
    if (this.existingUser.user_info == '' || this.existingUser.password == '') {
      this.alert
        .create({
          header: 'Error',
          message: 'Please fill all the fields',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }

    this.http
      .post(
        'https://funaticsbackend-production.up.railway.app/auth/login',
        this.existingUser
      )
      .pipe(
        catchError((error) => {
          const errorsMessages = error.error.errors;
          const newErrors: Array<String> = [];
          console.log(errorsMessages);
          errorsMessages.forEach((element: ErrorInterface) => {
            newErrors.push(element.msg);
          });
          console.log(newErrors);
          this.alert
            .create({
              header: 'you have the following errors',
              message: newErrors.join(', '),
              buttons: ['OK'],
            })
            .then((alert) => {
              alert.present();
            });
          return throwError(error);
        })
      )
      .subscribe((res: any) => {
        this.alert
          .create({
            header: 'Success',
            message: 'User logged successfully',
            buttons: ['OK'],
          })
          .then((alert) => alert.present());
        const { token } = res;
        this.setToken(token);
      });

    // try {
    //   this.http
    //     .post(
    //       'https://funaticsbackend-production.up.railway.app/auth/login',
    //       this.existingUser
    //     )
    //     .subscribe((res: any) => {
    //       this.alert
    //         .create({
    //           header: 'Success',
    //           message: 'User logged successfully',
    //           buttons: ['OK'],
    //         })
    //         .then((alert) => alert.present());
    //       const { token } = res;
    //       this.setToken(token);
    //     });
    // } catch (error) {
  }
}
