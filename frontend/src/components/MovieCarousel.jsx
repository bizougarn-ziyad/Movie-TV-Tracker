import { useState, useEffect, useRef } from 'react';
import './MovieCarousel.css';

export default function MovieCarousel({ movies }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZmJiMWFlYmE5MDc3MGM3YzUyNzI2Njg1NDU1ZTA3MCIsIm5iZiI6MTc1ODc0NDU5OC40NDk5OTk5LCJzdWIiOiI2OGQ0NTAxNjNjN2M1NmQ5MTBlNzIyZTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Wyls449PmYczveDSVO_VwR32d9vwjO-InApFO2c2B6k';

  const displayMovies = movies.slice(0, 10);

  // Function to start the auto-advance timer
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayMovies.length);
    }, 5000);
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (displayMovies.length === 0) return;

    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [displayMovies.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    // Restart the timer when a dot is clicked
    startTimer();
  };

  if (displayMovies.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-placeholder">Loading movies...</div>
      </div>
    );
  }

  const currentMovie = displayMovies[currentIndex];
  
  // Use backdrop image from TMDB
  const backgroundImage = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`;

  return (
    <div className="carousel-container">
      {/* Carousel Slide */}
      <div
        className="carousel-slide"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {/* Dark Gradient Overlay */}
        <div className="carousel-overlay"></div>

        {/* Content Overlay */}
        <div className="carousel-content">
          {/* Title */}
          <h1 className="carousel-title">{currentMovie.title || currentMovie.original_title}</h1>

          {/* Rating */}
          <div className="carousel-rating">
            ⭐ {currentMovie.vote_average?.toFixed(1) || 'N/A'} / 10
          </div>

          {/* Description */}
          <p className="carousel-description">
            {currentMovie.overview || 'No description available'}
          </p>

          {/* Buttons */}
          <div className="carousel-buttons">
            <button className="btn btn-watch-now">Watch Now</button>
            <button className="btn btn-watch-later">Add to Watch Later</button>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="carousel-dots">
        {displayMovies.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to movie ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
