import { Component, OnInit } from '@angular/core';

import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  items: any = [];
  items0: any = [];
  public counter: number = 0;

  ngOnInit() {
    this.generateItems();
  }

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Item ${count + i}`);
    }

    for (let i = 1; i < 10; i++) {
      this.items0.push(`Item ${i}`);
    }
  }

  cameo() {
    this.counter++;
    console.log('cameo');
    console.log(this.counter);

    if (this.counter === 5) {
      let audio = new Audio();
      audio.src = 'assets/cameo.mp3';
      audio.load();
      audio.play();
    } else if (this.counter === 10) {
      let audio2 = new Audio();
      audio2.src = 'assets/cameo2.mp3';
      audio2.load();
      audio2.play();
      this.counter = 0; // resetea el contador después de reproducir el segundo audio
    }
  }
  onIonInfinite(ev: Event) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
