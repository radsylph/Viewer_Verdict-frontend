export interface SerieInterface {
    idApi: number;
    name: string;
    overview: string;
    tagline: string;
    posters: string[];
    firstAir: string;
    lastAir: string;
    totalEpisodes: number;
    totalSeasons: number;
    genres: string[];
    trailers: string[];
    status: string;
    voteAverage?: number;
    voteCount?: number;
  }
  