const SearchBar = ({ query, setQuery }) => {
  return (
    <input
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="search"
    />
  );
};

export default SearchBar;
