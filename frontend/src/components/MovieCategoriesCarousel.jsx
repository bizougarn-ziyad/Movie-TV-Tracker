import { useEffect, useRef, useState } from "react";

const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  14: "Fantasy",
  27: "Horror",
  10749: "Romance",
  878: "Sci-Fi",
};

const TMDB_BEARER_TOKEN =
  import.meta.env.VITE_TMDB_BEARER_TOKEN || "YOUR_TOKEN_HERE";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const CATEGORIES = [
  {
    id: "just-released",
    title: "Just Released",
    sortBy: "release_date.desc",
  },
  {
    id: "top-this-week",
    title: "Top This Week",
    sortBy: "popularity.desc",
  },
  {
    id: "all-time-favorite",
    title: "All Time Favorite (Top 10)",
    sortBy: "vote_average.desc",
    filterParams: { "vote_count.gte": 1000 },
  },
];

export default function MovieCategoriesCarousel() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const carouselRefs = useRef({});

  // ✅ Get genre name
  const getGenre = (ids) =>
    ids?.length > 0 ? GENRE_MAP[ids[0]] || "Movie" : "Movie";

  // ✅ Resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Fetch Movies
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const fetched = await Promise.all(
          CATEGORIES.map(async (cat) => {
            const params = new URLSearchParams({
              sort_by: cat.sortBy,
              page: 1,
              ...cat.filterParams,
            });

            const res = await fetch(
              `${TMDB_BASE_URL}/discover/movie?${params}`,
              {
                headers: {
                  Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
                },
              }
            );

            const data = await res.json();

            return {
              ...cat,
              movies: (data.results || []).filter((m) => m.poster_path),
            };
          })
        );

        setCategories(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ✅ Scroll arrows
  const scrollCarousel = (id, dir) => {
    const container = carouselRefs.current[id];
    if (!container) return;

    container.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex justify-center items-center"
        style={{ backgroundColor: "#071427" }}
      >
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#071427" }}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; }

        /* ✅ Netflix Big Number */
        .rank {
          font-size: 90px;
          font-weight: 900;
          color: white;
          opacity: 0.9;
          margin-right: 15px;
          line-height: 1;
        }
      `}</style>

      {categories.map((category) => (
        <section
          key={category.id}
          className="max-w-6xl mx-auto px-6 py-12"
        >
          <h2 className="text-2xl text-white font-bold mb-6">
            {category.title}
          </h2>

          <div className="relative">
            {/* ✅ Carousel */}
            <div
              ref={(el) => {
                if (el) carouselRefs.current[category.id] = el;
              }}
              className="hide-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-4"
            >
              {category.movies.map((movie, index) =>
                category.id === "all-time-favorite" ? (
                  /* ✅ TOP10 STYLE */
                  <div
                    key={movie.id}
                    className="flex items-center flex-shrink-0"
                    style={{
                      width: isMobile ? "240px" : "320px",
                    }}
                  >
                    {/* Number */}
                    <div className="rank">{index + 1}</div>

                    {/* Poster */}
                    <img
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      className="w-[110px] h-[160px] object-cover rounded-lg"
                    />

                    {/* Info Right */}
                    <div className="ml-3 text-white text-sm">
                      <p className="font-semibold">{movie.title}</p>
                      <p className="text-yellow-400">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </p>
                      <p className="text-gray-300">{getGenre(movie.genre_ids)}</p>
                    </div>
                  </div>
                ) : (
                  /* ✅ NORMAL STYLE */
                  <div
                    key={movie.id}
                    className="relative flex-shrink-0"
                    style={{
                      width: isMobile ? "140px" : "200px",
                    }}
                  >
                    <img
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-[280px] object-cover rounded-xl"
                    />

                    {/* ✅ Overlay Details */}
                    <div className="mt-2 text-white text-sm">
                      <p className="font-semibold truncate">{movie.title}</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-yellow-400">
                          ⭐ {movie.vote_average.toFixed(1)}
                        </span>
                        <span className="text-gray-400">
                          {getGenre(movie.genre_ids)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* ✅ Arrows */}
            {!isMobile && (
              <>
                <button
                  onClick={() => scrollCarousel(category.id, "left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full"
                >
                  ◀
                </button>
                <button
                  onClick={() => scrollCarousel(category.id, "right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full"
                >
                  ▶
                </button>
              </>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
