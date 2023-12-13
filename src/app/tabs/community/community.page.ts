import { Component, OnInit } from '@angular/core';
  import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  items:any = [];

  ngOnInit() {
    for (let i = 1; i < 6; i++) {
      this.items.push(`Item ${i}`);
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      //aqui pones las llamadas a las funciones que quieres actualizar
      event.target.complete();
    }, 2000);
  }
}
