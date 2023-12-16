import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { MovieService } from '../../services/movie.services';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';

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
    private ms: MovieService,
    public toastController: ToastController
  ) {}
  series: any = [];
  movies: any = [];
  medias: any = [];
  popularMedia: any = [];
  trendingMedia: any = [];
  hasSession: boolean = false;

  isloading: boolean = false;

  async handleRefresh(event: any) {
    setTimeout(async () => {
      this.isloading = false;
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
      this.isloading = true;
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

    await setTimeout(() => {
      this.isloading = true;
    }, 1500);
  }

  private generateItems() {
    const count = this.series.length + 1;
    const count0 = this.movies.length + 1;
  }
  //controla el scroll
  onIonInfinite(ev: Event) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async getToken() {
    const token = await Preferences.get({ key: 'token' });
    console.log(token);
    if (token.value) {
      return (this.hasSession = true);
    } else {
      return (this.hasSession = false);
    }
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

  async goToMediaDetails(id: number, type: string) {
    const mediaId = id;
    if (type === 'movie') {
      await this.goToMovieDetails(mediaId);
      return;
    }
    if (type === 'tv') {
      await this.goToSerieDetails(mediaId);
      return;
    }
  }

  async goToUser() {
    if (this.hasSession === false) {
      const toast = await this.toastController.create({
        message: 'You must be logged in to see your profile',
        duration: 2000,
      });
      toast.present();
      return;
    }
    const userId: any = await Preferences.get({ key: 'userId' });
    await Preferences.set({
      key: 'userToSee',
      value: userId.value?.toString(),
    });
    this.navCtrl.navigateForward('/tabs/user');
  }
}
