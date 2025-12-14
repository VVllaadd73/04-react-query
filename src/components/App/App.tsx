// App.tsx

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../../services/movieService';
import ReactPaginate from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';

import Loader from '../Loader/Loader';
import SearchBar from '../SearchBar/SearchBar';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import type { Movie } from '../../types/movie';

interface MovieResponse {
   results: Movie[];
   total_pages: number;
}
import css from './App.module.css';
import { keepPreviousData } from '@tanstack/react-query';

export default function App() {
   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
   const [page, setPage] = useState(1);
   const [query, setQuery] = useState('');

   const { data, isLoading, isError, isSuccess } = useQuery<MovieResponse>({
      queryKey: ['movies', query, page],
      queryFn: () => fetchMovies(query, page),
      enabled: query.length > 0,
      placeholderData: keepPreviousData,
   });

   useEffect(() => {
      if (isSuccess && data?.results.length === 0) {
         toast('No movies found for your request.');
      }
   }, [isSuccess, data]);

   async function onFound(query: string) {
      setQuery(query);
      setPage(1);
   }

   const movies = data?.results || [];
   const totalPages = data?.total_pages || 0;

   return (
      <>
         <SearchBar onSubmit={onFound} />
         {isLoading && <Loader />}
         {isSuccess && movies.length > 0 && (
            <ReactPaginate
               pageCount={totalPages}
               pageRangeDisplayed={5}
               marginPagesDisplayed={1}
               onPageChange={({ selected }) => setPage(selected + 1)}
               forcePage={page - 1}
               containerClassName={css.pagination}
               activeClassName={css.active}
               nextLabel="→"
               previousLabel="←"
            />
         )}
         {!isLoading && !isError && (
            <MovieGrid movies={movies} onSelect={setSelectedMovie} />
         )}
         {isError && <ErrorMessage />}
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
