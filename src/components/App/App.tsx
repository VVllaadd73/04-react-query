// App.tsx

// React хуки
import { useEffect, useState } from 'react';

// Головний хук для роботи з серверним станом
import { useQuery, keepPreviousData } from '@tanstack/react-query';

// Функція запиту до API (TMDB або іншого)
import { fetchMovies } from '../../services/movieService';

// Компонент пагінації
import ReactPaginate from 'react-paginate';

// Toast-нотифікації
import toast, { Toaster } from 'react-hot-toast';

// UI компоненти
import Loader from '../Loader/Loader';
import SearchBar from '../SearchBar/SearchBar';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';

// Тип одного фільму
import type { Movie } from '../../types/movie';

// Тип відповіді від API
interface MovieResponse {
   results: Movie[]; // масив фільмів
   total_pages: number; // загальна кількість сторінок
}

// CSS module
import css from './App.module.css';

export default function App() {
   // 🔹 Стан для модального вікна (який фільм відкритий)
   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

   // 🔹 Поточна сторінка пагінації
   const [page, setPage] = useState(1);

   // 🔹 Пошуковий запит
   const [query, setQuery] = useState('');

   /**
    * 🔹 useQuery — отримує фільми з сервера
    *
    * queryKey:
    *   Унікальний ключ кешу
    *   При зміні query або page — автоматично новий запит
    *
    * queryFn:
    *   Функція, яка виконує HTTP-запит
    *
    * enabled:
    *   Якщо false — запит НЕ виконується
    *   Тут: запит виконується тільки якщо query не пустий
    *
    * placeholderData:
    *   keepPreviousData — показує попередні дані,
    *   поки вантажиться нова сторінка (плавна пагінація)
    */
   const { data, isLoading, isError, isSuccess } = useQuery<MovieResponse>({
      queryKey: ['movies', query, page],
      queryFn: () => fetchMovies(query, page),
      enabled: query.length > 0,
      placeholderData: keepPreviousData,
   });

   /**
    * 🔹 Побічний ефект
    * Показує toast, якщо:
    * - запит успішний
    * - але фільмів не знайдено
    */
   useEffect(() => {
      if (isSuccess && data?.results.length === 0) {
         toast('No movies found for your request.');
      }
   }, [isSuccess, data]);

   /**
    * 🔹 Викликається з SearchBar
    * Коли користувач вводить новий пошуковий запит
    */
   function onFound(query: string) {
      setQuery(query); // запускає новий useQuery
      setPage(1); // скидаємо сторінку на першу
   }

   // 🔹 Безпечне отримання даних
   const movies = data?.results || [];
   const totalPages = data?.total_pages || 0;

   return (
      <>
         {/* 🔍 Поле пошуку */}
         <SearchBar onSubmit={onFound} />

         {/* ⏳ Лоадер під час запиту */}
         {isLoading && <Loader />}

         {/* 📄 Пагінація показується тільки якщо є фільми */}
         {isSuccess && movies.length > 0 && totalPages > 1 && (
            <ReactPaginate
               pageCount={totalPages} // скільки всього сторінок
               pageRangeDisplayed={5} // скільки сторінок показати
               marginPagesDisplayed={1}
               onPageChange={
                  ({ selected }) => setPage(selected + 1) // selected починається з 0
               }
               forcePage={page - 1} // синхронізація зі state
               containerClassName={css.pagination}
               activeClassName={css.active}
               nextLabel="→"
               previousLabel="←"
            />
         )}

         {/* 🎬 Сітка фільмів */}
         {!isLoading && !isError && (
            <MovieGrid
               movies={movies}
               onSelect={setSelectedMovie} // відкриває модалку
            />
         )}

         {/* ❌ Помилка запиту */}
         {isError && <ErrorMessage />}

         {/* 🔔 Toast container */}
         <Toaster />

         {/* 🎥 Модальне вікно з деталями фільму */}
         {selectedMovie && (
            <MovieModal
               movie={selectedMovie}
               onClose={() => setSelectedMovie(null)}
            />
         )}
      </>
   );
}
