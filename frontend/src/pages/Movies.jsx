import { useEffect, useState, useRef } from "react";
import "./Movies.css";
import MovieCarousel from "../components/MovieCarousel";

const TMDB_API_KEY = "305ceec31bd18c4544e0297ac07b0c82";

const buildImageUrl = (path, size = "w500") => {
  const BASE_ORIGINAL = "https://image.tmdb.org/t/p/original";
  const BASE_W500 = "https://image.tmdb.org/t/p/w500";
  if (!path) return "";
  return size === "original" ? `${BASE_ORIGINAL}${path}` : `${BASE_W500}${path}`;
};

export default function Movies() {
  const [sections, setSections] = useState({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
  });
  const [genres, setGenres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const carouselRefs = {
    trending: useRef(null),
    popular: useRef(null),
    topRated: useRef(null),
    upcoming: useRef(null),
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendingRes, popularRes, topRatedRes, upcomingRes, genresRes] =
          await Promise.all([
            fetch(
              `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`
            ),
            fetch(
              `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
            ),
          ]);

        const [trending, popular, topRated, upcoming, genresData] =
          await Promise.all([
            trendingRes.json(),
            popularRes.json(),
            topRatedRes.json(),
            upcomingRes.json(),
            genresRes.json(),
          ]);

        setSections({
          trending: trending.results || [],
          popular: popular.results || [],
          topRated: topRated.results || [],
          upcoming: upcoming.results || [],
        });

        setGenres(genresData.genres || []);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (!selectedMovie) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedMovie(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedMovie]);

  const getGenreNames = (movie) => {
    if (!movie?.genre_ids || genres.length === 0) return [];
    const lookup = new Map(genres.map((genre) => [genre.id, genre.name]));
    return movie.genre_ids
      .map((id) => lookup.get(id))
      .filter(Boolean);
  };

  const handleScroll = (sectionKey, direction) => {
    const carousel = carouselRefs[sectionKey]?.current;
    if (!carousel) return;

    const cardWidth = 200;
    const gap = 16;
    const scrollAmount = cardWidth + gap;
    
    const currentScroll = carousel.scrollLeft;
    const newPosition =
      direction === "left"
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;

    carousel.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  const MovieSection = ({ title, sectionKey, movies }) => (
    <div className="movies-section">
      <div className="movies-section-header">
        <h2 className="movies-section-title">{title}</h2>
      </div>
      <div className="movies-carousel-wrapper">
        <button
          className="carousel-button carousel-button-left"
          onClick={() => handleScroll(sectionKey, "left")}
          aria-label={`Scroll ${title} left`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <div
          className="movies-carousel"
          ref={carouselRefs[sectionKey]}
        >
          {movies.map((movie) => (
            <button
              key={movie.id}
              className="movie-item"
              onClick={() => setSelectedMovie(movie)}
            >
              <div className="movie-item-image">
                {movie.poster_path ? (
                  <img src={buildImageUrl(movie.poster_path)} alt={movie.title} />
                ) : (
                  <div className="movie-item-placeholder">No image</div>
                )}
              </div>
              <div className="movie-item-title">
                {movie.title || movie.original_title}
              </div>
              <div className="movie-item-rating">
                ★ {movie.vote_average?.toFixed(1) || "N/A"}
              </div>
            </button>
          ))}
        </div>

        <button
          className="carousel-button carousel-button-right"
          onClick={() => handleScroll(sectionKey, "right")}
          aria-label={`Scroll ${title} right`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="movies-page" style={{ backgroundColor: "#071427" }}>
      <MovieCarousel />
      <MovieSection title="Trending" sectionKey="trending" movies={sections.trending} />
      <MovieSection title="Popular" sectionKey="popular" movies={sections.popular} />
      <MovieSection title="Top Rated" sectionKey="topRated" movies={sections.topRated} />
      <MovieSection title="Upcoming" sectionKey="upcoming" movies={sections.upcoming} />

      {selectedMovie && (
        <div
          className="movie-modal-overlay"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="movie-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="movie-modal-close"
              onClick={() => setSelectedMovie(null)}
            >
              ×
            </button>
            <div className="movie-modal-body">
              <div className="movie-modal-poster">
                {selectedMovie.poster_path ? (
                  <img
                    src={buildImageUrl(selectedMovie.poster_path)}
                    alt={selectedMovie.title}
                  />
                ) : (
                  <div className="movie-modal-fallback">No image</div>
                )}
              </div>
              <div className="movie-modal-content">
                <h3>{selectedMovie.title || selectedMovie.original_title}</h3>
                <div className="movie-modal-meta">
                  <span>★ {selectedMovie.vote_average?.toFixed(1) || "N/A"}</span>
                  <span>
                    {selectedMovie.release_date
                      ? new Date(selectedMovie.release_date).getFullYear()
                      : ""}
                  </span>
                </div>
                <p>{selectedMovie.overview || "No overview available."}</p>
                <div className="movie-modal-genres">
                  {getGenreNames(selectedMovie).map((genre) => (
                    <span key={genre}>{genre}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
