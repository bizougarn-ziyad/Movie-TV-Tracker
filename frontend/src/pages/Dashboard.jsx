import { useState, useEffect } from "react";
import MovieCarousel from "../components/MovieCarousel";
import StreamingPlatforms from "../components/StreamingPlatforms";
import MovieCategoriesCarousel from "../components/MovieCategoriesCarousel";
import SignUp from "../components/SignUp";

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const TMDB_API_KEY = "305ceec31bd18c4544e0297ac07b0c82";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch from TMDB");
        }

        const data = await response.json();
        setMovies(data.results || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch movies. Please check your API key.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  /* ✅ Loading Screen */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#071427]">
        <p className="text-white text-2xl font-semibold">
          Loading movies...
        </p>
      </div>
    );
  }

  /* ✅ Error Screen */
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#071427]">
        <p className="text-red-500 text-2xl font-semibold">{error}</p>
      </div>
    );
  }

  return (
    /* ✅ Background uniforme comme Carousel */
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: "#071427" }}
    >
      {/* ✅ SignUp Modal */}
      {showSignUpModal && (
        <SignUp onClose={() => setShowSignUpModal(false)} />
      )}

      {/* ✅ Hero Carousel */}
      <MovieCarousel movies={movies} />

      {/* ✅ Streaming Platforms Row */}
      <StreamingPlatforms />

      {/* ✅ Categories Carousel */}
      <MovieCategoriesCarousel />

      {/* ✅ Movie Grid Section */}
      <div className="px-8 pb-12 pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {movies.map((movie, index) => (
            <div
              key={index}
              className="
                bg-white/5 backdrop-blur-md border border-white/10
                rounded-xl overflow-hidden shadow-lg
                hover:scale-105 transition duration-300
                cursor-pointer
              "
            >
              {/* ✅ Poster */}
              <div className="h-64 overflow-hidden bg-black/20">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Poster
                  </div>
                )}
              </div>

              {/* ✅ Movie Info */}
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2 line-clamp-2">
                  {movie.title}
                </h2>

                <p className="text-sm text-gray-300 mb-2">
                  Rating:{" "}
                  <span className="text-yellow-400 font-semibold">
                    {movie.vote_average
                      ? movie.vote_average.toFixed(1)
                      : "N/A"}{" "}
                    / 10
                  </span>
                </p>

                <p className="text-sm text-gray-400 line-clamp-3">
                  {movie.overview || "No description available"}
                </p>

                <p className="text-xs text-gray-500 mt-3">
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
