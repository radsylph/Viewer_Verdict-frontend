import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular'

@Component({
  selector: 'app-groupchat',
  templateUrl: './groupchat.page.html',
  styleUrls: ['./groupchat.page.scss'],
})
export class GroupchatPage implements OnInit {
  items:any = [];

  ngOnInit() {
    this.generateItems();
  }

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Item ${count + i}`);
    }
  }
  onIonInfinite(ev:Event) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      //aqui pones las llamadas a las funciones que quieres actualizar
      event.target.complete();
    }, 2000);
  }
}
