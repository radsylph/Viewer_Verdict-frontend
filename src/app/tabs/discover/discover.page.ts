import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { MovieService } from '../../services/movie.services';
import { Preferences } from '@capacitor/preferences';

import { InfiniteScrollCustomEvent } from '@ionic/angular';
@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private ms: MovieService
  ) {}
  series: any = [];
  movies: any = [];
  medias: any = [];
  popularMedia: any = [];
  trendingMedia: any = [];

  async handleRefresh(event: any) {
    setTimeout(async () => {
      // Llamada a la función para actualizar los datos
      this.popularMedia = await this.ms.getPopularMedias();
      this.trendingMedia = await this.ms.getWeeklyMedias();

      this.series = [];
      this.movies = [];
      this.medias = [];

      this.medias = this.trendingMedia;
      this.popularMedia.series.forEach((serie: any) => {
        this.series.push(serie);
      });
      this.popularMedia.movies.forEach((movie: any) => {
        this.movies.push(movie);
      });

      event.target.complete();
    }, 2000);
  }

  async ngOnInit() {
    this.popularMedia = await this.ms.getPopularMedias();
    this.trendingMedia = await this.ms.getWeeklyMedias();
    this.generateItems();

    this.popularMedia.series.forEach((serie: any) => {
      this.series.push(serie);
    });
    this.popularMedia.movies.forEach((movie: any) => {
      this.movies.push(movie);
    });
    this.medias = this.trendingMedia;
  }

  private generateItems() {
    const count = this.series.length + 1;
    const count0 = this.movies.length + 1;
    // for (let i = 0; i < 8; i++) {
    //   this.series.push(`Item ${count + i}`);
    // }

    // for (let i = 0; i < 8; i++) {
    //   this.movies.push(`Item ${count0 + i}`);
    // }
  }
  //controla el scroll
  onIonInfinite(ev: Event) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async goToMovieDetails(id: number) {
    const movieId = id;
    await Preferences.set({
      key: 'movieId',
      value: movieId.toString(),
    });
    console.log(await Preferences.get({ key: 'movieId' }));
    this.navCtrl.navigateForward(`/tabs/scream-movies`);
    this.ngOnInit;
  }

  async goToSerieDetails(id: number) {
    const serieId = id;
    await Preferences.set({
      key: 'serieId',
      value: serieId.toString(),
    });
    this.navCtrl.navigateForward('/tabs/scream-series');
  }
}
