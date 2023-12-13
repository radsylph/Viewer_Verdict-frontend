export interface MovieInterface {
  title: string;
  overview: string;
  tagline: string;
  genres: string[];
  posters: string[];
  releaseDate: string;
  trailers: string[];
  runtime: number;
  publicVoteAverage?: number;
  publicVoteCount?: number;
  publicVoteTotalPoints?: number;
  criticVoteAverage?: number;
  criticVoteCount?: number;
  criticVoteTotalPoints?: number;
  adult: boolean;
  language: string;
  media_type?: string;
  poster_path?: string;
  backdrop_path?: string;
  idApi?: number;
}
