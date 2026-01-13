import { useEffect, useState } from "react";
import { tmdb } from "../api/tmdb";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import MovieCard from "../components/MovieCard";
import { SkeletonCard } from "../components/Loader";
import useDebounce from "../hooks/useDebounce";
import ErrorState from "../components/ErrorState";

const Home = ({ query = "", filters = {}, sort = "popularity.desc" }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [rating, setRating] = useState(filters.rating || "");
  const [year, setYear] = useState(filters.year || "");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(filters.genre || "");
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    tmdb.get("/genre/movie/list").then((res) => {
      setGenres(res.data.genres);
    });
  }, []);

  useEffect(() => {
    setRating(filters.rating || "");
    setYear(filters.year || "");
    setSelectedGenre(filters.genre || "");
    setPage(1);
  }, [filters]);

  useEffect(() => {
    // Reset page when search query changes
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Only show full loading for initial page load (page 1, no existing movies)
        if (page === 1 && movies.length === 0) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        let params = {
          page,
        };

        let endpoint = "";

        if (debouncedQuery.trim()) {
          // Search endpoint - use query parameter
          endpoint = "/search/movie";
          params.query = debouncedQuery;
        } else {
          // Discover endpoint - use all filters
          endpoint = "/discover/movie";
          params.sort_by = sort;
          if (selectedGenre) params.with_genres = selectedGenre;
          if (rating) params["vote_average.gte"] = rating;
          if (year) params.primary_release_year = year;
        }

        const res = await tmdb.get(endpoint, { params });

        setMovies((prev) => 
          page === 1 ? res.data.results : [...prev, ...res.data.results]
        );
        
        setLoading(false);
        setIsLoadingMore(false);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError(true);
        setLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchMovies();
  }, [debouncedQuery, selectedGenre, rating, year, sort, page]);

  useInfiniteScroll(() => setPage((p) => p + 1));

  return (
    <div className="container">
      {error && <ErrorState message="Failed to load movies." />}

      {/* Loading indicator for search/filter changes */}
      {loading && movies.length > 0 && (
        <div className="search-loading-bar">
          <div className="loading-progress"></div>
        </div>
      )}

      {loading && movies.length === 0 ? (
        <div className="grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          {isLoadingMore && (
            <div className="loading-more">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} />
              ))}
            </div>
          )}
        </>
      )}

      <div id="scroll-trigger" />
    </div>
  );
};

export default Home;
