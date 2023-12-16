import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { mediaGenres } from 'src/app/utils/MediaGenres';
import { ViewWillEnter } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { MovieService } from 'src/app/services/movie.services';
import { MediaInterface } from 'src/app/interfaces/main';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.page.html',
  styleUrls: ['./catalogue.page.scss'],
})
export class CataloguePage implements OnInit {
  items: any = [];
  genres: any = [];
  medias: MediaInterface[] = [];
  public mediaName: string = '';

  ngOnInit(): void {}

  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public ms: MovieService,
    public navCtrl: NavController
  ) {}

  selectedGenres: any[] = [];
  selectedType: any = '';
  selectedDate: any = '';
  selectedPopularity: any = 0;
  isloading: boolean = false;

  async getMedias() {
    try {
      const mediasFromDb: any = await this.ms.getMedias();
      console.log(mediasFromDb);
      const medias = mediasFromDb.medias;
      console.log(medias);
      this.medias = medias;
    } catch (error: any) {
      console.log(error);
    }
  }

  handleYearChange(event: any) {
    const year = event.detail.value;
    const formattedYear = new Date(year).toISOString().slice(0, 10);
    this.selectedDate = formattedYear;
    console.log(formattedYear);
  }

  async ionViewWillEnter() {
    // this.generateItems();
    this.isloading = false;
    this.genres = mediaGenres;
    this.selectedGenres = [];
    this.selectedType = '';
    this.selectedDate = '';
    this.selectedPopularity = 0;
    console.log(this.genres);
    await this.getMedias();
    this.isloading = true;
  }

  async handleRefresh(event: any) {
    setTimeout(async () => {
      await this.ionViewWillEnter();
      setTimeout(() => {
        this.isloading = true;
      }, 500);
      event.target.complete();
    }, 2000);
  }

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Item ${count + i}`);
    }
  }

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

  async goToMediaDetails(id: number, type: any) {
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

  customPopoverOptions = {
    header: 'Hair Color',
    subHeader: 'Select your hair color',
    message: 'Only select your dominant hair color',
  };

  foods = [
    {
      id: 1,
      name: 'Apples',
      type: 'fruit',
    },
    {
      id: 2,
      name: 'Carrots',
      type: 'vegetable',
    },
    {
      id: 3,
      name: 'Cupcakes',
      type: 'dessert',
    },
  ];

  popularityOptions = [
    {
      name: 'most know',
    },
    {
      name: 'least know',
    },
  ];

  typeOptions = [
    {
      name: 'tv',
    },
    {
      name: 'movie',
    },
  ];

  compareWith(o1: any, o2: any) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((o) => o.id === o1.id);
    }

    return o1.id === o2.id;
  }

  async searchMedias(name: string) {
    this.isloading = false;
    console.log(name);
    try {
      this.ms.searchMedias(name).then((res: any) => {
        console.log(res.media);
        this.medias = res.media;
        this.isloading = true;
        this.mediaName = '';
      });
    } catch (error) {
      console.log(error);
      this.isloading = true;
    }
  }

  async handleChange(event: any, type: string) {
    // await this.getMedias();
    switch (type) {
      case 'genre':
        if (event.detail.value.length === 0) {
          this.getMedias();
          break;
        }
        this.selectedGenres = event.detail.value;
        console.log(this.selectedGenres);
        this.medias = this.medias.filter((media: any) => {
          return media.genres.some((genre: any) =>
            this.selectedGenres.some((selectedGenre) => selectedGenre === genre)
          );
        });
        break;
      case 'type':
        if (event.detail.value.length === '') {
          this.getMedias();
          break;
        }
        this.selectedType = event.detail.value.name;
        console.log(this.selectedType);
        this.medias = this.medias.filter(
          (media: any) => media.type === this.selectedType
        );
        console.log(this.medias);
        this.selectedType = '';
        break;
      case 'popularity':
        if (event.detail.value.length === '') {
          this.getMedias();
          break;
        }
        console.log(event.detail.value);
        this.selectedPopularity = event.detail.value.name;
        console.log(this.selectedPopularity);
        if (this.selectedPopularity === 'least know') {
          this.medias = this.medias.sort((a: any, b: any) => {
            return a.popularity - b.popularity;
          });
        } else {
          this.medias = this.medias.sort((a: any, b: any) => {
            return b.popularity - a.popularity;
          });
        }
        console.log(this.medias);
        this.selectedPopularity = '';
        break;
      case 'date':
        if (event.detail.value.length === '') {
          this.getMedias();
          break;
        }
        const selectedYear = new Date(event.detail.value).getFullYear();
        console.log(selectedYear);
        this.selectedDate = selectedYear;
        this.medias = this.medias.filter((media: any) => {
          const mediaYear = new Date(media.releaseDate).getFullYear();
          return mediaYear === selectedYear;
        });

        console.log(this.medias);
        this.selectedDate = '';
        break;
    }
  }
  async filterByName(event: any) {
    const name = event.detail.value;
    console.log(name);
    this.medias = this.medias.filter((media: any) => {
      return media.title.toLowerCase().includes(name.toLowerCase());
    });
  }
}
