// movieServices.ts

import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';
const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

export interface MoviesResponse {
   results: Movie[];
   total_pages: number;
}

export async function fetchMovies(
   query: string,
   page: number
): Promise<MoviesResponse> {
   const response = await axios.get<MoviesResponse>(BASE_URL, {
      params: { query, page },
      headers: {
         accept: 'application/json',
         Authorization: `Bearer ${API_KEY}`,
      },
   });

   return response.data;
}
