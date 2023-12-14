import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { newUser, ErrorInterface } from '../interfaces/main';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { SessionService } from '../services/session.services';

import { NavController } from '@ionic/angular';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navCtrl: NavController,
    private ss: SessionService
  ) {}

  image: any;
  test: any;
  newUser: newUser = {
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    repeat_password: '',
    captchaResponse: undefined,
    profilePicture: 'image.png',
    bio: '',
  };

  public resolved(captchaResponse: string): void {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.newUser.captchaResponse = captchaResponse;
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }

  ngOnInit() {
    this.newUser = {
      name: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      repeat_password: '',
      captchaResponse: undefined,
      profilePicture: 'image.png',
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

  showRepeatPassword() {
    const input = document.getElementById(
      'repeat_password'
    ) as HTMLInputElement;
    const button = document.getElementById(
      'show_repeat_password'
    ) as HTMLInputElement;
    if (input.type == 'password') {
      input.type = 'text';
      button.name = 'eye-off';
    } else {
      input.type = 'password';
      button.name = 'eye';
    }
  }

  async signup() {
    if (
      this.newUser.name == '' ||
      this.newUser.lastname == '' ||
      this.newUser.username == '' ||
      this.newUser.email == '' ||
      this.newUser.password == '' ||
      this.newUser.repeat_password == ''
    ) {
      this.alert
        .create({
          header: 'Error',
          message: 'Please fill all the fields',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }

    if (this.newUser.password != this.newUser.repeat_password) {
      this.alert
        .create({
          header: 'Error',
          message: 'The passwords does not match',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }

    if (this.newUser.password.length < 6) {
      this.alert
        .create({
          header: 'Error',
          message: 'Password must be at least 6 characters long',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }

    if (!this.newUser.captchaResponse) {
      this.alert
        .create({
          header: 'Error',
          message: 'Please verify that you are not a robot',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }

    console.log(this.newUser);

    await this.ss.createUser(this.newUser).subscribe(
      (response: any) => {
        console.log(response);
        this.alert
          .create({
            header: 'Success',
            message: 'User created successfully',
            buttons: ['OK'],
          })
          .then((alert) => alert.present());
        this.navCtrl.navigateForward('/login');
        this.newUser = {
          name: '',
          lastname: '',
          username: '',
          email: '',
          password: '',
          repeat_password: '',
          captchaResponse: undefined,
          profilePicture: 'image.png',
        };
      },
      (error: any) => {
        console.log(error);
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
      }
    );

    // await this.http
    //   .post(
    //     'https://funaticsbackend-production.up.railway.app/auth/create',
    //     this.newUser
    //   )
    //   .pipe(
    //     catchError((error) => {
    //       const errorsMessages = error.error.errors;
    //       const newErrors: Array<String> = [];
    //       console.log(errorsMessages);
    //       errorsMessages.forEach((element: ErrorInterface) => {
    //         newErrors.push(element.msg);
    //       });
    //       console.log(newErrors);
    //       this.alert
    //         .create({
    //           header: 'you have the following errors',
    //           message: newErrors.join(', '),
    //           buttons: ['OK'],
    //         })
    //         .then((alert) => {
    //           alert.present();
    //         });
    //       return throwError(error);
    //     })
    //   )
    //   .subscribe((response) => {
    //     console.log(response);
    //     this.alert
    //       .create({
    //         header: 'Success',
    //         message: 'User created successfully',
    //         buttons: ['OK'],
    //       })
    //       .then((alert) => alert.present());
    //     console.log(response);
    //     this.navigation.navigateForward('/login');
    //   });
  }
}
