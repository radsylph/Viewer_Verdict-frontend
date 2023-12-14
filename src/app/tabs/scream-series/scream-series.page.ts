import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { MovieService } from '../../services/movie.services';
import { Preferences } from '@capacitor/preferences';
import { SerieInterface, ReviewInterface } from 'src/app/interfaces/main';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-scream-series',
  templateUrl: './scream-series.page.html',
  styleUrls: ['./scream-series.page.scss'],
})
export class ScreamSeriesPage implements OnInit {
  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private ms: MovieService,
    private sanitizer: DomSanitizer,
    public modalController: ModalController,
    private message: ToastController,
    private alert: AlertController
  ) {}

  items: any = [];
  itemsVideo: any = [];
  itemsSeasons: any = [];
  public serieId: any = '';
  public isloading: boolean = false;
  public serieDetails: any = {
    idApi: 0,
    name: '',
    overview: '',
    tagline: '',
    posters: [],
    firstAir: '',
    lastAir: '',
    totalEpisodes: 0,
    totalSeasons: 0,
    genres: [],
    trailers: [],
    status: '',
    voteAverage: 0,
    voteCount: 0,
  };

  public review: ReviewInterface = {
    owner: '',
    mediaId: '',
    rating: 0,
    review: '',
    edited: false,
    type: '',
    isComment: false,
  };

  public audienceReviews: any = [];
  public criticReviews: any = [];
  public data: any = 0;
  public hasSession: boolean = false;

  handleRefresh(event: any) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 2000);
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

  async ionViewWillEnter() {
    this.isloading = false;
    this.serieDetails = {
      idApi: 0,
      name: '',
      overview: '',
      tagline: '',
      posters: [],
      firstAir: '',
      lastAir: '',
      totalEpisodes: 0,
      totalSeasons: 0,
      genres: [],
      trailers: [],
      status: '',
      voteAverage: 0,
      voteCount: 0,
    };
    await Preferences.get({ key: 'serieId' }).then((data: any) => {
      this.serieId = data.value;
    });
    await this.getToken();
    const serieFromDb = await this.ms.getSerieDetails(this.serieId);
    console.log(serieFromDb);
    this.serieDetails = serieFromDb.serie;
    this.criticReviews = serieFromDb.criticReviews;
    this.audienceReviews = serieFromDb.publicReviews;
    console.log('test');
    await setTimeout(() => {
      this.isloading = true;
    }, 2000);
  }

  async createMessage(Message: string) {
    const newMessage = await this.message.create({
      message: Message,
      duration: 2000,
      position: 'bottom',
    });
    await newMessage.present();
  }

  async gotToDiscover() {
    this.navCtrl.navigateBack('/tabs/discover');
  }
  ngOnInit() {}

  stars: number[] = [1, 2, 3, 4, 5];

  selectedValue: number = 0;
  isMouseover = true;

  //control del modal
  isModalRating = false;
  isModalAudience = false;
  isModalCritics = false;

  setOpenAudience(isOpen: boolean) {
    this.isModalAudience = isOpen;
  }

  setOpenCritics(isOpen: boolean) {
    this.isModalCritics = isOpen;
  }

  setOpenRating(isOpen: boolean) {
    console.log(this.hasSession);
    if (this.hasSession === true) {
      this.isModalRating = isOpen;
    } else if (this.hasSession === false) {
      console.log('no hay sesion');
      this.createMessage('You need to be logged in to rate a movie');
    }
  }

  getVideoUrl2(url: string): SafeResourceUrl {
    const videoId = url.split('v=')[1];
    const embedUrl = 'https://www.youtube.com/embed/' + videoId;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  async createReview() {
    this.review.mediaId = this.serieId;
    console.log(this.review);
    if (this.review.review == '' || this.review.rating === 0) {
      this.alert
        .create({
          header: 'Error',
          message: 'Please fill all the fields',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }
    try {
      await this.ms.reviewSerie(this.review, this.serieId);
      this.createMessage('Review created successfully');
      this.ionViewWillEnter();
      this.setOpenRating(false);
    } catch (error: any) {
      console.log(error);
      this.alert
        .create({
          header: 'Error',
          message: error.error.msg,
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
    }
  }

  countStar(star: number) {
    this.isMouseover = false;
    this.selectedValue = star;
    this.data = this.selectedValue;
    console.log(this.data);
    this.review.rating = this.data;
  }

  addClass(star: number) {
    if (this.isMouseover) {
      this.selectedValue = star;
      console.log(this.selectedValue);
    }
  }

  removeClass() {
    if (this.isMouseover) {
      this.selectedValue = 0;
      console.log(this.selectedValue);
    }
  }
}
