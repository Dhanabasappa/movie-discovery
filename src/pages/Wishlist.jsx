import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

const Wishlist = () => {
  const { favorites } = useFavorites();

  return (
    <div className="container">
      <div className="wishlist-header">
        <h1>My Wishlist ❤️</h1>
        <p>{favorites.length} movie{favorites.length !== 1 ? "s" : ""} saved</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-wishlist">
          <h2>Your wishlist is empty</h2>
          <p>Start adding movies to your wishlist!</p>
          <Link to="/" className="back-button">
            ← Back to Movies
          </Link>
        </div>
      ) : (
        <div className="grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
