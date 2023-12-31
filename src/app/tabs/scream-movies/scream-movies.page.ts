import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { MovieService } from '../../services/movie.services';
import { Preferences } from '@capacitor/preferences';
import { MovieInterface } from 'src/app/interfaces/movie.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-scream-movies',
  templateUrl: './scream-movies.page.html',
  styleUrls: ['./scream-movies.page.scss'],
})
export class ScreamMoviesPage implements OnInit {
  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private ms: MovieService,
    private sanitizer: DomSanitizer,
    public modalController: ModalController
  ) {}
  private movieId: any = '';
  public trailers: String[] = [];
  public movieDetails: MovieInterface = {
    title: '',
    overview: '',
    tagline: '',
    genres: [],
    posters: [],
    releaseDate: '',
    trailers: [],
    runtime: 0,
    publicVoteAverage: 0,
    publicVoteCount: 0,
    publicVoteTotalPoints: 0,
    criticVoteAverage: 0,
    criticVoteCount: 0,
    criticVoteTotalPoints: 0,
    adult: false,
    language: '',
  };
  public audienceReviews: any = [];
  public criticReviews: any = [];

  public testposter: any = '';
  public hasTrailer: boolean = false;
  public isloading: boolean = false;

  items: any = [];
  itemsVideo: any = [];

  getVideoUrl2(url: string): SafeResourceUrl {
    const videoId = url.split('v=')[1];
    const embedUrl = 'https://www.youtube.com/embed/' + videoId;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  openvideo(url: SafeResourceUrl) {
    window.open(url as string, '_blank');
  }

  async ionViewWillEnter() {
    this.isloading = false;
    this.movieDetails = {
      title: '',
      overview: '',
      tagline: '',
      genres: [],
      posters: [],
      releaseDate: '',
      trailers: [],
      runtime: 0,
      publicVoteAverage: 0,
      publicVoteCount: 0,
      publicVoteTotalPoints: 0,
      criticVoteAverage: 0,
      criticVoteCount: 0,
      criticVoteTotalPoints: 0,
      adult: false,
      language: '',
    };
    await Preferences.get({ key: 'movieId' }).then((data: any) => {
      this.movieId = data.value;
    });
    console.log(this.movieId);
    const movieDetailsFromDb = await this.ms.getMovieDetails(this.movieId);

    this.movieDetails = movieDetailsFromDb.movie;
    this.audienceReviews = movieDetailsFromDb.publicReviews;
    this.criticReviews = movieDetailsFromDb.criticReviews;
    console.log(this.audienceReviews);
    console.log(this.criticReviews);
    if (this.movieDetails.trailers.length > 0) {
      this.hasTrailer = true;
    }
    await setTimeout(() => {
      this.isloading = true;
    }, 2000);
  }
  async gotToDiscover() {
    this.navCtrl.navigateBack('/tabs/discover');
  }

  async ngOnInit() {}

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
