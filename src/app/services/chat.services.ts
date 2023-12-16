import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatInterface, MessageInterface } from '../interfaces/main';
import { ReplaySubject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable()
export class ChatService {
  private socket: any;
  private BackenUrl: string =
    'https://viewerverdict-backend-production.up.railway.app';
  // 'http://localhost:7338' || ;
  private messages = new ReplaySubject<MessageInterface[]>(1);

  constructor(private http: HttpClient) {}

  async getChatMessages(idRoom: string, participants: string[]) {
    const data = { idRoom, participants };
    console.log(data);
    try {
      return new Promise((resolve, reject) => {
        this.http
          .post(`${this.BackenUrl}/chat/getChatMessages/${idRoom}`, {
            participants,
          })
          .subscribe(
            (data: any) => {
              console.log(data);
              resolve(data);
            },
            (error) => {
              reject(error);
            }
          );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async saveChatMessages(messages: MessageInterface) {
    console.log(messages);
    const { idRoom } = messages;
    try {
      return new Promise((resolve, reject) => {
        this.http
          .post(`${this.BackenUrl}/chat/saveChatMessages/${idRoom}`, messages)
          .subscribe(
            (data: any) => {
              console.log(data);
              resolve(data);
            },
            (error) => {
              console.log(error);
              reject(error);
            }
          );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
