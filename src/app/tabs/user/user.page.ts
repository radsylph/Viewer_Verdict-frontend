import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { MovieService } from '../../services/movie.services';
import { Preferences } from '@capacitor/preferences';
import { SessionService } from 'src/app/services/session.services';
import { ViewWillEnter } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { TitleStrategy } from '@angular/router';
import { userProfile, ErrorInterface } from '../../interfaces/main';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private alert: AlertController,
    private ss: SessionService,
    private actionSheet: ActionSheetController,
    public modalController: ModalController
  ) {}

  public userId: string = '';
  public userLogged: string = '';
  public user: userProfile = {
    _id: '',
    name: '',
    lastname: '',
    username: '',
    email: '',
    profilePicture: '',
  };

  public isModalEdit = false;
  setOpenEdit(isOpen: boolean) {
    this.isModalEdit = isOpen;
  }

  async logOut() {
    const token = await Preferences.remove({ key: 'token' });
    const userId = await Preferences.remove({ key: 'userId' });
    this.alert
      .create({
        header: 'Log out',
        message: 'your session has ended',
        buttons: ['OK'],
      })
      .then((alert) => alert.present());
    this.navCtrl.navigateForward('/login');
  }

  async getToken() {
    const userId = await Preferences.get({ key: 'userToSee' });
    const userId2 = await Preferences.get({ key: 'userId' });
    if (userId.value) {
      this.userId = userId.value;
    } else {
      this.alert
        .create({
          header: 'Log out',
          message: 'your session has ended or something went wrong',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      this.navCtrl.navigateForward('/login');
    }
    if (userId2.value) {
      this.userLogged = userId2.value;
    }
  }

  async goBack() {
    this.navCtrl.navigateRoot('/tabs/discover');
  }

  async editUser() {
    if (
      this.user.name === '' ||
      this.user.lastname === '' ||
      this.user.username === '' ||
      this.user.email === ''
    ) {
      this.alert
        .create({
          header: 'Error',
          message: 'You must fill all the fields',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }
    try {
      const editUser: any = await this.ss.editUserInfo(this.user);
      console.log(editUser);
      this.alert
        .create({
          header: 'Success',
          message: 'Your profile has been updated',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      this.setOpenEdit(false);
    } catch (error: any) {
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
      this.ionViewWillEnter();
    }
  }
  presentActionSheet() {
    this.actionSheet
      .create({
        header: 'Edit Profile',
        buttons: [
          {
            text: 'Edit Profile',
            icon: 'person',
            handler: () => {
              this.setOpenEdit(true);
            },
          },
          {
            text: 'Log out',
            icon: 'log-out',
            handler: () => {
              this.logOut();
            },
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
        ],
      })
      .then((actionSheet) => actionSheet.present());
  }

  async ionViewWillEnter() {
    await this.getToken();
    console.log('hola');
    try {
      const getUserInfo: any = await this.ss.getUserInfo(this.userId);
      this.user = getUserInfo.user;
      console.log(this.user);
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnInit() {
    //this.logOut();
    console.log('hola');
  }
}
