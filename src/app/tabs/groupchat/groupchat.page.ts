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
  selector: 'app-groupchat',
  templateUrl: './groupchat.page.html',
  styleUrls: ['./groupchat.page.scss'],
})
export class GroupchatPage implements OnInit {
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

  public userId: string = '';
  public users: any = [];
  public user: any = {
    _id: '',
    name: '',
    lastname: '',
    username: '',
    email: '',
    profilePicture: '',
  };

  public messages: MessageInterface[] = [];
  public message: any = '';
  public socket: any;
  public BackenUrl: string =
    'https://viewerverdict-backend-production.up.railway.app';
  // 'http://localhost:7338' || ;

  public roomId: string = '';

  public isloading: boolean = false;
  ngOnInit() {}

  async sendMessage() {
    if (this.message === '') {
      return;
    }
    const message = {
      message: this.message,
      idRoom: this.user,
    };

    const messageToSave = {
      message: this.message,
      sender: this.user.username,
      idSender: this.user._id,
      sendTo: this.roomId,
      idRoom: this.roomId,
      idSentTo: this.roomId,
    };

    this.socket.emit('chatMessage', {
      message: this.message,
      sender: this.user.username,
      idSender: this.user._id,
      idRoom: this.roomId,
    });
    try {
      this.cs.saveChatMessages(messageToSave);
      this.message = '';
    } catch (error) {
      console.log(error);
    }
  }

  async getMessages() {
    try {
      this.socket.emit('getMessages', {
        roomId: this.roomId,
        user: this.user,
      });

      this.socket.on('message', (data: any) => {
        console.log(data);
      });
    } catch (error) {}
  }

  async getToken() {
    const userId = await Preferences.get({ key: 'userId' });
    if (userId.value) {
      this.userId = userId.value;
    } else {
      this.userId = '';
    }
    const room = await Preferences.get({ key: 'groupToSee' });
    if (room.value) {
      this.roomId = room.value;
    } else {
      this.roomId = '';
    }
    console.log(this.userId);
  }

  async goBack() {
    this.socket.emit('leaveRoom', {
      roomId: this.roomId,
    });
    this.socket.disconnect();
    await this.navCtrl.navigateRoot('/tabs/discover');
  }

  async ionViewWillEnter() {
    await this.getToken();
    try {
      console.log(this.userId);
      const getUserInfo: any = await this.ss.getUserInfo(this.userId);
      this.user = getUserInfo.user;
      console.log(this.user);
    } catch (error) {
      console.log(error);
    }

    this.socket.connect();
    this.socket.emit('joinRoom', { roomId: this.roomId, user: this.user });
    try {
      const getChatMessages: any = await this.cs.getChatMessages(
        this.roomId,
        this.user
      );
      const messages: MessageInterface[] = getChatMessages.chatMessages;
      this.messages = messages;
    } catch (error) {
      console.log(error);
    }
    this.isloading = true;
  }
  onIonInfinite(ev: Event) {
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      //aqui pones las llamadas a las funciones que quieres actualizar
      this.ionViewWillEnter();
      event.target.complete();
    }, 2000);
  }
}
