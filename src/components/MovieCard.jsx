import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";

const MovieCard = ({ movie }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const isFav = favorites.some((m) => m.id === movie.id);

  return (
    <motion.div whileHover={{ scale: 1.05 }} className="movie-card">
      <Link to={`/movie/${movie.id}`}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <h3>{movie.title}</h3>
        <p>⭐ {movie.vote_average.toFixed(1)}</p>
      </Link>
      <button 
        className="wishlist-icon"
        onClick={() => toggleFavorite(movie)}
        title={isFav ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {isFav ? "❤️" : "🤍"}
      </button>
    </motion.div>
  );
};

export default MovieCard;


