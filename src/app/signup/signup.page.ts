import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { newUser, ErrorInterface } from '../interfaces/main';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { SessionService } from '../services/session.services';

import { NavController } from '@ionic/angular';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { RecaptchaComponent } from 'ng-recaptcha';

import { CheckboxCustomEvent } from '@ionic/angular';

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

  selectedAvatarIndex: number = -1;

  selectAvatar(index: number) {
    this.avatares.forEach((avatar: any) => (avatar.selected = false));
    this.avatares[index].selected = true;
    this.newUser.profilePicture = this.avatares[index].url;
  }

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

  isModalOpen = false;
  public avatares: any = [
    {
      id: 1,
      url: 'https://firebasestorage.googleapis.com/v0/b/funatics-1699583872359.appspot.com/o/profilePictures%2FAvatar_0.png?alt=media&token=f2b92326-c1de-4831-a6b8-a63bfb6ecc15',
      selected: false,
    },
    {
      id: 2,
      url: 'https://firebasestorage.googleapis.com/v0/b/funatics-1699583872359.appspot.com/o/profilePictures%2FAvatar_10.png?alt=media&token=18a353b2-c7de-4e84-b537-281a88e12a89',
      selected: false,
    },
    {
      id: 3,
      url: 'https://firebasestorage.googleapis.com/v0/b/funatics-1699583872359.appspot.com/o/profilePictures%2FAvatar_12.png?alt=media&token=3c1b00ac-46b4-4826-89de-383d3fbccaea',
      selected: false,
    },
    {
      id: 4,
      url: 'https://firebasestorage.googleapis.com/v0/b/funatics-1699583872359.appspot.com/o/profilePictures%2FAvatar_15.png?alt=media&token=556510ec-7605-4a22-bb2d-6f1a9b8ded39',
      selected: false,
    },
    {
      id: 5,
      url: 'https://firebasestorage.googleapis.com/v0/b/funatics-1699583872359.appspot.com/o/profilePictures%2FAvatar_19.png?alt=media&token=a9786418-6259-4d84-a1f8-3dbfcb444dad',
      selected: false,
    },
    {
      id: 6,
      url: 'https://firebasestorage.googleapis.com/v0/b/funatics-1699583872359.appspot.com/o/profilePictures%2FAvatar_2.png?alt=media&token=f22d5206-2350-4998-9ddf-6194a641fed2',
      selected: false,
    },
    {
      id: 7,
      url: 'https://firebasestorage.googleapis.com/v0/b/funatics-1699583872359.appspot.com/o/profilePictures%2FAvatar_23.png?alt=media&token=bcaff12e-c4bf-46f7-a48e-ca79414de7df',
      selected: false,
    },
    {
      id: 9,
      url: 'https://firebasestorage.googleapis.com/v0/b/funatics-1699583872359.appspot.com/o/profilePictures%2FAvatar_24.png?alt=media&token=d37bd065-2b52-481c-ba8d-cc136dac1e96',
      selected: false,
    },
    {
      id: 10,
      url: 'https://firebasestorage.googleapis.com/v0/b/funatics-1699583872359.appspot.com/o/profilePictures%2FAvatar_26.png?alt=media&token=9141e5e2-f13e-43c0-9051-55613494a8e3',
      selected: false,
    },
    {
      id: 11,
      url: 'https://firebasestorage.googleapis.com/v0/b/funatics-1699583872359.appspot.com/o/profilePictures%2FAvatar_28.png?alt=media&token=f40f3d0e-9636-4374-b5dd-212f6301c4a6',
      selected: false,
    },
  ];
  openModel() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  public resolved(captchaResponse: string): void {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.newUser.captchaResponse = captchaResponse;
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
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
  }

  canDismiss = false;

  presentingElement: any = null;

  onTermsChanged(event: any) {
    this.canDismiss = event.detail.checked;
  }
}
