import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorInterface, existingUser } from '../interfaces/main';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { SessionService } from '../services/session.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navCtrl: NavController,
    private ss: SessionService
  ) {}

  existingUser: existingUser = {
    user_info: '',
    password: '',
  };

  async setToken(token: string, userId: string) {
    await Preferences.set({
      key: 'token',
      value: token,
    });
    await Preferences.set({
      key: 'userId',
      value: userId,
    });
    return this.navCtrl.navigateForward('/tabs/discover');
  }

  async getToken() {
    const token = await Preferences.get({ key: 'token' });
    console.log(token.value);
    if (token.value) {
      this.navCtrl.navigateForward('/tabs/discover');
    }
  }

  async deleteToken() {
    await Preferences.remove({ key: 'token' });
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

    await this.ss.loginUser(this.existingUser).subscribe(
      (res: any) => {
        this.alert
          .create({
            header: 'Success',
            message: 'User logged successfully',
            buttons: ['OK'],
          })
          .then((alert) => alert.present());
        console.log(res);
        const userToken = res.token;
        const userId = res.id;
        console.log(res.token);
        this.setToken(userToken, userId);
      },
      async (error) => {
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
      }
    );
  }
}
