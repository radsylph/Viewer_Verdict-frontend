import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  MediaInterface,
  MovieInterface,
  SerieInterface,
  GenreInterface,
  ReviewInterface,
} from '../interfaces/main';
import { interval, firstValueFrom } from 'rxjs';
import { serieGenres, movieGenres } from '../utils/MediaGenres';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MovieService {
  private Medias: MediaInterface[] = [];
  private Movies: MovieInterface[] = [];
  private Series: SerieInterface[] = [];
  private apiKey: string = 'a724b82db302a18f04121937ea04afa7';
  private BackenUrl: string =
    'http://localhost:7338' ||
    'https://viewerverdict-backend-production.up.railway.app';

  constructor(private http: HttpClient) {}

  async getPopularMedias() {
    let popularSeries: any = [];
    let popularMovies: any = [];
    let popularMedias: any = {};
    let requests: any = [];
    try {
      for (let page = 1; page <= 2; page++) {
        let request = this.http
          .get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&page=${page}`
          )
          .toPromise()
          .then((data: any) => {
            const Movies: MediaInterface[] = data.results;

            Movies.forEach((movie: any) => {
              const genres: any[] = [];
              movie.genre_ids.forEach((id: number) => {
                const genre = movieGenres.find(
                  (genre: GenreInterface) => genre.id == id
                );
                genres.push(genre);
              });
              const MoviePopular: MediaInterface = {
                title: movie.title,
                overview: movie.overview,
                poster:
                  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                  movie.poster_path,
                idApi: movie.id,
                genres: genres,
              };
              popularMovies.push(MoviePopular);
            });
            requests.push(request);
          });
        await Promise.all(requests);
      }
      console.log(popularMovies);
    } catch (error) {
      console.log(error);
    }
    try {
      for (let page = 1; page <= 2; page++) {
        let request = this.http
          .get(
            `https://api.themoviedb.org/3/tv/popular?api_key=${this.apiKey}&page=${page}`
          )
          .toPromise()
          .then((data: any) => {
            const Series: MediaInterface[] = data.results;

            Series.forEach((serie: any) => {
              const genres: any[] = [];
              serie.genre_ids.forEach((id: number) => {
                const genre = movieGenres.find(
                  (genre: GenreInterface) => genre.id == id
                );
                genres.push(genre);
              });
              const SeriePopular: MediaInterface = {
                name: serie.name,
                overview: serie.overview,
                poster:
                  'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                  serie.poster_path,
                idApi: serie.id,
                genres: genres,
              };
              popularSeries.push(SeriePopular);
            });
            requests.push(request);
          });
        await Promise.all(requests);
      }
    } catch (error) {
      console.log(error);
    }
    popularMedias = {
      series: popularSeries,
      movies: popularMovies,
    };
    return popularMedias;
  }

  async getWeeklyMedias() {
    // const Medias: any = [];
    let requests = [];
    let trendingMedia: any = {};
    let trendingSeries: any = [];
    let trendingMovies: any = [];
    let test: any = [];
    try {
      for (let page = 1; page <= 10; page++) {
        let request = this.http
          .get(
            `https://api.themoviedb.org/3/trending/all/week?api_key=${this.apiKey}&page=${page}`
          )
          .toPromise()
          .then((data: any) => {
            const Medias: any = data.results;
            Medias.forEach((media: any) => {
              if (media.media_type == 'movie') {
                const genres: any[] = [];
                media.genre_ids.forEach((id: number) => {
                  const genre = movieGenres.find(
                    (genre: GenreInterface) => genre.id == id
                  );
                  genres.push(genre);
                });

                const MovieTrending: MediaInterface = {
                  title: media.title,
                  overview: media.overview,
                  poster:
                    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                    media.poster_path,
                  idApi: media.id,
                  type: media.media_type,
                  genres: genres,
                };
                // trendingMovies.push(MovieTrending);
                test.push(MovieTrending);
              } else if (media.media_type == 'tv') {
                const genres: any[] = [];
                media.genre_ids.forEach((id: number) => {
                  const genre = serieGenres.find(
                    (genre: GenreInterface) => genre.id == id
                  );
                  genres.push(genre);
                });

                const SerieTrending: MediaInterface = {
                  name: media.name,
                  overview: media.overview,
                  poster:
                    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                    media.poster_path,
                  idApi: media.id,
                  type: media.media_type,
                  genres: genres,
                };
                //trendingSeries.push(SerieTrending);
                test.push(SerieTrending);
              }
            });
            trendingMedia = {
              series: trendingSeries,
              movies: trendingMovies,
            };
          });
        requests.push(request);
      }
      await Promise.all(requests);
      return test;
    } catch (error) {
      console.log(error);
    }
  }

  async getMovieDetails(id: number): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.http.get(`${this.BackenUrl}/media/movie/${id}`).subscribe(
          (data: any) => {
            const movie: MovieInterface = data;
            resolve(movie);
          },
          (error) => {
            reject(error);
          }
        );
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async getSerieDetails(id: number): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.http.get(`${this.BackenUrl}/media/serie/${id}`).subscribe(
          (data: any) => {
            const serie: SerieInterface = data;
            resolve(serie);
          },
          (error) => {
            reject(error);
          }
        );
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async reviewMovie(review: ReviewInterface, movieId: number): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        console.log(review);
        console.log(movieId);
        this.http
          .post(`${this.BackenUrl}/media/movie/${movieId}/review`, {
            review: review.review,
            rating: review.rating,
          })
          .subscribe(
            (data: any) => {
              console.log(data);
              resolve(data);
            },
            (error) => {
              console.log(error);

              reject(error);
            }
          );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async editMovieReview(
    review: ReviewInterface,
    movieId: number
  ): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.http
          .put(`${this.BackenUrl}/media/movie/${movieId}/review`, {
            review: review.review,
            rating: review.rating,
          })
          .subscribe(
            (data: any) => {
              resolve(data);
            },
            (error) => {
              reject(error);
            }
          );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async reviewSerie(review: ReviewInterface, serieId: number) {
    try {
      return new Promise((resolve, reject) => {
        console.log(review);
        console.log(serieId);
        this.http
          .post(`${this.BackenUrl}/media/serie/${serieId}/review`, {
            review: review.review,
            rating: review.rating,
          })
          .subscribe(
            (data: any) => {
              console.log(data);
              resolve(data);
            },
            (error) => {
              reject(error);
            }
          );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async editSerieReview(review: ReviewInterface, serieId: number) {
    try {
      return new Promise((resolve, reject) => {
        this.http
          .put(`${this.BackenUrl}/media/serie/${serieId}/review`, {
            review: review.review,
            rating: review.rating,
          })
          .subscribe(
            (data: any) => {
              resolve(data);
            },
            (error) => {
              reject(error);
            }
          );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async replyReview(
    review: ReviewInterface,
    reviewId: number,
    ownerToReply: string
  ) {
    try {
      return new Promise((resolve, reject) => {
        console.log(review.review);
        this.http
          .post(`${this.BackenUrl}/media/review/${reviewId}`, {
            comment: review.review,
            reply: ownerToReply,
          })
          .subscribe(
            (data: any) => {
              console.log(data);
              resolve(data);
            },
            (error) => {
              reject(error);
            }
          );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async editReply(review: ReviewInterface, reviewId: number) {
    try {
      return new Promise((resolve, reject) => {
        this.http
          .put(`${this.BackenUrl}/media/response/${reviewId}`, {
            comment: review.review,
          })
          .subscribe(
            (data: any) => {
              resolve(data);
            },
            (error) => {
              reject(error);
            }
          );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
