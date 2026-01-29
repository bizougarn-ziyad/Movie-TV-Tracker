import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SearchResults() {
  const [movies, setMovies] = useState([]);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;

  useEffect(() => {
    if (!query) return;

    const fetchMovies = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setMovies(data.results);
    };

    fetchMovies();
  }, [query]);

  return (
    <div
      className="
      min-h-screen text-white pt-28 px-6
      bg-gradient-to-b from-[#0a1220] via-[#091a2f] to-[#050b14]
      "
    >
      {/* ✅ Centered container */}
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-xl font-semibold mb-8 text-gray-200">
          Showing results for{" "}
          <span className="text-cyan-400 font-bold">"{query}"</span>
        </h1>

        {/* Movie List */}
        <div className="space-y-6">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div
                key={movie.id}
                className="flex gap-5 border-b border-gray-700/40 pb-6"
              >
                {/* Poster */}
                <div className="w-[90px] flex-shrink-0">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="rounded-md shadow-md"
                    />
                  ) : (
                    <div className="w-[90px] h-[130px] bg-gray-800 flex items-center justify-center text-gray-500 text-sm rounded-md">
                      No Image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">
                    {movie.title}{" "}
                    <span className="text-gray-400 text-sm font-normal">
                      ({movie.release_date?.slice(0, 4) || "N/A"})
                    </span>
                  </h2>

                  <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                    {movie.overview || "No description available."}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
