import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SeriesCard from './SeriesCard';
import './SeriesCarousel.css';

export default function SeriesCarousel({
  title,
  series,
  onFavorite,
  onWatchlist,
  onViewDetails,
  isSuggested = false,
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 500);
    }
  };

  if (!series || series.length === 0) {
    return null;
  }

  return (
    <div className="series-carousel-section">
      <div className="series-carousel-header">
        <div className="series-carousel-title-container">
          <h2 className="series-carousel-title">{title}</h2>
          {isSuggested && <span className="suggested-badge">Suggested for You</span>}
        </div>
      </div>

      <div className="series-carousel-container">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            className="carousel-nav-button left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="series-carousel-scroll"
          onScroll={checkScroll}
        >
          {series.map((s) => (
            <div key={s.id} className="series-carousel-item">
              <SeriesCard
                series={s}
                onFavorite={onFavorite}
                onWatchlist={onWatchlist}
                onViewDetails={onViewDetails}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            className="carousel-nav-button right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
