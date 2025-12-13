// App.tsx

import { useState } from "react";
import { fetchMovies } from "../../services/movieService";
import Loader from "../Loader/Loader";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";

export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function onFound(query: string) {
        setLoading(true);
        setError(false);

        try {
            const response = await fetchMovies(query);
            if (!response.length) {
                toast.error("No movies found for your request.");
            }
            setMovies(response);
            console.log(response);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <SearchBar onSubmit={onFound} />
            {loading && <Loader />}
            {!loading && !error && (
                <MovieGrid movies={movies} onSelect={setSelectedMovie} />
            )}
            {error && <ErrorMessage />}
            <Toaster />
            {selectedMovie && (
                <MovieModal
                    onClose={() => setSelectedMovie(null)}
                    movie={selectedMovie}
                />
            )}
        </>
    );
}
