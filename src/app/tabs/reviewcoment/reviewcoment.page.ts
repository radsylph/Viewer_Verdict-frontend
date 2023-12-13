import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reviewcoment',
  templateUrl: './reviewcoment.page.html',
  styleUrls: ['./reviewcoment.page.scss'],
})
export class ReviewcomentPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      //aqui pones las llamadas a las funciones que quieres actualizar
      event.target.complete();
    }, 2000);
  }
}
