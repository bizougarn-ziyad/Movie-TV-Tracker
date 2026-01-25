import { useState, useEffect } from 'react';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const OMDB_API_KEY = '3ccd7753'; // Replace with your actual OMDB API key

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const movieTitles = ['Inception', 'Interstellar', 'The Dark Knight', 'Pulp Fiction', 'Forrest Gump', 'The Shawshank Redemption', 'The Matrix', 'Avatar', 'Titanic', 'Gladiator'];
        
        const fetchPromises = movieTitles.map(title =>
          fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&type=movie`)
            .then(res => res.json())
        );

        const results = await Promise.all(fetchPromises);
        const validMovies = results.filter(movie => movie.Response === 'True');
        setMovies(validMovies);
        setError(null);
      } catch (err) {
        setError('Failed to fetch movies. Please check your API key.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-white text-2xl">Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-red-500 text-2xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-white">
        Movie Tracker 🎬
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {movies.map((movie, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
            {/* Poster */}
            <div className="h-64 overflow-hidden bg-gray-700">
              {movie.Poster && movie.Poster !== 'N/A' ? (
                <img 
                  src={movie.Poster} 
                  alt={movie.Title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Poster
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {movie.Title}
              </h2>
              
              {/* Rating */}
              <div className="mb-3">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Rating:</span> {' '}
                  <span className="text-yellow-400 font-bold">
                    {movie.imdbRating !== 'N/A' ? movie.imdbRating : 'N/A'} / 10
                  </span>
                </p>
              </div>
              
              {/* Description (Plot) */}
              <p className="text-sm text-gray-300 line-clamp-3">
                {movie.Plot !== 'N/A' ? movie.Plot : 'No description available'}
              </p>
              
              {/* Year */}
              <p className="text-xs text-gray-400 mt-3">
                {movie.Year}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
