const SortDropdown = ({ setSort }) => {
  return (
    <select onChange={(e) => setSort(e.target.value)}>
      <option value="popularity.desc">Popularity</option>
      <option value="vote_average.desc">Rating</option>
      <option value="release_date.desc">Release Date</option>
    </select>
  );
};

export default SortDropdown;
