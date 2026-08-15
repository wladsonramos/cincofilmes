export interface MovieSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export interface MovieDetails extends MovieSearchResult {
  imdbRating: string;
}

export interface QualityGoal {
  id: string;
  label: string;
  min: number;
  max: number;
}