import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import { useTheme } from "../context/ThemeContext";
import { tmdb } from "../api/tmdb";

const Navbar = ({ query, setQuery, onFilterChange, sort, setSort }) => {
  const { theme, toggleTheme } = useTheme();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    tmdb.get("/genre/movie/list").then((res) => {
      setGenres(res.data.genres);
    });
  }, []);

  const handleFilterChange = (type, value) => {
    if (onFilterChange) {
      onFilterChange(type, value);
    }
  };

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="nav-left">
        <button 
          className="logo-btn"
          onClick={handleLogoClick}
          title="Go to Home"
        >
          🎬 MovieDiscover
        </button>
      </div>

      {/* Center to Right: Search, Filters, Wishlist, Settings */}
      <div className="nav-center-right">
        {/* Search Bar */}
        <SearchBar query={query} setQuery={setQuery} />

        {/* Filter Bar */}
        <FilterBar
          setGenre={(val) => handleFilterChange("genre", val)}
          setRating={(val) => handleFilterChange("rating", val)}
          setYear={(val) => handleFilterChange("year", val)}
          genres={genres}
        />

        {/* Sort Dropdown */}
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          className="sort-select"
          title="Sort by"
        >
          <option value="popularity.desc">Popularity</option>
          <option value="vote_average.desc">Rating</option>
          <option value="release_date.desc">Release Date</option>
        </select>

        {/* Wishlist Icon */}
        <button 
          className="wishlist-btn" 
          onClick={handleWishlistClick}
          title="View Wishlist"
        >
          ❤️
        </button>

        {/* Settings Dropdown */}
        <div className="settings-dropdown-container">
          <button
            className="settings-btn"
            onClick={() => setShowThemeDropdown(!showThemeDropdown)}
            title="Settings"
          >
            ⚙️
          </button>
          {showThemeDropdown && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  toggleTheme();
                  setShowThemeDropdown(false);
                }}
              >
                {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
