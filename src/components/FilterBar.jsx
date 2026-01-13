const FilterBar = ({ setGenre, setRating, setYear, genres }) => {
  return (
    <div className="filters">
      <select onChange={(e) => setGenre(e.target.value)}>
        <option value="">Genre</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      <select onChange={(e) => setRating(e.target.value)}>
        <option value="">Rating</option>
        <option value="7">3+</option>
        <option value="7">4+</option>
        <option value="7">5+</option>
        <option value="7">6+</option>
        <option value="7">7+</option>
        <option value="8">8+</option>
      </select>

      <select onChange={(e) => setYear(e.target.value)}>
        <option value="">Year</option>
        {Array.from({ length: 25 }, (_, i) => 2025 - i).map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
