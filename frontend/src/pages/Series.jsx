import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import SeriesCarousel from '../components/SeriesCarousel';
import './Series.css';

export default function Series() {
  const [allSeries, setAllSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const TMDB_API_KEY = '305ceec31bd18c4544e0297ac07b0c82';

  const GENRES = [
    { id: 'all', name: 'All Genres' },
    { id: '10759', name: 'Action & Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '18', name: 'Drama' },
    { id: '10751', name: 'Family' },
    { id: '9648', name: 'Mystery' },
    { id: '10765', name: 'Sci-Fi & Fantasy' },
    { id: '10768', name: 'War & Politics' },
  ];

  // Fetch series data from TMDB
  useEffect(() => {
    const fetchAllSeries = async () => {
      try {
        setLoading(true);

        // Fetch multiple categories
        const trendingRes = await fetch(
          `https://api.themoviedb.org/3/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        const topRatedRes = await fetch(
          `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        const dramaRes = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=18&language=en-US&page=1`
        );
        const comedyRes = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=35&language=en-US&page=1`
        );
        const scifiRes = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10765&language=en-US&page=1`
        );

        const [trending, topRated, drama, comedy, scifi] = await Promise.all([
          trendingRes.json(),
          topRatedRes.json(),
          dramaRes.json(),
          comedyRes.json(),
          scifiRes.json(),
        ]);

        const allSeriesData = [
          ...new Map(
            [
              ...trending.results,
              ...topRated.results,
              ...drama.results,
              ...comedy.results,
              ...scifi.results,
            ].map((series) => [series.id, series])
          ).values(),
        ];

        setAllSeries(allSeriesData);
        setFilteredSeries(allSeriesData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch series. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSeries();
  }, []);

  // Filter series based on search, genre, and rating
  useEffect(() => {
    let filtered = allSeries;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((series) =>
        (series.name || series.title)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre (if not 'all')
    if (selectedGenre !== 'all') {
      filtered = filtered.filter((series) =>
        series.genre_ids?.includes(parseInt(selectedGenre))
      );
    }

    // Filter by rating
    filtered = filtered.filter((series) => series.vote_average >= minRating);

    setFilteredSeries(filtered);
  }, [searchQuery, selectedGenre, minRating, allSeries]);

  const handleFavorite = (series) => {
    console.log('Added to favorites:', series.name);
  };

  const handleWatchlist = (series) => {
    console.log('Added to watchlist:', series.name);
  };

  const handleViewDetails = (series) => {
    console.log('View details:', series.name);
  };

  // Get featured series for hero
  const featuredSeries = allSeries[0];

  // Organize series by categories
  const getTrendingSeries = () =>
    allSeries.slice(0, 10);
  const getTopRatedSeries = () =>
    allSeries.slice(10, 20).sort((a, b) => b.vote_average - a.vote_average);
  const getDramaSeries = () =>
    allSeries.filter((s) => s.genre_ids?.includes(18)).slice(0, 10);
  const getComedySeries = () =>
    allSeries.filter((s) => s.genre_ids?.includes(35)).slice(0, 10);
  const getSciFiSeries = () =>
    allSeries.filter((s) => s.genre_ids?.includes(10765)).slice(0, 10);
  const getSuggestedSeries = () =>
    allSeries.slice(20, 30);

  if (loading) {
    return (
      <div className="series-page">
        <div className="series-loading">
          <p className="loading-text">Loading series...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="series-page">
        <div className="series-error">
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="series-page">
      {/* Hero Section */}
      {featuredSeries && (
        <div
          className="series-hero"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${
              featuredSeries.backdrop_path || featuredSeries.poster_path
            })`,
          }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">
              {featuredSeries.name || featuredSeries.title}
            </h1>
            <div className="hero-meta">
              <span className="hero-rating">
                ★ {featuredSeries.vote_average?.toFixed(1) || 'N/A'} / 10
              </span>
              <span className="hero-year">
                {featuredSeries.first_air_date?.split('-')[0]}
              </span>
            </div>
            <p className="hero-description">
              {featuredSeries.overview?.substring(0, 200)}...
            </p>
            <div className="hero-buttons">
              <button
                className="btn btn-primary"
                onClick={() => handleFavorite(featuredSeries)}
              >
                ♥ Add to Favorites
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleWatchlist(featuredSeries)}
              >
                + Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="series-filters-section">
        <div className="filters-wrapper">
          <div className="search-filter">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <button
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="filters-expanded">
            <div className="filter-group">
              <label className="filter-label">Genre</label>
              <div className="genre-grid">
                {GENRES.map((genre) => (
                  <button
                    key={genre.id}
                    className={`genre-option ${
                      selectedGenre === genre.id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedGenre(genre.id)}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Minimum Rating</label>
              <div className="rating-slider-container">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="rating-slider"
                />
                <span className="rating-value">{minRating.toFixed(1)} / 10</span>
              </div>
            </div>

            <button
              className="clear-filters"
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('all');
                setMinRating(0);
                setShowFilters(false);
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Series Display */}
      <div className="series-content">
        {filteredSeries.length > 0 ? (
          <>
            <SeriesCarousel
              title="Trending Now"
              series={getTrendingSeries()}
              onFavorite={handleFavorite}
              onWatchlist={handleWatchlist}
              onViewDetails={handleViewDetails}
            />

            <SeriesCarousel
              title="Top Rated"
              series={getTopRatedSeries()}
              onFavorite={handleFavorite}
              onWatchlist={handleWatchlist}
              onViewDetails={handleViewDetails}
            />

            <SeriesCarousel
              title="Drama Series"
              series={getDramaSeries()}
              onFavorite={handleFavorite}
              onWatchlist={handleWatchlist}
              onViewDetails={handleViewDetails}
            />

            <SeriesCarousel
              title="Comedy Series"
              series={getComedySeries()}
              onFavorite={handleFavorite}
              onWatchlist={handleWatchlist}
              onViewDetails={handleViewDetails}
            />

            <SeriesCarousel
              title="Sci-Fi & Fantasy"
              series={getSciFiSeries()}
              onFavorite={handleFavorite}
              onWatchlist={handleWatchlist}
              onViewDetails={handleViewDetails}
            />

            <SeriesCarousel
              title="Suggested for You"
              series={getSuggestedSeries()}
              onFavorite={handleFavorite}
              onWatchlist={handleWatchlist}
              onViewDetails={handleViewDetails}
              isSuggested={true}
            />
          </>
        ) : (
          <div className="series-no-results">
            <p className="no-results-text">
              No series found matching your filters.
            </p>
            <button
              className="reset-button"
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('all');
                setMinRating(0);
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
