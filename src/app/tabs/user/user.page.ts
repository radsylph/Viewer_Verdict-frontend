import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { MovieService } from '../../services/movie.services';
import { Preferences } from '@capacitor/preferences';
import { SerieInterface, ReviewInterface } from 'src/app/interfaces/main';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { TitleStrategy } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  constructor(private navCtrl: NavController, private alert: AlertController) {}

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

  async ngOnInit() {
    this.logOut();
  }
}
