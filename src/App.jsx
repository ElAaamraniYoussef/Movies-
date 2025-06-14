import './App.css'
import { useEffect , useState } from 'react';
import Search from './components/Search.jsx'
 
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json', 
    Authorization: `Bearer ${API_KEY}`
  }
}


const initialState = '';
const App = () => {
  const [searchTerm, setSearchTerm] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

 const fetchMovies = async () => {
  setIsLoading(true);
  setErrorMessage('');
  try {
    const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response = await fetch(endpoint, API_OPTIONS);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const data = await response.json();
   if (data.Response === 'False') {
      setErrorMessage(data.Error || 'Failed to fetch movies');
      setMovieList([]);
      return;
    }
    setMovieList(data.results || []);
   
  } catch (error) {
    console.error(`Error fetching movies : ${error}`);
    setErrorMessage('Error fetching movies. Please try again later.');
  }finally {
    setIsLoading(false);  }
} 
useEffect(() => {
    fetchMovies();
  }, []);


  return (
    <main>
      <div className='pattern'>
        <div className='wrapper'>
          <header>
            <img src="./hero.png" alt="Hero banner" />
            <h2>find <span className='text-gradient'>Movies</span> you'll love without the hassle</h2>
       <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />   
        </header>
         
      <section className='all-movies'>
          <h2>All Movies</h2>
      {isLoading ? (
        <p className='text-center'>Loading...</p>
      ) : (
        <ul className='movie-list'>
          {movieList.map((movie) => (
            <li key={movie.id} className='movie-card'>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
            </li>
          ))}
        </ul>
      )}
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      </section>
        </div>

      </div>
      
        <div>

    </div>
       </main>
  )
}

export default App










// import { useEffect, useState } from 'react'
// import Search from './components/Search.jsx'
// import Spinner from './components/Spinner.jsx'
// import MovieCard from './components/MovieCard.jsx'
// import { useDebounce } from 'react-use'
// import { getTrendingMovies, updateSearchCount } from './appwrite.js'

// const API_BASE_URL = 'https://api.themoviedb.org/3';

// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// const API_OPTIONS = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: `Bearer ${API_KEY}`
//   }
// }

// const App = () => {
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
//   const [searchTerm, setSearchTerm] = useState('');

//   const [movieList, setMovieList] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const [trendingMovies, setTrendingMovies] = useState([]);

//   // Debounce the search term to prevent making too many API requests
//   // by waiting for the user to stop typing for 500ms
//   useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

//   const fetchMovies = async (query = '') => {
//     setIsLoading(true);
//     setErrorMessage('');

//     try {
//       const endpoint = query
//         ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
//         : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

//       const response = await fetch(endpoint, API_OPTIONS);

//       if(!response.ok) {
//         throw new Error('Failed to fetch movies');
//       }

//       const data = await response.json();

//       if(data.Response === 'False') {
//         setErrorMessage(data.Error || 'Failed to fetch movies');
//         setMovieList([]);
//         return;
//       }

//       setMovieList(data.results || []);

//       if(query && data.results.length > 0) {
//         await updateSearchCount(query, data.results[0]);
//       }
//     } catch (error) {
//       console.error(`Error fetching movies: ${error}`);
//       setErrorMessage('Error fetching movies. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   const loadTrendingMovies = async () => {
//     try {
//       const movies = await getTrendingMovies();

//       setTrendingMovies(movies);
//     } catch (error) {
//       console.error(`Error fetching trending movies: ${error}`);
//     }
//   }

//   useEffect(() => {
//     fetchMovies(debouncedSearchTerm);
//   }, [debouncedSearchTerm]);

//   useEffect(() => {
//     loadTrendingMovies();
//   }, []);

//   return (
//     <main>
//       <div className="pattern"/>

//       <div className="wrapper">
//         <header>
//           <img src="./hero.png" alt="Hero Banner" />
//           <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

//           <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//         </header>

//         {trendingMovies.length > 0 && (
//           <section className="trending">
//             <h2>Trending Movies</h2>

//             <ul>
//               {trendingMovies.map((movie, index) => (
//                 <li key={movie.$id}>
//                   <p>{index + 1}</p>
//                   <img src={movie.poster_url} alt={movie.title} />
//                 </li>
//               ))}
//             </ul>
//           </section>
//         )}

//         <section className="all-movies">
//           <h2>All Movies</h2>

//           {isLoading ? (
//             <Spinner />
//           ) : errorMessage ? (
//             <p className="text-red-500">{errorMessage}</p>
//           ) : (
//             <ul>
//               {movieList.map((movie) => (
//                 <MovieCard key={movie.id} movie={movie} />
//               ))}
//             </ul>
//           )}
//         </section>
//       </div>
//     </main>
//   )
// }

// export default App