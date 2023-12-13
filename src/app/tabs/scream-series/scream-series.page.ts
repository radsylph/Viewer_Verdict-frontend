import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { MovieService } from '../../services/movie.services';
import { Preferences } from '@capacitor/preferences';
import { SerieInterface } from 'src/app/interfaces/main';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-scream-series',
  templateUrl: './scream-series.page.html',
  styleUrls: ['./scream-series.page.scss'],
})
export class ScreamSeriesPage implements OnInit {
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
  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private ms: MovieService,
    private sanitizer: DomSanitizer
  ) {}

  handleRefresh(event: any) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 2000);
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
    console.log(this.serieId);
    const serieFromDb = await this.ms.getSerieDetails(this.serieId);

    this.serieDetails = serieFromDb.serie;
    console.log(this.serieDetails);
    console.log('test');
    await setTimeout(() => {
      this.isloading = true;
    }, 2000);
  }

  async gotToDiscover() {
    this.navCtrl.navigateBack('/tabs/discover');
  }
  ngOnInit() {
    for (let i = 1; i < 9; i++) {
      this.items.push(`${i}`);
    }
    for (let i = 1; i < 4; i++) {
      this.itemsVideo.push(`${i}`);
    }
    for (let i = 1; i < 7; i++) {
      this.itemsSeasons.push(`${i}`);
    }
    console.log(this.data);
  }

  stars: number[] = [1, 2, 3, 4, 5];

  selectedValue: number = 0;
  isMouseover = true;

  public data: any;

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
    this.isModalRating = isOpen;
  }

  getVideoUrl2(url: string): SafeResourceUrl {
    const videoId = url.split('v=')[1];
    const embedUrl = 'https://www.youtube.com/embed/' + videoId;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  //counting stars
  countStar(star: number) {
    this.isMouseover = false;
    this.selectedValue = star;
    this.data = this.selectedValue;
    console.log(this.data);
  }

  //for adding star

  addClass(star: number) {
    if (this.isMouseover) {
      this.selectedValue = star;
      console.log(this.selectedValue);
    }
  }

  //for removing star
  removeClass() {
    if (this.isMouseover) {
      this.selectedValue = 0;
      console.log(this.selectedValue);
    }
  }
}
