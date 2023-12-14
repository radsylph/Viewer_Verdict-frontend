import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorInterface } from '../interfaces/error.interface';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { SessionService } from '../services/session.services';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navCtrl: NavController,
    private ss: SessionService
  ) {}

  user: string = '';

  async deleteToken() {
    await Preferences.remove({ key: 'token' });
    this.navCtrl.navigateRoot('/login');
  }

  async resetPassword() {
    if (this.user == '') {
      this.alert
        .create({
          header: 'Reset password',
          message: 'Please enter your email',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }
    this.ss.resetPassword(this.user).subscribe(
      (res: any) => {
        console.log(res);
        this.alert
          .create({
            header: 'Reset password',
            message: 'Check your email',
            buttons: ['OK'],
          })
          .then((alert) => alert.present());
        this.deleteToken();
      },
      (error) => {
        const errorsMessages = error.error.error;
        console.log(errorsMessages);
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
      }
    );
  }

  ngOnInit() {}
}
