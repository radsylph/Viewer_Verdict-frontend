import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { TitleStrategy } from '@angular/router';
import {
  userProfile,
  ErrorInterface,
  MessageInterface,
} from '../../interfaces/main';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { SessionService } from 'src/app/services/session.services';
import { NavController } from '@ionic/angular';
import { io } from 'socket.io-client';
import { ChatService } from 'src/app/services/chat.services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private alert: AlertController,
    private ss: SessionService,
    private actionSheet: ActionSheetController,
    public modalController: ModalController,
    private cs: ChatService,
    private toast: ToastController,
    private http: HttpClient
  ) {
    this.socket = io(`${this.BackenUrl}`, { autoConnect: false });
    this.socket.on('messageFromAnother', (data: any) => {
      console.log(data);
      this.messages.push(data);
      console.log(this.messages);
    });
  }

  items: any = [];
  public userId: string = '';
  public userId2: string = '';
  public userLogged: string = '';
  public user: userProfile = {
    _id: '',
    name: '',
    lastname: '',
    username: '',
    email: '',
    profilePicture: '',
  };
  public user2: userProfile = {
    _id: '',
    name: '',
    lastname: '',
    username: '',
    email: '',
    profilePicture: '',
  };
  private socket: any;
  public roomId: string = '';
  private BackenUrl: string =
    'https://viewerverdict-backend-production.up.railway.app';
  public messages: any = [];
  public message: any = '';

  ngOnInit(): void {}

  public isloading: boolean = false;

  async ionViewWillEnter() {
    await this.getToken();
    console.log('hola');
    try {
      const getUserInfo: any = await this.ss.getUserInfo(this.userId);
      const getUserInfo2: any = await this.ss.getUserInfo(this.userId2);
      this.user = getUserInfo.user;
      this.user2 = getUserInfo2.user;
      console.log(this.user);
    } catch (error) {
      console.log(error);
    }
    this.socket.connect();
    this.roomId = [this.user._id, this.user2._id].sort().join('-');

    this.socket.emit('joinRoom', {
      roomId: this.roomId,
      user: this.user2,
    });
    try {
      const ChatMessages: any = await this.cs.getChatMessages(this.roomId, [
        this.user._id,
        this.user2._id,
      ]);
      const messages: MessageInterface[] = ChatMessages.chatMessages;
      this.messages = messages;
    } catch (error: any) {
      console.log(error);
    }
    setTimeout(() => {
      this.isloading = true;
    }, 1000);
  }

  async sendMessage() {
    if (this.message === '') {
      return;
    }
    const message = {
      message: this.message,
      sender: this.user2,
    };
    const messageToSave = {
      message: this.message,
      sender: this.user2.username,
      idSender: this.user2._id,
      sendTo: this.user.username,
      idSentTo: this.user._id,
      idRoom: this.roomId,
    };
    this.socket.emit('chatMessage', {
      message: this.message,
      sender: this.user2.username,
      idSender: this.user2._id,
      sendTo: this.user.username,
      idSentTo: this.user._id,
      idRoom: this.roomId,
    });
    console.log(message);
    try {
      this.cs.saveChatMessages(messageToSave);
    } catch (error) {
      console.log(error);
    }
    this.message = '';
  }

  async getMessages() {
    try {
      this.socket.emit('getMessages', {
        roomId: this.roomId,
        user: this.user2,
      });

      this.socket.on('message', (data: any) => {
        console.log(data);
        this.alert
          .create({
            header: 'New message',
            message: data,
            buttons: ['OK'],
          })
          .then((alert) => alert.present());
      });
    } catch (error) {}
  }

  async goBack() {
    this.socket.emit('leaveRoom', {
      roomId: this.roomId,
    });
    this.socket.disconnect();
    await this.navCtrl.navigateRoot('/tabs/discover');
  }

  async getToken() {
    const userId = await Preferences.get({ key: 'userToSee' });
    const userId2 = await Preferences.get({ key: 'userId' });
    if (userId.value && userId2.value) {
      this.userId = userId.value;
      this.userId2 = userId2.value;
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

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Item ${count + i}`);
    }
  }

  onIonInfinite(ev: Event) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 2000);
  }
}
