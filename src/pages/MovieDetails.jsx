import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tmdb } from "../api/tmdb"
import Loader from "../components/Loader";
import TrailerModal from "../components/TrailerModal";
import { useFavorites } from "../context/FavoritesContext";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [watchProviders, setWatchProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState(null);
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { favorites, toggleFavorite } = useFavorites();
  const isFav = favorites.some((m) => m.id === parseInt(id));

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Fetch main movie data
        const movieRes = await tmdb.get(`/movie/${id}`);
        
        // Fetch videos/trailer
        const videoRes = await tmdb.get(`/movie/${id}/videos`);
        const trailerData = videoRes.data.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        
        // Fetch cast
        const creditsRes = await tmdb.get(`/movie/${id}/credits`);
        
        // Fetch watch providers
        const providersRes = await tmdb.get(`/movie/${id}/watch/providers`);
        
        setMovie(movieRes.data);
        setTrailer(trailerData?.key);
        setCast(creditsRes.data.cast.slice(0, 12)); // Top 12 cast members
        setWatchProviders(providersRes.data.results?.US); // US providers
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getBudgetFormatted = (budget) => {
    if (!budget || budget === 0) return "N/A";
    return `$${(budget / 1000000).toFixed(1)}M`;
  };

  const getRevenueFormatted = (revenue) => {
    if (!revenue || revenue === 0) return "N/A";
    return `$${(revenue / 1000000).toFixed(1)}M`;
  };

  if (loading) return <Loader />;

  return (
    <div className="movie-details-container">
      {/* Hero Section */}
      <div className="details-hero">
        <img
          className="backdrop"
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={movie.title}
        />
        <div className="hero-overlay" />
        
        <div className="hero-content">
          <img
            className="poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          
          <div className="hero-info">
            <h1>{movie.title}</h1>
            {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}
            
            <div className="quick-stats">
              <div className="stat">
                <span className="label">Rating</span>
                <span className="value">⭐ {movie.vote_average.toFixed(1)}/10</span>
              </div>
              <div className="stat">
                <span className="label">Duration</span>
                <span className="value">{formatRuntime(movie.runtime)}</span>
              </div>
              <div className="stat">
                <span className="label">Release Date</span>
                <span className="value">{new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="actions">
              {trailer && (
                <button className="btn btn-primary" onClick={() => setShow(true)}>
                  ▶ Watch Trailer
                </button>
              )}
              <button 
                className={`btn btn-secondary ${isFav ? 'active' : ''}`}
                onClick={() => toggleFavorite(movie)}
              >
                {isFav ? "❤️ In Wishlist" : "🤍 Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="details-tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'cast' ? 'active' : ''}`}
            onClick={() => setActiveTab('cast')}
          >
            Cast ({cast.length})
          </button>
          <button 
            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          {watchProviders && (
            <button 
              className={`tab ${activeTab === 'where' ? 'active' : ''}`}
              onClick={() => setActiveTab('where')}
            >
              Where to Watch
            </button>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="section">
              <h2>Plot Summary</h2>
              <p className="overview-text">{movie.overview}</p>
            </div>

            {movie.genres && (
              <div className="section">
                <h2>Genres</h2>
                <div className="genre-tags">
                  {movie.genres.map((g) => (
                    <span key={g.id} className="genre-tag">{g.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cast Tab */}
        {activeTab === 'cast' && (
          <div className="tab-content">
            <div className="cast-grid">
              {cast.length > 0 ? (
                cast.map((member) => (
                  <div key={member.id} className="cast-card">
                    {member.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                        alt={member.name}
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                    <h3>{member.name}</h3>
                    <p className="character">{member.character}</p>
                  </div>
                ))
              ) : (
                <p>No cast information available</p>
              )}
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="tab-content">
            <div className="details-grid">
              <div className="detail-item">
                <h3>Status</h3>
                <p>{movie.status}</p>
              </div>
              <div className="detail-item">
                <h3>Original Language</h3>
                <p>{movie.original_language.toUpperCase()}</p>
              </div>
              <div className="detail-item">
                <h3>Budget</h3>
                <p>{getBudgetFormatted(movie.budget)}</p>
              </div>
              <div className="detail-item">
                <h3>Revenue</h3>
                <p>{getRevenueFormatted(movie.revenue)}</p>
              </div>
              <div className="detail-item">
                <h3>Vote Count</h3>
                <p>{movie.vote_count.toLocaleString()}</p>
              </div>
              <div className="detail-item">
                <h3>Popularity</h3>
                <p>{movie.popularity.toFixed(1)}</p>
              </div>
            </div>

            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="section">
                <h2>Production Companies</h2>
                <div className="companies-list">
                  {movie.production_companies.map((company) => (
                    <div key={company.id} className="company">
                      {company.logo_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                          alt={company.name}
                        />
                      )}
                      <p>{company.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Where to Watch Tab */}
        {watchProviders && activeTab === 'where' && (
          <div className="tab-content">
            <div className="watch-providers">
              {watchProviders.flatrate && (
                <div className="provider-section">
                  <h3>Stream On</h3>
                  <div className="providers-grid">
                    {watchProviders.flatrate.map((provider) => (
                      <div key={provider.provider_id} className="provider-item">
                        {provider.logo_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                            alt={provider.provider_name}
                            title={provider.provider_name}
                          />
                        )}
                        <p>{provider.provider_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {watchProviders.rent && (
                <div className="provider-section">
                  <h3>Rent</h3>
                  <div className="providers-grid">
                    {watchProviders.rent.map((provider) => (
                      <div key={provider.provider_id} className="provider-item">
                        {provider.logo_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                            alt={provider.provider_name}
                            title={provider.provider_name}
                          />
                        )}
                        <p>{provider.provider_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {watchProviders.buy && (
                <div className="provider-section">
                  <h3>Buy</h3>
                  <div className="providers-grid">
                    {watchProviders.buy.map((provider) => (
                      <div key={provider.provider_id} className="provider-item">
                        {provider.logo_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                            alt={provider.provider_name}
                            title={provider.provider_name}
                          />
                        )}
                        <p>{provider.provider_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {show && trailer && <TrailerModal trailerKey={trailer} onClose={() => setShow(false)} />}
    </div>
  );
};

export default MovieDetails;
