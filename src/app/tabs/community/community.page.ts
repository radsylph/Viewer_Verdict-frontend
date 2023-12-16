import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { SessionService } from 'src/app/services/session.services';
import { userProfile } from 'src/app/interfaces/user.interface';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  items: any = [];
  public segmentModel = 'people';
  public users: userProfile[] = [];
  public isloading: boolean = false;
  public userId: string = '';

  constructor(
    private alert: AlertController,
    private ss: SessionService,
    private actionSheet: ActionSheetController,
    private toast: ToastController,
    private navCtrl: NavController
  ) {}
  ngOnInit() {}

  async ionViewWillEnter() {
    this.getToken();
    try {
      const allUsers: any = await this.ss.getAllUsers();
      this.users = allUsers.users;
      console.log(this.users);
    } catch (error) {
      console.log(error);
    }
    this.isloading = true;
  }

  async goToUser(id: string) {
    await Preferences.set({ key: 'userToSee', value: id });
    setTimeout(() => {
      this.navCtrl.navigateForward('/tabs/user');
    }, 500);
  }

  async goToGroup(id: string) {
    await Preferences.set({ key: 'groupToSee', value: id });
    setTimeout(() => {
      this.navCtrl.navigateForward('/tabs/groupchat');
    }, 500);
  }

  async getToken() {
    const userId = await Preferences.get({ key: 'userId' });
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
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.isloading = false;
      this.ionViewWillEnter();
      event.target.complete();
    }, 2000);
  }
}
