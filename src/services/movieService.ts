// movieServices.ts

import axios from "axios";

import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

interface moviesResponse {
    results: Movie[];
}

export async function fetchMovies(query: string): Promise<Movie[]> {
    const configData = {
        params: { query },
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
    };

    const response = await axios.get<moviesResponse>(BASE_URL, configData);

    return response.data.results;
}
